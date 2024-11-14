import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { Resolvers } from "./generated/graphql";
import mongoose from "mongoose";

import { COUNTER_CONTRACT_ABI } from "./abi/counter";
import { ethers, JsonRpcProvider } from "ethers";

import path from "path";
import { User } from "./models/user";
import { GraphQLError } from "graphql";

// const web3 = new Web3("https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID");
const provider = new JsonRpcProvider(process.env.RPC_URL);

const contractAddress = process.env.CONTRACT_ADDRESS;

const privateKey = process.env.PRIVATE_KEY;

const caller = new ethers.Wallet(privateKey, provider);
console.log("address", caller.address);
// return;
const contract = new ethers.Contract(
  contractAddress,
  COUNTER_CONTRACT_ABI,
  caller
);

// get the name of the directory

const typeDefs = readFileSync(path.join(__dirname, "schema.graphql"), {
  encoding: "utf-8",
});

const resolvers: Resolvers = {
  Query: {
    users: async () => await User.find(),
    count: async () => {
      const count = await contract.getCount();
      return Number(count);
    },
  },
  Mutation: {
    addUser: async (_: any, { name, email }: any) => {
      const user = new User({ name, email });
      await user.save();
      return { id: user._id.toString(), name, email };
    },
    incrementCount: async () => {
      try {
        const tx = await contract.increment({
          gasLimit: 3000000,
        });
        await tx.wait();
      } catch (error) {
        throw new GraphQLError(error.toString(), {
          extensions: {
            code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
          },
        });
      }
      const count = await contract.getCount();

      return Number(count);
    },
  },
};

mongoose.connect(process.env.DB_URL, {});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (formattedError, error) => {
    if (
      formattedError.extensions.code ===
      ApolloServerErrorCode.INTERNAL_SERVER_ERROR
    ) {
      return { message: "Internal server error" };
    }

    // Otherwise return the formatted error.
    return formattedError;
  },
});

(async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
})();
