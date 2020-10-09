import React, { useState } from 'react';
import logo from './logo.svg';
import LikeButton from './components/LikeButton';
import MouseTracker from './components/MouseTracker';
import useMousePosition from './components/Hooks/useMousePosition';
import withLoader from './components/withLoader';

import './App.css';

interface IShowResult {
  message: string,
  status: string
}

const DogShow: React.FC<{data: IShowResult}> = ({ data }) => {
  return (
    <>
      <h2>Dog show: { data.status }</h2>
      <img src={data.message} />
    </>
  )
}

const App: React.FC = () => {
  const [show, setShow] = useState(true)
  const WrappedDogShow = withLoader(DogShow, 'https://dog.ceo/api/breeds/image/random')
  return (
    <div className="App">
      <header className="App-header">
        <WrappedDogShow />
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <button onClick={()=>{setShow(!show)}}>togole tracker</button>
        </p>
        <LikeButton />
        {
          show && <MouseTracker />
        }
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
