// Show prices when user clicks on button
function showPrices() {
    document.getElementById("chart").style.display = "none";
    document.getElementById("investments").style.display = "none";
    document.getElementById("prices").style.display = "block";
    document.getElementById("header_share_prices").innerHTML = "Preise und Transaktionen";
}

// Show chart
function showChart() {
    document.getElementById("prices").style.display = "none";
    document.getElementById("investments").style.display = "none";
    document.getElementById("chart").style.display = "block";
    document.getElementById("header_share_prices").innerHTML = "Chart";

    // To display chart on Firefox
    chart.updateOptions({
        yaxis: {
            min: 60,
            max: 180
        }
    })
}

// Hide chat bot for certain experiment groups
function hideChatBot() {
    let x = document.getElementById("webchat-card");
    x.style.display = "none";
}

// Set font size of chat bot
function setBotFontSize() {
    let cDiv = document.getElementById("webchat").children;

    for (let i = 0; i < cDiv.length; i++) {
        if (cDiv[i].tagName === "DIV") {
            // const fontSize = parseInt((window.screen.width * window.devicePixelRatio) / 120 );
            // cDiv[i].style.fontSize = fontSize + 'px';
            cDiv[i].style.fontSize = '15px';
        }
    }

    console.log(cDiv);
}

// Show chat bot for certain experiment groups
function showBlankChatBot() {
    let x = document.getElementById("webchat");
    x.style.display = "none";

    x = document.getElementById("webchat_blank");
    x.style.display = "block";
}

// Show chat bot for certain experiment groups
function showChatBot() {
    let x = document.getElementById("webchat");
    x.style.display = "block";

    x = document.getElementById("webchat_blank");
    x.style.display = "none";
}

// Hide all
function hideAll() {
    document.getElementById("webchat-card").style.display = "none";
    document.getElementById("buy-sell-card").style.display = "none";
    document.getElementById("table-card").style.display = "none";
    document.getElementById("navigation-bar").style.display = "none";
}

// Create recommendation button
function createRecButton() {
    const button = document.createElement("button");

    button.setAttribute("id", "button_advice");
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn-btn-advice btn-advice");
    button.style.backgroundColor="white";
    button.style.borderColor="#d7d1de";
    button.style.position = "absolute";
    button.style.bottom = "0px";
    button.innerHTML="Empfehlung";

    const element = document.getElementById("recommendation-div");
    element.appendChild(button);

    // Increase height of webchat
    document.getElementById("webchat").style.height = "100%";
}

// Hide card header of chat card for experiment group 4
function hideCardHeader() {
    document.getElementById("chat-card-header").style.display = "none";
}

// Create share manager object for a certain price path
function createShareManager(pricePath, budget, callback) {

    // Call function to read csv file
    readTextFile("./data/path" + pricePath + ".csv", function (obj) {

        // Convert csv file to array
        let x = obj.toString() // convert Buffer to string
            .split('\n') // split string to lines
            .map(e => e.trim()) // remove white spaces for each line
            .map(e => e.split(';').map(e => e.trim())); // split each line to array

        // Prices from selected price path
        const pricesArray = {
            0: x[2].slice(1, 15),
            1: x[3].slice(1, 15),
            2: x[4].slice(1, 15),
            3: x[5].slice(1, 15),
            4: x[6].slice(1, 15),
            5: x[7].slice(1, 15)
        };

        const pricesArrayMap = {
            0: pricesArray[mapping.no[0]],
            1: pricesArray[mapping.no[1]],
            2: pricesArray[mapping.no[2]],
            3: pricesArray[mapping.no[3]],
            4: pricesArray[mapping.no[4]],
            5: pricesArray[mapping.no[5]]
        };


        callback(budget, pricesArrayMap);

        // Create share manager object
        // shareManager = new ShareManager(budget, pricesArray);
    });
}

function getRandomMapping() {
    let randNo = generateRandomNo(0, 6);
    let map_no = null;
    let map_char = null;

    switch (randNo) {
        case 1:
            map_no = {
                0: 0,
                1: 1,
                2: 2,
                3: 3,
                4: 4,
                5: 5
            };
            map_char = {
                "A": 0,
                "B": 1,
                "C": 2,
                "D": 3,
                "E": 4,
                "F": 5
            };
            break;
        case 2:
            map_no = {
                0: 1,
                1: 2,
                2: 3,
                3: 4,
                4: 5,
                5: 0
            };
            map_char = {
                "A": 1,
                "B": 2,
                "C": 3,
                "D": 4,
                "E": 5,
                "F": 0
            };
            break;
        case 3:
            map_no = {
                0: 2,
                1: 3,
                2: 4,
                3: 5,
                4: 0,
                5: 1
            };
            map_char = {
                "A": 2,
                "B": 3,
                "C": 4,
                "D": 5,
                "E": 0,
                "F": 1
            };
            break;
        case 4:
            map_no = {
                0: 3,
                1: 4,
                2: 5,
                3: 0,
                4: 1,
                5: 2
            };
            map_char = {
                "A": 3,
                "B": 4,
                "C": 5,
                "D": 0,
                "E": 1,
                "F": 2
            };
            break;
        case 5:
            map_no = {
                0: 4,
                1: 5,
                2: 0,
                3: 1,
                4: 2,
                5: 3
            };
            map_char = {
                "A": 4,
                "B": 5,
                "C": 0,
                "D": 1,
                "E": 2,
                "F": 3
            };
            break;
        case 6:
            map_no = {
                0: 5,
                1: 0,
                2: 1,
                3: 2,
                4: 3,
                5: 4
            };
            map_char = {
                "A": 5,
                "B": 0,
                "C": 1,
                "D": 2,
                "E": 3,
                "F": 4
            };
            break;
    }

    return {
        no: map_no,
        char: map_char
    }
}

// Reade price path csv file
async function readTextFile(file, callback) {
    const rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = await function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status === 0) {
                const allText = rawFile.responseText;
                callback(allText);
            }
        }
    };
    rawFile.send(null);
}

/**
 *
 * @param callback
 */
function getToken(callback) {
    let request_ = new XMLHttpRequest();
    let secret = '';

    // Call function to read csv file
    readTextFile("secret.txt", function (obj) {

        // Get secret
        secret = obj.toString();

        // var encodedParams = encodeURIComponent(params);
        request_.open("POST", "https://directline.botframework.com/v3/directline/tokens/generate", true);
        request_.setRequestHeader("Authorization", "Bearer " + secret);
        request_.send();
        request_.onreadystatechange = function () {
            if (request_.readyState === 4 && request_.status === 200) {
                const response = request_.responseText;
                const obj = JSON.parse(response);
                // console.log(obj);
                token_ = obj.token;
                conversationId_ = obj.conversationId;
                callback();
            }
        };
    });

    // // var encodedParams = encodeURIComponent(params);
    // request_.open("POST", "https://directline.botframework.com/v3/directline/tokens/generate", true);
    // request_.setRequestHeader("Authorization", "Bearer " + secret);
    // request_.send();
    // request_.onreadystatechange = function () {
    //     if (request_.readyState === 4 && request_.status === 200) {
    //         const response = request_.responseText;
    //         const obj = JSON.parse(response);
    //         // console.log(obj);
    //         token_ = obj.token;
    //         conversationId_ = obj.conversationId;
    //         callback();
    //     }
    // };
}

function getConversationHistory(filterCallback, resultCallback) {
    let request_ = new XMLHttpRequest();
    const url = "https://directline.botframework.com/v3/directline/conversations/" + conversationId_ + "/activities";

    request_.open("GET", url, true);
    request_.setRequestHeader("Authorization", "Bearer " + token_);
    request_.send();
    request_.onreadystatechange = function () {
        if (request_.readyState === 4 && request_.status === 200) {
            const response = request_.responseText;
            const obj = JSON.parse(response);
            // console.log(obj);
            // conversationHistory = obj;

            // Filter for messages only
            filterCallback(obj, resultCallback);
        }
    };
}

function filterMessages(conversationRaw, resultCallback) {
    let conv = conversationRaw.activities;
    let conv_clean = [];

    // Filter only for messages
    for (let i = 0; i < conv.length; i++) {
        const activity = conv[i];

        // Only if not an event and if text property is available
        if ((typeof (activity.type) !== 'undefined') && (typeof (activity.text) !== 'undefined') && (typeof (activity.from) !== 'undefined') && (typeof (activity.timestamp) !== 'undefined')) {
            if (activity.type === "message") {
                conv_clean.push({
                    timestamp: activity.timestamp,
                    from: activity.from.id,
                    text: activity.text
                });
            }
        }
    }

    conversationHistory = conv_clean;

    // Call send result function
    resultCallback();
}

function buttonActionEvent(e, action) {
    if (action === "buy") {
        // Get ID of button
        const buttonId = e.target.id;
        // console.log("Pressed button: " + buttonId);
        // Get number of button, e.g. 1-6
        const lastChar = parseFloat(buttonId.substr(buttonId.length - 1)) - 1;

        const res = shareManager.buyGood(lastChar, openForTrading);

        // Check if game started
        if (res.open !== null) {
            if (res.open === false) {
                alertNotOpen();
            } else if (res.success === false) {
                alertInsufficientEndowment(lastChar);
            }
        } else {
            alertNotStarted();
        }
        renameElements(res.rename);
    } else if (action === "sell") {
        // Get ID of button
        const buttonId = e.target.id;
        // console.log("Pressed button: " + buttonId);
        // Get number of button, e.g. 1-6
        const lastChar = parseFloat(buttonId.substr(buttonId.length - 1)) - 1;

        const res = shareManager.sellGood(lastChar, openForTrading);

        // Check if game started
        if (res.open !== null) {
            if (res.open === false) {
                alertNotOpen();
            } else if (res.success === false) {
                alertInsufficientHoldings(lastChar);
            }
        } else {
            alertNotStarted();
        }
        renameElements(res.rename);
    } else if (action === "next") {
        // 'Next' event
        if (round === 0) {

            // Repeat three times when first clicked on next button
            for (let i = 0; i < 4; i++) {
                triggerNextRound();
            }

            // Ask user for name again -- only for experiment group 2 and 3
            if ([2,3,5].includes(experimentGroup)) {
                if (userName === null) {
                    let chatbotResponse = "Bitte nenne mir deinen Namen.";
                    dispatchBotEvent(chatbotResponse, "chatEvent", null);
                }
            }
        } else {
            triggerNextRound()
        }
    } else if (action === "advice") {
        // Advice event
        // Check if game started
        if (openForTrading !== null) {
            if (openForTrading === false) {
                alertNotOpen();
            } else {
                // Get advice
                if (experimentGroup === 4) {

                    // Get and send recommendation
                    const chatbotResponse = shareManager.getRecommendation(round - 1, false);
                    dispatchBotEvent(chatbotResponse, "chatEvent", null);

                    // Track advice
                    trackConversation(round - 1, "luis_rat");
                }
            }
        } else {
            alertNotStarted();
        }
    }
}

function triggerNextRound() {
    // 'Next' event
    const res = nextRound(round);
    if (res.reload === false) {
        const data = res.appendData;
        chart.appendData(data.prices);
        appendTable(data.prices, true);
        if (round !== 0) {
            appendTable(data.invests, false);
        }

        // Only for last round
        if (res.cashout !== null) {
            alertEarnings(res.cashout);
        }
    } else if (res.reload === true) {
        // This is round 14
        // window.location.reload();

        // Hide all elements
        hideAll();
    }
    renameElements(res.rename);
    // Increase round number
    round++;
}

// Get data for a certain round
function nextRound(round) {
    // Add timestamp
    times.push(getDate());

    let obj = {
        rename: [
            {
                id: 'next',
                content: 'Nächste Runde'
            }
        ],
        reload: false,
        cashout: null
    };

    // Get data for new round only up until round 14. In round 14 reload the page
    let data = null;
    if (round !== 14) {
        const res = shareManager.nextRound(round);
        data = res.data;
        // Includes an array with all buttons whose value is to be changed
        const renameArray = res.rename;
        for (let i = 0; i < renameArray.length; i++) {
            obj.rename.push(renameArray[i]);
        }
    }

    // Add budget, portfolio and total cashout value
    const cashoutResult = shareManager.cashout();
    cashoutBudget.push(cashoutResult.budget);
    cashoutPortfolio.push(cashoutResult.portfolio);
    cashoutTotal.push(cashoutResult.total);

    // console.log(round);
    if (round === 0) {
        // Initiate game
        // Change from null to false so that the 'game not started' alert doesn't show up anymore
        openForTrading = false;

        obj.appendData = {
            prices: data.prices,
            invests: data.invests
        };
    } else if (round === 2) {
        // Allow user to trade and show budget
        obj.rename.push({
            id: 'budget',
            content: '2000'
        });

        // Open trading from round 3
        openForTrading = true;
        obj.appendData = {
            prices: data.prices,
            invests: data.invests
        };
    } else if (round === 12) {
        // Last round where user is able to trade
        obj.appendData = {
            prices: data.prices,
            invests: data.invests
        };
        obj.rename.push(
            {
                id: 'next',
                content: 'Fertig'
            }
        );
    } else if (round === 13) {
        // Prevent user from trading and send results to bot
        obj.appendData = {
            prices: data.prices,
            invests: data.invests
        };
        obj.cashout = shareManager.cashout();

        // Hide next button
        document.getElementById("next").style.display = "none";
        document.getElementById("end").style.display = "block";

        // Stop trading in round 13
        openForTrading = false;

        // Get conversation history and send results to chat bot afterwards
        // getConversationHistory(sendResult);

    } else if (round === 14) {
        // Refresh page
        obj.reload = true;
    } else {// Normal round
        obj.appendData = {
            prices: data.prices,
            invests: data.invests
        };
    }

    // Generate round summaries -- only for experiment groups 1 to 3
    if ([1,2,3].includes(experimentGroup)) {
        sendRoundSummary(round);
    }

    // Get conversation history and send result
    getConversationHistory(filterMessages, sendResult);

    return obj;
}

function sendRoundSummary(round) {

    let summary = null;

    const defaultMessageRounds = [5,8,10,11];

    // Check for round
    if (round === 3) {
        // Send fixed summary that has number 0
        summary = getRoundSummary(0);
    } else if (defaultMessageRounds.includes(round)) {

        // Send default message
        const randNo = getRandomNo();
        // console.log("random number: " + randNo);
        summary = getRoundSummary(randNo);

    } else if (round === 6) {
        // Send fixed summary that has number 11
        summary = getRoundSummary(13);
    } else if (round === 12) {
        // Send fixed summary that has number 11
        summary = getRoundSummary(11);
    } else if (round === 13) {
        // Send fixed summary that has number 11
        summary = getRoundSummary(12);
    }

    // console.log(summary);

    // Create event to request summary
    const event = new CustomEvent('botEvent', {
        detail: {
            type: "summaryRequest",
            data: summary
        }
    });

    // Send event to own event handler
    window.document.dispatchEvent(event);
}

function getRandomNo() {

    let randNo = generateRandomNo(0, 10);

    // Check if summary has been dropped already
    while (forbiddenSummaries.includes(randNo) > 0) {
        randNo = generateRandomNo(0, 10);
    }

    return randNo
}

function getRoundSummary(no) {
    let res = null;

    // Ensure that this summary cannot occure twice
    forbiddenSummaries.push(no);

    // Check for requested summary
    switch (no) {
        case 0:
            res = "Es geht los! Mit deinem Guthaben kannst du ab jetzt Anteile handeln.";
            break;
        case 1:
            res = getRoundSummaryForShare("A");
            break;
        case 2:
            res = getRoundSummaryForShare("B");
            break;
        case 3:
            res = getRoundSummaryForShare("C");
            break;
        case 4:
            res = getRoundSummaryForShare("D");
            break;
        case 5:
            res = getRoundSummaryForShare("E");
            break;
        case 6:
            res = getRoundSummaryForShare("F");
            break;
        case 7:
            res = getRoundSummaryForTrades();
            break;
        case 8:
            res = '"Das Wichtigste für einen Investor ist nicht der Intellekt sondern das Temperament. ' +
                "Du solltest weder große Freude empfinden, wenn Du mit der " +
                'Masse läufst und ebenso wenig, wenn Du gegen den Strom schwimmst." – Warren Buffett';
            //
            // // Ensure that this summary cannot occure twice
            // forbiddenSummaries.push(8);
            break;
        case 9:
            res = '"Der Ziellose erleidet sein Schicksal – der Zielbewusste gestaltet es!" – Immanuel Kant';

            // Ensure that this summary cannot occure twice
            // forbiddenSummaries.push(9);
            break;
        case 10:
            res = getRoundSummaryForPossibleTrade();
            break;
        case 11:
            if (userName !== null) {
                res = userName + ", das ist deine letzte Chance, Gewinn zu machen! Bald hast du es geschafft.";
            } else {
                res = "Das ist deine letzte Chance, Gewinn zu machen! Bald hast du es geschafft."
            }
            break;
        case 12:
            res = "Das Experiment ist jetzt zu Ende. Bitte klicke jetzt unten auf 'Weiter'.";
            break;
        case 13:
            res = "Hast du eine Frage für mich?";
            break;
    }

    return res;
}

function getRoundSummaryForShare(shareType) {

    // Create mapping table
    const mapping = {
        A: 0,
        B: 1,
        C: 2,
        D: 3,
        E: 4,
        F: 5
    };

    // Set share and share no
    const share = shareType;
    const shareNo = mapping[share];

    // Get current value of share
    const currentValue = Math.round(shareManager.goodPriceHist[shareNo][round]);

    // Create first part of the response
    let res = "Der Preis von Anteil " + share + " ist jetzt " + currentValue + ".\n";

    // Get last value of share A
    const lastValue = Math.round(shareManager.goodPriceHist[shareNo][round - 1]);

    // Create second part of the respone depending on value development
    if (currentValue > lastValue) {
        res = res + "In der letzten Periode war Anteil " + share + " günstiger."
    } else {
        res = res + "In der letzten Periode war Anteil " + share + " teurer."
    }

    return res;
}

function getRoundSummaryForTrades() {

    let res = null;

    const tradesLastPeriod = shareManager.goodInvestHist[0][round - 1] +
        shareManager.goodInvestHist[1][round - 1] +
        shareManager.goodInvestHist[2][round - 1] +
        shareManager.goodInvestHist[3][round - 1] +
        shareManager.goodInvestHist[4][round - 1] +
        shareManager.goodInvestHist[5][round - 1];

    // console.log(shareManager.goodInvestHist);

    if (tradesLastPeriod === 0) {
        res = "In der letzten Periode war wohl nichts für dich dabei. Vielleicht willst du jetzt wieder Anteile handeln."
    } else {
        res = "Mut steht am Anfang des Handelns. Glück am Ende."
    }

    return res;
}

function getRoundSummaryForPossibleTrade() {

    // Create mapping table
    const mapping = {
        0: "A",
        1: "B",
        2: "C",
        3: "D",
        4: "E",
        5: "F"
    };

    let res = null;

    const budget = Math.round(shareManager.budget);

    const cheapestShareName = mapping[shareManager.getCheapestShare(round).name];
    const highestShareName = mapping[shareManager.getHighestShare(round).name];

    const cheapestShare = Math.round(shareManager.getCheapestShare(round).value);
    const highestShare = Math.round(shareManager.getHighestShare(round).value);

    const possibleCheapest = Math.floor(budget / cheapestShare);
    const possibleHighest = Math.floor(budget / highestShare);

    if (budget >= highestShare) {
        res = "Du hast noch " + budget + " an Guthaben. Das reicht dir locker für " + possibleHighest + " Einheiten von Anteil " + highestShareName +
            " oder für " + possibleCheapest + " Einheiten von Anteil " + cheapestShareName + ".";
    } else if (budget < cheapestShare) {
        res = "Du hast noch " + budget + " an Guthaben. Das reicht dir leider nicht mal für einen Anteil " + cheapestShareName +
            ". Dafür müsstest du etwas verkaufen.";
    } else {
        res = "Du hast noch " + budget + " an Guthaben. Das reicht dir für " + possibleCheapest + " Einheiten von Anteil " + cheapestShareName + ".";
    }

    return res;
}

function sendResult() {
    // Gather data for summary
    const data = {
        userId: userId,
        surveyId: surveyId,
        pricePath: pricePath,
        cabinNo: cabinNo,
        experimentRound: experimentRound,
        experimentGroup: experimentGroup,
        cashout: shareManager.cashout(),
        cashoutBudgetArray: cashoutBudget,
        cashoutPortfolioArray: cashoutPortfolio,
        cashoutTotalArray: cashoutTotal,
        holdings: shareManager.goodHoldingsHist,
        invests: shareManager.getInvests(), // for same length as other arrays
        prices: shareManager.goodPriceHist,
        times: times,
        round: round,
        map_no: mapping.no,
        map_char: mapping.char,
        advice: advice,
        conversationHistory: conversationHistory
    };

    // Create a result object
    const result = {
        detail: {
            type: "result",
            data: data
        }
    };

    // Send event to event handler of parent
    window.parent.postMessage(result, '*');
}

// Track advice
function trackConversation(round, type) {

    switch (type) {
        case "qna":
            advice[round][0]++;
            break;
        case "luis_allgemein":
            advice[round][1]++;
            break;
        case "luis_rat":
            advice[round][2]++;
            break;
    }
}

// Process message with LUIS or QnA
function processMessage(chatbotResponse, data, turnContext) {

    // Check if experiment started. If not, openForTrading is null
    if (openForTrading == null) {
        // Experiment did not started yet
        chatbotResponse = "Bitte starte erst das Experiment.";
        dispatchBotEvent(chatbotResponse, "chatEvent", turnContext);
    } else if (openForTrading === false) {

        // Experiment is over
        chatbotResponse = "Das Experiment ist vorbei. Bitte klicke unten auf 'Weiter'.";
        dispatchBotEvent(chatbotResponse, "chatEvent", turnContext);
    } else if (openForTrading === true) {

        // Experiment started. Process message with LUIS and QnA Maker

        // Trigger Qna or LUIS processes
        if (typeof (data.channelData.answer) !== 'undefined') {

            // Send QnA Maker response
            chatbotResponse = data.channelData.answer;

            // Track advice
            trackConversation(round - 1, "qna");

        } else if (typeof (data.channelData.intent) !== 'undefined') {

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
                case "rat_geben_kaufen":
                    // Only for 3rd experiment group
                    if (experimentGroup === 3) {
                        chatbotResponse = shareManager.getRecommendation(round - 1, false);

                        // Track advice
                        trackConversation(round - 1, "luis_rat");
                    } else if (experimentGroup === 2){
                        chatbotResponse = "Diese Frage kann ich leider nicht beantworten.";
                    }
                    break;
                case "rat_geben_verkaufen":
                    // Only for 3rd experiment group
                    if (experimentGroup === 3) {
                        chatbotResponse = shareManager.getRecommendation(round - 1, true);

                        // Track advice
                        trackConversation(round - 1, "luis_rat");
                    } else if (experimentGroup === 2){
                        chatbotResponse = "Diese Frage kann ich leider nicht beantworten.";
                    }
                    break;
                case "wert_portfolio":
                    chatbotResponse = shareManager.portfolioValue();

                    // Track advice
                    trackConversation(round - 1, "luis_allgemein");
                    break;
                case "anteil_typ":
                    chatbotResponse = "Das weiß ich leider nicht.";

                    // Track advice
                    trackConversation(round - 1, "luis_allgemein");
                    break;
                case "anteil_typ_spezifisch":
                    chatbotResponse = "Das weiß ich leider nicht.";

                    // Track advice
                    trackConversation(round - 1, "luis_allgemein");
                    break;
                case "anteil_wahrscheinlichkeit_spezifisch":

                    if (experimentGroup === 3) {
                        chatbotResponse = "So genau kann ich es dir leider nicht sagen.";
                    } else {
                        chatbotResponse = "Das weiß ich leider nicht.";
                    }

                    // Track advice
                    trackConversation(round - 1, "luis_allgemein");
                    break;
                case "was_kannst_du":

                    if (experimentGroup === 3) {
                        chatbotResponse = "Ich kann grundlegende Fragen zu deinem Portfolio und der Preisentwicklung der Anteile beantworten. " +
                            "Zudem kann ich dir, basierend auf den Preisentwicklungen, Kaufempfehlungen geben.";
                    } else {
                        chatbotResponse = "Ich kann grundlegende Fragen zu deinem Portfolio und der Preisentwicklung der Anteile beantworten.";
                    }

                    // Track advice
                    trackConversation(round - 1, "qna");
                    break;
                default:
                    // console.log(`Dispatch unrecognized intent: ${intent}.`);
                    break;
            }
        }

        // Send respond
        dispatchBotEvent(chatbotResponse, "chatEvent", turnContext);
    }
}

function renameElements(res) {
    const renameArray = res;
    for (let i = 0; i < renameArray.length; i++) {
        const obj = renameArray[i];
        document.getElementById(obj.id).innerHTML = obj.content;
    }
}

function alertInsufficientEndowment(id) {
    const mapping = {
        0: "A",
        1: "B",
        2: "C",
        3: "D",
        4: "E",
        5: "F"
    };
    swal("Achtung!", "Ihr aktuelles Guthaben reicht nicht aus, um einen Anteil " + mapping[id] + " zu kaufen.", "error");
}

function alertInsufficientHoldings(id) {
    const mapping = {
        0: "A",
        1: "B",
        2: "C",
        3: "D",
        4: "E",
        5: "F"
    };
    swal("Achtung!", "Sie besitzen keinen Anteil " + mapping[id] + ", den Sie verkaufen können.", "error");
}

// Nicht mehr benötigt weil Start ab Runde 3
function alertNotOpen() {
    swal("Achtung!", "Sie können Anteile nur in den Perioden 3 bis 12 handeln.", "error");
}

// When game not started
function alertNotStarted() {
    swal("Info", "Sie müssen das Experiment erst starten, bevor Sie Anteile handeln können.", "info");
}

function alertEarnings(cash) {
    const portfolio = Math.round(cash.portfolio);
    const budget = Math.round(cash.budget);
    const total = Math.round(portfolio + budget);
    const euro_var = cash.euro_rounded - 6;

    swal("Glückwunsch!", "Ihr variabler Auszahlungsanteil beträgt " + euro_var + " Euro bzw. " + total + " Währungseinheiten. \n\n" +
        "Dieser setzt sich zusammen aus einem Restguthaben in Höhe von " + budget + " Währungseinheiten und einem Portfoliowert in Höhe von " +
        portfolio + " Währungseinheiten.", "success");
}

function appendTable(data, prices) {
    const prefix = "tab-row-price-";

    if (prices) {
        // Append prices
        appendTablePrice(prefix, data[0]["data"][0], "a");
        appendTablePrice(prefix, data[1]["data"][0], "b");
        appendTablePrice(prefix, data[2]["data"][0], "c");
        appendTablePrice(prefix, data[3]["data"][0], "d");
        appendTablePrice(prefix, data[4]["data"][0], "e");
        appendTablePrice(prefix, data[5]["data"][0], "f");
    } else {
        //Append investments
        appendTableInvest(prefix, data[0]["data"][0], "a");
        appendTableInvest(prefix, data[1]["data"][0], "b");
        appendTableInvest(prefix, data[2]["data"][0], "c");
        appendTableInvest(prefix, data[3]["data"][0], "d");
        appendTableInvest(prefix, data[4]["data"][0], "e");
        appendTableInvest(prefix, data[5]["data"][0], "f");
    }

}

function appendTablePrice(prefix, value, good) {
    const childNode = document.createElement("td");
    const textNode = document.createTextNode(value);
    childNode.appendChild(textNode);
    childNode.classList.add('text-center');
    childNode.id = good + round;
    document.getElementById(prefix + good).appendChild(childNode);
}

function appendTableInvest(prefix, value, good) {
    const node = document.getElementById(good + (round - 1));
    node.innerHTML = node.innerHTML + "<br>" + value;
}

function generateRandomNo(min, max) {
    return Math.floor(Math.random() * (max - min)) + min + 1
}

function dispatchBotEvent(chatbotResponse, type, turnContext, callback) {
    // Create event to send group specific welcome message
    let event = new CustomEvent('botEvent', {
        detail: {
            type: type,
            data: chatbotResponse,
            turnContext: turnContext
        }
    });

    // Send event to own event handler
    setTimeout(function () {
        window.document.dispatchEvent(event);
    }, 500);

    // Call callback function with delay
    if (callback !== undefined) {
        setTimeout(function () {
            callback();
        }, 1000);
    }
}

function getDate() {
    const date = new Date();
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
    const year = date.getFullYear();
    const hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    const sec = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

    return day + "." + month + "." + year + " " + hour + ":" + min + ":" + sec;
}

/*
function refreshToken() {
    const request_ = new XMLHttpRequest();
    const secret = token_;
    // var encodedParams = encodeURIComponent(params);
    request_.open("POST", "https://directline.botframework.com/v3/directline/tokens/refresh", true);
    request_.setRequestHeader("Authorization", "Bearer "+ secret);
    request_.send();
    request_.onreadystatechange = function () {
        if (request_.readyState === 4 && request_.status === 200) {
            const response = request_.responseText;
            const obj = JSON.parse(response);
            console.log(obj);
            token_ = obj.token;
            conversationId_ = obj.conversationId;
        }
    }
}

function startConversation(token) {
    const request_ = new XMLHttpRequest();
    const secret = token_; //'hMRtBPdEIFY.FO6l6oVwHmqgPr8R9BiRIkKpEWvTJw7ytHRs1YUN7vo'
    // var encodedParams = encodeURIComponent(params);
    request_.open("POST", "https://directline.botframework.com/v3/directline/conversations", true);
    request_.setRequestHeader("Authorization", "Bearer "+ token);
    request_.setRequestHeader("Content-Type", "application/json");
    request_.send();
    request_.onreadystatechange = function () {
        if (request_.readyState === 4 && request_.status === 200) {
            var response = request_.responseText;
            var obj = JSON.parse(response);
            //callback(obj);
            referenceGrammarId_ = obj.referenceGrammarId;
            streamUrl_ = obj.streamUrl;
        }
    }
}

function changeLanguage() {
    if(language === "German"){
        document.getElementById("nav_lan").innerText = "Englisch";
        document.getElementById("nav_help").innerText = "Hilfe";
        document.getElementById("header_share_prices").innerText = "Preisübersicht";
        document.getElementById("header_transactions").innerText = "Transaktionen";
        document.getElementById("price_link_prices").innerText = "Preise";
        document.getElementById("price_link_invest").innerText = "Transaktionen";
        document.getElementById("price_link_chart").innerText = "Diagramm";
        document.getElementById("endowment").innerText = "Ihr Guthaben:";
        document.getElementById("share1").innerText = "Anteil A";
        document.getElementById("share2").innerText = "Anteil B";
        document.getElementById("share3").innerText = "Anteil C";
        document.getElementById("share4").innerText = "Anteil D";
        document.getElementById("share5").innerText = "Anteil E";
        document.getElementById("share6").innerText = "Anteil F";
        document.getElementById("price1").innerText = "Wert:";
        document.getElementById("price2").innerText = "Wert:";
        document.getElementById("price3").innerText = "Wert:";
        document.getElementById("price4").innerText = "Wert:";
        document.getElementById("price5").innerText = "Wert:";
        document.getElementById("price6").innerText = "Wert:";
        document.getElementById("owned1").innerText = "Besitz:";
        document.getElementById("owned2").innerText = "Besitz:";
        document.getElementById("owned3").innerText = "Besitz:";
        document.getElementById("owned4").innerText = "Besitz:";
        document.getElementById("owned5").innerText = "Besitz:";
        document.getElementById("owned6").innerText = "Besitz:";
        document.getElementById("button_buy1").innerText = "Kaufen";
        document.getElementById("button_buy2").innerText = "Kaufen";
        document.getElementById("button_buy3").innerText = "Kaufen";
        document.getElementById("button_buy4").innerText = "Kaufen";
        document.getElementById("button_buy5").innerText = "Kaufen";
        document.getElementById("button_buy6").innerText = "Kaufen";
        document.getElementById("button_sell1").innerText = "Verkaufen";
        document.getElementById("button_sell2").innerText = "Verkaufen";
        document.getElementById("button_sell3").innerText = "Verkaufen";
        document.getElementById("button_sell4").innerText = "Verkaufen";
        document.getElementById("button_sell5").innerText = "Verkaufen";
        document.getElementById("button_sell6").innerText = "Verkaufen";

    } else {
        // document.getElementById("nav_lan").innerText = "German";
        document.getElementById("nav_help").innerText = "Help";
        document.getElementById("header_share_prices").innerText = "Share Prices";
        document.getElementById("header_transactions").innerText = "Transactions";
        document.getElementById("price_link_prices").innerText = "Prices";
        document.getElementById("price_link_invest").innerText = "Transactions";
        // document.getElementById("price_link_chart").innerText = "Chart";
        document.getElementById("endowment").innerText = "Your endowment:";
        document.getElementById("share1").innerText = "Share A";
        document.getElementById("share2").innerText = "Share B";
        document.getElementById("share3").innerText = "Share C";
        document.getElementById("share4").innerText = "Share D";
        document.getElementById("share5").innerText = "Share E";
        document.getElementById("share6").innerText = "Share F";
        document.getElementById("price1").innerText = "Price:";
        document.getElementById("price2").innerText = "Price:";
        document.getElementById("price3").innerText = "Price:";
        document.getElementById("price4").innerText = "Price:";
        document.getElementById("price5").innerText = "Price:";
        document.getElementById("price6").innerText = "Price:";
        document.getElementById("owned1").innerText = "Owned:";
        document.getElementById("owned2").innerText = "Owned:";
        document.getElementById("owned3").innerText = "Owned:";
        document.getElementById("owned4").innerText = "Owned:";
        document.getElementById("owned5").innerText = "Owned:";
        document.getElementById("owned6").innerText = "Owned:";
        document.getElementById("button_buy1").innerText = "Buy";
        document.getElementById("button_buy2").innerText = "Buy";
        document.getElementById("button_buy3").innerText = "Buy";
        document.getElementById("button_buy4").innerText = "Buy";
        document.getElementById("button_buy5").innerText = "Buy";
        document.getElementById("button_buy6").innerText = "Buy";
        document.getElementById("button_sell1").innerText = "Sell";
        document.getElementById("button_sell2").innerText = "Sell";
        document.getElementById("button_sell3").innerText = "Sell";
        document.getElementById("button_sell4").innerText = "Sell";
        document.getElementById("button_sell5").innerText = "Sell";
        document.getElementById("button_sell6").innerText = "Sell";
    }
}

*/
