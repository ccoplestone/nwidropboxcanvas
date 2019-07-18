export const isIEOrEdge = document.documentMode || /Edge/.test(navigator.userAgent) ? 1 : 0;

export default isIEOrEdge;
