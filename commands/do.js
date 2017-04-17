const fs = require("fs");
const resched = require("../util/resched");

module.exports = (message) => {
    if (!message.member.permission.has("manageGuild")) {
        message.channel.createMessage(":octagonal_sign: i dont take orders from u sir!!!");
        return;
    }

    resched(message._client, message.channel.guild.id);
    message._client.gcfg[message.channel.guild.id].dont = false;
    fs.writeFile("./gcfg.json", JSON.stringify(message._client.gcfg), (err) => {
        if (err) util.error(err);
        message.channel.createMessage(":white_check_mark: ok :)");
    });
};
