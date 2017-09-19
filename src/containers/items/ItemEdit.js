import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Textarea } from 'formsy-react-components'
import { selectItem, updateItem } from '../../actions/actions_items'
import { item } from '../../models/selectors'
import '../../style/new-listing.css'

class ItemEdit extends Component {
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
    this.props.updateItem(model, this.props.item.id)
    this.props.history.push('/my_items')
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
        <Input
          label='Name'
          value={this.props.item.name}
          name='name'
          type='text'
          onChange={this.handleChange.bind(this)}
          required />
        <Input
          label='Reference ID'
          value={this.props.item.reference}
          name='reference'
          type='text'
          onChange={this.handleChange.bind(this)}
           />
        <Input
          label='Price'
          value={this.props.item.price}
          name='price'
          type='text'
          onChange={this.handleChange.bind(this)}
          required />
        <Input
          label='Discount (%)'
          value={this.props.item.discount}
          name='discount'
          type='text'
          onChange={this.handleChange.bind(this)}
           />
        <Input
          label='Shipping Fee'
          value={this.props.item.shipping_fee}
          name='shipping_fee'
          type='text'
          onChange={this.handleChange.bind(this)}
           />
        <Input
          label='Picture'
          value={this.props.item.picture}
          name='picture'
          type='text'
          onChange={this.handleChange.bind(this)}
          required />
        <Input
          label='Shipping Deadline'
          value={this.props.item.shipping_deadline}
          name='shipping_deadline'
          type='text'
          onChange={this.handleChange.bind(this)}
          required />
        <Textarea
          label="Short Description"
          value={this.props.item.short_description}
          name="short_description"
          type="text"
          onChange={this.handleChange.bind(this)}
          rows={3}
         />
        <Textarea
          label="Long Description"
          value={this.props.item.description}
          name="description"
          type="text"
          onChange={this.handleChange.bind(this)}
          rows={10}
        />
        <div className="form-action">
          <button type="submit" className="btn-shadow btn-shadow-dark">Update Listing</button>
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
                Update listing
              </h1>
              { this.renderForm() }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { item: item(state), provider: state.provider }
}

export default connect(mapStateToProps, { selectItem, updateItem })(ItemEdit)
