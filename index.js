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

// Parse csv
function parseCSV(contents) {
    // Convert csv file to array
    return (
        contents.toString() // convert Buffer to string
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(',').map(e => e.trim())) // split each line to array
    )
}

// Save array of arrays to CSV
function toCSV(path, data) {

    const csv = data.map(function(d){
        return d.join();
    }).join('\n');

    fs.writeFile(path, csv, (err) => {
        if (err) throw err;
        console.log('The data has been saved to ' + path);
    });

}

// Get bot parameters
function readParameterList(id, res, next) {

    const filePath = "./parameterList/parameterList.csv";

    fs.readFile(filePath, 'utf8', function(err, contents) {

        // Convert csv file to array
        let parameterList = parseCSV(contents);

        let nextRowNum = parseInt(parameterList[1][0]); // Next row num always saved in first column of second row
        const nextRow = parameterList[nextRowNum];

        // Get next bot parameter values -- IMPORTANT: Make sure the numerical references for the columns are correct!!
        const pricePath = nextRow[2];
        const experimentRound = nextRow[3];
        const cabinNo = nextRow[4];
        const experimentGroup = nextRow[5];

        const resObject = {
            pricePath: pricePath,
            experimentRound: experimentRound,
            cabinNo: cabinNo,
            experimentGroup: experimentGroup,
        };

        // Send bot parameters back to client
        res.send(resObject);

        // =========================== Update parameter list for next retrieval ======================================
        // Set id
        parameterList[nextRowNum][1] = id;

        // Set new row num
        nextRowNum ++;

        let x, x_length = parameterList.length;
        let y, y_length = 6;
        let map = [];

        // Don't be lazy
        for (x = 0; x < x_length; x++) {
            map[x] = [];
            for (y = 0; y < y_length; y++) {
                if (y === 0 && x > 0) {
                    map[x][y] = nextRowNum.toString();
                } else {
                    map[x][y] = parameterList[x][y];
                }
            }
        }

        parameterList = map.slice(0, map.length);
        console.log(parameterList);

        // Save updated parameter list to CSV
        toCSV(filePath, parameterList);

        // Create copy of file in public folder for download
        const filePathDownload = "./public/parameterList.csv";
        toCSV(filePathDownload, parameterList);

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

    console.log(req.params);

    const numPricePath =  parseInt(req.params.numPricePath);
    const numExpRound =  parseInt(req.params.numExpRound);
    const numCabinNo =  parseInt(req.params.numCabinNo);
    const numExpGroup = parseInt(req.params.numExpGroup);

    // Create parameter list as array of arrays
    let parameterList = [["ref", "id", "pricePath", "experimentRound", "cabinNo", "experimentGroup"]];

    for (let pricePath = (numPricePath !== 0 ? 1 : 0); pricePath <= numPricePath; pricePath++) {
        for (let experimentRound = (numExpRound !== 0 ? 1 : 0); experimentRound <= numExpRound; experimentRound++) {
            for (let cabinNo = (numCabinNo !== 0 ? 1 : 0); cabinNo <= numCabinNo; cabinNo++) {
                for (let experimentGroup = (numExpGroup !== 0 ? 1 : 0); experimentGroup <= numExpGroup; experimentGroup++) {

                    const row = [1, "", pricePath, experimentRound, cabinNo, experimentGroup];
                    parameterList.push(row);

                }
            }
        }
    }

    // Save new parameter list to CSV
    const path = "./parameterList/parameterList.csv";
    toCSV(path, parameterList);

    // Create copy of file in public folder for download
    const filePathDownload = "./public/parameterList.csv";
    toCSV(filePathDownload, parameterList);

    const resObject = `The new parameter list has been successfully created with ${numPricePath} price paths, ${numExpRound} experiment rounds, ${numCabinNo} cabin numbers, and ${numExpGroup} experiment groups.`;

    res.send(resObject);
    return next();
};

server.get('/parameters/create/:numPricePath/:numExpRound/:numCabinNo/:numExpGroup', createBotParameterList);
