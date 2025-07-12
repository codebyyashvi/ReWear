# filepath: c:\Users\lotiy\Desktop\projects\Rewear\ReWear\Backend\app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, JWTManager
from flask_pymongo import PyMongo
from bson import ObjectId
from dotenv import load_dotenv
import uuid
import os

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Configurations
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

# Setup extensions
mongo = PyMongo(app)
jwt = JWTManager(app)

# MongoDB collections
users_collection = mongo.db.users
items_collection = mongo.db.items

# 🔐 Signup
@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    if users_collection.find_one({"email": data["email"]}):
        return jsonify({"error": "User already exists"}), 400
    
    new_user = {
        "email": data["email"],
        "password": data["password"],
        "points": 100
    }
    result = users_collection.insert_one(new_user)
    user_id = str(result.inserted_id)
    access_token = create_access_token(identity=user_id)

    new_user["_id"] = user_id
    return jsonify({"message": "User created", "user": new_user, "access_token": access_token})

# 🔐 Login
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    user = users_collection.find_one({"email": data["email"]})
    if not user or user["password"] != data["password"]:
        return jsonify({"error": "Invalid credentials"}), 401

    user_id = str(user["_id"])
    access_token = create_access_token(identity=user_id)
    user["_id"] = user_id
    return jsonify({"message": "Login successful", "user": user, "access_token": access_token})

# 📦 Add item
@app.route("/api/items", methods=["POST"])
@jwt_required()
def add_item():
    data = request.json
    item = {
        "title": data["title"],
        "description": data["description"],
        "size": data["size"],
        "condition": data["condition"],
        "image_url": data["image_url"]
    }
    result = items_collection.insert_one(item)
    item["_id"] = str(result.inserted_id)
    return jsonify(item)

# 📦 Get all items
@app.route("/api/items", methods=["GET"])
@jwt_required()
def get_items():
    items = list(items_collection.find())
    for item in items:
        item["_id"] = str(item["_id"])
    return jsonify(items)

@app.route("/api/items/<id>", methods=["GET"])
@jwt_required()
def get_item(id):
    try:
        print("Fetching item with ID:", id)  # DEBUG
        item = items_collection.find_one({"_id": ObjectId(id)})
        if item:
            item["_id"] = str(item["_id"])
            print("Item found:", item)  # DEBUG
            return jsonify(item)
        print("Item not found")  # DEBUG
        return jsonify({"error": "Item not found"}), 404
    except Exception as e:
        print("Exception:", str(e))  # DEBUG
        return jsonify({"error": "Invalid ID format"}), 400


# 🧪 Test route
@app.route("/", methods=["GET"])
def home():
    return "🎉 ReWear API Running with MongoDB Atlas!"

if __name__ == "__main__":
    app.run(debug=True)
