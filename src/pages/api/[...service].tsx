import Cors from 'cors'
import {runMiddleware} from "../../helpers/runMiddleware";
import {createProxyMiddleware} from "http-proxy-middleware";
import {NextApiRequest, NextApiResponse} from "next";

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE']
})

// Create proxy instance outside of request handler function to avoid unnecessary re-creation
const apiProxy = createProxyMiddleware({
  target: 'http://localhost:8080',
  pathRewrite: {
    '^/api': ''
  },
  changeOrigin: true,
  logLevel: "warn",
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
    bodyParser: false, // enable POST requests
    externalResolver: true, // hide warning message
  },
}
