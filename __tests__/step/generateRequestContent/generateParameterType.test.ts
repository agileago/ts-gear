import type { Parameter, Spec } from 'swagger-schema-official'
import { cloneDeep } from 'lodash'
import { generateRequestOptionType } from 'src/step/generateRequestContent/generateRequestOptionType'
import * as petSpec from 'example/fixture/pet.json'
import * as step from 'src/step'
import { restore } from 'src/projectGlobalVariable'
import type { Project } from 'src/type'

describe('src/step/generateRequestContent/generateParameterType', () => {
  const project: Project = {
    name: 'pet',
    dest: './service',
    source: 'fixture/pet.json',
    importRequesterStatement: 'import { requester } from "ts-gear/requester/fetch"',
  }
  it('generateParameterType case 1', () => {
    const spec = cloneDeep(petSpec) as Spec
    step.cleanRefAndDefinitionName(spec, true)
    step.assembleSchemaToGlobal(spec, project)
    const content = generateRequestOptionType(
      'postUserCreateWithList',
      spec.paths['/user/createWithList'].post!.parameters as Parameter[],
      project,
    )
    expect(content).toMatchSnapshot()
    restore(project)
  })

  it('generateParameterType case 2', () => {
    const spec = cloneDeep(petSpec) as Spec
    step.cleanRefAndDefinitionName(spec, true)
    step.assembleSchemaToGlobal(spec, project)
    const content = generateRequestOptionType(
      'postUserCreateWithList',
      spec.paths['/user/createWithList'].post!.parameters as Parameter[],
      project,
    )
    expect(content).toMatchSnapshot()
    restore(project)
  })
})
