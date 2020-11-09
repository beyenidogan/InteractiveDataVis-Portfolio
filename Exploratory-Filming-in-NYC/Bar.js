class Bar {

    constructor(state, setGlobalState) {
      // initialize properties here
/*       this.width = window.innerWidth * 0.6;
      this.height = window.innerHeight * 0.6;
      this.margins = { top: 20, bottom: 20, left: 20, right: 20 }; */
      this.width = 200;
      this.height = 150;
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


        // Create dropdown lists
        this.boroughs = d3.map(state.data, d => d.Borough).keys().sort()
        this.boroughs.unshift(["All Boroughs"])

        this.categories = d3.map(state.data, d => d.Category).keys().sort()
        this.categories.unshift(["All Categories"])

        this.types = d3.map(state.data, d => d.EventType).keys().sort()
        this.types.unshift(["All Permit Types"])

        // Add options to dropdowns
        this.selectArtist = d3
        .select("#dropdown-borough")
        .selectAll("option")
        .data(this.boroughs)
        .join("option")
        .attr("value", d => d)
        .text(d => d);

        this.selectGender = d3
        .select("#dropdown-category")
        .selectAll("option")
        .data(this.categories)
        .join("option")
        .attr("value", d => d)
        .text(d => d);

        this.selectGender = d3
        .select("#dropdown-type")
        .selectAll("option")
        .data(this.types)
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
                dataSource: "data/Summary_Borough.csv",
            })
            d3.csv(state.dataSource, d3.autoType).then(data => {
                setGlobalState({
                    summaryData: data
                })
                console.log("updated data1",state.summaryData)
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
                selectedBorough: "All Boroughs",
                selectedCategory: "All Category",
                selectedType: "All Permit Types",
                boroughActive: false,
                categoryActive: true,
                typeActive: false,
                dataSource: "data/Summary_Category.csv",
            })
            d3.csv(state.dataSource, d3.autoType).then(data => {
                setGlobalState({
                    summaryData: data,
                    summaryDomain : [
                        0, 
                        d3.max(data
                          .map(d => d[Events])
                          .flat()
                        )]
                        
                })
                console.log("updated data2",state.summaryData)
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
                dataSource: "data/Summary_Type.csv",
            })
            d3.csv(state.dataSource, d3.autoType).then(data => {
                setGlobalState({
                    summaryData: data
                })
                console.log("updated data3",state.summaryData)
            })
        })
        d3.csv(state.dataSource, d3.autoType).then(data => {
            setGlobalState({
                summaryData: data
            })
            console.log("updated data4",state.summaryData)
        })
        
    }
    
    /////////DRAW

    draw(state, setGlobalState) {
      console.log("now I am drawing my graph");
        

        const yScale = d3
            .scaleBand()
            .domain(state.summaryDomain)
            .range([this.height - this.margins.top, this.margins.bottom]);
        
        const xScale = d3
            .scaleLinear()
            .domain([0, d3.max(state.summaryData, d => +d.Events)])
            .range([this.margins.left, this.width - this.margins.right])  
/*             .paddingInner(0.05) */
        console.log(xScale(690))

  
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
    
        bars
            .select("text")
            .attr("dy", "-.5em")
            .text(d => `${d.metric}: ${this.format(d.value)}`);
        }
  
    
}     

export { Bar };
  