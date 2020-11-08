// Define margin and the svg windows' width and height.
var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom,
    barPadding = 5;

var svg = d3.select("body")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseYear = d3.timeParse("%Y");
var formatYear = d3.timeFormat("%Y");

// Load and parse the data.
d3.dsv(",", "q3.csv", function(data) {
    return {year: parseYear(data.year),
            running_total: parseInt(data.running_total)
    };
}).then(function(data) {
    // Define x-scale.
    var xScale = d3.scaleTime()
                   .domain([d3.min(data, function(data) {return data.year;}),
                            d3.max(data, function(data) {return data.year;})])
                   .range([0, width]);
    // Define y-scale.
    var yScale = d3.scaleLinear()
                   .domain([0, d3.max(data, function(data) {return data.running_total;})])
                   .range([height, 0]);
    var yScaleBar = d3.scaleLinear()
                      .domain([d3.min(data, function(data) {return data.running_total;}),
                               d3.max(data, function(data) {return data.running_total;})])
                      .range([0, height]);
    // Restrict the year range for setting x-axis to show one tick per 3 years
    var yearRange = d3.timeYear.range(d3.min(data, function(data) {return data.year;}),
                                      d3.max(data, function(data) {return data.year;}), 3)
12345678901234567890123456789012345678901234567890123456789012345678901234567890
    // Set x-axis where the bars are ordered by ascending time from the left
    var xAxis = d3.axisBottom()
                  .scale(xScale)
                  .tickValues(yearRange);

    svg.append("g")
       .attr("class", "x-axis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis);

    svg.append("g")
       .attr("class", "y axis")
       .call(d3.axisLeft(yScale));

    svg.selectAll("rect")
       .data(data)
       .enter()
       .append("rect")
       .attr("x", function(data) {return xScale(data.year);})
       // The height of each bar corresponds to the running total of LEGO sets
       .attr("y", function(data) {return [height - yScaleBar(data.running_total)];})
       .attr("width", width / data.length - barPadding)
       .attr("height", function(data) {return yScaleBar(data.running_total);})
       .attr("fill", "steelblue")
})