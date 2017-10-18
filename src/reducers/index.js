import { combineReducers } from 'redux'
import { createReducer } from 'redux-orm';
import { orm } from '../models/orm'

import { currentUserWalletReducer, selectedUserWalletReducer } from './reducer_users'
import selectedItemIdReducer from './reducer_items'
import selectedPurchaseIdReducer from './reducer_purchases'
import flashMessagesReducer from './reducer_flash_messages'
import notificationsReducer from './reducer_notifications'

const rootReducer = combineReducers({
  currentUserWallet: currentUserWalletReducer,
  selectedUserWallet: selectedUserWalletReducer,
  selectedItemId: selectedItemIdReducer,
  flashMessages: flashMessagesReducer,
  selectedPurchaseId: selectedPurchaseIdReducer,
  notifications: notificationsReducer,
  orm: createReducer(orm)
})

export default rootReducer
