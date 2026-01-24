export class ColorModel {
    colorId: number = 0
    name: string = ''

    constructor(init?: Partial<ColorModel>) {
        Object.assign(this, init)
    }
}