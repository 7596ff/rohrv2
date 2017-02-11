const Eris = require("eris");
const config = require("./config");
var client = new Eris(config.token);
const util = require("util");
const fs = require("fs");

const schedule = require("node-schedule");

const actual_rotate = require("./util/actual_rotate");
const resched = require("./util/resched");

client.commands = {
    "ping": require("./commands/ping"),
    "rotate": require("./commands/rotate"),
    "pls": require("./commands/pls"),
    "rotato": require("./commands/rotate"),
    "invite": require("./commands/invite"),
    "help": require("./commands/help"),
    "owo": require("./commands/owo"),
    "potato": require("./commands/rotate"),
    "list": require("./commands/list"),
    "delete": require("./commands/delete")
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
        if (err) console.log(err);
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
    client.editStatus("invisible");
});

client.connect();
