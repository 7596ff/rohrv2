module.exports = (pg) => {
    return pg.query("ALTER TABLE starboard ADD COLUMN who jsonb;");
};
