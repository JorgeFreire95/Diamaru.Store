from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class AdminLogin(BaseModel):
    username: str
    password: str


class AdminCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class AdminResponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    username: str


class ProductUpdate(BaseModel):
    title: Optional[str] = Field(None, alias="title")
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = Field(None, alias="category")
    image_url: Optional[str] = None
    file_url: Optional[str] = None

    class Config:
        populate_by_name = True

    def dict(self, **kwargs):
        data = super().dict(**kwargs)
        # Mapear campos del frontend al backend
        if 'title' in data and data['title'] is not None:
            data['name'] = data.pop('title')
        if 'category' in data and data['category'] is not None:
            data['type'] = data.pop('category')
        # Eliminar None values
        data = {k: v for k, v in data.items() if v is not None}
        return data
