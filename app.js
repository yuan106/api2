//Server Starting Code
//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

// allow mongodb to connect to local instance
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const articleSchema = {
  title: String,
  content: String,
};
const Article = mongoose.model("Article", articleSchema);
////////////request targetting all articles////////////////
//395. Chained Route Handlers Using Express
app
  .route("/articles")

  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err00000);
      }
    });
  })

  .post(function (req, res) {
    //.body : grab some data that was sent through
    // when the requests gets passed by body-paser,
    //tap into a vairiable called title
    //   console.log(req.body.title);
    //   console.log(req.body.content);

    // create
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    //save newArticle
    newArticle.save(function (err) {
      if (!err) {
        res.send("successfully!");
      } else {
        res.send(err);
      }
    }); // after doing this, there will be one more entry in robot 3t
  })

  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("successfully!");
      } else {
        res.send(err);
      }
    });
  });

////////////request targetting a specific article////////////////
app
  .route("/articles/:articleTitle")

  .get(function (req, res) {
    Article.findOne({ title: req.params.articleTitle }, function (
      err,
      foundArticle
    ) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("no articles matching that title was found");
      }
    });
  })

  .put(function (req, res) {
    Article.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("successfully!");
        } else {
          res.send(err);
        }
      }
    );
  }) //如果我们只更新content,update的数据只有content没有title

  .patch(function (req, res) {
    Article.update(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("successfully!");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send("successfully!");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
