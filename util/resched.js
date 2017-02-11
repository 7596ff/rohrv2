const util = require("util");
const fs = require("fs");
const upone = require("../util/upone");
const schedule = require("node-schedule");

module.exports = (client, gid) => {
    if (client.tasks[gid]) client.tasks[gid].cancel();

    let __upone = `${upone(__dirname)}/guilds/${gid}`;

    fs.readdir(__upone, (err, files) => {
        if (files.length > 0) {
            let rule = `0 */${client.gcfg[gid].timeout} * * *`;

            client.tasks[gid] = schedule.scheduleJob(rule, () => {
                require("./actual_rotate")(client.guilds.get(gid), null, files, client.gcfg, __upone);
            });

            util.log(`scheduled rotate for gid ${gid}, images ${files.length}, timeout ${client.gcfg[gid].timeout} (${rule})`);
        }
    })
}