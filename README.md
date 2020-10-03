# FP-Inspector
Artifact release for our IEEE Symposium on Security and Privacy 2021 paper entitled Fingerprinting the Fingerprinters: Learning to Detect Browser Fingerprinting Behaviors


## Data Collection
We use OpenWPM to collect script contents and their execution traces.  

### Collecting script contents
We collect script contents by extending OpenWPM's network monitoring instrumentation. By default, this instrumentation saves the contents of all HTTP responses that are loaded into script tags. We extend OpenWPM to also capture the response content for all HTML documents loaded by the browser. This allows us to capture both external and inline JavaScript. We further parse the HTML documents to extract inline scripts. This detail is crucial because a vast majority of webpages use inline scripts [[1]](https://www.kapravelos.com/publications/jsinclusions-CCS12.pdf) [[2]](https://arxiv.org/pdf/1811.00918.pdf).

### Collecting script execution traces
We collect script execution traces by extending OpenWPM's script execution instrumentation. OpenWPM records the name of the Javascript API being accessed by a script, the method name or property name of the access, any arguments passed to the method or values set or returned by the property, and the stack trace at the time of the call. By default, OpenWPM only instruments a limited number of the JavaScript APIs that are known to be used by fingerprinting scripts. We extend OpenWPM script execution instrumentation to cover additional APIs and script interactions that we expect to provide useful information for differentiating fingerprinting activity from non-fingerprinting activity. There is no canonical list of fingerprintable APIs, and it is not performant to instrument the entire API surface exposed by the browser. In light of these constraints, we extended the set of APIs instrumented by OpenWPM to cover several additional APIs used by popular fingerprinting libraries (i.e., [fingerprintjs2](https://github.com/fingerprintjs/fingerprintjs2)) and scripts (i.e., [MediaMath's fingerprinting script] (https://www.mediamath.com/)). These include the Web Graphics Library `WebGL` and `performance.now`, both of which were previously not monitored by OpenWPM. We also instrument a number of APIs used for Document Object Model (DOM) interactions, including the `createElement` method and the `document` and `node` objects. Monitoring access to these APIs allows us to differentiate between scripts that interact with the DOM and those that do not. The full set of APIs monitored by our extended version of OpenWPM in Appendix A [Extensions to OpenWPM JavaScript instrumentation](https://umariqbal.com/papers/fpinspector-sp2021.pdf) of the paper.

Our modifications to OpenWPM are available in the [OpenWPM](https://github.com/uiowa-irl/FP-Inspector/tree/master/OpenWPM) directory.


## Fingerprinting Mitigation
We implement the countermeasures listed in Section III-B of the [paper](https://umariqbal.com/papers/fpinspector-sp2021.pdf) in a browser extension to evaluate their breakage. The browser extension contains the countermeasures as options that can be selected one at a time. For API restriction, we override functions and properties of fingerprinting APIs and return an error message when they are accessed on any webpage. For targeted API restriction, we extract a script's domain by traversing the stack each time the script makes a call to one of the fingerprinting APIs. We use FP-Inspector's classifier determinations to create a domain-level (eTLD+1, which matches Disconnect's fingerprinting list used by Firefox) filter list. For request blocking, we use the `webRequest` API to intercept and block outgoing web requests that match our filter list. We extend [Cliqz content blocking library](https://github.com/cliqz-oss/adblocker) to implement request blocking. 

Our prototype extension is available in the [coming soon]() directory.


## Detections and Discoveries
We find several domains that serve fingerprinting scripts and detect several JavaScript APIs that were previously unknown to be used for fingerprinting. We release both fingerprinting domains and fingerprinting APIs. The list of domains serving fingerprinting scripts is available [here](https://github.com/uiowa-irl/FP-Inspector/blob/master/Data/fingerprinting_domains.json) and the table of API keywords that are potentially used for fingerprinting [here](https://github.com/uiowa-irl/FP-Inspector/blob/master/Data/potential_fingerprinting_APIs.md). 

**The list of domains serving fingerprinting scripts follow the following format:**

```
    "hash": [
        {
            "script_url": "https://www.tracker.com/script.js",
            "top_url": "https://www.website.com/"
        }
    ]
```

**Table of API keywords that are potentially used for fingerprinting follow the following format:**

API Keywords | Ratio | Scripts (count) | Websites (count)
------------ | ------------- | ------------- | -------------
example_api | count(FP scripts) / count(NON-FP scripts) | Number of scripts | Number of websites 


### Bug Reports
We also report discoveries made by FP-Inspector to popular filter lists and browser vendors. We report the discovered domains serving fingerprinting scripts to [Easylsit/EasyPrivacy](https://easylist.to/) and [Disconnect](https://disconnect.me/). We report previously unknown APIs that are potentially used for fingerprinting to browser vendors. 


### Bug reports to filter lists 
Below we list some of our bug reports to filter lists. 

1. Issues reported to [Easylist/EasyPrivacy](https://github.com/easylist/easylist/issues/created_by/UmarIqbal)
2. Issues reported to [Disconnect](https://github.com/disconnectme/disconnect-tracking-protection/issues/created_by/UmarIqbal)
3. Bulk reports to [Fanboy](https://github.com/ryanbr) &mdash; who was extremely helpful to add them to EasyPrivacy. 
5. Issues reported to DuckDuckGo

> As a result of our reports to filter lists, EasyPrivacy has created a new category for fingerprinting in their filter list. Our findings to EasyPrivacy can be seen under the category `! Fingerprinting` in the [list](https://easylist.to/easylist/easyprivacy.txt).

### Bug reports to browser vendors 
Below we list some of our bug reports to browser vendors.

1. Issues reported to [Mozilla Firefox](https://bugzilla.mozilla.org/buglist.cgi?email1=umar-iqbal&classification=Components&resolution=---&query_format=advanced&emailreporter1=1&emailtype1=substring)


*Feel free to contact [Umar Iqbal](https://www.umariqbal.com) if you run into any problems running the code or if you generally have questions about FP-Inspector.*


## Reference

**Fingerprinting the Fingerprinters: Learning to Detect Browser Fingerprinting Behaviors**
Umar Iqbal, Steven Englehardt, Zubair Shafiq  
*IEEE Symposium on Security & Privacy (S&P), 2021*

**Abstract** &mdash; Browser fingerprinting is an invasive and opaque stateless tracking technique. Browser vendors, academics, and standards bodies have long struggled to provide meaningful protections against browser fingerprinting that are both accurate and do not degrade user experience. We propose FP-Inspector, a machine learning based syntactic-semantic approach to accurately detect browser fingerprinting. We show that FP-Inspector performs well, allowing us to detect 26% more fingerprinting scripts than the state-of-the-art. We show that an API-level fingerprinting countermeasure, built upon FP-Inspector, helps reduce website breakage by a factor of 2. We use FP-Inspector to perform a measurement study of browser fingerprinting on top-100K websites. We find that browser fingerprinting is now present on more than 10% of the top-100K websites and over a quarter of the top-10K websites. We also discover previously unreported uses of JavaScript APIs by fingerprinting scripts suggesting that they are looking to exploit  APIs in new and unexpected ways.

**For more details please check our [full paper](https://umariqbal.com/papers/fpinspector-sp2021.pdf)**

