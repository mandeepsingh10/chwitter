"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = WorkOS;

function WorkOS(options) {
  const {
    issuer = "https://api.workos.com/"
  } = options;
  return {
    id: "workos",
    name: "WorkOS",
    type: "oauth",
    authorization: `${issuer}sso/authorize`,
    token: {
      url: `${issuer}sso/token`
    },
    client: {
      token_endpoint_auth_method: "client_secret_post"
    },
    userinfo: `${issuer}sso/profile`,

    profile(profile) {
      var _profile$raw_attribut;

      return {
        id: profile.id,
        name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        image: (_profile$raw_attribut = profile.raw_attributes.picture) !== null && _profile$raw_attribut !== void 0 ? _profile$raw_attribut : null
      };
    },

    style: {
      logo: "/workos.svg",
      logoDark: "/workos-dark.svg",
      bg: "#fff",
      text: "#6363f1",
      bgDark: "#6363f1",
      textDark: "#fff"
    },
    options
  };
}