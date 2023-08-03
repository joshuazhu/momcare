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
const apollo_server_lambda_1 = require("apollo-server-lambda");
const apollo_server_core_1 = require("apollo-server-core");
const Layer = __importStar(require("@effect/io/Layer"));
const Effect = __importStar(require("@effect/io/Effect"));
const db = __importStar(require("./services/db"));
const dishService = __importStar(require("./services/dishes"));
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const dishes_1 = require("./schema/interfaces/dishes");
const mainLive = db.dynamodbLayer(new client_dynamodb_1.DynamoDBClient({
    region: "ap-southeast-2",
})).pipe(Layer.provide(dishService.dishesLayer));
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

    type CreateBookingResponse {
      dateAndMeal: String
      date: String
      meal: String
      dishes: [String]
      totalIngredients: [String]
    }

    input CreateBookingInput {
      date: String 
      meal: String 
      dishes: [String]
    }

    type Mutation {
      createBooking(createBookingInput: CreateBookingInput!): CreateBookingResponse!  
    }
`;
const resolvers = {
    Query: {
        dishes: async () => {
            const program = dishes_1.DishService.pipe(Effect.flatMap(s => s.getAllDishes()), Effect.tap((data) => Effect.sync(() => console.log("Result", data)))).pipe(Effect.catchAllDefect(() => {
                return Effect.log("Unknown defect caught.", { level: "Fatal" });
            }));
            const runnable = Effect.provideLayer(program, mainLive);
            return Effect.runPromise(runnable);
        },
        dish: async (_parent, args, _contextValue, _info) => {
            const program = dishes_1.DishService.pipe(Effect.flatMap(s => s.getDishByTitle(args.title)), Effect.tap((data) => Effect.sync(() => console.log("Result", data)))).pipe(Effect.catchAllDefect(() => {
                return Effect.log("Unknown defect caught.", { level: "Fatal" });
            }));
            const runnable = Effect.provideLayer(program, mainLive);
            return Effect.runPromise(runnable);
        },
        mealTypes: () => ["Breakfast", "Dinner", "Lunch", "Supper"],
    },
    Mutation: {
        createBooking: async (_parent, request) => {
            const { date, meal, dishes } = request.createBookingInput;
            console.log(date, meal, dishes, "123");
        },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtEQUFvRDtBQUNwRCwyREFBK0U7QUFDL0Usd0RBQTBDO0FBQzFDLDBEQUE0QztBQUc1QyxrREFBb0M7QUFDcEMsK0RBQWlEO0FBRWpELDhEQUEwRDtBQUMxRCx1REFBeUQ7QUFFekQsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FDL0IsSUFBSSxnQ0FBYyxDQUFDO0lBQ2pCLE1BQU0sRUFBRSxnQkFBZ0I7Q0FDekIsQ0FBQyxDQUNILENBQUMsSUFBSSxDQUNKLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUN2QyxDQUFBO0FBRUQsTUFBTSxRQUFRLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQThCaEIsQ0FBQztBQUVGLE1BQU0sU0FBUyxHQUFHO0lBQ2hCLEtBQUssRUFBRTtRQUNMLE1BQU0sRUFBRSxLQUFLLElBQUksRUFBRTtZQUNqQixNQUFNLE9BQU8sR0FBRyxvQkFBVyxDQUFDLElBQUksQ0FDOUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxFQUNyQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUMvQyxDQUNGLENBQUMsSUFBSSxDQUNKLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFO2dCQUN6QixPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUNsRSxDQUFDLENBQUMsQ0FDSCxDQUFBO1lBRUQsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDeEQsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFFRCxJQUFJLEVBQUUsS0FBSyxFQUNULE9BQVksRUFDWixJQUF1QixFQUN2QixhQUFrQixFQUNsQixLQUFVLEVBQ1YsRUFBRTtZQUNGLE1BQU0sT0FBTyxHQUFHLG9CQUFXLENBQUMsSUFBSSxDQUM5QixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFDakQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQ2xCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FDL0MsQ0FDRixDQUFDLElBQUksQ0FDSixNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRTtnQkFDekIsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDbEUsQ0FBQyxDQUFDLENBQ0gsQ0FBQTtZQUVELE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3hELE9BQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBRUQsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUNkLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFvQjtLQUNoRTtJQUVELFFBQVEsRUFBRTtRQUNSLGFBQWEsRUFBRSxLQUFLLEVBQUUsT0FBWSxFQUFFLE9BQVksRUFBRSxFQUFFO1lBQ2xELE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztZQUUxRCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLENBQUM7S0FDRjtDQUNGLENBQUM7QUFFRixNQUFNLE1BQU0sR0FBRyxJQUFJLG1DQUFZLENBQUM7SUFDOUIsUUFBUTtJQUNSLFNBQVM7SUFDVCxjQUFjLEVBQUUsSUFBSTtJQUNwQixLQUFLLEVBQUUsU0FBUztJQUNoQixPQUFPLEVBQUUsQ0FBQyxJQUFBLDhEQUF5QyxFQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7Q0FDdEUsQ0FBQyxDQUFDO0FBRUgsT0FBTyxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcG9sbG9TZXJ2ZXIgfSBmcm9tIFwiYXBvbGxvLXNlcnZlci1sYW1iZGFcIjtcbmltcG9ydCB7IEFwb2xsb1NlcnZlclBsdWdpbkxhbmRpbmdQYWdlTG9jYWxEZWZhdWx0IH0gZnJvbSBcImFwb2xsby1zZXJ2ZXItY29yZVwiO1xuaW1wb3J0ICogYXMgTGF5ZXIgZnJvbSBcIkBlZmZlY3QvaW8vTGF5ZXJcIjtcbmltcG9ydCAqIGFzIEVmZmVjdCBmcm9tIFwiQGVmZmVjdC9pby9FZmZlY3RcIjtcblxuaW1wb3J0IHsgTWVhbFR5cGUgfSBmcm9tIFwiLi9zY2hlbWEvc2NoZW1hc1wiO1xuaW1wb3J0ICogYXMgZGIgZnJvbSBcIi4vc2VydmljZXMvZGJcIjtcbmltcG9ydCAqIGFzIGRpc2hTZXJ2aWNlIGZyb20gXCIuL3NlcnZpY2VzL2Rpc2hlc1wiO1xuXG5pbXBvcnQgeyBEeW5hbW9EQkNsaWVudCB9IGZyb20gXCJAYXdzLXNkay9jbGllbnQtZHluYW1vZGJcIjtcbmltcG9ydCB7IERpc2hTZXJ2aWNlIH0gZnJvbSBcIi4vc2NoZW1hL2ludGVyZmFjZXMvZGlzaGVzXCI7XG5cbmNvbnN0IG1haW5MaXZlID0gZGIuZHluYW1vZGJMYXllcihcbiAgbmV3IER5bmFtb0RCQ2xpZW50KHtcbiAgICByZWdpb246IFwiYXAtc291dGhlYXN0LTJcIixcbiAgfSlcbikucGlwZShcbiAgTGF5ZXIucHJvdmlkZShkaXNoU2VydmljZS5kaXNoZXNMYXllcilcbilcblxuY29uc3QgdHlwZURlZnMgPSBgI2dyYXBocWxcbiAgICB0eXBlIERpc2gge1xuICAgICAgdGl0bGU6IFN0cmluZ1xuICAgICAgaW5ncmVkaWVudHM6IFtTdHJpbmddXG4gICAgICBjYXRlZ29yeTogU3RyaW5nXG4gICAgfVxuXG4gICAgdHlwZSBRdWVyeSB7XG4gICAgICBkaXNoZXM6IFtEaXNoXVxuICAgICAgZGlzaCh0aXRsZTogU3RyaW5nISk6IERpc2hcbiAgICAgIG1lYWxUeXBlczogW1N0cmluZ11cbiAgICB9XG5cbiAgICB0eXBlIENyZWF0ZUJvb2tpbmdSZXNwb25zZSB7XG4gICAgICBkYXRlQW5kTWVhbDogU3RyaW5nXG4gICAgICBkYXRlOiBTdHJpbmdcbiAgICAgIG1lYWw6IFN0cmluZ1xuICAgICAgZGlzaGVzOiBbU3RyaW5nXVxuICAgICAgdG90YWxJbmdyZWRpZW50czogW1N0cmluZ11cbiAgICB9XG5cbiAgICBpbnB1dCBDcmVhdGVCb29raW5nSW5wdXQge1xuICAgICAgZGF0ZTogU3RyaW5nIFxuICAgICAgbWVhbDogU3RyaW5nIFxuICAgICAgZGlzaGVzOiBbU3RyaW5nXVxuICAgIH1cblxuICAgIHR5cGUgTXV0YXRpb24ge1xuICAgICAgY3JlYXRlQm9va2luZyhjcmVhdGVCb29raW5nSW5wdXQ6IENyZWF0ZUJvb2tpbmdJbnB1dCEpOiBDcmVhdGVCb29raW5nUmVzcG9uc2UhICBcbiAgICB9XG5gO1xuXG5jb25zdCByZXNvbHZlcnMgPSB7XG4gIFF1ZXJ5OiB7XG4gICAgZGlzaGVzOiBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9ncmFtID0gRGlzaFNlcnZpY2UucGlwZShcbiAgICAgICAgRWZmZWN0LmZsYXRNYXAocyA9PiBzLmdldEFsbERpc2hlcygpKSxcbiAgICAgICAgRWZmZWN0LnRhcCgoZGF0YSkgPT5cbiAgICAgICAgICBFZmZlY3Quc3luYygoKSA9PiBjb25zb2xlLmxvZyhcIlJlc3VsdFwiLCBkYXRhKSlcbiAgICAgICAgKVxuICAgICAgKS5waXBlKFxuICAgICAgICBFZmZlY3QuY2F0Y2hBbGxEZWZlY3QoKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBFZmZlY3QubG9nKFwiVW5rbm93biBkZWZlY3QgY2F1Z2h0LlwiLCB7IGxldmVsOiBcIkZhdGFsXCIgfSk7XG4gICAgICAgIH0pXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHJ1bm5hYmxlID0gRWZmZWN0LnByb3ZpZGVMYXllcihwcm9ncmFtLCBtYWluTGl2ZSk7XG4gICAgICByZXR1cm4gRWZmZWN0LnJ1blByb21pc2UocnVubmFibGUpO1xuICAgIH0sXG5cbiAgICBkaXNoOiBhc3luYyAoXG4gICAgICBfcGFyZW50OiBhbnksXG4gICAgICBhcmdzOiB7IHRpdGxlOiBzdHJpbmcgfSxcbiAgICAgIF9jb250ZXh0VmFsdWU6IGFueSxcbiAgICAgIF9pbmZvOiBhbnlcbiAgICApID0+IHtcbiAgICAgIGNvbnN0IHByb2dyYW0gPSBEaXNoU2VydmljZS5waXBlKFxuICAgICAgICBFZmZlY3QuZmxhdE1hcChzID0+IHMuZ2V0RGlzaEJ5VGl0bGUoYXJncy50aXRsZSkpLFxuICAgICAgICBFZmZlY3QudGFwKChkYXRhKSA9PlxuICAgICAgICAgIEVmZmVjdC5zeW5jKCgpID0+IGNvbnNvbGUubG9nKFwiUmVzdWx0XCIsIGRhdGEpKVxuICAgICAgICApXG4gICAgICApLnBpcGUoXG4gICAgICAgIEVmZmVjdC5jYXRjaEFsbERlZmVjdCgoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIEVmZmVjdC5sb2coXCJVbmtub3duIGRlZmVjdCBjYXVnaHQuXCIsIHsgbGV2ZWw6IFwiRmF0YWxcIiB9KTtcbiAgICAgICAgfSlcbiAgICAgIClcblxuICAgICAgY29uc3QgcnVubmFibGUgPSBFZmZlY3QucHJvdmlkZUxheWVyKHByb2dyYW0sIG1haW5MaXZlKTtcbiAgICAgIHJldHVybiBFZmZlY3QucnVuUHJvbWlzZShydW5uYWJsZSk7XG4gICAgfSxcblxuICAgIG1lYWxUeXBlczogKCkgPT5cbiAgICAgIFtcIkJyZWFrZmFzdFwiLCBcIkRpbm5lclwiLCBcIkx1bmNoXCIsIFwiU3VwcGVyXCJdIGFzIEFycmF5PE1lYWxUeXBlPixcbiAgfSxcblxuICBNdXRhdGlvbjoge1xuICAgIGNyZWF0ZUJvb2tpbmc6IGFzeW5jIChfcGFyZW50OiBhbnksIHJlcXVlc3Q6IGFueSkgPT4ge1xuICAgICAgY29uc3QgeyBkYXRlLCBtZWFsLCBkaXNoZXMgfSA9IHJlcXVlc3QuY3JlYXRlQm9va2luZ0lucHV0O1xuXG4gICAgICBjb25zb2xlLmxvZyhkYXRlLCBtZWFsLCBkaXNoZXMsIFwiMTIzXCIpO1xuICAgIH0sXG4gIH0sXG59O1xuXG5jb25zdCBzZXJ2ZXIgPSBuZXcgQXBvbGxvU2VydmVyKHtcbiAgdHlwZURlZnMsXG4gIHJlc29sdmVycyxcbiAgY3NyZlByZXZlbnRpb246IHRydWUsXG4gIGNhY2hlOiBcImJvdW5kZWRcIixcbiAgcGx1Z2luczogW0Fwb2xsb1NlcnZlclBsdWdpbkxhbmRpbmdQYWdlTG9jYWxEZWZhdWx0KHsgZW1iZWQ6IHRydWUgfSldLFxufSk7XG5cbmV4cG9ydHMuZ3JhcGhxbEhhbmRsZXIgPSBzZXJ2ZXIuY3JlYXRlSGFuZGxlcigpO1xuIl19