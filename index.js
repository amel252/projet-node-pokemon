const express = require("express");
const { engine } = require("express-handlebars");
// const fetch = require("node-fetch");
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

// const exphbs = require("express-handlebars");
const path = require("path");
const PORT = process.env.PORT || 5003;
const app = express();

const catchErrors =
    (asyncFunction) =>
    (...args) =>
        asyncFunction(...args).catch(console.error);
// Explication : La fonction catchErrors sert à éviter que ton programme plante quand une fonction asynchrone (avec async/await) fait une erreur. un petit outil pour ne plus avoir besoin de mettre des try...catch partout.

//  récuperer la data
const getAllPokemon = catchErrors(async () => {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    const json = await res.json();
    console.table(json.results);
    return json;
});
//middleware(tou ce qui se passe au milieu )
app.use(express.static(path.join(__dirname, "public"))); // il va considérer comme racine du projet et il va l'afficher
//  je vais appelé handlebars qui vient de exphbs
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");

// routes
app.get(
    "/",
    catchErrors(async (req, res) => {
        const pokemons = await getAllPokemon();
        res.render("home", { pokemons });
    })
);
// ca nous evite de créer une page pour chaque pokémon
app.get("/:title", (req, res) => {
    const title = req.params.title;
    res.render("about", { title, subTitle: `Ma page ${title}` });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
