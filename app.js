/**
 * Required External Modules
 */
const config = require('./server/irc/config.js');
const express = require('express');
const chalk = require('chalk');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const bodyParser = require("body-parser");
const path = require("path");
// const notifier = require(`node-notifier`);
const http = require(`http`);
const Polyphony = require('polyphony.js');
const polyphony = new Polyphony(config, 4207);

/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "3030";
/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
/**
 * Routes Definitions
 */
const server = http.Server(app);
server.listen(3230);
app.use(express.static(path.join(__dirname, `client`)));
app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
    // notifier.notify('Go empty the dishwasher!');
});
app.post("/webhook/*", (req, res) => {
    console.log(req.body) // Call your action on the request here
    res.status(200).end() // Responding is important
})
app.post("/charity", (req, res) => {
    console.log(req.body) // Call your action on the request here
    res.status(200).end() // Responding is important
})
/**
 * Server Activation
 */
// middleware
app.use(morgan('dev'));

//listen and respond to heartbeat request from parent
process.on('message', (message) => {
    if (message && message.request === 'heartbeat') {
        process.send({
            heartbeat: 'thump'
        });
    }
});

app.use(express.static('browser/public'));

// app.use('/', router);

app.use(bodyParser.json())

app.listen(port, () => {
    console.log(chalk.yellow(`App is listening at https://dashboard.polyphony.me/`));
});
app.post("/hook", (req, res) => {
    console.log(req.body) // Call your action on the request here
    res.status(200).end() // Responding is important
})

const irc = require('./server/irc');
// const polyphony = require(`./polyphony`);
irc.start();