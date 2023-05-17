import matplotlib.pyplot as plt
import numpy as np
 
np.random.seed(10)
data_1 = np.random.normal(100, 10, 16)
data_2 = np.random.normal(90, 20, 16)
data_3 = np.random.normal(80, 30, 16)
data_4 = np.random.normal(70, 40, 16)

data_5 = np.random.normal(100, 10, 16)
data_6 = np.random.normal(90, 20, 16)
data_7 = np.random.normal(80, 30, 16)
data_8 = np.random.normal(70, 40, 16)

 
fig = plt.figure(figsize =(10, 7))
ax = fig.add_subplot(111)
 
bp = ax.boxplot([data_1, data_2, data_3, data_4], patch_artist = True,
                notch ='True')

bp = ax.boxplot([data_5, data_6, data_7, data_8], patch_artist = True,
                notch ='True')
colors = ['#0000FF', '#00FF00',
          '#FFFF00', '#FF00FF']
 
for patch, color in zip(bp['boxes'], colors):
    patch.set_facecolor(color)

plt.title("Consensus algorithms")
 
ax.get_xaxis().tick_bottom()
ax.get_yaxis().tick_left()
     
# show plot
plt.show()