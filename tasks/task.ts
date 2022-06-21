import {serialize} from "v8";

const fs = require("fs");
import "@nomiclabs/hardhat-web3";
import { task } from "hardhat/config";
import { TestToken__factory } from '../typechain'

task("greeter", "Greeter test", async (taskArgs,hre) => {

    const greeterFactory = await hre.ethers.getContractFactory("Greeter")
    const greeter = await greeterFactory.deploy("Hello, world!");
    console.log("greeter",greeter)
    await greeter.deployed();
    await greeter.setGreeting("牛逼坏了",{value: "你说啥"})
    const str = await greeter.greet()
    console.log("str",str)

});

task("accounts", "Prints the list of accounts", async (taskArgs,hre) => {

    const accounts = await hre.ethers.getSigners();
    for (const account of accounts) {
        console.log(account.address);
    }
});

task("qBalance", "Prints an account's balance")
    .addParam("account", "The account's address")
    .setAction(async (taskArgs, { web3 }) => {

        const account = web3.utils.toChecksumAddress(taskArgs.account);
        const balance = await web3.eth.getBalance(account);

        console.log(web3.utils.fromWei(balance, "ether"), "ETH");
    });

task("qBalanceOfERC20", "Prints an account's balance")
    .addParam("account", "The account's address")
    .addParam("token", "The token's address")
    .setAction(async (taskArgs, hre) => {

        const accounts = await hre.ethers.getSigners();
        const erc20 = await new TestToken__factory(accounts[0]).attach(taskArgs.token)

        const balance = await erc20.balanceOf(taskArgs.account)
        console.log("balance: ", balance.toString())
    });

task("mint", "Prints an account's balance")
    .addParam("account", "The account's address")
    .addParam("token", "The token's address")
    .setAction(async (taskArgs,hre) => {
        const accounts = await hre.ethers.getSigners();
        const erc20 = await new TestToken__factory(accounts[0]).attach(taskArgs.token)

        const txn = await erc20.mint(taskArgs.account, "123456789000000000000000000")

        console.log("txn hash: ",txn.hash)
    });

task("autoMint", "给批量文件地址mint", async (taskArgs, hre)=>{
    const accounts = await hre.ethers.getSigners();
    const tokenFactory = await hre.ethers.getContractFactory("TestToken")
    //qa01-0xcE64Bf1C28B544E14AEFa15f66Cf4F3A75f415Dc
    //qa02-0x2779021349908d8f268D353fF6BDf9f85071EeAc
    const erc20 = await tokenFactory.attach("0x2779021349908d8f268D353fF6BDf9f85071EeAc")
    let secrects = read_csv('./secrect02.csv')
    for (let i = 1;i<secrects.length;i++){
        await erc20.mint(secrects[i][1], "123456789000000000000000000")
        const balances = (await erc20.balanceOf(secrects[i][1])).toString()
        console.log(secrects[i][1], balances)
    }
})

task("autoQBalances", "查询1000个地址mint", async (taskArgs, hre)=>{
    const accounts = await hre.ethers.getSigners();
    const tokenFactory = await hre.ethers.getContractFactory("TestToken")
    const erc20 = await tokenFactory.attach("0x2779021349908d8f268D353fF6BDf9f85071EeAc")

    let secrects = read_csv('./secrect02.csv')
    for (let i = 1;i<secrects.length;i++){
        const balances = (await erc20.balanceOf(secrects[i][1])).toString()
        console.log(secrects[i][1], balances)
    }
})

task("autoTB","给1000个地址转入2个Tele")
    .setAction(async (taskArgs, hre) => {

        const secrects = read_csv('./secrect02.csv')
        for (let i = 1;i<secrects.length;i++){
            let tx =await hre.web3.eth.sendTransaction({
                //from:"0xD6f15EAC1Cb3B4131Ab4899a52E711e19DEeA73f",
                from:"0xD6f15EAC1Cb3B4131Ab4899a52E711e19DEeA73f",
                to:secrects[i][1],
                value:"2000000000000000000",
            })
            console.log(secrects[i][1])
        }
    });

task("getHash","获取交易信息")
    .addParam("hash", "交易hash")
    .setAction(async(taskArgs,hre)=>{
        let transaction = await hre.web3.eth.getTransaction(taskArgs.hash)
        let transactionReceipt = await hre.web3.eth.getTransactionReceipt(taskArgs.hash)
        let block = await hre.web3.eth.getBlock(transaction.blockNumber!)
        console.log("block timestamp: ", block.timestamp)
        console.log("blockHash: ", transaction.blockHash)
        console.log("blockNumber: ", transaction.blockNumber)
        console.log("receiptStatus: ", transactionReceipt.status)
        console.log("cumulativeGasUsed: ", transactionReceipt.cumulativeGasUsed)
        console.log("contractAddress: ", transactionReceipt.contractAddress)
    });

function read_csv(csvfile: any){
    let csvstr: string = fs.readFileSync(csvfile,"utf8",'r+');
    let arr: string[] = csvstr.split('\n');
    let array: any = [];
    arr.forEach(line => {
        array.push(line.split(','));
    });
    return array
}

module.exports = {};