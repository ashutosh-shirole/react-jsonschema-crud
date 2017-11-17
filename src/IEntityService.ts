export interface IEntityService<IEntity> {
    fetchAll(): Promise<Array<IEntity>>
    add(entity:IEntity): Promise<any>
    update(entity:IEntity): Promise<any>
    beforeEditing?(entity: IEntity): IEntity 
    beforeSave?(entity: IEntity): IEntity
    delete(entity: IEntity): Promise<any>
}

export interface IEntity {

}