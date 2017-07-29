import React, { Component } from 'react'
import { connect } from 'react-redux'

class FlashMessages extends Component {
  render() {
    return (
      <div>
        { this.props.flashMessages.type === 'success' ? <div className="alert alert-success" role="alert">{this.props.flashMessages.message}</div> : '' }
        { this.props.flashMessages.type === 'error' ? <div className="alert alert-danger" role="alert">{this.props.flashMessages.message}</div> : '' }
      </div>
    )
  }
}

function mapStateToProps({ flashMessages }) {
  return { flashMessages }
}

export default connect(mapStateToProps, null)(FlashMessages)
