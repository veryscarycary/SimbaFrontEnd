import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input } from 'formsy-react-components'
import { Alert } from 'react-bootstrap'

import '../../style/user.css'
import { userRegistration } from '../../actions/actions_users'
import { current_user } from '../../models/selectors'
import withNextRoute from './withNextRoute'

class RegistrationForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      password_confirmation: ''
    }
  }

  handleChange(name, value) {
    this.setState({[name]: value})
  }

  submit(model) {
    var user_params = { user: { ...this.state, wallet: this.props.current_user.wallet } }

    this.props.userRegistration(user_params)
      .then(() => this.props.history.push(this.props.nextRoute))
  }

  renderForm() {
    return (
      <Form layout='vertical' className='register-form' onValidSubmit={this.submit.bind(this)}>
        <div className='pure-g'>
          <div className='pure-u-1 pure-u-md-1-2'>
            <Input
              label='Wallet'
              value={this.props.current_user.wallet}
              name='wallet'
              type='text'
              onChange={this.handleChange.bind(this)}
              required
              disabled />
          </div>
          <div className='pure-u-1 pure-u-md-1-2'>
            <Input
              label='Email'
              value={this.state.email}
              name='email'
              type='email'
              onChange={this.handleChange.bind(this)}
              required />
          </div>
          <div className='pure-u-1 pure-u-md-1-2'>
            <Input
              label='First Name'
              value={this.state.first_name}
              name='first_name'
              type='text'
              onChange={this.handleChange.bind(this)}
              required />
          </div>
          <div className='pure-u-1 pure-u-md-1-2'>
            <Input
              label='Last Name'
              value={this.state.last_name}
              name='last_name'
              type='text'
              onChange={this.handleChange.bind(this)}
              required />
          </div>
          <div className='pure-u-1 pure-u-md-1-2'>
            <Input
              label='Password'
              value={this.state.password}
              name='password'
              type='password'
              onChange={this.handleChange.bind(this)}
              required />
          </div>
          <div className='pure-u-1 pure-u-md-1-2'>
            <Input
              label='Password Confirmation'
              value={this.state.password_confirmation}
              name='password_confirmation'
              type='password'
              onChange={this.handleChange.bind(this)}
              required />
          </div>
        </div>
        <button className="pure-button pure-button-primary"
              type='submit'>Create Account</button>
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
      <div className='user'>
        <h3 className='title'>Register</h3>
        <div className='title-divider'></div>
        { this.props.current_user.wallet ? this.renderForm() : this.renderErrorBlockChain() }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { current_user: current_user(state) }
}

export default withNextRoute(
  connect(mapStateToProps, { userRegistration })(RegistrationForm)
)
