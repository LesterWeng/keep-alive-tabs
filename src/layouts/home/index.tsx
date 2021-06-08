import React, { useEffect, useMemo } from 'react'
import { IRouteComponentProps } from 'umi'
import styles from './index.less'

export default function Home(props: IRouteComponentProps) {
  const { history } = props

  return (
    <div style={{ padding: 18 }}>
      <h1>Home Index</h1>
      <div>
        <button onClick={() => history.push('/content/index')}>进入 content</button>
      </div>
    </div>
  )
}
