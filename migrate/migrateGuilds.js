const gcfg = require("../gcfg.json");

module.exports = (pg) => {
    for (guildID in gcfg) {
        let guild = gcfg[guildID];

        pg.query({
            "text": "INSERT INTO guilds (id, current, lasttime, timeout, meme, activityrole, dont, starboard) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);",
            "values": [
                guildID,
                guild.current == "none" ? 0 : guild.current,
                guild.lasttime || 0,
                guild.timeout || 1,
                guild.meme || false,
                guild.activityRole || 0,
                guild.dont || false,
                0
            ]
        }).catch((err) => {
            console.error(err);
        });
    }
};
