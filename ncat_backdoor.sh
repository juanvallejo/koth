#!/usr/bin/env sh

# only two files will be xor.py and bshift_left.py
# participants will have to figure out to to find
# two pieces of a file and xor them together to find
# hidden path to the hill

# run ncat server, spawning bash sub-process
ncat --listen -k 0.0.0.0 -e "/bin/bash" 2>&1