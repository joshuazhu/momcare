"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const z = __importStar(require("zod"));
const apollo_server_lambda_1 = require("apollo-server-lambda");
const apollo_server_core_1 = require("apollo-server-core");
const Layer = __importStar(require("@effect/io/Layer"));
const Effect = __importStar(require("@effect/io/Effect"));
const schemas_1 = require("./schema/schemas");
const db = __importStar(require("./services/db"));
const db_1 = require("./schema/interfaces/db");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const mainLive = Layer.mergeAll(db.dynamodbLayer(new client_dynamodb_1.DynamoDBClient({
    region: "ap-southeast-2",
})));
const typeDefs = `#graphql
    type Dish {
        title: String
        ingredients: [String]
        category: String
    }

    type Query {
        dishes: [Dish]
        dish(title: String!): Dish
        mealTypes: [String]
    }
`;
const resolvers = {
    Query: {
        dishes: async () => {
            const program = db_1.DynamoDB.pipe(Effect.flatMap((db) => db.getAll("momcare-server-dev-dish")), Effect.flatMap((data) => Effect.sync(() => z.array(schemas_1.DishSchema).parse(data))), Effect.tap((data) => Effect.sync(() => console.log("transformed data", data)))).pipe(Effect.catchAllDefect(() => {
                return Effect.log("Unknown defect caught.", { level: "Fatal" });
            }));
            const runnable = Effect.provideLayer(program, mainLive);
            return Effect.runPromise(runnable);
        },
        dish: async (_parent, args, _contextValue, _info) => {
            const program = db_1.DynamoDB.pipe(Effect.flatMap((db) => db.getByKey("momcare-server-dev-dish", "title", args.title)), Effect.flatMap((data) => Effect.sync(() => schemas_1.DishSchema.parse(data))), Effect.tap((data) => Effect.sync(() => console.log("transformed data", data)))).pipe(Effect.catchAllDefect(() => {
                return Effect.log("Unknown defect caught.", { level: "Fatal" });
            }));
            const runnable = Effect.provideLayer(program, mainLive);
            return Effect.runPromise(runnable);
        },
        mealTypes: () => ["Breakfast", "Dinner", "Lunch", "Supper"],
    },
};
const server = new apollo_server_lambda_1.ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [(0, apollo_server_core_1.ApolloServerPluginLandingPageLocalDefault)({ embed: true })],
});
exports.graphqlHandler = server.createHandler();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVDQUF5QjtBQUN6QiwrREFBb0Q7QUFDcEQsMkRBQStFO0FBQy9FLHdEQUEwQztBQUMxQywwREFBNEM7QUFFNUMsOENBQXdEO0FBQ3hELGtEQUFvQztBQUNwQywrQ0FBa0Q7QUFFbEQsOERBQTBEO0FBRTFELE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQzdCLEVBQUUsQ0FBQyxhQUFhLENBQ2QsSUFBSSxnQ0FBYyxDQUFDO0lBQ2pCLE1BQU0sRUFBRSxnQkFBZ0I7Q0FDekIsQ0FBQyxDQUNILENBQ0YsQ0FBQztBQUVGLE1BQU0sUUFBUSxHQUFHOzs7Ozs7Ozs7Ozs7Q0FZaEIsQ0FBQztBQUVGLE1BQU0sU0FBUyxHQUFHO0lBQ2hCLEtBQUssRUFBRTtRQUNMLE1BQU0sRUFBRSxLQUFLLElBQUksRUFBRTtZQUNqQixNQUFNLE9BQU8sR0FBRyxhQUFRLENBQUMsSUFBSSxDQUMzQixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLHlCQUF5QixDQUFDLENBQUMsRUFDNUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxvQkFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQ25ELEVBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQ2xCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUN6RCxDQUNGLENBQUMsSUFBSSxDQUNKLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFO2dCQUN6QixPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUNsRSxDQUFDLENBQUMsQ0FDSCxDQUFDO1lBRUYsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFeEQsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFFRCxJQUFJLEVBQUUsS0FBSyxFQUNULE9BQVksRUFDWixJQUF1QixFQUN2QixhQUFrQixFQUNsQixLQUFVLEVBQ1YsRUFBRTtZQUNGLE1BQU0sT0FBTyxHQUFHLGFBQVEsQ0FBQyxJQUFJLENBQzNCLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUNwQixFQUFFLENBQUMsUUFBUSxDQUFDLHlCQUF5QixFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQzVELEVBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxvQkFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQ25FLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FDekQsQ0FDRixDQUFDLElBQUksQ0FDSixNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRTtnQkFDekIsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDbEUsQ0FBQyxDQUFDLENBQ0gsQ0FBQztZQUVGLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3hELE9BQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBRUQsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUNkLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFvQjtLQUNoRTtDQUNGLENBQUM7QUFFRixNQUFNLE1BQU0sR0FBRyxJQUFJLG1DQUFZLENBQUM7SUFDOUIsUUFBUTtJQUNSLFNBQVM7SUFDVCxjQUFjLEVBQUUsSUFBSTtJQUNwQixLQUFLLEVBQUUsU0FBUztJQUNoQixPQUFPLEVBQUUsQ0FBQyxJQUFBLDhEQUF5QyxFQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7Q0FDdEUsQ0FBQyxDQUFDO0FBRUgsT0FBTyxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB6IGZyb20gXCJ6b2RcIjtcbmltcG9ydCB7IEFwb2xsb1NlcnZlciB9IGZyb20gXCJhcG9sbG8tc2VydmVyLWxhbWJkYVwiO1xuaW1wb3J0IHsgQXBvbGxvU2VydmVyUGx1Z2luTGFuZGluZ1BhZ2VMb2NhbERlZmF1bHQgfSBmcm9tIFwiYXBvbGxvLXNlcnZlci1jb3JlXCI7XG5pbXBvcnQgKiBhcyBMYXllciBmcm9tIFwiQGVmZmVjdC9pby9MYXllclwiO1xuaW1wb3J0ICogYXMgRWZmZWN0IGZyb20gXCJAZWZmZWN0L2lvL0VmZmVjdFwiO1xuXG5pbXBvcnQgeyBEaXNoU2NoZW1hLCBNZWFsVHlwZSB9IGZyb20gXCIuL3NjaGVtYS9zY2hlbWFzXCI7XG5pbXBvcnQgKiBhcyBkYiBmcm9tIFwiLi9zZXJ2aWNlcy9kYlwiO1xuaW1wb3J0IHsgRHluYW1vREIgfSBmcm9tIFwiLi9zY2hlbWEvaW50ZXJmYWNlcy9kYlwiO1xuXG5pbXBvcnQgeyBEeW5hbW9EQkNsaWVudCB9IGZyb20gXCJAYXdzLXNkay9jbGllbnQtZHluYW1vZGJcIjtcblxuY29uc3QgbWFpbkxpdmUgPSBMYXllci5tZXJnZUFsbChcbiAgZGIuZHluYW1vZGJMYXllcihcbiAgICBuZXcgRHluYW1vREJDbGllbnQoe1xuICAgICAgcmVnaW9uOiBcImFwLXNvdXRoZWFzdC0yXCIsXG4gICAgfSlcbiAgKVxuKTtcblxuY29uc3QgdHlwZURlZnMgPSBgI2dyYXBocWxcbiAgICB0eXBlIERpc2gge1xuICAgICAgICB0aXRsZTogU3RyaW5nXG4gICAgICAgIGluZ3JlZGllbnRzOiBbU3RyaW5nXVxuICAgICAgICBjYXRlZ29yeTogU3RyaW5nXG4gICAgfVxuXG4gICAgdHlwZSBRdWVyeSB7XG4gICAgICAgIGRpc2hlczogW0Rpc2hdXG4gICAgICAgIGRpc2godGl0bGU6IFN0cmluZyEpOiBEaXNoXG4gICAgICAgIG1lYWxUeXBlczogW1N0cmluZ11cbiAgICB9XG5gO1xuXG5jb25zdCByZXNvbHZlcnMgPSB7XG4gIFF1ZXJ5OiB7XG4gICAgZGlzaGVzOiBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9ncmFtID0gRHluYW1vREIucGlwZShcbiAgICAgICAgRWZmZWN0LmZsYXRNYXAoKGRiKSA9PiBkYi5nZXRBbGwoXCJtb21jYXJlLXNlcnZlci1kZXYtZGlzaFwiKSksXG4gICAgICAgIEVmZmVjdC5mbGF0TWFwKChkYXRhKSA9PlxuICAgICAgICAgIEVmZmVjdC5zeW5jKCgpID0+IHouYXJyYXkoRGlzaFNjaGVtYSkucGFyc2UoZGF0YSkpXG4gICAgICAgICksXG4gICAgICAgIEVmZmVjdC50YXAoKGRhdGEpID0+XG4gICAgICAgICAgRWZmZWN0LnN5bmMoKCkgPT4gY29uc29sZS5sb2coXCJ0cmFuc2Zvcm1lZCBkYXRhXCIsIGRhdGEpKVxuICAgICAgICApXG4gICAgICApLnBpcGUoXG4gICAgICAgIEVmZmVjdC5jYXRjaEFsbERlZmVjdCgoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIEVmZmVjdC5sb2coXCJVbmtub3duIGRlZmVjdCBjYXVnaHQuXCIsIHsgbGV2ZWw6IFwiRmF0YWxcIiB9KTtcbiAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IHJ1bm5hYmxlID0gRWZmZWN0LnByb3ZpZGVMYXllcihwcm9ncmFtLCBtYWluTGl2ZSk7XG5cbiAgICAgIHJldHVybiBFZmZlY3QucnVuUHJvbWlzZShydW5uYWJsZSk7XG4gICAgfSxcbiAgICBcbiAgICBkaXNoOiBhc3luYyAoXG4gICAgICBfcGFyZW50OiBhbnksXG4gICAgICBhcmdzOiB7IHRpdGxlOiBzdHJpbmcgfSxcbiAgICAgIF9jb250ZXh0VmFsdWU6IGFueSxcbiAgICAgIF9pbmZvOiBhbnlcbiAgICApID0+IHtcbiAgICAgIGNvbnN0IHByb2dyYW0gPSBEeW5hbW9EQi5waXBlKFxuICAgICAgICBFZmZlY3QuZmxhdE1hcCgoZGIpID0+XG4gICAgICAgICAgZGIuZ2V0QnlLZXkoXCJtb21jYXJlLXNlcnZlci1kZXYtZGlzaFwiLCBcInRpdGxlXCIsIGFyZ3MudGl0bGUpXG4gICAgICAgICksXG4gICAgICAgIEVmZmVjdC5mbGF0TWFwKChkYXRhKSA9PiBFZmZlY3Quc3luYygoKSA9PiBEaXNoU2NoZW1hLnBhcnNlKGRhdGEpKSksXG4gICAgICAgIEVmZmVjdC50YXAoKGRhdGEpID0+XG4gICAgICAgICAgRWZmZWN0LnN5bmMoKCkgPT4gY29uc29sZS5sb2coXCJ0cmFuc2Zvcm1lZCBkYXRhXCIsIGRhdGEpKVxuICAgICAgICApXG4gICAgICApLnBpcGUoXG4gICAgICAgIEVmZmVjdC5jYXRjaEFsbERlZmVjdCgoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIEVmZmVjdC5sb2coXCJVbmtub3duIGRlZmVjdCBjYXVnaHQuXCIsIHsgbGV2ZWw6IFwiRmF0YWxcIiB9KTtcbiAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IHJ1bm5hYmxlID0gRWZmZWN0LnByb3ZpZGVMYXllcihwcm9ncmFtLCBtYWluTGl2ZSk7XG4gICAgICByZXR1cm4gRWZmZWN0LnJ1blByb21pc2UocnVubmFibGUpO1xuICAgIH0sXG5cbiAgICBtZWFsVHlwZXM6ICgpID0+XG4gICAgICBbXCJCcmVha2Zhc3RcIiwgXCJEaW5uZXJcIiwgXCJMdW5jaFwiLCBcIlN1cHBlclwiXSBhcyBBcnJheTxNZWFsVHlwZT4sXG4gIH0sXG59O1xuXG5jb25zdCBzZXJ2ZXIgPSBuZXcgQXBvbGxvU2VydmVyKHtcbiAgdHlwZURlZnMsXG4gIHJlc29sdmVycyxcbiAgY3NyZlByZXZlbnRpb246IHRydWUsXG4gIGNhY2hlOiBcImJvdW5kZWRcIixcbiAgcGx1Z2luczogW0Fwb2xsb1NlcnZlclBsdWdpbkxhbmRpbmdQYWdlTG9jYWxEZWZhdWx0KHsgZW1iZWQ6IHRydWUgfSldLFxufSk7XG5cbmV4cG9ydHMuZ3JhcGhxbEhhbmRsZXIgPSBzZXJ2ZXIuY3JlYXRlSGFuZGxlcigpO1xuIl19