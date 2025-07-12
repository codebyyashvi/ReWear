# filepath: c:\Users\lotiy\Desktop\projects\Rewear\ReWear\Backend\app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, JWTManager
from flask_sqlalchemy import SQLAlchemy
import uuid
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Configure the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///rewear.db'  # Use SQLite
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this in production!
jwt = JWTManager(app)

# Define the User model
class User(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    points = db.Column(db.Integer, default=100)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# Define the Item model
class Item(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    size = db.Column(db.String(50))
    condition = db.Column(db.String(50))
    image_url = db.Column(db.String(200))

# Create the database tables
with app.app_context():
    db.create_all()

# 📝 Helper to find user
def find_user(email):
    return User.query.filter_by(email=email).first()

# 🔐 Signup
@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    if find_user(data["email"]):
        return jsonify({"error": "User already exists"}), 400

    new_user = User(email=data["email"])
    new_user.set_password(data["password"])  # Hash the password
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=new_user.id)
    return jsonify({"message": "User created", "user": {"id": new_user.id, "email": new_user.email, "points": new_user.points}, "access_token": access_token})

# 🔐 Login
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    user = find_user(data["email"])
    if not user or not user.check_password(data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"message": "Login successful", "user": {"id": user.id, "email": user.email, "points": user.points}, "access_token": access_token})

# 📦 Add item
@app.route("/api/items", methods=["POST"])
@jwt_required()
def add_item():
    data = request.json
    item = Item(
        title=data["title"],
        description=data["description"],
        size=data["size"],
        condition=data["condition"],
        image_url=data["image_url"]
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({"id": item.id, "title": item.title, "description": item.description, "size": item.size, "condition": item.condition, "image_url": item.image_url})

# 📦 Get all items
@app.route("/api/items", methods=["GET"])
@jwt_required()
def get_items():
    items = Item.query.all()
    item_list = [{"id": item.id, "title": item.title, "description": item.description, "size": item.size, "condition": item.condition, "image_url": item.image_url} for item in items]
    return jsonify(item_list)

# 📦 Get item by ID
@app.route("/api/items/<id>", methods=["GET"])
@jwt_required()
def get_item(id):
    item = Item.query.get(id)
    if item:
        return jsonify({"id": item.id, "title": item.title, "description": item.description, "size": item.size, "condition": item.condition, "image_url": item.image_url})
    return jsonify({"error": "Item not found"}), 404

# 🧪 Test route
@app.route("/", methods=["GET"])
def home():
    return "🎉 ReWear API Running!"

if __name__ == "__main__":
    app.run(debug=True)