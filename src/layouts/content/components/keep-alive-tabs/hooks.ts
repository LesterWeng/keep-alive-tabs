import React, { useCallback, useState } from 'react'

export const useForceUpdate = () => {
  const [, setState] = useState({})

  const forceUpdate = useCallback(() => {
    setState({})
  }, [])

  return forceUpdate
}
