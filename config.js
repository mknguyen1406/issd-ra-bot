var config = {}

config.endpoint = "https://mknguyen.documents.azure.com:443/";
config.primaryKey = "t2P55k4cMfPcxZhE5DKcXzlq5kFxMIIRijnhJZqk2bamsYtVP6w6Yc5IoFe94dw8HSKhEH89gyGNyHVYXz2KMA==";

// config.host = process.env.HOST || "https://issd-ra-db.documents.azure.com:443/";
// config.authKey = process.env.AUTH_KEY || "Yrlt6bqa438bWaA7qbCRjcF7HzR1COv35D7SujL3LbbSEYDyhDswOh5txEO2EuaaOKrTrYhj0VsgGyFWI8igcQ==";

config.database = {
    "id": "FamilyDatabase"
};

config.container = {
    "id": "FamilyContainer"
};

config.items = {
    "Andersen": {
        "id": "Anderson.1",
        "Country": "USA",
        "userId": "123",
        "lastName": "Andersen",
        "parents": [{
            "firstName": "Thomas"
        }, {
                "firstName": "Mary Kay"
            }],
        "children": [{
            "firstName": "Henriette Thaulow",
            "gender": "female",
            "grade": 5,
            "pets": [{
                "givenName": "Fluffy"
            }]
        }],
        "address": {
            "state": "WA",
            "county": "King",
            "city": "Seattle"
        }
    },
    "Wakefield": {
        "id": "Wakefield.7",
        "Country": "Italy",
        "userId": "456",
        "parents": [{
            "familyName": "Wakefield",
            "firstName": "Robin"
        }, {
                "familyName": "Miller",
                "firstName": "Ben"
            }],
        "children": [{
            "familyName": "Merriam",
            "firstName": "Jesse",
            "gender": "female",
            "grade": 8,
            "pets": [{
                "givenName": "Goofy"
            }, {
                    "givenName": "Shadow"
                }]
        }, {
                "familyName": "Miller",
                "firstName": "Lisa",
                "gender": "female",
                "grade": 1
            }],
        "address": {
            "state": "NY",
            "county": "Manhattan",
            "city": "NY"
        },
        "isRegistered": false
    }
};
module.exports = config;
