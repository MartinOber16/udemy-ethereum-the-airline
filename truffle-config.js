const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = 'scrap fence music urban marine wheel diamond wall wash security candy retreat';
module.exports = {
  networks: {
    development: {      
      host: 'localhost',
      port: 7545,
      network_id: '*',
      gas: 5000000
    },
    rinkeby: {      
      provider: () => new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/LtjZFi6C8XO0qkthtI7p"), // api de infura
      network_id: '4'
    }
  }
}