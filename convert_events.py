import sqlite3
import re

table = "event"

#read file and create array of events
text = open("events", "r").read()
textArr = re.findall(r'\[[\w\s/|→",.+—\-()]+\]', text)
print(len(textArr))

#separate columns in each event item
attributeSeparate = []
for x in textArr:
    temp = []
    for y in re.findall(r'"[\w\s/|→,.+—\-()]+"', x):
        temp.append(y.replace('"', ''))
    attributeSeparate.append(temp)
attributeSeparate.append(len(attributeSeparate[0])-1)


eventBike = []
#change bike attribute of each item from string to list and create array of just event name and bikes
#[1:len(x[7])-1]
for index,x in enumerate(attributeSeparate):
    if (index < len(attributeSeparate)-1):
        tempBikeList = x[7].split()
        for y in tempBikeList:
            eventBike.append([x[0], y])

#cut out bike attribute from original lists
for index,x in enumerate(attributeSeparate):
    if (index < len(attributeSeparate)-1):
        temp = x[:7] + x[8:]
        if(temp[1] == 'null'):
            temp[1] = -1
        else:
            temp[1] = int(temp[1].replace('"', ''))

        if(temp[6] == 'null'):
            temp[6] = -1
        else:
            temp[6] = int(temp[6].replace('"', ''))

        attributeSeparate[index] = temp

print(attributeSeparate)
for x in attributeSeparate[0]:
    print(type(x))


#for each item, put event info in event table and put event bike info in event_bike table
connect = sqlite3.connect("bike_power.db")
cursor = connect.cursor()

outputAttrArr = attributeSeparate[:len(attributeSeparate)-1]

cursor.executemany('''INSERT OR REPLACE INTO ''' + table + ''' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', outputAttrArr)
print(table + " filled")

table = "event_bike"
cursor.executemany('''INSERT OR REPLACE INTO ''' + table +
               ''' VALUES (?, ?)''', eventBike)
print(table + " filled")

cursor.execute('''SELECT * FROM event''')
print(cursor.fetchall())
print("************************************************************************")
cursor.execute('''SELECT * FROM event_bike''')

print(cursor.fetchall())

connect.commit()

#for x in attributeSeparate:
    #print(re.findall(r'[A-Z]{2,3}[0-9]{3}',x))
