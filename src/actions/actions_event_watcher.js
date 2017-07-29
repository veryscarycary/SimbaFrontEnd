import { default as contract } from 'truffle-contract'
import Eth from 'ethjs'
import escrowJSON from '../contract_build/Escrow.json'

import { UPDATE_PURCHASE } from './actions_purchases'
import { createLogActivity } from './actions_activities'
import { purchaseState, activityCategories } from '../containers/shared/PurchaseState'

// Watch block chain event : Item purchase
export function watchPurchaseEvent(provider, history) {
  const escrow = contract(escrowJSON)
  escrow.setProvider(provider.eth.currentProvider)

  return dispatch => {
    escrow.deployed().then(instance => {
    instance.ItemPurchased().watch(function(error, result) {
      if (!error) {
        const newLog = `[${result.args.sender}] purchased ${Eth.toUtf8(result.args.purchaseId)} for ${Eth.fromWei(result.args.amount, 'ether')} ETH`
        console.log('[Event - ItemPurchased] : ', newLog)
        dispatch(createLogActivity(activityCategories.PURCHASE,
                                   Eth.toUtf8(result.args.purchaseId),
                                   Eth.toUtf8(result.args.itemId),
                                   Eth.fromWei(result.args.amount, 'ether'),
                                   result.args.buyer,
                                   result.args.seller)
        )
        dispatch({type: UPDATE_PURCHASE, payload: {id: Eth.toUtf8(result.args.purchaseId), purchaseState: purchaseState.PURCHASED}})
        history.push(`/purchases/initialize/${Eth.toUtf8(result.args.purchaseId)}`)
      } else {
        console.log("ItemPurchased error : ", error)
        dispatch({type: UPDATE_PURCHASE, payload: {id: Eth.toUtf8(result.args.purchaseId), purchaseState: purchaseState.ERROR}})
      }
    })
  })
  }
}

// Watch block chain event : User shipped item and send code (i.e : tracking number)
export function watchShippingEvent(provider) {
  const escrow = contract(escrowJSON)
  escrow.setProvider(provider.eth.currentProvider)

  return dispatch => {
    escrow.deployed().then(instance => {
      instance.ItemShipped().watch(function(error, result) {
        if (!error) {
          const newLog = `[${result.args.sender}] shipped ${Eth.toUtf8(result.args.itemId)} - Tracking Number : ${Eth.toUtf8(result.args.code)}`
          console.log('[Event - ItemShipped] : ', newLog)
          dispatch(createLogActivity(activityCategories.SHIP_ITEM,
                                     Eth.toUtf8(result.args.purchaseId),
                                     Eth.toUtf8(result.args.itemId),
                                     Eth.toAscii(result.args.code),
                                     result.args.buyer,
                                     result.args.seller)
          )
          dispatch({type: UPDATE_PURCHASE, payload: {id: Eth.toUtf8(result.args.purchaseId), purchaseState: purchaseState.SHIPPED}})
        } else {
          console.log("ItemShipped error : ", error)
          dispatch({type: UPDATE_PURCHASE, payload: {id: Eth.toUtf8(result.args.purchaseId), purchaseState: purchaseState.ERROR}})
        }
      })
    })
  }
}

// Watch block chain event : User confirm the purchase closing the transaction and paying the seller
export function watchPurchaseCompleteEvent(provider) {
  const escrow = contract(escrowJSON)
  escrow.setProvider(provider.eth.currentProvider)

  return dispatch => {
    escrow.deployed().then(instance => {
      instance.PurchaseCompleted().watch(function(error, result) {
        if (!error) {
          const newLog = `[${result.args.sender}] confirms receiving ${Eth.toUtf8(result.args.itemId)}. The transaction is complete.`
          console.log('[Event - PurchaseComplete] : ', newLog)
          dispatch(createLogActivity(activityCategories.CONFIRM_PURCHASE,
                                     Eth.toUtf8(result.args.purchaseId),
                                     Eth.toUtf8(result.args.itemId),
                                     '',
                                     result.args.buyer,
                                     result.args.seller)
          )
          dispatch({type: UPDATE_PURCHASE, payload: {id: Eth.toUtf8(result.args.purchaseId), purchaseState: purchaseState.COMPLETED}})
        } else {
          console.log("ItemShipped error : ", error)
          dispatch({type: UPDATE_PURCHASE, payload: {id: Eth.toUtf8(result.args.purchaseId), purchaseState: purchaseState.ERROR}})
        }
      })
    })
  }
}
