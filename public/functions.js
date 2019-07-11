// function changeLanguage() {
//     if(language === "German"){
        // document.getElementById("nav_lan").innerText = "Englisch";
        // document.getElementById("nav_help").innerText = "Hilfe";
        // document.getElementById("header_share_prices").innerText = "Preisübersicht";
        // document.getElementById("header_transactions").innerText = "Transaktionen";
        // document.getElementById("price_link_prices").innerText = "Preise";
        // document.getElementById("price_link_invest").innerText = "Transaktionen";
        // document.getElementById("price_link_chart").innerText = "Diagramm";
        // document.getElementById("endowment").innerText = "Ihr Guthaben:";
        // document.getElementById("share1").innerText = "Anteil A";
        // document.getElementById("share2").innerText = "Anteil B";
        // document.getElementById("share3").innerText = "Anteil C";
        // document.getElementById("share4").innerText = "Anteil D";
        // document.getElementById("share5").innerText = "Anteil E";
        // document.getElementById("share6").innerText = "Anteil F";
        // document.getElementById("price1").innerText = "Wert:";
        // document.getElementById("price2").innerText = "Wert:";
        // document.getElementById("price3").innerText = "Wert:";
        // document.getElementById("price4").innerText = "Wert:";
        // document.getElementById("price5").innerText = "Wert:";
        // document.getElementById("price6").innerText = "Wert:";
        // document.getElementById("owned1").innerText = "Besitz:";
        // document.getElementById("owned2").innerText = "Besitz:";
        // document.getElementById("owned3").innerText = "Besitz:";
        // document.getElementById("owned4").innerText = "Besitz:";
        // document.getElementById("owned5").innerText = "Besitz:";
        // document.getElementById("owned6").innerText = "Besitz:";
        // document.getElementById("button_buy1").innerText = "Kaufen";
        // document.getElementById("button_buy2").innerText = "Kaufen";
        // document.getElementById("button_buy3").innerText = "Kaufen";
        // document.getElementById("button_buy4").innerText = "Kaufen";
        // document.getElementById("button_buy5").innerText = "Kaufen";
        // document.getElementById("button_buy6").innerText = "Kaufen";
        // document.getElementById("button_sell1").innerText = "Verkaufen";
        // document.getElementById("button_sell2").innerText = "Verkaufen";
        // document.getElementById("button_sell3").innerText = "Verkaufen";
        // document.getElementById("button_sell4").innerText = "Verkaufen";
        // document.getElementById("button_sell5").innerText = "Verkaufen";
        // document.getElementById("button_sell6").innerText = "Verkaufen";

//     } else {
//         // document.getElementById("nav_lan").innerText = "German";
//         document.getElementById("nav_help").innerText = "Help";
//         document.getElementById("header_share_prices").innerText = "Share Prices";
//         document.getElementById("header_transactions").innerText = "Transactions";
//         document.getElementById("price_link_prices").innerText = "Prices";
//         document.getElementById("price_link_invest").innerText = "Transactions";
//         // document.getElementById("price_link_chart").innerText = "Chart";
//         document.getElementById("endowment").innerText = "Your endowment:";
//         document.getElementById("share1").innerText = "Share A";
//         document.getElementById("share2").innerText = "Share B";
//         document.getElementById("share3").innerText = "Share C";
//         document.getElementById("share4").innerText = "Share D";
//         document.getElementById("share5").innerText = "Share E";
//         document.getElementById("share6").innerText = "Share F";
//         document.getElementById("price1").innerText = "Price:";
//         document.getElementById("price2").innerText = "Price:";
//         document.getElementById("price3").innerText = "Price:";
//         document.getElementById("price4").innerText = "Price:";
//         document.getElementById("price5").innerText = "Price:";
//         document.getElementById("price6").innerText = "Price:";
//         document.getElementById("owned1").innerText = "Owned:";
//         document.getElementById("owned2").innerText = "Owned:";
//         document.getElementById("owned3").innerText = "Owned:";
//         document.getElementById("owned4").innerText = "Owned:";
//         document.getElementById("owned5").innerText = "Owned:";
//         document.getElementById("owned6").innerText = "Owned:";
//         document.getElementById("button_buy1").innerText = "Buy";
//         document.getElementById("button_buy2").innerText = "Buy";
//         document.getElementById("button_buy3").innerText = "Buy";
//         document.getElementById("button_buy4").innerText = "Buy";
//         document.getElementById("button_buy5").innerText = "Buy";
//         document.getElementById("button_buy6").innerText = "Buy";
//         document.getElementById("button_sell1").innerText = "Sell";
//         document.getElementById("button_sell2").innerText = "Sell";
//         document.getElementById("button_sell3").innerText = "Sell";
//         document.getElementById("button_sell4").innerText = "Sell";
//         document.getElementById("button_sell5").innerText = "Sell";
//         document.getElementById("button_sell6").innerText = "Sell";
//     }
// }

function showPrices() {
    document.getElementById("chart").style.display = "none";
    document.getElementById("investments").style.display = "none";
    document.getElementById("prices").style.display = "block";
    document.getElementById("header_share_prices").innerHTML = "Preisübersicht";
}

// function showChart() {
//     let x = document.getElementById("prices");
//     x.style.display = "none";
//
//     x = document.getElementById("investments");
//     x.style.display = "none";
//
//     x = document.getElementById("chart");
//     x.style.display = "block";
// }

function hideChatBot() {
    let x = document.getElementById("webchat-card");
    x.style.display = "none";
}

function showInvestments() {
    document.getElementById("prices").style.display = "none";
    document.getElementById("investments").style.display = "block";
    document.getElementById("chart").style.display = "none";
    document.getElementById("header_share_prices").innerHTML = "Transaktionsübersicht";
}

function nextRound(round) {
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
    // Get data only up until round 14. In round 14 reload the page
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

    if (round === 12) {
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
        obj.appendData = {
            prices: data.prices,
            invests: data.invests
        };
        obj.cashout = shareManager.cashout();
        obj.rename.push(
            {
                id: 'next',
                content: 'Restart'
            }
        );

        // Stop trading in round 13
        openForTrading = false;
    } else if (round === 14) {
        // Send final result to bot
        sendFinalResult();
        obj.reload = true;
    } else if (round === 2) {
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
    } else if (round === 0) {
        // Change from null to false so that the 'game not started' alert doesn't show up anymore
        openForTrading = false;

        obj.appendData = {
            prices: data.prices,
            invests: data.invests
        };
    } else {
        obj.appendData = {
            prices: data.prices,
            invests: data.invests
        };
    }
    console.log(round);

    // Request summary only from round 3
    if (round > 3) {
        // Gather data for summary
        const holdings = {
            holdings: shareManager.goodHoldings
        };

        // Create event to request summary
        const event = new CustomEvent('botEvent', {
            detail: {
                type: "summaryRequest",
                data: holdings
            }
        });
        window.document.dispatchEvent(event);
    }

    return obj;
}

function sendFinalResult() {
    // Gather data for summary
    const data = {
        holdings: shareManager.goodHoldingsHist,
        invests: shareManager.goodInvestHist,
        prices: shareManager.goodPriceHist,
        userId: userId,
        cashout: shareManager.cashout(),
        time: new Date()
    };

    // Send result to chat bot
    const event = new CustomEvent('botEvent', {
        detail: {
            type: "result",
            data: data
        }
    });
    window.document.dispatchEvent(event);
}

async function readTextFile(file, callback)
{
    const rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = await function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status === 0)
            {
                const allText = rawFile.responseText;
                callback(allText);
            }
        }
    };
    rawFile.send(null);
}

function createShareManager (pricePath, budget) {

    // Call function to read csv file
    readTextFile("./data/price_paths/path" + pricePath + ".csv", function (obj) {

        // Convert csv file to array
        let x = obj.toString() // convert Buffer to string
            .split('\n') // split string to lines
            .map(e => e.trim()) // remove white spaces for each line
            .map(e => e.split(';').map(e => e.trim())); // split each line to array
        // console.log(x);

        // Prices from selected price path
        const pricesArray = {
            0: x[2].slice(1,15),
            1: x[3].slice(1,15),
            2: x[4].slice(1,15),
            3: x[5].slice(1,15),
            4: x[6].slice(1,15),
            5: x[7].slice(1,15)
        };

        // console.log(pricesArray);

        // Create share manager object
        shareManager = new ShareManager(budget, pricesArray);
    });
}

function appendTable(table, data) {
    var prefix = "tab-row-" + table + "-";

    appendTableValue(prefix, Math.round(data[0]["data"][0]), "a");
    appendTableValue(prefix, Math.round(data[1]["data"][0]), "b");
    appendTableValue(prefix, Math.round(data[2]["data"][0]), "c");
    appendTableValue(prefix, Math.round(data[3]["data"][0]), "d");
    appendTableValue(prefix, Math.round(data[4]["data"][0]), "e");
    appendTableValue(prefix, Math.round(data[5]["data"][0]), "f");
}

function appendTableValue(parent, value, good) {
    var pref = parent;
    var childNode = document.createElement("td");
    var textnode = document.createTextNode(value);
    childNode.appendChild(textnode);
    document.getElementById(pref + good).appendChild(childNode);
}

/**
 *
 * @param callback
 */
function getToken(callback) {
    var request_ = new XMLHttpRequest();
    var secret = 'hMRtBPdEIFY.Mak8ZsZLeFesVFma1ShIQlXkmWQaaxBO2usSPyoUrDc';
    // var encodedParams = encodeURIComponent(params);
    request_.open("POST", "https://directline.botframework.com/v3/directline/tokens/generate", true);
    request_.setRequestHeader("Authorization", "Bearer "+ secret);
    request_.send();
    request_.onreadystatechange = function () {
        if (request_.readyState === 4 && request_.status === 200) {
            var response = request_.responseText;
            var obj = JSON.parse(response);
            console.log(obj);
            token_ = obj.token;
            conversationId_ = obj.conversationId;
            callback();
        }
    };
}

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
    const euro = Math.round(total/300);

    swal("Glückwunsch!", "Ihre Auszahlung beträgt " + total + " Währungseinheiten." + "\n\n" +
        "Diese setzt sich zusammen aus einem Restguthaben in Höhe von " + budget + " Währungseinheiten und einem Portfoliowert in Höhe von " +
        portfolio + " Währungseinheiten.", "success");
}

// function requestSummary(e, store, action, data) {
//     const buttonId = e.target.id;
//     console.log("Pressed button: " + buttonId);
//     store.dispatch({
//         type: 'WEB_CHAT/SEND_EVENT',
//         payload: {
//             name: action,
//             value: data
//         }
//     });
// }

function buttonActionEvent(e, action) {
    if (action === "buy") {
        // Get ID of button
        const buttonId = e.target.id;
        console.log("Pressed button: " + buttonId);
        // Get number of button, e.g. 1-6
        const lastChar = parseFloat(buttonId.substr(buttonId.length-1)) - 1;

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
        console.log("Pressed button: " + buttonId);
        // Get number of button, e.g. 1-6
        const lastChar = parseFloat(buttonId.substr(buttonId.length-1)) - 1;

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
    } else {
        // Repeat three times when first clicked on next button
        if (round === 0) {
            for (let i = 0; i < 4; i++) {
                triggerNextRound();
            }
        } else {
            triggerNextRound()
        }
    }
}

function triggerNextRound() {
    // Next event
    const res = nextRound(round);
    if (res.reload === false) {
        const data = res.appendData;
        chart.appendData(data.prices);
        appendTable("price", data.prices);
        if (round !== 0) {
            appendTable("invest", data.invests);
        }

        // Only for last round
        if (res.cashout !== null) {
            alertEarnings(res.cashout);
        }
    } else if (res.reload === true) {
        // This is round 14
        window.location.reload();
    }
    renameElements(res.rename);
    // Increase round number
    round ++;
}

function renameElements(res){
    const renameArray = res;
    for (let i = 0; i < renameArray.length; i++) {
        const obj = renameArray[i];
        document.getElementById(obj.id).innerHTML = obj.content;
    }
}

async function getData(callback) {
    const request_ = new XMLHttpRequest();
    request_.open("GET", "https://issd-ra-qna.azurewebsites.net/data", true);
    // request_.open("GET", "http://localhost:3978/data", true);
    request_.setRequestHeader("Authorization", "Bearer "+ secret);
    request_.send();
    request_.onreadystatechange = await function () {
        if (request_.readyState === 4 && request_.status === 200) {
            const response = request_.responseText;
            const obj = JSON.parse(response);
            console.log(obj);
            callback(obj);
        }
    };
}