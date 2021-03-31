'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/**
 * Check if `vhost` is a valid suffix of `hostname` (top-domain)
 *
 * It means that `vhost` needs to be a suffix of `hostname` and we then need to
 * make sure that: either they are equal, or the character preceding `vhost` in
 * `hostname` is a '.' (it should not be a partial label).
 *
 * * hostname = 'not.evil.com' and vhost = 'vil.com'      => not ok
 * * hostname = 'not.evil.com' and vhost = 'evil.com'     => ok
 * * hostname = 'not.evil.com' and vhost = 'not.evil.com' => ok
 */
function shareSameDomainSuffix(hostname, vhost) {
    if (hostname.endsWith(vhost)) {
        return (hostname.length === vhost.length ||
            hostname[hostname.length - vhost.length - 1] === '.');
    }
    return false;
}
/**
 * Given a hostname and its public suffix, extract the general domain.
 */
function extractDomainWithSuffix(hostname, publicSuffix) {
    // Locate the index of the last '.' in the part of the `hostname` preceding
    // the public suffix.
    //
    // examples:
    //   1. not.evil.co.uk  => evil.co.uk
    //         ^    ^
    //         |    | start of public suffix
    //         | index of the last dot
    //
    //   2. example.co.uk   => example.co.uk
    //     ^       ^
    //     |       | start of public suffix
    //     |
    //     | (-1) no dot found before the public suffix
    var publicSuffixIndex = hostname.length - publicSuffix.length - 2;
    var lastDotBeforeSuffixIndex = hostname.lastIndexOf('.', publicSuffixIndex);
    // No '.' found, then `hostname` is the general domain (no sub-domain)
    if (lastDotBeforeSuffixIndex === -1) {
        return hostname;
    }
    // Extract the part between the last '.'
    return hostname.slice(lastDotBeforeSuffixIndex + 1);
}
/**
 * Detects the domain based on rules and upon and a host string
 */
function getDomain(suffix, hostname, options) {
    // Check if `hostname` ends with a member of `validHosts`.
    if (options.validHosts !== null) {
        var validHosts = options.validHosts;
        for (var i = 0; i < validHosts.length; i += 1) {
            var vhost = validHosts[i];
            if (shareSameDomainSuffix(hostname, vhost)) {
                return vhost;
            }
        }
    }
    // If `hostname` is a valid public suffix, then there is no domain to return.
    // Since we already know that `getPublicSuffix` returns a suffix of `hostname`
    // there is no need to perform a string comparison and we only compare the
    // size.
    if (suffix.length === hostname.length) {
        return null;
    }
    // To extract the general domain, we start by identifying the public suffix
    // (if any), then consider the domain to be the public suffix with one added
    // level of depth. (e.g.: if hostname is `not.evil.co.uk` and public suffix:
    // `co.uk`, then we take one more level: `evil`, giving the final result:
    // `evil.co.uk`).
    return extractDomainWithSuffix(hostname, suffix);
}

/**
 * Return the part of domain without suffix.
 *
 * Example: for domain 'foo.com', the result would be 'foo'.
 */
function getDomainWithoutSuffix(domain, suffix) {
    // Note: here `domain` and `suffix` cannot have the same length because in
    // this case we set `domain` to `null` instead. It is thus safe to assume
    // that `suffix` is shorter than `domain`.
    return domain.slice(0, -suffix.length - 1);
}

/**
 * @param url - URL we want to extract a hostname from.
 * @param urlIsValidHostname - hint from caller; true if `url` is already a valid hostname.
 */
function extractHostname(url, urlIsValidHostname) {
    var start = 0;
    var end = url.length;
    var hasUpper = false;
    // If url is not already a valid hostname, then try to extract hostname.
    if (urlIsValidHostname === false) {
        // Trim leading spaces
        while (start < url.length && url.charCodeAt(start) <= 32) {
            start += 1;
        }
        // Trim trailing spaces
        while (end > start + 1 && url.charCodeAt(end - 1) <= 32) {
            end -= 1;
        }
        // Skip scheme.
        if (url.charCodeAt(start) === 47 /* '/' */ &&
            url.charCodeAt(start + 1) === 47 /* '/' */) {
            start += 2;
        }
        else {
            var indexOfProtocol = url.indexOf(':/', start);
            if (indexOfProtocol !== -1) {
                // Implement fast-path for common protocols. We expect most protocols
                // should be one of these 4 and thus we will not need to perform the
                // more expansive validity check most of the time.
                var protocolSize = indexOfProtocol - start;
                var c0 = url.charCodeAt(start);
                var c1 = url.charCodeAt(start + 1);
                var c2 = url.charCodeAt(start + 2);
                var c3 = url.charCodeAt(start + 3);
                var c4 = url.charCodeAt(start + 4);
                if (protocolSize === 5 &&
                    c0 === 104 /* 'h' */ &&
                    c1 === 116 /* 't' */ &&
                    c2 === 116 /* 't' */ &&
                    c3 === 112 /* 'p' */ &&
                    c4 === 115 /* 's' */);
                else if (protocolSize === 4 &&
                    c0 === 104 /* 'h' */ &&
                    c1 === 116 /* 't' */ &&
                    c2 === 116 /* 't' */ &&
                    c3 === 112 /* 'p' */);
                else if (protocolSize === 3 &&
                    c0 === 119 /* 'w' */ &&
                    c1 === 115 /* 's' */ &&
                    c2 === 115 /* 's' */);
                else if (protocolSize === 2 &&
                    c0 === 119 /* 'w' */ &&
                    c1 === 115 /* 's' */);
                else {
                    // Check that scheme is valid
                    for (var i = start; i < indexOfProtocol; i += 1) {
                        var lowerCaseCode = url.charCodeAt(i) | 32;
                        if (((lowerCaseCode >= 97 && lowerCaseCode <= 122) || // [a, z]
                            (lowerCaseCode >= 48 && lowerCaseCode <= 57) || // [0, 9]
                            lowerCaseCode === 46 || // '.'
                            lowerCaseCode === 45 || // '-'
                            lowerCaseCode === 43) === false // '+'
                        ) {
                            return null;
                        }
                    }
                }
                // Skip 0, 1 or more '/' after ':/'
                start = indexOfProtocol + 2;
                while (url.charCodeAt(start) === 47 /* '/' */) {
                    start += 1;
                }
            }
        }
        // Detect first occurrence of '/', '?' or '#'. We also keep track of the
        // last occurrence of '@', ']' or ':' to speed-up subsequent parsing of
        // (respectively), identifier, ipv6 or port.
        var indexOfIdentifier = -1;
        var indexOfClosingBracket = -1;
        var indexOfPort = -1;
        for (var i = start; i < end; i += 1) {
            var code = url.charCodeAt(i);
            if (code === 35 || // '#'
                code === 47 || // '/'
                code === 63 // '?'
            ) {
                end = i;
                break;
            }
            else if (code === 64) {
                // '@'
                indexOfIdentifier = i;
            }
            else if (code === 93) {
                // ']'
                indexOfClosingBracket = i;
            }
            else if (code === 58) {
                // ':'
                indexOfPort = i;
            }
            else if (code >= 65 && code <= 90) {
                hasUpper = true;
            }
        }
        // Detect identifier: '@'
        if (indexOfIdentifier !== -1 &&
            indexOfIdentifier > start &&
            indexOfIdentifier < end) {
            start = indexOfIdentifier + 1;
        }
        // Handle ipv6 addresses
        if (url.charCodeAt(start) === 91 /* '[' */) {
            if (indexOfClosingBracket !== -1) {
                return url.slice(start + 1, indexOfClosingBracket).toLowerCase();
            }
            return null;
        }
        else if (indexOfPort !== -1 && indexOfPort > start && indexOfPort < end) {
            // Detect port: ':'
            end = indexOfPort;
        }
    }
    // Trim trailing dots
    while (end > start + 1 && url.charCodeAt(end - 1) === 46 /* '.' */) {
        end -= 1;
    }
    var hostname = start !== 0 || end !== url.length ? url.slice(start, end) : url;
    if (hasUpper) {
        return hostname.toLowerCase();
    }
    return hostname;
}

/**
 * Check if a hostname is an IP. You should be aware that this only works
 * because `hostname` is already garanteed to be a valid hostname!
 */
function isProbablyIpv4(hostname) {
    // Cannot be shorted than 1.1.1.1
    if (hostname.length < 7) {
        return false;
    }
    // Cannot be longer than: 255.255.255.255
    if (hostname.length > 15) {
        return false;
    }
    var numberOfDots = 0;
    for (var i = 0; i < hostname.length; i += 1) {
        var code = hostname.charCodeAt(i);
        if (code === 46 /* '.' */) {
            numberOfDots += 1;
        }
        else if (code < 48 /* '0' */ || code > 57 /* '9' */) {
            return false;
        }
    }
    return (numberOfDots === 3 &&
        hostname.charCodeAt(0) !== 46 /* '.' */ &&
        hostname.charCodeAt(hostname.length - 1) !== 46 /* '.' */);
}
/**
 * Similar to isProbablyIpv4.
 */
function isProbablyIpv6(hostname) {
    if (hostname.length < 3) {
        return false;
    }
    var start = hostname[0] === '[' ? 1 : 0;
    var end = hostname.length;
    if (hostname[end - 1] === ']') {
        end -= 1;
    }
    // We only consider the maximum size of a normal IPV6. Note that this will
    // fail on so-called "IPv4 mapped IPv6 addresses" but this is a corner-case
    // and a proper validation library should be used for these.
    if (end - start > 39) {
        return false;
    }
    var hasColon = false;
    for (; start < end; start += 1) {
        var code = hostname.charCodeAt(start);
        if (code === 58 /* ':' */) {
            hasColon = true;
        }
        else if (((code >= 48 && code <= 57) || // 0-9
            (code >= 97 && code <= 102) || // a-f
            (code >= 65 && code <= 90) // A-F
        ) === false) {
            return false;
        }
    }
    return hasColon;
}
/**
 * Check if `hostname` is *probably* a valid ip addr (either ipv6 or ipv4).
 * This *will not* work on any string. We need `hostname` to be a valid
 * hostname.
 */
function isIp(hostname) {
    return isProbablyIpv6(hostname) || isProbablyIpv4(hostname);
}

/**
 * Implements fast shallow verification of hostnames. This does not perform a
 * struct check on the content of labels (classes of Unicode characters, etc.)
 * but instead check that the structure is valid (number of labels, length of
 * labels, etc.).
 *
 * If you need stricter validation, consider using an external library.
 */
function isValidAscii(code) {
    return ((code >= 97 && code <= 122) || (code >= 48 && code <= 57) || code > 127);
}
/**
 * Check if a hostname string is valid. It's usually a preliminary check before
 * trying to use getDomain or anything else.
 *
 * Beware: it does not check if the TLD exists.
 */
function isValidHostname(hostname) {
    if (hostname.length > 255) {
        return false;
    }
    if (hostname.length === 0) {
        return false;
    }
    if (!isValidAscii(hostname.charCodeAt(0))) {
        return false;
    }
    // Validate hostname according to RFC
    var lastDotIndex = -1;
    var lastCharCode = -1;
    var len = hostname.length;
    for (var i = 0; i < len; i += 1) {
        var code = hostname.charCodeAt(i);
        if (code === 46 /* '.' */) {
            if (
                // Check that previous label is < 63 bytes long (64 = 63 + '.')
                i - lastDotIndex > 64 ||
                // Check that previous character was not already a '.'
                lastCharCode === 46 ||
                // Check that the previous label does not end with a '-' (dash)
                lastCharCode === 45 ||
                // Check that the previous label does not end with a '_' (underscore)
                lastCharCode === 95) {
                return false;
            }
            lastDotIndex = i;
        }
        else if (!(isValidAscii(code) || code === 45 || code === 95)) {
            // Check if there is a forbidden character in the label
            return false;
        }
        lastCharCode = code;
    }
    return (
        // Check that last label is shorter than 63 chars
        len - lastDotIndex - 1 <= 63 &&
        // Check that the last character is an allowed trailing label character.
        // Since we already checked that the char is a valid hostname character,
        // we only need to check that it's different from '-'.
        lastCharCode !== 45);
}

function setDefaultsImpl(_a) {
    var _b = _a.allowIcannDomains, allowIcannDomains = _b === void 0 ? true : _b, _c = _a.allowPrivateDomains, allowPrivateDomains = _c === void 0 ? false : _c, _d = _a.detectIp, detectIp = _d === void 0 ? true : _d, _e = _a.extractHostname, extractHostname = _e === void 0 ? true : _e, _f = _a.mixedInputs, mixedInputs = _f === void 0 ? true : _f, _g = _a.validHosts, validHosts = _g === void 0 ? null : _g, _h = _a.validateHostname, validateHostname = _h === void 0 ? true : _h;
    return {
        allowIcannDomains: allowIcannDomains,
        allowPrivateDomains: allowPrivateDomains,
        detectIp: detectIp,
        extractHostname: extractHostname,
        mixedInputs: mixedInputs,
        validHosts: validHosts,
        validateHostname: validateHostname
    };
}
var DEFAULT_OPTIONS = setDefaultsImpl({});
function setDefaults(options) {
    if (options === undefined) {
        return DEFAULT_OPTIONS;
    }
    return setDefaultsImpl(options);
}

/**
 * Returns the subdomain of a hostname string
 */
function getSubdomain(hostname, domain) {
    // If `hostname` and `domain` are the same, then there is no sub-domain
    if (domain.length === hostname.length) {
        return '';
    }
    return hostname.slice(0, -domain.length - 1);
}

/**
 * Implement a factory allowing to plug different implementations of suffix
 * lookup (e.g.: using a trie or the packed hashes datastructures). This is used
 * and exposed in `tldts.ts` and `tldts-experimental.ts` bundle entrypoints.
 */
function getEmptyResult() {
    return {
        domain: null,
        domainWithoutSuffix: null,
        hostname: null,
        isIcann: null,
        isIp: null,
        isPrivate: null,
        publicSuffix: null,
        subdomain: null
    };
}

function parseImpl(url, step, suffixLookup, partialOptions, result) {
    var options = setDefaults(partialOptions);
    // Very fast approximate check to make sure `url` is a string. This is needed
    // because the library will not necessarily be used in a typed setup and
    // values of arbitrary types might be given as argument.
    if (typeof url !== 'string') {
        return result;
    }
    // Extract hostname from `url` only if needed. This can be made optional
    // using `options.extractHostname`. This option will typically be used
    // whenever we are sure the inputs to `parse` are already hostnames and not
    // arbitrary URLs.
    //
    // `mixedInput` allows to specify if we expect a mix of URLs and hostnames
    // as input. If only hostnames are expected then `extractHostname` can be
    // set to `false` to speed-up parsing. If only URLs are expected then
    // `mixedInputs` can be set to `false`. The `mixedInputs` is only a hint
    // and will not change the behavior of the library.
    if (options.extractHostname === false) {
        result.hostname = url;
    }
    else if (options.mixedInputs === true) {
        result.hostname = extractHostname(url, isValidHostname(url));
    }
    else {
        result.hostname = extractHostname(url, false);
    }
    if (step === 0 /* HOSTNAME */ || result.hostname === null) {
        return result;
    }
    // Check if `hostname` is a valid ip address
    if (options.detectIp === true) {
        result.isIp = isIp(result.hostname);
        if (result.isIp === true) {
            return result;
        }
    }
    // Perform optional hostname validation. If hostname is not valid, no need to
    // go further as there will be no valid domain or sub-domain.
    if (options.validateHostname === true &&
        options.extractHostname === true &&
        isValidHostname(result.hostname) === false) {
        result.hostname = null;
        return result;
    }
    // Extract public suffix
    suffixLookup(result.hostname, options, result);
    if (step === 2 /* PUBLIC_SUFFIX */ || result.publicSuffix === null) {
        return result;
    }
    // Extract domain
    result.domain = getDomain(result.publicSuffix, result.hostname, options);
    if (step === 3 /* DOMAIN */ || result.domain === null) {
        return result;
    }
    // Extract subdomain
    result.subdomain = getSubdomain(result.hostname, result.domain);
    if (step === 4 /* SUB_DOMAIN */) {
        return result;
    }
    // Extract domain without suffix
    result.domainWithoutSuffix = getDomainWithoutSuffix(result.domain, result.publicSuffix);
    return result;
}

function fastPathLookup(hostname, options, out) {
    // Fast path for very popular suffixes; this allows to by-pass lookup
    // completely as well as any extra allocation or string manipulation.
    if (options.allowPrivateDomains === false && hostname.length > 3) {
        var last = hostname.length - 1;
        var c3 = hostname.charCodeAt(last);
        var c2 = hostname.charCodeAt(last - 1);
        var c1 = hostname.charCodeAt(last - 2);
        var c0 = hostname.charCodeAt(last - 3);
        if (c3 === 109 /* 'm' */ &&
            c2 === 111 /* 'o' */ &&
            c1 === 99 /* 'c' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'com';
            return true;
        }
        else if (c3 === 103 /* 'g' */ &&
            c2 === 114 /* 'r' */ &&
            c1 === 111 /* 'o' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'org';
            return true;
        }
        else if (c3 === 117 /* 'u' */ &&
            c2 === 100 /* 'd' */ &&
            c1 === 101 /* 'e' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'edu';
            return true;
        }
        else if (c3 === 118 /* 'v' */ &&
            c2 === 111 /* 'o' */ &&
            c1 === 103 /* 'g' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'gov';
            return true;
        }
        else if (c3 === 116 /* 't' */ &&
            c2 === 101 /* 'e' */ &&
            c1 === 110 /* 'n' */ &&
            c0 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'net';
            return true;
        }
        else if (c3 === 101 /* 'e' */ &&
            c2 === 100 /* 'd' */ &&
            c1 === 46 /* '.' */) {
            out.isIcann = true;
            out.isPrivate = false;
            out.publicSuffix = 'de';
            return true;
        }
    }
    return false;
}

/* tslint:disable */
// Code automatically generated using ./bin/builders/hashes.ts
var packed = new Uint32Array([5, 0, 0, 11, 5860739, 5860793, 5860978, 5861026, 5861029, 5861126, 5861321, 5861352, 5861357, 5861403, 5861586, 0, 0, 0, 1, 1850179732, 0, 9, 328184559, 1866923597, 2123501943, 2282562397, 2795346450, 3130446446, 3136607046, 3453334789, 4194175729, 30, 65021741, 101876503, 819014943, 819028732, 1139486022, 1335010188, 1431231509, 1498275876, 1522025464, 1544104458, 1570707647, 1626814538, 1687232530, 1789539963, 1893848785, 2023201532, 2391299855, 2496327381, 2573179642, 2709520566, 2839950127, 2921343336, 2989808530, 3000405309, 3015527775, 3420815319, 3738715095, 3843717774, 3934774481, 4146774829, 4094, 100835, 372942, 373596, 399643, 403867, 589540, 737224, 1210028, 1861414, 2424682, 2658901, 2946999, 3329363, 3333156, 3822808, 6942202, 9086062, 9095117, 9267209, 9340158, 9485932, 11010102, 11406846, 16314893, 18146303, 18331450, 19211200, 20314441, 20356673, 20797457, 25057869, 26663359, 28320278, 30499151, 30585840, 36605120, 36990037, 39275208, 41892561, 42049478, 42538024, 45214788, 47656662, 50173535, 53599326, 53858455, 54537430, 61367659, 63815836, 64422985, 64643127, 64831187, 66751588, 66844930, 69226500, 73517283, 73904368, 74144257, 75706244, 78793775, 78794171, 79558910, 80324123, 84993902, 87977581, 87978853, 87978860, 93811268, 95641381, 95641777, 96671837, 99012676, 100511481, 100947456, 104528693, 108215410, 108929491, 110526112, 110662188, 112311307, 114507832, 116811054, 120488259, 122521550, 129191429, 133427701, 134012911, 141513861, 141517490, 143344167, 144349377, 144362028, 144550088, 144770230, 147205859, 147810002, 147989623, 149598895, 150736276, 150856054, 152379730, 156555774, 164189124, 164189258, 164189262, 164189691, 164189842, 164560958, 165069166, 165106627, 165107021, 165339368, 165444557, 165444558, 165444615, 165444629, 165444745, 165444749, 165445368, 165512129, 165512527, 165749053, 165749188, 165749299, 165749435, 165749535, 165779060, 167155067, 169909265, 169909275, 169909419, 169909512, 169909517, 169909531, 169909608, 169909724, 169909733, 169909734, 169909738, 169909857, 169910036, 169910195, 169910226, 169938982, 169939075, 169939172, 169939304, 169939334, 169939474, 169939481, 169939680, 169939682, 169939793, 169977029, 169977163, 170281136, 170281250, 170281253, 170281258, 170281275, 170281382, 170281390, 170281415, 170281447, 170281457, 170281473, 170281497, 170281511, 170281522, 170281525, 170281528, 170281579, 170281589, 170281687, 170281689, 170281699, 170281742, 170281776, 170281812, 170281852, 170281902, 170281972, 170311352, 170649202, 170649385, 170649596, 171188220, 172078401, 172145927, 172484120, 172484301, 172788260, 172788689, 172788693, 172788754, 172788809, 172788827, 173118530, 173118924, 173456648, 173591948, 173930212, 173930286, 174306499, 174306893, 174307245, 174307439, 174358551, 174374100, 174509317, 174577099, 174644617, 174843632, 174844030, 175181758, 175524135, 175524873, 176843304, 176948764, 178529610, 178530165, 178530256, 178530299, 178530303, 178530355, 178868363, 178868576, 178868974, 179274397, 179274476, 179379459, 179379616, 179379624, 179379849, 179379853, 179380220, 179657877, 179692651, 179714168, 179913714, 180090304, 180090702, 180283722, 180292996, 180293014, 180293036, 180293067, 180293093, 180293105, 180293124, 180293152, 180293156, 180293169, 180293179, 180293199, 180293253, 180293290, 180293294, 180293300, 180293302, 180293304, 180293317, 180293344, 180293346, 180293381, 180293447, 180293487, 180293501, 180293503, 180293522, 180293535, 180293716, 180293796, 180293819, 180293997, 180294000, 180294004, 180294009, 180428032, 180902137, 180969265, 181108861, 181240259, 181240353, 181240367, 181240371, 181240391, 181240392, 181240393, 181240398, 181240404, 181240451, 181240474, 181240479, 181240483, 181240490, 181240509, 181240515, 181240844, 181240853, 181240956, 181241149, 181241165, 181241168, 181244839, 181375748, 181548621, 181548644, 181548727, 181548873, 181549108, 181549176, 181949900, 181950639, 182385920, 182419943, 182893167, 182893283, 182893394, 182893788, 183163149, 183163151, 183163155, 183163168, 183163169, 183163171, 183163181, 183163182, 183163183, 183163186, 183163188, 183163233, 183163248, 183163251, 183163252, 183163254, 183163270, 183163303, 183163314, 183163317, 183163334, 183163335, 183163336, 183163340, 183163345, 183163347, 183163350, 183163362, 183163363, 183163365, 183163366, 183163367, 183163371, 183163375, 183163376, 183163378, 183163380, 183163383, 183163630, 183163631, 183163644, 183163649, 183163651, 183163653, 183163655, 183163664, 183163668, 183163669, 183163678, 183163679, 183163682, 183163687, 183163713, 183163715, 183163728, 183163731, 183163735, 183163742, 183163777, 183163779, 183163780, 183163781, 183163783, 183163796, 183163797, 183163801, 183163843, 183163845, 183163847, 183163859, 183163864, 183163865, 183163874, 183163895, 183163897, 183163913, 183163922, 183163933, 183163960, 183163961, 183163963, 183163977, 183163978, 183163979, 183163981, 183163988, 183163989, 183163991, 183163992, 183163994, 183163995, 183163998, 183164008, 183164010, 183164012, 183164021, 183164025, 183164026, 183164027, 183164029, 183164041, 183164044, 183164045, 183164047, 183164050, 183164051, 183164057, 183164060, 183164061, 183164093, 183468910, 184080938, 184081253, 184081673, 184081677, 184081778, 184246330, 184246511, 184486318, 184486865, 184487263, 184828195, 184828212, 184844696, 184844824, 184848486, 184848491, 184849029, 184849387, 184869208, 184869819, 185163947, 185216284, 185289081, 185292632, 185295605, 185501943, 185502073, 185502077, 185772974, 186723357, 186723671, 186723801, 186763265, 186771866, 186840059, 186858006, 186875993, 186950941, 186953244, 186994101, 186994720, 187011432, 187022814, 187064894, 187067400, 187076090, 187078647, 187088813, 187161171, 187188812, 187203075, 187219343, 187222314, 187251332, 187328908, 187332203, 187378741, 187385256, 187386889, 187403121, 187403860, 187404132, 187409119, 187410536, 187415116, 187415841, 187417183, 187453423, 187455618, 187483569, 187506658, 187521457, 187531575, 187554851, 187557872, 187932036, 187932044, 187932595, 187932730, 187932752, 187932756, 187932794, 187932985, 187932989, 190236828, 190304994, 190305388, 190372512, 190372516, 190372621, 190372839, 190373457, 190575460, 190575594, 190879986, 191043224, 191246659, 191458643, 191459037, 191524213, 193856736, 193857103, 193857114, 193857243, 193991787, 194363750, 194498585, 194498630, 194498988, 194499056, 194499063, 194532263, 194532626, 194532630, 194532693, 194532760, 194532936, 194533115, 194802308, 194802313, 194802316, 194802351, 194802818, 194802832, 194802974, 194803141, 194803143, 194803161, 194803226, 194803230, 194836546, 194870589, 194870610, 194871004, 195040013, 195040230, 195040360, 195077902, 195078025, 195078028, 195078034, 195078035, 195078038, 195078058, 195078062, 195078071, 195078081, 195078095, 195078112, 195078119, 195078120, 195078149, 195078150, 195078156, 195078185, 195078215, 195078217, 195078250, 195078251, 195078272, 195078273, 195078277, 195078283, 195078287, 195078298, 195078299, 195078300, 195078368, 195078372, 195078375, 195078394, 195078464, 195078474, 195078493, 195078531, 195078554, 195078559, 195078687, 195078710, 195078753, 195078828, 195078837, 195078892, 195078895, 195078900, 195078906, 195078959, 195078960, 195078974, 195078995, 195078997, 195079007, 195817892, 195817910, 195818040, 196653590, 197775763, 198219289, 198248729, 198354195, 198354632, 202063369, 203326381, 203326382, 203326695, 203326709, 203326825, 203326829, 203327047, 203327192, 203360584, 203427712, 203428110, 203563443, 203563837, 203664976, 203665374, 203762913, 204069808, 206121592, 207568995, 208227118, 216046669, 218659706, 219797064, 231775478, 232370627, 232791016, 232866163, 232870916, 237059472, 238230825, 238671321, 241611072, 245880244, 246752740, 249954601, 256262487, 256399880, 257210252, 257542887, 259810976, 259829097, 260353797, 260353928, 260353938, 260354380, 260381156, 260390354, 262186579, 266014567, 271387034, 274620304, 274691435, 279382168, 280527902, 280532777, 280535076, 280542659, 281931451, 292827804, 295209043, 296292341, 297619746, 305011770, 306510696, 313583000, 314643431, 320313766, 320318114, 321023689, 321447655, 322472432, 325454853, 326762411, 337081594, 338040061, 339830659, 340010259, 341833935, 342149828, 356194258, 358990451, 359223603, 359276554, 360204016, 360327984, 368215882, 370146306, 370150662, 373255328, 373394720, 374785091, 376173808, 376667442, 377307531, 377336144, 377652210, 379825795, 380248845, 380316586, 380849985, 381874529, 381884647, 382049883, 382486912, 382598847, 385650293, 389069795, 389909922, 393290800, 395076177, 395140257, 399168703, 402724451, 403769719, 404122044, 409655137, 410188633, 411785958, 413977571, 418962805, 419080649, 423458772, 424591341, 424705846, 424926177, 425050855, 430711818, 430784915, 431116435, 431157415, 431370962, 431390595, 431489022, 431585240, 431586828, 431608121, 432925266, 433686700, 434854475, 442888655, 442922019, 443587046, 444998055, 445176561, 449218512, 449424719, 451217894, 451870618, 459172225, 469098393, 471052880, 478642118, 480635114, 480636362, 480638119, 480638181, 480638612, 480653244, 480658155, 480658807, 480939764, 483974975, 484603510, 484645735, 488826995, 490491404, 493445761, 499075209, 511578298, 514111995, 514955151, 515474792, 515491843, 515593995, 517240281, 519409110, 520595267, 522631343, 523234636, 527144416, 533682535, 533847771, 534396735, 538362471, 540682234, 545433338, 547443445, 550462929, 551440509, 555571491, 557981738, 559064708, 560636591, 572640614, 572652435, 575127842, 575742406, 575835832, 576590271, 577168455, 582462766, 584490345, 587585418, 587768078, 588145733, 589399600, 591647101, 594353073, 596395114, 596517435, 602054693, 609523853, 612026675, 622957156, 622959354, 627471386, 630686153, 632559259, 635121653, 635859009, 637007260, 641167055, 643225485, 643488605, 643663853, 648008241, 648304671, 650538190, 656171171, 656243914, 656640963, 665693626, 667797222, 675938056, 678076451, 679253935, 684522993, 684536293, 689065707, 689172736, 689202009, 693611235, 694324728, 695649196, 700774993, 703142796, 707132367, 712377315, 712470899, 715533184, 722903474, 728415570, 729335905, 731964179, 733989474, 744440632, 748265163, 752520493, 752687122, 752687226, 752699150, 752938578, 753314817, 761228031, 762792020, 766278458, 771168358, 771342884, 772916985, 785945688, 787032422, 789676308, 793080342, 794341423, 794638681, 799598398, 803443550, 803504423, 803576910, 803750530, 804046103, 804899040, 810638083, 813049915, 813882670, 813882809, 819687634, 821390609, 822184173, 822865774, 824372117, 824828566, 826639012, 826993974, 827575018, 827624512, 831815016, 834750300, 834856638, 834963202, 835666250, 838463501, 839632578, 842350150, 843454848, 844441814, 845393562, 845537310, 846032279, 847050559, 850228898, 851897573, 853098265, 855980394, 858467853, 864019409, 869651422, 878524814, 881613818, 883922292, 883926782, 885943745, 886050698, 896206971, 896253025, 897230014, 898924730, 900375831, 900562876, 907903147, 909690480, 911040096, 912288153, 912452591, 913046780, 914761571, 915088911, 915769822, 915838470, 919008564, 924477462, 924490662, 927206149, 935240483, 936096500, 939243980, 939281294, 939375524, 939697158, 939922440, 940027871, 942640890, 942743627, 943328481, 943363810, 947022624, 950098348, 954017396, 954872462, 959069811, 961909457, 961915153, 962363178, 962549619, 963013768, 967703276, 967948020, 969062315, 971904354, 971904490, 973306633, 973317901, 973587946, 973591516, 973595243, 973613934, 973618563, 974354714, 977251657, 977925344, 983357420, 983929219, 983931665, 983936021, 984542401, 985262291, 985854160, 986356352, 986883183, 987313801, 987563776, 987600844, 994961720, 1002154839, 1005485664, 1005660307, 1005931709, 1008280710, 1009678005, 1009815854, 1015938248, 1018008327, 1024510565, 1027688850, 1032624770, 1033292429, 1033879086, 1034329743, 1034357170, 1038843968, 1039500800, 1042185353, 1043537387, 1043742405, 1044060157, 1045601283, 1046273911, 1046743273, 1046756254, 1048099261, 1049404062, 1052311686, 1052441930, 1052883806, 1053590026, 1055187548, 1056740120, 1058016469, 1059921109, 1060080890, 1060081069, 1064702402, 1067370082, 1067385970, 1067405735, 1068743400, 1072264613, 1080832696, 1083646554, 1084662717, 1085312600, 1086607170, 1086818213, 1086839634, 1087030220, 1087432248, 1087540767, 1088313455, 1089639430, 1089665811, 1092266223, 1094128841, 1094382979, 1100822038, 1101368277, 1101556739, 1101657937, 1101658065, 1102136407, 1102319129, 1102691201, 1104338451, 1104888372, 1107574816, 1107604513, 1107608406, 1114346722, 1114906227, 1115517588, 1116603570, 1116886791, 1121544473, 1122391675, 1123274870, 1123277038, 1123281470, 1123286137, 1123300855, 1128066491, 1128665654, 1130410120, 1135543458, 1135544712, 1135545955, 1135553917, 1135559494, 1135563376, 1136069038, 1136903068, 1141006631, 1141018311, 1142918810, 1143019669, 1144395492, 1146787097, 1149112251, 1151589762, 1152383075, 1153265116, 1153556935, 1153560693, 1153560855, 1153576209, 1153582928, 1154249515, 1155609853, 1158010336, 1158014282, 1158019276, 1158022529, 1158025585, 1158030151, 1158040127, 1158040853, 1158043091, 1158313993, 1160141196, 1160245697, 1160246728, 1160253683, 1160271099, 1160271446, 1160272445, 1160277399, 1161223806, 1161235355, 1162489113, 1163536255, 1166908086, 1166937977, 1166949933, 1166952503, 1166953757, 1166959964, 1167534042, 1169030529, 1169037994, 1169039382, 1169046802, 1169046815, 1169048548, 1169054036, 1169994302, 1171270800, 1171270813, 1172775704, 1173601310, 1174042111, 1174752677, 1174762471, 1175725254, 1175726508, 1175727467, 1175727495, 1175735449, 1175736592, 1175738578, 1175738760, 1175746250, 1175746252, 1175749986, 1175793566, 1179261033, 1184984869, 1185692184, 1189090107, 1191206679, 1191915740, 1192411690, 1192590212, 1193567716, 1194400508, 1198881999, 1198884629, 1199843361, 1202502980, 1204258276, 1204470469, 1206364960, 1206399154, 1207407281, 1207765705, 1207825797, 1208230324, 1208429990, 1208517393, 1208911775, 1208937193, 1209536263, 1211364607, 1212671635, 1214258492, 1217924538, 1220965831, 1225976890, 1228682933, 1229000062, 1229783327, 1229847808, 1229958905, 1232816452, 1237771172, 1237773393, 1237773841, 1243202596, 1245899123, 1247245722, 1256406409, 1257366451, 1259566070, 1260762188, 1261854970, 1265324777, 1265669119, 1273073240, 1278961290, 1280280379, 1280768035, 1291368159, 1295085673, 1295542469, 1295875812, 1296518360, 1297048848, 1300060481, 1300364681, 1303525815, 1303650868, 1304687455, 1304781392, 1304918086, 1305056028, 1305920823, 1306968125, 1306972554, 1306973586, 1307621261, 1307665177, 1308558601, 1308559744, 1308574194, 1308583254, 1308584508, 1308585495, 1309808754, 1310362665, 1310785148, 1310799239, 1310800921, 1310801269, 1310803416, 1310807041, 1310808370, 1313021694, 1313023237, 1313030377, 1314270973, 1314287001, 1314293208, 1321085506, 1321731136, 1322807089, 1322881666, 1324313259, 1324313985, 1324320704, 1324322270, 1324332261, 1324636022, 1325293061, 1325300526, 1325303158, 1325308368, 1325309334, 1325309339, 1325310241, 1325310486, 1325311328, 1325311482, 1326707500, 1328209699, 1328777903, 1328778629, 1328785348, 1328786906, 1328789635, 1328794451, 1328797153, 1329362352, 1329963165, 1329987910, 1330666198, 1330807345, 1330903052, 1331009222, 1331010221, 1331013633, 1331015175, 1331019352, 1331025251, 1331026645, 1331028446, 1331143849, 1335448632, 1335892543, 1336436046, 1336436772, 1336437775, 1336438057, 1336439236, 1336443338, 1336449024, 1336456660, 1336460266, 1336462620, 1336463768, 1336469142, 1341018428, 1341081128, 1341091249, 1341179896, 1342001696, 1344411053, 1344426134, 1344436952, 1344437939, 1344444146, 1346529166, 1349466130, 1350170659, 1350170661, 1350356518, 1350356534, 1350620578, 1351056251, 1351154191, 1351382419, 1351445663, 1353796379, 1353803638, 1354094479, 1354229264, 1354447091, 1354448055, 1354464484, 1354467042, 1354475004, 1354584300, 1355466970, 1355483586, 1355607656, 1355929695, 1355947655, 1356095080, 1356150953, 1356150969, 1356150973, 1356457867, 1356471002, 1356757572, 1357692080, 1357876668, 1357880232, 1358481170, 1360043731, 1360220638, 1362168625, 1362262729, 1362271868, 1362285703, 1362326863, 1362656266, 1364891797, 1365811994, 1367555632, 1367692098, 1367811071, 1368369281, 1368820926, 1369663049, 1374458097, 1377739598, 1378565283, 1379014609, 1379224098, 1381333258, 1383613953, 1383613964, 1383629111, 1383647122, 1385857457, 1385879444, 1386127789, 1386706928, 1388074128, 1388078600, 1388084119, 1388086017, 1388094003, 1388104573, 1388109527, 1388111766, 1390304957, 1390318095, 1390319238, 1390321811, 1390327192, 1390328435, 1390329689, 1391292472, 1391295130, 1391298115, 1391299402, 1391302044, 1391307254, 1391308253, 1392560940, 1396553940, 1397006395, 1397007527, 1397007872, 1397007885, 1397015305, 1397016949, 1397022431, 1400354688, 1400355947, 1400356673, 1400360856, 1400364702, 1400366245, 1401741660, 1405743539, 1407053336, 1407067683, 1409840426, 1410939834, 1414623055, 1416259553, 1417803702, 1417953492, 1417953925, 1417969521, 1417971248, 1418042854, 1420962489, 1422407147, 1422418384, 1422432926, 1422434165, 1422435892, 1423090882, 1425971467, 1426162994, 1426865884, 1426871783, 1426872814, 1426880658, 1426881913, 1426884152, 1428612014, 1429098926, 1429105132, 1429112250, 1430623854, 1431581902, 1431587977, 1431591127, 1432718586, 1433558874, 1433568865, 1433577620, 1433578879, 1435387691, 1435862377, 1444705448, 1444706435, 1444707945, 1444708598, 1444713016, 1444718265, 1444720166, 1444723003, 1444725453, 1444731199, 1444731564, 1444731950, 1444732047, 1444732342, 1444732347, 1444738453, 1445361689, 1448052138, 1448052864, 1448054123, 1448067662, 1448078965, 1449172589, 1452091461, 1453387928, 1453752738, 1453961462, 1456174702, 1457037634, 1457145422, 1457156469, 1457178704, 1458371285, 1459376581, 1459377857, 1459377868, 1459384567, 1459385707, 1459403577, 1459405260, 1459408531, 1459757655, 1459920222, 1461678986, 1463840740, 1463842504, 1463849459, 1463849797, 1463867222, 1463868221, 1463873175, 1464819582, 1464821125, 1464829402, 1464830128, 1464831131, 1466045929, 1466068861, 1466074694, 1466091096, 1466403701, 1467047928, 1467061763, 1467063453, 1467065948, 1467070902, 1468307140, 1468314970, 1468321435, 1471526086, 1474285944, 1474796155, 1474852365, 1474856386, 1474857640, 1474858627, 1474866589, 1474867476, 1474871748, 1474880870, 1482183211, 1482187228, 1482389973, 1482978689, 1486003341, 1486005836, 1486010790, 1486021608, 1486029338, 1486036499, 1486036510, 1491300687, 1492834968, 1492905126, 1495099017, 1495387727, 1496999162, 1497335658, 1497338257, 1497341434, 1497353781, 1497360500, 1497361503, 1503214457, 1504022303, 1504024292, 1504032122, 1504033105, 1504038587, 1509379857, 1510741574, 1511059454, 1514359714, 1515292004, 1517410020, 1517415502, 1517416485, 1517424315, 1517426048, 1519466742, 1519486936, 1526518672, 1534242148, 1535379077, 1535411852, 1535416972, 1535418272, 1535419013, 1535426999, 1535427585, 1535429447, 1535437817, 1535442771, 1535445010, 1538631370, 1539876488, 1539883905, 1539891891, 1539902461, 1539907415, 1539909654, 1540853566, 1540863813, 1540865371, 1540871834, 1540872816, 1540972285, 1542830372, 1544565822, 1547523228, 1548000883, 1548203684, 1548662272, 1548668010, 1548668993, 1548676831, 1548677846, 1548686756, 1550655859, 1551291701, 1552780862, 1554083280, 1554160502, 1554849656, 1556617220, 1556618479, 1556619205, 1556627226, 1556629025, 1562365424, 1571587981, 1572843623, 1575133026, 1577978899, 1578737375, 1579027766, 1580891870, 1580902117, 1580903020, 1580910138, 1580910864, 1581061599, 1584242651, 1584252576, 1584258687, 1584260414, 1584261397, 1586571037, 1588295785, 1589138556, 1593538808, 1594150134, 1594318433, 1594644051, 1595762332, 1596345927, 1596503336, 1599871881, 1600554193, 1600562964, 1600967980, 1600968967, 1600970477, 1600988233, 1600993979, 1600994866, 1600997301, 1601541268, 1602995891, 1603061457, 1604314670, 1604316655, 1604330442, 1604341489, 1604342648, 1605183784, 1605406132, 1605908391, 1607689728, 1607689741, 1607690628, 1607701062, 1607701276, 1607705078, 1607710365, 1607715640, 1607716607, 1607716627, 1608344260, 1610313759, 1610666926, 1611239998, 1611396088, 1614382839, 1614530679, 1615167003, 1615172374, 1615640392, 1615647347, 1615658840, 1615665110, 1615666109, 1615671063, 1620094847, 1620095619, 1620095929, 1620105028, 1620113841, 1620119323, 1620795340, 1621082362, 1621083649, 1621092660, 1622329964, 1622331641, 1622337218, 1622353628, 1623408910, 1624559739, 1624569664, 1624577502, 1624577906, 1624578485, 1626556599, 1628470609, 1630022199, 1632310642, 1633163415, 1635568907, 1635591150, 1635593749, 1635643420, 1635994183, 1635994320, 1641006393, 1645672758, 1645785364, 1645803376, 1645808858, 1645809841, 1646891621, 1646892908, 1646907799, 1646910247, 1646917618, 1646918617, 1648007716, 1648013984, 1648016015, 1648021910, 1648025704, 1648032728, 1648033715, 1648039922, 1648043240, 1649119056, 1649454738, 1649581121, 1652486802, 1652497372, 1652504566, 1652932064, 1652936599, 1653583645, 1653598182, 1653599929, 1653606136, 1653607123, 1654697756, 1654712103, 1654713134, 1654716280, 1654721234, 1654722233, 1656168200, 1659162648, 1659176739, 1659180924, 1659185878, 1659186877, 1659695250, 1660874915, 1664393911, 1666206978, 1666510724, 1668155429, 1669474757, 1673661122, 1673662353, 1673671436, 1673686839, 1673856704, 1674136053, 1674769898, 1674770881, 1674776363, 1674793871, 1675780006, 1675959713, 1676641114, 1677004461, 1677008482, 1677010668, 1677010688, 1677011655, 1677022217, 1677030942, 1677037554, 1679234542, 1679234666, 1679235736, 1679237897, 1679237918, 1679241007, 1679252114, 1679258763, 1679261552, 1679266928, 1681499983, 1681500998, 1681504918, 1681510964, 1681520272, 1681526010, 1681526993, 1682221833, 1682359277, 1685960411, 1685962398, 1685964612, 1685965520, 1685965569, 1685965582, 1685965890, 1685967499, 1685968865, 1685974082, 1685987547, 1685988215, 1685988552, 1685991645, 1686112357, 1686592668, 1686670946, 1687209740, 1690419670, 1690419852, 1690423356, 1690429255, 1690430286, 1690438386, 1690439385, 1690439477, 1691674376, 1691689779, 1691700349, 1691705303, 1691707542, 1691739899, 1692242488, 1693300811, 1693663054, 1693900733, 1693904467, 1693911703, 1693913871, 1693915014, 1693915019, 1693922968, 1693923252, 1693924211, 1693925465, 1696514991, 1697110779, 1697112784, 1697112842, 1697116346, 1697119048, 1697126337, 1697127463, 1697127903, 1697134366, 1697135348, 1699859798, 1704832941, 1705550489, 1705948764, 1706596362, 1707661217, 1709380801, 1709397036, 1709401602, 1709403991, 1709403994, 1709604401, 1709715630, 1709719753, 1710245453, 1710553669, 1710842194, 1711349139, 1711911296, 1712708709, 1712862856, 1712874413, 1712889750, 1715042583, 1716067791, 1716074254, 1716075236, 1716090026, 1716093784, 1716101073, 1716987897, 1717046504, 1717344945, 1717458342, 1717665490, 1717667127, 1717964139, 1718229371, 1718354825, 1718357162, 1719193555, 1719336939, 1719736367, 1719951972, 1719952370, 1720424110, 1720435157, 1720448732, 1720448944, 1720449947, 1720450929, 1721036165, 1721144676, 1721180497, 1721273073, 1721300021, 1721429734, 1721781082, 1721785367, 1722611952, 1723770733, 1723771620, 1723777366, 1723795122, 1723796376, 1723797619, 1723869014, 1724144999, 1724360630, 1724888746, 1724891334, 1724900049, 1724902970, 1724913368, 1724913588, 1724914591, 1724915573, 1724965913, 1725078045, 1725233009, 1725264035, 1725510046, 1726097551, 1726312938, 1727054697, 1727192868, 1727424862, 1727705145, 1727733987, 1727744610, 1728055993, 1728286570, 1728572893, 1728575555, 1728593248, 1728609049, 1728736741, 1730434650, 1730700309, 1731354114, 1731355346, 1732002104, 1732531131, 1733044570, 1733128185, 1733173527, 1735014430, 1735473130, 1736646879, 1737465416, 1740085948, 1740104597, 1740108386, 1741479646, 1741618915, 1741621154, 1741622153, 1741631292, 1741636935, 1741709977, 1742216984, 1743089654, 1744959211, 1744968590, 1744969829, 1744971556, 1744977659, 1744987840, 1745343269, 1745488513, 1746392299, 1747200908, 1747202151, 1747210105, 1747211248, 1747212978, 1747215938, 1747219291, 1747533677, 1747671543, 1747762259, 1748301224, 1748301648, 1748302211, 1748318651, 1748321229, 1748327140, 1748327340, 1748328118, 1748329946, 1749416322, 1749419816, 1749422630, 1749422974, 1749423815, 1749423848, 1749423862, 1749423980, 1749432545, 1749435316, 1749435457, 1749435956, 1749437829, 1749437986, 1749440303, 1749441388, 1749442296, 1749442361, 1749443256, 1749443576, 1749444398, 1749445477, 1749445739, 1749750164, 1749955965, 1752768365, 1753028168, 1753430927, 1753880966, 1753882221, 1753900232, 1753906931, 1756680747, 1759105063, 1759488516, 1759512274, 1759513528, 1759514495, 1762715404, 1763952265, 1763967858, 1763978172, 1763979159, 1765274516, 1768132013, 1774870841, 1775193783, 1775278057, 1776446407, 1778765218, 1779479261, 1779706923, 1779707649, 1779709525, 1779713177, 1779714057, 1779714368, 1779715934, 1779715971, 1779725925, 1779730307, 1779731494, 1780768183, 1781938242, 1781939241, 1781944195, 1781948380, 1781954023, 1781961852, 1783657515, 1784508980, 1785147288, 1785152492, 1785564290, 1786402886, 1786403885, 1786408839, 1786413016, 1786418915, 1786422601, 1792463843, 1793085197, 1793091404, 1793103209, 1793109842, 1794311882, 1796513490, 1798682988, 1799934413, 1800873944, 1804734874, 1804986274, 1805201900, 1805201909, 1808346875, 1809278593, 1809909084, 1810126394, 1810162729, 1811189710, 1812804641, 1813167465, 1818860644, 1824377544, 1826567786, 1826567942, 1826568769, 1826574251, 1826586852, 1826591759, 1826593533, 1826594804, 1826595685, 1826597041, 1826838298, 1827843009, 1830073720, 1832102940, 1834682984, 1835526804, 1835527882, 1835530317, 1835531888, 1835536950, 1835540435, 1835541852, 1835548479, 1835548755, 1835552425, 1835554706, 1835556216, 1836242836, 1836706536, 1838062951, 1838891575, 1839007628, 1839021100, 1839022775, 1839033593, 1839038547, 1839040786, 1839994953, 1840001842, 1840013399, 1840019350, 1840019827, 1840020860, 1843076481, 1845608978, 1846070315, 1848013570, 1849443027, 1850456697, 1854921046, 1859450748, 1859510931, 1859511204, 1860240647, 1860312281, 1860334137, 1861101595, 1863024310, 1863816745, 1866230741, 1866891339, 1866893066, 1866896736, 1866908847, 1866910185, 1866914026, 1867191437, 1867299303, 1867861768, 1867865679, 1867867083, 1867872142, 1867873124, 1867876289, 1867885376, 1867885466, 1867887914, 1867892691, 1867897750, 1867898961, 1867899162, 1867908767, 1873521117, 1875950626, 1876926780, 1878219696, 1883713830, 1883718737, 1883722494, 1883726489, 1883992567, 1884025074, 1887655375, 1889208808, 1889317056, 1890185274, 1890880911, 1891315242, 1893080109, 1893129355, 1894534152, 1894535395, 1894543357, 1894548934, 1895822736, 1896748195, 1896864381, 1896883495, 1896884690, 1896893413, 1897086584, 1897144569, 1897150382, 1897161336, 1898308423, 1899713189, 1899886170, 1903920486, 1903920882, 1905987148, 1906518923, 1906815088, 1907908343, 1907910446, 1907911172, 1907924055, 1907926218, 1907937265, 1910568778, 1912588116, 1912664290, 1912773142, 1919704439, 1919708663, 1923048311, 1925589573, 1928014104, 1929265412, 1931786446, 1933270769, 1933847987, 1934282690, 1935832225, 1937137824, 1940180687, 1941545223, 1944881831, 1944883085, 1944889292, 1944901097, 1944907730, 1944915291, 1947690884, 1949378607, 1949381140, 1949385828, 1949388221, 1949404634, 1953208595, 1957126749, 1965906276, 1965980590, 1966393263, 1966441984, 1976999040, 1977095148, 1977627523, 1979043911, 1979158532, 1982830318, 1982831301, 1982836783, 1982854539, 1982856313, 1982857328, 1982862253, 1982863214, 1983477916, 1983945412, 1983946415, 1983946627, 1983953134, 1983957025, 1983968650, 1983971249, 1983972408, 1983977373, 1985096774, 1985106740, 1985116048, 1985122769, 1987638584, 1989155232, 1991785536, 1991792841, 1991799730, 1991811287, 1991817238, 1991817715, 1991818748, 1992326594, 1994019132, 1994026062, 1994028952, 1994613365, 1998305912, 2000627256, 2002587178, 2002703477, 2004080420, 2007546240, 2007547499, 2007556254, 2007557797, 2009780252, 2013938002, 2016158046, 2016458632, 2016459875, 2016461129, 2016470189, 2016476340, 2016482461, 2016485526, 2018939223, 2019785049, 2023148389, 2023153871, 2023155598, 2023156002, 2023157760, 2023171627, 2023174160, 2023812622, 2029256230, 2029286951, 2029296544, 2037064184, 2042215210, 2042272668, 2042423451, 2043073993, 2044012869, 2046744295, 2047386704, 2047490213, 2047625030, 2047828609, 2051192703, 2052284669, 2056364987, 2056365175, 2056459861, 2057257910, 2058376024, 2058382302, 2058436464, 2058440319, 2058445367, 2058447874, 2058448694, 2058452545, 2058552215, 2058569521, 2058573621, 2058924197, 2058929805, 2058958371, 2058984507, 2058988863, 2059003240, 2059051015, 2059075746, 2059422408, 2059824807, 2061714098, 2062014471, 2062647492, 2063260135, 2063415690, 2063627333, 2063814283, 2064238717, 2064313581, 2064484772, 2064499575, 2064635107, 2064635452, 2064635773, 2064639428, 2064639883, 2064648773, 2064654772, 2064655646, 2065476844, 2065542420, 2065542544, 2065543022, 2065727011, 2066567940, 2066734284, 2066828553, 2066833534, 2067036957, 2067202738, 2067233317, 2068031208, 2068725531, 2068831008, 2068854498, 2068854512, 2068858196, 2068859575, 2068860177, 2068862627, 2068863232, 2068869021, 2068950273, 2068994789, 2068994807, 2069062998, 2069102686, 2069161595, 2069263945, 2069338842, 2069365704, 2069468800, 2069558220, 2069561350, 2069566268, 2069591394, 2069593072, 2069595618, 2069600040, 2069600946, 2069600957, 2069604100, 2069765192, 2069904166, 2069904305, 2071035931, 2071149679, 2071643658, 2073163309, 2073289171, 2073308845, 2073310709, 2073312474, 2073322881, 2073335784, 2073440452, 2073448514, 2073457247, 2073500084, 2073509625, 2073523923, 2073533208, 2073640292, 2073794194, 2073803151, 2073803461, 2073808229, 2073811616, 2073811996, 2073815760, 2073826308, 2073826688, 2073827152, 2073830759, 2073831593, 2073831601, 2074299520, 2075044848, 2075423284, 2075693433, 2078935992, 2078936931, 2078937889, 2078937913, 2078938163, 2078938295, 2078944407, 2078944555, 2078944613, 2078944933, 2081181239, 2081852454, 2082063743, 2082285629, 2082430948, 2084946688, 2086083080, 2087431076, 2087431077, 2087431079, 2087431080, 2087431081, 2087431082, 2087431085, 2087431086, 2087431087, 2087431088, 2087431089, 2087431090, 2087431091, 2087431092, 2087431093, 2087431094, 2087431096, 2087431097, 2087431098, 2087431099, 2087431100, 2087431102, 2087431103, 2087617590, 2087617591, 2087617592, 2087617593, 2087617594, 2087617595, 2087617596, 2087617597, 2087617598, 2087617599, 2087617632, 2087617633, 2087617634, 2087617635, 2087617636, 2087617637, 2087617638, 2087617639, 2087617640, 2087617641, 2087617642, 2087617643, 2087617644, 2087617645, 2087617647, 2087617652, 2087617654, 2087617655, 2087617656, 2087617657, 2087617658, 2087617659, 2087617660, 2087617661, 2087617662, 2087617663, 2087629931, 2087822490, 2088302297, 2088726760, 2088953542, 2088996444, 2090213881, 2090218574, 2090297888, 2090298020, 2091225604, 2092577468, 2092702023, 2092715579, 2092766986, 2092957042, 2093991393, 2093995617, 2093995632, 2094612635, 2094991848, 2095143559, 2097113374, 2098599777, 2098599792, 2099138174, 2102249573, 2102285158, 2102285168, 2102285285, 2102285374, 2102286572, 2102291553, 2102297313, 2102301463, 2102304381, 2102311282, 2102312281, 2102313468, 2102315379, 2102317235, 2102322718, 2103529616, 2105684477, 2105873178, 2106751208, 2106757636, 2106766355, 2106769656, 2106775467, 2106775926, 2106776925, 2106781879, 2112542671, 2118750891, 2119037299, 2119037310, 2119041270, 2119043865, 2119381911, 2119891962, 2120136928, 2120142410, 2120143393, 2120151231, 2120152708, 2121629990, 2121793676, 2122433548, 2123414271, 2123472843, 2123472936, 2123472990, 2123479292, 2123481132, 2123481326, 2123481391, 2123481939, 2123481960, 2123482928, 2123482935, 2123485221, 2123485512, 2123486092, 2123487587, 2123487602, 2123488061, 2123489049, 2123491458, 2123491494, 2123491502, 2123491940, 2123491964, 2123492067, 2123492380, 2123492410, 2123492613, 2123492943, 2123493403, 2123494323, 2123494721, 2123494806, 2123495205, 2123495263, 2123495538, 2123495599, 2123495615, 2123495829, 2123496707, 2123496945, 2123497027, 2123497539, 2123498152, 2123498621, 2123498738, 2123499337, 2123499387, 2123499393, 2123499675, 2123499823, 2123500085, 2123500670, 2123501043, 2123501651, 2123501946, 2123502012, 2123502618, 2123502909, 2123502931, 2123502972, 2123503489, 2123503580, 2123503633, 2123503639, 2123503645, 2123503683, 2123503690, 2123503925, 2123506021, 2123508761, 2123508887, 2123508888, 2123509104, 2123509367, 2123510210, 2126830924, 2126831627, 2126831911, 2126834731, 2126838118, 2126839865, 2126841008, 2126851442, 2126854146, 2127933481, 2127939688, 2127940675, 2127945958, 2127950989, 2127966582, 2130163562, 2130164545, 2130170027, 2130187535, 2130190580, 2131286378, 2132327224, 2132331087, 2132359596, 2133546426, 2134655216, 2135730753, 2135744303, 2135751022, 2135766376, 2135766538, 2136033383, 2136198665, 2140379406, 2140382005, 2140404240, 2140405499, 2140406225, 2140969091, 2141369520, 2141378580, 2141384318, 2142607534, 2142608862, 2142616598, 2142619146, 2143588731, 2143590729, 2143592861, 2143597618, 2143609175, 2143615126, 2143616636, 2144844042, 2144846897, 2144858266, 2144868884, 2144870143, 2144870869, 2150993049, 2157945278, 2158338411, 2160318468, 2160324206, 2160325189, 2160333019, 2160343200, 2161056790, 2161569257, 2161578129, 2161578140, 2161592231, 2161595735, 2163561912, 2165898261, 2166038855, 2166996811, 2167003274, 2167004256, 2167015877, 2167018798, 2167213797, 2167993101, 2169327252, 2170481633, 2170487115, 2170488842, 2170504623, 2170507412, 2174946277, 2174951759, 2174953486, 2174953890, 2174969515, 2174972048, 2176528068, 2179101309, 2180545870, 2187180906, 2187858563, 2191744103, 2191744212, 2191821366, 2191883015, 2192566334, 2193960351, 2195897610, 2195898849, 2195906687, 2195916612, 2195922100, 2196631346, 2202024183, 2205406696, 2211506222, 2216825796, 2219145843, 2221394610, 2225058301, 2225061335, 2225064134, 2225071439, 2225073075, 2225080536, 2225426653, 2225696488, 2226037368, 2226044042, 2226051203, 2226052893, 2226055388, 2226060342, 2226419862, 2229389306, 2229788675, 2230793522, 2230840997, 2231615745, 2231617728, 2231623210, 2231628742, 2231632031, 2231633170, 2231633764, 2231638049, 2231729235, 2231751291, 2231760201, 2231761216, 2231769054, 2231770037, 2231775519, 2233884981, 2235100587, 2235101313, 2235108032, 2235109598, 2235116887, 2235119589, 2236869449, 2238302643, 2241796550, 2241797549, 2241802503, 2241806680, 2241812579, 2242828527, 2244900591, 2246244298, 2246245281, 2246250763, 2246260079, 2246271316, 2246446647, 2247223374, 2247249937, 2247251096, 2248592412, 2250708942, 2250715407, 2250719552, 2250724971, 2250725805, 2250733692, 2250735952, 2258878642, 2263047660, 2264886749, 2266447633, 2267607000, 2282544968, 2285662351, 2290599544, 2292158595, 2293175691, 2293351636, 2296071446, 2299255515, 2301040846, 2306079466, 2307034140, 2307580553, 2313241363, 2313504811, 2318220358, 2318563401, 2320224028, 2325476095, 2335714240, 2337176745, 2339504386, 2344847762, 2345345412, 2345556981, 2346482211, 2346482871, 2351498341, 2352240646, 2352738840, 2358991500, 2361087993, 2361277274, 2364634824, 2369603272, 2370443161, 2371011349, 2373457221, 2375393789, 2376425283, 2379512524, 2379580075, 2389041013, 2390286898, 2390518325, 2390736011, 2391410598, 2392516839, 2392521063, 2393811335, 2400874900, 2400879124, 2402335630, 2403175918, 2404974948, 2405102721, 2405117283, 2405120727, 2414810349, 2415093005, 2415923742, 2415925541, 2415935547, 2415976346, 2418152088, 2422623072, 2422625395, 2422631927, 2422634373, 2422636295, 2422636392, 2425962056, 2425963043, 2425969250, 2425969487, 2425971892, 2425985030, 2428197348, 2428202830, 2428203813, 2428211643, 2428212914, 2428213376, 2428240545, 2430223084, 2433759338, 2433759634, 2433760321, 2433765803, 2433783311, 2433785126, 2433786356, 2435993901, 2436000108, 2436001095, 2436011657, 2436026994, 2439339076, 2439340079, 2439340291, 2439346798, 2439350689, 2439362314, 2439364913, 2439366072, 2439371037, 2439876345, 2440431898, 2440444045, 2440449369, 2444112661, 2447928023, 2448686625, 2452264162, 2454797153, 2458316286, 2459819944, 2460346836, 2462285242, 2462802458, 2463186757, 2466741694, 2466758807, 2467213089, 2467545358, 2467601561, 2467655846, 2467686484, 2467740953, 2473985870, 2474042431, 2474150919, 2474285829, 2474577412, 2474661520, 2475343068, 2475470210, 2475772433, 2475892298, 2476213365, 2476552306, 2478583646, 2479517659, 2487711817, 2489453909, 2489531547, 2492815759, 2498555779, 2501597440, 2507278661, 2510852110, 2512156190, 2514524650, 2519935040, 2540805343, 2543008264, 2547140668, 2548210359, 2553182506, 2558063998, 2558416820, 2560726248, 2564751176, 2566787042, 2569608194, 2572602371, 2577853220, 2579477027, 2579803386, 2583084289, 2586020617, 2600402029, 2604613571, 2614694552, 2616608417, 2619680030, 2623678483, 2624091113, 2626979216, 2627765050, 2629831661, 2630340943, 2630577386, 2633112569, 2635762328, 2636801013, 2637047575, 2637160117, 2637393619, 2637589507, 2639283063, 2642320383, 2644891950, 2655636765, 2657728452, 2658381845, 2660357137, 2661288721, 2661501246, 2663538084, 2668276183, 2673250796, 2673526891, 2673678071, 2676265918, 2683622002, 2685054344, 2686768508, 2689921282, 2690533659, 2691751732, 2691869931, 2692015714, 2693065457, 2693628719, 2694158948, 2699054734, 2699567323, 2701589506, 2708247797, 2710218932, 2712973569, 2713114330, 2714658156, 2715859111, 2716538256, 2717691085, 2718235570, 2719851426, 2722275573, 2728431851, 2731033959, 2734448641, 2735037840, 2745064373, 2747735009, 2748168364, 2748310006, 2753354596, 2753586905, 2761147374, 2762813598, 2767767034, 2768482489, 2769808878, 2771202832, 2775691349, 2777232090, 2781109506, 2784107887, 2784647309, 2789347571, 2792452218, 2793624174, 2794767436, 2795183554, 2795185357, 2795205893, 2798224110, 2803597621, 2804113804, 2807804736, 2809486328, 2813025413, 2815428841, 2815585428, 2816618421, 2819662823, 2820408757, 2821986169, 2822221150, 2822315880, 2824682484, 2828575765, 2828866516, 2829935276, 2834927579, 2834988813, 2836892761, 2839658405, 2844621372, 2855163005, 2857193006, 2859698097, 2860702321, 2861907234, 2866492514, 2870435535, 2874906565, 2880233005, 2885526550, 2886304164, 2887625380, 2889073982, 2893961579, 2894962731, 2896115089, 2896360091, 2896815948, 2898520762, 2898642745, 2907467650, 2908250170, 2908376536, 2911135641, 2915014315, 2918403731, 2919235927, 2920587887, 2921981389, 2922468503, 2922493886, 2923084706, 2929584080, 2931398379, 2931402541, 2934752311, 2934893225, 2937779198, 2939718255, 2941551192, 2943207335, 2944624083, 2944643800, 2947465711, 2947810750, 2947839623, 2948393504, 2948690168, 2948867989, 2949433359, 2951266128, 2953613654, 2954570766, 2955048302, 2956489777, 2960184498, 2960188722, 2960612931, 2962892549, 2963032843, 2966548328, 2968983188, 2976545290, 2976620947, 2978924197, 2982913903, 2986096991, 2987284613, 2988637881, 2993692642, 2996709992, 2999106536, 2999693174, 3000568496, 3002891536, 3005531064, 3005732955, 3006549345, 3007175865, 3007286028, 3008753857, 3010444860, 3010880247, 3017258218, 3019938621, 3020499579, 3022866914, 3023311759, 3024482653, 3024795687, 3024807531, 3027071777, 3029820267, 3032088673, 3032839979, 3033043261, 3033965900, 3036878933, 3037343835, 3038234864, 3044024978, 3051293097, 3052701732, 3054970205, 3055037923, 3056484673, 3060407188, 3061523114, 3071254387, 3071254500, 3071254881, 3073058130, 3074871971, 3074935051, 3075008146, 3075048985, 3075285442, 3075422693, 3075548305, 3075766008, 3075860343, 3075962648, 3076097045, 3077391764, 3079190285, 3085252246, 3091066645, 3091553195, 3096769792, 3103424085, 3107541791, 3107727924, 3107749241, 3107778469, 3107783354, 3107787446, 3107790299, 3107948057, 3107956419, 3107974264, 3107984588, 3107991466, 3108296169, 3111583245, 3113459538, 3115513630, 3116256345, 3116975703, 3117043431, 3123411243, 3123445549, 3123737595, 3127243644, 3131616468, 3134139083, 3134716611, 3141196244, 3141709512, 3148676509, 3154082174, 3155375542, 3160028447, 3163162577, 3163167462, 3163515572, 3163650864, 3172095015, 3178395499, 3179968189, 3183658699, 3187099641, 3187299343, 3189362935, 3189614929, 3189845278, 3191231848, 3191324353, 3196795314, 3196799538, 3197664642, 3200115829, 3202732235, 3206363778, 3207294280, 3218691622, 3224832477, 3226582088, 3231960701, 3231960825, 3238444781, 3240506687, 3241127686, 3241536496, 3245505639, 3246685420, 3255250502, 3255493270, 3258010725, 3259268259, 3259708744, 3269885479, 3272088211, 3285490421, 3287497511, 3294281816, 3300709686, 3302430666, 3307080284, 3310372188, 3310580422, 3313110325, 3313272952, 3317570505, 3321771963, 3323504524, 3331033092, 3331794938, 3336602563, 3340803503, 3344036147, 3344936763, 3351242611, 3354164541, 3356161036, 3356994116, 3357443896, 3358280978, 3360549707, 3360712009, 3361435146, 3362509089, 3362630778, 3366920760, 3368501591, 3372160500, 3373297021, 3374596217, 3375285141, 3376798040, 3377755895, 3379029866, 3380241983, 3380595728, 3381834713, 3382169680, 3385946526, 3386125251, 3387539161, 3388057612, 3393544563, 3399698423, 3404840083, 3405857857, 3407191084, 3408814815, 3408819560, 3409018494, 3409457570, 3410577155, 3411051814, 3411102162, 3412047440, 3412913800, 3413983999, 3416442515, 3416515385, 3416581522, 3416635233, 3418887913, 3424150275, 3425734594, 3426036948, 3426656604, 3429124000, 3430316367, 3430320824, 3430870942, 3431771155, 3432731814, 3435576236, 3435582845, 3435750771, 3435755340, 3435827335, 3435838083, 3435867222, 3435992037, 3436024307, 3436059437, 3436063816, 3436069982, 3436074280, 3436077508, 3436091273, 3436159613, 3436165190, 3436170719, 3436195088, 3436196199, 3436197592, 3436249372, 3436269078, 3436269081, 3436293672, 3436294647, 3436301787, 3436342898, 3436364333, 3436370464, 3436392181, 3436429036, 3436429043, 3436459789, 3436497793, 3436643348, 3437361412, 3440930072, 3441289467, 3445003174, 3448289841, 3448536520, 3448614961, 3452859864, 3455445539, 3455973701, 3456106851, 3456282588, 3457601666, 3463597433, 3465489744, 3467469261, 3471221309, 3473077716, 3481649290, 3487446962, 3488022631, 3488033206, 3488034362, 3488035079, 3488035561, 3488035719, 3488035993, 3488036079, 3488037593, 3488039692, 3488040337, 3488045626, 3488047642, 3488051093, 3488051126, 3488053833, 3488816292, 3489196379, 3495434909, 3495798979, 3503723552, 3503962589, 3503975251, 3504086267, 3504111353, 3504116046, 3504274912, 3505764984, 3506277065, 3508805241, 3509081590, 3513566261, 3514339133, 3515728076, 3515960057, 3516630755, 3523519258, 3523935664, 3526432473, 3530287752, 3530461503, 3530748624, 3530798581, 3531066474, 3531601080, 3532265658, 3532567787, 3533680386, 3536219166, 3538145547, 3540002868, 3540019679, 3541120058, 3543598258, 3544077455, 3551826674, 3554146688, 3557238629, 3557288966, 3558510813, 3560409651, 3560721423, 3560755308, 3560772904, 3560776799, 3560843986, 3563273081, 3564677062, 3564681286, 3567399383, 3567824494, 3572225704, 3572896829, 3582031081, 3584271853, 3584286131, 3585048866, 3585049834, 3585528102, 3593775985, 3602300234, 3602787435, 3607509617, 3608111536, 3611661676, 3611790203, 3614121054, 3615995480, 3621964687, 3621965124, 3621966081, 3621966083, 3621968414, 3621969916, 3621970585, 3621975893, 3622095083, 3622538650, 3627671724, 3631197772, 3635135986, 3636965307, 3639447013, 3642331354, 3659188474, 3659876530, 3665337607, 3667545339, 3668394990, 3668555001, 3668632957, 3671699945, 3674122558, 3676733804, 3686247745, 3690182854, 3691035506, 3691048605, 3691317036, 3693068020, 3694814128, 3697923226, 3699114476, 3702342894, 3706900355, 3707026630, 3708334595, 3708762397, 3709045244, 3712703179, 3712728440, 3712733478, 3716618496, 3716733543, 3717443225, 3718845099, 3720827503, 3723950536, 3728968422, 3729352785, 3729562677, 3730027878, 3734185373, 3735541918, 3737224996, 3738382782, 3738387349, 3738389800, 3738389990, 3738390006, 3738390241, 3738390427, 3738394220, 3738394620, 3738394722, 3738394744, 3738394859, 3738396519, 3738397033, 3738399064, 3738400460, 3738887202, 3738887334, 3739466542, 3742755730, 3743358776, 3744330913, 3745299015, 3748385635, 3749221030, 3756564018, 3766265917, 3766587032, 3767014136, 3767872686, 3768672199, 3771941409, 3772113601, 3772128853, 3772772804, 3774466709, 3776028623, 3776032376, 3776447581, 3776673980, 3777321837, 3777702607, 3777706691, 3777840696, 3778052019, 3778877784, 3781867794, 3788596678, 3788641118, 3789096147, 3790949066, 3792555306, 3792675197, 3794434962, 3795445637, 3797340812, 3799396589, 3802359444, 3802425981, 3802900168, 3803509878, 3803533553, 3803824710, 3805465891, 3813366359, 3817195077, 3825134626, 3831783888, 3837846657, 3837850203, 3842564401, 3842605521, 3845461162, 3845489549, 3848928610, 3854658802, 3856336918, 3857323999, 3859684851, 3862352064, 3863136572, 3867966833, 3871085378, 3871829833, 3872291932, 3872427595, 3873740388, 3874034025, 3875048726, 3875150667, 3875975886, 3876231871, 3877484520, 3878080222, 3881750832, 3882302039, 3886373040, 3888702999, 3890651277, 3890862632, 3896043913, 3896689307, 3899279503, 3900747045, 3906847659, 3911916015, 3927826024, 3932062404, 3932228732, 3935292304, 3943337509, 3944324480, 3944448839, 3947301018, 3949488650, 3950159753, 3952494101, 3953197696, 3960241116, 3960376152, 3961917741, 3963099658, 3963421060, 3963723254, 3967007952, 3967259205, 3967845242, 3969124422, 3970612783, 3970678261, 3973713485, 3975040093, 3975243357, 3975693785, 3987058095, 3990704705, 3992681822, 3995478227, 3995612289, 3998971354, 3998991175, 3999298006, 4000670401, 4000993351, 4001099777, 4001277861, 4001735503, 4002465742, 4003357293, 4005356768, 4007925342, 4010478264, 4011050686, 4011066530, 4011075332, 4011273939, 4011552428, 4011788459, 4012217148, 4012217259, 4012952625, 4024186918, 4027830515, 4028975169, 4029110469, 4029583348, 4030423947, 4031498693, 4031499367, 4031499504, 4031509172, 4031928713, 4032208645, 4032479130, 4033316487, 4034881946, 4036743247, 4038287798, 4038545865, 4040900190, 4042024153, 4055745484, 4059205746, 4059950647, 4060130555, 4061045790, 4064482362, 4064482494, 4064686007, 4068398139, 4074270800, 4074270919, 4074308286, 4075674315, 4075712516, 4075885548, 4078878227, 4080178633, 4081049105, 4089654486, 4090206590, 4090679933, 4091412422, 4095259202, 4095274203, 4097043581, 4097047544, 4097047888, 4097050487, 4097053538, 4097079538, 4097094723, 4097094855, 4097218811, 4097289420, 4097298261, 4097355529, 4097358800, 4097358806, 4097359478, 4097365147, 4097365569, 4097368351, 4097368475, 4097373732, 4097381131, 4097390898, 4097493023, 4097494448, 4097500420, 4097504860, 4097508952, 4097518447, 4097523657, 4097528230, 4097528249, 4097565588, 4097595928, 4097769515, 4097769660, 4097770040, 4097900631, 4097993352, 4097993363, 4098078311, 4098093255, 4098096816, 4098101881, 4098102013, 4098120408, 4099257624, 4099391059, 4100119818, 4100353643, 4101141701, 4101990706, 4102099355, 4102141580, 4102295291, 4103385373, 4104416776, 4104979523, 4105354399, 4108421678, 4108481771, 4113654278, 4120143040, 4120573143, 4120685305, 4120832270, 4121323786, 4122797449, 4123137490, 4123141719, 4123166778, 4123237466, 4124517918, 4124852870, 4126190390, 4126265264, 4126330058, 4126584791, 4128561486, 4130538182, 4130665595, 4135804702, 4138805004, 4138959002, 4142649353, 4143010615, 4143011353, 4149276818, 4149741566, 4155964946, 4160851306, 4165043845, 4165602674, 4166101816, 4168506065, 4168666626, 4168671212, 4169534192, 4169538416, 4174620042, 4177885870, 4178182706, 4179726175, 4180321577, 4180398911, 4180437564, 4180584501, 4180592595, 4180655876, 4182610142, 4190427894, 4190436241, 4190438903, 4190464587, 4190536489, 4191350062, 4197904504, 4204887304, 4208748285, 4213114634, 4213114766, 4213115878, 4213133169, 4213139443, 4214412462, 4216213600, 4226637963, 4229539334, 4230260404, 4236039784, 4239211903, 4244301284, 4244359264, 4244636840, 4244650461, 4244697370, 4246504751, 4248927363, 4249781266, 4250093591, 4252726263, 4253347765, 4255547342, 4262305702, 4269915810, 4271230391, 4273205904, 4280822506, 4281987205, 4281991429, 4287811748, 4288642117, 4290818353, 4290862694, 4290938088, 4291163255, 4291519114, 4292375442, 4292614575, 1138, 113029, 2431109, 6154799, 9085905, 10454523, 11833936, 15005411, 20989895, 29369909, 32348563, 32392946, 34831997, 35241656, 41719852, 42040525, 49751269, 54657448, 54829135, 61297674, 64616140, 64792746, 65243007, 69912355, 75564691, 84754216, 95227810, 97671606, 97869711, 98556036, 112714201, 113832573, 118457586, 119013459, 129204800, 129504899, 132934253, 133576354, 141325108, 142928709, 144351849, 147399388, 148485881, 153516070, 159755595, 162751717, 166383271, 169909381, 170281555, 170281599, 170281951, 172221532, 173287589, 173930363, 174306514, 176844018, 177079695, 177546706, 179139641, 179569944, 180259371, 181198501, 181240422, 183469260, 186043176, 187501046, 190912115, 193357074, 193420201, 194024818, 195040318, 195040605, 195615400, 196491587, 203969128, 204000291, 204003102, 211702237, 216404638, 223633303, 223869171, 225036633, 231228447, 233832515, 236122625, 244953360, 253603556, 268305044, 279497384, 282260013, 286117940, 288337735, 294222691, 294944592, 297796540, 308437280, 309814229, 316711416, 319659866, 321667918, 329290740, 336073493, 341979606, 344556873, 345150446, 361618841, 363650316, 365386885, 379803748, 382346929, 392534911, 393050977, 398079720, 408076405, 409551689, 412923104, 413523569, 417762611, 418389794, 418643706, 430774757, 431420666, 431463230, 439016491, 446595824, 448347366, 459993498, 461991320, 467355959, 468677861, 478194174, 481007914, 483933287, 493239087, 495294245, 495544034, 500922416, 503870109, 505520155, 505540840, 505547348, 507674743, 507704542, 508155006, 508732896, 533082472, 536606854, 536706420, 544035780, 548068662, 554422931, 558904957, 566123574, 574052622, 575078226, 579214441, 582810837, 583362052, 583453417, 594063106, 598128236, 601948346, 602413319, 603986209, 605582466, 609198625, 610045978, 620396524, 626039263, 626988485, 630452394, 635400744, 640415961, 643558590, 645257576, 652659119, 665354414, 666296511, 667333922, 668403785, 674175725, 682364285, 689215333, 693241087, 704136516, 706383966, 708808466, 710978465, 713788357, 727209749, 734622016, 735035205, 737152212, 737166334, 737644692, 737837074, 739516787, 739985822, 741816033, 742252614, 745092996, 747930588, 750508933, 752522257, 754000708, 758478444, 762067870, 762641736, 764248075, 764320946, 764825188, 766296725, 766355544, 766774330, 767540529, 772363084, 777688891, 792844833, 800087019, 810061706, 810813298, 811092091, 817847511, 826260124, 833658992, 834470340, 847675799, 861294299, 862950715, 867732810, 870151875, 874296659, 875944810, 876149555, 884498580, 887482102, 894264732, 896104248, 896521560, 896979123, 902139830, 911653942, 912249299, 933746041, 939098524, 939114841, 948752149, 955130439, 955354780, 955942299, 956480228, 958121442, 972273212, 976381303, 978919739, 981829565, 984418838, 997412732, 1001458257, 1001637783, 1001651627, 1005191377, 1008948875, 1027786481, 1027856392, 1032266307, 1033049924, 1035709107, 1038486906, 1041294385, 1043437244, 1049779946, 1051535617, 1053737172, 1056645919, 1056720884, 1059933327, 1063952736, 1064732809, 1065290596, 1079732589, 1080478458, 1081536009, 1086069586, 1088535269, 1094421058, 1095718313, 1096687866, 1100372480, 1101043104, 1102004406, 1104733017, 1110237878, 1112959177, 1113096701, 1114972095, 1118952562, 1121043812, 1125668821, 1130216203, 1132104794, 1132534664, 1132579070, 1132598106, 1136018325, 1138287902, 1139265327, 1139293087, 1145147923, 1146523166, 1149204820, 1151262913, 1152056864, 1153549635, 1154536715, 1154542665, 1155367440, 1155994599, 1160246725, 1161218045, 1162479261, 1164711369, 1164964007, 1166033123, 1166944153, 1167024992, 1169046340, 1174582808, 1174756828, 1183829925, 1191923730, 1192723278, 1199133859, 1199554249, 1199600208, 1204911535, 1210779948, 1220586092, 1221782335, 1221920801, 1236932222, 1243532105, 1259689738, 1261324364, 1266641105, 1268763191, 1271531819, 1276658942, 1282928227, 1283757717, 1296235125, 1301946320, 1305140481, 1310799836, 1310807544, 1310899277, 1316125796, 1324285266, 1324310094, 1324331646, 1324337571, 1324579984, 1325750278, 1326569216, 1328786903, 1333842476, 1344411040, 1349684561, 1351415139, 1351880550, 1354921809, 1354922083, 1356250756, 1357629674, 1362165018, 1363404812, 1364008114, 1364487272, 1365133140, 1366987615, 1372241226, 1372705460, 1372794328, 1375834117, 1377641421, 1385859280, 1391291390, 1391293134, 1391299074, 1393577155, 1394469288, 1394469303, 1394469473, 1394469866, 1394470005, 1394470066, 1396870772, 1399867662, 1401343574, 1406508900, 1407053333, 1410090536, 1426871786, 1429104232, 1430902259, 1433568876, 1433581041, 1435770227, 1436788950, 1441473969, 1444705872, 1444722875, 1444727957, 1445594238, 1448082324, 1455246557, 1457145411, 1458555099, 1459794391, 1460930084, 1465058743, 1465976327, 1465976425, 1465976436, 1465976463, 1465976550, 1465976555, 1465976625, 1465976632, 1465976696, 1465976747, 1465976870, 1465976979, 1465976985, 1465976986, 1465976991, 1465977196, 1465977261, 1465977271, 1465977274, 1465977323, 1474444421, 1481566528, 1482522967, 1494181387, 1504535254, 1509029106, 1515598870, 1526085253, 1529619411, 1532042759, 1533712942, 1535412311, 1540864030, 1541073018, 1541496652, 1542773859, 1548676818, 1549199388, 1549209224, 1549210203, 1555806428, 1561102750, 1570561776, 1582406800, 1582529544, 1585380899, 1587251606, 1601662530, 1602151715, 1602222565, 1602416912, 1604313702, 1605465730, 1605466324, 1605478605, 1610069144, 1610724928, 1613430619, 1616623247, 1616826805, 1622337231, 1622345684, 1624120544, 1624575040, 1634840328, 1635306209, 1639041637, 1643544413, 1643893360, 1645239134, 1645714411, 1646892897, 1647763648, 1648459154, 1652472178, 1652482428, 1654623339, 1659538076, 1661285202, 1662950537, 1676328914, 1681382184, 1682444281, 1683407715, 1684605451, 1686572406, 1686834359, 1687225102, 1687228988, 1693905970, 1693924649, 1694678234, 1696017211, 1698247372, 1700874190, 1708553688, 1709403276, 1712893263, 1713051167, 1713095897, 1716947524, 1720424693, 1721557559, 1722492001, 1723770720, 1723859941, 1732377833, 1740500925, 1740503023, 1747210100, 1747349646, 1747349737, 1747349747, 1747350242, 1747350353, 1747350383, 1747350483, 1747350570, 1752792553, 1757625214, 1758838683, 1759487629, 1759498393, 1759499821, 1759502442, 1759502966, 1759512283, 1759514515, 1759516437, 1759524172, 1762973847, 1762975960, 1762992044, 1763004314, 1772061961, 1772164204, 1782043531, 1789421301, 1789632072, 1791856284, 1792792037, 1793905730, 1801396125, 1804673412, 1807671676, 1813955111, 1814430790, 1817436421, 1822787251, 1826594809, 1828043124, 1830686062, 1839007617, 1839995410, 1839996532, 1839996844, 1841030555, 1842560365, 1844448916, 1844480213, 1846724376, 1861064328, 1863000850, 1869152073, 1873769763, 1873773882, 1874142716, 1875798230, 1880233189, 1881382733, 1885862630, 1890372289, 1890379225, 1891205640, 1891938925, 1896919160, 1896919227, 1896919294, 1899147627, 1900573373, 1901379444, 1902628941, 1928994000, 1936188797, 1939298330, 1944071536, 1946130305, 1946324244, 1947055740, 1949193282, 1951127334, 1956200886, 1960661844, 1964294607, 1971670426, 1975660003, 1979063800, 1979519790, 1986972074, 1987328192, 1987660949, 1991785763, 1991793298, 1992080509, 2001507875, 2004488903, 2015900220, 2018783243, 2021213332, 2034927376, 2035815698, 2037403782, 2039595722, 2040354520, 2040943501, 2041028464, 2044842550, 2050838609, 2051827668, 2052901511, 2053206810, 2053478875, 2053493456, 2056180496, 2061275137, 2066721635, 2067699997, 2073532671, 2075934693, 2077460241, 2077463931, 2082279457, 2082350395, 2082490504, 2083899515, 2087556005, 2087595516, 2092046651, 2097381010, 2097529923, 2098668173, 2100199727, 2103470828, 2105481502, 2107063121, 2111314048, 2113664954, 2120150756, 2122563214, 2122618177, 2124668692, 2133549370, 2134191641, 2134715695, 2138049165, 2138494997, 2141358278, 2144770101, 2151644274, 2163712208, 2163898589, 2170508442, 2178944930, 2184528600, 2187374596, 2190645414, 2190660247, 2190897184, 2192558778, 2195413098, 2195424198, 2195905956, 2203121973, 2208876632, 2211529485, 2216861598, 2224936471, 2225064139, 2233205867, 2235535537, 2241998064, 2245744882, 2246095470, 2246270479, 2246624423, 2247249610, 2249578444, 2251500542, 2257131811, 2259407586, 2278366865, 2281444864, 2284221844, 2286089069, 2290521795, 2298483014, 2298859942, 2303709693, 2305684069, 2306183534, 2310688315, 2315634657, 2323978889, 2334488740, 2335980755, 2343955873, 2343987387, 2344051572, 2344081298, 2353017729, 2357782940, 2372460029, 2372478071, 2384339112, 2399346319, 2399822664, 2403261116, 2407789481, 2409182571, 2417084170, 2417652035, 2419411749, 2419417423, 2422632357, 2423117096, 2424431334, 2428211424, 2436026537, 2441679501, 2444838503, 2451024601, 2454448917, 2456215407, 2459247176, 2467234433, 2469945372, 2473920266, 2486666796, 2503042985, 2512844015, 2518777282, 2525588137, 2528358668, 2528706848, 2531896313, 2536602755, 2556085817, 2558131228, 2564231467, 2565836498, 2572746788, 2597156358, 2600311538, 2609976564, 2619619987, 2630676340, 2635726130, 2636739119, 2637611531, 2637745410, 2637827916, 2639832942, 2646831691, 2658971428, 2669967601, 2674644077, 2675377616, 2680331975, 2694622232, 2708256980, 2721005193, 2723132333, 2723449219, 2727613517, 2729386864, 2732129495, 2742067873, 2743561936, 2745053658, 2755346949, 2762308724, 2762732310, 2773342582, 2773916239, 2777215669, 2780969136, 2784038323, 2787145966, 2787151566, 2791623281, 2792656912, 2793843165, 2797512177, 2798111293, 2798512509, 2799526810, 2799947922, 2802973072, 2804403738, 2805637755, 2812187177, 2812916202, 2820491263, 2829422945, 2831048350, 2832237259, 2834623189, 2840525902, 2842490055, 2846385194, 2846982791, 2850213786, 2852028874, 2852573181, 2857974075, 2860823467, 2864766480, 2865932173, 2873369054, 2878248977, 2880150758, 2900972274, 2909422460, 2914081458, 2914744694, 2918571873, 2931708704, 2933052029, 2943539162, 2944562948, 2958695479, 2959025464, 2963193938, 2963907974, 2964323647, 2964344548, 2969439522, 2969802598, 2972958854, 2982085395, 2985605450, 2999691650, 3008190733, 3008855969, 3023766416, 3029366772, 3036119914, 3039024727, 3043904968, 3051886594, 3053067553, 3057812794, 3066185554, 3068762275, 3087114209, 3087935921, 3088190003, 3089015336, 3091255985, 3095401268, 3096813247, 3098725318, 3105671535, 3118932015, 3119183299, 3121944857, 3126706525, 3130262956, 3146277579, 3154412692, 3159557566, 3164499075, 3164706839, 3173559921, 3174529089, 3176196996, 3176871024, 3180784320, 3181226348, 3184223807, 3186278865, 3187205025, 3189849017, 3192015124, 3201052817, 3206103617, 3229338204, 3232995840, 3236363663, 3236684869, 3241501460, 3243217472, 3254464708, 3257959952, 3290502878, 3293286977, 3293297241, 3296072286, 3296072534, 3296419295, 3299767442, 3301223392, 3301309499, 3301391192, 3304599725, 3313552392, 3321637504, 3331885553, 3332277580, 3337182013, 3337858974, 3341471161, 3347209717, 3350345047, 3350816321, 3355691995, 3356927752, 3366205910, 3366755503, 3367073048, 3367944003, 3375346812, 3376868662, 3381262072, 3382258705, 3392485763, 3403782237, 3406109171, 3407122639, 3411575670, 3420722608, 3426523263, 3431675506, 3431798787, 3443103158, 3445734210, 3450482982, 3453219838, 3455171543, 3458629656, 3459326184, 3460757148, 3460835389, 3471910127, 3472815309, 3473608107, 3474158466, 3480605972, 3485240025, 3491815953, 3500328283, 3506796962, 3518469610, 3524188747, 3529349528, 3542452078, 3546487756, 3550989552, 3551573749, 3553442167, 3554781799, 3558264087, 3560824248, 3563344816, 3566074326, 3568626956, 3576593305, 3584104748, 3586564634, 3590119076, 3594126223, 3610130320, 3618863110, 3629119210, 3629792790, 3635013147, 3636074310, 3638424639, 3642130958, 3642225062, 3647798063, 3656108419, 3657615451, 3659534155, 3659667263, 3660545348, 3660867367, 3671487562, 3678946749, 3686646984, 3691543485, 3691543777, 3695175653, 3698130051, 3700803863, 3704722354, 3718851041, 3722297297, 3724304421, 3726779638, 3727535579, 3735382080, 3740438523, 3740440657, 3745910284, 3748112414, 3748157778, 3751765724, 3751843037, 3758548269, 3760229117, 3765200838, 3767579376, 3767636566, 3774416951, 3774620406, 3775107448, 3777554302, 3789001045, 3789217359, 3797275201, 3797334865, 3797547975, 3797752814, 3798120765, 3799727891, 3800284920, 3803890887, 3811590943, 3813081457, 3816238011, 3818244185, 3820433217, 3824973847, 3831131041, 3839962587, 3842157165, 3853184002, 3854490492, 3856121458, 3860607422, 3861431943, 3871255217, 3902486573, 3909678524, 3911290870, 3919568627, 3924938673, 3932881151, 3932899585, 3934007962, 3942901813, 3950379841, 3960912026, 3973890763, 3976040035, 3979964906, 3979965156, 3991078309, 3992259208, 4013412307, 4025854722, 4027536004, 4033312623, 4033315572, 4036094574, 4043405137, 4048222256, 4051811237, 4052267313, 4054558966, 4066383490, 4070580503, 4073707968, 4085096371, 4100786237, 4115427659, 4117626035, 4128299636, 4132795027, 4133480683, 4136878052, 4138850346, 4138930624, 4148483014, 4149626272, 4149641566, 4149676591, 4149809179, 4152090640, 4152153727, 4161031359, 4168702437, 4168921085, 4175490343, 4179607399, 4182917435, 4196816243, 4196953008, 4201710836, 4204344500, 4216249688, 4218603456, 4220181346, 4230252988, 4230808631, 4235216564, 4245730359, 4250048329, 4261049438, 4266150865, 4270257086, 4285995571, 4287809158, 4287924367, 4293141634, 4293320049, 4293822270, 7, 171252454, 314658260, 1911007288, 2310391087, 2705648135, 3085052283, 4199583372, 0, 0, 13, 366428436, 366991379, 649399193, 900018457, 1068454171, 1437166305, 1491010671, 1491010869, 2412701058, 2447973967, 3229893628, 3628727675, 4020469118, 1979, 3609572, 4707302, 4731941, 7066741, 12732264, 12733869, 12874473, 12898727, 15239865, 15443925, 15464989, 17770158, 18806137, 22641470, 34805542, 37254453, 38352510, 47103897, 47124528, 47160482, 47264668, 47270558, 47521880, 47670735, 47682584, 48206184, 54052064, 55399270, 55790429, 57861540, 64629239, 65951659, 73540622, 74816563, 79005572, 79010572, 79432449, 79977826, 80960607, 90941114, 91781471, 93732497, 101061895, 101792620, 105281118, 114635485, 121111459, 126395821, 127613999, 134819976, 135124399, 135156325, 135512978, 139443164, 140195744, 146403274, 147165318, 147311351, 147680945, 154712981, 156193153, 157683252, 162021680, 165184869, 165682351, 167795310, 169177047, 169285407, 170248114, 175536255, 176298648, 181584625, 186190871, 188366635, 190461039, 190805290, 190817793, 191644192, 193330267, 200367649, 204872798, 208246903, 213994908, 222038678, 222914983, 226753977, 227658815, 230657663, 231976681, 232418677, 234224516, 235125560, 235385397, 235630461, 235880887, 236100347, 237106084, 237695302, 243768879, 244905302, 245221564, 245221621, 245248688, 246957980, 247379872, 247404538, 247547714, 249186148, 249832804, 250298968, 252007821, 252166643, 254498243, 256250975, 256734086, 257675257, 258276240, 260078806, 269653037, 270614174, 270803459, 279865482, 290747254, 296104342, 296106331, 296214241, 297365588, 297388265, 297388314, 297395043, 297872731, 297875338, 305678573, 310113063, 317059542, 318726251, 320983337, 321380700, 329390871, 340233049, 343985311, 368331859, 368339983, 374202536, 374729119, 377042975, 377218502, 377330983, 379160277, 387137528, 390536878, 397426025, 410462833, 410898354, 411028646, 415359567, 418289923, 418809394, 420699727, 422768411, 423087664, 434374676, 434499530, 439966930, 443910462, 444881445, 446735168, 470802373, 473022090, 475752042, 480190019, 481797890, 482141996, 493334140, 493996949, 494002753, 494111972, 496668263, 505642028, 513006918, 520166698, 522732652, 524323805, 524791178, 525296785, 532366388, 537994409, 538156652, 539123093, 539125333, 540384923, 545724556, 546598380, 552815312, 564847266, 572585472, 572589595, 572660745, 572917514, 572938118, 581295982, 583116728, 584477771, 585356786, 585510953, 586974440, 588341431, 590260151, 593171510, 600861600, 602587622, 608185550, 608501000, 611172806, 617227910, 620862123, 625412750, 626878575, 627192073, 628675473, 636454657, 644892435, 645708934, 646772532, 650376939, 653264074, 653865504, 654835286, 655274400, 657684596, 657843927, 665654464, 665772443, 667917050, 667982163, 668803663, 678409190, 685972429, 687873546, 699223116, 722349553, 723381066, 723506578, 725289629, 728910939, 728916446, 729301272, 730375222, 731520837, 731524865, 731524893, 733458327, 734942836, 742063133, 744425628, 745118723, 750501894, 753379261, 753585532, 755936840, 755999442, 757164322, 757742871, 758908039, 758927262, 766978617, 767310694, 767319597, 768502512, 775086059, 775783015, 776818569, 777129529, 782249017, 782470551, 782586541, 783225086, 783819749, 787058931, 793173186, 793643539, 793791572, 794069868, 797737785, 801549019, 805476735, 809560577, 810471911, 810660018, 813069363, 813965189, 814609400, 819689086, 822265343, 827811881, 828807618, 840895172, 842670706, 845178939, 849626506, 857304293, 867054787, 875581912, 878480613, 878489001, 888652626, 892902192, 904040802, 904780949, 904781069, 904781208, 904781211, 904781269, 904781270, 904781407, 904781445, 904781469, 904781569, 904781597, 904781741, 904781750, 904781798, 907680375, 909542970, 913350787, 915552624, 943105427, 944616168, 945567936, 946059164, 946112067, 950116031, 950459761, 950797941, 950991772, 952407653, 954708706, 954904735, 956279390, 959296218, 959317553, 960000436, 960088334, 964474682, 965248297, 965252181, 968600148, 969495568, 969714387, 969714391, 969714751, 969714897, 975014436, 976847064, 977515724, 978655375, 985441466, 985451059, 988676432, 989199112, 995754553, 995754557, 998100773, 998582596, 1001682227, 1002897238, 1005026102, 1007267340, 1018029509, 1019292109, 1021170671, 1021615491, 1027478448, 1027904949, 1028176876, 1028524011, 1033544761, 1037073656, 1039464298, 1041396131, 1043364491, 1051084878, 1053049944, 1055328538, 1055480209, 1058862972, 1066609925, 1068948457, 1071874351, 1072134738, 1082834847, 1084511341, 1087693738, 1089012798, 1089634494, 1093384439, 1093825560, 1094815391, 1098082937, 1102471353, 1113642022, 1113846049, 1121249692, 1127953536, 1132317159, 1132485954, 1132585385, 1132689597, 1132723356, 1132858392, 1133501028, 1133636064, 1134046361, 1134351151, 1134824033, 1135467502, 1135737574, 1135775689, 1136782059, 1136883336, 1137085890, 1137173922, 1138138823, 1138714596, 1139072942, 1139153897, 1139221159, 1139981182, 1140405028, 1140510661, 1141246959, 1141280718, 1141381995, 1141584549, 1141719585, 1141874653, 1142159541, 1142193300, 1142260818, 1142366610, 1144440814, 1144457023, 1144667374, 1144802410, 1144975561, 1145579956, 1145625081, 1147135141, 1147314976, 1148184718, 1148522564, 1149131059, 1150514349, 1150729533, 1151393172, 1151494449, 1153073825, 1154465661, 1155177503, 1156094385, 1156940664, 1158572559, 1160038984, 1160487168, 1161167906, 1161578459, 1161965872, 1162013821, 1163255421, 1163472226, 1163645377, 1163777146, 1163979700, 1164916562, 1165010690, 1165068597, 1165937726, 1165940993, 1166410608, 1167096330, 1167193469, 1167260731, 1167598577, 1169823858, 1170720439, 1171147706, 1171150005, 1180230175, 1180849387, 1188216287, 1188228500, 1188701654, 1190334387, 1190352716, 1190641324, 1202600586, 1206718941, 1209302133, 1214814043, 1216095517, 1220486075, 1223892937, 1224444732, 1225577971, 1229986049, 1243738793, 1247471306, 1252266596, 1252792940, 1253960230, 1254127330, 1255848785, 1255859538, 1257563663, 1257583343, 1258195056, 1258213434, 1262993336, 1263908042, 1265512654, 1267283463, 1278475387, 1281229947, 1281889125, 1284797630, 1288585218, 1290240457, 1290513099, 1293031053, 1295516865, 1297095740, 1297597617, 1298827289, 1298832842, 1299380998, 1300818337, 1304310342, 1304455504, 1310534169, 1316956180, 1336232039, 1337809090, 1340075459, 1343684265, 1347737800, 1348149256, 1354685816, 1355025196, 1357282216, 1357301365, 1363667295, 1364395531, 1364732891, 1373278040, 1373514813, 1373685873, 1375205051, 1375419602, 1376146087, 1380234474, 1380513046, 1381723825, 1382632688, 1382645602, 1382709874, 1386126578, 1388184353, 1389190819, 1389902309, 1389912616, 1390104485, 1390958270, 1391687090, 1391699393, 1393151104, 1395748391, 1395924208, 1397018707, 1397022500, 1397827261, 1398423514, 1400330808, 1401462671, 1410284129, 1411428439, 1412479074, 1412717811, 1412831927, 1420822802, 1423109435, 1423890423, 1424552007, 1425040900, 1428131728, 1431817030, 1431897749, 1433480127, 1433483767, 1434457973, 1451286836, 1451565010, 1452211848, 1452224159, 1455851258, 1458060161, 1458176029, 1458620255, 1463365872, 1466302404, 1472319400, 1475303091, 1484355552, 1486115226, 1486401243, 1489893113, 1490054949, 1492145100, 1494001659, 1494630697, 1494690535, 1494695213, 1494714660, 1494714786, 1494714930, 1494889015, 1494990523, 1494992680, 1494997876, 1495466906, 1500014997, 1502962162, 1504548128, 1505655813, 1508029184, 1508045454, 1509815249, 1518807662, 1524160328, 1529373691, 1536802563, 1538089784, 1539586715, 1544812783, 1547140470, 1552392687, 1552405115, 1552405169, 1553111822, 1553462237, 1554120313, 1554158027, 1555241094, 1555436471, 1555595989, 1556675361, 1557492455, 1557696008, 1558835738, 1558865070, 1559582938, 1559928005, 1561078602, 1565016185, 1565113430, 1565407826, 1568314306, 1568314316, 1568317266, 1568696751, 1568699472, 1568940804, 1569248185, 1570879860, 1573625992, 1573800670, 1576869802, 1581247153, 1581398717, 1581675892, 1581718434, 1583510121, 1583803496, 1588886160, 1595292826, 1602148307, 1605015374, 1609481646, 1612153257, 1618209596, 1618218864, 1618873873, 1619384363, 1624861042, 1630153983, 1638526919, 1639454708, 1640524262, 1641042489, 1641812886, 1647303548, 1648240296, 1650468220, 1650500409, 1651513056, 1658862087, 1658979753, 1661301475, 1667470132, 1667473335, 1667728240, 1667806132, 1677105623, 1680875001, 1680882207, 1681660610, 1685495090, 1685495093, 1685495270, 1685495398, 1688394353, 1688567575, 1688665455, 1688778883, 1690751126, 1691125863, 1693300755, 1694472929, 1703388735, 1709297356, 1709313729, 1712511978, 1715661089, 1717927392, 1718114956, 1721373840, 1722360575, 1724823399, 1726408681, 1726606395, 1726645504, 1732927910, 1736066754, 1740486766, 1742215384, 1745377406, 1758824175, 1758930481, 1758975612, 1759122505, 1759143730, 1759227293, 1759313682, 1759313685, 1759412017, 1759432510, 1759498975, 1759505228, 1759507354, 1759515800, 1759642661, 1759864276, 1759893786, 1760159824, 1763810143, 1766750547, 1769211545, 1769618102, 1772590156, 1775156822, 1780760274, 1783870720, 1784406502, 1786353732, 1793007575, 1811810046, 1815656403, 1816569647, 1816866992, 1822574126, 1822868024, 1822868031, 1823268852, 1823275309, 1823288115, 1823390804, 1823768300, 1833535991, 1842420860, 1844031908, 1844296341, 1844524436, 1844853963, 1845272265, 1845433501, 1850725233, 1851761689, 1851765614, 1852766386, 1853687691, 1854177922, 1861204803, 1863593250, 1872674263, 1872992134, 1873841021, 1877281407, 1877305076, 1881597618, 1884316146, 1886743174, 1887188539, 1892879921, 1905997196, 1912353097, 1916296381, 1919640688, 1919643810, 1924325687, 1935798204, 1935801369, 1935813711, 1935815187, 1935818499, 1941710024, 1944260378, 1945210145, 1951157591, 1955955663, 1957378415, 1957388660, 1957444069, 1958153525, 1958153878, 1962799016, 1964448624, 1967235715, 1967514117, 1968334692, 1970709900, 1974828022, 1977445003, 1980811473, 1981302481, 1984866213, 1986874949, 1987285901, 1987558613, 1988913069, 1998855379, 2023930736, 2026542768, 2029442974, 2029502301, 2031253491, 2041190670, 2044176332, 2044519717, 2044521677, 2044845895, 2044862336, 2050748464, 2055299797, 2059226128, 2060744697, 2060874008, 2061631935, 2062602594, 2062613436, 2062713055, 2062721365, 2062782118, 2064194523, 2064289093, 2064667157, 2064835977, 2065546931, 2065580690, 2065783508, 2066019598, 2067177842, 2067640249, 2068518016, 2068619301, 2069026672, 2069773511, 2070805664, 2073324624, 2075547993, 2076314666, 2076760108, 2076927096, 2078661044, 2080078919, 2080126248, 2080270176, 2080768362, 2080948565, 2081049148, 2081811414, 2082081519, 2083365940, 2084275182, 2089789238, 2090043919, 2090165361, 2090287045, 2092471497, 2092773191, 2093281591, 2093290649, 2093484170, 2095261287, 2096596043, 2096775591, 2100685312, 2102866955, 2108433077, 2109903284, 2110249550, 2112026046, 2112754908, 2114424326, 2115251185, 2116737470, 2118764990, 2119510407, 2120903194, 2121183749, 2121530494, 2121539444, 2122085862, 2123968241, 2123974461, 2124038667, 2126585211, 2127702833, 2127711196, 2129393172, 2140172366, 2141043403, 2144163444, 2144352359, 2146552134, 2146559400, 2146579609, 2146771534, 2146787712, 2147192784, 2149214372, 2150227387, 2151276842, 2152677197, 2158829447, 2159124528, 2159550475, 2161337980, 2161361535, 2163722410, 2163917836, 2165826914, 2169168320, 2170868227, 2173022808, 2174751247, 2179048400, 2184998274, 2196541409, 2200622033, 2203412941, 2206322353, 2208794483, 2219653172, 2219657520, 2225010953, 2226828879, 2238722895, 2238722920, 2238723506, 2245936247, 2248375230, 2249276550, 2249625301, 2254065144, 2254179087, 2254183431, 2254275149, 2254449430, 2254449877, 2255178054, 2264880989, 2270863210, 2290294367, 2304704334, 2304866355, 2305219189, 2310350875, 2310486036, 2312897274, 2314773060, 2315564905, 2319231065, 2319463533, 2325240383, 2327016339, 2330482855, 2337919027, 2340169455, 2359883328, 2361871491, 2366081778, 2369823335, 2369831600, 2371523459, 2372759050, 2374977123, 2376431395, 2378889732, 2382890223, 2383755454, 2386589953, 2387052696, 2389856295, 2391789782, 2398718314, 2399324290, 2400888860, 2401211408, 2404756392, 2406557074, 2407241140, 2409418646, 2411497922, 2411691127, 2413846222, 2413908037, 2414944572, 2415208709, 2417936111, 2419639306, 2423159152, 2423360684, 2425978408, 2428076111, 2437572023, 2440527060, 2444775143, 2449407487, 2457428534, 2469735934, 2475146676, 2475744613, 2476033552, 2476112212, 2476147614, 2477393954, 2478803388, 2479415778, 2482075359, 2485317413, 2485370363, 2488499588, 2488699734, 2491415998, 2492607180, 2493496209, 2497515972, 2499072481, 2499532790, 2504383993, 2504870149, 2505121421, 2505147736, 2513647314, 2513693640, 2513701512, 2513706827, 2521253655, 2521398855, 2526527953, 2526528078, 2527291586, 2527292245, 2527666001, 2528098475, 2536669081, 2536933437, 2537106090, 2538335365, 2541170503, 2541170604, 2541177518, 2545965593, 2546249066, 2546819122, 2548278991, 2548782015, 2549421379, 2557808039, 2557863700, 2558865115, 2568950385, 2569073380, 2569341502, 2569405925, 2570837952, 2575053435, 2575619554, 2575627585, 2579451785, 2581687876, 2582936524, 2586547509, 2590439971, 2600983050, 2602643559, 2605946857, 2608238576, 2608504686, 2611889973, 2612202111, 2619739935, 2621175072, 2627204334, 2627570013, 2627677159, 2631480810, 2631901285, 2635187702, 2637430468, 2638897207, 2639751704, 2642390316, 2644459471, 2644532855, 2644906311, 2645171587, 2647433605, 2647443463, 2649904288, 2651288351, 2652440186, 2655263134, 2660229222, 2660362019, 2662714632, 2671981072, 2673085999, 2676359415, 2678218950, 2680015310, 2683201101, 2683726243, 2687071289, 2687546085, 2689958531, 2690565794, 2691049537, 2696922944, 2702278755, 2705586928, 2707450736, 2708750293, 2710694053, 2710777678, 2717039465, 2719746264, 2719953243, 2722365346, 2724396360, 2730361077, 2732178535, 2732249147, 2732255792, 2732453216, 2732465831, 2733162785, 2733179003, 2740913336, 2743326046, 2745816408, 2746770100, 2768031559, 2768594053, 2769743066, 2770453396, 2777301260, 2777413063, 2779047561, 2779131760, 2781151044, 2788878449, 2791114477, 2792266216, 2795123222, 2795130739, 2795148393, 2803000277, 2803220098, 2820015673, 2824852881, 2825063248, 2825297984, 2826183623, 2826618777, 2828159974, 2830840737, 2840364717, 2844137461, 2844192015, 2844331414, 2844474265, 2845536368, 2847702680, 2847708560, 2849875839, 2854691117, 2857021867, 2857111846, 2857167445, 2857291628, 2857718467, 2857718874, 2859609075, 2860369035, 2860944275, 2861234828, 2861431296, 2861773187, 2862323803, 2862729831, 2862789186, 2862818280, 2865000297, 2865536587, 2872917161, 2879220442, 2885591219, 2886256228, 2886266660, 2886337850, 2886340600, 2886347487, 2886358758, 2886559394, 2888553420, 2893735969, 2893987517, 2894277589, 2895201770, 2895970159, 2903889952, 2904798808, 2907566289, 2911967032, 2913775681, 2917443420, 2921648360, 2921994283, 2925162127, 2925540459, 2931480722, 2936112276, 2938485423, 2939997155, 2941295122, 2942568797, 2944555176, 2950549599, 2952067971, 2952072562, 2955690120, 2961421753, 2962144430, 2962519996, 2962841785, 2964270344, 2964373735, 2965548040, 2966852375, 2970298080, 2974400461, 2975755381, 2981996158, 2987922608, 2991195167, 2991625994, 2993771546, 2995901561, 3000958971, 3001281849, 3001388716, 3004478994, 3004479027, 3004479111, 3004479159, 3004479171, 3004479184, 3004479190, 3004479239, 3004479240, 3004479258, 3004479289, 3004479305, 3004479323, 3004479334, 3004479373, 3004479389, 3004479390, 3004479401, 3004479425, 3004479785, 3004479787, 3004479818, 3004479829, 3004479837, 3004479976, 3004479994, 3004480114, 3005847375, 3006723884, 3006726944, 3006727797, 3006731179, 3006737252, 3006744684, 3006811183, 3012299493, 3014399025, 3019017018, 3019072181, 3019996757, 3020108825, 3020133371, 3020188532, 3023885513, 3024558034, 3024589567, 3024626538, 3024644720, 3033483503, 3034109278, 3035739007, 3035887950, 3044634578, 3044797796, 3044821749, 3045244983, 3045788419, 3045876876, 3046124074, 3046256428, 3050244615, 3050333064, 3050334784, 3056297406, 3062281966, 3063798750, 3063849681, 3073445035, 3073797863, 3073848296, 3086119708, 3087786680, 3089398889, 3089451715, 3089454054, 3089461994, 3089735415, 3094552970, 3097888413, 3098875466, 3099276787, 3104375123, 3104503715, 3105798493, 3107144912, 3107146953, 3110631110, 3110681545, 3111601102, 3111601746, 3111606786, 3114815727, 3119543502, 3119594433, 3120807553, 3120857998, 3122897068, 3125786613, 3128821880, 3133975234, 3135838657, 3136281421, 3145164732, 3147940006, 3154068140, 3154152867, 3157412719, 3157501664, 3159380027, 3160589879, 3161016478, 3161897203, 3164181610, 3174437714, 3180245112, 3180300610, 3182786585, 3183126568, 3183293814, 3183325319, 3184294753, 3188347051, 3191217062, 3196370198, 3197567695, 3198643172, 3198783739, 3198824989, 3198841920, 3198930383, 3199640352, 3200095506, 3203439089, 3203573947, 3203579445, 3208441350, 3209729826, 3210506925, 3210514725, 3210570457, 3214383466, 3214394316, 3214653823, 3215790970, 3217760577, 3218901480, 3218928718, 3218996674, 3218997101, 3219339071, 3219427268, 3220535722, 3220543483, 3221757640, 3223098753, 3224727829, 3232284385, 3232339054, 3234508143, 3234559072, 3235473148, 3237969392, 3243142044, 3247991594, 3253953941, 3269910681, 3270985722, 3273573836, 3273628995, 3275986591, 3277061645, 3277112578, 3277868236, 3277980164, 3278129999, 3278154322, 3280832255, 3280992609, 3283017533, 3286262047, 3290414111, 3301409832, 3301494567, 3302526185, 3302610918, 3305712858, 3305866028, 3305950755, 3309540327, 3309590022, 3309595898, 3309596203, 3309660560, 3309660597, 3309937069, 3312550946, 3312639405, 3317007142, 3317095593, 3324397363, 3331028046, 3331525682, 3331580349, 3331802213, 3332642035, 3332696700, 3333929978, 3334870005, 3334920442, 3335058344, 3335315569, 3343940221, 3345496201, 3350023967, 3353092349, 3358586999, 3365687143, 3366763202, 3368167300, 3371155980, 3372842751, 3373802982, 3374003367, 3374007861, 3374013921, 3374033257, 3374071862, 3374072315, 3374075119, 3374222601, 3374506623, 3377952754, 3382868701, 3384928690, 3388197033, 3390931348, 3391051206, 3391063809, 3391068622, 3391334282, 3391402631, 3391423133, 3391432603, 3392425741, 3394879910, 3395277647, 3399311251, 3402270417, 3404440519, 3414226886, 3414277321, 3415566709, 3417045783, 3417060092, 3418683074, 3418733517, 3424453774, 3431921225, 3437307073, 3437430868, 3437705452, 3444401619, 3445590826, 3447374472, 3456431399, 3458638240, 3461359920, 3463272868, 3468986640, 3469121667, 3471246134, 3474393156, 3474446194, 3476056250, 3478543821, 3486841411, 3486906847, 3489097968, 3491201265, 3495569706, 3496705474, 3497897502, 3497994843, 3498252682, 3502149957, 3504414102, 3504826781, 3506839508, 3506948350, 3508950458, 3509210745, 3509498189, 3511959565, 3512025010, 3512493029, 3514111400, 3517669498, 3518790968, 3521920341, 3523035738, 3523862571, 3524226140, 3530307622, 3530358057, 3536335853, 3536792162, 3538712404, 3541452460, 3541507619, 3542648636, 3544416242, 3550676375, 3551025439, 3553383951, 3556498831, 3561501051, 3561585780, 3565016796, 3565023071, 3565174365, 3565227623, 3565288856, 3566089568, 3572109810, 3575114019, 3577841990, 3586425916, 3589694483, 3591020567, 3592221649, 3594125448, 3595182758, 3596128381, 3602035250, 3602533630, 3602552275, 3604829927, 3607233834, 3607322789, 3607604079, 3608554389, 3610981370, 3617629034, 3619761411, 3623812162, 3629877419, 3636237811, 3636292476, 3639577654, 3639632313, 3645953597, 3647523178, 3649784978, 3653883892, 3660676457, 3664234276, 3674197367, 3675513627, 3681233287, 3684650455, 3688377898, 3689406359, 3692544695, 3693437133, 3694959415, 3703294733, 3704443907, 3704956777, 3706490306, 3709178884, 3709268355, 3709272958, 3717182590, 3718660896, 3719413702, 3721853564, 3731122282, 3734934472, 3736397122, 3736397691, 3738359136, 3744502996, 3744505315, 3744515994, 3744516038, 3745225898, 3745403285, 3749377655, 3751498613, 3752631559, 3753565240, 3756319792, 3758308501, 3758308691, 3761682835, 3762386667, 3762488637, 3763193356, 3763904751, 3764062969, 3764739038, 3769398133, 3770065529, 3774076759, 3779092995, 3780318738, 3781089827, 3783201212, 3785420602, 3786786081, 3788364543, 3791375542, 3791430201, 3791912060, 3792007260, 3792147146, 3793208754, 3794029235, 3805317549, 3808957225, 3809652473, 3811984999, 3812594538, 3819295903, 3819351056, 3821104144, 3821104746, 3829518367, 3832811824, 3833121835, 3833171090, 3833706374, 3838812042, 3843969806, 3844552031, 3850681433, 3851222744, 3851541567, 3851602009, 3851679807, 3853676291, 3855415829, 3856249405, 3859110665, 3859972063, 3862928629, 3865386916, 3865396334, 3873108359, 3873163016, 3876524049, 3883472548, 3885986978, 3888196487, 3895773227, 3898366596, 3900605466, 3900796753, 3906034907, 3907036333, 3914330405, 3916906002, 3922403377, 3925982068, 3933039724, 3936549300, 3939824482, 3940957272, 3941201834, 3941535714, 3943160335, 3943296300, 3950173236, 3955179593, 3959867562, 3960938237, 3961299015, 3961303520, 3961836502, 3962329360, 3963273426, 3966271140, 3969493837, 3970184201, 3971378905, 3972349404, 3972404563, 3974206923, 3977375686, 3977639927, 3981851856, 3984175284, 3984369770, 3984383153, 3984388901, 3984577838, 3986753035, 3987449768, 3988320676, 3989122328, 3989124781, 3989300792, 3991957101, 3991978776, 3992246021, 3993156440, 3995285601, 4002046206, 4002059123, 4002298131, 4007368305, 4009075902, 4012314248, 4014272956, 4018800601, 4021398623, 4022152923, 4023242992, 4034787018, 4034837957, 4040007159, 4040507273, 4040558214, 4042630615, 4042667369, 4044815570, 4044899805, 4046325025, 4051504220, 4051593171, 4059166898, 4059387372, 4060969098, 4060986772, 4062588735, 4063625944, 4063736412, 4064813411, 4074640059, 4077930265, 4080197122, 4081731399, 4081736449, 4081740860, 4081761692, 4082508192, 4082648933, 4085037592, 4085499470, 4085741867, 4086206754, 4087477773, 4087974431, 4087975312, 4087977986, 4087982672, 4087983230, 4087984585, 4087984590, 4087988411, 4087993231, 4087993234, 4087993291, 4087993428, 4089941093, 4090379779, 4094838531, 4095533224, 4098180267, 4104794847, 4104808845, 4105491350, 4105500480, 4109580593, 4111598640, 4115797781, 4116207257, 4116258198, 4116322118, 4116406345, 4116912946, 4122262153, 4126221625, 4127308650, 4128209898, 4128210099, 4128224738, 4128228031, 4128452341, 4131804567, 4131859224, 4137741343, 4141029933, 4142953920, 4145022541, 4149201544, 4150566897, 4151710650, 4152474623, 4155185738, 4156445644, 4157556469, 4157644922, 4159136925, 4159401066, 4159780211, 4159864444, 4164601660, 4166043368, 4168091484, 4169450331, 4170161097, 4170579962, 4170925049, 4171014006, 4171016671, 4171029715, 4172482250, 4175353143, 4176008925, 4178981053, 4184703759, 4186748423, 4188894668, 4189635776, 4190045706, 4190142208, 4195146068, 4196943735, 4199824850, 4203521301, 4206809827, 4206944958, 4207535653, 4208164707, 4211585807, 4215346074, 4215356593, 4218114605, 4218115138, 4218132009, 4219656584, 4219999876, 4220379359, 4221957810, 4222018626, 4225873997, 4227433758, 4228171984, 4228217908, 4228360888, 4228368741, 4228368760, 4231583294, 4231662792, 4232149414, 4232629512, 4234942237, 4235762280, 4240864861, 4241320459, 4241740950, 4242647335, 4243702915, 4245105172, 4246629902, 4248741847, 4252833472, 4252840599, 4254781707, 4254799704, 4255058051, 4260594638, 4261873154, 4261894730, 4262104449, 4262374147, 4262375371, 4262499171, 4264253465, 4265048576, 4267292711, 4271528787, 4272039260, 4272350188, 4272417877, 4276136562, 4288066094, 223, 76317054, 134757519, 142022835, 149084067, 244603010, 255553804, 263431316, 265459661, 284810646, 289494951, 371032970, 373243562, 387545720, 391377589, 415171548, 415171976, 418990556, 418990602, 425807660, 435420269, 461226423, 483976516, 501379566, 531625563, 590191545, 595217502, 649854972, 714686602, 717942499, 720960146, 720974524, 720974736, 720975995, 793535325, 806495002, 862847657, 871542102, 893771636, 914855142, 931438088, 937200556, 1015486168, 1026348750, 1213136917, 1220725895, 1220852957, 1222628504, 1230410191, 1326192098, 1338160975, 1374669131, 1374800320, 1401511709, 1467196671, 1493005045, 1506058569, 1507763651, 1523142552, 1591300266, 1636446087, 1641166031, 1642384128, 1679485164, 1681545174, 1704277516, 1714538458, 1768636249, 1818263278, 1833750850, 1834601376, 1867401367, 1936236019, 1978039580, 1997464432, 2017904725, 2080694907, 2086814061, 2123843096, 2170766397, 2174442073, 2233637259, 2305877279, 2307152224, 2316307169, 2335588857, 2337430377, 2419834458, 2517521888, 2585317679, 2631335866, 2737177336, 2757711981, 2796817467, 2816464305, 2872823135, 2876785673, 2876785759, 2913059937, 2924726497, 2938670220, 2939089089, 3071839865, 3079506072, 3079929644, 3116612793, 3164097381, 3234391576, 3234432745, 3278041418, 3278041816, 3334769994, 3375261606, 3410106074, 3456106742, 3461071037, 3593285841, 3641486132, 3666061454, 3666061458, 3666061568, 3666061577, 3666061585, 3666061591, 3666061602, 3666061610, 3666061613, 3666061619, 3666061666, 3666061672, 3666061702, 3666061706, 3666061732, 3666061760, 3666061781, 3666061825, 3666061864, 3666061891, 3666061895, 3666061896, 3666061902, 3666061903, 3666061913, 3666062029, 3666062293, 3666062299, 3666062326, 3666062331, 3666062345, 3666062357, 3666062361, 3666062379, 3666062386, 3666062390, 3666062391, 3666062394, 3666062408, 3666062418, 3666062422, 3666062427, 3666062453, 3666062517, 3666062569, 3666062581, 3666062582, 3666062586, 3666062587, 3676644409, 3676644411, 3676644421, 3676644429, 3676644442, 3676644586, 3676644600, 3676644610, 3676644643, 3676644706, 3676644759, 3676644775, 3676644800, 3676644806, 3676644819, 3676644874, 3676644887, 3676644888, 3676644905, 3676644939, 3676644953, 3676644982, 3676645005, 3676645006, 3676645021, 3676645049, 3676645073, 3684315096, 3691777760, 3697941178, 3710369155, 3772863442, 3793240332, 3798969166, 3800169971, 3845152461, 3847111189, 3861225221, 3872238039, 3916589493, 3949265042, 3967179311, 4020468984, 4098608917, 4098609219, 4098704176, 4098704230, 4098775844, 4098776178, 4098815877, 4098816211, 4114558119, 4127380674, 4160021452, 4259920717, 4263023754, 4268562148, 0, 0, 0, 2, 343511425, 4233599295, 5, 989615076, 1348282182, 2372695675, 2793429742, 3711109639, 30, 134752460, 310748895, 373240553, 387546555, 528158848, 771634050, 771637032, 1557499238, 1836295865, 1964668429, 2086817070, 2368015199, 2707054618, 2757714990, 2842899363, 2889802328, 2938675535, 2942499160, 3250117513, 3577832733, 3577832874, 3789613664, 3804622433, 3847110230, 3927045026, 3974478460, 3994206764, 3994206767, 4103392506, 4197651626, 0, 0, 0, 0, 0, 17, 181602757, 495318858, 804592434, 820388681, 838060561, 871806992, 1942164974, 2253530761, 2307427283, 2356867634, 2454582508, 2478294033, 2645305307, 3415553447, 3505446608, 3710380917, 4196008531]);

/**
 * Find `elt` in `arr` between indices `start` (included) and `end` (excluded)
 * using a binary search algorithm.
 */
function binSearch(arr, elt, start, end) {
    if (start >= end) {
        return false;
    }
    var low = start;
    var high = end - 1;
    while (low <= high) {
        var mid = (low + high) >>> 1;
        var midVal = arr[mid];
        if (midVal < elt) {
            low = mid + 1;
        }
        else if (midVal > elt) {
            high = mid - 1;
        }
        else {
            return true;
        }
    }
    return false;
}
// Packed hash algorithm makes use of a rolling hash to lookup suffixes. To
// avoid having to allocate an array to store them at every invocation, we
// create one global one that can be reused.
var BUFFER = new Uint32Array(20);
/**
 * Iterate on hashes of labels from `hostname` backward (from last label to
 * first label), stopping after `maximumNumberOfLabels` have been extracted and
 * calling `cb` on each of them.
 *
 * The `maximumNumberOfLabels` argument is typically used to specify the number
 * of labels seen in the longest public suffix. We do not need to check further
 * in very long hostnames.
 */
function hashHostnameLabelsBackward(hostname, maximumNumberOfLabels) {
    var hash = 5381;
    var index = 0;
    // Compute hash backward, label per label
    for (var i = hostname.length - 1; i >= 0; i -= 1) {
        var code = hostname.charCodeAt(i);
        // Process label
        if (code === 46 /* '.' */) {
            BUFFER[index << 1] = hash >>> 0;
            BUFFER[(index << 1) + 1] = i + 1;
            index += 1;
            if (index === maximumNumberOfLabels) {
                return index;
            }
        }
        // Update hash
        hash = (hash * 33) ^ code;
    }
    // Let's not forget about last label
    BUFFER[index << 1] = hash >>> 0;
    BUFFER[(index << 1) + 1] = 0;
    index += 1;
    return index;
}
/**
 * Perform a public suffix lookup for `hostname` using the packed hashes
 * data-structure. The `options` allows to specify if ICANN/PRIVATE sections
 * should be considered. By default, both are.
 *
 */
function suffixLookup(hostname, options, out) {
    if (fastPathLookup(hostname, options, out) === true) {
        return;
    }
    var allowIcannDomains = options.allowIcannDomains, allowPrivateDomains = options.allowPrivateDomains;
    // Keep track of longest match
    var matchIndex = -1;
    var matchKind = 0 /* NO_MATCH */;
    var matchLabels = 0; // Keep track of number of labels currently matched
    // Index in the packed array data-structure
    var index = 1;
    var numberOfHashes = hashHostnameLabelsBackward(hostname, packed[0] /* maximumNumberOfLabels */);
    for (var label = 0; label < numberOfHashes; label += 1) {
        var hash = BUFFER[label << 1];
        var labelStart = BUFFER[(label << 1) + 1];
        // For each label, matching proceeds in the following way:
        //
        //  1. check exceptions
        //  2. check wildcards
        //  3. check normal rules
        //
        // For each of these, we also perform the lookup in two parts, once for
        // the ICANN section and one for the PRIVATE section. Both of which are
        // optional and can be enabled/disabled using the `options` argument.
        //
        // We start with exceptions because if an exception is found, we do not
        // need to continue matching wildcards or normal rules; the exception will
        // always have priority.
        //
        // Similarly, if we find a wildcard match, we do not need to check the
        // rules for the same label as the wildcard match is always longer (one
        // more label is matched).
        //
        // **WARNING**: the structure of this code follows exactly the structure
        // of the packed data structure as create in ./bin/builders/hashes.js
        var match = 0 /* NO_MATCH */;
        // ========================================================================
        // Lookup exceptions
        // ========================================================================
        // ICANN
        if (allowIcannDomains === true) {
            match = binSearch(packed, hash, index + 1, index + packed[index] + 1)
                ? 1 /* ICANN_MATCH */ | 4 /* EXCEPTION_MATCH */
                : 0 /* NO_MATCH */;
        }
        index += packed[index] + 1;
        // PRIVATE
        if (allowPrivateDomains === true && match === 0 /* NO_MATCH */) {
            match = binSearch(packed, hash, index + 1, index + packed[index] + 1)
                ? 2 /* PRIVATE_MATCH */ | 4 /* EXCEPTION_MATCH */
                : 0 /* NO_MATCH */;
        }
        index += packed[index] + 1;
        // ========================================================================
        // Lookup wildcards
        // ========================================================================
        // ICANN
        if (allowIcannDomains === true &&
            match === 0 /* NO_MATCH */ &&
            (matchKind & 4 /* EXCEPTION_MATCH */) === 0) {
            match = binSearch(packed, hash, index + 1, index + packed[index] + 1)
                ? 16 /* WILDCARD_MATCH */ | 1 /* ICANN_MATCH */
                : 0 /* NO_MATCH */;
        }
        index += packed[index] + 1;
        // PRIVATE
        if (allowPrivateDomains === true &&
            match === 0 /* NO_MATCH */ &&
            (matchKind & 4 /* EXCEPTION_MATCH */) === 0) {
            match = binSearch(packed, hash, index + 1, index + packed[index] + 1)
                ? 16 /* WILDCARD_MATCH */ | 2 /* PRIVATE_MATCH */
                : 0 /* NO_MATCH */;
        }
        index += packed[index] + 1;
        // ========================================================================
        // Lookup rules
        // ========================================================================
        // ICANN
        if (allowIcannDomains === true &&
            match === 0 /* NO_MATCH */ &&
            (matchKind & 4 /* EXCEPTION_MATCH */) === 0 &&
            matchLabels <= label) {
            match = binSearch(packed, hash, index + 1, index + packed[index] + 1)
                ? 8 /* NORMAL_MATCH */ | 1 /* ICANN_MATCH */
                : 0 /* NO_MATCH */;
        }
        index += packed[index] + 1;
        // PRIVATE
        if (allowPrivateDomains === true &&
            match === 0 /* NO_MATCH */ &&
            (matchKind & 4 /* EXCEPTION_MATCH */) === 0 &&
            matchLabels <= label) {
            match = binSearch(packed, hash, index + 1, index + packed[index] + 1)
                ? 8 /* NORMAL_MATCH */ | 2 /* PRIVATE_MATCH */
                : 0 /* NO_MATCH */;
        }
        index += packed[index] + 1;
        // If we found a match, the longest match that is being tracked for this
        // hostname. We need to remember which kind of match it was (exception,
        // wildcard, normal rule), the index where the suffix starts in `hostname`
        // as well as the number of labels contained in this suffix (this is
        // important to make sure that we always keep the longest match if there
        // are both a wildcard and a normal rule matching).
        if (match !== 0 /* NO_MATCH */) {
            matchKind = match;
            matchLabels = label + ((match & 16 /* WILDCARD_MATCH */) !== 0 ? 2 : 1);
            matchIndex = labelStart;
        }
    }
    out.isIcann = (matchKind & 1 /* ICANN_MATCH */) !== 0;
    out.isPrivate = (matchKind & 2 /* PRIVATE_MATCH */) !== 0;
    // No match found
    if (matchIndex === -1) {
        out.publicSuffix = numberOfHashes === 1 ? hostname : hostname.slice(BUFFER[1]);
        return;
    }
    // If match is an exception, this means that we need to count less label.
    // For example, exception rule !foo.com would yield suffix 'com', so we need
    // to locate the next dot and slice from there.
    if ((matchKind & 4 /* EXCEPTION_MATCH */) !== 0) {
        out.publicSuffix = hostname.slice(BUFFER[((matchLabels - 2) << 1) + 1]);
        return;
    }
    // If match is a wildcard, we need to match one more label. If wildcard rule
    // was *.com, we would have stored only 'com' in the packed structure and we
    // need to take one extra label on the left.
    if ((matchKind & 16 /* WILDCARD_MATCH */) !== 0) {
        out.publicSuffix =
            matchLabels >= numberOfHashes
                ? hostname
                : hostname.slice(BUFFER[((matchLabels - 1) << 1) + 1]);
        return;
    }
    // if ((matchKind & Result.NORMAL_MATCH) !== 0)
    // For normal match, we just slice the hostname at the beginning of suffix.
    out.publicSuffix = hostname.slice(matchIndex);
}

function parse(url, options) {
    if (options === void 0) { options = {}; }
    return parseImpl(url, 5 /* ALL */, suffixLookup, options, getEmptyResult());
}

function makeTrie(codebook) {
    var node = { chars: {}, code: undefined };
    for (var i = 0; i < codebook.length; i += 1) {
        var tok = codebook[i];
        var root = node;
        for (var j = 0; j < tok.length; j += 1) {
            var c = tok[j];
            if (root.chars[c] === undefined) {
                root.chars[c] = { chars: {}, code: undefined };
            }
            root = root.chars[c];
        }
        root.code = i;
    }
    return node;
}

var EMPTY_STRING = '';
var EMPTY_UINT8_ARRAY = new Uint8Array(0);
var Smaz = (function () {
    function Smaz(codebook) {
        this.buffer = new Uint8Array(30000);
        this.verbatim = new Uint8Array(255);
        this.codebook = codebook;
        this.trie = makeTrie(codebook);
    }
    Smaz.prototype.compress = function (str) {
        var compressedSize = this.inplaceCompress(str);
        if (compressedSize === 0) {
            return EMPTY_UINT8_ARRAY;
        }
        return this.buffer.slice(0, compressedSize);
    };
    Smaz.prototype.UNSAFE_compress = function (str) {
        var compressedSize = this.inplaceCompress(str);
        if (compressedSize === 0) {
            return EMPTY_UINT8_ARRAY;
        }
        return this.buffer.subarray(0, compressedSize);
    };
    Smaz.prototype.decompress = function (arr) {
        if (arr.byteLength === 0) {
            return EMPTY_STRING;
        }
        var output = EMPTY_STRING;
        var i = 0;
        while (i < arr.byteLength) {
            if (arr[i] === 254) {
                output += String.fromCharCode(arr[i + 1]);
                i += 2;
            }
            else if (arr[i] === 255) {
                output += String.fromCharCode.apply(null, arr.subarray(i + 2, i + arr[i + 1] + 2));
                i += arr[i + 1] + 2;
            }
            else {
                output += this.codebook[arr[i]];
                i += 1;
            }
        }
        return output;
    };
    Smaz.prototype.getCompressedSize = function (str) {
        if (str.length === 0) {
            return 0;
        }
        var bufferIndex = 0;
        var verbatimIndex = 0;
        var inputIndex = 0;
        while (inputIndex < str.length) {
            var indexAfterMatch = -1;
            var code = -1;
            var root = this.trie;
            for (var j = inputIndex; j < str.length; j += 1) {
                root = root.chars[str[j]];
                if (root === undefined) {
                    break;
                }
                if (root.code !== undefined) {
                    code = root.code;
                    indexAfterMatch = j + 1;
                }
            }
            if (code === -1) {
                verbatimIndex++;
                inputIndex++;
                if (verbatimIndex === 255) {
                    bufferIndex += 2 + verbatimIndex;
                    verbatimIndex = 0;
                }
            }
            else {
                if (verbatimIndex !== 0) {
                    bufferIndex += 2 + (verbatimIndex === 1 ? 0 : verbatimIndex);
                    verbatimIndex = 0;
                }
                bufferIndex++;
                inputIndex = indexAfterMatch;
            }
        }
        if (verbatimIndex !== 0) {
            bufferIndex += 2 + (verbatimIndex === 1 ? 0 : verbatimIndex);
            verbatimIndex = 0;
        }
        return bufferIndex;
    };
    Smaz.prototype.inplaceCompress = function (str) {
        if (str.length === 0) {
            return 0;
        }
        var bufferIndex = 0;
        var verbatimIndex = 0;
        var inputIndex = 0;
        while (inputIndex < str.length) {
            var indexAfterMatch = -1;
            var code = -1;
            var root = this.trie;
            for (var j = inputIndex; j < str.length; j += 1) {
                root = root.chars[str[j]];
                if (root === undefined) {
                    break;
                }
                if (root.code !== undefined) {
                    code = root.code;
                    indexAfterMatch = j + 1;
                }
            }
            if (code === -1) {
                this.verbatim[verbatimIndex++] = str.charCodeAt(inputIndex++);
                if (verbatimIndex === 255) {
                    bufferIndex = this.flushVerbatim(verbatimIndex, bufferIndex);
                    verbatimIndex = 0;
                }
            }
            else {
                if (verbatimIndex !== 0) {
                    bufferIndex = this.flushVerbatim(verbatimIndex, bufferIndex);
                    verbatimIndex = 0;
                }
                this.buffer[bufferIndex++] = code;
                inputIndex = indexAfterMatch;
            }
        }
        if (verbatimIndex !== 0) {
            bufferIndex = this.flushVerbatim(verbatimIndex, bufferIndex);
        }
        return bufferIndex;
    };
    Smaz.prototype.flushVerbatim = function (verbatimIndex, bufferIndex) {
        if (verbatimIndex === 1) {
            this.buffer[bufferIndex++] = 254;
            this.buffer[bufferIndex++] = this.verbatim[0];
        }
        else {
            this.buffer[bufferIndex++] = 255;
            this.buffer[bufferIndex++] = verbatimIndex;
            for (var k = 0; k < verbatimIndex; k += 1) {
                this.buffer[bufferIndex++] = this.verbatim[k];
            }
        }
        return bufferIndex;
    };
    return Smaz;
}());

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
/* tslint:disable */
var cosmeticSelectorCodebook = [
    "abort-on-property-read.js, app_vars.force_disable_adblock",
    "abort-current-inline-script.js, ",
    "abort-on-property-read.js, ",
    "abort-on-property-write.js, ",
    "cookie",
    "addEventListener-defuser.js, ",
    "a[href^=\"http://",
    "setTimeout-defuser.js, ",
    "ontainer",
    "div[style=\"background: #FFFFE1; border-bottom: 1px solid #A0A0A0; padding: 10px;line-height: 1.4em; text-align: justify; font-family: sans-serif; font-size: 12px;\"]",
    "set-constant.js, ",
    "social",
    "[href^=\"https://",
    "U",
    "7",
    "(",
    "*",
    "9",
    "?",
    "4",
    "O",
    "L",
    "F",
    "H",
    "E",
    "N",
    "window.open-defuser.js",
    "div[style=\"",
    "8",
    "banner",
    "notification",
    "newsletter",
    "D",
    "[cellspacing=\"0\"][cellpadding=\"0\"][border=\"0\"]",
    "^",
    "I",
    "T",
    ")",
    "Cookie",
    "S",
    "share",
    "wrapper",
    "R",
    "document.getElementById, ",
    "_",
    "Math, zfgloaded",
    "5",
    ";",
    "h",
    "j",
    "[",
    "g",
    "]",
    "y",
    "/",
    ":",
    "u",
    "m",
    "0",
    "f",
    "v",
    "k",
    "x",
    "w",
    "2",
    " ",
    "P",
    "ad",
    "q",
    "A",
    "B",
    "er",
    "facebook",
    "document.oncontextmenu",
    "decodeURIComponent",
    "content",
    "widget",
    "/^(?:click|mousedown|mousemove|touchstart|touchend|touchmove)$/, system.popund",
    "block",
    "sponsor",
    "bottom",
    "3",
    "background-color:",
    "article",
    "ight",
    "c",
    "[width=\"",
    "consent",
    "sidebar",
    "1",
    "subscribe",
    "d",
    "message",
    "in",
    "remove-attr.js, oncontextmenu",
    "aopr, app_vars.force_disable_",
    "button",
    "privacy",
    ":first-child:last-child",
    "[href=\"http://",
    "aopr, document.dispatchEvent",
    "b",
    "google",
    "policy",
    "tion",
    "[target=\"_blank\"]",
    "div[class^=\"",
    "width:",
    "/^(?:click|mousedown)$/, _0x",
    ".com/",
    "ar",
    "background",
    "[style=\"",
    "Date.prototype.toUTCStr",
    ":not(body):not(html)",
    "tisement",
    ":first-child",
    "top",
    "text-align:",
    "\"]",
    "notice",
    "foot",
    "300x250",
    "follow",
    "disclaim",
    "popup",
    "nowebrtc.js",
    "BlockDetected",
    "le",
    "[href*=\"",
    "on",
    "0px;",
    "box",
    "twitt",
    "ent",
    "div[id^=\"",
    "al",
    "accept",
    "st",
    "s-",
    "[href^=\"",
    "[data-",
    "re",
    "ic",
    "bab-defus",
    "puShown , /doOpen|popundr/",
    "AaDetector",
    "signup",
    "#",
    "Message",
    "an",
    "div",
    "lay",
    "ide",
    "te",
    ", noopFunc",
    "promo",
    "page",
    "skyscrap",
    "ol",
    "he",
    "or",
    " > ",
    "Ad",
    "#ctl00_",
    "www.",
    "C",
    "float",
    "gdpr",
    "Facebook",
    "rap",
    "se",
    "media",
    "frame",
    "G",
    ", true",
    "o",
    "=\"",
    "lo",
    "mod",
    "M",
    "op",
    "om",
    "6",
    "ac",
    "a",
    "s_",
    "728x90",
    "t-",
    "dummy.js",
    "n",
    "ti",
    "decodeURI, ",
    "ed",
    "ubscri",
    "[class",
    "http://",
    "email",
    "youtube",
    "00",
    "px;",
    "nextFunc",
    "r",
    "id",
    "img",
    "Soci",
    ":not(body)",
    "p",
    "Disclaim",
    "affilia",
    "https://",
    "tab",
    "en",
    "z",
    "ma",
    ", ",
    "ou",
    "de",
    "to",
    "l",
    "t",
    "i",
    "la",
    "is",
    "Box",
    "down",
    "like",
    "Accept",
    "et",
    "Info",
    "e",
    "__",
    "nav",
    "-",
    "s",
    "it",
    "e-",
    "el",
    "px ",
    "il",
    ": ",
    " + ",
    "featu",
    "ot",
    "ig",
    ".m",
    "ov",
    "new",
    "W",
    "g-",
    ".j",
    "cript",
    ".",
    "tr"
];

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
/* tslint:disable */
var networkCSPCodebook = [
    "script-src 'self' *.leadpages.net *.gstatic.com *.google.com *.googleapis.com *.playwire.com *.facebook.com *.bootstrapcdn.com *.twitter.com *.spot.im",
    "script-src 'self' *.leadpages.net *.gstatic.com *.google.com *.googleapis.com *.playwire.com *.facebook.com *.bootstrapcdn.com",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' data: *.gstatic.com *.google-analytics.com *.google.com *.solvemedia.com *.scorecardresearch.com *.googletagmanager.com *.googletagservices.com; child-s",
    "script-src 'self' *.gstatic.com *.google.com *.googleapis.com *.facebook.com *.bootstrapcdn.com *.twitter.com *.spot.im",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' data: *.google.com *.gstatic.com *.google-analytics.com *.jwpcdn.com *.twimg.com *.twitter.com *.hydrax.net *.facebook.com *.googleapis.com *.facebook.n",
    "script-src 'self' * 'unsafe-inline'",
    "script-src 'self' 'unsafe-inline'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' data: *.air.tv *.b2c.com *.chartbeat.com *.cheezburger.com *.chzbgr.com *.complex.com *.facebook.net *.google-analytics.com *.google.com *.gstatic.com *",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' data: *.youtube.com *.ytimg.com *.google-analytics.com *.facebook.net *.complex.com *.b2c.com *.chartbeat.com *.chzbgr.com *.scorecardresearch.com *.air",
    "script-src 'self' 'unsafe-eval' http: https: data: blob: mediastream: filesystem:",
    " 'unsafe-eval' *.googletagservices.com *.wp.com *.air.tv *.addthis.com *.cloudflare.com *.facebook.net *.facebook.com *.gstatic.com *.youtube.com *.ytimg.com *.google.com *.googletagmanager.com",
    " 'unsafe-eval' data: blob: *.fbcdn.net *.gstatic.com *.google.com *.facebook.com *.disquscdn.com *.twitter.com https://disqus.com *.addthis.com *.facebook.net *.disqus.com *.kiss-anime.tv",
    " 'unsafe-eval' data: *.facebook.com *.searchiq.co *.cloudflare.com *.gstatic.com *.facebook.net *.google-analytics.com *.googletagmanager.com *.google.com *.googleapis.com *.twitter.com",
    " 'unsafe-eval' data: blob: *.google.com *.facebook.com *.google-analytics.com *.googleapis.com *.gstatic.com *.facebook.net *.disquscdn.com https://disqus.com *.disqus.com",
    " data: *.fbcdn.net *.facebook.com *.google-analytics.com *.facebook.net *.bwwstatic.com *.addthis.com *.cloudflare.com *.fontawesome.com *.onesignal.com *.googleapis.com",
    ".instagram *.newrelic.com *.optimizely.com *.quantcount.com *.quantserve.com *.scorecardresearch.com *.spot.im *.twitter.com *.youtube.com *.ytimg.com",
    " 'unsafe-eval' *.chatango.com *.disqus.com *.disquscdn.com *.facebook.net *.google-analytics.com *.googleapis.com *.jquery.com",
    " 'unsafe-eval' data: *.cloudflare.com *.google.com *.addthis.com *.addthisedge.com *.facebook.net *.twitter.com *.jquery.com",
    "child-src 'none';frame-src *;worker-src 'none';",
    " 'unsafe-eval' data: *.google.com *.gstatic.com *.google-analytics.com",
    " *.google-analytics.com *.cloudflare.com *.gstatic.com *.google.com *.solvemedia.com",
    " 'unsafe-eval' data: *.jwplatform.com *.jwpcdn.com *.googletagmanager.com *.google-analytics.com *.tickcounter.com",
    " 'unsafe-eval' data: *.zencdn.net *.fontawesome.com *.cloudflare.com *.googletagmanager.com *.bootstrapcdn.com",
    " 'unsafe-eval' data: *.facebook.net *.facebook.com *.google-analytics.com *.googletagmanager.com *.google.com",
    "script-src 'self' * blob: data:",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' data: *.googletagservices.com *.google-analytics.com",
    " 'unsafe-eval' data: *.jwpcdn.com *.gstatic.com *.googletagmanager.com *.addthis.com *.google.com",
    " 'unsafe-eval' data: *.googleapis.com *.scorecardresearch.com *.disqus.com *.google-analytics.com",
    ".tv *.quantserve.com *.optimizely.com *.cheezburger.com *.quantcount.com *.newrelic.com *.spot.im",
    " 'unsafe-eval' data: *.googleapis.com *.cloudflare.com *.bootstrapcdn.com *.google-analytics.com",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' data: *.statcounter.com *.google-analytics.com",
    "worker-src 'none'",
    " 'unsafe-eval' data: https://disqus.com *.disqus.com *.google-analytics.com *.disquscdn.com",
    " 'unsafe-eval' data: *.google.com *.gstatic.com",
    "rc 'self' *.solvemedia.com *.gstatic.com *.google.com",
    " 'unsafe-eval' data: *.gstatic.com *.google-analytics.com *.google.com *.cloudflare.com",
    " 'unsafe-eval' data: *.cloudflare.com *.google-analytics.com *.addthis.com *.query.com",
    "script-src http: https: 'self' * 'unsafe-inline'",
    " 'unsafe-eval' data: *.bootstrapcdn.com *.cloudflare.com *.google-analytics.com",
    " *.disquscdn.com *.facebook.net *.twitter.com disqus.com",
    " 'unsafe-eval' data: *.facebook.com *.pinterest.com *.google-analytics.com",
    " 'unsafe-eval' data: disqus.com *.disqus.com disquscdn.com *.disquscdn.com",
    " 'unsafe-eval' data: blob: *.peer5.com *.jwpcdn.com *.googletagmanager.com",
    " *.gstatic.com *.google.com *.googleapis.com",
    " 'unsafe-eval' data: *.gstatic.com *.google.com *.googletagmanager.com",
    "child-src 'self' *.camvideos.org *.cwtvembeds.com; script-src 'self' *",
    "script-src 'self' * disquscdn.com 'unsafe-inline'",
    " data: *.google.com *.google-analytics.com *.scorecardresearch.com",
    " data: *.bootstrapcdn.com *.googleapis.com *.google-analytics.com",
    "connect-src 'self' *.twitter.com *.disqus.com https://disqus.com",
    " 'unsafe-eval' data: *.googletagmanager.com *.cloudflare.com",
    "default-src 'self' 'unsafe-inline' 'unsafe-eval';img-src *",
    " 'unsafe-eval' data: *.facebook.com *.googletagmanager.com",
    " data: *.gstatic.com *.google-analytics.com *.google.com",
    " data: *.fbcdn.net *.facebook.com *.google-analytics.com",
    " 'unsafe-eval' blob: *.googletagmanager.com *.amung.us",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' data:",
    " 'unsafe-eval' *.alotporn.com *.google-analytics.com",
    " *.cloudflare.com *.googleapis.com *.jsdelivr.net",
    "script-src 'unsafe-inline' 'unsafe-eval' data: *",
    "child-src 'self' *.onesignal.com *.facebook.com",
    "script-src 'self' * data: blob: 'unsafe-eval'",
    "script-src 'self'",
    " *.solvemedia.com *.googletagmanager.com",
    "child-src 'none'; frame-src ",
    " *.google.com *.gstatic.com",
    " *.jquery.com *.google-analytics.com",
    "child-src 'none';frame-src 'self' *;",
    "default-src 'self' 'unsafe-inline'",
    " 'unsafe-eval' http: https: blob:",
    "style-src 'self' *",
    " 'unsafe-eval'",
    " hcaptcha.com *.hcaptcha.com",
    "script-src * 'unsafe-inline'",
    "child-src 'self'",
    " http: https: blob:",
    " *.4cdn.org *.4channel.org",
    "et *.iomovies.info",
    " * blob: 'unsafe-inline'",
    "connect-src https: http:",
    " *.googleapis.com",
    " *.googletagmanager.com",
    " *.bootstrapcdn.com",
    "connect-src 'self'",
    " *.updatetube.com",
    " *.solvemedia.com",
    " http: https:",
    " data:",
    " *.yimg.com",
    "'self' *; ",
    "child-src",
    " blob:",
    " ; ",
    " *",
    "*; ",
    "o",
    ".",
    "c",
    " ",
    "s",
    "e",
    "t",
    "a",
    "i",
    "'",
    "r",
    "l",
    "*",
    "n",
    "m",
    "g",
    "p",
    "f",
    "-",
    "d",
    "u",
    "b",
    "w",
    "k",
    ":",
    "y",
    "v",
    "h",
    ";",
    "q",
    "j",
    "/",
    "z",
    "x",
    "4",
    "2",
    "5"
];

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
/* tslint:disable */
var networkFilterCodebook = [
    "/^https?:\\/\\/([0-9a-z\\-]+\\.)?(9anime|animeland|animenova|animeplus|animetoon|animewow|gamestorrent|goodanime|gogoanime|igg-games|kimcartoon|memecenter|readcomiconline|toonget|toonova|watchcartoononlin",
    "e)\\.[a-z]{2,4}\\/(?!([Ee]xternal|[Ii]mages|[Ss]cripts|[Uu]ploads|ac|ajax|assets|combined|content|cov|cover|(img\\/bg)|(img\\/icon)|inc|jwplayer|player|playlist-cat-rss|static|thumbs|wp-content|wp-include",
    "/images/",
    "/^(https?|wss?):\\/\\/([0-9a-z\\-]+\\.)?([0-9a-z\\-]+\\.)(accountant|bid|cf|club|cricket|date|download|faith|fun|ga|gdn|gq|loan|men|ml|network|ovh|party|pro|pw|racing|review|rocks|",
    "/wp-content/uploads/",
    "banner",
    "/\\.(accountant|bid|click|club|com|cricket|date|download|faith|link|loan|lol|men|online|party|racing|review|science|site|space|stream|top|trade|webcam|website|win|xyz|com)\\/(([0-9]{2,9})(\\.|\\/)(css|\\?)",
    "analytics",
    "/pagead/js/adsbygoogle.js",
    "/wp-content/plugins/",
    "/js/sdkloader/ima3.js",
    "tracking",
    "cookie",
    ".js",
    "/ad",
    "/ajax/libs/fuckadblock/*/fuckadblock",
    "social",
    "facebook",
    "/www-static/js/",
    "/cdn-cgi/pe/bag2?",
    "track",
    "/wp-content/",
    "s/",
    "newsletter",
    "er",
    "/^https?:\\/\\/.*\\.(info|pro|icu|app|xyz|app|pet|win|live|me|io|cc|pw|is|zone|bid|cf|ovh|site|review|ml|xyz)\\.*/",
    ".php",
    "^*/",
    "script",
    "google",
    ".gif",
    "affiliate",
    "ad",
    "share",
    "stat",
    "sponsor",
    "in",
    "widget",
    "con",
    "count",
    "/asset",
    "button",
    "/http://[a-zA-Z0-9]+\\.[a-z]+\\/.*(?:[!\"#$%&'()*+,:;<=>?@/\\^_`{|}~-]).*[a-zA-Z0-9]+/",
    "twitt",
    ".png",
    "ent",
    "impression",
    ".jpg",
    "/img/",
    "5",
    "notification",
    "\\/[0-9]{2,9}\\/$/",
    "video",
    ".html",
    "frame",
    "media",
    "/p",
    "youtube",
    "click",
    "log",
    "age",
    "re",
    "/",
    "/template",
    "300x250",
    "com",
    "ic",
    "tion",
    "/j",
    "block",
    "background",
    "ar",
    "te",
    "collect",
    "st",
    ".",
    "/uplo",
    "s",
    "lay",
    "le",
    "or",
    "view",
    "follow",
    "ixel",
    "a",
    "de",
    "ubscribe",
    ".aspx?",
    "an",
    "ro",
    "li",
    "et",
    ".swf",
    "/g",
    "al",
    "on",
    "i",
    "op",
    "/i",
    "e",
    "source",
    "visit",
    "/*",
    "728x90",
    "rivacy",
    "tisem",
    "foot",
    "/web",
    "/m",
    "en",
    "s_",
    "s-",
    "id=",
    "at",
    "160x600",
    "as",
    "it",
    "l",
    "ampaign",
    "right",
    "kyscrap",
    "\\",
    "ag",
    "8",
    "/d",
    "lu",
    "ch",
    "disclaim",
    "/e",
    "120x60",
    "am",
    "/w",
    "lo",
    "468x60",
    "si",
    "^*",
    "ac",
    "z",
    "9",
    "im",
    "ed",
    "home",
    "html",
    ".cgi?",
    "3",
    "ap",
    "sp",
    "heme",
    "?",
    "^",
    "0",
    "un",
    "how",
    ".m",
    "bo",
    "se",
    "*",
    "mo",
    "new",
    "up",
    "dpr",
    "4",
    "2",
    "00",
    "fault",
    "takeov",
    "web",
    "om",
    "ve",
    "il",
    "ub",
    "ol",
    "6",
    "ot",
    "jax",
    "v",
    "co",
    "ut",
    "-p",
    "/h",
    "ct",
    "o",
    "umblr",
    "ri",
    "d",
    "125x125",
    "type=",
    "us",
    "=",
    "7",
    "/r",
    "tn",
    "qu",
    "ig",
    "_p",
    "-",
    "x",
    "ava",
    "ss",
    ".htm",
    "gi-b",
    "tis",
    "id",
    "el",
    "http",
    "aff",
    "mp",
    "xt",
    "la",
    "/?",
    "iff/251",
    "ur",
    ".xml",
    "um",
    "y",
    "468",
    "g/",
    "20",
    "m",
    "g",
    "w",
    "-m",
    ":",
    "336x280",
    "q",
    "&",
    "728",
    "_",
    "*&",
    "down",
    "he",
    "h",
    "u",
    "k",
    "di",
    "c",
    "t",
    "60",
    "s?",
    "*/",
    "be",
    "ma",
    "j",
    "250",
    "fi",
    "sc",
    "1",
    "dn-cgi",
    "r",
    "e/",
    "p",
    "n",
    "f",
    "b"
];

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
/* tslint:disable */
var networkHostnameCodebook = [
    ".com",
    "pagead2.googlesyndication",
    "cloudfront.net",
    "doubleclick.net",
    ".net",
    "imasdk.googleapis",
    ".bid",
    "analytics",
    ".de",
    "er",
    "in",
    "media",
    "google",
    ".co.uk",
    "track",
    "cdnjs.cloudflare",
    "stat",
    "ad",
    "amazonaws",
    "or",
    "affiliate",
    "re",
    "on",
    "st",
    "an",
    "click",
    "traffic",
    "phncdn",
    "it",
    "count",
    "en",
    "ar",
    "at",
    "facebook",
    "s",
    "al",
    "et",
    "ic",
    "h",
    "ch",
    "es",
    "am",
    "cdn",
    "c",
    "lo",
    "video",
    "ro",
    "el",
    "im",
    "il",
    "as",
    "web",
    "is",
    "ed",
    "ag",
    ".ru",
    "to",
    "news",
    "ap",
    "ac",
    "us",
    "id",
    "e",
    "pl",
    "fo",
    "un",
    "ur",
    "ub",
    "b",
    "u",
    "w",
    "k",
    "l",
    "ho",
    "sp",
    "ex",
    "iv",
    "ec",
    "tr",
    "mo",
    "ig",
    "y",
    "th",
    "ay",
    "bo",
    "io",
    "po",
    "p",
    "em",
    "tv",
    "go",
    "ut",
    "do",
    "f",
    "ir",
    "o",
    "le",
    "ab",
    "ip",
    "au",
    "so",
    "se",
    "up",
    "v",
    "um",
    "av",
    "ak",
    "a",
    "ew",
    "iz",
    "ul",
    "sh",
    "ix",
    "g",
    "no",
    "af",
    "me",
    "ck",
    "az",
    "be",
    "my",
    "ep",
    "fr",
    "gr",
    "br",
    "if",
    "t",
    "ge",
    "ol",
    "fl",
    "ik",
    "te",
    "de",
    "sc",
    "bl",
    "op",
    "ts",
    "ie",
    "m",
    "yo",
    "cl",
    "ud",
    "pr",
    "qu",
    "sm",
    ".xyz",
    "ly",
    "2",
    "sy",
    "eu",
    "ld",
    "tw",
    "mp",
    "ib",
    "-",
    "i",
    "xx",
    "ok",
    "eb",
    "cr",
    "d",
    "di",
    "ey",
    "wn",
    ".p",
    "ot",
    "om",
    "ss",
    "ev",
    "tn",
    "aw",
    "ff",
    "ce",
    "hd",
    "jo",
    "ht",
    "jp",
    "yp",
    "ek",
    "dn",
    "ti",
    "uk",
    "sk",
    "j",
    "bu",
    "vi",
    "sn",
    "ll",
    "dr",
    "n",
    ".za",
    "e-",
    "1",
    "da",
    "sw",
    "sr",
    "su",
    "dd",
    "tm",
    ".b",
    "nd",
    "ve",
    "wp",
    "z",
    "x",
    "kr",
    "gg",
    "vo",
    "ks",
    "he",
    "4",
    "tu",
    "gu",
    "ef",
    "ax",
    "q",
    ".n",
    "wh",
    "yn",
    "sl",
    "9",
    "we",
    "ia",
    "cn",
    "dm",
    "zz",
    "ah",
    "7",
    "si",
    "bb",
    "24",
    "eo",
    ".1",
    "3",
    "cp",
    "db",
    ".",
    "ca",
    "fm",
    "6",
    "r",
    "li",
    "fe",
    "cc",
    ".s",
    "8",
    "5",
    "ty",
    ".m",
    "tk",
    "tl",
    "du",
    "ws",
    "0"
];

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
/* tslint:disable */
var networkRedirectCodebook = [
    "fuckadblock.js-3.2.0",
    "x2-transparent.png",
    "googlesyndication.com/adsbygoogle.js",
    "noopjs",
    "noopmp3-0.1s",
    "google-analytics.com/analytics.js",
    "1x1-transparent.gif",
    "googletagmanager.com/gtm.js",
    "noopmp4-1s",
    "ligatus.com/*/angular-tag.js",
    "amazon-adsystem.com/aax2/amzn_ads.js",
    "nooptext",
    "static.chartbeat.com/chartbeat.js",
    "widgets.outbrain.com/outbrain.js",
    "scorecardresearch.com/beacon.js",
    "google-analytics.com/cx/api.js",
    "addthis.com/addthis_widget.js",
    "32x32-transparent.png",
    "googletagservices.com/gpt.js",
    "google-analytics.com/ga.js",
    "hd-main.js",
    "noopframe",
    "silent-noeval.js",
    "popads-dummy.js",
    "fingerprint2.js",
    "popads.net.js",
    "noop.txt",
    "1x1.gif",
    "none",
    "o",
    "n",
    "p",
    "s",
    "j",
    ".",
    "a",
    "t",
    "-",
    "e",
    "m",
    "g",
    "r",
    "c",
    "1",
    "2",
    "x",
    "3",
    "l",
    "0",
    "d",
    "i",
    "k",
    "f",
    "b",
    "u",
    "/",
    "4",
    "y",
    "h",
    "*",
    "v",
    "_",
    "w",
    "z"
];

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
var Compression = /** @class */ (function () {
    function Compression() {
        this.cosmeticSelector = new Smaz(cosmeticSelectorCodebook);
        this.networkCSP = new Smaz(networkCSPCodebook);
        this.networkRedirect = new Smaz(networkRedirectCodebook);
        this.networkHostname = new Smaz(networkHostnameCodebook);
        this.networkFilter = new Smaz(networkFilterCodebook);
    }
    return Compression;
}());

/* crc32.js (C) 2014-present SheetJS -- http://sheetjs.com */
/* From: https://github.com/SheetJS/js-crc32/ */
var T = (function () {
    var c = 0;
    var table = new Int32Array(256);
    for (var n = 0; n !== 256; n += 1) {
        c = n;
        c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
        c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
        c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
        c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
        c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
        c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
        c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
        c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
        table[n] = c;
    }
    return table;
})();
function crc32(buf, start, end) {
    var C = 0 ^ -1;
    var L = end - 7;
    var i = start;
    while (i < L) {
        C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xff];
        C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xff];
        C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xff];
        C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xff];
        C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xff];
        C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xff];
        C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xff];
        C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xff];
    }
    while (i < L + 7) {
        C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xff];
    }
    return (C ^ -1) >>> 0;
}

/* ! Copyright Mathias Bynens <https://mathiasbynens.be/>
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/** Highest positive signed 32-bit float value */
var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
/** Bootstring parameters */
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; // '\x2D'
/** Regular expressions */
var regexNonASCII = /[^\0-\x7E]/; // non-ASCII chars
var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
var errors = {
    'invalid-input': 'Invalid input',
    'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
    'overflow': 'Overflow: input needs wider integers to process'
};
/** Convenience shortcuts */
var baseMinusTMin = base - tMin;
/*--------------------------------------------------------------------------*/
/**
 * A generic error utility function.
 * @private
 * @param {String} type The error type.
 * @returns {Error} Throws a `RangeError` with the applicable error message.
 */
function error(type) {
    throw new RangeError(errors[type]);
}
/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 * @see `punycode.ucs2.encode`
 * @see <https://mathiasbynens.be/notes/javascript-encoding>
 * @memberOf punycode.ucs2
 * @name decode
 * @param {String} string The Unicode input string (UCS-2).
 * @returns {Array} The new array of code points.
 */
function ucs2decode(str) {
    var output = [];
    var counter = 0;
    var length = str.length;
    while (counter < length) {
        var value = str.charCodeAt(counter++);
        if (value >= 0xd800 && value <= 0xdbff && counter < length) {
            // It's a high surrogate, and there is a next character.
            var extra = str.charCodeAt(counter++);
            if ((extra & 0xfc00) === 0xdc00) {
                // Low surrogate.
                output.push(((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000);
            }
            else {
                // It's an unmatched surrogate; only append this code unit, in case the
                // next code unit is the high surrogate of a surrogate pair.
                output.push(value);
                counter--;
            }
        }
        else {
            output.push(value);
        }
    }
    return output;
}
/**
 * Converts a basic code point into a digit/integer.
 * @see `digitToBasic()`
 * @private
 * @param {Number} codePoint The basic numeric code point value.
 * @returns {Number} The numeric value of a basic code point (for use in
 * representing integers) in the range `0` to `base - 1`, or `base` if
 * the code point does not represent a value.
 */
function basicToDigit(codePoint) {
    if (codePoint - 0x30 < 0x0a) {
        return codePoint - 0x16;
    }
    if (codePoint - 0x41 < 0x1a) {
        return codePoint - 0x41;
    }
    if (codePoint - 0x61 < 0x1a) {
        return codePoint - 0x61;
    }
    return base;
}
/**
 * Converts a digit/integer into a basic code point.
 * @see `basicToDigit()`
 * @private
 * @param {Number} digit The numeric value of a basic code point.
 * @returns {Number} The basic code point whose value (when used for
 * representing integers) is `digit`, which needs to be in the range
 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
 * used; else, the lowercase form is used. The behavior is undefined
 * if `flag` is non-zero and `digit` has no uppercase form.
 */
function digitToBasic(digit, flag) {
    //  0..25 map to ASCII a..z or A..Z
    // 26..35 map to ASCII 0..9
    return digit + 22 + 75 * (digit < 26 ? 1 : 0) - ((flag !== 0 ? 1 : 0) << 5);
}
/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 * @private
 */
function adapt(delta, numPoints, firstTime) {
    var k = 0;
    delta = firstTime ? Math.floor(delta / damp) : delta >> 1;
    delta += Math.floor(delta / numPoints);
    for (; /* no initialization */ delta > (baseMinusTMin * tMax) >> 1; k += base) {
        delta = Math.floor(delta / baseMinusTMin);
    }
    return Math.floor(k + ((baseMinusTMin + 1) * delta) / (delta + skew));
}
/**
 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
 * symbols.
 * @memberOf punycode
 * @param {String} input The Punycode string of ASCII-only symbols.
 * @returns {String} The resulting string of Unicode symbols.
 */
function decode(input) {
    // Don't use UCS-2.
    var output = [];
    var inputLength = input.length;
    var i = 0;
    var n = initialN;
    var bias = initialBias;
    // Handle the basic code points: let `basic` be the number of input code
    // points before the last delimiter, or `0` if there is none, then copy
    // the first basic code points to the output.
    var basic = input.lastIndexOf(delimiter);
    if (basic < 0) {
        basic = 0;
    }
    for (var j = 0; j < basic; ++j) {
        // if it's not a basic code point
        if (input.charCodeAt(j) >= 0x80) {
            error('not-basic');
        }
        output.push(input.charCodeAt(j));
    }
    // Main decoding loop: start just after the last delimiter if any basic code
    // points were copied; start at the beginning otherwise.
    for (var index = basic > 0 ? basic + 1 : 0; index < inputLength /* no final expression */;) {
        // `index` is the index of the next character to be consumed.
        // Decode a generalized variable-length integer into `delta`,
        // which gets added to `i`. The overflow checking is easier
        // if we increase `i` as we go, then subtract off its starting
        // value at the end to obtain `delta`.
        var oldi = i;
        for (var w = 1, k = base /* no condition */; ; k += base) {
            if (index >= inputLength) {
                error('invalid-input');
            }
            var digit = basicToDigit(input.charCodeAt(index++));
            if (digit >= base || digit > Math.floor((maxInt - i) / w)) {
                error('overflow');
            }
            i += digit * w;
            var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
            if (digit < t) {
                break;
            }
            var baseMinusT = base - t;
            if (w > Math.floor(maxInt / baseMinusT)) {
                error('overflow');
            }
            w *= baseMinusT;
        }
        var out = output.length + 1;
        bias = adapt(i - oldi, out, oldi === 0);
        // `i` was supposed to wrap around from `out` to `0`,
        // incrementing `n` each time, so we'll fix that now:
        if (Math.floor(i / out) > maxInt - n) {
            error('overflow');
        }
        n += Math.floor(i / out);
        i %= out;
        // Insert `n` at position `i` of the output.
        output.splice(i++, 0, n);
    }
    return String.fromCodePoint.apply(null, output);
}
/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 * @memberOf punycode
 * @param {String} input The string of Unicode symbols.
 * @returns {String} The resulting Punycode string of ASCII-only symbols.
 */
function encode(str) {
    var output = [];
    // Convert the input in UCS-2 to an array of Unicode code points.
    var input = ucs2decode(str);
    // Cache the length.
    var inputLength = input.length;
    // Initialize the state.
    var n = initialN;
    var delta = 0;
    var bias = initialBias;
    // Handle the basic code points.
    for (var i = 0; i < input.length; i += 1) {
        var currentValue = input[i];
        if (currentValue < 0x80) {
            output.push(String.fromCharCode(currentValue));
        }
    }
    var basicLength = output.length;
    var handledCPCount = basicLength;
    // `handledCPCount` is the number of code points that have been handled;
    // `basicLength` is the number of basic code points.
    // Finish the basic string with a delimiter unless it's empty.
    if (basicLength) {
        output.push(delimiter);
    }
    // Main encoding loop:
    while (handledCPCount < inputLength) {
        // All non-basic code points < n have been handled already. Find the next
        // larger one:
        var m = maxInt;
        for (var i = 0; i < input.length; i += 1) {
            var currentValue = input[i];
            if (currentValue >= n && currentValue < m) {
                m = currentValue;
            }
        }
        // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
        // but guard against overflow.
        var handledCPCountPlusOne = handledCPCount + 1;
        if (m - n > Math.floor((maxInt - delta) / handledCPCountPlusOne)) {
            error('overflow');
        }
        delta += (m - n) * handledCPCountPlusOne;
        n = m;
        for (var i = 0; i < input.length; i += 1) {
            var currentValue = input[i];
            if (currentValue < n && ++delta > maxInt) {
                error('overflow');
            }
            if (currentValue === n) {
                // Represent delta as a generalized variable-length integer.
                var q = delta;
                for (var k = base /* no condition */; ; k += base) {
                    var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
                    if (q < t) {
                        break;
                    }
                    var qMinusT = q - t;
                    var baseMinusT = base - t;
                    output.push(String.fromCharCode(digitToBasic(t + (qMinusT % baseMinusT), 0)));
                    q = Math.floor(qMinusT / baseMinusT);
                }
                output.push(String.fromCharCode(digitToBasic(q, 0)));
                bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
                delta = 0;
                ++handledCPCount;
            }
        }
        ++delta;
        ++n;
    }
    return output.join('');
}
/**
 * Converts a Unicode string representing a domain name or an email address to
 * Punycode. Only the non-ASCII parts of the domain name will be converted,
 * i.e. it doesn't matter if you call it with a domain that's already in
 * ASCII.
 * @memberOf punycode
 * @param {String} input The domain name or email address to convert, as a
 * Unicode string.
 * @returns {String} The Punycode representation of the given domain name or
 * email address.
 */
function toASCII(input) {
    // Avoid `split(regex)` for IE8 compatibility. See #17.
    var labels = input.replace(regexSeparators, '\x2E').split('.');
    var encoded = [];
    for (var i = 0; i < labels.length; i += 1) {
        encoded.push(regexNonASCII.test(labels[i]) ? 'xn--' + encode(labels[i]) : labels[i]);
    }
    return encoded.join('.');
}

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
var EMPTY_UINT8_ARRAY$1 = new Uint8Array(0);
var EMPTY_UINT32_ARRAY = new Uint32Array(0);
// Check if current architecture is little endian
var LITTLE_ENDIAN = new Int8Array(new Int16Array([1]).buffer)[0] === 1;
// Store compression in a lazy, global singleton
var COMPRESSION;
function getCompressionSingleton() {
    if (COMPRESSION === undefined) {
        COMPRESSION = new Compression();
    }
    return COMPRESSION;
}
function align4(pos) {
    // From: https://stackoverflow.com/a/2022194
    return (pos + 3) & ~0x03;
}
/**
 * This abstraction allows to serialize efficiently low-level values of types:
 * string, uint8, uint16, uint32, etc. while hiding the complexity of managing
 * the current offset and growing. It should always be instantiated with a
 * big-enough length because this will not allow for resizing. To allow
 * deciding the required total size, function estimating the size needed to
 * store different primitive values are exposes as static methods.
 *
 * This class is also more efficient than the built-in `DataView`.
 *
 * The way this is used in practice is that you write pairs of function to
 * serialize and deserialize a given structure/class (with code being pretty
 * symetrical). In the serializer you `pushX` values, and in the deserializer
 * you use `getX` functions to get back the values.
 */
var StaticDataView = /** @class */ (function () {
    function StaticDataView(buffer, _a) {
        var enableCompression = _a.enableCompression;
        if (LITTLE_ENDIAN === false) {
            // This check makes sure that we will not load the adblocker on a
            // big-endian system. This would not work since byte ordering is important
            // at the moment (mainly for performance reasons).
            throw new Error('Adblocker currently does not support Big-endian systems');
        }
        if (enableCompression === true) {
            this.enableCompression();
        }
        this.buffer = buffer;
        this.pos = 0;
    }
    /**
     * Return size of of a serialized byte value.
     */
    StaticDataView.sizeOfByte = function () {
        return 1;
    };
    /**
     * Return size of of a serialized boolean value.
     */
    StaticDataView.sizeOfBool = function () {
        return 1;
    };
    /**
     * Return number of bytes needed to serialize `array` Uint8Array typed array.
     *
     * WARNING: this only returns the correct size if `align` is `false`.
     */
    StaticDataView.sizeOfBytes = function (array, align) {
        return StaticDataView.sizeOfBytesWithLength(array.length, align);
    };
    /**
     * Return number of bytes needed to serialize `array` Uint8Array typed array.
     *
     * WARNING: this only returns the correct size if `align` is `false`.
     */
    StaticDataView.sizeOfBytesWithLength = function (length, align) {
        // Alignment is a tricky thing because it depends on the current offset in
        // the buffer at the time of serialization; which we cannot anticipate
        // before actually starting serialization. This means that we need to
        // potentially over-estimate the size (at most by 3 bytes) to make sure the
        // final size is at least equal or a bit bigger than necessary.
        return length + (align ? 3 : 0) + StaticDataView.sizeOfLength(length);
    };
    /**
     * Return number of bytes needed to serialize `str` ASCII string.
     */
    StaticDataView.sizeOfASCII = function (str) {
        return StaticDataView.sizeOfLength(str.length) + str.length;
    };
    /**
     * Return number of bytes needed to serialize `str` UTF8 string.
     */
    StaticDataView.sizeOfUTF8 = function (str) {
        var encoded = encode(str);
        return StaticDataView.sizeOfLength(encoded.length) + encoded.length;
    };
    /**
     * Return number of bytes needed to serialize `array`.
     */
    StaticDataView.sizeOfUint32Array = function (array) {
        return array.byteLength + StaticDataView.sizeOfLength(array.length);
    };
    StaticDataView.sizeOfNetworkRedirect = function (str, compression) {
        if (compression === true) {
            return StaticDataView.sizeOfBytesWithLength(getCompressionSingleton().networkRedirect.getCompressedSize(str), false);
        }
        return StaticDataView.sizeOfASCII(str);
    };
    StaticDataView.sizeOfNetworkHostname = function (str, compression) {
        if (compression === true) {
            return StaticDataView.sizeOfBytesWithLength(getCompressionSingleton().networkHostname.getCompressedSize(str), false);
        }
        return StaticDataView.sizeOfASCII(str);
    };
    StaticDataView.sizeOfNetworkCSP = function (str, compression) {
        if (compression === true) {
            return StaticDataView.sizeOfBytesWithLength(getCompressionSingleton().networkCSP.getCompressedSize(str), false);
        }
        return StaticDataView.sizeOfASCII(str);
    };
    StaticDataView.sizeOfNetworkFilter = function (str, compression) {
        if (compression === true) {
            return StaticDataView.sizeOfBytesWithLength(getCompressionSingleton().networkFilter.getCompressedSize(str), false);
        }
        return StaticDataView.sizeOfASCII(str);
    };
    StaticDataView.sizeOfCosmeticSelector = function (str, compression) {
        if (compression === true) {
            return StaticDataView.sizeOfBytesWithLength(getCompressionSingleton().cosmeticSelector.getCompressedSize(str), false);
        }
        return StaticDataView.sizeOfASCII(str);
    };
    /**
     * Create an empty (i.e.: size = 0) StaticDataView.
     */
    StaticDataView.empty = function (options) {
        return StaticDataView.fromUint8Array(EMPTY_UINT8_ARRAY$1, options);
    };
    /**
     * Instantiate a StaticDataView instance from `array` of type Uint8Array.
     */
    StaticDataView.fromUint8Array = function (array, options) {
        return new StaticDataView(array, options);
    };
    /**
     * Instantiate a StaticDataView with given `capacity` number of bytes.
     */
    StaticDataView.allocate = function (capacity, options) {
        return new StaticDataView(new Uint8Array(capacity), options);
    };
    /**
     * Return number of bytes needed to serialize `length`.
     */
    StaticDataView.sizeOfLength = function (length) {
        return length <= 127 ? 1 : 5;
    };
    StaticDataView.prototype.enableCompression = function () {
        this.compression = getCompressionSingleton();
    };
    StaticDataView.prototype.checksum = function () {
        return crc32(this.buffer, 0, this.pos);
    };
    StaticDataView.prototype.dataAvailable = function () {
        return this.pos < this.buffer.byteLength;
    };
    StaticDataView.prototype.setPos = function (pos) {
        this.pos = pos;
    };
    StaticDataView.prototype.getPos = function () {
        return this.pos;
    };
    StaticDataView.prototype.seekZero = function () {
        this.pos = 0;
    };
    StaticDataView.prototype.slice = function () {
        this.checkSize();
        return this.buffer.slice(0, this.pos);
    };
    StaticDataView.prototype.subarray = function () {
        if (this.pos === this.buffer.byteLength) {
            return this.buffer;
        }
        this.checkSize();
        return this.buffer.subarray(0, this.pos);
    };
    /**
     * Make sure that `this.pos` is aligned on a multiple of 4.
     */
    StaticDataView.prototype.align4 = function () {
        this.pos = align4(this.pos);
    };
    StaticDataView.prototype.set = function (buffer) {
        this.buffer = new Uint8Array(buffer);
        this.seekZero();
    };
    StaticDataView.prototype.pushBool = function (bool) {
        this.pushByte(Number(bool));
    };
    StaticDataView.prototype.getBool = function () {
        return Boolean(this.getByte());
    };
    StaticDataView.prototype.setByte = function (pos, byte) {
        this.buffer[pos] = byte;
    };
    StaticDataView.prototype.pushByte = function (octet) {
        this.pushUint8(octet);
    };
    StaticDataView.prototype.getByte = function () {
        return this.getUint8();
    };
    StaticDataView.prototype.pushBytes = function (bytes, align) {
        if (align === void 0) { align = false; }
        this.pushLength(bytes.length);
        if (align === true) {
            this.align4();
        }
        this.buffer.set(bytes, this.pos);
        this.pos += bytes.byteLength;
    };
    StaticDataView.prototype.getBytes = function (align) {
        if (align === void 0) { align = false; }
        var numberOfBytes = this.getLength();
        if (align === true) {
            this.align4();
        }
        var bytes = this.buffer.subarray(this.pos, this.pos + numberOfBytes);
        this.pos += numberOfBytes;
        return bytes;
    };
    /**
     * Allows row access to the internal buffer through a Uint32Array acting like
     * a view. This is used for super fast writing/reading of large chunks of
     * Uint32 numbers in the byte array.
     */
    StaticDataView.prototype.getUint32ArrayView = function (desiredSize) {
        // Round this.pos to next multiple of 4 for alignement
        this.align4();
        // Short-cut when empty array
        if (desiredSize === 0) {
            return EMPTY_UINT32_ARRAY;
        }
        // Create non-empty view
        var view = new Uint32Array(this.buffer.buffer, this.pos + this.buffer.byteOffset, desiredSize);
        this.pos += desiredSize * 4;
        return view;
    };
    StaticDataView.prototype.pushUint8 = function (uint8) {
        this.buffer[this.pos++] = uint8;
    };
    StaticDataView.prototype.getUint8 = function () {
        return this.buffer[this.pos++];
    };
    StaticDataView.prototype.pushUint16 = function (uint16) {
        this.buffer[this.pos++] = uint16 >>> 8;
        this.buffer[this.pos++] = uint16;
    };
    StaticDataView.prototype.getUint16 = function () {
        return ((this.buffer[this.pos++] << 8) | this.buffer[this.pos++]) >>> 0;
    };
    StaticDataView.prototype.pushUint32 = function (uint32) {
        this.buffer[this.pos++] = uint32 >>> 24;
        this.buffer[this.pos++] = uint32 >>> 16;
        this.buffer[this.pos++] = uint32 >>> 8;
        this.buffer[this.pos++] = uint32;
    };
    StaticDataView.prototype.getUint32 = function () {
        return ((((this.buffer[this.pos++] << 24) >>> 0) +
            ((this.buffer[this.pos++] << 16) |
                (this.buffer[this.pos++] << 8) |
                this.buffer[this.pos++])) >>>
            0);
    };
    StaticDataView.prototype.pushUint32Array = function (arr) {
        this.pushLength(arr.length);
        // TODO - use `set` to push the full buffer at once?
        for (var i = 0; i < arr.length; i += 1) {
            this.pushUint32(arr[i]);
        }
    };
    StaticDataView.prototype.getUint32Array = function () {
        var length = this.getLength();
        var arr = new Uint32Array(length);
        // TODO - use `subarray`?
        for (var i = 0; i < length; i += 1) {
            arr[i] = this.getUint32();
        }
        return arr;
    };
    StaticDataView.prototype.pushUTF8 = function (raw) {
        var str = encode(raw);
        this.pushLength(str.length);
        for (var i = 0; i < str.length; i += 1) {
            this.buffer[this.pos++] = str.charCodeAt(i);
        }
    };
    StaticDataView.prototype.getUTF8 = function () {
        var byteLength = this.getLength();
        this.pos += byteLength;
        return decode(String.fromCharCode.apply(null,
            // @ts-ignore
            this.buffer.subarray(this.pos - byteLength, this.pos)));
    };
    StaticDataView.prototype.pushASCII = function (str) {
        this.pushLength(str.length);
        for (var i = 0; i < str.length; i += 1) {
            this.buffer[this.pos++] = str.charCodeAt(i);
        }
    };
    StaticDataView.prototype.getASCII = function () {
        var byteLength = this.getLength();
        this.pos += byteLength;
        // @ts-ignore
        return String.fromCharCode.apply(null, this.buffer.subarray(this.pos - byteLength, this.pos));
    };
    StaticDataView.prototype.pushNetworkRedirect = function (str) {
        if (this.compression !== undefined) {
            this.pushBytes(this.compression.networkRedirect.compress(str));
        }
        else {
            this.pushASCII(str);
        }
    };
    StaticDataView.prototype.getNetworkRedirect = function () {
        if (this.compression !== undefined) {
            return this.compression.networkRedirect.decompress(this.getBytes());
        }
        return this.getASCII();
    };
    StaticDataView.prototype.pushNetworkHostname = function (str) {
        if (this.compression !== undefined) {
            this.pushBytes(this.compression.networkHostname.compress(str));
        }
        else {
            this.pushASCII(str);
        }
    };
    StaticDataView.prototype.getNetworkHostname = function () {
        if (this.compression !== undefined) {
            return this.compression.networkHostname.decompress(this.getBytes());
        }
        return this.getASCII();
    };
    StaticDataView.prototype.pushNetworkCSP = function (str) {
        if (this.compression !== undefined) {
            this.pushBytes(this.compression.networkCSP.compress(str));
        }
        else {
            this.pushASCII(str);
        }
    };
    StaticDataView.prototype.getNetworkCSP = function () {
        if (this.compression !== undefined) {
            return this.compression.networkCSP.decompress(this.getBytes());
        }
        return this.getASCII();
    };
    StaticDataView.prototype.pushNetworkFilter = function (str) {
        if (this.compression !== undefined) {
            this.pushBytes(this.compression.networkFilter.compress(str));
        }
        else {
            this.pushASCII(str);
        }
    };
    StaticDataView.prototype.getNetworkFilter = function () {
        if (this.compression !== undefined) {
            return this.compression.networkFilter.decompress(this.getBytes());
        }
        return this.getASCII();
    };
    StaticDataView.prototype.pushCosmeticSelector = function (str) {
        if (this.compression !== undefined) {
            this.pushBytes(this.compression.cosmeticSelector.compress(str));
        }
        else {
            this.pushASCII(str);
        }
    };
    StaticDataView.prototype.getCosmeticSelector = function () {
        if (this.compression !== undefined) {
            return this.compression.cosmeticSelector.decompress(this.getBytes());
        }
        return this.getASCII();
    };
    StaticDataView.prototype.checkSize = function () {
        if (this.pos !== 0 && this.pos > this.buffer.byteLength) {
            throw new Error("StaticDataView too small: " + this.buffer.byteLength + ", but required " + this.pos + " bytes");
        }
    };
    // Serialiez `length` with variable encoding to save space
    StaticDataView.prototype.pushLength = function (length) {
        if (length <= 127) {
            this.pushUint8(length);
        }
        else {
            this.pushUint8(128);
            this.pushUint32(length);
        }
    };
    StaticDataView.prototype.getLength = function () {
        var lengthShort = this.getUint8();
        return lengthShort === 128 ? this.getUint32() : lengthShort;
    };
    return StaticDataView;
}());

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
var Config = /** @class */ (function () {
    function Config(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.debug, debug = _c === void 0 ? false : _c, _d = _b.enableCompression, enableCompression = _d === void 0 ? false : _d, _e = _b.enableHtmlFiltering, enableHtmlFiltering = _e === void 0 ? false : _e, _f = _b.enableMutationObserver, enableMutationObserver = _f === void 0 ? true : _f, _g = _b.enableOptimizations, enableOptimizations = _g === void 0 ? true : _g, _h = _b.integrityCheck, integrityCheck = _h === void 0 ? true : _h, _j = _b.loadCosmeticFilters, loadCosmeticFilters = _j === void 0 ? true : _j, _k = _b.loadGenericCosmeticsFilters, loadGenericCosmeticsFilters = _k === void 0 ? true : _k, _l = _b.loadNetworkFilters, loadNetworkFilters = _l === void 0 ? true : _l;
        this.debug = debug;
        this.enableCompression = enableCompression;
        this.enableHtmlFiltering = enableHtmlFiltering;
        this.enableMutationObserver = enableMutationObserver;
        this.enableOptimizations = enableOptimizations;
        this.integrityCheck = integrityCheck;
        this.loadCosmeticFilters = loadCosmeticFilters;
        this.loadGenericCosmeticsFilters = loadGenericCosmeticsFilters;
        this.loadNetworkFilters = loadNetworkFilters;
    }
    Config.deserialize = function (buffer) {
        return new Config({
            debug: buffer.getBool(),
            enableCompression: buffer.getBool(),
            enableHtmlFiltering: buffer.getBool(),
            enableMutationObserver: buffer.getBool(),
            enableOptimizations: buffer.getBool(),
            integrityCheck: buffer.getBool(),
            loadCosmeticFilters: buffer.getBool(),
            loadGenericCosmeticsFilters: buffer.getBool(),
            loadNetworkFilters: buffer.getBool()
        });
    };
    Config.prototype.getSerializedSize = function () {
        // NOTE: this should always be the number of attributes and needs to be
        // updated when `Config` changes.
        return 9 * StaticDataView.sizeOfBool();
    };
    Config.prototype.serialize = function (buffer) {
        buffer.pushBool(this.debug);
        buffer.pushBool(this.enableCompression);
        buffer.pushBool(this.enableHtmlFiltering);
        buffer.pushBool(this.enableMutationObserver);
        buffer.pushBool(this.enableOptimizations);
        buffer.pushBool(this.integrityCheck);
        buffer.pushBool(this.loadCosmeticFilters);
        buffer.pushBool(this.loadGenericCosmeticsFilters);
        buffer.pushBool(this.loadNetworkFilters);
    };
    return Config;
}());

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
/**
 * Add `callback` listener for `event` in `listeners` Map.
 */
function registerCallback(event, callback, listeners) {
    var listenersForEvent = listeners.get(event);
    if (listenersForEvent === undefined) {
        listenersForEvent = [];
        listeners.set(event, listenersForEvent);
    }
    listenersForEvent.push(callback);
}
/**
 * Remove `callback` listener for `event` from `listeners` Map.
 */
function unregisterCallback(event, callback, listeners) {
    var listenersForEvent = listeners.get(event);
    if (listenersForEvent !== undefined) {
        var indexOfCallback = listenersForEvent.indexOf(callback);
        if (indexOfCallback !== -1) {
            listenersForEvent.splice(indexOfCallback, 1);
        }
    }
}
/**
 * Call all registered listeners for `event` with `args` as arguments. Return
 * `true` if at least one callback was registered and `false` otherwise.
 */
function triggerCallback(event, args, listeners) {
    // Fast-path for cases where no listener is registered
    if (listeners.size === 0) {
        return false;
    }
    var listenersForEvent = listeners.get(event);
    if (listenersForEvent !== undefined) {
        setTimeout(function () {
            for (var i = 0; i < listenersForEvent.length; i += 1) {
                listenersForEvent[i].apply(listenersForEvent, __spread(args));
            }
        }, 0);
        return true;
    }
    return false;
}
/**
 * Simple and efficient `EventEmitter` abstraction (following conventions from
 * Node.js) allowing partially typed event emitting. The set of event names is
 * specified as a type parameter while instantiating the event emitter.
 */
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.onceListeners = new Map();
        this.onListeners = new Map();
    }
    /**
     * Register an event listener for `event`.
     */
    EventEmitter.prototype.on = function (event, callback) {
        registerCallback(event, callback, this.onListeners);
    };
    /**
     * Register an event listener for `event`; but only listen to first instance
     * of this event. The listener is automatically deleted afterwards.
     */
    EventEmitter.prototype.once = function (event, callback) {
        registerCallback(event, callback, this.onceListeners);
    };
    /**
     * Remove `callback` from list of listeners for `event`.
     */
    EventEmitter.prototype.unsubscribe = function (event, callback) {
        unregisterCallback(event, callback, this.onListeners);
        unregisterCallback(event, callback, this.onceListeners);
    };
    /**
     * Emit an event. Call all registered listeners to this event.
     */
    EventEmitter.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        triggerCallback(event, args, this.onListeners);
        if (triggerCallback(event, args, this.onceListeners) === true) {
            this.onceListeners["delete"](event);
        }
    };
    return EventEmitter;
}());

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
function fetchResource(fetch, url) {
    return fetch(url).then(function (response) { return response.text(); });
}
function fetchPrebuilt(fetch, configUrl, engineVersion) {
    return fetch(configUrl)
        .then(function (response) { return response.json(); })
        .then(function (allowedLists) { return fetch(allowedLists.engines[engineVersion].url); })
        .then(function (response) { return response.arrayBuffer(); })
        .then(function (buffer) { return new Uint8Array(buffer); });
}
// var adsLists = [
//     'https://easylist.to/easylist/easylist.txt',
//     'https://pgl.yoyo.org/adservers/serverlist.php?hostformat=adblockplus&showintro=0&mimetype=plaintext',
//     'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/annoyances.txt',
//     'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/badware.txt',
//     'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/filters.txt',
//     'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/resource-abuse.txt',
//     'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/unbreak.txt',
//     'https://easylist-downloads.adblockplus.org/easylistgermany.txt',
// ];
// var adsAndTrackingLists = __spread(adsLists, [
//     'https://easylist.to/easylist/easyprivacy.txt',
//     'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/privacy.txt',
// ]);
// var fullLists = __spread(adsAndTrackingLists, [
//     'https://easylist-downloads.adblockplus.org/fanboy-annoyance.txt',
//     'https://www.fanboy.co.nz/fanboy-cookiemonster.txt',
// ]);

var adsLists = [
    '../lists/ml_filterlist_script_domains.txt',
];
var adsAndTrackingLists = __spread(adsLists, [

]);
var fullLists = __spread(adsAndTrackingLists, [

]);

/**
 * Fetch latest version of enabledByDefault blocking lists.
 */
function fetchLists(fetch, urls) {
    return Promise.all(urls.map(function (url) { return fetchResource(fetch, url); }));
}
function getResourcesUrl(fetch) {
    return fetch('https://cdn.cliqz.com/adblocker/resources/ublock-resources/metadata.json')
        .then(function (response) { return response.json(); })
        .then(function (_a) {
            var revisions = _a.revisions;
            return "https://cdn.cliqz.com/adblocker/resources/ublock-resources/" + revisions[revisions.length - 1] + "/list.txt";
        });
}
/**
 * Fetch latest version of uBlock Origin's resources, used to inject scripts in
 * the page or redirect request to data URLs.
 */
function fetchResources(fetch) {
    return getResourcesUrl(fetch).then(function (url) { return fetchResource(fetch, url); });
}

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
function compactTokens(tokens) {
    var sorted = tokens.sort();
    var lastIndex = 1;
    for (var i = 1; i < sorted.length; i += 1) {
        if (sorted[lastIndex - 1] !== sorted[i]) {
            sorted[lastIndex++] = sorted[i];
        }
    }
    return sorted.subarray(0, lastIndex);
}
var EMPTY_UINT32_ARRAY$1 = new Uint32Array(0);
function concatTypedArrays(arrays) {
    if (arrays.length === 0) {
        return EMPTY_UINT32_ARRAY$1;
    }
    if (arrays.length === 1) {
        return arrays[0];
    }
    var totalSize = 0;
    for (var i = 0; i < arrays.length; i += 1) {
        totalSize += arrays[i].length;
    }
    var result = new Uint32Array(totalSize);
    var index = 0;
    for (var i = 0; i < arrays.length; i += 1) {
        var array = arrays[i];
        for (var j = 0; j < array.length; j += 1) {
            result[index] = array[j];
            index += 1;
        }
    }
    return result;
}

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
/**
 * Thin abstraction around a Uint32Array which allows to push tokens
 * whithout caring for the offset. It is used as a way to avoid multiple
 * allocations while calling tokenization (mostly beneficitial for
 * `NetworkFilter.getTokens()`).
 */
var TokensBuffer = /** @class */ (function () {
    function TokensBuffer(size) {
        this.size = size;
        this.pos = 0;
        this.buffer = new Uint32Array(size);
    }
    TokensBuffer.prototype.seekZero = function () {
        this.pos = 0;
    };
    TokensBuffer.prototype.slice = function () {
        if (this.pos !== 0 && this.pos > this.buffer.length) {
            throw new Error("StaticDataView too small: " + this.buffer.length + ", but required " + this.pos);
        }
        return this.buffer.slice(0, this.pos);
    };
    TokensBuffer.prototype.push = function (token) {
        this.buffer[this.pos++] = token;
    };
    return TokensBuffer;
}());

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
/***************************************************************************
 *  Bitwise helpers
 * ************************************************************************* */
// From: https://stackoverflow.com/a/43122214/1185079
function bitCount(n) {
    n = n - ((n >> 1) & 0x55555555);
    n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
    return (((n + (n >> 4)) & 0xf0f0f0f) * 0x1010101) >> 24;
}
function getBit(n, mask) {
    return !!(n & mask);
}
function setBit(n, mask) {
    return n | mask;
}
function clearBit(n, mask) {
    return n & ~mask;
}
function fastHashBetween(str, begin, end) {
    var hash = 5381;
    for (var i = begin; i < end; i += 1) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0;
}
function fastHash(str) {
    if (!str) {
        return 0;
    }
    return fastHashBetween(str, 0, str.length);
}
function hashStrings(strings) {
    var result = new Uint32Array(strings.length);
    for (var i = 0; i < strings.length; i += 1) {
        result[i] = fastHash(strings[i]);
    }
    return result;
}
// https://jsperf.com/string-startswith/21
function fastStartsWith(haystack, needle) {
    if (haystack.length < needle.length) {
        return false;
    }
    var ceil = needle.length;
    for (var i = 0; i < ceil; i += 1) {
        if (haystack[i] !== needle[i]) {
            return false;
        }
    }
    return true;
}
function fastStartsWithFrom(haystack, needle, start) {
    if (haystack.length - start < needle.length) {
        return false;
    }
    var ceil = start + needle.length;
    for (var i = start; i < ceil; i += 1) {
        if (haystack[i] !== needle[i - start]) {
            return false;
        }
    }
    return true;
}
// Efficient manuel lexer
function isDigit(ch) {
    // 48 == '0'
    // 57 == '9'
    return ch >= 48 && ch <= 57;
}
function isAlpha(ch) {
    // Force to lower-case
    ch |= 32;
    // 65 == 'A'
    // 90 == 'Z'
    return ch >= 97 && ch <= 122;
}
function isAlphaExtended(ch) {
    // 192 -> 450
    // À  Á  Â  Ã  Ä  Å  Æ  Ç  È  É  Ê  Ë  Ì  Í  Î  Ï  Ð  Ñ  Ò  Ó  Ô  Õ  Ö  ×  Ø
    // Ù  Ú  Û  Ü  Ý  Þ  ß  à  á  â  ã  ä  å  æ  ç  è  é  ê  ë  ì  í  î  ï  ð  ñ
    // ò  ó  ô  õ  ö  ÷  ø  ù  ú  û  ü  ý  þ  ÿ  Ā  ā  Ă  ă  Ą  ą  Ć  ć  Ĉ  ĉ  Ċ
    // ċ  Č  č  Ď  ď  Đ  đ  Ē  ē  Ĕ  ĕ  Ė  ė  Ę  ę  Ě  ě  Ĝ  ĝ  Ğ  ğ  Ġ  ġ  Ģ  ģ
    // Ĥ  ĥ  Ħ  ħ  Ĩ  ĩ  Ī  ī  Ĭ  ĭ  Į  į  İ  ı  Ĳ  ĳ  Ĵ  ĵ  Ķ  ķ  ĸ  Ĺ  ĺ  Ļ  ļ
    // Ľ  ľ  Ŀ  ŀ  Ł  ł  Ń  ń  Ņ  ņ  Ň  ň  ŉ  Ŋ  ŋ  Ō  ō  Ŏ  ŏ  Ő  ő  Œ  œ  Ŕ  ŕ
    // Ŗ  ŗ  Ř  ř  Ś  ś  Ŝ  ŝ  Ş  ş  Š  š  Ţ  ţ  Ť  ť  Ŧ  ŧ  Ũ  ũ  Ū  ū  Ŭ  ŭ  Ů
    // ů  Ű  ű  Ų  ų  Ŵ  ŵ  Ŷ  ŷ  Ÿ  Ź  ź  Ż  ż  Ž  ž  ſ  ƀ  Ɓ  Ƃ  ƃ  Ƅ  ƅ  Ɔ  Ƈ
    // ƈ  Ɖ  Ɗ  Ƌ  ƌ  ƍ  Ǝ  Ə  Ɛ  Ƒ  ƒ  Ɠ  Ɣ  ƕ  Ɩ  Ɨ  Ƙ  ƙ  ƚ  ƛ  Ɯ  Ɲ  ƞ  Ɵ  Ơ
    // ơ  Ƣ  ƣ  Ƥ  ƥ  Ʀ  Ƨ  ƨ  Ʃ  ƪ  ƫ  Ƭ  ƭ  Ʈ  Ư  ư  Ʊ  Ʋ  Ƴ  ƴ  Ƶ  ƶ  Ʒ  Ƹ  ƹ
    // ƺ  ƻ  Ƽ  ƽ  ƾ  ƿ  ǀ  ǁ  ǂ
    return ch >= 192 && ch <= 450;
}
function isCyrillic(ch) {
    // 1024 -> 1279
    // Ѐ Ё Ђ Ѓ Є Ѕ І Ї Ј Љ Њ Ћ Ќ Ѝ Ў Џ А Б В Г Д Е Ж З И Й К Л М Н О П Р С Т У Ф Х
    // Ц Ч Ш Щ Ъ Ы Ь Э Ю Я а б в г д е ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ы
    // ь э ю я ѐ ё ђ ѓ є ѕ і ї ј љ њ ћ ќ ѝ ў џ Ѡ ѡ Ѣ ѣ Ѥ ѥ Ѧ ѧ Ѩ ѩ Ѫ ѫ Ѭ ѭ Ѯ ѯ
    // Ѱ ѱ Ѳ ѳ Ѵ ѵ Ѷ ѷ Ѹ ѹ Ѻ ѻ Ѽ ѽ Ѿ ѿ Ҁ ҁ ҂ ҃ ҄ ҅ ҆ ҇ ҈ ҉ Ҋ ҋ Ҍ ҍ Ҏ ҏ Ґ ґ Ғ ғ Ҕ ҕ Җ җ Ҙ ҙ
    // Қ қ Ҝ ҝ Ҟ ҟ Ҡ ҡ Ң ң Ҥ ҥ Ҧ ҧ Ҩ ҩ Ҫ ҫ Ҭ ҭ Ү ү Ұ ұ Ҳ ҳ Ҵ ҵ Ҷ ҷ Ҹ ҹ Һ һ Ҽ ҽ Ҿ
    // ҿ Ӏ Ӂ ӂ Ӄ ӄ Ӆ ӆ Ӈ ӈ Ӊ ӊ Ӌ ӌ Ӎ ӎ ӏ Ӑ ӑ Ӓ ӓ Ӕ ӕ Ӗ ӗ Ә ә Ӛ ӛ Ӝ ӝ Ӟ ӟ Ӡ ӡ Ӣ ӣ Ӥ
    // ӥ Ӧ ӧ Ө ө Ӫ ӫ Ӭ ӭ Ӯ ӯ Ӱ ӱ Ӳ ӳ Ӵ ӵ Ӷ ӷ Ӹ ӹ Ӻ ӻ Ӽ ӽ Ӿ ӿ
    return ch >= 1024 && ch <= 1279;
}
function isAllowedFilter(ch) {
    return (isDigit(ch) || isAlpha(ch) || isAlphaExtended(ch) || isCyrillic(ch) || ch === 37 /* '%' */);
}
// Shared TokensBuffer used to avoid having to allocate many typed arrays
var TOKENS_BUFFER = new TokensBuffer(200);
function fastTokenizerNoRegex(pattern, isAllowedCode, skipFirstToken, skipLastToken, buffer) {
    var inside = false;
    var start = 0;
    var precedingCh = 0; // Used to check if a '*' is not just before a token
    for (var i = 0; i < pattern.length; i += 1) {
        var ch = pattern.charCodeAt(i);
        if (isAllowedCode(ch)) {
            if (inside === false) {
                inside = true;
                start = i;
                // Keep track of character preceding token
                if (i > 0) {
                    precedingCh = pattern.charCodeAt(i - 1);
                }
            }
        }
        else if (inside === true) {
            inside = false;
            // Should not be followed by '*'
            if ((skipFirstToken === false || start !== 0) &&
                i - start > 1 &&
                ch !== 42 &&
                precedingCh !== 42) {
                buffer.push(fastHashBetween(pattern, start, i));
                if (buffer.pos === buffer.size) {
                    return;
                }
            }
        }
    }
    if (inside === true &&
        skipLastToken === false &&
        precedingCh !== 42 &&
        pattern.length - start > 1) {
        buffer.push(fastHashBetween(pattern, start, pattern.length));
    }
    return;
}
function fastTokenizer(pattern, isAllowedCode, buffer) {
    var inside = false;
    var start = 0;
    for (var i = 0; i < pattern.length; i += 1) {
        var ch = pattern.charCodeAt(i);
        if (isAllowedCode(ch)) {
            if (inside === false) {
                inside = true;
                start = i;
            }
        }
        else if (inside === true) {
            inside = false;
            buffer.push(fastHashBetween(pattern, start, i));
            if (buffer.pos === buffer.size) {
                return;
            }
        }
    }
    if (inside === true) {
        buffer.push(fastHashBetween(pattern, start, pattern.length));
    }
}
function tokenizeInPlace(pattern, buffer) {
    fastTokenizerNoRegex(pattern, isAllowedFilter, false, false, buffer);
}
function tokenizeFilterInPlace(pattern, skipFirstToken, skipLastToken, buffer) {
    fastTokenizerNoRegex(pattern, isAllowedFilter, skipFirstToken, skipLastToken, buffer);
}
function tokenizeFilter(pattern, skipFirstToken, skipLastToken) {
    TOKENS_BUFFER.seekZero();
    tokenizeFilterInPlace(pattern, skipFirstToken, skipLastToken, TOKENS_BUFFER);
    return TOKENS_BUFFER.slice();
}
function tokenizeRegexInPlace(selector, tokens) {
    var end = selector.length - 1;
    var begin = 1;
    var prev = 0;
    // Try to find the longest safe *prefix* that we can tokenize
    for (; begin < end; begin += 1) {
        var code = selector.charCodeAt(begin);
        // If we encounter '|' before any other opening bracket, then it's not safe
        // to tokenize this filter (e.g.: 'foo|bar'). Instead we abort tokenization
        // to be safe.
        if (code === 124 /* '|' */) {
            return;
        }
        if (code === 40 /* '(' */ ||
            code === 42 /* '*' */ ||
            code === 43 /* '+' */ ||
            code === 63 /* '?' */ ||
            code === 91 /* '[' */ ||
            code === 123 /* '{' */ ||
            (code === 46 /* '.' */ && prev !== 92) /* '\' */ ||
            (code === 92 /* '\' */ && isAlpha(selector.charCodeAt(begin + 1)))) {
            break;
        }
        prev = code;
    }
    // Try to find the longest safe *suffix* that we can tokenize
    prev = 0;
    for (; end >= begin; end -= 1) {
        var code = selector.charCodeAt(end);
        // If we encounter '|' before any other opening bracket, then it's not safe
        // to tokenize this filter (e.g.: 'foo|bar'). Instead we abort tokenization
        // to be safe.
        if (code === 124 /* '|' */) {
            return;
        }
        if (code === 41 /* ')' */ ||
            code === 42 /* '*' */ ||
            code === 43 /* '+' */ ||
            code === 63 /* '?' */ ||
            code === 93 /* ']' */ ||
            code === 125 /* '}' */ ||
            (code === 46 /* '.' */ && selector.charCodeAt(end - 1) !== 92) /* '\' */ ||
            (code === 92 /* '\' */ && isAlpha(prev))) {
            break;
        }
        prev = code;
    }
    if (end < begin) {
        // Full selector is safe
        var skipFirstToken = selector.charCodeAt(1) !== 94 /* '^' */;
        var skipLastToken = selector.charCodeAt(selector.length - 1) !== 36 /* '$' */;
        tokenizeFilterInPlace(selector.slice(1, selector.length - 1), skipFirstToken, skipLastToken, tokens);
    }
    else {
        // Tokenize prefix
        if (begin > 1) {
            tokenizeFilterInPlace(selector.slice(1, begin), selector.charCodeAt(1) !== 94 /* '^' */, // skipFirstToken
                true, tokens);
        }
        // Tokenize suffix
        if (end < selector.length - 1) {
            tokenizeFilterInPlace(selector.slice(end + 1, selector.length - 1), true, selector.charCodeAt(selector.length - 1) !== 94 /* '^' */, // skipLastToken
                tokens);
        }
    }
}
function createFuzzySignature(pattern) {
    TOKENS_BUFFER.seekZero();
    fastTokenizer(pattern, isAllowedFilter, TOKENS_BUFFER);
    return compactTokens(new Uint32Array(TOKENS_BUFFER.slice()));
}
function binSearch$1(arr, elt) {
    if (arr.length === 0) {
        return -1;
    }
    var low = 0;
    var high = arr.length - 1;
    while (low <= high) {
        var mid = (low + high) >>> 1;
        var midVal = arr[mid];
        if (midVal < elt) {
            low = mid + 1;
        }
        else if (midVal > elt) {
            high = mid - 1;
        }
        else {
            return mid;
        }
    }
    return -1;
}
function binLookup(arr, elt) {
    return binSearch$1(arr, elt) !== -1;
}
var hasUnicodeRe = /[^\u0000-\u00ff]/;
function hasUnicode(str) {
    return hasUnicodeRe.test(str);
}

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
var EMPTY_TOKENS = [EMPTY_UINT32_ARRAY];
var DEFAULT_HIDDING_STYLE = 'display: none !important;';
function hashHostnameBackward(hostname) {
    var hash = 5381;
    for (var j = hostname.length - 1; j >= 0; j -= 1) {
        hash = (hash * 33) ^ hostname.charCodeAt(j);
    }
    return hash >>> 0;
}
function getHashesFromLabelsBackward(hostname, end, startOfDomain) {
    var hashes = [];
    var hash = 5381;
    // Compute hash backward, label per label
    for (var i = end - 1; i >= 0; i -= 1) {
        // Process label
        if (hostname[i] === '.' && i < startOfDomain) {
            hashes.push(hash >>> 0);
        }
        // Update hash
        hash = (hash * 33) ^ hostname.charCodeAt(i);
    }
    hashes.push(hash >>> 0);
    return hashes;
}
function getEntityHashesFromLabelsBackward(hostname, domain) {
    var hostnameWithoutPublicSuffix = getHostnameWithoutPublicSuffix(hostname, domain);
    if (hostnameWithoutPublicSuffix !== null) {
        return getHashesFromLabelsBackward(hostnameWithoutPublicSuffix, hostnameWithoutPublicSuffix.length, hostnameWithoutPublicSuffix.length);
    }
    return [];
}
function getHostnameHashesFromLabelsBackward(hostname, domain) {
    return getHashesFromLabelsBackward(hostname, hostname.length, hostname.length - domain.length);
}
/**
 * Given a hostname and its domain, return the hostname without the public
 * suffix. We know that the domain, with one less label on the left, will be a
 * the public suffix; and from there we know which trailing portion of
 * `hostname` we should remove.
 */
function getHostnameWithoutPublicSuffix(hostname, domain) {
    var hostnameWithoutPublicSuffix = null;
    var indexOfDot = domain.indexOf('.');
    if (indexOfDot !== -1) {
        var publicSuffix = domain.slice(indexOfDot + 1);
        hostnameWithoutPublicSuffix = hostname.slice(0, -publicSuffix.length - 1);
    }
    return hostnameWithoutPublicSuffix;
}
/**
 * Given a `selector` starting with either '#' or '.' check if what follows is
 * a simple CSS selector: /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/
 */
function isSimpleSelector(selector) {
    for (var i = 1; i < selector.length; i += 1) {
        var code = selector.charCodeAt(i);
        if (!(code === 45 /* '-' */ ||
            code === 95 /* '_' */ ||
            (code >= 48 && code <= 57) /* [0-9] */ ||
            (code >= 65 && code <= 90) /* [A-Z] */ ||
            (code >= 97 && code <= 122)) /* [a-z] */) {
            if (i < selector.length - 1) {
                // Check if what follows is a ' >' or ' ~' or ' +', in which case we
                // also consider it a simple selector and the token this filter can be
                // indexed with is the first selector.
                var nextCode = selector.charCodeAt(i + 1);
                if (code === 91 /* '[' */ ||
                    code === 46 /* '.' */ ||
                    code === 58 /* ':' */ ||
                    (code === 32 /* ' ' */ &&
                        (nextCode === 62 /* '>' */ ||
                            nextCode === 43 /* '+' */ ||
                            nextCode === 126 /* '~' */ ||
                            nextCode === 46 /* '.' */ ||
                            nextCode === 35)) /* '#' */) {
                    return true;
                }
            }
            return false;
        }
    }
    return true;
}
/**
 * Given a `selector` starting with either 'a[' or '[', check if what follows
 * is a simple href attribute selector of the form: 'href^=' or 'href*='.
 */
function isSimpleHrefSelector(selector, start) {
    return (selector.startsWith('href^="', start) ||
        selector.startsWith('href*="', start) ||
        selector.startsWith('href="', start));
}
/**
 * Validate CSS selector. There is a fast path for simple selectors (e.g.: #foo
 * or .bar) which are the most common case. For complex ones, we rely on
 * `Element.matches` (if available).
 */
var isValidCss = (function () {
    var div = typeof document !== 'undefined'
        ? document.createElement('div')
        : {
            matches: function () {
                /* noop */
            }
        };
    var matches = function (selector) { return div.matches(selector); };
    var validSelectorRe = /^[#.]?[\w-.]+$/;
    return function isValidCssImpl(selector) {
        if (validSelectorRe.test(selector)) {
            return true;
        }
        try {
            matches(selector);
        }
        catch (ex) {
            return false;
        }
        return true;
    };
})();
/**
 * Unescape strings by removing backslashes.
 */
function unescape(str) {
    return str.replace(/[\\]([^\\])/g, '$1');
}
function extractHTMLSelectorFromRule(rule) {
    var prefix = 'script:has-text(';
    var suffix = ')';
    var foundBackslash = false;
    if (rule.startsWith(prefix) && rule.endsWith(suffix)) {
        var depth = 1;
        var i = prefix.length; // skip opening 'script:has-text('
        var end = rule.length;
        var prev = -1; // previous character
        for (; i < end && depth !== 0; i += 1) {
            var code = rule.charCodeAt(i);
            if (prev !== 92 /* '\' */) {
                if (code === 40 /* '(' */) {
                    depth += 1;
                }
                if (code === 41 /* ')' */) {
                    depth -= 1;
                }
            }
            else {
                foundBackslash = true; // keep track of this for un-escaping
            }
            prev = code;
        }
        // Only consider a pattern if it not a compound one (i.e.:
        // script:has-text(foo))
        if (i === end) {
            return [
                'script',
                [
                    foundBackslash === true
                        ? unescape(rule.slice(prefix.length, i - 1))
                        : rule.slice(prefix.length, i - 1),
                ],
            ];
        }
    }
    return undefined;
}
function computeFilterId(mask, selector, hostnames, entities, notHostnames, notEntities, style) {
    var hash = (5437 * 33) ^ mask;
    if (selector !== undefined) {
        for (var i = 0; i < selector.length; i += 1) {
            hash = (hash * 33) ^ selector.charCodeAt(i);
        }
    }
    if (hostnames !== undefined) {
        for (var i = 0; i < hostnames.length; i += 1) {
            hash = (hash * 33) ^ hostnames[i];
        }
    }
    if (entities !== undefined) {
        for (var i = 0; i < entities.length; i += 1) {
            hash = (hash * 33) ^ entities[i];
        }
    }
    if (notHostnames !== undefined) {
        for (var i = 0; i < notHostnames.length; i += 1) {
            hash = (hash * 33) ^ notHostnames[i];
        }
    }
    if (notEntities !== undefined) {
        for (var i = 0; i < notEntities.length; i += 1) {
            hash = (hash * 33) ^ notEntities[i];
        }
    }
    if (style !== undefined) {
        for (var i = 0; i < style.length; i += 1) {
            hash = (hash * 33) ^ style.charCodeAt(i);
        }
    }
    return hash >>> 0;
}
/***************************************************************************
 *  Cosmetic filters parsing
 * ************************************************************************ */
var CosmeticFilter = /** @class */ (function () {
    function CosmeticFilter(_a) {
        var mask = _a.mask, selector = _a.selector, entities = _a.entities, hostnames = _a.hostnames, notEntities = _a.notEntities, notHostnames = _a.notHostnames, rawLine = _a.rawLine, style = _a.style;
        this.mask = mask;
        this.selector = selector;
        // Hostname constraints
        this.entities = entities;
        this.hostnames = hostnames;
        // Hostname exceptions
        this.notEntities = notEntities;
        this.notHostnames = notHostnames;
        this.style = style;
        this.id = undefined;
        this.rawLine = rawLine;
    }
    /**
     * Given a line that we know contains a cosmetic filter, create a CosmeticFiler
     * instance out of it. This function should be *very* efficient, as it will be
     * used to parse tens of thousands of lines.
     */
    CosmeticFilter.parse = function (line, debug) {
        if (debug === void 0) { debug = false; }
        // Mask to store attributes. Each flag (unhide, scriptInject, etc.) takes
        // only 1 bit at a specific offset defined in COSMETICS_MASK.  cf:
        // COSMETICS_MASK for the offset of each property
        var mask = 0;
        var selector;
        var hostnames;
        var notHostnames;
        var entities;
        var notEntities;
        var style;
        var sharpIndex = line.indexOf('#');
        // Start parsing the line
        var afterSharpIndex = sharpIndex + 1;
        var suffixStartIndex = afterSharpIndex + 1;
        // hostname1,hostname2#@#.selector
        //                    ^^ ^
        //                    || |
        //                    || suffixStartIndex
        //                    |afterSharpIndex
        //                    sharpIndex
        // Check if unhide
        if (line.length > afterSharpIndex && line[afterSharpIndex] === '@') {
            mask = setBit(mask, 1 /* unhide */);
            suffixStartIndex += 1;
        }
        // Parse hostnames and entitites as well as their negations.
        //
        // - ~hostname##.selector
        // - hostname##.selector
        // - entity.*##.selector
        // - ~entity.*##.selector
        //
        // Each kind will have its own Uint32Array containing hashes, sorted by
        // number of labels considered. This allows a compact representation of
        // hostnames and fast matching without any string copy.
        if (sharpIndex > 0) {
            var entitiesArray = [];
            var notEntitiesArray = [];
            var hostnamesArray = [];
            var notHostnamesArray = [];
            var parts = line.slice(0, sharpIndex).split(',');
            for (var i = 0; i < parts.length; i += 1) {
                var hostname = parts[i];
                if (hasUnicode(hostname)) {
                    hostname = toASCII(hostname);
                    mask = setBit(mask, 4 /* isUnicode */);
                }
                var negation = hostname.charCodeAt(0) === 126 /* '~' */;
                var entity = hostname.charCodeAt(hostname.length - 1) === 42 /* '*' */ &&
                    hostname.charCodeAt(hostname.length - 2) === 46 /* '.' */;
                var start = negation ? 1 : 0;
                var end = entity ? hostname.length - 2 : hostname.length;
                var hash = hashHostnameBackward(negation === true || entity === true ? hostname.slice(start, end) : hostname);
                if (negation) {
                    if (entity) {
                        notEntitiesArray.push(hash);
                    }
                    else {
                        notHostnamesArray.push(hash);
                    }
                }
                else {
                    if (entity) {
                        entitiesArray.push(hash);
                    }
                    else {
                        hostnamesArray.push(hash);
                    }
                }
            }
            if (entitiesArray.length !== 0) {
                entities = new Uint32Array(entitiesArray).sort();
            }
            if (hostnamesArray.length !== 0) {
                hostnames = new Uint32Array(hostnamesArray).sort();
            }
            if (notEntitiesArray.length !== 0) {
                notEntities = new Uint32Array(notEntitiesArray).sort();
            }
            if (notHostnamesArray.length !== 0) {
                notHostnames = new Uint32Array(notHostnamesArray).sort();
            }
        }
        // Deal with ^script:has-text(...)
        if (line.charCodeAt(suffixStartIndex) === 94 /* '^' */ &&
            fastStartsWithFrom(line, 'script:has-text(', suffixStartIndex + 1) &&
            line.charCodeAt(line.length - 1) === 41 /* ')' */) {
            //   ^script:has-text(selector)
            //    ^                       ^
            //    |                       |
            //    |                       |
            //    |                       scriptSelectorIndexEnd
            //    |
            //    scriptSelectorIndexStart
            //
            var scriptSelectorIndexStart = suffixStartIndex + 1;
            var scriptSelectorIndexEnd = line.length;
            mask = setBit(mask, 64 /* htmlFiltering */);
            selector = line.slice(scriptSelectorIndexStart, scriptSelectorIndexEnd);
            // Make sure this is a valid selector
            if (extractHTMLSelectorFromRule(selector) === undefined) {
                return null;
            }
        }
        else if (line.length - suffixStartIndex > 4 &&
            line.charCodeAt(suffixStartIndex) === 43 /* '+' */ &&
            fastStartsWithFrom(line, '+js(', suffixStartIndex)) {
            mask = setBit(mask, 2 /* scriptInject */);
            selector = line.slice(suffixStartIndex + 4, line.length - 1);
        }
        else {
            // Detect special syntax
            var indexOfColon = line.indexOf(':', suffixStartIndex);
            while (indexOfColon !== -1) {
                var indexAfterColon = indexOfColon + 1;
                if (fastStartsWithFrom(line, 'style', indexAfterColon)) {
                    // ##selector :style(...)
                    if (line[indexAfterColon + 5] === '(' && line[line.length - 1] === ')') {
                        selector = line.slice(suffixStartIndex, indexOfColon);
                        style = line.slice(indexAfterColon + 6, -1);
                    }
                    else {
                        return null;
                    }
                }
                else if (fastStartsWithFrom(line, '-abp-', indexAfterColon) ||
                    fastStartsWithFrom(line, 'contains', indexAfterColon) ||
                    fastStartsWithFrom(line, 'has', indexAfterColon) ||
                    fastStartsWithFrom(line, 'if', indexAfterColon) ||
                    fastStartsWithFrom(line, 'if-not', indexAfterColon) ||
                    fastStartsWithFrom(line, 'matches-css', indexAfterColon) ||
                    fastStartsWithFrom(line, 'matches-css-after', indexAfterColon) ||
                    fastStartsWithFrom(line, 'matches-css-before', indexAfterColon) ||
                    fastStartsWithFrom(line, 'properties', indexAfterColon) ||
                    fastStartsWithFrom(line, 'subject', indexAfterColon) ||
                    fastStartsWithFrom(line, 'xpath', indexAfterColon)) {
                    return null;
                }
                indexOfColon = line.indexOf(':', indexAfterColon);
            }
            // If we reach this point, filter is not extended syntax
            if (selector === undefined && suffixStartIndex < line.length) {
                selector = line.slice(suffixStartIndex);
            }
            if (selector === undefined || !isValidCss(selector)) {
                // Not a valid selector
                return null;
            }
        }
        // Check if unicode appears in selector
        if (selector !== undefined) {
            if (hasUnicode(selector)) {
                mask = setBit(mask, 4 /* isUnicode */);
            }
            // Classify selector
            if (getBit(mask, 64 /* htmlFiltering */) === false) {
                var c0 = selector.charCodeAt(0);
                var c1 = selector.charCodeAt(1);
                var c2 = selector.charCodeAt(2);
                // Check if we have a specific case of simple selector (id, class or
                // href) These are the most common filters and will benefit greatly from
                // a custom dispatch mechanism.
                if (getBit(mask, 2 /* scriptInject */) === false) {
                    if (c0 === 46 /* '.' */ && isSimpleSelector(selector)) {
                        mask = setBit(mask, 8 /* isClassSelector */);
                    }
                    else if (c0 === 35 /* '#' */ && isSimpleSelector(selector)) {
                        mask = setBit(mask, 16 /* isIdSelector */);
                    }
                    else if (c0 === 97 /* a */ &&
                        c1 === 91 /* '[' */ &&
                        c2 === 104 /* 'h' */ &&
                        isSimpleHrefSelector(selector, 2)) {
                        mask = setBit(mask, 32 /* isHrefSelector */);
                    }
                    else if (c0 === 91 /* '[' */ &&
                        c1 === 104 /* 'h' */ &&
                        isSimpleHrefSelector(selector, 1)) {
                        mask = setBit(mask, 32 /* isHrefSelector */);
                    }
                }
            }
        }
        return new CosmeticFilter({
            entities: entities,
            hostnames: hostnames,
            mask: mask,
            notEntities: notEntities,
            notHostnames: notHostnames,
            rawLine: debug === true ? line : undefined,
            selector: selector,
            style: style
        });
    };
    /**
     * Deserialize cosmetic filters. The code accessing the buffer should be
     * symetrical to the one in `serializeCosmeticFilter`.
     */
    CosmeticFilter.deserialize = function (buffer) {
        var mask = buffer.getUint8();
        var isUnicode = getBit(mask, 4 /* isUnicode */);
        var optionalParts = buffer.getUint8();
        var selector = isUnicode ? buffer.getUTF8() : buffer.getCosmeticSelector();
        // The order of these fields should be the same as when we serialize them.
        return new CosmeticFilter({
            // Mandatory fields
            mask: mask,
            selector: selector,
            // Optional fields
            entities: (optionalParts & 1) === 1 ? buffer.getUint32Array() : undefined,
            hostnames: (optionalParts & 2) === 2 ? buffer.getUint32Array() : undefined,
            notEntities: (optionalParts & 4) === 4 ? buffer.getUint32Array() : undefined,
            notHostnames: (optionalParts & 8) === 8 ? buffer.getUint32Array() : undefined,
            rawLine: (optionalParts & 16) === 16
                ? isUnicode
                    ? buffer.getUTF8()
                    : buffer.getASCII()
                : undefined,
            style: (optionalParts & 32) === 32 ? buffer.getASCII() : undefined
        });
    };
    CosmeticFilter.prototype.isCosmeticFilter = function () {
        return true;
    };
    CosmeticFilter.prototype.isNetworkFilter = function () {
        return false;
    };
    /**
     * The format of a cosmetic filter is:
     *
     * | mask | selector length | selector... | hostnames length | hostnames...
     *   32     16                              16
     *
     * The header (mask) is 32 bits, then we have a total of 32 bits to store the
     * length of `selector` and `hostnames` (16 bits each).
     *
     * Improvements similar to the onces mentioned in `serializeNetworkFilters`
     * could be applied here, to get a more compact representation.
     */
    CosmeticFilter.prototype.serialize = function (buffer) {
        // Mandatory fields
        buffer.pushUint8(this.mask);
        var index = buffer.getPos();
        buffer.pushUint8(0);
        if (this.isUnicode()) {
            buffer.pushUTF8(this.selector);
        }
        else {
            buffer.pushCosmeticSelector(this.selector);
        }
        // This bit-mask indicates which optional parts of the filter were serialized.
        var optionalParts = 0;
        if (this.entities !== undefined) {
            optionalParts |= 1;
            buffer.pushUint32Array(this.entities);
        }
        if (this.hostnames !== undefined) {
            optionalParts |= 2;
            buffer.pushUint32Array(this.hostnames);
        }
        if (this.notEntities !== undefined) {
            optionalParts |= 4;
            buffer.pushUint32Array(this.notEntities);
        }
        if (this.notHostnames !== undefined) {
            optionalParts |= 8;
            buffer.pushUint32Array(this.notHostnames);
        }
        if (this.rawLine !== undefined) {
            optionalParts |= 16;
            if (this.isUnicode()) {
                buffer.pushUTF8(this.rawLine);
            }
            else {
                buffer.pushASCII(this.rawLine);
            }
        }
        if (this.style !== undefined) {
            optionalParts |= 32;
            buffer.pushASCII(this.style);
        }
        buffer.setByte(index, optionalParts);
    };
    /**
     * Return an estimation of the size (in bytes) needed to persist this filter
     * in a DataView. This does not need to be 100% accurate but should be an
     * upper-bound. It should also be as fast as possible.
     */
    CosmeticFilter.prototype.getSerializedSize = function (compression) {
        var estimate = 1 + 1; // mask (1 byte) + optional parts (1 byte)
        if (this.isUnicode()) {
            estimate += StaticDataView.sizeOfUTF8(this.selector);
        }
        else {
            estimate += StaticDataView.sizeOfCosmeticSelector(this.selector, compression);
        }
        if (this.entities !== undefined) {
            estimate += StaticDataView.sizeOfUint32Array(this.entities);
        }
        if (this.hostnames !== undefined) {
            estimate += StaticDataView.sizeOfUint32Array(this.hostnames);
        }
        if (this.notHostnames !== undefined) {
            estimate += StaticDataView.sizeOfUint32Array(this.notHostnames);
        }
        if (this.notEntities !== undefined) {
            estimate += StaticDataView.sizeOfUint32Array(this.notEntities);
        }
        if (this.rawLine !== undefined) {
            if (this.isUnicode()) {
                estimate += StaticDataView.sizeOfUTF8(this.rawLine);
            }
            else {
                estimate += StaticDataView.sizeOfASCII(this.rawLine);
            }
        }
        if (this.style !== undefined) {
            estimate += StaticDataView.sizeOfASCII(this.style);
        }
        return estimate;
    };
    /**
     * Create a more human-readable version of this filter. It is mainly used for
     * debugging purpose, as it will expand the values stored in the bit mask.
     */
    CosmeticFilter.prototype.toString = function () {
        if (this.rawLine !== undefined) {
            return this.rawLine;
        }
        var filter = '';
        if (this.hostnames !== undefined ||
            this.entities !== undefined ||
            this.notHostnames !== undefined ||
            this.notEntities !== undefined) {
            filter += '<hostnames>';
        }
        if (this.isUnhide()) {
            filter += '#@#';
        }
        else {
            filter += '##';
        }
        if (this.isScriptInject()) {
            filter += '+js(';
            filter += this.selector;
            filter += ')';
        }
        else {
            filter += this.selector;
        }
        return filter;
    };
    CosmeticFilter.prototype.match = function (hostname, domain) {
        // Not constraint on hostname, match is true
        if (this.hasHostnameConstraint() === false) {
            return true;
        }
        // No `hostname` available but this filter has some constraints on hostname.
        if (!hostname && this.hasHostnameConstraint()) {
            return false;
        }
        var entitiesHashes = this.entities !== undefined || this.notEntities !== undefined
            ? getEntityHashesFromLabelsBackward(hostname, domain)
            : [];
        var hostnameHashes = this.hostnames !== undefined || this.notHostnames !== undefined
            ? getHostnameHashesFromLabelsBackward(hostname, domain)
            : [];
        // Check if `hostname` is blacklisted
        if (this.notHostnames !== undefined) {
            for (var i = 0; i < hostnameHashes.length; i += 1) {
                if (binLookup(this.notHostnames, hostnameHashes[i])) {
                    return false;
                }
            }
        }
        // Check if `hostname` is blacklisted by *entity*
        if (this.notEntities !== undefined) {
            for (var i = 0; i < entitiesHashes.length; i += 1) {
                if (binLookup(this.notEntities, entitiesHashes[i])) {
                    return false;
                }
            }
        }
        // Check if `hostname` is allowed
        if (this.hostnames !== undefined || this.entities !== undefined) {
            if (this.hostnames !== undefined) {
                for (var i = 0; i < hostnameHashes.length; i += 1) {
                    if (binLookup(this.hostnames, hostnameHashes[i])) {
                        return true;
                    }
                }
            }
            if (this.entities !== undefined) {
                for (var i = 0; i < entitiesHashes.length; i += 1) {
                    if (binLookup(this.entities, entitiesHashes[i])) {
                        return true;
                    }
                }
            }
            return false;
        }
        return true;
    };
    /**
     * Get tokens for this filter. It can be indexed multiple times if multiple
     * hostnames are specified (e.g.: host1,host2##.selector).
     */
    CosmeticFilter.prototype.getTokens = function () {
        var tokens = [];
        // Note, we do not need to use negated domains or entities as tokens here
        // since they will by definition not match on their own, unless accompanied
        // by a domain or entity. Instead, they are handled in
        // `CosmeticFilterBucket.getCosmeticsFilters(...)`.
        if (this.hostnames !== undefined) {
            for (var i = 0; i < this.hostnames.length; i += 1) {
                tokens.push(new Uint32Array([this.hostnames[i]]));
            }
        }
        if (this.entities !== undefined) {
            for (var i = 0; i < this.entities.length; i += 1) {
                tokens.push(new Uint32Array([this.entities[i]]));
            }
        }
        // Here we only take selector into account if the filter is not unHide.
        if (tokens.length === 0 && this.isUnhide() === false) {
            if (this.isIdSelector() || this.isClassSelector()) {
                // Here we try to identify the end of selector si that we can extract a
                // valid token out of it. In all these examples, 'selector' is our
                // token:
                //
                //   .selector[...]
                //   #selector[...]
                //   #selector ~ foo
                //   .selector:not(...)
                //   .selector.foo
                //
                // We now try to identify the first valid end of selector which will
                // also be the end of our token: space, bracket, colon, dot.
                var endOfSelector = 1;
                var selector = this.selector;
                for (; endOfSelector < selector.length; endOfSelector += 1) {
                    var code = selector.charCodeAt(endOfSelector);
                    if (code === 32 /* ' ' */ ||
                        code === 46 /* '.' */ ||
                        code === 58 /* ':' */ ||
                        code === 91 /* '[' */) {
                        break;
                    }
                }
                tokens.push(new Uint32Array([fastHash(selector.slice(1, endOfSelector))]));
            }
            else if (this.isHrefSelector()) {
                var selector = this.getSelector();
                // Locate 'href' in selector
                var hrefIndex = selector.indexOf('href');
                if (hrefIndex === -1) {
                    return EMPTY_TOKENS;
                }
                hrefIndex += 4;
                // Tokenize optimally depending on the kind of selector: 'href=',
                // 'href*=', 'href^='.
                var skipFirstToken = false;
                var skipLastToken = true;
                if (selector.charCodeAt(hrefIndex) === 42 /* '*' */) {
                    // skip: '*'
                    skipFirstToken = true;
                    hrefIndex += 1;
                }
                else if (selector.charCodeAt(hrefIndex) === 94 /* '^' */) {
                    // skip: '^'
                    hrefIndex += 1;
                }
                else {
                    skipLastToken = false;
                }
                hrefIndex += 2; // skip:  '="'
                // Locate end of href
                var hrefEnd = selector.indexOf('"', hrefIndex);
                if (hrefEnd === -1) {
                    // That cannot happen unless the filter is not well-formed. In this
                    // case, we just return no tokens, which will result in this filter
                    // ending up in the "wildcard" bucket of the index.
                    return EMPTY_TOKENS;
                }
                tokens.push(new Uint32Array(tokenizeFilter(this.selector.slice(hrefIndex, hrefEnd), skipFirstToken, skipLastToken)));
            }
        }
        if (tokens.length === 0) {
            return EMPTY_TOKENS;
        }
        return tokens;
    };
    CosmeticFilter.prototype.getScript = function (js) {
        var scriptName = this.getSelector();
        var scriptArguments = [];
        if (scriptName.indexOf(',') !== -1) {
            var parts = scriptName.split(',');
            scriptName = parts[0];
            scriptArguments = parts.slice(1).map(function (s) { return s.trim(); });
        }
        var script = js.get(scriptName);
        if (script !== undefined) {
            for (var i = 0; i < scriptArguments.length; i += 1) {
                script = script.replace("{{" + (i + 1) + "}}", scriptArguments[i]);
            }
            return script;
        } // TODO - else throw an exception?
        return undefined;
    };
    CosmeticFilter.prototype.hasHostnameConstraint = function () {
        return (this.hostnames !== undefined ||
            this.entities !== undefined ||
            this.notEntities !== undefined ||
            this.notHostnames !== undefined);
    };
    CosmeticFilter.prototype.getId = function () {
        if (this.id === undefined) {
            this.id = computeFilterId(this.mask, this.selector, this.hostnames, this.entities, this.notHostnames, this.notEntities, this.style);
        }
        return this.id;
    };
    CosmeticFilter.prototype.hasCustomStyle = function () {
        return this.style !== undefined;
    };
    CosmeticFilter.prototype.getStyle = function () {
        return this.style || DEFAULT_HIDDING_STYLE;
    };
    CosmeticFilter.prototype.getSelector = function () {
        return this.selector;
    };
    CosmeticFilter.prototype.getExtendedSelector = function () {
        return extractHTMLSelectorFromRule(this.selector);
    };
    CosmeticFilter.prototype.isUnhide = function () {
        return getBit(this.mask, 1 /* unhide */);
    };
    CosmeticFilter.prototype.isScriptInject = function () {
        return getBit(this.mask, 2 /* scriptInject */);
    };
    CosmeticFilter.prototype.isCSS = function () {
        return this.isScriptInject() === false;
    };
    CosmeticFilter.prototype.isIdSelector = function () {
        return getBit(this.mask, 16 /* isIdSelector */);
    };
    CosmeticFilter.prototype.isClassSelector = function () {
        return getBit(this.mask, 8 /* isClassSelector */);
    };
    CosmeticFilter.prototype.isHrefSelector = function () {
        return getBit(this.mask, 32 /* isHrefSelector */);
    };
    CosmeticFilter.prototype.isUnicode = function () {
        return getBit(this.mask, 4 /* isUnicode */);
    };
    CosmeticFilter.prototype.isHtmlFiltering = function () {
        return getBit(this.mask, 64 /* htmlFiltering */);
    };
    // A generic hide cosmetic filter is one that:
    //
    // * Do not have a domain specified. "Hide this element on all domains"
    // * Have only domain exceptions specified. "Hide this element on all domains except example.com"
    //
    // For example: ~example.com##.ad  is a generic filter as well!
    CosmeticFilter.prototype.isGenericHide = function () {
        return this.hostnames === undefined && this.entities === undefined;
    };
    return CosmeticFilter;
}());

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
var TOKENS_BUFFER$1 = new TokensBuffer(200);
var HTTP_HASH = fastHash('http');
var HTTPS_HASH = fastHash('https');
function isAllowedHostname(ch) {
    return (isDigit(ch) || isAlpha(ch) || ch === 95 /* '_' */ || ch === 45 /* '-' */ || ch === 46 /* '.' */);
}
/**
 * Mask used when a network filter can be applied on any content type.
 */
var FROM_ANY = 1 /* fromDocument */ |
    2 /* fromFont */ |
    16 /* fromImage */ |
    32 /* fromMedia */ |
    64 /* fromObject */ |
    128 /* fromOther */ |
    256 /* fromPing */ |
    512 /* fromScript */ |
    1024 /* fromStylesheet */ |
    2048 /* fromSubdocument */ |
    4096 /* fromWebsocket */ |
    8192 /* fromXmlHttpRequest */;
/**
 * Map content type value to mask the corresponding mask.
 * ref: https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIContentPolicy
 */
var REQUEST_TYPE_TO_MASK = {
    beacon: 256 /* fromPing */,
    document: 1 /* fromDocument */,
    fetch: 8192 /* fromXmlHttpRequest */,
    font: 2 /* fromFont */,
    image: 16 /* fromImage */,
    imageset: 16 /* fromImage */,
    mainFrame: 1 /* fromDocument */,
    main_frame: 1 /* fromDocument */,
    media: 32 /* fromMedia */,
    object: 64 /* fromObject */,
    object_subrequest: 64 /* fromObject */,
    ping: 256 /* fromPing */,
    script: 512 /* fromScript */,
    stylesheet: 1024 /* fromStylesheet */,
    subFrame: 2048 /* fromSubdocument */,
    sub_frame: 2048 /* fromSubdocument */,
    websocket: 4096 /* fromWebsocket */,
    xhr: 8192 /* fromXmlHttpRequest */,
    xmlhttprequest: 8192 /* fromXmlHttpRequest */,
    // Other
    csp_report: 128 /* fromOther */,
    eventsource: 128 /* fromOther */,
    manifest: 128 /* fromOther */,
    other: 128 /* fromOther */,
    speculative: 128 /* fromOther */,
    texttrack: 128 /* fromOther */,
    web_manifest: 128 /* fromOther */,
    xbl: 128 /* fromOther */,
    xml_dtd: 128 /* fromOther */,
    xslt: 128 /* fromOther */
};
function computeFilterId$1(csp, mask, filter, hostname, optDomains, optNotDomains, redirect) {
    var hash = (5408 * 33) ^ mask;
    if (csp !== undefined) {
        for (var i = 0; i < csp.length; i += 1) {
            hash = (hash * 33) ^ csp.charCodeAt(i);
        }
    }
    if (optDomains !== undefined) {
        for (var i = 0; i < optDomains.length; i += 1) {
            hash = (hash * 33) ^ optDomains[i];
        }
    }
    if (optNotDomains !== undefined) {
        for (var i = 0; i < optNotDomains.length; i += 1) {
            hash = (hash * 33) ^ optNotDomains[i];
        }
    }
    if (filter !== undefined) {
        for (var i = 0; i < filter.length; i += 1) {
            hash = (hash * 33) ^ filter.charCodeAt(i);
        }
    }
    if (hostname !== undefined) {
        for (var i = 0; i < hostname.length; i += 1) {
            hash = (hash * 33) ^ hostname.charCodeAt(i);
        }
    }
    if (redirect !== undefined) {
        for (var i = 0; i < redirect.length; i += 1) {
            hash = (hash * 33) ^ redirect.charCodeAt(i);
        }
    }
    return hash >>> 0;
}
/**
 * Compiles a filter pattern to a regex. This is only performed *lazily* for
 * filters containing at least a * or ^ symbol. Because Regexes are expansive,
 * we try to convert some patterns to plain filters.
 */
function compileRegex(filter, isLeftAnchor, isRightAnchor, isFullRegex) {
    if (isFullRegex === true) {
        return new RegExp(filter.slice(1, filter.length - 1), 'i');
    }
    // Escape special regex characters: |.$+?{}()[]\
    filter = filter.replace(/([|.$+?{}()[\]\\])/g, '\\$1');
    // * can match anything
    filter = filter.replace(/\*/g, '.*');
    // ^ can match any separator or the end of the pattern
    filter = filter.replace(/\^/g, '(?:[^\\w\\d_.%-]|$)');
    // Should match end of url
    if (isRightAnchor) {
        filter = filter + "$";
    }
    if (isLeftAnchor) {
        filter = "^" + filter;
    }
    return new RegExp(filter, 'i');
}
var EMPTY_ARRAY = new Uint32Array([]);
var MATCH_ALL = new RegExp('');
var NetworkFilter = /** @class */ (function () {
    function NetworkFilter(_a) {
        var csp = _a.csp, filter = _a.filter, hostname = _a.hostname, mask = _a.mask, optDomains = _a.optDomains, optNotDomains = _a.optNotDomains, rawLine = _a.rawLine, redirect = _a.redirect, regex = _a.regex;
        this.csp = csp;
        this.filter = filter;
        this.hostname = hostname;
        this.mask = mask;
        this.optDomains = optDomains;
        this.optNotDomains = optNotDomains;
        this.redirect = redirect;
        this.rawLine = rawLine;
        this.id = undefined;
        this.fuzzySignature = undefined;
        this.regex = regex;
    }
    NetworkFilter.parse = function (line, debug) {
        if (debug === void 0) { debug = false; }
        // Represent options as a bitmask
        var mask = 16777216 /* thirdParty */ |
            16384 /* firstParty */ |
            8 /* fromHttps */ |
            4 /* fromHttp */;
        // Temporary masks for positive (e.g.: $script) and negative (e.g.: $~script)
        // content type options.
        var cptMaskPositive = 0;
        var cptMaskNegative = FROM_ANY;
        var hostname;
        var optDomains;
        var optNotDomains;
        var redirect;
        var csp;
        // Start parsing
        var filterIndexStart = 0;
        var filterIndexEnd = line.length;
        // @@filter == Exception
        if (line.charCodeAt(0) === 64 /* '@' */ && line.charCodeAt(1) === 64 /* '@' */) {
            filterIndexStart += 2;
            mask = setBit(mask, 262144 /* isException */);
        }
        // filter$options == Options
        // ^     ^
        // |     |
        // |     optionsIndex
        // filterIndexStart
        var optionsIndex = line.lastIndexOf('$');
        if (optionsIndex !== -1 && line.charCodeAt(optionsIndex + 1) !== 47 /* '/' */) {
            // Parse options and set flags
            filterIndexEnd = optionsIndex;
            // --------------------------------------------------------------------- //
            // parseOptions
            // --------------------------------------------------------------------- //
            var options = line.slice(optionsIndex + 1).split(',');
            for (var i = 0; i < options.length; i += 1) {
                var rawOption = options[i];
                var negation = rawOption.charCodeAt(0) === 126 /* '~' */;
                var option = negation === true ? rawOption.slice(1) : rawOption;
                // Check for options: option=value1|value2
                var optionValue = '';
                var indexOfEqual = option.indexOf('=');
                if (indexOfEqual !== -1) {
                    optionValue = option.slice(indexOfEqual + 1);
                    option = option.slice(0, indexOfEqual);
                }
                switch (option) {
                    case 'domain': {
                        // domain list starting or ending with '|' is invalid
                        if (optionValue.charCodeAt(0) === 124 /* '|' */ ||
                            optionValue.charCodeAt(optionValue.length - 1) === 124 /* '|' */) {
                            return null;
                        }
                        var optionValues = optionValue.split('|');
                        var optDomainsArray = [];
                        var optNotDomainsArray = [];
                        for (var j = 0; j < optionValues.length; j += 1) {
                            var value = optionValues[j];
                            if (value) {
                                if (value.charCodeAt(0) === 126 /* '~' */) {
                                    optNotDomainsArray.push(fastHash(value.slice(1)));
                                }
                                else {
                                    optDomainsArray.push(fastHash(value));
                                }
                            }
                        }
                        if (optDomainsArray.length > 0) {
                            optDomains = new Uint32Array(optDomainsArray).sort();
                        }
                        if (optNotDomainsArray.length > 0) {
                            optNotDomains = new Uint32Array(optNotDomainsArray).sort();
                        }
                        break;
                    }
                    case 'badfilter':
                        mask = setBit(mask, 65536 /* isBadFilter */);
                        break;
                    case 'important':
                        // Note: `negation` should always be `false` here.
                        if (negation) {
                            return null;
                        }
                        mask = setBit(mask, 2097152 /* isImportant */);
                        break;
                    case 'match-case':
                        // Note: `negation` should always be `false` here.
                        if (negation) {
                            return null;
                        }
                        // We currently consider all filters to be case-insensitive.
                        break;
                    case '3p':
                    case 'third-party':
                        if (negation) {
                            // ~third-party means we should clear the flag
                            mask = clearBit(mask, 16777216 /* thirdParty */);
                        }
                        else {
                            // third-party means ~first-party
                            mask = clearBit(mask, 16384 /* firstParty */);
                        }
                        break;
                    case '1p':
                    case 'first-party':
                        if (negation) {
                            // ~first-party means we should clear the flag
                            mask = clearBit(mask, 16384 /* firstParty */);
                        }
                        else {
                            // first-party means ~third-party
                            mask = clearBit(mask, 16777216 /* thirdParty */);
                        }
                        break;
                    case 'fuzzy':
                        mask = setBit(mask, 32768 /* fuzzyMatch */);
                        break;
                    case 'redirect-rule':
                    case 'redirect':
                        // Negation of redirection doesn't make sense
                        if (negation) {
                            return null;
                        }
                        // Ignore this filter if no redirection resource is specified
                        if (optionValue.length === 0) {
                            return null;
                        }
                        redirect = optionValue;
                        break;
                    case 'csp':
                        if (negation) {
                            return null;
                        }
                        mask = setBit(mask, 131072 /* isCSP */);
                        if (optionValue.length > 0) {
                            csp = optionValue;
                        }
                        break;
                    case 'elemhide':
                    case 'generichide':
                        if (negation) {
                            return null;
                        }
                        mask = setBit(mask, 524288 /* isGenericHide */);
                        break;
                    case 'inline-script':
                        if (negation) {
                            return null;
                        }
                        mask = setBit(mask, 131072 /* isCSP */);
                        csp = "script-src 'self' 'unsafe-eval' http: https: data: blob: mediastream: filesystem:";
                        break;
                    case 'inline-font':
                        if (negation) {
                            return null;
                        }
                        mask = setBit(mask, 131072 /* isCSP */);
                        csp = "font-src 'self' 'unsafe-eval' http: https: data: blob: mediastream: filesystem:";
                        break;
                    default: {
                        // Handle content type options separatly
                        var optionMask = 0;
                        switch (option) {
                            case 'all':
                                // We implement 'all' with a different semantic than uBlock
                                // Origin here. It will just match any request type for now.
                                break;
                            case 'image':
                                optionMask = 16 /* fromImage */;
                                break;
                            case 'media':
                                optionMask = 32 /* fromMedia */;
                                break;
                            case 'object':
                            case 'object-subrequest':
                                optionMask = 64 /* fromObject */;
                                break;
                            case 'other':
                                optionMask = 128 /* fromOther */;
                                break;
                            case 'ping':
                            case 'beacon':
                                optionMask = 256 /* fromPing */;
                                break;
                            case 'script':
                                optionMask = 512 /* fromScript */;
                                break;
                            case 'css':
                            case 'stylesheet':
                                optionMask = 1024 /* fromStylesheet */;
                                break;
                            case 'frame':
                            case 'subdocument':
                                optionMask = 2048 /* fromSubdocument */;
                                break;
                            case 'xhr':
                            case 'xmlhttprequest':
                                optionMask = 8192 /* fromXmlHttpRequest */;
                                break;
                            case 'websocket':
                                optionMask = 4096 /* fromWebsocket */;
                                break;
                            case 'font':
                                optionMask = 2 /* fromFont */;
                                break;
                            case 'doc':
                            case 'document':
                                optionMask = 1 /* fromDocument */;
                                break;
                            default:
                                // Disable this filter if we don't support all the options
                                return null;
                        }
                        // We got a valid cpt option, update mask
                        if (negation) {
                            cptMaskNegative = clearBit(cptMaskNegative, optionMask);
                        }
                        else {
                            cptMaskPositive = setBit(cptMaskPositive, optionMask);
                        }
                        break;
                    }
                }
            }
            // End of option parsing
            // --------------------------------------------------------------------- //
        }
        if (cptMaskPositive === 0) {
            mask |= cptMaskNegative;
        }
        else if (cptMaskNegative === FROM_ANY) {
            mask |= cptMaskPositive;
        }
        else {
            mask |= cptMaskPositive & cptMaskNegative;
        }
        // Identify kind of pattern
        var filter;
        // Detect Regexps (i.e.: /pattern/)
        if (filterIndexEnd - filterIndexStart >= 2 &&
            line.charCodeAt(filterIndexStart) === 47 /* '/' */ &&
            line.charCodeAt(filterIndexEnd - 1) === 47 /* '/' */) {
            // Some extra ideas which could be applied to RegExp filters:
            // * convert rules without any special RegExp syntax to plain patterns
            // * remove extra `isFullRegex` flag since `isRegex` might be enough
            // * apply some optimizations on the fly: /^https?:\\/\\/rest => isHttp + isHttps + rest
            filter = line.slice(filterIndexStart, filterIndexEnd);
            // Validate RegExp to make sure this rule is fine
            try {
                compileRegex(filter, false /* isLeftAnchor */, false /* isRightAnchor */, true /* isFullRegex */);
            }
            catch (ex) {
                return null; // invalid RegExp
            }
            mask = setBit(mask, 33554432 /* isFullRegex */);
        }
        else {
            // Deal with hostname pattern
            if (filterIndexEnd > 0 && line.charCodeAt(filterIndexEnd - 1) === 124 /* '|' */) {
                mask = setBit(mask, 8388608 /* isRightAnchor */);
                filterIndexEnd -= 1;
            }
            if (filterIndexStart < filterIndexEnd &&
                line.charCodeAt(filterIndexStart) === 124 /* '|' */) {
                if (filterIndexStart < filterIndexEnd - 1 &&
                    line.charCodeAt(filterIndexStart + 1) === 124 /* '|' */) {
                    mask = setBit(mask, 1048576 /* isHostnameAnchor */);
                    filterIndexStart += 2;
                }
                else {
                    mask = setBit(mask, 4194304 /* isLeftAnchor */);
                    filterIndexStart += 1;
                }
            }
            // const isRegex = checkIsRegex(line, filterIndexStart, filterIndexEnd);
            // mask = setNetworkMask(mask, NETWORK_FILTER_MASK.isRegex, isRegex);
            if (getBit(mask, 1048576 /* isHostnameAnchor */)) {
                // Split at the first character which is not allowed in a hostname
                var firstSeparator = filterIndexStart;
                while (firstSeparator < filterIndexEnd &&
                    isAllowedHostname(line.charCodeAt(firstSeparator)) === true) {
                    firstSeparator += 1;
                }
                // No separator found so hostname has full length
                if (firstSeparator === filterIndexEnd) {
                    hostname = line.slice(filterIndexStart, filterIndexEnd);
                    filterIndexStart = filterIndexEnd;
                    // mask = setBit(mask, NETWORK_FILTER_MASK.isLeftAnchor);
                }
                else {
                    // Found a separator
                    hostname = line.slice(filterIndexStart, firstSeparator);
                    filterIndexStart = firstSeparator;
                    var separatorCode = line.charCodeAt(firstSeparator);
                    if (separatorCode === 94 /* '^' */) {
                        // If the only symbol remaining for the selector is '^' then ignore it
                        // but set the filter as right anchored since there should not be any
                        // other label on the right
                        if (filterIndexEnd - filterIndexStart === 1) {
                            filterIndexStart = filterIndexEnd;
                            mask = setBit(mask, 8388608 /* isRightAnchor */);
                        }
                        else {
                            mask = setBit(mask, 67108864 /* isRegex */);
                            mask = setBit(mask, 4194304 /* isLeftAnchor */);
                        }
                    }
                    else if (separatorCode === 42 /* '*' */) {
                        mask = setBit(mask, 67108864 /* isRegex */);
                        // mask = setBit(mask, NETWORK_FILTER_MASK.isLeftAnchor);
                    }
                    else {
                        mask = setBit(mask, 4194304 /* isLeftAnchor */);
                    }
                }
            }
            // Remove trailing '*'
            if (filterIndexEnd - filterIndexStart > 0 &&
                line.charCodeAt(filterIndexEnd - 1) === 42 /* '*' */) {
                filterIndexEnd -= 1;
            }
            // Remove leading '*' if the filter is not hostname anchored.
            if (getBit(mask, 1048576 /* isHostnameAnchor */) === false &&
                filterIndexEnd - filterIndexStart > 0 &&
                line.charCodeAt(filterIndexStart) === 42 /* '*' */) {
                mask = clearBit(mask, 4194304 /* isLeftAnchor */);
                filterIndexStart += 1;
            }
            // Transform filters on protocol (http, https, ws)
            if (getBit(mask, 4194304 /* isLeftAnchor */)) {
                if (filterIndexEnd - filterIndexStart === 5 &&
                    fastStartsWithFrom(line, 'ws://', filterIndexStart)) {
                    mask = setBit(mask, 4096 /* fromWebsocket */);
                    mask = clearBit(mask, 4194304 /* isLeftAnchor */);
                    filterIndexStart = filterIndexEnd;
                }
                else if (filterIndexEnd - filterIndexStart === 7 &&
                    fastStartsWithFrom(line, 'http://', filterIndexStart)) {
                    mask = setBit(mask, 4 /* fromHttp */);
                    mask = clearBit(mask, 8 /* fromHttps */);
                    mask = clearBit(mask, 4194304 /* isLeftAnchor */);
                    filterIndexStart = filterIndexEnd;
                }
                else if (filterIndexEnd - filterIndexStart === 8 &&
                    fastStartsWithFrom(line, 'https://', filterIndexStart)) {
                    mask = setBit(mask, 8 /* fromHttps */);
                    mask = clearBit(mask, 4 /* fromHttp */);
                    mask = clearBit(mask, 4194304 /* isLeftAnchor */);
                    filterIndexStart = filterIndexEnd;
                }
                else if (filterIndexEnd - filterIndexStart === 8 &&
                    fastStartsWithFrom(line, 'http*://', filterIndexStart)) {
                    mask = setBit(mask, 8 /* fromHttps */);
                    mask = setBit(mask, 4 /* fromHttp */);
                    mask = clearBit(mask, 4194304 /* isLeftAnchor */);
                    filterIndexStart = filterIndexEnd;
                }
            }
            if (filterIndexEnd - filterIndexStart > 0) {
                filter = line.slice(filterIndexStart, filterIndexEnd).toLowerCase();
                mask = setNetworkMask(mask, 134217728 /* isUnicode */, hasUnicode(filter));
                if (getBit(mask, 67108864 /* isRegex */) === false) {
                    mask = setNetworkMask(mask, 67108864 /* isRegex */, checkIsRegex(filter, 0, filter.length));
                }
            }
            // TODO
            // - ignore hostname anchor is not hostname provided
            if (hostname !== undefined) {
                if (getBit(mask, 1048576 /* isHostnameAnchor */) &&
                    fastStartsWith(hostname, 'www.')) {
                    hostname = hostname.slice(4);
                }
                hostname = hostname.toLowerCase();
                if (hasUnicode(hostname)) {
                    mask = setNetworkMask(mask, 134217728 /* isUnicode */, true);
                    hostname = toASCII(hostname);
                }
            }
        }
        return new NetworkFilter({
            csp: csp,
            filter: filter,
            hostname: hostname,
            mask: mask,
            optDomains: optDomains,
            optNotDomains: optNotDomains,
            rawLine: debug === true ? line : undefined,
            redirect: redirect,
            regex: undefined
        });
    };
    /**
     * Deserialize network filters. The code accessing the buffer should be
     * symetrical to the one in `serializeNetworkFilter`.
     */
    NetworkFilter.deserialize = function (buffer) {
        var mask = buffer.getUint32();
        var optionalParts = buffer.getUint8();
        var isUnicode = getBit(mask, 134217728 /* isUnicode */);
        // The order of these statements is important. Since `buffer.getX()` will
        // internally increment the position of next byte to read, they need to be
        // retrieved in the exact same order they were serialized (check
        // `serializeNetworkFilter`).
        return new NetworkFilter({
            // Mandatory field
            mask: mask,
            // Optional parts
            csp: (optionalParts & 1) === 1 ? buffer.getNetworkCSP() : undefined,
            filter: (optionalParts & 2) === 2
                ? isUnicode
                    ? buffer.getUTF8()
                    : buffer.getNetworkFilter()
                : undefined,
            hostname: (optionalParts & 4) === 4 ? buffer.getNetworkHostname() : undefined,
            optDomains: (optionalParts & 8) === 8 ? buffer.getUint32Array() : undefined,
            optNotDomains: (optionalParts & 16) === 16 ? buffer.getUint32Array() : undefined,
            rawLine: (optionalParts & 32) === 32
                ? isUnicode
                    ? buffer.getUTF8()
                    : buffer.getASCII()
                : undefined,
            redirect: (optionalParts & 64) === 64 ? buffer.getNetworkRedirect() : undefined,
            regex: undefined
        });
    };
    NetworkFilter.prototype.isCosmeticFilter = function () {
        return false;
    };
    NetworkFilter.prototype.isNetworkFilter = function () {
        return true;
    };
    NetworkFilter.prototype.match = function (request) {
        return checkOptions(this, request) && checkPattern(this, request);
    };
    /**
     * To allow for a more compact representation of network filters, the
     * representation is composed of a mandatory header, and some optional
     *
     * Header:
     * =======
     *
     *  | opt | mask
     *     8     32
     *
     * For an empty filter having no pattern, hostname, the minimum size is: 42 bits.
     *
     * Then for each optional part (filter, hostname optDomains, optNotDomains,
     * redirect), it takes 16 bits for the length of the string + the length of the
     * string in bytes.
     *
     * The optional parts are written in order of there number of occurrence in the
     * filter list used by the adblocker. The most common being `hostname`, then
     * `filter`, `optDomains`, `optNotDomains`, `redirect`.
     *
     * Example:
     * ========
     *
     * @@||cliqz.com would result in a serialized version:
     *
     * | 1 | mask | 9 | c | l | i | q | z | . | c | o | m  (16 bytes)
     *
     * In this case, the serialized version is actually bigger than the original
     * filter, but faster to deserialize. In the future, we could optimize the
     * representation to compact small filters better.
     *
     * Ideas:
     *  * variable length encoding for the mask (if not option, take max 1 byte).
     *  * first byte could contain the mask as well if small enough.
     *  * when packing ascii string, store several of them in each byte.
     */
    NetworkFilter.prototype.serialize = function (buffer) {
        buffer.pushUint32(this.mask);
        var index = buffer.getPos();
        buffer.pushUint8(0);
        // This bit-mask indicates which optional parts of the filter were serialized.
        var optionalParts = 0;
        if (this.csp !== undefined) {
            optionalParts |= 1;
            buffer.pushNetworkCSP(this.csp);
        }
        if (this.filter !== undefined) {
            optionalParts |= 2;
            if (this.isUnicode()) {
                buffer.pushUTF8(this.filter);
            }
            else {
                buffer.pushNetworkFilter(this.filter);
            }
        }
        if (this.hostname !== undefined) {
            optionalParts |= 4;
            buffer.pushNetworkHostname(this.hostname);
        }
        if (this.optDomains !== undefined) {
            optionalParts |= 8;
            buffer.pushUint32Array(this.optDomains);
        }
        if (this.optNotDomains !== undefined) {
            optionalParts |= 16;
            buffer.pushUint32Array(this.optNotDomains);
        }
        if (this.rawLine !== undefined) {
            optionalParts |= 32;
            if (this.isUnicode()) {
                buffer.pushUTF8(this.rawLine);
            }
            else {
                buffer.pushASCII(this.rawLine);
            }
        }
        if (this.redirect !== undefined) {
            optionalParts |= 64;
            buffer.pushNetworkRedirect(this.redirect);
        }
        buffer.setByte(index, optionalParts);
    };
    NetworkFilter.prototype.getSerializedSize = function (compression) {
        var estimate = 4 + 1; // mask = 4 bytes // optional parts = 1 byte
        if (this.csp !== undefined) {
            estimate += StaticDataView.sizeOfNetworkCSP(this.csp, compression);
        }
        if (this.filter !== undefined) {
            if (this.isUnicode()) {
                estimate += StaticDataView.sizeOfUTF8(this.filter);
            }
            else {
                estimate += StaticDataView.sizeOfNetworkFilter(this.filter, compression);
            }
        }
        if (this.hostname !== undefined) {
            estimate += StaticDataView.sizeOfNetworkHostname(this.hostname, compression);
        }
        if (this.optDomains !== undefined) {
            estimate += StaticDataView.sizeOfUint32Array(this.optDomains);
        }
        if (this.optNotDomains !== undefined) {
            estimate += StaticDataView.sizeOfUint32Array(this.optNotDomains);
        }
        if (this.rawLine !== undefined) {
            if (this.isUnicode()) {
                estimate += StaticDataView.sizeOfUTF8(this.rawLine);
            }
            else {
                estimate += StaticDataView.sizeOfASCII(this.rawLine);
            }
        }
        if (this.redirect !== undefined) {
            estimate += StaticDataView.sizeOfNetworkRedirect(this.redirect, compression);
        }
        return estimate;
    };
    /**
     * Tries to recreate the original representation of the filter (adblock
     * syntax) from the internal representation. If `rawLine` is set (when filters
     * are parsed in `debug` mode for example), then it is returned directly.
     * Otherwise, we try to stick as closely as possible to the original form;
     * there are things which cannot be recovered though, like domains options
     * of which only hashes are stored.
     */
    NetworkFilter.prototype.toString = function () {
        if (this.rawLine !== undefined) {
            return this.rawLine;
        }
        var filter = '';
        if (this.isException()) {
            filter += '@@';
        }
        if (this.isHostnameAnchor()) {
            filter += '||';
        }
        if (this.isLeftAnchor()) {
            filter += '|';
        }
        if (this.hasHostname()) {
            filter += this.getHostname();
            filter += '^';
        }
        if (!this.isRegex()) {
            filter += this.getFilter();
        }
        else {
            // Visualize the compiled regex
            filter += this.getRegex().source;
        }
        // Options
        var options = [];
        if (!this.fromAny()) {
            var numberOfCptOptions = bitCount(this.getCptMask());
            var numberOfNegatedOptions = bitCount(FROM_ANY) - numberOfCptOptions;
            if (numberOfNegatedOptions < numberOfCptOptions) {
                if (!this.fromImage()) {
                    options.push('~image');
                }
                if (!this.fromMedia()) {
                    options.push('~media');
                }
                if (!this.fromObject()) {
                    options.push('~object');
                }
                if (!this.fromOther()) {
                    options.push('~other');
                }
                if (!this.fromPing()) {
                    options.push('~ping');
                }
                if (!this.fromScript()) {
                    options.push('~script');
                }
                if (!this.fromStylesheet()) {
                    options.push('~stylesheet');
                }
                if (!this.fromSubdocument()) {
                    options.push('~subdocument');
                }
                if (!this.fromWebsocket()) {
                    options.push('~websocket');
                }
                if (!this.fromXmlHttpRequest()) {
                    options.push('~xmlhttprequest');
                }
                if (!this.fromFont()) {
                    options.push('~font');
                }
            }
            else {
                if (this.fromImage()) {
                    options.push('image');
                }
                if (this.fromMedia()) {
                    options.push('media');
                }
                if (this.fromObject()) {
                    options.push('object');
                }
                if (this.fromOther()) {
                    options.push('other');
                }
                if (this.fromPing()) {
                    options.push('ping');
                }
                if (this.fromScript()) {
                    options.push('script');
                }
                if (this.fromStylesheet()) {
                    options.push('stylesheet');
                }
                if (this.fromSubdocument()) {
                    options.push('subdocument');
                }
                if (this.fromWebsocket()) {
                    options.push('websocket');
                }
                if (this.fromXmlHttpRequest()) {
                    options.push('xmlhttprequest');
                }
                if (this.fromFont()) {
                    options.push('font');
                }
            }
        }
        if (this.isFuzzy()) {
            options.push('fuzzy');
        }
        if (this.isImportant()) {
            options.push('important');
        }
        if (this.isRedirect()) {
            options.push("redirect=" + this.getRedirect());
        }
        if (this.isCSP()) {
            options.push("csp=" + this.csp);
        }
        if (this.isGenericHide()) {
            options.push('generichide');
        }
        if (this.firstParty() !== this.thirdParty()) {
            if (this.firstParty()) {
                options.push('first-party');
            }
            if (this.thirdParty()) {
                options.push('third-party');
            }
        }
        if (this.hasOptDomains() || this.hasOptNotDomains()) {
            options.push('domain=<hashed>');
        }
        if (this.isBadFilter()) {
            options.push('badfilter');
        }
        if (options.length > 0) {
            filter += "$" + options.join(',');
        }
        if (this.isRightAnchor()) {
            filter += '|';
        }
        return filter;
    };
    // Public API (Read-Only)
    NetworkFilter.prototype.getIdWithoutBadFilter = function () {
        // This method computes the id ignoring the $badfilter option (which will
        // correspond to the ID of filters being discarded). This allows us to
        // eliminate bad filters by comparing IDs, which is more robust and faster
        // than string comparison.
        return computeFilterId$1(this.csp, this.mask & ~65536 /* isBadFilter */, this.filter, this.hostname, this.optDomains, this.optNotDomains, this.redirect);
    };
    NetworkFilter.prototype.getId = function () {
        if (this.id === undefined) {
            this.id = computeFilterId$1(this.csp, this.mask, this.filter, this.hostname, this.optDomains, this.optNotDomains, this.redirect);
        }
        return this.id;
    };
    NetworkFilter.prototype.hasFilter = function () {
        return this.filter !== undefined;
    };
    NetworkFilter.prototype.hasOptNotDomains = function () {
        return this.optNotDomains !== undefined;
    };
    NetworkFilter.prototype.getOptNotDomains = function () {
        return this.optNotDomains || EMPTY_ARRAY;
    };
    NetworkFilter.prototype.hasOptDomains = function () {
        return this.optDomains !== undefined;
    };
    NetworkFilter.prototype.getOptDomains = function () {
        return this.optDomains || EMPTY_ARRAY;
    };
    NetworkFilter.prototype.getMask = function () {
        return this.mask;
    };
    NetworkFilter.prototype.getCptMask = function () {
        return this.getMask() & FROM_ANY;
    };
    NetworkFilter.prototype.isRedirect = function () {
        return this.redirect !== undefined;
    };
    NetworkFilter.prototype.getRedirect = function () {
        return this.redirect || '';
    };
    NetworkFilter.prototype.hasHostname = function () {
        return this.hostname !== undefined;
    };
    NetworkFilter.prototype.getHostname = function () {
        return this.hostname || '';
    };
    NetworkFilter.prototype.getFilter = function () {
        return this.filter || '';
    };
    NetworkFilter.prototype.getRegex = function () {
        if (this.regex === undefined) {
            this.regex =
                this.filter !== undefined && this.isRegex()
                    ? compileRegex(this.filter, this.isLeftAnchor(), this.isRightAnchor(), this.isFullRegex())
                    : MATCH_ALL;
        }
        return this.regex;
    };
    NetworkFilter.prototype.getFuzzySignature = function () {
        if (this.fuzzySignature === undefined) {
            this.fuzzySignature =
                this.filter !== undefined && this.isFuzzy()
                    ? createFuzzySignature(this.filter)
                    : EMPTY_ARRAY;
        }
        return this.fuzzySignature;
    };
    NetworkFilter.prototype.getTokens = function () {
        TOKENS_BUFFER$1.seekZero();
        // If there is only one domain and no domain negation, we also use this
        // domain as a token.
        if (this.optDomains !== undefined &&
            this.optNotDomains === undefined &&
            this.optDomains.length === 1) {
            TOKENS_BUFFER$1.push(this.optDomains[0]);
        }
        // Get tokens from filter
        if (this.isFullRegex() === false) {
            if (this.filter !== undefined) {
                var skipLastToken = this.isPlain() && !this.isRightAnchor() && !this.isFuzzy();
                var skipFirstToken = !this.isLeftAnchor() && !this.isFuzzy();
                tokenizeFilterInPlace(this.filter, skipFirstToken, skipLastToken, TOKENS_BUFFER$1);
            }
            // Append tokens from hostname, if any
            if (this.hostname !== undefined) {
                tokenizeFilterInPlace(this.hostname, false, this.filter !== undefined && this.filter.charCodeAt(0) === 42 /* '*' */, TOKENS_BUFFER$1);
            }
        }
        else if (this.filter !== undefined) {
            tokenizeRegexInPlace(this.filter, TOKENS_BUFFER$1);
        }
        // If we got no tokens for the filter/hostname part, then we will dispatch
        // this filter in multiple buckets based on the domains option.
        if (TOKENS_BUFFER$1.pos === 0 &&
            this.optDomains !== undefined &&
            this.optNotDomains === undefined) {
            var result = [];
            for (var i = 0; i < this.optDomains.length; i += 1) {
                result.push(new Uint32Array([this.optDomains[i]]));
            }
            return result;
        }
        // Add optional token for protocol
        if (this.fromHttp() === true && this.fromHttps() === false) {
            TOKENS_BUFFER$1.push(HTTP_HASH);
        }
        else if (this.fromHttps() === true && this.fromHttp() === false) {
            TOKENS_BUFFER$1.push(HTTPS_HASH);
        }
        return [TOKENS_BUFFER$1.slice()];
    };
    /**
     * Check if this filter should apply to a request with this content type.
     */
    NetworkFilter.prototype.isCptAllowed = function (cpt) {
        var mask = REQUEST_TYPE_TO_MASK[cpt];
        if (mask !== undefined) {
            return getBit(this.mask, mask);
        }
        // If content type is not supported (or not specified), we return `true`
        // only if the filter does not specify any resource type.
        return this.fromAny();
    };
    NetworkFilter.prototype.isFuzzy = function () {
        return getBit(this.mask, 32768 /* fuzzyMatch */);
    };
    NetworkFilter.prototype.isException = function () {
        return getBit(this.mask, 262144 /* isException */);
    };
    NetworkFilter.prototype.isHostnameAnchor = function () {
        return getBit(this.mask, 1048576 /* isHostnameAnchor */);
    };
    NetworkFilter.prototype.isRightAnchor = function () {
        return getBit(this.mask, 8388608 /* isRightAnchor */);
    };
    NetworkFilter.prototype.isLeftAnchor = function () {
        return getBit(this.mask, 4194304 /* isLeftAnchor */);
    };
    NetworkFilter.prototype.isImportant = function () {
        return getBit(this.mask, 2097152 /* isImportant */);
    };
    NetworkFilter.prototype.isFullRegex = function () {
        return getBit(this.mask, 33554432 /* isFullRegex */);
    };
    NetworkFilter.prototype.isRegex = function () {
        return (getBit(this.mask, 67108864 /* isRegex */) ||
            getBit(this.mask, 33554432 /* isFullRegex */));
    };
    NetworkFilter.prototype.isPlain = function () {
        return !this.isRegex();
    };
    NetworkFilter.prototype.isCSP = function () {
        return getBit(this.mask, 131072 /* isCSP */);
    };
    NetworkFilter.prototype.isGenericHide = function () {
        return getBit(this.mask, 524288 /* isGenericHide */);
    };
    NetworkFilter.prototype.isBadFilter = function () {
        return getBit(this.mask, 65536 /* isBadFilter */);
    };
    NetworkFilter.prototype.isUnicode = function () {
        return getBit(this.mask, 134217728 /* isUnicode */);
    };
    NetworkFilter.prototype.fromAny = function () {
        return this.getCptMask() === FROM_ANY;
    };
    NetworkFilter.prototype.thirdParty = function () {
        return getBit(this.mask, 16777216 /* thirdParty */);
    };
    NetworkFilter.prototype.firstParty = function () {
        return getBit(this.mask, 16384 /* firstParty */);
    };
    NetworkFilter.prototype.fromImage = function () {
        return getBit(this.mask, 16 /* fromImage */);
    };
    NetworkFilter.prototype.fromMedia = function () {
        return getBit(this.mask, 32 /* fromMedia */);
    };
    NetworkFilter.prototype.fromObject = function () {
        return getBit(this.mask, 64 /* fromObject */);
    };
    NetworkFilter.prototype.fromOther = function () {
        return getBit(this.mask, 128 /* fromOther */);
    };
    NetworkFilter.prototype.fromPing = function () {
        return getBit(this.mask, 256 /* fromPing */);
    };
    NetworkFilter.prototype.fromScript = function () {
        return getBit(this.mask, 512 /* fromScript */);
    };
    NetworkFilter.prototype.fromStylesheet = function () {
        return getBit(this.mask, 1024 /* fromStylesheet */);
    };
    NetworkFilter.prototype.fromDocument = function () {
        return getBit(this.mask, 1 /* fromDocument */);
    };
    NetworkFilter.prototype.fromSubdocument = function () {
        return getBit(this.mask, 2048 /* fromSubdocument */);
    };
    NetworkFilter.prototype.fromWebsocket = function () {
        return getBit(this.mask, 4096 /* fromWebsocket */);
    };
    NetworkFilter.prototype.fromHttp = function () {
        return getBit(this.mask, 4 /* fromHttp */);
    };
    NetworkFilter.prototype.fromHttps = function () {
        return getBit(this.mask, 8 /* fromHttps */);
    };
    NetworkFilter.prototype.fromXmlHttpRequest = function () {
        return getBit(this.mask, 8192 /* fromXmlHttpRequest */);
    };
    NetworkFilter.prototype.fromFont = function () {
        return getBit(this.mask, 2 /* fromFont */);
    };
    return NetworkFilter;
}());
// ---------------------------------------------------------------------------
// Filter parsing
// ---------------------------------------------------------------------------
function setNetworkMask(mask, m, value) {
    if (value === true) {
        return setBit(mask, m);
    }
    return clearBit(mask, m);
}
/**
 * Check if the sub-string contained between the indices start and end is a
 * regex filter (it contains a '*' or '^' char).
 */
function checkIsRegex(filter, start, end) {
    var indexOfSeparator = filter.indexOf('^', start);
    if (indexOfSeparator !== -1 && indexOfSeparator < end) {
        return true;
    }
    var indexOfWildcard = filter.indexOf('*', start);
    return indexOfWildcard !== -1 && indexOfWildcard < end;
}
/**
 * Handle hostname anchored filters, given 'hostname' from ||hostname and
 * request's hostname, check if there is a match. This is tricky because
 * filters authors rely and different assumptions. We can have prefix of suffix
 * matches of anchor.
 */
function isAnchoredByHostname(filterHostname, hostname, isFollowedByWildcard) {
    // Corner-case, if `filterHostname` is empty, then it's a match
    if (filterHostname.length === 0) {
        return true;
    }
    // `filterHostname` cannot be longer than actual hostname
    if (filterHostname.length > hostname.length) {
        return false;
    }
    // If they have the same length, they should be equal
    if (filterHostname.length === hostname.length) {
        return filterHostname === hostname;
    }
    // Check if `filterHostname` appears anywhere in `hostname`
    var matchIndex = hostname.indexOf(filterHostname);
    // No match
    if (matchIndex === -1) {
        return false;
    }
    // `filterHostname` is a prefix of `hostname` and needs to match full a label.
    //
    // Examples (filterHostname, hostname):
    //   * (foo, foo.com)
    //   * (sub.foo, sub.foo.com)
    if (matchIndex === 0) {
        return (isFollowedByWildcard ||
            hostname.charCodeAt(filterHostname.length) === 46 ||
            filterHostname.charCodeAt(filterHostname.length - 1) === 46);
    }
    // `filterHostname` is a suffix of `hostname`.
    //
    // Examples (filterHostname, hostname):
    //    * (foo.com, sub.foo.com)
    //    * (com, foo.com)
    if (hostname.length === matchIndex + filterHostname.length) {
        return hostname.charCodeAt(matchIndex - 1) === 46 || filterHostname.charCodeAt(0) === 46;
    }
    // `filterHostname` is infix of `hostname` and needs match full labels
    return ((isFollowedByWildcard ||
        hostname.charCodeAt(filterHostname.length) === 46 ||
        filterHostname.charCodeAt(filterHostname.length - 1) === 46) &&
        (hostname.charCodeAt(matchIndex - 1) === 46 || filterHostname.charCodeAt(0) === 46));
}
// pattern$fuzzy
function checkPatternFuzzyFilter(filter, request) {
    var signature = filter.getFuzzySignature();
    var requestSignature = request.getFuzzySignature();
    if (signature.length > requestSignature.length) {
        return false;
    }
    var lastIndex = 0;
    for (var i = 0; i < signature.length; i += 1) {
        var c = signature[i];
        // Find the occurrence of `c` in `requestSignature`
        var j = requestSignature.indexOf(c, lastIndex);
        if (j === -1) {
            return false;
        }
        lastIndex = j + 1;
    }
    return true;
}
/**
 * Specialize a network filter depending on its type. It allows for more
 * efficient matching function.
 */
function checkPattern(filter, request) {
    var pattern = filter.getFilter();
    if (filter.isHostnameAnchor()) {
        // Make sure request is anchored by hostname before proceeding to matching
        var filterHostname = filter.getHostname();
        if (isAnchoredByHostname(filterHostname, request.hostname, filter.filter !== undefined && filter.filter.charCodeAt(0) === 42 /* '*' */) === false) {
            return false;
        }
        // At this point we know request is hostname anchored so we match the rest of the filter.
        if (filter.isRegex()) {
            // ||pattern*^
            return filter
                .getRegex()
                .test(request.url.slice(request.url.indexOf(filterHostname) + filterHostname.length));
        }
        else if (filter.isRightAnchor() && filter.isLeftAnchor()) {
            // |||pattern|
            // Since this is not a regex, the filter pattern must follow the hostname
            // with nothing in between. So we extract the part of the URL following
            // after hostname and will perform the matching on it.
            var urlAfterHostname = request.url.slice(request.url.indexOf(filterHostname) + filterHostname.length);
            // Since it must follow immediatly after the hostname and be a suffix of
            // the URL, we conclude that filter must be equal to the part of the
            // url following the hostname.
            return pattern === urlAfterHostname;
        }
        else if (filter.isRightAnchor()) {
            // ||pattern|
            var requestHostname = request.hostname;
            if (filter.hasFilter() === false) {
                // In this specific case it means that the specified hostname should match
                // at the end of the hostname of the request. This allows to prevent false
                // positive like ||foo.bar which would match https://foo.bar.baz where
                // ||foo.bar^ would not.
                return (filterHostname.length === requestHostname.length ||
                    requestHostname.endsWith(filterHostname));
            }
            else {
                // pattern|
                return request.url.endsWith(pattern);
            }
        }
        else if (filter.isFuzzy()) {
            // ||pattern$fuzzy
            return checkPatternFuzzyFilter(filter, request);
        }
        else if (filter.isLeftAnchor()) {
            // ||pattern + left-anchor => This means that a plain pattern needs to appear
            // exactly after the hostname, with nothing in between.
            // Since this is not a regex, the filter pattern must follow the hostname
            // with nothing in between. So we extract the part of the URL following
            // after hostname and will perform the matching on it.
            return fastStartsWithFrom(request.url, pattern, request.url.indexOf(filterHostname) + filterHostname.length);
        }
        if (filter.hasFilter() === false) {
            return true;
        }
        // We consider this a match if the plain patter (i.e.: filter) appears anywhere.
        return (request.url.indexOf(pattern, request.url.indexOf(filterHostname) + filterHostname.length) !==
            -1);
    }
    else if (filter.isRegex()) {
        // pattern*^
        return filter.getRegex().test(request.url);
    }
    else if (filter.isLeftAnchor() && filter.isRightAnchor()) {
        // |pattern|
        return request.url === pattern;
    }
    else if (filter.isLeftAnchor()) {
        // |pattern
        return fastStartsWith(request.url, pattern);
    }
    else if (filter.isRightAnchor()) {
        // pattern|
        return request.url.endsWith(pattern);
    }
    else if (filter.isFuzzy()) {
        return checkPatternFuzzyFilter(filter, request);
    }
    // pattern
    if (filter.hasFilter() === false) {
        return true;
    }
    return request.url.indexOf(pattern) !== -1;
}
function checkOptions(filter, request) {
    // We first discard requests based on type, protocol and party. This is really
    // cheap and should be done first.
    if (filter.isCptAllowed(request.type) === false ||
        (request.isHttps === true && filter.fromHttps() === false) ||
        (request.isHttp === true && filter.fromHttp() === false) ||
        (filter.firstParty() === false && request.isFirstParty === true) ||
        (filter.thirdParty() === false && request.isThirdParty === true)) {
        return false;
    }
    // Source URL must be among these domains to match
    if (filter.hasOptDomains()) {
        var optDomains = filter.getOptDomains();
        if (binLookup(optDomains, request.sourceHostnameHash) === false &&
            binLookup(optDomains, request.sourceDomainHash) === false) {
            return false;
        }
    }
    // Source URL must not be among these domains to match
    if (filter.hasOptNotDomains()) {
        var optNotDomains = filter.getOptNotDomains();
        if (binLookup(optNotDomains, request.sourceHostnameHash) === true ||
            binLookup(optNotDomains, request.sourceDomainHash) === true) {
            return false;
        }
    }
    return true;
}

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
/**
 * Given a single line (string), checks if this would likely be a cosmetic
 * filter, a network filter or something that is not supported. This check is
 * performed before calling a more specific parser to create an instance of
 * `NetworkFilter` or `CosmeticFilter`.
 */
function detectFilterType(line) {
    // Ignore empty line
    if (line.length === 0 || line.length === 1) {
        return 0 /* NOT_SUPPORTED */;
    }
    // Ignore comments
    var firstCharCode = line.charCodeAt(0);
    var secondCharCode = line.charCodeAt(1);
    if (firstCharCode === 33 /* '!' */ ||
        (firstCharCode === 35 /* '#' */ && secondCharCode <= 32) ||
        (firstCharCode === 91 /* '[' */ && fastStartsWith(line, '[Adblock'))) {
        return 0 /* NOT_SUPPORTED */;
    }
    // Fast heuristics to detect network filters
    var lastCharCode = line.charCodeAt(line.length - 1);
    if (firstCharCode === 36 /* '$' */ ||
        firstCharCode === 38 /* '&' */ ||
        firstCharCode === 42 /* '*' */ ||
        firstCharCode === 45 /* '-' */ ||
        firstCharCode === 46 /* '.' */ ||
        firstCharCode === 47 /* '/' */ ||
        firstCharCode === 58 /* ':' */ ||
        firstCharCode === 61 /* '=' */ ||
        firstCharCode === 63 /* '?' */ ||
        firstCharCode === 64 /* '@' */ ||
        firstCharCode === 95 /* '_' */ ||
        firstCharCode === 124 /* '|' */ ||
        lastCharCode === 124 /* '|' */) {
        return 1 /* NETWORK */;
    }
    // Ignore Adguard cosmetics
    // `$$` = HTML filtering rules
    var dollarIndex = line.indexOf('$');
    if (dollarIndex !== -1 && dollarIndex !== line.length - 1) {
        var afterDollarIndex = dollarIndex + 1;
        var afterDollarCharCode = line.charCodeAt(afterDollarIndex);
        // Ignore Adguard HTML rewrite rules
        if (afterDollarCharCode === 36 /* '$' */ ||
            (afterDollarCharCode === 64 /* '@' */ &&
                fastStartsWithFrom(line, /* $@$ */ '@$', afterDollarIndex))) {
            return 0 /* NOT_SUPPORTED */;
        }
    }
    // Check if filter is cosmetics
    var sharpIndex = line.indexOf('#');
    if (sharpIndex !== -1 && sharpIndex !== line.length - 1) {
        var afterSharpIndex = sharpIndex + 1;
        var afterSharpCharCode = line.charCodeAt(afterSharpIndex);
        if (afterSharpCharCode === 35 /* '#'*/ ||
            (afterSharpCharCode === 64 /* '@' */ &&
                fastStartsWithFrom(line, /* #@# */ '@#', afterSharpIndex))) {
            // Parse supported cosmetic filter
            // `##` `#@#`
            return 2 /* COSMETIC */;
        }
        else if ((afterSharpCharCode === 64 /* '@'*/ &&
            (fastStartsWithFrom(line, /* #@$# */ '@$#', afterSharpIndex) ||
                fastStartsWithFrom(line, /* #@%# */ '@%#', afterSharpIndex))) ||
            (afterSharpCharCode === 37 /* '%' */ &&
                fastStartsWithFrom(line, /* #%# */ '%#', afterSharpIndex)) ||
            (afterSharpCharCode === 36 /* '$' */ &&
                fastStartsWithFrom(line, /* #$# */ '$#', afterSharpIndex)) ||
            (afterSharpCharCode === 63 /* '?' */ &&
                fastStartsWithFrom(line, /* #?# */ '?#', afterSharpIndex))) {
            // Ignore Adguard cosmetics
            // `#$#` `#@$#`
            // `#%#` `#@%#`
            // `#?#`
            return 0 /* NOT_SUPPORTED */;
        }
    }
    // Everything else is a network filter
    return 1 /* NETWORK */;
}
function parseFilters(list, config) {
    if (config === void 0) { config = new Config(); }
    config = new Config(config);
    var networkFilters = [];
    var cosmeticFilters = [];
    var lines = list.split('\n');
    for (var i = 0; i < lines.length; i += 1) {
        var line = lines[i];
        // Check if `line` should be trimmed before parsing
        var isTrimmingNeeded = line.length > 1 && (line.charCodeAt(0) <= 32 || line.charCodeAt(line.length - 1) <= 32);
        if (isTrimmingNeeded) {
            line = line.trim();
        }
        // Detect if filter is supported, network or cosmetic
        var filterType = detectFilterType(line);
        if (filterType === 1 /* NETWORK */ && config.loadNetworkFilters === true) {
            var filter = NetworkFilter.parse(line, config.debug);
            if (filter !== null) {
                networkFilters.push(filter);
            }
        }
        else if (filterType === 2 /* COSMETIC */ && config.loadCosmeticFilters === true) {
            var filter = CosmeticFilter.parse(line, config.debug);
            if (filter !== null) {
                if (config.loadGenericCosmeticsFilters === true || filter.isGenericHide() === false) {
                    cosmeticFilters.push(filter);
                }
            }
        }
    }
    return { networkFilters: networkFilters, cosmeticFilters: cosmeticFilters };
}

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
var TLDTS_OPTIONS = {
    extractHostname: true,
    mixedInputs: false,
    validateHostname: false
};
var TOKENS_BUFFER$2 = new TokensBuffer(300);
var Request = /** @class */ (function () {
    function Request(_a) {
        var requestId = _a.requestId, tabId = _a.tabId, type = _a.type, domain = _a.domain, hostname = _a.hostname, url = _a.url, sourceDomain = _a.sourceDomain, sourceHostname = _a.sourceHostname;
        this.id = requestId;
        this.tabId = tabId;
        this.type = type;
        this.url = url;
        this.hostname = hostname;
        this.domain = domain;
        this.sourceHostname = sourceHostname;
        this.sourceDomain = sourceDomain;
        this.sourceHostnameHash = fastHash(this.sourceHostname);
        this.sourceDomainHash = fastHash(this.sourceDomain);
        // Decide on party
        this.isThirdParty = this.sourceDomain.length === 0 ? false : this.sourceDomain !== this.domain;
        this.isFirstParty = !this.isThirdParty;
        // Check protocol
        this.isSupported = true;
        if (this.url.startsWith('http:')) {
            this.isHttp = true;
            this.isHttps = false;
        }
        else if (this.url.startsWith('https:')) {
            this.isHttps = true;
            this.isHttp = false;
        }
        else if (this.url.startsWith('ws:') || this.url.startsWith('wss:')) {
            this.isHttp = false;
            this.isHttps = false;
            this.type = 'websocket';
            this.isSupported = true;
        }
        else {
            this.isHttp = false;
            this.isHttps = false;
            this.isSupported = false;
        }
        // Lazy attributes
        this.tokens = undefined;
        this.fuzzySignature = undefined;
    }
    /**
     * Create an instance of `Request` from raw request details.
     */
    Request.fromRawDetails = function (_a) {
        var _b = _a.requestId, requestId = _b === void 0 ? '0' : _b, _c = _a.tabId, tabId = _c === void 0 ? 0 : _c, _d = _a.url, url = _d === void 0 ? '' : _d, hostname = _a.hostname, domain = _a.domain, _e = _a.sourceUrl, sourceUrl = _e === void 0 ? '' : _e, sourceHostname = _a.sourceHostname, sourceDomain = _a.sourceDomain, _f = _a.type, type = _f === void 0 ? 'main_frame' : _f;
        url = url.toLowerCase();
        if (hostname === undefined || domain === undefined) {
            var parsed = parse(url, TLDTS_OPTIONS);
            hostname = hostname || parsed.hostname || '';
            domain = domain || parsed.domain || '';
        }
        // Initialize source URL
        if (sourceHostname === undefined || sourceDomain === undefined) {
            var parsed = parse(sourceUrl, TLDTS_OPTIONS);
            sourceHostname = sourceHostname || parsed.hostname || '';
            sourceDomain = sourceDomain || parsed.domain || '';
        }
        // source URL
        return new Request({
            requestId: requestId,
            tabId: tabId,
            domain: domain,
            hostname: hostname,
            url: url,
            sourceDomain: sourceDomain,
            sourceHostname: sourceHostname,
            sourceUrl: sourceUrl,
            type: type
        });
    };
    Request.prototype.getTokens = function () {
        if (this.tokens === undefined) {
            TOKENS_BUFFER$2.seekZero();
            if (this.sourceDomain) {
                TOKENS_BUFFER$2.push(fastHash(this.sourceDomain));
            }
            if (this.sourceHostname) {
                TOKENS_BUFFER$2.push(fastHash(this.sourceHostname));
            }
            tokenizeInPlace(this.url, TOKENS_BUFFER$2);
            this.tokens = TOKENS_BUFFER$2.slice();
        }
        return this.tokens;
    };
    Request.prototype.getFuzzySignature = function () {
        if (this.fuzzySignature === undefined) {
            this.fuzzySignature = createFuzzySignature(this.url);
        }
        return this.fuzzySignature;
    };
    Request.prototype.isMainFrame = function () {
        return this.type === 'main_frame' || this.type === 'mainFrame';
    };
    Request.prototype.isSubFrame = function () {
        return this.type === 'sub_frame' || this.type === 'subFrame';
    };
    return Request;
}());

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
// TODO - support # alias
// TODO - support empty resource body
/**
 * Abstraction on top of resources.txt used for redirections as well as script
 * injections. It contains logic to parse, serialize and get resources by name
 * for use in the engine.
 */
var Resources = /** @class */ (function () {
    function Resources(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.checksum, checksum = _c === void 0 ? '' : _c, _d = _b.js, js = _d === void 0 ? new Map() : _d, _e = _b.resources, resources = _e === void 0 ? new Map() : _e;
        this.checksum = checksum;
        this.js = js;
        this.resources = resources;
    }
    Resources.deserialize = function (buffer) {
        var checksum = buffer.getASCII();
        // Deserialize `resources`
        var resources = new Map();
        var numberOfResources = buffer.getUint16();
        for (var i = 0; i < numberOfResources; i += 1) {
            resources.set(buffer.getASCII(), {
                contentType: buffer.getASCII(),
                data: buffer.getASCII()
            });
        }
        // Deserialize `js`
        var js = new Map();
        resources.forEach(function (_a, name) {
            var contentType = _a.contentType, data = _a.data;
            if (contentType === 'application/javascript') {
                js.set(name, data);
            }
        });
        return new Resources({
            checksum: checksum,
            js: js,
            resources: resources
        });
    };
    Resources.parse = function (data, _a) {
        var checksum = _a.checksum;
        var typeToResource = new Map();
        var trimComments = function (str) { return str.replace(/^\s*#.*$/gm, ''); };
        var chunks = data.split('\n\n');
        for (var i = 0; i < chunks.length; i += 1) {
            var resource = trimComments(chunks[i]).trim();
            if (resource.length !== 0) {
                var firstNewLine = resource.indexOf('\n');
                var split = resource.slice(0, firstNewLine).split(/\s+/);
                var name_1 = split[0];
                var type = split[1];
                var body = resource.slice(firstNewLine + 1);
                if (name_1 === undefined || type === undefined || body === undefined) {
                    continue;
                }
                if (!typeToResource.has(type)) {
                    typeToResource.set(type, new Map());
                }
                typeToResource.get(type).set(name_1, body);
            }
        }
        // the resource containing javascirpts to be injected
        var js = typeToResource.get('application/javascript');
        // Create a mapping from resource name to { contentType, data }
        // used for request redirection.
        var resourcesByName = new Map();
        typeToResource.forEach(function (resources, contentType) {
            resources.forEach(function (resource, name) {
                resourcesByName.set(name, {
                    contentType: contentType,
                    data: resource
                });
            });
        });
        return new Resources({
            checksum: checksum,
            js: js,
            resources: resourcesByName
        });
    };
    Resources.prototype.getResource = function (name) {
        return this.resources.get(name);
    };
    Resources.prototype.getSerializedSize = function () {
        var estimatedSize = (StaticDataView.sizeOfASCII(this.checksum) +
            (2 * StaticDataView.sizeOfByte()) // resources.size
        );
        this.resources.forEach(function (_a, name) {
            var contentType = _a.contentType, data = _a.data;
            estimatedSize += (StaticDataView.sizeOfASCII(name) +
                StaticDataView.sizeOfASCII(contentType) +
                StaticDataView.sizeOfASCII(data));
        });
        return estimatedSize;
    };
    Resources.prototype.serialize = function (buffer) {
        // Serialize `checksum`
        buffer.pushASCII(this.checksum);
        // Serialize `resources`
        buffer.pushUint16(this.resources.size);
        this.resources.forEach(function (_a, name) {
            var contentType = _a.contentType, data = _a.data;
            buffer.pushASCII(name);
            buffer.pushASCII(contentType);
            buffer.pushASCII(data);
        });
    };
    return Resources;
}());

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
function processRegex(r) {
    return "(?:" + r.source + ")";
}
function escape(s) {
    return "(?:" + s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + ")";
}
function setWithDefault(map, key, value) {
    var bucket = map.get(key);
    if (bucket === undefined) {
        bucket = [];
        map.set(key, bucket);
    }
    bucket.push(value);
}
function groupBy(filters, criteria) {
    var grouped = new Map();
    for (var i = 0; i < filters.length; i += 1) {
        var filter = filters[i];
        setWithDefault(grouped, criteria(filter), filter);
    }
    return Array.from(grouped.values());
}
function splitBy(filters, condition) {
    var positive = [];
    var negative = [];
    for (var i = 0; i < filters.length; i += 1) {
        var filter = filters[i];
        if (condition(filter)) {
            positive.push(filter);
        }
        else {
            negative.push(filter);
        }
    }
    return {
        negative: negative,
        positive: positive
    };
}
var OPTIMIZATIONS = [
    // TODO - add filter deduplication
    {
        description: 'Group idential filter with same mask but different domains in single filters',
        fusion: function (filters) {
            var domains = new Set();
            var notDomains = new Set();
            for (var i = 0; i < filters.length; i += 1) {
                var _a = filters[i], optDomains = _a.optDomains, optNotDomains = _a.optNotDomains;
                if (optDomains !== undefined) {
                    optDomains.forEach(function (d) {
                        domains.add(d);
                    });
                }
                if (optNotDomains !== undefined) {
                    optNotDomains.forEach(function (d) {
                        notDomains.add(d);
                    });
                }
            }
            return new NetworkFilter(Object.assign({}, filters[0], {
                optDomains: domains.size > 0 ? new Uint32Array(domains).sort() : undefined,
                optNotDomains: notDomains.size > 0 ? new Uint32Array(notDomains).sort() : undefined,
                rawLine: filters[0].rawLine !== undefined
                    ? filters.map(function (_a) {
                        var rawLine = _a.rawLine;
                        return rawLine;
                    }).join(' <+> ')
                    : undefined
            }));
        },
        groupByCriteria: function (filter) {
            return filter.getHostname() + filter.getFilter() + filter.getMask() + filter.getRedirect();
        },
        select: function (filter) {
            return !filter.isFuzzy() &&
                !filter.isCSP() &&
                (filter.hasOptDomains() || filter.hasOptNotDomains());
        }
    },
    {
        description: 'Group simple patterns, into a single filter',
        fusion: function (filters) {
            var patterns = [];
            for (var i = 0; i < filters.length; i += 1) {
                var f = filters[i];
                if (f.isRegex()) {
                    patterns.push(processRegex(f.getRegex()));
                }
                else if (f.isRightAnchor()) {
                    patterns.push(escape(f.getFilter()) + "$");
                }
                else if (f.isLeftAnchor()) {
                    patterns.push("^" + escape(f.getFilter()));
                }
                else {
                    patterns.push(escape(f.getFilter()));
                }
            }
            return new NetworkFilter(Object.assign({}, filters[0], {
                mask: setBit(filters[0].mask, 67108864 /* isRegex */),
                rawLine: filters[0].rawLine !== undefined
                    ? filters.map(function (_a) {
                        var rawLine = _a.rawLine;
                        return rawLine;
                    }).join(' <+> ')
                    : undefined,
                regex: new RegExp(patterns.join('|'))
            }));
        },
        groupByCriteria: function (filter) { return '' + filter.getMask(); },
        select: function (filter) {
            return !filter.isFuzzy() &&
                !filter.hasOptDomains() &&
                !filter.hasOptNotDomains() &&
                !filter.isHostnameAnchor() &&
                !filter.isRedirect() &&
                !filter.isCSP();
        }
    },
];
/**
 * Optimizer which returns the list of original filters.
 */
function noopOptimizeNetwork(filters) {
    return filters;
}
function noopOptimizeCosmetic(filters) {
    return filters;
}
/**
 * Fusion a set of `filters` by applying optimizations sequentially.
 */
function optimizeNetwork(filters) {
    var fused = [];
    var toFuse = filters;
    for (var i = 0; i < OPTIMIZATIONS.length; i += 1) {
        var _a = OPTIMIZATIONS[i], select = _a.select, fusion = _a.fusion, groupByCriteria = _a.groupByCriteria;
        var _b = splitBy(toFuse, select), positive = _b.positive, negative = _b.negative;
        toFuse = negative;
        var groups = groupBy(positive, groupByCriteria);
        for (var j = 0; j < groups.length; j += 1) {
            var group = groups[j];
            if (group.length > 1) {
                fused.push(fusion(group));
            }
            else {
                toFuse.push(group[0]);
            }
        }
    }
    for (var i = 0; i < toFuse.length; i += 1) {
        fused.push(toFuse[i]);
    }
    return fused;
}

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
// https://graphics.stanford.edu/~seander/bithacks.html#RoundUpPowerOf2
function nextPow2(v) {
    v--;
    v |= v >> 1;
    v |= v >> 2;
    v |= v >> 4;
    v |= v >> 8;
    v |= v >> 16;
    v++;
    return v;
}
/**
 * Counter implemented on top of Map.
 */
var Counter = /** @class */ (function () {
    function Counter() {
        this.counter = new Map();
    }
    Counter.prototype.incr = function (key) {
        this.counter.set(key, (this.counter.get(key) || 0) + 1);
    };
    Counter.prototype.get = function (key) {
        return this.counter.get(key) || 0;
    };
    Counter.prototype.set = function (key, value) {
        this.counter.set(key, value);
    };
    return Counter;
}());
/**
 * Generate unique IDs for requests, which is used to avoid matching the same
 * buckets multiple times on the same request (which can happen if a token
 * appears more than once in a URL).
 */
var UID = 1;
function getNextId() {
    var id = UID;
    UID = (UID + 1) % 1000000000;
    return id;
}
var EMPTY_BUCKET = Number.MAX_SAFE_INTEGER >>> 0;
/**
 * The ReverseIndex is an accelerating data structure which allows finding a
 * subset of the filters given a list of tokens seen in a URL. It is the core
 * of the adblocker's matching capabilities and speed.
 *
 * It has mainly two caracteristics:
 * 1. It is very compact and is able to load fast.
 * 2. It is *very fast* in finding potential candidates.
 *
 * Conceptually, the reverse index dispatches filters in "buckets" (an array of
 * one or more filters). Filters living in the same bucket are guaranteed to
 * share at least one of their tokens (appearing in the pattern). For example:
 *
 *   - Bucket 1 (ads):
 *       - /ads.js
 *       - /script/ads/tracking.js
 *       - /ads/
 *   - Bucket 2 (tracking)
 *       - /tracking.js
 *       - ||tracking.com/cdn
 *
 * We see that filters in "Bucket 1" are indexed using the token "ads" and
 * "Bucket 2" using token "tracking".
 *
 * This property allows to quickly discard most of the filters when we match a
 * URL. To achieve this, the URL is tokenized in the same way filters are
 * tokenized and for each token, we check if there are some filters available.
 *
 * For example:
 *
 *  URL "https://tracking.com/" has the following tokens: "https", "tracking"
 *  and "com". We immediatly see that we only check the two filters in the
 *  "tracking" bucket since they are the only ones having a common token with
 *  the URL.
 *
 * How do we pick the token for each filter?
 * =========================================
 *
 * Each filter is only indexed *once*, which means that we need to pick one of
 * the tokens appearing in the pattern. We choose the token such that each
 * filter is indexed using the token which was the *least seen* globally. In
 * other words, we pick the most discriminative token for each filter. This is
 * done using the following algorithm:
 *   1. Tokenize all the filters which will be stored in the index
 *   2. Compute a histogram of frequency of each token (globally)
 *   3. Select the best token for each filter (lowest frequency)
 */
var ReverseIndex = /** @class */ (function () {
    function ReverseIndex(_a) {
        var deserialize = _a.deserialize, filters = _a.filters, optimize = _a.optimize, config = _a.config;
        // Internal, compact representation of the reverse index. It contains three
        // distinct parts stored in the same typed array:
        //
        // 1. "tokens lookup index" allows to identify a sub-set of buckets which
        // likely contain filters for a given token. It is an approximate dispatch
        // table which maps a mask of N bits (N being smaller than 31 bits, the size
        // of a token) to a list of buckets having a 'token' sharing these same N
        // bits sub-set. If the binary representation of the token for bucket1 is
        // 101010 and suffix has size 3, then we would lookup the "tokens lookup
        // index" using the last 3 bits "010" which would give us the offset in our
        // typed array where we can start reading the filters of buckets having a
        // token ending with the same 3 bits. The value of N is always a power of 2
        // depending on the total number of filters stored in the index; determined
        // at the time `update(...)` is called.
        //
        // 2. "buckets index" is an array which associates tokens to filters. The
        // structure is: token, filter, token, filter, etc. To identify all the
        // filters indexed with 'token' a naive approach would be to iterate on
        // "buckets index" and collect all the filters indexed with 'token'. This
        // would be *very inefficient*! To make this process faster, filters in
        // "buckets index" are grouped so that buckets sharing the same suffix of N
        // bits in their indexing token (see "tokens lookup index") are stored side
        // by side in the typed array. To know where this section start given a
        // particular token, we use "tokens lookup index" which associated the suffix
        // of size N to an index in "buckets index". From there we can iterate on the
        // candidates.
        //
        // 3. "filters index" contains the filters themselves. "buckets index"
        // presented earlier does not contain filters, but an index to the "filters
        // index". This allows a filter to be indexed multiple times without
        // introducing any overhead; the filter can be associated with multiple
        // tokens in "buckets index" (each pointing to the same place in "filters
        // index") but its actual representation is stored only once in "filters
        // index".
        this.bucketsIndex = EMPTY_UINT32_ARRAY;
        this.filtersIndexStart = 0;
        this.numberOfFilters = 0;
        this.tokensLookupIndex = EMPTY_UINT32_ARRAY;
        // In-memory cache used to keep track of buckets which have been loaded from
        // the compact representation (i.e.: this.view). It is not strictly necessary
        // but will speed-up retrival of popular filters (since we do not have to
        // perform the lookup in "tokens index" and "buckets index" everytime).
        this.cache = new Map();
        this.view = StaticDataView.empty(config);
        this.deserializeFilter = deserialize;
        this.optimize = optimize;
        this.config = config;
        if (filters.length !== 0) {
            this.update(filters, undefined);
        }
    }
    ReverseIndex.deserialize = function (buffer, deserialize, optimize, config) {
        var tokensLookupIndexSize = buffer.getUint32();
        var bucketsIndexSize = buffer.getUint32();
        var numberOfFilters = buffer.getUint32();
        // Alignement to 4 bytes is important here since `view` (Uint8Array) can
        // appear at any offset of `buffer`. But to be sure we can read back
        // Uint32Array directly from raw buffer, the alignement has to be a
        // multiple of 4. The same alignement is taken care of in `serialize`.
        var view = StaticDataView.fromUint8Array(buffer.getBytes(true /* align */), config);
        var tokensLookupIndex = view.getUint32ArrayView(tokensLookupIndexSize);
        var bucketsIndex = view.getUint32ArrayView(bucketsIndexSize);
        var filtersIndexStart = view.pos;
        view.seekZero(); // not strictly needed but make sure reverse index can be compared with deep equal
        return (new ReverseIndex({
            config: config,
            deserialize: deserialize,
            filters: [],
            optimize: optimize
        })).updateInternals({
            bucketsIndex: bucketsIndex,
            filtersIndexStart: filtersIndexStart,
            numberOfFilters: numberOfFilters,
            tokensLookupIndex: tokensLookupIndex,
            view: view
        });
    };
    /**
     * Load all filters from this index in memory (i.e.: deserialize them from
     * the byte array into NetworkFilter or CosmeticFilter instances). This is
     * mostly useful for debugging or testing purposes.
     */
    ReverseIndex.prototype.getFilters = function () {
        var filters = [];
        if (this.numberOfFilters === 0) {
            return filters;
        }
        // set view cursor at the start of "filters index"
        this.view.setPos(this.filtersIndexStart);
        for (var i = 0; i < this.numberOfFilters; i += 1) {
            filters.push(this.deserializeFilter(this.view));
        }
        return filters;
    };
    /**
     * Return an array of all the tokens currently used as keys of the "buckets index".
     */
    ReverseIndex.prototype.getTokens = function () {
        var tokens = new Set();
        for (var i = 0; i < this.bucketsIndex.length; i += 2) {
            tokens.add(this.bucketsIndex[i]);
        }
        return new Uint32Array(tokens);
    };
    /**
     * Estimate the number of bytes needed to serialize this instance of `ReverseIndex`.
     */
    ReverseIndex.prototype.getSerializedSize = function () {
        // 12 = 4 bytes (tokensLookupIndex.length) + 4 bytes (bucketsIndex.length) + 4 bytes (numberOfFilters)
        return 12 + StaticDataView.sizeOfBytes(this.view.buffer, true /* align */);
    };
    /**
     * Dump this index to `buffer`.
     */
    ReverseIndex.prototype.serialize = function (buffer) {
        buffer.pushUint32(this.tokensLookupIndex.length);
        buffer.pushUint32(this.bucketsIndex.length);
        buffer.pushUint32(this.numberOfFilters);
        // Aligmenent is crucial here, see comment in `deserialize` for more info.
        buffer.pushBytes(this.view.buffer, true /* align */);
    };
    /**
     * Iterate on all filters found in buckets associated with the given list of
     * tokens. The callback is called on each of them. Early termination can be
     * achieved if the callback returns `false`.
     *
     * This will not check if each filter returned would match a given request but
     * is instead used as a list of potential candidates (much smaller than the
     * total set of filters; typically between 5 and 10 filters will be checked).
     */
    ReverseIndex.prototype.iterMatchingFilters = function (tokens, cb) {
        // Each request is assigned an ID so that we can keep track of the last
        // request seen by each bucket in the reverse index. This provides a cheap
        // way to prevent filters from being inspected more than once per request
        // (which could happen if the same token appears more than once in the URL).
        var requestId = getNextId();
        for (var i = 0; i < tokens.length; i += 1) {
            if (this.iterBucket(tokens[i], requestId, cb) === false) {
                return;
            }
        }
        // Fallback to 0 (i.e.: wildcard bucket) bucket if nothing was found before.
        this.iterBucket(0, requestId, cb);
    };
    /**
     * Re-create the internal data-structure of the reverse index *in-place*. It
     * needs to be called with a list of new filters and optionally a list of ids
     * (as returned by either NetworkFilter.getId() or CosmeticFilter.getId())
     * which need to be removed from the index.
     */
    ReverseIndex.prototype.update = function (newFilters, removedFilters) {
        // Reset internal cache on each update
        if (this.cache.size !== 0) {
            this.cache.clear();
        }
        var compression = this.config.enableCompression;
        var totalNumberOfTokens = 0;
        var totalNumberOfIndexedFilters = 0;
        var filtersTokens = [];
        var histogram = new Counter();
        // Keep track of the final size of the buckets index. `bucketsIndexSize` is
        // the number of indexed filters, multiplied by 2 (since we store both the
        // token a filter is indexed with and the index of the filter).
        var bucketsIndexSize = 0;
        // Re-use the current size of "filters index" as a starting point so that
        // we only need to update with new or removed filters. This saves time if
        // we perform a small update on an existing index.
        var estimatedBufferSize = this.view.buffer.byteLength - this.filtersIndexStart;
        // Create a list of all filters which will be part of the index. This means
        // loading existing filters, removing the ones that need to be deleted and
        // adding the new ones.  At the same time, we update the estimation of
        // buffer size needed to store this index.
        var filters = this.getFilters();
        if (filters.length !== 0) {
            // If there is at least one existing filter, then we check if some should
            // be removed. We subtract their size from the total estimated buffer
            // size.
            if (removedFilters !== undefined && removedFilters.size !== 0) {
                filters = filters.filter(function (f) {
                    if (removedFilters.has(f.getId())) {
                        estimatedBufferSize -= f.getSerializedSize(compression);
                        return false;
                    }
                    return true;
                });
            }
            // Add new filters to the list and also update estimated size
            for (var i = 0; i < newFilters.length; i += 1) {
                var filter = newFilters[i];
                estimatedBufferSize += filter.getSerializedSize(compression);
                filters.push(filter);
            }
        }
        else {
            // In the case where there is no existing filter in the index (happens on
            // initialization), then we can take a fast-path and not check removed
            // filters at all. There is also no need to copy the array of filters.
            filters = newFilters;
            for (var i = 0; i < newFilters.length; i += 1) {
                estimatedBufferSize += newFilters[i].getSerializedSize(compression);
            }
        }
        // No filters given; reset to empty index and abort.
        if (filters.length === 0) {
            this.updateInternals({
                bucketsIndex: EMPTY_UINT32_ARRAY,
                filtersIndexStart: 0,
                numberOfFilters: 0,
                tokensLookupIndex: EMPTY_UINT32_ARRAY,
                view: StaticDataView.empty(this.config)
            });
            return;
        }
        // When we run in `debug` mode, we enable fully deterministic updates of
        // internal data-structure. To this effect, we sort all filters before
        // insertion.
        if (this.config.debug === true) {
            filters.sort(function (f1, f2) { return f1.getId() - f2.getId(); });
        }
        // Tokenize all filters stored in this index. And compute a histogram of
        // tokens so that we can decide how to index each filter efficiently.
        for (var i = 0; i < filters.length; i += 1) {
            var filter = filters[i];
            // Tokenize `filter` and store the result in `filtersTokens` which will
            // be used in the next step to select the best token for each filter.
            var multiTokens = filter.getTokens();
            filtersTokens.push({
                filter: filter,
                multiTokens: multiTokens
            });
            // Update estimated size of "buckets index" based on number of times this
            // particular filter will be indexed.
            bucketsIndexSize += 2 * multiTokens.length; // token + filter index
            totalNumberOfIndexedFilters += multiTokens.length;
            // Each filter can be indexed more than once, so `getTokens(...)` returns
            // multiple sets of tokens. We iterate on all of them and update the
            // histogram for each.
            for (var j = 0; j < multiTokens.length; j += 1) {
                var tokens = multiTokens[j];
                totalNumberOfTokens += tokens.length;
                for (var k = 0; k < tokens.length; k += 1) {
                    histogram.incr(tokens[k]);
                }
            }
        }
        // Add size of bucketsIndex to total size (x4 because these are 32 bits numbers)
        estimatedBufferSize += bucketsIndexSize * 4;
        // Prepare "tokens index" (see documentation in constructor of `ReverseIndex` class above).
        var tokensLookupIndexSize = Math.max(2, nextPow2(totalNumberOfIndexedFilters));
        var mask = tokensLookupIndexSize - 1;
        var suffixes = [];
        for (var i = 0; i < tokensLookupIndexSize; i += 1) {
            suffixes.push([]);
        }
        // Add size of tokensLookupIndex to total size (x4 because these are 32 bits numbers)
        estimatedBufferSize += tokensLookupIndexSize * 4;
        // At this point we know the number of bytes needed for the compact
        // representation of this reverse index ("tokens index" + "buckets index" +
        // "filters index"). We allocate it at once and proceed with populating it.
        var buffer = StaticDataView.allocate(estimatedBufferSize, this.config);
        var tokensLookupIndex = buffer.getUint32ArrayView(tokensLookupIndexSize);
        var bucketsIndex = buffer.getUint32ArrayView(bucketsIndexSize);
        var filtersIndexStart = buffer.getPos();
        // For each filter, find the best token (least seen) based on histogram.
        // Since we are iterating again on the filters, we populate "filters index"
        // in the same loop and keep track of their indices so that we can later
        // populate "buckets index".
        for (var i = 0; i < filtersTokens.length; i += 1) {
            var filterTokens = filtersTokens[i];
            var filter = filterTokens.filter;
            var multiTokens = filterTokens.multiTokens;
            // Serialize this filter and keep track of its index in the byte array;
            // it will be used in "buckets index" to point to this filter.
            var filterIndex = buffer.pos;
            filter.serialize(buffer);
            // Index the filter once per "tokens"
            for (var j = 0; j < multiTokens.length; j += 1) {
                var tokens = multiTokens[j];
                // Find best token (least seen) from `tokens` using `histogram`.
                var bestToken = 0; // default = wildcard bucket
                var minCount = totalNumberOfTokens + 1;
                for (var k = 0; k < tokens.length; k += 1) {
                    var tokenCount = histogram.get(tokens[k]);
                    if (tokenCount < minCount) {
                        minCount = tokenCount;
                        bestToken = tokens[k];
                        // Fast path, if the current token has only been seen once, we can
                        // stop iterating since we will not find a better alternarive!
                        if (minCount === 1) {
                            break;
                        }
                    }
                }
                // `bestToken & mask` represents the N last bits of `bestToken`. We
                // group all filters indexed with a token sharing the same N bits.
                suffixes[bestToken & mask].push([bestToken, filterIndex]);
            }
        }
        // Populate "tokens index" and "buckets index" based on best token found for each filter.
        var indexInBucketsIndex = 0;
        for (var i = 0; i < tokensLookupIndexSize; i += 1) {
            var filtersForMask = suffixes[i];
            tokensLookupIndex[i] = indexInBucketsIndex;
            for (var j = 0; j < filtersForMask.length; j += 1) {
                bucketsIndex[indexInBucketsIndex++] = filtersForMask[j][0];
                bucketsIndex[indexInBucketsIndex++] = filtersForMask[j][1];
            }
        }
        // Update internals
        buffer.seekZero();
        this.updateInternals({
            bucketsIndex: bucketsIndex,
            filtersIndexStart: filtersIndexStart,
            numberOfFilters: filtersTokens.length,
            tokensLookupIndex: tokensLookupIndex,
            view: buffer
        });
    };
    ReverseIndex.prototype.updateInternals = function (_a) {
        var bucketsIndex = _a.bucketsIndex, filtersIndexStart = _a.filtersIndexStart, numberOfFilters = _a.numberOfFilters, tokensLookupIndex = _a.tokensLookupIndex, view = _a.view;
        this.bucketsIndex = bucketsIndex;
        this.filtersIndexStart = filtersIndexStart;
        this.numberOfFilters = numberOfFilters;
        this.tokensLookupIndex = tokensLookupIndex;
        this.view = view;
        return this;
    };
    /**
     * If a bucket exists for the given token, call the callback on each filter
     * found inside. An early termination mechanism is built-in, to stop iterating
     * as soon as `false` is returned from the callback.
     */
    ReverseIndex.prototype.iterBucket = function (token, requestId, cb) {
        var bucket = this.cache.get(token);
        // Lazily create bucket if it does not yet exist in memory. Lookup the
        // compact bucket representation and find all filters being associated with
        // `token`. Create a `Bucket` out of them and store them in cache.
        if (bucket === undefined) {
            var offset = token & (this.tokensLookupIndex.length - 1);
            var startOfBucket = this.tokensLookupIndex[offset];
            // We do not have any filters for this token
            if (startOfBucket === EMPTY_BUCKET) {
                return true;
            }
            // Since we do not store explicitly the number of filters in each
            // "bucket", we check the index of the next one and use it to infer the
            // number of filters (each filter being stored as a token + index to the
            // "filters store")
            var endOfBucket = offset === this.tokensLookupIndex.length - 1
                ? this.bucketsIndex.length
                : this.tokensLookupIndex[offset + 1];
            // Get indices of filters indexed with `token`, if any.
            var filtersIndices = [];
            for (var i = startOfBucket; i < endOfBucket; i += 2) {
                var currentToken = this.bucketsIndex[i];
                if (currentToken === token) {
                    filtersIndices.push(this.bucketsIndex[i + 1]);
                }
            }
            // No filter indexed with `token`.
            if (filtersIndices.length === 0) {
                return true; // continue looking for a match
            }
            // If we have filters for `token` then deserialize filters in memory and
            // create a `Bucket` instance to hold them for future access.
            var filters = [];
            var view = this.view;
            for (var i = 0; i < filtersIndices.length; i += 1) {
                view.setPos(filtersIndices[i]);
                filters.push(this.deserializeFilter(view));
            }
            // Create new bucket with found filters (only optimize if we have more
            // than one filter).
            bucket = {
                filters: filters.length > 1 ? this.optimize(filters) : filters,
                lastRequestSeen: -1
            };
            this.cache.set(token, bucket);
        }
        // Look for matching filter in this bucket
        if (bucket.lastRequestSeen !== requestId) {
            bucket.lastRequestSeen = requestId;
            var filters = bucket.filters;
            for (var i = 0; i < filters.length; i += 1) {
                // Break the loop if the callback returns `false`
                if (cb(filters[i]) === false) {
                    // Whenever we get a match from a filter, we also swap it one
                    // position up in the list. This way, over time, popular filters will
                    // be first and might match earlier. This should decrease the time
                    // needed to get a match.
                    if (i > 0) {
                        var filter = filters[i];
                        filters[i] = filters[i - 1];
                        filters[i - 1] = filter;
                    }
                    return false;
                }
            }
        }
        return true;
    };
    return ReverseIndex;
}());

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
// Empty filters is 4 bytes because we need at least one 32 bits number to keep
// track of the number of filters in the container. If there is no filter then
// the number will be 0.
var EMPTY_FILTERS = new Uint8Array(4);
/**
 * Generic filters container (for both CosmeticFilter and NetworkFilter
 * instances). This abstracts away some of the logic to serialize/lazy-load
 * lists of filters (which is useful for things like generic cosmetic filters
 * or $badfilter).
 */
var FiltersContainer = /** @class */ (function () {
    function FiltersContainer(_a) {
        var config = _a.config, deserialize = _a.deserialize, filters = _a.filters;
        this.deserialize = deserialize;
        this.filters = EMPTY_FILTERS;
        this.config = config;
        if (filters.length !== 0) {
            this.update(filters, undefined);
        }
    }
    FiltersContainer.deserialize = function (buffer, deserialize, config) {
        var container = new FiltersContainer({ deserialize: deserialize, config: config, filters: [] });
        container.filters = buffer.getBytes();
        return container;
    };
    /**
     * Update filters based on `newFilters` and `removedFilters`.
     */
    FiltersContainer.prototype.update = function (newFilters, removedFilters) {
        // Estimate size of the buffer we will need to store filters. This avoids
        // having to allocate a big chunk of memory up-front if it's not needed.
        // We start with the current size of `this.filters` then update it with
        // removed/added filters.
        var bufferSizeEstimation = this.filters.byteLength;
        var selected = [];
        var compression = this.config.enableCompression;
        // Add existing rules (removing the ones with ids in `removedFilters`)
        var currentFilters = this.getFilters();
        if (currentFilters.length !== 0) {
            // If no filter was removed (we only add new ones), we don't need to
            // filter out removed existing filters. So we just assign the array to
            // `selected` directly to save a bit of effort.
            if (removedFilters === undefined || removedFilters.size === 0) {
                selected = currentFilters;
            }
            else {
                // There might be some removed selected filters, so we iterate through
                // them and make sure we keep only the ones not having been deleted.
                for (var i = 0; i < currentFilters.length; i += 1) {
                    var filter = currentFilters[i];
                    if (removedFilters.has(filter.getId()) === false) {
                        selected.push(filter);
                    }
                    else {
                        bufferSizeEstimation -= filter.getSerializedSize(compression);
                    }
                }
            }
        }
        // If `selected` and `currentFilters` have the same length then no filter was removed.
        var storedFiltersRemoved = selected.length !== currentFilters.length;
        // Add new rules.
        var numberOfExistingFilters = selected.length;
        for (var i = 0; i < newFilters.length; i += 1) {
            var filter = newFilters[i];
            bufferSizeEstimation += filter.getSerializedSize(compression);
            selected.push(filter);
        }
        // Check if any new filter was added in `selected` (from `newFilters`).
        var storedFiltersAdded = selected.length > numberOfExistingFilters;
        // If selected changed, then update the compact representation of filters.
        if (selected.length === 0) {
            this.filters = EMPTY_FILTERS;
        }
        else if (storedFiltersAdded === true || storedFiltersRemoved === true) {
            // Store filters in their compact form
            var buffer = StaticDataView.allocate(bufferSizeEstimation, this.config);
            buffer.pushUint32(selected.length);
            // When we run in `debug` mode, we enable fully deterministic updates of
            // internal data-structure. To this effect, we sort all filters before
            // insertion.
            if (this.config.debug === true) {
                selected.sort(function (f1, f2) { return f1.getId() - f2.getId(); });
            }
            for (var i = 0; i < selected.length; i += 1) {
                selected[i].serialize(buffer);
            }
            // Update internals
            this.filters = buffer.buffer;
        }
    };
    FiltersContainer.prototype.getSerializedSize = function () {
        return StaticDataView.sizeOfBytes(this.filters, false /* no alignement */);
    };
    FiltersContainer.prototype.serialize = function (buffer) {
        buffer.pushBytes(this.filters);
    };
    FiltersContainer.prototype.getFilters = function () {
        // No filter stored in the container
        if (this.filters.byteLength <= 4) {
            return [];
        }
        // Load all filters in memory and store them in `cache`
        var filters = [];
        var buffer = StaticDataView.fromUint8Array(this.filters, this.config);
        var numberOfFilters = buffer.getUint32();
        for (var i = 0; i < numberOfFilters; i += 1) {
            filters.push(this.deserialize(buffer));
        }
        return filters;
    };
    return FiltersContainer;
}());

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
/**
 * Given a list of CSS selectors, create a valid stylesheet ready to be
 * injected in the page. This also takes care to no create rules with too many
 * selectors for Chrome, see: https://crbug.com/804179
 */
function createStylesheet(rules, style) {
    if (rules.length === 0) {
        return '';
    }
    var maximumNumberOfSelectors = 1024;
    var parts = [];
    var styleStr = " { " + style + " }";
    for (var i = 0; i < rules.length; i += maximumNumberOfSelectors) {
        // Accumulate up to `maximumNumberOfSelectors` selectors into `selector`.
        // We use string concatenation here since it's faster than using
        // `Array.prototype.join`.
        var selector = rules[i];
        for (var j = i + 1, end = Math.min(rules.length, i + maximumNumberOfSelectors); j < end; j += 1) {
            selector += ',\n' + rules[j];
        }
        // Insert CSS after last selector (e.g.: `{ display: none }`)
        selector += styleStr;
        // If `rules` has less then the limit, we can short-circuit here
        if (rules.length < maximumNumberOfSelectors) {
            return selector;
        }
        // Keep track of this chunk and process next ones
        parts.push(selector);
    }
    // Join all chunks together
    return parts.join('\n');
}
/**
 * If at least one filter from `rules` has a custom style (e.g.: `##.foo
 * :style(...)`) then we fallback to `createStylesheetFromRulesWithCustomStyles`
 * which is slower then `createStylesheetFromRules`.
 */
function createStylesheetFromRulesWithCustomStyles(rules) {
    var selectorsPerStyle = new Map();
    for (var i = 0; i < rules.length; i += 1) {
        var rule = rules[i];
        var style = rule.getStyle();
        var selectors = selectorsPerStyle.get(style);
        if (selectors === undefined) {
            selectorsPerStyle.set(style, [rule.getSelector()]);
        }
        else {
            selectors.push(rule.getSelector());
        }
    }
    var stylesheets = [];
    var selectorsPerStyleArray = Array.from(selectorsPerStyle.entries());
    for (var i = 0; i < selectorsPerStyleArray.length; i += 1) {
        var style = selectorsPerStyleArray[i][0];
        var selectors = selectorsPerStyleArray[i][1];
        stylesheets.push(createStylesheet(selectors, style));
    }
    return stylesheets.join('\n\n');
}
/**
 * Given a list of cosmetic filters, create a stylesheet ready to be injected.
 * This function is optimistic and will assume there is no `:style` filter in
 * `rules`. In case one is found on the way, we fallback to the slower
 * `createStylesheetFromRulesWithCustomStyles` function.
 */
function createStylesheetFromRules(rules) {
    var selectors = [];
    for (var i = 0; i < rules.length; i += 1) {
        var rule = rules[i];
        if (rule.hasCustomStyle()) {
            return createStylesheetFromRulesWithCustomStyles(rules);
        }
        selectors.push(rule.selector);
    }
    return createStylesheet(selectors, DEFAULT_HIDDING_STYLE);
}
function createLookupTokens(hostname, domain) {
    var hostnamesHashes = getHostnameHashesFromLabelsBackward(hostname, domain);
    var entitiesHashes = getEntityHashesFromLabelsBackward(hostname, domain);
    var tokens = new Uint32Array(hostnamesHashes.length + entitiesHashes.length);
    var index = 0;
    for (var i = 0; i < hostnamesHashes.length; i += 1) {
        tokens[index++] = hostnamesHashes[i];
    }
    for (var i = 0; i < entitiesHashes.length; i += 1) {
        tokens[index++] = entitiesHashes[i];
    }
    return tokens;
}
/**
 * Efficient container for CosmeticFilter instances. Allows to quickly
 * retrieved scripts and stylesheets to inject in pages for a specific
 * hostname/domain.
 */
var CosmeticFilterBucket = /** @class */ (function () {
    function CosmeticFilterBucket(_a) {
        var _b = _a.filters, filters = _b === void 0 ? [] : _b, config = _a.config;
        this.genericRules = new FiltersContainer({
            config: config,
            deserialize: CosmeticFilter.deserialize,
            filters: []
        });
        this.classesIndex = new ReverseIndex({
            config: config,
            deserialize: CosmeticFilter.deserialize,
            filters: [],
            optimize: noopOptimizeCosmetic
        });
        this.hostnameIndex = new ReverseIndex({
            config: config,
            deserialize: CosmeticFilter.deserialize,
            filters: [],
            optimize: noopOptimizeCosmetic
        });
        this.hrefsIndex = new ReverseIndex({
            config: config,
            deserialize: CosmeticFilter.deserialize,
            filters: [],
            optimize: noopOptimizeCosmetic
        });
        this.htmlIndex = new ReverseIndex({
            config: config,
            deserialize: CosmeticFilter.deserialize,
            filters: [],
            optimize: noopOptimizeCosmetic
        });
        this.idsIndex = new ReverseIndex({
            config: config,
            deserialize: CosmeticFilter.deserialize,
            filters: [],
            optimize: noopOptimizeCosmetic
        });
        this.unhideIndex = new ReverseIndex({
            config: config,
            deserialize: CosmeticFilter.deserialize,
            filters: [],
            optimize: noopOptimizeCosmetic
        });
        // In-memory cache, lazily initialized
        this.baseStylesheet = null;
        this.extraGenericRules = null;
        if (filters.length !== 0) {
            this.update(filters, undefined);
        }
    }
    CosmeticFilterBucket.deserialize = function (buffer, config) {
        var bucket = new CosmeticFilterBucket({ config: config });
        bucket.genericRules = FiltersContainer.deserialize(buffer, CosmeticFilter.deserialize, config);
        bucket.classesIndex = ReverseIndex.deserialize(buffer, CosmeticFilter.deserialize, noopOptimizeCosmetic, config);
        bucket.hostnameIndex = ReverseIndex.deserialize(buffer, CosmeticFilter.deserialize, noopOptimizeCosmetic, config);
        bucket.hrefsIndex = ReverseIndex.deserialize(buffer, CosmeticFilter.deserialize, noopOptimizeCosmetic, config);
        bucket.htmlIndex = ReverseIndex.deserialize(buffer, CosmeticFilter.deserialize, noopOptimizeCosmetic, config);
        bucket.idsIndex = ReverseIndex.deserialize(buffer, CosmeticFilter.deserialize, noopOptimizeCosmetic, config);
        bucket.unhideIndex = ReverseIndex.deserialize(buffer, CosmeticFilter.deserialize, noopOptimizeCosmetic, config);
        return bucket;
    };
    CosmeticFilterBucket.prototype.getFilters = function () {
        var filters = [];
        return filters.concat(this.genericRules.getFilters(), this.classesIndex.getFilters(), this.hostnameIndex.getFilters(), this.hrefsIndex.getFilters(), this.htmlIndex.getFilters(), this.idsIndex.getFilters(), this.unhideIndex.getFilters());
    };
    CosmeticFilterBucket.prototype.update = function (newFilters, removedFilters) {
        var classSelectors = [];
        var genericHideRules = [];
        var hostnameSpecificRules = [];
        var hrefSelectors = [];
        var htmlRules = [];
        var idSelectors = [];
        var unHideRules = [];
        for (var i = 0; i < newFilters.length; i += 1) {
            var rule = newFilters[i];
            if (rule.isUnhide()) {
                unHideRules.push(rule);
            }
            else if (rule.isHtmlFiltering()) {
                htmlRules.push(rule);
            }
            else if (rule.isGenericHide()) {
                if (rule.isClassSelector()) {
                    classSelectors.push(rule);
                }
                else if (rule.isIdSelector()) {
                    idSelectors.push(rule);
                }
                else if (rule.isHrefSelector()) {
                    hrefSelectors.push(rule);
                }
                else {
                    genericHideRules.push(rule);
                }
            }
            else {
                hostnameSpecificRules.push(rule);
            }
        }
        this.genericRules.update(genericHideRules, removedFilters);
        this.classesIndex.update(classSelectors, removedFilters);
        this.hostnameIndex.update(hostnameSpecificRules, removedFilters);
        this.hrefsIndex.update(hrefSelectors, removedFilters);
        this.htmlIndex.update(htmlRules, removedFilters);
        this.idsIndex.update(idSelectors, removedFilters);
        this.unhideIndex.update(unHideRules, removedFilters);
    };
    CosmeticFilterBucket.prototype.getSerializedSize = function () {
        return (this.genericRules.getSerializedSize() +
            this.classesIndex.getSerializedSize() +
            this.hostnameIndex.getSerializedSize() +
            this.hrefsIndex.getSerializedSize() +
            this.htmlIndex.getSerializedSize() +
            this.idsIndex.getSerializedSize() +
            this.unhideIndex.getSerializedSize());
    };
    CosmeticFilterBucket.prototype.serialize = function (buffer) {
        this.genericRules.serialize(buffer);
        this.classesIndex.serialize(buffer);
        this.hostnameIndex.serialize(buffer);
        this.hrefsIndex.serialize(buffer);
        this.htmlIndex.serialize(buffer);
        this.idsIndex.serialize(buffer);
        this.unhideIndex.serialize(buffer);
    };
    CosmeticFilterBucket.prototype.getHtmlRules = function (_a) {
        var domain = _a.domain, hostname = _a.hostname;
        // Tokens from `hostname` and `domain` which will be used to lookup filters
        // from the reverse index. The same tokens are re-used for multiple indices.
        var hostnameTokens = createLookupTokens(hostname, domain);
        var rules = [];
        this.htmlIndex.iterMatchingFilters(hostnameTokens, function (rule) {
            if (rule.match(hostname, domain)) {
                rules.push(rule);
            }
            return true;
        });
        // If we found at least one candidate, check if we have unhidden rules.
        var disabledRules = new Set();
        if (rules.length !== 0) {
            this.unhideIndex.iterMatchingFilters(hostnameTokens, function (rule) {
                if (rule.match(hostname, domain)) {
                    disabledRules.add(rule.getSelector());
                }
                return true;
            });
        }
        return rules.filter(function (rule) { return disabledRules.size === 0 || disabledRules.has(rule.getSelector()) === false; });
    };
    /**
     * Request cosmetics and scripts to inject in a page.
     */
    CosmeticFilterBucket.prototype.getCosmeticsFilters = function (_a) {
        var domain = _a.domain, hostname = _a.hostname, _b = _a.classes, classes = _b === void 0 ? [] : _b, _c = _a.hrefs, hrefs = _c === void 0 ? [] : _c, _d = _a.ids, ids = _d === void 0 ? [] : _d, _e = _a.allowGenericHides, allowGenericHides = _e === void 0 ? true : _e,
            // Allows to specify which rules to return
            _f = _a.getBaseRules,
            // Allows to specify which rules to return
            getBaseRules = _f === void 0 ? true : _f, _g = _a.getInjectionRules, getInjectionRules = _g === void 0 ? true : _g, _h = _a.getRulesFromDOM, getRulesFromDOM = _h === void 0 ? true : _h, _j = _a.getRulesFromHostname, getRulesFromHostname = _j === void 0 ? true : _j;
        // Tokens from `hostname` and `domain` which will be used to lookup filters
        // from the reverse index. The same tokens are re-used for multiple indices.
        var hostnameTokens = createLookupTokens(hostname, domain);
        var rules = [];
        // =======================================================================
        // Rules: hostname-specific
        // =======================================================================
        // Collect matching rules which specify a hostname constraint.
        if (getRulesFromHostname === true) {
            this.hostnameIndex.iterMatchingFilters(hostnameTokens, function (rule) {
                if (rule.match(hostname, domain)) {
                    rules.push(rule);
                }
                return true;
            });
        }
        // =======================================================================
        // Rules: generic hide
        // =======================================================================
        // Optionally, collect genericHide rules. We need to make sure the `rule`
        // matches the hostname and domain since some generic rules can specify
        // negated hostnames and entities (e.g.: ~foo.*##generic).
        if (allowGenericHides === true && getRulesFromHostname === true) {
            var genericRules = this.getGenericRules();
            for (var i = 0; i < genericRules.length; i += 1) {
                var rule = genericRules[i];
                if (rule.match(hostname, domain) === true) {
                    rules.push(rule);
                }
            }
        }
        // =======================================================================
        // Class selector based
        // =======================================================================
        if (allowGenericHides === true && getRulesFromDOM === true && classes.length !== 0) {
            this.classesIndex.iterMatchingFilters(hashStrings(classes), function (rule) {
                if (rule.match(hostname, domain)) {
                    rules.push(rule);
                }
                return true;
            });
        }
        // =======================================================================
        // Id selector based
        // =======================================================================
        if (allowGenericHides === true && getRulesFromDOM === true && ids.length !== 0) {
            this.idsIndex.iterMatchingFilters(hashStrings(ids), function (rule) {
                if (rule.match(hostname, domain)) {
                    rules.push(rule);
                }
                return true;
            });
        }
        // =======================================================================
        // Href selector based
        // =======================================================================
        if (allowGenericHides === true && getRulesFromDOM === true && hrefs.length !== 0) {
            this.hrefsIndex.iterMatchingFilters(compactTokens(concatTypedArrays(hrefs.map(function (href) { return tokenizeFilter(href, false, false); }))), function (rule) {
                if (rule.match(hostname, domain)) {
                    rules.push(rule);
                }
                return true;
            });
        }
        var injections = [];
        var styles = [];
        // If we found at least one candidate, check if we have unhidden rules,
        // apply them and dispatch rules into `injections` (i.e.: '+js(...)') and
        // `styles` (i.e.: '##rule').
        if (rules.length !== 0) {
            // =======================================================================
            // Rules: unhide
            // =======================================================================
            // Collect unhidden selectors. They will be used to filter-out canceled
            // rules from other indices.
            var disabledRules_1 = new Set();
            this.unhideIndex.iterMatchingFilters(hostnameTokens, function (rule) {
                if (rule.match(hostname, domain)) {
                    disabledRules_1.add(rule.getSelector());
                }
                return true;
            });
            // Apply unhide rules + dispatch
            for (var i = 0; i < rules.length; i += 1) {
                var rule = rules[i];
                // Make sure `rule` is not un-hidden by a #@# filter
                if (disabledRules_1.size !== 0 && disabledRules_1.has(rule.getSelector())) {
                    continue;
                }
                // Dispatch rules in `injections` or `styles` depending on type
                if (getInjectionRules === true && rule.isScriptInject()) {
                    injections.push(rule);
                }
                else {
                    styles.push(rule);
                }
            }
        }
        // Create final stylesheet
        var stylesheet = getBaseRules === false || allowGenericHides === false ? '' : this.getBaseStylesheet();
        if (styles.length !== 0) {
            if (stylesheet.length !== 0) {
                stylesheet += '\n\n';
            }
            stylesheet += createStylesheetFromRules(styles);
        }
        return {
            injections: injections,
            stylesheet: stylesheet
        };
    };
    /**
     * Return the list of filters which can potentially be un-hidden by another
     * rule currently contained in the cosmetic bucket.
     */
    CosmeticFilterBucket.prototype.getGenericRules = function () {
        if (this.extraGenericRules === null) {
            return this.lazyPopulateGenericRulesCache().genericRules;
        }
        return this.extraGenericRules;
    };
    /**
     * The base stylesheet is made of generic filters (not specific to any
     * hostname) which cannot be hidden (i.e.: there is currently no rule which
     * might hide their selector). This means that it will never change and is
     * the same for all sites. We generate it once and re-use it any-time we want
     * to inject it.
     */
    CosmeticFilterBucket.prototype.getBaseStylesheet = function () {
        if (this.baseStylesheet === null) {
            return this.lazyPopulateGenericRulesCache().baseStylesheet;
        }
        return this.baseStylesheet;
    };
    /**
     * This is used to lazily generate both the list of generic rules which can
     * *potentially be un-hidden* (i.e.: there exists at least once unhide rule
     * for the selector) and a stylesheet containing all selectors which cannot
     * be un-hidden. Since this list will not change between updates we can
     * generate once and use many times.
     */
    CosmeticFilterBucket.prototype.lazyPopulateGenericRulesCache = function () {
        if (this.baseStylesheet === null || this.extraGenericRules === null) {
            // Collect all selectors which can be subjected to an unhide rule
            var unHideRules = this.unhideIndex.getFilters();
            var canBeHiddenSelectors = new Set();
            for (var i = 0; i < unHideRules.length; i += 1) {
                canBeHiddenSelectors.add(unHideRules[i].getSelector());
            }
            // Split generic rules into two groups:
            // 1. Rules which cannot be hidden
            // 2. Rules which can be hidden on some domains
            //
            // This allows to create a base stylesheet which we know will never
            // change then keep a minority of rules in-memory which can potentially
            // be hidden.
            var genericRules = this.genericRules.getFilters();
            var cannotBeHiddenRules = [];
            var canBeHiddenRules = [];
            for (var i = 0; i < genericRules.length; i += 1) {
                var rule = genericRules[i];
                if (rule.hasCustomStyle() ||
                    rule.isScriptInject() ||
                    rule.hasHostnameConstraint() ||
                    canBeHiddenSelectors.has(rule.getSelector())) {
                    canBeHiddenRules.push(rule);
                }
                else {
                    cannotBeHiddenRules.push(rule);
                }
            }
            this.baseStylesheet = createStylesheetFromRules(cannotBeHiddenRules);
            this.extraGenericRules = canBeHiddenRules;
        }
        return {
            baseStylesheet: this.baseStylesheet,
            genericRules: this.extraGenericRules
        };
    };
    return CosmeticFilterBucket;
}());

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
/**
 * Accelerating data structure for network filters matching.
 */
var NetworkFilterBucket = /** @class */ (function () {
    function NetworkFilterBucket(_a) {
        var _b = _a.filters, filters = _b === void 0 ? [] : _b, config = _a.config;
        this.index = new ReverseIndex({
            config: config,
            deserialize: NetworkFilter.deserialize,
            filters: [],
            optimize: config.enableOptimizations ? optimizeNetwork : noopOptimizeNetwork
        });
        this.badFiltersIds = null;
        this.badFilters = new FiltersContainer({
            config: config,
            deserialize: NetworkFilter.deserialize,
            filters: []
        });
        if (filters.length !== 0) {
            this.update(filters, undefined);
        }
    }
    NetworkFilterBucket.deserialize = function (buffer, config) {
        var bucket = new NetworkFilterBucket({ config: config });
        bucket.index = ReverseIndex.deserialize(buffer, NetworkFilter.deserialize, config.enableOptimizations ? optimizeNetwork : noopOptimizeNetwork, config);
        bucket.badFilters = FiltersContainer.deserialize(buffer, NetworkFilter.deserialize, config);
        return bucket;
    };
    NetworkFilterBucket.prototype.getFilters = function () {
        var filters = [];
        return filters.concat(this.badFilters.getFilters(), this.index.getFilters());
    };
    NetworkFilterBucket.prototype.update = function (newFilters, removedFilters) {
        var badFilters = [];
        var remaining = [];
        for (var i = 0; i < newFilters.length; i += 1) {
            var filter = newFilters[i];
            if (filter.isBadFilter()) {
                badFilters.push(filter);
            }
            else {
                remaining.push(filter);
            }
        }
        this.badFilters.update(badFilters, removedFilters);
        this.index.update(remaining, removedFilters);
        this.badFiltersIds = null;
    };
    NetworkFilterBucket.prototype.getSerializedSize = function () {
        return (this.badFilters.getSerializedSize() +
            this.index.getSerializedSize());
    };
    NetworkFilterBucket.prototype.serialize = function (buffer) {
        this.index.serialize(buffer);
        this.badFilters.serialize(buffer);
    };
    NetworkFilterBucket.prototype.matchAll = function (request) {
        var _this = this;
        var filters = [];
        this.index.iterMatchingFilters(request.getTokens(), function (filter) {
            if (filter.match(request) && _this.isFilterDisabled(filter) === false) {
                filters.push(filter);
            }
            return true;
        });
        return filters;
    };
    NetworkFilterBucket.prototype.match = function (request) {
        var _this = this;
        var match;
        this.index.iterMatchingFilters(request.getTokens(), function (filter) {
            if (filter.match(request) && _this.isFilterDisabled(filter) === false) {
                match = filter;
                return false;
            }
            return true;
        });
        return match;
    };
    /**
     * Given a matching filter, check if it is disabled by a $badfilter
     */
    NetworkFilterBucket.prototype.isFilterDisabled = function (filter) {
        // Lazily load information about bad filters in memory. The only thing we
        // keep in memory is the list of IDs from $badfilter (ignoring the
        // $badfilter option from mask). This allows to check if a matching filter
        // should be ignored just by doing a lookup in a set of IDs.
        if (this.badFiltersIds === null) {
            var badFilters = this.badFilters.getFilters();
            // Shortcut if there is no badfilter in this bucket
            if (badFilters.length === 0) {
                return false;
            }
            // Create in-memory list of disabled filter IDs
            var badFiltersIds = new Set();
            for (var i = 0; i < badFilters.length; i += 1) {
                badFiltersIds.add(badFilters[i].getIdWithoutBadFilter());
            }
            this.badFiltersIds = badFiltersIds;
        }
        return this.badFiltersIds.has(filter.getId());
    };
    return NetworkFilterBucket;
}());

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
var ENGINE_VERSION = 40;
// Polyfill for `btoa`
function btoaPolyfill(buffer) {
    if (typeof btoa !== 'undefined') {
        return btoa(buffer);
    }
    else if (typeof Buffer !== 'undefined') {
        return Buffer.from(buffer).toString('base64');
    }
    return buffer;
}
var FilterEngine = /** @class */ (function (_super) {
    __extends(FilterEngine, _super);
    function FilterEngine(_a) {
        var _b = _a === void 0 ? {} : _a,
            // Optionally initialize the engine with filters
            _c = _b.cosmeticFilters,
            // Optionally initialize the engine with filters
            cosmeticFilters = _c === void 0 ? [] : _c, _d = _b.networkFilters, networkFilters = _d === void 0 ? [] : _d, _e = _b.config, config = _e === void 0 ? new Config() : _e, _f = _b.lists, lists = _f === void 0 ? new Map() : _f;
        var _this = _super.call(this) || this;
        _this.config = new Config(config);
        // Subscription management: disabled by default
        _this.lists = lists;
        // $csp=
        _this.csp = new NetworkFilterBucket({ config: _this.config });
        // $generichide
        _this.genericHides = new NetworkFilterBucket({ config: _this.config });
        // @@filter
        _this.exceptions = new NetworkFilterBucket({ config: _this.config });
        // $important
        _this.importants = new NetworkFilterBucket({ config: _this.config });
        // $redirect
        _this.redirects = new NetworkFilterBucket({ config: _this.config });
        // All other filters
        _this.filters = new NetworkFilterBucket({ config: _this.config });
        // Cosmetic filters
        _this.cosmetics = new CosmeticFilterBucket({ config: _this.config });
        // Injections
        _this.resources = new Resources();
        if (networkFilters.length !== 0 || cosmeticFilters.length !== 0) {
            _this.update({
                newCosmeticFilters: cosmeticFilters,
                newNetworkFilters: networkFilters
            });
        }
        return _this;
    }
    /**
     * Create an instance of `FiltersEngine` (or subclass like `ElectronBlocker`,
     * etc.), from the list of subscriptions provided as argument (e.g.:
     * EasyList).
     *
     * Lists are fetched using the instance of `fetch` provided as a first
     * argument. Optionally resources.txt and config can be provided.
     */
    FilterEngine.fromLists = function (fetch, urls, config) {
        var _this = this;
        if (config === void 0) { config = {}; }
        var listsPromises = fetchLists(fetch, urls);
        var resourcesPromise = fetchResources(fetch);
        return Promise.all([listsPromises, resourcesPromise]).then(function (_a) {
            var _b = __read(_a, 2), lists = _b[0], resources = _b[1];
            var engine = _this.parse(lists.join('\n'), config);
            if (resources !== undefined) {
                engine.updateResources(resources, '' + resources.length);
            }
            return engine;
        });
    };
    /**
     * Initialize blocker of *ads only*.
     *
     * Attempt to initialize a blocking engine using a pre-built version served
     * from Cliqz's CDN. If this fails (e.g.: if no pre-built engine is available
     * for this version of the library), then falls-back to using `fromLists(...)`
     * method with the same subscriptions.
     */
    FilterEngine.fromPrebuiltAdsOnly = function (fetchImpl) {
        var _this = this;
        if (fetchImpl === void 0) { fetchImpl = fetch; }
        return fetchPrebuilt(fetchImpl, 'https://cdn.cliqz.com/adblocker/configs/desktop-ads/allowed-lists.json', ENGINE_VERSION)
            .then(function (buffer) { return _this.deserialize(buffer); })["catch"](function () {
                console.log('failed downloading pre-built, fallback to fetching lists');
                return _this.fromLists(fetchImpl, adsLists);
            });
    };
    /**
     * Same as `fromPrebuiltAdsOnly(...)` but also contains rules to block
     * tracking (i.e.: using extra lists such as EasyPrivacy and more).
     */
    FilterEngine.fromPrebuiltAdsAndTracking = function (fetchImpl) {
        var _this = this;
        if (fetchImpl === void 0) { fetchImpl = fetch; }
        return fetchPrebuilt(fetchImpl, 'https://cdn.cliqz.com/adblocker/configs/desktop-ads-trackers/allowed-lists.json', ENGINE_VERSION)
            .then(function (buffer) { return _this.deserialize(buffer); })["catch"](function () {
                console.log('failed downloading pre-built, fallback to fetching lists');
                return _this.fromLists(fetchImpl, adsAndTrackingLists);
            });
    };
    /**
     * Same as `fromPrebuiltAdsAndTracking(...)` but also contains annoyances
     * rules to block things like cookie notices.
     */
    FilterEngine.fromPrebuiltFull = function (fetchImpl) {
        var _this = this;
        if (fetchImpl === void 0) { fetchImpl = fetch; }
        return fetchPrebuilt(fetchImpl, 'https://cdn.cliqz.com/adblocker/configs/desktop-full/allowed-lists.json', ENGINE_VERSION)
            .then(function (buffer) { return _this.deserialize(buffer); })["catch"](function () {
                console.log('failed downloading pre-built, fallback to fetching lists');
                return _this.fromLists(fetchImpl, fullLists);
            });
    };
    FilterEngine.parse = function (filters, options) {
        if (options === void 0) { options = {}; }
        var config = new Config(options);
        return new this(Object.assign({}, parseFilters(filters, config), { config: config }));
    };
    FilterEngine.deserialize = function (serialized) {
        var buffer = StaticDataView.fromUint8Array(serialized, {
            enableCompression: false
        });
        // Before starting deserialization, we make sure that the version of the
        // serialized engine is the same as the current source code. If not, we
        // start fresh and create a new engine from the lists.
        var serializedEngineVersion = buffer.getUint8();
        if (ENGINE_VERSION !== serializedEngineVersion) {
            throw new Error("serialized engine version mismatch, expected " + ENGINE_VERSION + " but got " + serializedEngineVersion);
        }
        // Create a new engine with same options
        var config = Config.deserialize(buffer);
        // Optionally turn compression ON
        if (config.enableCompression) {
            buffer.enableCompression();
        }
        // Also make sure that the built-in checksum is correct. This allows to
        // detect data corruption and start fresh if the serialized version was
        // altered.
        if (config.integrityCheck) {
            var currentPos = buffer.pos;
            buffer.pos = serialized.length - 4;
            var checksum = buffer.checksum();
            var expected = buffer.getUint32();
            if (checksum !== expected) {
                throw new Error("serialized engine checksum mismatch, expected " + expected + " but got " + checksum);
            }
            buffer.pos = currentPos;
        }
        var engine = new this({ config: config });
        // Deserialize resources
        engine.resources = Resources.deserialize(buffer);
        // Deserialize lists
        var lists = new Map();
        var numberOfLists = buffer.getUint16();
        for (var i = 0; i < numberOfLists; i += 1) {
            lists.set(buffer.getASCII(), buffer.getASCII());
        }
        engine.lists = lists;
        // Deserialize buckets
        engine.importants = NetworkFilterBucket.deserialize(buffer, config);
        engine.redirects = NetworkFilterBucket.deserialize(buffer, config);
        engine.filters = NetworkFilterBucket.deserialize(buffer, config);
        engine.exceptions = NetworkFilterBucket.deserialize(buffer, config);
        engine.csp = NetworkFilterBucket.deserialize(buffer, config);
        engine.genericHides = NetworkFilterBucket.deserialize(buffer, config);
        engine.cosmetics = CosmeticFilterBucket.deserialize(buffer, config);
        return engine;
    };
    /**
     * Estimate the number of bytes needed to serialize this instance of
     * `FiltersEngine` using the `serialize(...)` method. It is used internally
     * by `serialize(...)` to allocate a buffer of the right size and you should
     * not have to call it yourself most of the time.
     *
     * There are cases where we cannot estimate statically the exact size of the
     * resulting buffer (due to alignement which need to be performed); this
     * method will return a safe estimate which will always be at least equal to
     * the real number of bytes needed, or bigger (usually of a few bytes only:
     * ~20 bytes is to be expected).
     */
    FilterEngine.prototype.getSerializedSize = function () {
        var e_1, _a;
        var estimatedSize = StaticDataView.sizeOfByte() + // engine version
            this.config.getSerializedSize() +
            this.resources.getSerializedSize() +
            this.filters.getSerializedSize() +
            this.exceptions.getSerializedSize() +
            this.importants.getSerializedSize() +
            this.redirects.getSerializedSize() +
            this.csp.getSerializedSize() +
            this.genericHides.getSerializedSize() +
            this.cosmetics.getSerializedSize() +
            4; // checksum
        try {
            // Estimate size of `this.lists` which stores information of checksum for each list.
            for (var _b = __values(this.lists), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), name_1 = _d[0], checksum = _d[1];
                estimatedSize += StaticDataView.sizeOfASCII(name_1) + StaticDataView.sizeOfASCII(checksum);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return estimatedSize;
    };
    /**
     * Creates a binary representation of the full engine. It can be stored
     * on-disk for faster loading of the adblocker. The `deserialize` static
     * method of Engine can be used to restore the engine.
     */
    FilterEngine.prototype.serialize = function (array) {
        var buffer = StaticDataView.fromUint8Array(array || new Uint8Array(this.getSerializedSize()), this.config);
        buffer.pushUint8(ENGINE_VERSION);
        // Config
        this.config.serialize(buffer);
        // Resources (js, resources)
        this.resources.serialize(buffer);
        // Serialize the state of lists (names and checksums)
        buffer.pushUint16(this.lists.size);
        var entries = Array.from(this.lists.entries()).sort();
        for (var i = 0; i < entries.length; i += 1) {
            buffer.pushASCII(entries[i][0]);
            buffer.pushASCII(entries[i][1]);
        }
        // Filters buckets
        this.importants.serialize(buffer);
        this.redirects.serialize(buffer);
        this.filters.serialize(buffer);
        this.exceptions.serialize(buffer);
        this.csp.serialize(buffer);
        this.genericHides.serialize(buffer);
        this.cosmetics.serialize(buffer);
        // Optionally append a checksum at the end
        if (this.config.integrityCheck) {
            buffer.pushUint32(buffer.checksum());
        }
        return buffer.subarray();
    };
    /**
     * Update engine with new filters or resources.
     */
    FilterEngine.prototype.loadedLists = function () {
        return Array.from(this.lists.keys());
    };
    FilterEngine.prototype.hasList = function (name, checksum) {
        return this.lists.has(name) && this.lists.get(name) === checksum;
    };
    /**
     * Update engine with `resources.txt` content.
     */
    FilterEngine.prototype.updateResources = function (data, checksum) {
        if (this.resources.checksum === checksum) {
            return false;
        }
        this.resources = Resources.parse(data, { checksum: checksum });
        return true;
    };
    FilterEngine.prototype.getFilters = function () {
        var cosmeticFilters = [];
        var networkFilters = [];
        return {
            cosmeticFilters: cosmeticFilters.concat(this.cosmetics.getFilters()),
            networkFilters: networkFilters.concat(this.filters.getFilters(), this.exceptions.getFilters(), this.importants.getFilters(), this.redirects.getFilters(), this.csp.getFilters(), this.genericHides.getFilters())
        };
    };
    /**
     * Update engine with new filters as well as optionally removed filters.
     */
    FilterEngine.prototype.update = function (_a) {
        var _b = _a.newNetworkFilters, newNetworkFilters = _b === void 0 ? [] : _b, _c = _a.newCosmeticFilters, newCosmeticFilters = _c === void 0 ? [] : _c, _d = _a.removedCosmeticFilters, removedCosmeticFilters = _d === void 0 ? [] : _d, _e = _a.removedNetworkFilters, removedNetworkFilters = _e === void 0 ? [] : _e;
        var updated = false;
        // Update cosmetic filters
        if (this.config.loadCosmeticFilters &&
            (newCosmeticFilters.length !== 0 || removedCosmeticFilters.length !== 0)) {
            updated = true;
            this.cosmetics.update(newCosmeticFilters, removedCosmeticFilters.length === 0 ? undefined : new Set(removedCosmeticFilters));
        }
        // Update network filters
        if (this.config.loadNetworkFilters &&
            (newNetworkFilters.length !== 0 || removedNetworkFilters.length !== 0)) {
            updated = true;
            var filters = [];
            var csp = [];
            var exceptions = [];
            var importants = [];
            var redirects = [];
            var genericHides = [];
            for (var i = 0; i < newNetworkFilters.length; i += 1) {
                var filter = newNetworkFilters[i];
                // NOTE: it's important to check for $generichide and $csp before
                // exceptions and important as we store all of them in the same filter
                // bucket. The check for exceptions is done at match-time directly.
                if (filter.isCSP()) {
                    csp.push(filter);
                }
                else if (filter.isGenericHide()) {
                    genericHides.push(filter);
                }
                else if (filter.isException()) {
                    exceptions.push(filter);
                }
                else if (filter.isImportant()) {
                    importants.push(filter);
                }
                else if (filter.isRedirect()) {
                    redirects.push(filter);
                }
                else {
                    filters.push(filter);
                }
            }
            var removedNetworkFiltersSet = removedNetworkFilters.length === 0 ? undefined : new Set(removedNetworkFilters);
            // Update buckets in-place
            this.importants.update(importants, removedNetworkFiltersSet);
            this.redirects.update(redirects, removedNetworkFiltersSet);
            this.filters.update(filters, removedNetworkFiltersSet);
            this.exceptions.update(exceptions, removedNetworkFiltersSet);
            this.csp.update(csp, removedNetworkFiltersSet);
            this.genericHides.update(genericHides, removedNetworkFiltersSet);
        }
        return updated;
    };
    FilterEngine.prototype.updateFromDiff = function (_a) {
        var added = _a.added, removed = _a.removed;
        var newCosmeticFilters = [];
        var newNetworkFilters = [];
        var removedCosmeticFilters = [];
        var removedNetworkFilters = [];
        if (removed !== undefined && removed.length !== 0) {
            var _b = parseFilters(removed.join('\n'), this.config), networkFilters = _b.networkFilters, cosmeticFilters = _b.cosmeticFilters;
            Array.prototype.push.apply(removedCosmeticFilters, cosmeticFilters);
            Array.prototype.push.apply(removedNetworkFilters, networkFilters);
        }
        if (added !== undefined && added.length !== 0) {
            var _c = parseFilters(added.join('\n'), this.config), networkFilters = _c.networkFilters, cosmeticFilters = _c.cosmeticFilters;
            Array.prototype.push.apply(newCosmeticFilters, cosmeticFilters);
            Array.prototype.push.apply(newNetworkFilters, networkFilters);
        }
        return this.update({
            newCosmeticFilters: newCosmeticFilters,
            newNetworkFilters: newNetworkFilters,
            removedCosmeticFilters: removedCosmeticFilters.map(function (f) { return f.getId(); }),
            removedNetworkFilters: removedNetworkFilters.map(function (f) { return f.getId(); })
        });
    };
    /**
     * Return a list of HTML filtering rules.
     */
    FilterEngine.prototype.getHtmlFilters = function (_a) {
        var
            // Page information
            url = _a.url, hostname = _a.hostname, domain = _a.domain;
        var htmlSelectors = [];
        if (this.config.enableHtmlFiltering === false || this.config.loadCosmeticFilters === false) {
            return htmlSelectors;
        }
        var rules = this.cosmetics.getHtmlRules({
            domain: domain || '',
            hostname: hostname
        });
        for (var i = 0; i < rules.length; i += 1) {
            var rule = rules[i];
            var extended = rule.getExtendedSelector();
            if (extended !== undefined) {
                htmlSelectors.push(extended);
            }
        }
        if (htmlSelectors.length !== 0) {
            this.emit('html-filtered', htmlSelectors, url);
        }
        return htmlSelectors;
    };
    /**
     * Given `hostname` and `domain` of a page (or frame), return the list of
     * styles and scripts to inject in the page.
     */
    FilterEngine.prototype.getCosmeticsFilters = function (_a) {
        var
            // Page information
            url = _a.url, hostname = _a.hostname, domain = _a.domain,
            // DOM information
            classes = _a.classes, hrefs = _a.hrefs, ids = _a.ids,
            // Allows to specify which rules to return
            _b = _a.getBaseRules,
            // Allows to specify which rules to return
            getBaseRules = _b === void 0 ? true : _b, _c = _a.getInjectionRules, getInjectionRules = _c === void 0 ? true : _c, _d = _a.getRulesFromDOM, getRulesFromDOM = _d === void 0 ? true : _d, _e = _a.getRulesFromHostname, getRulesFromHostname = _e === void 0 ? true : _e;
        if (this.config.loadCosmeticFilters === false) {
            return {
                active: false,
                extended: [],
                scripts: [],
                styles: ''
            };
        }
        // Check if there is some generichide
        var genericHides = this.genericHides.matchAll(Request.fromRawDetails({
            domain: domain || '',
            hostname: hostname,
            url: url,
            sourceDomain: '',
            sourceHostname: '',
            sourceUrl: ''
        }));
        // Get $generichide filter with highest priority:
        // $generichide,important > $generichide > @@$generichide
        var genericHideFilter = null;
        var currentScore = 0;
        for (var i = 0; i < genericHides.length; i += 1) {
            var filter = genericHides[i];
            // To encode priority between filters, we create a bitmask with the following:
            // $important,generichide = 100 (takes precedence)
            // $generichide           = 010 (exception to @@$generichide)
            // @@$generichide         = 001 (forbids generic hide filters)
            var score = (filter.isImportant() ? 4 : 0) | (filter.isException() ? 1 : 2);
            // Highest `score` has precedence
            if (score > currentScore) {
                currentScore = score;
                genericHideFilter = filter;
            }
        }
        // Check that there is at least one $generichide match and no exception
        var allowGenericHides = genericHideFilter === null || genericHideFilter.isException() === false;
        // Lookup injections as well as stylesheets
        var _f = this.cosmetics.getCosmeticsFilters({
            domain: domain || '',
            hostname: hostname,
            classes: classes,
            hrefs: hrefs,
            ids: ids,
            allowGenericHides: allowGenericHides,
            getBaseRules: getBaseRules,
            getInjectionRules: getInjectionRules,
            getRulesFromDOM: getRulesFromDOM,
            getRulesFromHostname: getRulesFromHostname
        }), injections = _f.injections, stylesheet = _f.stylesheet;
        // Perform interpolation for injected scripts
        var scripts = [];
        for (var i = 0; i < injections.length; i += 1) {
            var script = injections[i].getScript(this.resources.js);
            if (script !== undefined) {
                this.emit('script-injected', script, url);
                scripts.push(script);
            }
        }
        // Emit events
        if (stylesheet.length !== 0) {
            this.emit('style-injected', stylesheet, url);
        }
        return {
            active: true,
            extended: [],
            scripts: scripts,
            styles: stylesheet
        };
    };
    /**
     * Given a `request`, return all matching network filters found in the engine.
     */
    FilterEngine.prototype.matchAll = function (request) {
        var filters = [];
        if (request.isSupported) {
            Array.prototype.push.apply(filters, this.importants.matchAll(request));
            Array.prototype.push.apply(filters, this.filters.matchAll(request));
            Array.prototype.push.apply(filters, this.exceptions.matchAll(request));
            Array.prototype.push.apply(filters, this.csp.matchAll(request));
            Array.prototype.push.apply(filters, this.genericHides.matchAll(request));
            Array.prototype.push.apply(filters, this.redirects.matchAll(request));
        }
        return new Set(filters);
    };
    /**
     * Given a "main_frame" request, check if some content security policies
     * should be injected in the page.
     */
    FilterEngine.prototype.getCSPDirectives = function (request) {
        if (!this.config.loadNetworkFilters) {
            return undefined;
        }
        if (request.isSupported !== true || request.isMainFrame() === false) {
            return undefined;
        }
        var matches = this.csp.matchAll(request);
        // No $csp filter found
        if (matches.length === 0) {
            return undefined;
        }
        // Collect all CSP directives and keep track of exceptions
        var disabledCsp = new Set();
        var enabledCsp = new Set();
        for (var i = 0; i < matches.length; i += 1) {
            var filter = matches[i];
            if (filter.isException()) {
                if (filter.csp === undefined) {
                    // All CSP directives are disabled for this site
                    return undefined;
                }
                disabledCsp.add(filter.csp);
            }
            else {
                enabledCsp.add(filter.csp);
            }
        }
        // Combine all CSPs (except the black-listed ones)
        var csps = Array.from(enabledCsp)
            .filter(function (csp) { return !disabledCsp.has(csp); })
            .join('; ') || undefined;
        // Emit event
        if (csps !== undefined) {
            this.emit('csp-injected', csps, request);
        }
        return csps;
    };
    /**
     * Decide if a network request (usually from WebRequest API) should be
     * blocked, redirected or allowed.
     */
    FilterEngine.prototype.match = function (request) {
        var result = {
            exception: undefined,
            filter: undefined,
            match: false,
            redirect: undefined
        };
        if (!this.config.loadNetworkFilters) {
            return result;
        }
        if (request.isSupported) {
            // Check the filters in the following order:
            // 1. $important (not subject to exceptions)
            // 2. redirection ($redirect=resource)
            // 3. normal filters
            // 4. exceptions
            result.filter = this.importants.match(request);
            if (result.filter === undefined) {
                // Check if there is a redirect or a normal match
                result.filter = this.redirects.match(request);
                if (result.filter === undefined) {
                    result.filter = this.filters.match(request);
                }
                // If we found something, check for exceptions
                if (result.filter !== undefined) {
                    result.exception = this.exceptions.match(request);
                }
            }
            // If there is a match
            if (result.filter !== undefined) {
                if (result.filter.isRedirect()) {
                    var redirectResource = this.resources.getResource(result.filter.getRedirect());
                    if (redirectResource !== undefined) {
                        var data = redirectResource.data, contentType = redirectResource.contentType;
                        var dataUrl = void 0;
                        if (contentType.indexOf(';') !== -1) {
                            dataUrl = "data:" + contentType + "," + data;
                        }
                        else {
                            dataUrl = "data:" + contentType + ";base64," + btoaPolyfill(data);
                        }
                        result.redirect = {
                            body: data,
                            contentType: contentType,
                            dataUrl: dataUrl.trim()
                        };
                    } // TODO - else, throw an exception
                }
            }
        }
        result.match = result.exception === undefined && result.filter !== undefined;
        // Emit events if we found a match
        if (result.exception !== undefined) {
            this.emit('request-whitelisted', request, result);
        }
        else if (result.redirect !== undefined) {
            this.emit('request-redirected', request, result);
        }
        else if (result.filter !== undefined) {
            this.emit('request-blocked', request, result);
        }
        return result;
    };
    return FilterEngine;
}(EventEmitter));

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
/*!
 * Copyright (c) 2008-2009 Bjoern Hoehrmann <bjoern@hoehrmann.de>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
// From http://bjoern.hoehrmann.de/utf-8/decoder/dfa/
var utf8d = new Uint8Array([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    8, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    0xa, 0x3, 0x3, 0x3, 0x3, 0x3, 0x3, 0x3, 0x3, 0x3, 0x3, 0x3, 0x3, 0x4, 0x3, 0x3,
    0xb, 0x6, 0x6, 0x6, 0x5, 0x8, 0x8, 0x8, 0x8, 0x8, 0x8, 0x8, 0x8, 0x8, 0x8, 0x8,
    0x0, 0x1, 0x2, 0x3, 0x5, 0x8, 0x7, 0x1, 0x1, 0x1, 0x4, 0x6, 0x1, 0x1, 0x1, 0x1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1,
    1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 3, 1, 1, 1, 1, 1, 1,
    1, 3, 1, 1, 1, 1, 1, 3, 1, 3, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
]);
function isAscii(bytes) {
    if (bytes.length === 0) {
        return true;
    }
    for (var i = 0; i < bytes.length; i += 1) {
        if (bytes[i] > 127) {
            return false;
        }
    }
    return true;
}
function isUTF8(bytes) {
    if (bytes.length === 0) {
        return true;
    }
    if (isAscii(bytes) === true) {
        return true;
    }
    var state = 0;
    for (var i = 0; i < bytes.length; i += 1) {
        var type = utf8d[bytes[i]];
        state = utf8d[256 + state * 16 + type];
        if (state === 1 || state === undefined) {
            return false;
        }
    }
    return true;
}

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
function extractTagsFromHtml(html, tag) {
    var tags = [];
    var prefix = "<" + tag;
    var suffix = "</" + tag + ">";
    // Keep track of the beginning of current identified tag
    var index = html.indexOf(prefix);
    // Keep tracks of index immediately following last extracted tag
    var endOfLastTag = 0;
    while (index !== -1) {
        // Find index of end of current tag. If we do not find it, it could be
        // because it will come in the next chunk and we should try parsing it
        // again then.
        var endOfTagIndex = html.indexOf('>', index + prefix.length);
        if (endOfTagIndex === -1) {
            return [tags, html.slice(0, index), html.slice(index)];
        }
        // Handle short tag form <tag/> which will not have a closing tag.
        if (html.charCodeAt(endOfTagIndex - 1) === 47 /* '/' */) {
            endOfLastTag = endOfTagIndex + 1;
            tags.push([index, html.slice(index, endOfLastTag)]);
        }
        else {
            // Find index of closing tag '</tag>'. If we do not find it, again, it
            // could mean that it will come in next chunk and we need to try parsing
            // it again with more input.
            var indexOfClosingTag = html.indexOf(suffix, endOfTagIndex);
            if (indexOfClosingTag === -1) {
                return [tags, html.slice(0, index), html.slice(index)];
            }
            tags.push([index, html.slice(index, indexOfClosingTag + suffix.length)]);
            endOfLastTag = indexOfClosingTag + suffix.length;
        }
        index = html.indexOf(prefix, endOfLastTag);
    }
    // Make sure we consume as much input as possible so that we do not parse the
    // same portion of HTML again next time and we can stream chunks as early as
    // possible.
    //
    // We check if there is at least one '<' char after the end of the last
    // extracted tag; this would indicate that the next chunk might contain the
    // remaining of a valid tag. We then look up to N characters after this '<'
    // character, where N is the size of 'prefix'. The rational is that if we
    // reached this part of the code, then it cannot be a match otherwise we
    // would have returned earlier (from the loop).
    var lastClosingTagIndex = html.lastIndexOf('>');
    if (lastClosingTagIndex === -1) {
        lastClosingTagIndex = endOfLastTag;
    }
    var indexOfNextTag = html.indexOf('<', lastClosingTagIndex);
    // If no '<' in the remaining of input, then it means we can count this chunk
    // as fully parsed (i.e.: next chunk can be parsed independently without
    // missing a tag which would start in this one).
    if (indexOfNextTag === -1) {
        return [tags, html, ''];
    }
    // In case of a partial tag ending this 'html' chunk. Then check if we have
    // enough information to discard it already based on the kind of tags we are
    // looking for.
    if (html.length - indexOfNextTag >= prefix.length ||
        prefix.startsWith(html.slice(indexOfNextTag)) === false) {
        return [tags, html, ''];
    }
    return [tags, html.slice(0, indexOfNextTag), html.slice(indexOfNextTag)];
}
function extractSelectorsFromRules(selectors) {
    var patterns = [];
    var regexps = [];
    for (var i = 0; i < selectors.length; i += 1) {
        var selector = selectors[i][1][0];
        if (selector !== undefined) {
            if (selector.charCodeAt(0) === 47 /* '/' */) {
                if (selector.endsWith('/')) {
                    regexps.push(new RegExp(selector.slice(1, -1)));
                }
                else if (selector.endsWith('/i')) {
                    regexps.push(new RegExp(selector.slice(1, -2), 'i'));
                }
            }
            else {
                patterns.push(selector);
            }
        }
    }
    return [patterns, regexps];
}
function selectTagsToRemove(patterns, regexps, tags) {
    var toRemove = [];
    for (var i = 0; i < tags.length; i += 1) {
        var tag = tags[i];
        var found = false;
        for (var j = 0; j < patterns.length; j += 1) {
            if (tag[1].indexOf(patterns[j]) !== -1) {
                toRemove.push(tag);
                found = true;
                break;
            }
        }
        if (found === false) {
            for (var j = 0; j < regexps.length; j += 1) {
                if (regexps[j].test(tag[1]) === true) {
                    toRemove.push(tag);
                    break;
                }
            }
        }
    }
    return toRemove;
}
function removeTagsFromHtml(html, toRemove) {
    if (toRemove.length === 0) {
        return html;
    }
    var filteredHtml = html;
    toRemove.reverse(); // make sure to remove from last to first tag (preserve indices)
    for (var i = 0; i < toRemove.length; i += 1) {
        var _a = __read(toRemove[i], 2), index = _a[0], tag = _a[1];
        filteredHtml = filteredHtml.slice(0, index) + filteredHtml.slice(index + tag.length);
    }
    return filteredHtml;
}
var StreamingHtmlFilter = /** @class */ (function () {
    function StreamingHtmlFilter(selectors) {
        this.buffer = '';
        // Prepare patterns
        var extracted = extractSelectorsFromRules(selectors);
        this.patterns = extracted[0];
        this.regexps = extracted[1];
    }
    StreamingHtmlFilter.prototype.flush = function () {
        return this.buffer;
    };
    StreamingHtmlFilter.prototype.write = function (chunk) {
        // If there are no valid selectors, we can directly write `data`.
        if (this.patterns.length === 0 && this.regexps.length === 0) {
            return chunk;
        }
        // Accumulate buffer + new data
        this.buffer += chunk;
        // Parse tags from `this.buffer`
        var _a = __read(extractTagsFromHtml(this.buffer, 'script'), 3), tags = _a[0], parsed = _a[1], rest = _a[2];
        this.buffer = rest;
        // If no tags were found, just return the parsed version
        if (tags.length === 0) {
            return parsed;
        }
        // Perform tags filtering using `this.patterns` and `this.regexps`.
        return removeTagsFromHtml(parsed, selectTagsToRemove(this.patterns, this.regexps, tags));
    };
    return StreamingHtmlFilter;
}());

/*!
 * Copyright (c) 2017-2019 Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
/**
 * Create an instance of `Request` from `chrome.webRequest.WebRequestDetails`.
 */
function fromWebRequestDetails(details) {
    return Request.fromRawDetails({
        requestId: details.requestId,
        sourceUrl: details.initiator || details.originUrl || details.documentUrl,
        tabId: details.tabId,
        type: details.type,
        url: details.url
    });
}
function updateResponseHeadersWithCSP(details, policies) {
    if (policies === undefined) {
        return {};
    }
    var responseHeaders = details.responseHeaders || [];
    var CSP_HEADER_NAME = 'content-security-policy';
    // Collect existing CSP headers from response
    responseHeaders.forEach(function (_a) {
        var name = _a.name, value = _a.value;
        if (name.toLowerCase() === CSP_HEADER_NAME) {
            policies += "; " + value;
        }
    });
    // Remove all CSP headers from response
    responseHeaders = responseHeaders.filter(function (_a) {
        var name = _a.name;
        return name.toLowerCase() !== CSP_HEADER_NAME;
    });
    // Add updated CSP header
    responseHeaders.push({ name: CSP_HEADER_NAME, value: policies });
    return { responseHeaders: responseHeaders };
}
// Detect charset with UTF-8 encoding from HTML
var CHARSET_TAG_RE = /<meta charset=['"]utf-8/i;
var CHARSET_HTTP_EQUIV_RE = /<meta http-equiv="content-type" content="text\/html;charset=utf-8/i;
/**
 * Check if HTML filtering is possible in this browser. Only Firefox is supported.
 */
function isHTMLFilteringSupported() {
    // @ts-ignore
    var browser = typeof browser !== 'undefined' ? browser : chrome;
    // Apply HTML filtering is any
    return (typeof TextDecoder !== 'undefined' &&
        typeof TextEncoder !== 'undefined' &&
        browser.webRequest !== undefined &&
        browser.webRequest.filterResponseData !== undefined);
}
function filterRequestHTML(_a, rules) {
    var _this = this;
    var id = _a.id;
    // @ts-ignore
    var browser = typeof browser !== 'undefined' ? browser : chrome;
    // Create filter to observe loading of resource
    var filter = browser.webRequest.filterResponseData(id);
    var decoder = new TextDecoder();
    var encoder = new TextEncoder();
    var htmlFilter = new StreamingHtmlFilter(rules);
    var utf8;
    filter.ondata = function (event) {
        var decoded = '';
        try {
            // Attempt decoding chunk (ArrayBuffer) into a string.
            decoded = decoder.decode(event.data, { stream: true });
        }
        catch (ex) {
            // If we fail to decode chunk, then we need to be extra conservative
            // and we stop listening to streaming response. This is most likely
            // because we do not support this encoding.
            filter.write(event.data);
            filter.disconnect();
            return;
        }
        // Try to guess encoding on first chunk received. The assumption is that
        // we will find either `charset` or `http-equiv` meta-tag in the header.
        // If none of this is found, then we fallback to using `isUTF8` which
        // will make sure `event.data` is valid utf-8 (this check is more
        // costly).
        if (utf8 === undefined) {
            utf8 =
                CHARSET_TAG_RE.test(decoded) ||
                CHARSET_HTTP_EQUIV_RE.test(decoded) ||
                isUTF8(new Uint8Array(event.data));
        }
        // We only proceed to filter this chunk if we could confirm that encoding
        // if utf-8. Otherwise we simply proxy the data as-is to not risk
        // breaking the page.
        if (utf8 === true) {
            filter.write(encoder.encode(htmlFilter.write(decoded)));
        }
        else {
            filter.write(event.data);
        }
    };
    filter.onstop = function () {
        return __awaiter(_this, void 0, void 0, function () {
            var remaining;
            return __generator(this, function (_a) {
                remaining = encoder.encode(htmlFilter.write(decoder.decode())) + htmlFilter.flush();
                if (remaining.length !== 0) {
                    filter.write(encoder.encode(remaining));
                }
                filter.disconnect();
                return [2 /*return*/];
            });
        });
    };
}
/**
 * Wrap `FiltersEngine` into a WebExtension-friendly helper class. It exposes
 * methods to interface with WebExtension APIs needed to block ads.
 */

async function getLocalStorageValue(key) {
    return new Promise((resolve, reject) => {
        try {
            resolve((localStorage.getItem(key) == "true"));
        }
        catch (ex) {
            reject(ex);
        }
    });
}

var WebExtensionBlocker = /** @class */ (function (_super) {
    __extends(WebExtensionBlocker, _super);
    function WebExtensionBlocker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Deal with request cancellation (`{ cancel: true }`) and redirection (`{ redirectUrl: '...' }`).
         */

        _this.onBeforeRequest = async function (details) {
            var value = await getLocalStorageValue("urlCheckboxValue");

            if (value == false) {
                return {};
            }
            var request = fromWebRequestDetails(details);
            // if (request.isMainFrame()) {
            //     return {};
            // }
            var _a = _this.match(request), redirect = _a.redirect, match = _a.match;
            if (redirect !== undefined) {
                return { redirectUrl: redirect.dataUrl };
            }
            else if (match === true) {
                return { cancel: true };
            }
            return {};
        };
        /**
         *
         */
        _this.onHeadersReceived = function (details) {
            return updateResponseHeadersWithCSP(details, _this.getCSPDirectives(fromWebRequestDetails(details)));
        };
        _this.onRuntimeMessage = function (msg, sender, sendResponse) {
            if (sender.tab === undefined || sender.tab.id === undefined || sender.frameId === undefined) {
                return;
            }
            // Make sure we only listen to messages coming from our content-script
            // based on the value of `action`.
            if (msg.action === 'getCosmeticsFilters') {
                // Extract hostname from sender's URL
                var _a = sender.url, url = _a === void 0 ? '' : _a, frameId = sender.frameId;
                var parsed = parse(url);
                var hostname = parsed.hostname || '';
                var domain = parsed.domain || '';
                // Once per tab/page load we inject base stylesheets. These are always
                // the same for all frames of a given page because they do not depend on
                // a particular domain and cannot be cancelled using unhide rules.
                // Because of this, we specify `allFrames: true` when injecting them so
                // that we do not need to perform this operation for sub-frames.
                if (frameId === 0 && msg.lifecycle === 'start') {
                    var _b = _this.getCosmeticsFilters({
                        domain: domain,
                        hostname: hostname,
                        url: url,
                        classes: msg.classes,
                        hrefs: msg.hrefs,
                        ids: msg.ids,
                        // This needs to be done only once per tab
                        getBaseRules: true,
                        getInjectionRules: false,
                        getRulesFromDOM: false,
                        getRulesFromHostname: false
                    }), active = _b.active, styles = _b.styles;
                    if (active === false) {
                        return;
                    }
                    _this.injectStylesWebExtension(styles, { tabId: sender.tab.id, allFrames: true });
                }
                // Separately, requests cosmetics which depend on the page it self
                // (either because of the hostname or content of the DOM). Content script
                // logic is responsible for returning information about lists of classes,
                // ids and hrefs observed in the DOM. MutationObserver is also used to
                // make sure we can react to changes.
                {
                    var _c = _this.getCosmeticsFilters({
                        domain: domain,
                        hostname: hostname,
                        url: url,
                        classes: msg.classes,
                        hrefs: msg.hrefs,
                        ids: msg.ids,
                        // This needs to be done only once per frame
                        getBaseRules: false,
                        getInjectionRules: msg.lifecycle === 'start',
                        getRulesFromHostname: msg.lifecycle === 'start',
                        // This will be done every time we get information about DOM mutation
                        getRulesFromDOM: msg.lifecycle === 'dom-update'
                    }), active = _c.active, styles = _c.styles, scripts = _c.scripts;
                    if (active === false) {
                        return;
                    }
                    _this.injectStylesWebExtension(styles, { tabId: sender.tab.id, frameId: frameId });
                    // Inject scripts from content script
                    var responseFromBackground = {
                        active: active,
                        extended: [],
                        scripts: scripts,
                        styles: ''
                    };
                    sendResponse(responseFromBackground);
                }
            }
        };
        return _this;
    }
    WebExtensionBlocker.prototype.enableBlockingInBrowser = function () {
        if (this.config.loadNetworkFilters === true) {
            chrome.webRequest.onBeforeRequest.addListener(this.onBeforeRequest, { urls: ['<all_urls>'] }, ['blocking']);
            chrome.webRequest.onHeadersReceived.addListener(this.onHeadersReceived, { urls: ['<all_urls>'], types: ['main_frame'] }, ['blocking', 'responseHeaders']);
        }
        // Start listening to messages coming from the content-script
        if (this.config.loadCosmeticFilters === true) {
            chrome.runtime.onMessage.addListener(this.onRuntimeMessage);
        }
    };
    WebExtensionBlocker.prototype.disableBlockingInBrowser = function () {
        chrome.webRequest.onBeforeRequest.removeListener(this.onBeforeRequest);
        chrome.webRequest.onHeadersReceived.removeListener(this.onHeadersReceived);
        chrome.runtime.onMessage.removeListener(this.onRuntimeMessage);
    };
    WebExtensionBlocker.prototype.performHTMLFiltering = function (request) {
        if (request.isMainFrame()) {
            // Here we optionally perform HTML filtering. This can only be done if:
            // 1. `enableHtmlFiltering` is set to `true`.
            // 2. `browser.webRequest.filterResponseData` (Firefox only!).
            // 3. `TextEncoder` and `TextDecoder` are available.
            if (this.config.enableHtmlFiltering === true && isHTMLFilteringSupported()) {
                var htmlFilters = this.getHtmlFilters(request);
                if (htmlFilters.length !== 0) {
                    filterRequestHTML(request, htmlFilters);
                }
            }
        }
    };
    WebExtensionBlocker.prototype.injectStylesWebExtension = function (styles, _a) {
        var tabId = _a.tabId, frameId = _a.frameId, _b = _a.allFrames, allFrames = _b === void 0 ? false : _b;
        if (styles.length > 0 &&
            typeof chrome !== 'undefined' &&
            chrome.tabs &&
            chrome.tabs.insertCSS) {
            chrome.tabs.insertCSS(tabId, {
                allFrames: allFrames,
                code: styles,
                cssOrigin: 'user',
                frameId: frameId,
                matchAboutBlank: true,
                runAt: 'document_start'
            }, function () {
                if (chrome.runtime.lastError) {
                    console.error('Error while injecting CSS', chrome.runtime.lastError.message);
                }
            });
        }
    };
    return WebExtensionBlocker;
}(FilterEngine));

    // WebExtensionBlocker.fromLists(fetch, fullLists, {
    //     enableCompression: true,
    //     enableHtmlFiltering: true
    // }).then(function (blocker) {
    //     blocker.enableBlockingInBrowser();
    //     blocker.on('csp-injected', function (request) {
    //         console.log('csp', request.url);
    //     });
    //     blocker.on('script-injected', function (script, url) {
    //         console.log('script', script.length, url);
    //     });
    //     blocker.on('style-injected', function (style, url) {
    //         console.log('style', url, style.length);
    //     });
    //     blocker.on('html-filtered', function (htmlSelectors) {
    //         console.log('html selectors', htmlSelectors);
    //     });
    //     console.log('Ready to roll!');
    // });