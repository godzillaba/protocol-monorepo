const SuperfluidSDK = require("@superfluid-finance/js-sdk");
const TestToken = artifacts.require('TestToken')
const SuperToken = artifacts.require('SuperToken')
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

    

    it("Alice creates flow to Bob", async () => {
        // return;
        const userAlice = await sf.user({
            address: alice,
            token: superTokenAddress
        })
        // console.log((await userAlice.details()).cfa.flows.outFlows)
        // return;
        
        const flow = await userAlice.flow({
            recipient: bob,
            flowRate: '10000'//ethers.BigNumber.from(1e16+'').div(ethers.BigNumber.from(60*60*24))-0+''
        })
    })

    it("Check telx balances", async() => {
        // return;
        await timeMachine.advanceTimeAndBlock(60*60*24*7*52);
        console.log('alice', await telxContract.balanceOf(alice)-0)
        console.log('bob', await telxContract.balanceOf(bob)-0)
        console.log('chuck', await telxContract.balanceOf(chuck)-0)
        console.log('dave', await telxContract.balanceOf(dave)-0)
        console.log('superapp', await telxContract.balanceOf(tcfAddress)-0)
    })

    it("bob creates flow to chuck", async () => {
        // return;
        const userAlice = await sf.user({
            address: bob,
            token: superTokenAddress
        })
        // console.log((await userAlice.details()).cfa.flows.outFlows)
        // return;
        
        const flow = await userAlice.flow({
            recipient: chuck,
            flowRate: '1'//ethers.BigNumber.from(1e16+'').div(ethers.BigNumber.from(60*60*24))-0+''
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

    it("Check telx balances", async() => {
        return;
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