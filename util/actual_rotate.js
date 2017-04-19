const fs = require("fs");
const util = require("util");
var Canvas = require("canvas");
var Image = Canvas.Image;

function meme(data, gcfg) {
    return new Promise((resolve) => {
        if (gcfg.meme && Math.floor(Math.random() * 10) == 0) {
            fs.readFile("./fake_notify.png", (err, fake) => {
                var canvas = new Canvas(128, 128);
                var ctx = canvas.getContext("2d");
                let layer1 = new Image();
                let layer2 = new Image();
                layer1.src = data;
                layer2.src = fake;

                ctx.drawImage(layer1, 0, 0, 128, 128);
                ctx.drawImage(layer2, 0, 0, 128, 128);

                let buffers = [];
                canvas.pngStream().on("data", (buffer) => {
                    buffers.push(buffer);
                }).on("end", () => {
                    resolve(Buffer.concat(buffers));
                });
            });
        } else {
            resolve(data);
        }
    });
}

module.exports = (guild, channel, client, dirlist, gcfg, path) => {
    if (gcfg.dont) {
        if (channel) channel.createMessage("cant sorry :(");
        return;
    }

    let to_rotate = dirlist[Math.floor(Math.random() * dirlist.length)];
    path = `${path}/${to_rotate}`;

    fs.readFile(path, (err, data) => {
        meme(data, gcfg).then(data => {
            guild.edit({
                icon: "data:image/jpg;base64," + data.toString("base64")
            }).then(guild => {
                client.pg.updateCurrent(guild.id, to_rotate.split(".")[0]).catch((err) => {
                    console.error(err);
                }).then(() => {
                    if (channel) channel.createMessage(":recycle:");
                    util.log(`rotated on ${guild.id}/${guild.name}`);
                    delete client.gcfg[guild.id];
                })
            }).catch(err => util.error(err));  
        }).catch(err => {
            util.error(err);
        });
    });
};
