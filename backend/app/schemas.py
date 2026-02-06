from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    type: str
    details: Optional[str] = None
    image_url: Optional[str] = None


class ProductCreate(BaseModel):
    title: str = Field(..., alias="title")
    description: str
    price: float
    category: str = Field(..., alias="category")
    image_url: Optional[str] = None
    file_url: Optional[str] = None

    class Config:
        populate_by_name = True

    def dict(self, **kwargs):
        data = super().dict(**kwargs)
        # Mapear campos del frontend al backend
        if 'title' in data:
            data['name'] = data.pop('title')
        if 'category' in data:
            data['type'] = data.pop('category')
        return data


class Product(ProductBase):
    id: int
    file_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class OrderItemSchema(BaseModel):
    id: int
    name: str
    price: float
    quantity: int
    type: str


class CustomerSchema(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str
    address: str
    city: str
    zipCode: str


class OrderCreate(BaseModel):
    customer: CustomerSchema
    items: List[OrderItemSchema]
    total: float


class Order(BaseModel):
    id: int
    customer_name: str
    customer_email: str
    total: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
