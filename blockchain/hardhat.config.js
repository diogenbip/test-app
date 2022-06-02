require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

let secret = require('./secret.json');
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.6.6"
      },
      {
        version: "0.8.4",
        settings: {},
      },
    ],
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    goerli: {
      url: "https://goerli.infura.io/v3/a583b0739f954c63ad525ce0dba0ee50", //Infura url with projectId
      accounts: ["df57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e"] // add the account that will deploy the contract (private key)
    },
    hardhat: {
      forking: {
        url: "https://eth-mainnet.alchemyapi.io/v2/bG3f57WXBuxyUpyl0f5UzZegDW9IgwdQ",
      }
    },
    testnet: {
      url: secret.url,
      accounts: [secret.key]
    },
  },
};
