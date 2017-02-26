const util = require("util");

module.exports = (message) => {

    let help = [
        "**help for rohrkatze rotator**",
        "`katze ping` - pong",
        "`katze rotate` - rotates the server icon",
        "`katze list` - lists all current server icons",
        "`katze show` - shows a specific image. `katze show all` works the same as `katze list`",
        "`katze invite` - invite link",
        "",
        "**admin commands** (requires manage server permission):",
        "`katze pls` - add an image attachment or user icon to rotate",
        "`katze meme` - toggles current meme status on this server",
        "`katze delete <img>` - after `katze list`ing, delete a specific icon"
    ];
    
    message.channel.createMessage(help.join("\n")).then(() => {
        util.log(`sent info message to ${message.channel.guild.name}`);
    }).catch(err => util.error(err));
};
