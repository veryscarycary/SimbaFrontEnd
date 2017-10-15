import React, { Component } from 'react'
import '../../style/vendor/gentelella.css'

class DashboardTile extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="col-md-2 col-sm-3 col-xs-6 tile_stats_count">
        <span className="count_top"><i className="fa fa-balance-scale"></i> {this.props.title}</span>
        <div className="count">{this.props.stat}</div>
      </div>
    )
  }
}

export default DashboardTile;
