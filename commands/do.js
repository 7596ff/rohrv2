const resched = require("../util/resched");

async function _do(message, client) {
    if (!message.member.permission.has("manageGuild")) {
        message.channel.createMessage(":octagonal_sign: i dont take orders from u sir!!!");
        return;
    }

    try {
        await client.pg.makeDo(message.channel.guild.id);
        resched(client, message.channel.guild.id);
        message.channel.createMessage(":white_check_mark: ok :)");
    } catch (err) {
        console.log(err);
        message.channel.createMessage(":x: something went wrong doing, try again maybe");
    }
}

module.exports = _do;
