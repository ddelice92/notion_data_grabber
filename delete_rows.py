import sqlite3

connect = sqlite3.connect("bike_power.db")
cursor = connect.cursor()

cursor.execute('DELETE FROM bike WHERE uid = "RTB Black"')
cursor.execute('DELETE FROM bike WHERE uid = "RTB Blue"')
cursor.execute('DELETE FROM bike WHERE uid = "Pepto Pink"')
cursor.execute('DELETE FROM bike WHERE uid = "RTB Red"')

connect.commit()
connect.close()