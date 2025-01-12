from flask import request
from flask_restful import Resource
from models import Book
from db import db

class BookResource(Resource):
    def get(self, book_id):
        book = Book.query.get_or_404(book_id)
        return {'id': book.id, 'title': book.title, 'author': book.author}

    def put(self, book_id):
        data = request.get_json()
        book = Book.query.get_or_404(book_id)
        book.title = data['title']
        book.author = data['author']
        db.session.commit()
        return {'id': book.id, 'title': book.title, 'author': book.author}

    def delete(self, book_id):
        book = Book.query.get_or_404(book_id)
        db.session.delete(book)
        db.session.commit()
        return '', 204

class BookListResource(Resource):
    def get(self):
        search = request.args.get('search')
        if search:
            books = Book.query.filter(
                (Book.title.ilike(f'%{search}%')) | 
                (Book.author.ilike(f'%{search}%'))
            ).all()
        else:
            books = Book.query.all()
        return [{'id': book.id, 'title': book.title, 'author': book.author} for book in books]

    def post(self):
        data = request.get_json()
        book = Book(title=data['title'], author=data['author'])
        db.session.add(book)
        db.session.commit()
        return {'id': book.id, 'title': book.title, 'author': book.author}, 201