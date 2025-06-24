# 起動しているサーバーの確認
docker compose ps

# MySQLコンテナに入る
docker-compose exec mysql mysql -u root -p

# MySQLでデータベース・テーブル・データを確認する
USE todo_db;
SHOW TABLES;
SELECT * FROM User;
SELECT * FROM Todo;
