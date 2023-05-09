module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "5777", // Match any network id
    },
    ganache: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 9545, // Standard Ganache port (default: none)
      network_id: "5777", // Any network (default: none)
      gas: 2000000000000000000
    }
  },
  compilers: {
    solc: {
      version: "0.8.9",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};