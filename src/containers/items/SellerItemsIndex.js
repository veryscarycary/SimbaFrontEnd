import React, { Component } from 'react'
import { connect } from 'react-redux'

import '../../style/item.css'

import { fetchSellerItems } from '../../actions/actions_items'
import { sellerItems } from '../../models/selectors'

class SellerItemsIndex extends Component {
  componentWillMount() {
    if (this.props.provider.eth) {
      this.props.fetchSellerItems(this.props.provider)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.provider.eth && !this.props.provider.eth) {
      this.props.fetchSellerItems(nextProps.provider)
    }
  }

  renderItems() {
      return (
        <table className='pure-u-1 pure-u-md-1-3'>
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Item Name</th>
              <th>Item Picture</th>
              <th>Item Sales #</th>
            </tr>
          </thead>
          <tbody>
            {this.props.sellerItems.map((item) => {
              return(
              <tr>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td><img src={ item.picture } alt={ item.name } style={{width: '40%'}} /></td>
              <td>{item.sales} sold</td>
              </tr>)
            })}
          </tbody>
        </table>
      )
  }

  render() {
    return (
      <div className="pure-g list-items">
        { this.props.sellerItems ? this.renderItems() : '' }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { sellerItems: sellerItems(state), provider: state.provider }
}

export default connect(mapStateToProps, { fetchSellerItems })(SellerItemsIndex)
