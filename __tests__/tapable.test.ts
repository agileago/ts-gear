import { SyncWaterfallHook } from 'tapable'

describe('try tapable', () => {
  it('SyncWaterfallHook', () => {
    const hook = new SyncWaterfallHook<string>(['name'])
    hook.tap('aaa', n => {
      return `${n}1`
    })
    hook.tap('bbb', n => {
      return `${n}2`
    })

    const r = hook.call('xxx')
    expect(r).toBe('xxx12')
  })

  it('SyncWaterfallHook when no hook taped', () => {
    const hook = new SyncWaterfallHook<string>(['name'])
    const r = hook.call('xxx')
    expect(r).toBe('xxx')
  })
})
