import { getToken, setToken, setTokenFromHeader, getAuthedHeaders } from './auth';

jest.mock('./store');

const headers = [{
    authorization: 'Bearer lorem',
    ipsum: 'dolor',
}, {
    Authorization: 'Bearer Lorem',
    ipsum: 'dolor',
}, {
    ipsum: 'dolor',
}];

describe('Auth Service', () => {
    it('should getToken', () => {
        expect(getToken()).toBe('jwt');
    });
    it('should setToken', () => {
        expect(setToken('lorem')).toBe('jwt:lorem');
    });
    it('should setTokenFromHeader (lowercase authorization)', () => {
        expect(setTokenFromHeader(headers[0])).toBe('jwt:lorem');
    });
    it('should setTokenFromHeader (uppercase Authorization)', () => {
        expect(setTokenFromHeader(headers[1])).toBe('jwt:Lorem');
    });
    it('should setTokenFromHeader (no authorization header)', () => {
        expect(setTokenFromHeader(headers[2])).toBe(null);
    });
    it('should getAuthedHeaders (no default headers)', () => {
        expect(getAuthedHeaders()).toEqual({
            Authorization: 'Bearer jwt',
        });
    });
    it('should getAuthedHeaders (with default headers)', () => {
        expect(getAuthedHeaders(headers[2])).toEqual({
            ipsum: 'dolor',
            Authorization: 'Bearer jwt',
        });
    });
});
