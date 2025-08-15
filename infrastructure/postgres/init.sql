-- Criação do banco de dados e usuário
CREATE DATABASE financial_app;
CREATE USER financial_user WITH PASSWORD 'financial_pass';
GRANT ALL PRIVILEGES ON DATABASE financial_app TO financial_user;

-- Conectar ao banco financial_app
\c financial_app;

-- Dar permissões ao usuário no schema public
GRANT ALL ON SCHEMA public TO financial_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO financial_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO financial_user;
