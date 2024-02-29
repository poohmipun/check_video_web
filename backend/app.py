from flask import Flask, jsonify, request
from flask_cors import CORS
import csv
import json

app = Flask(__name__)
CORS(app)

@app.route('/api/csv-to-json', methods=['POST'])
def csv_to_json():
    try:
        # Get the CSV file from the request
        csv_file = request.files['csv_file']
        if not csv_file:
            return jsonify({'error': 'No CSV file provided'}), 400

        # Read the CSV file
        csv_data = csv_file.stream.read().decode('utf-8')

        # Convert CSV data to JSON
        jsonArray = []
        csvReader = csv.DictReader(csv_data.splitlines())
        for row in csvReader:
            jsonArray.append(row)

        # Return JSON response
        return jsonify(jsonArray), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
