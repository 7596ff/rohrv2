async function roles(message) {
    let msg = "```prolog\n" + message.channel.guild.roles.map((role) => [role.id, role.name].join(" - ")).join("\n") + "\n```";
    if (msg.length > 1950) {
        message.channel.createMessage(msg.slice(0, 1950));
        message.channel.createMessage("too many roles!! what the heck!!!");
    } else {
        message.channel.createMessage(msg);
    }
}

module.exports = roles;
