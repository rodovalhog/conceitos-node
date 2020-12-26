const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

//middleware
function validadteId(request, response, next) {
  const { id } = request.params;
  
  console.log('id existe guigui', isUuid(id))
  if(!isUuid(id)) {
    return response.status(400).send()
  }

  return next();

};

app.use(express.json());
app.use(cors());
app.use('/repositories/id', validadteId);

const repositories = [];

//LISTAR
app.get("/repositories", (request, response) => {
  const {title} = request.query;

  const result = title
    ? repositories.filter(repository => repository.title.includes(title))
    : repositories;
    return response.json(result)
});

//CRIAR
app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repository = {
    id: uuid(),
     title,
     url, 
     techs,
    likes: 0
  };
  repositories.push(repository);
  response.json(repository);
});

//ATUALIZAR
app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const { 
    url, 
    title,
    techs,
  } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if(repositoryIndex < 0) {
    return response.status(400).json(
      {error: 'Repository does not exists.'}
    )
  }

  const repository = { id, title, url, techs, likes: repositories[repositoryIndex].likes };
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

//DELETAR
app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if(repositoryIndex < 0) {
    return response.status(400).json(
      {error: 'Repository does not exists.'}
    )
  }

  repositories.splice(repositoryIndex, 1);


  return response.status(204).send()
});

//LIKES
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repository = repositories.find(repository => repository.id === id)

  if(!repository) {
    return response.status(400).send();
  }

  repository.likes += 1;
  return response.json(repository);
});

module.exports = app;
