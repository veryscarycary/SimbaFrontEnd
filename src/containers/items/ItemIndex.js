import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Rating from 'react-rating'

import '../../style/items-collection.css'

import CollectionSideBar from '../shared/CollectionSideBar'

import { fetchAllItems } from '../../actions/actions_items'
import { items } from '../../models/selectors'

class ItemIndex extends Component {
  componentWillMount() {
    this.props.fetchAllItems()
  }

  renderRating(item) {
    return (
      <div className="rating">
        <Rating empty={['fa fa-star-o low', 'fa fa-star-o low',
                        'fa fa-star-o medium',
                        'fa fa-star-o high', 'fa fa-star-o high']}
                full={['fa fa-star low', 'fa fa-star low',
                  'fa fa-star medium',
                  'fa fa-star high', 'fa fa-star high']}
                fractions={2}
                initialRate={item.rating}
                readonly />
        ({ item.number_rating })
      </div>
    )
  }

  renderDiscountPrice(item) {
    if (!item.discount || item.discount === 0) {
      return <span className='price'>${ item.price }</span>
    }
    const discountedPrice = item.price - item.price * (item.discount / 100)
    return (
      <span className="price">
        <span className="before">
          ${ item.price }
        </span>

        <span className="from">from </span>
        ${ discountedPrice }
      </span>
    )
  }

  renderItems() {
    let items = this.props.items.map((item) => {
      return (
        <div key={item.id}  className="col-lg-4 col-md-6 store-product">
          <Link to={`/items/${item.id}`}>
            { item.discount != 0 ? <span className="flag">{ item.discount }% off</span> : '' }
            <img src={ item.picture } alt={ item.name } className="img-fluid" />
          </Link>
          <span className="info">
            <Link to={`/items/${item.id}`} className='name'>
              { item.name } <br/>
              <span className="vendor"> { item.user.fullname }</span>
            </Link>
            { this.renderDiscountPrice(item) }
          </span>
          { this.renderRating(item) }
        </div>
      )
    })

    return items
  }

  renderFilter() {
    return (
      <div className="container clearfix">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="#">Home</a></li>
          <li className="breadcrumb-item"><a href="#">Collection for Women</a></li>
          <li className="breadcrumb-item active">Handbags</li>
        </ol>
        <div className="controls">
          <div className="sorting">
            Sort by:
            <select className="spacial-select">
              <option>Best selling</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>A-Z</option>
              <option>Z-A</option>
              <option>Oldest to Newest</option>
              <option>Newest to Oldest</option>
            </select>
          </div>
          <div className="view">
            <a href="collection-grid-sidebar.html" className="active">
              <span className="icon grid-icon">
                <span className="up-left"></span>
                <span className="up-right"></span>
                <span className="down-left"></span>
                <span className="down-right"></span>
              </span>
              Grid
            </a>
            <a href="collection-list-sidebar.html">
              <span className="icon list-icon">
                <span></span>
                <span></span>
                <span></span>
              </span>
              List
            </a>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <div className="store-filters">
          { this.renderFilter() }
        </div>
        <div className="collection-products">
          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <CollectionSideBar />
              </div>
              <div className="col-md-9">
                <div className='row'>
                  { this.renderItems() }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { items: items(state) }
}

export default connect(mapStateToProps, { fetchAllItems })(ItemIndex)
