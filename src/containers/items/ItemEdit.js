import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Textarea } from 'formsy-react-components'
import { selectItem } from '../../actions/actions_items'
import { createItem } from '../../actions/actions_items'
import { item } from '../../models/selectors'

import '../../style/item.css'

class ItemEdit extends Component {
  constructor(props) {
    super(props)
  }

  handleChange(name, value) {
    this.setState({[name]: value})
  }

  submit(model) {
    this.props.createItem(this.props)
  }

  componentWillMount() {
    if (this.props.provider.eth) {
      this.props.selectItem(this.props.provider, this.props.match.params.item_id)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.provider.eth && !this.props.provider.eth) {
      this.props.selectItem(nextProps.provider, this.props.match.params.item_id)
    }
  }

  renderForm() {
    return (
      <Form layout='vertical' className='item-form' onValidSubmit={this.submit.bind(this)}>
        <div className='pure-g'>
          <div className='pure-u-1 pure-u-md-1-2'>
            <Input
              label='Name'
              value={this.props.item.name}
              name='name'
              type='text'
              onChange={this.handleChange.bind(this)}
              required />
          </div>
          <div className='pure-u-1 pure-u-md-1-2'>
            <Input
              label='Reference ID'
              value={this.props.item.reference}
              name='reference'
              type='text'
              onChange={this.handleChange.bind(this)}
               />
          </div>
          <div className='pure-u-1 pure-u-md-1-2'>
            <Input
              label='Price'
              value={this.props.item.price}
              name='price'
              type='text'
              onChange={this.handleChange.bind(this)}
              required />
          </div>
          <div className='pure-u-1 pure-u-md-1-2'>
            <Input
              label='Discount (%)'
              value={this.props.item.discount}
              name='discount'
              type='text'
              onChange={this.handleChange.bind(this)}
               />
          </div>
          <div className='pure-u-1 pure-u-md-1-2'>
            <Input
              label='Shipping Fee'
              value={this.props.item.shipping_fee}
              name='shipping_fee'
              type='text'
              onChange={this.handleChange.bind(this)}
               />
          </div>
          <div className='pure-u-1 pure-u-md-1-2'>
            <Input
              label='Picture'
              value={this.props.item.picture}
              name='picture'
              type='text'
              onChange={this.handleChange.bind(this)}
              required />
          </div>
          <div className='pure-u-1 pure-u-md-1-2'>
            <Input
              label='Shipping Deadline'
              value={this.props.item.shipping_deadline}
              name='shipping_deadline'
              type='text'
              onChange={this.handleChange.bind(this)}
              required />
          </div>
          <div className='pure-u-1'>
            <Textarea
              label="Short Description"
              value={this.props.item.short_description}
              name="short_description"
              type="text"
              onChange={this.handleChange.bind(this)}
              rows={3}
             />
          </div>
          <div className='pure-u-1'>
            <Textarea
              label="Long Description"
              value={this.props.item.description}
              name="description"
              type="text"
              onChange={this.handleChange.bind(this)}
              rows={10}
            />
          </div>
        </div>
        <button className="pure-button pure-button-primary"
                type='submit'>Create Item</button>
      </Form>
    )
  }

  render() {
    return (
      <div className='item'>
        <h3 className='title'>EDIT ITEM {this.props.item.id}</h3>
        <div className='title-divider'></div>
        { this.renderForm() }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { item: item(state), provider: state.provider }
}


export default connect(mapStateToProps, { selectItem, createItem })(ItemEdit)
