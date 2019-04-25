function reverseForIn(obj, f) {
    var arr = [];
    for (var key in obj) {
    // add hasOwnPropertyCheck if needed
        arr.push(key);
    }
    for (var i=arr.length-1; i>=0; i--) {
        f.call(obj, arr[i]);
    }
}

function run(simulationPassed, nodeList, filename, layerId) {
    d3.json(filename, function(error, graph) {
        console.log(graph);
        if (error) throw error;
        $.getJSON("../data_labels/"+layerId+"/node_labels.json", function(jsonNames) {
            mygraph = graph;
            var nodeMap = {}; mygraph.nodeMap = nodeMap;
            if (typeof nodeList !== 'undefined') {
                var nodesArr = nodeList;
                var simulation = simulationPassed;
            } else {
                var simulation = simulationInitial;
                var nodesArr = d3.keys(graph);
                nodesArr.pop();
            }
            var nodes = nodesArr.map(function(nodeId) {
                    return {id: nodeId.toString()}
            });
            var nodesVal = [];
            nodesArr.forEach(function(element) {
                nodesVal.push(graph[element]);
            });

            var links = d3.merge(
                nodesVal.map(function(source, index) {
                    return source.map(function(target) {
                        for(var i in target){
                            return {source: nodesArr[index], target: i.toString(), value: target[i]}
                        }
                    });
                }));

            for (var i = 0; i < nodes.length; i++) {
                nodes[i].edges={}; 
                nodeMap[nodes[i].id] = nodes[i];
            }            
            
            var link = svg.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(links)
                .enter().append("line")
                .style("stroke", function(d) { return color(d.value); });

            var hoverTimeout = null;
            var toggle = 0;

            // nodes = get_group(nodes, graph);

            console.log(nodes);
            console.log(links);

            var node = svg.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(nodes)
                .enter().append("circle")
                .attr("r", 5)
                .attr("fill", function(d) { return color_heat_map(d.group); })
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended))

                // Define functions for nodes
                .on('click', displayDetails)
                .on('dblclick', checkMode)

            var text = svg.append("g")
                .attr("class", "labels")
                .selectAll("nodes")
                .data(nodes)
                .enter()
                .append("text")
                .attr("id", function(d) { return d.id })
                .attr("class", "not-selected")
                .attr("dx", 12)
                .attr("dy", ".35em");

            nodeSelection=node,linkSelection=link,textSelection=text;

            node.append("title")
                .text(function(d) { return jsonNames[d.id] ; });

            simulation
                .nodes(nodes)
                .on("tick", ticked);

            simulation.force("link").links(links);

            displayDetails(firstNode = 'test1');

            function ticked() {
            link
               .attr("x1", function(d) { return myTransform.applyX(d.source.x); })
               .attr("y1", function(d) { return myTransform.applyY(d.source.y); })
               .attr("x2", function(d) { return myTransform.applyX(d.target.x); })
               .attr("y2", function(d) { return myTransform.applyY(d.target.y); });
            node
               .attr("cx", function(d) { return myTransform.applyX(d.x); })
               .attr("cy", function(d) { return myTransform.applyY(d.y); });
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
                    this.classList.remove("highlight2");
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
                    var url = getName(jsonNames[n1.id]);
                    // console.log(url);
                    document.getElementById('nodeHead').textContent = jsonNames[n1.id];
                    document.getElementById('nodeHead').href = "https://www.rcsb.org/structure/" + url;
                    document.getElementById('nodeNeighbors').textContent = nameList;
                    document.getElementById('neighborLength').textContent = neighborListLen;
                    nodeSelection.each(function(d,i) {
                        if(d.id == n1.id){
                            this.classList.add("highlight2");
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
                    var url = getName(jsonNames[Object.keys(graph)[0]]);
                    document.getElementById('nodeHead').textContent = jsonNames[Object.keys(graph)[0]];
                    document.getElementById('nodeHead').href = "https://www.rcsb.org/structure/" + url;
                    document.getElementById('nodeNeighbors').textContent = nameList;
                    document.getElementById('neighborLength').textContent = neighborListLen;
                }
            }

            function checkMode () {
                var classListManual = document.getElementById('v-pills-manual-tab').className;
                var classListRedraw = document.getElementById('v-pills-redraw-tab').className;
                // var classListManual = $('#v-pills-manual-tab').attr('class');
                // var classListRedraw = $('#v-pills-redraw-tab').attr('class');
                if (classListManual.includes('active')) {
                    n = this;
                    console.log(n);
                    getShortestPathTwoNodes(n)
                } else if (classListRedraw.includes('active')) {
                    n = d3.select(this).node().__data__;
                    var vMap = getEgonetVMap(n.id);
                    drawInducedSubgraph(vMap);
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

            function getName(fullName) {
                var newName = fullName.split('.')
                return newName[0]
            }

            function writeToFile(graph) {
                $.getJSON( "test.json", function( data ) {
                    console.log(graph);
                    var obj = {'graph': graph}
                    data.push(obj);
                    console.log('File Written')
                });
            }
        });
    });
}

function load_subgraph(filename) {
    var html = $(filename).html();
    var splits = html.split(/<span.*/gm);

    console.log(filename.getAttribute('data-tag'));

    if (filename.getAttribute('data-tag') == 'small') {
        var filepath = path + 'small/layer_' + splits[0].split(' ')[1] + '_adjacency_list.json';
        var layerId = splits[0].split(' ')[1];
    } else {
        if (splits[0].includes('BiConnected')) {
            var id = filename.id.split('_');
            var filepath = path + id[0] + '/cc_' + id[1] + '_bcc_' + id[2] + '_adjacency_list.json';
            var layerId = id[0];

        } else if (splits[0].includes('Connected')) {
            var id = filename.id.split('_');
            var filepath = path + id[0] + '/cc_' + id[1] + '_adjacency_list.json';
            var layerId = id[0];

        } else if (splits[0].includes('Bucket')) {
            var id = filename.id.split('_');
            var filepath = path + id[0] + '/bucket_' + id[1] + '_adjacency_list.json';
            var layerId = id[0];
        } else {
            var layerId = splits[0].split(' ')[1];
            var filepath = path + layerId + '/cc_0_bcc_0_adjacency_list.json';
        }
    }

    // if (splits[0].includes('Layer')) {
    //     var filepath = path + 'small/layer_' + splits[0].split(' ')[1] + '_adjacency_list.json';
    //     var layerId = splits[0].split(' ')[1];
        
    // } else if (splits[0].includes('BiConnected')) {
    //     var id = filename.id.split('_');
    //     var filepath = path + id[0] + '/cc_' + id[1] + '_bcc_' + id[2] + '_adjacency_list.json';
    //     var layerId = id[0];

    // } else if (splits[0].includes('Connected')) {
    //     var id = filename.id.split('_');
    //     var filepath = path + id[0] + '/cc_' + id[1] + '_adjacency_list.json';
    //     var layerId = id[0];

    // } else if (splits[0].includes('Bucket')) {
    //     var id = filename.id.split('_');
    //     var filepath = path + id[0] + '/bucket_' + id[1] + '_adjacency_list.json';
    //     var layerId = id[0];
    // }

    $('svg').empty();

    var linkForce = d3.forceLink()
        .id(function(d) { return d.id; })
        .distance(80);

    var chargeForce = d3.forceManyBody()
        .strength(-2);

    var simulation = d3.forceSimulation()
        .force("link", linkForce) //5
        .force("charge", chargeForce) //-3
        .force("center", d3.forceCenter(width / 2, height / 2))
        .alpha(10);

    simulationInitial = simulation;

    run(simulationInitial, undefined, filepath, layerId)
}

var oldnodes,oldlinks;

function drawInducedSubgraph(vMap){
    if(vMap){
        oldnodes=simulationInitial.nodes();
        oldlinks=simulationInitial.force("link").links();
        simulationInitial.nodes(oldnodes.filter((d)=>(d.id in vMap)));
        simulationInitial.force("link").links(oldlinks.filter((d)=>(d.source.id in vMap && d.target.id in vMap)));
        simulationInitial.alpha(5).restart();
        nodeSelection.attr("display",(d)=>(d.id in vMap)?"":"none")
        linkSelection.attr("display",(d)=>(d.source.id in vMap && d.target.id in vMap)?"":"none")
    }
    else{
        if(!oldnodes)return;
        simulationInitial.nodes(oldnodes);
        simulationInitial.force("link").links(oldlinks);
        simulationInitial.alpha(1).restart();//;
        nodeSelection.attr("display",(d)=>"");
        linkSelection.attr("display",(d)=>"");
    }
    
}

function getEgonetVMap(id){
    var map={};
    var neighbors=mygraph[id];
    map[id]=true;
    for(var edge of neighbors){
        for(var n in edge){map[n]=true;}
    }
    return map;
}

function avg_degree(nodes, edges) {
    var deg = Math.round((parseInt(edges)*2)/parseInt(nodes));
    return deg.toString();
}