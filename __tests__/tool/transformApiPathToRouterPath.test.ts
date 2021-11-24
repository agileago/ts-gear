import { transformApiPathToRouterPath } from 'src/tool/transformApiPathToRouterPath'

describe('transformApiPathToRouterPath', () => {
  it('path', () => {
    expect(transformApiPathToRouterPath('/abc/{id}')).toBe('/abc/:id')
    expect(transformApiPathToRouterPath('/{name}/{id}')).toBe('/:name/:id')

    expect(transformApiPathToRouterPath('/def/{id}/edit')).toBe('/def/:id/edit')
  })
})
