import urllib.request as request
from lxml.html import fromstring, tostring
import json, time, os

def fetch_data(input_str, outFile):
    data = []
    with request.urlopen('http://dev-cds.cs.rutgers.edu/webapp/protein_data/get_meta?id=' + input_str) as response:
        response = json.loads(response.read())
        # print(json.loads(response))
        if response['success'] == 'Yes':
            data = response['data']
    protein_list = []
    for val in data:
        protein_list.append(val[1])
    # print(data)

    # input_str = '4usz.VO4_A_1447_oxidoreductase_1.11.1.8 1vnh.VO4_A_610_haloperoxidase_1.11.1.10 1vnf.VO4_A_610_haloperoxidase_1.11.1.10 1vni.VO4_A_610_haloperoxidase_1.11.1.10 1vng.VO4_A_610_haloperoxidase_1.11.1.10 1vnc.VO4_A_610_oxidoreductase_1.11.1.10 1vne.VO4_A_610_haloperoxidase_1.11.1.10 1idu.VO4_A_1579_oxidoreductase_1.11.1.10 2hy3.VO4_B_159_hydrolase_3.1.3.48 1idq.VO4_A_1578_oxidoreductase_1.11.1.10'

    toFilename = 'output.txt'
    counter = 1
    # protein_list = input_str.split(' ')
    with open(outFile, "w+") as out_file:
            # out_file.write(json.dumps(adj_list))
        for protein in protein_list:
            protein_name = protein.split('.')[0]
            # print(protein_name)
            # if counter % 100 == 0:
            #     print('Waiting....')
            #     time.sleep(60)
            #     counter += 1
            with request.urlopen('https://www.rcsb.org/structure/' + protein_name) as response:
                html = response.read()
                doc = fromstring(html)
                out_file.write(protein_name + '\n')
                try:
                    desc = doc[1][2][3][0][0][1][2][0].text
                    out_file.write(desc + '\n\n')
                    classification = doc[1][2][3][0][0][1][4][0][0][0].text
                    out_file.write('Classification: ' + classification + '\n')
                    organism = doc[1][2][3][0][0][1][4][1][1].text
                    out_file.write('Organism(s): ' + organism + '\n')
                    es = doc[1][2][3][0][0][1][4][2][1].text
                    # print(es)
                    if es:
                        out_file.write('Expression System: ' + es + '\n')
                except IndexError:
                    pass
                out_file.write('-----------------------------------\n\n')
                # counter += 1

directory = 'Cluster_148'
for filename in os.listdir(directory):
    if filename.endswith(".txt"): 
        out = open(os.path.join(directory, filename), 'r').read()
        fetch_data(out, os.path.join(directory, filename)[:-4] + '_out.txt')
        print('File written: ' + os.path.join(directory, filename)[:-4] + '_out.txt')
        # print(os.path.join(directory, filename))
        # continue
    else:
        continue