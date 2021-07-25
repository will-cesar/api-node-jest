## Comandos de instalação
- npm i express body-parser pg-promise jest axios --save
    - express: biblioteca para administração de rotas e etc
    - body-parser: utilizado para fazer o tratamento do corpo da requisição 
    - pg-promise: biblioteca que permite a conexão com o PostgreSQL e todos os comandos necessários para a integração da API com o banco
    - jest: biblioteca de testes
    - axios: biblioteca para requisições dentro dos testes

## Docker
- docker-compose up -d - Comando para rodar o docker-compose e subir as configurações do container
- sudo docker container start api-node-jest_db_1 - comando para dar o start do container
- sudo docker container stop api-node-jest_db_1 - comando para parar o container

## Estruturação das pastas da API
- data: querys para a interação com o banco 
- infra: gestão da conexão com o banco
- route: 
    - responsável pelo armazenamento das rotas
    - a camada route faz a definição do comportamento da cada rota
- service: serviços da api
- test: arquivos dos testes automatizados

## SQL
- schema: separação lógica entre tabelas
- arquivo .sql são onde ficarão as querys para rodar no banco de dados