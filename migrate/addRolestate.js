module.exports = (pg) => {
    return pg.query("alter table guilds add column rolestate boolean; alter table guilds alter column rolestate set default false; update guilds set rolestate = false;");
}