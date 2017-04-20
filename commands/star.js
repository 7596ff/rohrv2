const starboardEmbed = require("../util/starboardEmbed");

const trophies = [":first_place:", ":second_place:", ":third_place:"];

async function getFrequency(field, array) {
    let res = {};
    array.forEach((element) => {
        if (field) {
            res[element[field]] ? res[element[field]] += element.stars : res[element[field]] = element.stars;
        } else {
            res[element] ? res[element] += 1 : res[element] = 1;
        }
    });

    let resArray = [];
    for (key in res) {
        resArray.push({
            "key": key,
            "count": res[key]
        });
    }

    resArray = resArray.sort((a, b) => b.count - a.count);
    return resArray;
}

const subcommands = {
    "stats": async function(message, client, args) {
        try {
            await message.channel.sendTyping();

            let rows = await client.pg.getStarStats(message.channel.guild.id);

            if (rows.length < 1) {
                await message.channel.createMessage("there aren't enough stars in this server to give any stats!");
                return;
            }

            let memberFreq = await getFrequency("member", rows);

            let ppl = [];
            rows.forEach((row) => ppl.push(...row.who));
            let starrerFreq = await getFrequency(null, ppl);

            let embed = {
                "author": {
                    "icon_url": message.channel.guild.iconURL,
                    "name": `Star stats in ${message.channel.guild.name}`
                },
                "description": `Total Stars: **${rows.length}**`,
                "fields": [{
                    "name": "Top Stars",
                    "value": rows
                        .slice(0, 3)
                        .map((row, index) => `${trophies[index]} **${row.stars}** :star: \`${row.msg}\` by <@${row.member}>`)
                        .join("\n"),
                    "inline": false
                }, {
                    "name": "Top Starred Members",
                    "value": memberFreq
                        .slice(0, 3)
                        .map((row, index) => `${trophies[index]} <@${row.key}> with **${row.count}** stars`)
                        .join("\n"),
                    "inline": true
                }, {
                    "name": "Top Starrers",
                    "value": starrerFreq
                        .slice(0, 3)
                        .map((row, index) => `${trophies[index]} <@${row.key}> with **${row.count}** stars`)
                        .join("\n"),
                    "inline": true
                }],
                "footer": {
                    "text": "use katze star show [ID] to see a specific star."
                }
            }

            await message.channel.createMessage({ "embed": embed });
        } catch (err) {
            console.error(err);
            console.error("couldn't get star stats within star command");
            message.channel.createMessage("something went wrong. try again maybe?");
        }
    },
    "show": async function(message, client, args) {
        try {
            await message.channel.sendTyping();

            let star = await client.pg.getStarStatus(args[0]);
            if (star == "dne") {
                await message.channel.createMessage("this star doesn't exist.");
                return;
            }

            let msg = await client.getMessage(star.channel, star.msg);

            await message.channel.createMessage(starboardEmbed(msg, star.stars));
        } catch (err) {
            console.error(err);
            console.error("couldn't fetch star from within star show");
            message.channel.createMessage("something went wrong, try again maybe?");
        }
    },
    "who": async function(message, client, args) {
        try {
            if (!args[0]) {
                await message.channel.createMessage("please supply a message id!!");
                return;
            }

            await message.channel.sendTyping();

            let who = await client.pg.checkStarWho(args[0]);
            let actuallyWho = who
                .map((id) => client.users.get(id))
                .map((user) => user)
                .map((user) => `${user.username}#${user.discriminator}`)
                .join(", ");

            await message.channel.createMessage(actuallyWho)
        } catch (err) {
            console.error(err);
            console.error("err sending who within starboard who");
            message.channel.createMessage("something went wrong. try again maybe?");
        }
    }
}

async function star(message, client) {
    const subc = message.content.split(" ")[1];
    if (subcommands.hasOwnProperty(subc)) {
        subcommands[subc](message, client, message.content.split(" ").slice(2));
    } else {
        message.channel.createMessage(`Available subcommands: ${Object.keys(subcommands).map(cmd => `\`${cmd}\``).join(", ")}`);
    }
}

module.exports = star;
