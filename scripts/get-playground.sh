#!/bin/sh
set -e

PLAYGROUND_VERSION="${PLAYGROUND_VERSION:-latest}" 
TMP_FILE=playground.zip

printHeader() {
    printf '%s\n' ""
    printf '%s\n' "##################"
    printf '%s\n' "$1"
    printf '%s\n' "##################"
    printf '%s\n' ""
}

downloadRelease() {
    curl $1 -SsL -o $TMP_FILE
}

if hash jq 2>/dev/null; then
    echo "Dependencies OK."
else
    echo "jq must be installed. apt-get install jq"
    exit 1
fi

printHeader "Installing the custom commands playground"

API_RESPONSE=$(curl -s https://api.github.com/repos/CatalysmsServerManager/custom-commands-playground/releases)
DL_URL=$(echo $API_RESPONSE | jq -r --arg PLAYGROUND_VERSION "$PLAYGROUND_VERSION" '.[] | select(.tag_name | contains($PLAYGROUND_VERSION)) .assets[0].browser_download_url')


printHeader "Downloading version: $PLAYGROUND_VERSION - $DL_URL"

downloadRelease $DL_URL

unzip $TMP_FILE
rm $TMP_FILE

rm -fr assets/playground
mv build assets/playground

printHeader "Finished! ヽ(´▽\`)/"
