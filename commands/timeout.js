const fs = require("fs");
const util = require("util");

const resched = require("../util/resched");

module.exports = message => {
    if (!message.member.permission.has("manageGuild")) {
        message.channel.createMessage(":octagonal_sign: u cant change the timeout sorry!");
        return;
    }

    let timeout = message.content.split(" ").slice(1).join(" ");

    if (parseInt(timeout) > 0 && parseInt(timeout) <= 24) {
        message._client.gcfg[message.channel.guild.id].timeout = parseInt(timeout);
        fs.writeFile("./gcfg.json", JSON.stringify(message._client.gcfg), (err) => {
            if (err) util.error(err);
            resched(message._client, message.channel.guild.id);
            message.channel.createMessage(`:white_check_mark: set new timeout to ${parseInt(timeout)}.`);
        });
    } else {
        message.channel.createMessage(":x: invalid time format!!!");
    }
};
