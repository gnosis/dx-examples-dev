import Web3 from 'web3'

let web3
if (typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider);
} else {
  // For this example, we just assume we get the `web3` object injected
  alert('Please, install Metamask :)')
}

export default web3
