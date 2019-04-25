import xmltodict, json, os
import matplotlib.pyplot as plt

path = '../data/protein2/'

folders = os.listdir(path)
out_obj = {}
meta_file = []

def calculate_details(layer, component):
    layer_nodes = 0
    layer_edges = 0
    components = []
    if 'CC' in component:
        if isinstance(component['CC'], list):
            # logic for list of components
            for cc in component['CC']:
                layer_edges += int(cc['@num_edges'])
                layer_nodes += int(cc['@num_nodes'])
                components.append('cc_' + str(cc['@cc_id']))
                if 'BCC' in cc:
                    if isinstance(cc['BCC'], list):
                        for bcc in cc['BCC']:
                            components.append('cc_' + str(cc['@cc_id']) + '_bcc_' + str(bcc['@bcc_id']))
                    else:
                        bcc = cc['BCC']
                        components.append('cc_' + str(cc['@cc_id']) + '_bcc_' + str(bcc['@bcc_id']))
        else:
            cc = component['CC']
            layer_edges += int(cc['@num_edges'])
            layer_nodes += int(cc['@num_nodes'])
            components.append('cc_' + str(cc['@cc_id']))
            if 'BCC' in cc:
                if isinstance(cc['BCC'], list):
                    for bcc in cc['BCC']:
                        components.append('cc_' + str(cc['@cc_id']) + '_bcc_' + str(bcc['@bcc_id']))
                else:
                    bcc = cc['BCC']
                    components.append('cc_' + str(cc['@cc_id']) + '_bcc_' + str(bcc['@bcc_id']))
            # logic for a single component
    else:
        cc = component
        layer_edges += int(cc['@num_edges'])
        layer_nodes += int(cc['@num_nodes'])
        # print(cc)
        # print('This should never happen')

    meta_file.append({'edges': layer_edges, 'nodes': layer_nodes, 'components': components, 'layer': layer})
    # print('Layer: {}, Nodes: {}, Edges: {}'.format(layer, layer_nodes, layer_edges))

for folder in folders:
    if 'py' not in str(folder):
        if 'json' not in str(folder):
            if str(folder) == 'small':
                filename = path + str(folder) + '/cc_small.xml'
                with open(filename, 'r') as myfile:
                    data = myfile.read()
                output = xmltodict.parse(data)
                for cc in output['root']['CC']:
                    layer = cc['@file'][14:-4]
                    out_obj[layer] = cc
                    # print(json.dumps(cc))
                    calculate_details(layer, cc)
            else:
                # print(folder)
                filename = path + str(folder) + '/CC_BCC_index.xml'
                with open(filename, 'r') as myfile:
                    data = myfile.read()
                # output = json.dumps(xmltodict.parse(data))
                output = xmltodict.parse(data)
                out_obj[folder] = output['root']
                # print(json.dumps(output['root']))
                calculate_details(folder, output['root'])

# for meta in meta_file:
#     print(meta)
# print(meta_file.sort(key=lambda x: x.nodes))

# stored_by_value = sorted(meta_file.items(), key=lambda kv: kv[1]['edges'])
stored_by_value = sorted(meta_file, key=lambda k: k['edges']) 

print(stored_by_value)