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
      name: this.props.item.name,
      category: this.props.item.category,
      price: this.props.item.price,
      reference: this.props.item.reference,
      discount: this.props.item.discount,
      shipping_fee: this.props.item.shipping_fee,
      picture: this.props.item.picture,
      shipping_deadline: this.props.item.shipping_deadline,
      short_description: this.props.item.short_description,
      description: this.props.item.description
    }
  }



  handleChange(name, value) {
    this.setState({[name]: value})
  }

  submit(model) {
    this.props.updateItem(model, this.props.item.id).then((response) => {
      this.props.history.push('/my_items')
    })
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
    if (nextProps.item) {
      this.setState({
        name: nextProps.item.name,
        reference: nextProps.item.reference,
        price: nextProps.item.price,
        discount: nextProps.item.discount,
        shipping_fee: nextProps.item.shipping_fee,
        picture: nextProps.item.picture,
        shipping_deadline: nextProps.item.shipping_deadline,
        short_description: nextProps.item.short_description,
        description: nextProps.item.description
      })
    }
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
          label='Price'
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
          label='Shipping Fee'
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
