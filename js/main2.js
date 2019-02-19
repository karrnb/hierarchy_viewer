var chartDiv = document.getElementById("chart");
var svg = d3.select(chartDiv).append("svg");
var width = chartDiv.clientWidth;
var height = chartDiv.clientHeight;

var layerId = '12';
var path = '../data/protein2/';

// setId(layerId);

// width = .100 * width;
svg
    .attr("width", width)
    .attr("height", height)
    .attr("style", "float: right;")
	.call(d3.zoom()
        .scaleExtent([1 / 2, 4])
        .on("zoom", zoomed));

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
    // 80
    .distance(1);

// -20
var chargeForce = d3.forceManyBody().strength(-50);

var simulationInitial = d3.forceSimulation()
    // values need to be adjusted according to graph size. Ideal distance is 5 and strength is -3
    // .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(80))
    .force("link", linkForce) //5
    .force("charge", chargeForce) //-3
    .force("center", d3.forceCenter(width / 2, height / 2));

// var g = svg.append("g");
function zoomed() {
  //svg.attr("transform", d3.event.transform);
  console.log(d3.event.transform,myTransform);
  myTransform=d3.event.transform;//myTransform.scale(d3.event.transform.k).translate(d3.event.transform.x,d3.event.transform.y);
}

var myTransform=d3.zoomIdentity;

var bucketing_file = path + 'bucketing.json';

$.getJSON(bucketing_file, function(json) {
    for(var layer in json) {
        var bucketString = '';
        var layerBuckets = json[layer];
        if (layerBuckets.length == 1) {
            var bucket = layerBuckets[0];
            if (bucket.length == 1) {
                var component = bucket[0]
                if (component['@file'].includes('small')) {
                    var edges = component['@num_edges'];
                    var nodes = component['@num_nodes'];
                    $('#list-tab').append('<a href="#'+layer+'" class="list-group-item" data-toggle="collapse" onclick="load_subgraph(this)">Layer '+layer+'<span class="badge badge-primary badge-pill">'+edges+'</span> <span class="badge badge-success badge-pill">'+nodes+'</span></div>');
                    continue;
                }
            }
        }
        $.each(layerBuckets, function(bucket_id) {
            var bucket = layerBuckets[bucket_id];
            if (bucket.length == 1) {
                var component = bucket[0]
                // display small layers
                if (component['@file'].includes('small')) {
                    console.log('Small');
                } else {
                    //TODO: Contains components that aren't small but have just one item in the bucket
                }
            } else {
                // if bucket contains more than one item
                $.each(bucket, function(component_id) {
                    var component = bucket[component_id];
                })
            }
            var thumbnailPath = path + layer + '/bucket_'+bucket_id+'.png';
            // var largeImg = '<span class="large"><img src="'+thumbnailPath+'" alt="" class=large_image></span>';
            var largeImg = ''
            bucketString += '<a id='+layer+'_'+bucket_id +' class="list-group-item cc" onclick="load_subgraph(this)">Bucket '+ bucket_id+'<img class="thumbnail" src="'+thumbnailPath+'" alt="" onmouseover="Large(this)">'+largeImg+'</a>'
            // bucketString += '<a id="'+key+'_'+connectedC['@cc_id']+'" href="#'+ key + '_' + connectedC['@cc_id'] +'" class="list-group-item cc" onclick="load_subgraph(this)" data-toggle="collapse">Connected Component '+connectedC['@cc_id']+'</a>';
        });
        $('#list-tab').append('<a href="#'+layer+'" class="list-group-item" data-toggle="collapse"><i class="glyphicon glyphicon-chevron-right"></i>Layer '+layer+'</a><div class="list-group collapse" id="'+layer+'">'+bucketString+'</div>');
    }
});
/*
var index_file = path + 'output_list.json';

$.getJSON(index_file, function(json) {
    for(var key in json) {
        // console.log(key);
        if ('CC' in json[key]) {
            // for larger components
            var ccString = ''
            var connectedCs = json[key].CC;
            if (connectedCs.constructor === Array) {
                $.each(connectedCs, function(cc) {
                    var connectedC = connectedCs[cc];
                    // console.log(connectedC);
                    if ('BCC' in connectedC) {
                        // console.log(connectedC);
                        var bccString = '';
                        var biConnectedCs = connectedC.BCC;
                        if (biConnectedCs.constructor === Array) {
                            $.each(biConnectedCs, function(bcc) {
                                var biConnectedC = biConnectedCs[bcc];
                                var edges = biConnectedC['@num_edges'];
                                var nodes = biConnectedC['@num_nodes'];
                                // Name Biconnected Component used further down in load_subgraph
                                bccString += '<a id="'+key+'_'+connectedC['@cc_id']+'_'+biConnectedC['@bcc_id']+'" href="#" class="list-group-item bcc" onclick="load_subgraph(this)">BiConnected Component '+biConnectedC['@bcc_id']+'<span class="badge badge-primary badge-pill">'+edges+'</span> <span class="badge badge-success badge-pill">'+nodes+'</span></a>'
                            });
                        } else {
                            var biConnectedC = connectedC.BCC;
                            var edges = biConnectedC['@num_edges'];
                            var nodes = biConnectedC['@num_nodes'];
                            bccString += '<a id="'+key+'_'+connectedC['@cc_id']+'_'+biConnectedC['@bcc_id']+'" href="#" class="list-group-item bcc" onclick="load_subgraph(this)">BiConnected Component '+biConnectedC['@bcc_id']+'<span class="badge badge-primary badge-pill">'+edges+'</span> <span class="badge badge-success badge-pill">'+nodes+'</span></a>'
                        }
                        ccString += '<a href="#'+ key + '_' + connectedC['@cc_id'] +'" class="list-group-item cc" data-toggle="collapse"><i class="glyphicon glyphicon-chevron-right"></i>Connected Component '+connectedC['@cc_id']+'</a><div class="list-group collapse" id="'+ key + '_' + connectedC['@cc_id'] +'">'+bccString+'</div>';
                    } else {
                        var edges = connectedC['@num_edges'];
                        var nodes = connectedC['@num_nodes'];
                        ccString += '<a id="'+key+'_'+connectedC['@cc_id']+'" href="#'+ key + '_' + connectedC['@cc_id'] +'" class="list-group-item cc" onclick="load_subgraph(this)" data-toggle="collapse">Connected Component '+connectedC['@cc_id']+'<span class="badge badge-primary badge-pill">'+edges+'</span> <span class="badge badge-success badge-pill">'+nodes+'</span></a>';
                    }
                });
            } else {
                //single connected component
                var connectedC = connectedCs;
                if ('BCC' in connectedC) {
                    var bccString = '';
                    var biConnectedCs = connectedC.BCC;
                    if (biConnectedCs.constructor === Array) {
                        $.each(biConnectedCs, function(bcc) {
                            var biConnectedC = biConnectedCs[bcc];
                            var edges = biConnectedC['@num_edges'];
                            var nodes = biConnectedC['@num_nodes'];
                            bccString += '<a id="'+key+'_'+connectedC['@cc_id']+'_'+biConnectedC['@bcc_id']+'" href="#" class="list-group-item bcc" onclick="load_subgraph(this)">BiConnected Component '+biConnectedC['@bcc_id']+'<span class="badge badge-primary badge-pill">'+edges+'</span> <span class="badge badge-success badge-pill">'+nodes+'</span></a>'
                        });
                    } else {
                        var biConnectedC = connectedC.BCC;
                        var edges = biConnectedC['@num_edges'];
                        var nodes = biConnectedC['@num_nodes'];
                        bccString += '<a id="'+key+'_'+connectedC['@cc_id']+'_'+biConnectedC['@bcc_id']+'" href="#" class="list-group-item bcc" onclick="load_subgraph(this)">BiConnected Component '+biConnectedC['@bcc_id']+'<span class="badge badge-primary badge-pill">'+edges+'</span> <span class="badge badge-success badge-pill">'+nodes+'</span></a>'
                    }
                    ccString += '<a href="#'+ key + '_' + connectedC['@cc_id'] +'" class="list-group-item cc" data-toggle="collapse"><i class="glyphicon glyphicon-chevron-right"></i>Connected Component '+connectedC['@cc_id']+'</a><div class="list-group collapse" id="'+ key + '_' + connectedC['@cc_id'] +'">'+bccString+'</div>';
                } else {
                    var edges = connectedC['@num_edges'];
                    var nodes = connectedC['@num_nodes'];
                    ccString += '<a id="'+key+'_'+connectedC['@cc_id']+'" href="#'+ key + '_' + connectedC['@cc_id'] +'" class="list-group-item cc" onclick="load_subgraph(this)" data-toggle="collapse">Connected Component '+connectedC['@cc_id']+'<span class="badge badge-primary badge-pill">'+edges+'</span> <span class="badge badge-success badge-pill">'+nodes+'</span></a>'
                }
            }
            $('#list-tab').append('<a href="#'+key+'" class="list-group-item" data-toggle="collapse"><i class="glyphicon glyphicon-chevron-right"></i>Layer '+key+'</a><div class="list-group collapse" id="'+key+'">'+ccString+'</div>');
        } else {
            // for small components
            var edges = json[key]['@num_edges'];
            var nodes = json[key]['@num_nodes'];
            $('#list-tab').append('<a href="#" onclick="load_subgraph(this)" class="list-group-item">Layer '+key+'<span class="badge badge-primary badge-pill">'+edges+'</span> <span class="badge badge-success badge-pill">'+nodes+'</span></a>');
        }
    }
});
*/

function run(simulationPassed, nodeList, filename, layerId) {
    // var layerId = filename.substr(28, filename.length - 48);
    d3.json(filename, function(error, graph) {
        if (error) throw error;
        // console.log(filename.substr(28, filename.length - 48));
        $.getJSON("../data_labels/"+layerId+"/node_labels.json", function(jsonNames) {
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
            // for(var i = 0; i < links.length; i++) {
            //     var link = links[i];
            //     // console.log(link);
            //     // console.log(mygraph.nodeMap[link.source]);
                
            //     // mygraph.nodeMap[link.source].edges[link.target] = link; //keys i edges are the nodes' id, not index
            //     // mygraph.nodeMap[link.target].edges[link.source] = link; 
            // }
            
            
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
                .enter()
                .append("text")
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
                    // console.log(url);
                    document.getElementById('nodeHead').textContent = jsonNames[Object.keys(graph)[0]];
                    document.getElementById('nodeHead').href = "https://www.rcsb.org/structure/" + url;
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
                    var vMap = getEgonetVMap(n.id);
                    drawInducedSubgraph(vMap);
                    // getConnectedComponents(n, layerId);
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
    var html = $(filename).html()
    var splits = html.split(/<span.*/gm);
    // console.log(splits[0]);

    if (splits[0].includes('Layer')) {
        // console.log(splits[0].split(' '));

        var filepath = path + 'small/layer_' + splits[0].split(' ')[1] + '_adjacency_list.json';
        $('svg').empty();
        // if (parseInt(val) !== 1) {
        var linkForce = d3.forceLink()
        .id(function(d) { return d.id; })
        // .strength(0.)
        .distance(80);

        var chargeForce = d3.forceManyBody()
            .strength(-2);

        var simulation = d3.forceSimulation()
            .force("link", linkForce) //5
            .force("charge", chargeForce) //-3
            .force("center", d3.forceCenter(width / 2, height / 2))
            .alpha(10);

        simulationInitial = simulation;

        run(simulationInitial, undefined, filepath, splits[0].split(' ')[1])

    } else if (splits[0].includes('BiConnected')) {
        console.log(filename);
        var id = filename.id.split('_');
        // console.log(id);
        var filepath = path + id[0] + '/cc_' + id[1] + '_bcc_' + id[2] + '_adjacency_list.json';
        $('svg').empty();
        // if (parseInt(val) !== 1) {
        var linkForce = d3.forceLink()
        .id(function(d) { return d.id; })
        // .strength(0.)
        .distance(80);

        var chargeForce = d3.forceManyBody()
            .strength(-2);

        var simulation = d3.forceSimulation()
            .force("link", linkForce) //5
            .force("charge", chargeForce) //-3
            .force("center", d3.forceCenter(width / 2, height / 2))
            .alpha(10);

        simulationInitial = simulation;

        run(simulationInitial, undefined, filepath, id[0])

    } else if (splits[0].includes('Connected')) {
        console.log(filename);
        var id = filename.id.split('_');
        console.log(id);
        var filepath = path + id[0] + '/cc_' + id[1] + '_adjacency_list.json';
        $('svg').empty();
        // if (parseInt(val) !== 1) {
        var linkForce = d3.forceLink()
        .id(function(d) { return d.id; })
        // .strength(0.)
        .distance(80);

        var chargeForce = d3.forceManyBody()
            .strength(-2);

        var simulation = d3.forceSimulation()
            .force("link", linkForce) //5
            .force("charge", chargeForce) //-3
            .force("center", d3.forceCenter(width / 2, height / 2))
            .alpha(10);

        simulationInitial = simulation;

        run(simulationInitial, undefined, filepath, id[0])

    } else if (splits[0].includes('Bucket')) {
        var id = filename.id.split('_');
        console.log(id);
        var filepath = path + id[0] + '/bucket_' + id[1] + '_adjacency_list.json';
        $('svg').empty();
        // if (parseInt(val) !== 1) {
        var linkForce = d3.forceLink()
        .id(function(d) { return d.id; })
        // .strength(0.)
        .distance(80);

        var chargeForce = d3.forceManyBody()
            .strength(-2);

        var simulation = d3.forceSimulation()
            .force("link", linkForce) //5
            .force("charge", chargeForce) //-3
            .force("center", d3.forceCenter(width / 2, height / 2))
            .alpha(10);

        simulationInitial = simulation;

        run(simulationInitial, undefined, filepath, id[0])
    }
}


$('a[target^="_new"]').click(function() {
    var width = window.innerWidth * 0.66 ;
    // define the height in
    var height = width * window.innerHeight / window.innerWidth ;
    // Ratio the hight to the width as the user screen ratio
    window.open(this.href , 'newwindow', 'width=' + width + ', height=' + height + ', top=' + ((window.innerHeight - height) / 2) + ', left=' + ((window.innerWidth - width) / 2));

});

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

$(function() {   
    $('.list-group-item').on('click', function() {
        $('.glyphicon', this)
            .toggleClass('glyphicon-chevron-right')
        .toggleClass('glyphicon-chevron-down');
    });
});