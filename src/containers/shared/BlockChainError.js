import React, { Component } from 'react'
import { Alert } from 'react-bootstrap'

class BlockChainError extends Component {
  render() {
    return (
      <Alert bsStyle="danger">
        <strong>Wallet couldn't be found.</strong>
        <p>To register to Simba, please make sure you are connected to an Ethereum nodes by installing Metamask plugin (Chrome/Firefox) or using Mist or Parity as your web browser.</p>
      </Alert>
    )
  }
}

export default BlockChainError
