# Sistema de inventario

API REST sencilla para registrar productos y controlar existencias. Construida con Python, Flask y SQLite.

## Qué demuestra

- CRUD completo: crear, consultar, actualizar y eliminar productos.
- SQL con `SELECT`, `INSERT`, `UPDATE`, `DELETE` y filtros `WHERE`.
- Validación de precio y stock.
- Consulta de productos con stock bajo.
- Base de datos local sin configuración adicional.

## Ejecutar

```bash
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
python app.py
```

La API queda disponible en `http://127.0.0.1:5000`.

## Rutas

- `GET /api/productos`
- `GET /api/productos?categoria=Accesorios`
- `GET /api/productos/stock-bajo`
- `GET /api/productos/<id>`
- `POST /api/productos`
- `PUT /api/productos/<id>`
- `DELETE /api/productos/<id>`

Ejemplo para crear un producto:

```json
{
  "nombre": "Teclado",
  "categoria": "Accesorios",
  "precio": 25.5,
  "stock": 10
}
```
