import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Input, Textarea, Select } from 'formsy-react-components'
import { Tabs, Tab } from 'react-bootstrap-tabs'

import '../../style/user-profile.css'

class UserProfile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      first_name: props.currentUser.first_name,
      last_name: props.currentUser.last_name,
      email: props.currentUser.email,
      address: props.currentUser.address,
      postal_code: props.currentUser.postal_code,
      city: props.currentUser.city,
      country: props.currentUser.country,
      us_state: props.currentUser.us_state
    }
  }

  handleChange(name, value) {
    this.setState({[name]: value})
  }

  submit(data) {
    this.props.onSubmit(data)
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
                value={this.props.currentUser.wallet || ''}
                name='wallet'
                type='text'
                onChange={this.handleChange.bind(this)}
                required
                disabled />
              <Input
                label='First name'
                value={this.state.first_name || ''}
                name='first_name'
                type='text'
                onChange={this.handleChange.bind(this)}
                required />
              <Input
                label='Last name'
                value={this.state.last_name || ''}
                name='last_name'
                type='text'
                onChange={this.handleChange.bind(this)}
                required />
              <Input
                label='First name'
                value={this.state.email || ''}
                name='email'
                type='email'
                onChange={this.handleChange.bind(this)}
                required />
              <Textarea
                label="Address"
                value={this.state.address || ''}
                name="address"
                type="text"
                onChange={this.handleChange.bind(this)}
                rows={3} />
              <Input
                label='City'
                value={this.state.city || ''}
                name='city'
                type='text'
                onChange={this.handleChange.bind(this)} />
              <Input
                label='Postal Code'
                value={this.state.postal_code || ''}
                name='postal_code'
                type='text'
                onChange={this.handleChange.bind(this)} />
              <Input
                label='State'
                value={this.state.us_state || ''}
                name='us_state'
                type='text'
                onChange={this.handleChange.bind(this)} />
              <Select
                label="Country"
                name="country"
                options={countryOptions}
                value={this.state.country || ''}
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
            { this.renderInformationForm() }
          </Tab>
          <Tab label="Reviews">
            { this.renderReviews() }
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

export default UserProfile
