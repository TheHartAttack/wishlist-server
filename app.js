import 'dotenv/config'
import express from 'express'
import http from 'http'
import {ApolloServer} from '@apollo/server'
import {expressMiddleware} from '@apollo/server/express4'
import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer'
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs'
import bodyParser from 'body-parser'
import {typeDefs} from './schema/schema.js'
import {resolvers} from './resolvers/resolvers.js'
import cors from 'cors'
import mongoose from 'mongoose'

const port = process.env.PORT
const app = express()
const httpServer = http.createServer(app)

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({httpServer})]
})
await server.start()

app.use(cors())
app.use(bodyParser.json())
app.use(graphqlUploadExpress({maxFileSize: 2 * 1000 * 1000}))
app.use(expressMiddleware(server))

//Connect to database
mongoose.connect(process.env.CONNECTION_STRING, {
  dbName: 'wishlist_db'
})
mongoose.connection.once('open', async () => {
  console.log('Connected to database')

  await new Promise(resolve => {
    httpServer.listen({port: port}, resolve)
  })
  console.log(`Server listening on port ${port}`)
})
