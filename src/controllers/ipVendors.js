const IP = require('ip');
const axios = require('axios');
const NodeCache = require( "node-cache" ); 
const { CACHE_TTL, API_KEY, VENDOR, ERROR_MESSAGE } = require('../constants');
const serverCache = new NodeCache();

const getCache = (ipAddress) => {
    // Retrieve cache for the given IP address
   return serverCache.get(ipAddress);
};

const errorMessage = (req, res, next) => {
    res.status(401).json({
        Message: "IP Address is missing"
    });
    }

    const ipStackKey = process.env.IPSTACK || API_KEY.IP_STACK;
    const ipGeoLocKey = process.env.IPGEOLOC || API_KEY.IP_GEO_LOCATION;

//ipstack
const callVendor1 = async (req, res, next) => {
    const ipAddress = req.query.ip;
    try {
        const responseFromIpStack = await axios.get(`http://api.ipstack.com/${ipAddress}?access_key=${ipStackKey}`);
        if(responseFromIpStack.data.success === false) {
            res.status(401).json({
                IP:ipAddress,
                Vendor: VENDOR.IP_STACK,
                Message: ERROR_MESSAGE
            });
        }
        const countryName = responseFromIpStack.data.country_name;
        
         // setCache
        serverCache.set(ipAddress, {
            IP: ipAddress,
            Vendor: VENDOR.IP_STACK,
            CountryName: countryName,
        }, CACHE_TTL)
    
        // send response
       res.status(200).json({
        IP: ipAddress,
        Vendor: VENDOR.IP_STACK,
        CountryName: countryName,
    });
    } catch(error) {
        res.status(401).json({
            IP:ipAddress,
            Vendor: VENDOR.IP_STACK,
            Message: ERROR_MESSAGE
        });
    }

}

//ipGeoLocation
const callVendor2 = async (req, res, next) => {
    const ipAddress = req.query.ip;
    try {
        const responseFromIpGeoLocation = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${ipGeoLocKey}&ip=${ipAddress}`);

        const countryName = responseFromIpGeoLocation.data.country_name;
        // setCache
        serverCache.set(ipAddress, {
                IP: ipAddress,
                Vendor: VENDOR.IP_GEO_LOCATION,
                CountryName: countryName
            }, CACHE_TTL)
        // send response
        res.status(200).json({
                IP: ipAddress,
                Vendor: VENDOR.IP_GEO_LOCATION,
                CountryName: countryName
            });
        } catch (error) {
            res.status(401).json({
                IP: ipAddress,
                Vendor: VENDOR.IP_GEO_LOCATION,
                Message: ERROR_MESSAGE
            });
        }
    
}

const callCache = (req, res, next) => {
    const ipAddress = req.query.ip;
    console.log("*** Reply from Cache")
    serverCache.get(ipAddress)
    res.status(200).json(serverCache.get(ipAddress));
}


module.exports = {  callVendor1, callVendor2, callCache, getCache, errorMessage };
