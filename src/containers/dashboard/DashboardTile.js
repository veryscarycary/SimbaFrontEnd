import React, { Component } from 'react'
import '../../style/vendor/gentelella.css'

class DashboardTile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      stat: 0
    }
  }
  componentWillMount() {
    this.setState({
      stat: this.props.stat
    })
  }

  render() {
    return (
      <div className="col-md-2 col-sm-3 col-xs-6 tile_stats_count">
        <span className="count_top"><i className="fa fa-balance-scale"></i> Escrow Balance</span>
        <div className="count">{this.state.stat}</div>
        <span className="count_bottom"><i className="green">4% </i> From last Week</span>
      </div>
    )
  }
}

export default DashboardTile;
