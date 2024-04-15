const IP = require('ip');
const NodeCache = require( "node-cache" ); 
const { callVendor2, callVendor1, callCache, getCache, errorMessage } = require('./ipVendors');
const { RATE_LIMITTER_CONSTANTS, ERROR_CODES, STATUS } = require('./constants');

const requestCounts = {};
const tempBlockIPsVendor1 = {};
const tempBlockIPsVendor2 = {};
const rateLimitter = (req, res, next) => {
    const ipAddress = req.query.ip;
    if(ipAddress === undefined) {
        return errorMessage(req, res, next);
    }
    if(ipAddress && getCache(ipAddress) !== undefined) {
        return callCache(req, res, next);
    } else {
        const ipAddress = IP.address();
        if(requestCounts[ipAddress]  === undefined) {
            requestCounts[ipAddress] = {}
            requestCounts[ipAddress].vendor1Count = 0;
            requestCounts[ipAddress].vendor2Count = 0;
        }

        if(tempBlockIPsVendor1 && tempBlockIPsVendor1[ipAddress]) {
            const timeToUnblock = tempBlockIPsVendor1[ipAddress];
            
            if(timeToUnblock < Date.now()) {
                console.log("***** VENDOR 1 is ONLINE *****")
                delete tempBlockIPsVendor1[ipAddress];
                requestCounts[ipAddress].vendor1Count = 0;
                requestCounts[ipAddress].vendor1Count = (requestCounts[ipAddress].vendor1Count || 0) + 1;
                return callVendor1(req, res, next);

            } else {
                console.log("???? VENDOR 1 is OFFLINE ????")
            }
        }
        if(tempBlockIPsVendor2 &&  tempBlockIPsVendor2[ipAddress]) {
            const timeToUnblock = tempBlockIPsVendor2[ipAddress];
            if(timeToUnblock < Date.now()) {
                console.log("***** VENDOR 2 is ONLINE *****")
                delete tempBlockIPsVendor2[ipAddress];
                requestCounts[ipAddress].vendor2Count = 0;
                requestCounts[ipAddress].vendor2Count = (requestCounts[ipAddress].vendor2Count || 0) + 1;
                return callVendor2(req, res, next);

            } else {
                console.log("???? VENDOR 2 is OFFLINE ????")
            }
        }
    
    if(requestCounts[ipAddress] && 
            (requestCounts[ipAddress].vendor1Count >= RATE_LIMITTER_CONSTANTS.VENDOR1_LIMIT.RATE_LIMIT &&
            requestCounts[ipAddress].vendor2Count < RATE_LIMITTER_CONSTANTS.VENDOR2_LIMIT.RATE_LIMIT)) {
            if(tempBlockIPsVendor1[ipAddress] === undefined)
                tempBlockIPsVendor1[ipAddress] = Date.now() + RATE_LIMITTER_CONSTANTS.VENDOR1_LIMIT.RATE_LIMITER_RESET_TIME
            requestCounts[ipAddress].vendor2Count = (requestCounts[ipAddress].vendor2Count || 0) + 1;
                    return callVendor2(req, res, next);
        } else if(requestCounts[ipAddress] && 
            (requestCounts[ipAddress].vendor1Count < RATE_LIMITTER_CONSTANTS.VENDOR1_LIMIT.RATE_LIMIT &&
            requestCounts[ipAddress].vendor2Count >= RATE_LIMITTER_CONSTANTS.VENDOR2_LIMIT.RATE_LIMIT)) {
                if(tempBlockIPsVendor2[ipAddress] === undefined)
                    tempBlockIPsVendor2[ipAddress] = Date.now() + RATE_LIMITTER_CONSTANTS.VENDOR2_LIMIT.RATE_LIMITER_RESET_TIME;

            requestCounts[ipAddress].vendor1Count = (requestCounts[ipAddress].vendor1Count || 0) + 1;
                    return callVendor1(req, res, next);
        } else if (requestCounts[ipAddress] &&
            (requestCounts[ipAddress].vendor1Count >= RATE_LIMITTER_CONSTANTS.VENDOR1_LIMIT.RATE_LIMIT &&
            requestCounts[ipAddress].vendor2Count >= RATE_LIMITTER_CONSTANTS.VENDOR2_LIMIT.RATE_LIMIT)) {
                const timeToUnblock = tempBlockIPsVendor1[ipAddress];
                const remainingTimeToUnblock = timeToUnblock - Date.now();
                const minutes = Math.floor((remainingTimeToUnblock / 1000 / 60) % 60);
            
            return res.status(ERROR_CODES.RATE_LIMMIT).json({
                code: ERROR_CODES.RATE_LIMMIT,
                status: STATUS.ERROR,
                message: `Rate limit exceeded for both the Vendors. Please try again later after  ${minutes} minutes`,
                data: null,
                });
        }  else if (requestCounts[ipAddress] &&
            (requestCounts[ipAddress].vendor1Count < RATE_LIMITTER_CONSTANTS.VENDOR1_LIMIT.RATE_LIMIT &&
            requestCounts[ipAddress].vendor2Count < RATE_LIMITTER_CONSTANTS.VENDOR2_LIMIT.RATE_LIMIT)){
            requestCounts[ipAddress].vendor1Count = (requestCounts[ipAddress].vendor1Count || 0) + 1;
                    return callVendor1(req, res, next)
        }
    }
}
module.exports = { rateLimitter, requestCounts }; 
