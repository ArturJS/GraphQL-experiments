const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

// Some fake data
const books = [
    {
        id: 1,
        title: "Harry Potter and the Sorcerer's stone",
        author: 'J.K. Rowling'
    },
    {
        id: 2,
        title: 'Jurassic Park',
        author: 'Michael Crichton'
    }
];

// The GraphQL schema in string form
const typeDefs = `
  type Query { 
      books: [Book] 
      book(id: Int, title: String, author: String): Book
  }
  type Book { id: Int, title: String, author: String }
`;

const isMatchQueryParams = (entity, queryParams) => {
    for (let [key, value] of Object.entries(queryParams)) {
        const hasValue = typeof value !== 'undefined';
        const isNotMatching = entity[key] !== value;

        if (hasValue && isNotMatching) {
            return false;
        }
    }

    return true;
};

// The resolvers
const resolvers = {
    Query: {
        books: () => books,
        book: (root, queryParams) => {
            return books.find(book => isMatchQueryParams(book, queryParams));
        }
    }
};

// Put together a schema
const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

// Initialize the app
const app = express();

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Start the server
app.listen(3000, () => {
    console.log('Go to http://localhost:3000/graphiql to run queries!');
});
