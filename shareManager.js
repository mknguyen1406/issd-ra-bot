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
        };
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
                obj.rename = [
                    {
                        id: 's' + good.toString(),
                        content: this.goodHoldings[good]
                    },
                    {
                        id: 'budget',
                        content: Math.round(this.budget) + ' GE'
                    }
                ];
            } else {
                obj.success = false;
            }
        } else {
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
                obj.rename = [
                    {
                        id: 's' + good.toString(),
                        content: this.goodHoldings[good]
                    },
                    {
                        id: 'budget',
                        content: Math.round(this.budget) + ' GE'
                    }
                ];
            } else {
                obj.success = false;
            }
        } else {
            obj.open = false;
        }
        return obj;
    }

    nextRound(round) {
        let prices = [];
        let invests = [];
        let rename = [];
        let reload = false;
        let cashout = 0;

        for (let i = 0; i < 6; i++) {
            this.goodValues[i] = parseFloat(this.goodPriceHist[i][round]);
            rename.push({
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

            if (round === 14) {
                reload = true;
                cashout = this.cashout();
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
            rename: rename,
            data: {
                prices: prices,
                invests: invests
            },
            reload: reload,
            cashout: cashout
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