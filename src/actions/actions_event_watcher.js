import { default as contract } from 'truffle-contract'
import Eth from 'ethjs'
import escrowJSON from '../contract_build/Escrow.json'

import { CREATE_PURCHASE } from './actions_purchases'
import { createLogActivity } from './actions_activities'
import { purchaseState, activityCategories } from '../containers/shared/PurchaseState'

// Watch block chain event
// Buyer purchases an Item
export function watchPurchaseEvent(provider) {
  const escrow = contract(escrowJSON)
  escrow.setProvider(provider.eth.currentProvider)

  return dispatch => {
    escrow.deployed().then(instance => {
    instance.ItemPurchased().watch(function(error, result) {
      if (!error) {
        const newLog = `[${result.args.buyer}] purchased ${Eth.toUtf8(result.args.purchaseId)} for ${Eth.fromWei(result.args.amount, 'ether')} ETH`
        console.log('[Event - ItemPurchased] : ', newLog)
        dispatch(createLogActivity(activityCategories.PURCHASE,
                                   Eth.toUtf8(result.args.purchaseId),
                                   Eth.toUtf8(result.args.itemId),
                                   Eth.fromWei(result.args.amount, 'ether'),
                                   result.args.buyer,
                                   result.args.seller)
        )
        dispatch({type: CREATE_PURCHASE, payload: {id: Eth.toUtf8(result.args.purchaseId), purchaseState: purchaseState.PURCHASED}})
      } else {
        console.log("Watcher", error)
        dispatch({type: CREATE_PURCHASE, payload: {id: Eth.toUtf8(result.args.purchaseId), purchaseState: purchaseState.ERROR}})
      }
    })
  })
  }
}

// Watch block chain event
// User shipped item and send code (i.e : tracking number)
export function watchShippingEvent(provider) {
  const escrow = contract(escrowJSON)
  escrow.setProvider(provider.eth.currentProvider)

  return dispatch => {
    escrow.deployed().then(instance => {
      instance.ItemShipped().watch(function(error, result) {
        if (!error) {
          const newLog = `[${result.args.seller}] shipped ${Eth.toUtf8(result.args.itemId)} - Tracking Number : ${Eth.toUtf8(result.args.code)}`
          console.log('[Event - ItemShipped] : ', newLog)
          dispatch(createLogActivity(activityCategories.SHIP_ITEM,
                                     Eth.toUtf8(result.args.purchaseId),
                                     Eth.toUtf8(result.args.itemId),
                                     Eth.toAscii(result.args.code),
                                     result.args.buyer,
                                     result.args.seller)
          )
          dispatch({type: CREATE_PURCHASE, payload: {id: Eth.toUtf8(result.args.purchaseId), purchaseState: purchaseState.SHIPPED}})
        } else {
          dispatch({type: CREATE_PURCHASE, payload: {id: Eth.toUtf8(result.args.purchaseId), purchaseState: purchaseState.ERROR}})
        }
      })
    })
  }
}

// Watch block chain event
// User confirm the purchase closing the transaction and paying the seller
export function watchPurchaseCompleteEvent(provider) {
  const escrow = contract(escrowJSON)
  escrow.setProvider(provider.eth.currentProvider)

  return dispatch => {
    escrow.deployed().then(instance => {
      instance.PurchaseCompleted().watch(function(error, result) {
        if (!error) {
          const newLog = `[${result.args.buyer}] confirms receiving ${Eth.toUtf8(result.args.itemId)}. The transaction is complete.`
          console.log('[Event - PurchaseComplete] : ', newLog)
          dispatch(createLogActivity(activityCategories.CONFIRM_PURCHASE,
                                     Eth.toUtf8(result.args.purchaseId),
                                     Eth.toUtf8(result.args.itemId),
                                     '',
                                     result.args.buyer,
                                     result.args.seller)
          )
          dispatch({type: CREATE_PURCHASE, payload: {id: Eth.toUtf8(result.args.purchaseId), purchaseState: purchaseState.COMPLETED}})
        } else {
          console.log(error)
          dispatch({type: CREATE_PURCHASE, payload: {id: Eth.toUtf8(result.args.purchaseId), purchaseState: purchaseState.ERROR}})
        }
      })
    })
  }
}

// Watch block chain event
// When a buyer cancel a purchases before the item was shipped
export function watchCancelPurchaseEvent(provider) {
  const escrow = contract(escrowJSON)
  escrow.setProvider(provider.eth.currentProvider)

  return dispatch => {
    escrow.deployed().then(instance => {
      instance.PurchaseCancelled().watch(function(error, result) {
        if (!error) {
          const newLog = `[${result.args.sender}] cancels order ${Eth.toUtf8(result.args.itemId)}.`
          console.log('[Event - CancelPurchase] : ', newLog)
          var activityCategory = activityCategories.CANCEL_PURCHASE
          var cancelPurchaseState = purchaseState.BUYER_CANCELLED
          if (result.args.sender === result.args.seller) {
            activityCategory = activityCategories.CANCEL_SALES
            cancelPurchaseState = purchaseState.SELLER_CANCELLED
          }
          dispatch(createLogActivity(activityCategory,
                                     Eth.toUtf8(result.args.purchaseId),
                                     Eth.toUtf8(result.args.itemId),
                                     '',
                                     result.args.buyer,
                                     result.args.seller)
          )
          dispatch({type: CREATE_PURCHASE, payload: {id: Eth.toUtf8(result.args.purchaseId), purchaseState: cancelPurchaseState}})
        } else {
          console.log(error)
          dispatch({type: CREATE_PURCHASE, payload: {id: Eth.toUtf8(result.args.purchaseId), purchaseState: purchaseState.ERROR}})
        }
      })
    })
  }
}

// Watch block chain event
// Purchases is automatically cancelled if Item hasn't been shipped before the Shipping Deadline
export function watchShippingTimeoutEvent(provider) {
  const escrow = contract(escrowJSON)
  escrow.setProvider(provider.eth.currentProvider)

  return dispatch => {
    escrow.deployed().then(instance => {
      instance.ShippingTimeout().watch(function(error, result) {
        if (!error) {
          const newLog = `[${Eth.toUtf8(result.args.purchaseId)}] orders automatically cancelled for item ${Eth.toUtf8(result.args.itemId)}. Funds have been refunded to ${result.args.buyer}.`
          console.log('[Event - CancelPurchase] : ', newLog)
          dispatch(createLogActivity(activityCategories.SELLER_SHIPPING_TIMEOUT,
                                     Eth.toUtf8(result.args.purchaseId),
                                     Eth.toUtf8(result.args.itemId),
                                     '',
                                     result.args.buyer,
                                     result.args.seller)
          )
          dispatch({type: CREATE_PURCHASE, payload: {id: Eth.toUtf8(result.args.purchaseId), purchaseState: purchaseState.SELLER_SHIPPING_TIMEOUT}})
        } else {
          console.log(error)
          dispatch({type: CREATE_PURCHASE, payload: {id: Eth.toUtf8(result.args.purchaseId), purchaseState: purchaseState.ERROR}})
        }
      })
    })
  }
}

// Watch block chain event
// Purchases is automatically confirmed if Order hasn't been confirmed by buyer before X (customisable) days after shipping
export function watchConfirmationTimeoutEvent(provider) {
  const escrow = contract(escrowJSON)
  escrow.setProvider(provider.eth.currentProvider)

  return dispatch => {
    escrow.deployed().then(instance => {
      instance.ConfirmationTimeout().watch(function(error, result) {
        if (!error) {
          const newLog = `[${Eth.toUtf8(result.args.purchaseId)}] orders automatically confirmed for item ${Eth.toUtf8(result.args.itemId)}. Funds have been sent to ${result.args.seller}.`
          console.log('[Event - CancelPurchase] : ', newLog)
          dispatch(createLogActivity(activityCategories.BUYER_CONFIRMATION_TIMEOUT,
                                     Eth.toUtf8(result.args.purchaseId),
                                     Eth.toUtf8(result.args.itemId),
                                     '',
                                     result.args.buyer,
                                     result.args.seller)
          )
          dispatch({type: CREATE_PURCHASE, payload: {id: Eth.toUtf8(result.args.purchaseId), purchaseState: purchaseState.BUYER_CONFIRMATION_TIMEOUT}})
        } else {
          console.log(error)
          dispatch({type: CREATE_PURCHASE, payload: {id: Eth.toUtf8(result.args.purchaseId), purchaseState: purchaseState.ERROR}})
        }
      })
    })
  }
}



