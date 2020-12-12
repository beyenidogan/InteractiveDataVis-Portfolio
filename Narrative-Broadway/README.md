# Project 2: Narrative Visualization

*Why are Native American tribal schools struggling to meet student needs?*

### [**Final Project**](https://koffeeya.github.io/Interactive-Data-Viz-Portfolio/Project2/index.html)

<br />

## **A. PROSPECTUS**

My project explores the state of **Native American tribal schools** -- K-12 schools that are directly controlled by a tribal nation and serve the young people of that tribe. For years, I have heard stories of these schools struggling to meet student needs, but I have not seen much data to visualize their challenges.

### Data Sources
I analyzed multiple data sources for this project.

1. **Tribal schools metadata:** Initial list was taken from the [Bureau of Indian Education website](https://bie.edu/Schools/), with operators and cities added from [Wikipedia](https://en.wikipedia.org/wiki/Bureau_of_Indian_Education). Addresses added manually from Google searches, and latitude and longitude generated in Google Sheets using [this tutorial from Will Geary](https://willgeary.github.io/data/2016/11/04/Geocoding-with-Google-Sheets.html).

2. **Tribal schools scorecard data:** Math and ELA scorecard results were scraped from individual PDFs on the [Bureau of Indian Education website](https://bie.edu/HowAreWeDoing/2015-2016ReportCards/index.htm). Data limited to the 2015-2016 school year.

3. **Per Capita Income by County:** Data taken from [Wikipedia](https://en.wikipedia.org/wiki/List_of_United_States_counties_by_per_capita_income), and matched to tribal schools.

4. **Tribal schools transportation data:** Per day miles data scraped from Appendix 1-19 to 1-25 in the [2019-2020 Bureau of Indian Education Budget Justifications Report](https://bie.edu/cs/groups/xbie/documents/site_assets/idc2-092115.pdf).

5. **US States GEOJSON:** shapefile for US states taken from previous Interactive Data Visualization tutorials.

<br />

### Final Clean Datasets

1. [`schools.csv`](https://github.com/koffeeya/Interactive-Data-Viz-Portfolio/blob/master/Project2/data/schools.csv): School, City, State, Operator, Address, Latitude, Longitude, County, Income

2. [`scorecards.csv`](https://github.com/koffeeya/Interactive-Data-Viz-Portfolio/blob/master/Project2/data/scorecards.csv): School, City, State, Subject, Population, and calculated fields:

    + PercentMeet: percent of students that were proficient in the subject
    + PercentBelow: percent of students below proficient in the subject
    + N: total number of students tested
    + NumProf: number of students proficient in the subject
    + NumBelow: number of students below proficient in the subject
    + ParticipationRate: percent of student population tested
    + BusDistance: average per day miles that a school bus travels to get to each school
    + majority: flag for majority proficient sum of schools - `1` = population is more than 50% proficient, `0` = population is less than 50% proficient
    + category: flag for proficiency category color scale - `0` = 0% proficient, `1` = between 0 and 50% proficient, `2` = more than 50% proficient

3. [`usState.json`](https://github.com/koffeeya/Interactive-Data-Viz-Portfolio/blob/master/Project2/data/usState.json)

<br />

## **B. SKETCHES & MOCKUPS**

### Sketches

| Sketch 1 | Sketch 2         | Sketch 3          |
|--------|----------------|----------------|
| ![](https://raw.githubusercontent.com/koffeeya/Interactive-Data-Viz-Portfolio/master/Project2/assets/sketch1.jpg)   | ![](https://raw.githubusercontent.com/koffeeya/Interactive-Data-Viz-Portfolio/master/Project2/assets/sketch2.jpg) | ![](https://raw.githubusercontent.com/koffeeya/Interactive-Data-Viz-Portfolio/master/Project2/assets/sketch3.jpg) |


![](Project2/assets/sketch3.jpg)

<br />

### Storyboard

| **Story Points**                                                                       | **Storyboard**                                                                                       |
|----------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| Introduction                                                                           | Hero with text                                                                                       |
| A\. Tribal schools serve an important purpose for Native American youth.                | 1\. Map of tribal school locations  \|  fade in                                                      |
|                                                                                        | 2\. Map of tribal school locations \- by operator  \|  smoothly change color                         |
|                                                                                        | 3\. Map of tribal school locations \- by per capita income \| smoothly change color                  |
| B\) Students in tribal schools are falling behind, particularly vulnerable populations. | 4\. Waffle chart with math scores by school, sorted by % proficient                                  |
|                                                                                        | 5\. Waffle chart with ELA scores by school, sorted by % proficient                                   |
|                                                                                        | 6\. Color code waffle chart with % proficient by subgroup                                            |
| C\) Tribal schools face unique challenges in meeting the needs of their students.     | 7\. Scatter plot comparing % proficient in math / ELA against bus distance                           |
|                                                                                        | 8\. Bar chart showing change in school budget over five years, colored by % proficient in math / ELA |


<br />

### Mockups
*Note: text not final*

| Title Page Mockup | Story Page Mockup         |
|--------|----------------|
| ![](https://raw.githubusercontent.com/koffeeya/Interactive-Data-Viz-Portfolio/master/Project2/assets/mockup1.png) | ![](https://raw.githubusercontent.com/koffeeya/Interactive-Data-Viz-Portfolio/master/Project2/assets/mockup2.png)         |

<br />

### Style Guide

I drew inspiration for the color palette of my project from an image of a tattoo (shown left below) in a book on the Haida people of Alaska. I chose two Google Fonts: [IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans) (for headers and subtitles) and [IBM Plex Serif](https://fonts.google.com/specimen/IBM+Plex+Serif) (for paragraph text).

| Inspiration | Style Guide         |
|--------|----------------|
| ![](https://raw.githubusercontent.com/koffeeya/Interactive-Data-Viz-Portfolio/master/Project2/assets/inspiration.jpg) Haida Double Thunderbird. Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Haida_double_thunderbird_1880.jpg)| ![](https://raw.githubusercontent.com/koffeeya/Interactive-Data-Viz-Portfolio/master/Project2/assets/styleguide.png)         |

<br />

## **C. ARCHITECTURAL SCHEMA**

Files

+ `index.html` : first section as hero, the remaining sections as two columns
+ `style.css` : use flexbox for layout
+ `main.js` : read in and filter data, draw, init, set global state
+ `map.js` : draw map, set transitions for each step
+ `waffle.js` : draw waffle, set event listener on population filters
+ `bar.js` : draw bar charts, set transitions