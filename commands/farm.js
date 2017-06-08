function farm(message) {
    let num = message.content.split(" ")[1];
    let discrim = (!isNaN(num) && num) || (message.mentions.length && message.mentions[0].discriminator) || message.author.discriminator;
    if (!discrim) return message.channel.createMessage("uh no discrim what???");

    let map = message._client.users.filter((user) => user.discriminator == discrim).map((user) => `${user.username}#${user.discriminator}`).join(", ");
    return message.channel.createMessage("```js\n" + map + "\n```");
}

module.exports = farm;
