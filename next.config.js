const withCSS = require("@zeit/next-css");
module.exports = withCSS({
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      use: {
        loader: "url-loader",
        options: {
          limit: 100000,
        },
      },
    });
    return config;
  },
  transpileModules: ["lodash-es"],
  async redirects() {
    //Temporary Redirect Index page to dashboard
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
});
