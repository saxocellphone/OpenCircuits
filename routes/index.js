const express = require('express');
const express_graphql = require('express-graphql')

const schema = require('../schema/schema')

const router = express.Router();

router.all('/graphql', express_graphql({
  schema,
  graphiql: true
}));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('circuitpage', { title: 'Express' });
});

module.exports = router;
