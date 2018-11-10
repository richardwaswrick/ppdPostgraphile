const createHandler = require("azure-function-express").createHandler;
const express = require("express");
const { postgraphile } = require("postgraphile");

const databaseSchemaName = process.env.DATABASE_SCHEMA;
const databaseURL = process.env.DATABASE_CONNECTION_STRING;
const port = process.env.PORT;

if (!databaseURL) {
  throw new Error(
    "Define a DATABASE_CONNECTION_STRING in an .env file. See env.example."
  );
}

const app = express();
app.use(postgraphile(databaseURL, databaseSchemaName));
app.listen(port, () => console.log("App listening on port: " + port));

// Binds the express app to an Azure Function handler
module.exports = createHandler(app);
