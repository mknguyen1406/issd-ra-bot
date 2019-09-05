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

// The accessor names for the conversation data and user profile state property accessors.
const CONVERSATION_DATA_PROPERTY = 'conversationData';
const USER_PROFILE_PROPERTY = 'userProfile';

class DispatchBot extends ActivityHandler {
    /**
     * @param {any} logger object for logging events, defaults to console if none is provided
     */
    constructor(logger, conversationState, userState) {
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

        const subLuisRecognizer = new LuisRecognizer({
            applicationId: process.env.LuisSubAppId,
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

        // Create the state property accessors for the conversation data and user profile.
        this.conversationData = conversationState.createProperty(CONVERSATION_DATA_PROPERTY);
        this.userProfile = userState.createProperty(USER_PROFILE_PROPERTY);

        // The state management objects for the conversation and user state.
        this.conversationState = conversationState;
        this.userState = userState;

        async function writeToFile(jsonData, context) {
            const filename = jsonData.userId;
            // await context.sendActivity("Result received\n Filename is: " + filename); 
            fs.writeFile(filename + ".txt", jsonData, async function(err) {
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
            const conversationData = await this.conversationData.get(
                context, { promptedForUserName: false });

            for (let member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity("Hallo, ich bin dein Robo Assistant.\n" + 
                        "Du kannst mir Fragen zu deinem Portfolio oder zu den Preisentwicklungen der Anteile stellen." );

                    await context.sendActivity("Mein Name ist Charles. Wie lautet deiner?");

                    // Set the flag to true, so we don't prompt in the next turn.
                    conversationData.promptedForUserName = true;
                }
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMessage(async (turnContext, next) => {

            // Get the state properties from the turn context.
            const userProfile = await this.userProfile.get(turnContext, {});
            const conversationData = await this.conversationData.get(
                turnContext, { promptedForUserName: false });

            if (!userProfile.name) {

                // Set the name to what the user provided.
                userProfile.name = turnContext.activity.text;

                // Acknowledge that we got their name.
                await turnContext.sendActivity(`Danke, ${ userProfile.name }.`);

                // Show example questions
                // await turnContext.sendActivity("**Folgende Fragen kannst du mir stellen:**\n" + //Einige Fragen, die du stellen kannst, sind
                //     "- Welcher Anteil hat am meisten an Wert gewonnen/ verloren?\n" +
                //     "- Wenn Anteil C an Wert gewinnt/ verliert, wie viel wird er in der folgenden Periode wert sein?\n" +
                //     "- Wie oft hat Anteil F an Wert gewonnen/ verloren?\n" +
                //     "- Wie hoch ist die Gesamtrendite meines Portfolios?"
                //    );
                await this.sendSuggestedActions(turnContext, userProfile.name);
                //
                // // Acknowledge that we got their name.
                // await turnContext.sendActivity("Bitte klicke auf 'Starte Experiment', um zu beginnen.");

                // await turnContext.sendActivity({ name: 'welcomeEvent', type: 'event', channelData: {task: "main"} });
                //await turnContext.sendActivity({ name: 'welcomeEvent', type: 'event', channelData: {task: "followup"} });

                // Reset the flag to allow the bot to go though the cycle again.
                conversationData.promptedForUserName = false;

            } else {

                const text = turnContext.activity.text;
                const questions = ['Ja, sehr gerne!', 'Hilfe'];
                const noQuestions = ['Nein.'];

                // Welcome messages
                if (questions.includes(text)) {
                    await turnContext.sendActivity({ name: 'welcomeEvent', type: 'event', channelData: {task: "main"} });
                } else if (noQuestions.includes(text)) {
                    await turnContext.sendActivity("Verstanden. Du kannst mich jederzeit wieder danach fragen, indem du 'Hilfe' schreibst.");
                } else {
                    // Add message details to the conversation data.
                    conversationData.timestamp = turnContext.activity.timestamp.toLocaleString();
                    conversationData.channelId = turnContext.activity.channelId;

                    // Display state data.
                    // await turnContext.sendActivity(`${ userProfile.name } sent: ${ turnContext.activity.text }`);
                    // await turnContext.sendActivity(`Message received at: ${ conversationData.timestamp }`);
                    // await turnContext.sendActivity(`Message received from: ${ conversationData.channelId }`);

                    // First, we use the dispatch model to determine which cognitive service (LUIS or QnA) to use.
                    const recognizerResult = await dispatchRecognizer.recognize(turnContext);

                    console.log(recognizerResult);

                    // Top intent tell us which cognitive service to use.
                    const intent = LuisRecognizer.topIntent(recognizerResult);

                    // Get result, sub intent and entity from sub LUIS model
                    const recognizerSubResult = await subLuisRecognizer.recognize(turnContext);
                    const intentSub = LuisRecognizer.topIntent(recognizerSubResult);
                    const entity = this.parseCompositeEntity(recognizerSubResult, 'Anteil', 'Anteil_Typ');

                    // Next, we call the dispatcher with the top intent.
                    await this.dispatchToTopIntentAsync(turnContext, intent, intentSub, entity, recognizerResult);
                }
            }          

            await next();
        });


        this.onEvent(async (context, next) => {

            if (context.activity.name === "summaryRequest") {

                // Get data
                const message = context.activity.value;

                // Send summary to client
                await context.sendActivity(message);
            }

            if (context.activity.name === "chatEvent") {

                // Get data
                const message = context.activity.value;

                // Send summary to client
                await context.sendActivity(message);
            }

            if (context.activity.name === "result") {

                // Get data
                const result = context.activity.value;

                // Save result to database
                //createUser(result);
                // writeToFile(result, context);   
                await context.sendActivity("Result received.");        
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        // Save any state changes. The load happened during the execution of the Dialog.
        this.onDialog(async (turnContext, next) => {
            await this.conversationState.saveChanges(turnContext, false);
            await this.userState.saveChanges(turnContext, false);

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

    }

    async sendSuggestedActions(turnContext, name) {
        const reply = MessageFactory.suggestedActions(['Ja, sehr gerne!', 'Nein.'], 'Möchtest du wissen, welche Fragen du mir stellen kannst?');
        await turnContext.sendActivity(reply);
    }

    async dispatchToTopIntentAsync(context, intent, intentSub, entity, recognizerResult) {

        console.log("Intent: " + intent);

        // TODO: Use dispatch model
        // await context.sendActivity({ name: 'luisEvent', type: 'event', channelData: {intent: intent, entity: entity} });

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

        await context.sendActivity({ name: 'luisEvent', type: 'event', channelData: {intent: intent, entity: entity} });

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

        await context.sendActivity({ name: 'qnaEvent', type: 'event', channelData: {answer: answer} });
    }
}

module.exports.DispatchBot = DispatchBot;
