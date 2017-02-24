const util = require("util");

module.exports = (message) => {
    let me = message.channel.guild.members.has("102645408223731712") ? "<@102645408223731712>" : "alexa#0199";

    let help = [
        "help for rohrkatze rotator",
        "",
        "`katze ping` - pong",
        "`katze pls` - add an image attachment or icon to rotate ",
        "(requires the manage server permission)",
        "`katze rotate` - rotates the server icon",
        "`katze list` - lists all current server icons",
        "`katze delete <img>` - after `katze list`ing, delete a specific icon",
        "`katze invite` - invite link",
        "",
        `the server will rotate the icon every 24 hours at midnght EST. contact ${me} to change this timeout`
    ];
    
    message.channel.createMessage({"embed": {
        "timestamp": new Date().toJSON(),
        "description": help.join("\n")
    }}).then(() => {
        util.log(`sent info message to ${message.channel.guild.name}`);
    }).catch(err => util.error(err));
};
