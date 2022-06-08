import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "./tasks/task"

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("accounts01", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.11",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    teleport:{
      url: "https://evm-rpc2.qa.davionlabs.com/",
      //url: "https://teleport-localvalidator.qa.davionlabs.com/",
      gasPrice: 5000000000,
      chainId: 7001,
      gas: 4100000,
      accounts:[
          //sys
          //"8f14df1da1a318bec99800b72c5031e4fdc4ec017f00ab9659339ecb0193120e"
        '7eefd641410560e690736ee331bd32512c9b58419a877eff2189facbef33cd1e'
      ]
    },
    qaNew: {//0x40429f9578811b7ca3A1E806784BbDD50A9A3b5b
      url: 'http://10.41.20.51:8545',
      gasPrice: 5000000000,
      chainId: 7001,
      gas: 4100000,
      accounts:['7eefd641410560e690736ee331bd32512c9b58419a877eff2189facbef33cd1e']
    },
    teleportTest: {
      url: 'https://dataseed.testnet.teleport.network',
      gasPrice: 5000000000,
      chainId: 8001,
      gas: 4100000,
      accounts:['7eefd641410560e690736ee331bd32512c9b58419a877eff2189facbef33cd1e']
    },
    localhost: {
      url: 'http://localhost:8545',
      gasPrice: 2000000000,
      chainId: 1337,
      gas: 4100000,
    },
    rinkeby: {//0xcE64Bf1C28B544E14AEFa15f66Cf4F3A75f415Dc
      url: 'https://rinkeby.infura.io/v3/023f2af0f670457d9c4ea9cb524f0810',
      gasPrice: 1500000000,
      chainId: 4,
      gas: 4100000,
      accounts:['7eefd641410560e690736ee331bd32512c9b58419a877eff2189facbef33cd1e']
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
