import xmltodict, json

path = 'data/protein/small/'

filename = path + 'cc_small.xml'

def convertJson(filename, toFilename):
    index = 1
    # filename = './BCC_' + str(index) + '.csv'
    adj_list = {}
    with open(filename, 'r') as edge_list:
        for edge in edge_list:
            nodes = edge.strip().split(',')
            if nodes[0] not in adj_list:
                adj_list[nodes[0]] = []

            adj_list[nodes[0]].append({nodes[1]:'6'})

            if nodes[1] not in adj_list:
                adj_list[nodes[1]] = []

            adj_list[nodes[1]].append({nodes[0]:'6'})

    # out_file_path = "./BCC_" + str(index) + "_adjacency_list.json"
    with open(toFilename, "w+") as out_file:
        out_file.write(json.dumps(adj_list))

with open(filename, 'r') as myfile:
    data = myfile.read()

# print(data)


output = xmltodict.parse(data)
print(json.dumps(output))
with open(path + 'cc_small.json', 'w+') as f:
    f.write(json.dumps(output))

'''
hierarchyJson = json.loads(json.dumps(output))
# print(hierarchyJson['root'])
for cc in hierarchyJson['root']['CC']:
    file = 'data/protein' + cc['@file'][1:]
    fileTo = file[:-4] + '_adjacency_list.json'
    # convertJson(str(file), str(fileTo))
    # print(fileTo)
'''