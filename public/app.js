// Get URL parameters
const url_string = window.location.href;
const url = new URL(url_string);
const surveyId = url.searchParams.get("surveyId");
const pricePath = url.searchParams.get("pricePath");
const experimentRound = url.searchParams.get("experimentRound");
const cabinNo = url.searchParams.get("cabinNo");
const experimentGroup = url.searchParams.get("experimentGroup");

console.log("Survey ID: " + surveyId + "\n",
    "Price path: " + pricePath + "\n",
    "Experiment round: " + experimentRound + "\n",
    "Experiment group: " + experimentGroup+ "\n",
    "Cabin no: " + cabinNo
);

// Create unique user ID
const userId = surveyId + "_" + pricePath + "_" + experimentRound + "_" + experimentGroup + "_" + cabinNo;

// Hide or show chat bot based on experiment , e.g. 1 for hide, 2 for show
if (parseFloat(experimentGroup ) === 1) {
    hideChatBot();
}

// // Create chart
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

// Get token from secret and start chat bot
let token_ = "";
// let conversationId_ = "";
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
        // botAvatarImage: 'https://image.flaticon.com/icons/svg/1156/1156419.svg',
        // botAvatarInitials: 'BF',
        // userAvatarImage: 'https://www.ksri.kit.edu/img/personen/Morana_Stefan_2016.jpg',
        // userAvatarInitials: 'WC',
        hideUploadButton: true,
        backgroundColor: '#f8f9fa',
        bubbleFromUserBackground: '#DCF8C6',
        bubbleFromUserBorderRadius: 10,
        bubbleBorderRadius: 10,

    };

    window.WebChat.renderWebChat(
        {
            directLine: window.WebChat.createDirectLine({token: token_})
            ,store
            ,userID: userId
            // ,username: 'Web Chat User'
            , locale: 'de-de'
            ,styleOptions: styleOptions
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

        store.dispatch({
            type: 'WEB_CHAT/SEND_EVENT',
            payload: {
                name: type,
                value: data
            }
        });

        if (type === "result") {
            console.log("Result:");
            console.log(data);
        }
    }

    // Listening for incoming response events of type buy, sell or next
    window.addEventListener('webchatincomingactivity', ({data}) => {
        console.log(`Received an activity of type "${ data.type }":`);
        console.log(data);
        // Don't jump into if clause at messages and webchat/join event
        if (data.type === "event" && data.name !== "webchat/join") {
            const channelData = data.channelData;
            const correctEvent = !channelData.hasOwnProperty("clientActivityID"); // because bot sends two events
            if (data.name === 'buy' && correctEvent) {
                // if (channelData.open === false) {
                //     alertNotOpen();
                // } else if (channelData.success === false) {
                //     alertInsufficientEndowment();
                // }
            }
            if (data.name === 'sell' && correctEvent) {
                // if (channelData.open === false) {
                //     alertNotOpen();
                // } else if (channelData.success === false) {
                //     alertInsufficientHoldings();
                // }
            }
            if (data.name === 'next' && correctEvent && channelData.reload === false) {
                // const data = channelData.appendData;
                // chart.appendData(data.prices);
                // appendTable("price", data.prices);
                // appendTable("invest", data.invests);
                //
                // // Only for last round
                // if (channelData.cashout > 0) {
                //     alertEarnings(channelData.cashout);
                // }
            } else if (channelData.reload === true) {
                // This is round 14
                // window.location.reload();
            }
            // Rename elements only for correct events
            if (correctEvent) {
                // const renameArray = channelData.rename;
                // for (let i = 0; i < renameArray.length; i++) {
                //     const obj = renameArray[i];
                //     document.getElementById(obj.id).innerHTML = obj.content;
                // }
            }

            if (data.name === 'luisEvent' && correctEvent) {

                let luisResponse = "LUIS response";
                const intent = channelData.intent;
                const entity = channelData.entity;

                console.log("Intent: " + intent);
                console.log("Entity: " + entity);

                switch (intent) {
                    case "anteil_gewonnen_max":
                        
                        break;
                    case "anteil_verloren_max":
                        break;
                    case "anteil_potentieller_zuwachs":
                        break;
                    case "anteil_potentieller_verlust":
                        break;
                    case "anteil_spezifisch_gewonnen":
                        break;
                    case "anteil_spezifisch_verloren":
                        break;
                    case "rat_geben":
                        break;
                    case "wert_portfolio":
                        break;
                    default:
                       console.log(`Dispatch unrecognized intent: ${ intent }.`);
                        break;
                }

                // Create event to request summary
                const event = new CustomEvent('botEvent', {
                    detail: {
                        type: "summaryRequest",
                        data: luisResponse
                    }
                });

                // Send event to own event handler
                window.document.dispatchEvent(event);
            }
        }
    });
}

// This round number controls the requested price paths
let round = 0;

let openForTrading = null;
let shareManager = null;

// getData(function (obj) {
//     const pricesArray = obj.pricesArray;
//     const recAlgArray = obj.recAlgArray;
//     const recExpArray = obj.recExpArray;
//     const recPeerArray = obj.recPeerArray;
//     const budget = 2000;
//
//     shareManager = new ShareManager(budget, 0, pricesArray, recAlgArray, recExpArray, recPeerArray);
// });

// Create share manager
createShareManager(pricePath, 2000);