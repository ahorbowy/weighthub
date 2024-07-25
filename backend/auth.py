from flask import session
from flask import Blueprint, request, jsonify, session
from db import mysql  # Importing MySQL from db.py
import re           # Importing re for regular expressions
import MySQLdb.cursors

auth_app = Blueprint('auth', __name__)


@auth_app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST' and 'username' in request.json and 'password' in request.json:
        username = request.json['username']
        password = request.json['password']
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute(
            'SELECT * FROM users WHERE username = %s AND password = %s', (username, password))
        user = cursor.fetchone()
        if user:
            session['loggedin'] = True
            session['id'] = user['user_id']
            session['username'] = user['username']
            return jsonify({'message': 'Login successful', }), 200
        else:
            return jsonify({'error': 'Incorrect username / password!'}), 400
    return jsonify({'error': 'Invalid request method'}), 400


@auth_app.route('/logout', methods=['POST'])
def logout():
    session.pop('loggedin', None)
    session.pop('id', None)
    session.pop('username', None)
    return jsonify({'message': 'Logged out successfully'}), 200


@auth_app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        data = request.json
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute(
            'SELECT * FROM users WHERE username = % s', (username, ))
        account = cursor.fetchone()
        if account:
            return jsonify({'error': 'Account already exists'}), 400
        elif not username or not password or not email:
            return jsonify({'error': 'Please fill out the form'}), 400
        elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            return jsonify({'error': 'Invalid email address'}), 400
        elif not re.match(r'[A-Za-z0-9]+', username):
            return jsonify({'error': 'Username must contain only characters and numbers'}), 400
        else:
            cursor.execute(
                'INSERT INTO users VALUES (NULL, % s, % s, % s)', (username, password, email, ))
            mysql.connection.commit()
            cursor.execute(
                'SELECT * FROM users WHERE username = % s', (username, ))
            user = cursor.fetchone()
            session['loggedin'] = True
            session['id'] = user['user_id']
            session['username'] = user['username']
            cursor.close()
            return jsonify({'message': 'You have successfully registered', 'loggedin': True}), 200
    return jsonify({'error': 'Invalid request method'}), 400
