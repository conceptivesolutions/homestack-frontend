const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app)
{
  // proxy to authentication server
  app.use('/api/auth', createProxyMiddleware({
    target: process.env.AUTH_TARGET,
    pathRewrite: {
      '^/api/auth': '/api'
    },
    changeOrigin: true,
    logLevel: "warn",
    onProxyReq(proxyReq, req)
    {
      if (!req.body || !Object.keys(req.body).length)
        return;

      const bodyData = JSON.stringify({
        ...req.body,
        "applicationId": process.env.AUTH_APPLICATIONID,
        "noJWT": false,
      });
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    },
  }))

  // proxy to backend
  app.use('/api', createProxyMiddleware({
    target: process.env.API_TARGET,
    changeOrigin: true,
  }));
};
