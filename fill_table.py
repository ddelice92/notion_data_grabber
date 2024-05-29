import sqlite3
#connect = sqlite3.connect("bike_power.db")

#cursor = connect.cursor()

#cursor.execute('''INSERT INTO bike
#    ''')

f = open("notes.txt", "r")

while f:
    print(f.readline())
    print("*****reading next line*****")