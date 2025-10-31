const express = require("express");
// import express-handlebars =>
const { engine } = require("express-handlebars");
// import fetch(commonJs) =>
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

const path = require("path");
const bodyParser = require("body-parser");

// import mais avec précision que string
const helpers = require("handlebars-helpers")(["string"]);

const PORT = process.env.PORT || 5003;
const app = express();

const catchErrors =
    (asyncFunction) =>
    (...args) =>
        asyncFunction(...args).catch(console.error);
// Explication : La fonction catchErrors sert à éviter que ton programme plante quand une fonction asynchrone (avec async/await) fait une erreur. un petit outil pour ne plus avoir besoin de mettre des try...catch partout.

//  récuperer toute la date
const getAllPokemon = async () => {
    try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        if (!res.ok) {
            console.error("Erreur API:", res.status, res.statusText);
            return null;
        }
        const json = await res.json();
        return json;
    } catch (err) {
        console.error("Erreur fetch :", err);
        return null;
    }
};

// récuperer un seul élement
const getPokemon = async (pokemon = "1") => {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        if (!res.ok) {
            // ⚠️ Vérifie si la requête a réussi
            console.error("Erreur API:", res.status, res.statusText);
            return null; // retourne null si le Pokémon n'existe pas
        }
        const json = await res.json();
        return json;
    } catch (err) {
        console.error("Erreur fetch :", err);
        return null;
    }
};

//middleware(tout ce qui se passe au milieu )
app.use(express.static(path.join(__dirname, "public"))); // il va considérer public racine du projet et il va l'afficher

//rajout spécifique
app.engine(
    ".hbs",
    engine({
        extname: ".hbs",
        defaultLayout: "main", // ✅ définit le layout principal
        layoutsDir: path.join(__dirname, "views", "layouts"), // ✅ indique où il se trouve
        partialsDir: path.join(__dirname, "views", "partials"), // ✅ pour tes header/footer
    })
);
app.set("view engine", ".hbs");
//  je veux des librairies externe pour charger
app.use(bodyParser.urlencoded({ extended: false }));

// routes
app.get(
    "/",
    catchErrors(async (req, res) => {
        const pokemons = await getAllPokemon();
        res.render("home", { pokemons });
    })
);
// l'ordre est important
app.get("/notFound", (req, res) => {
    res.render("notFound");
});
// ca nous evite de créer une page pour chaque pokémon
app.get(
    "/:pokemon",
    catchErrors(async (req, res) => {
        const search = req.params.pokemon;
        const pokemon = await getPokemon(search);
        // si le pokemon existe sur ma liste il va l'afficher
        if (pokemon) {
            res.render("pokemon", { pokemon });
            // sinon il va afficher page notFound
        } else {
            return res.redirect("/notFound");
        }
    })
);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
