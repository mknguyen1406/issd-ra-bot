let httpReq = new XMLHttpRequest();
httpReq.open("GET", "https://issd-trading.azurewebsites.net/parameters/get/def", true);
httpReq.send();
httpReq.onreadystatechange = function () {
    if (httpReq.readyState === 4 && httpReq.status === 200) {
        const response = httpReq.responseText;
        const obj = JSON.parse(response);
        console.log(obj);

        // token_ = obj.token;
        // conversationId_ = obj.conversationId;

        window.alert("pricePath: " + obj.pricePath + "\nexperimentGroup: " + obj.experimentGroup);
    }
};


