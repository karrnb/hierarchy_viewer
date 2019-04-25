import xmltodict, json, os

path = '../data/protein_test/'

def convertJson(filename, toFilename, start, count):
    index = 1
    # filename = './BCC_' + str(index) + '.csv'
    adj_list = {}
    with open(filename, 'r') as file:
        fileContent = file.read()
        edge_list = fileContent.split('\n')
        counter = 1
        for edge in edge_list:
            # print(edge)
            if len(edge) > 1:
                if ',' in edge:
                    nodes = edge.strip().split(',')
                else:
                    nodes = edge.strip().split(' ')

                if (counter >= int(start)) and (counter <= int(count)):
                    if nodes[0] not in adj_list:
                        adj_list[nodes[0]] = []

                    adj_list[nodes[0]].append({nodes[1]:'6'})

                    if nodes[1] not in adj_list:
                        adj_list[nodes[1]] = []

                    adj_list[nodes[1]].append({nodes[0]:'6'})
            counter += 1

    # out_file_path = "./BCC_" + str(index) + "_adjacency_list.json"
    with open(toFilename, "w+") as out_file:
        out_file.write(json.dumps(adj_list))
    print('Written to file: ' + str(toFilename))

def generate_file(layer, data):
    print('Generating json for layer ' + str(layer))
    # if cc exists small differentiator
    if 'CC' in data:
        # single cc or list of cc
        if isinstance(data['CC'], list):
            # for each cc
            for cc in data['CC']:
                # if each cc has bcc
                if 'BCC' in cc:
                    # if bcc is more than one
                    if isinstance(cc['BCC'], list):
                        for bcc in cc['BCC']:
                            toFilename = path + layer + '/cc_' + cc['@cc_id'] + '_bcc_' + str(bcc['@bcc_id']) + '_adjacency_list.json'
                            filename = path + str(bcc['@file'])
                            convertJson(filename, toFilename, bcc['@start_line'], bcc['@num_edges'])
                    else:
                        toFilename = path + layer + '/cc_' + cc['@cc_id'] + '_bcc_' + str(cc['BCC']['@bcc_id']) + '_adjacency_list.json'
                        filename = path + str(cc['BCC']['@file'])
                        convertJson(filename, toFilename, cc['BCC']['@start_line'], cc['BCC']['@num_edges'])
                # if cc doesn't have bcc
                else:
                    toFilename = path + layer + '/cc_' + str(cc['@cc_id']) + '_adjacency_list.json'
                    filename = path + str(cc['@file'])
                    convertJson(filename, toFilename, cc['@start_line'], cc['@num_edges'])
        # if single cc
        else:
            # if cc has bcc
            if 'BCC' in data['CC']:
                # if bcc is more than one
                if isinstance(data['CC']['BCC'], list):
                    for bcc in data['CC']['BCC']:
                        toFilename = path + layer + '/cc_' + data['CC']['@cc_id'] + '_bcc_' + str(bcc['@bcc_id']) + '_adjacency_list.json'
                        filename = path + str(bcc['@file'])
                        convertJson(filename, toFilename, bcc['@start_line'], bcc['@num_edges'])
                else:
                    toFilename = path + layer + '/cc_' + data['CC']['@cc_id'] + '_bcc_' + str(data['CC']['BCC']['@bcc_id']) + '_adjacency_list.json'
                    filename = path + str(data['CC']['BCC']['@file'])
                    convertJson(filename, toFilename, data['CC']['BCC']['@start_line'], data['CC']['BCC']['@num_edges'])
            # if cc doesn't have bcc
            else:
                toFilename = path + layer + '/cc_' + str(data['CC']['@cc_id']) + '_adjacency_list.json'
                filename = path + str(data['CC']['@file'])
                convertJson(filename, toFilename, data['CC']['@start_line'], data['CC']['@num_edges'])
    # for small subgraphs
    else:
        toFilename = path + 'small/layer_' + str(layer) + '_adjacency_list.json'
        filename = path + data['@file'][1:]
        convertJson(filename, toFilename, 1, data['@num_edges'])


folders = os.listdir(path)

out_obj = {}

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
                    # generate_bucket(layer, cc)
            else:
                filename = path + str(folder) + '/CC_BCC_index.xml'
                with open(filename, 'r') as myfile:
                    data = myfile.read()
                output = xmltodict.parse(data)
                out_obj[folder] = output['root']
                generate_file(folder, output['root'])
                # generate_bucket(folder, output['root'])

# print(json.dumps(out_obj))

# with open(path + 'output_list.json', 'w+') as f:
#     f.write(json.dumps(out_obj))

# with open(path + 'bucketing.json', 'w+') as f:
#     f.write(json.dumps(BUCKET_OBJ))