// Create web server 

// 1. Import http module
const http = require('http');

// 2. Import url module
const url = require('url');

// 3. Import querystring module
const querystring = require('querystring');

// 4. Create server
const server = http.createServer((req, res) => {
    // 5. Get url and parse it
    const parseUrl = url.parse(req.url);

    // 6. Get path
    const path = parseUrl.pathname;

    // 7. Trim path
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // 8. Get query string as an object
    const queryStringObject = parseUrl.query;

    // 9. Get HTTP method
    const method = req.method.toLowerCase();

    // 10. Get headers as an object
    const headers = req.headers;

    // 11. Get payload if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    // 12. Get payload
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    // 13. End event
    req.on('end', () => {
        buffer += decoder.end();

        // 14. Choose handler this request should go to. If one is not found, use notFound handler
        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // 15. Construct data object to send to handler
        const data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        // 16. Route the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload) => {
            // 17. Use the status code callback by the handler, or default to 200
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

            // 18. Use the payload callback by the handler, or default to {}
            payload = typeof(payload) === 'object' ? payload : {};

            // 19. Convert the payload to a string
            const payloadString = JSON.stringify(payload);

            // 20. Return the response
            res.setHeader('Content