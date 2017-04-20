const util = require("util");

module.exports = (message) => {

    let help = [
        "**help for rohrkatze rotator**",
        "`katze ping` - pong",
        "`katze rotate` - rotates the server icon",
        "`katze list` - lists all current server icons",
        "`katze show <img>` - shows a specific image. `katze show all` works the same as `katze list`",
        "`katze invite` - invite link",
        "`katze owo` - whats this??",
        "`katze star stats` - show some stats about starboard",
        "`katze star show <message id>` - display a star inline",
        "`katze star who <message id>` - display who starred a message",
        "",
        "use `katze help admin` to show admin commands."
    ].join("\n");

    let adminHelp = [
        "**admin commands** (requires manage server or manage messages permission):",
        "`katze pls` - add an image attachment or user icon to rotate",
        "`katze meme` - toggles current meme status on this server",
        "`katze delete <img>` - after `katze list`ing, delete a specific icon",
        "`katze timeout <hours>` - change how long it is between rotations (between 1 and 24 pls)",
        "`katze activity <role name>` - after creating an activity role, katze will auto assign it to members who speak and remove it after 24 hours",
        "`katze dont` - disable icon rotation",
        "`katze do` - enable icon rotation",
        "`katze starboard channel <channel mention>` - set which channel to host starboard in",
        "`katze starboard emoji <emoji>` - set which emoji to use as star",
        "`katze starboard clean <threshold>` - delete all stars less than a week old that are under threshold"
    ].join("\n");
    
    message.channel.createMessage(message.content == "help admin" ? adminHelp : help).then(() => {
        util.log(`sent info message to ${message.channel.guild.name}`);
    }).catch(err => util.error(err));
};
