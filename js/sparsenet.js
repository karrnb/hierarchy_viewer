function sparseNetNew(data, layerId) {

    var filename = '../data/protein/small/layer_' + layerId + '_adjacency_list.json';
    // $('svg').empty();
    console.log(data)

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var linkForce = d3.forceLink()
        .id(function(d) { return d.id; })
        .distance(0);

    var chargeForce = d3.forceManyBody().strength(-20);

    var simulation = d3.forceSimulation()
        .force("link", linkForce) //5
        .force("charge", chargeForce) //-3
        .force("center", d3.forceCenter(width / 2, height / 2));

    d3.json(filename, function(error, graph) {
        if (error) throw error;

        $.getJSON("../data_labels/"+layerId+"/node_labels.json", function(jsonNames) {
            
            mygraph = graph;
            var nodeMap = {}; mygraph.nodeMap = nodeMap;

            // var nodes = data['nodes'];
            // var links = data['links'];
            var nodesArr = d3.keys(graph);
            nodesArr.pop();
            var nodes = nodesArr.map(function(nodeId) {
                    return {id: nodeId.toString()}
            });
            // var nodes = data['nodes'].substr(1).slice(0, -1).split(',');
            var nodes = data['nodes'];
            // nodes = nodes.slice(0, -1).split(',');
            var links = data['edges'];
            var nodesVal = [];
            nodesArr.forEach(function(element) {
                nodesVal.push(graph[element]);
            });
            // var links = d3.merge(
            // nodesVal.map(function(source, index) {
            //     return source.map(function(target) {
            //         for(var i in target){
            //             return {source: nodesArr[index], target: i.toString(), value: target[i]}
            //         }
            //     });
            // }));
            console.log(nodes);

            for (var i = 0; i < nodes.length; i++) {
                // console.log(nodes[i]);
                nodes[i].edges={}; 
                nodeMap[nodes[i].id] = nodes[i];
            }
            // console.log(nodes);
            console.log(mygraph);
            for(var i = 0; i < links.length; i++) {
                var link = links[i];
                // console.log(link);
                mygraph.nodeMap[link.source].edges[link.target] = link; //keys i edges are the nodes' id, not index
                mygraph.nodeMap[link.target].edges[link.source] = link; 
            }

            setDetails(nodes.length, links.length);

            for (var i = links.length - 1; i >= 0; i--) {
                graph[links[i]['source']].forEach(function(element) {
                    if (Object.keys(element) == links[i]['target']) {
                        // console.log(element[Object.keys(element)]);
                        // console.log(Object.values(element));
                        links[i]['value'] = Object.values(element)[0];
                    }
                })
            }

            // console.log(links);

            $('svg').empty();

            var linkGroup = svg.append("g")
                .attr("class", "links")

                // .selectAll("line")
                // .data(links)
                // .enter().append("line")
                //   // .attr("stroke-width", function(d) { return Math.sqrt(d.value); })
                //   .style("stroke", function(d) { return color(d.value); });

                var hoverTimeout=null;
                var toggle = 0;

            var nodeGroup = svg.append("g")
                .attr("class", "nodes")
                // .selectAll("circle")
                // .data(nodes)
                // .enter().append("circle")
                // .attr("r", 5)
                // .attr("fill", function(d) { return color(1); })
                // .call(d3.drag()
                //     .on("start", dragstarted)
                //     .on("drag", dragged)
                //     .on("end", dragended))
                // // Define functions for nodes
                // .on('click', displayDetails)
                // // .on('click', testFunction)
                // // .on('dblclick', getShortestPathTwoNodes)
                // .on('dblclick', checkMode)
            var alpha = 0.5;

            nodeSelection = nodeGroup, linkSelection = links;

            restart(alpha);


            function setDetails (nodeLen, linksLen) {
                document.getElementById('nodeVal').textContent = nodeLen;
                document.getElementById('edgeVal').textContent = linksLen;
            }

            // function ticked() {
            //     for (var i = 0; i < 10; i++) {
            //         simulation.tick();
            //     }
            //     // console.log(linkGroup);
            //     // console.log(link);
            //     link
            //         .attr("x1", function(d) { return d.source.x; })
            //         .attr("y1", function(d) { return d.source.y; })
            //         .attr("x2", function(d) { return d.target.x; })
            //         .attr("y2", function(d) { return d.target.y; });
            //     node
            //         .attr("cx", function(d) { return d.x; })
            //         .attr("cy", function(d) { return d.y; });

            //     if (simulation.alpha() == 0) {
            //         node
            //             .attr("fx", function(d) { return d.x; })
            //             .attr("fy", function(d) { return d.y; });                    
            //     }
            // }
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

            function displayDetails(firstNode = '') {
                n1 = d3.select(this).node().__data__;            
                console.log(nodeSelection);
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
                    console.log(nodeSelection);
                    nodeSelection.each(function(d,i) {
                        console.log(d);
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

            function restart(alpha) {

                console.log(nodes);
                console.log(links);

                link = linkGroup
                    .selectAll("line")
                    .data(links);

                linkEnter = link
                    .enter().append("line")
                    .style("stroke", function(d) { return color(d.value); });

                link = linkEnter
                    .merge(link);

                node = nodeGroup.selectAll("circle").data(nodes);

                nodeEnter = node.enter().append("circle")
                   .attr("r", 5)
                   .attr("fill", function(d) { return color(1); })
                   .call(d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended))
                   .on('click', displayDetails)
                   .on('dblclick', checkMode);

                node = nodeEnter.merge(node);

                node.append("title")
                    .text(function(d) { return jsonNames[d.id] ; });

                var hoverTimeout=null;
                var toggle = 0;

                simulation.nodes(nodes).on("tick", ticked);
                simulation.force("link").links(links);
                simulation.alphaTarget(alpha).restart();

                console.log('In Restart');
                console.log(data['sparse']);
                nodeSelection = node, linkSelection = link;
                higlightNodes(data['sparse'], data);
                // highlightPath(data['sparse']);
            }

            function checkMode () {
                var classListManual = $('#v-pills-manual-tab').attr('class');
                var classListRedraw = $('#v-pills-redraw-tab').attr('class');
                if (classListManual.includes('active')) {
                    n = this;
                    // console.log(n);
                    getShortestPathTwoNodes(n)
                } else if (classListRedraw.includes('active')) {
                    n = d3.select(this).node().__data__;
                    getConnectedComponents(n, layerId);
                } else {
                    n = d3.select(this).node().__data__;
                    getSparseNet(layerId, n)
                }
            }

        });
    });     
}