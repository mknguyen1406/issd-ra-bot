var config = {}

config.endpoint = "https://mknguyen.documents.azure.com:443/";
config.primaryKey = "t2P55k4cMfPcxZhE5DKcXzlq5kFxMIIRijnhJZqk2bamsYtVP6w6Yc5IoFe94dw8HSKhEH89gyGNyHVYXz2KMA==";

// config.host = process.env.HOST || "https://issd-ra-db.documents.azure.com:443/";
// config.authKey = process.env.AUTH_KEY || "Yrlt6bqa438bWaA7qbCRjcF7HzR1COv35D7SujL3LbbSEYDyhDswOh5txEO2EuaaOKrTrYhj0VsgGyFWI8igcQ==";

config.database = {
    "id": "ISSD-RA-DB"
};

config.container = {
    "id": "ISSD-RA-Container"
};

config.items = {
    "user1": {
        "userId": "Anderson.1",
        "cashout": {
            "portfolio": 50,
            "budget": 1950
        },
        "holdings": {
            "0": [0,0,0,0,0,0,0,0,0,0,0,0,0],
            "1": [0,0,0,0,0,0,0,0,0,0,0,0,0],
            "2": [0,0,0,0,0,0,0,0,0,0,0,0,0],
            "3": [0,0,0,0,0,0,0,0,0,0,0,0,0],
            "4": [0,0,0,0,0,0,0,0,0,0,0,0,0],
            "5": [0,0,0,0,0,0,0,0,0,0,0,0,0]
        },
        "invests": {
            "0": [0,0,0,0,0,0,0,0,0,0,0,0,0],
            "1": [0,0,0,0,0,0,0,0,0,0,0,0,0],
            "2": [0,0,0,0,0,0,0,0,0,0,0,0,0],
            "3": [0,0,0,0,0,0,0,0,0,0,0,0,0],
            "4": [0,0,0,0,0,0,0,0,0,0,0,0,0],
            "5": [0,0,0,0,0,0,0,0,0,0,0,0,0]
        },
        "prices": {
            "0": [0,0,0,0,0,0,0,0,0,0,0,0,0],
            "1": [0,0,0,0,0,0,0,0,0,0,0,0,0],
            "2": [0,0,0,0,0,0,0,0,0,0,0,0,0],
            "3": [0,0,0,0,0,0,0,0,0,0,0,0,0],
            "4": [0,0,0,0,0,0,0,0,0,0,0,0,0],
            "5": [0,0,0,0,0,0,0,0,0,0,0,0,0]
        }
    }
};
module.exports = config;
