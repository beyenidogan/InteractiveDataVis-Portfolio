export function Timeline() {
  /**
  * CONSTANTS AND GLOBALS
  * */
  const margin = { top: 20, bottom: 50, left: 100, right: 40 };
  let svg,xScale,yScale,xAxis,yAxis,showsdata;
  const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.8,
  paddingInner = 0.2
  /**
   * APPLICATION STATE
   * */
  let state = {
    shows: null,
    orderby: "Longest Running"
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
   * this will be run *one time* when the data finishes loading in
   * */
  function init() {

  /* let sorter=if (state.orderby=== "Borough") {return d.Filter=== state.showby;} 
      else if (state.orderby=== "Category") {return d.Filter=== state.showby;} 
      else if (state.showby==="Type") {return d.Filter=== state.showby;} */
       
  const selectBorough = d3.select("#sort-dropdown").on("change", function() {
      console.log("new selected entity is", state.orderby);
      // `this` === the selectElement
      // this.value holds the dropdown value a user just selected
      state.orderby = this.value;

      draw(); // re-draw the graph based on this new selection
    });

  selectBorough
      .selectAll("option")
      .data(["Most Recent","Longest Running","Most Number of Performances"])
      .join("option")
      .attr("value", d => d)
      .text(d => d);

 //   showsdata=state.shows.sort((a, b) => d3.ascending(a.ClosingDate, b.ClosingDate))

    showsdata=state.shows
      .sort((a, b) => {
        if (state.orderby === "Most Recent") {
            return d3.descending(a.ClosingDate, b.ClosingDate)
        } else if (state.orderby === "Longest Running") {
        return d3.ascending(+a.Years, +b.Years)
        } else if (state.orderby === "Most Number of Performances")
        return d3.ascending(+a.NumberofPerformances, +b.NumberofPerformances)
     });


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

  svg = d3
    .select("#part2-timeline")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

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

    svg
    .selectAll("rect")
    .data(showsdata)
    .join("rect")
    .attr("y", d => yScale(d.ShowName))
    .attr("x", d => xScale(d.OpeningDate))
    .attr("width", d => xScale(d.ClosingDate)-xScale(d.OpeningDate))
    .attr("height", yScale.bandwidth())
    .attr("fill", "steelblue")
/*     .on("mouseover", function(d) {                                                            
      console.log(d3.event.pageX)
      d3.select("#tooltip")
              .style("left", (d3.event.pageX-100)  + "px")
              .style("top", d3.event.pageY + "px")						
              .select("#events")
              .text(d.Events)
              .style("fill", "white")
      d3.select("#tooltip")       
              .select("#month")
              .text(d3.timeFormat("%B")(d.Month))
              .style("fill", "white")
      d3.select("#tooltip")       
              .select("#year")
              .text(d3.timeFormat("%Y")(d.Month))
              .style("fill", "white")
      d3.select("#tooltip")       
              .select("#tooltipheader")
              .text(d.Name)
              .style("fill", "white")
      d3.select("#tooltip").classed("hidden", false);
      })  
    .on("mouseleave", function(d) {
        d3.select("#tooltip").classed("hidden", true);
      })  */



  // append text

    

  }
}