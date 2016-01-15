#!/usr/bin/python
import os
from os import listdir
from os.path import isfile, join, expanduser
import shutil
from shutil import make_archive
import datetime
import time
from datetime import date

# boto for s3
import boto
import boto.s3
import sys
from boto.s3.key import Key

# Defined Globals for S3
AWS_ACCESS_KEY_ID = 'AKIAIQSM7UI3EBM4OL4A'
AWS_SECRET_ACCESS_KEY = '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'
AWS_BUCKET_NAME = 'hmsedxplatformdataoutput'
PROD_NAME = 'prod0'
AWS_BUCKET_FOLDER = '/logs'

'''
Update log function
- use timestamp provided and set input to the file
'''
def update_log(last_entry, logfilePath):
	mode = 'w' if os.path.exists(logfilePath) else 'w'
	with open(logfilePath, mode) as f:
		f.write(last_entry)

# First Time archive - compress everything
def createFirstTimeArchive(last_entry, dir_path, destination_temp_path):
	if not os.path.exists(destination_temp_path):
		os.makedirs(destination_temp_path)

	archive_name = PROD_NAME + '-firstRunArchive-to-'

	now = datetime.datetime.now()
	last_entry = now.strftime("%Y%m%d")

	archive_name = archive_name + str(last_entry)

	# create a archive inside the tracking folder
	archive = os.path.expanduser(os.path.join(dir_path, archive_name))
	try:
		make_archive(archive, 'gztar', dir_path)
	except Exception, e:
		print e

	try:
		shutil.rmtree(destination_temp_path)
	except Exception, e:
		print e

	# return last_entry and the archive name
	return last_entry, archive_name, archive


def createDailyArchive(last_entry, dir_path, destination_temp_path):
	archive_name = PROD_NAME + 'dailyArchive-'
	
	# Find the files which are corresponding to that of what we need - timestamp
	scanFolderForSelectedFiles(last_entry, dir_path, destination_temp_path)

	archive_name = archive_name + str(last_entry)

	archive = os.path.expanduser(os.path.join(dir_path, archive_name))
	try:
		make_archive(archive, 'gztar', destination_temp_path)
	except Exception, e:
		print e

	# remove the files from the temp directory - empty it
	try:
		shutil.rmtree(destination_temp_path)
	except Exception, e:
		print e
	now = datetime.datetime.now()
	new_time = now - datetime.timedelta(days=1)
	last_entry = new_time.strftime("%Y%m%d")
	return last_entry, archive_name, archive

"""
Scan folder for selected files - copy them to the TEMP location
"""
def scanFolderForSelectedFiles(last_entry, dir_path, destination_temp_path):
	# create a temp directory to load files into
	if not os.path.exists(destination_temp_path):
		os.makedirs(destination_temp_path)
	# create name of the file we are looking for
	for name in os.listdir(dir_path):
		if os.path.isfile(os.path.join(dir_path, name)):
			if last_entry in name or name == 'tracking.log':
				src_file_name = os.path.join(dir_path, name)
				dest_file_name = os.path.join(destination_temp_path, name)
				#shutil.copyfile (src_file_name, dest_file_name)
				shutil.copy(src_file_name, destination_temp_path)


"""
Upload to S3 Bucket
- upload compressed file from local filesystem to the defined s3 Bucket
- need to provide credentials or just use the configuration already placed in the edx
"""
def uploadToS3Bucket(compressed_file_name, file_location_full):
	src_file_name = compressed_file_name + '.tar.gz'
	src_file_path = file_location_full + '.tar.gz'
	try:
		conn = boto.connect_s3(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
		bucket = conn.get_bucket(AWS_BUCKET_NAME)
		full_key_name = os.path.join(AWS_BUCKET_FOLDER, src_file_name)
		#k = Key(bucket)
		k = bucket.new_key(full_key_name)
		# key is the filename under which is saved
		#k.key = src_file_name
		#key = boto.s3.key.Key(bucket, compressed_file_name)
		k.set_contents_from_filename(src_file_path)
		print "file uploaded"
		# need to check if file is uploaded - check what is the response code
		# after success remove the compressed file
		os.remove(src_file_path)
		print "file removed"
	except Exception, e:
		print e

"""
Just The local DEV to print everything out on the localdir
"""
def uploadToLocalDir(compressed_file_name, file_location_full, destination_path):
	src_file_name = file_location_full + '.tar.gz'
	dest_file_name = destination_path + compressed_file_name + '.tar.gz'
	print src_file_name
	print dest_file_name
	try:
		shutil.copyfile(src_file_name, dest_file_name)
		print "file uploaded"
		os.remove(src_file_name)
	except Exception, e:
		print e

"""
DEV

# log file for cron
logfilePath = '/Users/engine-1/Documents/localCron/crontext.txt'

# file paths configurations
dir_path = '/Users/engine-1/Documents/localCron/tracking/'
destination_temp_path = '/Users/engine-1/Documents/localCron/tracking/tempLog/'
destination_path = '/Users/engine-1/Documents/localCron/cronNewLocation/'
"""

"""
DEV-PROD
"""

logfilePath = '/tmp/tracking/lastTrackingCron.txt'
dir_path = '/edx/var/log/tracking/'
destination_temp_path = '/tmp/tracking/tempLog/'
root_temp_path ='/tmp/tracking/'

"""
Local variables set
is_first_run - checks if this is the first run of the cron
last_entry - variable which holds date of the last entry
"""
# set flag for the first run
is_first_run = False
# set last run
last_entry = ""


'''
Log file check
- read file, check the line for date check
'''
if not os.path.exists(root_temp_path):
	os.makedirs(root_temp_path)

# check if log file exist
if not os.path.exists(logfilePath):
	os.open(logfilePath, os.O_CREAT)
else:
	log_file = open(logfilePath)
	file_content = log_file.read()
	if file_content == "":
		is_first_run = True
	else:
		last_entry = file_content

"""
Main run part
- create archive
- create new timestamp
- update_log
"""
# activate for the first run
if is_first_run == True :
	## create necesary directories

	# generate timestamp
	last_entry, archive_name, archive_full_path = createFirstTimeArchive(last_entry, dir_path, destination_temp_path)
	# update last_entry in log file
	uploadToS3Bucket(archive_name, archive_full_path)
	#uploadToLocalDir(archive_name, archive_full_path, destination_path)
	update_log(last_entry, logfilePath)
	print archive_name
	print "First Creation Done"
else:
	# create new day archive
	last_entry, archive_name, archive_full_path = createDailyArchive(last_entry, dir_path, destination_temp_path)
	# update last_entry on the file
	uploadToS3Bucket(archive_name, archive_full_path)
	#uploadToLocalDir(archive_name, archive_full_path, destination_path)
	update_log(last_entry, logfilePath)
	print archive_name
	print "Daily archive done"
