import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getUserProfile, updateUserProfile } from '../../actions/actions_users'
import Auth from '../../services/auth'

import { current_user } from '../../models/selectors'
import UserProfile from '../../components/UserProfile/UserProfile'

class UserProfileContainer extends Component {
  componentWillMount() {
    this.props.getUserProfile(Auth.wallet, true)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.current_user) {
      this.setState({first_name: nextProps.current_user.first_name})
      this.setState({last_name: nextProps.current_user.last_name})
      this.setState({email: nextProps.current_user.email})
      this.setState({address: nextProps.current_user.address})
      this.setState({postal_code: nextProps.current_user.postal_code})
      this.setState({city: nextProps.current_user.city})
      this.setState({country: nextProps.current_user.country})
      this.setState({us_state: nextProps.current_user.us_state})
    }
  }

  handleChange(name, value) {
    this.setState({[name]: value})
  }

  submit(model) {

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
                value={this.props.current_user.wallet}
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
    if (!this.props.currentUser.id) {
      return null
    }

    return (
      <UserProfile
        currentUser={this.props.currentUser}
        onSubmit={this.handleSubmit.bind(this)}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  currentUser: current_user(state)
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getUserProfile,
  updateUserProfile
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileContainer)
