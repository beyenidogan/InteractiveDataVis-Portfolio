export function Map() {
  /**
  * CONSTANTS AND GLOBALS
  * */
  const margin = { top: 0, bottom: 20, left: 0, right: 0 };
  let svg,projection,maparea,path,theatersdata,filteredData;
  const width = window.innerWidth * 0.4,
  height = window.innerHeight * 0.9,duration = 1000

  /**
   * APPLICATION STATE
   * */
  let state = {
    geojson: null,
    theaters: null,
    radiuschecker:true,
    showtheaters:"All",
    selectedtheater:"All"
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
    
/* 
 //Dropdown interaction defined
  const selectSorter = d3.select("#theaterdropdown")
    .on("change", function() {
      state.showtheaters=this.value
      console.log("new selected entity is", state.showtheaters);
      draw(); 
    });


//Populate dropdown options
  selectSorter
      .selectAll("option")
      .data(["All","Broadway","Off-Broadway"])
      .join("option")
      .attr("value", d => d)
      .text(d => d); */


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
      .attr("width", width)
      .attr("height", height *0.8)
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
  
      
    d3.select("#radius-checker")
      .on("change", function (d) {
          console.log("radius checker updated")
          state.radiuschecker=this.checked;
          console.log("this value",this.value)
          console.log("state.radiuschecker",state.radiuschecker)
          
          draw()
          }
        )
    
    draw()
  }

  /**
   * DRAW FUNCTION
   * we call this everytime there is an update to the data/state
   * */
  function draw() {
    
/*     theatersdata=state.theaters

    console.log("state.selectedshow",state.showtheaters)

    if (state.showtheaters === "Broadway") {
      filteredData = theatersdata.filter(d => d.Show === "Broadway")
    }
    else if (state.showtheaters === "Off-Broadway"){
      filteredData = theatersdata.filter(d => d.Show === "Off-Broadway")
    } else filteredData = theatersdata ;

    console.log("filtereddata",filteredData) */

    let rScale=d3.scaleSqrt()
      .domain(d3.extent(state.theaters, d => d.Capacity))
      .range([8,20])

    let formatNumber = d3.format(",")

    // Drawing the circles
    
    let dots=maparea
      .selectAll(".dot")
      .data(state.theaters,d=>`${d.No}_${d.Name}`)
      .join(
        enter =>
          enter
            .append("circle")
            .attr("class", "dot")
            .call(enter => enter.append("circle")),
          update => update,
          exit => exit.remove()
        )
      
    dots 
      .attr("fill", d => d.Type==="Broadway"?"#DC756D":"#017a96")
      .attr("fill-opacity",0.5)
      .attr("stroke-width","1")
      .attr("stroke",d => d.Type==="Broadway"?"#974e49":"#026075")
      .attr("transform", d => {
        const [x, y] = projection([d.Longitude, d.Latitude]);
        return `translate(${x}, ${y})`;
      })
      .transition()
      .duration(duration)
      .attr ("r", d => state.radiuschecker==true? rScale(d.Capacity):5)
      
    
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
            .attr ("r", d => state.radiuschecker==true? rScale(d.Capacity)*1.3:5*1.3)
      })
      .on("mouseleave", function(d) {
        d3.select(this).transition()
            .duration('50')
            .attr('fill-opacity', '0.5')
            .attr("stroke-width","1")
            .attr ("r", d => state.radiuschecker==true? rScale(d.Capacity):5)      
      })  
  
  }
}