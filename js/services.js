var url = "localhost:3682";

function getShortestPathNode() {
    n = d3.select(this).node().__data__;
    nodeId = n.id;
    $.ajax({ 
        type: "GET",
        dataType: "json",
        url: "http://"+url+"/tulipTool/findLongestShortPath?nodeId="+nodeId,
        success: function(data){
            // console.log(data['path']);
            highlightPath(data['path']);

        }
    });
    // console.log(n.id);
}

function getShortestPath(node1, node2, layerId) {
    $.ajax({ 
        type: "GET",
        dataType: "json",
        url: "http://"+url+"/tulipTool/getShortestPath?source="+node1.id+"&target="+node2.id+"&layer="+layerId,
        success: function(data){
            // console.log(data['path']);
            highlightPath(data['path']);

        }
    });
}

function getSparseNet(layerId, node) {
    $.ajax({ 
        type: "GET",
        dataType: "json",
        url: "http://"+url+"/tulipTool/findSparseNet?layer="+layerId+"&nodes="+node.id,
        success: function(data){
            // timedoutHighlight(data);
            sparseNetNew(data, layerId);
            // console.log(data['longest']);
            // highlightPath(data['longest']);
        }
    });
}

function getConnectedComponents(node1, layerId) {
    $.ajax({ 
        type: "GET",
        dataType: "json",
        url: "http://"+url+"/tulipTool/getConnectedComponents?node="+node1.id+"&layer="+layerId,
        success: function(data){
            redraw(data);
            // return data;
            // console.log(data);
            // highlightPath(data['path']);

        }
    });
}