import "reflect-metadata";
import express from 'express'
import {createConnection } from 'typeorm'
import { ApolloServer } from 'apollo-server-express'
import {buildSchema} from 'type-graphql'

// Dotenv 
import dotenv from 'dotenv'
dotenv.config({
  path: ".env"
})
// Resolvers
import { UserResolver } from './graphql/resolvers/UserResolver';
import { PostResolver } from './graphql/resolvers/PostResolver';

const startServer = async () => {
  const apolloServer = await new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver]
    }),
    context: ({ req,  res }) => ({ req,  res })
  })
  await createConnection()
  const port = 4000
  const app = express()

  apolloServer.applyMiddleware({app})

  app.listen(port, () => {
    console.log(`
      App is running at http://localhost:${port}
      GraphQL is running at http://localhost:${port}/graphql
    `)
  })
   
  
}

startServer()