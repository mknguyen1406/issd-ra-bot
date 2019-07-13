const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        trim: true
    },
    cashout: {
        portfolio: {
            type: Number,
            default: 0
        },
        budget: {
            type: Number,
            default: 0
        },
    },
    holdings: {
        0: {
            type: Array,
            default: []
        },
        1: {
            type: Array,
            default: []
        },
        2: {
            type: Array,
            default: []
        },
        3: {
            type: Array,
            default: []
        },
        4: {
            type: Array,
            default: []
        },
        5: {
            type: Array,
            default: []
        }
    },
    invests: {
        0: {
            type: Array,
            default: []
        },
        1: {
            type: Array,
            default: []
        },
        2: {
            type: Array,
            default: []
        },
        3: {
            type: Array,
            default: []
        },
        4: {
            type: Array,
            default: []
        },
        5: {
            type: Array,
            default: []
        }
    },
    prices: {
        0: {
            type: Array,
            default: []
        },
        1: {
            type: Array,
            default: []
        },
        2: {
            type: Array,
            default: []
        },
        3: {
            type: Array,
            default: []
        },
        4: {
            type: Array,
            default: []
        },
        5: {
            type: Array,
            default: []
        }
    },
    prod: {
        type: Boolean,
        default: false
    }
});

// Add timestamps
UserSchema.plugin(timestamp);

const User = mongoose.model("User", UserSchema);
module.exports = User;