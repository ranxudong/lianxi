let isDone: boolean = false

let age: number = 20
let binaryNumer: number = 0b1111

let firstName: string = '冉旭东'
let messige: string = `Hello ${firstName}, arg is ${age}`

let u: undefined = undefined
let n: null = null

let num: number = undefined

//any 可以任意声明类型
let notSure: any = 4
notSure = 'ran'
notSure = false

let numberString: number | string = 123
numberString = 'abc'

let arrOfNumbers: number[] = [1,2,3,4]
arrOfNumbers.push(5);

let user: [string, number] = ['ran', 1]
user = ['1', 3]


