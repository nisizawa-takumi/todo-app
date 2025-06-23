import requests

OLLAMA_API_URL = "http://ollama:11434/api/generate"

prompt = "次のToDoリストから1日のスケジュール案を日本語で提案してください。\n- 牛乳を買う\n- レポート提出\n- 散歩\n- 掃除"

payload = {
    "model": "qwen:0.5b",
    "prompt": prompt,
    "stream": False
}

response = requests.post(OLLAMA_API_URL, json=payload)

if response.ok:
    print("--- LLMからのスケジュール提案 ---")
    print(response.json().get("response"))
else:
    print("エラー:", response.text)
