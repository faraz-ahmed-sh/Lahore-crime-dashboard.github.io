// function neighborhoodPlot() {

//   var margin = {top: 20, right: 20, bottom: 30, left: 40},
//     width = 400,
//     height = 400,
//     innerWidth = width - margin.left - margin.right,
//     innerHeight = height - margin.top - margin.bottom,
//     xValue = function(d) { return d[0]; },
//     yValue = function(d) { return d[1]; },
//     xScale = d3.scaleBand().padding(0.1),
//     yScale = d3.scaleLinear();

//   function chart(selection) {
//     selection.each(function (data) {

//       // Select the svg element, if it exists.
//       var svg = d3.select(this).selectAll("svg").data([data]);

//       // Otherwise, create the skeletal chart.
//       var svgEnter = svg.enter().append("svg");
//       var gEnter = svgEnter.append("g");
//       gEnter.append("g").attr("class", "x axis");
//       gEnter.append("g").attr("class", "y axis");

//       // Update the outer dimensions.
//       svg.merge(svgEnter).attr("width", width)
//         .attr("height", height);

//       // Update the inner dimensions.
//       var g = svg.merge(svgEnter).select("g")
//           .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//       xScale.rangeRound([0, innerWidth])
//         .domain(data.map(function(d) { return d["Neighborhood"]; }));
      
      
//       yScale.rangeRound([innerHeight, 0])
//         .domain([0, d3.max(data, function(d) { return d.frequency; })]);

      
//       g.select(".x.axis")
//           .attr("transform", "translate(0," + innerHeight + ")")
//           .call(d3.axisBottom(xScale));

      
//       g.select(".y.axis")
//           .call(d3.axisLeft(yScale).ticks(10, "%"))
//         .append("text")
//           .attr("transform", "rotate(-90)")
//           .attr("y", 6)
//           .attr("dy", "0.71em")
//           .attr("text-anchor", "end")
//           .text("Frequency");

//       var bars = g.selectAll(".bar")
//         .data(function (d) { return d; });

//       bars.enter().append("rect")
//           .attr("class", "bar")
//         .merge(bars)
//           .attr("x", X)
//           .attr("y", Y)
//           .attr("width", xScale.bandwidth())
//           .attr("height", function (d) { return height - Y(d)});

//       bars.exit().remove();
//     });

//   }

// // The x-accessor for the path generator; xScale ∘ xValue.
//   function X(d) {
//     return xScale(xValue(d));
//   }

//   // The y-accessor for the path generator; yScale ∘ yValue.
//   function Y(d) {
//     return yScale(yValue(d));
//   }

//   chart.margin = function(_) {
//     if (!arguments.length) return margin;
//     margin = _;
//     return chart;
//   };

//   chart.width = function(_) {
//     if (!arguments.length) return width;
//     width = _;
//     return chart;
//   };

//   chart.height = function(_) {
//     if (!arguments.length) return height;
//     height = _;
//     return chart;
//   };

//   chart.x = function(_) {
//     if (!arguments.length) return xValue;
//     xValue = _;
//     return chart;
//   };

//   chart.y = function(_) {
//     if (!arguments.length) return yValue;
//     yValue = _;
//     return chart;
//   };

//   return chart;
// }

var margin =  {top: 20, right: 20, bottom: 30, left: 80};
var width = 720 - margin.left - margin.right;
var height = 450 - margin.top - margin.bottom;

//load the data
var parseDate = d3.timeParse("%Y-%m-%d");
var parseTime = d3.timeParse("%H%M%S");
var parseTime2 = d3.timeParse("%H%M");
var parseTime3 = d3.timeParse("%H");
var parseTime4 = d3.timeParse("%S");
//var format = d3.format("00,00,00");
var parseDateTime = d3.timeFormat("%Y, %m, %d, %H, %M");

d3.json("Data/lahore_crime_14.json", function(error, data) {

	if (error) throw error;
  
  var data = data.filter(filterCriteria);

  // filter the data for null values in d["Time"]
  function filterCriteria(d) {
      return (d.Date != "2014-05-15" && d.Date != "2014-11-12" && d.Date != "2014-04-23" && d.Date != "2014-02-25" && d.Date != "2014-01-01" && d.Date != "2014-08-18");
    }
	
	data.forEach( function(d, i) {
		// unary+ operator to read numerical data correctly.
		d.index = i

    if(parseTime(d["Time"]) == null && (d["Time"] != 0))
      d["Time"] = parseTime2(d["Time"])
    else if(parseTime(d["Time"]) == null && (d["Time"] == 0))
      //console.log(d["Time"])
      d["Time"] = parseTime3(d["Time"])
    //console.log(d["Time"])
    else if(parseTime(d["Time"]) == null)
      d["Time"] = parseTime4(d["Time"])
    else
      d["Time"] = parseTime(d["Time"])

    //else
    //  d["Time"] = parseTime3(d["Time"])

    if (d["Time"] == null)
      //console.log(d.hour)
      console.log(d.Date)
    //console.log(d.index)

		//d["Time"] = parseTime(d["Time"]) || 0
		//d["Time"] = d3.timeParse("%H:%M:%S")(d["Time"])
		d["year"] = +d["year"] || 0
		//d["datetime"] = parseDate(d["datetime"])
		d["Date"] = parseDate(d["Date"]) || 0
		d["hour"] = +d["hour"] || 0
		d["Date"] = new Date(d["Date"].getFullYear(), d["Date"].getMonth(), d["Date"].getDate(), 
                d["Time"].getHours(), d["Time"].getMinutes())
    //console.log(d["Date"].getFullYear(), d["Date"].getMonth(), d["Date"].getDay(), 
    //            d["Time"].getHours(), d["Time"].getMinutes())

    //console.log(d["Time"])
	});

  
  //console.log(data)


	dataset = data;
	//console.log(dataset)
	//makeBarChart(dataset);
	//console.log(dataset["Date"].getHours());

	// A nest operator, for grouping the flight list.
  	var nestByDate = d3.nest()
      .key(function(d) {return d3.timeDay(d.Date)})

    //console.log(nestByMonth)
	
	//Create a Crossfilter instance
	var ndx = crossfilter(dataset);
	//console.log(ndx)

	//Define Dimensions
	var crimeTypeDim = ndx.dimension(function(d) { return d["Crime Type"]; });
	var date = ndx.dimension(function(d) {return d.Date});
	var hourDim = ndx.dimension(function(d) {return d.Date.getHours() + d["Date"].getMinutes() / 60});
  var neighborhoodDim = ndx.dimension(function(d) { return d["Neighborhood"]; });
	var allDim = ndx.dimension(function(d) {return d;});

	//Group Data
	var crimeTypeGroup = crimeTypeDim.group();
	//console.log(crimeTypeGroup)
	var dateGroup = date.group();
	var hourGroup = hourDim.group(Math.floor);
  var neighborhoodGroup = neighborhoodDim.group();
	var all = ndx.groupAll();



	//make a horizontal bar chart to show the count of Neighborhood


  function neighborhoodChart() {
    var margin = {top: 20, right: 20, bottom: 30, left: 40}
    width = 400,
    height = 400,
    xValue = function(d) { return d[0]; };
    yValue = function(d) { return d[1]; };
    
    xScale = d3.scaleBand().padding(0.1);
    yScale = d3.scaleLinear();
    //console.log(xValue, yValue)

    function chart(selection) {
      selection.each(function (data) {
        console.log(data)

        // select the svg element if it exists
        var svg = d3.select(this).selectAll("svg").data([data]);

        // otherwise, create the skeletal chart

        var svgEnter = svg.enter().append("svg");
        var gEnter = svgEnter.append("g");
        gEnter.append("g").attr("class", "x axis")
        gEnter.append("g").attr("class", "y axis")

        // update the outer dimensions
        svg.merge(svgEnter).attr("width", width)
        .attr("height", height)

        // update the inner dimensions
        var g = svg.merge(svgEnter).select("g")
          .attr("transform", "translate(" + margin.left + "," +  margin.top + ")")

        xScale.range([0, width - margin.bottom - margin.top])
        //.domain(data.map(function (d) { return d.key; }))

        yScale.rangeRound([height, 0])
        .domain([0, group.top(1)[0].value])

        g.append("g")
           .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(xScale));

       g.append("g")
           .attr("class", "y axis")
           .attr("transform", "translate(0," + height*2 + ")")
           .call(d3.axisLeft(yScale).ticks(7));

        var bars = g.selectAll(".bar")
        .data(function (d) { return d; });

        bars.enter().append("rect")
          .attr("class", "bar")
          .merge(bars)
          .attr("x", X)
          .attr("y", Y)
          .attr("width", xScale.bandwidth())
          .attr("height", function (d) { return height - Y(d)})

          bars.exit().remove();
      });
    }

    function X(d) {
      return xScale(xValue(d));
    }

    function Y(d) {
      return yScale(yValue(d));
    }

    chart.margin = function (_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };

    chart.x = function (_) {
      if (!arguments.length) return xValue;
      xValue = _;
      return chart;
    };

    chart.y = function (_) {
      if (!arguments.length) return yValue;
      yValue = _;
      return chart;
    };

    chart.dimension = function (_) {
      if (!arguments.length) return dimension;
      dimension = _;
      return chart;
    };

    chart.group = function (_) {
      if (!arguments.length) return group;
      group = _;
      return chart;
    };

    return chart;



  };
	// var neighborhoodCrimeCount = d3.nest()
 //  	.key(function(d) { return d["Neighborhood"]; })
 //  	.rollup(function(v) { return v.length; })
 //  	.entries(dataset);
 //  	//console.log(neighborhoodCrimeCount)

 //  	var svg = d3.select("#hBarChart")
	// 	.append('svg') 
	// 	.attr('width', width + margin.right + margin.left)
	// 	.attr('height', height + margin.top + margin.bottom)
 //    //.dimension(neighborhoodDim)
 //    //      .group(neighborhoodGroup)
 //    //      .ordering(function(d) { return -d.value });

 //  	var xScale = d3.scaleLinear().range([0, width - margin.bottom - margin.top]);
	//    var yScale = d3.scaleBand().range([height, 0]);

	//    var g = svg.append("g")
	// 		.attr("transform", "translate(" + margin.left*1.5 + "," + margin.top + ")");

	// 	xScale.domain([0, (d3.max(neighborhoodCrimeCount, function(d) { return d.value; }))]);
	//    yScale.domain(neighborhoodCrimeCount.map(function(d) { return d.key; })).padding(0.1);

	//     g.append("g")
	//         .attr("class", "x axis")
	//        	.attr("transform", "translate(0," + height + ")")
	//       	.call(d3.axisBottom(xScale).ticks(7));

	//     g.append("g")
	//         .attr("class", "y axis")
	//         //.attr("transform", "translate(0," + height*2 + ")")
	//         .call(d3.axisLeft(yScale));

	//     g.selectAll(".bar")
	//         .data(neighborhoodCrimeCount)
	//       .enter().append("rect")
	//         .attr("class", "bar")
	//         .attr("x", 0)
	//         .attr("height", yScale.bandwidth())
	//         .attr("y", function(d) { return yScale(d.key); })
	//         .attr("width", function(d) { return xScale(d.value); })

	 //make a map of Pakistan's districts
    
    var svg = d3.select("#pakistanMap")
		.append('svg') 
		.attr('width', width + margin.right + margin.left)
		.attr('height', height + margin.top + margin.bottom);

	var g = svg.append("g")
    
    var projection = d3.geoMercator()
      .scale(width*2.2)
     //.scale(600)
      .translate([-1400, height*2.5])

    var path = d3.geoPath()
      .projection(projection);
    
    //var url = "http://enjalot.github.io/wwsd/data/world/world-110m.geojson";
    d3.json("pakistan_district.json", function(err, pak) {
    	console.log(pak.objects.pakistan_district)
    
      svg.append("g")
      .attr("class", "districts")
    .selectAll("path")
      .data(topojson.feature(pak, pak.objects.pakistan_district).features)
    .enter().append("path")
      .attr("d", path)
      .style("fill", "white")
      .style("stroke", "black");
    })

    //console.log(neighborhoodGroup.top(5))



    

  	//Make charts on which cross filter will be applied
	var charts = [
	
    barChart()
    	.dimension(crimeTypeDim)
        .group(crimeTypeGroup)
      .x(d3.scaleBand()
        .domain(dataset.map(function (d) { return d["Crime Type"]; }))
        .rangeRound([10, 9 * 80]))
      	.xTickRot(-95),

      barChart()
        .dimension(date)
        .group(dateGroup)
        .x(d3.scaleTime()
          .domain([new Date(2014, 0, 1), new Date(2014, 5, 31)])
          .rangeRound([10, 10 *70]))
        .filter([new Date(2014, 1, 1), new Date(2014, 1, 10)])
        .xTickRot(-95),

    barChart()
        .dimension(hourDim)
        .group(hourGroup)
        //.margin({top: 50, right: 50, bottom: 50, left: 50 })
      .x(d3.scaleLinear()
        .domain([0, 24])
        .rangeRound([10, 10 * 40]))
      	//.filter(["1"])
      	.xTickRot(-35),

    // barChart()
    //     .dimension(neighborhoodDim)
    //     .group(neighborhoodGroup)
    //     .x(d3.scaleBand()
    //       .domain(dataset.map(function (d) { return d["Neighborhood"]; }))
    //     .rangeRound([10, 5 * 80]))
    //     .gBrush(false)
        //.y(d3.scaleLinear())
          //d3.max(neighborhoodDim, function(d) { return d.value; })])
    
    //console.log(dataset)
    neighborhoodChart()
        .dimension(neighborhoodDim)
        .group(neighborhoodGroup)
        .x(function (d) { return d["Neighborhood"]; })
        //.y(function (d) { return d[]})

        //.y(function (d) { return d[""]})
        //x(d3.scaleLinear)

  ];
  console.log(charts)

  // Given our array of charts, which we assume are in the same order as the
  // .chart elements in the DOM, bind the charts to the DOM and render them.
  // We also listen to the chart's brush events to update the display.
  var chart = d3.selectAll(".chart")
      .data(charts)

  // Render the initial list.
  //var list = d3.selectAll(".list")
  //    .data([crimeList]);

  // Render the total.
  d3.selectAll("#total")
      .text(ndx.size());

  renderAll();

  // Renders the specified chart or list.
  function render(method) {
    d3.select(this).call(method);
  }

  // Whenever the brush moves, re-rendering everything.
  function renderAll() {
    chart.each(render);
    //list.each(render);
    d3.select("#active").text(all.value());
  }


  window.filter = function(filters) {
    filters.forEach(function(d, i) {charts[i].filter(d)});
    renderAll();
  };

  window.reset = function(i) {
    charts[i].filter(null);
    renderAll();
  };


  // function crimeList(div) {
  //   var crimeByDate = nestByDate.entries(date.top(40));
  //   console.log(crimeByDate)
   
  //   div.each(function() {
  //     var date = d3.select(this).selectAll(".date")
  //         .data(crimeByDate, function(d) {return d.key});
  //         //console.log(date)

  //   date.exit().remove();

  //     date.enter().append("div")
  //         .attr("class", "date")
  //       .append("div")
  //         .attr("class", "day")
  //         .text(function(d) {return formatDate(d.values[0].date)})
  //       .merge(date);
  //       console.log(date)

  //     var crime = date.order().selectAll(".crime")
  //         .data(function(d) {return d.values}, function(d) {return d.index});
          
  //         crime.exit().remove();

  //     var crimeEnter = crime.enter().append("div")
  //         .attr("class", "crime");

  //     crimeEnter.append("div")
  //         .attr("class", "time");
  //         //.text(function(d) {return formatTime(d.date)});

  //     crimeEnter.append("div")
  //         .attr("class", "neighborhood")
  //         .text(function(d) {return d["Neighborhood"]});

  //     crimeEnter.append("div")
  //         .attr("class", "crimeType")
  //         .text(function(d) {return d["Crime Type"]});

  //     crimeEnter.merge(crime);

  //     crime.order();
  //   });
  // }

	// a bar chart function that uses the same properties for each of the chart
	// on which a cross filter is applied
	// source: https://github.com/square/crossfilter/blob/gh-pages/index.html
	function barChart() {
    if (!barChart.id) barChart.id = 0;

    let margin = { top: 10, right: 13, bottom: 20, left: 10 };
    let x;
    let y = d3.scaleLinear().range([200, 0]);
    const id = barChart.id++;
    const xaxis = d3.axisBottom();
    const yaxis = d3.axisLeft();
    const brush = d3.brushX();
    let brushDirty;
    let dimension;
    let group;
    let round;
    let gBrush;
    var xTickRot;
    

    function chart(div) {
      const width = x.range()[1];
      const height = y.range()[0];

      brush.extent([[0, 0], [width, height]]);
      //set y domain to be the topmost value of a particular dataset
      y.domain([0, group.top(1)[0].value]);

      div.each(function () {
        const div = d3.select(this);
        let g = div.select('g');

        // Create the skeletal chart.
        if (g.empty()) {
          div.select('.title').append('a')
            .attr('href', `javascript:reset(${id})`)
            .attr('class', 'reset')
            .text(' reset')
            .style('display', 'none');

          g = div.append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height*1.5 + margin.top + margin.bottom)
            .append('g')
              .attr('transform', `translate(${margin.left},${margin.top})`);

          g.append('clipPath')
            .attr('id', `clip-${id}`)
            .append('rect')
              .attr('width', width)
              .attr('height', height);

          g.selectAll('.bar')
            .data(['background', 'foreground'])
            .enter().append('path')
              .attr('class', d => `${d} bar`)
              .datum(group.all());

          g.selectAll('.foreground.bar')
            .attr('clip-path', `url(#clip-${id})`);

          g.append('g')
            .attr('class', 'xaxis')
            .attr('transform', `translate(0,${height})`)
            .call(xaxis)
            .selectAll("text")
            	.attr("dx", "-45")
            	.attr("dy", "-10")
            	.attr("transform", "rotate(-90)");
            	//.attr("transform", "rotate(-90)" );

          // Initialize the brush component with pretty resize handles.
          gBrush = g.append('g')
            .attr('class', 'brush')
            .call(brush);

          gBrush.selectAll('.handle--custom')
            .data([{ type: 'w' }, { type: 'e' }])
            .enter().append('path')
              .attr('class', 'brush-handle')
              .attr('cursor', 'ew-resize')
              .attr('d', resizePath)
              .style('display', 'none');
        }

        // Only redraw the brush if set externally.
        if (brushDirty !== false) {
          const filterVal = brushDirty;
          brushDirty = false;

          div.select('.title a').style('display', d3.brushSelection(div) ? null : 'none');

          if (!filterVal) {
            g.call(brush);

            g.selectAll(`#clip-${id} rect`)
              .attr('x', 0)
              .attr('width', width);

            g.selectAll('.brush-handle').style('display', 'none');
            renderAll();
          } else {
            const range = filterVal.map(x);
            brush.move(gBrush, range);
          }
        }

        g.selectAll('.bar').attr('d', barPath);
      });

      function barPath(groups) {
        const path = [];
        let i = -1;
        const n = groups.length;
        let d;
        while (++i < n) {
          d = groups[i];
          path.push('M', x(d.key), ',', height, 'V', y(d.value), 'h9V', height);
        }
        return path.join('');
      }

      function resizePath(d) {
        const e = +(d.type === 'e');
        const x = e ? 1 : -1;
        const y = height / 3;
        return `M${0.5 * x},${y}A6,6 0 0 ${e} ${6.5 * x},${y + 6}V${2 * y - 6}A6,6 0 0 ${e} ${0.5 * x},${2 * y}ZM${2.5 * x},${y + 8}V${2 * y - 8}M${4.5 * x},${y + 8}V${2 * y - 8}`;
      }
    }

    brush.on('start.chart', function () {
      const div = d3.select(this.parentNode.parentNode.parentNode);
      div.select('.title a').style('display', null);
    });

    brush.on('brush.chart', function () {
      const g = d3.select(this.parentNode);
      const brushRange = d3.event.selection || d3.brushSelection(this); // attempt to read brush range
      const xRange = x && x.range(); // attempt to read range from x scale
      let activeRange = brushRange || xRange; // default to x range if no brush range available

      const hasRange = activeRange &&
        activeRange.length === 2 &&
        !isNaN(activeRange[0]) &&
        !isNaN(activeRange[1]);

      if (!hasRange) return; // quit early if we don't have a valid range

      // calculate current brush extents using x scale
      let extents = activeRange.map(x.invert);

      // if rounding fn supplied, then snap to rounded extents
      // and move brush rect to reflect rounded range bounds if it was set by user interaction
      if (round) {
        extents = extents.map(round);
        activeRange = extents.map(x);

        if (
          d3.event.sourceEvent &&
          d3.event.sourceEvent.type === 'mousemove'
        ) {
          d3.select(this).call(brush.move, activeRange);
        }
      }

      // move brush handles to start and end of range
      g.selectAll('.brush-handle')
        .style('display', null)
        .attr('transform', (d, i) => `translate(${activeRange[i]}, 0)`);

      // resize sliding window to reflect updated range
      g.select(`#clip-${id} rect`)
        .attr('x', activeRange[0])
        .attr('width', activeRange[1] - activeRange[0]);

      // filter the active dimension to the range extents
      dimension.filterRange(extents);

      // re-render the other charts accordingly
      renderAll();
    });

    brush.on('end.chart', function () {
      // reset corresponding filter if the brush selection was cleared
      // (e.g. user "clicked off" the active range)
      if (!d3.brushSelection(this)) {
        reset(id);
      }
    });

    chart.margin = function (_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };

    chart.x = function (_) {
      if (!arguments.length) return x;
      x = _;
      xaxis.scale(x);
      //axis.attr("transform", "rotate(-20)" );
      return chart;
    };

    chart.y = function (_) {
      if (!arguments.length) return y;
      y = _;
      return chart;
    };

    chart.dimension = function (_) {
      if (!arguments.length) return dimension;
      dimension = _;
      return chart;
    };

    chart.filter = _ => {
      if (!_) dimension.filterAll();
      brushDirty = _;
      return chart;
    };

    chart.group = function (_) {
      if (!arguments.length) return group;
      group = _;
      return chart;
    };
    
    chart.xTickRot = function (_) {
      if (!arguments.length) return xTickRot;
      xTickRot = _;
      return chart;
    };

    chart.round = function (_) {
      if (!arguments.length) return round;
      round = _;
      return chart;
    };

    chart.gBrush = () => gBrush;

    return chart;
  }
});