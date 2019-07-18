import axios from 'axios';
import qs from 'qs';

import config from 'ch/config';
import { getAuthedHeaders, removeTokenAndReload, setTokenFromHeader } from './auth';

const cancels = {};

const handlers = {
    e403: response => Promise.reject(response),
    e503: response => Promise.reject(response),
};

const defaultOptions = {
    cancellable: false,
    headers: {},
};

axios.interceptors.response.use((response) => {
    setTokenFromHeader(response.headers);
    return response.data;
}, (error) => {
    if (axios.isCancel(error)) {
        return Promise.resolve(-1);
    }

    if (error.response.status === 401) {
        return removeTokenAndReload();
    }

    setTokenFromHeader(error.response.headers);

    const handler = handlers[`e${error.response.status}`];

    return handler ? handler(error.response) : Promise.reject(error.response);
});

const transformRequestToRaw = (requestObj, method) => {
    const fd = new FormData();
    const newRequestObj = { ...requestObj };

    Object.entries(requestObj.data).forEach((item) => {
        fd.append(item[0], item[1]);
    });

    if (method === 'patchraw') {
        fd.append('_method', 'patch');
    }

    newRequestObj.method = 'post';
    newRequestObj.data = fd;
    newRequestObj.headers['Content-Type'] = undefined;

    newRequestObj.transformRequest = $$$ => $$$;

    return newRequestObj;
};

export const makeUrl = (alias, params = {}) => `${config.paths.api}/${alias}${Object.keys(params).length
    ? `?${qs.stringify(params)}`
    : ''}`;

const createRequestConfig = (rawMethod, alias, params = {}, rawData = {}, rawOptions = {}) => {
    let method = rawMethod || 'post';

    const lowerMethod = method.toLowerCase();
    const data = { ...rawData };

    if (lowerMethod === 'delete' || lowerMethod === 'patch') {
        method = 'post';
        data._method = lowerMethod; // eslint-disable-line no-underscore-dangle
    }

    const options = {
        ...defaultOptions,
        ...rawOptions,
    };

    if (cancels[alias]) {
        cancels[alias].cancel();
    }

    const authedHeaders = getAuthedHeaders(options.headers);

    let requestConfig = {
        headers: authedHeaders,
        method,
        url: makeUrl(alias, params),
    };

    if (data) {
        requestConfig.data = data;
    }

    if (options.cancellable) {
        const { CancelToken } = axios;

        cancels[alias] = CancelToken.source();
        requestConfig.cancelToken = cancels[alias].token;
    }

    if (lowerMethod === 'postraw' || lowerMethod === 'patchraw') {
        requestConfig = transformRequestToRaw(requestConfig, lowerMethod);
    }

    return requestConfig;
};

const request = (method, alias, params, data, options) => {
    const requestConfig = createRequestConfig(method, alias, params, data, options);
    return axios.request(requestConfig);
};

export const get = (alias, params, options) => request('get', alias, params, false, options);

export const post = (alias, params, data, options) => request('post', alias, params, data, options);
export const postRaw = (alias, params, data, options) => request('postraw', alias, params, data, options);

export const patch = (alias, params, data, options) => request('patch', alias, params, data, options);
export const patchRaw = (alias, params, data, options) => request('patchraw', alias, params, data, options);
