function lineChart(divid, dropdownid,src, filter, id, xdomain, ydomain, zdomain, xlabel, ylabel, positivetrend, oneline,timeparse, filter2){

  var endpoint = "http://2d73a3b0.ngrok.io/api/v1";

  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 50, bottom: 90, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // parse the date / time
  var parseTime = d3.timeParse(timeparse);

  // set the ranges
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var xAxis,yAxis;

  var src2;

  var min;

  var max;

  d3.selectAll('#'+dropdownid).remove();


  var selector = d3.select(divid)
      .append("select")
            .attr('id', dropdownid);

  // define the line
  var valueline = d3.line()
      .x(function(d) { return x(d[xdomain]); })
      .y(function(d) { return y(d[ydomain]); });

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select(id);
  svg.selectAll('*').remove();
  g = svg.append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  d3.json(endpoint+filter, function(error, data) {

    console.log(data);
    var nest = d3.nest()
    .key(function(d) { return d[zdomain]; })
    .entries(data);

    var min = d3.min(data,function(d){return d[ydomain]});
    var max = d3.max(data,function(d){return d[ydomain]});

    y.domain([min,max]);

    selector.selectAll("option")
          .data(nest)
          .enter().append("option")
          .attr("value", function(d){
            return d["key"];
          })
          .text(function(d){
            return d["key"];
          })

    selector
          .on("change", function(d){
              selection = document.getElementById(dropdownid);
          console.log(selection.value);
              //x.domain([0, d3.max(data, function(d){
            //return +d[selection.value];})]);
            d3.selectAll("#"+dropdownid+"line2").remove();
            d3.selectAll(".line").attr("d",valueline).transition();

            line2(selection.value);



    

    });

  // Get the data
  d3.json(endpoint + src, function(error, data) {
    if (error) throw error;

    // format the data
    data.forEach(function(d) {
        d[xdomain] = parseTime(d[xdomain]);
        d[ydomain] = +d[ydomain];
    });

    // Sort data by year
    
    data.sort(function(a, b) { return b[xdomain] - a[xdomain]; })

    console.log(data[0],data[1])

    
    // Scale the range of the data

    //min = d3.min(data,function(d){return d[ydomain]});

    //max = d3.max(data,function(d){return d[ydomain]});

      x.domain(d3.extent(data,function(d) { return d[xdomain]; }));
      //y.domain([0, d3.max(data, function(d) { return d[ydomain]; })]);
      y.domain([min,max]);

    //console.log(color(1));
    console.log(min,max);

    // Add the valueline path.
    g.append("path")
        .data([data])
        //.filter(function(d){return d["Level description"]==="England";})
        .attr("class", "line")
        .attr("d", valueline)
        .style("stroke",color("Southampton"));
        ;

    // Add the X Axis
    xAxis = d3.axisBottom(x).ticks();
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

   g.append("text")             
        .attr("transform",
              "translate(" + (width/2) + " ," + 
                             (height + 50) + ")")
        .style("text-anchor", "middle")
        .text(xlabel);

    // Add the Y Axis
   yAxis = d3.axisLeft(y);
   g.append("g")
        .attr("class","y-axis")
        .call(yAxis);

    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(ylabel); 

    var legend = g.selectAll(".legend")
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
        .text("Southampton");

    if ((data[0][ydomain]< data[1][ydomain] && positivetrend)||(data[0][ydomain]>data[1][ydomain] && !positivetrend)){

      g.append("text")
        .attr("y", 0)
        .attr("x", 20)
        .attr("dy", "1em")
        .style("text-anchor", "start")
        .style("font-size", 20)
        .style("fill","red")
        .text("Worse than previous period"); 

    }

    if (data[0][ydomain] === data[1][ydomain]){

      g.append("text")
        .attr("y", 0)
        .attr("x", 20)
        .attr("dy", "1em")
        .style("text-anchor", "start")
        .style("font-size", 20)
        .style("fill","black")
        .text("Unchanged"); 

    }

    if ((data[0][ydomain]>data[1][ydomain] && positivetrend)||(data[0][ydomain]<data[1][ydomain] && !positivetrend)){

      g.append("text")
        .attr("y", 0)
        .attr("x", 20)
        .attr("dy", "1em")
        .style("text-anchor", "start")
        .style("font-size", 20)
        .style("fill","green")
        .text("Better than previous period"); 

    }
    if(oneline != true){
      line2(nest[0]["key"]);
    }
    

  });
  function line2(selection){

    src2 = endpoint+filter+"?filter[where]["+zdomain+"]="+selection;
    if (filter2){
      src2 = endpoint + filter2  + selection;
    }
    d3.json(src2, function(error, data) {
    if (error) throw error;
    
    
    // format the data
    data.forEach(function(d) {
        d[xdomain] = parseTime(d[xdomain]);
        d[ydomain] = +d[ydomain];
    });

    data.sort(function(a, b) { return a[xdomain] - b[xdomain]; })

    // Add the valueline path.

    g = svg.select('g');
    g.append("path")
        .data([data])
        //.filter(function(d){return d["Level description"]==="England";})
        .attr("id", dropdownid+"line2")
        .attr("class","line2")
        .attr("d", valueline)
        .style("stroke",color(0));

    d3.selectAll("#"+dropdownid+"legend-text").remove();

    var legend = g.selectAll("#"+dropdownid+"legend2")
        .data(color.domain())
      .enter().append("g")
        .attr("id", dropdownid+"legend2")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    g.append("text")
        .attr("id", dropdownid+"legend-text")
        .attr("x", width - 24)
        .attr("y", 29)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(selection);


  });
  }



    

    

  })
}