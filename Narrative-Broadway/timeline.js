export function Timeline() {
  /**
  * CONSTANTS AND GLOBALS
  * */
  const margin = { top: 20, bottom: 50, left: 180, right: 40 };
  let svg,xScale,yScale,xAxis,yAxis,showsdata;
  const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.9,
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

    const selectBorough = d3.select("#sort-dropdown")
      .on("change", function() {
        state.orderby = this.value;
        console.log("new selected entity is", state.orderby);
        draw(); 
      });

    selectBorough
        .selectAll("option")
        .data(["Longest Running","Most Recent","Most Number of Performances"])
        .join("option")
        .attr("value", d => d)
        .text(d => d);

      showsdata=state.shows
      console.log(showsdata)

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
  let formatNumber = d3.format(",")

  state.shows
    .sort((a, b) => {
    if (state.orderby === "Most Recent") {
        return d3.ascending(a.ClosingDate, b.ClosingDate)
    } else if (state.orderby === "Longest Running") {
    return d3.ascending(+a.Years, +b.Years)
    } else if (state.orderby === "Most Number of Performances")
    return d3.ascending(+a.NumberofPerformances, +b.NumberofPerformances)
    }); 
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

  bars
    .transition()
    .duration(duration)
    .attr(
      "transform",
      d => `translate(${xScale(d.OpeningDate)}, ${yScale(d.ShowName)})`
    );

  bars
    .select("rect")
    .transition()
    .ease(d3.easeExpIn)
    .duration(duration)
    .attr("width", d => xScale(d.ClosingDate)-xScale(d.OpeningDate))
    .attr("height", yScale.bandwidth())
    .style("fill", "#DC756D")
    //.style("fill", d => d.metric === state.selectedMetric ? "purple" : "#ccc")

  bars
    .select("text")
    .attr("dy", "-.5em")
  //  .text(d => `${d.metric}: ${this.format(d.value)}`);

  bars
     .on("mouseover", function(d) {                                                            
      //console.log(d3.event.pageX)
/*       d3.select("#tooltip")
              .style("left", (d3.event.pageX-100)  + "px")
              .style("top", d3.event.pageY + "px")						
              .select("#events")
              .text(d.Events)
              .style("fill", "white") */
     // bars.style("fill", "white")
      d3.select(this).transition()
        .duration('50')
        .attr('opacity', '.4')
      d3.select("#tooltip2")     
        .style("left", (d3.event.pageX)  + "px")
        .style("top", d3.event.pageY + "px")	  
        .select("#tooltipheader2")
        .text(d.ShowName)
      d3.select("#poster")
        .html('<img src="' + d.ImageLink+ '" style="max-height:200px; width:auto">') 
      d3.select("#showtype")
        .text(d.ShowType)
      d3.select("#opening")
        .text(d3.timeFormat("%B %d, %Y")(d.OpeningDate))
      d3.select("#closing")
        .text(d3.timeFormat("%B %d, %Y")(d.ClosingDate))      
      //  .text(d3.timeFormat("%B %d, %Y")(d.ClosingDateOriginal))
      d3.select("#performances")
        .text(formatNumber(d.NumberofPerformances))
       // .text(d.NumberofPerformances)
      d3.select("#years")
        .text(d.Years)
      d3.select("#synopsis")
        .text(d.Synopsis)
      d3.select("#tooltip2").classed("hidden", false);
      })  
    .on("mouseleave", function(d) {
        d3.select(this).transition()
          .duration('50')
          .attr('opacity', '1')
          .style("fill", "steelblue")
        d3.select("#tooltip2").classed("hidden", true);
      })  
  
  const lines = svg
      .selectAll("g.thinbar")
      .data(showsdata,d=>`${d.ShowName}`)
      .join(
        enter =>
          enter
            .append("g")
            .attr("class", "thinbar")
            .call(enter => enter.append("rect")),
        update => update,
        exit => exit.remove()
      )

  lines
    .transition()
    .duration(duration)
    .attr(
      "transform",
      d => `translate(${margin.left}, ${yScale(d.ShowName)+yScale.bandwidth()/2})`
    );

  lines
    .select("rect")
    .transition()
    .ease(d3.easeExpIn)
    .duration(duration)
    .attr("width", d => xScale(d.OpeningDate)-margin.left)
    .attr("height", 0.3)
    .style("fill", "#974e49")
    .style("fill-opacity", 1)


    

  }
}