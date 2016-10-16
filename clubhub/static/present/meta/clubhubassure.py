import time
import datetime
from pymouse import PyMouse
from pykeyboard import PyKeyboard

m = PyMouse()
k = PyKeyboard()

#POSITION DEFINITIONS
pagetop = (679, 40)
chromecast_button = (1314, 75)
stop_button = (1182, 216)
chromecasts = [(1150, 142), (1150, 182), (1130, 230)]

print("================= Welcome to Club Hub Assurance! =================")
print("                  Copyright (c)  2016 George Moe")
print()
print("==================================================================")
print("This program starts Club Hub and restarts it every hour to ensure")
print("that it stays online.")
print()
print("=================            IMPORTANT           =================")
print("CLUB HUB ASSURANCE RELIES ON SCREEN COORDINATES TO PERFORM ACTIONS")
print("Make sure all Google Chrome windows are open and placed, in order,")
print("in each of the workspaces, opened to the maximum size.")
print()
print("Press ENTER when you are ready.")
input()

def startClubHub():

	print(datetime.datetime.utcnow(), "Starting Club Hub...")

	#Move to first workspace
	k.press_key(k.super_l_key)
	k.tap_key(k.home_key)
	k.release_key(k.super_l_key)

	for cc in chromecasts:
		m.click(pagetop[0], pagetop[1], 1)
		time.sleep(1)
		m.click(chromecast_button[0], chromecast_button[1], 1)
		time.sleep(2)
		m.click(cc[0], cc[1], 1)
		time.sleep(10)

		#Move to next workspace
		k.press_key(k.control_l_key)
		k.press_key(k.alt_l_key)
		k.tap_key(k.down_key)
		k.release_key(k.control_l_key)
		k.release_key(k.alt_l_key)

	#Move to first workspace
	k.press_key(k.super_l_key)
	k.tap_key(k.home_key)
	k.release_key(k.super_l_key)

	print("Done!")

def stopClubHub():

	print(datetime.datetime.utcnow(), "Stopping Club Hub...")
	
	#Move to first workspace
	k.press_key(k.super_l_key)
	k.tap_key(k.home_key)
	k.release_key(k.super_l_key)

	for cc in chromecasts:
		m.click(pagetop[0], pagetop[1], 1)
		time.sleep(1)
		m.click(chromecast_button[0], chromecast_button[1], 1)
		time.sleep(2)
		m.click(stop_button[0], stop_button[1], 1)
		time.sleep(2)
	
		#Move to next workspace
		k.press_key(k.control_l_key)
		k.press_key(k.alt_l_key)
		k.tap_key(k.down_key)
		k.release_key(k.control_l_key)
		k.release_key(k.alt_l_key)

	#Move to first workspace
	k.press_key(k.super_l_key)
	k.tap_key(k.home_key)
	k.release_key(k.super_l_key)

	print("Done!")

startClubHub()
while True:
	time.sleep(3600)
	stopClubHub()
	startClubHub()
	
