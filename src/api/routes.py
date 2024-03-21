"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager


#create flask app
api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route("/token", methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if not email or not password:
        return jsonify({"msg": "email y password requeridos"})
    user = User.query.filter_by(email = email, password = password).first()
    if not user:
        return jsonify({"msg": "email o password incorrectos"})


    access_token = create_access_token(identity=user.id)
    return jsonify({"token": access_token, "user_id": user.id})


@api.route("/hello", methods=["GET"])
@jwt_required()
def get_hello():

    email = get_jwt_identity()
    print(email)
    dictionary = {
        "message": "hello world" + email
    }
    return jsonify(dictionary)


@api.route("/privateuser", methods=["GET"])
@jwt_required()
def token_validation():
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(id= current_user_id).first()
    if user is None:
        raise APIException("user not found", status_code=404)
    return jsonify("user autenticated"), 200
    


@api.route("/signup", methods=["POST"])
def sign_up():
    data = request.get_json()
    
    email = data.get("email")
    password = data.get("password")
    
    existing_user = User.query.filter_by(email = email).first()

    if existing_user:
        return jsonify({"mensaje":"email ya existe"}), 400
    
    new_user = User(
        email=email,
        password= password,
        is_active=True,
    )
    #### agregar al nuevo usuario el new_user a la database
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"user_id": new_user.id, "msg": "usuario creado correctamente"}), 201









if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3000))
    api.run(host='0.0.0.0', port=PORT, debug=True)