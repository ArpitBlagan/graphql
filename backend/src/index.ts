import express from "express";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import axios from "axios";
dotenv.config();
async function start() {
  const app = express();
  app.use(
    cors({
      origin: ["http://localhost:5173"],
    })
  );
  const server = new ApolloServer({
    typeDefs: `
    type User{
      name:String
      email:String
    }
    type todo{
      id: ID!
      title: String
      completed:Boolean
      userId:ID!
      user:User
    }
    type Query{
      getTodos:[todo]
      getTodo(id:ID!):todo
    }
  `,
    resolvers: {
      todo: {
        user: async (todo) => {
          const res = await axios.get(
            `https://jsonplaceholder.typicode.com/users/${todo.userId}`
          );
          return res.data;
        },
      },
      Query: {
        getTodos: () => [
          { id: 1, title: "fasdfas asdfas", complelted: false, userId: 1 },
        ],
        getTodo: async (parent, { id }) => {
          const res = await axios.get(
            `https://jsonplaceholder.typicode.com/todos/${id}`
          );
          return res.data;
        },
      },
    },
  });

  await server.start();
  app.use(express.json());
  app.use("/graphql", expressMiddleware(server) as any);

  app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
  });
}
start();
