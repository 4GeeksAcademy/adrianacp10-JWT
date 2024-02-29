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

#CREATE A TOKEN
@api.route("/token", methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email != "test" or password != "test":
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token)



@api.route("/hello", methods=["GET"])
@jwt_required()
def get_hello():

    email = get_jwt_identity()
    print(email)
    dictionary = {
        "message": "hello world" + email
    }
    return jsonify(dictionary)

##########
@api.route("/privateuser", methods=["GET"])
@jwt_required()
def get_user():
    email = get_jwt_identity()
    print(email)
    dictionary = {
        "message": "hello world" + email
    }
    return jsonify(dictionary)




#hay que hacer un get_user_All???


#añadir un user

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
    ## una vez agregado el nuevo usuario a la base de datos, se devuelve el token
    access_token = create_access_token(identity=new_user.id)
    return jsonify({"token": access_token, "user_id": new_user.id}), 201







if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3000))
    api.run(host='0.0.0.0', port=PORT, debug=True)