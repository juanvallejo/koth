#!/usr/bin/env python

import sys
import os.path as path

# check if not enough args
if len(sys.argv) < 3:
	print "Usage: xor.py filepart1 filepart2"
	exit(1)

file1 = sys.argv[1]
file2 = sys.argv[2]

if not path.isfile(file1) or not path.isfile(file2):
	print "Invalid path to file."
	print "Usage: xor.py filepart1 filepart2"
	exit(1)

file1_text = open(file1).read()
file2_text = open(file2).read()
index = 0

f1_xor_f2_text = ''

for f1_char in file1_text:
	f1_xor_f2_text += chr(ord(f1_char) ^ ord(file2_text[index]))
	index += 1
	if index >= len(file2_text):
		index = 0

print f1_xor_f2_text