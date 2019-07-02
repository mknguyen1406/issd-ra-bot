function changeLanguage() {
    var language = document.getElementById("nav_lan").innerText;
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
        document.getElementById("nav_lan").innerText = "German";
        document.getElementById("nav_help").innerText = "Help";
        document.getElementById("header_share_prices").innerText = "Share Prices";
        document.getElementById("header_transactions").innerText = "Transactions";
        document.getElementById("price_link_prices").innerText = "Prices";
        document.getElementById("price_link_invest").innerText = "Transactions";
        document.getElementById("price_link_chart").innerText = "Chart";
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

function showPrices() {
    var x = document.getElementById("chart");
    x.style.display = "none";

    var x = document.getElementById("investments");
    x.style.display = "none";

    var x = document.getElementById("prices");
    x.style.display = "block";
}

function showChart() {
    var x = document.getElementById("prices");
    x.style.display = "none";

    var x = document.getElementById("investments");
    x.style.display = "none";

    var x = document.getElementById("chart");
    x.style.display = "block";
}

function showInvestments() {
    var x = document.getElementById("prices");
    x.style.display = "none";

    var x = document.getElementById("investments");
    x.style.display = "block";

    var x = document.getElementById("chart");
    x.style.display = "none";
}

function start() {
    document.getElementById("next").innerHTML = "Next";
    if(this.round === 12) {
        var data = sm.nextRound(this.round);
        chart.appendData(data.prices);
        appendTable("price", data.prices);
        appendTable("invest", data.invests);
        this.round++;
        document.getElementById("next").innerHTML = "Exit";
    } else if (this.round === 13) {
        var data = sm.nextRound(this.round);
        chart.appendData(data.prices);
        appendTable("price", data.prices);
        appendTable("invest", data.invests);
        this.round++;
        var cash = sm.cashout();
        window.alert("Congratulations!\nYour total cash out is " + Math.round(cash) + "€!");
        document.getElementById("next").innerHTML = "Restart";
    }else if (this.round === 14) {
        window.location.reload();
    } else if (this.round === 2) {
        document.getElementById("budget").innerHTML = "2000 GE";
        this.openForTrading = true;
        var data = sm.nextRound(this.round);
        chart.appendData(data.prices);
        appendTable("price", data.prices);
        appendTable("invest", data.invests);
        this.round++;
    } else {
        var data = sm.nextRound(this.round);
        chart.appendData(data.prices);
        appendTable("price", data.prices);
        appendTable("invest", data.invests);
        this.round++;
    }
    console.log(this.round);
}

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status === 0)
            {
                var allText = rawFile.responseText;
                data = allText;
            }
        }
    }
    rawFile.send(null);
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
        if (request_.readyState == 4 && request_.status == 200) {
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
    var request_ = new XMLHttpRequest();
    var secret = token_;
    // var encodedParams = encodeURIComponent(params);
    request_.open("POST", "https://directline.botframework.com/v3/directline/tokens/refresh", true);
    request_.setRequestHeader("Authorization", "Bearer "+ secret);
    request_.send();
    request_.onreadystatechange = function () {
        if (request_.readyState == 4 && request_.status == 200) {
            var response = request_.responseText;
            var obj = JSON.parse(response);
            console.log(obj);
            token_ = obj.token;
            conversationId_ = obj.conversationId;
        }
    }
}

function startConversation(token) {
    var request_ = new XMLHttpRequest();
    var secret = token_; //'hMRtBPdEIFY.FO6l6oVwHmqgPr8R9BiRIkKpEWvTJw7ytHRs1YUN7vo'
    // var encodedParams = encodeURIComponent(params);
    request_.open("POST", "https://directline.botframework.com/v3/directline/conversations", true);
    request_.setRequestHeader("Authorization", "Bearer "+ token);
    request_.setRequestHeader("Content-Type", "application/json");
    request_.send();
    request_.onreadystatechange = function () {
        if (request_.readyState == 4 && request_.status == 200) {
            var response = request_.responseText;
            var obj = JSON.parse(response);
            //callback(obj);
            referenceGrammarId_ = obj.referenceGrammarId;
            streamUrl_ = obj.streamUrl;
        }
    }
}

function printStream() {
    console.log(streamUrl_);
}

function getSurveyId(url) {
    const endPart = url.substring(30); // number is dependent on length of survey name
    const partArray = endPart.split("?");
    return partArray[0];
}

function alertInsufficientEndowment() {
    var language = document.getElementById("nav_lan").innerText;
    if (language === "Englisch") {
       window.alert("Nicht genug Budget.");
    } else {
       window.alert("Insufficient endowment.");
    }
}

function alertInsufficientHoldings() {
    var language = document.getElementById('nav_lan').innerText;
    if (language === 'Englisch') {
        window.alert('Nicht genug Anteile.');
    } else {
        window.alert('Insufficient holdings.');
    }
}

function alertNotOpen() {
    var language = document.getElementById("nav_lan").innerText;
    if (language === "Englisch") {
       window.alert("Handel ist erst ab der dritten Periode möglich.");
    } else {
       window.alert("Trading is not possible before 3rd period.");
    }
}

function alertEarnings(cash) {
    var language = document.getElementById("nav_lan").innerText;
    if (language === "Englisch") {
        window.alert("Glückwunsch!\nDeine Auszahlung beträgt " + Math.round(cash) + " GE!");
    } else {
        window.alert("Congratulations!\nYour total cash out is " + Math.round(cash) + " MU!");
    }
}