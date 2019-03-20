#!/bin/bash
cd assets/images
rm -rf sdtdIcons/

LOCATION=$(curl -s https://api.github.com/repos/CatalysmsServerManager/7dtd-icons/releases/latest \
| grep "tag_name" \
| awk '{print "https://github.com/CatalysmsServerManager/7dtd-icons/releases/download/" substr($2, 2, length($2)-3) "/sdtdIcons.tar.gz"}') \
; echo "Downloading icons from $LOCATION" \
; curl -L -o icons.tar.gz "$LOCATION" \
; tar -xzf icons.tar.gz sdtdIcons  \
; rm icons.tar.gz \