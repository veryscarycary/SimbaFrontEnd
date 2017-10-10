import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input } from 'formsy-react-components'
import { Link } from 'react-router-dom'

import BlockChainError from '../shared/BlockChainError'
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
    const disabled = this.state.submitting || !this.props.current_user.wallet

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



  render() {
    return (
      <div className="account-page">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className='ecommerce-form'>
                <h1>
                  Log in to your account
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

export default withNextRoute(connect(mapStateToProps, { userSignIn })(SignInForm))
