const add = function (x: number, y: number, z?: number): number | undefined {
    if (typeof z === 'number') {
        return x + y + z
    } else {
        return x + y
    }
    return
}

const add2: (x: number, y: number, z?: number) => number = add
const add3 = add //typescrip 具有类型推论的功能


