


d3.csv('data.csv', row, function(error, data){
    
    var width = 420,
    barHeight = 20,
    space = 15;

    var xScale = d3.scale.linear()
    .range([0, width])
    .domain([0, d3.max(data, function(d){return +d.value;})]);


    var chart = d3.select('#chart')
      .attr("width", width)
      .attr("height", (space + barHeight)*data.length );
    
    var bar = chart.selectAll("g")
        .data(data)
        .enter().append("g")
            .attr("transform", function(d, i){return "translate(0," + (i*barHeight + (i*space) + (space*(Math.abs((i%2)-1)))) + ")";});

    bar.append("rect")
        .attr("width", function(d){return xScale(d.value)})
        .attr("height", barHeight-1)
        .attr("fill", function(d){
            if (d.school === 'Trinity East El Sch')
            {
                return 'blue';
            }
            else
            {
                return 'red';
            }

        })
        .attr();

    bar.append("text")
        .attr("x", function(d){ return xScale(d.value) - 3;})
        .attr("y", barHeight/2)
        .attr("dy", ".35em")
        .text(function(d){ return d.value;});
      console.log(width);
        });

function row(d){
   return {
    year: d.academic_year_start,
    value: +d.value,
    school: d.school_name
   };
}