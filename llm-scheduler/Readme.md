docker compose up -d --build
docker compose exec ollama ollama pull qwen:0.5b
llm-api コンテナで python llm_test.py
