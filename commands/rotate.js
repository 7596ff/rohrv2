const fs = require("fs");

const upone = require("../util/upone");
const actual_rotate = require("../util/actual_rotate");

module.exports = (message) => {
    let gid = message.channel.guild.id;
    let gcfg = message._client.gcfg[gid];
    let __upone = `${upone(__dirname)}/guilds/${gid}`;

    let dirlist = [];
    let idlist = [];
    fs.readdir(__upone, (err, files) => {
        if (files.length < 1) {
            message.channel.createMessage(":octagonal_sign: not enough images!");
            return;
        }

        if (message.author.id != message.channel.guild.ownerID && Date.now() <= gcfg.lasttime + 600000) {
            let timeleft = require("pretty-ms")(gcfg.lasttime  + 600000 - Date.now());
            message.channel.createMessage(`:octagonal_sign: pls wait! ${timeleft} left.`);
            return;
        }

        files.forEach(file => {
            dirlist.push(file);
            idlist.push(file.split(".")[0]);
        });

        if (idlist.indexOf(gcfg.current) != -1) {
            dirlist.splice(idlist.indexOf(gcfg.current), 1);
            actual_rotate(message.channel.guild, message.channel, dirlist, message._client.gcfg, __upone);
        } else {
            actual_rotate(message.channel.guild, message.channel, dirlist, message._client.gcfg, __upone);
        }
    });
};
