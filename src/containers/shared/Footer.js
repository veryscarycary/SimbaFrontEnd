import React, { Component } from 'react'

import '../../style/footer.css'

class Footer extends Component {
  render() {
    return (
      <footer className="store-footer">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="title">
                Store Menu
              </div>
              <ul className="menu">
                <li>
                  <a href="/">Clothes</a>
                </li>
                <li>
                  <a href="/">Electronics</a>
                </li>
                <li>
                  <a href="/">Services</a>
                </li>
                <li>
                  <a href="/">Ticket</a>
                </li>
                <li>
                  <a href="/">Getaway</a>
                </li>
              </ul>
            </div>
            <div className="col-md-4">
              <div className="title">
                Connect with us
              </div>
              <ul className="menu">
                <li>
                  <a href="/">
                    <i className="fa fa-instagram"></i>
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="/">
                    <i className="fa fa-twitter"></i>
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="/">
                    <i className="fa fa-slack"></i>
                    Slack
                  </a>
                </li>
                <li>
                  <a href="/">
                    <i className="fa fa-facebook"></i>
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-md-4 newsletter">
              <div className="title">
                News & Updates
              </div>
              <p>
                Enter your email address for news and product launches in the Awesome Space.
              </p>

              <form className="newsletter-form">
                <input type="email" id="mc-email" className="form-control" placeholder="Email address" required />

                <button type="submit">
                  <i className="fa fa-chevron-right"></i>
                </button>
                <label htmlFor="mc-email" className="text-white newsletter-feedback mt-3"></label>
              </form>
            </div>
          </div>
          <div className="bottom">
            <span>
              © 2017 Simba LLC
            </span>
            <div className="payment-methods">
              <img src={require('../../images/bitcoin-logo.png')} alt="Bitcoin" />
              <img src={require('../../images/ethereum-logo.png')} alt="Ethereum" />

            </div>
          </div>
        </div>
      </footer>
    )
  }
}

export default Footer




