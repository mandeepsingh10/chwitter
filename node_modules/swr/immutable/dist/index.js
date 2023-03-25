Object.defineProperty(exports, '__esModule', { value: true });

var useSWR = require('swr');
var _internal = require('swr/_internal');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var useSWR__default = /*#__PURE__*/_interopDefaultLegacy(useSWR);

const immutable = (useSWRNext)=>(key, fetcher, config)=>{
        // Always override all revalidate options.
        config.revalidateOnFocus = false;
        config.revalidateIfStale = false;
        config.revalidateOnReconnect = false;
        return useSWRNext(key, fetcher, config);
    };
var index = _internal.withMiddleware(useSWR__default["default"], immutable);

exports["default"] = index;
exports.immutable = immutable;
