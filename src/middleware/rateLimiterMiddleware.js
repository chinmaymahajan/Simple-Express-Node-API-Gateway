const IP = require('ip');
const { callVendor, callCache, getCache, errorMessage } = require('../controllers/ipVendors');
const { RATE_LIMITTER_CONSTANTS, ERROR_CODES, STATUS } = require('../constants');

const requestCounts = {};
const tempBlockIPs = {};

const rateLimitter = (req, res, next) => {
    const ipAddress = req.query.ip;
    
    if (ipAddress === undefined) {
        return errorMessage(req, res, next);
    }
    
    if (ipAddress && getCache(ipAddress) !== undefined) {
        return callCache(req, res, next);
    } else {
        const currentIpAddress = IP.address();
    
        if (!requestCounts[currentIpAddress]) {
            requestCounts[currentIpAddress] = {};
            requestCounts[currentIpAddress].vendorCounts = {};
        }

        const vendorCounts = requestCounts[currentIpAddress].vendorCounts;

        for (const vendor of Object.keys(RATE_LIMITTER_CONSTANTS)) {
            const vendorLimit = RATE_LIMITTER_CONSTANTS[vendor].RATE_LIMIT;
            const vendorResetTime = RATE_LIMITTER_CONSTANTS[vendor].RATE_LIMITER_RESET_TIME;

            if (vendorCounts[vendor] === undefined) {
                vendorCounts[vendor] = 0;
            }

            if (tempBlockIPs[currentIpAddress] && tempBlockIPs[currentIpAddress][vendor]) {
                const timeToUnblock = tempBlockIPs[currentIpAddress][vendor];
                
                if (timeToUnblock < Date.now()) {
                    console.log(`***** VENDOR ${vendor} is ONLINE *****`);
                    delete tempBlockIPs[currentIpAddress][vendor];
                    vendorCounts[vendor] = (vendorCounts[vendor] || 0) + 1
                    return callVendor(req, res, next, vendor);
                } else {
                    console.log(`**** VENDOR ${vendor} is OFFLINE ****`);
                    continue;
                }
            }

            if (vendorCounts[vendor] >= vendorLimit) {
                if (tempBlockIPs[currentIpAddress] === undefined) {
                    tempBlockIPs[currentIpAddress] = {};
                }
                
                if (tempBlockIPs[currentIpAddress][vendor] === undefined) {
                    tempBlockIPs[currentIpAddress][vendor] = Date.now() + vendorResetTime;
                }

                const remainingTimeToUnblock = tempBlockIPs[currentIpAddress][vendor] - Date.now();
                const minutes = Math.floor((remainingTimeToUnblock / 1000 / 60) % 60);
                console.log(`Rate limit exceeded for ${vendor}. Please try again after ${minutes}`)
                
            } else {
                vendorCounts[vendor] = (vendorCounts[vendor] || 0) + 1
                return callVendor(req, res, next, vendor);
            }
        }
        return res.status(ERROR_CODES.RATE_LIMMIT).json({
            code: ERROR_CODES.RATE_LIMMIT,
            status: STATUS.ERROR,
            message: `Rate limit exceeded for All vendors. Please try again later`,
            data: null,
        });

    }
}

module.exports = { rateLimitter, requestCounts }; 
