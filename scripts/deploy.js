const hre = require('hardhat');

const main = async () => {
    const RBAC = await hre.ethers.getContractFactory("RBAC");
    const rbac = await RBAC.deploy();

    await rbac.deployed();

    console.log(
        `contract deployed at ${rbac.address}`
    )
}
main().catch(error => {
    console.error(error);
    process.exitCode = 1;
})