export function Details() {
  /**
  * CONSTANTS AND GLOBALS
  * */
  const margin = { top: 20, bottom: 50, left: 180, right: 40 };
  let svg,svg1,svg2,xScale,yScaleBand,yScaleGross,yScaleAtt,xAxis,yAxis,showsdata;
  const width = window.innerWidth * 0.6,
  height = window.innerHeight * 0.6,
  paddingInner = 0.2,duration = 1000
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

    svg1 = d3
      .select("#part3-details1")
      .append("svg")
      .attr("class","svg1")
      .attr("width", width)
      .attr("height", height);
    
    svg2 = d3
      .select("#part3-details1")
      .append("svg")
      .attr("class","svg2")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", `translate(${-width}, 0)`)
  
    xScale = d3
      .scaleTime()
      .domain(d3.extent(showstats,d=>d.WeekEnd))
      .range([margin.left, width - margin.right])

    yScaleBand = d3
      .scaleBand()
      .domain(showsdata.map(d => d.Show))
      .range([height - margin.bottom, margin.top])
      .paddingInner(paddingInner);
    
    yScaleGross = d3
      .scaleLinear()
      //.domain(showsdata.map(d => d.Grosses))
      .domain(d3.extent(showstats,d=>d.Grosses))
      .range([height - margin.bottom, margin.top])

    yScaleAtt = d3
      .scaleLinear()
      //.domain(showsdata.map(d => d.Grosses))
      .domain(d3.extent(showstats,d=>d.Attend))
      .range([height - margin.bottom, margin.top])


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