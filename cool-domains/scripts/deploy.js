const main = async () => {
    const domainContractFactory = await hre.ethers.getContractFactory("Domains");
    const domainContract = await domainContractFactory.deploy("polygon");
    await domainContract.deployed();

    console.log("Contract deployed to:", domainContract.address);
    const domainName = "radhika";
    
    let rawPrice = await domainContract.price(domainName);
    let price = (parseInt(rawPrice, 10) / 10 ** 18).toString();
    console.log(`Price to register ${domainName}.polygon:`, price);
    let txn = await domainContract.register(domainName, { value: hre.ethers.utils.parseEther(price) });
    await txn.wait();
    console.log(`Minted domain ${domainName}.polygon`);

    txn = await domainContract.setRecord(domainName, "WAGMI!!");
    await txn.wait();
    console.log("Set record for radhika.polygon");

    const address = await domainContract.getAddress(domainName);
    console.log(`Owner of domain ${domainName}:`, address);

    const balance = await hre.ethers.provider.getBalance(domainContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();
