[deBetting - work for Chainlink Hackaton Fall 2022]

The project to be sent as hackaton work is a football betting app. Betting is performed fully on blockchain and Chainlink Oracle is used for feeding smartcontracts with match results. Moreover, the pool of tokens sent by user to bet is sent to Yearn protocol, which makes tokens ‘work’ additionally, generating more income for players. For additional revenue of using the app, is dedicated “BET” token for those who win the game.
The application consists from components:

- Smartcontracts - deployed to Goerli Ethereum testnet. They are divided by: betting app logic, integration with Chainlink Oracle, ERC20 “BET” token and integration with Yearn protocol
- Frontend - connects to backed for cached data and with blockchain to allow users interact with the application
- Backend - caches necessary information to guarantee app performance and reduce usage costs and takes role of External API Adapter for feeding the Chainlink node
- Chainlink node - the Chainlink module that processes requests from smartcontracts, connects with external API and feeds smartcontracts back with match results

## Team
- Seweryn Kras, Frontend, Backend (sewerynkras@gmail.com)
- Jan Kwiatkowski, Blockchain, Chainlink Node Jobs (jan.kwiatkowski.web3@gmail.com)
- Przemyslaw Welenc, Frontend, Backend, Design (przemo246@gmail.com)
- Kamil Piekos, Frontend, Design (kamcio190@gmail.com)
- Dawid Walas, Blockchain, Chainlink Node Jobs (silverowiec@gmail.com)

## Core functionalities
Getting information about upcoming matches
Betting for match results: Team A wins, Team B wins, Draw
Depositing and withdrawal of DAI token (to bet/to get prize)
Buying and minting BET tokens to boost your vote

## App logic remarks
Users can bet only once for a single match, depositing DAI tokens
Betting app does not store any tokens, it sends them directly to Yearn protocol
Total amount of tokens for a particular match is divided by winners, directly from Yearn protocol
Each winner gets 1 BET token. After collecting 1000+ BET tokens, they can count on increased prize

## Run production docker-compose setup

1. Create a `.env.prod` file in the `backend_server` directory according to the structure of `./backend_server/.env.example` (backend variables). NOTE: database hostname should be `database_prod` and **not** `localhost` - example DATABASE_URL would be `postgresql://user:pass@database_prod:5432/db_name?schema=public`
2. Create a `.env.prod` file in the `frontend_client` directory according to the structure of `./frontend_client/.env.example` (frontend variables) 
3. Run `docker-compose up`

## Setup and seed backend

1. install dependencies  
    ```sh
   $ cd backend_server
   $ npm install
    ```
2. Create a `.env` file in the backend directory. You can provide your own values or copy `./backend_server/.env.example`
3. Setup prisma
    ```sh
   $ npx prisma generate
   $ npx prisma migrate deploy
   $ npx prisma db seed
    ```
4. Start the dev server
    ```sh
    $ npm run dev
    ```
