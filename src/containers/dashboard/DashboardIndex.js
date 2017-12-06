import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchEscrowBalance } from '../../actions/actions_contract'
import { fetchPurchaseMetrics } from '../../actions/actions_purchases'
import { fetchAllActivities } from '../../actions/actions_activities'
import { activities } from '../../models/selectors'
import DashboardTile from './DashboardTile'
import DashboardChart from './DashboardChart'
import Eth from 'ethjs'
import '../../style/vendor/gentelella.css'

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      fill: true,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};


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
        errorCount: transaction.purchase_stats.error,
        purchasedCount: transaction.purchase_stats.purchased,
        shippedCount: transaction.purchase_stats.shipped,
        completedCount: transaction.purchase_stats.completed,
        buyerCancelledCount: transaction.purchase_stats.buyer_cancelled,
        sellerCancelledCount: transaction.purchase_stats.seller_cancelled,
        sellerShippingTimeoutCount: transaction.purchase_stats.seller_shipping_timeout,
        buyerConfirmationTimeout: transaction.purchase_stats.buyer_confirmation_timeout,
        newCount: transaction.purchase_stats.new_purchase,
        pendingPurchasedCount: transaction.purchase_stats.pending_purchased,
        pendingShippedCount: transaction.purchase_stats.pending_shipped,
        pendingCompletedCount: transaction.purchase_stats.pending_completed,
        pendingCancelledCount: transaction.purchase_stats.pending_cancelled,
        dailyUserStats: transaction.daily_user_registration_stats,
        dailyItemsCreatedStats: transaction.daily_items_created_stats
      })
    })
    this.props.fetchAllActivities()
  }

  renderActivities() {
    let activities = this.props.activities.map((activity) => {
      return (
        <tr key={activity.id}>
          <td>{ activity.created_at }</td>
          <td>{ activity.category }</td>
          <td>{ activity.buyer.fullname }</td>
          <td>{ activity.seller.fullname }</td>
          <td>{ activity.purchase.id }</td>
          <td>{ activity.item.name }</td>
          <td>{ activity.amount }</td>
        </tr>
      )
    })

    return activities
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
            <div className="col-md-6 col-sm-6 col-xs-6">
              <DashboardChart data={this.state.dailyUserStats} label='Daily User Registrations' />
            </div>
            <div className="col-md-6 col-sm-6 col-xs-6">
              <DashboardChart data={this.state.dailyItemsCreatedStats} label='Daily Items Created' />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Open Transactions</h2>
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Buyer</th>
                        <th>Seller</th>
                        <th>PurchaseId</th>
                        <th>Item</th>
                        <th>Amount/Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      { this.props.activities ? this.renderActivities() : '' }
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
  return { provider: state.provider, activities: activities(state) }
}


export default connect(mapStateToProps, { fetchEscrowBalance, fetchPurchaseMetrics, fetchAllActivities })(DashboardIndex)
