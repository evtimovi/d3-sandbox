var bd = [10,13,4,5,11]

var menuitems=['Bar Graph', 'Pie Chart']

d3.select('#side-menu')
.selectAll('div')
.data(menuitems)
.enter().append('div')
.text(function(d){return d;})



var xScale = d3.scale.linear()
    .domain([0, d3.max(bd)])
    .range([0, 1000])

    d3.select('#chart')
    .selectAll('div')
    .data(bd)
    .enter().append('div')
    .style('width', function(d){ return xScale(d) + 'px'; })
    .style('color', 'white')
    .style('background', "blue")
    .style('text-align', 'right')
    .style('padding-right', '7px')
    .style('margin-bottom', '20px')
    .text(function(d){ return d; })
