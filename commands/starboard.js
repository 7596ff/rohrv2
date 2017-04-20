const subcommands = {
    "channel": async function(message, client, args) {
        try {
            let res = await client.pg.updateStarboardChannel(message.channel.guild.id, message.channelMentions[0]);
            if (res.starboard > 0) {
                await message.channel.createMessage(`:white_check_mark: starboard created in <#${res.starboard}>`);
                client.gcfg[message.channel.guild.id].expired = true;
            } else {
                await message.channel.createMessage(`:white_check_mark: starboard removed`);
                client.gcfg[message.channel.guild.id].expired = true;
            }
        } catch (err) {
            console.error(err);
            console.error(`error updating starboard in guild ${message.channel.guild.id}/${message.channel.guild.name}`);
            message.channel.createMessage(":x: something went wrong setting the starboard, try again maybe");
        }
    },
    "emoji": async function(message, client, args) {
        try {
            if (!args[0]) {
                return message.channel.createMessage("pls supply an emoji!");
            }

            let emoji = args[0].match(/<:.+:\d+>/) ? args[0].slice(2).slice(0, -1) : args[0];
            let res = await client.pg.updateStarboardEmoji(message.channel.guild.id, emoji);
            await message.channel.createMessage(`:white_check_mark: starboard emoji set to \`${res.emoji}\``);
            client.gcfg[message.channel.guild.id].expired = true;
        } catch (err) {
            console.error(err);
            console.error(`error updating starboard in guild ${message.channel.guild.id}/${message.channel.guild.name}`);
            message.channel.createMessage(":x: something went wrong setting the starboard, try again maybe");
        }
    }
}

async function starboard(message, client) {
    if (!message.member.permission.has("manageMessages")) {
        return message.channel.createMessage(":x: i dont take orders from u sir!!!");
    }

    const subc = message.content.split(" ")[1];
    if (subcommands.hasOwnProperty(subc)) {
        subcommands[subc](message, client, message.content.split(" ").slice(2));
    } else {
        message.channel.createMessage(`Available subcommands: ${Object.keys(subcommands).map(cmd => `\`${cmd}\``).join(", ")}`);
    }
}

module.exports = starboard;
