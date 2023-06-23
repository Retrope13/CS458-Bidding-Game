# Testing

1. Open Ganache

2. deploy the ganache server

3. generate testing addresses

4. Truffle migrate (deploys contract)

6. Copy contract address into App.js

7. Currently there are some minor bugs with generateRandomNum, but this may be because I don't exactly remember the steps I took when I last looked at this project.

# Production deployment

1. if I were to deploy this on the blockchain (a very real possibility) I would need to mint all of the NFTs before hand and find a secure way to transfer said NFTs.

2. Once the contract is deployed I would copy the smart contract's address into App.js

3. Create a production build of the web-app

4. Deploy the build using firebase or some similar hosting service

5. create a script that securely allows only me to call functions from the smart contract and calls generateRandomNum once every hour on the hour.
