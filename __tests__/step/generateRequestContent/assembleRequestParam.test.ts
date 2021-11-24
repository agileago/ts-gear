import { assembleRequestParam } from 'src/step/generateRequestContent/assembleRequestParam'

describe('assembleRequestParam', () => {
  it('body parameter', () => {
    const queryResult = assembleRequestParam([
      {
        in: 'body',
        name: 'body',
        required: true,
        schema: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
      {
        in: 'path',
        name: 'id',
        required: true,
        type: 'string',
      },
      {
        in: 'query',
        name: 'status',
        required: true,
        type: 'string',
      },
    ])
    console.log(JSON.stringify(queryResult, null, 2))
  })
})
