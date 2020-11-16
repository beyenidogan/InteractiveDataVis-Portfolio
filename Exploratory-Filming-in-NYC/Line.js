class Line {

    constructor(state, setGlobalState) {
        // initialize properties here
        this.width = window.innerWidth * 0.45;
        this.height = window.innerHeight * 0.6;
        this.margins = { top: 5, bottom: 30, left: 30, right: 5 };
        this.duration = 1000;
    
        this.svg = d3
          .select("#line-chart")
          .append("svg")
          .attr("width", this.width)
          .attr("height", this.height);
      }

     draw(state, setGlobalState) {
        console.log("now I am drawing my LINE graph");
        
        console.log(state.lineData)

        let showbyData = state.lineData
            .filter(d => {
                if (state.showby=== "Borough") {return d.Filter=== state.showby;} 
                else if (state.showby=== "Category") {return d.Filter=== state.showby;} 
                else if (state.showby==="Type") {return d.Filter=== state.showby;}
                })
        console.log(showbyData)
        
        let filteredData=showbyData
        if (state.showby=== "Borough" ){
            filteredData= showbyData.filter(d => d.Name === state.selectedBorough)
        }
        else if (state.showby=== "Category") {
            filteredData= showbyData.filter(d => d.Name === state.selectedCategory)
        }
        else if (state.showby=== "Type") {
            filteredData= showbyData.filter(d => d.Name === state.selectedType)
        }
        console.log(filteredData)


        let xScale = d3
            .scaleTime()
            .domain(d3.extent(filteredData,d=>d.Month))
            .range([this.margins.left, this.width - this.margins.right])
        
        let yScale = d3
            .scaleLinear()
            .domain([0,d3.max(filteredData, d => d.Events)])
            .range([this.height - this.margins.top, this.margins.bottom]);

        const valueLine = d3.line()
                .x(function(d) { return x(d.Month); })
                .y(function(d) { return y(+d.Events); })

        const xAxis = this.svg.append("g")
                .attr("transform", "translate(0," + (this.height-this.margins.bottom) + ")")
                .attr("class", "x-axis")
                .call(d3.axisBottom(xScale)
                    .ticks(d3.timeMonth)
                    .tickSize(5,0) 
                    .ticks(5)
                    .tickFormat(d3.timeFormat("%Y")))
        let yAxis = this.svg.append("g")
                .attr("transform", "translate(30," + (-this.margins.bottom) + ")")
                .attr("class", "y-axis")
                .transition()
                .duration(1000)
                .call(d3.axisLeft(yScale)); 
        console.log(state)
/*         yScale.domain([0, d3.max(filteredData, d => d.Events)]);

        d3.select("g.y-axis")
        .transition()
        .duration(1000)
        .call(yAxis.scale(yScale)); */
       const line = this.svg
            .selectAll("path.trend")
            .data([filteredData])
            .join(
                enter =>
                enter
                    .attr("class", "trend")
                    .attr("stroke", "white")
                    .attr("opacity", 1)
                    .call(enter => enter.append("path")),
                update => update,
                exit => exit.remove()
            ) 
            .call(selection =>
                selection
                  .transition() // sets the transition on the 'Enter' + 'Update' selections together.
                  .duration(1000)
                  .attr("opacity", 1)
                  .attr("d", d => valueLine(d))
              );


        line.select("path")
            .transition()
            .duration(this.duration)
            .attr("d",d=>valueLine(d))





/*         d3.select("g.y-axis")
            .transition()
            .duration(1000)
            .call(yAxis); */

      }






    }


export { Line };