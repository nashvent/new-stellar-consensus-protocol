import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import json

with open('results/stellar_10.json') as f:
    stellar = json.load(f)

with open('results/stellar_downgrade_10.json') as f:
    stellar_downgrade = json.load(f)

df=pd.DataFrame({'x_values': stellar['10'].keys(), 'y1_values': list(map(lambda x: x['blocks'], stellar['10'].values())), 'y2_values': list(map(lambda x: x['blocks'], stellar_downgrade['10'].values())) })
print(df)

plt.plot( 'x_values', 'y1_values', data=df, marker='o', markerfacecolor='blue', markersize=4, color='skyblue', linewidth=2, label="Stellar")
plt.plot( 'x_values', 'y2_values', data=df, marker='o', markerfacecolor='red', markersize=4, color='lightcoral', linewidth=2, label="Stellar Downgrade")

plt.legend()
plt.xlabel("Bloques")
plt.ylabel("Nodos")
plt.show()