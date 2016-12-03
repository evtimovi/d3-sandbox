d3.csv('data.csv', row, function(error, data){
    
    var margin = {top: 20, right: 30, bottom: 30, left: 40};
    width = 700 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
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



    var chart = d3.select('#chart')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    
    var bars = chart.selectAll('rect')
      .data(data)
      .enter().append('rect')
          .attr("width", barWidth)
          .attr("height", 0)
          .attr('x', function(d, i){return (i*barWidth + (i*space) + (space*(Math.abs((i%2)-1))))})
          .attr('y', height)
          .attr("fill", function(d){
                    if (d.school === 'Trinity East El Sch')
                    {
                        return '#2176C7';
                    }
                    else
                    {
                        return '#D11C24';
                    }
            });
/*
    var bar = chart.selectAll("g")
        .data(data)
        .enter().append("g")
            .attr("transform", function(d, i){
                return "translate(" + (i*barWidth + (i*space) + (space*(Math.abs((i%2)-1)))) + "," + 
                    (yScale(d.value)) +")";
            });
*/
/*    var rects = bar.append("rect")
            .attr("width", barWidth)
            .attr("height", 0)
            .attr("fill", function(d){
                if (d.school === 'Trinity East El Sch')
                {
                    return '#2176C7';
                }
                else
                {
                    return '#D11C24';
                }
            });
*/


//    bar.append("text")
//        .attr("y", function(d){ return height - yScale(d.value) + 20;})
//        .attr("x", 0)
//        .attr('fill', 'white')
//        .attr('font', '5 sans-serif')
//        .text(function(d){ return d.value;});

    var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(' + space +','  + height +')' )
        .call(xAxis)

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");
    chart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + space/2 + ",0)")
        .call(yAxis);

    bars.transition()
        .attr("height", function(d){return height - yScale(d.value)})
        .attr("y", function(d){return yScale(d.value)})
        .delay(function(d, i) {
            return i * 50;
        })
        .duration(750)
        .ease('elastic');

});


function row(d){
   return {
    year: d.academic_year_start,
    value: +d.value,
    school: d.school_name
   };
}