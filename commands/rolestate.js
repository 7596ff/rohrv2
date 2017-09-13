async function rolestate(message, client) {
    if (!message.member.permission.has("manageRoles")) {
        return message.channel.createMessage(":x: i dont take orders from u sir!!!");
    }

    try {
        let res = await client.pg.toggleRolestate(message.channel.guild.id);
        delete client.gcfg[message.channel.guild.id];
        return message.channel.createMessage(`rolestate is now ${res ? "on" : "off"}.`);
    } catch (err) {
        console.error(err);
        console.error(`guild: ${message.channel.guild.id}/${message.channel.guild.name}, channel: ${message.channel.id}/${message.channel.name}`);
        return message.channel.createMessage("oops, something went wrong lol! pls report this error");
    }
}

module.exports = rolestate;