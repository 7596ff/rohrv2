const subcommands = {
    "in": async function(message, client, args) {
        try {
            let res = await client.pg.updatePinboardInChannel(message.channel.guild.id, message.channelMentions[0]);
            if (res.pinboardin > 0) {
                await message.channel.createMessage(`:white_check_mark: pinboard in channel set to <#${res.pinboardin}>`);
                client.gcfg[message.channel.guild.id].expired = true;
            } else {
                await message.channel.createMessage(`:white_check_mark: pinboard in channel removed`);
                client.gcfg[message.channel.guild.id].expired = true;
            }
        } catch (err) {
            console.error(err);
            console.error(`error updating pinboard in guild ${message.channel.guild.id}/${message.channel.guild.name}`);
            message.channel.createMessage(":x: something went wrong setting the pinboard in channel, try again maybe");
        }
    },
    "out": async function(message, client, args) {
        try {
            let res = await client.pg.updatePinboardOutChannel(message.channel.guild.id, message.channelMentions[0]);
            if (res.pinboardout > 0) {
                await message.channel.createMessage(`:white_check_mark: pinboard out channel set to <#${res.pinboardout}>`);
                client.gcfg[message.channel.guild.id].expired = true;
            } else {
                await message.channel.createMessage(`:white_check_mark: pinboard out channel removed`);
                client.gcfg[message.channel.guild.id].expired = true;
            }
        } catch (err) {
            console.error(err);
            console.error(`error updating pinboard in guild ${message.channel.guild.id}/${message.channel.guild.name}`);
            message.channel.createMessage(":x: something went wrong setting the pinboard out channel, try again maybe");
        }
    }
}

async function pinboard(message, client) {
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

module.exports = pinboard;
