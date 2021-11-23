# Streamable Council NFTs
this repo is forked from the main superfluid repo, this made setting everything up much easier :)

## Relevant code
`/packages/ethereum-contracts/contracts/superapp/`

## My testing flow
start `ganache-cli`
`cd ethereum-contracts`

### Deploy Superfluid Framework Contracts
first deploy framework: 

`RELEASE_VERSION=v1 ENABLE_APP_WHITELISTING=0 NEW_TEST_RESOLVER=1 npx truffle --network development exec scripts/deploy-framework.js`

run the export statement it spits out

then deploy erc20: 
`npx truffle --network development exec scripts/deploy-test-token.js : TEL`

finally deploy supertoken:
```
RELEASE_VERSION=v1 npx truffle --network development \
exec scripts/deploy-unlisted-super-token.js : \
<ADDRESS OF ERC20 DEPLOYED IN LAST STEP> \
SuperTEL \
TELx
```

### Start testing
tests file: `/packages/ethereum-contracts/scenarios/streamableCouncil.js`

fill in `tokenAddress, superTokenAddress, superFluidAddress, cfaAddress` constants using the output of the above commands

to fill in `superAppAddress`, deploy a new version of `StreamableCouncilNFT.sol`. Go into the tests file, and comment out the return statment in the `deploy superapp` block. Then take the address printed and set `superAppAddress`. re-comment the return statement.

now you may edit the test file as you like. comment/uncomment return statements in `it` blocks to run or not run certain parts of the test. The test will always take a snapshot at the start and revert to it at the end.

you can move the `it` blocks around to test events in different orders.