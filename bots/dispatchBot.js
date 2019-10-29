// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory } = require('botbuilder');
const { LuisRecognizer, QnAMaker } = require('botbuilder-ai');
const fs = require('fs');
// const CosmosClient = require('@azure/cosmos').CosmosClient;

// const config = require('../config');

// const endpoint = config.endpoint;
// const masterKey = config.primaryKey;

// const databaseId = config.database.id;
// const containerId = config.container.id;

// const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey } });

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

        //endpoint: "https://westeurope.api.cognitive.microsoft.com/luis/v2.0"
        //endpoint: `https://${process.env.LuisAPIHostName}.api.cognitive.microsoft.com`
        const dispatchRecognizer = new LuisRecognizer({
            applicationId: process.env.LuisAppId,
            endpointKey: process.env.LuisAPIKey,
            endpoint: process.env.LuisAPIHostName
        }, {
            includeAllIntents: true,
            includeInstanceData: true
        }, true);

        const subLuisRecognizer = new LuisRecognizer({
            applicationId: process.env.LuisSubAppId,
            endpointKey: process.env.LuisSubAPIKey,
            endpoint: process.env.LuisSubAPIHostName
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
        this.subLuisRecognizer = subLuisRecognizer;
        this.qnaMaker = qnaMaker;

        async function writeToFile(jsonData, context) {
            const filename = jsonData.userId;
            // await context.sendActivity("Result received\n Filename is: " + filename);
            fs.writeFile(filename + ".txt", jsonData, async function (err) {
                if (err) {
                    await context.sendActivity("Error ocurred while saving the result. \n" + filename);
                    console.log(err);
                } else {
                    await context.sendActivity(`Saved result to http://issd-ra-web-app.azurewebsites.net/results/${filename}.txt`);
                }
            });
        }

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;

            for (let member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {

                    // Request welcome message
                    await context.sendActivity({name: 'welcomeEvent', type: 'event', channelData: {}});
                }
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMessage(async (turnContext, next) => {

            // Check if this message contains name or initial question
            if (turnContext.activity.channelData.name === "noname") {
                // Send message back
                await turnContext.sendActivity({
                    name: 'messageEvent',
                    type: 'event',
                    channelData: {message: turnContext.activity.text}
                });
            } else {

                // Process message with LUIS and QnA Maker
                await this.processMessage(turnContext, dispatchRecognizer, subLuisRecognizer);
            }
            // // Request welcome message
            // await turnContext.sendActivity({
            //     name: 'messageEvent',
            //     type: 'event',
            //     channelData: {message: turnContext.activity.text, turnContext: turnContext}
            // });

            await next();
        });


        this.onEvent(async (context, next) => {

            if (context.activity.name === "summaryRequest") {

                // Get data
                const message = context.activity.value.data;

                // Send summary to client
                await context.sendActivity(message);
            }

            if (context.activity.name === "chatEvent") {

                // Get data
                const message = context.activity.value.data;

                // Send summary to client
                await context.sendActivity(message);
            }

            if (context.activity.name === "processMessageEvent") {

                // Get data
                const message = context.activity.value.data;
                const turnContextOriginal = context.activity.value.turnContext;

                // Process message with LUIS and QnA Maker
                // await this.processMessage(context, message, turnContextOriginal, dispatchRecognizer, subLuisRecognizer);
            }

            if (context.activity.name === "suggestedActionEvent") {

                // Send user suggested actions
                await this.sendSuggestedActions(context);
            }

            if (context.activity.name === "result") {

                // Get data
                const result = context.activity.value.data;

                // Save result to database
                //createUser(result);
                // writeToFile(result, context);   
                await context.sendActivity("Result received.");
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    async processMessage(turnContext, dispatchRecognizer, subLuisRecognizer) {

        await turnContext.sendActivity("Debug1");

        // First, we use the dispatch model to determine which cognitive service (LUIS or QnA) to use.
        const recognizerResult = await dispatchRecognizer.recognize(turnContext);

        await turnContext.sendActivity("Debug2");
        console.log(recognizerResult);

        // Top intent tell us which cognitive service to use.
        const intent = LuisRecognizer.topIntent(recognizerResult);

        await turnContext.sendActivity("Debug3");

        // Get result, sub intent and entity from sub LUIS model
        const recognizerSubResult = await subLuisRecognizer.recognize(turnContext);
        const intentSub = LuisRecognizer.topIntent(recognizerSubResult);
        const entity = this.parseCompositeEntity(recognizerSubResult, 'Anteil', 'Anteil_Typ');

        await turnContext.sendActivity("Debug4");

        // Next, we call the dispatcher with the top intent.
        await this.dispatchToTopIntentAsync(turnContext, intent, intentSub, entity, recognizerResult);
    }

    async sendSuggestedActions(turnContext) {
        const reply = MessageFactory.suggestedActions(['Ja, sehr gerne!', 'Nein, danke.'], 'Möchtest du beispielhafte Fragen sehen, die du mir stellen kannst?');
        await turnContext.sendActivity(reply);
    }

    async dispatchToTopIntentAsync(context, intent, intentSub, entity, recognizerResult) {

        console.log("Intent: " + intent);

        switch (intent) {
        case 'l_luis':
            await this.processLUIS(context, intentSub, entity); //recognizerResult.luisResult
            break;
        case 'q_qnamaker':
            await this.processQnA(context);
            break;
        // case 'l_moreAnswers':
        //     await context.sendActivity("**Hier sind weitere Fragen:**\n" +
        //         "- Wenn ich Anteil C verkaufe und Anteil D zum aktuellen Preis kaufe, wie viel Guthaben habe ich dann übrig?\n" +
        //         "- Wie hoch ist die Gesamtrendite meines Portfolios?\n" +
        //         "- Kannst du mir einen Witz erzählen?"
        //     );
        //     break;
        default:
            this.logger.log(`Dispatch unrecognized intent: ${ intent }.`);
            await context.sendActivity("Entschuldigung, ich habe die Nachricht nicht verstanden.");
            break;
        }
    }

    parseCompositeEntity(result, compositeName, entityName) {
        const compositeEntity = result.entities[compositeName];
        if (!compositeEntity || !compositeEntity[0]) return undefined;

        const entity = compositeEntity[0][entityName];
        if (!entity || !entity[0]) return undefined;

        const entityValue = entity[0][0];
        return entityValue;
    }

    async processLUIS(context, intent, entity) { // luisResult
        this.logger.log('processLUIS');

        // Retrieve LUIS result for Process Automation.
        // const result = luisResult.connectedServiceResult;
        // const intent = result.topScoringIntent.intent;

        // await context.sendActivity(`LUIS top intent ${ intent }.`);
        // await context.sendActivity(`LUIS intents detected:  ${ luisResult.intents.map((intentObj) => intentObj.intent).join('\n\n') }.`);
        //
        // if (luisResult.entities.length > 0) {
        //     await context.sendActivity(`LUIS entities were found in the message: ${ luisResult.entities.map((entityObj) => entityObj.entity).join('\n\n') }.`);
        // }

        // await context.sendActivity({ name: 'luisEvent', type: 'event', channelData: {intent: intent, entity: entity} });

        // Request welcome message
        await context.sendActivity({
            name: 'messageEvent',
            type: 'event',
            channelData: {message: context.activity.text, turnContext: context, intent: intent, entity: entity}
        });

        // console.log("luisResult: \n" + luisResult);
        // console.log("result: \n" + result);
        // console.log("intent: \n" + intent);
    }

    async processQnA(context) {
        this.logger.log('processQnA');

        const results = await this.qnaMaker.getAnswers(context);
        let answer = "";

        if (results.length > 0) {
            // await context.sendActivity(`${ results[0].answer }`);
            answer = results[0].answer;
        } else {   
            // await context.sendActivity('Sorry, could not find an answer in the Q and A system.');
            answer = 'Entschuldigung, ich habe deine Frage leider nicht verstanden.'
        }

        // await context.sendActivity({ name: 'qnaEvent', type: 'event', channelData: {answer: answer} });

        await context.sendActivity({
            name: 'messageEvent',
            type: 'event',
            channelData: {message: context.activity.text, turnContext: context, answer: answer}
        });
    }
}

module.exports.DispatchBot = DispatchBot;
