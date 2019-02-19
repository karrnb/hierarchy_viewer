import xmltodict, json, os

path = '../data/protein2/'

#[256, 512, 1024, 2048, 4096, 8192, 16384, 32768]
BUCKET_SIZE = 4096

BUCKET_OBJ = {}

def add_into_bucket(data):
    print(json.dumps(data))
    BUCKET = []
    bucket_temp = []
    count = 0
    # if len(data) > 1:
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
    # else:
    #     BUCKET.append(data)
    
    return BUCKET

def generate_bucket(layer, data):
    print(layer)
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
    BUCKET_OBJ[layer] = bucket
    # print(json.dumps(inner_bucket))
    # print('\n')

folders = os.listdir(path)

out_obj = {}

for folder in folders:
    if 'py' not in str(folder):
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

print(json.dumps(BUCKET_OBJ))

# print(json.dumps(out_obj))
'''
with open(path + 'output_list.json', 'w+') as f:
    f.write(json.dumps(out_obj))
'''