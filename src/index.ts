import {ApolloServer, gql} from 'apollo-server'
import {GraphQLResolveInfo} from 'graphql'

class Book {
    id!: number;
    title!: string;
    author_id!: number;
}

class Author {
    id!: number;
    name!: string;
    nationality!: string;
}

const books = [
    {
        id: 1,
        title: 'Harry Potter and the Chamber of Secrets',
        author_id: 1,
    },
    {
        id: 2,
        title: 'Jurassic Park',
        author_id: 2,
    },
];

const authors = [
    {
        id: 1,
        name: 'J.K. Rowling',
        nationality: 'UK',
    },
    {
        id: 2,
        name: 'Michael Crichton',
        nationality: 'USA'
    }
];

interface IBookQuery {
    id: number
}

interface IAuthorQuery {
    id: number
}

const typeDefs = gql`
type Book {
    id: ID!
    title: String!
    author: Author
}

type Author {
    id: ID!
    name: String!
    nationality: String!
    books: [Book]
}

type Query {
    books: [Book]!
    book(id: ID!): Book!
    authors: [Author]!
    author(id: ID!): Author!
}
`;

const resolvers = {
    Query: {
        books: () => books,
        book: (obj:any, args:IBookQuery) => books.find(e => e.id == args.id),
        authors: () => authors,
        author: (obj:any, args:IAuthorQuery) => authors.find(e => e.id == args.id)
        
    },
    Book: {
        author: (obj:Book, args:any, context:any, info:any) => authors.find(e => e.id == obj.author_id)
    },
    Author: {
        books: (obj:Author, args: any, context: any, info: any) => {
            console.log(info.fieldNodes[0].selectionSet);
            return books.filter(e => e.author_id == obj.id);
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(5000).then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
