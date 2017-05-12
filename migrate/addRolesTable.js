module.exports = (pg) => {
    return pg.query([
            "create table roles (",
            "role bigint not null,",
            "invitecode text not null,",
            "guild bigint not null,",
            "primary key (role)",
            ");"
        ].join(" "));
}