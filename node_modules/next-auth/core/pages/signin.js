"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SigninPage;

var _preact = require("preact");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

function SigninPage(props) {
  var _errors$errorType;

  const {
    csrfToken,
    providers,
    callbackUrl,
    theme,
    email,
    error: errorType
  } = props;
  const providersToRender = providers.filter(provider => {
    if (provider.type === "oauth" || provider.type === "email") {
      return true;
    } else if (provider.type === "credentials" && provider.credentials) {
      return true;
    }

    return false;
  });

  if (typeof document !== "undefined" && theme.buttonText) {
    document.documentElement.style.setProperty("--button-text-color", theme.buttonText);
  }

  if (typeof document !== "undefined" && theme.brandColor) {
    document.documentElement.style.setProperty("--brand-color", theme.brandColor);
  }

  const errors = {
    Signin: "Try signing in with a different account.",
    OAuthSignin: "Try signing in with a different account.",
    OAuthCallback: "Try signing in with a different account.",
    OAuthCreateAccount: "Try signing in with a different account.",
    EmailCreateAccount: "Try signing in with a different account.",
    Callback: "Try signing in with a different account.",
    OAuthAccountNotLinked: "To confirm your identity, sign in with the same account you used originally.",
    EmailSignin: "The e-mail could not be sent.",
    CredentialsSignin: "Sign in failed. Check the details you provided are correct.",
    SessionRequired: "Please sign in to access this page.",
    default: "Unable to sign in."
  };
  const error = errorType && ((_errors$errorType = errors[errorType]) !== null && _errors$errorType !== void 0 ? _errors$errorType : errors.default);
  const logos = "https://authjs.dev/img/providers";
  return (0, _preact.h)("div", {
    className: "signin"
  }, theme.brandColor && (0, _preact.h)("style", {
    dangerouslySetInnerHTML: {
      __html: `
        :root {
          --brand-color: ${theme.brandColor}
        }
      `
    }
  }), theme.buttonText && (0, _preact.h)("style", {
    dangerouslySetInnerHTML: {
      __html: `
        :root {
          --button-text-color: ${theme.buttonText}
        }
      `
    }
  }), (0, _preact.h)("div", {
    className: "card"
  }, theme.logo && (0, _preact.h)("img", {
    src: theme.logo,
    alt: "Logo",
    className: "logo"
  }), error && (0, _preact.h)("div", {
    className: "error"
  }, (0, _preact.h)("p", null, error)), providersToRender.map((provider, i) => {
    var _provider$style$bg, _provider$style, _provider$style$bgDar, _provider$style2, _provider$style$text, _provider$style3, _provider$style$textD, _provider$style4, _provider$style5, _provider$style6;

    return (0, _preact.h)("div", {
      key: provider.id,
      className: "provider"
    }, provider.type === "oauth" && (0, _preact.h)("form", {
      action: provider.signinUrl,
      method: "POST"
    }, (0, _preact.h)("input", {
      type: "hidden",
      name: "csrfToken",
      value: csrfToken
    }), callbackUrl && (0, _preact.h)("input", {
      type: "hidden",
      name: "callbackUrl",
      value: callbackUrl
    }), (0, _preact.h)("button", {
      type: "submit",
      className: "button",
      style: {
        "--provider-bg": (_provider$style$bg = (_provider$style = provider.style) === null || _provider$style === void 0 ? void 0 : _provider$style.bg) !== null && _provider$style$bg !== void 0 ? _provider$style$bg : "",
        "--provider-dark-bg": (_provider$style$bgDar = (_provider$style2 = provider.style) === null || _provider$style2 === void 0 ? void 0 : _provider$style2.bgDark) !== null && _provider$style$bgDar !== void 0 ? _provider$style$bgDar : "",
        "--provider-color": (_provider$style$text = (_provider$style3 = provider.style) === null || _provider$style3 === void 0 ? void 0 : _provider$style3.text) !== null && _provider$style$text !== void 0 ? _provider$style$text : "",
        "--provider-dark-color": (_provider$style$textD = (_provider$style4 = provider.style) === null || _provider$style4 === void 0 ? void 0 : _provider$style4.textDark) !== null && _provider$style$textD !== void 0 ? _provider$style$textD : ""
      }
    }, ((_provider$style5 = provider.style) === null || _provider$style5 === void 0 ? void 0 : _provider$style5.logo) && (0, _preact.h)("img", {
      loading: "lazy",
      height: 24,
      width: 24,
      id: "provider-logo",
      src: `${provider.style.logo.startsWith("/") ? logos : ""}${provider.style.logo}`
    }), ((_provider$style6 = provider.style) === null || _provider$style6 === void 0 ? void 0 : _provider$style6.logoDark) && (0, _preact.h)("img", {
      loading: "lazy",
      height: 24,
      width: 24,
      id: "provider-logo-dark",
      src: `${provider.style.logo.startsWith("/") ? logos : ""}${provider.style.logoDark}`
    }), (0, _preact.h)("span", null, "Sign in with ", provider.name))), (provider.type === "email" || provider.type === "credentials") && i > 0 && providersToRender[i - 1].type !== "email" && providersToRender[i - 1].type !== "credentials" && (0, _preact.h)("hr", null), provider.type === "email" && (0, _preact.h)("form", {
      action: provider.signinUrl,
      method: "POST"
    }, (0, _preact.h)("input", {
      type: "hidden",
      name: "csrfToken",
      value: csrfToken
    }), (0, _preact.h)("label", {
      className: "section-header",
      htmlFor: `input-email-for-${provider.id}-provider`
    }, "Email"), (0, _preact.h)("input", {
      id: `input-email-for-${provider.id}-provider`,
      autoFocus: true,
      type: "email",
      name: "email",
      value: email,
      placeholder: "email@example.com",
      required: true
    }), (0, _preact.h)("button", {
      id: "submitButton",
      type: "submit"
    }, "Sign in with ", provider.name)), provider.type === "credentials" && (0, _preact.h)("form", {
      action: provider.callbackUrl,
      method: "POST"
    }, (0, _preact.h)("input", {
      type: "hidden",
      name: "csrfToken",
      value: csrfToken
    }), Object.keys(provider.credentials).map(credential => {
      var _provider$credentials, _provider$credentials2, _provider$credentials3;

      return (0, _preact.h)("div", {
        key: `input-group-${provider.id}`
      }, (0, _preact.h)("label", {
        className: "section-header",
        htmlFor: `input-${credential}-for-${provider.id}-provider`
      }, (_provider$credentials = provider.credentials[credential].label) !== null && _provider$credentials !== void 0 ? _provider$credentials : credential), (0, _preact.h)("input", (0, _extends2.default)({
        name: credential,
        id: `input-${credential}-for-${provider.id}-provider`,
        type: (_provider$credentials2 = provider.credentials[credential].type) !== null && _provider$credentials2 !== void 0 ? _provider$credentials2 : "text",
        placeholder: (_provider$credentials3 = provider.credentials[credential].placeholder) !== null && _provider$credentials3 !== void 0 ? _provider$credentials3 : ""
      }, provider.credentials[credential])));
    }), (0, _preact.h)("button", {
      type: "submit"
    }, "Sign in with ", provider.name)), (provider.type === "email" || provider.type === "credentials") && i + 1 < providersToRender.length && (0, _preact.h)("hr", null));
  })));
}