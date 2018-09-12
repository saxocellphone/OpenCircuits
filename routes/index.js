var express = require('express');
var express_graphql = require('express-graphql')
var { buildSchema } = require('graphql');

// GraphQL schema
var schema = buildSchema(`
    type Query {
        message: String
    }
`);

// Root resolver
var root = {
  message: () => 'Hello World!'
};

var router = express.Router();

router.get('/graphql', express_graphql({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('circuitpage', { title: 'Express' });
});

module.exports = router;
