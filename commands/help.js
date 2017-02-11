module.exports = (message) => {
    let help = [
        "help for rohrkatze rotator",
        "",
        "`katze ping` - pong",
        "`katze pls` - add an image attachment or icon to rotate (requires the manage server permission)",
        "`katze rotate` - rotates the server icon",
        "`katze list` - lists all current server icons",
        "`katze delete <img>` - after `katze list`ing, delete a specific icon",
        "",
        "the server will rotate the icon every 24 hours at midnght EST. contact alexa#2899 to change this timeout"
    ];
    message.channel.createMessage(help.join("\n"));
};
