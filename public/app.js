// =================================== Global variables =======================================

// This round number controls the requested price paths
let round = 0;

let openForTrading = null;
let shareManager = null;

let userName = null;
let showedExampleQuestions = false;

// List that ensures that certain summaries cannot be outputted twice
let forbiddenSummaries = [];

// Mapping table for randomization
let mapping = getRandomMapping();

// Array for timestamps
let times = [];

// Container for advices
let advice = {
    0: [0,0,0],
    1: [0,0,0],
    2: [0,0,0],
    3: [0,0,0],
    4: [0,0,0],
    5: [0,0,0],
    6: [0,0,0],
    7: [0,0,0],
    8: [0,0,0],
    9: [0,0,0],
    10: [0,0,0],
    11: [0,0,0],
    12: [0,0,0],
    13: [0,0,0]
};

// Get token from secret and start chat bot
let token_ = "";
let conversationId_ = "";

// Get URL parameters
const url_string = window.location.href;
const url = new URL(url_string);
const surveyId = (url.searchParams.get("surveyId") === null || url.searchParams.get("surveyId") === "") ? 0 : url.searchParams.get("surveyId"); // 0 as default
const pricePath = (url.searchParams.get("pricePath") === null || url.searchParams.get("pricePath") === "") ? 1 : url.searchParams.get("pricePath"); // 1 as default
const experimentRound = (url.searchParams.get("experimentRound") === null || url.searchParams.get("experimentRound") === "") ? 0 : url.searchParams.get("experimentRound"); // 0 as default
const cabinNo = (url.searchParams.get("cabinNo") === null || url.searchParams.get("cabinNo") === "") ? 0 : url.searchParams.get("cabinNo"); // 0 as default
const experimentGroup = (url.searchParams.get("experimentGroup") === null || url.searchParams.get("experimentGroup") === "") ? 2 : url.searchParams.get("experimentGroup"); // 2 as default

// Create unique user ID
const userId = surveyId + "-" + pricePath + "-" + experimentRound + "-" + experimentGroup + "-" + cabinNo;

console.log("Survey ID: " + surveyId + "\n",
    "Price path: " + pricePath + "\n",
    "Experiment round: " + experimentRound + "\n",
    "Experiment group: " + experimentGroup + "\n",
    "Cabin no: " + cabinNo
);

let conversationHistory = null;

// =================================== Create Share Manager =======================================
const pricesArray = createShareManager(pricePath, 2000, function (budget, prices) {
    shareManager = new ShareManager(budget, prices);
});

// =================================== User Interface =======================================

// Hide or show chat bot based on experiment , e.g. 1 for hide, 2 for show
if (parseFloat(experimentGroup) === 1) {
    hideChatBot();
}

// Create chart
const chart = new ApexCharts(
    document.querySelector("#chart"),
    options
);
chart.render();

// Show price table and hide chart and investment table
let x = document.getElementById("chart");
x.style.display = "none";
x = document.getElementById("investments");
x.style.display = "none";

// Hide 'Klicke unten auf Weiter' button
document.getElementById("end").style.display = "none";

// =================================== Create Chat Bot =======================================

getToken(startChatBot);

function startChatBot() {

    // We are adding a new middleware to customize the behavior of DIRECT_LINE/INCOMING_ACTIVITY.
    const store = window.WebChat.createStore(
        {},
        ({dispatch}) => next => action => {
            if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
                const event = new Event('webchatincomingactivity');

                event.data = action.payload.activity;
                window.dispatchEvent(event);
            }

            if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
                dispatch({
                    type: 'WEB_CHAT/SEND_EVENT',
                    payload: {
                        name: 'webchat/join',
                        value: {language: window.navigator.language}
                    }
                });
            }

            // Use this to add custom data to channelData of the immutable action object
            // if (action.type === 'DIRECT_LINE/POST_ACTIVITY') {
            //     action = window.simpleUpdateIn(action, ['payload', 'activity', 'channelData', 'email'], () => 'johndoe@example.com');
            // }

            return next(action);
        }
    );

    // Style bot
    const styleOptions = {
        botAvatarImage: 'https://issd-ra-web-app.azurewebsites.net/images/type_3a.png',
        // botAvatarInitials: 'BF',
        // userAvatarImage: 'https://www.ksri.kit.edu/img/personen/Morana_Stefan_2016.jpg',
        // userAvatarInitials: 'WC',
        hideUploadButton: true,
        backgroundColor: '#f8f9fa',
        bubbleFromUserBackground: '#DCF8C6',
        bubbleFromUserBorderRadius: 10,
        bubbleBorderRadius: 10,
        fontSizeSmall: '60%'

    };

    window.WebChat.renderWebChat(
        {
            directLine: window.WebChat.createDirectLine({token: token_})
            , store
            , userID: userId
            // ,username: 'Web Chat User'
            , locale: 'de-de'
            , styleOptions: styleOptions
            , sendTypingIndicator: true
        },
        document.getElementById('webchat')
    );

    document.querySelector('#next').addEventListener('click', (e) => {
        // store.dispatch({
        //     type: 'WEB_CHAT/SEND_EVENT',
        //     payload: {
        //         name: 'next',
        //         value: round
        //     }
        // });
        // round ++;
        buttonActionEvent(e, "next");
    });

    document.querySelector('#button_buy1').addEventListener('click', (e) => {
        // buttonSendEvent(e, store, "buy");
        buttonActionEvent(e, "buy");
    });

    document.querySelector('#button_buy2').addEventListener('click', (e) => {
        // buttonSendEvent(e, store, "buy");
        buttonActionEvent(e, "buy");
    });

    document.querySelector('#button_buy3').addEventListener('click', (e) => {
        // buttonSendEvent(e, store, "buy");
        buttonActionEvent(e, "buy");
    });

    document.querySelector('#button_buy4').addEventListener('click', (e) => {
        // buttonSendEvent(e, store, "buy");
        buttonActionEvent(e, "buy");
    });

    document.querySelector('#button_buy5').addEventListener('click', (e) => {
        // buttonSendEvent(e, store, "buy");
        buttonActionEvent(e, "buy");
    });

    document.querySelector('#button_buy6').addEventListener('click', (e) => {
        // buttonSendEvent(e, store, "buy");
        buttonActionEvent(e, "buy");
    });

    document.querySelector('#button_sell1').addEventListener('click', (e) => {
        // buttonSendEvent(e, store, "sell");
        buttonActionEvent(e, "sell");
    });

    document.querySelector('#button_sell2').addEventListener('click', (e) => {
        // buttonSendEvent(e, store, "sell");
        buttonActionEvent(e, "sell");
    });

    document.querySelector('#button_sell3').addEventListener('click', (e) => {
        // buttonSendEvent(e, store, "sell");
        buttonActionEvent(e, "sell");
    });

    document.querySelector('#button_sell4').addEventListener('click', (e) => {
        // buttonSendEvent(e, store, "sell");
        buttonActionEvent(e, "sell");
    });

    document.querySelector('#button_sell5').addEventListener('click', (e) => {
        // buttonSendEvent(e, store, "sell");
        buttonActionEvent(e, "sell");
    });

    document.querySelector('#button_sell6').addEventListener('click', (e) => {
        // buttonSendEvent(e, store, "sell");
        buttonActionEvent(e, "sell");
    });

    // Create event listener for summary and result event
    window.document.addEventListener('botEvent', handleEvent, false);

    function handleEvent(e) {
        console.log(e);
        const type = e.detail.type;
        const data = e.detail.data;
        const turnContext = e.detail.turnContext;

        store.dispatch({
            type: 'WEB_CHAT/SEND_EVENT',
            payload: {
                name: type,
                value: {
                    data: data,
                    turnContext: turnContext
                }
            }
        });

        if (type === "result") {
            console.log("Result:");
            console.log(data);
        }
    }

    // Listening for incoming response events of type buy, sell or next
    window.addEventListener('webchatincomingactivity', ({data}) => {
        console.log(`Received a bot activity of type "${data.type}":`);
        console.log(data);
        // Don't jump into if clause at messages and webchat/join event
        if (data.type === "event" && data.name !== "webchat/join") {
            const channelData = data.channelData;
            const correctEvent = !channelData.hasOwnProperty("clientActivityID"); // because bot sends two events
            const turnContext = channelData.turnContext; //original turnContext

            // Incoming welcome message event
            if (data.name === 'welcomeEvent') {

                let chatbotResponse = "";
                const group = parseFloat(experimentGroup);

                // Only available when experiment started
                if (group === 2) {
                    chatbotResponse = "Hallo, ich bin dein Robo Assistant.\n" +
                        "Du kannst mir Fragen zu deinem Portfolio oder zu den Preisentwicklungen der Anteile stellen.";

                } else if (group === 3) {
                    chatbotResponse = "Hallo, ich bin dein Robo Assistant.\n" +
                        "Du kannst mir Fragen zu deinem Portfolio oder zu den Preisentwicklungen der Anteile stellen. " +
                        "Außerdem kannst du mich nach einer Investitionsempfehlung fragen.";
                }

                // Dispatch welcome message and ask for user name
                dispatchBotEvent(chatbotResponse, "chatEvent", turnContext, function () {
                    // Dispatch click on 'Starte Experiment' message
                    // dispatchBotEvent("Mein Name ist Charles. Wie lautet deiner?", "chatEvent", turnContext);

                    // Ask user for example questions with suggested answers
                    dispatchBotEvent("", "suggestedActionEvent", turnContext);
                });
            }

            // Incoming message event, e.g. user just sent a message to bot and bot sent this message event in turn
            if (data.name === 'messageEvent') {

                let chatbotResponse = "";
                const group = parseFloat(experimentGroup);

                // Message sent to chat bot
                const message = data.channelData.message;

                // Check if user asked for example questions
                const questions = ['Ja, sehr gerne!', 'Fragen', 'fragen'];

                if (questions.includes(message)) {

                    showedExampleQuestions = true;

                    // Only available when experiment started
                    if (group === 2) {

                        chatbotResponse = "**Folgende Fragen kannst du mir beispielsweise stellen:**\n" +
                            "- Welcher Anteil hat am meisten an Wert gewonnen/ verloren?\n" +
                            "- Wenn Anteil C an Wert gewinnt/ verliert, wie viel wird er in der folgenden Periode wert sein?\n" +
                            "- Wie oft hat Anteil F an Wert gewonnen/ verloren?\n" +
                            "- Wie hoch ist die Gesamtrendite meines Portfolios?\n" +
                            "- Wer bist du?";
                    } else if (group === 3) {
                        chatbotResponse = "**Folgende Fragen kannst du mir beispielsweise stellen:**\n" +
                            "- Welcher Anteil hat am meisten an Wert gewonnen/ verloren?\n" +
                            "- Wenn Anteil C an Wert gewinnt/ verliert, wie viel wird er in der folgenden Periode wert sein?\n" +
                            "- Wie oft hat Anteil F an Wert gewonnen/ verloren?\n" +
                            "- Wie hoch ist die Gesamtrendite meines Portfolios?\n" +
                            "- Kannst du mir einen Rat geben?\n" +
                            "- Wer bist du?";
                    }

                    // Dispatch example questions
                    dispatchBotEvent(chatbotResponse, "chatEvent", turnContext, function () {

                        // Ask user for name
                        if (userName == null) {
                            // Dispatch click on 'Starte Experiment' message
                            dispatchBotEvent("Mein Name ist übrigens Charles. Wie lautet deiner?", "chatEvent", turnContext);
                        }
                    });

                } else {

                    // Check if user said 'No' to example questions
                    const noQuestions = ['Nein.'];
                    if (noQuestions.includes(message)) {

                        // Tell user that he can ask for example questions again
                        chatbotResponse = "Verstanden. Du kannst mich jederzeit wieder danach fragen, indem du 'Fragen' schreibst.";

                        // Dispatch example questions
                        dispatchBotEvent(chatbotResponse, "chatEvent", turnContext, function () {

                            // Ask user for name
                            if (userName == null) {
                                // Dispatch click on 'Starte Experiment' message
                                dispatchBotEvent("Mein Name ist übrigens Charles. Wie lautet deiner?", "chatEvent", turnContext);
                            }
                        });
                    } else {

                        // If name is null then set name and send acknowledge message from bot to user. Only in round 0 and 3
                        if (userName == null) {

                            if (round === 0) {

                                // Set name
                                userName = message;

                                // Acknowledge name
                                chatbotResponse = `Danke, ${ userName }.`;
                                dispatchBotEvent(chatbotResponse, "chatEvent", turnContext, function () {
                                    // Ask user for example questions with suggested answers
                                    chatbotResponse = "Bitte klicke nun auf 'Starte Experiment', um zu beginnen.";
                                    dispatchBotEvent(chatbotResponse, "chatEvent", turnContext);
                                });
                            } else if (round === 4) {

                                // Set name
                                userName = message;

                                // Acknowledge name
                                chatbotResponse = `Danke, ${ userName }.`;
                                dispatchBotEvent(chatbotResponse, "chatEvent", turnContext);
                            } else {

                                // Process message with LUIS and QnA
                                processMessage(chatbotResponse, data, turnContext);
                            }
                        } else {

                            // Process message with LUIS and QnA
                            processMessage(chatbotResponse, data, turnContext);
                        }
                    }
                }


                //=======================================================================================================
                // If name is null then set name and send acknowledge message from bot to user
                /*if (userName == null) {
                    userName = message;

                    // Acknowledge name
                    chatbotResponse = `Danke, ${ userName }.`;
                    dispatchBotEvent(chatbotResponse, "chatEvent", turnContext, function () {
                        // Ask user for example questions with suggested answers
                        // dispatchBotEvent("", "suggestedActionEvent", turnContext);
                    });

                } else {

                    // Check if user asked for example questions
                    const questions = ['Ja, sehr gerne!', 'Fragen', 'fragen'];

                    // Send example questions to user
                    if (questions.includes(message)) {

                        // Only available when experiment started
                        if (group === 2) {

                            chatbotResponse = "**Folgende Fragen kannst du mir beispielsweise stellen:**\n" +
                                "- Welcher Anteil hat am meisten an Wert gewonnen/ verloren?\n" +
                                "- Wenn Anteil C an Wert gewinnt/ verliert, wie viel wird er in der folgenden Periode wert sein?\n" +
                                "- Wie oft hat Anteil F an Wert gewonnen/ verloren?\n" +
                                "- Wie hoch ist die Gesamtrendite meines Portfolios?\n" +
                                "- Wer bist du?";
                        } else if (group === 3) {
                            chatbotResponse = "**Folgende Fragen kannst du mir beispielsweise stellen:**\n" +
                                "- Welcher Anteil hat am meisten an Wert gewonnen/ verloren?\n" +
                                "- Wenn Anteil C an Wert gewinnt/ verliert, wie viel wird er in der folgenden Periode wert sein?\n" +
                                "- Wie oft hat Anteil F an Wert gewonnen/ verloren?\n" +
                                "- Wie hoch ist die Gesamtrendite meines Portfolios?\n" +
                                "- Kannst du mir einen Rat geben?\n" +
                                "- Wer bist du?";
                        }

                        // Dispatch example questions
                        // Dispatch welcome message and ask for user name
                        dispatchBotEvent(chatbotResponse, "chatEvent", turnContext, function () {
                            // Dispatch click on 'Starte Experiment' message
                            if (openForTrading == null) {
                                chatbotResponse = "Bitte klicke nun auf 'Starte Experiment', um zu beginnen.";
                                dispatchBotEvent(chatbotResponse, "chatEvent", turnContext);
                            }
                        });

                    } else {

                        // Check if user said 'No' to example questions
                        const noQuestions = ['Nein.'];
                        if (noQuestions.includes(message)) {

                            // Tell user that he can ask for example questions again
                            chatbotResponse = "Verstanden. Du kannst mich jederzeit wieder danach fragen, indem du 'Fragen' schreibst.";
                            dispatchBotEvent(chatbotResponse, "chatEvent", turnContext);
                        } else {

                            // Check if experiment started. If not, openForTrading is null
                            if (openForTrading == null) {
                                // Experiment did not started yet
                                chatbotResponse = "Bitte starte erst das Experiment.";
                                dispatchBotEvent(chatbotResponse, "chatEvent", turnContext);
                            } else if (openForTrading === false) {

                                // Experiment is over
                                chatbotResponse = "Das Experiment ist vorbei. Bitte klicke unten auf 'Weiter'.";
                                dispatchBotEvent(chatbotResponse, "chatEvent", turnContext);
                            } else if (openForTrading === true){

                                // Experiment started. Process message with LUIS and QnA Maker

                                // Trigger Qna or LUIS processes
                                if (typeof(data.channelData.answer) !== 'undefined') {

                                    // Send QnA Maker response
                                    chatbotResponse = data.channelData.answer;

                                    // Track advice
                                    trackConversation(round - 1, "qna");

                                } else if (typeof(data.channelData.intent) !== 'undefined') {

                                    // Trigger LUIS
                                    const intent = data.channelData.intent;
                                    const entity = data.channelData.entity;

                                    switch (intent) {
                                        case "anteil_gewonnen_max":
                                            chatbotResponse = shareManager.mostUps(round - 1);

                                            // Track advice
                                            trackConversation(round - 1, "luis_allgemein");
                                            break;
                                        case "anteil_verloren_max":
                                            chatbotResponse = shareManager.mostDowns(round - 1);

                                            // Track advice
                                            trackConversation(round - 1, "luis_allgemein");
                                            break;
                                        case "anteil_potentieller_zuwachs":
                                            chatbotResponse = shareManager.potentialUp(entity);

                                            // Track advice
                                            trackConversation(round - 1, "luis_allgemein");
                                            break;
                                        case "anteil_potentieller_verlust":
                                            chatbotResponse = shareManager.potentialDown(entity);

                                            // Track advice
                                            trackConversation(round - 1, "luis_allgemein");
                                            break;
                                        case "anteil_spezifisch_gewonnen":
                                            chatbotResponse = shareManager.shareUps(entity, round - 1);

                                            // Track advice
                                            trackConversation(round - 1, "luis_allgemein");
                                            break;
                                        case "anteil_spezifisch_verloren":
                                            chatbotResponse = shareManager.shareDowns(entity, round - 1);

                                            // Track advice
                                            trackConversation(round - 1, "luis_allgemein");
                                            break;
                                        case "rat_geben":
                                            // Only for 3rd experiment group
                                            if (parseFloat(experimentGroup) === 3) {
                                                chatbotResponse = shareManager.getRecommendAlg(round - 1);

                                                // Track advice
                                                trackConversation(round - 1, "luis_rat");
                                            }
                                            break;
                                        case "wert_portfolio":
                                            chatbotResponse = shareManager.portfolioValue();

                                            // Track advice
                                            trackConversation(round - 1, "luis_allgemein");
                                            break;
                                        default:
                                            console.log(`Dispatch unrecognized intent: ${intent}.`);
                                            break;
                                    }
                                }

                                // Send respond
                                dispatchBotEvent(chatbotResponse, "chatEvent", turnContext);
                            }
                        }
                    }
                }*/
                //=======================================================================================================
            }

            // Incoming example question event
            if (data.name === 'exampleQuestionEvent') {

                let chatbotResponse = "";
                const group = parseFloat(experimentGroup);

                // // Only available when experiment started
                // if (group === 2) {
                //
                //     chatbotResponse = "**Folgende Fragen kannst du mir beispielsweise stellen:**\n" +
                //         "- Welcher Anteil hat am meisten an Wert gewonnen/ verloren?\n" +
                //         "- Wenn Anteil C an Wert gewinnt/ verliert, wie viel wird er in der folgenden Periode wert sein?\n" +
                //         "- Wie oft hat Anteil F an Wert gewonnen/ verloren?\n" +
                //         "- Wie hoch ist die Gesamtrendite meines Portfolios?\n" +
                //         "- Wer bist du?";
                // } else if (group === 3) {
                //     chatbotResponse = "**Folgende Fragen kannst du mir beispielsweise stellen:**\n" +
                //         "- Welcher Anteil hat am meisten an Wert gewonnen/ verloren?\n" +
                //         "- Wenn Anteil C an Wert gewinnt/ verliert, wie viel wird er in der folgenden Periode wert sein?\n" +
                //         "- Wie oft hat Anteil F an Wert gewonnen/ verloren?\n" +
                //         "- Wie hoch ist die Gesamtrendite meines Portfolios?\n" +
                //         "- Kannst du mir einen Rat geben?\n" +
                //         "- Wer bist du?";
                // }
                //
                // // Dispatch example questions
                // dispatchBotEvent(chatbotResponse, "chatEvent");
                //
                // // Dispatch click on 'Starte Experiment' message
                // if (!openForTrading) {
                //     dispatchBotEvent("Bitte klicke nun auf 'Starte Experiment', um zu beginnen.", "chatEvent");
                // }
            }

            // Incoming luis und qna events
            if (((data.name === 'luisEvent') || (data.name === 'qnaEvent')) && correctEvent) {

                let chatbotResponse = "";

                // Only available when experiment started
                if (openForTrading === true) {

                    if (data.name === 'luisEvent') {
                        const intent = channelData.intent;
                        const entity = channelData.entity;

                        console.log("Intent: " + intent);
                        console.log("Entity: " + entity);

                        // switch (intent) {
                        //     case "anteil_gewonnen_max":
                        //         chatbotResponse = shareManager.mostUps(round - 1);
                        //         break;
                        //     case "anteil_verloren_max":
                        //         chatbotResponse = shareManager.mostDowns(round - 1);
                        //         break;
                        //     case "anteil_potentieller_zuwachs":
                        //         chatbotResponse = shareManager.potentialUp(entity);
                        //         break;
                        //     case "anteil_potentieller_verlust":
                        //         chatbotResponse = shareManager.potentialDown(entity);
                        //         break;
                        //     case "anteil_spezifisch_gewonnen":
                        //         chatbotResponse = shareManager.shareUps(entity, round - 1);
                        //         break;
                        //     case "anteil_spezifisch_verloren":
                        //         chatbotResponse = shareManager.shareDowns(entity, round - 1);
                        //         break;
                        //     case "rat_geben":
                        //         // Only for 3rd experiment group
                        //         if (parseFloat(experimentGroup) === 3) {
                        //             chatbotResponse = shareManager.getRecommendAlg(round - 1);
                        //
                        //             // Track advice
                        //             advice[round - 1] ++;
                        //         }
                        //         break;
                        //     case "wert_portfolio":
                        //         chatbotResponse = shareManager.portfolioValue();
                        //         break;
                        //     default:
                        //         console.log(`Dispatch unrecognized intent: ${intent}.`);
                        //         break;
                        // }
                    } else {
                        // QnA Maker response
                        // chatbotResponse = channelData.answer;
                    }
                } else {
                    chatbotResponse = "Bitte starte erst das Experiment.";
                }

                // Dispatch message
                dispatchBotEvent(chatbotResponse, "chatEvent", turnContext);
            }
        }
    });
}

let input = null;

$(document).ready(function () {
    // Chatbot UI

    setTimeout(function () {

        input = document.getElementsByTagName("input");
        console.log(input.length);

        if (experimentGroup === "2") {
            input.item(0).placeholder = "Stelle mir eine Frage";
        } else if (experimentGroup === "3") {
            input.item(0).placeholder = "Frage mich nach einem Rat";
        }

    }, 500);
});
