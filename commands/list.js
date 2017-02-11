const fs = require("fs");
const upone = require("../util/upone")
var Canvas = require("canvas-prebuilt");
var Image = Canvas.Image;

function draw_images(imglist, callback) {
    let full_width = (10 % imglist.length == 10 ? 10 : imglist.length) * 100;
    let full_height = Math.ceil(imglist.length / 10) * 100;
    var canvas = new Canvas(full_width, full_height);
    var ctx = canvas.getContext("2d");

    console.log(full_width);
    console.log(full_height);

    for (img in imglist) {
        let xpos = img % 10 * 100;
        let ypos = Math.floor(img / 10) * 100;

        console.log(`drawing at ${xpos} ${ypos}`);

        let imago = new Image();
        imago.src = imglist[img];

        ctx.drawImage(imago, xpos, ypos, 100, 100);
        //ctx.fillText(img, xpos, ypos);

        if (img == imglist.length - 1) {
            console.log('finished')
            let loc = __dirname + '/heck.png';
            let out = fs.createWriteStream(loc);
            let stream = canvas.pngStream();

            stream.on("data", (chunk) => {
                out.write(chunk);
            });

            stream.on("end", () => {
                console.log("saved png");
            });
        }
    }
}

module.exports = message => {
    let gid = message.channel.guild.id;
    let gcfg = message._client.gcfg[gid];
    let __upone = `${upone(__dirname)}/guilds/${gid}`;

    message.channel.sendTyping();

    let imglist = [];
    fs.readdir(__upone, (err, files) => {
        for (file in files) {
            let url = __upone + '/' + files[file];

            fs.readFile(url, (err, data) => {
                if (err) {
                    console.log(err);;
                    message.channel.createMessage("something went wrong :c");
                    return;
                }

                imglist.push(`data:image/${url.split(".")[1]};base64,` + data.toString('base64'));

                if (imglist.length == files.length) {
                    draw_images(imglist)
                    setTimeout(() => {
                        fs.readFile(__dirname + "/heck.png", (err, data) => {
                            message.channel.createMessage("heck", {
                                "file": data,
                                "name": "heck.png"
                            }).then(() => {
                                console.log(`sent files to ${message.channel.guild.name}`);
                            }).catch(err => {
                                console.log(err);
                                message.channel.createMessage("something went wrong :c");
                            });
                        });
                    }, 500);
                }
            });
        }
    });
};
