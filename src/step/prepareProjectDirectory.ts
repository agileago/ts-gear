import { existsSync, writeFileSync } from 'fs'
import { join } from 'path'

import { sync } from 'mkdirp'

import type { Project } from '../type'

export const prepareProjectDirectory = (project: Project, tsGearConfigPath: string) => {
  const dest = join(tsGearConfigPath, project.dest, project.name)
  if (!existsSync(dest)) {
    sync(dest)
    if (project.useCache) {
      writeFileSync(join(dest, '.gitignore'), '.cache')
    }
  }
}
