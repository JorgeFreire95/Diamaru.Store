#!/usr/bin/env python
import requests
import json

# Credenciales del admin
ADMIN_USER = "admin"
ADMIN_PASS = "admin123"
API_URL = "http://localhost:8000"

# 1. Login para obtener token
print("🔐 Autenticando admin...")
login_response = requests.post(
    f"{API_URL}/auth/admin/login",
    json={"username": ADMIN_USER, "password": ADMIN_PASS}
)
token = login_response.json()["access_token"]
print(f"✅ Token obtenido: {token[:20]}...")

# Headers para solicitudes autenticadas
headers = {"Authorization": f"Bearer {token}"}

# 2. Crear 2 cuadros
print("\n🖼️  Creando cuadros...")

cuadro1 = {
    "title": "La Persistencia de la Memoria",
    "description": "Una obra maestra del surrealismo que explora la naturaleza fluida del tiempo.",
    "price": 899.99,
    "type": "painting",
    "image_url": "https://images.unsplash.com/photo-1578926078328-123b43e91ba3?w=500"
}

cuadro2 = {
    "title": "Noche Estrellada",
    "description": "Una pintura icónica que captura la belleza del cielo nocturno con remolinos de color.",
    "price": 1299.99,
    "type": "painting",
    "image_url": "https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=500"
}

r1 = requests.post(f"{API_URL}/admin/products", json=cuadro1, headers=headers)
r2 = requests.post(f"{API_URL}/admin/products", json=cuadro2, headers=headers)

if r1.status_code == 200:
    print(f"✅ Cuadro 1 creado: {r1.json()['title']}")
if r2.status_code == 200:
    print(f"✅ Cuadro 2 creado: {r2.json()['title']}")

# 3. Crear 2 libros
print("\n📚 Creando libros...")

libro1 = {
    "title": "El Arte Moderno Explicado",
    "description": "Guía completa sobre los movimientos artísticos del siglo XX y su impacto en el mundo.",
    "price": 29.99,
    "type": "book",
    "image_url": "https://images.unsplash.com/photo-150784272343-583f20270319?w=500",
    "file_url": "https://example.com/arte-moderno.pdf"
}

libro2 = {
    "title": "Técnicas de Pintura al Óleo",
    "description": "Manual práctico con ejercicios paso a paso para dominar la técnica del óleo.",
    "price": 39.99,
    "type": "book",
    "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3af564d7?w=500",
    "file_url": "https://example.com/tecnicas-oleo.pdf"
}

r3 = requests.post(f"{API_URL}/admin/products", json=libro1, headers=headers)
r4 = requests.post(f"{API_URL}/admin/products", json=libro2, headers=headers)

if r3.status_code == 200:
    print(f"✅ Libro 1 creado: {r3.json()['title']}")
if r4.status_code == 200:
    print(f"✅ Libro 2 creado: {r4.json()['title']}")

print("\n✨ 4 productos creados exitosamente!")
