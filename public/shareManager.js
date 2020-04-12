class ShareManager {
    constructor(budget, prices) {
        this.budget = parseFloat(budget);
        this.goodHoldings = {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        };
        this.goodHoldingsHist = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: []
        };
        this.goodInvestHist = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: []
        };
        this.goodUpsHist = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: []
        };
        this.goodPriceHist = {
            0: prices[0],
            1: prices[1],
            2: prices[2],
            3: prices[3],
            4: prices[4],
            5: prices[5]
        };
        // this.recommendExp = {
        //     0: recExp[0],
        //     1: recExp[1],
        //     2: recExp[2],
        //     3: recExp[3],
        //     4: recExp[4],
        //     5: recExp[5]
        // };
        // this.recommendPeer = {
        //     0: recPeer[0],
        //     1: recPeer[1],
        //     2: recPeer[2],
        //     3: recPeer[3],
        //     4: recPeer[4],
        //     5: recPeer[5]
        // };
        this.goodValues = {
            0: parseFloat(this.goodPriceHist[0][0]),
            1: parseFloat(this.goodPriceHist[1][0]),
            2: parseFloat(this.goodPriceHist[2][0]),
            3: parseFloat(this.goodPriceHist[3][0]),
            4: parseFloat(this.goodPriceHist[4][0]),
            5: parseFloat(this.goodPriceHist[5][0])
        };
    }

    //=================================== Bot questions =========================================
    getRecommendation(round, intent_sell) {

        const recs = this.getRecommendedShares(round);
        const owned = this.getSharesInPosession();

        const placeholder_recs = this.parseShareResults(recs, "oder");

        // Construct recommendation for shares to invest in based on experiment group
        let response = "";
        if (experimentGroup === 3) {
            response = "Aufgrund des bisherigen Preisverlaufs kann ich dir empfehlen, dein gesamtes Vermögen in " + placeholder_recs + " zu investieren.";
        } else if (experimentGroup === 4) {
            response = "Aktuelle Empfehlung aufgrund des bisherigen Preisverlaufs:\n - Investiere das gesamte Vermögen in " + placeholder_recs;
        }

        // Complement recommendation with shares to be sold based on experiment group
        const sharesInPosessionToBeSold = this.getSharesInPosessionToBeSold(owned, recs);
        if (sharesInPosessionToBeSold.length > 0) {
            const placeholder_sell = this.parseShareResults(sharesInPosessionToBeSold, "und");
            if (experimentGroup === 3) {
                response = response + " Daher empfehle ich dir, " + placeholder_sell + " zu verkaufen und " + placeholder_recs + " zu kaufen.";
            } else if (experimentGroup === 4) {
                response = response + "\n - Verkaufe " + placeholder_sell;
            }
        } else {
            if (experimentGroup === 3) {
                if (intent_sell) {
                    response = response + " Daher empfehle ich dir, keine Anteile zu verkaufen.";
                }
            }
        }
        return response
    }

    getRecommendedShares(round) {
        let recs = [0];
        for (let i = 1; i < 6; i++) {
            if (this.goodUpsHist[i][round] > this.goodUpsHist[recs[0]][round]) {
                recs = [i];
            } else if (this.goodUpsHist[i][round] === this.goodUpsHist[recs[0]][round]) {
                recs.push(i);
            }
        }
        return recs
    }

    getSharesInPosession() {
        let owned = [];
        for (let i = 0; i < 6; i++) {
            if (this.goodHoldings[i] > 0) {
                owned.push(i);
            }
        }
        return owned
    }

    getSharesInPosessionToBeSold(owned, recs) {

        let sharesInPosessionToBeSold = [];

        for (let i = 0; i < owned.length; i++) {
            if (!recs.includes(owned[i])) {
                sharesInPosessionToBeSold.push(owned[i]);
            }
        }
        return sharesInPosessionToBeSold
    }

    mostUps(round) {
        let recs = [0];
        for (let i = 1; i < 6; i++) {
            if (this.goodUpsHist[i][round] > this.goodUpsHist[recs[0]][round]) {
                recs = [i];
            } else if (this.goodUpsHist[i][round] === this.goodUpsHist[recs[0]][round]) {
                recs.push(i);
            }
        }

        const placeholder = this.parseShareResults(recs, "und");

        let result = "";

        // Plural or singular
        if (recs.length === 1) {
            result = placeholder + " hat bisher am meisten an Wert gewonnen.";
        } else if (recs.length > 1) {
            result = placeholder + " haben bisher am meisten an Wert gewonnen.";
        }
        return result
    }

    mostDowns(round) {
        let recs = [0];
        for (let i = 1; i < 6; i++) {
            if (this.goodUpsHist[i][round] < this.goodUpsHist[recs[0]][round]) {
                recs = [i];
            } else if (this.goodUpsHist[i][round] === this.goodUpsHist[recs[0]][round]) {
                recs.push(i);
            }
        }

        const placeholder = this.parseShareResults(recs, "und");

        let result = "";

        // Plural or singular
        if (recs.length === 1) {
            result = placeholder + " hat bisher am meisten an Wert verloren.";
        } else if (recs.length > 1) {
            result = placeholder + " haben bisher am meisten an Wert verloren.";
        }
        return result
    }

    potentialUp(shareChar) {
        // Create mapping table
        const mapping = {
            A: 0,
            B: 1,
            C: 2,
            D: 3,
            E: 4,
            F: 5
        };

        const shareNo = mapping[shareChar];
        const nextValue = Math.round(this.goodValues[shareNo] * 1.06);

        return "Wenn Anteil " + shareChar + " an Wert gewinnt, wird er in der folgenden Periode " + nextValue + " Währungseinheiten wert sein."
    }

    potentialDown(shareChar) {
        // Create mapping table
        const mapping = {
            A: 0,
            B: 1,
            C: 2,
            D: 3,
            E: 4,
            F: 5
        };

        const shareNo = mapping[shareChar];
        const nextValue = Math.round(this.goodValues[shareNo] * 0.95);

        return "Wenn Anteil " + shareChar + " an Wert verliert, wird er in der folgenden Periode " + nextValue + " Währungseinheiten wert sein."
    }

    shareUps(shareChar, round) {

        // Create mapping table
        const mapping = {
            A: 0,
            B: 1,
            C: 2,
            D: 3,
            E: 4,
            F: 5
        };

        const shareNo = mapping[shareChar];
        const ups = this.goodUpsHist[shareNo][round];

        return "Anteil " + shareChar + " hat bisher " + ups + "-mal an Wert gewonnen."
    }

    shareDowns(shareChar, round) {

        // Create mapping table
        const mapping = {
            A: 0,
            B: 1,
            C: 2,
            D: 3,
            E: 4,
            F: 5
        };

        const shareNo = mapping[shareChar];
        const downs = round - this.goodUpsHist[shareNo][round];

        return "Anteil " + shareChar + " hat bisher " + downs + "-mal an Wert verloren."
    }

    portfolioValue() {
        const cashTotal = this.cashout();
        const portfolio = Math.round(cashTotal.portfolio);
        const budget = Math.round(cashTotal.budget);
        const total = portfolio + budget;

        return "Dein gesamtes Portfolio ist derzeit " + total + " Währungseinheiten wert. Davon fallen " +
            portfolio + " auf deine Anteile im Besitz und " + budget + " auf dein Restguthaben."
    }
    //===========================================================================================

    parseShareResults(recs, conjunction) {

        // Create mapping table
        const mapping = {
            0: "A",
            1: "B",
            2: "C",
            3: "D",
            4: "E",
            5: "F"
        };

        let placeholder = "";

        // Fill placeholder for recommended shares semantically correct
        if (recs.length === 1) {
            placeholder = "Anteil " + mapping[recs[0]];
        } else if (recs.length === 2) {
            placeholder = "Anteil " + mapping[recs[0]] + " " + conjunction + " Anteil " + mapping[recs[1]];
        } else {

            // Loop through all shares
            for (let i = 0; i < recs.length; i++) {
                if (i === recs.length - 1) {
                    // Last part separated with "oder"
                    placeholder = placeholder + " " + conjunction + " " + "Anteil " + mapping[recs[i]];
                } else {
                    // Other parts separated with comma

                    if (i === 0) {
                        // First one without leading comma
                        placeholder = placeholder + "Anteil " + mapping[recs[i]];
                    } else {
                        // Succeeding ones with leading comma
                        placeholder = placeholder + ", " + "Anteil " + mapping[recs[i]];
                    }
                }
            }
        }

        return placeholder
    }

    getCheapestShare(round) {

        let minName = 0;
        let minValue = 1000000;

        // Check for share with lowest value
        for (let i = 0; i < 6; i++) {
            if (this.goodValues[i] < minValue) {
                minName = i;
                minValue = this.goodValues[i];
            }
        }

        return {
            value: minValue,
            name: minName
        }
    }

    getHighestShare(round) {

        let maxName = 0;
        let maxValue = 0;

        // Check for share with lowest value
        for (let i = 0; i < 6; i++) {
            if (this.goodValues[i] > maxValue) {
                maxName= i;
                maxValue = this.goodValues[i];
            }
        }

        return {
            value: maxValue,
            name: maxName
        }
    }

    buyGood(good, open) {
        let obj = {
            open: true,
            success: false,
            rename: []
        };
        if (open !== null) {
            if (open) {
                if (Math.round(this.budget) - Math.round(this.goodValues[good]) >= 0) {
                    obj.success = true;
                    this.goodHoldings[good]++;
                    this.budget = this.budget - this.goodValues[good];
                    obj.rename = [
                        {
                            id: 's' + good.toString(),
                            content: this.goodHoldings[good]
                        },
                        {
                            id: 'budget',
                            content: Math.round(this.budget)
                        }
                    ];
                } else {
                    obj.success = false;
                }
            } else {
                obj.open = false;
            }
        } else {
            obj.open = null;
        }
        return obj;
    }

    sellGood(good, open) {
        let obj = {
            open: true,
            success: false,
            rename: []
        };
        if (open !== null) {
            if (open) {
                if (this.goodHoldings[good] > 0) {
                    obj.success = true;
                    this.goodHoldings[good]--;

                    // Only to display consistent values in the dashboard
                    const budgetShow = Math.round(this.budget) + Math.round(this.goodValues[good]);

                    this.budget = this.budget + this.goodValues[good];

                    // Collect all elements to be renamed
                    obj.rename = [
                        {
                            id: 's' + good.toString(),
                            content: this.goodHoldings[good]
                        },
                        {
                            id: 'budget',
                            content: Math.round(budgetShow)
                        }
                    ];
                } else {
                    obj.success = false;
                }
            } else {
                obj.open = false;
            }
        } else {
            obj.open = null;
        }

        return obj;
    }

    nextRound(round) {
        let prices = [];
        let invests = [];
        let rename = [];
        let reload = false;

        for (let i = 0; i < 6; i++) {
            this.goodValues[i] = parseFloat(this.goodPriceHist[i][round]);

            // Rename value buttons
            rename.push({
                id: 'v' + i.toString(),
                content: Math.round(this.goodValues[i])
            });

            // Rename holding buttons
            rename.push({
                id: 's' + i.toString(),
                content: Math.round(this.goodHoldings[i])
            });
            this.goodHoldingsHist[i].push(this.goodHoldings[i]);

            // Report if shares of increased or decreased on value
            if (round === 0) {
                this.goodUpsHist[i].push(0);
            } else {
                if (parseFloat(this.goodPriceHist[i][round]) > parseFloat(this.goodPriceHist[i][round - 1])) {
                    this.goodUpsHist[i].push(this.goodUpsHist[i][round - 1] + 1);
                } else {
                    this.goodUpsHist[i].push(this.goodUpsHist[i][round - 1]);
                }
            }

            if (round > 2) {
                this.goodInvestHist[i].push(this.goodHoldings[i] - this.goodHoldingsHist[i][round - 1]);
            } else if (round > 0){
                this.goodInvestHist[i].push(this.goodHoldings[i] - 0);
            }

            const x = {
                data: [Math.round(this.goodValues[i])]
            };
            prices.push(x);
            const y = {
                data: [this.goodInvestHist[i][round-1]]
            };
            invests.push(y);
        }

        // console.log(this.goodUpsHist);
        // console.log(this.getRecommendAlg(round));

        return {
            rename: rename,
            data: {
                prices: prices,
                invests: invests
            },
            reload: reload
        };
    }

    getInvests() {
        let inv = JSON.parse(JSON.stringify(this.goodInvestHist));

        for (let i = 0; i < 6; i++) {
            inv[i].push(0);
        }

        return inv;
    }

    cashout() {
        const conversionRate = 350;
        const fixedCashout = 6;
        const portfolio_value = this.goodHoldings[0] * this.goodValues[0] +
            this.goodHoldings[1] * this.goodValues[1] +
            this.goodHoldings[2] * this.goodValues[2] +
            this.goodHoldings[3] * this.goodValues[3] +
            this.goodHoldings[4] * this.goodValues[4] +
            this.goodHoldings[5] * this.goodValues[5];
        const total_value = portfolio_value + this.budget;
        const euro_value = total_value/conversionRate + fixedCashout;
        const euro_value_rounded = Math.ceil(2 * (total_value/conversionRate)) / 2 + fixedCashout;

        return {
            portfolio: portfolio_value,
            budget: this.budget,
            total: total_value,
            total_rounded: Math.round(total_value),
            euro: euro_value,
            euro_rounded: euro_value_rounded
        }
    }
}

// module.exports.ShareManager = ShareManager;