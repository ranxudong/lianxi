/**
 * 范型
 */
function echo<T>(arg: T): T {
    return arg
}

const result = echo('str')
const result1 = echo(123)
const result2 = echo(true)

function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]]
}
const result3 = swap(['123', 123])


function echoWithArr<T>(arg: T[]): T[] {
    console.log(arg.length)
    return arg
}
const arrs = echoWithArr([1,2])

interface IWitchLength {
    length: number;
}

/**
 * 
 * @param arg 约束泛型
 */
function echoWithLength<T extends IWitchLength>(arg: T): T {
    console.log(arg.length)
    return arg
}
const str = echoWithLength('str')
const obj = echoWithLength({length: 10})
const arr = echoWithLength([1,2,3])

class Queue<T> {
    private data = [];
    push(item: T) {
        return this.data.push(item)
    }
    pop(): T {
        return this.data.shift()
    }
}

const queue = new Queue<number>()
queue.push(1)
queue.push(2)
console.log(queue.pop().toFixed())
console.log(queue.pop().toFixed())

const queue2 = new Queue<string>()
queue2.push('str')
console.log(queue2.pop())

interface KeyPair<T, U> {
    key: T,
    value: U
}

let kp1: KeyPair<number, string> = {key: 1, value: '123'}
let kp2: KeyPair<string, number> = {key: '1', value: 123}

let arr2: number[] = [1,2,3]
let arrTwo: Array<number> = [1,2,3]

interface IPlus<T> {
    (a : T, b: T): T
}
function plus(a:number, b:number): number {
    return a + b
}

function connect(a: string, b: string): string {
    return a + b
}

const a: IPlus<number> = plus
const b: IPlus<string> = connect
console.log(a(1, 2))
console.log(b('1', '2'))