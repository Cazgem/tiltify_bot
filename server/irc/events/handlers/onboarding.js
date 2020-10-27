const config = require('../../config');
const mysql = require(`mysql`);
const Promise = require(`promise`);
this.db = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
exports.run = (cname, client, msg, params, context, channel, self, polyphony) => {
    // const twitchCPR = new TwitchCPR(twitchCPRopts, context[`room-id`], channel.slice(1));
    if (cname === 'join') {
        let load = {
            channel: context.username,
            channel_ID: context[`user-id`]
        };
        let sql = `INSERT IGNORE INTO channels SET ?`;
        let cazgemRewards = this.db.query(sql, load, (err, result) => {
            if (err) throw err;
        });
        client.join(context.username)
        client.action(channel, `Welcome to Tiltify Bot! I've joined your channel, and you should now be able to enable/disable modules at will using the !modules command.`);
    } else if (cname === `part`) {
        let sql = `DELETE FROM channels WHERE channel_ID=?`;
        let cazgemRewards = this.db.query(sql, context[`user-id`], (err, result) => {
            if (err) throw err;
        });
        client.part(context.username)
        client.action(channel, `Sorry to see you go, ${context.username}! I've left your channel, and you can always come back anytime using the !join command.`);
    } else {
        client.action(channel, `Not a Recognized Command!`);
    }
}