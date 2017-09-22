import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Form, Input, Textarea, Select } from 'formsy-react-components'
import { Tabs, Tab } from 'react-bootstrap-tabs'

import { fetchAllUsers } from '../../actions/actions_users'

import '../../style/user-profile.css'

class UserProfile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      wallet: '',
      first_name: '',
      last_name: '',
      email: '',
      address: '',
      postal_code: '',
      city: '',
      country: '',
      us_state: ''
    }
  }

  componentWillMount() {
    //this.props.fetchAllUsers()
  }

  handleChange(name, value) {
    this.setState({[name]: value})
  }

  submit(model) {
    //this.props.sendCode(this.props.purchase.id, this.state.shippingNumber, this.props.provider)
  }


  renderInformationForm() {
    const countryOptions = [
      {value: '', label: ' '},
      {value: 'United States', label: 'United States'},
      {value: 'France', label: 'France'}
    ]

    return (
      <div className="row profile-form">
          <div className="col-md-3">
            <img src={require('../../images/default-user.png')} className="avatar" alt='Default User' />
            <a href="#" className="btn-upload-avatar">
              Upload new avatar
            </a>
          </div>
          <div className="col-md-8">
            <Form layout='vertical' onValidSubmit={this.submit.bind(this)}>
              <Input
                label='Wallet'
                value={this.state.wallet}
                name='wallet'
                type='text'
                onChange={this.handleChange.bind(this)}
                required
                disabled />
              <Input
                label='First name'
                value={this.state.first_name}
                name='first_name'
                type='text'
                onChange={this.handleChange.bind(this)}
                required />
              <Input
                label='Last name'
                value={this.state.last_name}
                name='last_name'
                type='text'
                onChange={this.handleChange.bind(this)}
                required />
              <Input
                label='First name'
                value={this.state.email}
                name='email'
                type='email'
                onChange={this.handleChange.bind(this)}
                required />
              <Textarea
                label="Address"
                value={this.state.address}
                name="address"
                type="text"
                onChange={this.handleChange.bind(this)}
                rows={3} />
              <Input
                label='City'
                value={this.state.city}
                name='city'
                type='text'
                onChange={this.handleChange.bind(this)} />
              <Input
                label='Postal Code'
                value={this.state.postal_code}
                name='postal_code'
                type='text'
                onChange={this.handleChange.bind(this)} />
              <Input
                label='State'
                value={this.state.us_state}
                name='us_state'
                type='text'
                onChange={this.handleChange.bind(this)} />
              <Select
                label="Country"
                name="country"
                options={countryOptions}
                value={this.state.country}
                onChange={this.handleChange.bind(this)} />
              <button type="submit" className="btn-shadow btn-shadow-dark">Update Info</button>
            </Form>
          </div>
        </div>
    )
  }

  renderReviews() {
    return (
      <div>Reviews</div>
    )
  }

  renderTabs() {
    return (
      <div className="description">
        <Tabs>
          <Tab label="Information">
            <p> { this.renderInformationForm() } </p>
          </Tab>
          <Tab label="Reviews">
            <p> { this.renderReviews() } </p>
          </Tab>
        </Tabs>
      </div>
    )
  }

  render() {
    return (
      <div className="account-page">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item active">My profile</li>
          </ol>

          <div className="account-wrapper">
            { this.renderTabs() }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ users }) {
  return { users }
}

export default connect(mapStateToProps, { fetchAllUsers })(UserProfile)
