const express = require("express");
const session = require("express-session");
const passport = require("passport");
const ejs = require("ejs");
const app = express();
const discordAuth = require('./discordAuth.js');

// Configuração do view engine
app.set("view engine", "ejs");
app.set("views", "./views"); // Define o diretório das views (caso não esteja no padrão)

app.use(express.static("public")); // Para servir arquivos estáticos da pasta 'public'

// Middleware de sessão
app.use(
  session({
    secret: "seuSegredoAqui",
    resave: false,
    saveUninitialized: false,
  })
);

// Middleware do passport
app.use(passport.initialize());
app.use(passport.session());

app.use(discordAuth);

// Middleware de autenticação
const checkAuth = (req, res, next) => {
  res.locals.isAuthenticated = !!req.session.user;
  next();
};

// Aplicar middleware em todas as rotas
app.use(checkAuth);

// Rota da página inicial
app.get("/", (req, res) => {
  res.render("home", { user: req.session.user });
});

// Rota do dashboard
app.get("/dashboard", (req, res) => {
  res.render("dashboard", { user: req.session.user });
});

// Inicializando o servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
