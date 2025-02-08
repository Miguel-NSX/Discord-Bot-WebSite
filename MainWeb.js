const express = require("express");
const session = require("express-session");
const passport = require("passport");
const ejs = require("ejs");
const { Client } = require("discord.js");
const app = express();
const discordAuth = require('./discordAuth.js');

// Configuração do view engine
app.set("view engine", "ejs");
app.set("views", "./views"); // Define o diretório das views (caso não esteja no padrão).
app.use(express.static("public")); // Para servir arquivos estáticos da pasta 'public'

// Middleware de sessão
app.use(
  session({
    secret: "seuSegredoAqui",
    resave: false,
    saveUninitialized: false,
  })
);

const client = new Client({
  intents: 32767,
})

client.login(process.env.TOKEN)

client.on('ready', () => {
  console.log(`🤖 - ${client.user.tag} está online!`)
})

// Middleware do passport
app.use(passport.initialize());
app.use(passport.session());

app.use(discordAuth);

const logged = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/auth/discord");
  }
}

app.get("/auth/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/")
});

// Rota da página inicial
app.get("/", (req, res) => {
  res.render("home", { user: req.session.user, client: client});
});

// Rota do dashboard
app.get("/dashboard", logged, (req, res) => {
  res.render("dashboard", { user: req.session.user });
});

// Inicializando o servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
