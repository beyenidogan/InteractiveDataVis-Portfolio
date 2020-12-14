export function Map() {
  /**
  * CONSTANTS AND GLOBALS
  * */
  const margin = { top: 20, bottom: 50, left: 60, right: 40 };
  let svg;
  const width = window.innerWidth * 0.4,
  height = window.innerHeight * 0.8

  /**
   * APPLICATION STATE
   * */
  let state = {
    geojson: null,
    theaters: null,
  };

  /**
   * LOAD DATA
   * Using a Promise.all([]), we can load more than one dataset at a time
   * */
  Promise.all([
    d3.json("./data/manhattan4.geojson"),
    d3.csv("./data/Theaters.csv", d3.autoType), 
  ]).then(([geojson, theaters]) => {
    state.geojson= geojson;
//    filter;
    state.theaters=theaters;
    console.log("state: ", state);
    init();
  });

  /**
   * INITIALIZING FUNCTION
   * this will be run *one time* when the data finishes loading in
   * */
  function init() {


  const projection = d3.geoAlbersUsa().fitSize([width, height], state.geojson);
  const path = d3.geoPath().projection(projection);
  
  svg = d3
      .select("#part1-map")
      .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg
      .selectAll(".regions")
      // all of the features of the geojson, meaning all the states as individuals
      .data(state.geojson.features)
      .join("path")
      .attr("d", path)
      .attr("class", "regions")
      .attr("stroke","rgba(256,256,256,0.7)")
      .attr("fill", d => d.properties.name==="Central Park"?"rgba(256,256,256,0.3)":"rgba(256,256,256,0.5)")

      draw()
  }

  /**
   * DRAW FUNCTION
   * we call this everytime there is an update to the data/state
   * */
  function draw() {
    const projection = d3.geoAlbersUsa().fitSize([width, height], state.geojson);
    console.log(state.theaters)

    let rScale=d3.scaleSqrt()
    .domain(d3.extent(state.theaters, d => d.Capacity))
    .range([5,20])

    let formatNumber = d3.format(",")

    svg
    .selectAll(".circle")
    .data(state.theaters,d=>`${d.No}_${d.Name}`)
    .join("circle")
    .attr("class","dot")
    .attr("r", 4)
    .attr("fill", d => d.Type==="Broadway"?"#f53670":"blue")
    .attr("fill-opacity",0.3)
    .attr("stroke",d => d.Type==="Broadway"?"#f53670":"blue")
    .attr("transform", d => {
      const [x, y] = projection([d.Longitude, d.Latitude]);
      return `translate(${x}, ${y})`;
    })
    .attr ("r", d => rScale(d.Capacity))
    .on("click", d => {
    d3.select("#part1-tooltip")					
      .select("#tooltipheader")
      .text(d.Name)  
    d3.select("#type")
 //     .append(".text")
      .text(d.Type)  
   //   .style("fill", d => d.Type==="Broadway"?"#f53670":"blue")  
    d3.select("#image")
      .html('<img src="' + d.ImageLink+ '" style="max-height:300px; max-width:300px width:auto">') 
    d3.select("#address")
      .text(d.Address)
    d3.select("#olderNames")
      .text("Previous Names:  "+ d.OlderNames) 
     // .text(d=>d.OlderNames == null ? "": "Previous Names: "+d.OlderNames)
    /*   .text(`${
        function(d){
        if(d.OlderNames ===! null){
          return "Previous Names: "+d.OlderNames}
        } }`  ) */
    // .style("visibility",d=>d.OlderNames === null ? "hidden": "visible")
     //.text(d=>d.OlderNames === null ? "": "Previous Names: "+`${d.OlderNames}`)
    d3.select("#year")
      .text("Active since:  "+d.Year)
    d3.select("#capacity")       
      .text("Capacity: "+formatNumber(d.Capacity))
    d3.select("#shows")       
      .text("Notable Shows: "+d.NotableShows)
    d3.select("#theaterDetailsButton") 
          .html('<button class="filter-buttons"><a style="text-decoration: none;target="_new"; href=' + d.WebLink + '>Learn More</a></button>')
    //Show the tooltip
    d3.select("#part1-tooltip").classed("hidden", false);
    })

  }
}