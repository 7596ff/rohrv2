async function cleanpins(message, client) {
    if (!message.member.permission.has("manageGuild")) {
        message.channel.createMessage(":octagonal_sign: sorry no memes!");
        return;
    }

    try {
        let res = await client.pg.flipPins(message.channel.guild.id);
        let msg = res.cleanpins ? "being cleaned" : "not being cleaned";
        delete client.gcfg[message.channel.guild.id];
        message.channel.createMessage(`:white_check_mark: pins are ${msg}.`);
    } catch (err) {
        console.error(err);
        message.channel.createMessage(`:x: something went wrong toggling pins, try again maybe`);
    }
}

module.exports = cleanpins;
