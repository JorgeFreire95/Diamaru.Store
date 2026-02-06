from fastapi import APIRouter, Depends, HTTPException, status, Query, Header, File, UploadFile
from sqlalchemy.orm import Session
from database import get_db
from app.models.product import Product, ProductType
from app.models.admin import Admin
from app.schemas import Product as ProductSchema, ProductCreate
from app.schemas_admin import ProductUpdate
from app.security import get_current_admin
import os
import shutil
from pathlib import Path

router = APIRouter(prefix="/admin", tags=["admin"])

# Carpeta para guardar las imágenes
UPLOAD_DIR = Path("backend/uploads/products")
# Carpeta para guardar los PDFs
UPLOAD_BOOKS_DIR = Path("backend/uploads/books")


# Dependency para obtener el admin actual
async def verify_admin(authorization: str = Header(None), db: Session = Depends(get_db)):
    """Verificar que el usuario es admin"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No authorization header"
        )
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme"
            )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header"
        )
    
    return await get_current_admin(token, db)


@router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    current_admin: Admin = Depends(verify_admin)
):
    """Subir imagen de producto"""
    
    # Validar que sea imagen
    allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
    file_extension = Path(file.filename).suffix.lower()
    
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Solo se permiten: {', '.join(allowed_extensions)}"
        )
    
    # Crear nombre único
    import uuid
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    try:
        # Guardar archivo
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Retornar ruta relativa
        return {
            "url": f"/uploads/products/{unique_filename}",
            "filename": unique_filename
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al guardar imagen: {str(e)}")


@router.post("/upload-book")
async def upload_book(
    file: UploadFile = File(...),
    current_admin: Admin = Depends(verify_admin)
):
    """Subir PDF del libro"""
    
    # Validar que sea PDF
    if file.content_type != "application/pdf" and not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Solo se permiten archivos PDF"
        )
    
    # Validar tamaño (máx 50MB para PDFs)
    file_size = 0
    max_size = 50 * 1024 * 1024  # 50MB
    
    # Crear nombre único
    import uuid
    unique_filename = f"{uuid.uuid4()}.pdf"
    file_path = UPLOAD_BOOKS_DIR / unique_filename
    
    try:
        # Guardar archivo
        with open(file_path, "wb") as buffer:
            while True:
                chunk = await file.read(1024 * 1024)  # 1MB chunks
                if not chunk:
                    break
                file_size += len(chunk)
                if file_size > max_size:
                    file_path.unlink()  # Eliminar archivo parcial
                    raise HTTPException(
                        status_code=413,
                        detail="Archivo demasiado grande (máximo 50MB)"
                    )
                buffer.write(chunk)
        
        # Retornar ruta relativa
        return {
            "url": f"/uploads/books/{unique_filename}",
            "filename": unique_filename
        }
    except Exception as e:
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=f"Error al guardar PDF: {str(e)}")


@router.get("/products", response_model=list[ProductSchema])
async def get_all_products(
    current_admin: Admin = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    """Obtener todos los productos (solo admin)"""
    return db.query(Product).all()


@router.post("/products", response_model=ProductSchema)
async def create_product(
    product: ProductCreate,
    current_admin: Admin = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    """Crear nuevo producto (solo admin)"""
    
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    return db_product


@router.put("/products/{product_id}", response_model=ProductSchema)
async def update_product(
    product_id: int,
    product_update: ProductUpdate,
    current_admin: Admin = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    """Actualizar producto (solo admin)"""
    
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for field, value in product_update.dict(exclude_unset=True).items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
    
    return db_product


@router.delete("/products/{product_id}")
async def delete_product(
    product_id: int,
    current_admin: Admin = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    """Eliminar producto (solo admin)"""
    
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(db_product)
    db.commit()
    
    return {"message": "Product deleted successfully"}


@router.get("/stats")
async def get_admin_stats(
    current_admin: Admin = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    """Obtener estadísticas del sitio"""
    
    total_products = db.query(Product).count()
    total_paintings = db.query(Product).filter(Product.type == "painting").count()
    total_books = db.query(Product).filter(Product.type == "book").count()
    
    return {
        "total_products": total_products,
        "total_paintings": total_paintings,
        "total_books": total_books,
        "admin_username": current_admin.username
    }
