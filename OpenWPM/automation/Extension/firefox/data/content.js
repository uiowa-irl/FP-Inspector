
function getPageScript() {
  // Intrumentation injection code is based on privacybadgerfirefox
  // https://github.com/EFForg/privacybadgerfirefox/blob/master/data/fingerprinting.js

  // code below is not a content script: no Firefox APIs should be used

  // return a string
  return "(" + function () {
    // from Underscore v1.6.0
    function debounce(func, wait, immediate) {
      var timeout, args, context, timestamp, result;

      var later = function () {
        var last = Date.now() - timestamp;
        if (last < wait) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) {
            result = func.apply(context, args);
            context = args = null;
          }
        }
      };

      return function () {
        context = this;
        args = arguments;
        timestamp = Date.now();
        var callNow = immediate && !timeout;
        if (!timeout) {
          timeout = setTimeout(later, wait);
        }
        if (callNow) {
          result = func.apply(context, args);
          context = args = null;
        }

        return result;
      };
    }
    // End of Debounce

    // messages the injected script
    var send = (function () {
      var messages = [];
      // debounce sending queued messages
      var _send = debounce(function () {
        document.dispatchEvent(new CustomEvent(event_id, {
          detail: messages
        }));

        // clear the queue
        messages = [];
      }, 100);

      return function (msgType, msg) {
        // queue the message
        messages.push({'type':msgType,'content':msg});
        _send();
      };
    }());

    var event_id = document.currentScript.getAttribute('data-event-id');

    /*
     * Instrumentation helpers
     */

    var testing = document.currentScript.getAttribute('data-testing') === 'true';
    console.log("Currently testing?",testing);

    // Recursively generates a path for an element
    function getPathToDomElement(element, visibilityAttr=false) {
      if(element == document.body)
        return element.tagName;
      if(element.parentNode == null)
        return 'NULL/' + element.tagName;

      var siblingIndex = 1;
      var siblings = element.parentNode.childNodes;
      for (var i = 0; i < siblings.length; i++) {
        var sibling = siblings[i];
        if (sibling == element) {
          var path = getPathToDomElement(element.parentNode, visibilityAttr);
          path += '/' + element.tagName + '[' + siblingIndex;
          path += ',' + element.id;
          path += ',' + element.className;
          if (visibilityAttr) {
            path += ',' + element.hidden;
            path += ',' + element.style.display;
            path += ',' + element.style.visibility;
          }
          if(element.tagName == 'A')
            path += ',' + element.href;
          path += ']';
          return path;
        }
        if (sibling.nodeType == 1 && sibling.tagName == element.tagName)
          siblingIndex++;
      }
    }

    // Helper for JSONifying objects
    function serializeObject(object, stringifyFunctions=false) {

      // Handle permissions errors
      try {
        if(object == null)
          return "null";
        if(typeof object == "function") {
          if (stringifyFunctions)
            return object.toString();
          else
            return "FUNCTION";
        }
        if(typeof object != "object")
          return object;
        var seenObjects = [];
        return JSON.stringify(object, function(key, value) {
          if(value == null)
            return "null";
          if(typeof value == "function") {
            if (stringifyFunctions)
              return value.toString();
            else
              return "FUNCTION";
          }
          if(typeof value == "object") {
            // Remove wrapping on content objects
            if("wrappedJSObject" in value) {
              value = value.wrappedJSObject;
            }

            // Serialize DOM elements
            if(value instanceof HTMLElement)
              return getPathToDomElement(value);

            // Prevent serialization cycles
            if(key == "" || seenObjects.indexOf(value) < 0) {
              seenObjects.push(value);
              return value;
            }
            else
              return typeof value;
          }
          return value;
        });
      } catch(error) {
        console.log("SERIALIZATION ERROR: " + error);
        return "SERIALIZATION ERROR: " + error;
      }
    }

    function logErrorToConsole(error) {
      console.log("Error name: " + error.name);
      console.log("Error message: " + error.message);
      console.log("Error filename: " + error.fileName);
      console.log("Error line number: " + error.lineNumber);
      console.log("Error stack: " + error.stack);
    }

    // Helper to get originating script urls
    function getStackTrace() {
      var stack;

      try {
        throw new Error();
      } catch (err) {
        stack = err.stack;
      }

      return stack;
    }

    // from http://stackoverflow.com/a/5202185
    String.prototype.rsplit = function(sep, maxsplit) {
      var split = this.split(sep);
      return maxsplit ? [split.slice(0, -maxsplit).join(sep)].concat(split.slice(-maxsplit)) : split;
    }

    function getOriginatingScriptContext(getCallStack=false) {
      var trace = getStackTrace().trim().split('\n');
      // return a context object even if there is an error
      var empty_context = {scriptUrl: "",scriptLine: "",
                           scriptCol: "", funcName: "",
                           scriptLocEval: "", callStack: "" };
      if (trace.length < 4) {
        return empty_context;
      }
      // 0, 1 and 2 are OpenWPM's own functions (e.g. getStackTrace), skip them.
      var callSite = trace[3];
      if (!callSite){
        return empty_context;
      }
      /*
       * Stack frame format is simply: FUNC_NAME@FILENAME:LINE_NO:COLUMN_NO
       *
       * If eval or Function is involved we have an additional part after the FILENAME, e.g.:
       * FUNC_NAME@FILENAME line 123 > eval line 1 > eval:LINE_NO:COLUMN_NO
       * or FUNC_NAME@FILENAME line 234 > Function:LINE_NO:COLUMN_NO
       *
       * We store the part between the FILENAME and the LINE_NO in scriptLocEval
       */
      try{
        var scriptUrl = "";
        var scriptLocEval = ""; // for eval or Function calls
        var callSiteParts = callSite.split("@");
        var funcName = callSiteParts[0] || '';
        var items = callSiteParts[1].rsplit(":", 2);
        var columnNo = items[items.length-1];
        var lineNo = items[items.length-2];
        var scriptFileName = items[items.length-3] || '';
        var lineNoIdx = scriptFileName.indexOf(" line ");  // line in the URL means eval or Function
        if (lineNoIdx == -1){
          scriptUrl = scriptFileName;  // TODO: sometimes we have filename only, e.g. XX.js
        }else{
          scriptUrl = scriptFileName.slice(0, lineNoIdx);
          scriptLocEval = scriptFileName.slice(lineNoIdx+1, scriptFileName.length);
        }
        var callContext = {
          scriptUrl: scriptUrl,
          scriptLine: lineNo,
          scriptCol: columnNo,
          funcName: funcName,
          scriptLocEval: scriptLocEval,
          callStack: getCallStack ? trace.slice(3).join("\n").trim() : ""
        };
        return callContext;
      } catch (e) {
        console.log("Error parsing the script context", e, callSite);
        return empty_context;
      }
    }

    // Counter to cap # of calls logged for each script/api combination
    var lowCapmaxLogCount = 50;
    var HighcapmaxLogCount = 500;
    var logCounter = new Object();
    // Define caps for symbols, not all symbols require 500 calls
    var highCapSymbols = ["CanvasRenderingContext2D.measureText", "CanvasRenderingContext2D.font"];

    function updateCounterAndCheckIfOver(scriptUrl, symbol) {
      var key = scriptUrl + '|' + symbol;
      if ((highCapSymbols.indexOf(symbol) === -1) && (key in logCounter) && (logCounter[key] >= lowCapmaxLogCount)) {
        return true;
      } 
      else if ((highCapSymbols.indexOf(symbol) > -1) && (key in logCounter) && (logCounter[key] >= HighcapmaxLogCount)) {
        return true;
      }
      else if (!(key in logCounter)) {
        logCounter[key] = 1;
      } else {
        logCounter[key] += 1;
      }
      return false;
    }

    // Prevent logging of gets arising from logging
    var inLog = false;

    // For gets, sets, etc. on a single value
    function logValue(instrumentedVariableName, value, operation, callContext, logSettings) {
      if(inLog)
        return;
      inLog = true;

      var overLimit = updateCounterAndCheckIfOver(callContext.scriptUrl, instrumentedVariableName);
      if (overLimit) {
        inLog = false;
        return;
      }

      var msg = {
        operation: operation,
        symbol: instrumentedVariableName,
        value: serializeObject(value, !!logSettings.logFunctionsAsStrings),
        scriptUrl: callContext.scriptUrl,
        scriptLine: callContext.scriptLine,
        scriptCol: callContext.scriptCol,
        funcName: callContext.funcName,
        scriptLocEval: callContext.scriptLocEval,
        callStack: callContext.callStack
      };

      try {
        send('logValue', msg);
      }
      catch(error) {
        console.log("Unsuccessful value log!");
        logErrorToConsole(error);
      }

      inLog = false;
    }

    var permittedEventHandlers = ["onfullscreenchange", "onvisibilitychange", "onblur", "onfocus", "oncanplay", "oncanplaythrough",
                                  "onchange", "onclick", "ondrag", "ondragend", "ondragenter", "ondragexit", "ondragleave", "ondragover",
                                  "ondragstart", "ondrop", "ondurationchange", "ongotpointercapture", "oninput", "onkeydown", "onkeypress",
                                  "onkeyup", "onload", "onmousedown", "onmouseenter", "onmouseleave", "onmousemove", "onmouseout", "onmouseover",
                                  "onmouseup", "onpause", "onplay", "onpointerdown", "onpointermove", "onpointermove", "onpointerup", "onpointercancel",
                                  "onpointerover", "onpointerout", "onpointerenter", "onpointerleave", "onreset", "onresize", "onscroll", "onselect",
                                  "onselectstart", "onselectionchange", "ontransitioncancel", "ontransitionend", "animationcancel", "animationend", 
                                  "animationiteration", "animationstart", "drag", "dragend", "dragenter", "dragexit", "dragleave", "dragover",
                                  "dragstart", "drop", "keydown", "keypress", "keyup", "gotpointercapture", "lostpointercapture", "pointercancel",
                                  "pointerdown", "pointerenter", "pointerleave", "pointerlockchange", "pointerlockerror", "pointermove", "pointerout",
                                  "pointerover", "pointerup", "touchcancel", "touchend", "touchmove", "touchstart", "transitioncancel", "transitionend",
                                  "transitionrun", "transitionstart"];
    
    var eventDispatchList = [];                              

    // For functions
    function logCall(instrumentedFunctionName, args, callContext, logSettings, originalObject) {
      if(inLog)
        return;
      inLog = true;

      var overLimit = updateCounterAndCheckIfOver(callContext.scriptUrl, instrumentedFunctionName);
      if (overLimit) {
        inLog = false;
        return;
      }

      try {
        // Convert special arguments array to a standard array for JSONifying
        var serialArgs = [ ];
        for(var i = 0; i < args.length; i++)
          serialArgs.push(serializeObject(args[i], !!logSettings.logFunctionsAsStrings));
        
        // Keep a list of events and their respective objects
        if (instrumentedFunctionName === "EventTarget.addEventListener"){
          console.log("event listeners objects" + ' , ' + serialArgs[0] + ' , ' + originalObject);
          eventDispatchList.push({'eventName' : serialArgs[0], 'object' : originalObject});
          // originalObject.dispatchEvent(new Event(serialArgs[0]));
        }

        // Only allow logging for releavnt events
        if ((instrumentedFunctionName === "EventTarget.addEventListener")  && (serialArgs.length > 0) && (permittedEventHandlers.indexOf(serialArgs[0]) === -1)){
          inLog = false;
          return;
        }

        var msg = {
          operation: "call",
          symbol: instrumentedFunctionName,
          args: serialArgs,
          value: "",
          scriptUrl: callContext.scriptUrl,
          scriptLine: callContext.scriptLine,
          scriptCol: callContext.scriptCol,
          funcName: callContext.funcName,
          scriptLocEval: callContext.scriptLocEval,
          callStack: callContext.callStack
        }
        send('logCall', msg);
      }
      catch(error) {
        console.log("Unsuccessful call log: " + instrumentedFunctionName);
        logErrorToConsole(error);
      }
      inLog = false;
    }

    // Rough implementations of Object.getPropertyDescriptor and Object.getPropertyNames
    // See http://wiki.ecmascript.org/doku.php?id=harmony:extended_object_api
    Object.getPropertyDescriptor = function (subject, name) {
      var pd = Object.getOwnPropertyDescriptor(subject, name);
      var proto = Object.getPrototypeOf(subject);
      while (pd === undefined && proto !== null) {
        pd = Object.getOwnPropertyDescriptor(proto, name);
        proto = Object.getPrototypeOf(proto);
      }
      return pd;
    };

    Object.getPropertyNames = function (subject, name) {
      var props = Object.getOwnPropertyNames(subject);
      var proto = Object.getPrototypeOf(subject);
      while (proto !== null) {
        props = props.concat(Object.getOwnPropertyNames(proto));
        proto = Object.getPrototypeOf(proto);
      }
      // FIXME: remove duplicate property names from props
      return props;
    };

    /*
     *  Direct instrumentation of javascript objects
     */

    function isObject(object, propertyName) {
      try {
        var property = object[propertyName];
      } catch(error) {
        return false;
      }
      if (property === null) { // null is type "object"
        return false;
      }
      return typeof property === 'object';
    }

    function instrumentObject(object, objectName, logSettings={}) {
      // Use for objects or object prototypes
      //
      // Parameters
      // ----------
      //   object : Object
      //     Object to instrument
      //   objectName : String
      //     Name of the object to be instrumented (saved to database)
      //   logSettings : Object
      //     (optional) object that can be used to specify additional logging
      //     configurations. See available options below.
      //
      // logSettings options (all optional)
      // -------------------
      //   propertiesToInstrument : Array
      //     An array of properties to instrument on this object. Default is
      //     all properties.
      //   excludedProperties : Array
      //     Properties excluded from instrumentation. Default is an empty
      //     array.
      //   logCallStack : boolean
      //     Set to true save the call stack info with each property call.
      //     Default is `false`.
      //   logFunctionsAsStrings : boolean
      //     Set to true to save functional arguments as strings during
      //     argument serialization. Default is `false`.
      //   preventSets : boolean
      //     Set to true to prevent nested objects and functions from being
      //     overwritten (and thus having their instrumentation removed).
      //     Other properties (static values) can still be set with this is
      //     enabled. Default is `false`.
      //   recursive : boolean
      //     Set to `true` to recursively instrument all object properties of
      //     the given `object`. Default is `false`
      //     NOTE:
      //       (1)`logSettings['propertiesToInstrument']` does not propagate
      //           to sub-objects.
      //       (2) Sub-objects of prototypes can not be instrumented
      //           recursively as these properties can not be accessed
      //           until an instance of the prototype is created.
      //   depth : integer
      //     Recursion limit when instrumenting object recursively.
      //     Default is `5`.
      var properties = logSettings.propertiesToInstrument ?
        logSettings.propertiesToInstrument : Object.getPropertyNames(object);
      for (var i = 0; i < properties.length; i++) {
        if (logSettings.excludedProperties &&
            logSettings.excludedProperties.indexOf(properties[i]) > -1) {
          continue;
        }
        // If `recursive` flag set we want to recursively instrument any
        // object properties that aren't the prototype object. Only recurse if
        // depth not set (at which point its set to default) or not at limit.
        if (!!logSettings.recursive && properties[i] != '__proto__' &&
            isObject(object, properties[i]) &&
            (!('depth' in logSettings) || logSettings.depth > 0)) {

          // set recursion limit to default if not specified
          if (!('depth' in logSettings)) {
            logSettings['depth'] = 5;
          }
          instrumentObject(object[properties[i]], objectName + '.' + properties[i], {
                'excludedProperties': logSettings['excludedProperties'],
                'logCallStack': logSettings['logCallStack'],
                'logFunctionsAsStrings': logSettings['logFunctionsAsStrings'],
                'preventSets': logSettings['preventSets'],
                'recursive': logSettings['recursive'],
                'depth': logSettings['depth'] - 1
          });
        }
        try {
          instrumentObjectProperty(object, objectName, properties[i], logSettings);
        } catch(error) {
          logErrorToConsole(error);
        }
      }
    }
    if (testing) {
      window.instrumentObject = instrumentObject;
    }

    // Log calls to a given function
    // This helper function returns a wrapper around `func` which logs calls
    // to `func`. `objectName` and `methodName` are used strictly to identify
    // which object method `func` is coming from in the logs
    function instrumentFunction(objectName, methodName, func, logSettings, originalObject) {
      return function () {
        var callContext = getOriginatingScriptContext(!!logSettings.logCallStack);
        logCall(objectName + '.' + methodName, arguments, callContext, logSettings, originalObject);
        return func.apply(this, arguments);
      };
    }

    // Log properties of prototypes and objects
    function instrumentObjectProperty(object, objectName, propertyName, logSettings={}) {

      // Store original descriptor in closure
      var propDesc = Object.getPropertyDescriptor(object, propertyName);
      if (!propDesc){
        console.error("Property descriptor not found for", objectName, propertyName, object);
        return;
      }

      // Instrument data or accessor property descriptors
      var originalGetter = propDesc.get;
      var originalSetter = propDesc.set;
      var originalValue = propDesc.value;

      // We overwrite both data and accessor properties as an instrumented
      // accessor property
      Object.defineProperty(object, propertyName, {
        configurable: true,
        get: (function() {
          return function() {
            var origProperty;
            var callContext = getOriginatingScriptContext(!!logSettings.logCallStack);

            // get original value
            if (originalGetter) { // if accessor property
              origProperty = originalGetter.call(this);
            } else if ('value' in propDesc) { // if data property
              origProperty = originalValue;
            } else {
              console.error("Property descriptor for",
                            objectName + '.' + propertyName,
                            "doesn't have getter or value?");
              logValue(objectName + '.' + propertyName, "",
                  "get(failed)", callContext, logSettings);
              return;
            }

            // Log `gets` except those that have instrumented return values
            // * All returned functions are instrumented with a wrapper
            // * Returned objects may be instrumented if recursive
            //   instrumentation is enabled and this isn't at the depth limit.
            if (typeof origProperty == 'function') {
              // `this` object here has is the one on which method/event is called
              return instrumentFunction(objectName, propertyName, origProperty, logSettings, this);
            } else if (typeof origProperty == 'object' &&
              !!logSettings.recursive &&
              (!('depth' in logSettings) || logSettings.depth > 0)) {
              return origProperty;
            } else {
              logValue(objectName + '.' + propertyName, origProperty,
                  "get", callContext, logSettings);
              return origProperty;
            }
          }
        })(),
        set: (function() {
          return function(value) {
            var callContext = getOriginatingScriptContext(!!logSettings.logCallStack);
            var returnValue;

            // Prevent sets for functions and objects if enabled
            if (!!logSettings.preventSets && (
                typeof originalValue === 'function' ||
                typeof originalValue === 'object')) {
              logValue(objectName + '.' + propertyName, value,
                  "set(prevented)", callContext, logSettings);
              return value;
            }

            // set new value to original setter/location
            if (originalSetter) { // if accessor property
              returnValue = originalSetter.call(this, value);
            } else if ('value' in propDesc) { // if data property
              inLog = true;
              if (object.isPrototypeOf(this)) {
                Object.defineProperty(this, propertyName, {
                  value: value
                });
              } else {
                originalValue = value;
              }
              returnValue = value;
              inLog = false;
            } else {
              console.error("Property descriptor for",
                            objectName + '.' + propertyName,
                            "doesn't have setter or value?");
              logValue(objectName + '.' + propertyName, value,
                  "set(failed)", callContext, logSettings);
              return value;
            }

            // log set
            logValue(objectName + '.' + propertyName, value,
                "set", callContext, logSettings);

            // return new value
            return returnValue;
          }
        })()
      });
    }

    /*
     * Start Instrumentation
     */
    // TODO: user should be able to choose what to instrument

    // Access to navigator properties
    var navigatorProperties = [ "appCodeName", "appName", "appVersion",
                                "buildID", "cookieEnabled", "doNotTrack",
                                "geolocation", "language", "languages",
                                "onLine", "oscpu", "platform", "product",
                                "productSub", "userAgent", "vendorSub",
                                "vendor", "javaEnabled", "permissions"];

    // Access to Navigator methods
    var navigatorPropertiesToInstrument = ["vibrate", "sendBeacon"];
    instrumentObject(
        window.Navigator.prototype,
        "Navigator",
        {'propertiesToInstrument': navigatorPropertiesToInstrument, 
        logCallStack: true}
    );

    navigatorProperties.forEach(function(property) {
      instrumentObjectProperty(window.navigator, "window.navigator", property, {
        logCallStack: true
      });
    });

    // Access to screen properties
    //instrumentObject(window.screen, "window.screen");
    // TODO: why do we instrument only two screen properties
    var screenProperties =  [ "pixelDepth", "colorDepth" ];
    screenProperties.forEach(function(property) {
      instrumentObjectProperty(window.screen, "window.screen", property, {
        logCallStack: true
      });
    });

    // Access to plugins
    var pluginProperties = [ "name", "filename", "description", "version", "length"];
      for (var i = 0; i < window.navigator.plugins.length; i++) {
      let pluginName = window.navigator.plugins[i].name;
      pluginProperties.forEach(function(property) {
        instrumentObjectProperty(
            window.navigator.plugins[pluginName],
            "window.navigator.plugins[" + pluginName + "]", property, {
              logCallStack: true
            });
      });
    }

    // Access to MIMETypes
    var mimeTypeProperties = [ "description", "suffixes", "type"];
    for (var i = 0; i < window.navigator.mimeTypes.length; i++) {
      let mimeTypeName = window.navigator.mimeTypes[i].type;
      mimeTypeProperties.forEach(function(property) {
        instrumentObjectProperty(
            window.navigator.mimeTypes[mimeTypeName],
            "window.navigator.mimeTypes[" + mimeTypeName + "]", property, {
              logCallStack: true
            });
      });
    }
    // Name, localStorage, and sessionsStorage logging
    // Instrumenting window.localStorage directly doesn't seem to work, so the Storage
    // prototype must be instrumented instead. Unfortunately this fails to differentiate
    // between sessionStorage and localStorage. Instead, you'll have to look for a sequence
    // of a get for the localStorage object followed by a getItem/setItem for the Storage object.
    var windowProperties = [ "name", "localStorage", "sessionStorage" ];
    windowProperties.forEach(function(property) {
      instrumentObjectProperty(window, "window", property, {
        logCallStack: true
      });
    });
    instrumentObject(window.Storage.prototype, "window.Storage", {
      logCallStack: true
    });

    // Access to document.cookie
    instrumentObjectProperty(window.document, "window.document", "cookie", {
      logCallStack: true
    });

    // Access to canvas
    instrumentObject(window.HTMLCanvasElement.prototype,"HTMLCanvasElement", {logCallStack: true});

    // var excludedProperties = [ "quadraticCurveTo", "lineTo", "transform",
    //                            "globalAlpha", "moveTo", "drawImage",
    //                            "setTransform", "clearRect", "closePath",
    //                            "beginPath", "canvas", "translate" ];
    instrumentObject(
        window.CanvasRenderingContext2D.prototype,
        "CanvasRenderingContext2D",
        {logCallStack: true}
    );

    // Access to webRTC
    instrumentObject(window.RTCPeerConnection.prototype,"RTCPeerConnection", {
      logCallStack: true
    });

    // Access to Audio API
    instrumentObject(window.AudioContext.prototype, "AudioContext", {
      logCallStack: true
    });
    instrumentObject(window.OfflineAudioContext.prototype, "OfflineAudioContext", {
      logCallStack: true
    });
    instrumentObject(window.OscillatorNode.prototype, "OscillatorNode", {
      logCallStack: true
    });
    instrumentObject(window.AnalyserNode.prototype, "AnalyserNode", {
      logCallStack: true
    });
    instrumentObject(window.GainNode.prototype, "GainNode", {
      logCallStack: true
    });
    instrumentObject(window.ScriptProcessorNode.prototype, "ScriptProcessorNode", {
      logCallStack: true
    });
    

    var includedWebGLProperties = [ "canvas", "drawingBufferWidth", "drawingBufferHeight", "getContextAttributes", "isContextLost", 
                                "scissor", "viewport", "activeTexture", "blendColor", "blendEquation", "blendEquationSeparate",
                                "blendFunc", "blendFuncSeparate", "clearColor", "clearDepth", "clearStencil", "colorMask", "cullFace",
                                "depthFunc", "depthMask", "depthRange", "disable", "enable", "frontFace", "getParameter", "getError",
                                "hint", "isEnabled", "lineWidth", "pixelStorei", "polygonOffset", "sampleCoverage", "stencilFunc", "stencilFuncSeparate",
                                "stencilMask", "stencilMaskSeparate", "stencilOp", "stencilOpSeparate", "bindBuffer", "bufferData", 
                                "bufferSubData", "createBuffer", "deleteBuffer", "getBufferParameter", "isBuffer", "bindFramebuffer", 
                                "checkFramebufferStatus", "createFramebuffer", "deleteFramebuffer", "framebufferRenderbuffer", 
                                "framebufferTexture2D", "getFramebufferAttachmentParameter", "isFramebuffer", "readPixels", "bindRenderbuffer",
                                "createRenderbuffer", "deleteRenderbuffer", "getRenderbufferParameter", "isRenderbuffer", "renderbufferStorage",
                                "bindTexture", "compressedTexImage2D", "compressedTexSubImage2D", "copyTexImage2D", "copyTexSubImage2D",
                                "createTexture", "deleteTexture", "generateMipmap", "getTexParameter", "isTexture", "texImage2D", "texSubImage2D",
                                "texParameterf", "texParameteri", "attachShader", "bindAttribLocation", "compileShader", "createProgram", "createShader",
                                "deleteProgram", "deleteShader", "detachShader", "getAttachedShaders", "getProgramParameter", "getProgramInfoLog",
                                "getShaderParameter", "getShaderPrecisionFormat", "getShaderInfoLog", "getShaderSource", "isProgram", "isShader",
                                "linkProgram", "shaderSource", "useProgram", "validateProgram", "disableVertexAttribArray", "enableVertexAttribArray",
                                "getActiveAttrib", "getActiveUniform", "getAttribLocation", "getUniform", "getUniformLocation", "getVertexAttrib", 
                                "getVertexAttribOffset", "uniform1f", "uniform1fv", "uniform1i", "uniform1iv", "uniform2f", "uniform2fv", "uniform2i",
                                "uniform2iv", "uniform3f", "uniform3fv", "uniform3i", "uniform3iv", "uniform4f", "uniform4fv", "uniform4i", "uniform4iv", 
                                "uniformMatrix2fv", "uniformMatrix3fv", "uniformMatrix4fv", "vertexAttrib1f", "vertexAttrib2f", "vertexAttrib3f", "vertexAttrib4f",
                                "vertexAttrib1fv", "vertexAttrib2fv", "vertexAttrib3fv", "vertexAttrib4fv", "vertexAttribPointer", "clear", "drawArrays",
                                "drawElements", "finish", "flush", "getSupportedExtensions", "getExtension"]

    // Access to WebGL
    instrumentObject(window.WebGLRenderingContext.prototype, "WebGLRenderingContext", {'propertiesToInstrument': includedWebGLProperties, logCallStack: true});
    instrumentObject(window.WebGL2RenderingContext.prototype, "WebGL2RenderingContext", {'propertiesToInstrument': includedWebGLProperties, logCallStack: true});

    instrumentObject(window.WebGLActiveInfo.prototype, "WebGLActiveInfo", {
      logCallStack: true
    });
    instrumentObject(window.WebGLBuffer.prototype, "WebGLBuffer", {
      logCallStack: true
    });
    instrumentObject(window.WebGLContextEvent.prototype, "WebGLContextEvent", {
      logCallStack: true
    });
    instrumentObject(window.WebGLFramebuffer.prototype, "WebGLFramebuffer", {
      logCallStack: true
    });
    instrumentObject(window.WebGLProgram.prototype, "WebGLProgram", {
      logCallStack: true
    });
    instrumentObject(window.WebGLQuery.prototype, "WebGLQuery", {
      logCallStack: true
    });
    instrumentObject(window.WebGLRenderbuffer.prototype, "WebGLRenderbuffer", {
      logCallStack: true
    });
    instrumentObject(window.WebGLSampler.prototype, "WebGLSampler", {
      logCallStack: true
    });
    instrumentObject(window.WebGLShader.prototype, "WebGLShader", {
      logCallStack: true
    });
    instrumentObject(window.WebGLShaderPrecisionFormat.prototype, "WebGLShaderPrecisionFormat", {
      logCallStack: true
    });
    instrumentObject(window.WebGLSync.prototype, "WebGLSync", {
      logCallStack: true
    });
    instrumentObject(window.WebGLTexture.prototype, "WebGLTexture", {
      logCallStack: true
    });
    instrumentObject(window.WebGLTransformFeedback.prototype, "WebGLTransformFeedback", {
      logCallStack: true
    });
    instrumentObject(window.WebGLUniformLocation.prototype, "WebGLUniformLocation", {
      logCallStack: true
    });
    instrumentObject(window.WebGLVertexArrayObject.prototype, "WebGLVertexArrayObject", {
      logCallStack: true
    });
    
    // Access to Animation
    instrumentObject(window.Animation.prototype, "Animation", {
      logCallStack: true
    });

    // Access to Node

    var excludedNodeProperties = [ "ELEMENT_NODE", "ATTRIBUTE_NODE", "TEXT_NODE",
                               "CDATA_SECTION_NODE", "ENTITY_REFERENCE_NODE", "ENTITY_NODE",
                               "PROCESSING_INSTRUCTION_NODE", "COMMENT_NODE", "DOCUMENT_NODE",
                               "DOCUMENT_TYPE_NODE", "DOCUMENT_FRAGMENT_NODE", "NOTATION_NODE",
                               "DOCUMENT_POSITION_DISCONNECTED", "DOCUMENT_POSITION_PRECEDING",
                               "DOCUMENT_POSITION_FOLLOWING", "DOCUMENT_POSITION_CONTAINS",
                               "DOCUMENT_POSITION_CONTAINED_BY", "DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC", "dispatchEvent" ];
    
    instrumentObject(window.Node.prototype, "Node", {'excludedProperties': excludedNodeProperties, logCallStack: true});

    // Access to Document
    var propertiesToInstrument = [ "createComment", "createDocumentFragment", "createElement",
                                  "createTextNode", "getElementsByClassName", "getElementsByTagName",
                                  "getElementById", "querySelector", "querySelectorAll"];
    instrumentObject(
        window.Document.prototype,
        "Document",
        {'propertiesToInstrument': propertiesToInstrument, logCallStack: true}
    );
   
    var includedPropertiesForEventTarget = [ "addEventListener"];
    var excludedPropertiesForEventTarget = [ "dispatchEvent"];
    
    instrumentObject(
        window.EventTarget.prototype,
        "EventTarget",
        {'propertiesToInstrument': includedPropertiesForEventTarget,
        'excludedProperties': excludedPropertiesForEventTarget,
        logCallStack: true}
    );

    // Access to Performance methods
    var performanceePropertiesToInstrument = [ "now"];
    instrumentObject(
        window.Performance.prototype,
        "Performance",
        {'propertiesToInstrument': performanceePropertiesToInstrument, logCallStack: true}
    );

    console.log("Successfully started all instrumentation.");
    
    // Dispatch all of the added events to window, documents, and elements
    setTimeout(function(){ 
      eventDispatchList.forEach(function (evnt) {
        console.log('Dispatching event for Object: ' + evnt['object'] + ' and Event: ' + evnt['eventName']);
        evnt['object'].dispatchEvent(new Event(evnt['eventName']));
      });
    }, 10000);
    
  } + "());";
}


function insertScript(text, data) {
  var parent = document.documentElement,
    script = document.createElement('script');
  script.text = text;
  script.async = false;

  for (var key in data) {
    script.setAttribute('data-' + key.replace('_', '-'), data[key]);
  }

  parent.insertBefore(script, parent.firstChild);
  parent.removeChild(script);
}

function emitMsg(type, msg) {
  msg.timeStamp = new Date().toISOString();
  self.port.emit(type, msg);
}

var event_id = Math.random();

// listen for messages from the script we are about to insert
document.addEventListener(event_id, function (e) {
  // pass these on to the background page
  var msgs = e.detail;
  if (Array.isArray(msgs)) {
    msgs.forEach(function (msg) {
      emitMsg(msg['type'],msg['content']);
    });
  } else {
    emitMsg(msgs['type'],msgs['content']);
  }
});

insertScript(getPageScript(), {
  event_id: event_id,
  testing: self.options.testing
});
