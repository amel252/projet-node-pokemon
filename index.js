const express = require("express");
const PORT = process.env.PORT || 5003;

const app = express();

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
