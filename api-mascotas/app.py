from pathlib import Path
import sqlite3
from flask import Flask, jsonify, request, send_from_directory

app = Flask(__name__)
DATABASE = Path(__file__).with_name("inventario.db")


@app.get("/")
def dashboard():
    return send_from_directory(Path(__file__).parent, "dashboard.html")


@app.get("/dashboard.js")
def dashboard_script():
    return send_from_directory(Path(__file__).parent, "dashboard.js")


def get_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def init_database():
    with get_connection() as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS productos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                categoria TEXT NOT NULL,
                precio REAL NOT NULL CHECK (precio >= 0),
                stock INTEGER NOT NULL CHECK (stock >= 0)
            )
        """)


def row_to_dict(row):
    product = dict(row)
    product["estado"] = "disponible" if product["stock"] > 0 else "agotado"
    return product


@app.get("/api/productos")
def list_products():
    category = request.args.get("categoria")
    query = "SELECT * FROM productos"
    parameters = []
    if category:
        query += " WHERE categoria = ?"
        parameters.append(category)
    query += " ORDER BY id DESC"
    with get_connection() as connection:
        products = connection.execute(query, parameters).fetchall()
    return jsonify([row_to_dict(product) for product in products])


@app.get("/api/productos/<int:product_id>")
def get_product(product_id):
    with get_connection() as connection:
        product = connection.execute("SELECT * FROM productos WHERE id = ?", (product_id,)).fetchone()
    if product is None:
        return jsonify({"error": "Producto no encontrado"}), 404
    return jsonify(row_to_dict(product))


@app.get("/api/productos/stock-bajo")
def low_stock_products():
    with get_connection() as connection:
        products = connection.execute("SELECT * FROM productos WHERE stock <= 5 ORDER BY stock ASC").fetchall()
    return jsonify([row_to_dict(product) for product in products])


@app.post("/api/productos")
def create_product():
    data = request.get_json(silent=True) or {}
    required_fields = ("nombre", "categoria", "precio", "stock")
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({"error": f"Faltan campos: {', '.join(missing_fields)}"}), 400
    try:
        price = float(data["precio"])
        stock = int(data["stock"])
    except (TypeError, ValueError):
        return jsonify({"error": "Precio y stock deben ser números válidos"}), 400
    if price < 0 or stock < 0:
        return jsonify({"error": "Precio y stock no pueden ser negativos"}), 400
    with get_connection() as connection:
        cursor = connection.execute("INSERT INTO productos (nombre, categoria, precio, stock) VALUES (?, ?, ?, ?)", (data["nombre"].strip(), data["categoria"].strip(), price, stock))
        product = connection.execute("SELECT * FROM productos WHERE id = ?", (cursor.lastrowid,)).fetchone()
    return jsonify(row_to_dict(product)), 201


@app.put("/api/productos/<int:product_id>")
def update_product(product_id):
    data = request.get_json(silent=True) or {}
    fields = {key: data[key] for key in ("nombre", "categoria", "precio", "stock") if key in data}
    if not fields:
        return jsonify({"error": "No hay datos para actualizar"}), 400
    try:
        if "precio" in fields:
            fields["precio"] = float(fields["precio"])
        if "stock" in fields:
            fields["stock"] = int(fields["stock"])
    except (TypeError, ValueError):
        return jsonify({"error": "Precio y stock deben ser números válidos"}), 400
    if any(fields[key] < 0 for key in ("precio", "stock") if key in fields):
        return jsonify({"error": "Precio y stock no pueden ser negativos"}), 400
    assignments = ", ".join(f"{field} = ?" for field in fields)
    with get_connection() as connection:
        cursor = connection.execute(f"UPDATE productos SET {assignments} WHERE id = ?", list(fields.values()) + [product_id])
    if cursor.rowcount == 0:
        return jsonify({"error": "Producto no encontrado"}), 404
    return get_product(product_id)


@app.delete("/api/productos/<int:product_id>")
def delete_product(product_id):
    with get_connection() as connection:
        cursor = connection.execute("DELETE FROM productos WHERE id = ?", (product_id,))
    if cursor.rowcount == 0:
        return jsonify({"error": "Producto no encontrado"}), 404
    return jsonify({"mensaje": "Producto eliminado"})


init_database()

if __name__ == "__main__":
    app.run(debug=True)
