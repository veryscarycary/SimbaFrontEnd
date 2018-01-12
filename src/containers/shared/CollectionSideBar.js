import React, { Component } from 'react'

import '../../style/collection-sidebar.css'

class CollectionSideBar extends Component {
  render() {
    return (
      <div className="sidebar-filters">
        <div className="sidebar-collapse-filters">
          <h2 className="title">Product categories</h2>
          <div className="filter">
            <a className="trigger" data-toggle="collapse" href="#clothing">
              Clothing
            </a>
            <div className="submenu collapse in" id="clothing">
              <div className="submenu-wrapper">
                <a href="#">T-Shirts</a>
                <a href="#">Jackets</a>
                <a href="#">Jeans</a>
                <a href="#">Shorts</a>
                <a href="#">Trousers</a>
              </div>
            </div>
          </div>
          <div className="filter">
            <a className="trigger collapsed" data-toggle="collapse" href="#shoes">
              Electronics
            </a>
            <div className="submenu collapse" id="shoes">
              <div className="submenu-wrapper">
                <a href="#">Trainers</a>
                <a href="#">Boots</a>
                <a href="#">Sports wear</a>
                <a href="#">Leather</a>
              </div>
            </div>
          </div>
          <div className="filter">
            <a className="trigger collapsed" data-toggle="collapse" href="#accesories">
              Services
            </a>
            <div className="submenu collapse" id="accesories">
              <div className="submenu-wrapper">
                <a href="#">Caps and hats</a>
                <a href="#">Backpacks</a>
                <a href="#">Wallets</a>
                <a href="#">Sunglasses</a>
              </div>
            </div>
          </div>
          <div className="filter">
            <a className="trigger collapsed" data-toggle="collapse" href="#bags">
              Tickets
            </a>
            <div className="submenu collapse" id="bags">
              <div className="submenu-wrapper">
                <a href="#">All bags</a>
                <a href="#">Shoulder bags</a>
                <a href="#">Backpacks</a>
                <a href="#">Belt bags</a>
              </div>
            </div>
          </div>
        </div>
        <div className="sidebar-rating-filters">
          <h2 className="title">Product ratings</h2>
          <a href="#">
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
            <i className="fa fa-star-o"></i>
            <span>or more</span>
            (74)
          </a>
          <a href="#">
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
            <i className="fa fa-star-o"></i>
            <i className="fa fa-star-o"></i>
            <span>or more</span>
            (33)
          </a>
          <a href="#">
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
            <i className="fa fa-star-o"></i>
            <i className="fa fa-star-o"></i>
            <i className="fa fa-star-o"></i>
            <span>or more</span>
            (21)
          </a>
          <a href="#">
            <i className="fa fa-star"></i>
            <i className="fa fa-star-o"></i>
            <i className="fa fa-star-o"></i>
            <i className="fa fa-star-o"></i>
            <i className="fa fa-star-o"></i>
            <span>or more</span>
            (12)
          </a>
        </div>
      </div>
    )
  }
}

export default CollectionSideBar
