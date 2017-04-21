// dimensions
var margin = {
top: 20, 
right: 20,
bottom: 30,
left: 40
};

var width = 700 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart")
   .append("div")
   .classed("svg-container", true) //container class to make it responsive
   .append("svg")
   //responsive SVG needs these 2 attributes and no width and height attr
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 700 500")
   //class to make it responsive
   .classed("svg-content-responsive", true)

   	.append("g")
	.attr("transform", 
		"translate(" + margin.left + "," + margin.top + ")");



	// .attr("width", width + margin.left + margin.right)
	// .attr("height", height + margin.top + margin.bottom)
	// .append("g")
	// .attr("transform", 
	// 	"translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleLog().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
var r = d3.scaleSqrt().range([3, 30]);
var color = d3.scaleOrdinal(d3.schemeCategory10);
var f = d3.format(",d");

d3.json("js/nations.json", function(error, data) {
	if (error) throw error; 


	x.domain(d3.extent(data, d => d.income));
	y.domain([0, d3.max(data, d => d.lifeExpectancy)]);
	r.domain(d3.extent(data, d => d.population));


	svg.selectAll(".dot")
		.data(data)
		.enter().append("circle")
		.attr("class", "dot")
		.attr("cx", d => x(d.income))
		.attr("cy", d => y(d.lifeExpectancy))
		.attr("r", d => r(d.population))
		.style('fill', d => color(d.region))
		.style('stroke', 'rgba(120, 120, 120, 0.5)');

	//draw x axis
	svg.append("g")
		.attr("class", "x axis")
		.call(d3.axisBottom(x).ticks(10, f))
		.attr("transform", "translate(0," + height + ")")
		.append("text")
		.attr("class", "label")
		.attr("x", width)
		.attr("y", -10)
		.text("income per capita (dollars)");

	//draw y axis
	svg.append("g")
		.attr("class", "y axis")
		.call(d3.axisLeft(y))
		.append("text")
		.attr("class", "label")
		.attr("y", -10)
		.text("life expectancy (years)");

		var legend = svg.selectAll(".legend")
			.data(color.domain())
			.enter().append("g")
			.attr("class", "legend")
			.attr("transform", (d,i)=> "translate(0," + (i*20 + 300) + ")");

		legend.append("rect")
			.attr("x", width - 18)
			.attr("width", 18)
			.attr("height", 18)
			.style('fill', color);

		legend.append("text")
			.attr("x", width - 24)
			.attr("y", 9)
			.attr("dy", 5)
			.style("text-anchor", "end")
			.text(d => d);

});


