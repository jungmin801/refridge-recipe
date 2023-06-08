import logo from "./logo.svg";
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Main from "./routes/main"
import "./App.css";

import { Routes, Route, Link, useNavigate } from 'react-router-dom'

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="" element={ <Front/> } />
        <Route path="/main" element={ <Main/> } />
      </Routes>
    </div>
  );
}

function Front() {

  let navigate = useNavigate()

  return (
    <section className="front">
      <div className="front-img">
        <div className="front-bg"></div>
        <h2>냉장고 파먹기</h2>
        <div className="front-description">
          <p>
            <span>냉장고 속 재료들로</span>
            <span>무엇을 해먹을 수 있을까?</span>
          </p>
          <p>
            <span> 이제 냉장고를 열고 </span>
            <span>무엇을 해먹을지</span>
            <span>고민하지 않으셔도 됩니다.</span>
          </p>
          <p>
            <span>요리가 어려운 당신을 위해 </span>
            <span>냉장고 속 식재료들에 맞는</span>
            <span>레시피를 추천해드립니다.</span>
          </p>
        </div>
        <button onClick={ ()=>{navigate('/main')} }>시작하기</button>
      </div>
    </section>
  );
}

export default App;
