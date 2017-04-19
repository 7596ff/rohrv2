async function meme(message, client) {
    if (!message.member.permission.has("manageGuild")) {
        message.channel.createMessage(":octagonal_sign: sorry no memes!");
        return;
    }

    try {
        let res = await client.pg.flipMeme(message.channel.guild.id);
        let msg = res.meme ? "on" : "off";
        delete client.gcfg[message.channel.guild.id];
        message.channel.createMessage(`:white_check_mark: memes are ${msg}.`);
    } catch (err) {
        console.error(err);
        message.channel.createMessage(`:x: something went wrong toggling meme, try again maybe`);
    }
}

module.exports = meme;
