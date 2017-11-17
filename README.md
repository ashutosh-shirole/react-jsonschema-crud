react-jsonchema-crud
====================

A simple [React](http://facebook.github.io/react/) component to build CRUD form using [JSON schema](http://jsonschema.net/). It is based on [react-jsonschema-form](https://github.com/mozilla-services/react-jsonschema-form) and is kind of extension to it. It also depends on [react-fontawesome](https://github.com/danawoodman/react-fontawesome). Mainly to be used with [typescript](https://www.typescriptlang.org/), but can also be used without ts with some small modifications.

## Installation

Requires react-jsonschema-form and all dependencies required by it.

### As a npm-based project dependency

```
$ npm install react-jsonschema-crud --save
```

## Usage
Following example uses [typescript](https://www.typescriptlang.org/) (that is a personal preference :)

```jsx
import * as React from 'react';
import { TodoService } from './TodoService'
import { EntityList, ColumnConfig, DisplayConfig } from 'react-jsonschema-crud'

export class TodoList extends React.Component<{TodoService?: todoService, columns: Array<string>},{}> {
   
    render() {                       
        const schema = {
            title: "Todo",
            type: "object",
            required: ["title"],
            properties: {
                id: {type: "integer"}
                title: {type: "string", title: "Title", default: "A new task"},
                status: {type: "boolean", title: "Done?", default: false}
            }
        }
        const columns: Array<ColumnConfig> = [
            new ColumnConfig("title"),
            new ColumnConfig("status", (status) => (<FontAwesome name={status ? "check" : "remove"}/>)),
            new ColumnConfig("check"),
        ]
        const uiSchema = {
            "ui:order": ["todo", "status"],
            "id": {
                "ui:widget": "hidden"
            }
        };
        const displayConfig: DisplayConfig = new DisplayConfig("TODO",schema, uiSchema, columns)
        return (<EntityList entityService={this.props.todoService} displayConfig={displayConfig}/>)
    }
}
```

```ts
import { IEntityService, IEntity } from 'react-jsonschema-crud'

export class Todo extends IEntity{
    title: string.
    status: boolean
}

export class TodoService implements IEntityService<Todo>{

    add(field: Todo): Promise<any> {        
        return new Promise((resolve,reject) => resolve("added successfully"))
    }

    update(field: Todo): Promise<any> {
        return new Promise((resolve,reject) => resolve("updated successfully"))
    }

    fetchAll(): Promise<Array<Todo>> {
        return new Promise((resolve,reject) => resolve(getDummy()))
    }        

    getDummy(): Array<Todo> {
        return [
            {
                title: "Create repository",
                status: true
            } as Todo,
            {
                title: "Create repository",
                status: false
            } as Todo,
            {
                title: "Push",
                status: false
            } as Todo
        ]
    }

    delete(field: Todo): Promise<any> {
        return new Promise((resolve,reject) => resolve("deleted successfully"))
    }
}

```

## API
### DisplayConfig

Following are the options allowed in DisplayConfig object
```ts
class DisplayConfig {
    name: string // Name to be displayed on list screen and on all modals
    schema: any // The JSONSchema
    uiSchema: any // The ui schema for react-jsonschema-form
    columns: ColumnConfig[] // array of ColumnConfig objects described below
    widgets?: any // optional widgets if any for react-jsonschema-form
}
```

### ColumnConfig

Following are the options allowed in ColumnConfig object
```ts
class ColumnConfig {
    name: string // Name to be displayed in list table
    renderer?: (field:any) => JSX.Element // Optional Component to be rendered for this column in list table
}
```

### TodoService

A Service that performs different operations. This service should have following methods implemented (in ts the following interface has to be implemented). The actions to be performed are as the name suggests and the return type is also mentioned.

```ts
interface IEntityService<IEntity> {
    fetchAll(): Promise<Array<IEntity>>
    add(entity:IEntity): Promise<any>
    update(entity:IEntity): Promise<any>
    beforeEditing?(entity: IEntity): IEntity // optional function called before edit modal opens
    beforeSave?(entity: IEntity): IEntity // optional function called before add/update
    delete(entity: IEntity): Promise<any>
}
```

## License
MIT
