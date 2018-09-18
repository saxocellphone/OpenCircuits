const graphql = require('graphql');
const _  = require('lodash')

const { GraphQLObjectType,
        GraphQLSchema,
        GraphQLString } = graphql;

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        gates: {
            type: GraphQLString,
            resolve(parent, args){
                return "test";
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query:RootQuery
})