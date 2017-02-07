module.exports = (message) => {
    let help = [
        "help for rohrkatze rotator",
        "",
        "`katze ping` - pong",
        "`katze pls` - add an image attachment or avatar to rotate (requires the manage server permission)",
        "`katze rotate` - rotates the server avatar",
        "",
        "the server will rotate the avatar every 24 hours at midnght EST. contact alexa#2899 to change this timeout"
    ];
    message.channel.createMessage(help.join("\n"));
};
