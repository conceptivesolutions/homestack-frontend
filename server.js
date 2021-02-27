require('dotenv').config();

const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 3001;

/**
 * function to exclude a specific sub-url
 *
 * @param base base url
 * @param paths path to exclude incl. base url
 * @param middleware middleware to execute
 */
const except = function (base, paths, middleware)
{
  return function (req, res, next)
  {
    const isCorrectBaseURL = req.path.indexOf(base) === 0;
    const isExcludedPath = paths.map(pP => req.path.indexOf(pP) === 0).indexOf(true) > -1;

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


// serve build in production
app.use(express.static(path.join(__dirname, 'build')));

// serve index.html in production
app.use(except("/", ["/api", "/auth"], function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
}));

// proxy to backend
app.use("/api", createProxyMiddleware({
  target: process.env.API_TARGET,
  pathRewrite: {
    '^/api': '/',
  },
  changeOrigin: true,
}));

// parse JSON
app.use(bodyParser.json());

// proxy to authentication server
app.use('/auth', createProxyMiddleware({
  target: process.env.AUTH_TARGET,
  pathRewrite: {
    '^/auth': '/',
  },
  changeOrigin: true,
  onProxyReq(proxyReq, req)
  {
    if (!req.body || !Object.keys(req.body).length)
      return;

    const bodyData = JSON.stringify({
      ...req.body,
      "grant_type": !!req.body.refresh_token ? "refresh_token" : "password",
      "audience": "https://api.homestack.de",
      "client_id": process.env.AUTH_APPLICATIONID,
      "scope": "openid profile email offline_access",
    });
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  },
}));

app.listen(port, () => {
  console.log(`Express Backend listening on http://localhost:${port}`)
});
