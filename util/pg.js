class Pg {
    constructor(postgres) {
        this.postgres = postgres;
    }

    addGuild(guildID) {
        if (!guildID) return new Error("no guild ID");
        return this.postgres.query({
            "text": "INSERT INTO guilds VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);",
            "values": [guildID, 0, 0, 12, false, 0, false, 0, "⭐"]
        });
    }

    removeGuild(guildID) {
        if (!guildID) return new Error("no guild ID");
        return this.postgres.query({
            "text": "DELETE FROM guilds WHERE id = $1;",
            "values": [guildID]
        });
    }

    getGcfg(guildID) {

        return new Promise((resolve, reject) => {
            this.postgres.query({
                "text": "SELECT * FROM guilds WHERE id = $1;",
                "values": [guildID]
            }).catch((err) => reject(err)).then((res) => {
                resolve(res.rows[0]);
            });
        });
    }

    updateCurrent(guildID, imageID) {
        return this.postgres.query({
            "text": "UPDATE guilds SET current = $1, lasttime = $2 WHERE id = $3;",
            "values": [imageID, Date.now(), guildID]
        });
    }

    updateTimeout(guildID, timeout) {
        return this.postgres.query({
            "text": "UPDATE guilds SET timeout = $1 WHERE id = $2;",
            "values": [timeout, guildID]
        });
    }

    flipMeme(guildID) {
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
        return this.postgres.query({
            "text": "UPDATE guilds SET activityrole = $1 WHERE id = $2;",
            "values": [roleID || 0, guildID]
        });
    }

    makeDont(guildID) {
        return this.postgres.query({
            "text": "UPDATE guilds SET dont = 't' WHERE id = $1;",
            "values": [guildID]
        });
    }

    makeDo(guildID) {
        return this.postgres.query({
            "text": "UPDATE guilds SET dont = 'f' WHERE id = $1;",
            "values": [guildID]
        });
    }

    updateStarboardChannel(guildID, channelID) {
        return this.postgres.query({
            "text": "UPDATE guilds SET starboard = $1 WHERE id = $2;",
            "values": [channelID || 0, guildID]
        });
    }

    updateStarboardEmoji(guildID, emoji) {
        return this.postgres.query({
            "text": "UPDATE guilds SET emoji = $1 WHERE id = $2;",
            "values": [emoji || "⭐", guildID]
        });
    }

    getStarCfg(guildID) {
        return new Promise((resolve, reject) => {
            this.postgres.query({
                "text": "SELECT starboard, emoji FROM guilds WHERE id = $1;",
                "values": [guildID]
            }).catch((err) => reject(err)).then((res) => {
                resolve(res.rows[0]);
            });
        });
    }

    getStarStatus(messageID) {
        return new Promise((resolve, reject) => {
            this.postgres.query({
                "text": "SELECT * FROM starboard WHERE msg = $1;",
                "values": [messageID]
            }).catch((err) => reject(err)).then((res) => {
                if (res.rows.length == 1) {
                    resolve(res.rows[0])
                } else {
                    resolve("dne");
                }
            });
        });
    }

    createStar(guildID, memberID, channelID, msgID, memberName, channelName, firstID) {
        return new Promise((resolve, reject) => {
            this.postgres.query({
                "text": "INSERT INTO starboard VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);",
                "values": [
                    Date.now(),
                    guildID,
                    memberID,
                    channelID,
                    msgID,
                    0,
                    memberName,
                    channelName,
                    1,
                    { "who": [firstID] }
                ]
            }).catch((err) => reject(err)).then((res) => {
                res.rows[0].dne = true;
                resolve(res.rows[0]);
            });
        });
    }

    addPost(msgID, postID) {
        return this.postgres.query({
            "text": "UPDATE starboard SET post = $1 WHERE msg = $2"
        })
    }

    incrementStar(msgID, whoID) {
        return new Promise((resolve, reject) => {
            this.postgres.query({
                "text": "SELECT who FROM starboard WHERE msg = $1;",
                "values": [msgID]
            }).catch((err) => reject(err)).then((res) => {
                let who = res.rows[0].who.who;
                who.push(whoID);
                who = who.filter((item, index, array) => index === array.indexOf(item));

                this.postgres.query({
                    "text": "UPDATE starboard SET stars = (stars + 1), who = $1 WHERE msg = $2;",
                    "values": [{ "who": who }, msgID]
                }).catch((err) => reject(err)).then((res) => resolve(res.rows[0]));
            });
        });
    }

    decrementStar(msgID, whoID) {
        return new Promise((resolve, reject) => {
            this.postgres.query({
                "text": "SELECT who FROM starboard WHERE msg = $1;",
                "values": [msgID]
            }).catch((err) => reject(err)).then((res) => {
                let who = res.rows[0].who.who;
                who.splice(who.indexOf(whoID), 1);
                who = who.filter((item, index, array) => index === array.indexOf(item));

                if (who.length > 0) {
                    this.postgres.query({
                        "text": "UPDATE starboard SET stars = (stars - 1), who = $1 WHERE msg = $2;",
                        "values": [{ "who": who }, msgID]
                    }).catch((err) => reject(err)).then((res) => resolve(res.rows[0]));
                } else {
                    this.postgres.query({
                        "text": "DELETE FROM starboard WHERE msg = $1;",
                        "values": [msgID]
                    }).catch((err) => reject(err)).then((res) => resolve({
                        "dne": true,
                        "post": res.post
                    }));
                }
            });
        });
    }
}

module.exports = Pg;
