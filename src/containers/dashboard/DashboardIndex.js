import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchEscrowBalance } from '../../actions/actions_contract'
import { fetchPurchaseMetrics } from '../../actions/actions_purchases'
import DashboardTile from './DashboardTile'
import Eth from 'ethjs'
import '../../style/vendor/gentelella.css'

class DashboardIndex extends Component {
  constructor(props) {
    super(props)

    this.state = {
      escrowBalance: 0,
      errorCount: 0,
      purchasedCount: 0,
      shippedCount: 0,
      completedCount: 0,
      buyerCancelledCount: 0,
      sellerCancelledCount: 0,
      sellerShippingTimeoutCount: 0,
      buyerConfirmationTimeout: 0,
      newCount: 0,
      pendingPurchasedCount: 0,
      pendingShippedCount: 0,
      pendingCompletedCount: 0,
      pendingCancelledCount: 0
    }
  }
  componentWillMount() {
    this.props.fetchEscrowBalance().then(transaction => {
      this.setState({escrowBalance: Eth.fromWei(transaction, 'ether').valueOf()})
    })
    this.props.fetchPurchaseMetrics().then(transaction => {
      this.setState({
        errorCount: transaction.error,
        purchasedCount: transaction.purchased,
        shippedCount: transaction.shipped,
        completedCount: transaction.completed,
        buyerCancelledCount: transaction.buyer_cancelled,
        sellerCancelledCount: transaction.seller_cancelled,
        sellerShippingTimeoutCount: transaction.seller_shipping_timeout,
        buyerConfirmationTimeout: transaction.buyer_confirmation_timeout,
        newCount: transaction.new_purchase,
        pendingPurchasedCount: transaction.pending_purchased,
        pendingShippedCount: transaction.pending_shipped,
        pendingCompletedCount: transaction.pending_completed,
        pendingCancelledCount: transaction.pending_cancelled
      })
    })
  }

  render() {
    return (
        <div className="container dashboard">
          <div className="row tile_count">
            <DashboardTile stat={this.state.escrowBalance} title='Escrow Balance' />
            <DashboardTile stat={this.state.newCount} title='New Purchases'/>
            <DashboardTile stat={this.state.errorCount} title='Error'/>
            <DashboardTile stat={this.state.purchasedCount} title='Purchased'/>
            <DashboardTile stat={this.state.shippedCount} title='Shipped'/>
            <DashboardTile stat={this.state.completedCount} title='Completed'/>
            <DashboardTile stat={this.state.buyerCancelledCount} title='Buyer Cancelled'/>
            <DashboardTile stat={this.state.sellerCancelledCount} title='Seller Cancelled'/>
            <DashboardTile stat={this.state.sellerShippingTimeoutCount} title='Seller Shipping Timeout'/>
            <DashboardTile stat={this.state.buyerConfirmationTimeout} title='Buyer Confirmation Timeout'/>
            <DashboardTile stat={this.state.pendingPurchasedCount} title='Pending Purchase'/>
            <DashboardTile stat={this.state.pendingShippedCount} title='Pending Shipped'/>
            <DashboardTile stat={this.state.pendingCompletedCount} title='Pending  Completed'/>
            <DashboardTile stat={this.state.pendingCancelledCount} title='Pending Cancelled'/>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Open Transactions</h2>
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                      </tr>
                      <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                      </tr>
                      <tr>
                        <th scope="row">3</th>
                        <td>Larry</td>
                        <td>the Bird</td>
                        <td>@twitter</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
)
  }
}

function mapStateToProps(state) {
  return { provider: state.provider }
}


export default connect(mapStateToProps, { fetchEscrowBalance, fetchPurchaseMetrics })(DashboardIndex)
