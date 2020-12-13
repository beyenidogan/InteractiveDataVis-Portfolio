export function Timeline() {
  /**
  * CONSTANTS AND GLOBALS
  * */
  const margin = { top: 20, bottom: 50, left: 60, right: 40 };
  let svg;
  const width = window.innerWidth * 0.6,
  height = window.innerHeight * 0.8

  /**
   * APPLICATION STATE
   * */
  let state = {
    shows: null,
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

    xScale = d3
    .scaleTime()
    .domain([d3.min(state.shows, d => d.OpeningDate),d3.max(state.data, d => d.ClosingDate)])
    .range([margin.left, width - margin.right])

    yScale = d3
    .scaleBand()
    .domain(d3.range(state.shows.length))
    .range([height - margin.bottom, margin.top]);
  console.log(state.shows.length)
  svg = d3
      .select("#part2-timeline")
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


    svg
    .selectAll(".circle")
    .data(state.theaters,d=>`${d.No}_${d.Name}`)
    .join("circle")
    .attr("class","dot")
    .attr("r", 1)
    .attr("fill", d => d.Type==="Broadway"?"#f53670":"blue")
    .attr("fill-opacity",0.3)
    .attr("stroke",d => d.Type==="Broadway"?"#f53670":"blue")
    .attr("transform", d => {
      const [x, y] = projection([d.Longitude, d.Latitude]);
      return `translate(${x}, ${y})`;
    })
    .attr ("r", d => rScale(d.Capacity))
    .on("click", d => {
      d3.select(".dot")
      d3.select(".img").remove()
      d3.select(".title").remove()
      d3.select("#part1-tooltip")
          .append("div")
          .attr("class", "title")
          .html('<b><p style="font-size: 20px; line-height: 26px;">' 
                + d.Name + '</b> ' + '</p> &nbsp') 
           .attr('class', 'img')
           .append("div")
          .html('<img src="' + d.ImageLink+ '" style="max-height:200px; width:auto">') 
          .append("div")
          .attr('class', 'subtitle')
          .html('<p style="font-size: 14px; color:#5F5F5f; line-height: 26px;"> ' 
                 + d.Address + '</p>' +' &nbsp'
                + '<p style="font-size: 25px; line-height: 26px;">' 
                + d.Capacity + '</p> <p style="color:grey; font-size: 15px; line-height: 16px;">' 
                + d.Year + ', &nbsp' + d.NotableShows 
                + '</p>' + '<p>' + d.OlderNames + ' has ' 
                + d.Type + ' painting(s) in the collection.</p>')
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