const util = require("util");

const clean = (text) => {
    if (typeof(text) === "string") {
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    } else {
        return text;
    }
};

module.exports = (message) => {
    let params = message.content.split(" ").splice(1);

    if (message.member.id == "102645408223731712") {
        try {
            var code = params.join(" ");
            var evaled = eval(code);

            if (typeof evaled !== "string") evaled = util.inspect(evaled);

            message.channel.createMessage(`${"```js\n"}${clean(evaled)}${"\n```"}`).then(() => {
                util.log(evaled);
            }).catch(err => console.log(err));
        } catch (err) {
            message.channel.createMessage(`${"`ERROR`\n```js\n"}${clean(err)}${"\n```"}`).then(() => {
                util.log(err);
            }).catch(err => console.log(err));
        }
    }
};
