import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Textarea } from 'formsy-react-components'

import { createItem } from '../../actions/actions_items'

import '../../style/new-listing.css'

class ItemNew extends Component {
  constructor(props) {
    super(props)

    this.state = {
      category: '',
      name: '',
      short_description: '',
      description: '',
      picture: '',
      reference: '',
      price: '',
      discount: '0.0',
      shipping_fee: '0.0',
      shipping_deadline: 7
    }
  }

  handleChange(name, value) {
    this.setState({[name]: value})
  }

  submit(model) {
    this.props.createItem(this.state)
  }

  renderForm() {
    return (
      <Form layout='vertical' className='item-form' onValidSubmit={this.submit.bind(this)}>
        <Input
          label='Name'
          value={this.state.name}
          name='name'
          type='text'
          onChange={this.handleChange.bind(this)}
          required />
        <Input
          label='Reference ID'
          value={this.state.reference}
          name='reference'
          type='text'
          onChange={this.handleChange.bind(this)}
           />
        <Input
          label='Price ($)'
          value={this.state.price}
          name='price'
          type='text'
          onChange={this.handleChange.bind(this)}
          required />
        <Input
          label='Discount (%)'
          value={this.state.discount}
          name='discount'
          type='text'
          onChange={this.handleChange.bind(this)}
           />
        <Input
          label='Shipping Fee ($)'
          value={this.state.shipping_fee}
          name='shipping_fee'
          type='text'
          onChange={this.handleChange.bind(this)}
           />
        <Input
          label='Picture'
          value={this.state.picture}
          name='picture'
          type='text'
          onChange={this.handleChange.bind(this)}
          required />
        <Input
          label='Shipping Deadline'
          value={this.state.shipping_deadline}
          name='shipping_deadline'
          type='text'
          onChange={this.handleChange.bind(this)}
          required />
        <Textarea
          label="Short Description"
          value={this.state.short_description}
          name="short_description"
          type="text"
          onChange={this.handleChange.bind(this)}
          rows={3}
          required
         />
        <Textarea
          label="Long Description"
          value={this.state.description}
          name="description"
          type="text"
          onChange={this.handleChange.bind(this)}
          rows={10}
        />
        <div className="form-action">
          <button type="submit" className="btn-shadow btn-shadow-dark">Create Listing</button>
        </div>
      </Form>
    )
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="ecommerce-form">
              <h1>
                Create a listing
              </h1>
              { this.renderForm() }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(null, { createItem })(ItemNew)
