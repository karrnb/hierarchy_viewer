# create an adjacency list for the graph server
import xmltodict, json, os
import matplotlib.pyplot as plt

path = '../data/protein_test/'

folders = os.listdir(path)

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
                    generate_file(layer, cc)

            else:
                filename = path + str(folder) + '/CC_BCC_index.xml'
                with open(filename, 'r') as myfile:
                    data = myfile.read()
                output = xmltodict.parse(data)
                out_obj[folder] = output['root']
                generate_file(folder, output['root'])