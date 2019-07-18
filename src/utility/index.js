export const isPromise = value => typeof value === 'object' && typeof value.then === 'function';

export const onAccessibleKeyDown = (e, callback) => {
    if (e.keyCode === 13) {
        callback();
    }
};
