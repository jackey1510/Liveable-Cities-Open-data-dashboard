function lineChart(src,src2, id, xdomain, ydomain){

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
var color = d3.scaleOrdinal(d3.schemeCategory10);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d[xdomain]); })
    .y(function(d) { return y(d[ydomain]); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(id).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.json(src, function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d[xdomain] = parseTime(d[xdomain])
      d[ydomain] = +d[ydomain];
  });

  // Scale the range of the data

    x.domain(d3.extent(data,function(d) { return d[xdomain]; }));
    //y.domain([0, d3.max(data, function(d) { return d[ydomain]; })]);
    y.domain([0,100]);

  //console.log(color(1));
  console.log(data);

  // Add the valueline path.
  svg.append("path")
      .data([data])
      //.filter(function(d){return d["Level description"]==="England";})
      .attr("class", "line")
      .attr("d", valueline)
      .style("stroke",color(2));
      ;

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(3).tickFormat(d3.timeFormat("%Y")));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return "Southampton"; });


});

d3.json(src2, function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d[xdomain] = parseTime(d[xdomain])
      d[ydomain] = +d[ydomain];
  });

  // Add the valueline path.
  svg.append("path")
      .data([data])
      //.filter(function(d){return d["Level description"]==="England";})
      .attr("class", "line")
      .attr("d", valueline)
      .style("stroke",color(0));
      ;

  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return "England"; });

});

}