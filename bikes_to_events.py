import sqlite3
import re
from collections import deque
from datetime import date

monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

connect = sqlite3.connect("bike_power.db")
cursor = connect.cursor()

#get all bikes in given state
cursor.execute('''SELECT uid, status FROM bike WHERE
               status="Ready // General Fleet"''')
bikeList = cursor.fetchall()
cursor.execute('''SELECT uid, status FROM bike WHERE
               status="Crewed Intake"''')
bikeList += cursor.fetchall()
cursor.execute('''SELECT uid, status FROM bike WHERE
               status="Out // Staffed"''')
bikeList += cursor.fetchall()
cursor.execute('''SELECT uid, status FROM bike WHERE
               status="Ready // Staffed"''')
bikeList += cursor.fetchall()

print("selected bikes")
for x in bikeList:
    print(x)

bikeDeq = deque(bikeList)
print("bikeDeq complete")
print(bikeDeq)

#get event names and bike qty
cursor.execute('''SELECT name, bike_qty FROM event''')
eventNameQty = cursor.fetchall()
print("eventNameQty complete")
print(eventNameQty)

cursor.execute('''SELECT * FROM event_bike''')
eventBike = cursor.fetchall()
print("eventBike complete")
print(eventBike)

#cursor.execute('''SELECT COUNT() FROM event_bike WHERE event_name="''' + eventNameQty[0][0] + '"')

#take eventNameQty as argument
def incompleteEvents(events):
    #add each event with null bike values exactly once to incomplete array
    cursor.execute('''SELECT event_name FROM event_bike WHERE bike_id="null"''')
    incomplete = []
    for x in cursor.fetchall():
        if (x[0] not in incomplete):
            incomplete.append(x[0])
    cursor.execute('''DELETE FROM event_bike WHERE bike_id="null"''')

    #add to incomplete all events with less entries in event_bike table than bike qty required
    for x in events:
        cursor.execute('''SELECT COUNT() FROM event_bike WHERE event_name="''' + x[0] + '"')
        count = cursor.fetchall()[0][0]
        if(count < x[1]):
            incomplete.append(x[0])

    #return string array of incomplete events
    return incomplete

incomplete = incompleteEvents(eventNameQty)
cursor.execute('''SELECT * FROM event_bike''')
eventBike = cursor.fetchall()
bikeDates = []
#iterate through available bikes
for x in bikeDeq:
    temp = []
    temp.append(x[0])
    #find bikes that are already assigned to events
    for y in eventBike:
        #if current bike id matches current event
        if(x[0] in y):
            cursor.execute('''SELECT date_range FROM event WHERE name="''' + y[0] + '"')
            dateString = cursor.fetchall()[0]
            print("printing dateString")
            print(dateString)
            dateStringArr = re.findall(r'[a-zA-Z]+ [0-9]{1,2}, [0-9]{4}', dateString[0])
            dateArr = []
            #convert dateStringArr items to ints
            for indexz,z in enumerate(dateStringArr):
                year = int(re.findall(r'[0-9]{4}', z)[0])
                month = re.findall(r'[a-zA-Z]+', z)[0]
                #go through list of months
                for indexa,a in enumerate(monthArr):
                    #when given month matches
                    if(month in a):
                        month = indexa + 1
                        break
                day = int(re.findall(r'[0-9]{1,2},', z)[0].replace(',', ''))
                dateStringArr[indexz] = [year, month, day]
                
            #if there two unique dates, add start and end
            if(len(dateStringArr) > 1):
                temp.append(date(dateStringArr[0][0], dateStringArr[0][1], dateStringArr[0][2]))
                temp.append(date(dateStringArr[1][0], dateStringArr[1][1], dateStringArr[1][2]))
            #else set start and end as same date
            else:
                temp.append(date(dateStringArr[0][0], dateStringArr[0][1], dateStringArr[0][2]))
                temp.append(date(dateStringArr[0][0], dateStringArr[0][1], dateStringArr[0][2]))
    bikeDates.append(temp)
print("bikeDates completed")
print(bikeDates)

#take output of incompleteEvents as first argument, take eventNameQty as second argument
'''
TAKE LIST OF INCOMPLETE EVENTS
GET QTY OF EACH EVENT
COUNTDOWN TO 0
FIND BIKE WITH AVAILABLE DATE RANGE
ASSIGN TO EVENT
'''
def assignBikes(events, qty):
    for x in events:
        
        count = qty.index()