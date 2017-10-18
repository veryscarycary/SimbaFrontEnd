import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import '../../style/item.css'

import { current_user, sellerItems } from '../../models/selectors'
import { fetchSellerItems } from '../../actions/actions_items'

class SellerItemsIndex extends Component {
  componentWillMount() {
    this.props.fetchSellerItems()
  }

  renderItems() {
    const _items = (this.props.sellerItems ? this.props.sellerItems : '')
    let itemRows = _items.map((item) => {
      return (
        <tr key={item.id}>
          <td><Link to={`/items/${item.id}/edit`}>{item.id}</Link></td>
          <td>
            <a href="product.html" className="product-img">
              <img src={ item.picture } alt={ item.name } />
            </a>
          </td>
          <td>{item.name}</td>
          <td>{item.price} ETH</td>
          <td>{item.sales} sold</td>
        </tr>
      )
    })

    return (
      <table className="table wishlist-table table-responsive">
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Item Picture</th>
            <th>Item Name</th>
            <th>Price</th>
            <th># Sold</th>
          </tr>
        </thead>
        <tbody>
          { itemRows }
        </tbody>
      </table>
    )
  }

  render() {
    return (
      <div className="account-page">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item active">My Items</li>
          </ol>

          <div className="account-wrapper">
            { this.renderItems() }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { sellerItems: sellerItems(state), current_user: current_user(state) }
}

export default connect(mapStateToProps, { fetchSellerItems })(SellerItemsIndex)
