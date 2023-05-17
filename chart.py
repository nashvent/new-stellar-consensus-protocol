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

def getJsonFile(filename):
    with open(filename) as f:
        data = json.load(f)
    return data

def getAverageData(filenames, getArr):
    sumList = None
    for filename in filenames:
        data = getJsonFile(filename)
        filterData = getArr(data)
        if(sumList == None):
            sumList = filterData
        else:
            sumList = list(map(lambda x,y: x+y, sumList, filterData))
    return list(map(lambda x: x / len(filenames), sumList))

########################################
# Bloques by Nodes
########################################
def getBlockByNode(data):
    return list(map(lambda x: x['blocks'], data['10'].values()))

stellars_blocks = getAverageData(['results/stellar_10.json'] + [f'results/stellar_10_{i}.json' for i in range(1, 6)] , getBlockByNode) 
stellars_downgrade_blocks = getAverageData(['results/stellar_downgrade_10.json'] + [f'results/stellar_downgrade_10_{i}.json' for i in range(1, 6)] , getBlockByNode)
dpos_blocks = getAverageData(['results/dpos_10.json'] + [f'results/dpos_10_{i}.json' for i in range(1, 6)] , getBlockByNode)

xvalues = np.array(list(map(lambda x: int(x), getJsonFile('results/stellar_10.json')['10'].keys())))
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

def getBlockByTime(data):
    return list(map(lambda item: item['5000']['blocks'], data.values()))

stellars_blocks = getAverageData(['results/stellar_10-20-30-40-50-60-70-80-90-100.json'] + [f'results/stellar_10-20-30-40-50-60-70-80-90-100_{i}.json' for i in range(1, 6)] , getBlockByTime) 
stellars_downgrade_blocks = getAverageData(['results/stellar_downgrade_10-20-30-40-50-60-70-80-90-100.json'] + [f'results/stellar_downgrade_10-20-30-40-50-60-70-80-90-100_{i}.json' for i in range(1, 6)] , getBlockByTime)
dpos_blocks = getAverageData(['results/dpos_10-20-30-40-50-60-70-80-90-100.json'] + [f'results/dpos_10-20-30-40-50-60-70-80-90-100_{i}.json' for i in range(1, 6)] , getBlockByTime)

xvalues = np.array(list(map(lambda x: int(x), getJsonFile('results/stellar_10-20-30-40-50-60-70-80-90-100.json').keys())))
df=pd.DataFrame({
    'x_values': xvalues, 
    'y1_values': stellars_blocks, 
    'y2_values': stellars_downgrade_blocks, 
    'y3_values': dpos_blocks 
})
print(df)
renderPlot(df, "Tiempo (min)", "Bloques", "Bloques_Tiempo")

########################################
# Nodes by consensus time
########################################
def getNodeByConsensusTime(data):
    return list(map(lambda item: item['consensusTime'], data['20'].values()))


stellars_blocks = getAverageData(['results/stellar_20.json'] + [f'results/stellar_20_{i}.json' for i in range(1, 6)] , getNodeByConsensusTime) 
stellars_downgrade_blocks = getAverageData(['results/stellar_downgrade_20.json'] + [f'results/stellar_downgrade_20_{i}.json' for i in range(1, 6)] , getNodeByConsensusTime)
dpos_blocks = getAverageData(['results/dpos_20.json'] + [f'results/dpos_20_{i}.json' for i in range(1, 6)] , getNodeByConsensusTime)

xvalues = np.array(list(map(lambda x: int(x), getJsonFile('results/stellar_20.json')['20'].keys())))

df=pd.DataFrame({
    'x_values': xvalues, 
    'y1_values': stellars_blocks, 
    'y2_values': stellars_downgrade_blocks, 
    'y3_values': dpos_blocks 
})
print(df)
renderPlot(df, "Nodos", "Tiempo de consenso", "Nodos_Tiempo_Consenso")

########################################
# Blocks by SPB
########################################
def getBlockBySPB(data):
    return list(map(lambda item: item['spb'], data['20'].values()))

stellars_blocks = getAverageData(['results/stellar_20.json'] + [f'results/stellar_20_{i}.json' for i in range(1, 6)] , getBlockBySPB) 
stellars_downgrade_blocks = getAverageData(['results/stellar_downgrade_20.json'] + [f'results/stellar_downgrade_20_{i}.json' for i in range(1, 6)] , getBlockBySPB)
dpos_blocks = getAverageData(['results/dpos_20.json'] + [f'results/dpos_20_{i}.json' for i in range(1, 6)] , getBlockBySPB)


df=pd.DataFrame({
    'x_values': xvalues, 
    'y1_values': stellars_blocks, 
    'y2_values': stellars_downgrade_blocks, 
    'y3_values': dpos_blocks
})
print(df)
renderPlot(df, "Nodos", "SPB", "Nodos_SPB")
