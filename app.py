from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from db import db
from resources.book import BookResource, BookListResource
from resources.auth import RegisterResource, LoginResource
from resources.profile import ManageBorrowedBookResource, ProfileResource, BorrowBookResource
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

app = Flask(__name__)
CORS(app)
api = Api(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'

db.init_app(app)
Migrate = Migrate(app, db)
jwt = JWTManager(app)

with app.app_context():
    db.create_all()

api.add_resource(BookListResource, '/books')
api.add_resource(BookResource, '/books/<int:book_id>')
api.add_resource(RegisterResource, '/register')
api.add_resource(LoginResource, '/login')
api.add_resource(ProfileResource, '/profile')
api.add_resource(BorrowBookResource, '/borrow')
api.add_resource(ManageBorrowedBookResource, '/borrowed/<int:borrowed_book_id>')

if __name__ == '__main__':
    app.run(debug=True)