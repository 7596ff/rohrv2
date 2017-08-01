module.exports = (now) => {
    if (!now) now = new Date();
    return `${now.getFullYear()}${("00" + now.getMonth()).slice(-2)}${("00" + now.getDate()).slice(-2)}`;
};
