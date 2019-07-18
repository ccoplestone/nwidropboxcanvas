const tryUseLocal = () => {
    try {
        localStorage.setItem('a', 'b');
    } catch (exception) {
        return false;
    }

    localStorage.removeItem('a');
    return true;
};

const useLocal = tryUseLocal();

const setCookie = (key, value) => {
    if (typeof document === 'undefined') {
        return;
    }
    document.cookie = `${key}=${value}; path=/`;
};

const getCookie = (key) => {
    if (typeof document === 'undefined') {
        return null;
    }

    const nameEQ = `${key}=`;
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i += 1) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }

    return null;
};

const removeCookie = (key) => {
    if (typeof document === 'undefined') {
        return;
    }
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

const getItem = (key) => {
    if (useLocal && window) {
        return window.localStorage.getItem(key);
    }
    return getCookie(key);
};

const setItem = (key, value) => {
    if (useLocal && window) {
        return window.localStorage.setItem(key, value);
    }
    return setCookie(key, value);
};

const removeItem = (key) => {
    if (useLocal && window) {
        return window.localStorage.removeItem(key);
    }
    return removeCookie(key);
};

export default {
    getItem,
    setItem,
    removeItem,
};
