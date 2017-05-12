async function link(message) {
    if (!message.member.permission.has("manageGuild")) {
        return message.channel.createMessage("you cant use this command sorry!");
    }

    let args = message.content.split(" ");

    if (!args[1] || !message.channel.guild.roles.get(args[1])) {
        return message.channel.createMessage("pleas provide a role id!");
    }

    try {
        let invite = await message.channel.createInvite({ maxAge: 0 });
        await message._client.pg.upsertRole(args[1], invite.code, message.channel.guild.id);
        message._client.watchedCodes.push(invite.code);
        message._client.invites.push(invite);

        return message.channel.createMessage(`http://discord.gg/${invite.code}`).catch((err) => console.error(err));
    } catch (err) {
        console.error(err);
        message.channel.createMessage("oh h eck!1!! (error has been logged)");
    }
}

module.exports = link;
