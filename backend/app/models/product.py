from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from sqlalchemy.dialects.sqlite import JSON
from datetime import datetime
from database import Base
import enum


class ProductType(str, enum.Enum):
    painting = "painting"
    book = "book"


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    type = Column(Enum(ProductType), default=ProductType.book)
    details = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    file_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String)
    customer_email = Column(String)
    customer_phone = Column(String)
    customer_address = Column(String)
    items = Column(JSON)
    total = Column(Float)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
