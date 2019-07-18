module.exports = {
    getItem: key => key,
    setItem: (key, value) => `${key}:${value}`,
    removeItem: () => null,
};
