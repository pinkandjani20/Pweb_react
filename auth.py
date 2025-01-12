from flask import request
from flask_restful import Resource
from models import User
from db import db
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

class RegisterResource(Resource):
    def post(self):
        data = request.get_json()
        if not data or 'username' not in data or 'email' not in data or 'password' not in data:
            return {'message': 'Missing required fields'}, 400

        if User.query.filter_by(username=data['username']).first():
            return {'message': 'User already exists'}, 400
        if User.query.filter_by(email=data['email']).first():
            return {'message': 'Email already registered'}, 400

        new_user = User(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )
        db.session.add(new_user)
        db.session.commit()
        return {'message': 'User created successfully'}, 201

class LoginResource(Resource):
    def post(self):
        data = request.get_json()
        if not data or 'username' not in data or 'password' not in data:
            return {'message': 'Missing required fields'}, 400

        user = User.query.filter_by(username=data['username']).first()
        if user and user.verify_password(data['password']):
            access_token = create_access_token(identity=user.id)
            return {'access_token': access_token}, 200
        return {'message': 'Invalid credentials'}, 401

class ProfileResource(Resource):
    @jwt_required()
    def get(self):
        
        auth_header = request.headers.get('Authorization')
        print("Authorization header:", auth_header)
        
        user_id = get_jwt_identity() 
        user = User.query.get(user_id)

        if user:
            return {'username': user.username, 'email': user.email}, 200
        return {'message': 'User not found'}, 404