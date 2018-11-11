//const createHandler = require("azure-function-express").createHandler;
//const express = require("express");
// const bodyParser = require("body-parser");
// const { postgraphile } = require("postgraphile");

// Create express app as usual
//const app = express();

// app.use(bodyParser.json());

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// app.use(
//   postgraphile(databaseURL, databaseSchemaName, {
//     graphiql: true,
//     dynamicJson: true,
//     extendedErrors: ["hint", "detail", "errcode"],
//     showErrorStack: true,
//     graphqlRoute: "/api/graphql",
//     graphiqlRoute: "/api/graphiql"
//   })
// );

// app.get("/api/:foo/:bar", (req, res) => {
//   res.json({
//     foo: req.params.foo,
//     bar: req.params.bar
//   });
// });

// app.get("/api/graphql", (req, res) => {
//   path = process.env.WEBSITE_ROOT_PATH;
//   rootHtml = path + "\\graphiql.html";
//   //funcDir = req.context.functionDirectory;
//   req.context.log("calling get for html");
//   res.sendFile(rootHtml);
//   // res.json({
//   //   rootPath: path,
//   //   rootHtml: rootHtml,
//   //   functionDir: funcDir
//   // });
// });

// app.post("/api/graphql", (req, res) => {
//   console.log("Calling post");
//   const query = req.body.query;
//   const databaseSchemaName = process.env.DATABASE_SCHEMA;
//   const databaseURL = process.env.DATABASE_CONNECTION_STRING;

//   if (!databaseURL) {
//     throw new Error(
//       "Define a DATABASE_CONNECTION_STRING in an .env file. See env.example."
//     );
//   }

//   graphql(query, databaseURL, databaseSchemaName)
//     .then(result => {
//       res.json(result);
//     })
//     .catch(e => {
//       res.json({ error: e });
//       console.log(e);
//     });
// });

// const port = process.env.PORT || 7071;
// app.listen(port || 7071, () =>
//   console.log("Example app listening on port: " + port)
// );

// Binds the express app to an Azure Function handler
//module.exports = createHandler(app);

const graphql = require("./graphql");

module.exports = async function(context, req, res) {
  const query = req.body.query;
  const databaseSchemaName = process.env.DATABASE_SCHEMA;
  const databaseURL = process.env.DATABASE_CONNECTION_STRING;

  if (!databaseURL) {
    throw new Error(
      "Define a DATABASE_CONNECTION_STRING in an .env file. See env.example."
    );
  }

  const graphRes = await graphql(query, databaseURL, databaseSchemaName)
    .then(result => {
      console.log(JSON.stringify(result));
      return JSON.stringify(result);
    })
    .catch(e => {
      console.log(e);
      return JSON.stringify({ error: e });
    });

  context.res = {
    status: 200,
    body: graphRes,
    isRaw: true,
    headers: {
      "Content-Type": "application/json"
    }
  };
};
