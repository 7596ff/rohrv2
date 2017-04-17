const fs = require("fs");

module.exports = (message) => {
    if (!message.member.permission.has("manageGuild")) {
        message.channel.createMessage(":octagonal_sign: i dont take orders from u sir!!!");
        return;
    }

    let task = message._client.tasks[message.channel.guild.id];
    if (task) {
        task.cancel();
        message._client.gcfg[message.channel.guild.id].dont = true;
        fs.writeFile("./gcfg.json", JSON.stringify(message._client.gcfg), (err) => {
            if (err) util.error(err);
            message.channel.createMessage(":white_check_mark: ok :(");
        });
    }
};
