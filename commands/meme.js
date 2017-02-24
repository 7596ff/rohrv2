const fs = require("fs");
const resched = require("../util/resched");

module.exports = message => {
    if (!message.member.permission.has("manageGuild")) {
        message.channel.createMessage(":octagonal_sign: sorry no memes!");
        return;
    }

    message._client.gcfg[message.channel.guild.id].meme = !message._client.gcfg[message.channel.guild.id].meme;
    fs.writeFile("./gcfg.json", JSON.stringify(message._client.gcfg), (err) => {
        if (err) util.error(err);
        let msg = message._client.gcfg[message.channel.guild.id].meme ? "on" : "off";
        message.channel.createMessage(`:white_check_mark: memes are ${msg}.`);
    });

};
