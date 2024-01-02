const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const Users = require("./users/User");

//view engine
app.set("view engine", "ejs");

//session
app.use(
  session({
    secret: "lakjlksj0uz0v08!!$!1oui2lj",
    cookie: { maxAge: 3000000 },
  })
);

//static
app.use(express.static("public"));

//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connection
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco bem sucedida!");
  })
  .catch((error) => {
    console.log(error);
  });

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

// Para testar a session
//
// app.get("/le-session", (req, res) => {
//   req.session.treina = "Curso de NodeJs";
//   req.session.ano = 2023;
//   req.session.user = {
//     id: 1,
//     email: "luiz@email.com",
//   };
//   res.send("Sessão gerada!");
// });

// app.get("/escreve-session", (req, res) => {
//   res.json({
//     treina: req.session.treina,
//     ano: req.session.ano,
//     user: req.session.user,
//   });
// });

app.get("/", (req, res) => {
  Article.findAll({
    order: [["id", "DESC"]],
    limit: 4,
  }).then((articles) => {
    Category.findAll().then((categories) => {
      res.render("index", { articles: articles, categories: categories });
    });
  });
});

app.get("/:slug", (req, res) => {
  var slug = req.params.slug;
  Article.findOne({
    where: {
      slug: slug,
    },
  })
    .then((article) => {
      if (article != undefined) {
        Category.findAll().then((categories) => {
          res.render("article", { article: article, categories: categories });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((erro) => {
      res.redirect("/");
    });
});

app.get("/category/:slug", (req, res) => {
  var slug = req.params.slug;
  Category.findOne({
    where: {
      slug: slug,
    },
    include: [{ model: Article }],
  })
    .then((category) => {
      if (category != undefined) {
        Category.findAll().then((categories) => {
          res.render("index", {
            articles: category.articles,
            categories: categories,
          });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((error) => {
      res.redirect("/");
    });
});

app.listen(8080, () => {
  console.log("Servidor iniciado!");
});
