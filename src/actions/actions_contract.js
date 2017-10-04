import Eth from 'ethjs'
import EscrowContract from '../services/escrow'

import { purchaseState, activityCategories } from '../containers/shared/PurchaseState'
import { watchShippingTimeoutEvent, watchConfirmationTimeoutEvent } from './actions_event_watcher'
import { setFlashMessage } from './actions_flash_messages'
import { UPDATE_PURCHASE } from './actions_purchases'
import { UPDATE_ITEM } from './actions_items'
import { UPDATE_USER } from './actions_users'
import { fetchOneReview } from './actions_reviews'
import { createLogActivity } from './actions_activities'

// Block chain transaction
// Buyer Purchase an item '_itemId' from Seller (_seller)
// State of the purchase : "PURCHASED"
export function purchase(purchaseId, sellerAddress, itemId, amount, shippingDeadline) {
  return (dispatch) => EscrowContract.purchaseItem({
    purchaseId,
    sellerAddress,
    itemId,
    amount,
    shippingDeadline,
  })
   .then((transaction) => {
      return dispatch({ type: UPDATE_PURCHASE, payload: { id: purchaseId, purchaseState: purchaseState.PURCHASED } })
    })
   .catch((error) => {
      console.error('Could not create purchase', error)

      dispatch(setFlashMessage("Error: Transaction failed.. please try again later.", 'error'))
      dispatch({ type: UPDATE_PURCHASE, payload: { id: purchaseId, purchaseState: purchaseState.ERROR } })
    })
}

// Block chain transaction
// Seller send the code to Buyer
// Code can be a tracking number, a digital code, a coupon
// State of the purchase : "SHIPPED"
export function sendCode(purchaseId, code) {
  return (dispatch) => EscrowContract.sendShippingInformation({ purchaseId, trackingNumber: code })
    .then(transaction => {
      return dispatch({ type: UPDATE_PURCHASE, payload: { id: purchaseId, purchaseState: purchaseState.SHIPPED } })
    })
    .catch(error => {
      console.error('Could not send shipping info', error)

      dispatch({ type: UPDATE_PURCHASE, payload: { id: purchaseId, purchaseState: purchaseState.ERROR } })
    })
}

// Block chain transaction
// Buyer confirms receive the code from the Seller - Completing the transactions
// Seller receives the money
// State of the purchase : "COMPLETED"
export function confirmPurchase(purchaseId, userReviewId, itemReviewId, userRating, itemRating) {
  return (dispatch) => EscrowContract.confirmPurchase({
    purchaseId,
    userReviewId,
    itemReviewId,
    userRating,
    itemRating,
  })
    .then((transaction) => {
      return dispatch({type: UPDATE_PURCHASE, payload: {id: purchaseId, purchaseState: purchaseState.COMPLETED}})
    })
    .catch(error => {
      console.error('Could not confirm purchase', error)

      dispatch(setFlashMessage("Error: Couldn't confirm the purchase transaction.. please try again later.", 'error'))
      dispatch({ type: UPDATE_PURCHASE, payload: { id: purchaseId, purchaseState: purchaseState.ERROR } })
    })
}

/**
 * Cancels the purchase
 * Block chain transaction
 * Buyer cancels his purchases (before the shipping happened) - State Purchase : BUYER_CANCELLED
 * or
 * Seller cancels his orders (before he shipped the item) - State Purchase : SELLER_CANCELLED
 * @param  {String} purchaseId
 * @param  {Strign} canceller  either buyer or seller
 * @return {Promise}
 */
export function cancelPurchase({ purchaseId, itemId, sellerId, buyerId, canceller }) {
  return (dispatch) => EscrowContract.cancelPurchase(purchaseId)
    .then((transaction) => {
      console.log('Cancelling purchase', { purchaseId, canceller })
      const activityCategory = canceller === 'buyer' ? activityCategories.CANCEL_PURCHASE : activityCategories.CANCEL_SALES
      const cancelPurchaseState = canceller === 'buyer' ? purchaseState.BUYER_CANCELLED : purchaseState.SELLER_CANCELLED

      dispatch(
        createLogActivity(
          activityCategory,
          Eth.toUtf8(purchaseId),
          Eth.toUtf8(itemId),
          '',
          buyerId,
          sellerId
        )
      )

      return dispatch({ type: UPDATE_PURCHASE, payload: { id: purchaseId, purchaseState: cancelPurchaseState } })
    })
    .catch((error) => {
      console.log('Could not cancel the purchase', error)

      dispatch(setFlashMessage("Error: Couldn't cancel the purchase transaction.. please try again later.", 'error'))
      return dispatch({ type: UPDATE_PURCHASE, payload: { id: purchaseId, purchaseState: purchaseState.ERROR } })
    })
}

// Block chain transaction
// Get Purchases State from the blockchain and sort them between two arrays
// PENDING => PENDING,PURCHASED,SHIPPED states
// FINALIZED => COMPLETED, CANCELLED, SELLER_SHIPPING_TIMEOUT, BUYER_CONFIRMATION_TIMEOUT, ERROR
export function fetchPurchaseState(purchase) {
  return (dispatch) => EscrowContract.getPurchaseState(purchase.id)
    .then(transaction => {
      return dispatch({type: UPDATE_PURCHASE, payload: { purchaseState: transaction.valueOf(), id: purchase.id }})
    })
    .catch(error => {
      console.log(error)
      dispatch(setFlashMessage("Error: Couldn't connect to the blockchain.. please try again later.", 'error'))
    })
}

// Block chain transaction
// Retrieve Purchases Shipping Deadlines
// getPurchaseTimes returns (shippingDaysDeadline):
export function fetchPurchaseTimes(purchase) {
  return (dispatch) => EscrowContract.getPurchaseTimes(purchase.id)
    .then(transaction => {
      dispatch({
        type: UPDATE_PURCHASE,
        payload: {
          shipping_deadline_time: transaction[0].valueOf(),
          purchased_time: transaction[1].valueOf(),
          shipped_time: transaction[2].valueOf(),
          cancel_time: transaction[3].valueOf(),
          completed_time: transaction[4].valueOf(),
          timeout_time: transaction[5].valueOf(),
          id: purchase.id
        }
      })
    })
    .catch(error => {
      console.log(error)
      dispatch(setFlashMessage("Error: Couldn't connect to the blockchain.. please try again later.", 'error'))
    })
}

// Block chain transaction
// Retrieve a User total # of sales
export function fetchUserSalesNumber(_, wallet) {
  return (dispatch) => EscrowContract.getUserSalesNumber(wallet)
    .then(transaction => {
      dispatch({ type: UPDATE_USER, payload: { sales: transaction.valueOf(), wallet: wallet }})
    })
    .catch(error => {
      console.log(error)
      dispatch(setFlashMessage("Error: Couldn't connect to the blockchain.. please try again later.", 'error'))
    })
}

// Block chain transaction
// Retrieve total number of sales for an Item
export function fetchItemSalesNumber(itemId) {
  return (dispatch) => EscrowContract.getItemSalesNumber(itemId)
    .then(transaction => {
      dispatch({ type: UPDATE_ITEM, payload: { sales: transaction.valueOf(), id: itemId }})
    })
    .catch(error => {
      console.log(error)
      dispatch(setFlashMessage("Error: Couldn't connect to the blockchain.. please try again later.", 'error'))
    })
}

// Block chain transaction
// Retrieve a User rating and # of reviews
export function fetchUserRating(wallet) {
  return (dispatch) => EscrowContract.getUserReviews(wallet)
    .then(transaction => {
      let rating = 0

      if (transaction[0].toNumber() !== 0) {
        rating = transaction[1].valueOf() / transaction[0].valueOf()
      }

      dispatch({ type: UPDATE_USER, payload: { rating: rating, number_rating: transaction[0].valueOf(), wallet: wallet, number_reviews: transaction[2].valueOf() }})
      dispatch(fetchUserReviewIds(wallet, transaction[2].valueOf()))
    })
    .catch(error => {
      console.log(error)
      dispatch(setFlashMessage("Error: Couldn't connect to the blockchain.. please try again later.", 'error'))
    })
}

// Block chain transaction
// Retrieve a Item rating and # of reviews
export function fetchItemRating(itemId) {
  return (dispatch) => EscrowContract.getItemReviews(itemId)
    .then(transaction => {
      let rating = 0

      if (transaction[0].toNumber() !== 0) {
        rating = transaction[1].valueOf() / transaction[0].valueOf()
      }

      dispatch({ type: UPDATE_ITEM, payload: { id: itemId, rating: rating, number_rating: transaction[0].valueOf(), number_reviews: transaction[2].valueOf() }})
      dispatch(fetchItemReviewIds(itemId, transaction[2].valueOf()))
    })
    .catch(error => {
      console.log(error)
      dispatch(setFlashMessage("Error: Couldn't connect to the blockchain.. please try again later.", 'error'))
    })
}

// Block chain transaction
// Retrieve list of Items reviews ID
export function fetchItemReviewIds(itemId, numberReviews) {
  return (dispatch) => {
    for (var i = 0; i < numberReviews; i++) {
      EscrowContract.getItemReviewComment(itemId, i)
        .then(transaction => {
          dispatch(fetchOneReview(Eth.toAscii(transaction), true))
        })
        .catch(error => {
          console.log(error)
          dispatch(setFlashMessage("Error: Couldn't connect to the blockchain.. please try again later.", 'error'))
        })
    }
  }
}

// Block chain transaction
// Retrieve list of Users reviews ID
export function fetchUserReviewIds(wallet, numberReviews) {
  return (dispatch) => {
    for (var i = 0; i < numberReviews; i++) {
      EscrowContract.getUserReviewComment(wallet, i)
        .then(transaction => {
          dispatch(fetchOneReview(Eth.toAscii(transaction), false))
        })
        .catch(error => {
          console.log(error)
          dispatch(setFlashMessage("Error: Couldn't connect to the blockchain.. please try again later.", 'error'))
        })
    }
  }
}

// block chain transaction
// Automatically cancels orders if seller hasn't shipped the items before the shipping deadlines - State of the purchase : "SELLER_SHIPPING_TIMEOUT"
// and
// Automatically confirms orders if buyer hasn't confirmed the reception of the item before the confirmation deadlines - State of the purchase : "BUYER_CONFIRMATION_TIMEOUT"
export function cancelTimeoutOrders(provider) {
  return (dispatch) => {
    dispatch(watchShippingTimeoutEvent(provider))
    dispatch(watchConfirmationTimeoutEvent(provider))

    return EscrowContract.cancelTimeoutOrders()
      .catch(error => {
        console.log('error cancelTimeoutOrders', error)
        dispatch(setFlashMessage("Error: Couldn't confirm the purchase transaction.. please try again later.", 'error'))
      })
  }
}

// block chain call
// Fetch Total Balance of Escrow smart contract
export function fetchEscrowBalance() {
  return dispatch => EscrowContract.getBalance()
}

