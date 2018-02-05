
/**********************************************************************
// embalse.js
// Jordan Caraballo & Elio Ramos, University of Puerto Rico at Humacao
// Mathematics Department, Comp-4019
// Details: This file contains JS functions to process and graph data
// from Puerto Rico's principal water reservoirs.
**********************************************************************/

/////////////////////////////////////////////////////////////////
// Round decimals to a certain decimal number
/////////////////////////////////////////////////////////////////

function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

//////////////////////////////////////////////////////////////
// Return name from reservoir based on its ID
//////////////////////////////////////////////////////////////

function returnName(embalseID) {

   var name; // string variable to store embalse name
   switch(embalseID) {
       case ("50059000"):
           name = "Carraizo";
           break;
       case ("50045000"):
           name = "La_Plata";
           break;
       case ("50047550"):
           name = "Cidra";
           break;
       case ("50093045"):
           name = "Patillas";
           break;
       case ("50111210"):
           name = "Toa_Vaca";
           break;
       case ("50076800"):
           name = "Rio_Blanco";
           break;
       case ("50026140"):
           name = "Caonillas";
           break;
       case ("50071225"):
           name = "Fajardo";
           break;
       case ("50113950"):
           name = "Cerrillos";
           break;
        case ("50039995"):
           name = "Carite";
           break;
        case ("50010800"):
           name = "Guajataca";
           break;
   }
   return name;
}

//////////////////////////////////////////////////////
// Generate URL from USGS from its ID - requires network
//////////////////////////////////////////////////////

function urlEmbalse(embalseID) {
    var url1 = 'https://waterdata.usgs.gov/pr/nwis/uv/?format=rdb&site_no=';
    var url2 = embalseID.concat('&period=1');
    var url  = url1.concat(url2);
    return url;
}

////////////////////////////////////////////////////////////////////////////////////
// Generate local URL (path) from USGS from its ID - requires data folder with text files
////////////////////////////////////////////////////////////////////////////////////

function urlEmbalseLocal(embalseID) {
    var url = embalseID.concat(".txt"); // path to local files
    return "data/" + url;
}

/////////////////////////////////////////////////////////////////
// Parse output from USGS URL, returns a list of the cleaned data
/////////////////////////////////////////////////////////////////

function parseData(table) {

    data = [];
    var npos   = table.search("agency") - 1;
    table      = table.substr(npos,table.length);
    tableArray = table.split("USGS");

    // Creates two columns array - time and level in meters
    for (var i = 1; i < tableArray.length; i++) {
       var temp = tableArray[i].split("\t");
       tempTime = temp[2].split(" ");
       tempDate = tempTime[0].split("-");
       tempHour = tempTime[1].split(":");
       data.push({time: new Date(tempDate[0], tempDate[1]-1,
                                 tempDate[2], tempHour[0],
                                 tempHour[1]),
                   level: parseFloat(temp[temp.length - 2])});
    }
    return data;
}

/////////////////////////////////////////////////////////////////////////////////
// Graph level of reservoirs with a div element in leaflet. The dataset array,
// the title, and a div element are given.
/////////////////////////////////////////////////////////////////////////////////

function graphMarker(dataset,title,div) {

    var w = 300; // width
    var h = 300; // height

    // margins for the graph
    var margin_x = 50;
    var margin_y = 50;

    var xScale, yScale, line;
    var xAxisBottom,xAxisTop,yAxisLeft,yAxisRighit;

    var formatTime = d3.timeFormat("%-I:%M %p"); // Define time in hours, minutes, am y pm

    // define two arrays from the dataset structure
    ax = dataset.map((item) => item.time);
    ay = dataset.map((item) => item.level);

    // upper and lower limits
    var xLowLim = d3.min(ax);
    var xUpLim  = d3.max(ax);

    // dataset ranges
    var eps     = 0.001;
    var yLowLim = (1 - eps) * d3.min(ay);
    var yUpLim  = (1 + eps) * d3.max(ay);

    // scale x and y data
    xScale = d3.scaleTime()
               .domain([xLowLim,xUpLim])
               .range([0 + margin_x,w - margin_x]);

    yScale = d3.scaleLinear()
               .domain([yLowLim,yUpLim])
               .range([h - margin_y,0 + margin_y]);

    // define x and y axis grids
    function make_x_gridlines() {
      return d3.axisBottom(xScale)
               .ticks(10)
    }

    function make_y_gridlines() {
      return d3.axisLeft(yScale)
               .ticks(10)
    }

    // generate coordinates for ploting the lines
    line = d3.line()
             .x(function(d) { return xScale(d.time); })
             .y(function(d) { return yScale(d.level); });

    // X Axis: data is shown every 8 hours in time format
    xAxisBottom = d3.axisBottom()
                    .scale(xScale)
                    .ticks(d3.timeHour.every(8))
                    .tickFormat(formatTime)
                    .tickSizeOuter(0)
                    .tickSizeInner(3)

    xAxisTop = d3.axisTop()
                 .scale(xScale)
                 .tickSizeOuter(0)
                 .tickSizeInner(0)
                 .tickFormat("");

    // Y Axis: data levels in meters
    yAxisLeft  = d3.axisLeft()
                   .scale(yScale)
                   .tickSizeOuter(0)
                   .tickSizeInner(6);

    yAxisRight = d3.axisRight()
                   .scale(yScale)
                   .tickSizeOuter(0)
                   .tickSizeInner(0)
                   .tickFormat("");


    // Create SVG
    var svg = d3.select(div)
        .select("svg")
        .attr("width", w)
        .attr("height", h);

    // Create line
    svg.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("d", line);

    // Locate axis
    svg.append("g")
        .style("font-size","9px")
        .attr("class","axisBottom")
        .attr("transform","translate(0," + (h - margin_y) + ")")
        .call(xAxisBottom)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-65)"
        });

    svg.append("g")
        .attr("class","axisTop")
        .attr("transform","translate(0," + (margin_y) + ")")
        .call(xAxisTop);

    svg.append("g")
        .attr("class","axisLeft")
        .attr("transform","translate(" + (margin_x) + ",0)")
        .call(yAxisLeft);

    svg.append("g")
        .attr("class","axisRight")
        .attr("transform","translate(" + (w - margin_x) + ",0)")
        .call(yAxisRight);

    // Define date format in /m/d/a time
    var newDate = d3.timeFormat("%d/%m/%Y %-H:%M")(xUpLim);

    // Title
    svg.append("text")
      .attr("transform","translate("+(w/2)+","+(h - 280)+")")
      .style("text-anchor","middle")
      .text(title + "  " + newDate);

    // Max level, min level and other details that appear in the upper level of the graph
    svg.append("text")
      .attr("transform","translate("+(w/2)+","+(h - 260)+")")
      .style("text-anchor","middle")
      .text("Nivel m\u00ednimo: " + Math.round(yLowLim * 100) / 100 + "m nivel m\u00E1ximo: " + Math.round(yUpLim * 100) / 100 + "m");

    svg.append("text")
             .attr("transform","translate(7,"+(h/2)+") rotate(-90)")
             .style("text-anchor","middle")
             .text("Nivel [metros]");

    // Plot X and Y axis gridlines
    svg.append("g")
       .attr("class", "grid")
       .attr("transform", "translate(0," + (h - margin_y) + ")")
       .call(make_x_gridlines()
            .tickSize(-h+100)
            .tickFormat("")
       )

     svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(" + (margin_x) + ",0)")
        .call(make_y_gridlines()
             .tickSize(-h+100)
             .tickFormat("")
        )
}
