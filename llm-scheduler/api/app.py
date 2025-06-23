from flask import Flask, request, jsonify # type: ignore

app = Flask(__name__)

@app.route('/suggest-schedule', methods=['POST'])
def suggest_schedule():
    # TODO: LLM連携ロジックをここに実装
    data = request.json
    return jsonify({"message": "スケジュール提案ロジックはここに実装", "data": data})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
