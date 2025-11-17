from flask import Flask, render_template, request, jsonify, session
import pandas as pd
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)  # Generate a random secret key for sessions


@app.route('/')
def index():
    # Initialize session data if not exists
    if 'flashcards_data' not in session:
        session['flashcards_data'] = []
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file uploaded'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'success': False, 'error': 'No file selected'})

    if file and file.filename.endswith(('.xlsx', '.xls')):
        try:
            # Read directly from memory (no file saving needed)
            df = pd.read_excel(file)

            if df.shape[1] < 2:
                return jsonify(
                    {'success': False, 'error': 'Excel file must have at least 2 columns (Question | Answer)'})

            flashcards_data = []
            for _, row in df.iterrows():
                question = str(row.iloc[0]) if pd.notna(row.iloc[0]) else ''
                answer = str(row.iloc[1]) if pd.notna(row.iloc[1]) else ''

                # Skip empty rows
                if question.strip() or answer.strip():
                    flashcards_data.append({
                        'question': question,
                        'answer': answer
                    })

            if len(flashcards_data) == 0:
                return jsonify({'success': False, 'error': 'No valid flashcards found in file'})

            # Store in session instead of global variable
            session['flashcards_data'] = flashcards_data
            session.modified = True

            return jsonify({
                'success': True,
                'flashcards': flashcards_data,
                'count': len(flashcards_data)
            })

        except Exception as e:
            return jsonify({'success': False, 'error': f'Error reading file: {str(e)}'})

    return jsonify({'success': False, 'error': 'Invalid file type. Please upload .xlsx or .xls file'})


@app.route('/reset', methods=['POST'])
def reset_data():
    # Clear session data
    session['flashcards_data'] = []
    session.modified = True
    return jsonify({'success': True})


@app.route('/get-flashcards', methods=['GET'])
def get_flashcards():
    """Optional: Get current flashcards from session"""
    flashcards = session.get('flashcards_data', [])
    return jsonify({
        'success': True,
        'flashcards': flashcards,
        'count': len(flashcards)
    })


if __name__ == '__main__':
    app.run(debug=True)