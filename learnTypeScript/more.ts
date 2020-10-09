jQuery

//类型别名
type PlusType = (x: number, y: number) => number

function sum(x: number, y: number) : number {
    return x + y
}
const sum2: (x: number, y: number) => number = sum

type NameResolver = () => string  // 类型是个方法， 返回字符串
//联合类型
type NameOrResolver = string | NameResolver 
function getName(n: NameOrResolver) : string {
    if (typeof n === 'string') {
        return n
    } else {
        return n()
    }
}

function getLength(input: string | number) : number {
    //类型断言
    // const str = input as String 
    // if (str.length) {
    //     return str.length
    // } else {
    //     const number = input as Number
    //     return number.toString().length
    // }

    //类型断言-简写
    if ((<string>input).length) {
        return (<string>input).length
    } else {
        return input.toString().length
    }
}