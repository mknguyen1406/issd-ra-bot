// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory } = require('botbuilder');
const { LuisRecognizer, QnAMaker } = require('botbuilder-ai');
const fs = require('fs');

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
        this.qnaMaker = qnaMaker;

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

            if (context.activity.name === "suggestedActionEvent") {

                // Send user suggested actions
                await this.sendSuggestedActions(context);
            }

            if (context.activity.name === "result") {

                // Get data
                const result = context.activity.value.data;

                await context.sendActivity("Result received.");
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    async processMessage(turnContext, dispatchRecognizer, subLuisRecognizer) {

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
        await this.dispatchToTopIntent(turnContext, intent, intentSub, entity, recognizerResult);
    }

    async sendSuggestedActions(turnContext) {
        const reply = MessageFactory.suggestedActions(['Ja, sehr gerne!', 'Nein, danke.'], 'Möchtest du beispielhafte Fragen sehen, die du mir stellen kannst?');
        await turnContext.sendActivity(reply);
    }

    async dispatchToTopIntent(context, intent, intentSub, entity) {

        console.log("Intent: " + intent);

        switch (intent) {
        case 'l_luis':
            await this.processLUIS(context, intentSub, entity);
            break;
        case 'q_qnamaker':
            await this.processQnA(context);
            break;
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

    async processLUIS(context, intent, entity) {
        this.logger.log('processLUIS');

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
            answer = results[0].answer;
        } else {
            answer = 'Entschuldigung, ich habe deine Frage leider nicht verstanden.'
        }

        await context.sendActivity({
            name: 'messageEvent',
            type: 'event',
            channelData: {message: context.activity.text, turnContext: context, answer: answer}
        });
    }
}

module.exports.DispatchBot = DispatchBot;
