from flask import Blueprint, request, jsonify, session
from db import mysql
import MySQLdb.cursors

user_data_app = Blueprint('user_data', __name__)


@user_data_app.route('/save_weight', methods=['POST'])
def save_weight():
    if 'loggedin' in session:
        user_id = session['id']
        data = request.json
        weight = data.get('weight')
        date = data.get('date')
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute(
            'INSERT INTO user_weight_history (user_id, weight, date) VALUES (%s, %s, %s)', (user_id, weight, date))
        mysql.connection.commit()
        cursor.close()
        return jsonify({'message': 'Weight saved successfully'})
    else:
        return jsonify({'error': 'User not logged in'})


@user_data_app.route('/get_weight_history', methods=['GET'])
def get_weight_history():
    if 'loggedin' in session:
        user_id = session['id']
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute(
            'SELECT * FROM user_weight_history WHERE user_id = %s', (user_id,))
        weight_history = cursor.fetchall()
        cursor.close()
        return jsonify({'weight_history': weight_history})
    else:
        return jsonify({'error': 'User not logged in'})
