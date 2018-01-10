#!/bin/bash
# Script gets called by CI to auto update.
git pull
tmux kill-session