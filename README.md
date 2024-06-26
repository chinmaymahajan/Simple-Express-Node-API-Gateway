# Simple Express Node API Gateway

This repository contains a simple Express Node API Gateway that acts as a mediator between clients and multiple microservices. It provides a basic structure for routing requests to different services based on the endpoint. Additionally, it incorporates caching mechanisms to reduce load times and improve response efficiency, along with a configurable rate limiting feature (custom implementation) to manage incoming requests effectively and prevent abuse.

## Installation

### Prerequisites
- Node.js
- npm (usually comes with Node.js)

### Follow these steps to get started:

#### Clone the repository:

```git clone https://github.com/chinmaymahajan/Simple-Express-Node-API-Gateway.git```

#### Navigate to the project directory:
```cd Simple-Express-Node-API-Gateway ```

### Install dependencies:
```npm install```

### Update API Keys in Constant.js or set ENV variable:

```
API_KEY: {
        IP_GEO_LOCATION: 'UPDATE-API-KEY',
        IP_STACK: 'UPDATE-API-KEY'
    }
```
or
```
IPSTACK="Pass API Key" IPGEOLOC="Pass API Key" npm run start
```

## Rate Limitter
The API server implements rate limiting to restrict the number of requests from a single IP address within a specified time period for each vendor. You can configure the limit and reset time in the constants file. Currently, you can make 3 calls to each vendor, and the rate limiter reset time is set to 2 minutes.
- For vendor 1: If more than 3 calls are made, the rate limiter for vendor 1 will be triggered, and subsequent requests will be redirected to vendor 2, Vendor 1 will be unavailable for 2 minutes.
- For vendor 2: Exceeding 3 calls will activate the rate limiter for vendor 2. In this case, there will be a mandatory 2-minute waiting period. 

## Cache
Cache is configured by default for 20 seconds but can be changed from the constants file.
```CACHE_TTL: 20, // 20 seconds```

## Usage
```npm run start```
or
```npx nodemon index.js```

## Access Endpoint
Change the IP accordingly
```http://localhost:4500/countryName?ip=36.202.220.155```

## Vendors Used
- Ipstack
- IpGeoLocation
