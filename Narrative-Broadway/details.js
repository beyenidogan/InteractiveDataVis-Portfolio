export function Details() {
  /**
  * CONSTANTS AND GLOBALS
  * */
  const margin = { top: 20, bottom: 50, left: 50, right: 40 };
  let svg,nest,xScale2,yScale2,xAxis2,yAxis2,filteredData;
  const width = window.innerWidth * 0.6,
  height = window.innerHeight * 0.5,
  paddingInner = 0.1,duration = 1000
  /**
   * APPLICATION STATE
   * */
  let state = {
    showstats: null,
    selectedshow: "All Shows",
    selectedMetric: "Weekly Grosses"
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
    
    const selectMetric = d3.select("#showsdropdown2")
      .on("change", function() {
          state.selectedMetric = this.value;
          console.log("new selected metric is", state.selectedMetric);
          draw(); 
      });

    selectMetric
              .selectAll("option")
              .data(["Weekly Grosses","Weekly Total Attendance","Percent Capacity","Number of Performances"])
              .join("option")
              .attr("value", d => d)
              .text(d => d);      


    svg = d3
      .select("#part3-graph")
      .append("svg")
      .attr("class","svg")
      .attr("width", width)
      .attr("height", height);
    
    xScale2 = d3
      .scaleTime()
      .domain(d3.extent(state.showstats,d=>d.WeekEnd))
      .range([margin.left, width - margin.right])
    

 /*      .data(d => Object.values(d))
      .join("td")
 */

    yScale2 = d3
      .scaleLinear()
      .domain(d3.extent(state.showstats, d => d["state.selectedMetric"]))
      .range([height - margin.bottom, margin.top])


    xAxis2 = d3.axisBottom(xScale2);

    yAxis2 = d3.axisLeft(yScale2);


    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis2);
        
    svg
      .append("g")
      .attr("class", "y-axis2")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis2);

    draw()
  }

  /**
   * DRAW FUNCTION
   * we call this everytime there is an update to the data/state
   * */
  function draw() {
  
    filteredData = state.showstats    
    console.log("state.selectedshow",state.selectedshow)

    filteredData = state.showstats.filter(d => d.Show === state.selectedshow);
  
    console.log("filtereddata",filteredData)

    console.log("state.selectedMetric",state.selectedMetric)
    let formatNumber = d3.format(",")

    //if (values = valuesByKey.get(keyValue = key(value = array[i]) + ""))
    
    yScale2.domain(d3.extent(filteredData, d => d[state.selectedMetric]))

    d3.select("g.y-axis2")
    .transition()
    .duration(1000)
    .call(yAxis2.scale(yScale2))

    let lineFunc= d3.line()
      .x(d=> xScale2(d.WeekEnd))
      .y(d=> yScale2(+d[state.selectedMetric]))


    const line = svg
        .selectAll("path.trend")
        .data([filteredData])
        .join(
          enter =>
            enter
            .append("path")
              .attr("class", "trend")
              .attr("stroke", "white")
              .attr("stroke-width",1)
              .attr("transform", "translate(0," + (-margin.bottom) + ")")
              .attr("opacity", 0),
          update => update,
          exit => exit.remove()
        )
         .call(selection =>
          selection
          .transition() 
            .attr("opacity", 1)
            .attr("fill","none")
            .attr("d", lineFunc)
        );

 
/* 

    line
      .selectAll(".trend") 
      .transition()
      .duration(duration)
      .attr("d", lineFunc)
      .style("fill-opacity", 1)
 */

  }
}