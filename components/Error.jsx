import React from 'react'
import { useRouteError } from 'react-router'

export default function Error() {
  const error = useRouteError();
  let fullMessage = error.status +" : "+ error.statusText;
  return (
    <div><h1>{fullMessage}</h1></div>
  )
}
