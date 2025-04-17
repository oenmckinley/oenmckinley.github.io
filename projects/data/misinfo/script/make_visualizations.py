import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import os
from mpl_toolkits.mplot3d import axes3d
import math
import matplotlib.patches as mpatches

def clean_df(df, param):
    dollars = []
    for col in df.columns:
        if isinstance(df[col][0], str) and df[col][0].startswith("$"):
            dollars.append(col)
    df[dollars] = df[dollars].replace('\s*\(\$\)', '', regex=True)
    df[dollars] = df[dollars].replace('[\$,]', '', regex=True).astype(float)
    
    truncrem = param['truncrem']
    if not math.isnan(truncrem) and truncrem > 0:
        trunc = param['trunc1']
        for i in range(len(df.columns)-1):
            df = df[df[df.columns[i+1]] > trunc]
    
    return df
        
        


# Directory path
parent = '../'
directory = parent + 'csv'
params = pd.read_csv(directory+'/parameters.csv')

domains = ['weather', 'election', 'disease', 'health', 'social', 'business', 'finance', 'physics', 'chemistry', 'lifescience']
#domains = ['election']
vtypes = ['line', 'bar']
#vtypes = ['line']

colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2']

# Iterate over files in the directory
for domain in domains:
    d = domain[0].upper()
    for vtype in vtypes:
        t = vtype[0].upper()
        for i in range(5):
            fn = directory+'/'+domain+'/'+vtype+'/'+t+d+str(i+1)+'.csv'
            saveto = parent+'img/'+domain+'/'+vtype+'/'+t+d+str(i+1)
            data = pd.read_csv(fn)
            print(t+d+str(i+1))
            cols = [x for x in data.columns if 'Unnamed' not in x]
            
            param = params[params['id']==(t+d+str(i+1))].iloc[0].to_dict()

            data = clean_df(data, param)
                                    
            #print(param)
            
            if vtype == 'line':
                x = data[cols[0]]
                y = data[cols[1:]]
                #for col in cols[1:]:
                    #print(col + ": " + str(max(data[col])))
                
                # Base Vis
                                
                fig, ax1 = plt.subplots(figsize=(8, 5))
                ax1.set_xlabel(param['xtitle'])
                ax1.set_ylabel(param['ytitle'])
                fig.suptitle(param['title'])
                ax1.set_ylim(param['y1'],param['y2'])
    
                for i in range(len(cols)-1):
                    ax1.plot(x, y[cols[i+1]], label=cols[i+1])
                
                ax1.legend()
                plt.xticks(rotation=45)
                plt.savefig(saveto+'_base.png', bbox_inches="tight")
                plt.show()
                
                # Inverted Vis
                
                fig, ax1 = plt.subplots(figsize=(8, 5))
                ax1.set_xlabel(param['xtitle'])
                ax1.set_ylabel(param['ytitle'])
                fig.suptitle(param['title'])
                ax1.set_ylim(param['y2'],param['y1'])
    
                for i in range(len(cols)-1):
                    ax1.plot(x, y[cols[i+1]], label=cols[i+1])
                    
                ax1.legend()
                plt.xticks(rotation=45)
                plt.savefig(saveto+'_inverted.png', bbox_inches="tight")
                plt.show()

                # Dual Axis
                
                fig, ax1 = plt.subplots(figsize=(8, 5))
                #ax1.title = param['title']
                ax1.set_xlabel(param['xtitle'])
                fig.suptitle(param['title'])

                ax2 = ax1.twinx()

                ax1.set_ylabel(param['ytitle'])
                ax1.set_ylim(param['y1'],param['y2'])

                ax2.set_ylim(param['y1'],param['dual2'])
                
                for i in range(len(cols)-1):
                    #print(cols.index(cols[i+1]))
                    if cols[i+1] == param['dualline']:
                        ax2.plot(x, y[cols[i+1]], color=colors[i])
                        ax1.plot([],[], color=colors[i], label=cols[i+1])
                        ax2.tick_params(axis="y", labelcolor=colors[i])
                        ax2.set_ylabel(param['ytitle'] + ' - ' + param['dualline'], color=colors[i])
                    else:
                        ax1.plot(x, y[cols[i+1]], color=colors[i], label=cols[i+1])
                    
                ax1.tick_params(axis='x', labelrotation=45)
                ax2.tick_params(axis='x', labelrotation=45)
                ax1.legend()
                #ax2.legend()
                plt.savefig(saveto+'_dual.png', bbox_inches="tight")
                plt.show()

            elif vtype == 'bar':
                if len(cols)-1 == 1:
                    
                    # Base Chart
                    fig, ax1 = plt.subplots(figsize=(8, 5))
                    ax1.set_xlabel(param['xtitle'])
                    ax1.set_ylabel(param['ytitle'])
                    fig.suptitle(param['title'])
                    ax1.set_ylim(param['y1'],param['y2'])

                    x = data[cols[0]]
                    y = data[cols[1]]
                    #print(data)
                    #print(cols)
                    #print(max(y))
                    width = 0.4
                    ax1.bar(x, y, width)
                    
                    plt.xticks(rotation=45)
                    plt.savefig(saveto+'_base.png', bbox_inches="tight")
                    plt.show()
                    
                    # Inconsistent Widths
                    fig, ax1 = plt.subplots(figsize=(8, 5))
                    ax1.set_xlabel(param['xtitle'])
                    ax1.set_ylabel(param['ytitle'])
                    fig.suptitle(param['title'])
                    ax1.set_ylim(param['y1'],param['y2'])

                    x = data[cols[0]]
                    y = data[cols[1]]
                    miny = min(y)
                    maxy = max(y)
                    widths = ((y-miny)/((maxy-miny)/0.4))+0.2
                    #print(widths)
                    ax1.bar(x, y, widths)
                    
                    plt.xticks(rotation=45)

                    plt.savefig(saveto+'_inconsistent.png', bbox_inches="tight")
                    plt.show()
                    
                    # Truncated Axis
                    
                    fig, ax1 = plt.subplots(figsize=(8, 5))
                    ax1.set_xlabel(param['xtitle'])
                    ax1.set_ylabel(param['ytitle'])
                    fig.suptitle(param['title'])
                    ax1.set_ylim(param['trunc1'],param['y2'])

                    x = data[cols[0]]
                    y = data[cols[1]]
                    width = 0.4
                    ax1.bar(x, y, width)
                                        
                    plt.xticks(rotation=45)

                    plt.savefig(saveto+'_trunc.png', bbox_inches="tight")
                    plt.show()

                    # 3D
                    
                    fig = plt.figure(figsize=(8, 5))
                    fig.suptitle(param['title'])
                    ax1 = fig.add_subplot(111, projection='3d')

                    x = np.arange(len(data[cols[0]]))
                    y = np.ones(len(data[cols[0]]))*(len(data[cols[0]]))*0.1
                    z = np.zeros(len(data[cols[0]]))

                    dx = np.ones(len(data[cols[0]]))/4
                    dy = np.ones(len(data[cols[0]]))*5/2
                    dz = data[cols[1]]
                                    
                    ax1.set_ylim(0,len(data[cols[0]]))

                    #print(x)
                    #print(dx)
                    
                    ax1.bar3d(x, y, z, dx, dy, dz)


                    ax1.set_xlabel("")
                    ax1.set_zlabel("")
                    ax1.set_xticks(x,data[cols[0]])
                    ax1.set_yticks([],[])
                    
                    ax1.elev = 10
                    ax1.azim = -75
                    plt.xticks(rotation=45)

                    #ax1.set_box_aspect(aspect=None, zoom=1.5)
                    ax1.set_box_aspect((2, 0.2, 1), zoom=1.2)

                    plt.savefig(saveto+'_3d.png', bbox_inches="tight")
                    plt.show()

                elif len(cols)-1 == 2:
                    fig, ax1 = plt.subplots(figsize=(8, 5))
                    ax1.set_xlabel(param['xtitle'])
                    ax1.set_ylabel(param['ytitle'])
                    fig.suptitle(param['title'])
                    ax1.set_ylim(param['y1'],param['y2'])

                    x = np.arange(len(data[cols[0]]))
                    y1 = data[cols[1]]
                    y2 = data[cols[2]]
                    #print(cols[1] + ": " + str(max(y1)))
                    #print(cols[2] + ": " + str(max(y2)))

                    width = 0.4
                    
                    ax1.bar(x-width/2, y1, width, label=cols[1])
                    ax1.bar(x+width/2, y2, width, label=cols[2])
                    
                    ax1.set_xticks(x,data[cols[0]]) 

                    plt.xticks(rotation=45)
                    ax1.legend()
                    plt.savefig(saveto+'_base.png', bbox_inches="tight")
                    plt.show()
                    
                    # Inconsistent Widths
                    fig, ax1 = plt.subplots(figsize=(8, 5))
                    ax1.set_xlabel(param['xtitle'])
                    ax1.set_ylabel(param['ytitle'])
                    fig.suptitle(param['title'])
                    ax1.set_ylim(param['y1'],param['y2'])

                    x = np.arange(len(data[cols[0]]))
                    y1 = data[cols[1]]
                    y2 = data[cols[2]]
                    y = y1+y2
                    miny = min(y)
                    maxy = max(y)
                    widths = ((y-miny)/((maxy-miny)/0.2))+0.1
                    width = 0.4
                    
                    ax1.bar(x-widths/2, y1, widths, label=cols[1])
                    ax1.bar(x+widths/2, y2, widths, label=cols[2])
                    
                    ax1.set_xticks(x,data[cols[0]]) 

                    plt.xticks(rotation=45)
                    ax1.legend()
                    plt.savefig(saveto+'_inconsistent.png', bbox_inches="tight")
                    plt.show()
                    
                    
                    # Truncated Axis
                    
                    fig, ax1 = plt.subplots(figsize=(8, 5))
                    ax1.set_xlabel(param['xtitle'])
                    ax1.set_ylabel(param['ytitle'])
                    fig.suptitle(param['title'])
                    ax1.set_ylim(param['trunc1'],param['y2'])

                    x = np.arange(len(data[cols[0]]))
                    y = data[cols[1]]
                    width = 0.4

                    ax1.bar(x-width/2, y1, width, label=cols[1])
                    ax1.bar(x+width/2, y2, width, label=cols[2])
                    
                    ax1.set_xticks(x,data[cols[0]]) 

                    plt.xticks(rotation=45)
                    ax1.legend()
                    plt.savefig(saveto+'_trunc.png', bbox_inches="tight")
                    plt.show()

                    # 3D
                    
                    fig = plt.figure(figsize=(8, 5))
                    fig.suptitle(param['title'])
                    ax1 = fig.add_subplot(111, projection='3d')

                    x = []
                    dz = []
                    barcolors = []
                    
                    x1 = np.arange(len(data[cols[0]]))-.17
                    x2 = np.arange(len(data[cols[0]]))+.17
                    #y = np.ones(len(data[cols[0]])*2)*(len(data[cols[0]]))*.01
                    y = np.zeros(len(data[cols[0]])*2)
                    z = np.zeros(len(data[cols[0]])*2)

                    dx = np.ones(len(data[cols[0]])*2)/4
                    dy = np.ones(len(data[cols[0]])*2)*2
                    dz1 = data[cols[1]]
                    dz2 = data[cols[2]]
                    
                    for i in x1:
                        x.append(i)
                        barcolors.append(colors[0])
                    for i in x2:
                        x.append(i)
                        barcolors.append(colors[1])

                    for i in dz1:
                        dz.append(i)
                    for i in dz2:
                        dz.append(i)
                        
                    

                    ax1.set_ylim(0,len(data[cols[0]]))
                    
                    ax1.bar3d(x, y, z, dx, dy, dz, color=barcolors)

                    
                    ax1.set_xlabel("")
                    ax1.set_zlabel("")
                    ax1.set_xticks(x1+0.17,data[cols[0]])
                    ax1.set_yticks([],[])
                    
                    patch1 = mpatches.Patch(color=colors[0], label=cols[1])
                    patch2 = mpatches.Patch(color=colors[1], label=cols[2])

                    ax1.legend(handles=[patch1, patch2])
                    #ax1.set_box_aspect(aspect=None, zoom=1.5)
                    ax1.set_box_aspect((2, 0.2, 1), zoom=1.2)
                    
                    ax1.elev = 10
                    ax1.azim = -75
                    plt.xticks(rotation=45)

                    plt.savefig(saveto+'_3d.png', bbox_inches="tight")
                    plt.show()




# Extract data for plotting
#categories = data['Category']
#values = data['Value']

# Create bar chart
#plt.figure(figsize=(8, 5))
#plt.bar(categories, values, color='skyblue')

# Add titles and labels
#plt.title('Bar Chart from CSV')
#plt.xlabel('Categories')
#plt.ylabel('Values')

# Show the chart
#plt.tight_layout()
#plt.show()