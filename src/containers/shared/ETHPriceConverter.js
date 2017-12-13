import React, { Component } from 'react'

class ETHPriceConverter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      rate: 400,
      ethPrice: 0.0
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.price) {
      const ethPrice = nextProps.price / this.state.rate

      this.setState({ ethPrice: ethPrice })
    }
  }

  render() {
    return (
      <span><i>({this.state.ethPrice} ETH)</i></span>
    )
  }
}

export default ETHPriceConverter
