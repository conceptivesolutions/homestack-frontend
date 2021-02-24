const {createProxyMiddleware} = require('http-proxy-middleware');
const bodyParser = require('body-parser');

module.exports = function (app)
{
  // proxy to backend
  app.use(except("/api", "/api/auth", createProxyMiddleware({
    target: process.env.API_TARGET,
    pathRewrite: {
      '^/api': '',
    },
    changeOrigin: true,
  })));

  // parse JSON
  app.use(bodyParser.json());

  // proxy to authentication server
  app.use('/api/auth', createProxyMiddleware({
    target: process.env.AUTH_TARGET,
    pathRewrite: {
      '^/api/auth': '/',
    },
    changeOrigin: true,
    logLevel: "warn",
    onProxyReq(proxyReq, req)
    {
      if (!req.body || !Object.keys(req.body).length)
        return;

      const bodyData = JSON.stringify({
        ...req.body,
        "grant_type": "password",
        "audience": "https://api.homestack.de",
        "client_id": process.env.AUTH_APPLICATIONID,
        "scope": "openid profile email",
      });
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    },
  }));
};

/**
 * function to exclude a specific sub-url
 *
 * @param base base url
 * @param path path to exclude incl. base url
 * @param middleware middleware to execute
 */
const except = function (base, path, middleware)
{
  return function (req, res, next)
  {
    const isCorrectBaseURL = req.path.indexOf(base) === 0;
    const isExcludedPath = req.path.indexOf(path) === 0;

    if (!isCorrectBaseURL || isExcludedPath)
    {
      // Exclude
      return next();
    }
    else
    {
      // Apply for all others
      return middleware(req, res, next);
    }
  };
};
