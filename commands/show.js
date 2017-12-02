const fs = require("fs");
const util = require("util");
const upone = require("../util/upone");

const list = require("./list");

module.exports = message => {
    let folder = `${upone(__dirname)}/guilds/${message.channel.guild.id}/`;
    let show = message.content.split(" ")[1];

    if (show == "all") {
        list(message);
        return;
    }

    fs.readdir(folder, (err, files) => {
        if (err) {
            message.channel.createMessage("something went wrong aaaAAAAHH");
            console.error(err);
            return;
        }

        if (files.indexOf(show) != -1) {
            fs.readFile(folder + show, (err, data) => {
                message.channel.createMessage("", {
                    "file": data,
                    "name": show
                }).catch(err => {
                    util.error(err);
                });
            });
        } else {
            message.channel.createMessage("i couldn't find that file :c");
        }
    });
};
