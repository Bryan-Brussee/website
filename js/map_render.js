    var baseUrl = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnJ5YW5icnVzc2VlIiwiYSI6ImNpdzFua2NmeDA5N2UydG11enhtdzQxdjIifQ.bIm3DjceLQSfvBBN1Kwr7A';
    var map = L.map('map').setView([0, 0], 2);
    mapLink = 
    '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer(
      baseUrl, {
        attribution: '&copy; ' + mapLink + ' Contributors',
        maxZoom: 18,
    }).addTo(map);

    /* Initialize the SVG layer */
    map._initPathRoot()    

    /* We simply pick up the SVG from the map object */
    var svg = d3.select("#map").select("svg");
    g = svg.append("g");

    var rScale = d3.scale.sqrt().range([2, 20]);

    d3.json("js/eq.json", function(collection) {
      /* Add a LatLng object to each item in the dataset */
      collection.forEach(function(d) {
         d.LatLng = new L.LatLng(d.latitude, d.longitude);
         d.mag = +d.mag
         d.mag = Math.sqrt(Math.pow(d.mag, 10));
     });

      rScale.domain(d3.extent(collection, d => d.mag));

      var feature = g.selectAll("circle")
      .data(collection)
      .enter().append("circle")
      .style("stroke", "rgba(255,255,255,0.5)")  
      .style("opacity", .4) 
      .style("fill", "crimson ")
      .attr("r", d => rScale(d.mag));  

      map.on("viewreset", update);
      update();

      function update() {
         feature.attr("transform", 
           function(d) { 
              return "translate("+ 
              map.latLngToLayerPoint(d.LatLng).x +","+ 
              map.latLngToLayerPoint(d.LatLng).y +")";
          }
          )
     }
 });            