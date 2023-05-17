import matplotlib.pyplot as plt
import matplotlib as mpl
import numpy as np
import pandas as pd
import json
from scipy.interpolate import make_interp_spline

def renderPlot(df, xLabel, yLabel, chartName):
    xnew = np.linspace(df['x_values'].min(), df['x_values'].max(), 300) 
    y1_spl = make_interp_spline(df['x_values'], df['y1_values'], k=3)
    y1_smooth = y1_spl(xnew)

    y2_spl = make_interp_spline(df['x_values'], df['y2_values'], k=3)
    y2_smooth = y2_spl(xnew)

    y3_spl = make_interp_spline(df['x_values'], df['y3_values'], k=3)
    y3_smooth = y3_spl(xnew)
    # markersize=4
    # markerfacecolor='blue'
    plt.plot( df['x_values'], df['y1_values'],'o', color='skyblue')
    plt.plot(xnew, y1_smooth, color='blue', label="Stellar")
    # red
    plt.plot( df['x_values'], df['y2_values'], 'o', color='lightcoral')
    plt.plot(xnew, y2_smooth, color='red', label="Stellar Downgrade")
    # green
    plt.plot(df['x_values'], df['y3_values'], 'o', color='lightgreen')
    plt.plot(xnew, y3_smooth, color='green', label="DPoS")
    plt.legend()
    plt.xlabel(xLabel)
    plt.ylabel(yLabel)
    plt.xticks(rotation=90)
    plt.savefig('charts/%s.jpg' % chartName,  bbox_inches="tight")
    plt.clf()

########################################
# Bloques by Nodes
########################################
## Stellar
with open('results/stellar_10.json') as f:
    stellar = json.load(f)

stellars_blocks = list(map(lambda x: x['blocks'], stellar['10'].values())) 

for i in range(1, 6):
   with open(f'results/stellar_10_{i}.json') as f1:
       stellar_temp = json.load(f1)
       blocks_temp = list(map(lambda x: x['blocks'], stellar_temp['10'].values()))
       stellars_blocks = list(map(lambda x,y: x+y, stellars_blocks, blocks_temp))
stellars_blocks = list(map(lambda x: x / 6, stellars_blocks))


## Stellar downgrade
with open('results/stellar_downgrade_10.json') as f:
    stellar_downgrade = json.load(f)

stellars_downgrade_blocks = list(map(lambda x: x['blocks'], stellar_downgrade['10'].values())) 

for i in range(1, 6):
   with open(f'results/stellar_downgrade_10_{i}.json') as f1:
       temp = json.load(f1)
       blocks_temp = list(map(lambda x: x['blocks'], temp['10'].values()))
       stellars_downgrade_blocks = list(map(lambda x,y: x+y, stellars_downgrade_blocks, blocks_temp))
stellars_downgrade_blocks = list(map(lambda x: x / 6, stellars_downgrade_blocks))

## DPOS

with open('results/dpos_10.json') as f:
    dpos = json.load(f)

dpos_blocks = list(map(lambda x: x['blocks'], dpos['10'].values())) 

for i in range(1, 6):
   with open(f'results/dpos_10_{i}.json') as f1:
       temp = json.load(f1)
       blocks_temp = list(map(lambda x: x['blocks'], temp['10'].values()))
       dpos_blocks = list(map(lambda x,y: x+y, dpos_blocks, blocks_temp))
dpos_blocks = list(map(lambda x: x / 6, dpos_blocks))

xvalues = np.array(list(map(lambda x: int(x), stellar['10'].keys())))


values = {
    'x_values': xvalues, 
    'y1_values': stellars_blocks, 
    'y2_values': stellars_downgrade_blocks,
    'y3_values': dpos_blocks
}

df=pd.DataFrame(values)
print(df)

renderPlot(df, "Nodos", "Bloques", "Bloques_Nodos")

########################################
# Blocks by Time
########################################

with open('results/stellar_10-20-30-40-50-60-70-80-90-100.json') as f:
    stellar = json.load(f)

with open('results/stellar_downgrade_10-20-30-40-50-60-70-80-90-100.json') as f:
    stellar_downgrade = json.load(f)

with open('results/dpos_10-20-30-40-50-60-70-80-90-100.json') as f:
    dpos = json.load(f)

xValues = np.array(list(map(lambda x: int(x), stellar.keys())))
y1Values = list(map(lambda item: item['5000']['blocks'], stellar.values()))
y2Values = list(map(lambda item: item['5000']['blocks'], stellar_downgrade.values())) 
y3Values = list(map(lambda item: item['5000']['blocks'], dpos.values()))
df=pd.DataFrame({'x_values': xValues, 'y1_values': y1Values, 'y2_values': y2Values, 'y3_values': y3Values })
print(df)
renderPlot(df, "Tiempo (min)", "Bloques", "Bloques_Tiempo")

########################################
# Nodes by consensus time
########################################
with open('results/stellar_20.json') as f:
    stellar = json.load(f)

with open('results/stellar_downgrade_20.json') as f:
    stellar_downgrade = json.load(f)

with open('results/dpos_20.json') as f:
    dpos = json.load(f)

xValues = np.array(list(map(lambda x: int(x), stellar['20'].keys())))
y1Values = list(map(lambda item: item['consensusTime'], stellar['20'].values()))
y2Values = list(map(lambda item: item['consensusTime'], stellar_downgrade['20'].values())) 
y3Values = list(map(lambda item: item['consensusTime'], dpos['20'].values())) 
df=pd.DataFrame({'x_values': xValues, 'y1_values': y1Values, 'y2_values': y2Values, 'y3_values': y3Values })
print(df)
renderPlot(df, "Nodos", "Tiempo de consenso", "Nodos_Tiempo_Consenso")

########################################
# Blocks by SPB
########################################

xValues = np.array(list(map(lambda x: int(x), stellar['20'].keys())))
y1Values = list(map(lambda item: item['spb'], stellar['20'].values()))
y2Values = list(map(lambda item: item['spb'], stellar_downgrade['20'].values())) 
y3Values = list(map(lambda item: item['spb'], dpos['20'].values()))

df=pd.DataFrame({'x_values': xValues, 'y1_values': y1Values, 'y2_values': y2Values, 'y3_values': y3Values })
print(df)
renderPlot(df, "Nodos", "SPB", "Nodos_SPB")
