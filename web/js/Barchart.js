function barChart(src,id,xdomain,ydomain){

var svg = d3.select(id).append("svg")
    .attr("width",960)
    .attr("height",500),
    margin = {top: 20, right: 20, bottom: 30, left: 80},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
  
var tooltip = d3.select(id).append("div").attr("class", "toolTip");
  
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleBand().range([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
d3.json(src, function(error, data) {
    if (error) throw error;
  
    //data.sort(function(a, b) { return a[xdomain] - b[xdomain]; });

    console.log(d3.max(data, function(d) { return d[xdomain]}));

    data.forEach(function(d) {
      d[xdomain] = +d[xdomain]/100;
  });
  
    x.domain([0, d3.max(data, function(d) { return d[xdomain]})]);
    y.domain(data.map(function(d) { return d[ydomain]; })).padding(0.1);

    console.log(x(2.93));

    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format('.0%')));

    g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

    g.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d[ydomain]); })
        .attr("width", function(d) { return x(d[xdomain]); })
        .on("mousemove", function(d){
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 700 + "px")
              .style("display", "inline-block")
              .html((d[ydomain]) + "<br>" + xdomain +": " + (d[xdomain]*100) + '%');
        })
        .on("mouseout", function(d){ tooltip.style("display", "none");});
});
}