import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs'

//Mutation and query functions
import {apiStatus, items, item, signature} from '../queries/queries.js'
import {loginUser, addItem, deleteItem, editItem, updateOrder} from '../mutations/mutations.js'

export const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    apiStatus,
    items,
    item,
    signature
  },
  Mutation: {
    createUser: (parent, args, context, info) => {
      return {
        firstName: args.firstName,
        lastName: args.lastName
      }
    },
    loginUser,
    addItem,
    deleteItem,
    editItem,
    updateOrder
  }
}
