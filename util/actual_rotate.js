const fs = require("fs");
const util = require("util");

module.exports = (guild, channel, dirlist, gcfg, path) => {
    let to_rotate = dirlist[Math.floor(Math.random() * dirlist.length)];
    path = `${path}/${to_rotate}`;

    fs.readFile(path, (err, data) => {
        guild.edit({
            icon: "data:image/jpg;base64," + data.toString("base64")
        }).then(guild => {
            if (channel) channel.createMessage(":recycle:");
            util.log(`rotated on ${guild.id}${guild.name}`);

            gcfg[guild.id].lasttime = Date.now();
            gcfg[guild.id].current = to_rotate.split(".")[0];

            fs.writeFile("./gcfg.json", JSON.stringify(gcfg), (err) => {
                if (err) console.log(err);
            });
        }).catch(err => console.log(err));
    });
};
