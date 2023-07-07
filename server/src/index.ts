import * as z from 'zod'
import { ApolloServer } from "apollo-server-lambda";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { DishSchema } from "./repository/dish"
import { getAll } from './repository/db'


const typeDefs = `#graphql
    type Dish {
        title: String
        photos: [String]
        spicyLevel: Int
        whoLovesIt: [String]
        cost: Float
    }

    type Query {
        dishes: [Dish]
    }
`;

const resolvers = {
  Query: {
    dishes: async () => {
      console.log('!!11')
      const data = await getAll('home-meal-server-dev-dish')
      console.log('data', data)
      const dishes = z.array(DishSchema).parse(data);
      console.log('!!dishes', dishes)
      return dishes
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: 'bounded',
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

exports.graphqlHandler = server.createHandler();
