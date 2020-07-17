import "reflect-metadata";
import express from 'express'
import {createConnection } from 'typeorm'
import { ApolloServer } from 'apollo-server-express'
import {buildSchema} from 'type-graphql'
import bodyParser from 'body-parser'

import { UserResolver } from './graphql/resolvers/UserResolver';

const startServer = async () => {
  const port = 4000
  const app = express()

  const apolloServer = await new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver]
    })
  })

  apolloServer.applyMiddleware({app})

  app.listen(port, () => {
    console.log(`
      App is running at http://localhost:${port}
      GraphQL is running at http://localhost:${port}/graphql
    `)
  })
   
  await createConnection()
  
}

startServer()