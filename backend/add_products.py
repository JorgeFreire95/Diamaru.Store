"""
Script de ejemplo para agregar más productos a la base de datos
Uso: python add_products.py
"""

from sqlalchemy.orm import Session
from app.models.product import Product, ProductType
from database import SessionLocal


def add_custom_products():
    """Agrega productos personalizados a la base de datos"""
    
    db = SessionLocal()
    
    new_products = [
        Product(
            name="Noche Estrellada",
            description="Reproducción de obra maestra del arte moderno",
            price=299.99,
            type=ProductType.painting,
            details="Lienzo 80x100cm - Técnica mixta con efectos especiales"
        ),
        Product(
            name="React Pro Guide",
            description="Guía avanzada para desarrolladores React",
            price=49.99,
            type=ProductType.book,
            details="450 páginas - Ejemplos prácticos incluidos"
        ),
        Product(
            name="Perspectiva Urbana",
            description="Cuadro abstracto con elementos urbanos",
            price=229.99,
            type=ProductType.painting,
            details="Lienzo 60x60cm - Acrílico sobre lienzo"
        ),
    ]
    
    try:
        db.add_all(new_products)
        db.commit()
        print(f"✓ Se agregaron {len(new_products)} productos exitosamente")
    except Exception as e:
        db.rollback()
        print(f"✗ Error al agregar productos: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    add_custom_products()
