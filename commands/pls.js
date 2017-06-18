const fs = require("fs");
const download = require("../util/download");
const resched = require("../util/resched");

function force(path, guild) {
    fs.readFile(path, (err, data) => {
        if (!err) {
            guild.edit({
                icon: "data:image/jpg;base64," + data.toString("base64")
            }).catch(err => util.error(err));
        }
    });
}

module.exports = (message) => {
    if (!message.member.permission.has("manageGuild")) {
        message.channel.createMessage(":octagonal_sign: u cant upload images sorry!");
        return;
    }

    if (message.mentions.length == 1) {
        download(message.channel.guild.id, message.id, message.mentions[0].staticAvatarURL).then((path) => {
            force(path, message.channel.guild);
            message.channel.createMessage(":white_check_mark: saved your image.").then(() => resched(message._client, message.channel.guild.id));
        }).catch(err => {
            if (err == "heck") {
                message.channel.createMessage("tfw gif avatar");
            } else {
                message.channel.createMessage(":x: couldn't save your image.");
            }
        });
        return;
    }

    if (message.mentions.length > 1) {
        message.channel.createMessage(":octagonal_sign: Please only mention one member.");
        return;
    }

    if (message.attachments.length == 1) {
        download(message.channel.guild.id, message.id, message.attachments[0].url)
            .then((path) => {
                force(path, message.channel.guild);
                message.channel.createMessage(":white_check_mark: saved your image.").then(() => resched(message._client, message.channel.guild.id));
            }).catch(err => {
                if (err == "heck") {
                    message.channel.createMessage("tfw gif");
                } else {
                    message.channel.createMessage(":x: couldn't save your image.");
                }
            });
        return;
    }

    message.channel.createMessage(":octagonal_sign: pls provide username mentions or an image attachment.");
};