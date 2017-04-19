async function dont(message, client) {
    if (!message.member.permission.has("manageGuild")) {
        message.channel.createMessage(":octagonal_sign: i dont take orders from u sir!!!");
        return;
    }

    let task = message._client.tasks[message.channel.guild.id];
    if (task) {
        try {
            await client.pg.makeDont(message.channel.guild.id);
            task.cancel();
            message.channel.createMessage(":white_check_mark: ok :(");
        } catch (err) {
            console.error(err);
            message.channel.createMessage(":x: something went wrong donting, try again maybe");
        }
    }
}

module.exports = dont;
