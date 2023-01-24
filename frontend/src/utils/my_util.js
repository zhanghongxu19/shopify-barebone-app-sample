import jwt_decode from "jwt-decode";

export function _decodeSessionToken(sessionToken) {
    return jwt_decode(JSON.stringify(sessionToken));
}

export function _getShopFromQuery(window) {
    return new URLSearchParams(window.location.search).get("shop");
}

