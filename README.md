# gql-web3

This project integrates GraphQL with Web3 and MongoDB. It uses Apollo Server to create a GraphQL API and Web3.js to interact with Ethereum smart contracts.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/gql-web3.git
   cd gql-web3
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Set up your environment variables:

   - Replace `YOUR_INFURA_PROJECT_ID` in `src/index.ts` with your Infura project ID.
   - Replace `YOUR_CONTRACT_ADDRESS` in `src/index.ts` with your smart contract address.

### Generating Resolver Types

To generate the resolver types, run the following command:

```sh
npm run codegen
```

### Running the Project

1. Start your MongoDB server.

2. Compile the TypeScript code:

   ```sh
   npm run compile
   ```

3. Start the server:

   ```sh
   npm start
   ```

The server should now be running on `http://localhost:4000`.

## Project Structure

- `src/`: Contains the source code.
  - `index.ts`: Entry point of the application.
  - `generated/`: Contains the generated GraphQL types and resolvers.
- `schema.graphql`: GraphQL schema definition.
- `codegen.ts`: Configuration for GraphQL code generation.

## Scripts

- `npm run compile`: Compiles the TypeScript code.
- `npm start`: Compiles the code and starts the server.
- `npm run codegen`: Generates the GraphQL resolver types.

## License

This project is licensed under the MIT License.
