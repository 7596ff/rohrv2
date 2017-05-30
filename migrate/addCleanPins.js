module.exports = (pg) => {
    return pg.query("alter table guilds add column cleanpins boolean; alter table guilds alter column cleanpins set default false; update guilds set cleanpins = false;");
}