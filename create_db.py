import sqlite3
connect = sqlite3.connect("bike_power.db")

cursor = connect.cursor()

cursor.execute('''CREATE TABLE IF NOT EXISTS bike
                        	(UID TEXT PRIMARY KEY NOT NULL,
	                        COLOR TEXT,
	                        STATUS TEXT)''')

cursor.execute('''CREATE TABLE IF NOT EXISTS box 
                        (UID TEXT PRIMARY KEY NOT NULL,
                        QUALITY INT)''')

cursor.execute('''CREATE TABLE IF NOT EXISTS event
                        (NAME TEXT,
	                    INVOICE INT,
	                    DATE_RANGE TEXT,
	                    SERVICE TEXT,
	                    METHOD TEXT,
	                    BRANDED TEXT,
	                    BIKE_QTY INT,
	                    CONTACT_NAME TEXT,
	                    CONTACT_PHONE TEXT,
                        ADDRESS TEXT)''')

cursor.execute('''CREATE TABLE IF NOT EXISTS ship
                        (EVENT_NAME TEXT,
	                    INVOICE INT,
	                    TRACK_OUT TEXT,
	                    TRACK_IN TEXT,
	                    PICKUP TEXT,
	                    ARRIVAL TEXT,
	                    LOCATION_PICKUP TEXT,
	                    RETURN_ARRIVAL TEXT,
	                    CONTACT_EMAIL TEXT,
	                    BLENDER_QTY INT,
	                    BOX_UID TEXT)''')

cursor.execute('''CREATE TABLE IF NOT EXISTS event_bike
               			(EVENT_NAME TEXT,
               			BIKE_ID TEXT)''')

connect.commit()