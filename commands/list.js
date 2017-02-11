const fs = require("fs");
const upone = require("../util/upone")
var Canvas = require("canvas-prebuilt");
var Image = Canvas.Image;

function draw_images(imglist, gid) {
    return new Promise((resolve, reject) => {
        let full_width = (10 % imglist.length == 10 ? 10 : imglist.length) * 100;
        let full_height = Math.ceil(imglist.length / 10) * 100;
        let __upone = upone(__dirname);
        var canvas = new Canvas(full_width, full_height);
        var ctx = canvas.getContext("2d");

        for (img in imglist) {
            let xpos = img % 10 * 100;
            let ypos = Math.floor(img / 10) * 100;
            let imago = new Image();
            imago.src = imglist[img];

            ctx.drawImage(imago, xpos, ypos, 100, 100);
            //ctx.fillText(img, xpos, ypos);

            if (img == imglist.length - 1) {
                let loc = `${__upone}/grids/${gid}.png`;
                canvas.pngStream().pipe(fs.createWriteStream(loc)).on("finish", () => {
                    resolve(loc);
                });
            }
        }
    });
}

function get_image(url) {
    return new Promise((resolve, reject) => {
        fs.readFile(url, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}

module.exports = message => {
    let gid = message.channel.guild.id;
    let gcfg = message._client.gcfg[gid];
    let __upone = `${upone(__dirname)}/guilds/${gid}`;

    message.channel.sendTyping().then(() => {
        fs.readdir(__upone, (err, files) => {
            files.sort();
            let requests = files.map(fname => get_image(`${__upone}/${fname}`));
            Promise.all(requests).then(flist => {
                draw_images(flist, gid).then(loc => {
                    fs.readFile(loc, (err, data) => {
                        message.channel.createMessage("heck", {
                            "file": data,
                            "name": "heck.png"
                        }).then(() => {
                            console.log(`sent grid to ${message.channel.guild.name}`);
                        }).catch(err => {
                            console.log(err);
                            message.channel.createMessage("something went wrong :c");
                        });
                    });
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                console.log(err);
            });
        });
    });
};
