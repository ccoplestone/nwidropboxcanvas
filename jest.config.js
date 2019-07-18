module.exports = {
    setupFiles: ['<rootDir>/setuptests.js', 'jest-localstorage-mock'],
    moduleNameMapper: {
        '^ch/(.*)$': '<rootDir>/src/$1',
        '\\.scss$': 'identity-obj-proxy',
    },
};
