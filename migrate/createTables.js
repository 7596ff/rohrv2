module.exports = (pg) => {
    let q = [
        "CREATE TABLE guilds (",
        "id bigint,",
        "current bigint,",
        "lasttime bigint,",
        "timeout int,",
        "meme boolean,",
        "activityrole bigint,",
        "dont boolean,",
        "starboard bigint,",
        "PRIMARY KEY (id)",
        ");",
        "",
        "CREATE TABLE starboard (",
        "date bigint,",
        "guild bigint,",
        "member bigint,",
        "channel bigint,",
        "msg bigint,",
        "post bigint,",
        "membername text,",
        "channelname text,",
        "stars int,",
        "PRIMARY KEY (msg)",
        ");"
    ].join(" ");

    return pg.query(q);
};
