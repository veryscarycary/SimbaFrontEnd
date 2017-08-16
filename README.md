Prerequesites to run this project :
1) git clone https://github.com/Simba-Market/SimbaFrontEnd.git (Front-End Interface)
2) git clone https://github.com/Simba-Market/SimbaAPI.git (Back-end)
3) cd simba-market-api && bundle install
4) cd simba-market && yarn
5) cd simba-market-api && rails s -p 3001 (if you change the port, modify the port from $ROOT_URL in simba-market/src/api_url.js)
6) cd simba-market && yarn start

Connect Simba to Ethereum blockchain :
In order to interact with Ethereum blockchain, Simba will need a provider. You have the following options :
- Light client : https://metamask.io/ (Chrome/Firefox Plugin) - Recommended
- Mist Browser : https://github.com/ethereum/mist/releases
- Parity Browser : https://github.com/paritytech/parity/releases
- Run a node locally : https://medium.com/@mvmurthy/full-stack-hello-world-voting-ethereum-dapp-tutorial-part-2-30b3d335aa1f

Once you've download of the provider/client, make sure you're connected to Ropsten Testnet network (Which is a testnet network for Ethereum Blockchain)
You will need ETH to pay for gas fee.

Create your Ethereum Wallet and send the public address to me, I'll send you some Ropsten ETH.
You can also request some here : https://www.reddit.com/r/ethdev/comments/61zdn8/if_you_need_some_ropsten_testnet_ethers/?utm_content=title&utm_medium=hot&utm_source=reddit&utm_name=ethdev
