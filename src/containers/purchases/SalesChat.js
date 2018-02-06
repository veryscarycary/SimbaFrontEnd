import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Tabs, Tab } from 'react-bootstrap-tabs'
import ChatUser from '../../components/ChatUser/ChatUser'

import '../../style/purchases-collection.css'
import '../../style/sales-chat/sales-chat.css'
//
// import { fetchAllPurchases } from '../../actions/actions_purchases'
// import { cancelPurchase } from '../../actions/actions_contract'
// import { purchaseState } from '../shared/PurchaseState'
//
// import { pendingSales, completedSales } from '../../models/selectors'

class SalesChat extends Component {

  renderChatWindow() {
    return (
      <div className="sales-chat-window-container">
        <ChatUser></ChatUser>
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
            <li className="breadcrumb-item active">Sales history</li>
          </ol>

          <div className="account-wrapper">
          { this.renderChatWindow() }
          </div>
        </div>
      </div>
    )
  }
}
//
// function mapStateToProps(state) {
//   return { pendingSales: pendingSales(state), completedSales: completedSales(state) }
// }
//
// export default connect(mapStateToProps, { fetchAllPurchases, cancelPurchase })(SalesIndex)
export default SalesChat;
