import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import '../../style/item.css'

import { current_user, sellerItems } from '../../models/selectors'
import { fetchSellerItems } from '../../actions/actions_items'

class SellerItemsIndex extends Component {
  componentWillMount() {
    if (this.props.provider.eth) {
      this.props.fetchSellerItems(this.props.provider, this.props.current_user.wallet)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.provider.eth && !this.props.provider.eth) {
      this.props.fetchSellerItems(nextProps.provider, this.props.current_user.wallet)
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
              <tr key={item.id}>
              <Link to={`/items/${item.id}/edit`}><td>{item.id}</td></Link>
              <td>{item.name}</td>
              <td><img src={ item.picture } alt={ item.name } style={{width: '40%'}} /></td>
              <td>{item.sales} sold</td>
              </tr>
              )
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
  return { sellerItems: sellerItems(state), current_user: current_user(state), provider: state.provider }
}

export default connect(mapStateToProps, { fetchSellerItems })(SellerItemsIndex)
