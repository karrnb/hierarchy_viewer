import xmltodict, json, os
import matplotlib.pyplot as plt

path = '../data/protein2/'

#[256, 512, 1024, 2048, 4096, 8192, 16384, 32768]
BUCKET_SIZE = 4096

BUCKET_OBJ = {}

def generate_image():
    for key, value in BUCKET_OBJ.items():
        # if key == '11':
        for bucket_id, bucket in enumerate(value):
            total_edges = 0
            total_vertices = 0
            x_pos = []
            y_pos = []
            for comp in bucket:
                if 'small' in comp['@file']:
                    SMALL = True
                else:
                    SMALL = False
                print(json.dumps(comp))
                total_edges += int(comp['@num_edges'])
                total_vertices += int(comp['@num_nodes'])
            for comp in bucket:
                plt.bar(int(comp['@num_nodes'])/total_vertices, int(comp['@num_edges'])/total_edges)
                x_pos.append(int(comp['@num_edges'])/total_edges)
                y_pos.append(int(comp['@num_nodes'])/total_vertices)

            print(x_pos, y_pos)
            plt.axis('off')
            plt.tick_params(axis='both', left='off', top='off', right='off', bottom='off', labelleft='off', labeltop='off', labelright='off', labelbottom='off')
            # plt.xticks([])
            # plt.yticks([])
            # y_pos is vertices, x_pos is edges
            # plt.bar(y_pos, x_pos)
            # plt.savefig('foo.png')
            if SMALL:
                plt.savefig(path + 'small/' + key + '_bucket_' + str(bucket_id) + '.png', dpi=100, bbox_inches='tight', pad_inches=0.0)
            else:
                plt.savefig(path + key + '/bucket_' + str(bucket_id) + '.png', dpi=100, bbox_inches='tight', pad_inches=0.0)
            plt.clf()
            # plt.show()
            # plt.savefig('bucket_' + str(bucket_id) + '.png')
            # plt.savefig('bucket_' + str(bucket_id) + '.png', dpi=100, bbox_inches='tight', pad_inches=0.0)


        # print(json.dumps(value))

def convertBucketJson(layer, buckets):
    for bucket_id, bucket in enumerate(buckets):

        toFilename = path + layer + '/bucket_' + str(bucket_id) + '_adjacency_list.json'
        adj_list = {}
        for comp in bucket:
            print(json.dumps(comp))
            filename = path + comp['@file']
            if '@start_line' in comp:
                start = comp['@start_line']
            else:
                toFilename = path + 'small/layer_'+ layer + '_bucket_' + str(bucket_id) + '_adjacency_list.json'
                start = 1
            count = comp['@num_edges']
            index = 1
            # filename = './BCC_' + str(index) + '.csv'
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

                            # if nodes[1] not in adj_list:
                            #     adj_list[nodes[1]] = []

                            # adj_list[nodes[1]].append({nodes[0]:'6'})
                    counter += 1

        # out_file_path = "./BCC_" + str(index) + "_adjacency_list.json"
        with open(toFilename, "w+") as out_file:
            out_file.write(json.dumps(adj_list))
        print('Written to file: ' + str(toFilename))

def add_into_bucket(data):
    BUCKET = []
    bucket_temp = []
    count = 0

    for ind, comp in enumerate(data):
        if int(comp['@num_edges']) > BUCKET_SIZE:
            BUCKET.append([comp])
        else:
            count += int(comp['@num_edges'])
            if count < BUCKET_SIZE:
                bucket_temp.append(comp)
                # print(ind)
                if ind == len(data) - 1:
                    BUCKET.append(bucket_temp)
            else:
                BUCKET.append(bucket_temp)
                count = int(comp['@num_edges'])
                bucket_temp = []
                bucket_temp.append(comp)
    return BUCKET

def generate_bucket(layer, data):
    nodes = 0
    if 'CC' in data:
        if isinstance(data['CC'], list):
            data['CC'].sort(key=lambda x: x['@num_nodes'])
            for cc in data['CC']:
                if 'BCC' in cc:
                    if isinstance(cc['BCC'], list):
                        cc['BCC'].sort(key=lambda x: x['@num_nodes'])
                # print(json.dumps(cc))
                nodes += int(cc['@num_nodes'])

    inner_bucket = []
    total_edges = 0
    if 'CC' in data:
        if isinstance(data['CC'], list):
            for cc in data['CC']:
                if 'BCC' in cc:
                    if isinstance(cc['BCC'], list):
                        for bcc in cc['BCC']:
                            bcc['@cc_id'] = cc['@cc_id']
                            inner_bucket.append(bcc)
                            # total_edges += bcc['@num_edges']
                    else:
                        bcc = cc['BCC']
                        bcc['@cc_id'] = cc['@cc_id']
                        inner_bucket.append(bcc)
                else:
                    inner_bucket.append(cc)
        else:
            cc = data['CC']
            cc_id = cc['@cc_id']
            if 'BCC' in cc:
                    if isinstance(cc['BCC'], list):
                        for bcc in cc['BCC']:
                            bcc['@cc_id'] = cc_id 
                            inner_bucket.append(bcc)
                            # total_edges += bcc['@num_edges']
                    else:
                        bcc = cc['BCC']
                        bcc['@cc_id'] = cc_id 
                        inner_bucket.append(bcc)
            else:
                inner_bucket.append(data['CC'])
    else:
        inner_bucket.append(data)                    

    bucket = add_into_bucket(inner_bucket)
    # convertBucketJson(layer, bucket)
    BUCKET_OBJ[layer] = bucket

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
                    generate_bucket(layer, cc)
            else:
                # print(folder)
                filename = path + str(folder) + '/CC_BCC_index.xml'
                with open(filename, 'r') as myfile:
                    data = myfile.read()
                # output = json.dumps(xmltodict.parse(data))
                output = xmltodict.parse(data)
                out_obj[folder] = output['root']
                generate_bucket(folder, output['root'])

# print(json.dumps(BUCKET_OBJ))
generate_image()

# print(json.dumps(out_obj))
'''
with open(path + 'output_list.json', 'w+') as f:
    f.write(json.dumps(out_obj))
'''