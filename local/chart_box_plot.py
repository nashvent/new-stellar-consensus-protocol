import matplotlib.pyplot as plt
import numpy as np
import json
np.random.seed(10)

def getJsonFile(filename):
    with open(filename) as f:
        data = json.load(f)
    return data

def concateningData(filenames, labels):
    result = {}
    for label in labels:
        result[label] = []

    for filename in filenames:
        data = getJsonFile(filename)
        for label in labels:
            result[label].append(data['20'][str(label)]['consensusTime'])
    return result


xvalues = np.array(list(map(lambda x: int(x), getJsonFile('results/stellar_20.json')['20'].keys())))
result_stellar = concateningData(['results/stellar_20.json'] + [f'results/stellar_20_{i}.json' for i in range(1, 6)], xvalues)
result_stellar_downgrade = concateningData(['results/stellar_downgrade_20.json'] + [f'results/stellar_downgrade_20_{i}.json' for i in range(1, 6)], xvalues)
result_dpos = concateningData(['results/dpos_20.json'] + [f'results/dpos_20_{i}.json' for i in range(1, 6)], xvalues)

fig = plt.figure(figsize =(10, 7))
plt.xticks(rotation=90)
ax = fig.add_subplot(111)


ax.boxplot(result_stellar_downgrade.values(), patch_artist = True,
                notch ='True', labels=xvalues)

ax.boxplot(result_dpos.values(), patch_artist = True,
                notch ='True', labels=xvalues)
 
bp = ax.boxplot(result_stellar.values(), patch_artist = True,
                notch ='True', labels=xvalues)


colors = [['#0000FF'] * len(xvalues) + ['#00FF00'] * len(xvalues) +
          ['#FF0000'] * len(xvalues)]

print(colors)

for patch, color in zip(bp['boxes'], colors[0]):
    patch.set_facecolor(color)

plt.title("Consensus algorithms")
 
ax.get_xaxis().tick_bottom()
ax.get_yaxis().tick_left()
     
# show plot
plt.show()