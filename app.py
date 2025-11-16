from flask import Flask, render_template, url_for, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

flashcards_data = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    global flashcards_data
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and (file.filename.endswith('.xlsx') or file.filename.endswith('.xls')):
        try:
            df = pd.read_excel(file)
            
            if len(df.columns) < 2:
                return jsonify({'error': 'Excel file must have at least 2 columns (Question and Answer)'}), 400
            
            flashcards_data = []
            for index, row in df.iterrows():
                question = str(row.iloc[0]) if pd.notna(row.iloc[0]) else ''
                answer = str(row.iloc[1]) if pd.notna(row.iloc[1]) else ''
                if question and answer:
                    flashcards_data.append({
                        'question': question,
                        'answer': answer
                    })
            
            return jsonify({
                'success': True,
                'count': len(flashcards_data),
                'flashcards': flashcards_data
            })
        
        except Exception as e:
            return jsonify({'error': f'Error reading file: {str(e)}'}), 400
    
    return jsonify({'error': 'Invalid file type. Please upload .xlsx or .xls file'}), 400

@app.route('/flashcards', methods=['GET'])
def get_flashcards():
    return jsonify({'flashcards': flashcards_data})


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200


@app.route('/reset', methods=['POST'])
def reset_data():
    global flashcards_data
    flashcards_data = []
    try:
        for fname in os.listdir(app.config['UPLOAD_FOLDER']):
            fpath = os.path.join(app.config['UPLOAD_FOLDER'], fname)
            if os.path.isfile(fpath):
                os.remove(fpath)
    except Exception:
        pass

    return jsonify({'success': True, 'message': 'Flashcards reset'})

if __name__ == '__main__':
    app.run(debug=True)