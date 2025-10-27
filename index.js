const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5003;

const app = express();

//middleware(tou ce qui se passe au milieu )
app.use(express.static(path.join(__dirname, "public"))); // il va considérer comme racine du projet et il va l'afficher

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
