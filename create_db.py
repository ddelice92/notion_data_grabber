import sqlite3
connect = sqlite3.connect("bike_power.db")

cursor = connect.cursor()

cursor.execute('''CREATE TABLE bike
                        (	UID TEXT PRIMARY KEY NOT NULL,
	                        COLOR TEXT,
	                        STATUS TEXT)''')

cursor.execute('''CREATE TABLE box 
                        (UID TEXT PRIMARY KEY NOT NULL,
                        QUALITY INT)''')

cursor.execute('''CREATE TABLE event
                        (NAME TEXT PRIMARY KEY,
	                    INVOICE INT,
	                    DATE_RANGE TEXT,
	                    SERVICE TEXT,
	                    METHOD TEXT,
	                    BRANDED TEXT,
	                    BIKE_QTY INT,
	                    BIKE_UID TEXT)''')

cursor.execute('''CREATE TABLE ship_event
                        (EVENT_NAME TEXT,
	                    INVOICE INT,
	                    ORDER INT,
	                    TRACK_OUT TEXT,
	                    TRACK_IN TEXT,
	                    PICKUP TEXT,
	                    ARRIVAL TEXT,
	                    LOCATION_PICKUP TEXT,
	                    RETURN_ARRIVAL TEXT,
	                    ADDRESS TEXT,
	                    CONTACT_NAME TEXT,
	                    CONTACT_PHONE TEXT,
	                    CONTACT_EMAIL TEXT,
	                    BLENDER_QTY INT,
	                    BOX_UID TEXT)''')