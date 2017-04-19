const resched = require("../util/resched");

async function timeout(message, client) {
    if (!message.member.permission.has("manageGuild")) {
        message.channel.createMessage(":octagonal_sign: u cant change the timeout sorry!");
        return;
    }

    let timeout = parseInt(message.content.split(" ").slice(1).join(" "));
    if (timeout > 0 && timeout <= 24) {
        try {
            await client.pg.updateTimeout(message.channel.guild.id, timeout);
            resched(client, message.channel.guild.id);
            delete client.gcfg[message.channel.guild.id];
            message.channel.createMessage(`:white_check_mark: timeout set to ${timeout}`);
        } catch (err) {
            console.error(err);
            message.channel.createMessage(":x: something went wrong updating the timeout, try again maybe");
        }
    } else {
        message.channel.createMessage(":x: invalid time format!!!");
    }
}

module.exports = timeout;
