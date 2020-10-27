const config = require('../config');
const Polyphony = require('polyphony.js');
const polyphony = new Polyphony(config, 3305);
const chalk = require(`chalk`);
const mysql = require(`mysql`);
const Tiltify = require(`tiltify`);
let tiltifyOpts = {
    access_token: `1b595d3293afb141968213dab8ce46b04d5460107af55edefdad0593061ef3ec`,
    campaign_id: `76910`
}
const tiltify = new Tiltify(tiltifyOpts.access_token);
const db = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});
getCampaign = async function (channel_id) {
    const output = new Promise((res, rej) => {
        var sql = `SELECT campaign FROM channels WHERE channel_id=?`;
        db.query(sql, [channel_id], (err, result) => {
            if (err) console.log(err);
            res(result[0].campaign);
        });
    });
    return output;
}
module.exports = {
    attachEvents: function (client) {
        polyphony.modules('all').then(data => {
            data.forEach(chan => {
                setTimeout(() => {
                    client.join(chan).then(() => { sleep(25); })
                        .catch((err) => {
                            // sleep(2000);
                        });
                }, 1000)
            });
        })
        client.on('message', function (channel, context, msg, self) {
            const chan = channel.slice(1).toLowerCase();
            if (msg.toLowerCase().includes('cazgem')) {
                console.log(chalk.red(`--------------------------NOTICE!-----------------------------`));
            } else if (msg.toLowerCase().includes('polyphony')) {
                console.log(chalk.cyan(`--------------------------NOTICE!-----------------------------`));
            }
            if (self || msg[0] !== '!') {
                return;
            }
            let params = msg.slice(1).split(' ');
            let channelname = channel.slice(1);
            let cname = params.shift().toLowerCase();

            if (channel.slice(1) === `tiltify`) {
                let module = 'onboarding';
                require(`./handlers/${module}.js`).run(cname, client, msg, params, context, channel, self, polyphony)
            }

            if ((cname === `tiltify`) && ((context.mod) || (context['room-id'] === context['user-id']))) {
                if (params[0] === `edit`) {
                    if (params[1] === `campaign`) {
                        let sql = `UPDATE channels SET ${params[1]}="${params[2]}" WHERE channel_ID=?`;
                        let cazgemRewards = db.query(sql, [context[`room-id`]], (err, result) => {
                            if (err) throw err;
                            client.action(channel, `Cause Updated to ${params[2]}`)
                        });
                    } else {
                        client.action(channel, `You're alright!`)
                    }
                } else if (params[0] === `setcampaign`) {
                    let sql = `UPDATE channels SET campaign="${params[1]}" WHERE channel_ID=?`;
                    let cazgemRewards = db.query(sql, [context[`room-id`]], (err, result) => {
                        if (err) throw err;
                        client.action(channel, `Cause Updated to ${params[1]}`)
                    });
                } else {
                    client.action(channel, `I'm your personal Tiltify Assistant! Check out my documentation online.`)
                }
            } else {
                getCampaign(context[`room-id`]).then(campaign_id => {
                    if (cname === `donate`) {
                        tiltify.Campaigns.fetch(campaign_id, function (err, campaign) {
                            client.action(channel, `Welcome To ${campaign.name}! Donate here: ${campaign.url}`)
                        });
                    } else if (cname === `charity`) {
                        tiltify.Campaigns.fetch(campaign_id, function (err, campaign) {
                            tiltify.Causes.fetch(campaign.causeId, function (err, cause) {
                                client.action(channel, `${channel.slice(1)} is currently Raising Money for ${cause.name} as part of the ${campaign.name}! ${cause.about}`)
                            })
                        });
                    } else if (cname === `goal`) {
                        tiltify.Campaigns.fetch(campaign_id, function (err, campaign) {
                            client.action(channel, `Our goal with this fundraising event is to raise $${campaign.fundraiserGoalAmount}! We've raised $${campaign.amountRaised}`)
                        });
                    } else if (cname === `goal`) {
                        tiltify.Campaigns.fetch(`fundraiserGoalAmount`, campaign_id, function (err, result) {
                            client.action(channel, `Our goal with this fundraising event is to raise $${result}!`)
                        });
                    }
                })
            }
        })
    }
}