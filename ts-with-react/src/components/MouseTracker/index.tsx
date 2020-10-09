import React, {useState, useEffect} from 'react'

const MouseTracker: React.FC = () => {
    const [positions, setPositions] = useState({x: 0,y: 0})

    //每次组件渲染完成之后执行
    useEffect(()=>{        
        console.log('3 ，add effEct', positions.x)
        const updateMouse = (e: MouseEvent) => {
            console.log('0  ，，inner')
            setPositions({x: e.clientX, y: e.clientY});
        }
        document.addEventListener('click', updateMouse)

        //这个回调会在下次渲染之前执行
        return ()=> {
            console.log('2 ，remove effEct', positions.x)
            document.removeEventListener('click', updateMouse)
        }
    }, [])

    console.log('1  (执行2此),,beore render', positions.x)

    return (
        <p>X: {positions.x}, Y: {positions.y}</p>
    )
}

export default MouseTracker