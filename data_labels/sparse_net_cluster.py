import json
from pprint import pprint

MAX_HOPS = 1
HOP_2_PARENTS = []

def _find_node_parent(node, graph_adj, sparse_net_nodes):
    for neighbor in graph_adj[node]:
        # print(list(neighbor.keys())[0])
        if list(neighbor.keys())[0] in sparse_net_nodes:
            # print(neighbor)
            return neighbor
    return None



def get_cluster(parents, graph_adjacency, sparse_net_edge_list):
    #parents is a list of vertices which are in the sparse net
    #graph_adjacency is a dictionary where key is the vertex id and value is a list of vertices which are adjacent to it.

    ret = {}
    out_file_name = "sparse_net_cluster.json"
    visited = set()

    for k, v in graph_adjacency.items():
        if k in parents:
            visited.add(k)
            # print(k)
            continue

        node_parent = _find_node_parent(k, graph_adjacency, parents)
        # print(node_parent)

        if node_parent is not None:
            visited.add(k)
            # print(node_parent[list(node_parent.keys())[0]])
            edge_dict = {k: node_parent[list(node_parent.keys())[0]]}
            if list(node_parent.keys())[0] in ret:
                ret[list(node_parent.keys())[0]].append(edge_dict)
            else:
                ret[list(node_parent.keys())[0]] = [edge_dict]
            HOP_2_PARENTS.append(k)
    # return ret

    for edge in sparse_net_edge_list:

        from_v = edge['source']
        to_v = edge['target']
        weight = edge['value']

        if from_v in ret:
            ret[from_v].append({to_v:weight})
        else:
            ret[from_v] = [{to_v:weight}]

    for k, v in graph_adjacency.items():
        if k in visited:
            # print(k)
            continue

        node_parent = _find_node_parent(k, graph_adjacency, HOP_2_PARENTS)
        # print(node_parent)

        if node_parent is not None:
            # print(node_parent[list(node_parent.keys())[0]])
            edge_dict = {k: node_parent[list(node_parent.keys())[0]]}
            if list(node_parent.keys())[0] in ret:
                ret[list(node_parent.keys())[0]].append(edge_dict)
            else:
                ret[list(node_parent.keys())[0]] = [edge_dict]




    with open(out_file_name, "w+") as output_file:
        output_file.write(json.dumps(ret))

listParents = ['26081', '26065', '25636', '25679', '24738', '24821', '25165', '24740', '24881', '25612', '25836', '24808', '25809', '26436', '25802', '25009', '25839', '24820', '24889', '24756', '25639', '25302', '26366', '25049', '26341', '26302', '25856', '24863', '25611']
sparseEdgeList = [{"target": "26065", "value": 1, "source": "26081"}, {"target": "25636", "value": 1, "source": "26065"}, {"target": "25679", "value": 1, "source": "25636"}, {"target": "24821", "value": 1, "source": "24738"}, {"target": "25165", "value": 1, "source": "24821"}, {"target": "25679", "value": 1, "source": "25165"}, {"target": "24821", "value": 1, "source": "24740"}, {"target": "25165", "value": 1, "source": "24821"}, {"target": "25679", "value": 1, "source": "25165"}, {"target": "25612", "value": 1, "source": "24881"}, {"target": "25836", "value": 1, "source": "25612"}, {"target": "25679", "value": 1, "source": "25836"}, {"target": "24821", "value": 1, "source": "24808"}, {"target": "25165", "value": 1, "source": "24821"}, {"target": "25679", "value": 1, "source": "25165"}, {"target": "26436", "value": 1, "source": "25809"}, {"target": "25802", "value": 1, "source": "26436"}, {"target": "25679", "value": 1, "source": "25802"}, {"target": "25839", "value": 1, "source": "25009"}, {"target": "25679", "value": 1, "source": "25839"}, {"target": "24820", "value": 1, "source": "24738"}, {"target": "24889", "value": 1, "source": "24820"}, {"target": "24756", "value": 1, "source": "24889"}, {"target": "25639", "value": 1, "source": "24756"}, {"target": "25636", "value": 1, "source": "25639"}, {"target": "25679", "value": 1, "source": "25636"}, {"target": "26366", "value": 1, "source": "25302"}, {"target": "25836", "value": 1, "source": "26366"}, {"target": "25679", "value": 1, "source": "25836"}, {"target": "26341", "value": 1, "source": "25049"}, {"target": "25836", "value": 1, "source": "26341"}, {"target": "25679", "value": 1, "source": "25836"}, {"target": "25856", "value": 1, "source": "26302"}, {"target": "25679", "value": 1, "source": "25856"}, {"target": "25611", "value": 1, "source": "24863"}, {"target": "25636", "value": 1, "source": "25611"}, {"target": "25679", "value": 1, "source": "25636"}]

with open('26/adjacency_list.json') as f:
    data = json.load(f)
    # pprint(data)
    get_cluster(listParents, data, sparseEdgeList)