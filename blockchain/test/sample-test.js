// const { expect } = require("chai");
// const { ethers } = require("hardhat");
//
// const BN = require("bn.js");
//
// const IERC20 = "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20";
//
// describe("Dex", async function () {
//   let accounts = await ethers.getSigners()
//
//   console.log(accounts)
//

//
//   const CALLER = accounts[0];
//
//   let tokenA;
//   let tokenB;
//
//
//   it("add liquidity and remove liquidity", async () => {
//     const Dex = await ethers.getContractFactory("Dex");
//     const dex = await Dex.deploy();
//     await dex.deployed();
//
//     let tx = await dex.addLiquidity(
//         ethers.utils.getAddress(WETH),
//         ethers.utils.getAddress(DAI),
//         10000,
//         10000,
//         {
//           from: CALLER,
//         }
//     );
//     console.log("=== add liquidity ===");
//     for (const log of tx.logs) {
//       console.log(`${log.args.message} ${log.args.val}`);
//     }
//
//     tx = await contract.removeLiquidity(tokenA.address, tokenB.address, {
//       from: CALLER,
//     });
//     console.log("=== remove liquidity ===");
//     for (const log of tx.logs) {
//       console.log(`${log.args.message} ${log.args.val}`);
//     }
//   });
// });
const {expect} = require("chai");
const {ethers} = require("hardhat");
const hre = require("hardhat");
const {address} = require("hardhat/internal/core/config/config-validation");

const ROUTER = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

const toWei = (val) => ethers.utils.parseEther(val.toString())



describe("Dex ", function () {
    let owner;
    let u1;
    let ex1;
    let ex2;
    let dex;

    beforeEach(async ()=>{
        [owner,u1] = await ethers.getSigners();
        const ExampleTok1 = await hre.ethers.getContractFactory("Token1");
         ex1 = await ExampleTok1.deploy('Tok1','TKN1',toWei(1000000));

        const ExampleTok2 = await hre.ethers.getContractFactory("Token2");
         ex2 = await ExampleTok2.deploy('Tok2','TKN2',toWei(1000000));

        const Dex = await ethers.getContractFactory("Dex");
        dex =  await Dex.deploy();
    })

    it("Deployment should assign the total supply of tokens to the owner", async function () {
        console.log((await ethers.provider.getBalance(ex1.address)))
        expect(await dex.deployed()).to.equal(dex)
    });

    describe("add and remove liquidity", async () => {
        it("adds liquidity", async () => {
            await ex1.approve(dex.address, toWei(2));
            await ex2.approve(dex.address, toWei(1));
            let tx = await dex.addLiquidity(
                ex1.address,
                ex2.address,
                toWei(0.005),
                toWei(0.002),
                {
                    from: owner.address,
                }
            );

            await dex.removeLiquidity(
                ex1.address,
                ex2.address,
                {
                    from: owner.address,
                }
            );
        });
    });
    //     //  const g_p =ethers.utils.hexlify(parseInt(await ethers.getDefaultProvider().getGasPrice()))
    //     // //
    //     // await owner.sendTransaction({
    //     //     from:owner.address,
    //     //     to:exampleTok1.address,
    //     //     value:ethers.utils.parseEther('1'),
    //     //     gasLimit:"0x100000",
    //     //     gasPrice:g_p
    //     // })
    //     // await owner.sendTransaction({
    //     //     from:owner.address,
    //     //     to:exampleTok2.address,
    //     //     value:ethers.utils.parseEther('1'),
    //     //     gasLimit:"0x100000",
    //     //     gasPrice:await ethers.getDefaultProvider().getGasPrice()
    //     // })
    //
    //     // await exampleTok1.transfer(dex.address, 10);
    //     // await exampleTok2.transfer(dex.address, 10);
    //
    //     //
    //     //
    //     // // await exampleTok1.approve(hardhatToken.address,1000)
    //     // // await exampleTok2.approve(hardhatToken.address,1000)
    //     await exampleTok1.approve(dex.address,ethers.utils.parseEther('1'))
    //     await exampleTok2.approve(dex.address, ethers.utils.parseEther('1'))
    //
    //
    //
    //
    //     // console.log(owner.address)
    //     //
    //     await exampleTok1.balanceOf((dex.address)).then(function (res) {
    //         console.log(res.toNumber())
    //     })
    //     await exampleTok2.balanceOf((dex.address)).then(function (res) {
    //         console.log(res.toNumber())
    //     })
    //     //
    //     // await exampleTok2.balanceOf((owner.address)).then(function (res) {
    //     //     console.log(res.toNumber())
    //     // })
    //     //
    //     // await owner.getBalance().then(function (res){
    //     //     console.log(res)
    //     // })
    //     // //
    //     // // await owner.sendTransaction({
    //     // //     from: exampleTok1.address,
    //     // //     to: ethers.utils.getAddress('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'),
    //     // //     value: ethers.utils.parseEther('100')
    //     // // }).then((transaction) => {
    //     // //   console.log("Fin")
    //     // // });
    //     // //
    //     // // await owner.sendTransaction({
    //     // //     from: exampleTok2.address,
    //     // //     to: ethers.utils.getAddress('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'),
    //     // //     value: ethers.utils.parseEther('100')
    //     // // });
    //     // //
    //     // //
    //     // //
    //     // // await exampleTok1.transfer(owner, ET_AMT, {from: WLLT});
    //     // // await exampleTok2.transfer(owner, ET_AMT, {from: WLLT});
    //     // //
    //     // await exampleTok1.approve(hardhatToken.address, ET_AMT, {from: owner});
    //     // await exampleTok2.approve(hardhatToken.address, ET_AMT, {from: owner});
    //     //
    //     //
    //     // await hardhatToken.addLiquidity(
    //     //     exampleTok1.address,
    //     //     exampleTok2.address,
    //     //     10,
    //     //     10,
    //     //     {
    //     //         from: owner.address,
    //     //     }
    //     // );
    // });
});
