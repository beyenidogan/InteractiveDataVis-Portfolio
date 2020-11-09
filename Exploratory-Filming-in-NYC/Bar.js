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
            console.log("artist clicked")
            d3.select("#borough-container.dropdown")
            .attr("style", "display: visible")
            d3.select("#category-container.dropdown")
            .attr("style", "display: none")
            d3.select("#type-container.dropdown")
            .attr("style", "display: none")
            setGlobalState({
                selectedBorough: "All Boroughs",
                selectedCategory: "All Category",
                selectedType: "All Permit Types",
                boroughActive: true,
                categoryActive: false,
                typeActive: false,
                dataSource: "data/Summary_Borough.csv",
            })
        })


        this.changeCategoryActive = d3
        .select("#category-button")
        .on("click", function () {
            console.log("gender clicked")
            d3.select("#category-container.dropdown")
            .attr("style", "display: visible")
            d3.select("#borough-container.dropdown")
            .attr("style", "display: none")
            d3.select("#type-container.dropdown")
            .attr("style", "display: none")
            setGlobalState({
                selectedBorough: "All Boroughs",
                selectedCategory: "All Category",
                selectedType: "All Permit Types",
                boroughActive: false,
                categoryActive: true,
                typeActive: false,
                dataSource: "data/Summary_Category.csv",
            })
        })

        this.changeTypeActive = d3
        .select("#type-button")
        .on("click", function () {
            console.log("gender clicked")
            d3.select("#category-container.dropdown")
            .attr("style", "display: none")
            d3.select("#borough-container.dropdown")
            .attr("style", "display: none")
            d3.select("#type-container.dropdown")
            .attr("style", "display: visible")
            setGlobalState({
                selectedBorough: "All Boroughs",
                selectedCategory: "All Category",
                selectedType: "All Permit Types",
                boroughActive: false,
                categoryActive: false,
                typeActive: true,
                dataSource: "data/Summary_Type.csv",
            })
        })


    }
  



    /////////DRAW

    draw(state, setGlobalState) {
      console.log("now I am drawing my graph");
  
      const yScale = d3
        .scaleBand()
        .domain(state.domain)
        .range([this.height - this.margins.top, this.margins.bottom]);
  
      const xScale = d3
        .scaleBand()
        .domain(metrics)
        .range([this.margins.left, this.width - this.margins.right])
        .paddingInner(0.05);
  
      const bars = this.svg
        .selectAll("g.bar")
        .data(metricData)
        .join(
          enter =>
            enter
              .append("g")
              .attr("class", "bar")
              .call(enter => enter.append("rect"))
              .call(enter => enter.append("text")),
          update => update,
          exit => exit.remove()
        ).on("click", d => {
          setGlobalState({ selectedMetric: d.metric });
        })
  
      bars
        .transition()
        .duration(this.duration)
        .attr(
          "transform",
          d => `translate(${xScale(d.metric)}, ${yScale(d.value)})`
        );
  
      bars
        .select("rect")
        .transition()
        .duration(this.duration)
        .attr("width", xScale.bandwidth())
        .attr("height", d => this.height - yScale(d.value))
        .style("fill", d => d.metric === state.selectedMetric ? "purple" : "#ccc")
  
      bars
        .select("text")
        .attr("dy", "-.5em")
        .text(d => `${d.metric}: ${this.format(d.value)}`);
    }
  
}
  

   


export { Bar };
  