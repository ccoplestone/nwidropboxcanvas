import store from './store';

export const getToken = () => store.getItem('jwt').replace(/\n/, '');
export const setToken = token => store.setItem('jwt', token);

// const removeToken = () => store.removeItem('jwt');

/*
export const removeTokenAndReload = () => {
    removeToken();
    window.location.reload();
};
*/

export const setTokenFromHeader = (headers) => {
    const header = headers.authorization || headers.Authorization;

    if (header) {
        const token = header.replace(/^Bearer /, '');
        return setToken(token);
    }

    return null;
};

const getHeader = () => ({
    Authorization: `Bearer ${getToken()}`,
});

export const getAuthedHeaders = (headers = {}) => ({
    ...headers,
    ...getHeader(),
});

/*
export const logout = () => {
    removeToken();
    // window.location = `${config.paths.auth}/logout`;
};
*/
