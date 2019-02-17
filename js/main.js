var chartDiv = document.getElementById("chart");
var svg = d3.select(chartDiv).append("svg");
var width = chartDiv.clientWidth;
var height = chartDiv.clientHeight;

var layerId = '12';

// setId(layerId);

width = .80 * width;
svg
    .attr("width", width)
    .attr("height", height)
    .attr("style", "float: right;")

var g = svg.append("g");

var rect = svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .call(d3.zoom()
        .scaleExtent([1 / 2, 4])
        .on("zoom", zoomed));

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-15, 0])
    .html(function (d) {
    //detect whether this should be the long version when the user hovers for a long time
    if(tip.detailed){return  "<h3>"+d.name + "</h3><p>"+d.name+" belongs to XYZ.</p>";}
        else{return  d.name + ""};
    })
svg.call(tip);

var color = d3.scaleOrdinal(d3.schemeCategory20);

var linkForce = d3.forceLink()
    .id(function(d) { return d.id; })
    // .strength(.1)
    // 100
    .distance(80);

// -20
var chargeForce = d3.forceManyBody().strength(-30);

var simulationInitial = d3.forceSimulation()
    // values need to be adjusted according to graph size. Ideal distance is 5 and strength is -3
    // .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(80))
    .force("link", linkForce) //5
    .force("charge", chargeForce) //-3
    .force("center", d3.forceCenter(width / 2, height / 2));

// var g = svg.append("g");
function zoomed() {
  svg.attr("transform", d3.event.transform);
}

var mygraph, nodeSelection, linkSelection, textSelection;

var filename = "../data_json/BCC_1_adjacency_list.json";

function run(simulationPassed, nodeList) {
    d3.json(filename, function(error, graph) {
        if (error) throw error;
        $.getJSON("../data/1/node_labels.json", function(jsonNames) {
            // console.log(layerId);

            mygraph = graph;
            var nodeMap = {}; mygraph.nodeMap = nodeMap;

            // console.log(nodesArr);
            if (typeof nodeList !== 'undefined') {
                var nodesArr = nodeList;
                var simulation = simulationPassed;
            } else {
                var simulation = simulationInitial;
                var nodesArr = d3.keys(graph);
                nodesArr.pop();
            }
            // console.log(nodesArr);
            var nodes = nodesArr.map(function(nodeId) {
                    return {id: nodeId.toString()}
            });

            var nodesVal = [];
            nodesArr.forEach(function(element) {
                nodesVal.push(graph[element]);
            });

            // var nodesVal = d3.values(graph);
            
            // nodesVal.pop();
            // console.log(nodesVal);

            var links = d3.merge(
                nodesVal.map(function(source, index) {
                    return source.map(function(target) {
                        for(var i in target){
                            return {source: nodesArr[index], target: i.toString(), value: target[i]}
                        }
                    });
                }));

            console.log(nodes);
            console.log(links);
            setDetails(nodes.length, links.length);

            for (var i = 0; i < nodes.length; i++) {
                nodes[i].edges={}; 
                nodeMap[nodes[i].id] = nodes[i];
            }
            for(var i = 0; i < links.length; i++) {
                var link = links[i];
                // console.log(link);
                // console.log(mygraph.nodeMap[link.source]);
                
                // mygraph.nodeMap[link.source].edges[link.target] = link; //keys i edges are the nodes' id, not index
                // mygraph.nodeMap[link.target].edges[link.source] = link; 
            }
            
            
          var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter().append("line")
              // .attr("stroke-width", function(d) { return Math.sqrt(d.value); })
              .style("stroke", function(d) { return color(d.value); });

            var hoverTimeout=null;
            var toggle = 0;

          var node = svg.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(nodes)
                .enter().append("circle")
                .attr("r", 5)
                .attr("fill", function(d) { return color(1); })
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended))
                // Define functions for nodes
                .on('click', displayDetails)
                // .on('click', testFunction)
                // .on('dblclick', getShortestPathTwoNodes)
                .on('dblclick', checkMode)
                // .on('dblclick', getSparseNet)
                // .on('click', findNodes)
                // .on('mouseover', (d)=>{tip.detailed=false;var target=d3.event.target;tip.show(d,target);if(hoverTimeout){clearTimeout(hoverTimeout);}hoverTimeout=setTimeout(()=>{tip.detailed=true;tip.show(d,target);},700);})
                // .on('mousemove', (d)=>{var target=d3.event.target;tip.show(d,target);if(hoverTimeout){clearTimeout(hoverTimeout);}hoverTimeout=setTimeout(()=>{tip.detailed=true;tip.show(d,target);},700);})
                // .on('mouseout', (d)=>{tip.detailed=false;tip.hide(d);if(hoverTimeout){clearTimeout(hoverTimeout);hoverTimeout=null;}});
            var text = svg.append("g")
                .attr("class", "labels")
              .selectAll("nodes")
                .data(nodes)
              .enter().append("text")
                .attr("id", function(d) { return d.id })
                .attr("class", "not-selected")
                .attr("dx", 12)
                .attr("dy", ".35em");
                // .text(function(d) { return d.name });

            nodeSelection=node,linkSelection=link,textSelection=text;

          node.append("title")
              .text(function(d) { return jsonNames[d.id] ; });

          simulation
             .nodes(nodes)
             .on("tick", ticked);
             // .alphaDecay(1);

          simulation.force("link")
              .links(links);

            displayDetails(firstNode='test1');

          // function ticked() {
          //   link
          //       .attr("x1", function(d) { return d.source.x; })
          //       .attr("y1", function(d) { return d.source.y; })
          //       .attr("x2", function(d) { return d.target.x; })
          //       .attr("y2", function(d) { return d.target.y; });

          //   node
          //       .attr("transform", function(d) {
          //         return "translate(" + d.x + "," + d.y + ")";
          //       })
          //   text
          //       .attr("transform", function(d) {
          //         return "translate(" + d.x + "," + d.y + ")";
          //       })
          // }

          function ticked() {
             link
               .attr("x1", function(d) { return d.source.x; })
               .attr("y1", function(d) { return d.source.y; })
               .attr("x2", function(d) { return d.target.x; })
               .attr("y2", function(d) { return d.target.y; });
             node
               .attr("cx", function(d) { return d.x; })
               .attr("cy", function(d) { return d.y; });
            }

          function getShortestPathTwoNodes (n) {
            console.log(n);
            console.log(toggle);
                if (toggle == 0) {
                    // clearPath()
                    n12 = d3.select(n).node().__data__;
                    var el = document.getElementById(n1.id)
                    textSelection.each(function(d,i) {
                        this.classList.remove("selected");
                        this.classList.add("not-selected");
                    });
                    el.classList.add("selected");
                    el.classList.remove("not-selected");
                    // n1.classList.add("selected");n1.classList.remove("not-selected");
                    toggle = 1;
                } else {
                    n22 = d3.select(n).node().__data__;
                    toggle = 0
                    getShortestPath(n12, n22, layerId);
                    var el1 = document.getElementById(n12.id);
                    var el2 = document.getElementById(n22.id);
                    el1.classList.add("selected");
                    el1.classList.remove("not-selected");
                    el2.classList.add("selected");
                    el2.classList.remove("not-selected");
                }
            }
            function setDetails (nodeLen, linksLen) {
                document.getElementById('nodeVal').textContent = nodeLen;
                document.getElementById('edgeVal').textContent = linksLen;
            }
            function displayDetails(firstNode = '') {
                n1 = d3.select(this).node().__data__;            
                nodeSelection.each(function(d,i) {
                    this.classList.remove("highlight");
                });
                if (typeof n1 != 'undefined') {
                    neighborList = graph[n1.id];
                    neighborListLen = neighborList.length;
                    var neighborListArr = [];
                    nameList = '';
                    for (var i in neighborList) {
                        for (var j in neighborList[i]) {
                            nameList += jsonNames[j] + '\n';
                            neighborListArr.push(j);
                        }
                    }
                    document.getElementById('nodeHead').textContent = jsonNames[n1.id];
                    document.getElementById('nodeNeighbors').textContent = nameList;
                    document.getElementById('neighborLength').textContent = neighborListLen;
                    nodeSelection.each(function(d,i) {
                        if(d.id == n1.id){
                            this.classList.add("highlight");
                            this.classList.remove('not-selected');
                        }
                        if (neighborListArr.includes(d.id)) {
                            this.classList.add("highlight");   
                            this.classList.remove('not-selected');
                        }
                    });
                } else {
                    neighborList = graph[Object.keys(graph)[0]];
                    neighborListLen = neighborList.length;
                    nameList = '';
                    for (var i in neighborList) {
                        for (var j in neighborList[i]) {
                            nameList += jsonNames[j] + '\n';
                        }
                    }
                    document.getElementById('nodeHead').textContent = jsonNames[Object.keys(graph)[0]];
                    document.getElementById('nodeNeighbors').textContent = nameList;
                    document.getElementById('neighborLength').textContent = neighborListLen;
                }
            }

            function checkMode () {
                var classListManual = $('#v-pills-manual-tab').attr('class');
                var classListRedraw = $('#v-pills-redraw-tab').attr('class');
                if (classListManual.includes('active')) {
                    n = this;
                    console.log(n);
                    getShortestPathTwoNodes(n)
                } else if (classListRedraw.includes('active')) {
                    n = d3.select(this).node().__data__;
                    getConnectedComponents(n, layerId);
                } else {
                    n = d3.select(this).node().__data__;
                    getSparseNet(layerId, n)
                }
            }

            function dragstarted(d) {
              d.fx = null;
              d.fy = null;
            }

            function dragged(d) {
              d.fx = d3.event.x;
              d.fy = d3.event.y;
            }

            function dragended(d) {
              d.fx = d3.event.x;
              d.fy = d3.event.y;
            }

            // function dragstarted(d) {
            //     if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            //     d.fx = d.x;
            //     d.fy = d.y;
            // }

            // function dragged(d) {
            //     d.fx = d3.event.x;
            //     d.fy = d3.event.y;
            // }

            // function dragended(d) {
            //     if (!d3.event.active) simulation.alphaTarget(0);
            //     d.fx = d3.event.x;
            //     d.fy = d3.event.y;
            // }
        });
    });
}

run()

            
function setId(id) {
    document.getElementById('layerId').textContent = id;
}

$('#v-pills-reset-tab').click(function(){
    $('#v-pills-sparse-tab').click();
    clearPath();
});

$('#btnRedraw').click(function(){
    $('svg').empty();
    run(simulationInitial);
});

function zoom_actions(){
    g.attr("transform", d3.event.transform)
}

// d3.select('#chargeElem')
//   .on('click', function() {
//     console.log('update');
//     // Set the slider's value. This will re-initialize the force's strenghts.
//     chargeForce.strength(this.value);   
//     simulation.alpha(0.5).restart();  // Re-heat the simulation
//   }, false);

function testFunc (n) {
    // n = d3.select(this).node().__data__;
    getConnectedComponents(n, layerId);
    // console.log(nodeList);
}

function redraw (nodeList) {
    var linkForce = d3.forceLink()
        .id(function(d) { return d.id; })
        // .strength(0.)
        .distance(100);

    var chargeForce = d3.forceManyBody()
        .strength(-100);

    var simulation = d3.forceSimulation()
        .force("link", linkForce) //5
        .force("charge", chargeForce) //-3
        .force("center", d3.forceCenter(width / 2, height / 2))
        .alpha(5);
    $('svg').empty();
    run(simulation, nodeList);
}

