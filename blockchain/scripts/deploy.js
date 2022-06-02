const hre = require("hardhat");


async function main() {

    const Dex = await hre.ethers.getContractFactory("Dex");
    const dex = await Dex.deploy();

    await dex.deployed();

    console.log("Dex deployed to:", dex.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
