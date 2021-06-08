import { ReactElement } from 'react'

type Tab = {
  key: string
  title: string
  content: ReactElement
}

class TabsController {
  constructor() {}

  forceUpdates: Function[] = []
  tabs: Tab[] = []
  historyQueue: string[] = []

  init(forceUpdate: Function) {
    this.forceUpdates.push(forceUpdate)
  }
  clean() {
    this.forceUpdates = []
    this.tabs = []
    this.historyQueue = []
  }

  get currentKey() {
    return this.historyQueue[this.historyQueue.length - 1]
  }
  hasTab(key: string) {
    const [tab] = this.findTab(key)
    return !!tab
  }
  findTab(key: string): [Tab | null, number] {
    for (let index = 0; index < this.tabs.length; index++) {
      if (this.tabs[index].key === key) {
        return [this.tabs[index], index]
      }
    }
    return [null, -1]
  }

  triggerUpdate() {
    this.forceUpdates.forEach((forceUpdate) => forceUpdate())
  }
  addTab(tab: Tab) {
    this.tabs.push(tab)

    this.switchTab(tab.key)
  }
  closeTab(key: string) {
    const [tab, index] = this.findTab(key)
    this.tabs.splice(index, 1)

    const historyIndex = this.historyQueue.findIndex((historyKey) => historyKey === key)
    this.historyQueue.splice(historyIndex, 1)

    this.switchTab(this.currentKey)
  }
  switchTab(key: string, content?: Tab['content']) {
    const [tab] = this.findTab(key)
    if (!tab) {
      console.warn(`进行switch的tab:${key}不存在`)
      return
    }

    if (content) {
      tab!.content = content
    }

    const historyIndex = this.historyQueue.findIndex((historyKey) => historyKey === key)
    if (historyIndex > -1) {
      this.historyQueue.splice(historyIndex, 1)
    }
    this.historyQueue.push(key)
    window.history.pushState({}, '', key)
    this.triggerUpdate()
  }
}

export default new TabsController()
