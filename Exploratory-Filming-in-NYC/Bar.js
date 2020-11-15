class Bar {

    constructor(state, setGlobalState) {
        // initialize properties here
        this.width = window.innerWidth * 0.3;
        this.height = window.innerHeight * 0.5;
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
        this.selectArtist = d3
        .select("#dropdown-borough")
        .selectAll("option")
        .data(state.listBorough)
        .join("option")
        .attr("value", d => d)
        .text(d => d);

        this.selectGender = d3
        .select("#dropdown-category")
        .selectAll("option")
        .data(state.listCategories)
        .join("option")
        .attr("value", d => d)
        .text(d => d);

        this.selectGender = d3
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
                selectedBorough: "All Boroughs",
                selectedCategory: "All Category",
                selectedType: "All Permit Types",
                boroughActive: true,
                categoryActive: false,
                typeActive: false,
                dataSource: "../data/Summary_Borough.csv",
            })
            d3.csv("../data/Summary_Borough.csv", d3.autoType).then(data => {
                setGlobalState({
                    summaryData: data
                })
            
            })
            console.log("loaded Borugh summary",state.summaryData)
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
                selectedBorough: "All Boroughs",
                selectedCategory: "All Category",
                selectedType: "All Permit Types",
                boroughActive: false,
                categoryActive: true,
                typeActive: false,
                dataSource: "..data/Summary_Category.csv",
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
                selectedBorough: "All Boroughs",
                selectedCategory: "All Category",
                selectedType: "All Permit Types",
                boroughActive: false,
                categoryActive: false,
                typeActive: true,
                dataSource: "..data/Summary_Type.csv",
            })
            
        })

    }
    

    

    /////////DRAW

    draw(state, setGlobalState) {
        console.log("now I am drawing my graph");
/*             d3.csv(state.dataSource, d3.autoType).then(data => {
                setGlobalState({
                    summaryData: data
                })
            console.log("updated data from get data",state.summaryData)
            })
        console.log("updated data from get data outside",state.summaryData) */

        const yScale = d3
            .scaleBand()
/*             .domain(d3.range(state.summaryData.length)) */
/*             .domain([0,...Array.from(new Set(state.summaryData, d => d.Borough)]) */
            .domain(state.summaryData.length)
            .range([this.height - this.margins.top, this.margins.bottom]);
     


        const xScale = d3
            .scaleLinear()
            .domain([0, d3.max(state.summaryData, d => +d.Events)])
            .range([this.margins.left, this.width - this.margins.right])  
/*             .paddingInner(0.05) */


  
        const bars = this.svg
            .selectAll("g.bar")
            .data(state.summaryData)
            .join(
            enter =>
                enter
                .append("g")
                .attr("class", "bar")
                .call(enter => enter.append("rect"))
                .call(enter => enter.append("text")),
            update => update,
            exit => exit.remove()
            )/* .on("click", d => {
            setGlobalState({ selectedMetric: d.metric });
            }) */
    
        bars
            .transition()
            .duration(this.duration)
            .attr(
            "transform",
            d => `translate(${xScale(d.Events)}, ${yScale(d.Borough)})`
            );
    
        bars
            .select("rect")
            .transition()
            .duration(this.duration)
            .attr("width", d=>xScale(d.Events))
            .attr("height", this.height - yScale.bandwidth())
            .style("fill", "white")
    
/*         bars
            .select("text")
            .attr("dy", "-.5em")
            .text(d => `${d.metric}: ${this.format(d.value)}`); */
        }
  
    
}     

export { Bar };
  