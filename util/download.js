const https = require("https");
const fs = require("fs");

const upone = require("./upone");

module.exports = (gid, mid, url) => {
    return new Promise((resolve, reject) => {
        let type = url.split(".")[url.split(".").length - 1];
        if (["png", "jpg", "jpeg"].indexOf(type) != -1) {
            let __upone = upone(__dirname);
            let path = `${__upone}/guilds/${gid}`;

            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }

            let filepath = `${path}/${mid}.${type}`;
            let file = fs.createWriteStream(filepath);
            https.get(url, response => {                
                response.pipe(file).on("finish", () => {
                    resolve();
                });
            });
        } else {
            reject("heck");
        }
    });
};
