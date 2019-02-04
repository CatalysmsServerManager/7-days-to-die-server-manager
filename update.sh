#!/bin/bash

# Pulls new changes from git & restarts pm2 instance

git pull && pm2 restart csmm
