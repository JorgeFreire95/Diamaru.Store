from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from app.models.product import Order
from app.schemas import OrderCreate, Order as OrderSchema
import json

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("/", response_model=OrderSchema)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    customer = order.customer
    items_json = [item.dict() for item in order.items]

    db_order = Order(
        customer_name=f"{customer.firstName} {customer.lastName}",
        customer_email=customer.email,
        customer_phone=customer.phone,
        customer_address=f"{customer.address}, {customer.city}, {customer.zipCode}",
        items=items_json,
        total=order.total,
        status="completed"
    )

    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order


@router.get("/{order_id}", response_model=OrderSchema)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.get("/", response_model=list[OrderSchema])
def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()
