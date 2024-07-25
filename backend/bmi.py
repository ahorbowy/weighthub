from flask import Blueprint, request, jsonify, session
import base64
import pygal
from pygal.style import Style

custom_style = Style(
    background='transparent',
    plot_background='transparent',
    value_font_size=0,
    margin=0,
    spacing=0
)

bmi_app = Blueprint('bmi', __name__)


@bmi_app.route('/calculate_bmi', methods=['POST'])
def calculate_bmi():
    if 'loggedin' in session:
        data = request.json
        weight = float(data.get('weight', 0))
        height = float(data.get('height', 0))

        if weight <= 0 or height <= 0:
            return jsonify({'error': 'Invalid weight or height'})

        height_in_meters = height / 100
        bmi = weight / (height_in_meters * height_in_meters)

        if bmi < 16:
            color = '#ff0000'  # red
        elif bmi < 18.5:
            color = '#ffff00'  # yellow
        elif bmi < 25:
            color = '#00ff00'  # green
        elif bmi < 30:
            color = '#ffff00'  # yellow
        elif bmi < 35:
            color = '#ffa500'  # orange
        else:
            color = '#ff0000'  # red
        gauge_chart = pygal.SolidGauge(
            half_pie=True, inner_radius=0.80, style=custom_style,
            width=300, height=300,
            margin=0, spacing=7,
            show_legend=False
        )
        gauge_chart.value_formatter = lambda x: '{:.2f}'.format(x)
        gauge_chart.add(
            'BMI', [{'value': bmi, 'max_value': 40, 'color': color}])
        svg_chart = gauge_chart.render()
        chart_image = base64.b64encode(svg_chart).decode('utf-8')
        return jsonify({'bmi': round(bmi, 2), 'chart_data': chart_image})
    else:
        return jsonify({'error': 'User not logged in'})
