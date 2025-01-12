import os
from flask import Flask, request
from flask_restful import Resource
from db import db
from models import User, BorrowedBook
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from flask_jwt_extended import create_access_token
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['JWT_TOKEN_LOCATION'] = ['headers', 'query_string']
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

jwt = JWTManager(app)

class LoginResource(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()

        if user and user.check_password(data['password']):
            access_token = create_access_token(identity=user.id)
            return {'token': access_token}, 200
        else:
            return {'message': 'Invalid credentials'}, 401

class ProfileResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)
        borrowed_books = [
            {
                'title': borrowed.book.title,
                'author': borrowed.book.author,
                'borrow_date': borrowed.borrow_date,
                'quantity': borrowed.quantity
            }
            for borrowed in user.borrowed_books
        ]
        return {
            'username': user.username,
            'email': user.email,
            'borrowed_books': borrowed_books
        }

class BorrowBookResource(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        if not data or 'book_id' not in data or 'borrow_date' not in data or 'quantity' not in data:
            return {'message': 'Missing required fields'}, 400
        
        user_id = get_jwt_identity()
        new_borrowed_book = BorrowedBook(
            user_id=user_id,
            book_id=data['book_id'],
            borrow_date=data['borrow_date'],
            quantity=data['quantity']
        )
        db.session.add(new_borrowed_book)
        db.session.commit()
        return {'message': 'Book borrowed successfully'}, 201

class ManageBorrowedBookResource(Resource):
    @jwt_required()
    def delete(self, borrowed_book_id):
        user_id = get_jwt_identity()
        borrowed_book = BorrowedBook.query.filter_by(id=borrowed_book_id, user_id=user_id).first_or_404()
        db.session.delete(borrowed_book)
        db.session.commit()
        return {'message': 'Borrowed book deleted successfully'}, 200

    @jwt_required()
    def put(self, borrowed_book_id):
        data = request.get_json()
        if not data or 'borrow_date' not in data:
            return {'message': 'Missing required fields'}, 400

        user_id = get_jwt_identity()
        borrowed_book = BorrowedBook.query.filter_by(id=borrowed_book_id, user_id=user_id).first_or_404()
        borrowed_book.borrow_date = data['borrow_date']
        db.session.commit()
        return {'message': 'Borrow date updated successfully'}, 200