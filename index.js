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

// ============================= Helper functions ====================================

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

// Check if user id is already registered
function getRowNums(id, parameterList) {

    let targetRowNum = parseInt(parameterList[1][0]); // Row to get bot parameters from
    let nextRowNum = parseInt(parameterList[1][0]) + 1; // Row for next iteration

    let x, x_length = parameterList.length;
    let y = 1; // id column

    for (x = 0; x < x_length; x++) {
        if (parameterList[x][y] === id.toString()) {
            targetRowNum = x;
            nextRowNum = nextRowNum - 1;
        }
    }

    return [targetRowNum, nextRowNum]

}


// ===================================== Get bot parameters ===================================
function readParameterList(id, res, next) {

    const filePath = "./parameterList/parameterList.csv";

    fs.readFile(filePath, 'utf8', function(err, contents) {

        // Convert csv file to array
        let parameterList = parseCSV(contents);

        // Search for id otherwise return first row number with no id
        const totalRowNum = parameterList.length;
        let targetRowNum = 0;

        for (let i = 1; i < totalRowNum; i++) {

            if (parameterList[i][0] === id) {
                targetRowNum = i;
            } else if (parameterList[i][0] === "") {
                if (targetRowNum === 0) {
                    targetRowNum = i;
                    parameterList[i][0] = id;
                    break;
                }
            }

        }

        console.log(targetRowNum);
        const targetRow = parameterList[targetRowNum];

        // Get next bot parameter values -- IMPORTANT: Make sure the numerical references for the columns are correct!!
        const pricePath = targetRow[1];
        const experimentRound = targetRow[2];
        const cabinNo = targetRow[3];
        const experimentGroup = targetRow[4];

        const resObject = {
            pricePath: pricePath,
            experimentRound: experimentRound,
            cabinNo: cabinNo,
            experimentGroup: experimentGroup,
        };

        console.log(parameterList);

        // Save updated parameter list to CSV
        toCSV(filePath, parameterList);

        // Create copy of file in public folder for download
        const filePathDownload = "./public/parameterList.csv";
        toCSV(filePathDownload, parameterList);

        // Send bot parameters back to client
        res.send(resObject);

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

// Create parameter list with POST request
const createBotParameters = (req, res, next) => {

    console.log(req.body);

    const numPricePath =  req.body.numPricePath;
    const numExpRound =  req.body.numExpRound;
    const numCabinNo =  req.body.numCabinNo;
    const expGroupList = req.body.expGroup;

    // Create parameter list as array of arrays
    let parameterList = [["id", "pricePath", "experimentRound", "cabinNo", "experimentGroup"]];

    for (let pricePath = (numPricePath !== 0 ? 1 : 0); pricePath <= numPricePath; pricePath++) {
        for (let experimentRound = (numExpRound !== 0 ? 1 : 0); experimentRound <= numExpRound; experimentRound++) {
            for (let cabinNo = (numCabinNo !== 0 ? 1 : 0); cabinNo <= numCabinNo; cabinNo++) {
                expGroupList.forEach(expGroup => {
                    const row = ["", pricePath, experimentRound, cabinNo, expGroup];
                    parameterList.push(row);
                })
            }
        }
    }

    // Save new parameter list to CSV
    const path = "./parameterList/parameterList.csv";
    toCSV(path, parameterList);

    // Create copy of file in public folder for download
    const filePathDownload = "./public/parameterList.csv";
    toCSV(filePathDownload, parameterList);

    console.log(parameterList);

    const resObject = `The new parameter list has been successfully created with ${numPricePath} price paths, ${numExpRound} experiment rounds, ${numCabinNo} cabin numbers, and the following experiment groups: ${expGroupList}.`;
    res.send(resObject);

    return next();
};

server.post('/parameters/create', createBotParameters);

const uploadBotParameters = (req, res, next) => {

    console.log(req.body);

    const parameterList = parseCSV(req.body);

    // Save new parameter list to CSV
    const path = "./parameterList/parameterList.csv";
    toCSV(path, parameterList);

    // Create copy of file in public folder for download
    const filePathDownload = "./public/parameterList.csv";
    toCSV(filePathDownload, parameterList);

    // const resObject = `The new parameter list has been successfully created with ${numPricePath} price paths, ${numExpRound} experiment rounds, ${numCabinNo} cabin numbers, and the following experiment groups: ${expGroupList}.`;
    const resObject = `The parameter list has been successfully uploaded.`;
    res.send(resObject);

    return next();
};

server.post('/parameters/upload', uploadBotParameters);
