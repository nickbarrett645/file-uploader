# file-uploader
This purpose of this project is to provide a portal for customer's of Nick's Software Company to upload diagnostic bundles of our product on their systems so that the support engineer of Nick's Software Company to can view and download those bundles so they can triage their issues.\
# Run Locally

## Frontend
To start the frontend move to the `fe` directory and run the `yarn` commands:
`$ cd fe`
`$ yarn install`
`$ yarn start`
This will run the app on localhost:3000
The package.json currently has a proxy set up so the calls to the backend are routed to localhost:3001.
If you wish to run the frontend independently remove the proxy setting from the package.json in the `fe` directory.

to run the frontend tests you run:
`$ yarn test`

to build the frontend for production:
`$ yarn build`

 ## Backend
To start the express server navigate to the `be` directory and run the npm commands:
`$ cd be`
`$ npm install`
`$ nodemon index.js`

`nodemon` is used to automatically restart the node server when you make a change in your code.

# Important
For the backend to work successfullly you need to have an .env file with access keys for an S3 bucket and the name of the bucket and the name of the dynamodb table you are writing to.