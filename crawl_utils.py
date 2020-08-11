""" A collection of utilities for crawl scripts """
from StringIO import StringIO
import requests
import zipfile
import random
import shutil
import json
import glob
import os

ALEXA_LIST = 'http://s3.amazonaws.com/alexa-static/top-1m.csv.zip'

def get_top_1m(location):
    """
    Returns list of top 1 million sites. If no list exists
    for the current day, a new one is fetched
    @param location lists where raw list is cached
    """
    location = os.path.expanduser(location)
    site_list = os.path.join(location, 'top-1m.csv')
    if not os.path.isfile(site_list):
        print("%s does not exist, downloading a copy." % site_list)
        resp = requests.get(ALEXA_LIST)
        with zipfile.ZipFile(StringIO(resp.content), 'r') as zpf:
            contents = zpf.read(zpf.infolist()[0])
        if not os.path.isdir(location):
            os.makedirs(location)
        with open(site_list, 'w') as f:
            f.write(contents)
    else:
        with open(site_list, 'r') as f:
            contents = f.read()

    return [x.split(',')[-1] for x in contents.split('\n')]


def get_sampled_sites(location, include_rank=False,
                      slices=[(10000, 0, 10000),
                              (10000, 10000, 100000),
                              (15000, 100000, 1000000)]):
    location = os.path.expanduser(location)
    site_list = os.path.join(location, 'sampled_sites.json')

    # If sampled site list exists, read and return it
    if os.path.isfile(site_list):
        with open(site_list, 'r') as f:
            return json.load(f)

    # If not, create it and return it
    if not os.path.isdir(location):
        os.makedirs(location)
    sites = sample_top_sites(location, include_rank, slices)
    with open(site_list, 'w') as f:
        json.dump(sites, f)
    return sites


def sample_top_sites(location, include_rank=False,
                     slices=[(10000, 0, 10000),
                             (10000, 10000, 100000),
                             (15000, 100000, 1000000)]):
    """
    Returns a subsample of sites from the top 1 million given by `slices`

    Parameters
    ----------
    location : str
        Location of top 1 million site list. If the list does not exist at this
        location it will be downloaded.
    include_rank : bool
        Indicates whether or not to include the alexa rank in the output sample
    slices : list of tuples
        List of slices to sample. Each slice should be given as follows:
        (# of sites, start_index, end_index)

    Returns
    -------
    list of str or list of tuples
        List of URLs sampled from the top 1m according to `slices`. If
        `include_rank` is True, this returns of list of `(int: rank, str: url)`
    """
    location = os.path.expanduser(location)
    top_1m = get_top_1m(location)
    if include_rank:
        top_1m = zip(range(len(top_1m)), top_1m)
    sites = list()
    for sl in slices:
        sites.extend(random.sample(top_1m[sl[1]:sl[2]], sl[0]))
    return sites


def clear_tmp_folder():
    """
    Clear the tmp folder of directories / files that
    may have been missed during cleanup.
    """
    tmpfiles = glob.glob('/tmp/tmp*')
    for tmpfile in tmpfiles:
        try:
            shutil.rmtree(tmpfile)
        except OSError:
            pass
    tmpfiles = glob.glob('/tmp/.X*-lock')
    for tmpfile in tmpfiles:
        try:
            os.remove(tmpfile)
        except OSError:
            pass
