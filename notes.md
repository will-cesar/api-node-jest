## Comandos de instalação
- npm i express body-parser pg-promise jest axios --save
    - express: biblioteca para administração de rotas e etc
    - body-parser: utilizado para fazer o tratamento do corpo da requisição 
    - pg-promise: biblioteca que permite a conexão com o PostgreSQL e todos os comandos necessários para a integração da API com o banco
    - jest: biblioteca de testes
    - axios: biblioteca cliente para requisições http

## Docker
- docker-compose up -d - Comando para rodar o docker-compose e subir as configurações do container
- sudo docker container start api-node-jest_db_1 - comando para dar o start do container
- sudo docker container stop api-node-jest_db_1 - comando para parar o container

## Estruturação das pastas da API
- data: camada responsável pela interação com a base de dados
- infra: responsável pela gestão da conexão com o banco de dados
- route: 
    - responsável pelo armazenamento das rotas
    - a camada route faz a definição do comportamento da cada rota
    - também é responsável pela definição dos status code das requisições
- service: camada responsável pelas regras de negócio
- test: arquivos dos testes automatizados

## Ciclo de vida da requisição
- requisição chega pela camada route
- na camada route é criado uma instância da camada de serviços
- a camada de serviço delega para a camada de data a responsabilidade de devolver os dados
- a camada de data acessa o banco de dados e retorna as informações requisitadas

## SQL
- schema: separação lógica entre tabelas
- arquivo .sql são onde ficarão as querys para rodar no banco de dados

## Testes
- documentação Jest: https://jestjs.io/pt-BR/docs/api
- no package.json é possível configurar um script de testes
- exemplo: "test": "jest --env node"
    - "--env node" especifica que é um ambiente node
- given, when, then
    - os testes tem como base essa estrutura
    - Given: dado que
    - When: quando acontecer
    - Then: então
- test.only = comando para rodar apenas um teste em específico

## Status code
- Categorias:
    - 1xx - Informational
    - 2xx - Success
    - 3xx - Redirection
    - 4xx - Client Error
    - 5xx - Server Error

- Alguns status code muito utilizados:
    - 101 - Switching Protocols
    - 200 - OK
    - 201 - Created
    - 204 - No Content
    - 301 - Moved Permanently
    - 302 - Found 
    - 400 - Bad Request (fez uma requisição sem sentido, podendo ser por culpa do formato ou conteúdo do corpo da requisição)
    - 401 - Unauthorized (requisição com token inválido ou sem token)
    - 403 - Forbidden (token válido, mas não tem permissão de acesso ao recurso)
    - 404 - Not Found (recurso que não existe)
    - 405 - Method Not Allowed (quando um método específico não é permitido no recurso, mas existem outros métodos disponíveis)
    - 409 - Conflict (requisição correta, mas por alguma validação de negócio não será validada)
    - 422 - Unprocessable Entity (requisição correta, mas por alguma validação de negócio não será validada)
    - 500 - Internal Server Error
    - 501 - Not Implemented (serviço não implementado)
    - 502 - Bad Gateway (falha ao repasse de requisição de outro servidor que apresentou algum problema)
    - 503 - Service Unavailable (indisponibilidade de servidores de terceiros)
    - 504 - Gateway Timeout (caso a requisição esteja demorando tempo demais para acontecer)