from sqlalchemy.orm import Session
from app.models.product import Product, ProductType
from database import SessionLocal


def seed_products():
    db = SessionLocal()
    
    # Verificar si ya existen productos
    if db.query(Product).count() > 0:
        print("Los productos ya existen en la base de datos")
        return

    products = [
        # Cuadros
        Product(
            name="Abstracto Violeta",
            description="Hermoso cuadro abstracto con tonos violeta y dorado",
            price=199.99,
            type=ProductType.painting,
            details="Lienzo de 50x70cm - Técnica mixta"
        ),
        Product(
            name="Paisaje Moderno",
            description="Representación moderna de un paisaje natural",
            price=249.99,
            type=ProductType.painting,
            details="Lienzo de 60x80cm - Acrílico"
        ),
        Product(
            name="Flores del Campo",
            description="Composición de flores silvestres con colores vibrantes",
            price=179.99,
            type=ProductType.painting,
            details="Lienzo de 40x50cm - Óleo"
        ),
        
        # Libros PDF
        Product(
            name="Introducción a Python",
            description="Guía completa para aprender Python desde cero",
            price=29.99,
            type=ProductType.book,
            details="250 páginas - PDF interactivo"
        ),
        Product(
            name="Diseño Web Moderno",
            description="Todo lo que necesitas saber sobre diseño web contemporáneo",
            price=39.99,
            type=ProductType.book,
            details="300 páginas - PDF con ejemplos"
        ),
        Product(
            name="Historia del Arte",
            description="Recorrido por los principales movimientos artísticos",
            price=34.99,
            type=ProductType.book,
            details="400 páginas - PDF ilustrado"
        ),
        Product(
            name="Fotografía Digital",
            description="Técnicas y consejos para mejorar tu fotografía digital",
            price=44.99,
            type=ProductType.book,
            details="320 páginas - PDF con galería"
        ),
    ]

    db.add_all(products)
    db.commit()
    print(f"✓ Se agregaron {len(products)} productos a la base de datos")


if __name__ == "__main__":
    seed_products()
