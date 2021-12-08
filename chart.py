import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import json
from functools import reduce

def renderPlot(df, xLabel, yLabel, chartName):
    plt.plot( 'x_values', 'y1_values', data=df, marker='o', markerfacecolor='blue', markersize=4, color='skyblue', linewidth=2, label="Stellar")
    plt.plot( 'x_values', 'y2_values', data=df, marker='o', markerfacecolor='red', markersize=4, color='lightcoral', linewidth=2, label="Stellar Downgrade")
    plt.plot( 'x_values', 'y3_values', data=df, marker='o', markerfacecolor='green', markersize=4, color='lightgreen', linewidth=2, label="DPoS")
    plt.legend()
    plt.xlabel(xLabel)
    plt.ylabel(yLabel)
    plt.xticks(rotation=90)
    plt.savefig('charts/%s.jpg' % chartName,  bbox_inches="tight")
    plt.clf()

# Bloques by Nodes

with open('results/stellar_10.json') as f:
    stellar = json.load(f)

with open('results/stellar_downgrade_10.json') as f:
    stellar_downgrade = json.load(f)

with open('results/dpos_10.json') as f:
    dpos = json.load(f)

values = {
    'x_values': stellar['10'].keys(), 
    'y1_values': list(map(lambda x: x['blocks'], stellar['10'].values())), 
    'y2_values': list(map(lambda x: x['blocks'], stellar_downgrade['10'].values())),
    'y3_values': list(map(lambda x: x['blocks'], dpos['10'].values()))
}
df=pd.DataFrame(values)
print(df)

renderPlot(df, "Nodos", "Bloques", "Bloques_Nodos")

# Blocks by Time
with open('results/stellar_10-20-30-40-50-60-70-80-90-100.json') as f:
    stellar = json.load(f)

with open('results/stellar_downgrade_10-20-30-40-50-60-70-80-90-100.json') as f:
    stellar_downgrade = json.load(f)

with open('results/dpos_10-20-30-40-50-60-70-80-90-100.json') as f:
    dpos = json.load(f)

xValues = stellar.keys()
y1Values = list(map(lambda item: item['5000']['blocks'], stellar.values()))
y2Values = list(map(lambda item: item['5000']['blocks'], stellar_downgrade.values())) 
y3Values = list(map(lambda item: item['5000']['blocks'], dpos.values()))
df=pd.DataFrame({'x_values': xValues, 'y1_values': y1Values, 'y2_values': y2Values, 'y3_values': y3Values })
print(df)
renderPlot(df, "Tiempo (min)", "Bloques", "Bloques_Tiempo")


# Nodes by consensus time
with open('results/stellar_20.json') as f:
    stellar = json.load(f)

with open('results/stellar_downgrade_20.json') as f:
    stellar_downgrade = json.load(f)

with open('results/dpos_20.json') as f:
    dpos = json.load(f)

xValues = stellar['20'].keys()
y1Values = list(map(lambda item: item['consensusTime'], stellar['20'].values()))
y2Values = list(map(lambda item: item['consensusTime'], stellar_downgrade['20'].values())) 
y3Values = list(map(lambda item: item['consensusTime'], dpos['20'].values())) 
df=pd.DataFrame({'x_values': xValues, 'y1_values': y1Values, 'y2_values': y2Values, 'y3_values': y3Values })
print(df)
renderPlot(df, "Nodos", "Tiempo de consenso", "Nodos_Tiempo_Consenso")


# Blocks by SPB

xValues = stellar['20'].keys()
y1Values = list(map(lambda item: item['spb'], stellar['20'].values()))
y2Values = list(map(lambda item: item['spb'], stellar_downgrade['20'].values())) 
y3Values = list(map(lambda item: item['spb'], dpos['20'].values()))

df=pd.DataFrame({'x_values': xValues, 'y1_values': y1Values, 'y2_values': y2Values, 'y3_values': y3Values })
print(df)
renderPlot(df, "Nodos", "SPB", "Nodos_SPB")
