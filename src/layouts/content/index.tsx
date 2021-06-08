import React, { useEffect, useMemo } from 'react'
import { IRouteComponentProps } from 'umi'
import styles from './index.less'
import KeepAliveTabs from '@/layouts/content/components/keep-alive-tabs'

export default function Content(props: IRouteComponentProps) {
  const { history } = props

  return (
    <div style={{ padding: 18 }}>
      <div>
        <h1>Content Index</h1>
        <button onClick={() => history.push('/content/a')}>打开a</button>
        <button onClick={() => history.push('/content/b')}>打开b</button>
      </div>
      <KeepAliveTabs {...props}></KeepAliveTabs>
    </div>
  )
}
