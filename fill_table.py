import sqlite3
import re
#connect = sqlite3.connect("bike_power.db")

#cursor = connect.cursor()

#cursor.execute('''INSERT INTO bike
#    ''')

f = open("a", "r")
text = f.read()
temp = re.findall("\"[a-zA-Z0-9\s/]+\"", text)
print("all found: ")
print(temp)

colMax = 3
count = 0
output = ""

#create generalized insert, start by reading file
for x in range(len(temp)):
    if ((count % colMax) == 0):
        output += "[" + x
    elif ((count % colMax) == 2):
        output += x + "]\n"
    else:
        output += ", " + x + ", "
    
    count += 1
print(output)

count = 0
tempArray = []
output = []
for x in range(len(temp)):
    if ((count % colMax) == 2):
        tempArray.append(x)
        output.append(tempArray)
        tempArray = []
    else:
        tempArray.append(x)
    
    count += 1
print(output)