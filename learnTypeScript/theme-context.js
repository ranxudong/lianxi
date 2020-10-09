//创建 theme context 对象
import React from 'react';
const ThemeContext = React.createContext()
export default ThemeContext;

const thems = {
    light: {
        classnames: 'btn btn-light',
        bgColor: '#eee',
        color: '#000',
    },
    dark: {
        classnames: 'btn btn-dark',
        bgColor: '#222',
        color: '#fff',
    }
}

//使用
//最外层组件
<ThemeContext.Provider value={thems.light}>

    {/* 内部引用组件-可以使用到最外层的数据 themes */}
    <ThemeContext.Consumer>
        {
            theme => {
                const.log(thems)    // thems.light
            }
        }
    </ThemeContext.Consumer>
</ThemeContext.Provider>



