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

#cursor.execute('''SELECT COUNT() FROM event_bike WHERE event_name="''' + eventNameQty[0][0] + '"')

#take eventNameQty as argument, return array of incomplete events
def incompleteEvents(events):
    #add each event with null bike values exactly once to incomplete array
    cursor.execute('''SELECT event_name FROM event_bike WHERE bike_id="null"''')
    incomplete = []
    for x in cursor.fetchall():
        print(x[0])
        if (x[0] not in incomplete):
            incomplete.append(x[0])
    cursor.execute('''DELETE FROM event_bike WHERE bike_id="null"''')

    #add to incomplete all events with less entries in event_bike table than bike qty required
    for x in events:
        cursor.execute('''SELECT COUNT() FROM event_bike WHERE event_name="''' + x[0] + '"')
        count = cursor.fetchall()[0][0]
        if(count < x[1]):
            if (x[0] not in incomplete):
                incomplete.append(x[0])

    #return string array of incomplete events
    return incomplete


#get date range of incomplete events
incomplete = incompleteEvents(eventNameQty)

for indexx,x in enumerate(incomplete):
    temp = []
    temp.append(x)
    cursor.execute('''SELECT date_range FROM event WHERE name="''' + x + '"')
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
    if(len(temp) == 1):
        temp.append(date(1, 1, 1))
        temp.append(date(1, 1, 1))

    incomplete[indexx] = temp    

print("incomplete events")
for index,x in enumerate(incomplete):
    print(str(index) + ": " + str(x))

cursor.execute('''SELECT * FROM event_bike''')
eventBike = cursor.fetchall()
print("eventBike complete")
print(eventBike)
bikeDates = []
#create list of bikes with assigned dates
#iterate through available bikes
for x in bikeList:
    temp = []
    #get bike name
    temp.append(x[0])
    #find bikes that are already assigned to events
    for y in eventBike:
        #if current bike id matches current event
        if(x[0] in y):
            #get date range of event
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
    if(len(temp) == 1):
        temp.append(date(1, 1, 1))
        temp.append(date(1, 1, 1))
    bikeDates.append(temp)
print("bikeDates completed")
print(bikeDates)

#function takes bikeDates as argument, sorts bike list by start date
def bikeQuicksort(bikes):

    if(len(bikes) > 1):
        #get value of pivot
        pivoti = len(bikes)//2
        pivote = bikes[pivoti][1]
        lesser = 0
        greater = len(bikes) - 1
        #while two indices have not met or passed
        while(lesser < greater):
            #if lesser index is left of pivot index
            if(lesser < pivoti):
                #if greater index is right of pivot index
                if(greater > pivoti):
                    #if lesser is greater than pivot
                    if(bikes[lesser][1] > pivote):
                        #if greater is less than pivot
                        if(bikes[greater][1] < pivote):
                            #switch lesser and greater, move both in
                            tempDate = bikes[lesser]
                            bikes[lesser] = bikes[greater]
                            bikes[greater] = tempDate
                            lesser += 1
                            greater -= 1
                        #else greater is more than or equal to pivot
                        else:
                            #switch lesser and pivot, change pivot index to lesser index, move lesser index to right
                            tempDate = bikes[lesser]
                            bikes[lesser] = bikes[pivoti]
                            bikes[pivoti] = tempDate
                            pivoti = lesser
                            lesser += 1
                    #else lesser is less than or equal to pivot
                    else:
                        #if greater is less than pivot
                        if(bikes[greater][1] < pivote):
                            #switch greater and pivot, change pivot index to greater, move greater index to left
                            tempDate = bikes[greater]
                            bikes[greater] = bikes[pivoti]
                            bikes[pivoti] = tempDate
                            pivoti = greater
                            greater -= 1
                        #else greater is more than or equal to pivot
                        else:
                            #move both in
                            lesser += 1
                            greater -= 1
                #else greater is on or left of pivot index
                else:
                    #if lesser is greater than pivot
                    if(bikes[lesser][1] > pivote):
                        #if greater is greater than lesser
                        if(bikes[greater][1] > bikes[lesser][1]):
                            #change value of lesser to pivot, greater to lesser, pivot to greater, change pivot index to lesser index, move lesser to right
                            tempDate = bikes[lesser]
                            bikes[lesser] = bikes[pivoti]
                            bikes[pivoti] = bikes[greater]
                            bikes[greater] = tempDate
                            pivoti = lesser
                            lesser += 1
                        #else greater is less than pivot, but greater than lesser
                        else:
                            #change value of lesser to pivot, pivot to lesser, change pivot index to lesser index, move lesser to right
                            tempDate = bikes[lesser]
                            bikes[lesser] = bikes[pivoti]
                            bikes[pivoti] = tempDate
                            pivoti = lesser
                            lesser += 1
                    #else lesser is less than or equal to pivot
                    else:
                        #if lesser is greater than greater
                        if(bikes[lesser][1] > bikes[greater][1]):
                            #switch lesser and greater, move both in
                            tempDate = bikes[lesser]
                            bikes[lesser] = bikes[greater]
                            bikes[greater] = tempDate
                            lesser += 1
                            greater -= 1
                        #else lesser is less than greater
                        else:
                            #move lesser right
                            lesser += 1
            #else lesser is right of pivot index
            else:
                #if lesser is less than pivot
                if(bikes[lesser][1] < pivote):
                    #change value of pivot to pivot index + 1, pivot index + 1 to lesser, lesser to pivot, change pivot index to pivot index + 1, move lesser index to right
                    tempDate = bikes[lesser]

                    bikes[lesser] = bikes[pivoti+1]
                    bikes[pivoti+1] = bikes[pivoti]
                    bikes[pivoti] = tempDate
                    pivoti = pivoti + 1
                    lesser += 1
                #else lesser is greater than pivot
                else:
                    #if lesser is greater than greater
                    if(bikes[lesser][1] > bikes[greater][1]):
                        #switch lesser and greater, move lesser to the right
                        tempDate = bikes[lesser]
                        bikes[lesser] = bikes[greater]
                        bikes[greater] = tempDate
                        lesser += 1
                    #else lesser is less than greater
                    else:
                        #move lesser to the right
                        lesser += 1

        #get lower half of unsorted, sort recursively, then append sorted half on right of pivot to sorted half on left of pivot
        bikes[:pivoti] = bikeQuicksort(bikes[:pivoti])
        bikes[pivoti+1:] = bikeQuicksort(bikes[pivoti+1:])
        print("after upper half sorted of this " + str(bikes))

    return bikes

bikeQuicksort(bikeDates)
print("bikeDates sorted")
for index,x in enumerate(bikeDates):
    print(str(index) + ": " + str(x))

bikeDatesDeq = deque(bikeDates)
print("bikeDatesDeq complete")
print(bikeDatesDeq)
print(bikeDatesDeq[0][len(bikeDatesDeq[0])-1].replace(day=bikeDatesDeq[0][len(bikeDatesDeq[0])-1].day+3))

#assign given bike to event
def assignBike(event, bike):
    insert = [event[0], bike[0]]
    cursor.execute('INSERT INTO event_bike VALUES(?, ?)', insert)

#assignBike(incomplete[0], bikeDatesDeq[0])

#for each event in incomplete list, find first bike with end date at least 3 days before start date of event, assign bike to event

print("starting bike assignment process on following events")
for index,x in enumerate(incomplete):
    print(str(index) + ": " + str(x))


for x in incomplete:
    cursor.execute('SELECT bike_qty FROM event WHERE name="' + x[0] + '"')
    needed = cursor.fetchall()[0][0]
    
    cursor.execute('SELECT COUNT() FROM event_bike WHERE event_name="' + x[0] + '"')
    qty = cursor.fetchall()[0][0]

    count = needed - qty

    while(count > 0):
        found = False
        if(bikeDatesDeq[0][len(bikeDatesDeq[0])-1].replace(day=bikeDatesDeq[0][len(bikeDatesDeq[0])-1].day+3) <= x[1]):
            chosenBike = bikeDatesDeq.popleft()
            assignBike(x, chosenBike)
            bikeDatesDeq.append(chosenBike)
            count -= 1
            found = True
        else:
            check = 1
            while(not found and check < len(bikeDatesDeq)):
                if(bikeDatesDeq[check][len(bikeDatesDeq[check])-1].replace(day=bikeDatesDeq[check][len(bikeDatesDeq[check])-1].day+3) <= x[1]):
                    chosenBike = bikeDatesDeq[check]
                    bikeDatesDeq.remove(chosenBike)
                    assignBike(x, chosenBike)
                    bikeDatesDeq.append(chosenBike)
                    found = True
                    count -= 1
                else:
                    check += 1
        if(found):
            print("suitable bike was found")
        else:
            print("skipping " + x[0] + " because suitable bike could not be found")

print("bike assignments complete")
for index,x in enumerate(incomplete):
    cursor.execute('SELECT * FROM event_bike WHERE event_name="' + x[0] + '"')
    print(cursor.fetchall())

#take output of incompleteEvents as first argument, take eventNameQty as second argument
'''
TAKE LIST OF INCOMPLETE EVENTS
GET QTY OF EACH EVENT
COUNTDOWN TO 0
FIND BIKE WITH AVAILABLE DATE RANGE
ASSIGN TO EVENT
'''