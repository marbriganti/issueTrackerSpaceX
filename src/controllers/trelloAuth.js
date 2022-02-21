const crypto = require("crypto");
const uuid = require("uuid");
const getHeaders = (authkeys, method, urlRequest, urlParameters) => {
    const key = authkeys.apiKey || process.env.TRELLO_APIKEY;
    const token = authkeys.apiToken || process.env.TRELLO_TOKEN;

    const params = {
        ...urlParameters,
        oauth_consumer_key: key,
        oauth_token: token,
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: parseInt(new Date() / 1000),
        oauth_nonce: uuid.v1(),
        oauth_version: "1.0"
    }
    const sortedParams = Object.keys(params).sort();
    let paramString = '';
    sortedParams.forEach(p => { paramString += `${p}=${params[p]}` });

    baseSignature = `${method}&${urlRequest}&${encodeURIComponent(paramString)}`
    const oauth_signature = crypto.createHmac("sha1", token,).update(baseSignature).digest().toString('base64')
    return {
        'Authorization': `OAuth oauth_consumer_key="${key}",oauth_token="${token}",oauth_signature_method="${params.oauth_signature_method}",oauth_timestamp=${params.oauth_timestamp} ,oauth_version=1.0,oauth_signature=${oauth_signature}`
    };
}



module.exports = {
    getHeaders
}