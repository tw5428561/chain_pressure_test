import {serialize} from "v8";

const fs = require("fs");
import "@nomiclabs/hardhat-web3";
import { task } from "hardhat/config";
import { TestToken__factory } from '../typechain'

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
    //qa02-0x40429f9578811b7ca3A1E806784BbDD50A9A3b5b
    const erc20 = await tokenFactory.attach("0x40429f9578811b7ca3A1E806784BbDD50A9A3b5b")
    let secrects = read_csv('./err.csv')
    for (let i = 1;i<secrects.length;i++){
        await erc20.mint(secrects[i][1], "123456789000000000000000000")
        const balances = (await erc20.balanceOf(secrects[i][1])).toString()
        console.log(secrects[i][1], balances)
    }
})

task("autoQBalances", "查询1000个地址mint", async (taskArgs, hre)=>{
    const accounts = await hre.ethers.getSigners();
    const tokenFactory = await hre.ethers.getContractFactory("TestToken")
    const erc20 = await tokenFactory.attach("0x40429f9578811b7ca3A1E806784BbDD50A9A3b5b")

    let secrects = read_csv('./secrect.csv')
    for (let i = 1;i<secrects.length;i++){
        const balances = (await erc20.balanceOf(secrects[i][1])).toString()
        console.log(secrects[i][1], balances)
    }
})

task("autoTB","给1000个地址转入2个Tele")
    .setAction(async (taskArgs, hre) => {

        const secrects = read_csv('./secrect.csv')
        for (let i = 1;i<secrects.length;i++){
            let tx =await hre.web3.eth.sendTransaction({
                from:"0xD6f15EAC1Cb3B4131Ab4899a52E711e19DEeA73f",
                to:secrects[i][1],
                value:"4000000000000000000",
            })
            console.log(tx.transactionHash)
        }
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