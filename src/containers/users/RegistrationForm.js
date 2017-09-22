import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input } from 'formsy-react-components'
import { Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { userRegistration } from '../../actions/actions_users'
import { current_user } from '../../models/selectors'
import withNextRoute from './withNextRoute'

import '../../style/registration.css'

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

    this.props.userRegistration(this.props.provider, user_params)
      .then(() => this.props.history.push(this.props.nextRoute))
  }

  renderForm() {
    return (
      <Form layout='vertical' onValidSubmit={this.submit.bind(this)}>
        <Input
          label='Wallet'
          value={this.props.current_user.wallet}
          name='wallet'
          type='text'
          onChange={this.handleChange.bind(this)}
          required
          disabled />
        <Input
          label='Email'
          value={this.state.email}
          name='email'
          type='email'
          onChange={this.handleChange.bind(this)}
          required />
        <Input
          label='First Name'
          value={this.state.first_name}
          name='first_name'
          type='text'
          onChange={this.handleChange.bind(this)}
          required />
        <Input
          label='Last Name'
          value={this.state.last_name}
          name='last_name'
          type='text'
          onChange={this.handleChange.bind(this)}
          required />
        <Input
          label='Password'
          value={this.state.password}
          name='password'
          type='password'
          onChange={this.handleChange.bind(this)}
          required />
        <Input
          label='Password Confirmation'
          value={this.state.password_confirmation}
          name='password_confirmation'
          type='password'
          onChange={this.handleChange.bind(this)}
          required />
        <div className="checkbox">
          <label>
            <input type="checkbox" /> I've read & agree with the <a href="/">Terms</a>.
          </label>
        </div>
        <div className="form-action">
          <button type="submit" className="btn-shadow btn-shadow-dark">Create account</button>
        </div>
        <div className="form-bottom">
          Already have an account? <Link to='/users/sign_in' className="account">Sign in</Link>
        </div>
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
      <div className="account-page">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="ecommerce-form">
                <h1>
                  Create your account
                </h1>
                { this.props.provider.isConnected ? this.renderForm() : this.renderErrorBlockChain() }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { current_user: current_user(state), provider: state.provider }
}

export default withNextRoute(
  connect(mapStateToProps, { userRegistration })(RegistrationForm)
)
