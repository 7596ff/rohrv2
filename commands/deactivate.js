async function clearGuild(client, row) {
    let guild = client.guilds.get(row.id);
    if (!guild) return 0;

    let members = guild.members.filter((member) => member.roles.includes(row.activityrole));
    if (!members.length) return 0;

    try {
        console.log(`${guild.id}/${guild.name}: ${members.length}`);
        let promises = members.map((member) => member.removeRole(row.activityrole));
        let results = await Promise.all(promises);
        console.log(`${guild.id}/${guild.name} done`);

        return results.length;
    } catch (err) {
        console.error(err);
        return 0;
    }
}

async function deactivate(message, client) {
    if (message.author.id != client.config.ownerID) return;

    try {
        let rows = await client.pg.getActivityRoles();

        let promises = rows.map((row) => clearGuild(client, row));
        let results = await Promise.all(promises);

        let keys = await client.redis.keysAsync("katze:activity:*");
        let count = await client.redis.delAsync(...keys);

        return message.channel.createMessage(`deleted ${count} keys, cleared ${results.reduce((a, b) => a + b)} roles from ${results.length} guilds`);
    } catch (err) {
        console.error(err);
        return message.channel.createMessage(":(");
    }
}

module.exports = deactivate;
