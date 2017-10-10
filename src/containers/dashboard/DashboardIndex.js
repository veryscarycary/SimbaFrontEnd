import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchEscrowBalance } from '../../actions/actions_contract'
import { fetchPurchaseMetrics } from '../../actions/actions_purchases'
import Eth from 'ethjs'
import '../../style/vendor/gentelella.css'

class DashboardIndex extends Component {
  constructor(props) {
    super(props)

    this.state = {
      escrowBalance: 0,
      pendingPurchasesCount: 0,
      pendingShippingPurchasesCount: 0,
      completedPurchasesCount: 0
    }
  }
  componentWillMount() {
    this.props.fetchEscrowBalance().then(transaction => {
      this.setState({escrowBalance: Eth.fromWei(transaction, 'ether').valueOf()})
    })
    this.props.fetchPurchaseMetrics().then(transaction => {
      this.setState({
        pendingPurchasesCount: transaction.pending,
        pendingShippingPurchasesCount: transaction.pending_shipping,
        completedPurchasesCount: transaction.completed
      })
    })
  }

  render() {
    return (
        <div className="container dashboard">
          <div className="row tile_count">
            <div className="col-md-2 col-sm-3 col-xs-6 tile_stats_count">
              <span className="count_top"><i className="fa fa-balance-scale"></i> Escrow Balance</span>
              <div className="count">{this.state.escrowBalance}</div>
              <span className="count_bottom"><i className="green">4% </i> From last Week</span>
            </div>
            <div className="col-md-2 col-sm-3 col-xs-6 tile_stats_count">
              <span className="count_top"><i className="fa fa-user"></i> Users</span>
              <div className="count">{this.state.escrowBalance}</div>
              <span className="count_bottom"><i className="green">4% </i> From last Week</span>
            </div>
            <div className="col-md-2 col-sm-3 col-xs-6 tile_stats_count">
              <span className="count_top"><i className="fa fa-user"></i> Pending Purchases</span>
              <div className="count">{this.state.pendingPurchasesCount}</div>
            </div>
            <div className="col-md-2 col-sm-3 col-xs-6 tile_stats_count">
              <span className="count_top"><i className="fa fa-user"></i>Purchases Waiting to Ship</span>
              <div className="count">{this.state.pendingShippingPurchasesCount}</div>
            </div>
            <div className="col-md-2 col-sm-3 col-xs-6 tile_stats_count">
              <span className="count_top"><i className="fa fa-user"></i> Completed Purchases</span>
              <div className="count">{this.state.completedPurchasesCount}</div>
            </div>
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
