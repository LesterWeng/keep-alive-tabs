import tabsController from './tabsController'
import { Tabs } from 'antd'
import React, { useEffect, useLayoutEffect, useMemo } from 'react'
import { IRouteComponentProps } from 'umi'
import matchPath from './matchPath'
import { matchRoutes } from 'react-router-config'
import { useForceUpdate } from './hooks'
import { isEqual } from 'lodash-es'

// 流程：history.push trigger -> window.location.pathname change -> useEffect 生成/切换tab

export default function KeepAliveTabs({ location, children }: IRouteComponentProps) {
  const forceUpdate = useForceUpdate()
  useLayoutEffect(() => {
    tabsController.init(forceUpdate)
    // 调试
    // @ts-ignore
    window.tabsController = tabsController
    return () => {
      tabsController.clean()
    }
  }, [forceUpdate])

  const pathname = window.location.pathname
  useLayoutEffect(() => {
    const [prevTab] = tabsController.findTab(pathname)
    if (prevTab) {
      const isSame =
        location.pathname === pathname
          ? isEqual(location.query, prevTab.content!.props.location.query)
          : true

      console.log(`isSame：${isSame}`)

      if (isSame) {
        tabsController.switchTab(pathname)
      } else {
        tabsController.switchTab(
          pathname,
          React.cloneElement(prevTab.content, {
            location,
          })
        )
      }
    } else {
      let element: any = null,
        match: any = null
      React.Children.forEach(children.props.children, (child) => {
        if (match === null && React.isValidElement(child)) {
          // @ts-ignore
          const path = child.props.path || child.props.from
          if (path) {
            element = child

            // @ts-ignore
            match = matchPath(location.pathname, { ...child.props, path })
          }
        }
      })

      if (match) {
        // 获取title
        const matchedRoutes = matchRoutes(children.props.children as any, location.pathname)
        const title = matchedRoutes?.[matchedRoutes.length - 1]?.route?.title || match.path

        tabsController.addTab({
          title,
          key: match.path,
          content: React.cloneElement(element, { location, computedMatch: match }),
        })
      }
    }

    // location仅在首次路由组件渲染时与pathname对应，使用useLayoutEffect避免在执行回调时pathname已改变
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const onEdit = (targetKey: any, action: 'remove' | 'add') => {
    if (action === 'remove') {
      tabsController.closeTab(targetKey)
    }
  }
  const onChange = (targetKey: string) => {
    tabsController.switchTab(targetKey)
  }

  return (
    <Tabs
      activeKey={tabsController.currentKey}
      type='editable-card'
      hideAdd
      onChange={onChange}
      onEdit={onEdit}>
      {tabsController.tabs.map(({ key, title, content }) => (
        <Tabs.TabPane key={key} tab={title} closable={!key.includes('/index')}>
          {content}
        </Tabs.TabPane>
      ))}
    </Tabs>
  )
}
