class Bar {

    constructor(state, setGlobalState) {
        // initialize properties here
        this.width = window.innerWidth * 0.3;
        this.height = window.innerHeight * 0.45;
        this.margins = { top: 5, bottom: 5, left: 5, right: 5 };
        this.duration = 1000;
        this.format = d3.format(",." + d3.precisionFixed(1) + "f");
    
        this.svg = d3
            .select("#bar-chart")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height);

        // Hide all dropdowns initially
        d3.select("#borough-container.dropdown")
        .attr("style", "display: visible")

        d3.select("#category-container.dropdown")
        .attr("style", "display: none")

        d3.select("#type-container.dropdown")
        .attr("style", "display: none")

        // Add options to dropdowns
         this.selectBorough = d3
        .select("#dropdown-borough")
        .selectAll("option")
        .data(state.listBorough)
        .join("option")
        .attr("value", d => d)
        .text(d => d);

        this.selectCategory = d3
        .select("#dropdown-category")
        .selectAll("option")
        .data(state.listCategories)
        .join("option")
        .attr("value", d => d)
        .text(d => d);

        this.selectType = d3
        .select("#dropdown-type")
        .selectAll("option")
        .data(state.listTypes)
        .join("option")
        .attr("value", d => d)
        .text(d => d); 

        // Set dropdown click event
        this.selectBorough = d3
        .select("#dropdown-borough")
        .on("change",
            function () {
                console.log("The new selected borough is", this.value)
                setGlobalState({
                    selectedBorough: this.value,
                })
            })

        this.selectCategory = d3
        .select("#dropdown-category")
        .on("change",
            function () {
                console.log("The new selected category is", this.value)
                setGlobalState({
                    selectedCategory: this.value,
                })
            })

        this.selectType = d3
        .select("#dropdown-type")
        .on("change",
            function () {
                console.log("The new selected type is", this.value)
                    setGlobalState({
                        selectedType: this.value,
                    })
                })

        /* d3.select("#borough-container.dropdown")
        .attr("style", "display: visible") */

        // Set button click event
        this.changeBoroughActive = d3
        .select("#borough-button")
        .on("click", function () {
            console.log("borough selected")
            d3.select("#borough-container.dropdown")
            .attr("style", "display: visible")
            d3.select("#category-container.dropdown")
            .attr("style", "display: none")
            d3.select("#type-container.dropdown")
            .attr("style", "display: none")
            setGlobalState({
                showby:"Borough",
            })

        })


        this.changeCategoryActive = d3
        .select("#category-button")
        .on("click", function () {
            console.log("category selected")
            d3.select("#category-container.dropdown")
            .attr("style", "display: visible")
            d3.select("#borough-container.dropdown")
            .attr("style", "display: none")
            d3.select("#type-container.dropdown")
            .attr("style", "display: none")
            setGlobalState({
                showby:"Category",
                })
            })

        this.changeTypeActive = d3
        .select("#type-button")
        .on("click", function () {
            console.log("type selected")
            d3.select("#category-container.dropdown")
            .attr("style", "display: none")
            d3.select("#borough-container.dropdown")
            .attr("style", "display: none")
            d3.select("#type-container.dropdown")
            .attr("style", "display: visible")
            setGlobalState({
                showby:"Type",
                })
            
            })


    }
    

    /////////DRAW

    draw(state, setGlobalState) {
        console.log("now I am drawing my graph");

    d3.select("#bar-title")
        .select("#showby")
        .text(state.showby)
        .style("fill", "white")


        console.log(state.barData)

        let showbyBarData = state.barData
            .filter(d => {
                if (state.showby=== "Borough") {return d.Filter=== state.showby;} 
                else if (state.showby=== "Category") {return d.Filter=== state.showby;} 
                else if (state.showby==="Type") {return d.Filter=== state.showby;}
                })
            .sort();

        console.log(showbyBarData)
    

        let values
        if (state.showby=== "Borough"){values=["Staten Island","Bronx","Queens","Brooklyn","Manhattan"]}
        else if (state.showby=== "Category") {values=["Red Carpet/Premiere","Documentary","Student","Music Video","WEB","Still Photography","Theater","Film","Television"]}
        else if (state.showby=== "Type") {values=["DCAS Prep/Shoot/Wrap Permit","Rigging Permit","Theater Load in and Load Outs","Shooting Permit"]}
         
        console.log(values)


        let yScale = d3
            .scaleBand()
            .domain(showbyBarData.map(d => d.Name))
            .range([this.height - this.margins.top, 5*this.margins.bottom])
            .paddingInner(0.6)


        let xScale = d3
            .scaleLinear()
            .domain([0, d3.max(showbyBarData, d => +d.Events)])
            .range([this.margins.left, this.width - this.margins.right])  

  
        const bars = this.svg
            .selectAll("g.bar")
            .data(showbyBarData, d=>d.Name)
            .join(
            enter =>
                enter
                .append("g")
                .attr("class", "bar")
                .attr("fill-opacity", 0.5)
                .call(enter => enter.append("rect"))
                .call(enter => enter.append("text")),
            update => update
                .call(update=>update) 
            ,
            exit => exit.remove()
            )
    
         bars
            .select("rect")
            .attr("y",d=>yScale(d.Name)) 
            .transition()
            .duration(this.duration)
            .attr("y",d=>yScale(d.Name)) 
            .attr("width", d=>xScale(d.Events))
            .attr("height", yScale.bandwidth()*0.8)
            .style("fill", "white")                            

         bars
            .select("text")
            .attr("dy", "-0.5em")
            .attr("y",d=>yScale(d.Name)) 
            .style("fill","white")
            .style("font-size","13px")
            .text(d => `${d.Name}: ${this.format(d.Events)}`); 
        }
  
}     

export { Bar };
  