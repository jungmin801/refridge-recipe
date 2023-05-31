import logo from "./logo.svg";
import "./App.css";
import { Routes, Route, Link, useNavigate } from 'react-router-dom'

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="" element={<Front/>} />
        <Route path="/main" element={<div>공사중</div>} />
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
        <div>
          <div>
            <p>냉장고 속 재료들로</p>
            <p>무엇을 해먹을 수 있을까?</p>
          </div>
          <div>
            <p> 이제 냉장고를 열고 </p>
            <p>무엇을 해먹을지</p>
            <p>고민하지 않으셔도 됩니다.</p>
          </div>
          <div>
            <p>요리가 어려운 당신을 위해 </p>
            <p>냉장고 속 식재료들에 맞는</p>
            <p>레시피를 추천해드립니다.</p>
          </div>
        </div>
        <button onClick={ ()=>{navigate('/main')} }>시작하기</button>
      </div>
    </section>
  );
}

export default App;
