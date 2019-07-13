var config = {}

config.endpoint = "https://issd-ra-test.documents.azure.com:443/";
config.primaryKey = "QfCo53p4cHrmX12WYPsUMtQJRkR8jWuHU7Fl5XogVc7ZS8j8T62EfuqvsCbiHQFIMvNEYKUvfCwHQjiUTZHUPg==";

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

config.ENV = process.env.NODE_ENV || "development";
config.PORT = process.env.PORT || 3000;
config.URL = process.env.BASE_URL || "http://localhost:3000";
config.MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://mknguyen:1loveChatbots@issd-ra-cluster-rjcdq.azure.mongodb.net/test?retryWrites=true&w=majority";

module.exports = config;
