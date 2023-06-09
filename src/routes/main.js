import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPlus, faXmark, faMagnifyingGlass, faUtensils, faFire} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import "./main.css";
import axios from 'axios'
import { unstable_renderSubtreeIntoContainer } from "react-dom";


function Main() {
  let [ingredients, setIngredients] = useState([]);
  let [input, setInput] = useState("");
  let [results, setResults] = useState([]);
  let [recipe, setRecipe] = useState([]);


  const callAPI = () =>{
    let apikey = '20cb511a2c2044259d0e';
          axios.get(`http://openapi.foodsafetykorea.go.kr/api/${apikey}/COOKRCP01/json/1/100`)
          .then((result)=>{
            let data = result.data.COOKRCP01.row
            setResults(data);
          })
          .catch(()=>{
            console.log('Fail')
          })   
  };


  const findRecipe = () => {
    let copy = [];

    for(let i=0; i<ingredients.length; i++){
      let filtered = results.filter((value)=>
        value.RCP_PARTS_DTLS.includes(ingredients[i])
      )

      filtered.forEach((item) => {
        if (!copy.some((existingItem) => existingItem.RCP_SEQ === item.RCP_SEQ)) {
          copy.push(item);
        }
      });
    }
    setRecipe(copy);
    };

  useEffect(()=>{
    findRecipe()
  },[results])

  useEffect(()=>{
    findRecipe();
    console.log(recipe)
  },[ingredients])


  const addIngredients = () => {
    if (ingredients.length > 4) {
      alert("최대 5개까지만 입력 가능합니다.");
    } else {
      let copy = [...ingredients];
      copy.push(input);
      setIngredients(copy);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addIngredients()
    }
  };




  return (
    <main className="main">
      <article>
        <Navbar>
          <Container>
            <Navbar.Brand href="#home" className="brand">
              냉장고 파먹기
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                <FontAwesomeIcon icon={faBars} />
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <section>
          <div className="search-container">
            <div className="search-area">
              <div className="input-area">
                <input
                  type="text"
                  placeholder="재료를 입력하세요"
                  onChange={(e) => {
                    setInput(e.target.value);
                  }}
                  onKeyDown={handleKeyPress}
                  value={ input }
                ></input>
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="search-icon"
                  onClick={ addIngredients }
                />
              </div>
              <div className="ingredients-area">
                {ingredients.map((item, i) => {
                  return (
                    <span className="ingredients-box" key={i}>
                      <span>{ingredients[i]}</span>
                      <FontAwesomeIcon icon={faXmark} className="delete-icon" onClick={()=>{
                        let copy = [...ingredients];
                        copy.splice(i,1);
                        setIngredients(copy);
                      }}/>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

            {
              Object.keys(results).length > 0? <Results results={results} recipe={recipe} /> : 
              ingredients.length > 0 ? <After callAPI={()=>{
                callAPI()
              }}/> : <Before/> 
            }

        </section>
      </article>
    </main>
  );
}



function Before() {
  return (
    <div className="result-area" >
      <div className="result-container">
        <div className="face-icon">🙄</div>
        <div style={{fontWeight:'bold'}}>먼저 식재료를 추가해주세요</div>
      </div>
      </div>
  );
}

function After(props){
  return (
    <div className="result-area" >
      <div className="result-container">
        <div className="face-icon">😋</div>
        <div style={{fontWeight:'bold'}}>이제 레시피를 찾아볼까요?</div>
        <button onClick={()=>{
          props.callAPI()
        }}
        >Search</button>
      </div>
      </div>
  );
}

function Results(props) {

  const shortenWords = (str, length = 90) => {
    let description = '';
    if (str.length > length) {
      description = str.substr(0, length - 2) + '...';
    } else {
      description = str;
    }
    return description;
  };


  return (
    <div className="render-recipe">
      {props.recipe.map((item, i) => {
        return (
          <Container className="recipe-container" key={i}>
            <Row style={{ padding: "5px 0" }}>
              <Col sm={4} className="recipe-box1">
                <img
                  src={props.recipe[i].ATT_FILE_NO_MAIN}
                  className="result-image"
                />
              </Col>
              <Col sm={8} className="recipe-box2">
                <h3 className="recipe-title">{props.recipe[i].RCP_NM}</h3>
                <p className="recipe-details">
                  {shortenWords(props.recipe[i].RCP_PARTS_DTLS)}
                </p>
                <p className="recipe-etc">
                  <span>
                    <FontAwesomeIcon
                      icon={faUtensils}
                      style={{ marginRight: "6px" }}
                    />
                    {props.recipe[i].RCP_PAT2}
                  </span>
                  <span>
                    <FontAwesomeIcon
                      icon={faFire}
                      style={{ marginRight: "6px" }}
                    />
                    {`${props.recipe[i].INFO_ENG}Kcal`}
                  </span>
                </p>
              </Col>
            </Row>
          </Container>
        );
      })}

      {/* <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item">
            <a class="page-link" href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li class="page-item">
            <a class="page-link" href="#">
              1
            </a>
          </li>
          <li class="page-item">
            <a class="page-link" href="#">
              2
            </a>
          </li>
          <li class="page-item">
            <a class="page-link" href="#">
              3
            </a>
          </li>
          <li class="page-item">
            <a class="page-link" href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav> */}
    </div>
  );

}

export default Main;
