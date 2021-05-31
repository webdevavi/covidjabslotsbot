module.exports = {
  apps: [
    {
      name: "covidjabslotsbot",
      script: "out/index.js",
      instances: 1,
      env: {
        PORT: 3000,
        NODE_ENV: "production",
      },
    },
  ],
}
