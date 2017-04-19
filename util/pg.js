class Pg {
    constructor(postgres) {
        this.postgres = postgres;
    }

    updateCurrent(guildID, imageID) {
        if (!guildID) return new Error("no gulid ID");
        return this.postgres.query({
            "text": "UPDATE guilds SET current = $1, lasttime = $2 WHERE id = $3;",
            "values": [imageID, Date.now(), guildID]
        });
    }

    updateTimeout(guildID, timeout) {
        if (!guildID) return new Error("no gulid ID");
        return this.postgres.query({
            "text": "UPDATE guilds SET timeout = $1 WHERE id = $2;",
            "values": [timeout, guildID]
        });
    }

    flipMeme(guildID) {
        if (!guildID) return new Error("no gulid ID");
        return new Promise((resolve, reject) => {
            this.postgres.query({
                "text": "SELECT (meme) FROM guilds WHERE id = $1;",
                "values": [guildID]
            }).catch((err) => reject(err)).then((res) => {
                let meme = res.rows[0].meme;
                meme = !meme;

                this.postgres.query({
                    "text": "UPDATE guilds SET meme = $1 WHERE id = $2;",
                    "values": [meme, guildID]
                }).catch((err) => reject(err)).then((res) => {
                    resolve({ "meme": meme, "res": res });
                });
            });
        });
    }

    updateActivity(guildID, roleID) {
        if (!guildID) return new Error("no gulid ID");
        return this.postgres.query({
            "text": "UPDATE guilds SET activityrole = $1 WHERE id = $2;",
            "values": [roleID || 0, guildID]
        });
    }

    makeDont(guildID) {
        if (!guildID) return new Error("no gulid ID");
        return this.postgres.query({
            "text": "UPDATE guilds SET dont = 't' WHERE id = $1;",
            "values": [guildID]
        });
    }

    makeDo(guildID) {
        if (!guildID) return new Error("no gulid ID");
        return this.postgres.query({
            "text": "UPDATE guilds SET dont = 'f' WHERE id = $1;",
            "values": [guildID]
        });
    }

    updateStarboardChannel(guildID, channelID) {
        if (!guildID) return new Error("no gulid ID");
        return this.postgres.query({
            "text": "UPDATE guilds SET starboard = $1 WHERE id = $2;",
            "values": [channelID || 0, guildID]
        });
    }

    updateStarboardEmoji(guildID, emoji) {
        if (!guildID) return new Error("no gulid ID");
        return this.postgres.query({
            "text": "UPDATE guilds SET emoji = $1 WHERE id = $2;",
            "values": [emoji || "⭐", guildID]
        });
    }
}

module.exports = Pg;
