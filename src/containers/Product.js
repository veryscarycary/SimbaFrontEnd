import React, { Component } from 'react'
import { connect } from 'react-redux'
import { default as contract } from 'truffle-contract'
import Eth from 'ethjs'
import '../style/product.css'

import { fetchBalance } from '../actions/actions_users'
import escrowJSON from '../contract_build/Escrow.json'


const transactionState = {
  PURCHASED: 1,
  SHIPPED: 2,
  COMPLETED: 3,
  CANCELLED: 4
}

class Product extends Component {
  constructor(props) {
    super(props)

    this.state = {
      logs: [],
      transactionStatus: 0,
      trackingNumber: ""
    }
  }

  // Initialization : fetching buyer & seller balance + adding event watcher
  componentWillMount() {
    this.props.fetchBalance(this.props.provider, this.props.users[1])
    this.props.fetchBalance(this.props.provider, this.props.users[2])
    this.initializeEventWatcher()
  }

  // Initialize Smart Contract Event Watcher
  initializeEventWatcher() {
    console.log('enter initializeEventWatcher')
    const escrow = contract(escrowJSON)
    escrow.setProvider(this.props.provider.eth.currentProvider)
    var _this = this;
    escrow.deployed().then(instance => {
      // Watch Purchase Event
      instance.Purchase().watch(function(error, result) {
        if (!error) {
          const newLog = `[${result.args.sender}] purchased item for ${Eth.fromWei(result.args.amount, 'ether')} ETH`
          _this.setState({logs: _this.state.logs.concat([newLog]), transactionStatus: transactionState.PURCHASED})
        } else {
          console.log("error : ", error)
        }
      })

      //Watch Shipped Event
      instance.Shipped().watch(function(error, result) {
        if (!error) {
          const newLog = `[${result.args.sender}] shipped item - Tracking Number : ${Eth.toAscii(result.args.trackingNumber)}`
          _this.setState({logs: _this.state.logs.concat([newLog]), transactionStatus: transactionState.SHIPPED})
        } else {
          console.log("error : ", error)
        }
      })

      //Watch Shipped Event
      instance.PurchaseConfirmation().watch(function(error, result) {
        if (!error) {
          const newLog = `[${result.args.sender}] confirms receiving item. The transaction is complete.`
          _this.setState({logs: _this.state.logs.concat([newLog]), transactionStatus: transactionState.COMPLETED})
        } else {
          console.log("error : ", error)
        }
      })

      //Watch Shipped Event
      instance.CancelPurchase().watch(function(error, result) {
        if (!error) {
          const newLog = `[${result.args.sender}] cancel his purchase.`
          _this.setState({logs: _this.state.logs.concat([newLog]), transactionStatus: transactionState.CANCELLED})
        } else {
          console.log("error : ", error)
        }
      })
    })
  }

  purchase() {
    console.log('enter purchase')
    const escrow = contract(escrowJSON)
    escrow.setProvider(this.props.provider.eth.currentProvider)

    this.props.provider.eth.accounts().then((accounts) => {
      escrow.deployed().then(instance => {
        instance.purchase.sendTransaction({from: accounts[0], value: Eth.toWei(0.1, 'ether')})
      })
    });
  }

  submitTrackingNumber(event) {
    event.preventDefault();
    console.log('enter submitTrackingNumber ', this.state.trackingNumber)
    const escrow = contract(escrowJSON)
    escrow.setProvider(this.props.provider.eth.currentProvider)

    this.props.provider.eth.accounts().then((accounts) => {
      escrow.deployed().then(instance => {
        instance.setTrackingNumber(this.state.trackingNumber, {from: accounts[0]})
      })
    });
  }

  renderShippingForm() {
    if (this.state.transactionStatus != transactionState.PURCHASED) {
      return <div></div>
    }
    return (
      <div className='shipping'>
        <hr/>
        <h4>Tracking Number</h4>
        <form className="form-inline">
          <div className="form-group">
            <input onChange={(event) => this.setState({trackingNumber: event.target.value})}
                   type="text"
                   value={this.state.trackingNumber}
                   className="form-control" />
          </div>
          <button type='submit' className='btn btn-default' onClick={(event) => this.submitTrackingNumber(event)}>
            SEND
          </button>
        </form>
      </div>
    )
  }

  confirmPurchase() {
    console.log('enter confirmPurchase')
    const escrow = contract(escrowJSON)
    escrow.setProvider(this.props.provider.eth.currentProvider)

    this.props.provider.eth.accounts().then((accounts) => {
      escrow.deployed().then(instance => {
        instance.confirmPurchase({from: accounts[0]})
      })
    });
  }

  renderConfirmationButton() {
    if (this.state.transactionStatus != transactionState.SHIPPED) {
      return <div></div>
    }
    return (
      <div className='purchase-confirmation'>
        <hr/>
        <h4>Purchase Confirmation</h4>
        <button className='btn btn-default' onClick={() => this.confirmPurchase()}>
          I received my Item
        </button>
      </div>
    )
  }

  renderLog() {
    const logs = this.state.logs.map((log, index) => {
      return <tr key={index}><td>{log}</td></tr>
    })
    return logs
  }

  render() {
    console.log('Product props : ', this.props)

    return (
      <div className='pure-g product'>
        <div className='pure-u-1-3'>
          <h3>SELLER <span className="text-success">{this.props.users[1].name}</span></h3>
          <img className='img-person' src='https://images.vexels.com/media/users/3/129416/isolated/preview/c9edfcc13c2b6d5d9ceb21902ba54b04-black-man-cartoon-head-1-by-vexels.png' alt='Buyer Guy'/>
          <p><span className='highlight'>Wallet Address</span> : {this.props.users[1].wallet} </p>
          <p><span className='highlight'>Balance :</span> {this.props.users[1].balance} <span className="label label-success">ETH</span></p>
          <button className='btn btn-primary' onClick={() => this.props.fetchBalance(this.props.provider, this.props.users[1])}>
            Update Balance
          </button>
          { this.renderShippingForm() }
        </div>
        <div className='pure-u-1-3'>
          <div className="thumbnail">
            <img src="https://www.ledgerwallet.com/images/products/lns/ledger-nano-s-large.png" alt='Nano Ledger S' />
            <div className="caption">
              <h3>Nano Ledger S (0.1 ETH)</h3>
              <p className="text-muted">Ledger Nano S is a Bitcoin, Ethereum and Altcoins hardware wallet, based on robust safety features for storing cryptographic assets and securing digital payments.</p>
              <p>
                <button className='btn btn-success' onClick={() => this.purchase()}>Buy</button>
              </p>
            </div>
          </div>
          <table className='table table-striped'>
            <thead>
              <tr>
                <th>Logs</th>
              </tr>
            </thead>
            <tbody>
              {this.renderLog()}
            </tbody>
          </table>
        </div>
        <div className='pure-u-1-3'>
          <h3>BUYER <span className="text-success">{this.props.users[2].name}</span></h3>
          <img className='img-person' src='https://images.vexels.com/media/users/3/130527/isolated/preview/845f79841ea58765d623a68bf434d5ed-girl-cartoon-head-character-by-vexels.png' alt='Seller Girl' />
          <p><span className='highlight'>Wallet Address :</span> {this.props.users[2].wallet} </p>
          <p><span className='highlight'>Balance :</span> {this.props.users[2].balance } <span className="label label-success">ETH</span></p>
          <button className='btn btn-primary' onClick={() => this.props.fetchBalance(this.props.provider, this.props.users[2])}>
            Update Balance
          </button>
          { this.renderConfirmationButton() }
        </div>
      </div>
    )
  }
}

function mapStateToProps({ provider, users }) {
  return { provider, users }
}

export default connect(mapStateToProps, { fetchBalance })(Product)
