var highlight={nodes:{},links:{},text:{}};
var newHighlight = {nodes:{},links:{},links2:{},text:{}};

function highlightPath(path) {
    // Change this to decrease/increase label density
    var counterForSkip = 4;
    console.log(path);
    // console.log(mygraph.nodeMap);

    if(path.length>0){
      highlight.nodes[path[0]]=true;
      for(var i=1;i<path.length;i++)
      {
        highlight.nodes[path[i]]=true;
        // highlight.text[path[i]]=true;
        highlight.links[mygraph.nodeMap[path[i-1]].edges[path[i]].index]=true;
      }
      for(var i=1;i<path.length;i += counterForSkip) {
        highlight.text[path[i]]=true;
      }
    }
    console.log(nodeSelection);
    nodeSelection.each(function(d,i) {
      if(d.id in highlight.nodes){this.classList.add("selected");this.classList.remove("not-selected");}
      else{this.classList.remove("selected");this.classList.add("not-selected");}
    });
    counter = 0
    textSelection.each(function(d,i) {
        if(d.id in highlight.text) {
            // if ( counter % 2) { return }
            this.classList.add("selected");
            this.classList.remove("not-selected"); 
            counter += 1
        }
        else {
            this.classList.remove("selected");
            this.classList.add("not-selected");
        }

    });

    linkSelection.each(function(d,i) {
      if(d.index in highlight.links){
        // console.log(d);  
        this.classList.add("selected");
        this.classList.remove("not-selected");
      }
      else{
        this.classList.remove("selected");
        this.classList.add("not-selected");
        // if((d.source.id in highlight.nodes)||(d.target.id in highlight.nodes)){
        //   this.classList.add("neighbor");this.classList.remove("not-selected");
        // }
        // else{this.classList.remove("neighbor");this.classList.add("not-selected");}
      }

    });
}

function clearPath(path){
    highlight={nodes:{},links:{},text:{}};
    nodeSelection.each(function(d,i) {
        this.classList.remove("selected");
        this.classList.remove("not-selected");
        this.classList.remove("highlight");
        this.classList.remove("level1");
        this.classList.remove("level2");
    });
    textSelection.each(function(d,i) {
        this.classList.remove("selected");
        // this.classList.remove("not-selected");
    });
    linkSelection.each(function(d,i) {
        this.classList.remove("selected");
        this.classList.remove("neighbor");
        this.classList.remove("not-selected");
    });
}

var i = 0;                     

function myLoop (data, keys) {           
   setTimeout(function () {    
      highlightPath(data[keys[i]]);
      // console.log(data[keys[i]]);          
      i++;                     
      if (i < keys.length) {            
         myLoop(data, keys);            
      }
      if (i == keys.length) {
        stickSparse(data, keys);
        // changeNodes(keys);
        console.log(keys);
      }                   
   }, 500)
}

// myLoop();

function timedoutHighlight(data) {
    var keys = Object.keys(data);
    // console.log(keys);
    i = 0;

    myLoop(data, keys);
}

function landmarkNeighbors (nodeList) {
     // Change this to decrease/increase label density
    $.getJSON("../data/"+layerId+"/adjacency_list.json", function(jsonNames) {
        if(nodeList.length>0){
          newHighlight.nodes[nodeList[0]]=true;
          for(var i=1;i<nodeList.length;i++)
          {
            newHighlight.nodes[nodeList[i]]=true;
            neighbors = jsonNames[nodeList[i]];
            // console.log(neighbors);
            neighbors.forEach(function(element) {
                // console.log(Object.keys(element));
                newHighlight.nodes[Object.keys(element)[0]] = true;
                newHighlight.links[mygraph.nodeMap[ Object.keys(element)[0] ].edges[ nodeList[i] ].index] = true;
                // highlight.links[ mygraph.nodeMap[ path[ i-1 ] ].edges[ path[i] ].index ] = true;
            });
            neighbors.forEach(function(element) {
                neighbors.forEach(function(element2) {
                    if ((Object.keys(jsonNames[Object.keys(element)[0]]) in Object.keys(element2)) ||
                        (Object.keys(jsonNames[Object.keys(element2)[0]]) in Object.keys(element))) {
                            newHighlight.links2[mygraph.nodeMap[ Object.keys(element)[0] ].edges[ Object.keys(element2)[0] ].index] = true;
                        }
                });
            });
            // highlight.text[path[i]]=true;
                // newHighlight.links[mygraph.nodeMap[Object.keys(element)[0]].edges[nodeList[i]]]=true;
          }
        }
        console.log(newHighlight);
        nodeSelection.each(function(d,i) {
            // console.log(d);
            if(d.id in newHighlight.nodes) {
                // this.classList.add("selected");
                this.classList.remove("not-selected");
                this.classList.remove("highlight");
            } else {
                // this.classList.remove("selected");
                this.classList.add("not-selected");
            }
        });

        linkSelection.each(function(d,i) {
            if(d.index in newHighlight.links){
                this.classList.add("level2");
                this.classList.remove("not-selected");
            } else {
                this.classList.remove("level1");
                this.classList.add("not-selected");
                if((d.source.id in highlight.nodes)||(d.target.id in highlight.nodes)){
                    // this.classList.add("neighbor");
                    this.classList.remove("not-selected");
                } else {
                    this.classList.remove("neighbor");
                    this.classList.add("not-selected");
                }
            }
        });
    });        
}

function higlightNodes2(nodeList) {
    $.getJSON("../data/"+layerId+"/adjacency_list.json", function(jsonNames) {
        if (nodeList.length > 0){
          newHighlight.nodes[nodeList[0]] = true;
          for(var i=1;i<nodeList.length;i++)
          {
            newHighlight.nodes[nodeList[i]]=true;
            // neighbors = jsonNames[nodeList[i]];
            // console.log(neighbors);
            // neighbors.forEach(function(element) {
            //     // console.log(Object.keys(element));
            //     newHighlight.nodes[Object.keys(element)[0]] = true;
            //     console.log(mygraph);
            //     newHighlight.links[mygraph.nodeMap[ Object.keys(element)[0] ].edges[ nodeList[i] ].index] = true;
            //     // highlight.links[ mygraph.nodeMap[ path[ i-1 ] ].edges[ path[i] ].index ] = true;
            // });
            // neighbors.forEach(function(element) {
            //     neighbors.forEach(function(element2) {
            //         if ((Object.keys(jsonNames[Object.keys(element)[0]]) in Object.keys(element2)) ||
            //             (Object.keys(jsonNames[Object.keys(element2)[0]]) in Object.keys(element))) {
            //                 newHighlight.links2[mygraph.nodeMap[ Object.keys(element)[0] ].edges[ Object.keys(element2)[0] ].index] = true;
            //             }
            //     });
            // });
            // highlight.text[path[i]]=true;
                // newHighlight.links[mygraph.nodeMap[Object.keys(element)[0]].edges[nodeList[i]]]=true;
          }
        }

        for (var i=0; i < nodeSelection.length; i++) {
            if(nodeSelection[i].id in newHighlight.nodes) {
                // this.classList.add("selected");
                console.log(this);
                nodeSelection[i].classList.remove("not-selected");
                nodeSelection[i].classList.remove("highlight");
            } else {
                // this.classList.remove("selected");
                nodeSelection[i].classList.add("not-selected");
            }
        }
        // nodeSelection.each(function(d,i) {
        //     // console.log(d);
        //     if(d.id in newHighlight.nodes) {
        //         // this.classList.add("selected");
        //         this.classList.remove("not-selected");
        //         this.classList.remove("highlight");
        //     } else {
        //         // this.classList.remove("selected");
        //         this.classList.add("not-selected");
        //     }
        // });

        linkSelection.each(function(d,i) {
            if(d.index in newHighlight.links){
                this.classList.add("level2");
                this.classList.remove("not-selected");
            } else {
                this.classList.remove("level1");
                this.classList.add("not-selected");
                if((d.source.id in highlight.nodes)||(d.target.id in highlight.nodes)){
                    // this.classList.add("neighbor");
                    this.classList.remove("not-selected");
                } else {
                    this.classList.remove("neighbor");
                    this.classList.add("not-selected");
                }
            }
        });
    });
}

function changeNodes(keys) {
    var index = keys.indexOf('longest');
    if (index > -1) {
        keys.splice(index, 1);
    }
    landmarkNeighbors(keys);
}

function stickSparse(data, keys) {
    for (var key in data) {
        
        // key data[key]

    }
}

function higlightNodes(nodeList, data) {
    
    for (var k in nodeList) {
        highlightPath(data[nodeList[k]]);
        // console.log(data[nodeList[k]]);
        // if (nodeList.includes(links[k].source.id)) {
        //     if (nodeList.includes(links[k].target.id)) {
        //         highlight.links[links[k].index] = true;
        //         console.log(links[k]);    
        //     }
            
        // }
    }
}