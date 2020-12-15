export function Map() {
  /**
  * CONSTANTS AND GLOBALS
  * */
  const margin = { top: 20, bottom: 50, left: 60, right: 40 };
  let svg,projection,maparea,path;
  const width = window.innerWidth * 0.4,
  height = window.innerHeight * 0.9;

  /**
   * APPLICATION STATE
   * */
  let state = {
    geojson: null,
    theaters: null,
  };

  /**
   * LOAD DATA
   * */
  Promise.all([
    d3.json("./data/manhattan3.geojson"),
    d3.csv("./data/Theaters.csv", d3.autoType), 
  ]).then(([geojson, theaters]) => {
    state.geojson= geojson;
    state.theaters=theaters;
    console.log("state: ", state);
    init();
  });

  /**
   * INITIALIZING FUNCTION
   * this will be run *one time* when the data finishes loading in
   * */
  function init() {

    projection = d3.geoAlbersUsa().fitSize([width, height], state.geojson);
    path = d3.geoPath().projection(projection);
    

  //Create svg
    svg = d3
      .select("#part1-map")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
/*        .call(d3.zoom()
          .on("zoom",  
            function () {
            svg.attr("transform", d3.event.transform)
            }
          )
        )  */

  //Create svg for clipping
    const clip = svg
      .append("defs")
      .append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width )
      .attr("height", height )
      .attr("x", 0)
      .attr("y", 140);

  //Now create the clipped svg to use to create the map
    maparea = svg.append('g')
      .attr("clip-path", "url(#clip)")
      .attr("transform","translate (0,-120)")

  // Drawing the map
    maparea
      .selectAll(".regions")
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
    
    console.log(state.theaters)

    let rScale=d3.scaleSqrt()
      .domain(d3.extent(state.theaters, d => d.Capacity))
      .range([5,20])

    let formatNumber = d3.format(",")

    // Drawing the circles
    
    let dots=maparea
      .selectAll(".circle")
      .data(state.theaters,d=>`${d.No}_${d.Name}`)
      .join("circle")
      .attr("class","dot")
      .attr("r", 4)
      .attr("fill", d => d.Type==="Broadway"?"#DC756D":"#017a96")
      .attr("fill-opacity",0.5)
      .attr("stroke-width","1")
      .attr("stroke",d => d.Type==="Broadway"?"#974e49":"#026075")
      .attr("transform", d => {
        const [x, y] = projection([d.Longitude, d.Latitude]);
        return `translate(${x}, ${y})`;
      })
      .attr ("r", d => rScale(d.Capacity))
    
    //Populate details for static tooltip - it works both with mouseover and click, in order to keep it
    dots.on("mouseover click", function(d) {                                                            
        console.log(d3.event.pageX)
        d3.select("#part1-tooltip")					
          .select("#tooltipheader")
          .text(d.Name)  
        d3.select("#type")
          .text(d.Type.toUpperCase())  
          .style("color", d.Type==="Broadway"?"#DC756D":"#017a96")  
        d3.select("#image-theater")
          .html('<img src="' + d.ImageLink+ '" style="max-height:300px; max-width:300px width:auto">') 
        d3.select("#address")
          .text(d.Address)
          .style("color", "#6d6d6d") 
        d3.select("#previous")
        .style("color", "#6d6d6d") 
        .text(d.OlderNames === null ? "": "Previous Names: ") 
        d3.select("#oldernamesvalue")
        .style("color", "#6d6d6d") 
        .text(d.OlderNames === null ? "": d.OlderNames)
        d3.select("#year")
          .text("Active since "+d.Year)
          .style("color", "grey") 
        d3.select("#capacity")       
          .text("Capacity: "+formatNumber(d.Capacity))
          .style("color", d.Type==="Broadway"?"#DC756D":"#017a96")  
        d3.select("#noteable")       
          .text(d.NotableShows === null ? "":"Noteable Shows: ")
          .style("color", "grey") 
        d3.select("#shownames")       
          .text(d.NotableShows === null ? "":d.NotableShows)
        d3.select("#theaterDetailsButton") 
            .html('<button><a target="_blank", style="text-decoration: none", href=' + d.WebLink + '>Learn More</a></button>')
        d3.select(this)
            .transition()
            .duration('50')
            .attr('fill-opacity', '1')
            .attr("stroke-width","1.5")
            .attr ("r", d => rScale(d.Capacity)*1.3)
      })
      .on("mouseleave", function(d) {
        d3.select(this).transition()
            .duration('50')
            .attr('fill-opacity', '0.5')
            .attr("stroke-width","1")
            .attr ("r", d => rScale(d.Capacity))          
      })  
  
  }
}