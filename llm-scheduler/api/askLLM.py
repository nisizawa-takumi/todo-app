from flask import Flask, request, jsonify # type: ignore
import requests
import os
from flask_cors import CORS # type: ignore
import traceback
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)  # これで全てのオリジンからのアクセスを許可（開発時想定。本番ではもっとセキュリティを気にしたほうがいいだろう）

OLLAMA_API_URL = os.environ.get("OLLAMA_API_URL", "http://ollama:11434/api/generate")
MODEL_NAME = "7shi/ezo-gemma-2-jpn:2b-instruct-q8_0"

@app.route('/ask-llm', methods=['OPTIONS'])
def ask_llm_options():
    return '', 204

@app.route('/ask-llm', methods=['POST'])
def ask_llm():
    try:
        prompt = request.json.get("prompt", "") if request.is_json else ""
        if not prompt:
            return jsonify({"error": "プロンプトが空です"}), 400
        payload = {
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False
        }
        print("=== LLM DEBUG ===", flush=True)
        print("OLLAMA_API_URL:", OLLAMA_API_URL, flush=True)
        print("payload:", payload, flush=True)
        response = requests.post(OLLAMA_API_URL, json=payload)
        print("response.status_code:", response.status_code, flush=True)
        print("response.text:", response.text, flush=True)
        if response.ok:
            return jsonify({"response": response.json().get("response")})
        else:
            return jsonify({"error": response.text}), 500
    except Exception as e:
        print("=== LLM API ERROR ===", flush=True)
        print(e, flush=True)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)