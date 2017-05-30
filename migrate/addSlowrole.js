module.exports = (pg) => {
    return pg.query("alter table guilds add column slowrole bigint;");
}