// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// index.js is used to setup and configure your bot

// Import required packages
const path = require('path');
const restify = require('restify');
// const CosmosClient = require('@azure/cosmos').CosmosClient;

// Datebase config
// const config = require('./config.js');

//=============================================DATABASE=======================================================================

// const endpoint = config.endpoint;
// const masterKey = config.primaryKey;

// const HttpStatusCodes = { NOTFOUND: 404 };

// const databaseId = config.database.id;
// const containerId = config.container.id;
// const partitionKey = { kind: "Hash", paths: ["/userId"] };

// const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey } });

// /**
//  * Create the database if it does not exist
//  */
// async function createDatabase() {
//     const { database } = await client.databases.createIfNotExists({ id: databaseId });
//     console.log(`Created database:\n${database.id}\n`);
// }

// /**
//  * Read the database definition
//  */
// async function readDatabase() {
//     const { body: databaseDefinition } = await client.database(databaseId).read();
//     console.log(`Reading database:\n${databaseDefinition.id}\n`);
// }

// /**
//  * Create the container if it does not exist
//  */
// async function createContainer() {
//     const { container } = await client.database(databaseId).containers.createIfNotExists({ id: containerId, partitionKey }, { offerThroughput: 400 });
//     console.log(`Created container:\n${config.container.id}\n`);
// }

// /**
//  * Read the container definition
//  */
// async function readContainer() {
//     const { body: containerDefinition } = await client.database(databaseId).container(containerId).read();
//     console.log(`Reading container:\n${containerDefinition.id}\n`);
// }

// /**
//  * Create family item if it does not exist
//  */
// async function createFamilyItem(itemBody) {
//     const { item } = await client.database(databaseId).container(containerId).items.upsert(itemBody);
//     console.log(`Created family item with id:\n${itemBody.id}\n`);
// };

// /**
//  * Query the container using SQL
//  */
// async function queryContainer() {
//     console.log(`Querying container:\n${config.container.id}`);

//     // query to return all children in a family
//     const querySpec = {
//         query: "SELECT VALUE r.children FROM root r WHERE r.lastName = @lastName",
//         parameters: [
//             {
//                 name: "@lastName",
//                 value: "Andersen"
//             }
//         ]
//     };

//     const { result: results } = await client.database(databaseId).container(containerId).items.query(querySpec, {enableCrossPartitionQuery:true}).toArray();
//     for (var queryResult of results) {
//         let resultString = JSON.stringify(queryResult);
//         console.log(`\tQuery returned ${resultString}\n`);
//     }
// };

// /**
//  * Replace the item by ID.
//  */
// async function replaceFamilyItem(itemBody) {
//     console.log(`Replacing item:\n${itemBody.id}\n`);
//     // Change property 'grade'
//     itemBody.children[0].grade = 6;
//     const { item } = await client.database(databaseId).container(containerId).item(itemBody.id, itemBody.Country).replace(itemBody);
// };

// /**
//  * Delete the item by ID.
//  */
// async function deleteFamilyItem(itemBody) {
//     await client.database(databaseId).container(containerId).item(itemBody.id, itemBody.Country).delete(itemBody);
//     console.log(`Deleted item:\n${itemBody.id}\n`);
// };

// /**
//  * Cleanup the database and collection on completion
//  */
// async function cleanup() {
//     await client.database(databaseId).delete();
// }

// /**
//  * Exit the app with a prompt
//  * @param {message} message - The message to display
//  */
// function exit(message) {
//     console.log(message);
//     console.log('Press any key to exit');
//     process.stdin.setRawMode(true);
//     process.stdin.resume();
//     process.stdin.on('data', process.exit.bind(process, 0));
// }

// createDatabase()
//     .then(() => readDatabase())
//     .then(() => createContainer())
//     .then(() => readContainer())
//     .then(() => createFamilyItem(config.items.user1))
//     // .then(() => createFamilyItem(config.items.Wakefield))
//     // .then(() => queryContainer())
//     // .then(() => replaceFamilyItem(config.items.Andersen))
//     // .then(() => queryContainer())
//     // .then(() => deleteFamilyItem(config.items.Andersen))
//     //.then(() => { exit(`Completed successfully`); })
//     .catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) });


//=========================================================================================================================

// Import required bot services. See https://aka.ms/bot-services to learn more about the different parts of a bot.
const { BotFrameworkAdapter, MemoryStorage, ConversationState, UserState } = require('botbuilder');
const { DispatchBot } = require('./bots/dispatchBot');

//--------------------------------------------------------------------------------------------------------------

// Note: Ensure you have a .env file and include all necessary credentials to access services like LUIS and QnAMaker.
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more.
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.error(`\n [onTurnError]: ${ error }`);
    // Send a message to the user
    await context.sendActivity(`Oops. Something went wrong!`);
    await context.sendActivity(`\n [onTurnError]: ${ error }`);
};

// Define state store for your bot.
// See https://aka.ms/about-bot-state to learn more about bot state.
const memoryStorage = new MemoryStorage();

// Create conversation and user state with in-memory storage provider.
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

// Pass in a logger to the bot. For this sample, the logger is the console, but alternatives such as Application Insights and Event Hub exist for storing the logs of the bot.
const logger = console;

// Create the main dialog.
// let bot = new DispatchBot(logger, shareManager); -- shifted back to client
let bot = new DispatchBot(logger, conversationState, userState);

// Create HTTP server
let server = restify.createServer();

// Middlerware for database
server.use(restify.plugins.bodyParser());

// Start server
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log(`\n${ server.name } listening to ${ server.url }`);
    console.log(`\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator`);
});

// Listen for incoming activities and route them to your bot main dialog.
server.post('/api/messages', (req, res) => {
    // Route received a request to adapter for processing
    adapter.processActivity(req, res, async (turnContext) => {
        // route to bot activity handler.
        await bot.run(turnContext);
    });
});

// Public Directory files
server.get('/*', restify.plugins.serveStatic({
    directory: './public',
    default: "index.html"
}));

// Public Directory files
server.get('/results/*', restify.plugins.serveStatic({
    directory: './results',
    default: "index.html",
    appendRequestPath: false
}));