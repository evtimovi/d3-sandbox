/*d3.csv('barchart_data.csv', process_barchart_data, function(error, data){
    if (error) throw error;
    barchart(data);
});
*/
d3.csv("scatterplot_data.csv", process_scatterplot_data, function(error, data) {
  if (error) throw error;
  scatterplot(data);
});


var barchart = function(data){

    d3.select("svg").remove();

    var barColors = ['#2176C7','#D11C24'];
    var highlightColor = '#cde03c';

    var schools = data.map((v)=>v.school).filter((v, i, a)=> a.indexOf(v)===i);
    console.log('schools: ' + schools)

    var margin = {top: 50, right: 300, bottom: 60, left: 70};
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    spaceFactor = 5, //how big is the space relative to the bar
    barWidth = width/(((2*spaceFactor+1)/(2*spaceFactor))*data.length + 1),
    space = barWidth/spaceFactor;
    //barWidth = width/data.length,
    //space = barWidth/5; //the space is for the grouping
    //barWidth = (width - (data.length/2)*space)/data.length;

    var xScaleRange = [0];
    var i = 0;
    for(i = barWidth; i < width; i += 2*(barWidth+space))
    {
        xScaleRange.push(i)
    }
    xScaleRange.push((i-barWidth-2*space));

    var xScaleDom = data.map(function(d){return (+d.year)+'/'+(+d.year+1);})
    xScaleDom = [''].concat(xScaleDom)
    xScaleDom = xScaleDom.concat([''])

    var xScale = d3.scale.ordinal()
                .domain(xScaleDom)
                .range(xScaleRange)

   
    var yScale = d3.scale.linear()
    .range([height, 0])
    .domain([0, d3.max(data, function(d){return +d.value;})]);

    var tooltip = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('padding', '0 10px')
        .style('background', 'white')
        .style('opacity', 0)

    var chart = d3.select('#chart').append('svg')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("id", "bars")
    
    var bars = chart.selectAll('rect')
      .data(data)
      .enter().append('rect')
          .attr("width", barWidth)
          .attr("height", 0)
          .attr('x', function(d, i){return (i*barWidth + (i*space) + (space*(Math.abs((i%2)-1))))})
          .attr('y', height)
          .attr("fill", function(d){
                    if (d.school === schools[0])
                    {
                        return barColors[0];
                    }
                    else
                    {
                        return barColors[1];
                    }
            })
            .on('mouseover', function(d) {

                tooltip.transition()
                    .style('opacity', .9)

                tooltip.html(d.value)
                    .style('left', (d3.event.pageX - 35) + 'px')
                    .style('top',  (d3.event.pageY - 30) + 'px')

             

                tempColor = this.style.fill;
                d3.select(this)
                    .style('opacity', .5)
            })

            .on('mouseout', function(d) {
                d3.select(this)
                    .style('opacity', 1)
                    .style('fill', tempColor)
                tooltip.transition().style('opacity',0)
            });


    var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(' + space +','  + height +')' )
        .call(xAxis)

    var xAxisTextSize = (width*3)/112;

    //d3.select('.x.axis').selectAll("g text").attr("font-size", xAxisTextSize + "px")

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");
    chart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + space/2 + ",0)")
        .call(yAxis);

    var legendBarWidth = 30,
    legendBarHeight = height/15;

    var legend = chart
        .append("g")
        .attr("transform", "translate(" + (width+margin.left) + "," + margin.top +")")
        .attr("id", "legend")

    var legendGroups = legend.selectAll("g")
        .data(schools)
        .enter().append("g")
        .attr("transform", function(d, i){return "translate(0," + i*(legendBarHeight+5) + ")";});

    
    legendGroups.append("rect")
            .attr("fill", function(d, i){ return barColors[i%2];})
            .attr("width", legendBarWidth)
            .attr("height", legendBarHeight)
            .attr("transform", "translate(0,0)")
    legendGroups.append("text")
            .attr("transform", "translate(" + (legendBarWidth+3) +","+ 12 +")" )
            .attr("font-size", 12 + "px")
            .text(function(d){return d;})

    var xLabel = chart
                .append('g')
                .attr('id', 'xLabel')
                .attr("transform", "translate(" + 0 + ',' + (height + margin.bottom*0.75) + ')')
                .append('text')
                    .text('Academic Year')
                    .attr('text-anchor', 'start')
                    //.attr('font-size', xAxisTextSize)

    var yLabel = chart.append('g')
                .attr('id', 'yLabel')
                .attr('transform', 'translate(-' + margin.left/2 + ',' + height + ')')
                .append('text')
                    .text('% Male Students')
                    .attr('transform', 'rotate(-90)')
                    .attr('text-anchor', 'start')
                    
    bars.transition()
        .attr("height", function(d){return height - yScale(d.value)})
        .attr("y", function(d){return yScale(d.value)})
        .delay(function(d, i) {
            return i * 50;
        })
        .duration(750)
        .ease('elastic');
};


var scatterplot = function(data){

  d3.select("svg").remove();

  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.category10();

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
     x.domain(d3.extent(data, function(d) { return d.xValue; })).nice();
    y.domain(d3.extent(data, function(d) { return d.yValue; })).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .attr('font-size', '10px')
      .text("% Male Students in the District");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .attr('font-size', '10px')
      .text("District Dropout Rate")


  var dots = svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 0)
      .attr("cx", (Math.random()*width))
      .attr("cy", (Math.random()*height))
      .style("fill", color.white);

 
  dots.transition()
    .attr("r", 3.5)
    .attr("cx", function(d) { return x(d.xValue); })
    .attr("cy", function(d) { return y(d.yValue); })
    .style("fill", color.black)
    .delay(function(d, i) {
            return i * 5;
        })
        .duration(500)
        .ease('elastic');
};


function process_barchart_data(d){
   return {
    year: d.academic_year_start,
    value: +d.value,
    school: d.school_name
   };
};

function process_scatterplot_data(d){
  return  {
    yValue: +d.yValue,
    xValue: +d.xValue
  };
};