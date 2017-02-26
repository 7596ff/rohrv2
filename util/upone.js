module.exports = (path) => {
    let upone = path.split("/");
    return upone.splice(0, upone.length - 1).join("/");
};
