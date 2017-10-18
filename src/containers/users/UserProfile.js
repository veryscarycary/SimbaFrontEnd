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

  handleSubmit(data) {
    this.props.updateUserProfile(data)
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
