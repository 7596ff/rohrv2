const util = require("util");
const fs = require("fs");
const upone = require("../util/upone");
const schedule = require("node-schedule");

module.exports = (client, gid) => {
    if (client.tasks[gid]) client.tasks[gid].cancel();

    let __upone = `${upone(__dirname)}/guilds/${gid}`;
    if (!client.guilds.get(gid)) {
        util.log(`guild ${gid} is dead rip`);
        return;
    }

    let gname = client.guilds.get(gid).name;

    fs.readdir(__upone, (err, files) => {
        if (!files) {
            util.log(`${gid}/${gname}: no images`);
            return;
        }

        if (files.length > 0) {
            client.pg.getGcfg(gid).catch((err) => console.error(err)).then((gcfg) => {
                let rule = `0 */${gcfg.timeout} * * *`;

                client.tasks[gid] = schedule.scheduleJob(rule, () => {
                    require("./actual_rotate")(client.guilds.get(gid), null, client, files, gcfg, __upone);
                });

                util.log(`scheduled rotate for guild ${gid}/${gname}`);
                util.log(`  images ${files.length}, timeout ${gcfg.timeout} (${rule})`);
            });
        }
    });
};
