#!/bin/bash
# ClubHub Hub Setup Script
# Written for Raspbian

echo "Installing Club Hub Hub version 3.1.1."

# Update packages
echo "Updating packages..."
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install chromium-browser -y

# Install run script
echo "Installing run script..."
cp ./runclubhub.sh /home/pi/

# Configure autostart
echo "Configuring autostart..."
echo -e "\n@/home/pi/runclubhub.sh" >> ~/.config/lxsession/LXDE-pi/autostart

# Setup NTP
echo "Setting up NTP..."
sudo cp ntp.imsa.conf /etc/ntp.conf
sudo systemctl stop ntp
sudo ntpd -qg
sudo systemctl start ntp

# Prompt user to setup timezone
echo "Installation is complete! All that's left to do is to configure Club Hub's timezone."
echo "When you are ready, the Club Hub website will open. Select your timezone there."
echo "It may take some time for NTP to set the correct time on the Raspberry Pi..."
echo "If you get SSL errors, just keep refreshing until it works."
read -rsp "Press any key to continue..." -n1 key

chromium-browser https://clubhub.live

# Remind user to restart!
echo "You're all done! Don't forget to restart to allow changes to take effect.
