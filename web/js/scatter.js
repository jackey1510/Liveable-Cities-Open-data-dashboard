function scatterPlot(tooltipid,divid, dropdownid, route, id, xdomain, ydomain, standard, target, xlabel, ylabel, order){
  var endpoint = "http://2d73a3b0.ngrok.io/api/v1";
  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 50, bottom: 70, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // parse the date / time
  var parseTime = d3.timeParse("%Y");

  d3.selectAll('#'+dropdownid).remove();

  // set the ranges
  var x = d3.scalePoint().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var tooltip = d3.select(tooltipid);

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select(id);

  svg.selectAll('*').remove();

  var g = svg.append("g")
    .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // Get the data
  d3.json(endpoint + route, function(error, data) {
    if (error) throw error;

    // format the data
    data.forEach(function(d) {
        d[ydomain] = +d[ydomain];
    });


    if(order === "dsc"){
      data.sort(function(a, b) { return b[ydomain] - a[ydomain]; })
    }
    else{
      data.sort(function(a, b) { return a[ydomain] - b[ydomain]; })
    }
    

    // Scale the range of the data
    sss = data.map(function(d) { return d[xdomain]; });
    console.log(sss);
      x.domain(data.map(function(d) { return d[xdomain]; }));
      //y.domain([0, d3.max(data, function(d) { return d[ydomain]; })]);
      y.domain([d3.min(data, function(d) { return d[ydomain]; })*0.99,d3.max(data, function(d) { return d[ydomain]; })*1.01]);


    // Add the scatterplot
    g.selectAll("dot")
        .data(data)
      .enter().append("circle")
        .attr("r", 7.5)
        .attr("cx", function(d) { return x(d[xdomain]); })
        .attr("cy", function(d) { return y(d[ydomain]); })
        .attr("fill", function(d){
          if (d[xdomain] === target){
            return color(target);
          }
          else if ((d[xdomain] === standard)){
            return color(standard)
          }
          else {
            return color("Other");
          }})
        .style('opacity',function(d){
          if (d[xdomain] === target || d[xdomain] === standard){
            return 1;
          }
          else {
            return 0.05;
          }})
        /*.on("mouseover", function(d) {


            var xPosition = parseFloat(d3.select(this).attr("x"));
            var yPosition = parseFloat(d3.select(this).attr("y"));

            d3.select("#tooltip")
              .style("left", xPosition + "px")
              .style("top", yPosition + "px")
              .select("#value")
              .text(d);


            d3.select("#tooltip").classed("hidden", false);

           })
           .on("mouseout", function() {


            d3.select("#tooltip").classed("hidden", true);

           });*/
        .on("mouseover", function(d){
          var xPosition = parseFloat(d3.event.pageX)-250;
            var yPosition = parseFloat(d3.event.pageY)-170;

            console.log(yPosition)
              tooltip
                .style("font-size", "24px")
                .html(ylabel + ": " + (d[ydomain]) + " " + xdomain +": " + (d[xdomain]));
          })
          .on("mouseout", function(d){ tooltip.html("<br>");});



    // Add the X Axis
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(0).tickFormat(''));
    g.append("text")             
        .attr("transform",
              "translate(" + (width/2) + " ," + 
                             (height+20) + ")")
        .style("text-anchor", "middle")
        .text(xlabel);

    // Add the Y Axis
    g.append("g")
        .call(d3.axisLeft(y));

    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(ylabel); 

    g.append("line")
       .attr("x1", x(target))
       .attr("x2", x(target))
       .attr("y1", y(d3.min(data, function(d) { return d[ydomain]; })))
       .attr("y2", y(d3.max(data, function(d) { return d[ydomain]; })))
       .attr("stroke-width",2)
       .attr("stroke", color(target));

    g.append("line")
       .attr("x1", x(standard))
       .attr("x2", x(standard))
       .attr("y1", y(d3.min(data, function(d) { return d[ydomain]; })))
       .attr("y2", y(d3.max(data, function(d) { return d[ydomain]; })))
       .attr("stroke-width",2)
       .attr("stroke", color(standard));

    var legend = g.selectAll(".legend")
        .data(color.domain())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", 40)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d) { return d;})

    /*svg.append("text")
        .attr("x", 50+margin.left)
        .attr("y", 9+margin.top)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text("Other");
    svg.append("text")
        .attr("x", 50+margin.left)
        .attr("y", 29+margin.top)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(target);
    svg.append("text")
        .attr("x", 50+margin.left)
        .attr("y", 49+margin.top)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(standard);*/

  })
}