const config = require('../../config');
const mysql = require(`mysql`);
const Promise = require(`promise`);
const Tiltify = require(`tiltify`);
let tiltifyOpts = {
    access_token: config.tiltify.access_token
}
const tiltify = new Tiltify(tiltifyOpts.access_token);
this.db = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
exports.run = (cname, client, msg, params, context, channel, self, polyphony) => {
    // const twitchCPR = new TwitchCPR(twitchCPRopts, context[`room-id`], channel.slice(1));
    function getDonationLink() {
        tiltify.Campaigns.getLastDonation(tiltifyOpts.campaign_id, function (err, data) {
            if (data.comment) {
                console.log(`${data.name}: ${data.amount} | "${data.comment}"`)
            } else {
                console.log(`${data.name}: ${data.amount}`)
            }
        })
    }
}