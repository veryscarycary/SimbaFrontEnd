import React, { Component } from 'react'
import { connect } from 'react-redux'

import '../../style/user.css'

import { fetchAllUsers } from '../../actions/actions_users'

class UserIndex extends Component {
  componentWillMount() {
    this.props.fetchAllUsers()
  }

  renderUsers() {
    let users = this.props.users.all.map((users) => {
      return (
        <tr key={ users.id }>
          <td>{ users.id }</td>
          <td>{ users.first_name }</td>
          <td>{ users.last_name }</td>
          <td>{ users.email }</td>
          <td>{ users.address }</td>
          <td>{ users.wallet }</td>
          <td></td>
        </tr>
      )
    })
    return users
  }

  render() {
    return (
      <table className="pure-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Wallet</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          { this.props.users ? this.renderUsers() : '' }
        </tbody>
      </table>
    )
  }
}

function mapStateToProps({ users }) {
  return { users }
}

export default connect(mapStateToProps, { fetchAllUsers })(UserIndex)
