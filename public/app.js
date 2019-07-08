// Set language
let language = "German"
changeLanguage();

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

    window.WebChat.renderWebChat(
        {
            directLine: window.WebChat.createDirectLine({token: token_}),
            store
            // ,userID: 'YOUR_USER_ID'
            // ,username: 'Web Chat User'
            , locale: 'de-de'
            // ,botAvatarInitials: 'WC'
            // ,userAvatarInitials: 'WW'
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
        }
    });
}

// Get URL from parent
// window.document.addEventListener('myParentEvent', handleEvent, false);
// function handleEvent(e) {
//     //console.log(e.detail.url)
//     const url_string = e.detail.url;
//     // const url = new URL(url_string);
//     // const param = url.searchParams.get("_ijt");
//     // console.log(url_string);
//
//     // Get survey ID replace this with url_string
//     surveyId = getSurveyId("https://issd-ra.limequery.com/322313?lang=en");
//     console.log(surveyId);
// }

// const data = {foo: 'bar'};
// const event = new CustomEvent('myChildEvent', {detail: data});
// window.parent.document.dispatchEvent(event);

// Get URL parameters
const url_string = window.location.href;
const url = new URL(url_string);
const surveyId = url.searchParams.get("surveyId");
const pricePath = url.searchParams.get("pricePath");
const experimentRound = url.searchParams.get("experimentRound");
const cabinNo = url.searchParams.get("cabinNo");

console.log("Survey ID: " + surveyId + "\n",
    "Price path: " + pricePath + "\n",
    "Experiment round: " + experimentRound + "\n",
    "Cabin no: " + cabinNo
    );

// This round number controls the requested price paths
let round = 0;

let openForTrading = false;
let shareManager = null;

getData(function (obj) {
    const pricesArray = obj.pricesArray;
    const recAlgArray = obj.recAlgArray;
    const recExpArray = obj.recExpArray;
    const recPeerArray = obj.recPeerArray;
    const budget = 2000;

    shareManager = new ShareManager(budget, 0, pricesArray, recAlgArray, recExpArray, recPeerArray);
});