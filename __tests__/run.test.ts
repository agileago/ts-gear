import { join } from 'path'
import { run } from 'src/run'

describe('run', () => {
  it('with fixture', async () => {
    const cwd = process.cwd()
    await run({
      projects: [
        {
          name: 'petV3',
          dest: 'service',
          source: '../../fixture/petV3.json',
          importRequesterStatement: 'import { requester } from "../../requester"',
          EOL: '\n',
          withBasePath: true,
        },
      ],
      tsgConfigDirectory: join(cwd, 'example/petProject/src'),
    })
    expect(1).toBe(1)
  })
})
