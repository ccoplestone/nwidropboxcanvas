const apiPath = process.env.API_URL;

const appConfig = {
    env: process.env.NODE_ENV,
    ga: '',
    paths: {
        api: apiPath,
    },
};

export default appConfig;
