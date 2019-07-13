// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// index.js is used to setup and configure your bot

// Import required packages
const path = require('path');
const restify = require('restify');

// Datebase
const mongoose = require('mongoose');
const config = require('./config.js');

// Import required bot services. See https://aka.ms/bot-services to learn more about the different parts of a bot.
const { BotFrameworkAdapter } = require('botbuilder');
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

// Pass in a logger to the bot. For this sample, the logger is the console, but alternatives such as Application Insights and Event Hub exist for storing the logs of the bot.
const logger = console;

// Create the main dialog.
// let bot = new DispatchBot(logger, shareManager); -- shifted back to client
let bot = new DispatchBot(logger);

// Create HTTP server
let server = restify.createServer();

// Middlerware for database
server.use(restify.plugins.bodyParser());

// Start server
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log(`\n${ server.name } listening to ${ server.url }`);
    console.log(`\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator`);

    mongoose.connect(config.MONGODB_URI, 
        {useNewUrlParser: true}
    );
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
server.get('/scripts/*', restify.plugins.serveStatic({
    directory: './public'
}));

// Public Directory files
server.get('/index.html', restify.plugins.serveStatic({
    directory: './public'
}));

// Public Directory files
server.get('/iframe.html', restify.plugins.serveStatic({
    directory: './public'
}));

// Public Directory files
server.get('/data/*', restify.plugins.serveStatic({
    directory: './public'
}));

const db = mongoose.connection;

// Every time an error occurs
db.on("error", (err) => console.log(err));

// This only happens once
db.once("open", () => {
    require("./routes/users")(server);
    console.log(`Server started on port ${process.env.port || process.env.PORT || 3978}`);
});

// Get users
server.get("/hallo", async (req, res, next) => {

    // Send users
    res.send("hallo");        
});