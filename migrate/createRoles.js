module.exports = (pg) => {
    return pg.query("CREATE TABLE roleme (id bigint, guild bigint, PRIMARY KEY (id));");
};
