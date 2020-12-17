# **Project 1: Exploratory Visualization**

[Link to Project: Filming in NYC](https://beyenidogan.github.io/Viz-Portfolio/Exploratory-Filming-in-NYC/)

## **PROSPECTUS**

It is required to have an official permit from the municipality that gives permission for filmmaking while balancing the needs of the community in the neighborhood. NYC is one of the most popular filming locations in the country, but as with everything else there has been a sharp decline in filming related activities due to COVID-19 in 2020. 
This project aims to explore both the history of trends of permits over <strong>years, seasons, regions and category </strong>and to document <strong>the impact of and future rebound from the pandemic</strong>.

* What are most common film making activities (e.g. Tv shows, movies)?
* Which parts of the city are most popular for film making?
* What are the seasonal trends (summer, Christmas)?
* What is the impact of COVID (early and late-COVID) and will it improve…?



## **SKETCHES, MOCKUPS & ARCHITECTURE**

I started the data exploration and design process using Tableau. This helped me to come up with a range of design features I could potentially implement.
Each visual correspond to one js file being imported to main js. Thus the design itself informs the file structure.

<br />

The current version of the dashboard is MVP1 with the aim to expand to the other features later.

### Sketches
![](https://github.com/beyenidogan/Viz-Portfolio/blob/main/assets/Documents/Exploratory_Sketch1.png)

![](https://github.com/beyenidogan/Viz-Portfolio/blob/main/assets/Documents/Exploratory_Sketch2.png)

![](https://github.com/beyenidogan/Viz-Portfolio/blob/main/assets/Documents/Exploratory_Sketch3.png)

<br />


## **DATA**

### Data Source
I downloaded the "Film Permits"  dataset from the [NYC Open Data](https://data.cityofnewyork.us/City-Government/Film-Permits/tg4x-b46p) in a CSV format.


### Data Processing

1. I used Tableau the obtain the aggregated totals by Borough, Category and Type for Bar chart, flagged these records as BarData. And also for time series also created the same aggregations considering the time by rolling up to month, and flagged these records as LineData.

2. Combined these in one file to be filtered on for appropriate visualization.

<br />


## **SOURCES**
[NYC Open Data](https://data.cityofnewyork.us/City-Government/Film-Permits/tg4x-b46p)

<br />

