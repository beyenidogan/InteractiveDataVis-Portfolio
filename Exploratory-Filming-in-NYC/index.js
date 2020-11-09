// import our components
import { Bar } from "./Bar.js";
/* import { Map } from "./Map.js";
import { Line } from "./Line.js"; */

let bar, map, line;

// global state
let state = {
  data: [],
  dataSource: "../data/Summary_Borough.csv",
  summaryData: [],
  summaryDomain: [],
  filteredData: [],
  showby:"Borough",
  selectedBorough: "All Boroughs",
  selectedCategory: "All Category",
  selectedType: "All Permit Types",
  boroughActive: true,
  categoryActive: false,
  typeActive: false,
}

d3.csv("../data/Film_Permits_Pivot.csv", d3.autoType).then(data => {
  console.log("data", data);
  state.data = data;
/*   state.summaryDomain = [
    0, 
    d3.max(data
      .map(d => [d[Events])
      .flat()
    )]
    console.log("flat",state.domain) */
  init();
});

function init() {
  bar= new Bar(state, setGlobalState);
/*   map = new Map(state, setGlobalState);
  line = new Line(state, setGlobalState); */
  draw();
}

function draw() {
  bar.draw(state,setGlobalState);
/*   map.draw(state, setGlobalState);
  line.draw(state, setGlobalState); */
}

// UTILITY FUNCTION: state updating function that we pass to our components so that they are able to update our global state object
function setGlobalState(nextState) {
  state = { ...state, ...nextState };
  console.log("new state:", state);
  draw();
}

