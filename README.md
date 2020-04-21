# ts-gear

## Motivation

Ts-geart can be used to generate typescript data interface and request function from swagger.

With this tool you will know any changes in swagger in a more convenient way.

## [中文文档](./README.zh-CN.md)

## V2 changes

* configureable requester option, "fetch" and "axios" is provided out of box.
* configureable translate engine.
* every project has identical "dest" directory.
* every project has identical "withHost" and "withBasePath" option.

## coverage

### Statements

![Statements](./coverage/badge-statements.svg)

### Branches

![Branches](./coverage/badge-branches.svg)

### Functions

![Functions](./coverage/badge-functions.svg)

### Lines

![Lines](./coverage/badge-lines.svg)

### process step

* read user config file.

* filter projects by name if there are command line params.

* fetch each project swagger doc.

* translate if transate engine is assigned.

* format unregular charators in $ref and definitions.

* process generic type names.

* assemble requests and definitions to global map variables.

* prepare project dest directory.

* generate and write request.

* generate and write definitions.

* generate and write mock request.

* write project directory "index.ts".

## Origin

inspired by [pont](https://github.com/alibaba/pont)，pont means bridge in franch. I name this tool to `ts-gear`，means the gear between typescript and swagger，hope it can merge front and server better.

![logo](./logo.png)

## Similar packages

* [pont](https://github.com/alibaba/pont)

* [OpenAPI Generator](https://openapi-generator.tech/)

    It has many languages support. I try it and read the generated ts files and found it need more compatibility efferts for non-standard swagger doc support.

* [oazapfts](https://github.com/cellular/oazapfts)

    almost the same as this project.

## Note

Support OpenAPI Specification v2.

your swagger doc should has this field.

```json
{
  "swagger": "2.0",
  ...
}
```

## Usage

### Install

```bash
yarn add ts-gear -D
// or
npm install ts-gear -D
```

### Config

Write a config file for ts-gear in your project root path first.

Ts or js version all supported, `ts-gear.js` or `ts-gear.ts`，`ts` version recommanded.

typescript example

```typescript
import { IUserConfig } from 'ts-gear/bin/interface'

const config: IUserConfig = {
  // dest directory for swagger interface files
  dest: './service',
  // each projects config
  projects: [
    {
      // each project name will generate to a real directory in service directory defined in 'dest'
      name: 'pet',
      // source could be a local json file, or remote swagger doc url(starts with 'http')
      source: '__tests__/fixture/pet.json',
      // pathMatcher is optional
      // pathMatcher can be a regexp, or a function use url as its param and return boolean
      pathMatcher: /^\/api/, // for example, only generate those url starts with `/api`
    },
    {
      name: 'projectA',
      source: 'http://192.168.1.111/v2/api-docs',
      // fetchOption is optional，you can add some fetch option to request the remote swagger doc url，
      // fetchOption is optional，you can add some fetch option to request the remote swagger doc url，
      // its the same of the build in fetch option param.
      fetchOption: {
        header: {
          Authorization: 'your token ...',
          ...
        }
        ...
      },
      // pathMatcher is optional
      // pathMatcher function type
      pathMatcher: url => url.startsWith('/api'),
    },
  ],
}

export default config
```

javascript version example

```javascript
const config = {
  // dest directory for swagger interface files
  dest: './service',
  // each projects config
  projects: [
    {
      // each project name will generate to a real directory in service directory defined in 'dest'
      name: 'pet',
      // source could be a local json file, or remote swagger doc url(starts with 'http')
      source: '__tests__/fixture/pet.json',
      // pathMatcher is optional
      // pathMatcher can be a regexp, or a function use url as its param and return boolean
      pathMatcher: /^\/api/, // for example, only generate those url starts with `/api`
    },
    {
      name: 'projectA',
      source: 'http://192.168.1.111/v2/api-docs',
      // fetchOption is optional，you can add some fetch option to request the remote swagger doc url，
      // its the same of the build in fetch option param.
      fetchOption: {
        header: {
          Authorization: 'your token ...',
          ...
        }
        ...
      },
      pathMatcher: url => url.startsWith('/api'),
    },
  ],
}

module.exports = config
```

### Execute

```bash
npx tsg 
// or
yarn tsg
// or if only need update one project, use -p for the project name
npx tsg -p pet
```

Use the config above for example
ts-gear will generate directory as below.
or see the example directory in this project.

```bash
▾ service/
  ▾ pet/
      definitions.ts
      fetchInterceptor.ts
      request.ts
      index.ts
  ▾ projectA/
      definitions.ts
      fetchInterceptor.ts
      request.ts
      index.ts
```

* The `definitions.ts` is generated by the `definitions` part of `swagger schema`, it is all the base interface.

* The `request.ts` is generated by the `paths` part of `swagger schema`，the naming method is `http request + api path`，for example

```javascript
  "paths": {
    "/pet": {
      "post": {
      ...
      },
    },
    // will generate `postPet` request function
    "/pet/findByTags": {
      "get": {
      ...
      },
    },
    // will generate 'getPetFindByTags' request function
    "/pet/{petId}": {
      "get": {
      ...
      },
    },
```

Each request function param type and return type will map to the swagger definition.

![type generated example](./example/pet.gif)

### How to use it in your project

After the command line operation, use the generated file in `service` directory.

For example:

```javascript
import { getPetPetId } from 'service/pet'

getPetPetId({
  path: {
    petId: 1
  }
}).then(pet => {
  console.log(pet)
  // pet will be the instance of Pet, it has Pet properties.
})

```

If you prefer to use your faverite request tool, like `axios`, you can only use the `definitions.ts` to check data interface.

#### Use `mockRequest.ts`

There will be a `mockRequest.ts` with `request.ts` generated in same time.

The `mockRequest.ts` has all the same type with `request.ts`, but it could generated mock data rather than real fetch the remote url.

It could be used in dev mode when the server side is not ready.

Use it when import.

```typescript
import { getPetPetId } from 'service/pet/mockRequest'
```

After server side ready, change it to import the real `request.ts`

```typescript
import { getPetPetId } from 'service/pet/request'
```

In `mockRequest`, it will throw error when `process.env.NODE_ENV === 'production'`, to prevent it be published to the production env.

* 🔧 `interceptor.ts` copied from `ts-gear` template, it will be invoked by all request function in `request.ts`.

  The `interceptRequest` method will be invoked to do something before the request，and the `interceptResponse` will be used to do some transform after the data is received from server side.

  🔑🔑🔑 The `interceptor.ts` will be generated only once when the project directory is created，and will not be overwriten later. It can be used for some permanent data transform logic. Other files will be overwriten.

## Develop steps

* First inspired by pont and then check if all ts types could be mapped to swagger definition type.

* I used pont at first, but that time pont is not very robust and less doc. So I make a simple version tool to implement this idea for my projects.

* Use [ts-morph](https://dsherret.github.io/ts-morph) for ts type generating.

* [More](./DEV.md)

## Errata And Feedback

This tool only has the `swagger ui` pet fixture and my projects swagger schema for dev fixtures.  Welcompe to add more fixtures and issue.

## TODO

* add more open api 3.0 test fixture.

* Add other not 200 type in `responses` to `fetch.then<T1, T2>，T2` T2 position.
