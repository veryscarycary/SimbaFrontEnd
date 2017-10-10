import React, { Component } from 'react'
import Modal from 'react-modal'
import Spinner from 'react-spinkit'

const modalCustomStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    fontFamily           : 'SourceSansPro'
  },
  overlay : {
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    backgroundColor   : 'rgba(0, 0, 0, 0.8)'
  }
}

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
              style={modalCustomStyles}
            >
              <div className="modal-header">
                <h5 className="modal-title">{this.state.title}</h5>
              </div>

              <div className="modal-body">
                <div>
                  <div className="text-center">{this.state.content}</div>
                  <br/><br/>
                  <div className="text-center">
                    <Spinner name="line-scale" color="coral" className='purchase-spinner' />
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        )
      }
    }
  }
}
