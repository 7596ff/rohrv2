const FuzzySet = require("fuzzyset.js");

function checkMatch(names, name) {
    names = new FuzzySet(names);
    let match = names.get(name);
    match = match ? (match[0] || false) : false;
    if (!match) return false;
    return match[0] > 0.8 && match[1];
}

const subcommands = {
    create: async function(message, client, name, roles) {
        try {
            let role = await message.channel.guild.createRole({
                name: name,
                permissions: 0,
                mentionable: false
            }, "Automated roleme role creation");

            await client.pg.createRolemeRole(role.id, message.channel.guild.id);

            return message.channel.createMessage(`created roleme role \`${role.name}\`. use \`katze roleme ${role.name}\` to give this to yourself.`);
        } catch (err) {
            let response = err.response && JSON.parse(err.response);
            if (response.code == 50013) {
                return message.channel.createMessage("i can't manage roles on this server!!");
            } else {
                console.error(err);
                console.error(`guild: ${message.channel.guild.id}/${message.channel.guild.name}, channel: ${message.channel.id}/${message.channel.name}`);
                return message.channel.createMessage("oops, something went wrong lol! pls report this error");
            }
        }
    },
    enable: async function (message, client, name, roles) {
        try {
            let match = checkMatch(message.channel.guild.roles.map((role) => role.name), name);
            if (!match) {
                return message.channel.createMessage("i can't find that role in the list of roleme roles for this server!");
            }

            let role = message.channel.guild.roles.find((role) => role.name == match);
            await client.pg.createRolemeRole(role.id, message.channel.guild.id);
            return message.addReaction("greenTick:357246808767987712");
        } catch (err) {
            if (err.code === "23505") {
                return message.channel.createMessage("this role is already a roleme role!");
            } else {
                console.error(err);
                console.error(`guild: ${message.channel.guild.id}/${message.channel.guild.name}, channel: ${message.channel.id}/${message.channel.name}`);
                return message.channel.createMessage("oops, something went wrong lol! pls report this error");
            }
        }
    },
    disable: async function(message, client, name, roles) {
        try {
            let names = roles.map((role) => role.name);
            let match = checkMatch(names, name);
            if (!match) {
                return message.channel.createMessage("i can't find that role in the list of roleme roles for this server!");
            }

            await client.pg.deleteRolemeRole(message.channel.guild.roles.find((role) => role.name == match).id);
            return message.addReaction("greenTick:357246808767987712");
        } catch (err) {
            console.error(err);
            console.error(`guild: ${message.channel.guild.id}/${message.channel.guild.name}, channel: ${message.channel.id}/${message.channel.name}`);
            return message.channel.createMessage("oops, something went wrong lol! pls report this error");
        }
    },
    remove: async function(message, client, name, roles) {
        try {
            let names = roles.map((role) => role.name);
            let match = checkMatch(names, name);
            if (!match) {
                return message.channel.createMessage("i can't find that role in the list of roleme roles for this server!");
            }

            await message.channel.guild.removeMemberRole(message.member.id, roles.find((role) => role.name == match).id, "Automated roleme removal");
            return message.addReaction("greenTick:357246808767987712");
        } catch (err) {
            console.error(err);
            console.error(`guild: ${message.channel.guild.id}/${message.channel.guild.name}, channel: ${message.channel.id}/${message.channel.name}`);
            return message.channel.createMessage("oops, something went wrong lol! pls report this error");
        }
    }
}

async function roleme(message, client) {
    let roles;
    try {
        roles = await client.pg.getGuildRolemeRoles(message.channel.guild.id);
        roles = roles.map((role) => {
            return { id: role, role: message.channel.guild.roles.get(role) };
        });

        let expired = roles.filter((role) => !role.role);
        if (expired.length) await Promise.all(expired.map((role) => client.pg.deleteRolemeRole(role.id)));

        roles = roles.filter((role) => role.role).map((role) => role.role);
    } catch (err) {
        console.error(err);
        console.error(`guild: ${message.channel.guild.id}/${message.channel.guild.name}, channel: ${message.channel.id}/${message.channel.name}`);
        return message.channel.createMessage("oops, something went wrong lol! pls report this error");
    }

    let names = roles.map((role) => role.name);

    const subc = message.content.split(" ")[1];
    if (subcommands.hasOwnProperty(subc)) {
        if (!message.member.permission.has("manageRoles") && subc !== "remove") {
            return message.channel.createMessage(":x: i dont take orders from u sir!!!");
        }

        return subcommands[subc](message, client, message.content.split(" ").slice(2).join(" "), roles);
    } else if (message.content !== "roleme") {
        let name = message.content.split(" ").slice(1).join(" ");
        let match = checkMatch(names, name);
        if (!match) {
            return message.channel.createMessage("i can't find that role in the list of roleme roles for this server!");
        }

        try {
            await message.channel.guild.addMemberRole(message.member.id, roles.find((role) => role.name == match).id, "Automated roleme grant");
            return message.addReaction("greenTick:357246808767987712");
        } catch (err) {
            console.error(err);
            console.error(`guild: ${message.channel.guild.id}/${message.channel.guild.name}, channel: ${message.channel.id}/${message.channel.name}`);
            return message.channel.createMessage("oops, something went wrong lol! pls report this error");
        }
    } else {
        if (roles.length) {
            let msg = ["list of roles u can give urself on this server:", ""];
            msg.push(...roles.map((role) => `- \`${role.name}\``));
            return message.channel.createMessage(msg.join("\n"));
        } else {
            return message.channel.createMessage("there aren't any roleme roles on this server yet!");
        }
    }
}

module.exports = roleme;
