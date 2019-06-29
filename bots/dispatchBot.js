// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');
const { LuisRecognizer, QnAMaker } = require('botbuilder-ai');

class DispatchBot extends ActivityHandler {
    /**
     * @param {any} logger object for logging events, defaults to console if none is provided
     */
    constructor(logger, sm) {
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
        this.shareManager = sm;

        this.onMessage(async (context, next) => {
            this.logger.log('Processing Message Activity.');

            // First, we use the dispatch model to determine which cognitive service (LUIS or QnA) to use.
            const recognizerResult = await dispatchRecognizer.recognize(context);

            // Top intent tell us which cognitive service to use.
            const intent = LuisRecognizer.topIntent(recognizerResult);

            // Next, we call the dispatcher with the top intent.
            await this.dispatchToTopIntentAsync(context, intent, recognizerResult);

            console.log(this.nextRound(0));

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
            console.log(context.activity);
            if (context.activity.name === 'next') {
                const res = await nextRound(context.activity.value);
                await context.sendActivity({ name: 'next', type: 'event', channelData: res });
            }
            if (context.activity.name === 'buy') {
                const id = context.activity.value;
                const res = this.shareManager.buyGood(id, openForTrading);
                await context.sendActivity({ name: 'buy', type: 'event', channelData: res });
            }

            if (context.activity.name === 'sell') {
                const id = context.activity.value;
                const res = this.shareManager.sellGood(id, openForTrading);
                await context.sendActivity({ name: 'sell', type: 'event', channelData: res });
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

    }

    nextRound(round) {
        let obj = {
            rename: [
                {
                    id: 'next',
                    content: 'Next'
                }
            ],
            reload: false
        };
        // Get data only up until round 14. In round 14 reload the page
        let data = null;
        if (round !== 14) {
            const res = this.shareManager.nextRound(round);
            data = res.data;
            // Includes an array with all buttons whose value is to be changed
            const renameArray = res.rename;
            for (let i = 0; i < renameArray.length; i++) {
                obj.rename.push(renameArray[i]);
            }
        }
        if (round === 12) {
            obj.appendData = {
                prices: data.prices,
                invests: data.invests
            };
            // round++;
            obj.rename = [
                {
                    id: 'next',
                    content: 'Exit'
                }
            ];
        } else if (round === 13) {
            obj.appendData = {
                prices: data.prices,
                invests: data.invests
            };
            // round++;
            const cash = this.shareManager.cashout();
            obj.alert = 'Congratulations!\nYour total cash out is ' + Math.round(cash) + '€!';
            obj.rename = [
                {
                    id: 'next',
                    content: 'Restart'
                }
            ];
        } else if (round === 14) {
            obj.reload = true;
        } else if (round === 2) {
            obj.rename.push({
                id: 'budget',
                content: '2000€'
            });
            openForTrading = true;
            obj.appendData = {
                prices: data.prices,
                invests: data.invests
            };
            // round++;
        } else {
            obj.appendData = {
                prices: data.prices,
                invests: data.invests
            };
            // round++;
        }
        console.log(round);
        return obj;
    }

    async dispatchToTopIntentAsync(context, intent, recognizerResult) {
        switch (intent) {
        case 'l_HomeAutomation':
            await this.processHomeAutomation(context, recognizerResult.luisResult);
            break;
        case 'l_Weather':
            await this.processWeather(context, recognizerResult.luisResult);
            break;
        case 'q_sample-qna':
            await this.processSampleQnA(context);
            break;
        default:
            this.logger.log(`Dispatch unrecognized intent: ${ intent }.`);
            await context.sendActivity(`Dispatch unrecognized intent: ${ intent }.`);
            break;
        }
    }

    async processHomeAutomation(context, luisResult) {
        this.logger.log('processHomeAutomation');

        // Retrieve LUIS result for Process Automation.
        const result = luisResult.connectedServiceResult;
        const intent = result.topScoringIntent.intent;

        await context.sendActivity(`HomeAutomation top intent ${ intent }.`);
        await context.sendActivity(`HomeAutomation intents detected:  ${ luisResult.intents.map((intentObj) => intentObj.intent).join('\n\n') }.`);

        if (luisResult.entities.length > 0) {
            await context.sendActivity(`HomeAutomation entities were found in the message: ${ luisResult.entities.map((entityObj) => entityObj.entity).join('\n\n') }.`);
        }
    }

    async processWeather(context, luisResult) {
        this.logger.log('processWeather');

        // Retrieve LUIS results for Weather.
        const result = luisResult.connectedServiceResult;
        const topIntent = result.topScoringIntent.intent;

        await context.sendActivity(`ProcessWeather top intent ${ topIntent }.`);
        await context.sendActivity(`ProcessWeather intents detected:  ${ luisResult.intents.map((intentObj) => intentObj.intent).join('\n\n') }.`);

        if (luisResult.entities.length > 0) {
            await context.sendActivity(`ProcessWeather entities were found in the message: ${ luisResult.entities.map((entityObj) => entityObj.entity).join('\n\n') }.`);
        }
    }

    async processSampleQnA(context) {
        this.logger.log('processSampleQnA');

        const results = await this.qnaMaker.getAnswers(context);

        if (results.length > 0) {
            await context.sendActivity(`${ results[0].answer }`);
        } else {
            await context.sendActivity('Sorry, could not find an answer in the Q and A system.');
        }
    }
}

module.exports.DispatchBot = DispatchBot;
