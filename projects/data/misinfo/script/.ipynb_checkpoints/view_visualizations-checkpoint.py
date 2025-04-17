import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import pandas as pd
import numpy as np
import os
from mpl_toolkits.mplot3d import axes3d
import math
import matplotlib.patches as mpatches
from PIL import Image

# Directory path
parent = '../'
directory = parent + 'img'

#domains = ['weather', 'election', 'disease', 'health', 'social', 'business', 'finance', 'physics', 'chemistry', 'lifescience']
domains = ['weather']
#vtypes = ['line', 'bar']
vtypes = ['line']
linevars = ['base', 'inverted', 'dual']
barvars = ['base', 'trunc', 'inconsistent', '3d']
nums = [1,2,3,4,5]
#nums = [1]

colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2']

# Iterate over files in the directory
for domain in domains:
    d = domain[0].upper()
    for vtype in vtypes:
        t = vtype[0].upper()
        for i in nums:
            if vtype == 'line':
                for var in linevars:
                    fn = directory+'/'+domain+'/'+vtype+'/'+t+d+str(i)+"_"+var+".png"
                    #image = mpimg.imread(fn)
                    #plt.imshow(image)
                    #plt.show()
                    im = Image.open(fn)
                    im.show()

            elif vtype == 'bar':
                for var in barvars:
                    fn = directory+'/'+domain+'/'+vtype+'/'+t+d+str(i+1)+"_"+var+".png"
                    #image = mpimg.imread(fn)
                    #plt.imshow(image)
                    #plt.show()
                    im = Image.open(fn)
                    im.show()

