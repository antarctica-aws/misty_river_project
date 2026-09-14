
(function(){


    






    var pi = Math.PI,
    tau = 2 * pi;

    var width = Math.max(960, window.innerWidth),
        height = Math.max(500, window.innerHeight);

    // Initialize the projection to fit the world in a 1×1 square centered at the origin.
    var projection = d3.geoMercator()
        .scale(1 / tau)
        .translate([0, 0]);

    var path = d3.geoPath()
        .projection(projection);

    var tile = d3.tile()
        .size([width, height]);

    var zoom = d3.zoom()
        .scaleExtent([1 << 21, 1 << 24])
        .on("zoom", zoomed);

    var map = d3.select(".basemap").append("div")
        .attr("class", "map")
        .style("width", width + "px")
        .style("height", height + "px")
        .on("mousemove", mousemoved);

    var layer = map.append("div")
        .attr("class", "layer");

    var info = map.append("div")
        .attr("class", "info");

    // Compute the projected initial center.
    var center = projection([11.6056, 48.1642]);

    // Apply a zoom transform equivalent to projection.{scale,translate,center}.
    map .call(zoom)
        .call(zoom.transform, d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(1 << 21)
            .translate(-center[0], -center[1]));








    function zoomed() {
      var transform = d3.event.transform;

      var tiles = tile
          .scale(transform.k)
          .translate([transform.x, transform.y])
          ();

      projection
          .scale(transform.k / tau)
          .translate([transform.x, transform.y]);

      var image = layer
          .style("transform", stringify(tiles.scale, tiles.translate))
        .selectAll(".tile")
        .data(tiles, function(d) { return d; });

      image.exit()
          .each(function(d) { this._xhr.abort(); })
          .remove();

      image.enter().append("svg")
          .attr("class", "tile")
          .style("left", function(d) { return d[0] * 256 + "px"; })
          .style("top", function(d) { return d[1] * 256 + "px"; })
          .each(function(d) { this._xhr = render(d, this); });
    }

    function render(d, node) {
      return d3.json("https://vector.mapzen.com/osm/roads/" + d[2] + "/" + d[0] + "/" + d[1] + ".json?api_key=vector-tiles-LM25tq4", function(error, json) {
        if (error) throw error;
        var k = Math.pow(2, d[2]) * 256; // size of the world in pixels

        d3.select(node).selectAll("path")
          .data(json.features.sort(function(a, b) { return a.properties.sort_key - b.properties.sort_key; }))
          .enter().append("path")
            .attr("class", function(d) { return d.properties.kind; })
            .attr("d", d3.geoPath()
                .projection(d3.geoMercator()
                    .scale(k / tau)
                    .translate([k / 2 - d[0] * 256, k / 2 - d[1] * 256])
                    .precision(0)));
      });
    }

    function stringify(scale, translate) {
      var k = scale / 256, r = scale % 1 ? Number : Math.round;
      return "matrix3d(" + [k, 0, 0, 0, 0, k, 0, 0, 0, 0, k, 0, r(translate[0] * scale), r(translate[1] * scale), 0, 1 ] + ")";
    }

    function mousemoved() {
      info.text(formatLocation(projection.invert(d3.mouse(this)), d3.zoomTransform(this).k));
    }

    function formatLocation(p, k) {
      var format = d3.format("." + Math.floor(Math.log(k) / 2 - 2) + "f");
      return (p[1] < 0 ? format(-p[1]) + "°S" : format(p[1]) + "°N") + " "
           + (p[0] < 0 ? format(-p[0]) + "°W" : format(p[0]) + "°E");
    }



    //////////////////////////////////////////////////////////////
      //////////////////////// Set-Up //////////////////////////////
      //////////////////////////////////////////////////////////////

      function myFunction() {
          var x = document.getElementById("RadarChart");
          if (x.style.display === "none") {
              x.style.display = "block";
          } else {
              x.style.display = "none";
          }
      }

      var margin = { top: 50, right: 100, bottom: 50, left: 65 },
        width = Math.min(700, window.innerWidth / 4) - margin.left - margin.right+20,
        height = Math.min(width, window.innerHeight - margin.top - margin.bottom);

      //////////////////////////////////////////////////////////////
      ////////////////////////// Data //////////////////////////////
      //////////////////////////////////////////////////////////////

      var data = [

        { name: 'July 1st, 2016',
          axes: [
            {axis: 'Water Level (m)', value: 122},
            
            {axis: 'Water Temperature (\xBAC)', value: 15.21},
            {axis: 'Discharge (m\xB3)', value: 119},
            {axis: 'Suspended Sediment (m\xB3)', value: 13.3},
            {axis: 'Air Temperature (\xBAC)', value: 20.2},
            
          ]
        },
        

        

        { name: 'Spring',
          axes: [
            {axis: 'Water Level (m)', value: 81.24},
            
            {axis: 'Water Temperature (\xBAC)', value: 9.12},
            {axis: 'Discharge (m\xB3)', value: 59.96},
            {axis: 'Suspended Sediment (m\xB3)', value: 8.11},
            {axis: 'Air Temperature (\xBAC)', value: 8.17},
            
          ]
        },
        { name: 'Summer',
          axes: [
            {axis: 'Water Level (m)', value: 119.76},
            
            {axis: 'Water Temperature (\xBAC)', value: 13.10},
            {axis: 'Discharge (m\xB3)', value: 117.18},
            {axis: 'Suspended Sediment (m\xB3)', value: 22.46},
            {axis: 'Air Temperature (\xBAC)', value: 17.6},
            
          ]
        },
        { name: 'Fall',
          axes: [
            {axis: 'Water Level (m)', value: 63.71},
            
            {axis: 'Water Temperature (\xBAC)', value: 6.24},
            {axis: 'Discharge (m\xB3)', value:38.42 },
            {axis: 'Suspended Sediment (m\xB3)', value: 11.58},
            {axis: 'Air Temperature (\xBAC)', value: 9.03},
            
          ]
        },
        { name: 'Winter',
          axes: [
            {axis: 'Water Level (m)', value: 64.59},
            
            {axis: 'Water Temperature (\xBAC)', value: 4.32},
            {axis: 'Discharge (m\xB3)', value: 39.42},
            {axis: 'Suspended Sediment (m\xB3)', value: 14.28},
            {axis: 'Air Temperature (\xBAC)', value: 1.77},
            
          ]
        },
        { name: 'Annual Average',
          axes: [
            {axis: 'Water Level (m)', value: 82.43},
            
            {axis: 'Water Temperature (\xBAC)', value: 8.77},
            {axis: 'Discharge (m\xB3)', value: 63.88},
            {axis: 'Suspended Sediment (m\xB3)', value: 14.11},
            {axis: 'Air Temperature (\xBAC)', value: 9.16},
            
          ]
        }
        

      ];
      console.log(data.length);



      //////////////////////////////////////////////////////////////
      ///// Second example /////////////////////////////////////////
      ///// Chart legend, custom color, custom unit, etc. //////////
      //////////////////////////////////////////////////////////////
      var radarChartOptions = {
        w: 290,
        h: 350,
        margin: margin,
        maxValue: 120,
        levels: 6,
        roundStrokes: true,
        color: d3.scaleOrdinal().range(["#276bb6", "#74d039","#ffc100","#e66400","#8dded3","#fd5f81"]),
        format: '.0f',
        legend: { translateX: 58, translateY: 29 },
        unit: 'm'
      };

      // Draw the chart, get a reference the created svg element :
      let svg_radar = RadarChart(".chart", data, radarChartOptions);


      ///////////////////////////////
      /////modal box//////
      //////////////////////////////////
          var modal = document.getElementById('myModal');

          // Get the button that opens the modal
          var btn = document.getElementById("myBtn");

          // Get the <span> element that closes the modal
          var span = document.getElementsByClassName("close")[0];

          
          // When the user clicks on <span> (x), close the modal
          span.onclick = function() {
              modal.style.display = "none";
          }

          // When the user clicks the button, open the modal 
          btn.onclick = function() {
              modal.style.display = "block";
          }




          $(function() {
            $("#PI1").hide();
            $("#PI2").hide();
            $(window).scroll(function(){
                var scrollval=$(window).scrollTop();
                if (scrollval>=880){

                  $("#PI1").show();

                }
                else{
                  $("#PI1").hide();
                };
                if (scrollval>=1380){

                  $("#PI2").show();

                }
                else{
                  $("#PI2").hide();
                };
                if (scrollval>=830){

                  $("#PI3").show();

                }
                else{
                  $("#PI3").hide();
                };
                if (scrollval>=850){

                  $("#PI4").show();

                }
                else{
                  $("#PI4").hide();
                };
                 if (scrollval>=1470){

                  $("#PI5").show();

                }
                else{
                  $("#PI5").hide();
                };
                if (scrollval>=2450){

                  $("#PI6").show();

                }
                else{
                  $("#PI6").hide();
                };
                if (scrollval>=1750){

                  $("#PI8").show();

                }
                else{
                  $("#PI8").hide();
                };
                if (scrollval>=1900){

                  $("#PI7").show();

                }
                else{
                  $("#PI7").hide();
                };
                if (scrollval>=2200){

                  $("#PI9").show();

                }
                else{
                  $("#PI9").hide();
                };
                if (scrollval>=2350){

                  $("#PI6").show();

                }
                else{
                  $("#PI6").hide();
                };
                if (scrollval>=2645){

                  $("#PI10").show();

                }
                else{
                  $("#PI10").hide();
                };
                if (scrollval>=2770){

                  $("#PI11").show();

                }
                else{
                  $("#PI11").hide();
                };
                if (scrollval>=3030){

                  $("#PI12").show();

                }
                else{
                  $("#PI12").hide();
                };
                if (scrollval>=3200){

                  $("#PI13").show();

                }
                else{
                  $("#PI13").hide();
                };
                if (scrollval>=3350){

                  $("#PI15").show();

                }
                else{
                  $("#PI15").hide();
                };
                if (scrollval>=3550){

                  $("#PI14").show();

                }
                else{
                  $("#PI14").hide();
                };
                if (scrollval>=3800){

                  $("#PI16").show();

                }
                else{
                  $("#PI16").hide();
                };
                if (scrollval>=4350){

                  $("#PI17").show();

                }
                else{
                  $("#PI17").hide();
                };
                if (scrollval>=6000){

                  $("#PI18").show();

                }
                else{
                  $("#PI18").hide();
                };
                if (scrollval>=9300){

                  $("#PI19").show();

                }
                else{
                  $("#PI19").hide();
                };
                if (scrollval>=12160){

                  $("#PI20").show();

                }
                else{
                  $("#PI20").hide();
                };
                if (scrollval>=13100){

                  $("#PI21").show();

                }
                else{
                  $("#PI21").hide();
                };
                if (scrollval>=13420){

                  $("#PI22").show();

                }
                else{
                  $("#PI22").hide();
                };
                 if (scrollval>=13420){

                  $("#PI23").show();

                }
                else{
                  $("#PI23").hide();
                };
            });


          });
          





      //////////////////////////////////////////////////////////////
      //////////////////////// check box codes /////////////////////
      //////////////////////////////////////////////////////////////

      // testVals = ["Annual Average","Spring","Summer","Fall","Winter","Daily"];
      // table = d3.select(".checks")
      //     .append("table")
      //     .property("border","1px");
      // d3.selectAll(".myCheckbox").on("change",update);
      // update();
      
      
      // function update(){
      //   var choices = [];
      //   d3.selectAll(".myCheckbox").each(function(d){
      //     cb = d3.select(this);
      //     if(cb.property("checked")){
      //       choices.push(cb.property("value"));
      //     }
      //   });
      //   console.log(choices);
      
      //   if(choices.length > 0){
      //     newData = testVals.filter(function(d,i){return choices.includes(d);});
      //   } else {
      //     newData = testVals;     
      //   } 
        
      //   newRows = table.selectAll("tr")
      //       .data(newData,function(d){return d;});
      //   console.log("tr");
      //   newRows.enter()
      //     .append("tr")
      //     .append("td")
      //     .text(function(d){return d;});    
      //   newRows.exit()
      //     .remove();      
      // }


      //////////////////////////////////////////////////////////////
      //////////////////////// point line trial /////////////////////
      //////////////////////////////////////////////////////////////

      // var points = [
      //   [400, 650],
      //   [500, 550],
      //   [580, 450],
      //   [620, 380],
      //   [650, 300],
      //   [700, 200],
      //   [800, 100]x
      // ];

      // var svg = d3.select("#content").append("svg")
      //     .attr("width", 960)
      //     .attr("height", 700)
      //     .attr("id","polyPath")
      //     .style("stroke","#348097")
      //     .style("stroke-width","3px")
      //     .style("fill","none");

      // //d3v4 line generator that uses a cardinal-closed curve   
      // var path = svg.append("path")
      //     .data([points])
      //     .attr("d", d3.line().curve(d3.curveCardinalClosed));

      // svg.selectAll(".point")
      //     .data(points)
      //   .enter().append("circle")
      //     .attr("r", 4)
      //     .attr("transform", function(d) { return "translate(" + d + ")"; })
      //     .style("stroke","#348097")
      //     .style("stroke-width","3px")
      //     .style("fill","#348097");

      // var circle = svg.append("circle")
      //     .attr("r", 13)
      //     .attr("transform", "translate(" + points[0] + ")")
      //     .style("stroke","#348097")
      //     .style("stroke-width","3px")
      //     .style("fill","#348097");

      // transition();

      // function transition() {
      //   circle.transition()
      //       .duration(100000)
      //       .attrTween("transform", translateAlong(path.node()))
      //       .on("end", transition);
      // }

      // // Returns an attrTween for translating along the specified path element.
      // // Notice how the transition is slow for the first quarter of the aniimation
      // // is fast for the second and third quarters and is slow again in the final quarter
      // // This is normal behavior for d3.transition()
      // function translateAlong(path) {
      //   var l = path.getTotalLength() * 2;
      //   return function(d, i, a) {
      //     return function(t) {
      //       if(t* l >= l/2){
      //           var p = path.getPointAtLength(l - (t*l))
      //       } else {
      //           var p = path.getPointAtLength(t * l);
      //       }
      //       return "translate(" + p.x + "," + p.y + ")";
      //     };
      //   };
      // }


      
      // ////////////////////////////////////////////////////////////////////////
      // ////////////////////////zooming transiton tryout/////////////////////
      // ///////////////////////////////////////////////////////////////////////
      // var canvas = d3.select("canvas"),
      //     context = canvas.node().getContext("2d"),
      //     width = canvas.property("width"),
      //     height = canvas.property("height"),
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
