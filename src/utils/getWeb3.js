import Web3 from 'web3'

let getWeb3 = new Promise(function(resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function() {
    var results

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      console.warn("Using web3 detected from external source like Metamask")
      results = {
        web3: new Web3(window.web3.currentProvider)
      }
      resolve(results)
    } else {
      // Fallback to localhost if no web3 injection.
      console.log('No web3 instance injected, using Local web3.');
      var provider = new Web3.providers.HttpProvider('http://localhost:8545')
      results = {
        web3: new Web3(provider)
      }
      resolve(results)
    }
  })
})

export default getWeb3
