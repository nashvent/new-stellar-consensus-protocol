import matplotlib.pyplot as plt
import numpy as np
 
np.random.seed(10)
data_1 = np.random.normal(100, 10, 16)
data_2 = np.random.normal(90, 20, 16)
data_3 = np.random.normal(80, 30, 16)
data_4 = np.random.normal(70, 40, 16)
data = [data_1, data_2, data_3, data_4]
 
fig = plt.figure(figsize =(10, 7))
ax = fig.add_subplot(111)
 
bp = ax.boxplot(data, patch_artist = True,
                notch ='True')

plt.title("Consensus algorithms")
 
ax.get_xaxis().tick_bottom()
ax.get_yaxis().tick_left()
     
# show plot
plt.show()