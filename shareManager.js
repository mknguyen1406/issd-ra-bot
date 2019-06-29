class ShareManager {
    constructor(budget, mapSeed, prices, recAlg, recExp, recPeer) {
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
        if (mapSeed === 0) {
            this.goodPriceHist = {
                0: prices[0],
                1: prices[1],
                2: prices[2],
                3: prices[3],
                4: prices[4],
                5: prices[5]
            };
            this.recommendExp = {
                0: recExp[0],
                1: recExp[1],
                2: recExp[2],
                3: recExp[3],
                4: recExp[4],
                5: recExp[5]
            };
            this.recommendPeer = {
                0: recPeer[0],
                1: recPeer[1],
                2: recPeer[2],
                3: recPeer[3],
                4: recPeer[4],
                5: recPeer[5]
            };
        } else if (mapSeed === 1) {
            this.goodPriceHist = {
                0: prices[1],
                1: prices[4],
                2: prices[3],
                3: prices[5],
                4: prices[0],
                5: prices[2]
            };
            this.recommendExp = {
                0: recExp[1],
                1: recExp[4],
                2: recExp[3],
                3: recExp[5],
                4: recExp[0],
                5: recExp[2]
            };
            this.recommendPeer = {
                0: recPeer[1],
                1: recPeer[4],
                2: recPeer[3],
                3: recPeer[5],
                4: recPeer[0],
                5: recPeer[2]
            };
        } else if (mapSeed === 2) {
            this.goodPriceHist = {
                0: prices[4],
                1: prices[0],
                2: prices[5],
                3: prices[1],
                4: prices[2],
                5: prices[3]
            };
            this.recommendExp = {
                0: recExp[4],
                1: recExp[0],
                2: recExp[5],
                3: recExp[1],
                4: recExp[2],
                5: recExp[3]
            };
            this.recommendPeer = {
                0: recPeer[4],
                1: recPeer[0],
                2: recPeer[5],
                3: recPeer[1],
                4: recPeer[2],
                5: recPeer[3]
            };
        } else if (mapSeed === 3) {
            this.goodPriceHist = {
                0: prices[3],
                1: prices[5],
                2: prices[0],
                3: prices[1],
                4: prices[2],
                5: prices[4]
            };
            this.recommendExp = {
                0: recExp[3],
                1: recExp[5],
                2: recExp[0],
                3: recExp[1],
                4: recExp[2],
                5: recExp[4]
            };
            this.recommendPeer = {
                0: recPeer[3],
                1: recPeer[5],
                2: recPeer[0],
                3: recPeer[1],
                4: recPeer[2],
                5: recPeer[4]
            };
        } else if (mapSeed === 4) {
            this.goodPriceHist = {
                0: recAlg[0],
                1: recAlg[2],
                2: recAlg[5],
                3: recAlg[1],
                4: recAlg[4],
                5: recAlg[2]
            };
            this.recommendExp = {
                0: recExp[0],
                1: recExp[2],
                2: recExp[5],
                3: recExp[1],
                4: recExp[4],
                5: recExp[2]
            };
            this.recommendPeer = {
                0: recPeer[0],
                1: recPeer[2],
                2: recPeer[5],
                3: recPeer[1],
                4: recPeer[4],
                5: recPeer[2]
            };
        }
        this.goodValues = {
            0: parseFloat(this.goodPriceHist[0][0]),
            1: parseFloat(this.goodPriceHist[1][0]),
            2: parseFloat(this.goodPriceHist[2][0]),
            3: parseFloat(this.goodPriceHist[3][0]),
            4: parseFloat(this.goodPriceHist[4][0]),
            5: parseFloat(this.goodPriceHist[5][0])
        };
    }

    getRecommendAlg(round) {
        let recs = [0];
        for (let i = 1; i < 6; i++) {
            if (this.goodUpsHist[i][round] > this.goodUpsHist[recs[0]][round]) {
                recs = [i];
            } else if (this.goodUpsHist[i][round] === this.goodUpsHist[recs[0]][round]) {
                recs.push(i);
            }
        }
        return recs;
    }

    getRecommendPeer(good, round) {
        return this.recommendPeer[good][round];
    }

    buyGood(good, open) {
        let obj = {
            open: true,
            success: false,
            rename: []
        };
        if (open) {
            if (this.budget - this.goodValues[good] >= 0) {
                obj.success = true;
                this.goodHoldings[good]++;
                this.budget = this.budget - this.goodValues[good];
                // document.getElementById("s" + good.toString()).innerHTML = this.goodHoldings[good];
                // clientRenameElement('s' + good.toString(), this.goodHoldings[good]);
                // document.getElementById("budget").innerHTML = Math.round(this.budget) + "€";
                // clientRenameElement('budget', Math.round(this.budget) + '€');
                obj.rename = [
                    {
                        id: 's' + good.toString(),
                        content: this.goodHoldings[good]
                    },
                    {
                        id: 'budget',
                        content: Math.round(this.budget) + '€'
                    }
                ];
            } else {
                // var language = document.getElementById("nav_lan").innerText;
                // if (language === "German") {
                //    window.alert("Nicht genug Budget.");
                // } else {
                //    window.alert("Insufficient endowment.");
                // }
                // clientAlertNoEndowment();
                obj.success = false;
            }
        } else {
            // var language = document.getElementById("nav_lan").innerText;
            // if (language === "German") {
            //    window.alert("Handel ist erst ab der dritten Periode möglich.");
            // } else {
            //    window.alert("Trading is not possible before 3rd period.");
            // }
            // clientAlertNoTrading();
            obj.open = false;
        }
        return obj;
    }

    sellGood(good, open) {
        let obj = {
            open: true,
            success: false,
            rename: []
        };
        if (open) {
            if (this.goodHoldings[good] > 0) {
                obj.success = true;
                this.goodHoldings[good]--;
                this.budget = this.budget + this.goodValues[good];
                // document.getElementById('s' + good.toString()).innerHTML = this.goodHoldings[good];
                // clientRenameElement('s' + good.toString(), this.goodHoldings[good]);
                // document.getElementById('budget').innerHTML = Math.round(this.budget) + '€';
                // clientRenameElement('budget', Math.round(this.budget) + '€');
                obj.rename = [
                    {
                        id: 's' + good.toString(),
                        content: this.goodHoldings[good]
                    },
                    {
                        id: 'budget',
                        content: Math.round(this.budget) + '€'
                    }
                ];
            } else {
                // var language = document.getElementById('nav_lan').innerText;
                // if (language === 'German') {
                //     window.alert('Nicht genug Anteile.');
                // } else {
                //     window.alert('Insufficient holdings.');
                // }
                // clientAlertNoHoldings();
                obj.success = false;
            }
        } else {
            // var language = document.getElementById('nav_lan').innerText;
            // if (language === 'German') {
            //     window.alert('Handel ist erst ab der dritten Periode m�glich.');
            // } else {
            //     window.alert('Trading is not possible before 3rd period.');
            // }
            // clientAlertNoTrading();
            obj.open = false;
        }
        return obj;
    }

    nextRound(round) {
        let prices = [];
        let invests = [];
        let obj = {
            rename: []
        };

        for (let i = 0; i < 6; i++) {
            this.goodValues[i] = parseFloat(this.goodPriceHist[i][round]);
            // document.getElementById('v' + i.toString()).innerHTML = this.goodValues[i] + '€';
            // clientRenameElement('v' + i.toString(), this.goodValues[i] + '€');
            obj.rename.push({
                id: 'v' + i.toString(),
                content: this.goodValues[i] + '€'
            });
            this.goodHoldingsHist[i].push(this.goodHoldings[i]);

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
            } else {
                this.goodInvestHist[i].push(this.goodHoldings[i] - 0);
            }

            const x = {
                data: [this.goodValues[i]]
            };
            prices.push(x);
            const y = {
                data: [this.goodInvestHist[i][round]]
            };
            invests.push(y);
        }

        console.log(this.goodUpsHist);
        console.log(this.getRecommendAlg(round));

        return {
            rename: obj.rename,
            data: {
                prices: prices,
                invests: invests
            }
        };
    }

    cashout() {
        return this.goodHoldings[0] * this.goodValues[0] +
            this.goodHoldings[1] * this.goodValues[1] +
            this.goodHoldings[2] * this.goodValues[2] +
            this.goodHoldings[3] * this.goodValues[3] +
            this.goodHoldings[4] * this.goodValues[4] +
            this.goodHoldings[5] * this.goodValues[5] +
            this.budget;
    }
}

module.exports.ShareManager = ShareManager;