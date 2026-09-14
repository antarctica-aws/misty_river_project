      

(function(){

      //////////////////////////////////////////////////////////////
      //////////////////////// isar river /////////////////////
      //////////////////////////////////////////////////////////////
      window.onload=setMap();

      function setMap(){

        var width=window.innerWidth*0.6,
            height=window.innerHeight*0.8;

        var map=d3.select("#content")
            .append("svg")
            .attr("class","riverMap")
            .attr("width",width)
            .attr("height",height);


        var projection=d3.geoMercator();

        var path=d3.geoPath()
            .projection(projection);

        d3.queue()
            .defer(d3.json,"data/isar.topojson")
            .await(callback);

        function callback(error,isar){
          var isar=topojson.feature(isar,isar.objects.isar).features;
        };


        function setEnumerationsUnits(isar){
          var river=map.selectAll(".riverMap")
            .data(isar)
            .enter()
            .append("path")
            .attr("d","path")
            .style("color","blue");

        }






      }






      //////////////////////////////////////////////////////////////
      //////////////////////// point line trial /////////////////////
      //////////////////////////////////////////////////////////////

      var points = [
        [400, 650],
        [500, 550],
        [580, 450],
        [620, 380],
        [650, 300],
        [700, 200],
        [800, 100]
      ];

      var svg = d3.select("#content").append("svg")
          .attr("width", 960)
          .attr("height", 700)
          .attr("id","polyPath")
          .style("stroke","#348097")
          .style("stroke-width","3px")
          .style("fill","none");

      //d3v4 line generator that uses a cardinal-closed curve   
      var path = svg.append("path")
          .data([points])
          .attr("d", d3.line().curve(d3.curveCardinalClosed));

      svg.selectAll(".point")
          .data(points)
        .enter().append("circle")
          .attr("r", 4)
          .attr("transform", function(d) { return "translate(" + d + ")"; })
          .style("stroke","#348097")
          .style("stroke-width","3px")
          .style("fill","#348097");

      var circle = svg.append("circle")
          .attr("r", 13)
          .attr("transform", "translate(" + points[0] + ")")
          .style("stroke","#348097")
          .style("stroke-width","3px")
          .style("fill","#348097");

      transition();

      function transition() {
        circle.transition()
            .duration(100000)
            .attrTween("transform", translateAlong(path.node()))
            .on("end", transition);
      }

      // Returns an attrTween for translating along the specified path element.
      // Notice how the transition is slow for the first quarter of the aniimation
      // is fast for the second and third quarters and is slow again in the final quarter
      // This is normal behavior for d3.transition()
      function translateAlong(path) {
        var l = path.getTotalLength() * 2;
        return function(d, i, a) {
          return function(t) {
            if(t* l >= l/2){
                var p = path.getPointAtLength(l - (t*l))
            } else {
                var p = path.getPointAtLength(t * l);
            }
            return "translate(" + p.x + "," + p.y + ")";
          };
        };
      }

      //////////////////////////////////////////////
      ////tooltips on the line trial////////////////
      //////////////////////////////////////////////

      // set the dimensions and margins of the graph
      var margin = {top: 20, right: 20, bottom: 30, left: 50},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

      // parse the date / time
      var parseTime = d3.timeParse("%d-%b-%y");
      var formatTime = d3.timeFormat("%e %B");

      // set the ranges
      var x = d3.scaleTime().range([0, width]);
      var y = d3.scaleLinear().range([height, 0]);

      // define the line
      var valueline = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.close); });

      var div = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

      // append the svg obgect to the body of the page
      // appends a 'group' element to 'svg'
      // moves the 'group' element to the top left margin
      var svg = d3.select("body").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

      // Get the data
      d3.csv("data/data.csv", function(error, data) {
        if (error) throw error;

        // format the data
        data.forEach(function(d) {
            d.date = parseTime(d.date);
            d.close = +d.close;
        });

        // scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.close; })]);

        // add the valueline path.
        svg.append("path")
           .data([data])
           .attr("class", "line")
           .attr("d", valueline);

        // add the dots with tooltips
        svg.selectAll("dot")
           .data(data)
         .enter().append("circle")
           .attr("r", 5)
           .attr("cx", function(d) { return x(d.date); })
           .attr("cy", function(d) { return y(d.close); })
           .on("mouseover", function(d) {
             div.transition()
               .duration(200)
               .style("opacity", .9);
             div.html(formatTime(d.date) + "<br/>" + d.close)
               .style("left", (d3.event.pageX) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
             })
           .on("mouseout", function(d) {
             div.transition()
               .duration(500)
               .style("opacity", 0);
             });

        // // add the X Axis
        // svg.append("g")
        //     .attr("transform", "translate(0," + height + ")")
        //     .call(d3.axisBottom(x));

        // // add the Y Axis
        // svg.append("g")
        //     .call(d3.axisLeft(y));

      });




      // ////////////////////////////////////////////////////////////////////////
      // ////////////////////////zoomiing transiiton tryout/////////////////////
      // ///////////////////////////////////////////////////////////////////////
      // var width=Math.max(960, window.innerWidth),
      //     height = Math.max(500, window.innerHeight);


      // var canvas = d3.select("canvas"),
      //     context = canvas.node().getContext("2d"),
      //     width = canvas.property(width),
      //     height = canvas.property(height),
      //     radius = 2.5;

      // var points = d3.range(1000).map(phyllotaxis(10)),
      //     point = points.pop();

      // var zoom = d3.zoom()
      //     .on("zoom", zoomed);

      // canvas
      //     .call(zoom.transform, transform)
      //     .call(transition);

      // function zoomed() {
      //   context.save();
      //   context.clearRect(0, 0, width, height);
      //   context.translate(d3.event.transform.x, d3.event.transform.y);
      //   context.scale(d3.event.transform.k, d3.event.transform.k);
      //   drawPoints();
      //   context.restore();
      // }

      // function drawPoints() {
      //   context.beginPath();
      //   points.forEach(drawPoint);
      //   context.fillStyle = "#000";
      //   context.fill();

      //   context.beginPath();
      //   drawPoint(point);
      //   context.fillStyle = "#f00";
      //   context.fill();
      //   context.stroke();
      // }

      // function drawPoint(point) {
      //   context.moveTo(point[0] + radius, point[1]);
      //   context.arc(point[0], point[1], radius, 0, 2 * Math.PI);
      // }

      // function transform() {
      //   return d3.zoomIdentity
      //       .translate(width / 2, height / 2)
      //       .scale(8)
      //       .translate(-point[0], -point[1]);
      // }

      // function transition(canvas) {
      //   var n = points.length,
      //       i = Math.random() * n | 0,
      //       c = points[i]; // Pick a random point.

      //   points[i] = points[n - 1];
      //   points[n - 1] = point;
      //   point = c;



      //   canvas.transition()
      //       .delay(500)
      //       .duration(3000)
      //       .call(zoom.transform, transform)
      //       .on("end", function() { canvas.call(transition); });
      // }

      // function phyllotaxis(radius) {
      //   var theta = Math.PI * (3 - Math.sqrt(5));
      //   return function(i) {
      //     var r = radius * Math.sqrt(i), a = theta * i;
      //     return [
      //       width / 2 + r * Math.cos(a),
      //       height / 2 + r * Math.sin(a)
      //     ];
      //   };
      // }
})();