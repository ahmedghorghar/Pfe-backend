// backend/logic/puch-notifaication.services.js
const axios = require('axios');
const { ONE_SIGNAL_CONFIG } = require('../config/app.config');
var https = require('https');
const { json } = require('body-parser');

async function SendNotification(data, callback) {
    return new Promise((resolve, reject) => {
        const headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Basic " + ONE_SIGNAL_CONFIG.API_KEY,
        };
    var option = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers,
    };

    var req = https.request(option, function (res) {
        var responseData = '';
        res.on('data', function (chunk) {
            responseData += chunk;
        });

        res.on('end', () => {
            try {
                const response = JSON.parse(responseData);
                console.log("Notification Response:", response);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        });
    });

    req.on("error", (e) => {
        console.error("Notification Request Error:", e);
        reject(e);
    });
    
    req.write(JSON.stringify(data));
    req.end();
})
}


module.exports = {
    SendNotification,
}
