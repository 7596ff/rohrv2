const fs = require("fs");

module.exports = (message) => {
    if (!message.member.permission.has("manageRoles")) {
        message.channel.createMessage(":octagonal_sign: u cant change the activity role sorry!");
        return;
    }

    if (!message.channel.guild.members.get(message._client.user.id).permission.has("manageRoles")) {
        message.channel.createMessage(":octagonal_sign: i don't have manage roles!! pls do `katze invite` ty!!");
        return;
    }

    let role = message.content.split(" ").slice(1).join(" ");
    role = message.channel.guild.roles.find((_role) => _role.name == role);

    if (role) {
        message._client.gcfg[message.channel.guild.id].activityRole = role.id;
        fs.writeFile("./gcfg.json", JSON.stringify(message._client.gcfg), (err) => {
            if (err) console.error(err);
            message.channel.createMessage(`:white_check_mark: set new activity role to ${role.name}.`);
        });
    } else {
        message._client.gcfg[message.channel.guild.id].activityRole = false;
        fs.writeFile("./gcfg.json", JSON.stringify(message._client.gcfg), (err) => {
            if (err) console.error(err);
            message.channel.createMessage(":x: can't find this role!!! activity role removed.");
        });
    }
};
