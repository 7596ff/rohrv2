const starboardEmbed = require("../util/starboardEmbed");

async function pin(message) {
    if (!message.gcfg.pinboardout) {
        return message.channel.createMessage(":x: you havent set up a pinboard :((");
    }

    if (!message.member.permission.has("manageMessages")) {
        return message.channel.createMessage(":octagonal_sign: i dont take orders from u sir!!!");
    }

    let id = message.content.split(" ")[1];

    if (!id) {
        return message.channel.createMessage(":x: no id provided!");
    }

    if (isNaN(id)) {
        return message.channel.createMessage(":x: id is not a number!");
    }

    let msg = message.channel.messages.get(id);
    if (!msg) {
        try {
            msg = await message._client.getMessage(message.channel.id, id);
        } catch (err) {
            if (JSON.parse(err.response).code == 10008) {
                return message.channel.createMessage("couldnt find this message id!");
            } else {
                console.error(err);
                console.error(message.content);
                console.error(message.channel.id);
                return message.channel.createMessage("somethingw ent wrong sorry!!!");
            }
        }
    }

    let embed = starboardEmbed(msg);
    embed.content = "";
    try {
        await message._client.createMessage(message.gcfg.pinboardout, embed);
    } catch (err) {
        console.error(err)
        return message.channel.createMessage("something went wrong sorry!!");
    }

    return message.channel.createMessage(":white_check_mark:");
}

module.exports = pin;
