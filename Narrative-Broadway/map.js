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
    hover: {
      latitude: null,
      longitude: null,
      theater: null,
    },
  };

  /**
   * LOAD DATA
   * Using a Promise.all([]), we can load more than one dataset at a time
   * */
  Promise.all([
    d3.json("./data/manhattan.geojson"),
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
      .attr("stroke","rgba(256,256,256,0.9)")
      .attr("fill", "rgba(256,256,256,0.7)") 

      
      draw()
  }

  /**
   * DRAW FUNCTION
   * we call this everytime there is an update to the data/state
   * */
  function draw() {
    const projection = d3.geoAlbersUsa().fitSize([width, height], state.geojson);
    console.log(state.theaters)
    svg
    .selectAll(".circle")
    .data(state.theaters,d=>`${d.No}_${d.Name}`)
    .join("circle")
    .attr("class","dot")
    .attr("r", 1)
    .attr("fill", d => d.Type==="Broadway"?"red":"blue")
    .attr("opacity",0.6)
    .attr("transform", d => {
      const [x, y] = projection([d.Longitude, d.Latitude]);
      return `translate(${x}, ${y})`;
    })
    .attr ("r", d => 5^((d.Capacity)/1000))
    .on("click", d => {
      d3.select(".dot")
        .attr("r", 3)
      d3.select(".img").remove()
      d3.select("#part1-tooltip")
          .append("div")
          .attr('class', 'img')
          .html('<img src="' + d.ImageLink+ '">')
          .append("div")
          .attr('class', 'subtitle')
          .html('<i><b><p style="font-size: 25px; line-height: 26px;">' + d.Name + '</i></b> &nbsp(' + d.Capacity + ') ' + '</p>' + '<p style="font-size: 25px; line-height: 26px;">' + d.Address + '</p> <p style="color:grey; font-size: 15px; line-height: 16px;">' + d.Year + ', &nbsp' + d.NotableShows + '</p>' + '<p>' + d.OlderNames + ' has ' + d.Type + ' painting(s) in the collection.</p>')
          .append("div")
          .attr('class', 'button-container')
          .html('<button id="learn-more-button" class="filter-buttons"><a style="text-decoration: none;" href=' + d.URL + 'target="_new">About the Work</a></button>')
    })

    /* svg.selectAll('text')
      .data([state.theaters])
      .join('text')
      .attr('dx', '50%')
      .attr('dy', '50%')
      .style('text-anchor', 'middle')
      .text(d => `${d.data}`) */

  }
}