from flask import Blueprint, request, jsonify, session
import os
from dotenv import load_dotenv
from openai import OpenAI

caloric_needs_app = Blueprint('caloric_needs', __name__)

load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')
client = OpenAI(api_key=api_key)


@caloric_needs_app.route('/calculate_caloric_needs', methods=['POST'])
def calculate_caloric_needs():
    if 'loggedin' in session:
        data = request.json
        weight = float(data.get('weight', 0))
        height = float(data.get('height', 0))
        age = int(data.get('age', 0))
        gender = data.get('gender', '').lower()
        activity_level = data.get('activity_level', '').lower()
        goal = data.get('goal', '').lower()
        monthly_goal = float(data.get('monthly_goal', 0))

        if not all([weight, height, age, gender, activity_level, goal]) or (goal in ['lose', 'gain'] and not monthly_goal):
            return jsonify({'error': 'Invalid input parameters'}), 400

        prompt = (f"Using Mifflin-St. Jeor Equation calculate the daily caloric needs for a {age}-year-old"
                f"{gender} who weighs {weight} kg, is {height} cm tall, has an activity level of"
                f"{activity_level}, and wants to {goal} {monthly_goal} kg per month. Give short answer.")

        try:
            response = client.completions.create(
                model="gpt-3.5-turbo-instruct",
                prompt=prompt,
                max_tokens=1500
            )
            result = response.choices[0].text.strip(
            ) if response.choices else "No response found."

            return jsonify({'response': result})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'User not logged in'}), 401

