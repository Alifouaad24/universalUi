import { CategoryModel } from './CategoryModel'

export class SizeModel {
  size_id: number = 0
  description: string = ''
  category_id: number = 0
  category: CategoryModel = new CategoryModel()

  constructor(init?: Partial<SizeModel>) {
    Object.assign(this, init)
  }
}
