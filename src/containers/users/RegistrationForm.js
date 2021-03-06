import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input } from 'formsy-react-components'
import { Link } from 'react-router-dom'

import BlockChainError from '../shared/BlockChainError'
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
      password_confirmation: '',
      submitting: false,
    }
  }

  handleChange(name, value) {
    this.setState({[name]: value})
  }

  submit(model) {
    var user_params = { user: { ...this.state, wallet: this.props.current_user.wallet } }

    this.setState({ submitting: true })

    this.props.userRegistration(user_params)
      .then(
        () => {
          this.setState({ submitting: false })
          this.props.history.push(this.props.nextRoute)
        }
      )
  }

  renderForm() {
    const disabled = this.state.submitting || !this.props.current_user.wallet

    return (
      <Form layout='vertical' onValidSubmit={this.submit.bind(this)}>
        <Input
          label='Wallet'
          value={this.props.current_user.wallet}
          name='wallet'
          type='text'
          onChange={this.handleChange.bind(this)}
          required
          disabled
        />

        <Input
          label='First Name'
          value={this.state.first_name}
          name='first_name'
          type='text'
          onChange={this.handleChange.bind(this)}
          disabled={disabled}
          required
        />

        <Input
          label='Last Name'
          value={this.state.last_name}
          name='last_name'
          type='text'
          onChange={this.handleChange.bind(this)}
          required
          disabled={disabled}
        />

        <Input
          label='Email'
          value={this.state.email}
          name='email'
          type='email'
          onChange={this.handleChange.bind(this)}
          disabled={disabled}
          required
        />

        <Input
          label='Password'
          value={this.state.password}
          name='password'
          type='password'
          onChange={this.handleChange.bind(this)}
          required
          disabled={disabled}
        />

        <Input
          label='Password Confirmation'
          value={this.state.password_confirmation}
          name='password_confirmation'
          type='password'
          onChange={this.handleChange.bind(this)}
          required
          disabled={disabled}
        />

        <div className="checkbox">
          <label>
            <input type="checkbox" /> I've read & agree with the <a href="/">Terms</a>.
          </label>
        </div>

        <div className="form-action">
          <button type="submit" className="btn-shadow btn-shadow-dark" disabled={disabled}>Create account</button>
        </div>

        <div className="form-bottom">
          Already have an account? <Link to='/users/sign_in' className="account">Sign in</Link>
        </div>
      </Form>
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

                { !this.props.current_user.wallet && <BlockChainError /> }
                { this.renderForm() }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { current_user: current_user(state) }
}

export default withNextRoute(connect(mapStateToProps, { userRegistration })(RegistrationForm))

