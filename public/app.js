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

// Array for round budgets, portfolios and total cashout values
let cashoutBudget = [];
let cashoutPortfolio= [];
let cashoutTotal = [];

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
const experimentGroup = parseFloat((url.searchParams.get("experimentGroup") === null || url.searchParams.get("experimentGroup") === "") ? 3 : url.searchParams.get("experimentGroup")); // 2 as default

// Create unique user ID
const userId = surveyId + "-" + pricePath + "-" + experimentRound + "-" + experimentGroup + "-" + cabinNo;

// console.log("Survey ID: " + surveyId + "\n",
//     "Price path: " + pricePath + "\n",
//     "Experiment round: " + experimentRound + "\n",
//     "Experiment group: " + experimentGroup + "\n",
//     "Cabin no: " + cabinNo
// );

let conversationHistory = null;

// =================================== Create Share Manager =======================================
const pricesArray = createShareManager(pricePath, 2000, function (budget, prices) {
    shareManager = new ShareManager(budget, prices);
});

// =================================== User Interface =======================================

// Hide or show chat bot based on experiment , e.g. 1 for hide, 2 for show
if (experimentGroup === 1) {
    hideChatBot();
}

// // Set font size of chat bot
// setBotFontSize();

// Create "Empfehlung" Button
if ([4,6].includes(experimentGroup)) {
    createRecButton();
    hideCardHeader();
}

// Create chart
const chart = new ApexCharts(
    document.querySelector("#chart"),
    options
);
chart.render();

// Show price table and hide chart and investment table
// let x = document.getElementById("chart");
// x.style.display = "none";
// x = document.getElementById("investments");
// x.style.display = "none";
showPrices();

// Hide 'Klicke unten auf Weiter' button
document.getElementById("end").style.display = "none";

// Table
let input = null;
$(document).ready(function () {

    // Table UI - headers
    input = document.getElementsByTagName("th");
    for (let i = 0; i < input.length; i++) {

        const e = input[i];

        // For first column
        if (i === 0 || i === 15) {
            e.style.width = "70px";
        } else {
            e.style.width = "39px";
        }
    }

    // Table UI - Preise - Transaktionen
    input = document.getElementsByTagName("td");
    for (let i = 0; i < input.length; i++) {
        const e = input[i];
            e.style.width = "110px";
    }
});

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
            if (action.type === 'DIRECT_LINE/POST_ACTIVITY') {
                const name = (userName === null) ? "noname" : userName;
                action = window.simpleUpdateIn(action, ['payload', 'activity', 'channelData', 'name'], () => name);
            }

            return next(action);
        }
    );

    console.log(window.screen.width + "x" + window.screen.height);
    console.log(window.devicePixelRatio);

    let fontSize = "100%";
    // if (window.screen.width < 1000) {
    //     fontSize = "60%";
    // } else {
    //     fontSize = "80%";
    // }

    // Style bot
    const styleOptions = {
        botAvatarImage: (![4,6].includes(experimentGroup) ? 'https://issd-trading.azurewebsites.net/images/type_3a.png' : ""),
        botAvatarInitials: (![4,6].includes(experimentGroup) ? '' : null),
        // userAvatarImage: 'https://www.ksri.kit.edu/img/personen/Morana_Stefan_2016.jpg',
        // userAvatarInitials: 'WC',
        hideUploadButton: true,
        backgroundColor: '#f8f9fa',
        bubbleFromUserBackground: '#DCF8C6',
        bubbleFromUserBorderRadius: 10,
        bubbleBorderRadius: 10,
        fontSizeSmall: fontSize
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

    // Set font size of chat bot once loaded
    setBotFontSize();

    // Chatbot UI
    setTimeout(function () {

        input = document.getElementsByTagName("input");
        // console.log(input.length);

        if (experimentGroup === 2) {
            input.item(0).placeholder = "Stelle mir eine Frage";
        } else if ([3,5].includes(experimentGroup)) {
            input.item(0).placeholder = "Frage mich nach einem Rat";
        }

    }, 200);

    document.querySelector('#next').addEventListener('click', (e) => {
        buttonActionEvent(e, "next");
    });

    document.querySelector('#button_buy1').addEventListener('click', (e) => {
        buttonActionEvent(e, "buy");
    });

    document.querySelector('#button_buy2').addEventListener('click', (e) => {
        buttonActionEvent(e, "buy");
    });

    document.querySelector('#button_buy3').addEventListener('click', (e) => {
        buttonActionEvent(e, "buy");
    });

    document.querySelector('#button_buy4').addEventListener('click', (e) => {
        buttonActionEvent(e, "buy");
    });

    document.querySelector('#button_buy5').addEventListener('click', (e) => {
        buttonActionEvent(e, "buy");
    });

    document.querySelector('#button_buy6').addEventListener('click', (e) => {
        buttonActionEvent(e, "buy");
    });

    document.querySelector('#button_sell1').addEventListener('click', (e) => {
        buttonActionEvent(e, "sell");
    });

    document.querySelector('#button_sell2').addEventListener('click', (e) => {
        buttonActionEvent(e, "sell");
    });

    document.querySelector('#button_sell3').addEventListener('click', (e) => {
        buttonActionEvent(e, "sell");
    });

    document.querySelector('#button_sell4').addEventListener('click', (e) => {
        buttonActionEvent(e, "sell");
    });

    document.querySelector('#button_sell5').addEventListener('click', (e) => {
        buttonActionEvent(e, "sell");
    });

    document.querySelector('#button_sell6').addEventListener('click', (e) => {
        buttonActionEvent(e, "sell");
    });

    // Only for experiment group 4
    if ([4,6].includes(experimentGroup)) {
        document.querySelector('#button_advice').addEventListener('click', (e) => {
            buttonActionEvent(e, "advice");
        });
    }

    // Create event listener for summary and result event
    window.document.addEventListener('botEvent', handleEvent, false);

    function handleEvent(e) {
        // console.log(e);
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
            // console.log("Result:");
            // console.log(data);
        }
    }

    // Listening for incoming response events of type buy, sell or next
    window.addEventListener('webchatincomingactivity', ({data}) => {
        // console.log(`Received a bot activity of type "${data.type}":`);
        // console.log(data);
        // Don't jump into if clause at messages and webchat/join event
        if (data.type === "event" && data.name !== "webchat/join") {
            const channelData = data.channelData;
            const correctEvent = !channelData.hasOwnProperty("clientActivityID"); // because bot sends two events
            const turnContext = channelData.turnContext; //original turnContext

            // Incoming welcome message event
            if (data.name === 'welcomeEvent') {

                let chatbotResponse = "";

                // Only available when experiment started
                if (experimentGroup === 2) {
                    chatbotResponse = "Hallo, ich bin dein Robo Assistant.\n" +
                        "Du kannst mir Fragen zu deinem Portfolio oder zu den Preisentwicklungen der Anteile stellen.";

                } else if ([3,5].includes(experimentGroup)) {
                    chatbotResponse = "Hallo, ich bin dein Robo Assistant.\n" +
                        "Du kannst mir Fragen zu deinem Portfolio oder zu den Preisentwicklungen der Anteile stellen. " +
                        "Außerdem kannst du mich nach einer Investitionsempfehlung fragen.";
                }

                // No welcome message for experiment group 4 and 6
                if (![4,6].includes(experimentGroup)) {
                    // Dispatch welcome message and ask for user name
                    dispatchBotEvent(chatbotResponse, "chatEvent", turnContext, function () {
                        // Dispatch click on 'Starte Experiment' message
                        // dispatchBotEvent("Mein Name ist Charles. Wie lautet deiner?", "chatEvent", turnContext);

                        // Ask user for example questions with suggested answers
                        dispatchBotEvent("", "suggestedActionEvent", turnContext);
                    });
                }
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
                    } else if ([3,5].includes(group)) {
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
                    const noQuestions = ['Nein, danke.'];
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
            }

            // Incoming example question event
            if (data.name === 'exampleQuestionEvent') {

                let chatbotResponse = "";
                const group = parseFloat(experimentGroup);

            }

            // Incoming luis und qna events
            if (((data.name === 'luisEvent') || (data.name === 'qnaEvent')) && correctEvent) {

                let chatbotResponse = "";

                // Only available when experiment started
                if (openForTrading === true) {

                    if (data.name === 'luisEvent') {
                        const intent = channelData.intent;
                        const entity = channelData.entity;

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

//==================== Send result every 60 seconds to prevent session timeout in LimeSurvey ===============
setInterval(function(){
    sendResult()}, 60 * 1000);
