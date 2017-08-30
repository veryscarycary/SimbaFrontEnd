import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input } from 'formsy-react-components'
import { Alert } from 'react-bootstrap'

import '../../style/user.css'

import { current_user } from '../../models/selectors'
import { userSignIn } from '../../actions/actions_users'
import withNextRoute from './withNextRoute'

class SignInForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      password: ''
    }
  }

  handleChange(name, value) {
    this.setState({[name]: value})
  }

  submit(model) {
    var user_params = { user: { password: this.state.password, wallet: this.props.current_user.wallet } }

    this.props.userSignIn(user_params)
      .then(() => this.props.history.push(this.props.nextRoute))
  }

  renderForm() {
    return (
      <Form layout='vertical' className='sign-in-form' onValidSubmit={this.submit.bind(this)}>
        <Input
          label='Wallet'
          value={this.props.current_user.wallet}
          name='email'
          type='text'
          required
          disabled />
        <Input
          label='Password'
          value={this.state.password}
          name='password'
          type='password'
          onChange={this.handleChange.bind(this)}
          required />
        <button className="pure-button pure-button-primary"
                type='submit'>Sign In</button>
      </Form>
    )
  }

  renderErrorBlockChain() {
    return (
      <Alert bsStyle="danger">
        <h4>Wallet couldn't be find.</h4>
        <p>To register to Simba, please make sure you are connected to an Ethereum nodes by installing Metamask plugin (Chrome/Firefox) or using Mist or Parity as your web browser.</p>
      </Alert>
    )
  }

  render() {
    return (
      <div className='pure-g user'>
        <div className='pure-u-1'>
          <h3 className='title'>Sign In</h3>
          <div className='title-divider'></div>
          { this.props.current_user.wallet ? this.renderForm() : this.renderErrorBlockChain() }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { current_user: current_user(state) }
}

export default withNextRoute(
  connect(mapStateToProps, { userSignIn })(SignInForm)
)
