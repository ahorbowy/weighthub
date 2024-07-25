from flask import Blueprint, request, jsonify, session
from db import mysql
import MySQLdb.cursors
from openai import OpenAI
import os
from dotenv import load_dotenv

openai_app = Blueprint('openai_response', __name__)

load_dotenv()

api_key = os.getenv('OPENAI_API_KEY')

client = OpenAI(api_key=api_key)


@openai_app.route('/openai_response', methods=['POST'])
def openai_response():
    if 'loggedin' in session:
        data = request.json
        ask = data.get('question')

        try:
            response = client.completions.create(
                model="gpt-3.5-turbo-instruct",
                prompt=ask,
                max_tokens=1500
            )
            answer = response.choices[0].text if response.choices else "No response found."

            return jsonify({'answer': answer})

        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'User not logged in'})


@openai_app.route('/get_chat_responses', methods=['GET'])
def get_chat_responses():
    if 'loggedin' in session:
        user_id = session['id']
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute(
            'SELECT * FROM user_chat_responses WHERE user_id = %s', (user_id,)
        )
        chat_responses = cursor.fetchall()
        cursor.close()
        return jsonify({'chat_responses': chat_responses})
    else:
        return jsonify({'error': 'User not logged in'})


@openai_app.route('/save_chat_response', methods=['POST'])
def save_chat_response():
    if 'loggedin' in session:
        user_id = session['id']
        data = request.json
        question = data.get('question')

        try:
            cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
            cursor.execute(
                'INSERT INTO user_chat_responses (user_id, response) VALUES (%s, %s)',
                (user_id, question)
            )
            mysql.connection.commit()
            cursor.close()

            return jsonify({'message': 'Chat response saved successfully'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'User not logged in'})


@openai_app.route('/delete_chat_response/<int:response_id>', methods=['DELETE'])
def delete_chat_response(response_id):
    if 'loggedin' in session:
        try:
            cursor = mysql.connection.cursor()
            cursor.execute(
                'DELETE FROM user_chat_responses WHERE id = %s', (response_id,)
            )
            mysql.connection.commit()
            cursor.close()

            return jsonify({'message': 'Chat response deleted successfully'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'User not logged in'})
