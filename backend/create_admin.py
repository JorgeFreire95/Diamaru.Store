from sqlalchemy.orm import Session
from app.models.admin import Admin
from app.security import hash_password
from database import SessionLocal


def create_default_admin():
    """Crear admin predeterminado"""
    db = SessionLocal()
    
    # Verificar si ya existe un admin
    existing_admin = db.query(Admin).filter(Admin.username == "admin").first()
    if existing_admin:
        print("✓ Admin predeterminado ya existe")
        db.close()
        return
    
    # Crear admin
    default_admin = Admin(
        username="admin",
        email="admin@diamaru.store",
        hashed_password=hash_password("admin123"),  # Cambiar en producción
        is_active=True
    )
    
    db.add(default_admin)
    db.commit()
    db.refresh(default_admin)
    
    print("✓ Admin predeterminado creado")
    print(f"  Username: admin")
    print(f"  Password: admin123")
    print("  ⚠️  CAMBIA LA CONTRASEÑA EN PRODUCCIÓN")
    
    db.close()


if __name__ == "__main__":
    create_default_admin()
