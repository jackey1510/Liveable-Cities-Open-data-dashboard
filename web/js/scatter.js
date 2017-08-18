function scatterPlot(src, id, xdomain, ydomain){

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y");

// set the ranges
var x = d3.scalePoint().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
var color = d3.scaleOrdinal(d3.schemeCategory10);

var tooltip = d3.select('.toolTip');

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(id);

svg.selectAll('*').remove();

svg.append("g")
  .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.json(src, function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d[ydomain] = +d[ydomain];
  });

  data.sort(function(a, b) { return a[ydomain] - b[ydomain]; })

  // Scale the range of the data
  sss = data.map(function(d) { return d[xdomain]; });
  console.log(sss);
    x.domain(data.map(function(d) { return d[xdomain]; }));
    //y.domain([0, d3.max(data, function(d) { return d[ydomain]; })]);
    y.domain([d3.min(data, function(d) { return d[ydomain]; }),d3.max(data, function(d) { return d[ydomain]; })]);

  //console.log(color(1));
  console.log(x("Fife"));

  // Add the scatterplot
  svg.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", 5)
      .attr("cx", function(d) { return x(d[xdomain]); })
      .attr("cy", function(d) { return y(d[ydomain]); })
      .attr("fill", function(d){
        if (d[xdomain] === "Southampton"){
          return color(0);
        }
        else if ((d[xdomain] === "UNITED KINGDOM")){
          return color(1)
        }
        else {
          return color(2);
        }})
      .style('opacity',function(d){
        if (d[xdomain] === "Southampton" || d[xdomain] === "UNITED KINGDOM"){
          return 1;
        }
        else {
          return 0.05;
        }})
      .on("mousemove", function(d){
            tooltip
              .style("left", d3.event.pageX  + "px")
              .style("top", d3.event.pageY - 170 + "px")
              .style("display", "inline-block")
              .html((d[ydomain]) + "<br>" + xdomain +": " + (d[xdomain]));
        })
        .on("mouseout", function(d){ tooltip.style("display", "none");});



  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(0).tickFormat(''));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  svg.append("line")
     .attr("x1", x("Southampton"))
     .attr("x2", x("Southampton"))
     .attr("y1", y(d3.min(data, function(d) { return d[ydomain]; })))
     .attr("y2", y(d3.max(data, function(d) { return d[ydomain]; })))
     .attr("stroke-width",2)
     .attr("stroke", color(0));

  svg.append("line")
     .attr("x1", x("UNITED KINGDOM"))
     .attr("x2", x("UNITED KINGDOM"))
     .attr("y1", y(d3.min(data, function(d) { return d[ydomain]; })))
     .attr("y2", y(d3.max(data, function(d) { return d[ydomain]; })))
     .attr("stroke-width",2)
     .attr("stroke", color(1));

  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  svg.append("text")
      .attr("x", 50)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text("Other");
  svg.append("text")
      .attr("x", 50)
      .attr("y", 29)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text("Southampton");
  svg.append("text")
      .attr("x", 50)
      .attr("y", 49)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text("United Kingdom");

});

}