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


        const xScale = d3
            .scaleTime()
            .domain(d3.extent(filteredData,d=>d.Month))
            .range([this.margins.left, this.width - this.margins.right])
        
        const yScale = d3
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


       const line = this.svg
            .selectAll("g.line")
            .data(filteredData)
            .join(
                enter =>
                enter
                    .append("g")
                    .attr("class", "line")
                    .attr("stroke", "white")
                    .call(enter => enter.append("path")),
                update => update,
                exit => exit.remove()
            ) 
        line.select("path")
            .transition()
            .duration(this.duration)
            .attr("d",d=>valueLine(d))

/*         let line = this.svg
            .selectAll("g.line")
            .data(filteredData)
            .append("g")
            .attr("class", "line")
            .attr("stroke", d=>d.key)
        let paths= line.selectAll(".line")
            .data(function(d){ return d.values})
            .enter()
            .append("path")
            .attr("d",d=>valueLine(d.values))
            .attr("class", "line") */


 /*        line
            .transition()
            .duration(this.duration)
            .attr(
                "transform",
                d => `translate(${xScale(d.Month)}, ${yScale(d.Events)})`
            );
   
        line
            .select("rect")
            .transition()
            .duration(this.duration)
            .attr("width", xScale.bandwidth())
            .attr("height", d => this.height - yScale(d.value))
            .style("fill", d => d.metric === state.selectedMetric ? "purple" : "#ccc")
    
        line
            .select("text")
            .attr("dy", "-.5em")
            .text(d => `${d.metric}: ${this.format(d.value)}`);   */  



/*         d3.select("g.y-axis")
            .transition()
            .duration(1000)
            .call(yAxis); */

      }






    }


export { Line };