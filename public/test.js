/*
--------------------------------------------
Arrow functions
--------------------------------------------
 */
let sum2 = (a,b) => a+b; // sum2 is the variable name, (a,b) are the parameters, what comes after => will be returned
let isPositive2 = number => number >= 0; // function with one argument
let randomCode2 = () => Math.random() >= 0; // function without arguments
document.addEventListener('click', () => console.log('click')); // anonymous functions

// this handling
class Person {
    constructor(name) {
        this.name = name
    }

    printNameArrow() {
        setTimeout(()=> {
            console.log('Arrow: ' + this.name)
        }, 100)
    }

    printNameFunction() {
        setTimeout(function () {
            console.log('Function: ' + this.name)
        }, 100)
    }
}

let person = new Person('Bob');
person.printNameArrow(); // this refers to scope where function is DEFINED
person.printNameFunction(); // this is called where the function in CALLED

/*
--------------------------------------------
Promises
--------------------------------------------
 */
let p = new Promise((resolve, reject) => {
    let a = 1+1;
    if (a === 2) {
        resolve('Success')
    } else {
        reject('Failes')
    }
});

p.then((message) => {
    console.log('This is in the then ' + message)
}).catch((message) => {
    console.log('This is in the catch ' + message)
});

// instead of
const userLeft = false;
const userWatchingCatMeme = false;

function watchTutCallback(callback, errorCallback) {
    if (userLeft) {
        errorCallback({
            name: 'UserLeft',
            message: ':('
        })
    } else if (userWatchingCatMeme) {
        errorCallback({
            name: 'User watching cat meme',
            message: 'WebDevbla < Cat'
        })
    } else {
        callback('Yeah')
    }
}

watchTutCallback((message) => {
    console.log(message)
}, (error) => {
    console.log(error.name + ' ' + error.message)
});

function watchTutPromise() {
    return new Promise((resolve, reject) => {
        // do something
        if (userLeft) {
            reject({
                name: 'UserLeft',
                message: ':('
            })
        } else if (userWatchingCatMeme) {
            reject({
                name: 'User watching cat meme',
                message: 'WebDevbla < Cat'
            })
        } else {
            resolve('Yeah')
        }
    })
}

watchTutPromise().then((message) => {
    console.log(message)
}).catch((error) => {
    console.log(error.name + ' ' + error.message)
});

/*
--------------------------------------------
Azure Bot
--------------------------------------------
 */

var secret = 'hMRtBPdEIFY.Mak8ZsZLeFesVFma1ShIQlXkmWQaaxBO2usSPyoUrDc';

//Direct Line – Generate Token
let getTokenPr2 = ()=>{
    return new Promise(function(resolve, reject){
        var request_ = new XMLHttpRequest();
        request_.open("POST", "https://directline.botframework.com/v3/directline/tokens/generate", true);
        request_.setRequestHeader("Authorization", "Bearer "+ secret);
        request_.send();
        request_.onreadystatechange = function () {
            if (request_.readyState === 4 && request_.status === 200) {
                var response = request_.responseText;
                var obj = JSON.parse(response);
                console.log(obj);
                resolve(obj);
                //     token_ = obj.token;
                //     conversationId_ = obj.conversationId;
            } else {
                reject('error token')
            }
        };
    });
};

//Direct Line – Start Conversation
let newConversation = (token)=>{
    return new Promise(function(resolve, reject){
        var request_ = new XMLHttpRequest();
        var secret = token;
        request_.open("POST", "https://directline.botframework.com/v3/directline/conversations", true);
        request_.setRequestHeader("Authorization", "Bearer "+ secret);
        request_.send();
        request_.onreadystatechange = function () {
            if (request_.readyState === 4 && request_.status === 200) {
                var response = request_.responseText;
                var obj = JSON.parse(response);
                console.log(obj);
                resolve(obj);
                //     token_ = obj.token;
                //     conversationId_ = obj.conversationId;
            } else {
                reject('error conversation')
            }
        };
    });
};

getTokenPr2()
    .then((suc) => newConversation(suc))
    .then((suc) => {console.log(suc)})
    .catch((err) => {console.log(err)})


//Direct Line – Start Conversation
let newConversation = (TokenObject)=>{
    return new Promise(function(resolve, reject){
        request({
            method: 'POST',
            url: 'https://directline.botframework.com/v3/directline/conversations',
            headers: {
                'Authorization': 'Bearer ' + TokenObject.token
            }
        }, function (err, response, body) {
            if (err) {
                reject(err);
            }
            if (response.statusCode === 200 || 201) {
                resolve(JSON.parse(body));
            }
            else {
                reject({"err": response.statusCode + " error "});
            }
        })
    });
};

//Direct Line – Send Activity
let sendMessage = (TokenObject, data, message, options) => {  //data is der aurufende socket
    return new Promise((resolve, reject) => {
        request({
            method: 'POST',
            url: "https://directline.botframework.com/v3/directline/conversations/" + TokenObject.conversationId + "/activities",
            headers: {
                'Authorization': 'Bearer ' + TokenObject.token
            },
            json:true,
            body: {
                "type": "message",
                "from": options ? options.from : {id: TokenObject.conversationId},
                "text": message,
                "asdf": participantEntities[data.userid] //"asdf" noch zu ersetzen, auch in Azure Portal
            }
        }, function (err, response, body) {
            if (err) {
                reject(err);
            }
            if (response.statusCode === 200 || 201) {
                resolve(body);
            }
            else {
                reject({"err": response.statusCode + " error "});
            }
        })
    });
};

//Direct Line – Receive Activity
let receiveMessage = (TokenObject, waterMark) => {
    return new Promise((resolve, reject)=>{
        request({
            method: 'GET',
            url: "https://directline.botframework.com/v3/directline/conversations/" + TokenObject.conversationId + "/activities",
            headers: {
                'Authorization': 'Bearer ' + TokenObject.token
            },
            json:true
        }, function (err, response, body) {
            if (err) {
                reject(err);
            }
            if (response.statusCode === 200 || 201) {
                console.log('0:');
                //var temp = JSON.parse(body);
                console.log(body);
                resolve(body);
            }
            else {
                reject({"err": response.statusCode + " error "});
            }
        })
    });
};

