// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');
const { LuisRecognizer, QnAMaker } = require('botbuilder-ai');
const fs = require('fs');
const CosmosClient = require('@azure/cosmos').CosmosClient;

const config = require('../config');

const endpoint = config.endpoint;
const masterKey = config.primaryKey;

const databaseId = config.database.id;
const containerId = config.container.id;

const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey } });

class DispatchBot extends ActivityHandler {
    /**
     * @param {any} logger object for logging events, defaults to console if none is provided
     */
    constructor(logger) {
        super();
        if (!logger) {
            logger = console;
            logger.log('[DispatchBot]: logger not passed in, defaulting to console');
        }

        const dispatchRecognizer = new LuisRecognizer({
            applicationId: process.env.LuisAppId,
            endpointKey: process.env.LuisAPIKey,
            endpoint: `https://${ process.env.LuisAPIHostName }.api.cognitive.microsoft.com`
        }, {
            includeAllIntents: true,
            includeInstanceData: true
        }, true);

        const qnaMaker = new QnAMaker({
            knowledgeBaseId: process.env.QnAKnowledgebaseId,
            endpointKey: process.env.QnAAuthKey,
            host: process.env.QnAEndpointHostName
        });

        this.logger = logger;
        this.dispatchRecognizer = dispatchRecognizer;
        this.qnaMaker = qnaMaker;
        // this.shareManager = sm;
        this.openForTrading = false;

        async function createUser(result) {
            const newResult = {
                "userId": result.userId,
                "surveyId": result.surveyId,
                "pricePath": result.pricePath,
                "cabinNo": result.cabinNo,
                "experimentRound": result.experimentRound,
                "experimentGroup": result.experimentGroup,
                "cashout": result.cashout,
                "holdings": result.holdings,
                "invests": result.invests,
                "prices": result.prices,
                "time": result.time,
                "prod": false // change to true when moving to production
            };
            const { item } = await client.database(databaseId).container(containerId).items.upsert(newResult);
            console.log(`Created family item with id:\n${newResult.id}\n`);
        };

        this.onMessage(async (context, next) => {
            this.logger.log('Processing Message Activity.');

            // First, we use the dispatch model to determine which cognitive service (LUIS or QnA) to use.
            const recognizerResult = await dispatchRecognizer.recognize(context);

            // Top intent tell us which cognitive service to use.
            const intent = LuisRecognizer.topIntent(recognizerResult);

            // Next, we call the dispatcher with the top intent.
            await this.dispatchToTopIntentAsync(context, intent, recognizerResult);

            //console.log(this.nextRound(0));

            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const welcomeText = 'Type a greeting or a question about the weather to get started.';
            const membersAdded = context.activity.membersAdded;

            for (let member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity(`Welcome to Dispatch bot ${ member.name }. ${ welcomeText }`);
                }
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        // Handle button events
        this.onEvent(async (context, next) => {
            //console.log(context.activity);
            // if (context.activity.name === 'next') {
            //     const res = await this.nextRound(context.activity.value);
            //     await context.sendActivity({ name: 'next', type: 'event', channelData: res });
            // }
            // if (context.activity.name === 'buy') {
            //     const id = context.activity.value;
            //     const res = this.shareManager.buyGood(id, this.openForTrading);
            //     await context.sendActivity({ name: 'buy', type: 'event', channelData: res });
            // }

            // if (context.activity.name === 'sell') {
            //     const id = context.activity.value;
            //     const res = this.shareManager.sellGood(id, this.openForTrading);
            //     await context.sendActivity({ name: 'sell', type: 'event', channelData: res });
            // } -- shifted back to client

            if (context.activity.name === "summaryRequest") {

                // Get data
                const holdings = context.activity.value.holdings;

                // Send summary to client
                await context.sendActivity(`Your holdings are \n - Share A: ${holdings[0]} \n - Share B: ${holdings[1]}\n - Share C: ${holdings[2]}\n - Share D: ${holdings[3]}\n - Share E: ${holdings[4]}\n - Share F: ${holdings[5]}`);
            }

            if (context.activity.name === "result") {

                // Get data
                const result = context.activity.value;

                // Save result to database
                createUser(result);

                // await context.sendActivity(`Result received`);            
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

    }

    async dispatchToTopIntentAsync(context, intent, recognizerResult) {
        switch (intent) {
        case 'l_luis':
            await this.processLUIS(context, recognizerResult.luisResult);
            break;
        case 'q_qnamaker':
            await this.processQnA(context);
            break;
        default:
            this.logger.log(`Dispatch unrecognized intent: ${ intent }.`);
            await context.sendActivity(`Dispatch unrecognized intent: ${ intent }.`);
            break;
        }
    }

    async processLUIS(context, luisResult) {
        this.logger.log('processLUIS');

        // Retrieve LUIS result for Process Automation.
        const result = luisResult.connectedServiceResult;
        const intent = result.topScoringIntent.intent;

        await context.sendActivity(`LUIS top intent ${ intent }.`);
        await context.sendActivity(`LUIS intents detected:  ${ luisResult.intents.map((intentObj) => intentObj.intent).join('\n\n') }.`);

        if (luisResult.entities.length > 0) {
            await context.sendActivity(`LUIS entities were found in the message: ${ luisResult.entities.map((entityObj) => entityObj.entity).join('\n\n') }.`);
            console.log("bla");
        }

        console.log("luisResult: \n" + luisResult);
        console.log("result: \n" + result);
        console.log("intent: \n" + intent);
    }

    async processQnA(context) {
        this.logger.log('processQnA');

        const results = await this.qnaMaker.getAnswers(context);

        if (results.length > 0) {
            await context.sendActivity(`${ results[0].answer }`);
        } else {   
            await context.sendActivity('Sorry, could not find an answer in the Q and A system.');
        }
    }
}

module.exports.DispatchBot = DispatchBot;
