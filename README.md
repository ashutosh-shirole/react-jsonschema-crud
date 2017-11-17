react-jsonchema-crud
====================

A simple [React](http://facebook.github.io/react/) component to build CRUD form using [JSON schema](http://jsonschema.net/). It is based on [react-jsonschema-form](https://github.com/mozilla-services/react-jsonschema-form) and is kind of extension to it. It also depends on [react-fontawesome](https://github.com/danawoodman/react-fontawesome). Mainly to be used with [typescript](https://www.typescriptlang.org/), but can also be used without ts with some small modifications.

[live demo](https://ashutosh-shirole.github.io/react-jsonschema-crud/)

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
import * as FontAwesome from 'react-fontawesome'
import { Col, Row} from 'react-bootstrap'
import { TodoService } from './TodoService'
import { EntityList, ColumnConfig, DisplayConfig } from 'react-jsonschema-crud'

class App extends React.Component {
    render() {                       
        const schema = {
            title: "Todo",
            type: "object",
            required: ["title"],
            properties: {
                id: {type: "integer"},
                title: {type: "string", title: "Title", default: "A new task"},
                status: {type: "boolean", title: "Done?", default: false}
            }
        }
        const todoService = new TodoService()
        const columns: Array<ColumnConfig> = [
            new ColumnConfig("title"),
            new ColumnConfig("status", (status) => (<FontAwesome name={status ? "check" : "remove"}/>)),
            new ColumnConfig("check"),
        ]
        const uiSchema = {            
            "id": {
                "ui:widget": "hidden"
            }
        };
        const displayConfig: DisplayConfig = new DisplayConfig("TODO",schema, uiSchema, columns)
        return (
            <div className="App">
                <div className="App-header">
                    <h2>react-jsonschema-crud</h2>
                </div>
                <div className="App-intro container jumbotron">
                    <Row>
                        <Col xs={8} xsOffset={2}>                    
                            <EntityList entityService={todoService} displayConfig={displayConfig}/>
                        </Col>
                    </Row>
                </div>
            </div>            
        )
    }
}

export default App;
```

```ts
import { IEntityService, IEntity } from 'react-jsonschema-crud'

export class Todo implements IEntity{
    id: number
    title: string
    status: boolean
}

export class TodoService implements IEntityService<Todo>{

    private todoList: Array<Todo> = [
        {
            id: 0,
            title: "Create repository",
            status: true
        } as Todo,
        {
            id: 1,
            title: "Create README",
            status: false
        } as Todo,
        {
            id: 2,
            title: "Push",
            status: false
        } as Todo
    ]

    add(field: Todo): Promise<any> {        
        return new Promise((resolve,reject) => {
            let max = this.todoList.reduce( (a, b) => a.id > b.id ? a : b ).id || 0
            field.id = max + 1
            this.todoList.push(field)
            resolve("added successfully")
        })
    }

    update(field: Todo): Promise<any> {
        return new Promise((resolve,reject) => {
            let todo = this.todoList.find((t) => t.id == field.id )
            if(todo) {
                todo.title = field.title
                todo.status = field.status
            }
            resolve("updated successfully")
        })
    }

    fetchAll(): Promise<Array<Todo>> {
        return new Promise((resolve,reject) => resolve(this.getDummy()))
    }        

    getDummy(): Array<Todo> {
        return this.todoList;
    }

    delete(field: Todo): Promise<any> {
        return new Promise((resolve,reject) => {
            let idx = this.todoList.findIndex(t => t.id == field.id)
            this.todoList.splice(idx, 1)
            resolve("deleted successfully")
        })
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
