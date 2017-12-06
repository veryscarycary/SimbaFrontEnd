import React, { Component } from 'react'
import {Line} from 'react-chartjs-2';
import '../../style/vendor/gentelella.css'

class DashboardChart extends Component {
  constructor(props) {
    super(props)
  }

  formatChartData() {
    if (!this.props.data) {
      return {}
    }
    const data = {
      labels: Object.keys(this.props.data),
      datasets: [
        {
          label: this.props.label,
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
          data: Object.values(this.props.data)
        }
      ]
    }
    return data
  }

  render() {
    return (
      <div className="col-md-6 col-sm-6 col-xs-6">
        <Line data={this.formatChartData()} />
      </div>
    )
  }
}

export default DashboardChart;
