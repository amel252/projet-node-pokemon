const express = require("express");
const { engine } = require("express-handlebars");
// const exphbs = require("express-handlebars");
const path = require("path");
const PORT = process.env.PORT || 5003;

const app = express();

//middleware(tou ce qui se passe au milieu )
app.use(express.static(path.join(__dirname, "public"))); // il va considérer comme racine du projet et il va l'afficher
//  je vais appelé handlebars qui vient de exphbs
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
    res.render("home", { title: "Home" });
});
// app.get("/about", (req, res) => {
//     res.render("about", { title: "about", subTitle: "Ma about page" });
// });
// ca nous evite de créer une page pour chaque pokémon
app.get("/:title", (req, res) => {
    const title = req.params.title;
    res.render("about", { title, subTitle: `Ma page ${title}` });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
