import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Modal from 'react-modal'
import Spinner from 'react-spinkit'

export default function(contentLabel) {
  return function (WrapperComponent) {
    return class TransactionWatcherWrapper extends Component {
      state = { modalIsOpen: false }

      openModal({ title, content }) {
        this.setState({
          modalIsOpen: true,
          title,
          content,
        })
      }

      closeModal() {
        this.setState({
          modalIsOpen: false,
        })
      }

      render() {
        return (
          <div>
            <WrapperComponent
              {...this.props}
              openModal={this.openModal.bind(this)}
              closeModal={this.closeModal.bind(this)}
            />

            <Modal
              isOpen={this.state.modalIsOpen}
              contentLabel={contentLabel}
            >
              <div className="modal-header">
                <h5 className="modal-title">{this.state.title}</h5>
              </div>

              <div className="modal-body">
                <div>
                  <p className="text-center">{this.state.content}</p>

                  <p className="text-center">
                    <Spinner name="line-scale" color="coral" className='purchase-spinner' />
                  </p>
                </div>
              </div>
            </Modal>
          </div>
        )
      }
    }
  }
}
