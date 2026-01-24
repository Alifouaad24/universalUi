export class CategoryModel {
    category_id: number = 0
    name: string = ''

    constructor(init?: Partial<CategoryModel>){
        Object.assign(this, init)
    }
}