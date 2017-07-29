import { default as contract } from 'truffle-contract'
import Eth from 'ethjs'
import escrowJSON from '../contract_build/Escrow.json'

import { purchaseState } from '../containers/shared/PurchaseState'
import { watchPurchaseEvent, watchShippingEvent, watchPurchaseCompleteEvent } from './actions_event_watcher'
import { setFlashMessage } from './actions_flash_messages'
import { UPDATE_PURCHASE } from './actions_purchases'
import { UPDATE_ITEM } from './actions_items'
import { UPDATE_USER } from './actions_users'
import { fetchOneReview } from './actions_reviews'

// Purchase one item
// Send the transaction in the smart contract
export function purchase(purchaseId, sellerAddress, itemId, amount, provider, history) {
  const escrow = contract(escrowJSON)
  escrow.setProvider(provider.eth.currentProvider)

  return dispatch => {
    provider.eth.accounts().then((accounts) => {
      escrow.deployed().then(instance => {
        dispatch(watchPurchaseEvent(provider, history))
        instance.purchase.sendTransaction(purchaseId,
                                          sellerAddress,
                                          itemId,
                                          {from: accounts[0], value: Eth.toWei(amount, 'ether')})
                         .then(transaction => {
                            dispatch({ type: UPDATE_PURCHASE, payload: { id: purchaseId, purchaseState: purchaseState.PENDING_PURCHASED } })
                       }).catch(error => {
                            dispatch(setFlashMessage("Error: Transaction failed.. please try again later.", 'error'))
                            dispatch({ type: UPDATE_PURCHASE, payload: { id: purchaseId, purchaseState: purchaseState.ERROR } })
                       })
      })
    })
  }
}

export function sendCode(purchaseId, code, provider) {
  console.log('enter sendCode')
  const escrow = contract(escrowJSON)
  escrow.setProvider(provider.eth.currentProvider)

  return dispatch => {
    provider.eth.accounts().then((accounts) => {
      escrow.deployed().then(instance => {
        dispatch(watchShippingEvent(provider))
        instance.setCode.sendTransaction(purchaseId, code, {from: accounts[0]})
                        .then(transaction => {
                          dispatch({ type: UPDATE_PURCHASE, payload: { id: purchaseId, purchaseState: purchaseState.PENDING_SHIPPED } })
                      }).catch(error => {
                          dispatch(setFlashMessage("Error: Sending Tracking Number failed.. please try again later.", 'error'))
                          dispatch({ type: UPDATE_PURCHASE, payload: { id: purchaseId, purchaseState: purchaseState.ERROR } })
                      })
      })
    })
  }
}

export function confirmPurchase(purchaseId, userReviewId, itemReviewId, userRating, itemRating, provider) {
  console.log('enter confirmPurchase')
  const escrow = contract(escrowJSON)
  escrow.setProvider(provider.eth.currentProvider)

  return dispatch => {
    provider.eth.accounts().then((accounts) => {
      escrow.deployed().then(instance => {
        dispatch(watchPurchaseCompleteEvent(provider))
        instance.confirmPurchase.sendTransaction(purchaseId, userReviewId, itemReviewId, userRating, itemRating, {from: accounts[0]})
                        .then(transaction => {
                          dispatch({ type: UPDATE_PURCHASE, payload: { id: purchaseId, purchaseState: purchaseState.PENDING_COMPLETED } })
                      }).catch(error => {
                          dispatch(setFlashMessage("Error: Couldn't confirm the purchase transaction.. please try again later.", 'error'))
                          dispatch({ type: UPDATE_PURCHASE, payload: { id: purchaseId, purchaseState: purchaseState.ERROR } })
                      })
      })
    })
  }
}

// Get Purchases State from the blockchain and sort them between two arrays
// PENDING => PENDING,PURCHASED,SHIPPED states
// FINALIZED => COMPLETED, CANCELLED, SELLER_TIMEOUT, BUYER_TIMEOUT, ERROR
export function fetchPurchaseState(purchase, provider) {
  const escrow = contract(escrowJSON)
  escrow.setProvider(provider.eth.currentProvider)

  return dispatch => {
    provider.eth.accounts().then((accounts) => {
      escrow.deployed().then(instance => {
        instance.getPurchase(purchase.id)
                .then(transaction => {
                  dispatch({type: UPDATE_PURCHASE, payload: { purchaseState: transaction[3].valueOf(), id: purchase.id }})
              }).catch(error => {
                  console.log(error)
                  dispatch(setFlashMessage("Error: Couldn't connect to the blockchain.. please try again later.", 'error'))
              })
      })
    })
  }
}

// Retrieve a User total # of sales
export function fetchUserSalesNumber(provider, wallet) {
  const escrow = contract(escrowJSON)
  escrow.setProvider(provider.eth.currentProvider)

  return dispatch => {
    provider.eth.accounts().then((accounts) => {
      escrow.deployed().then(instance => {
        instance.getUserSalesNumber(wallet)
                .then(transaction => {
                  dispatch({ type: UPDATE_USER, payload: { sales: transaction.valueOf(), wallet: wallet }})
              }).catch(error => {
                  console.log(error)
                  dispatch(setFlashMessage("Error: Couldn't connect to the blockchain.. please try again later.", 'error'))
              })
      })
    })
  }
}

export function fetchItemSalesNumber(provider, itemId) {
  const escrow = contract(escrowJSON)
  escrow.setProvider(provider.eth.currentProvider)

  return dispatch => {
    provider.eth.accounts().then((accounts) => {
      escrow.deployed().then(instance => {
        instance.getItemSalesNumber(itemId)
                .then(transaction => {
                  dispatch({ type: UPDATE_ITEM, payload: { sales: transaction.valueOf(), id: itemId }})
              }).catch(error => {
                  console.log(error)
                  dispatch(setFlashMessage("Error: Couldn't connect to the blockchain.. please try again later.", 'error'))
              })
      })
    })
  }
}


// Retrieve a User rating and # of reviews
export function fetchUserRating(provider, wallet) {
  const escrow = contract(escrowJSON)
  escrow.setProvider(provider.eth.currentProvider)

  return dispatch => {
    provider.eth.accounts().then((accounts) => {
      escrow.deployed().then(instance => {
        instance.getUserReviews(wallet)
                .then(transaction => {
                  var rating = 0
                  if (transaction[0].toNumber() !== 0) {
                    rating = transaction[1].valueOf() / transaction[0].valueOf()
                  }
                  dispatch({ type: UPDATE_USER, payload: { rating: rating, number_rating: transaction[0].valueOf(), wallet: wallet, number_reviews: transaction[2].valueOf() }})
                  dispatch(fetchUserReviewIds(provider, wallet, transaction[2].valueOf()))
              }).catch(error => {
                  console.log(error)
                  dispatch(setFlashMessage("Error: Couldn't connect to the blockchain.. please try again later.", 'error'))
              })
      })
    })
  }
}

// Retrieve a User rating and # of reviews
export function fetchItemRating(provider, itemId) {
  const escrow = contract(escrowJSON)
  escrow.setProvider(provider.eth.currentProvider)

  return dispatch => {
    provider.eth.accounts().then((accounts) => {
      escrow.deployed().then(instance => {
        instance.getItemReviews(itemId)
                .then(transaction => {
                  var rating = 0
                  if (transaction[0].toNumber() !== 0) {
                    rating = transaction[1].valueOf() / transaction[0].valueOf()
                  }
                  dispatch({ type: UPDATE_ITEM, payload: { id: itemId, rating: rating, number_rating: transaction[0].valueOf(), number_reviews: transaction[2].valueOf() }})
                  dispatch(fetchItemReviewIds(provider, itemId, transaction[2].valueOf()))
              }).catch(error => {
                  console.log(error)
                  dispatch(setFlashMessage("Error: Couldn't connect to the blockchain.. please try again later.", 'error'))
              })
      })
    })
  }
}

export function fetchItemReviewIds(provider, itemId, numberReviews) {
  const escrow = contract(escrowJSON)
  escrow.setProvider(provider.eth.currentProvider)

  return dispatch => {
    provider.eth.accounts().then((accounts) => {
      escrow.deployed().then(instance => {
        for (var i = 0; i < numberReviews; i++) {
          instance.getItemReviewComment(itemId, i)
                  .then(transaction => {
                    dispatch(fetchOneReview(Eth.toAscii(transaction), true))
                }).catch(error => {
                    console.log(error)
                    dispatch(setFlashMessage("Error: Couldn't connect to the blockchain.. please try again later.", 'error'))
                })
        }
      })
    })
  }
}

export function fetchUserReviewIds(provider, wallet, numberReviews) {
  const escrow = contract(escrowJSON)
  escrow.setProvider(provider.eth.currentProvider)

  return dispatch => {
    provider.eth.accounts().then((accounts) => {
      escrow.deployed().then(instance => {
        for (var i = 0; i < numberReviews; i++) {
          instance.getUserReviewComment(wallet, i)
                  .then(transaction => {
                    dispatch(fetchOneReview(Eth.toAscii(transaction), false))
                }).catch(error => {
                    console.log(error)
                    dispatch(setFlashMessage("Error: Couldn't connect to the blockchain.. please try again later.", 'error'))
                })
        }
      })
    })
  }
}


