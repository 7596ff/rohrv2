const fs = require("fs");
const upone = require("../util/upone");
const resched = require("../util/resched");

module.exports = message => {
    if (!message.member.permission.has("manageGuild")) {
        message.channel.createMessage("you can't remove images sorry!");
        return;
    }

    let folder = `${upone(__dirname)}/guilds/${message.channel.guild.id}/`;
    let del = message.content.split(" ")[1];

    fs.readdir(folder, (err, files) => {
        if (files.indexOf(del) != -1) {
            fs.readFile(folder + del, (err, data) => {
                message.channel.createMessage(`Deleted ${del}.`, {
                    "file": data,
                    "name": del
                }).then(() => {
                    fs.unlink(folder + del, () => {
                        console.log(`deleted ${del}`);
                        resched(message._client, message.channel.guild.id);
                    });
                }).catch(err => {
                    console.log(err);
                });
            });
        } else {
            message.channel.createMessage("i couldn't find that file :c");
        }
    });
};
