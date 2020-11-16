// import our components
import { Bar } from "./Bar.js";
import { Line } from "./Line.js"; 
/* import { Map } from "./Map.js";  */

let bar,map, line;

// global state
let state = {
  lineData: [],
  barData: [],
/*   mapData:[],
  geojson:null, */
  showby:"Borough",
  listBorough:["All Boroughs","Bronx","Brooklyn","Manhattan","Queens","Staten Island"],
  listCategories: ["All Categories","Commercial","Documentary","Film","Music Video","Red Carpet/Premiere","Still Photography","Student","Television","Theater","WEB"],
  listTypes: ["All Permit Types","DCAS Prep/Shoot/Wrap Permit","Rigging Permit","Shooting Permit","Theater Load in and Load Outs"],
  selectedBorough: "All Boroughs",
  selectedCategory: "All Categories",
  selectedType: "All Permit Types",
  boroughActive: true,
  categoryActive: false,
  typeActive: false,
}

d3.csv("../data/Line_Data.csv", d3.autoType).then(data => {

  console.log("allData", data);
  state.barData = data.filter(d=>d.DataType==="BarData");
  console.log("barData",  state.barData);
  state.lineData=data.filter(d => d.DataType === "LineData");
  console.log("lineData",  state.lineData);
/*   state.mapData=data.filter(d => d.DataType === "MapData");
  console.log("mapData",  state.mapData); */
  init()
});



function init() {
  bar= new Bar(state, setGlobalState);
  line = new Line(state, setGlobalState); 
/*   map = new Map(state, setGlobalState);  */
  draw();
}

function draw() {
  bar.draw(state,setGlobalState);
  line.draw(state, setGlobalState); 
/*   map.draw(state, setGlobalState);  */
}

// UTILITY FUNCTION: state updating function that we pass to our components so that they are able to update our global state object
function setGlobalState(nextState) {
  state = { ...state, ...nextState };
  console.log("new state:", state);
  draw();
}

