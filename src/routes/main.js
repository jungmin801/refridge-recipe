import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Pagination from 'react-bootstrap/Pagination';
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
  let [loading, setLoading] = useState(false);

  const callAPI = () =>{
      setLoading(true);
      let apikey = '20cb511a2c2044259d0e';
          axios.get(`http://openapi.foodsafetykorea.go.kr/api/${apikey}/COOKRCP01/json/1/100`)
          .then((result)=>{
            let data = result.data.COOKRCP01.row
            setResults(data);
            setLoading(false);
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
    findRecipe();
  },[results, ingredients])


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
              loading ? <Loading/> :
              Object.keys(results).length > 0? <Results results={results} recipe={recipe} loading={loading} setLoading={setLoading}/> : 
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
        <button disabled={props.loading} onClick={()=>{
          props.callAPI()
        }}
        >Search</button>
      </div>
      </div>
  );
}

function Loading(){
  return(
    <div className="result-area" >
      <div className="result-container">
        <div className="face-icon">🔍</div>
        <div style={{fontWeight:'bold'}}>레시피를 검색하고 있습니다</div>
      </div>
      </div>)
}

function Results(props) {

  const [currentPage, SetCurrentPage] = useState(1) // 현재 페이지
    const [itemPerPage] = useState(10) // 한 페이지에 보여줄 아이템 개수
    const totalPage = Math.ceil(props.recipe.length/ itemPerPage); // 전체 페이지 개수
    const startIndex = (currentPage-1) * itemPerPage; 
    const endIndex = startIndex + itemPerPage;
    const currentData = props.recipe.slice(startIndex, endIndex);

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
      {currentData.map((item, i) => {
        return (
          <Container className="recipe-container" key={i}>
            <Row style={{ padding: "5px 0" }}>
              <Col sm={4} className="recipe-box1">
                <img
                  src={currentData[i].ATT_FILE_NO_MAIN}
                  className="result-image"
                />
              </Col>
              <Col sm={8} className="recipe-box2">
                <h3 className="recipe-title">{currentData[i].RCP_NM}</h3>
                <p className="recipe-details">
                  {shortenWords(currentData[i].RCP_PARTS_DTLS)}
                </p>
                <p className="recipe-etc">
                  <span>
                    <FontAwesomeIcon
                      icon={faUtensils}
                      style={{ marginRight: "6px" }}
                    />
                    {currentData[i].RCP_PAT2}
                  </span>
                  <span>
                    <FontAwesomeIcon
                      icon={faFire}
                      style={{ marginRight: "6px" }}
                    />
                    {`${currentData[i].INFO_ENG}Kcal`}
                  </span>
                </p>
              </Col>
            </Row>
          </Container>
        );
      })}
      <Pagenation recipe={props.recipe} currentPage={currentPage} SetCurrentPage={SetCurrentPage} itemPerPage={itemPerPage} totalPage={totalPage} startIndex={startIndex} endIndex={endIndex}/>
    </div>

  );

}

function Pagenation(props){

  
    const pageGroup = Math.ceil(props.currentPage / 5);  
    const firstPage = props.startIndex+1;
    let lastPage = pageGroup*5;
      
    const [pageNum, setPageNum] = useState([]);

    useEffect(()=>{
      let item = [];
      if(lastPage > props.totalPage) {
        lastPage = props.totalPage;
      }
      for(let i=firstPage; i<=lastPage; i++){
        item.push(i);
        setPageNum(item);
      }
    },[props.recipe])

    const handleClick = (number) => {
      props.SetCurrentPage(number)
    }


  return(
    <Pagination className="pagenation">
      {
        pageGroup > 1 ? <><Pagination.First/><Pagination.Prev /></>: null
      }
      
      {
        pageNum.map((number)=>{
          return(<Pagination.Item key={number} onClick={()=>{handleClick(number)}} active={number === props.currentPage}>{number}</Pagination.Item>)
        })
      }

      {
        lastPage < props.totalPage ? <><Pagination.Next /><Pagination.Last /></>: null
      }
      
    </Pagination>
  )
}

export default Main;
