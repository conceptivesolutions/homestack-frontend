import Cors from 'cors'
import {runMiddleware} from "helpers/runMiddleware";
import * as http from "http";
import {createProxyMiddleware} from "http-proxy-middleware";
import {NextApiRequest, NextApiResponse} from "next";

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'POST']
})

// Create proxy instance outside of request handler function to avoid unnecessary re-creation
const apiProxy = createProxyMiddleware({
  target: process.env.AUTH_TARGET,
  pathRewrite: {
    '^/api/auth': '/api'
  },
  changeOrigin: true,
  logLevel: "warn",
  onProxyReq(proxyReq: http.ClientRequest, req: any)
  {
    if (!req.body || !Object.keys(req.body).length)
      return;

    const bodyData = JSON.stringify({
      ...req.body,
      "applicationId": process.env.AUTH_APPLICATIONID,
      "noJWT": false,
    });
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.setHeader('Content-Type', "application/json")
    proxyReq.write(bodyData);
  },
});

async function handler(req: NextApiRequest, res: NextApiResponse)
{
  await runMiddleware(req, res, cors)
  await runMiddleware(req, res, apiProxy)
}

// noinspection JSUnusedGlobalSymbols
export default handler

// noinspection JSUnusedGlobalSymbols
export const config = {
  api: {
    bodyParser: true, // enable POST requests
    externalResolver: true, // hide warning message
  },
}
