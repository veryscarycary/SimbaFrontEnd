import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

// import { fetchProducts } from './actions/actions_products'
import logo from './logo.svg'
import './App.css'
import Product from './containers/Product'
import { fetchProvider } from './actions/actions_provider'

class App extends Component {
  componentWillMount() {
    this.props.fetchProvider()
  }

    // voteForCandidate(name) {
    // console.log('enter voteForCandidate', name)

    // const contract = require('truffle-contract')
    // const Voting = contract(votingJSON)
    // Voting.setProvider(this.state.web3.currentProvider)

    // var votingInstance

    // // Get accounts.
    // this.state.web3.eth.getAccounts((error, accounts) => {
    //   Voting.deployed().then((instance) => {
    //     votingInstance = instance
    //     console.log("voteForCandidateinstance ", instance)
    //     votingInstance.voteForCandidate(name, {from: accounts[0]}).then((result) => {
    //       console.log("voteForCandidate result ", result.toString())
    //     })
    //   })
    // })
  // }

  // totalVotesFor(name) {
  //   const contract = require('truffle-contract')
  //   const Voting = contract(votingJSON)
  //   Voting.setProvider(this.state.web3.currentProvider)

  //   var votingInstance

  //   // Get accounts.
  //   this.state.web3.eth.getAccounts((error, accounts) => {
  //     Voting.deployed().then((instance) => {
  //       votingInstance = instance
  //       console.log("totalVoteFor instance ", instance)
  //       votingInstance.totalVotesFor.call(name).then((result) => {
  //         console.log("totalVoteFor results ", result.toString())
  //         this.setState({fabVotes: result.toString()})
  //       })
  //     })
  //   })
  // }

  render() {
    return (
      <div className="App">
        <Helmet>
          <meta charSet="utf-8" />
          <title>SIMBA</title>
          <link rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/pure-min.css" integrity="sha384-nn4HPE8lTHyVtfCBi5yW9d20FjT8BJwUXyWZT9InLYax14RDjBj46LmSztkmNP9w" crossorigin="anonymous" />
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous" />
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous" />
          <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
        </Helmet>
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>SIMBA<br /><small>Secure Independent Marketplace By All</small></h2>
        </div>
        { this.props.provider.eth ? <Product /> : ''}

      </div>
    )
  }
}

function mapStateToProps({ provider }) {
  return { provider }
}

export default connect(mapStateToProps, { fetchProvider })(App)

