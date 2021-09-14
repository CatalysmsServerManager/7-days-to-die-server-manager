#!/bin/sh
set -ex
rm -rf assets/images/sdtdIcons/
mkdir -p assets/images/sdtdIcons/
curl -qsL https://github.com/CatalysmsServerManager/7dtd-icons/releases/latest/download/sdtdIcons.tar.gz | tar xzf - -C assets/images
