const requestPromise = require("request-promise");

class RestApi {
    constructor() {
        console.log(sails.config.custom)
        this.uri = _.get(sails.config.custom, 'bitcoin');
        if (!this.uri) throw new Error("No uri found!");
        // this.apiToken = _.get(app.config, options.apiToken);
    }
    prepareRequest(uri, type, body) {
        const options = {
            method: type,
            uri: this.uri + uri,
            body,
            headers: {
                "Content-Type": "application/json",
            },
            json: true,
        };
        return options;
    }
    async get(uri) {
        let ro = this.prepareRequest(uri, 'get');
        console.log("🚀 ~ file: RestAPI.js ~ line 26 ~ RestApi ~ get ~ ro", ro)
        return requestPromise(ro);
    }
    post(uri, body) {
        let ro = this.prepareRequest(uri, 'post', body);
        return requestPromise(ro);
    }
    patch(uri, body) {
        let ro = this.prepareRequest(uri, 'patch', body);
        return requestPromise(ro);
    }
    put(uri, body) {
        let ro = this.prepareRequest(uri, 'put', body);
        return requestPromise(ro);
    }
}

module.exports = new RestApi();