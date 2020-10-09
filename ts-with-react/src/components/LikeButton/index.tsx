import React, {useState, useEffect} from 'react';
import useMousePosition from '../Hooks/useMousePosition';

const LikeButton: React.FC = () => {
    const [like, setLike] = useState(0)
    const [on, setOn] = useState(true)
    const positions = useMousePosition()

    //每次组件完成渲染之后执行
    useEffect(()=>{
        console.log('document title effect is running');
        document.title = `点击了${like}次`
    }, [like])

    return (
        <>
            <h2>X: {positions.x}, Y: {positions.y}</h2>
            <button onClick={()=>{setLike(like + 1)}}>
                {like} 👍 
            </button>
            <button onClick={()=>{setOn(!on)}}>
                {on ? 'ON' : 'OFF'}
            </button>
        </>
    )
};

export default LikeButton;