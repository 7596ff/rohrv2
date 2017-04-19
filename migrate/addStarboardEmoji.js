module.exports = (pg) => {
    return pg.query("ALTER TABLE guilds ADD COLUMN emoji text; UPDATE guilds SET emoji = '⭐';");
};
