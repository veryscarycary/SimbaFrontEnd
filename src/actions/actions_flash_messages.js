export const SET_FLASH_MESSAGE = 'SET_FLASH_MESSAGE'

export function setFlashMessage(message, type) {
  return {
    type: SET_FLASH_MESSAGE,
    payload: { message: message, type: type }
  }
}
