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
  let [showBefore, setShowBefore] = useState(false);

  const callAPI = () =>{
      setLoading(true);
      let apikey = '20cb511a2c2044259d0e';
          axios.get(`http://openapi.foodsafetykorea.go.kr/api/${apikey}/COOKRCP01/json/1/500`)
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

  useEffect(() => {
    if (ingredients.length === 0) {
      setShowBefore(true);
    } else {
      setShowBefore(false);
    }
  }, [ingredients]);

  console.log(showBefore);

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
                  value={input}
                ></input>
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="search-icon"
                  onClick={addIngredients}
                />
              </div>
              <div className="ingredients-area">
                {ingredients.map((item, i) => {
                  return (
                    <span className="ingredients-box" key={i}>
                      <span>{ingredients[i]}</span>
                      <FontAwesomeIcon
                        icon={faXmark}
                        className="delete-icon"
                        onClick={() => {
                          let copy = [...ingredients];
                          copy.splice(i, 1);
                          setIngredients(copy);
                        }}
                      />
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {
            showBefore ? (
              <Before />
            ) : loading ? (
            <Loading />
          ) : Object.keys(results).length > 0 ? (
            <Results
              results={results}
              recipe={recipe}
              loading={loading}
              setLoading={setLoading}
              ingredients={ingredients}
              setIngredients={setIngredients}
            />
          ) : (
            ingredients.length > 0 && <After callAPI={callAPI} />
          )}
        </section>
      </article>
    </main>
  );
}



function Before() {
  return (
    <div className="result-area">
      <div className="result-container">
        <div className="face-icon">🙄</div>
        <div style={{ fontWeight: "bold" }}>먼저 식재료를 추가해주세요</div>
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

  const [currentPage, setCurrentPage] = useState(1) // 현재 페이지
    const [itemPerPage] = useState(10) // 한 페이지에 보여줄 아이템 개수
    const totalPage = Math.ceil(props.recipe.length/ itemPerPage); // 전체 페이지 개수
    const startIndex = (currentPage-1) * itemPerPage; 
    const endIndex = startIndex + itemPerPage;
    const currentData = props.recipe.slice(startIndex, endIndex); // 한 페이지에 보여줄 실제 데이터

  const shortenWords = (str, length = 90) => {
    let description = '';
    if (str.length > length) {
      description = str.substr(0, length - 2) + '...';
    } else {
      description = str;
    }
    return description;
  };

  useEffect(()=>{
      setCurrentPage(1)
  },[props.ingredients])
  


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
      <Pagenation currentPage={currentPage} setCurrentPage={setCurrentPage}totalPage={totalPage}/>
    </div>

  );

}

function Pagenation(props){

  const pageGroup = Math.ceil(props.currentPage / 5) // 전체 페이지그룹
  const endPage = pageGroup * 5;  // 한 화면에서 보여줄 마지막 페이지
  const startPage = endPage - 4;  // 한 화면에서 보여줄 첫 페이지

  // 페이지 변경 이벤트 핸들러
  const handlePageChange = (pageNumber) => {
    props.setCurrentPage(pageNumber);
  };

  // 페이지네이션 컴포넌트 렌더링
  const renderPagination = () => {

    // 페이지 번호 배열 생성
    const pageNumbers = [];
    for (let i = 1; i <= props.totalPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <>
        {pageNumbers.slice(startPage - 1, endPage).map((pageNumber) => (
          <Pagination.Item
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            active={pageNumber === props.currentPage}
          >
            {pageNumber}
            </Pagination.Item>
        ))}
      </>
    );
  };


  return(
    <Pagination className="pagination">
      {
        props.currentPage > 5 ? 
        <>
          <Pagination.First onClick={()=>{props.setCurrentPage(1)}} />
          <Pagination.Prev onClick={()=>{props.setCurrentPage(props.currentPage-1)}}/>
        </>
        : null
      }
      
      {renderPagination()}

      {
        endPage < props.totalPage ? 
        <>
        <Pagination.Next onClick={()=>{props.setCurrentPage(props.currentPage+1)}}/>
        <Pagination.Last onClick={()=>{props.setCurrentPage(props.totalPage)}}/>
        </>
        : null
      }
        
    </Pagination>
  )
}

export default Main;
