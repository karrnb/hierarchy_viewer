import urllib.request as request
from lxml.html import fromstring, tostring
import json, time
from statistics import stdev, mean 
import matplotlib.pyplot as plt
import numpy as np

def count_occur(protein_list):
    part_seq = [[], [], [], [], [], [], [], [], []]
    for protein in protein_list:
        parts = protein.split('.')
        mid_parts = parts[1].split('_')
        part_seq[0].append(parts[0])
        part_seq[1].append(mid_parts[0])
        part_seq[2].append(mid_parts[1])
        part_seq[3].append(mid_parts[2])
        part_seq[4].append(mid_parts[3])
        part_seq[5].append(mid_parts[4])
        part_seq[6].append(parts[2])
        part_seq[7].append(parts[3])
        part_seq[8].append(parts[4])

    desc = ''
    x = np.array([1,2,3,4,5,6,7,8,9])
    y = []
    err = []
    # print(part)
    for seq in part_seq:
        totalCount = len(seq)
        count = word_count(seq)    
        maxCount = max(count, key=count.get)
        if len(count) > 1:
            # print('mean: ' + str(mean(list(count.values()))))
            y.append(mean(list(count.values())))
            err.append(stdev(list(count.values())))
            # print('standard dev: ' + str(stdev(list(count.values()))))
        else:
            y.append(0)
            err.append(0)

        # stdDev = stdev(list(count.values()))
        occur = round(float(count[maxCount])*100/totalCount)
        desc += maxCount+'_'+str(occur)+'.'
        # print(maxCount, round(float(count[maxCount])*100/totalCount))
    plt.errorbar(x, y, err, linestyle='-', marker='^')
    plt.show()

    return desc

def word_count(protein_part):
    counts = dict()

    for part in protein_part:
        if part in counts:
            counts[part] += 1
        else:
            counts[part] = 1

    return counts
'''
data = []
with request.urlopen('http://dev-cds.cs.rutgers.edu/webapp/protein_data/get_meta?id=' + input_str) as response:
    response = json.loads(response.read())
    if response['success'] == 'Yes':
        data = response['data']
protein_list = []
for val in data:
    protein_list.append(val[1])
'''
component1 = ['2r4x.HEM_B_147_oxygenbinding_2.4.1.21', '2z47.HEM_B_3001_electrontransport_4.2.2.3', '1j0o.HEM_A_1001_electrontransport_4.2.2.12', '4u9d.HEM_B_201_metalbindingprotein_2.7.11.1', '4rkm.HEM_E_806_unknownfunction_3.1.31.1', '3mdt.HEM_A_505_oxidoreductase_1.14.13.98', '4u9d.HEM_A_201_metalbindingprotein_2.7.11.1', '4il6.HEM_F_101_electrontransport_1.10.3.9', '2vr0.HEM_A_1005_oxidoreductase_1.7.2.2', '2r4y.HEM_B_147_oxygenbinding_2.4.1.21', '3mdm.HEM_A_505_oxidoreductase_1.14.13.98', '19hc.HEM_A_307_electrontransport_2.5.1.18', '3hhb.HEM_D_148_oxygentransport_3.4.22.15', '1gli.HEM_D_147_oxygentransport_3.2.1.73', '1y0t.HEM_D_147_transportprotein_1.3.99.1', '1y85.HEM_D_147_transportprotein_4.2.1.1', '2hhe.HEM_D_147_oxygentransport_2.4.1.-', '1y45.HEM_D_147_transportprotein_3.1.26.11', '1a3n.HEM_D_147_oxygentransport_3.2.1.4', '4hhb.HEM_D_148_oxygentransport_4.2.1.2', '1y0w.HEM_D_147_transportprotein_4.6.1.1', '1xz2.HEM_D_147_transportprotein_3.2.1.8', '1y2z.HEM_D_147_transportprotein_6.1.1.3', '1y22.HEM_D_147_transportprotein_2.7.7.6', '2hhb.HEM_D_148_oxygentransport_3.4.14.5', '1bab.HEM_D_147_oxygentransport_1.15.1.1']
component2 = ['1ux9.HEM_B_1172_oxygentransport_3.5.4.5', '4y8w.HEM_C_602_oxidoreductase_3.4.25.1', '2yoo.HEM_C_1402_oxidoreductase_3.4.21.91', '4n4n.HEM_C_604_oxidoreductase_1.7.2.6', '4hi4.HEM_D_301_signalingprotein_3.4.22.-', '3w4u.HEM_E_201_oxygentransport_3.2.1.14', '4y8w.HEM_B_602_oxidoreductase_3.4.25.1', '3zcy.HEM_A_251_oxidoreductase_1.11.1.11', '3qje.HEM_C_142_oxygentransport_4.1.1.48', '2nox.HEM_G_500_oxidoreductase_1.13.11.11', '3foo.HEM_F_150_electrontransport_5.99.1.-', '3foo.HEM_D_150_electrontransport_5.99.1.-', '3foo.HEM_G_150_electrontransport_5.99.1.-', '3foo.HEM_H_150_electrontransport_5.99.1.-', '3fop.HEM_B_150_electrontransport_5.99.1.-', '3foo.HEM_B_150_electrontransport_5.99.1.-', '3foo.HEM_L_150_electrontransport_5.99.1.-', '3foo.HEM_K_150_electrontransport_5.99.1.-', '3fop.HEM_A_150_electrontransport_5.99.1.-', '3foo.HEM_E_150_electrontransport_5.99.1.-']
component3 = ['2fbw.SF4_B_1003_oxidoreductase_1.3.5.1', '3aef.SF4_B_303_oxidoreductase_1.3.5.1', '1zp0.SF4_B_303_oxidoreductase_1.3.5.1', '2wqy.SF4_O_1003_oxidoreductase_1.3.5.1', '1zoy.SF4_B_303_oxidoreductase_1.3.5.1', '1yq3.SF4_B_1003_oxidoreductase_1.3.5.1', '2fbw.SF4_O_1003_oxidoreductase_1.3.5.1', '2wqy.SF4_B_1003_oxidoreductase_1.3.5.1', '2h89.SF4_B_1003_oxidoreductase_1.3.5.1', '1yq4.SF4_B_1003_oxidoreductase_1.3.5.1', '4z3w.SF4_G_1003_oxidoreductase_2.7.10.2', '5byq.SF4_A_601_oxidoreductase_1.12.7.2', '5bys.SF4_A_601_oxidoreductase_1.12.7.2', '2fb2.SF4_B_402_ligandbindingprotein_6.3.2.-', '4xdc.SF4_A_602_oxidoreductase_1.12.7.2', '4z3z.SF4_G_1003_oxidoreductase_2.7.10.2', '4z3z.SF4_E_1003_oxidoreductase_2.7.10.2', '4z3y.SF4_E_1003_oxidoreductase_2.7.10.2', '4xdd.SF4_A_601_oxidoreductase_1.12.7.2', '4z40.SF4_E_1003_oxidoreductase_2.7.10.2', '5bys.SF4_B_601_oxidoreductase_1.12.7.2']
component4 = ['3sbr.CUA_A_701_oxidoreductase_1.7.99.6', '3sbr.CUA_C_701_oxidoreductase_1.7.99.6', '3s3c.CUA_B_802_oxidoreductase_1.9.3.1', '3bvd.CUA_B_802_oxidoreductase_1.9.3.1', '3sbp.CUA_C_701_oxidoreductase_1.7.99.6', '3s33.CUA_B_802_oxidoreductase_1.9.3.1', '3s3a.CUA_B_802_oxidoreductase_1.9.3.1', '3sbp.CUA_G_701_oxidoreductase_1.7.99.6', '3sbr.CUA_G_701_oxidoreductase_1.7.99.6', '3qju.CUA_B_802_oxidoreductase_1.9.3.1', '2qpe.CUA_B_802_oxidoreductase_1.9.3.1', '3s38.CUA_B_802_oxidoreductase_1.9.3.1', '1cyx.CUA_A_316_electrontransport_1.10.3.-', '2yev.CUA_E_585_electrontransport_1.9.3.1', '1fwx.CUA_B_4701_oxidoreductase_1.7.99.6', '1qni.CUA_F_701_oxidoreductase_5.2.1.8', '1qni.CUA_D_701_oxidoreductase_5.2.1.8', '1fwx.CUA_D_4701_oxidoreductase_1.7.99.6', '3sbq.CUA_A_701_oxidoreductase_1.7.99.6', '1fwx.CUA_A_4701_oxidoreductase_1.7.99.6', '2yev.CUA_B_585_electrontransport_1.9.3.1', '1qni.CUA_B_701_oxidoreductase_5.2.1.8']
component5 = ['5byr.SF4_A_602_oxidoreductase_1.12.7.2', '4xdc.SF4_B_603_oxidoreductase_1.12.7.2', '4xdd.SF4_A_602_oxidoreductase_1.12.7.2', '5byq.SF4_B_602_oxidoreductase_1.12.7.2', '4xdc.SF4_A_603_oxidoreductase_1.12.7.2', '5byr.SF4_B_602_oxidoreductase_1.12.7.2', '5byq.SF4_A_602_oxidoreductase_1.12.7.2', '5bys.SF4_B_602_oxidoreductase_1.12.7.2', '5bys.SF4_A_602_oxidoreductase_1.12.7.2', '4xdd.SF4_B_602_oxidoreductase_1.12.7.2', '1gph.SF4_2_466_transferase_2.4.2.14', '2fug.SF4_3_784_oxidoreductase_1.6.99.5', '1gph.SF4_1_466_transferase_2.4.2.14', '1gph.SF4_3_466_transferase_2.4.2.14', '4s2a.SF4_A_700_lyase_4.1.99.17', '1m34.SF4_G_3290_oxidoreductase_1.18.6.1', '3hip.SF4_B_190_electrontransfer_3.2.2.22', '3lgb.SF4_A_514_transferase_2.7.7.-', '1ao0.SF4_D_466_tglutamineamidotransferase_2.4.2.14', '2fug.SF4_L_784_oxidoreductase_1.6.99.5']
component6 = ['1y4b.HEM_B_147_transportprotein_3.4.21.62', '1y09.HEM_B_147_transportprotein_1.15.1.2', '1y22.HEM_B_147_transportprotein_2.7.7.6', '1y46.HEM_B_147_transportprotein_3.1.26.11', '1hdb.HEM_B_148_oxygentransport_3.4.16.4', '1gbv.HEM_B_147_oxygentransport_3.4.21.4', '1y4r.HEM_B_147_transportprotein_3.1.1.4', '1y35.HEM_B_147_transportprotein_3.4.21.62', '1y0w.HEM_B_147_transportprotein_4.6.1.1', '1y45.HEM_B_147_transportprotein_3.1.26.11', '1y7z.HEM_B_147_transportprotein_4.2.1.1', '4rui.HEM_A_502_oxidoreductase_1.14.13.-', '1z10.HEM_D_500_oxidoreductase_1.14.14.1', '1z11.HEM_A_500_oxidoreductase_1.14.14.1', '4o6t.HEM_A_202_hemebindingprotein_2.7.12.1', '3tyw.HEM_C_501_oxidoreductase_2.7.7.48', '2wx2.HEM_B_1450_oxidoreductase_1.14.13.70', '3t3q.HEM_C_500_oxidoreductase_1.14.14.1', '3tyw.HEM_D_501_oxidoreductase_2.7.7.48', '4c9p.HEM_B_422_oxidoreductase_6.3.2.-', '4hgj.HEM_A_501_oxidoreductase_1.14.14.1', '1m1p.HEM_C_804_electrontransport_2.3.1.9']
component7 = ['4gp5.CU_A_601_oxidoreductase_1.9.3.1', '3s8f.CU_A_803_oxidoreductase_1.9.3.1', '4faa.CU_A_601_oxidoreductase_1.9.3.1', '4n4y.CU_A_601_oxidoreductase_1.9.3.1', '4g7q.CU_A_601_oxidoreductase_1.9.3.1', '4fa7.CU_A_601_oxidoreductase_1.9.3.1', '3bvd.CU_A_803_oxidoreductase_1.9.3.1', '4g70.CU_A_603_oxidoreductase_1.9.3.1', '4gp4.CU_A_601_oxidoreductase_1.9.3.1', '4gp8.CU_A_601_oxidoreductase_1.9.3.1', '3s38.CU_A_803_oxidoreductase_1.9.3.1', '1ehk.CU_A_803_oxidoreductase_1.9.3.1', '4g7r.CU_A_601_oxidoreductase_1.9.3.1', '4g7s.CU_A_601_oxidoreductase_1.9.3.1', '3s8g.CU_A_803_oxidoreductase_1.9.3.1', '4zk8.CU_A_410_oxidoreductase_2.7.11.1', '4jhu.CU_A_516_oxidoreductase_1.14.11.33', '4a2f.CU_A_1519_oxidoreductase_1.10.3.2', '2qxj.CU_A_600_hydrolase_3.4.21.117', '2c11.CU_C_1744_oxidoreductase_1.4.3.6', '3x1e.CU_A_408_oxidoreductase_3.6.5.-', '3n7d.CU_A_75_metalbindingprotein_3.1.21.4', '2c11.CU_B_1747_oxidoreductase_1.4.3.6', '4ef3.CU_A_1004_metalbindingprotein_5.3.4.1', '3n7e.CU_A_75_metalbindingprotein_3.1.21.4', '4hak.CU_A_1004_metalbindingprotein_3.3.2.10', '3re7.CU_V_185_oxidoreductase_1.16.3.1']

# protein_list = ['1gph.SF4_2_466_transferase_2.4.2.14', '2fug.SF4_3_784_oxidoreductase_1.6.99.5', '1gph.SF4_1_466_transferase_2.4.2.14', '1gph.SF4_3_466_transferase_2.4.2.14', '4s2a.SF4_A_700_lyase_4.1.99.17', '1m34.SF4_G_3290_oxidoreductase_1.18.6.1', '3hip.SF4_B_190_electrontransfer_3.2.2.22', '3lgb.SF4_A_514_transferase_2.7.7.-', '1ao0.SF4_D_466_tglutamineamidotransferase_2.4.2.14', '2fug.SF4_L_784_oxidoreductase_1.6.99.5', '5byr.SF4_A_602_oxidoreductase_1.12.7.2', '4xdc.SF4_B_603_oxidoreductase_1.12.7.2', '4xdd.SF4_A_602_oxidoreductase_1.12.7.2', '5byq.SF4_B_602_oxidoreductase_1.12.7.2', '4xdc.SF4_A_603_oxidoreductase_1.12.7.2', '5byr.SF4_B_602_oxidoreductase_1.12.7.2', '5byq.SF4_A_602_oxidoreductase_1.12.7.2', '5bys.SF4_B_602_oxidoreductase_1.12.7.2', '5bys.SF4_A_602_oxidoreductase_1.12.7.2', '4xdd.SF4_B_602_oxidoreductase_1.12.7.2']
name = count_occur(component7)
print(name)