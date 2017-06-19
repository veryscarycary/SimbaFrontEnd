import React, { Component } from 'react'
import { connect } from 'react-redux'

// import { fetchProducts } from './actions/actions_products'
import logo from './logo.svg'
import './App.css'

import getWeb3 from './utils/getWeb3'
import { default as contract } from 'truffle-contract'
import votingJSON from './contract_build/Voting.json'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fabVotes: '',
      web3: null
    }
  }

  componentWillMount() {
    // this.props.fetchProducts()
    getWeb3
    .then(results => {
      console.log(results)
      this.setState({
        web3: results.web3
      })
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

    voteForCandidate(name) {
    console.log('enter voteForCandidate', name)

    const contract = require('truffle-contract')
    const Voting = contract(votingJSON)
    Voting.setProvider(this.state.web3.currentProvider)

    var votingInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      Voting.deployed().then((instance) => {
        votingInstance = instance
        console.log("voteForCandidateinstance ", instance)
        votingInstance.voteForCandidate(name, {from: accounts[0]}).then((result) => {
          console.log("voteForCandidate result ", result.toString())
        })
      })
    })
  }

  totalVotesFor(name) {
    const contract = require('truffle-contract')
    const Voting = contract(votingJSON)
    Voting.setProvider(this.state.web3.currentProvider)

    var votingInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      Voting.deployed().then((instance) => {
        votingInstance = instance
        console.log("totalVoteFor instance ", instance)
        votingInstance.totalVotesFor.call(name).then((result) => {
          console.log("totalVoteFor results ", result.toString())
          this.setState({fabVotes: result.toString()})
        })
      })
    })
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p>Fab Votes : {this.state.fabVotes}</p>
        <a href="#" onClick={() => this.voteForCandidate('Fab')}>Vote</a><br />
      <a href="#" onClick={() => this.totalVotesFor('Fab')}>Fab Number of Votes</a>
      </div>
    )
  }
}

// function mapStateToProps({ products }) {
//   return { products }
// }

// export default connect(mapStateToProps, { fetchProducts })(App)
export default App
