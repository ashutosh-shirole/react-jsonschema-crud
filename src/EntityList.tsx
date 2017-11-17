import * as React from 'react';
import * as  FontAwesome from 'react-fontawesome';
import { Table, Button, ButtonGroup, Modal, Panel, Row, Col } from 'react-bootstrap';
import Form from "react-jsonschema-form";
import { IEntityService, IEntity } from './IEntityService'

export class EntityList extends React.Component<{entityService?: IEntityService<IEntity>, displayConfig: DisplayConfig },
    {showAddModal:boolean, showDeleteModal: boolean, selectedEntity:IEntity, entityList: Array<IEntity>, editing:boolean }> {

    constructor(props) {
        super(props)
        this.state = {showAddModal: false, showDeleteModal: false, selectedEntity: undefined, entityList: [], editing: false}
    }
    componentDidMount() {
        this.getAll();        
    }
    render() {
        const log = (type) => console.log.bind(console, type); 
        const formData = this.state.editing ? this.state.selectedEntity as IEntity : undefined
        return (
            <Panel header={
                (
                    <Row>
                        <Col md={10} xs={6}>{this.props.displayConfig.name}s</Col>
                        <Col md={12} xs={6}>
                            <Button bsStyle="primary" onClick={() => this.setState({showAddModal : true})}>
                                <FontAwesome name="plus"/>
                            </Button>
                        </Col>
                    </Row>
                )
            }>                
                <Table striped bordered condensed hover responsive>
                    <thead>
                        <tr>
                            {this.props.displayConfig.columns.map((col, idx) => (<th key={idx}>{col.name}</th>))}   
                            <th></th>                         
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.entityList.map((field, idx) => {
                            return (
                                <tr key={idx}>
                                    {this.props.displayConfig.columns.map((col, iidx) => (<td key={iidx}>{col.renderer ? col.renderer(field[col.name]) : field[col.name] }</td>))}                                    
                                    <td>
                                        <ButtonGroup>
                                            <Button bsStyle="primary" onClick={() => this.startEditing(field)}>
                                                <FontAwesome name="edit"/>
                                            </Button>                                        
                                            <Button bsStyle="danger" onClick={() => this.startDeleting(field)}>
                                                <FontAwesome name="remove"/>
                                            </Button>                                        
                                        </ButtonGroup>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>                
                <Modal show={this.state.showAddModal} onHide={this.close.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.editing ? "Edit " : "Add new "}{this.props.displayConfig.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form schema={this.props.displayConfig.schema} 
                            uiSchema={this.props.displayConfig.uiSchema} 
                            onSubmit={this.add.bind(this)} 
                            formData={formData}
                            widgets={this.props.displayConfig.widgets}
                            onError={log("errors")} />
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showDeleteModal} onHide={this.close.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete {this.props.displayConfig.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close.bind(this)}>Cancel</Button>
                        <Button onClick={this.delete.bind(this)} bsStyle="primary">Delete</Button>
                    </Modal.Footer>
                </Modal>
            </Panel>            
        )
    }

    private getAll() {
        this.props.entityService.fetchAll().then((entityList) => this.setState({entityList: entityList}))
    }
    
    private startEditing(field: IEntity) {        
        if(this.props.entityService.beforeEditing){
            field = this.props.entityService.beforeEditing(field)
        }                        
        this.setState({showAddModal: true, selectedEntity: field, editing: true})
    }

    private startDeleting(field: IEntity) {                                       
        this.setState({showDeleteModal: true, selectedEntity: field})
    }

    private close() {
        this.getAll()
        this.setState({showAddModal: false, selectedEntity: undefined, editing: false, showDeleteModal: false})                
    }

    private add(type: any) {
        let formData: IEntity = type.formData
        if(this.props.entityService.beforeSave){
            formData = this.props.entityService.beforeSave(formData)
        }
        if(this.state.editing){
            this.props.entityService.update(formData).then(() => this.close())
        } else {
            this.props.entityService.add(formData).then(() => this.close())
        }
    }

    private delete() {
        this.props.entityService.delete(this.state.selectedEntity).then(() => this.close())
    }
}

export class ColumnConfig {
    name: string
    renderer?: (field:any) => JSX.Element
    constructor(name: string, renderer?:(field:any) => JSX.Element) {
        this.name = name
        this.renderer = renderer
    }
}

export class DisplayConfig {
    name: string
    schema: any
    uiSchema: any
    columns: Array<ColumnConfig>
    widgets?: any

    constructor(name:string, schema: any, uiSchema:any, columns: Array<ColumnConfig>, widgets?:any) {
        this.name = name
        this.schema = schema
        this.uiSchema = uiSchema
        this.columns = columns
        this.widgets = widgets
    }
}