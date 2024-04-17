
const CONSTANTS = {
    RATE_LIMITTER_CONSTANTS : {
        vendor1: {
            RATE_LIMIT: 2,
            RATE_LIMITER_RESET_TIME: 120 * 1000 // 2 mins
        },
        vendor2: {
            RATE_LIMIT: 2,
            RATE_LIMITER_RESET_TIME: 120 * 1000 // 2 mins
        },
        vendor3: {
            RATE_LIMIT: 1,
            RATE_LIMITER_RESET_TIME: 120 * 1000 // 2 mins
        }
    },
    HOST: 'http://localhost',
    PORT: 4500,
    ERROR_CODES: {
        RATE_LIMMIT: 429,
        NOT_FOUND: 404
    },
    ERROR_MESSAGE: "Invalid IP or IP not Found",
    STATUS: {
        ERROR: "Error"
    },
    CACHE_TTL: 30, //30 seconds
    API_KEY: {
        IP_GEO_LOCATION: 'UPDATE-API-KEY',
        IP_STACK: 'UPDATE-API-KEY'
    },
    VENDOR: {
        IP_STACK: "Ipstack",
        IP_GEO_LOCATION: "IpGeoLocation",
        TEST: "TestVendor"
    }
}

module.exports = CONSTANTS;
