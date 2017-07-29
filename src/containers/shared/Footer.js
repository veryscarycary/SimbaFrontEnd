import React, { Component } from 'react'

import '../../style/footer.css'

class Footer extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <br />
          <div className="col-md-4">
            <center>
              <img src="http://oi60.tinypic.com/w8lycl.jpg" className="img-circle" alt="the-brains" />
              <br />
              <h4 className="footertext">Programmer</h4>
              <p className="footertext">You can thank all the crazy programming here to this guy.</p>
            </center>
          </div>
          <div className="col-md-4">
            <center>
              <img src="http://oi60.tinypic.com/2z7enpc.jpg" className="img-circle" alt="..." />
              <br />
              <h4 className="footertext">Artist</h4>
              <p className="footertext">All the images here are hand drawn by this man.</p>
            </center>
          </div>
          <div className="col-md-4">
            <center>
              <img src="http://oi61.tinypic.com/307n6ux.jpg" className="img-circle" alt="..." />
              <br />
              <h4 className="footertext">Designer</h4>
              <p className="footertext">This pretty site and the copy it holds are all thanks to this guy.</p>
            </center>
          </div>
        </div>
        <div className="row">
          <center><p  className="footertext">Contact Stuff Here - Copyright 2014</p></center>
        </div>
      </div>
    )
  }
}

export default Footer




