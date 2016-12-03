d3.csv('data.csv', row, function(error, data){
    
    var margin = {top: 20, right: 30, bottom: 30, left: 40};
    width = 400 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    spaceFactor = 5, //how big is the space relative to the bar
    barWidth = width/(((2*spaceFactor+1)/(2*spaceFactor))*data.length + 1),
    space = barWidth/spaceFactor;
    //barWidth = width/data.length,
    //space = barWidth/5; //the space is for the grouping
    //barWidth = (width - (data.length/2)*space)/data.length;

    var yScale = d3.scale.linear()
    .range([0, height])
    .domain([0, d3.max(data, function(d){return +d.value;})]);


    var chart = d3.select('#chart')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var bar = chart.selectAll("g")
        .data(data)
        .enter().append("g")
            .attr("transform", function(d, i){
                return "translate(" + (i*barWidth + (i*space) + (space*(Math.abs((i%2)-1)))) + "," + 
                    (height - yScale(d.value)) +")";
            });

    bar.append("rect")
        .attr("height", function(d){return yScale(d.value)})
        .attr("width", barWidth-1)
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

    bar.append("text")
        .attr("y", function(d){ return height - yScale(d.value) + 20;})
        .attr("x", 0)
        .attr('fill', 'white')
        .attr('font', '5 sans-serif')
        .text(function(d){ return d.value;});
      });

function row(d){
   return {
    year: d.academic_year_start,
    value: +d.value,
    school: d.school_name
   };
}