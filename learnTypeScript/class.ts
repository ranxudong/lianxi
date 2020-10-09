class Animal {
    public name: string; //外界可访问修改(默认)
    private sex: string; //只有内部可访问修改
    readonly age: number;  //只读
    //static Animal 的静态[变量|方法]
    static categoies: string[] = ['mammal', 'bird']
    static isAnimal(a: any) {
        return a instanceof Animal
    }
    constructor(name: string, sex: string = '女', age: number = 20) {
        this.name = name
        this.sex = sex
        this.age = age
    }

    run () {
        return `${this.name} is running`    
    }
}
console.log(Animal.categoies) //[ 'mammal', 'bird' ]
const snake = new Animal('张山')
console.log(Animal.isAnimal(snake)); // true
console.log(snake.run())  //张山 is running
console.log(snake.name)
snake.name = 'lucy'
console.log(snake.name)

class Dog extends Animal {
    bark() {
        return `${this.name} is barking`
    }
}

const xiaoming = new Dog('xiaoming')
console.log(xiaoming.run()) //xiaoming is running
console.log(xiaoming.bark()) //xiaoming is barking
class Cat extends Animal {
    constructor(name) {
        super(name)
        console.log(super.run()) // maomao is running
        console.log(this.name) //maomao
    }

    run() {
        return `Meow, ${super.run()}`
    }
}

const maomao = new Cat('maomao')
console.log(maomao.run()) //Meow, maomao is running

interface Radio {
    switchRadio(checkRadio: boolean): void;
}

// interface Battery {
//     checkBatteryStatus();
// }

interface Battery extends Radio {
    checkBatteryStatus(checkBattery: boolean): void;
}

class Car implements Radio {
    switchRadio() {

    }
}

class Cellphone implements Battery {
    switchRadio() {

    }

    checkBatteryStatus() {
        
    }
}


