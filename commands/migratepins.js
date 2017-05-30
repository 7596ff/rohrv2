const starboardEmbed = require("../util/starboardEmbed");

async function migratepins(message) {
    if (!message.member.permission.has("manageGuild")) {
        message.channel.createMessage(":octagonal_sign: i dont take orders from u sir!!!");
        return;
    }

    if (!(message.gcfg.pinboardin && message.gcfg.pinboardout)) {
        message.channel.createMessage(":octagonal_sign: pls setup pinboard in and out pls!");
        return;
    }

    try {
        let pins = await message.channel.guild.channels.get(message.gcfg.pinboardin).getPins();
        pins = pins.reverse();

        for (pin of pins) {
            if (!pin.member) return;
            let embed = starboardEmbed(pin);
            embed.content = "";
            message._client.createMessage(message.gcfg.pinboardout, embed);
        }
    } catch (err) {
        console.error(err);
        message.channel.createMessage("something went wrong sorry... make sure i can send messages to pinboard out!");
    }
}

module.exports = migratepins;
