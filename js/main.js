var path = '../data/protein2/';

var chartDiv = document.getElementById("chart");
var width = chartDiv.clientWidth;
var height = chartDiv.clientHeight;

var svg = d3.select(chartDiv).append("svg");

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
var color_heat_map = d3.scaleLinear().domain([0, 1]).range(['beige', 'red']);

var linkForce = d3.forceLink()
    .id(function(d) { return d.id; })
    .distance(1);

var chargeForce = d3.forceManyBody().strength(-50);

var simulationInitial = d3.forceSimulation()
    .force("link", linkForce) //5
    .force("charge", chargeForce) //-3
    .force("center", d3.forceCenter(width / 2, height / 2));

function zoomed() {
    myTransform = d3.event.transform;//myTransform.scale(d3.event.transform.k).translate(d3.event.transform.x,d3.event.transform.y);
}

var myTransform = d3.zoomIdentity;

var bucketing_file = path + 'bucketing.json';

$.getJSON(bucketing_file, function(json) {
    // Flip the layer number from highest to lowest
    reversedJson = [];
    reverseForIn(json, function(temp) {
        reversedJson.push(temp);
    });

    for(var layer in reversedJson) {
        layer = reversedJson[layer];
        var bucketString = '';
        var layerBuckets = json[layer];
        if (layerBuckets.length == 1) {
            var bucket = layerBuckets[0];
            if (bucket.length == 1) {
                var component = bucket[0]
                if (component['@file'].includes('small')) {
                    var edges = component['@num_edges'];
                    var nodes = component['@num_nodes'];
                    $('#list-tab').append('<a href="#'+layer+'" class="list-group-item" data-toggle="collapse" onclick="load_subgraph(this)" data-tag="small" >Layer '+layer+'<span class="badge badge-primary badge-pill">'+edges+'</span> <span class="badge badge-success badge-pill">'+nodes+'</span><span class="badge badge-warning badge-pill">'+ avg_degree(nodes, edges) +'</span></div>');
                    continue;
                } else {
                    var edges = component['@num_edges'];
                    var nodes = component['@num_nodes'];
                    $('#list-tab').append('<a href="#'+layer+'" class="list-group-item" data-toggle="collapse" onclick="load_subgraph(this)">Layer '+layer+'<span class="badge badge-primary badge-pill">'+edges+'</span> <span class="badge badge-success badge-pill">'+nodes+'</span><span class="badge badge-warning badge-pill">'+ avg_degree(nodes, edges) +'</span></div>');
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
                    console.log(bucket);
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
            var largeImg = '';
            bucketString += '<a id='+layer+'_'+bucket_id +' class="list-group-item cc" onclick="load_subgraph(this)">Bucket '+ bucket_id+'<img class="thumbnail" src="'+thumbnailPath+'" alt="" onmouseover="Large(this)">'+largeImg+'</a>'
            // bucketString += '<a id="'+key+'_'+connectedC['@cc_id']+'" href="#'+ key + '_' + connectedC['@cc_id'] +'" class="list-group-item cc" onclick="load_subgraph(this)" data-toggle="collapse">Connected Component '+connectedC['@cc_id']+'</a>';
        });
        $('#list-tab').append('<a href="#'+layer+'" class="list-group-item" data-toggle="collapse"><i class="glyphicon glyphicon-chevron-right"></i>Layer '+layer+'</a><div class="list-group collapse" id="'+layer+'">'+bucketString+'</div>');
    }
    // });
});



$('a[target^="_new"]').click(function() {
    var width = window.innerWidth * 0.66 ;
    // define the height in
    var height = width * window.innerHeight / window.innerWidth ;
    // Ratio the hight to the width as the user screen ratio
    window.open(this.href , 'newwindow', 'width=' + width + ', height=' + height + ', top=' + ((window.innerHeight - height) / 2) + ', left=' + ((window.innerWidth - width) / 2));

});

$(function() {   
    $('.list-group-item').on('click', function() {
        $('.glyphicon', this)
            .toggleClass('glyphicon-chevron-right')
        .toggleClass('glyphicon-chevron-down');
    });
});