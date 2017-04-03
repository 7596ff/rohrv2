const Eris = require("eris");
const config = require("./config");
var client = new Eris(config.token);
const util = require("util");
const fs = require("fs");
const resched = require("./util/resched");

const rotate = require("./commands/rotate");

client.commands = {
    "ping": require("./commands/ping"),
    "rotate": rotate,
    "pls": require("./commands/pls"),
    "rotato": rotate,
    "invite": require("./commands/invite"),
    "help": require("./commands/help"),
    "owo": require("./commands/owo"),
    "potato": rotate,
    "list": require("./commands/list"),
    "delete": require("./commands/delete"),
    "timeout": require("./commands/timeout"),
    "show": require("./commands/show"),
    "meme": require("./commands/meme"),
    "eval": require("./commands/eval"),
    "tomato": rotate,
    "🍅": rotate,
    "🥔": rotate
};

client.tasks = {};

client.gcfg = require("./gcfg.json");

client.on("ready", () => {
    util.log("rohrv2 ready.");
    client.editStatus("online", { name: "hecking unbelieveable" });
});

client.once("ready", () => {
    for (let gid in client.gcfg) {
        resched(client, gid);
    }
});

client.on("guildCreate", guild => {
    client.gcfg[guild.id] = {
        "current": "none",
        "timeout": 24
    };

    fs.writeFile("./gcfg.json", JSON.stringify(client.gcfg), (err) => {
        if (err) util.error(err);
    });
});

client.on("guildRemove", guild => {
    delete client.gcfg[guild.id];

    fs.writeFile("./gcfg.json", JSON.stringify(client.gcfg), (err) => {
        if (err) util.error(err);
    });
});

client.on("messageCreate", message => {
    if (!message.channel.guild) return;
    if (!message.member || !message.author) return;

    let splitContent = message.content.split(" ");

    if (splitContent.shift() == config.defaultPrefix && splitContent[0] in client.commands) {
        message.content = splitContent.join(" ");
        client.commands[splitContent[0]](message);
    }
});

process.on("exit", () => {
    util.log("exiting");
    client.editStatus("invisible");
});

client.connect();
