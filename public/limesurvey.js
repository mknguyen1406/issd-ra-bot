// Once document is loaded
$(document).ready(function () {
    // Hide or show result containers
    function hideShowDom(dom, hide) {
        if (dom !== null) {
            if (hide) {
                dom.style.display = "none";
            } else {
                dom.style.display = "block";
            }
        }
    }

    hideShowDom(document.getElementById('question13113'), true);
    hideShowDom(document.getElementById('question15394'), true);
    hideShowDom(document.getElementById('movenextbtn'), true);

    // Event listener for messages
    window.addEventListener('message', function (event) {
        if (event.origin === "http://localhost:63342" || event.origin === "https://issd-ra-web-app.azurewebsites.net" || event.origin === "https://issd-trading.azurewebsites.net") {
            // window.alert("Received the following message event: " + event);
            if (typeof (event.data) !== 'undefined') {

                const result = event.data.detail.data;
                const result_all = "\{" +
                    "userId: " + result.userId + ", " +
                    "surveyId: " + result.surveyId + ", " +
                    "pricePath: " + result.pricePath + ", " +
                    "cabinNo: " + result.cabinNo + ", " +
                    "experimentRound: " + result.experimentRound + ", " +
                    "experimentGroup: " + result.experimentGroup + ", " +
                    "cashout: " + JSON.stringify(result.cashout) + ", " +
                    "holdings: " + JSON.stringify(result.holdings) + ", " +
                    "invests: " + JSON.stringify(result.invests) + ", " +
                    "prices: " + JSON.stringify(result.prices) + ", " +
                    "times: " + result.times + ", " +
                    "advice: " + JSON.stringify(result.advice) + ", " +
                    "conversation: " + JSON.stringify(result.conversationHistory) + ", " +
                    "mapping_character: " + JSON.stringify(result.map_char) + ", " +
                    "mapping_number: " + JSON.stringify(result.map_no) + ", " +
                    "round: " + result.round + "\}";

                const result_cabinNo = result.cabinNo;
                const result_cashout_GE = Math.round(parseFloat(result.cashout.total));
                const result_cashout_EURO = result.cashout.euro_rounded;

                const result_conc =
                    "Kabine: " + result_cabinNo + " | " +
                    "Ergebnis: " + result_cashout_GE + " GE | " +
                    "Auszahlung: " + result_cashout_EURO + " €";

                // Write data to question
                $('#question{13113} input[type="text"]').val([result_all]);
                $('#question{15394} input[type="text"]').val([result_conc]);

                //window.alert(result_all);

                // Show 'Weiter' button after last question
                if (Math.round(parseFloat(result.round) === 13)) {
                    hideShowDom(document.getElementById('movenextbtn'), false);
                }
            }
        }

    });
})
;