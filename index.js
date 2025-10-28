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

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
