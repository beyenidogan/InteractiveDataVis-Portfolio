export function Details() {
  /**
  * CONSTANTS AND GLOBALS
  * */
  const margin = { top: 20, bottom: 50, left: 180, right: 40 };
  let svg,xScale,yScale,xAxis,yAxis,yScaleGross, yScaleAtt,showsdata,filteredData;
  const width = window.innerWidth * 0.6,
  height = window.innerHeight * 0.9,
  paddingInner = 0.1,duration = 1000
  /**
   * APPLICATION STATE
   * */
  let state = {
    showstats: null,
    selectedshow: null
  };

  /**
   * LOAD DATA
   * */
d3.csv("./data/BroadwayWeeklyStats.csv", d3.autoType) 
  .then(raw_data => {
    console.log("raw_data", raw_data);
//    filter;
    state.showstats=raw_data;
    console.log("state: ", state);

    
    init();
  });

  /**
   * INITIALIZING FUNCTION
   * */
  function init() {

  state.showstats
    .sort((a, b) => (d3.ascending(a.Show, b.Show)))

  const selectShow = d3.select("#showsdropdown")
    .on("change", function() {
      state.selectedshow = this.value;
      console.log("new selected show is", state.selectedshow);
      draw(); 
    });
  selectShow 
        .selectAll("option")
        .data(["All Shows",
          ...Array.from(new Set(state.showstats.map(d => d.Show))), 
        ])
        .join("option")
        .attr("value", d => d)
        .text(d => d);

  if (state.selectedshow !== "All Shows") {
    filteredData = state.showstats.filter(d => d.Show === state.selectedshow);
  }


  filteredData.forEach(function(d) {
      d.Month = parseMonth(d.Month);
      d.Sales = +d.Sales;
      d.Fruit = d.Fruit;
  });
  
    svg = d3
      .select("#part3-details1")
      .append("svg")
      .attr("class","svg1")
      .attr("width", width)
      .attr("height", height);
    
    
    xScale = d3
      .scaleTime()
      .domain(d3.extent(state.showstats,d=>d.WeekEnd))
      .range([margin.left, width - margin.right])
    
    yScaleGross = d3
      .scaleLinear()
      //.domain(showsdata.map(d => d.Grosses))
      .domain(d3.extent(state.showstats,d=>d.Grosses))
      .range([0,50])

    yScaleAtt = d3
      .scaleLinear()
      //.domain(showsdata.map(d => d.Grosses))
      .domain(d3.extent(state.showstats,d=>d.Attend))
      .range([0,50])


    xAxis = d3.axisBottom(xScale);

    yAxis = d3.axisLeft(yScaleGross);



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


  yScaleGross.domain(showsdata.map(d => d.ShowName))
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