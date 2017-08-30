import React from 'react'
import { withRouter } from 'react-router-dom'

export default function(WrapperComponent) {
  return withRouter(
    (props) => {
      const nextRoute = (props.location.state && props.location.state.from) || '/'

      return (
        <WrapperComponent {...props} nextRoute={nextRoute} />
      )
    }
  )
}
