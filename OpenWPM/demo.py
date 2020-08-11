from __future__ import absolute_import
from six.moves import range
from automation import CommandSequence, TaskManager
import time

# The list of sites that we wish to crawl
NUM_BROWSERS = 3

# sites = ['https://www.gamesgames.com/game/moto-x3m-5-pool-party',
#         'https://www.google.com/',
#         'https://www.youtube.com',
#         'https://www.facebook.com',
#         'https://www.baidu.com',
#         'https://www.wikipedia.com',
#         'https://www.qq.com',
#         'https://www.taobao.com',
#         'https://www.tmall.com',
#         'https://www.amazon.com',
#         'https://www.yahoo.com']

sites = ['https://www.google.com/', 'https://www.youtube.com', 'https://www.facebook.com']
# sites = ['http://0.0.0.0:8000/canvas_fingerprinting.html', 'http://0.0.0.0:8000/eventhandlers_page.html']

# Loads the manager preference and 3 copies of the default browser dictionaries
manager_params, browser_params = TaskManager.load_default_params(NUM_BROWSERS)

# Update browser configuration (use this for per-browser settings)
for i in range(NUM_BROWSERS):
    # Enable flash for all three browsers
    browser_params[i]['disable_flash'] = False
    browser_params[i]['cookie_instrument'] = True
    browser_params[i]['js_instrument'] = True
    browser_params[i]['save_javascript'] = True
    browser_params[i]['http_instrument'] = True
    browser_params[i]['headless'] = True
    browser_params[i]['save_documents'] = True
    browser_params[i]['caching_disabled'] = True

# Update TaskManager configuration (use this for crawl-wide settings)
manager_params['data_directory'] = '~/Desktop/'
manager_params['log_directory'] = '~/Desktop/'

# Instantiates the measurement platform
# Commands time out by default after 60 seconds
manager = TaskManager.TaskManager(manager_params, browser_params)

# Visits the sites with all browsers simultaneously
for site in sites:
    command_sequence = CommandSequence.CommandSequence(site, reset=True)

    # Start by visiting the page
    command_sequence.get(sleep=10, timeout=60)
    command_sequence.scroll_page()
    command_sequence.recursive_dump_page_source()

    # dump_profile_cookies/dump_flash_cookies closes the current tab.
    command_sequence.dump_profile_cookies()
    # index='**' synchronizes visits between the three browsers
    manager.execute_command_sequence(command_sequence)

# time.sleep(100000)
# Shuts down the browsers and waits for the data to finish logging
manager.close()
