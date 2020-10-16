const dev = {
  auth: {
    DOMAIN: "conceptive-netplan.eu.auth0.com",
    CLIENTID: "SGdbbMKGh2L98SZoH9n57bLm6VqYKQj8",
    APIID: "netplan/backend-rest",
  }
};

const prod = {
  auth: {
    DOMAIN: "conceptive-netplan.eu.auth0.com",
    CLIENTID: "D8WLTbxZ27184p5qHs7wK1nWXzWKGcdl",
    APIID: "netplan/backend-rest",
  }
};

const config = process.env.NODE_ENV === 'production' ? prod : dev;

export default {
  // Add common config values here
  ...config
};
