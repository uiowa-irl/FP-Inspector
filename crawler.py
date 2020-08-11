from __future__ import absolute_import
import os
from six.moves import range
import crawl_utils as cu
from automation import CommandSequence, TaskManager
import sys

def crawl_data(number_of_browsers = 1, exit_crawl_after = 5, slice_end = 1000000):
    NUM_BROWSERS = number_of_browsers
    SITES = ['http://' + x for x in cu.sample_top_sites(
                                location=os.path.expanduser('~/Desktop/'), 
                                slices=[(10000, 0, 10000), (10000, 10000, slice_end)])]

    manager_params, browser_params = TaskManager.load_default_params(NUM_BROWSERS)

    for i in range(NUM_BROWSERS):
        browser_params[i]['cookie_instrument'] = True
        browser_params[i]['js_instrument'] = True
        browser_params[i]['save_javascript'] = True
        browser_params[i]['http_instrument'] = True
        browser_params[i]['headless'] = True
        browser_params[i]['disable_flash'] = False
        browser_params[i]['save_documents'] = True
        browser_params[i]['caching_disabled'] = True

    manager_params['data_directory'] = '~/Desktop/'
    manager_params['log_directory'] = '~/Desktop/'

    count = 0
    manager = TaskManager.TaskManager(manager_params, browser_params)

    for site in SITES[0:exit_crawl_after]:
        command_sequence = CommandSequence.CommandSequence(site, reset=True)
        command_sequence.get(sleep=10, timeout=60)
        command_sequence.scroll_page()
        command_sequence.recursive_dump_page_source()
        manager.execute_command_sequence(command_sequence)
    
        count += 1
        if count % 1000 == 0:
            print "Total crawled: ", count
    manager.close()


if __name__ == "__main__":
    # print command line arguments
    num_of_browsers, exit_crawl_after, slice_end = int(sys.argv[1]), int(sys.argv[2]), int(sys.argv[3]) 
    crawl_data(num_of_browsers, exit_crawl_after, slice_end)