import networkx as nx
import matplotlib.pyplot as plt
from shutil import copyfile
import json, math, csv, os
from graph_tool.all import *
import xml.etree.cElementTree as ET
from datetime import datetime

EDGE_LIMIT = 150


def get_all_edges(C):
    edge_list = []

    for e in C.edges.data():
        edge_list.append((e[0], e[1]))

    return edge_list


def get_connected_component_subgraphs(C):
    sub_graph = {}
    sub_graph['biconnected_components'] = []

    edge_list = []
    # print(C.edges.data())
    for e in C.edges.data():
        edge_list.append((e[0], e[1]))

    sub_graph['edges'] = edge_list

    for bc in nx.biconnected_component_subgraphs(C):
        sub_graph['biconnected_components'].append(get_all_edges(bc))

    return sub_graph


def get_biconnected_component_subgraphs(C):
    sub_graph = {}

    edge_list = []

    for e in C.edges.data():
        edge_list.append((e[0], e[1]))

    sub_graph['edges'] = edge_list

    return sub_graph


# def shares_articulation_point(G1, G2):
#     for n1 in G1.nodes.data():
#         if(G2.has_node(n1) == True):
#             return True
#
#     return False


def get_bcc_tree(BCC):
    tree = []

    for idx1, bcc1 in enumerate(BCC):
        for idx2, bcc2 in enumerate(BCC):
            if(idx1 <= idx2):
                continue

            for n1 in list(bcc1.nodes):
                if (bcc2.has_node (n1) == True):
                    tree.append([idx1, idx2])
    return tree

def generate_graph(layer):
    filename = '../csv/layer_' + str(layer['peel']) + '.csv'
    g = graph_tool.load_graph_from_csv(filename)
    return g

def generate_csv(layer):
    data_path = '../../data/protein/protein-layer-' + str(layer['peel']) + '.json'
    csv_path = '../csv/layer_' + str(layer['peel']) + '.csv'
    print('Writing to file: ' + csv_path)
    with open(csv_path, 'w') as csvfile:
        filewriter = csv.writer(csvfile, quoting=csv.QUOTE_MINIMAL)
        with open(data_path) as f1:
            data = json.load(f1)
            for edge in data['links']:
                # edge_list = [edge['source'], edge['target']]
                # print(edge['source'], edge['target'])
                # filewriter.writerow([str(edge['source']).encode(), str(edge['target']).encode()])
                filewriter.writerow([edge['source'], edge['target']])



if __name__ == '__main__':

    # str(layer)s = '12'
    LIMIT = pow(2, 11)
    with open('../../data/protein/protein.json') as f:
        data = json.load(f)
        layers = data['peels']
        #layers = ['3','13']
        root_small = ET.Element('root')
        for layer in layers:
            print('Generating files for layer: ' + str(layer))
            inputfile = '../csv/protein/layer_'+str(layer)+'.csv'

            bcc_index = 1
            cc_index = 1
            cc_bcc_index = 1

            # cur_dir = './'
            # inputfile = cur_dir + 'test1.csv'
            # outputfile = inputfile.split('.')[0] + '_hierarchy.json'
            #
            # str(layer)_dict = dict()
            #
            G = nx.read_edgelist (inputfile, delimiter=',')
            G_CC = list(nx.connected_component_subgraphs(G, copy=False))


            if ((len(G.edges) < LIMIT) or ((len(G.edges)/len(G_CC)) < LIMIT) or ((len(G.nodes)/len(G_CC)) < LIMIT)):
                # os.makedirs ("./small", 493, exist_ok=True)
                try:
                    if not os.path.exists('small'):
                        os.mkdir('small')
                    copyfile(inputfile, "./small/layer_" + str(layer)+".csv")
                    file_name = './small/layer_' + str(layer)+ '.csv'
                    cc_small = ET.Element('CC', file = file_name, num_nodes = str(len(G.nodes)), num_edges = str(len(G.edges)))
                    root_small.append(cc_small)
                except OSError:
                    print("Creation of the directory failed")

            else:
                try:
                    if not os.path.exists(str(layer)):
                        os.mkdir(str(layer))
                except OSError:
                    print("Creation of the directory failed")
					
					
                root = ET.Element('root')
                cc_edges_written = 0
                bcc_edges_written = 0
                cc_bcc_edges_written = 0
                cc_file = str(layer)+"/CC_BCC_index.xml"
                #with open(str(layer)+"/CC_index", 'w') as cc_index_file:
                # with open (str(layer)+"/CC_BCC_index", 'w') as cc_bcc_index_file:
                filename = ""
                bcc_filename = ""
                cur_cc_edges = 0

                # cc_index_file.write("Number,FileName,EdgeStart,EdgeCount,NodeCount\n")
                # cc_bcc_index_file.write("BCC_index,FileName,EdgeStart,EdgeCount,NodeCount\n")

                for idx , comp in enumerate(G_CC):
                    cur_bcc_edges = 0
                    cur_cc_edges = len(comp.edges)
                    if( cur_cc_edges < EDGE_LIMIT):

                        if(cc_edges_written + cur_cc_edges > EDGE_LIMIT):
                            cc_index += 1
                            cc_edges_written = 0

                        filename = str(layer) + "/CC_" + str (cc_index) + '.csv'

                        if os.path.exists (filename):
                            append_write = 'a'
                        else:
                            append_write = 'w'

                        with open (filename, append_write) as cc_output_file:
                            for e in nx.generate_edgelist(comp, data=False):
                                cc_output_file.write (e + "\n")
                        cc = ET.Element('CC', file = filename, cc_id = str(idx), start_line = str(cc_edges_written + 1), num_edges = str(len(comp.edges)), num_nodes = str(len(comp.nodes)))
                        root.append(cc)
                        #cc_index_file.write (str (idx) + "," + filename + "," + str (cc_edges_written + 1) + "," + str (cur_cc_edges) + "," +str(len(comp.nodes))+"\n")
                        cc_edges_written += cur_cc_edges

                    else:
                        BCC = list (nx.biconnected_component_subgraphs (comp, copy=False))
                        cc = ET.Element('CC', cc_id=str(idx), num_edges = str(len(comp.edges)), num_nodes = str(len(comp.nodes)))

                        for idx2, bcc_comp in enumerate(BCC):
                            cur_bcc_edges = len(bcc_comp.edges)
                            bcc_filename = str(layer) + "/BCC_" + str(bcc_index) + '.csv'


                            if(bcc_edges_written + cur_bcc_edges > pow(2,7)):
                                bcc_index += 1
                                bcc_edges_written = 0

                            bcc = ET.Element('BCC', bcc_id = str(idx2), file = bcc_filename, start_line = str(bcc_edges_written + 1),
                                             num_edges = str(cur_bcc_edges), num_nodes = str(len(bcc_comp.nodes)))

                            cc.append(bcc)

                            if os.path.exists (bcc_filename):
                                append_write = 'a'
                            else:
                                append_write = 'w'

                            with open(bcc_filename, append_write) as bcc_output_file:
                                for e in nx.generate_edgelist(bcc_comp, data=False):
                                    bcc_output_file.write (e + "\n")

                            #cc_bcc_index_file.write(str(idx) + "_" + str(idx2) +","+bcc_filename+","+str(bcc_edges_written+1)+","+str(cur_bcc_edges)+ "," + str(len(bcc_comp.nodes))+"\n")
                            bcc_edges_written += cur_bcc_edges

                        root.append(cc)
                        #cc_index_file.write (str (idx) + "," + "CC_BCC_index" + "," + str (cc_bcc_edges_written + 1) + "," + str (len(BCC)) + "\n")
                        cc_bcc_edges_written += len (BCC)

                tree = ET.ElementTree(root)
                tree.write(cc_file)
                print('Generated files for layer: ' + str(layer))

        tree_small = ET.ElementTree(root_small)
        if not os.path.exists('small'):
            os.mkdir('small')
        tree_small.write('./small/cc_small.xml')



