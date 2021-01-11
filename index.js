const PORT = process.env.PORT ? process.env.PORT : 3000;

let app = require("./app");

app.listen(PORT);
console.log(`Running on ${PORT}`)
