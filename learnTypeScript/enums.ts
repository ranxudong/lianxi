/**
 * 枚举类型
 */
enum enumeration {
    Up = 10,
    Down,
    Left,
    Right = 'Right'
}

console.log(enumeration) //{'10':'Up','11':'Down','12':'Left',Up:10,Down:11,Left:12,Right:'Right'}

const enum Direction {
    Up = 'Up',
    Down = 'Down',
    Left = 'Left',
    Right = 'Right'
}

const value  = 'Up'
if (value === Direction.Up) {
    console.log('go up')
}