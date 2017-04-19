const config = require("./config");

const util = require("util");
const fs = require("fs");

const resched = require("./util/resched");
const Eris = require("eris");
const Redis = require("redis");
const Postgres = require("pg");

const Pg = require("./util/pg");

var client = new Eris(config.token);
var redis = Redis.createClient();
var rsub = Redis.createClient();
client.postgres = new Postgres.Client(config.pg);
client.pg = new Pg(client.postgres);

var gcfg = {};

rsub.subscribe("__keyevent@0__:expired", (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    } else {
        console.log("subscribed to keyevent expired");
    }
});

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
    "🥔": rotate,
    "activity": require("./commands/activity"),
    "dont": require("./commands/dont"),
    "do": require("./commands/do")
};

client.tasks = {};

client.gcfg = require("./gcfg.json");

client.on("ready", () => {
    util.log("rohrv2 ready.");
    client.editStatus("online", { name: "hecking unbelieveable" });
});

client.once("ready", () => {
    client.guilds.forEach((guild) => {
        resched(client, guild.id);
    });
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

function processMessage(message) {
    let splitContent = message.content.split(" ");

    if (splitContent.shift() == config.defaultPrefix && splitContent[0] in client.commands) {
        message.content = splitContent.join(" ");
        client.commands[splitContent[0]](message, client);
    }

    let roleID = client.gcfg[message.channel.guild.id].activityRole;
    let timeout = client.gcfg[message.channel.guild.id].activityTimeout;
    if (roleID) {
        let key = `katze:activity:${message.channel.guild.id}:${message.member.id}`;
        redis.get(key, (err, reply) => {
            if (!message.member.bot) {
                redis.setex(key, timeout || 86400, true);
                if (!reply) message.member.addRole(roleID).catch((err) => console.log(err));
            }
        });
    }
}

client.on("messageCreate", (message) => {
    if (!message.channel.guild) return;
    if (message.author.id == client.user.id) return;
    if (!message.member || !message.author) return;

    if (gcfg[message.channel.guild.id]) {
        message.gcfg = gcfg[message.channel.guild.id];
        processMessage(message);
    } else {
        client.pg.getGcfg(message.channel.guild.id).catch((err) => console.error(err)).then((gcfg) => {
            message.gcfg = gcfg;
            processMessage(message);
        });
    }
});

client.on("guildMemberRemove", (guild, member) => {
    redis.expire(`katze:activity:${guild.id}:${member.id}`, 1);
});

rsub.on("message", (channel, message) => {
    if (!message.startsWith("katze:activity")) return;

    const guildID = message.split(":")[2];
    const memberID = message.split(":")[3];

    let guild = client.guilds.get(guildID);
    if (!guild) return;
    let member = guild.members.get(memberID);
    if (member) {
        let roleID = client.gcfg[guildID].activityRole;
        if (member.roles.includes(roleID)) member.removeRole(roleID);
    }
});

process.on("exit", () => {
    util.log("exiting");
    client.editStatus("invisible");
});

client.postgres.connect((err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    console.log("postgres ready");
    client.connect();
});
