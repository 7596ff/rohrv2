const today = require("../util/today");

async function emojis(message, client) {
    try {
        let dates = "0123456"
            .split("")
            .map((n) => {
                let d = new Date();
                d.setDate(d.getDate() - n);

                return today(d);
            });

        let promises = dates.map((date) => client.redis.zrevrangebyscoreAsync(`emojis:${date}`, "Infinity", "-Infinity", "WITHSCORES"));
        let results = await Promise.all(promises);

        let guildEmoji = {};

        for (let emoji of message.channel.guild.emojis) {
            guildEmoji[emoji.id] = {
                count: 0,
                format: `<:${emoji.name}:${emoji.id}>`
            }
        }

        for (let day of results) {
            for (let i = 0; i < day.length; i += 2) {
                if (!guildEmoji[day[i]]) continue;
                guildEmoji[day[i]].count += Number(day[i + 1]);
            }
        }

        guildEmoji = Object.values(guildEmoji).sort((a, b) => b.count - a.count);

        if (message.content.split(" ")[1] == "all") {
            let map = guildEmoji.map((item) => `\`${item.count}\` ${item.format}`);

            let resp = ["top emoji in guild in last week:", ""];

            while (map.length) {
                resp.push(map.splice(0, 10).join(", "));
            }

            message.channel.createMessage(resp.join("\n"));
        } else {
            let resp = ["top 10 emoji in guild in last week:", ""]
            resp.push(...guildEmoji.slice(0, 10).map((item, index) => `\`${index + 1}.\` ${item.format} with \`${item.count}\` uses`));

            message.channel.createMessage(resp.join("\n"));
        }
    } catch (err) {
        console.error(err);
        message.channel.createMessage("an error occoured sorry");
    }
}

module.exports = emojis;
