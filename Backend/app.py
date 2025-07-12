# filepath: c:\Users\lotiy\Desktop\projects\Rewear\ReWear\Backend\app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, JWTManager
import uuid

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this in production!
jwt = JWTManager(app)

# Fake in-memory DB
users = []
items = []

# 📝 Helper to find user
def find_user(email):
    return next((u for u in users if u["email"] == email), None)

# 🔐 Signup
@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    if find_user(data["email"]):
        return jsonify({"error": "User already exists"}), 400
    new_user = {
        "email": data["email"],
        "password": data["password"],
        "id": str(uuid.uuid4()),
        "points": 100
    }
    users.append(new_user)
    access_token = create_access_token(identity=new_user['id']) # changed
    return jsonify({"message": "User created", "user": new_user, "access_token": access_token}) # changed

# 🔐 Login
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    user = find_user(data["email"])
    if not user or user["password"] != data["password"]:
        return jsonify({"error": "Invalid credentials"}), 401
    access_token = create_access_token(identity=user['id']) # changed
    return jsonify({"message": "Login successful", "user": user, "access_token": access_token}) # changed

# 📦 Add item
@app.route("/api/items", methods=["POST"])
@jwt_required()
def add_item():
    data = request.json
    item = {
        "id": str(uuid.uuid4()),
        "title": data["title"],
        "description": data["description"],
        "size": data["size"],
        "condition": data["condition"],
        "image_url": data["image_url"]
    }
    items.append(item)
    return jsonify(item)

# 📦 Get all items
@app.route("/api/items", methods=["GET"])
@jwt_required()
def get_items():
    return jsonify(items)

# 📦 Get item by ID
@app.route("/api/items/<id>", methods=["GET"])
@jwt_required()
def get_item(id):
    item = next((i for i in items if i["id"] == id), None)
    if item:
        return jsonify(item)
    return jsonify({"error": "Item not found"}), 404

# 🧪 Test route
@app.route("/", methods=["GET"])
def home():
    return "🎉 ReWear API Running!"

if __name__ == "__main__":
    app.run(debug=True)