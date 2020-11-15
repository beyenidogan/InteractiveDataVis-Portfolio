class Line {

    constructor(state, setGlobalState) {
        // initialize properties here
        this.width = window.innerWidth * 0.3;
        this.height = window.innerHeight * 0.5;
        this.margins = { top: 5, bottom: 5, left: 5, right: 5 };
        this.duration = 1000;
    
        this.svg = d3
          .select("#line-chart")
          .append("svg")
          .attr("width", this.width)
          .attr("height", this.height);
      }

     draw(state, setGlobalState) {
        console.log("now I am drawing my LINE graph");
        

        let boroughData=d3.nest()           
                .key(d=>d.Borough)
                .key(d => d.Month)   
                .rollup(leaves=>{
                    return{
                        "Events": d3.sum(leaves, function(d) {return(d.Events)})
                    }
                })
                .entries(state.lineData, d=>{
                    d.Month=d.Month;
                    d.Events=d.Events;
                })
                
        console.log(boroughData.Events)
    
        let categoryData=d3.nest()
                .key(d=>d.Category)
                .key(d => d.Month)
                .rollup(leaves=>{
                    return{
                        "Events":d3.sum(leaves, function(d) {return(d.Events)})
                    }
                })
                .entries(state.lineData)
        console.log(categoryData)   
        
        let typeData=d3.nest()
                .key(d=>d["Event Type"])
                .key(d => d.Month)
                .rollup(leaves=>{
                    return{
                        "Events":d3.sum(leaves, function(d) {return(d.Events)})
                    }
                })
                .entries(state.lineData)
        console.log(typeData)         
        
        let selectedLineData 

        if (state.boroughActive === true) {
                
                selectedLineData =boroughData;
                console.log("now using borough data for line graph")
                }
        else if (state.categoryActive === true) {
                selectedLineData =categoryData;
                console.log("now using category data for line graph")
                }
        else if (state.typeActive === true) {
                selectedLineData =typeData;
                console.log("now using category data for line graph")
                }
        

        const xScale = d3
            .scaleTime()
            .domain(d3.extent(state.lineData,d=>d.Month))
            .range([this.margins.left, this.width - this.margins.right])

        const yScale = d3
            .scaleLinear()
            .domain([0,d3.max(selectedLineData, d => d.values)])
            .range([this.height - this.margins.top, this.margins.bottom]);

        const colors=d3.scaleOrdinal()
                .domain([selectedLineData.keys])
                .range(["#EF5285", "#88F284" , "#5965A3","#EF5285", "#88F284" , "#5965A3","#EF5285", "#88F284" , "#5965A3","#EF5285", "#88F284" , "#5965A3"])

        const valueLine = d3.line()
                .x(function(d) { return x(d.Month); })
                .y(function(d) { return y(+d.Events); })


        const xAxis = this.svg.append("g")
                .attr("transform", "translate(0," + (this.height-4*this.margins.bottom) + ")")
                .attr("class", "x-axis")
                .call(d3.axisBottom(xScale)
                    .ticks(d3.timeMonth)
                    .tickSize(5,0) 
                    .ticks(5)
                    .tickFormat(d3.timeFormat("%Y")));
        let yAxis = this.svg.append("g")
                    .attr("class", "y-axis")
                    .call(d3.axisLeft(yScale)
                       .ticks(5)
                       .tickSizeInner(0)
                       .tickPadding(6)
                       .tickSize(0, 0));

/*        const line = this.svg
            .selectAll("g.line")
            .data(metricData)
            .join(
                enter =>
                enter
                    .append("g")
                    .attr("class", "line")
                    .call(enter => enter.append("rect"))
                    .call(enter => enter.append("text")),
                update => update,
                exit => exit.remove()
            ).on("click", d => {
                setGlobalState({ selectedMetric: d.metric });
            })
    
        line
            .transition()
            .duration(this.duration)
            .attr(
                "transform",
                d => `translate(${xScale(d.metric)}, ${yScale(d.value)})`
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
            .text(d => `${d.metric}: ${this.format(d.value)}`);    */
      }





    }


export { Line };