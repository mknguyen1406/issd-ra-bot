// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// index.js is used to setup and configure your bot

// Import required packages
const path = require('path');
const restify = require('restify');
const fs = require('fs');

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

// Create the main dialog.
let bot = new DispatchBot();

// Create HTTP server
let server = restify.createServer();

// Middlerware for database
server.use(restify.plugins.bodyParser());

// Allow CORS
server.use(
    function crossOrigin(req,res,next){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        return next();
    }
);

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

// Get bot parameters
function readParameterList(id, res, next) {

    const filePath = "./parameterList/parameterList.csv";

    fs.readFile(filePath, 'utf8', function(err, contents) {

        // Convert csv file to array
        let x = contents.toString() // convert Buffer to string
            .split('\n') // split string to lines
            .map(e => e.trim()) // remove white spaces for each line
            .map(e => e.split(',').map(e => e.trim())); // split each line to array

        // Current parameter list csv
        // console.log(x);

        let nextRowNum = parseInt(x[1][0]);
        const nextRow = x[nextRowNum];

        // Get next bot parameter values
        const pricePath = nextRow[2];
        const experimentGroup = nextRow[3];
        const experimentRound = nextRow[4];
        const cabinNo = nextRow[5];

        const resObject = {
            pricePath: pricePath,
            experimentGroup: experimentGroup,
            experimentRound: experimentRound,
            cabinNo: cabinNo,
        };

        res.send(resObject);

        // Set id
        x[nextRowNum][1] = id;

        // Set new row num
        nextRowNum ++;
        for (let i = 1; i < x.length - 1; i++) {
            x[i][0] = nextRowNum.toString();
        }

        const csv = x.map(function(d){
            return d.join();
        }).join('\n');

        // console.log("this is x as csv");
        // console.log(csv);

        // const newFilePath = "./parameterList/parameterList2.csv";
        fs.writeFile(filePath, csv, (err) => {
            if (err) throw err;
            console.log('The parameter list has been saved!');
        });

        // Create copy of file in public folder for download
        const filePathDownload = "./public/parameterList.csv";
        fs.writeFile(filePathDownload, csv, (err) => {
            if (err) throw err;
            console.log('The parameter list for download has been saved!');
        });

        return next();
    });
}


const getBotParameters = (req, res, next) => {

    const id = req.params.id;
    console.log("Current user ID: " + id);

    // Call function to read csv file
    readParameterList(id, res, next);

};

server.get('/parameters/get/:id', getBotParameters);

// Create bot parameter list
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

const createBotParameterList = (req, res, next) => {

    const numPricePaths =  req.params.numPricePaths;
    const numExpGroup = req.params.numExpGroup;

    const resObject = {
        pricePath: 1,
        experimentRound: 1,
        cabinNo: 1,
        experimentGroup: 1,
    };

    // console.log(req.params);

    res.send(resObject);
    return next();
};

server.get('/parameters/create/:numPricePaths/:numExpGroup', createBotParameterList);
