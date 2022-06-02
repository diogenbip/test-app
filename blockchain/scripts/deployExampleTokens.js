// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const {ethers} = require("hardhat");

const toWei = (val) => ethers.utils.parseEther(val.toString())

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');

    // We get the contract to deploy
    const ExampleTok1 = await hre.ethers.getContractFactory("Token1");
    const exampleTok1 = await ExampleTok1.deploy('Tok1','TKN1',toWei(0));

    await exampleTok1.deployed();

    const ExampleTok2 = await hre.ethers.getContractFactory("Token2");
    const exampleTok2 = await ExampleTok2.deploy('Tok2','TKN2',toWei(0));

    await exampleTok2.deployed();

    const Dex = await hre.ethers.getContractFactory("Dex");

    const dex = await Dex.deploy();

    await dex.deployed();

    console.log("Dex deployed to:", dex.address);


    console.log("ExampleTok1 deployed to:", exampleTok1.address);
    console.log("ExampleTok2 deployed to:", exampleTok2.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
