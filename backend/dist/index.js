"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = require("@apollo/server");
const cors_1 = __importDefault(require("cors"));
const express4_1 = require("@apollo/server/express4");
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use((0, cors_1.default)({
            origin: ["http://localhost:5173"],
        }));
        const server = new server_1.ApolloServer({
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
                    user: (todo) => __awaiter(this, void 0, void 0, function* () {
                        const res = yield axios_1.default.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`);
                        return res.data;
                    }),
                },
                Query: {
                    getTodos: () => [
                        { id: 1, title: "fasdfas asdfas", complelted: false, userId: 1 },
                    ],
                    getTodo: (parent_1, _a) => __awaiter(this, [parent_1, _a], void 0, function* (parent, { id }) {
                        const res = yield axios_1.default.get(`https://jsonplaceholder.typicode.com/todos/${id}`);
                        return res.data;
                    }),
                },
            },
        });
        yield server.start();
        app.use(express_1.default.json());
        app.use("/graphql", (0, express4_1.expressMiddleware)(server));
        app.listen(process.env.PORT, () => {
            console.log(`listening on port ${process.env.PORT}`);
        });
    });
}
start();
