export function Details() {
  /**
  * CONSTANTS AND GLOBALS
  * */
  const margin = { top: 20, bottom: 50, left: 180, right: 40 };
  let svg,xScale,yScale,xAxis,yAxis,showsdata;
  const width = window.innerWidth * 0.6,
  height = window.innerHeight * 0.6,
  paddingInner = 0.2,duration = 1000
  /**
   * APPLICATION STATE
   * */
  let state = {
    shows: null,
    orderby: "Longest Running",
    sorteddata:null
  };

  /**
   * LOAD DATA
   * Using a Promise.all([]), we can load more than one dataset at a time
   * */
d3.csv("./data/Longest_Running_Shows_v2020-06-02.csv", d3.autoType) 
  .then(raw_data => {
    console.log("raw_data", raw_data);
//    filter;
    state.shows=raw_data;
    console.log("state: ", state);
    init();
  });

  /**
   * INITIALIZING FUNCTION
   * */
  function init() {

    svg = d3
      .select("#part3-details")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

      xScale = d3
      .scaleTime()
      .domain([d3.min(showsdata, d => d.OpeningDate),d3.max(showsdata, d => d.ClosingDate)])
      .range([margin.left, width - margin.right])

      yScale = d3
      .scaleBand()
      .domain(showsdata.map(d => d.ShowName))
      .range([height - margin.bottom, margin.top])
      .paddingInner(paddingInner);

      xAxis = d3.axisBottom(xScale);
      yAxis = d3.axisLeft(yScale);



    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);
        
    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis);

    draw()
  }

  /**
   * DRAW FUNCTION
   * we call this everytime there is an update to the data/state
   * */
  function draw() {
  let formatNumber = d3.format(",")


  yScale.domain(showsdata.map(d => d.ShowName))
  d3.select("g.y-axis")
    .transition()
    .duration(1000)
    .call(yAxis.scale(yScale))

  const bars = svg
      .selectAll("g.bar")
      .data(showsdata,d=>`${d.ShowName}`)
      .join(
        enter =>
          enter
            .append("g")
            .attr("class", "bar")
            .call(enter => enter.append("rect"))
            .call(enter => enter.append("text")),
        update => update,
        exit => exit.remove()
      )

  

  


    

  }
}