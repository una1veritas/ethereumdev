module.exports = {
  networks: {
    localhost: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 3000000
    },
    raspi4: {
      host: "192.168.1.143",
      port: 8545,
      network_id: "*",
	gas: 3000000
    },
    ropsten: {
        network_id: 3,
        host: "localhost",
        from: "<<Address is usually here>>",
        port: 8545,
        gas: 2900000
    }
  }
};
