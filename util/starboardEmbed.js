function starboardEmbed(message, stars) {
    let embed = {
        "author": {
            "icon_url": message.member.avatarURL,
            "name": message.member.nick || message.member.username
        },
        "description": message.content || "",
        "footer": {
            "text": `ID: ${message.id}`
        },
        "timestamp": new Date(message.timestamp)
    };

    if (message.member.roles.length > 0) {
        let colorRole = message.member.roles
            .map((role) => message.channel.guild.roles.get(role))
            .sort((a, b) => b.position - a.position)
            .find((role) => role.color != 0);
        embed.color = colorRole ? colorRole.color : 0;
    }

    let matches = message.content.match(/(https?:\/\/.*\.(?:png|jpg|gif|jpeg))/g);
    if (matches) embed.image = { "url": matches[0] };

    if (message.attachments.length > 0) {
        if (message.attachments[0].url.match(/(https?:\/\/.*\.(?:png|jpg|gif|jpeg))/g)) {
            embed.image = { "url": message.attachments[0].url };
        }

        embed.description += ` [Attachment](${message.attachments[0].url})`;
    }

    return {
        "content": `:star: **${stars}** <#${message.channel.id}>`,
        "embed": embed
    };
}

module.exports = starboardEmbed;
