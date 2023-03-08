const hre = require('hardhat');

async function main() {
    // We get the contract to deploy
    const Cryptunes = await hre.ethers.getContractFactory('Cryptunes');
    const cryptunes = await Cryptunes.deploy();

    await cryptunes.deployed();
    console.log('Cryptunes deployed to:', cryptunes.address);

    await cryptunes.deployTransaction.wait(10);

    await hre.run(`verify:verify`, {
        address: cryptunes.address,
        constructorArguments: []
    });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });