import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input } from 'formsy-react-components'
import { Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import EscrowContract from '../../services/escrow'
import { current_user } from '../../models/selectors'
import { userSignIn } from '../../actions/actions_users'
import withNextRoute from './withNextRoute'

import '../../style/sign_in.css'

class SignInForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      password: '',
      submitting: false,
    }
  }

  handleChange(name, value) {
    this.setState({[name]: value})
  }

  submit(model) {
    var user_params = { user: { password: this.state.password, wallet: this.props.current_user.wallet } }

    this.setState({ submitting: true })

    this.props.userSignIn(user_params)
      .then(
        () => {
          this.setState({ submitting: false })
          this.props.history.push(this.props.nextRoute)
        }
      )
  }

  renderForm() {
    const disabled = this.state.submitting

    return (
      <Form layout='vertical' onValidSubmit={this.submit.bind(this)}>
        <Input
          label='Wallet'
          value={this.props.current_user.wallet}
          name='email'
          type='text'
          required
          disabled
        />

        <Input
          label='Password'
          value={this.state.password}
          name='password'
          type='password'
          onChange={this.handleChange.bind(this)}
          disabled={disabled}
          required
        />

        <div className="form-action">
          <button
            type="submit"
            className="btn-shadow btn-shadow-dark"
            disabled={disabled}
          >
            {this.state.submitting ? (
              <span>Signin you in...</span>
            ) : (
              <span>Sign in</span>
            )}
          </button>
        </div>

        <div className="form-bottom">
          <a href="sign-up.html" className="btn-forgot-password">Forgot your password?</a>
          Don't have an account yet? <Link to='/users/register' className="account">Register</Link>
        </div>
      </Form>
    )
  }

  renderErrorBlockChain() {
    return (
      <Alert bsStyle="danger">
        <strong>Wallet couldn't be found.</strong>
        <p>To register to Simba, please make sure you are connected to an Ethereum nodes by installing Metamask plugin (Chrome/Firefox) or using Mist or Parity as your web browser.</p>
      </Alert>
    )
  }

  render() {
    console.log(EscrowContract.isConnected().then())
    return (
      <div className="account-page">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className='ecommerce-form'>
                <h1>
                  Log in to your account
                </h1>

                { this.renderErrorBlockChain() }
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

export default withNextRoute(connect(mapStateToProps, { userSignIn })(SignInForm))
