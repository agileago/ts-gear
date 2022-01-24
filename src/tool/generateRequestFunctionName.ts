import { camelCase, upperFirst } from 'lodash'
import type { GenerateRequestFunctionNameParameter } from '../type'

/** default generate request function method */
export const generateRequestFunctionName = ({ httpMethod, pathname }: GenerateRequestFunctionNameParameter) => {
  return `${httpMethod}${upperFirst(camelCase(pathname))}`
}
