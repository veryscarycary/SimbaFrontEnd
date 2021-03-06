const SIMBA_TOKEN_KEY = 'simba_token'
const WALLET_TOKEN_KEY = 'simba_wallet'

class Auth {
  constructor() {
    this.token = JSON.parse(localStorage.getItem(SIMBA_TOKEN_KEY))
    this.wallet = JSON.parse(localStorage.getItem(WALLET_TOKEN_KEY))
  }

  /**
   * Returns true if a token and wallet exist
   * @return {Boolean}
   */
  isLoggedIn = () => !!this.token && !!this.wallet

  /**
   * Sets the token to the local storage
   * @param  {String} token
   */
  setToken = (token) => {
    this.token = token

    localStorage.setItem(SIMBA_TOKEN_KEY, JSON.stringify(token))
  }

  /**
   * Sets the wallet to the local storage
   * @param  {String} walletId
   */
  setWallet = (wallet) => {
    this.wallet = wallet

    localStorage.setItem(WALLET_TOKEN_KEY, JSON.stringify(wallet))
  }

  /**
   * Removes the token from the local storage
   */
  deleteToken = () => {
    this.token = null

    localStorage.removeItem(SIMBA_TOKEN_KEY)
  }

  /**
   * Removes the wallet from the local storage
   */
  deleteWallet = () => {
    this.wallet = null

    localStorage.removeItem(WALLET_TOKEN_KEY)
  }

  /**
   * Removes the token and wallet from the auth system
   */
  deleteAll = () => {
    this.deleteToken()
    this.deleteWallet()
  }
}

export default new Auth()
