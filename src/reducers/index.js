import { combineReducers } from 'redux'
import { createReducer } from 'redux-orm';
import { orm } from '../models/orm'

import { currentUserWalletReducer, selectedUserWalletReducer } from './reducer_users'
import selectedItemIdReducer from './reducer_items'
import selectedPurchaseIdReducer from './reducer_purchases'
import flashMessagesReducer from './reducer_flash_messages'
import providerReducer from './reducer_provider'

const rootReducer = combineReducers({
  provider: providerReducer,
  currentUserWallet: currentUserWalletReducer,
  selectedUserWallet: selectedUserWalletReducer,
  selectedItemId: selectedItemIdReducer,
  flashMessages: flashMessagesReducer,
  selectedPurchaseId: selectedPurchaseIdReducer,
  orm: createReducer(orm)
})

export default rootReducer
