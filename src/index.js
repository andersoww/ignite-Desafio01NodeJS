const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
  const customer = users.find((customer) => customer.username === username);
  if (!customer) {
    return response.status(400).json({ error: "Mensagem do erro" });
  }
  request.customer = customer;
  return next();
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;
  //some => é um método que testa um array retornando true ou false. Diante da condição passada para testar
  const userAlreadyExists = users.some((user) => user.username === username);
  if (userAlreadyExists) {
    return response.status(400).json({ error: "Usuário já existe !" });
  }

  const object = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };
  users.push(object);
  return response.status(201).json(object);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { customer } = request;
  return response.json(customer.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { customer } = request;
  const object = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };
  customer.todos.push(object);
  return response.status(201).json(object);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { id } = request.params;
  const { customer } = request;

  let idAlreadyExists = customer.todos.find((customer) => customer.id === id);
  if (!idAlreadyExists) {
    return response.status(404).json({ error: "Tarefa não existe !" });
  }

  idAlreadyExists.title = title;
  idAlreadyExists.deadline = new Date(deadline);
  return response.status(201).send();
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { customer } = request;
  let idAlreadyExists = customer.todos.find((customer) => customer.id === id);
  if (!idAlreadyExists) {
    return response.status(404).json({ error: "Tarefa não existe !" });
  }
  idAlreadyExists.done = true;
  return response.status(204).send();
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { customer } = request;
  let idAlreadyExists = customer.todos.find((customer) => customer.id === id);
  if (!idAlreadyExists) {
    return response.status(404).json({ error: "Tarefa não existe !" });
  }
  const newArray = customer.todos.filter((user) => user.id !== id);
  customer.todos = newArray;
  return response.json(newArray);
});

module.exports = app;
