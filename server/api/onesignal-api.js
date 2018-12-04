const axios = require('axios')
const env = require('../env');

const instance = axios.create({
  baseURL: 'https://onesignal.com/api/v1',
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": "Basic " + env.ONESIGNAL_KEY
  }
})

module.exports = {
  /**
   * @param message has to be an object, for instance:
   * {
   *  "en": "Someone made an order",
   *  "ru": "Кто-то сделал заказ"
   * }
   * */
  async sendNotificationToAll (message) {
    const data = {
      app_id: env.ONESIGNAL_ID,
      contents: message,
      included_segments: ["All"]
    }

    await instance.post('/notifications', data)
      .then(res => {
        // console.log('==> Response:'.green);
        // console.log(res);
      })
      .catch(err => {
        console.log('==> onesignal push notification error:'.green);
        console.log(err);
      })
  }
};

// var sendNotification = function(data) {
//   var headers = {
//     "Content-Type": "application/json; charset=utf-8",
//     "Authorization": "Basic NGEwMGZmMjItY2NkNy0xMWUzLTk5ZDUtMDAwYzI5NDBlNjJj"
//   };
//
//   var options = {
//     host: "onesignal.com",
//     port: 443,
//     path: "/api/v1/notifications",
//     method: "POST",
//     headers: headers
//   };
//
//   var https = require('https');
//   var req = https.request(options, function(res) {
//     res.on('data', function(data) {
//       console.log("Response:");
//       console.log(JSON.parse(data));
//     });
//   });
//
//   req.on('error', function(e) {
//     console.log("ERROR:");
//     console.log(e);
//   });
//
//   req.write(JSON.stringify(data));
//   req.end();
// };
//
// var message = {
//   app_id: "5eb5a37e-b458-11e3-ac11-000c2940e62c",
//   contents: {"en": "English Message"},
//   included_segments: ["All"]
// };
