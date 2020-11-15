// import our components
import { Bar } from "./Bar.js";
/* import { Map } from "./Map.js";*/
import { Line } from "./Line.js"; 

let bar, map, line;

// global state
let state = {
  lineData: [],
  filteredLineData: [],
  mapData:[],
  filteredMapData: [],
  dataSource: "../data/Summary_Borough.csv",
  summaryData: [],
  summaryDomain: [],
  showby:"Borough",
/*   lineDomainB: [],
  lineDomainC: [],
  lineDomainT: [], */
  selectedBorough: "All Boroughs",
  listBorough:["All Boroughs","Bronx","Brooklyn","Manhattan","Queens","Staten Island"],
  listCategories: ["All Categories","Commercial","Documentary","Film","Music Video","Red Carpet/Premiere","Still Photography","Student","Television","Theater","WEB"],
  listTypes: ["All Permit Types","DCAS Prep/Shoot/Wrap Permit","DCAS Prep/Shoot/Wrap Permit","Shooting Permit","Theater Load in and Load Outs"],

  selectedCategory: "All Categories",
  selectedType: "All Permit Types",
  boroughActive: true,
  categoryActive: false,
  typeActive: false,
}

d3.csv("../data/LineData2.csv", d3.autoType).then(data => {
  console.log("lineData", data);
  state.lineData = data;
/*   state.lineDomainB = [
    0, 
    d3.max(data["All Boroughs"])
      .flat()]
  state.lineDomainC = [
    0, 
    d3.max(d["All Categories"])
      .flat()]
  state.lineDomainT = [
    0, 
    d3.max(d["All Permit Types"])
        .flat()]  */
    console.log("flat",state.domain) ,
  init()
});

function init() {
  bar= new Bar(state, setGlobalState);
/*   bar.getData(state,setGlobalState); */
/*   map = new Map(state, setGlobalState);*/
  line = new Line(state, setGlobalState); 
  draw();
}


function draw() {
/*   bar.getData(state,setGlobalState); */
  bar.draw(state,setGlobalState);
/*   map.draw(state, setGlobalState);*/
  line.draw(state, setGlobalState); 
}

// UTILITY FUNCTION: state updating function that we pass to our components so that they are able to update our global state object
function setGlobalState(nextState) {
  state = { ...state, ...nextState };
  console.log("new state:", state);
  draw();
}

