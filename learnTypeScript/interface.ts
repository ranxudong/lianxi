interface Person {
    readonly id: number;    //只读属性
    name: string;
    age?: number;  //可不存在
    readonly sex?: string; //只读且可不存在
} 

let viking: Person = {
    id: 1234,
    name: '张',
    age: 20
}