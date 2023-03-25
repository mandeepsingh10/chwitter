"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pkce = exports.nonce = exports.PKCE_CODE_CHALLENGE_METHOD = void 0;
exports.signCookie = signCookie;
exports.state = void 0;

var _openidClient = require("openid-client");

var jwt = _interopRequireWildcard(require("../../../jwt"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

async function signCookie(type, value, maxAge, options) {
  const {
    cookies,
    logger
  } = options;
  logger.debug(`CREATE_${type.toUpperCase()}`, {
    value,
    maxAge
  });
  const expires = new Date();
  expires.setTime(expires.getTime() + maxAge * 1000);
  return {
    name: cookies[type].name,
    value: await jwt.encode({ ...options.jwt,
      maxAge,
      token: {
        value
      }
    }),
    options: { ...cookies[type].options,
      expires
    }
  };
}

const PKCE_MAX_AGE = 60 * 15;
const PKCE_CODE_CHALLENGE_METHOD = "S256";
exports.PKCE_CODE_CHALLENGE_METHOD = PKCE_CODE_CHALLENGE_METHOD;
const pkce = {
  async create(options, cookies, resParams) {
    var _options$provider, _options$provider$che, _options$cookies$pkce;

    if (!((_options$provider = options.provider) !== null && _options$provider !== void 0 && (_options$provider$che = _options$provider.checks) !== null && _options$provider$che !== void 0 && _options$provider$che.includes("pkce"))) return;

    const code_verifier = _openidClient.generators.codeVerifier();

    const value = _openidClient.generators.codeChallenge(code_verifier);

    resParams.code_challenge = value;
    resParams.code_challenge_method = PKCE_CODE_CHALLENGE_METHOD;
    const maxAge = (_options$cookies$pkce = options.cookies.pkceCodeVerifier.options.maxAge) !== null && _options$cookies$pkce !== void 0 ? _options$cookies$pkce : PKCE_MAX_AGE;
    cookies.push(await signCookie("pkceCodeVerifier", code_verifier, maxAge, options));
  },

  async use(cookies, resCookies, options, checks) {
    var _options$provider2, _options$provider2$ch;

    if (!((_options$provider2 = options.provider) !== null && _options$provider2 !== void 0 && (_options$provider2$ch = _options$provider2.checks) !== null && _options$provider2$ch !== void 0 && _options$provider2$ch.includes("pkce"))) return;
    const codeVerifier = cookies === null || cookies === void 0 ? void 0 : cookies[options.cookies.pkceCodeVerifier.name];
    if (!codeVerifier) throw new TypeError("PKCE code_verifier cookie was missing.");
    const value = await jwt.decode({ ...options.jwt,
      token: codeVerifier
    });
    if (!(value !== null && value !== void 0 && value.value)) throw new TypeError("PKCE code_verifier value could not be parsed.");
    resCookies.push({
      name: options.cookies.pkceCodeVerifier.name,
      value: "",
      options: { ...options.cookies.pkceCodeVerifier.options,
        maxAge: 0
      }
    });
    checks.code_verifier = value.value;
  }

};
exports.pkce = pkce;
const STATE_MAX_AGE = 60 * 15;
const state = {
  async create(options, cookies, resParams) {
    var _options$provider$che2, _options$cookies$stat;

    if (!((_options$provider$che2 = options.provider.checks) !== null && _options$provider$che2 !== void 0 && _options$provider$che2.includes("state"))) return;

    const value = _openidClient.generators.state();

    resParams.state = value;
    const maxAge = (_options$cookies$stat = options.cookies.state.options.maxAge) !== null && _options$cookies$stat !== void 0 ? _options$cookies$stat : STATE_MAX_AGE;
    cookies.push(await signCookie("state", value, maxAge, options));
  },

  async use(cookies, resCookies, options, checks) {
    var _options$provider$che3;

    if (!((_options$provider$che3 = options.provider.checks) !== null && _options$provider$che3 !== void 0 && _options$provider$che3.includes("state"))) return;
    const state = cookies === null || cookies === void 0 ? void 0 : cookies[options.cookies.state.name];
    if (!state) throw new TypeError("State cookie was missing.");
    const value = await jwt.decode({ ...options.jwt,
      token: state
    });
    if (!(value !== null && value !== void 0 && value.value)) throw new TypeError("State value could not be parsed.");
    resCookies.push({
      name: options.cookies.state.name,
      value: "",
      options: { ...options.cookies.state.options,
        maxAge: 0
      }
    });
    checks.state = value.value;
  }

};
exports.state = state;
const NONCE_MAX_AGE = 60 * 15;
const nonce = {
  async create(options, cookies, resParams) {
    var _options$provider$che4, _options$cookies$nonc;

    if (!((_options$provider$che4 = options.provider.checks) !== null && _options$provider$che4 !== void 0 && _options$provider$che4.includes("nonce"))) return;

    const value = _openidClient.generators.nonce();

    resParams.nonce = value;
    const maxAge = (_options$cookies$nonc = options.cookies.nonce.options.maxAge) !== null && _options$cookies$nonc !== void 0 ? _options$cookies$nonc : NONCE_MAX_AGE;
    cookies.push(await signCookie("nonce", value, maxAge, options));
  },

  async use(cookies, resCookies, options, checks) {
    var _options$provider3, _options$provider3$ch;

    if (!((_options$provider3 = options.provider) !== null && _options$provider3 !== void 0 && (_options$provider3$ch = _options$provider3.checks) !== null && _options$provider3$ch !== void 0 && _options$provider3$ch.includes("nonce"))) return;
    const nonce = cookies === null || cookies === void 0 ? void 0 : cookies[options.cookies.nonce.name];
    if (!nonce) throw new TypeError("Nonce cookie was missing.");
    const value = await jwt.decode({ ...options.jwt,
      token: nonce
    });
    if (!(value !== null && value !== void 0 && value.value)) throw new TypeError("Nonce value could not be parsed.");
    resCookies.push({
      name: options.cookies.nonce.name,
      value: "",
      options: { ...options.cookies.nonce.options,
        maxAge: 0
      }
    });
    checks.nonce = value.value;
  }

};
exports.nonce = nonce;