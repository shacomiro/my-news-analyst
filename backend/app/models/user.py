from datetime import datetime
from .. import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False,
                           default=datetime.utcnow)
    last_login_at = db.Column(db.DateTime, nullable=True)

    search_histories = db.relationship(
        'SearchHistory', backref='user', lazy=True)

    def __repr__(self):
        return f"<User {self.email}>"
