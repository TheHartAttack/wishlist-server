export const typeDefs = `#graphql

  #Roots
  type Query {
    apiStatus: ApiStatus
    items(token: String): [Item]
    item(id: ID!): Item
    signature: Signature
  }

  type Mutation {
    createUser(input: UserInput): User
    loginUser(username: String!, password: String!): Token
    addItem(name: String!, price: Int, link: String, notes: String, image: ImageDataInput, private: Boolean, token: String!): ItemResponse
    deleteItem(id: ID!, token: String!): ItemResponse
    editItem(id: ID!, name: String!, price: Int, link: String, notes: String, image: ImageDataInput, imageUpdated: Boolean, private: Boolean, token: String!): ItemResponse
    updateOrder(items: [ID], token: String!): ItemsResponse
  }
  #/Roots

  #Types
  type ApiStatus {
    status: String
  }

  type ItemResponse {
    item: Item
    errors: [String]
  }

  type ItemsResponse {
    success: Boolean
  }

  type Item {
    id: ID
    name: String
    price: Int
    notes: String
    link: String
    image: String
    private: Boolean
    order: Int
  }

  type User {
    firstName: String
    lastName: String
    email: String
  }

  type Signature {
    signature: String
    timestamp: Int
  }

  type Token {
    token: String
    errors: [String]
  }
  #/Types

  #Inputs
  input UserInput {
    firstName: String
    lastName: String
    email: String
    password: String
  }

  input ImageDataInput {
    public_id: String
    version: Int
    signature: String
  }

  input LoginInput {
    username: String
    password: String
  }
  #/Inputs

  #Scalars
  scalar Upload
  #/Scalars
`
