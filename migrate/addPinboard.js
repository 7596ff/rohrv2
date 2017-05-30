module.exports = (pg) => {
    return pg.query("alter table guilds add column pinboardin bigint; alter table guilds add column pinboardout bigint;");
}