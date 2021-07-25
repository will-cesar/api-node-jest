const axios = require('axios');
const crypto = require('crypto');
const postsService = require('../service/postsService');

/*
    - função responsável por gerar strings aleatórias
    - utilizada para deixar os testes com dados não 'viciados'
    - e deixar os testes de criação mais dinâmicos
*/
const generate = function() {
    return crypto.randomBytes(20).toString('hex');
};

/*
    - função para fazer a requisição de dentro da api
    - "validateStatus: false": a validação não ocorre por parte do axio, e sim pelos testes 
*/
const request = function(url, method, data) {
    return axios({ url, method, data, validateStatus: false }); 
};

/* 
    - Teste Get - passos:
        - o intuito desse teste é conseguir criar, listar e apagar os dados
        - no "given" estão sendo criados 3 novos posts
        - no "when" está acontecendo a chamada de listagem desses posts
        - há uma validação esperando o status 200 da chamada
        - no "then" está esperando que a lista de posts contém 3 posts
        - logo após é deletado esses novos posts criados pelo teste para não sujar o banco de dados
        - caso todos os passos tenha acontecido de forma correta, o teste retorna sucesso 
*/
test('Should get posts', async function() {
    // given - dado que
    const post1 = await postsService.savePost({ title: `Title ${generate()}`, content: `Content ${generate()}` });
    const post2 = await postsService.savePost({ title: `Title ${generate()}`, content: `Content ${generate()}` });
    const post3 = await postsService.savePost({ title: `Title ${generate()}`, content: `Content ${generate()}` });

    // when - quando acontecer
    const response = await request('http://localhost:3000/posts', 'get');

    // se espera que o status retornado seja 200
    expect(response.status).toBe(200);

    // then - então
    const posts = response.data;
    expect(posts).toHaveLength(3);

    await postsService.deletePost(post1.id);
    await postsService.deletePost(post2.id);
    await postsService.deletePost(post3.id);
});

/*
    - Teste Create - passos:
        - criado um post
        - chama o serviço de criação a partir da rota
        - faz a validação do status, sendo necessáriamente 201 pois é a criação de um novo post
        - com o response do serviço faz a comparação dos dados do response com o que foi criado em memória do método 
        - por último deleta o post
*/
test('Should save a post', async function() {
    // cria o post em memória
    const data = { title: `Title ${generate()}`, content: `Content ${generate()}` };

    // cria o post pelo método de criação
    const response = await request('http://localhost:3000/posts', 'post', data);

    // se espera que o status retornado seja 201
    expect(response.status).toBe(201);

    // salva o response do método
    const post = response.data;

    // faz a comparação de valores
    expect(post.title).toBe(data.title);
    expect(post.content).toBe(data.content);

    // deleta o post
    await postsService.deletePost(post.id);
});

/*
    - Teste Create para dar 409 - passos:
        - criado um post
        - chama o serviço de criação a partir da rota duas vezes
        - faz a validação do status, sendo necessáriamente 409 pois não é permitido a criação do post com o title duplicado
        - com o response do serviço faz a comparação dos dados do response com o que foi criado em memória do método 
        - por último deleta o post
*/
test('Should not save a post', async function() {
    // cria o post em memória
    const data = { title: `Title ${generate()}`, content: `Content ${generate()}` };

    // cria dois posts com o mesmo title pelo método de criação
    const response1 = await request('http://localhost:3000/posts', 'post', data);
    const response2 = await request('http://localhost:3000/posts', 'post', data);

    // se espera que o status retornado seja 409, pois não se pode ter um post com o title duplicado
    expect(response2.status).toBe(409);

    // salva o response1 do método
    const post = response1.data;

    // deleta o post
    await postsService.deletePost(post.id);
});

/*
    - Teste Update - passos:
        - criar um post 
        - editar o "title" e o "content" dentro da memória do método
        - chama o serviço de alteração passando o post editado na memória do método
        - faz uma validação do retorno do status code dessa chamada, pois não se espera retorno de dados nessa requisição
        - logo após, pega diretamente do banco o post pelo id alterado
        - e em seguida faz a comparação de valores entre o que retornou do banco e o que está armazenado em memória do método
        - por último deleta o post
*/
test('Should update a post', async function() {
    // cria o post
    const post = await postsService.savePost({ title: `Title ${generate()}`, content: `Content ${generate()}` });

    // edita o post
    post.title = generate();
    post.content = generate();

    // chama o serviço de alteração
    const response = await request(`http://localhost:3000/posts/${post.id}`, 'put', post);
    
    // se espera que o status retornado seja 204 (No Content), pois não se espera retorno de dados nessa requisição
    expect(response.status).toBe(204);

    // pega diretamente do banco o post pelo id
    const updatedPost = await postsService.getPost(post.id);

    // comparação de valores entre o post obtido pelo banco e o post salvo na memória do método
    expect(updatedPost.title).toBe(post.title);
    expect(updatedPost.content).toBe(post.content);

    // deleta o post
    await postsService.deletePost(post.id);
});

/*
    - Teste Update que NÃO pode dar certo - passos:
        - criar um post com um id inexistente
        - chama o serviço de alteração passando o post editado na memória do método
        - faz a validação do status code dessa chamada
        - é necessário que o retorno seja 404 para passa o teste
*/
test('Should not update a post', async function() {
    // cria apenas um post com um id inexistente
    const post = { id: 1 };

    // chama o serviço de alteração
    const response = await request(`http://localhost:3000/posts/${post.id}`, 'put', post);
    
    // se espera que o status retornado seja 404 (Not Found), pois não existe o post em específico
    expect(response.status).toBe(404);
});

/*
    - Teste Delete - passos:
        - criar um post diretamente no banco
        - chama o serviço de delete pela rota
        - faz uma validação do retorno dessa chamada, pois não se espera retorno de dados nessa requisição
        - pega todos os posts diretamente da query do banco
        - faz a validação, pois se espera que não tenha nenhum post na listagem
*/
test('Should delete a post', async function() {
    // cria o post
    const post = await postsService.savePost({ title: `Title ${generate()}`, content: `Content ${generate()}` });

    // chama o serviço de delete
    const response = await request(`http://localhost:3000/posts/${post.id}`, 'delete');

    // se espera que o status retornado seja 204 (No Content), pois não se espera retorno de dados nessa requisição
    expect(response.status).toBe(204);

    // pega os posts diretamente do banco
    const posts = await postsService.getPosts();

    // se espera que não tenha nenhum post no retorno do dados do banco
    expect(posts).toHaveLength(0);
});