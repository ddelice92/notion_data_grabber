import sqlite3
import re

#create file object and read file contents into variable
f = open("a", "r")
text = f.read()

#turn string list into proper list
temp = re.findall(r'"[a-zA-Z0-9\s/&]+"', text)

colMax = 3
count = 0

tempArray = []
output = []
#create list of lists by grouping items in threes, id, color, status
for x in range(len(temp)):
    if ((count % colMax) == 2):
        #tempArray.append(temp[x][1:len(temp[x])-1])
        tempArray.append(temp[x])
        output.append(tempArray)
        tempArray = []
    else:
        #tempArray.append(temp[x][1:len(temp[x])-1])
        tempArray.append(temp[x])
    
    count += 1
print(output)


connect = sqlite3.connect("bike_power.db")
cursor = connect.cursor()
for x in output:
    print(x[0] + x[1] + x[2])
    cursor.execute('''INSERT OR REPLACE INTO bike
               VALUES ( ''' + x[0] + ''',''' + x[1] + ''',''' + x[2] + ''')''')
print("table filled")

connect.commit()