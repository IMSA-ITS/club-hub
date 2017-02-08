#!/bin/bash
# Club Hub autostart script
echo "Welcome to Club Hub Hub version 3.1.1!"
echo "Synchronizing time..."
sudo systemctl stop ntp
sudo ntpd -g
sudo systemctl start ntp
echo "Starting Club Hub..."
chromium-browser --start-fullscreen https://clubhub.live/present
echo "Done."
