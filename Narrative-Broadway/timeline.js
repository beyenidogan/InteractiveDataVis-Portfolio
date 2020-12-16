export function Timeline() {
  /**
  * CONSTANTS AND GLOBALS
  * */
  const margin = { top: 20, bottom: 50, left: 180, right: 40 };
  let svg,xScale,yScale,xAxis,yAxis,colorScale,showsdata;
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

 //Populate dropdown options
    selectBorough
        .selectAll("option")
        .data(["Longest Running","Most Recent","Most Number of Performances"])
        .join("option")
        .attr("value", d => d)
        .text(d => d);

      showsdata=state.shows
      console.log(showsdata)

  //Create scales and axes functions
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

    colorScale=d3.scaleLinear()
      .domain(d3.extent(showsdata, d => d.NumberofPerformances))
      .range(["#8596B7","#DC756D"])
  //Create svg and axes
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
   * */
  function draw() {
    let formatNumber = d3.format(",")

  //Sort data based on selection option
    state.shows
      .sort((a, b) => {
      if (state.orderby === "Most Recent") {
          return d3.ascending(a.ClosingDate, b.ClosingDate)
      } else if (state.orderby === "Longest Running") {
      return d3.ascending(+a.Years, +b.Years)
      } else if (state.orderby === "Most Number of Performances")
      return d3.ascending(+a.NumberofPerformances, +b.NumberofPerformances)
      }); 
  
  //Update axes for new order  
    yScale.domain(showsdata.map(d => d.ShowName))
    
    d3.select("g.y-axis")
      .transition()
      .duration(1000)
      .call(yAxis.scale(yScale))
  
  //Draw thick bars which are the actual gantt periods
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
      .attr("fill", d => colorScale(d.NumberofPerformances))
    //  .style("fill", "#DC756D")
     // .style("fill", d => d.metric === state.selectedMetric ? "purple" : "#ccc")

    bars
      .on("mouseover", function(d) {                                                            
      
        /*All the below 5 attempts are to try to position tooltip dynamically
        */
        
        
        /* 
        //Attempt 1: Trying to figure out rule of coordinate based quadrants to generate 4 conditions
        let x = d3.event.pageX - document.getElementById("part2-timeline").getBoundingClientRect().x + 10
        let y = d3.event.pageY - document.getElementById("part2-timeline").getBoundingClientRect().y + 10  
          
        let xsvg=document.getElementById("part2-timeline").getBoundingClientRect().x
        let ysvg=document.getElementById("part2-timeline").getBoundingClientRect().y
        console.log("height:",height, ", width:",width,", d3.event.pageX:",d3.event.pageX,", d3.event.pageY:",d3.event.pageY,"x",x,"y",y,"xsvg",xsvg,"ysvg",ysvg) 
          */

        /*  
        //Attempt 2: Tyring to write 2 conditions to use in .style("top") or ("bottom")
        let mouseposition=function(d){
              if {d3.event.pageX>2000} {
                return "bottom"
              } else {return "top"}
            }
          console.log("mosueposition",mouseposition)
          let tooltipshift=function(d){
              if (d3.event.pageX>2000) {
                return height
              } else {return 0}
            }
        */
        
        /*
        //Attempt 3: Even simpler to use 2 conditions, to chage when it is at the bottom
        let y;
        if (d3.event.pageY <2000) return {y:d3.event.pageY+100}
        else if (d3.event.pageY >=2000) return {y:d3.event.pageY}
        console.log("y",y)
        */

        /*       
        //Attempt 4: Trying to write the conditions in style  
        d3.select("#tooltip2")     
          .style("left", (d3.event.pageX)  + "px")
          //.style("top", d3.event.pageY + "px")
          .style(call(
            if (d3.event.pageY>2000) return {"top",d3.event.pageY+"px"}
          )) */

        /*  Attempt 5: Tried calling different values of top based on if
        if (d3.event.pageY <2000) return {d3.select("#tooltip2").style("top","1800px")}
        else if (d3.event.pageY >=2000) return {d3.select("#tooltip2").style("top","2000px")}  */


        //This was for the Attempt 2:
         // .style("${mouseposition}", (d3.event.pageY+10*tooltipshift) + "px")	

        d3.select(this).transition()
          .duration('50')
          .attr('opacity', '.4')

        d3.select("#tooltip2")     
          .style("left", (d3.event.pageX) + "px")
          //.style("top", y + "px")    //Removed to make this not dynamic, which is at least not going down
         
        d3.select("#tooltipheader2")
          .text(d.ShowName)
        d3.select("#poster")
          .html('<img src="' + d.ImageLink+ '" style="max-height:200px; width:auto">') 
        d3.select("#showtype")
          .text(d.ShowType)
        d3.select("#opening")
          .text(d3.timeFormat("%B %d, %Y")(d.OpeningDate))
        d3.select("#closing")
          .text(d.ClosingDateOriginal==="Present"? "Present":d3.timeFormat("%B %d, %Y")(d.ClosingDateOriginal))
          .classed("emphasizedtext",d.ClosingDateOriginal==="Present"? true : false)
        d3.select("#performances")
          .text(formatNumber(d.NumberofPerformances))
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
      .attr("fill", d => colorScale(d.NumberofPerformances))
      .style("fill-opacity", 1)


  }
}