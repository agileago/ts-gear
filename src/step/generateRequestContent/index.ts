import { EOL } from 'os'

import join from 'url-join'
import { FunctionDeclarationStructure, OptionalKind } from 'ts-morph'
import { Spec } from 'swagger-schema-official'

import { generateParameterType } from './generateParameterType'
import { generateResponseType } from './generateResponseType'

import { IProject } from 'src/interface'
import { sow, harvest } from 'src/source'
// import { schemaToTypescript } from 'src/tool/schemaToTypescript'
import { transformSwaggerPathToRouterPath } from 'src/tool/transformSwaggerPathToRouterPath'
import { requestMap } from 'src/global'
import { assembleDoc } from 'src/tool/assembleDoc'

/** 将paths里的各种请求参数组装成IProperty的数据结构 */
export const generateRequestContent = (spec: Spec, project: IProject) => {
  const { pathMatcher, withBasePath, withHost } = project

  const resultContent: string[] = []
  for (const requestFunctionName in requestMap) {
    const request = requestMap[requestFunctionName]
    const { httpMethod } = request
    if (pathMatcher) {
      if (typeof pathMatcher === 'function') {
        if (!pathMatcher(request.pathName, httpMethod)) {
          continue
        }
      } else if (!pathMatcher.test(request.pathName)) {
        continue
      }
    }

    let parameterTypeName = ''
    if (request.parameters) {
      const parameterType = generateParameterType(requestFunctionName, request.parameters)
      parameterTypeName = parameterType.parameterTypeName
      resultContent.push(parameterType.parameterTypeContent)
    }
    const responseType = generateResponseType(requestFunctionName, request.responses)
    resultContent.push(responseType.responseTypeContent)
    resultContent.push(responseType.successTypeContent)
    const urlPath = join(spec.basePath || '', transformSwaggerPathToRouterPath(String(request.pathName)))
    const source = sow()
    const functionStatment = `return requester('${urlPath}', {${withHost ? `, host: '${spec.host}'` : ''}${
      withBasePath ? `, basePath: '${spec.basePath}'` : ''
    }method: '${httpMethod}'${parameterTypeName ? ', ...option' : ''}})`
    const functionData: OptionalKind<FunctionDeclarationStructure> = {
      name: requestFunctionName,
      isExported: true,
      returnType: `Promise<${responseType.successTypeName}>`,
      statements: functionStatment,
      docs: assembleDoc(request.schema),
    }
    functionData.parameters = []
    if (parameterTypeName) {
      functionData.parameters.push({
        name: 'option',
        type: parameterTypeName,
      })
    }
    source.addFunction(functionData)
    resultContent.push(harvest(source))
  }

  return resultContent.join(EOL)
}
