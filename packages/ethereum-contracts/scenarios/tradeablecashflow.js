const SuperfluidSDK = require("@superfluid-finance/js-sdk");
const TestToken = artifacts.require('TestToken')
const SuperToken = artifacts.require('SuperToken')
const TradeableCashflow = artifacts.require('TradeableCashflow')
const ethers = require('ethers')
const timeMachine = require('ganache-time-traveler');

contract("Scenario: Bob flows to Alice", (accounts) => {
    const tokenAddress = '0x52338E8CFf619b9dC5AEd1FD0751D2E560f49bBB';
    const superTokenAddress = '0x55D77E4307A9Df1D9af4499D62251130e21F0A1A';
    const superFluidAddress = '0xb56cfb24Bf3E54f1A267858aDA2B1b64B9F65193';
    const cfaAddress = '0x0245FD96803FB2172F7Fd40e1340a625B722b26E';
    const tcfAddress = '0xae721976396923beCeBfE79dD6AbAf1228BBeF85';

    const [, alice, bob, chuck, dave] = accounts;
    let sf;
    let telContract;
    let telxContract;

    let snapshot;

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    before(async () => {
        sf = new SuperfluidSDK.Framework({
            isTruffle: true,
            version: process.env.RELEASE_VERSION || "v1"
        });
        
        await sf.initialize();
        console.log('\n\n');
        
        telContract = await TestToken.at(tokenAddress);
        telxContract = await SuperToken.at(superTokenAddress);
        snapshot = (await timeMachine.takeSnapshot()).result;
    });

    it("deploy superapp", async () => {
        return;
        const x = await TradeableCashflow.new(bob, 'Holy Grail', 'GRAIL', superFluidAddress, cfaAddress, superTokenAddress, bob)
        console.log(x.address);
        process.exit();
    })

    it("mint nft to chuck", async () => {
        // return;
        let tradeableCashflow = await TradeableCashflow.at(tcfAddress);
        await tradeableCashflow.mint(chuck, 2, {from: chuck});
    })
    
    it("mint TEL to alice", async () => {
        return;
        await telContract.mint(alice, ethers.BigNumber.from(1e20+""))
    })

    it("Alice TEL -> TELx", async () => {
        return;
        const userAlice = await sf.user({
            address: alice,
            token: superTokenAddress
        });
        await telContract.approve(superTokenAddress, ethers.BigNumber.from(1e20+''), {from: alice})
        await telxContract.upgrade(ethers.BigNumber.from(1e19+''), {from: alice});
        
        
    })

    it("Alice creates flow to Bob", async () => {
        return;
        const userAlice = await sf.user({
            address: alice,
            token: superTokenAddress
        })
        // console.log((await userAlice.details()).cfa.flows.outFlows)
        // return;
        
        const flow = await userAlice.flow({
            recipient: bob,
            flowRate: '0'//ethers.BigNumber.from(1e16+'').div(ethers.BigNumber.from(60*60*24))-0+''
        })
        console.log(flow)
    })

    it("Alice creates flow to superapp", async () => {
        // return;
        await telxContract.transfer(tcfAddress, 1e10+'', {from: alice});
        const userAlice = await sf.user({
            address: alice,
            token: superTokenAddress
        })
        // console.log((await userAlice.details()).cfa.flows.outFlows)
        // return;
        
        const flow = await userAlice.flow({
            recipient: tcfAddress,
            flowRate: '10'//ethers.BigNumber.from(1e16+'').div(ethers.BigNumber.from(60*60*24))-0+'',

        })
    })

    

    it("Check telx balances", async() => {
        // return;
        await timeMachine.advanceTimeAndBlock(10);
        console.log('alice', await telxContract.balanceOf(alice)-0)
        console.log('bob', await telxContract.balanceOf(bob)-0)
        console.log('chuck', await telxContract.balanceOf(chuck)-0)
        console.log('dave', await telxContract.balanceOf(dave)-0)
        console.log('superapp', await telxContract.balanceOf(tcfAddress)-0)
    })

    

    it("transfer NFT from chuck to dave", async () => {
        // return;
        let tradeableCashflow = await TradeableCashflow.at(tcfAddress);
        await tradeableCashflow.transferFrom(chuck, dave, 2, {from: chuck});
    })

    

    it("check nft balance", async () => {
        return;
        let tradeableCashflow = await TradeableCashflow.at(tcfAddress);
        console.log('bob nft', await tradeableCashflow.balanceOf(bob)-0);
        console.log('chuck nft', await tradeableCashflow.balanceOf(chuck)-0);
        console.log('dave nft', await tradeableCashflow.balanceOf(dave)-0);
    })

    it("mint NFT to dave", async () => {
        return;
        let tradeableCashflow = await TradeableCashflow.at(tcfAddress);
        await tradeableCashflow.mint(alice, 3, {from: alice});
        await tradeableCashflow.transferFrom(alice, dave, 3, {from: alice});
    })

    it("Alice updates flow to superapp", async () => {
        return;
        const userAlice = await sf.user({
            address: alice,
            token: superTokenAddress
        })
        // console.log((await userAlice.details()).cfa.flows.outFlows)
        // return;
        
        const flow = await userAlice.flow({
            recipient: tcfAddress,
            flowRate: '15'//ethers.BigNumber.from(1e16+'').div(ethers.BigNumber.from(60*60*24))-0+'',

        })
    })

    it("check outflow", async() => {
        // return;
        let tradeableCashflow = await TradeableCashflow.at(tcfAddress);
        console.log('bob', await tradeableCashflow.getOutflowRate(1)-0);
        console.log('dave', await tradeableCashflow.getOutflowRate(3)-0);
    })

    it("Check telx balances", async() => {
        // return;
        await timeMachine.advanceTimeAndBlock(10);
        console.log('alice', await telxContract.balanceOf(alice)-0)
        console.log('bob', await telxContract.balanceOf(bob)-0)
        console.log('chuck', await telxContract.balanceOf(chuck)-0)
        console.log('dave', await telxContract.balanceOf(dave)-0)
        console.log('superapp', await telxContract.balanceOf(tcfAddress)-0)
    })


    after(async () => {
        // return;
        console.log('reverting', snapshot)
        await timeMachine.revertToSnapshot(snapshot);
    })

})