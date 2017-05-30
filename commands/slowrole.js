function slowrole(message, client) {
    if (!message.member.permission.has("manageRoles")) {
        message.channel.createMessage(":octagonal_sign: u cant change the slow role sorry!");
        return;
    }

    if (!message.channel.guild.members.get(message._client.user.id).permission.has("manageRoles")) {
        message.channel.createMessage(":octagonal_sign: i don't have manage roles!! pls do `katze invite` ty!!");
        return;
    }

    let role = message.content.split(" ").slice(1).join(" ");
    role = message.channel.guild.roles.find((_role) => _role.name == role);

    if (role) {
        client.pg.updateActivity(message.channel.guild.id, role.id).catch((err) => {
            console.error(err);
            message.channel.createMessage(":x: something went wrong updating the slow role.");
        }).then(() => {
            delete client.gcfg[message.channel.guild.id];
            message.channel.createMessage(`:white_check_mark: set new slow role to ${role.name}.`);
        });
    } else {
        client.pg.updateActivity(message.channel.guild.id, null).catch((err) => {
            console.error(err);
            message.channel.createMessage(":x: something went wrong updating the slow role.");
        }).then(() => {
            delete client.gcfg[message.channel.guild.id];
            message.channel.createMessage(":white_check_mark: couldn't find this role!! slow role set to none.");
        });
    }
}

module.exports = slowrole;
