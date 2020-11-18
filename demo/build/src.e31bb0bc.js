// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var global = arguments[3];
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

},{}],"../../node_modules/avr8js/dist/esm/cpu/cpu.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CPU = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * AVR 8 CPU data structures
 * Part of AVR8js
 *
 * Copyright (C) 2019, Uri Shaked
 */
var registerSpace = 0x100;

var CPU = /*#__PURE__*/function () {
  function CPU(progMem) {
    var sramBytes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8192;

    _classCallCheck(this, CPU);

    this.progMem = progMem;
    this.sramBytes = sramBytes;
    this.data = new Uint8Array(this.sramBytes + registerSpace);
    this.data16 = new Uint16Array(this.data.buffer);
    this.dataView = new DataView(this.data.buffer);
    this.progBytes = new Uint8Array(this.progMem.buffer);
    this.readHooks = [];
    this.writeHooks = [];
    this.pc22Bits = this.progBytes.length > 0x20000; // This lets the Timer Compare output override GPIO pins:

    this.gpioTimerHooks = [];
    this.pc = 0;
    this.cycles = 0;
    this.reset();
  }

  _createClass(CPU, [{
    key: "reset",
    value: function reset() {
      this.data.fill(0);
      this.SP = this.data.length - 1;
    }
  }, {
    key: "readData",
    value: function readData(addr) {
      if (addr >= 32 && this.readHooks[addr]) {
        return this.readHooks[addr](addr);
      }

      return this.data[addr];
    }
  }, {
    key: "writeData",
    value: function writeData(addr, value) {
      var hook = this.writeHooks[addr];

      if (hook) {
        if (hook(value, this.data[addr], addr)) {
          return;
        }
      }

      this.data[addr] = value;
    }
  }, {
    key: "SP",
    get: function get() {
      return this.dataView.getUint16(93, true);
    },
    set: function set(value) {
      this.dataView.setUint16(93, value, true);
    }
  }, {
    key: "SREG",
    get: function get() {
      return this.data[95];
    }
  }, {
    key: "interruptsEnabled",
    get: function get() {
      return this.SREG & 0x80 ? true : false;
    }
  }]);

  return CPU;
}();

exports.CPU = CPU;
},{}],"../../node_modules/avr8js/dist/esm/cpu/instruction.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.avrInstruction = avrInstruction;

/**
 * AVR-8 Instruction Simulation
 * Part of AVR8js
 *
 * Reference: http://ww1.microchip.com/downloads/en/devicedoc/atmel-0856-avr-instruction-set-manual.pdf
 *
 * Instruction timing is currently based on ATmega328p (see the Instruction Set Summary at the end of
 * the datasheet)
 *
 * Copyright (C) 2019, 2020 Uri Shaked
 */
function isTwoWordInstruction(opcode) {
  return (
    /* LDS */
    (opcode & 0xfe0f) === 0x9000 ||
    /* STS */
    (opcode & 0xfe0f) === 0x9200 ||
    /* CALL */
    (opcode & 0xfe0e) === 0x940e ||
    /* JMP */
    (opcode & 0xfe0e) === 0x940c
  );
}

function avrInstruction(cpu) {
  var opcode = cpu.progMem[cpu.pc];

  if ((opcode & 0xfc00) === 0x1c00) {
    /* ADC, 0001 11rd dddd rrrr */
    var d = cpu.data[(opcode & 0x1f0) >> 4];
    var r = cpu.data[opcode & 0xf | (opcode & 0x200) >> 5];
    var sum = d + r + (cpu.data[95] & 1);
    var R = sum & 255;
    cpu.data[(opcode & 0x1f0) >> 4] = R;
    var sreg = cpu.data[95] & 0xc0;
    sreg |= R ? 0 : 2;
    sreg |= 128 & R ? 4 : 0;
    sreg |= (R ^ r) & (d ^ R) & 128 ? 8 : 0;
    sreg |= sreg >> 2 & 1 ^ sreg >> 3 & 1 ? 0x10 : 0;
    sreg |= sum & 256 ? 1 : 0;
    sreg |= 1 & (d & r | r & ~R | ~R & d) ? 0x20 : 0;
    cpu.data[95] = sreg;
  } else if ((opcode & 0xfc00) === 0xc00) {
    /* ADD, 0000 11rd dddd rrrr */
    var _d = cpu.data[(opcode & 0x1f0) >> 4];
    var _r = cpu.data[opcode & 0xf | (opcode & 0x200) >> 5];

    var _R = _d + _r & 255;

    cpu.data[(opcode & 0x1f0) >> 4] = _R;

    var _sreg = cpu.data[95] & 0xc0;

    _sreg |= _R ? 0 : 2;
    _sreg |= 128 & _R ? 4 : 0;
    _sreg |= (_R ^ _r) & (_R ^ _d) & 128 ? 8 : 0;
    _sreg |= _sreg >> 2 & 1 ^ _sreg >> 3 & 1 ? 0x10 : 0;
    _sreg |= _d + _r & 256 ? 1 : 0;
    _sreg |= 1 & (_d & _r | _r & ~_R | ~_R & _d) ? 0x20 : 0;
    cpu.data[95] = _sreg;
  } else if ((opcode & 0xff00) === 0x9600) {
    /* ADIW, 1001 0110 KKdd KKKK */
    var addr = 2 * ((opcode & 0x30) >> 4) + 24;
    var value = cpu.dataView.getUint16(addr, true);

    var _R2 = value + (opcode & 0xf | (opcode & 0xc0) >> 2) & 0xffff;

    cpu.dataView.setUint16(addr, _R2, true);

    var _sreg2 = cpu.data[95] & 0xe0;

    _sreg2 |= _R2 ? 0 : 2;
    _sreg2 |= 0x8000 & _R2 ? 4 : 0;
    _sreg2 |= ~value & _R2 & 0x8000 ? 8 : 0;
    _sreg2 |= _sreg2 >> 2 & 1 ^ _sreg2 >> 3 & 1 ? 0x10 : 0;
    _sreg2 |= ~_R2 & value & 0x8000 ? 1 : 0;
    cpu.data[95] = _sreg2;
    cpu.cycles++;
  } else if ((opcode & 0xfc00) === 0x2000) {
    /* AND, 0010 00rd dddd rrrr */
    var _R3 = cpu.data[(opcode & 0x1f0) >> 4] & cpu.data[opcode & 0xf | (opcode & 0x200) >> 5];

    cpu.data[(opcode & 0x1f0) >> 4] = _R3;

    var _sreg3 = cpu.data[95] & 0xe1;

    _sreg3 |= _R3 ? 0 : 2;
    _sreg3 |= 128 & _R3 ? 4 : 0;
    _sreg3 |= _sreg3 >> 2 & 1 ^ _sreg3 >> 3 & 1 ? 0x10 : 0;
    cpu.data[95] = _sreg3;
  } else if ((opcode & 0xf000) === 0x7000) {
    /* ANDI, 0111 KKKK dddd KKKK */
    var _R4 = cpu.data[((opcode & 0xf0) >> 4) + 16] & (opcode & 0xf | (opcode & 0xf00) >> 4);

    cpu.data[((opcode & 0xf0) >> 4) + 16] = _R4;

    var _sreg4 = cpu.data[95] & 0xe1;

    _sreg4 |= _R4 ? 0 : 2;
    _sreg4 |= 128 & _R4 ? 4 : 0;
    _sreg4 |= _sreg4 >> 2 & 1 ^ _sreg4 >> 3 & 1 ? 0x10 : 0;
    cpu.data[95] = _sreg4;
  } else if ((opcode & 0xfe0f) === 0x9405) {
    /* ASR, 1001 010d dddd 0101 */
    var _value = cpu.data[(opcode & 0x1f0) >> 4];

    var _R5 = _value >>> 1 | 128 & _value;

    cpu.data[(opcode & 0x1f0) >> 4] = _R5;

    var _sreg5 = cpu.data[95] & 0xe0;

    _sreg5 |= _R5 ? 0 : 2;
    _sreg5 |= 128 & _R5 ? 4 : 0;
    _sreg5 |= _value & 1;
    _sreg5 |= _sreg5 >> 2 & 1 ^ _sreg5 & 1 ? 8 : 0;
    _sreg5 |= _sreg5 >> 2 & 1 ^ _sreg5 >> 3 & 1 ? 0x10 : 0;
    cpu.data[95] = _sreg5;
  } else if ((opcode & 0xff8f) === 0x9488) {
    /* BCLR, 1001 0100 1sss 1000 */
    cpu.data[95] &= ~(1 << ((opcode & 0x70) >> 4));
  } else if ((opcode & 0xfe08) === 0xf800) {
    /* BLD, 1111 100d dddd 0bbb */
    var b = opcode & 7;

    var _d2 = (opcode & 0x1f0) >> 4;

    cpu.data[_d2] = ~(1 << b) & cpu.data[_d2] | (cpu.data[95] >> 6 & 1) << b;
  } else if ((opcode & 0xfc00) === 0xf400) {
    /* BRBC, 1111 01kk kkkk ksss */
    if (!(cpu.data[95] & 1 << (opcode & 7))) {
      cpu.pc = cpu.pc + (((opcode & 0x1f8) >> 3) - (opcode & 0x200 ? 0x40 : 0));
      cpu.cycles++;
    }
  } else if ((opcode & 0xfc00) === 0xf000) {
    /* BRBS, 1111 00kk kkkk ksss */
    if (cpu.data[95] & 1 << (opcode & 7)) {
      cpu.pc = cpu.pc + (((opcode & 0x1f8) >> 3) - (opcode & 0x200 ? 0x40 : 0));
      cpu.cycles++;
    }
  } else if ((opcode & 0xff8f) === 0x9408) {
    /* BSET, 1001 0100 0sss 1000 */
    cpu.data[95] |= 1 << ((opcode & 0x70) >> 4);
  } else if ((opcode & 0xfe08) === 0xfa00) {
    /* BST, 1111 101d dddd 0bbb */
    var _d3 = cpu.data[(opcode & 0x1f0) >> 4];

    var _b = opcode & 7;

    cpu.data[95] = cpu.data[95] & 0xbf | (_d3 >> _b & 1 ? 0x40 : 0);
  } else if ((opcode & 0xfe0e) === 0x940e) {
    /* CALL, 1001 010k kkkk 111k kkkk kkkk kkkk kkkk */
    var k = cpu.progMem[cpu.pc + 1] | (opcode & 1) << 16 | (opcode & 0x1f0) << 13;
    var ret = cpu.pc + 2;
    var sp = cpu.dataView.getUint16(93, true);
    var pc22Bits = cpu.pc22Bits;
    cpu.data[sp] = 255 & ret;
    cpu.data[sp - 1] = ret >> 8 & 255;

    if (pc22Bits) {
      cpu.data[sp - 2] = ret >> 16 & 255;
    }

    cpu.dataView.setUint16(93, sp - (pc22Bits ? 3 : 2), true);
    cpu.pc = k - 1;
    cpu.cycles += pc22Bits ? 4 : 3;
  } else if ((opcode & 0xff00) === 0x9800) {
    /* CBI, 1001 1000 AAAA Abbb */
    var A = opcode & 0xf8;

    var _b2 = opcode & 7;

    var _R6 = cpu.readData((A >> 3) + 32);

    cpu.writeData((A >> 3) + 32, _R6 & ~(1 << _b2));
  } else if ((opcode & 0xfe0f) === 0x9400) {
    /* COM, 1001 010d dddd 0000 */
    var _d4 = (opcode & 0x1f0) >> 4;

    var _R7 = 255 - cpu.data[_d4];

    cpu.data[_d4] = _R7;

    var _sreg6 = cpu.data[95] & 0xe1 | 1;

    _sreg6 |= _R7 ? 0 : 2;
    _sreg6 |= 128 & _R7 ? 4 : 0;
    _sreg6 |= _sreg6 >> 2 & 1 ^ _sreg6 >> 3 & 1 ? 0x10 : 0;
    cpu.data[95] = _sreg6;
  } else if ((opcode & 0xfc00) === 0x1400) {
    /* CP, 0001 01rd dddd rrrr */
    var val1 = cpu.data[(opcode & 0x1f0) >> 4];
    var val2 = cpu.data[opcode & 0xf | (opcode & 0x200) >> 5];

    var _R8 = val1 - val2;

    var _sreg7 = cpu.data[95] & 0xc0;

    _sreg7 |= _R8 ? 0 : 2;
    _sreg7 |= 128 & _R8 ? 4 : 0;
    _sreg7 |= 0 !== ((val1 ^ val2) & (val1 ^ _R8) & 128) ? 8 : 0;
    _sreg7 |= _sreg7 >> 2 & 1 ^ _sreg7 >> 3 & 1 ? 0x10 : 0;
    _sreg7 |= val2 > val1 ? 1 : 0;
    _sreg7 |= 1 & (~val1 & val2 | val2 & _R8 | _R8 & ~val1) ? 0x20 : 0;
    cpu.data[95] = _sreg7;
  } else if ((opcode & 0xfc00) === 0x400) {
    /* CPC, 0000 01rd dddd rrrr */
    var arg1 = cpu.data[(opcode & 0x1f0) >> 4];
    var arg2 = cpu.data[opcode & 0xf | (opcode & 0x200) >> 5];
    var _sreg8 = cpu.data[95];

    var _r2 = arg1 - arg2 - (_sreg8 & 1);

    _sreg8 = _sreg8 & 0xc0 | (!_r2 && _sreg8 >> 1 & 1 ? 2 : 0) | (arg2 + (_sreg8 & 1) > arg1 ? 1 : 0);
    _sreg8 |= 128 & _r2 ? 4 : 0;
    _sreg8 |= (arg1 ^ arg2) & (arg1 ^ _r2) & 128 ? 8 : 0;
    _sreg8 |= _sreg8 >> 2 & 1 ^ _sreg8 >> 3 & 1 ? 0x10 : 0;
    _sreg8 |= 1 & (~arg1 & arg2 | arg2 & _r2 | _r2 & ~arg1) ? 0x20 : 0;
    cpu.data[95] = _sreg8;
  } else if ((opcode & 0xf000) === 0x3000) {
    /* CPI, 0011 KKKK dddd KKKK */
    var _arg = cpu.data[((opcode & 0xf0) >> 4) + 16];

    var _arg2 = opcode & 0xf | (opcode & 0xf00) >> 4;

    var _r3 = _arg - _arg2;

    var _sreg9 = cpu.data[95] & 0xc0;

    _sreg9 |= _r3 ? 0 : 2;
    _sreg9 |= 128 & _r3 ? 4 : 0;
    _sreg9 |= (_arg ^ _arg2) & (_arg ^ _r3) & 128 ? 8 : 0;
    _sreg9 |= _sreg9 >> 2 & 1 ^ _sreg9 >> 3 & 1 ? 0x10 : 0;
    _sreg9 |= _arg2 > _arg ? 1 : 0;
    _sreg9 |= 1 & (~_arg & _arg2 | _arg2 & _r3 | _r3 & ~_arg) ? 0x20 : 0;
    cpu.data[95] = _sreg9;
  } else if ((opcode & 0xfc00) === 0x1000) {
    /* CPSE, 0001 00rd dddd rrrr */
    if (cpu.data[(opcode & 0x1f0) >> 4] === cpu.data[opcode & 0xf | (opcode & 0x200) >> 5]) {
      var nextOpcode = cpu.progMem[cpu.pc + 1];
      var skipSize = isTwoWordInstruction(nextOpcode) ? 2 : 1;
      cpu.pc += skipSize;
      cpu.cycles += skipSize;
    }
  } else if ((opcode & 0xfe0f) === 0x940a) {
    /* DEC, 1001 010d dddd 1010 */
    var _value2 = cpu.data[(opcode & 0x1f0) >> 4];

    var _R9 = _value2 - 1;

    cpu.data[(opcode & 0x1f0) >> 4] = _R9;

    var _sreg10 = cpu.data[95] & 0xe1;

    _sreg10 |= _R9 ? 0 : 2;
    _sreg10 |= 128 & _R9 ? 4 : 0;
    _sreg10 |= 128 === _value2 ? 8 : 0;
    _sreg10 |= _sreg10 >> 2 & 1 ^ _sreg10 >> 3 & 1 ? 0x10 : 0;
    cpu.data[95] = _sreg10;
  } else if (opcode === 0x9519) {
    /* EICALL, 1001 0101 0001 1001 */
    var retAddr = cpu.pc + 1;

    var _sp = cpu.dataView.getUint16(93, true);

    var eind = cpu.data[0x5c];
    cpu.data[_sp] = retAddr & 255;
    cpu.data[_sp - 1] = retAddr >> 8 & 255;
    cpu.data[_sp - 2] = retAddr >> 16 & 255;
    cpu.dataView.setUint16(93, _sp - 3, true);
    cpu.pc = (eind << 16 | cpu.dataView.getUint16(30, true)) - 1;
    cpu.cycles += 3;
  } else if (opcode === 0x9419) {
    /* EIJMP, 1001 0100 0001 1001 */
    var _eind = cpu.data[0x5c];
    cpu.pc = (_eind << 16 | cpu.dataView.getUint16(30, true)) - 1;
    cpu.cycles++;
  } else if (opcode === 0x95d8) {
    /* ELPM, 1001 0101 1101 1000 */
    var rampz = cpu.data[0x5b];
    cpu.data[0] = cpu.progBytes[rampz << 16 | cpu.dataView.getUint16(30, true)];
    cpu.cycles += 2;
  } else if ((opcode & 0xfe0f) === 0x9006) {
    /* ELPM(REG), 1001 000d dddd 0110 */
    var _rampz = cpu.data[0x5b];
    cpu.data[(opcode & 0x1f0) >> 4] = cpu.progBytes[_rampz << 16 | cpu.dataView.getUint16(30, true)];
    cpu.cycles += 2;
  } else if ((opcode & 0xfe0f) === 0x9007) {
    /* ELPM(INC), 1001 000d dddd 0111 */
    var _rampz2 = cpu.data[0x5b];
    var i = cpu.dataView.getUint16(30, true);
    cpu.data[(opcode & 0x1f0) >> 4] = cpu.progBytes[_rampz2 << 16 | i];
    cpu.dataView.setUint16(30, i + 1, true);

    if (i === 0xffff) {
      cpu.data[0x5b] = (_rampz2 + 1) % (cpu.progBytes.length >> 16);
    }

    cpu.cycles += 2;
  } else if ((opcode & 0xfc00) === 0x2400) {
    /* EOR, 0010 01rd dddd rrrr */
    var _R10 = cpu.data[(opcode & 0x1f0) >> 4] ^ cpu.data[opcode & 0xf | (opcode & 0x200) >> 5];

    cpu.data[(opcode & 0x1f0) >> 4] = _R10;

    var _sreg11 = cpu.data[95] & 0xe1;

    _sreg11 |= _R10 ? 0 : 2;
    _sreg11 |= 128 & _R10 ? 4 : 0;
    _sreg11 |= _sreg11 >> 2 & 1 ^ _sreg11 >> 3 & 1 ? 0x10 : 0;
    cpu.data[95] = _sreg11;
  } else if ((opcode & 0xff88) === 0x308) {
    /* FMUL, 0000 0011 0ddd 1rrr */
    var v1 = cpu.data[((opcode & 0x70) >> 4) + 16];
    var v2 = cpu.data[(opcode & 7) + 16];

    var _R11 = v1 * v2 << 1;

    cpu.dataView.setUint16(0, _R11, true);
    cpu.data[95] = cpu.data[95] & 0xfc | (0xffff & _R11 ? 0 : 2) | (v1 * v2 & 0x8000 ? 1 : 0);
    cpu.cycles++;
  } else if ((opcode & 0xff88) === 0x380) {
    /* FMULS, 0000 0011 1ddd 0rrr */
    var _v = cpu.dataView.getInt8(((opcode & 0x70) >> 4) + 16);

    var _v2 = cpu.dataView.getInt8((opcode & 7) + 16);

    var _R12 = _v * _v2 << 1;

    cpu.dataView.setInt16(0, _R12, true);
    cpu.data[95] = cpu.data[95] & 0xfc | (0xffff & _R12 ? 0 : 2) | (_v * _v2 & 0x8000 ? 1 : 0);
    cpu.cycles++;
  } else if ((opcode & 0xff88) === 0x388) {
    /* FMULSU, 0000 0011 1ddd 1rrr */
    var _v3 = cpu.dataView.getInt8(((opcode & 0x70) >> 4) + 16);

    var _v4 = cpu.data[(opcode & 7) + 16];

    var _R13 = _v3 * _v4 << 1;

    cpu.dataView.setInt16(0, _R13, true);
    cpu.data[95] = cpu.data[95] & 0xfc | (0xffff & _R13 ? 2 : 0) | (_v3 * _v4 & 0x8000 ? 1 : 0);
    cpu.cycles++;
  } else if (opcode === 0x9509) {
    /* ICALL, 1001 0101 0000 1001 */
    var _retAddr = cpu.pc + 1;

    var _sp2 = cpu.dataView.getUint16(93, true);

    var _pc22Bits = cpu.pc22Bits;
    cpu.data[_sp2] = _retAddr & 255;
    cpu.data[_sp2 - 1] = _retAddr >> 8 & 255;

    if (_pc22Bits) {
      cpu.data[_sp2 - 2] = _retAddr >> 16 & 255;
    }

    cpu.dataView.setUint16(93, _sp2 - (_pc22Bits ? 3 : 2), true);
    cpu.pc = cpu.dataView.getUint16(30, true) - 1;
    cpu.cycles += _pc22Bits ? 3 : 2;
  } else if (opcode === 0x9409) {
    /* IJMP, 1001 0100 0000 1001 */
    cpu.pc = cpu.dataView.getUint16(30, true) - 1;
    cpu.cycles++;
  } else if ((opcode & 0xf800) === 0xb000) {
    /* IN, 1011 0AAd dddd AAAA */
    var _i = cpu.readData((opcode & 0xf | (opcode & 0x600) >> 5) + 32);

    cpu.data[(opcode & 0x1f0) >> 4] = _i;
  } else if ((opcode & 0xfe0f) === 0x9403) {
    /* INC, 1001 010d dddd 0011 */
    var _d5 = cpu.data[(opcode & 0x1f0) >> 4];

    var _r4 = _d5 + 1 & 255;

    cpu.data[(opcode & 0x1f0) >> 4] = _r4;

    var _sreg12 = cpu.data[95] & 0xe1;

    _sreg12 |= _r4 ? 0 : 2;
    _sreg12 |= 128 & _r4 ? 4 : 0;
    _sreg12 |= 127 === _d5 ? 8 : 0;
    _sreg12 |= _sreg12 >> 2 & 1 ^ _sreg12 >> 3 & 1 ? 0x10 : 0;
    cpu.data[95] = _sreg12;
  } else if ((opcode & 0xfe0e) === 0x940c) {
    /* JMP, 1001 010k kkkk 110k kkkk kkkk kkkk kkkk */
    cpu.pc = (cpu.progMem[cpu.pc + 1] | (opcode & 1) << 16 | (opcode & 0x1f0) << 13) - 1;
    cpu.cycles += 2;
  } else if ((opcode & 0xfe0f) === 0x9206) {
    /* LAC, 1001 001r rrrr 0110 */
    var _r5 = (opcode & 0x1f0) >> 4;

    var clear = cpu.data[_r5];

    var _value3 = cpu.readData(cpu.dataView.getUint16(30, true));

    cpu.writeData(cpu.dataView.getUint16(30, true), _value3 & 255 - clear);
    cpu.data[_r5] = _value3;
  } else if ((opcode & 0xfe0f) === 0x9205) {
    /* LAS, 1001 001r rrrr 0101 */
    var _r6 = (opcode & 0x1f0) >> 4;

    var set = cpu.data[_r6];

    var _value4 = cpu.readData(cpu.dataView.getUint16(30, true));

    cpu.writeData(cpu.dataView.getUint16(30, true), _value4 | set);
    cpu.data[_r6] = _value4;
  } else if ((opcode & 0xfe0f) === 0x9207) {
    /* LAT, 1001 001r rrrr 0111 */
    var _r7 = cpu.data[(opcode & 0x1f0) >> 4];

    var _R14 = cpu.readData(cpu.dataView.getUint16(30, true));

    cpu.writeData(cpu.dataView.getUint16(30, true), _r7 ^ _R14);
    cpu.data[(opcode & 0x1f0) >> 4] = _R14;
  } else if ((opcode & 0xf000) === 0xe000) {
    /* LDI, 1110 KKKK dddd KKKK */
    cpu.data[((opcode & 0xf0) >> 4) + 16] = opcode & 0xf | (opcode & 0xf00) >> 4;
  } else if ((opcode & 0xfe0f) === 0x9000) {
    /* LDS, 1001 000d dddd 0000 kkkk kkkk kkkk kkkk */
    cpu.cycles++;

    var _value5 = cpu.readData(cpu.progMem[cpu.pc + 1]);

    cpu.data[(opcode & 0x1f0) >> 4] = _value5;
    cpu.pc++;
  } else if ((opcode & 0xfe0f) === 0x900c) {
    /* LDX, 1001 000d dddd 1100 */
    cpu.cycles++;
    cpu.data[(opcode & 0x1f0) >> 4] = cpu.readData(cpu.dataView.getUint16(26, true));
  } else if ((opcode & 0xfe0f) === 0x900d) {
    /* LDX(INC), 1001 000d dddd 1101 */
    var x = cpu.dataView.getUint16(26, true);
    cpu.cycles++;
    cpu.data[(opcode & 0x1f0) >> 4] = cpu.readData(x);
    cpu.dataView.setUint16(26, x + 1, true);
  } else if ((opcode & 0xfe0f) === 0x900e) {
    /* LDX(DEC), 1001 000d dddd 1110 */
    var _x = cpu.dataView.getUint16(26, true) - 1;

    cpu.dataView.setUint16(26, _x, true);
    cpu.cycles++;
    cpu.data[(opcode & 0x1f0) >> 4] = cpu.readData(_x);
  } else if ((opcode & 0xfe0f) === 0x8008) {
    /* LDY, 1000 000d dddd 1000 */
    cpu.cycles++;
    cpu.data[(opcode & 0x1f0) >> 4] = cpu.readData(cpu.dataView.getUint16(28, true));
  } else if ((opcode & 0xfe0f) === 0x9009) {
    /* LDY(INC), 1001 000d dddd 1001 */
    var y = cpu.dataView.getUint16(28, true);
    cpu.cycles++;
    cpu.data[(opcode & 0x1f0) >> 4] = cpu.readData(y);
    cpu.dataView.setUint16(28, y + 1, true);
  } else if ((opcode & 0xfe0f) === 0x900a) {
    /* LDY(DEC), 1001 000d dddd 1010 */
    var _y = cpu.dataView.getUint16(28, true) - 1;

    cpu.dataView.setUint16(28, _y, true);
    cpu.cycles++;
    cpu.data[(opcode & 0x1f0) >> 4] = cpu.readData(_y);
  } else if ((opcode & 0xd208) === 0x8008 && opcode & 7 | (opcode & 0xc00) >> 7 | (opcode & 0x2000) >> 8) {
    /* LDDY, 10q0 qq0d dddd 1qqq */
    cpu.cycles++;
    cpu.data[(opcode & 0x1f0) >> 4] = cpu.readData(cpu.dataView.getUint16(28, true) + (opcode & 7 | (opcode & 0xc00) >> 7 | (opcode & 0x2000) >> 8));
  } else if ((opcode & 0xfe0f) === 0x8000) {
    /* LDZ, 1000 000d dddd 0000 */
    cpu.cycles++;
    cpu.data[(opcode & 0x1f0) >> 4] = cpu.readData(cpu.dataView.getUint16(30, true));
  } else if ((opcode & 0xfe0f) === 0x9001) {
    /* LDZ(INC), 1001 000d dddd 0001 */
    var z = cpu.dataView.getUint16(30, true);
    cpu.cycles++;
    cpu.data[(opcode & 0x1f0) >> 4] = cpu.readData(z);
    cpu.dataView.setUint16(30, z + 1, true);
  } else if ((opcode & 0xfe0f) === 0x9002) {
    /* LDZ(DEC), 1001 000d dddd 0010 */
    var _z = cpu.dataView.getUint16(30, true) - 1;

    cpu.dataView.setUint16(30, _z, true);
    cpu.cycles++;
    cpu.data[(opcode & 0x1f0) >> 4] = cpu.readData(_z);
  } else if ((opcode & 0xd208) === 0x8000 && opcode & 7 | (opcode & 0xc00) >> 7 | (opcode & 0x2000) >> 8) {
    /* LDDZ, 10q0 qq0d dddd 0qqq */
    cpu.cycles++;
    cpu.data[(opcode & 0x1f0) >> 4] = cpu.readData(cpu.dataView.getUint16(30, true) + (opcode & 7 | (opcode & 0xc00) >> 7 | (opcode & 0x2000) >> 8));
  } else if (opcode === 0x95c8) {
    /* LPM, 1001 0101 1100 1000 */
    cpu.data[0] = cpu.progBytes[cpu.dataView.getUint16(30, true)];
    cpu.cycles += 2;
  } else if ((opcode & 0xfe0f) === 0x9004) {
    /* LPM(REG), 1001 000d dddd 0100 */
    cpu.data[(opcode & 0x1f0) >> 4] = cpu.progBytes[cpu.dataView.getUint16(30, true)];
    cpu.cycles += 2;
  } else if ((opcode & 0xfe0f) === 0x9005) {
    /* LPM(INC), 1001 000d dddd 0101 */
    var _i2 = cpu.dataView.getUint16(30, true);

    cpu.data[(opcode & 0x1f0) >> 4] = cpu.progBytes[_i2];
    cpu.dataView.setUint16(30, _i2 + 1, true);
    cpu.cycles += 2;
  } else if ((opcode & 0xfe0f) === 0x9406) {
    /* LSR, 1001 010d dddd 0110 */
    var _value6 = cpu.data[(opcode & 0x1f0) >> 4];

    var _R15 = _value6 >>> 1;

    cpu.data[(opcode & 0x1f0) >> 4] = _R15;

    var _sreg13 = cpu.data[95] & 0xe0;

    _sreg13 |= _R15 ? 0 : 2;
    _sreg13 |= _value6 & 1;
    _sreg13 |= _sreg13 >> 2 & 1 ^ _sreg13 & 1 ? 8 : 0;
    _sreg13 |= _sreg13 >> 2 & 1 ^ _sreg13 >> 3 & 1 ? 0x10 : 0;
    cpu.data[95] = _sreg13;
  } else if ((opcode & 0xfc00) === 0x2c00) {
    /* MOV, 0010 11rd dddd rrrr */
    cpu.data[(opcode & 0x1f0) >> 4] = cpu.data[opcode & 0xf | (opcode & 0x200) >> 5];
  } else if ((opcode & 0xff00) === 0x100) {
    /* MOVW, 0000 0001 dddd rrrr */
    var r2 = 2 * (opcode & 0xf);
    var d2 = 2 * ((opcode & 0xf0) >> 4);
    cpu.data[d2] = cpu.data[r2];
    cpu.data[d2 + 1] = cpu.data[r2 + 1];
  } else if ((opcode & 0xfc00) === 0x9c00) {
    /* MUL, 1001 11rd dddd rrrr */
    var _R16 = cpu.data[(opcode & 0x1f0) >> 4] * cpu.data[opcode & 0xf | (opcode & 0x200) >> 5];

    cpu.dataView.setUint16(0, _R16, true);
    cpu.data[95] = cpu.data[95] & 0xfc | (0xffff & _R16 ? 0 : 2) | (0x8000 & _R16 ? 1 : 0);
    cpu.cycles++;
  } else if ((opcode & 0xff00) === 0x200) {
    /* MULS, 0000 0010 dddd rrrr */
    var _R17 = cpu.dataView.getInt8(((opcode & 0xf0) >> 4) + 16) * cpu.dataView.getInt8((opcode & 0xf) + 16);

    cpu.dataView.setInt16(0, _R17, true);
    cpu.data[95] = cpu.data[95] & 0xfc | (0xffff & _R17 ? 0 : 2) | (0x8000 & _R17 ? 1 : 0);
    cpu.cycles++;
  } else if ((opcode & 0xff88) === 0x300) {
    /* MULSU, 0000 0011 0ddd 0rrr */
    var _R18 = cpu.dataView.getInt8(((opcode & 0x70) >> 4) + 16) * cpu.data[(opcode & 7) + 16];

    cpu.dataView.setInt16(0, _R18, true);
    cpu.data[95] = cpu.data[95] & 0xfc | (0xffff & _R18 ? 0 : 2) | (0x8000 & _R18 ? 1 : 0);
    cpu.cycles++;
  } else if ((opcode & 0xfe0f) === 0x9401) {
    /* NEG, 1001 010d dddd 0001 */
    var _d6 = (opcode & 0x1f0) >> 4;

    var _value7 = cpu.data[_d6];

    var _R19 = 0 - _value7;

    cpu.data[_d6] = _R19;

    var _sreg14 = cpu.data[95] & 0xc0;

    _sreg14 |= _R19 ? 0 : 2;
    _sreg14 |= 128 & _R19 ? 4 : 0;
    _sreg14 |= 128 === _R19 ? 8 : 0;
    _sreg14 |= _sreg14 >> 2 & 1 ^ _sreg14 >> 3 & 1 ? 0x10 : 0;
    _sreg14 |= _R19 ? 1 : 0;
    _sreg14 |= 1 & (_R19 | _value7) ? 0x20 : 0;
    cpu.data[95] = _sreg14;
  } else if (opcode === 0) {
    /* NOP, 0000 0000 0000 0000 */

    /* NOP */
  } else if ((opcode & 0xfc00) === 0x2800) {
    /* OR, 0010 10rd dddd rrrr */
    var _R20 = cpu.data[(opcode & 0x1f0) >> 4] | cpu.data[opcode & 0xf | (opcode & 0x200) >> 5];

    cpu.data[(opcode & 0x1f0) >> 4] = _R20;

    var _sreg15 = cpu.data[95] & 0xe1;

    _sreg15 |= _R20 ? 0 : 2;
    _sreg15 |= 128 & _R20 ? 4 : 0;
    _sreg15 |= _sreg15 >> 2 & 1 ^ _sreg15 >> 3 & 1 ? 0x10 : 0;
    cpu.data[95] = _sreg15;
  } else if ((opcode & 0xf000) === 0x6000) {
    /* SBR, 0110 KKKK dddd KKKK */
    var _R21 = cpu.data[((opcode & 0xf0) >> 4) + 16] | (opcode & 0xf | (opcode & 0xf00) >> 4);

    cpu.data[((opcode & 0xf0) >> 4) + 16] = _R21;

    var _sreg16 = cpu.data[95] & 0xe1;

    _sreg16 |= _R21 ? 0 : 2;
    _sreg16 |= 128 & _R21 ? 4 : 0;
    _sreg16 |= _sreg16 >> 2 & 1 ^ _sreg16 >> 3 & 1 ? 0x10 : 0;
    cpu.data[95] = _sreg16;
  } else if ((opcode & 0xf800) === 0xb800) {
    /* OUT, 1011 1AAr rrrr AAAA */
    cpu.writeData((opcode & 0xf | (opcode & 0x600) >> 5) + 32, cpu.data[(opcode & 0x1f0) >> 4]);
  } else if ((opcode & 0xfe0f) === 0x900f) {
    /* POP, 1001 000d dddd 1111 */
    var _value8 = cpu.dataView.getUint16(93, true) + 1;

    cpu.dataView.setUint16(93, _value8, true);
    cpu.data[(opcode & 0x1f0) >> 4] = cpu.data[_value8];
    cpu.cycles++;
  } else if ((opcode & 0xfe0f) === 0x920f) {
    /* PUSH, 1001 001d dddd 1111 */
    var _value9 = cpu.dataView.getUint16(93, true);

    cpu.data[_value9] = cpu.data[(opcode & 0x1f0) >> 4];
    cpu.dataView.setUint16(93, _value9 - 1, true);
    cpu.cycles++;
  } else if ((opcode & 0xf000) === 0xd000) {
    /* RCALL, 1101 kkkk kkkk kkkk */
    var _k = (opcode & 0x7ff) - (opcode & 0x800 ? 0x800 : 0);

    var _retAddr2 = cpu.pc + 1;

    var _sp3 = cpu.dataView.getUint16(93, true);

    var _pc22Bits2 = cpu.pc22Bits;
    cpu.data[_sp3] = 255 & _retAddr2;
    cpu.data[_sp3 - 1] = _retAddr2 >> 8 & 255;

    if (_pc22Bits2) {
      cpu.data[_sp3 - 2] = _retAddr2 >> 16 & 255;
    }

    cpu.dataView.setUint16(93, _sp3 - (_pc22Bits2 ? 3 : 2), true);
    cpu.pc += _k;
    cpu.cycles += _pc22Bits2 ? 3 : 2;
  } else if (opcode === 0x9508) {
    /* RET, 1001 0101 0000 1000 */
    var _pc22Bits3 = cpu.pc22Bits;

    var _i3 = cpu.dataView.getUint16(93, true) + (_pc22Bits3 ? 3 : 2);

    cpu.dataView.setUint16(93, _i3, true);
    cpu.pc = (cpu.data[_i3 - 1] << 8) + cpu.data[_i3] - 1;

    if (_pc22Bits3) {
      cpu.pc |= cpu.data[_i3 - 2] << 16;
    }

    cpu.cycles += _pc22Bits3 ? 4 : 3;
  } else if (opcode === 0x9518) {
    /* RETI, 1001 0101 0001 1000 */
    var _pc22Bits4 = cpu.pc22Bits;

    var _i4 = cpu.dataView.getUint16(93, true) + (_pc22Bits4 ? 3 : 2);

    cpu.dataView.setUint16(93, _i4, true);
    cpu.pc = (cpu.data[_i4 - 1] << 8) + cpu.data[_i4] - 1;

    if (_pc22Bits4) {
      cpu.pc |= cpu.data[_i4 - 2] << 16;
    }

    cpu.cycles += _pc22Bits4 ? 4 : 3;
    cpu.data[95] |= 0x80; // Enable interrupts
  } else if ((opcode & 0xf000) === 0xc000) {
    /* RJMP, 1100 kkkk kkkk kkkk */
    cpu.pc = cpu.pc + ((opcode & 0x7ff) - (opcode & 0x800 ? 0x800 : 0));
    cpu.cycles++;
  } else if ((opcode & 0xfe0f) === 0x9407) {
    /* ROR, 1001 010d dddd 0111 */
    var _d7 = cpu.data[(opcode & 0x1f0) >> 4];

    var _r8 = _d7 >>> 1 | (cpu.data[95] & 1) << 7;

    cpu.data[(opcode & 0x1f0) >> 4] = _r8;

    var _sreg17 = cpu.data[95] & 0xe0;

    _sreg17 |= _r8 ? 0 : 2;
    _sreg17 |= 128 & _r8 ? 4 : 0;
    _sreg17 |= 1 & _d7 ? 1 : 0;
    _sreg17 |= _sreg17 >> 2 & 1 ^ _sreg17 & 1 ? 8 : 0;
    _sreg17 |= _sreg17 >> 2 & 1 ^ _sreg17 >> 3 & 1 ? 0x10 : 0;
    cpu.data[95] = _sreg17;
  } else if ((opcode & 0xfc00) === 0x800) {
    /* SBC, 0000 10rd dddd rrrr */
    var _val = cpu.data[(opcode & 0x1f0) >> 4];
    var _val2 = cpu.data[opcode & 0xf | (opcode & 0x200) >> 5];
    var _sreg18 = cpu.data[95];

    var _R22 = _val - _val2 - (_sreg18 & 1);

    cpu.data[(opcode & 0x1f0) >> 4] = _R22;
    _sreg18 = _sreg18 & 0xc0 | (!_R22 && _sreg18 >> 1 & 1 ? 2 : 0) | (_val2 + (_sreg18 & 1) > _val ? 1 : 0);
    _sreg18 |= 128 & _R22 ? 4 : 0;
    _sreg18 |= (_val ^ _val2) & (_val ^ _R22) & 128 ? 8 : 0;
    _sreg18 |= _sreg18 >> 2 & 1 ^ _sreg18 >> 3 & 1 ? 0x10 : 0;
    _sreg18 |= 1 & (~_val & _val2 | _val2 & _R22 | _R22 & ~_val) ? 0x20 : 0;
    cpu.data[95] = _sreg18;
  } else if ((opcode & 0xf000) === 0x4000) {
    /* SBCI, 0100 KKKK dddd KKKK */
    var _val3 = cpu.data[((opcode & 0xf0) >> 4) + 16];

    var _val4 = opcode & 0xf | (opcode & 0xf00) >> 4;

    var _sreg19 = cpu.data[95];

    var _R23 = _val3 - _val4 - (_sreg19 & 1);

    cpu.data[((opcode & 0xf0) >> 4) + 16] = _R23;
    _sreg19 = _sreg19 & 0xc0 | (!_R23 && _sreg19 >> 1 & 1 ? 2 : 0) | (_val4 + (_sreg19 & 1) > _val3 ? 1 : 0);
    _sreg19 |= 128 & _R23 ? 4 : 0;
    _sreg19 |= (_val3 ^ _val4) & (_val3 ^ _R23) & 128 ? 8 : 0;
    _sreg19 |= _sreg19 >> 2 & 1 ^ _sreg19 >> 3 & 1 ? 0x10 : 0;
    _sreg19 |= 1 & (~_val3 & _val4 | _val4 & _R23 | _R23 & ~_val3) ? 0x20 : 0;
    cpu.data[95] = _sreg19;
  } else if ((opcode & 0xff00) === 0x9a00) {
    /* SBI, 1001 1010 AAAA Abbb */
    var target = ((opcode & 0xf8) >> 3) + 32;
    cpu.writeData(target, cpu.readData(target) | 1 << (opcode & 7));
    cpu.cycles++;
  } else if ((opcode & 0xff00) === 0x9900) {
    /* SBIC, 1001 1001 AAAA Abbb */
    var _value10 = cpu.readData(((opcode & 0xf8) >> 3) + 32);

    if (!(_value10 & 1 << (opcode & 7))) {
      var _nextOpcode = cpu.progMem[cpu.pc + 1];

      var _skipSize = isTwoWordInstruction(_nextOpcode) ? 2 : 1;

      cpu.cycles += _skipSize;
      cpu.pc += _skipSize;
    }
  } else if ((opcode & 0xff00) === 0x9b00) {
    /* SBIS, 1001 1011 AAAA Abbb */
    var _value11 = cpu.readData(((opcode & 0xf8) >> 3) + 32);

    if (_value11 & 1 << (opcode & 7)) {
      var _nextOpcode2 = cpu.progMem[cpu.pc + 1];

      var _skipSize2 = isTwoWordInstruction(_nextOpcode2) ? 2 : 1;

      cpu.cycles += _skipSize2;
      cpu.pc += _skipSize2;
    }
  } else if ((opcode & 0xff00) === 0x9700) {
    /* SBIW, 1001 0111 KKdd KKKK */
    var _i5 = 2 * ((opcode & 0x30) >> 4) + 24;

    var a = cpu.dataView.getUint16(_i5, true);
    var l = opcode & 0xf | (opcode & 0xc0) >> 2;

    var _R24 = a - l;

    cpu.dataView.setUint16(_i5, _R24, true);

    var _sreg20 = cpu.data[95] & 0xc0;

    _sreg20 |= _R24 ? 0 : 2;
    _sreg20 |= 0x8000 & _R24 ? 4 : 0;
    _sreg20 |= a & ~_R24 & 0x8000 ? 8 : 0;
    _sreg20 |= _sreg20 >> 2 & 1 ^ _sreg20 >> 3 & 1 ? 0x10 : 0;
    _sreg20 |= l > a ? 1 : 0;
    _sreg20 |= 1 & (~a & l | l & _R24 | _R24 & ~a) ? 0x20 : 0;
    cpu.data[95] = _sreg20;
    cpu.cycles++;
  } else if ((opcode & 0xfe08) === 0xfc00) {
    /* SBRC, 1111 110r rrrr 0bbb */
    if (!(cpu.data[(opcode & 0x1f0) >> 4] & 1 << (opcode & 7))) {
      var _nextOpcode3 = cpu.progMem[cpu.pc + 1];

      var _skipSize3 = isTwoWordInstruction(_nextOpcode3) ? 2 : 1;

      cpu.cycles += _skipSize3;
      cpu.pc += _skipSize3;
    }
  } else if ((opcode & 0xfe08) === 0xfe00) {
    /* SBRS, 1111 111r rrrr 0bbb */
    if (cpu.data[(opcode & 0x1f0) >> 4] & 1 << (opcode & 7)) {
      var _nextOpcode4 = cpu.progMem[cpu.pc + 1];

      var _skipSize4 = isTwoWordInstruction(_nextOpcode4) ? 2 : 1;

      cpu.cycles += _skipSize4;
      cpu.pc += _skipSize4;
    }
  } else if (opcode === 0x9588) {
    /* SLEEP, 1001 0101 1000 1000 */

    /* not implemented */
  } else if (opcode === 0x95e8) {
    /* SPM, 1001 0101 1110 1000 */

    /* not implemented */
  } else if (opcode === 0x95f8) {
    /* SPM(INC), 1001 0101 1111 1000 */

    /* not implemented */
  } else if ((opcode & 0xfe0f) === 0x9200) {
    /* STS, 1001 001d dddd 0000 kkkk kkkk kkkk kkkk */
    var _value12 = cpu.data[(opcode & 0x1f0) >> 4];
    var _addr = cpu.progMem[cpu.pc + 1];
    cpu.writeData(_addr, _value12);
    cpu.pc++;
    cpu.cycles++;
  } else if ((opcode & 0xfe0f) === 0x920c) {
    /* STX, 1001 001r rrrr 1100 */
    cpu.writeData(cpu.dataView.getUint16(26, true), cpu.data[(opcode & 0x1f0) >> 4]);
    cpu.cycles++;
  } else if ((opcode & 0xfe0f) === 0x920d) {
    /* STX(INC), 1001 001r rrrr 1101 */
    var _x2 = cpu.dataView.getUint16(26, true);

    cpu.writeData(_x2, cpu.data[(opcode & 0x1f0) >> 4]);
    cpu.dataView.setUint16(26, _x2 + 1, true);
    cpu.cycles++;
  } else if ((opcode & 0xfe0f) === 0x920e) {
    /* STX(DEC), 1001 001r rrrr 1110 */
    var _i6 = cpu.data[(opcode & 0x1f0) >> 4];

    var _x3 = cpu.dataView.getUint16(26, true) - 1;

    cpu.dataView.setUint16(26, _x3, true);
    cpu.writeData(_x3, _i6);
    cpu.cycles++;
  } else if ((opcode & 0xfe0f) === 0x8208) {
    /* STY, 1000 001r rrrr 1000 */
    cpu.writeData(cpu.dataView.getUint16(28, true), cpu.data[(opcode & 0x1f0) >> 4]);
    cpu.cycles++;
  } else if ((opcode & 0xfe0f) === 0x9209) {
    /* STY(INC), 1001 001r rrrr 1001 */
    var _i7 = cpu.data[(opcode & 0x1f0) >> 4];

    var _y2 = cpu.dataView.getUint16(28, true);

    cpu.writeData(_y2, _i7);
    cpu.dataView.setUint16(28, _y2 + 1, true);
    cpu.cycles++;
  } else if ((opcode & 0xfe0f) === 0x920a) {
    /* STY(DEC), 1001 001r rrrr 1010 */
    var _i8 = cpu.data[(opcode & 0x1f0) >> 4];

    var _y3 = cpu.dataView.getUint16(28, true) - 1;

    cpu.dataView.setUint16(28, _y3, true);
    cpu.writeData(_y3, _i8);
    cpu.cycles++;
  } else if ((opcode & 0xd208) === 0x8208 && opcode & 7 | (opcode & 0xc00) >> 7 | (opcode & 0x2000) >> 8) {
    /* STDY, 10q0 qq1r rrrr 1qqq */
    cpu.writeData(cpu.dataView.getUint16(28, true) + (opcode & 7 | (opcode & 0xc00) >> 7 | (opcode & 0x2000) >> 8), cpu.data[(opcode & 0x1f0) >> 4]);
    cpu.cycles++;
  } else if ((opcode & 0xfe0f) === 0x8200) {
    /* STZ, 1000 001r rrrr 0000 */
    cpu.writeData(cpu.dataView.getUint16(30, true), cpu.data[(opcode & 0x1f0) >> 4]);
    cpu.cycles++;
  } else if ((opcode & 0xfe0f) === 0x9201) {
    /* STZ(INC), 1001 001r rrrr 0001 */
    var _z2 = cpu.dataView.getUint16(30, true);

    cpu.writeData(_z2, cpu.data[(opcode & 0x1f0) >> 4]);
    cpu.dataView.setUint16(30, _z2 + 1, true);
    cpu.cycles++;
  } else if ((opcode & 0xfe0f) === 0x9202) {
    /* STZ(DEC), 1001 001r rrrr 0010 */
    var _i9 = cpu.data[(opcode & 0x1f0) >> 4];

    var _z3 = cpu.dataView.getUint16(30, true) - 1;

    cpu.dataView.setUint16(30, _z3, true);
    cpu.writeData(_z3, _i9);
    cpu.cycles++;
  } else if ((opcode & 0xd208) === 0x8200 && opcode & 7 | (opcode & 0xc00) >> 7 | (opcode & 0x2000) >> 8) {
    /* STDZ, 10q0 qq1r rrrr 0qqq */
    cpu.writeData(cpu.dataView.getUint16(30, true) + (opcode & 7 | (opcode & 0xc00) >> 7 | (opcode & 0x2000) >> 8), cpu.data[(opcode & 0x1f0) >> 4]);
    cpu.cycles++;
  } else if ((opcode & 0xfc00) === 0x1800) {
    /* SUB, 0001 10rd dddd rrrr */
    var _val5 = cpu.data[(opcode & 0x1f0) >> 4];
    var _val6 = cpu.data[opcode & 0xf | (opcode & 0x200) >> 5];

    var _R25 = _val5 - _val6;

    cpu.data[(opcode & 0x1f0) >> 4] = _R25;

    var _sreg21 = cpu.data[95] & 0xc0;

    _sreg21 |= _R25 ? 0 : 2;
    _sreg21 |= 128 & _R25 ? 4 : 0;
    _sreg21 |= (_val5 ^ _val6) & (_val5 ^ _R25) & 128 ? 8 : 0;
    _sreg21 |= _sreg21 >> 2 & 1 ^ _sreg21 >> 3 & 1 ? 0x10 : 0;
    _sreg21 |= _val6 > _val5 ? 1 : 0;
    _sreg21 |= 1 & (~_val5 & _val6 | _val6 & _R25 | _R25 & ~_val5) ? 0x20 : 0;
    cpu.data[95] = _sreg21;
  } else if ((opcode & 0xf000) === 0x5000) {
    /* SUBI, 0101 KKKK dddd KKKK */
    var _val7 = cpu.data[((opcode & 0xf0) >> 4) + 16];

    var _val8 = opcode & 0xf | (opcode & 0xf00) >> 4;

    var _R26 = _val7 - _val8;

    cpu.data[((opcode & 0xf0) >> 4) + 16] = _R26;

    var _sreg22 = cpu.data[95] & 0xc0;

    _sreg22 |= _R26 ? 0 : 2;
    _sreg22 |= 128 & _R26 ? 4 : 0;
    _sreg22 |= (_val7 ^ _val8) & (_val7 ^ _R26) & 128 ? 8 : 0;
    _sreg22 |= _sreg22 >> 2 & 1 ^ _sreg22 >> 3 & 1 ? 0x10 : 0;
    _sreg22 |= _val8 > _val7 ? 1 : 0;
    _sreg22 |= 1 & (~_val7 & _val8 | _val8 & _R26 | _R26 & ~_val7) ? 0x20 : 0;
    cpu.data[95] = _sreg22;
  } else if ((opcode & 0xfe0f) === 0x9402) {
    /* SWAP, 1001 010d dddd 0010 */
    var _d8 = (opcode & 0x1f0) >> 4;

    var _i10 = cpu.data[_d8];
    cpu.data[_d8] = (15 & _i10) << 4 | (240 & _i10) >>> 4;
  } else if (opcode === 0x95a8) {
    /* WDR, 1001 0101 1010 1000 */

    /* not implemented */
  } else if ((opcode & 0xfe0f) === 0x9204) {
    /* XCH, 1001 001r rrrr 0100 */
    var _r9 = (opcode & 0x1f0) >> 4;

    var _val9 = cpu.data[_r9];
    var _val10 = cpu.data[cpu.dataView.getUint16(30, true)];
    cpu.data[cpu.dataView.getUint16(30, true)] = _val9;
    cpu.data[_r9] = _val10;
  }

  cpu.pc = (cpu.pc + 1) % cpu.progMem.length;
  cpu.cycles++;
}
},{}],"../../node_modules/avr8js/dist/esm/cpu/interrupt.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.avrInterrupt = avrInterrupt;

/**
 * AVR-8 Interrupt Handling
 * Part of AVR8js
 * Reference: http://ww1.microchip.com/downloads/en/devicedoc/atmel-0856-avr-instruction-set-manual.pdf
 *
 * Copyright (C) 2019, Uri Shaked
 */
function avrInterrupt(cpu, addr) {
  var sp = cpu.dataView.getUint16(93, true);
  cpu.data[sp] = cpu.pc & 0xff;
  cpu.data[sp - 1] = cpu.pc >> 8 & 0xff;

  if (cpu.pc22Bits) {
    cpu.data[sp - 2] = cpu.pc >> 16 & 0xff;
  }

  cpu.dataView.setUint16(93, sp - (cpu.pc22Bits ? 3 : 2), true);
  cpu.data[95] &= 0x7f; // clear global interrupt flag

  cpu.cycles += 2;
  cpu.pc = addr;
}
},{}],"../../node_modules/avr8js/dist/esm/peripherals/gpio.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AVRIOPort = exports.PinOverrideMode = exports.PinState = exports.portLConfig = exports.portKConfig = exports.portJConfig = exports.portHConfig = exports.portGConfig = exports.portFConfig = exports.portEConfig = exports.portDConfig = exports.portCConfig = exports.portBConfig = exports.portAConfig = void 0;

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var portAConfig = {
  PIN: 0x20,
  DDR: 0x21,
  PORT: 0x22
};
exports.portAConfig = portAConfig;
var portBConfig = {
  PIN: 0x23,
  DDR: 0x24,
  PORT: 0x25
};
exports.portBConfig = portBConfig;
var portCConfig = {
  PIN: 0x26,
  DDR: 0x27,
  PORT: 0x28
};
exports.portCConfig = portCConfig;
var portDConfig = {
  PIN: 0x29,
  DDR: 0x2a,
  PORT: 0x2b
};
exports.portDConfig = portDConfig;
var portEConfig = {
  PIN: 0x2c,
  DDR: 0x2d,
  PORT: 0x2e
};
exports.portEConfig = portEConfig;
var portFConfig = {
  PIN: 0x2f,
  DDR: 0x30,
  PORT: 0x31
};
exports.portFConfig = portFConfig;
var portGConfig = {
  PIN: 0x32,
  DDR: 0x33,
  PORT: 0x34
};
exports.portGConfig = portGConfig;
var portHConfig = {
  PIN: 0x100,
  DDR: 0x101,
  PORT: 0x102
};
exports.portHConfig = portHConfig;
var portJConfig = {
  PIN: 0x103,
  DDR: 0x104,
  PORT: 0x105
};
exports.portJConfig = portJConfig;
var portKConfig = {
  PIN: 0x106,
  DDR: 0x107,
  PORT: 0x108
};
exports.portKConfig = portKConfig;
var portLConfig = {
  PIN: 0x109,
  DDR: 0x10a,
  PORT: 0x10b
};
exports.portLConfig = portLConfig;
var PinState;
exports.PinState = PinState;

(function (PinState) {
  PinState[PinState["Low"] = 0] = "Low";
  PinState[PinState["High"] = 1] = "High";
  PinState[PinState["Input"] = 2] = "Input";
  PinState[PinState["InputPullUp"] = 3] = "InputPullUp";
})(PinState || (exports.PinState = PinState = {}));
/* This mechanism allows timers to override specific GPIO pins */


var PinOverrideMode;
exports.PinOverrideMode = PinOverrideMode;

(function (PinOverrideMode) {
  PinOverrideMode[PinOverrideMode["None"] = 0] = "None";
  PinOverrideMode[PinOverrideMode["Enable"] = 1] = "Enable";
  PinOverrideMode[PinOverrideMode["Set"] = 2] = "Set";
  PinOverrideMode[PinOverrideMode["Clear"] = 3] = "Clear";
  PinOverrideMode[PinOverrideMode["Toggle"] = 4] = "Toggle";
})(PinOverrideMode || (exports.PinOverrideMode = PinOverrideMode = {}));

var AVRIOPort = /*#__PURE__*/function () {
  function AVRIOPort(cpu, portConfig) {
    var _this = this;

    _classCallCheck(this, AVRIOPort);

    this.cpu = cpu;
    this.portConfig = portConfig;
    this.listeners = [];
    this.pinValue = 0;
    this.overrideMask = 0xff;
    this.lastValue = 0;
    this.lastDdr = 0;

    cpu.writeHooks[portConfig.DDR] = function (value) {
      var portValue = cpu.data[portConfig.PORT];
      cpu.data[portConfig.DDR] = value;

      _this.updatePinRegister(portValue, value);

      _this.writeGpio(portValue, value);

      return true;
    };

    cpu.writeHooks[portConfig.PORT] = function (value) {
      var ddrMask = cpu.data[portConfig.DDR];
      cpu.data[portConfig.PORT] = value;

      _this.updatePinRegister(value, ddrMask);

      _this.writeGpio(value, ddrMask);

      return true;
    };

    cpu.writeHooks[portConfig.PIN] = function (value) {
      // Writing to 1 PIN toggles PORT bits
      var oldPortValue = cpu.data[portConfig.PORT];
      var ddrMask = cpu.data[portConfig.DDR];
      var portValue = oldPortValue ^ value;
      cpu.data[portConfig.PORT] = portValue;
      cpu.data[portConfig.PIN] = cpu.data[portConfig.PIN] & ~ddrMask | portValue & ddrMask;

      _this.writeGpio(portValue, ddrMask);

      return true;
    }; // The following hook is used by the timer compare output to override GPIO pins:


    cpu.gpioTimerHooks[portConfig.PORT] = function (pin, mode) {
      var pinMask = 1 << pin;

      if (mode == PinOverrideMode.None) {
        _this.overrideMask |= pinMask;
      } else {
        _this.overrideMask &= ~pinMask;

        switch (mode) {
          case PinOverrideMode.Enable:
            _this.overrideValue &= ~pinMask;
            _this.overrideValue |= cpu.data[portConfig.PORT] & pinMask;
            break;

          case PinOverrideMode.Set:
            _this.overrideValue |= pinMask;
            break;

          case PinOverrideMode.Clear:
            _this.overrideValue &= ~pinMask;
            break;

          case PinOverrideMode.Toggle:
            _this.overrideValue ^= pinMask;
            break;
        }
      }

      _this.writeGpio(cpu.data[portConfig.PORT], cpu.data[portConfig.DDR]);
    };
  }

  _createClass(AVRIOPort, [{
    key: "addListener",
    value: function addListener(listener) {
      this.listeners.push(listener);
    }
  }, {
    key: "removeListener",
    value: function removeListener(listener) {
      this.listeners = this.listeners.filter(function (l) {
        return l !== listener;
      });
    }
    /**
     * Get the state of a given GPIO pin
     *
     * @param index Pin index to return from 0 to 7
     * @returns PinState.Low or PinState.High if the pin is set to output, PinState.Input if the pin is set
     *   to input, and PinState.InputPullUp if the pin is set to input and the internal pull-up resistor has
     *   been enabled.
     */

  }, {
    key: "pinState",
    value: function pinState(index) {
      var ddr = this.cpu.data[this.portConfig.DDR];
      var port = this.cpu.data[this.portConfig.PORT];
      var bitMask = 1 << index;

      if (ddr & bitMask) {
        return this.lastValue & bitMask ? PinState.High : PinState.Low;
      } else {
        return port & bitMask ? PinState.InputPullUp : PinState.Input;
      }
    }
    /**
     * Sets the input value for the given pin. This is the value that
     * will be returned when reading from the PIN register.
     */

  }, {
    key: "setPin",
    value: function setPin(index, value) {
      var bitMask = 1 << index;
      this.pinValue &= ~bitMask;

      if (value) {
        this.pinValue |= bitMask;
      }

      this.updatePinRegister(this.cpu.data[this.portConfig.PORT], this.cpu.data[this.portConfig.DDR]);
    }
  }, {
    key: "updatePinRegister",
    value: function updatePinRegister(port, ddr) {
      this.cpu.data[this.portConfig.PIN] = this.pinValue & ~ddr | port & ddr;
    }
  }, {
    key: "writeGpio",
    value: function writeGpio(value, ddr) {
      var newValue = (value & this.overrideMask | this.overrideValue) & ddr | value & ~ddr;
      var prevValue = this.lastValue;

      if (newValue !== prevValue || ddr !== this.lastDdr) {
        this.lastValue = newValue;
        this.lastDdr = ddr;

        var _iterator = _createForOfIteratorHelper(this.listeners),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var listener = _step.value;
            listener(newValue, prevValue);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }
  }]);

  return AVRIOPort;
}();

exports.AVRIOPort = AVRIOPort;
},{}],"../../node_modules/avr8js/dist/esm/peripherals/timer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AVRTimer = exports.timer2Config = exports.timer1Config = exports.timer0Config = void 0;

var _interrupt = require("../cpu/interrupt");

var _gpio = require("./gpio");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var timer01Dividers = {
  0: 0,
  1: 1,
  2: 8,
  3: 64,
  4: 256,
  5: 1024,
  6: 0,
  7: 0
};
/** These are differnet for some devices (e.g. ATtiny85) */

var defaultTimerBits = {
  // TIFR bits
  TOV: 1,
  OCFA: 2,
  OCFB: 4,
  // TIMSK bits
  TOIE: 1,
  OCIEA: 2,
  OCIEB: 4
};
var timer0Config = Object.assign({
  bits: 8,
  captureInterrupt: 0,
  compAInterrupt: 0x1c,
  compBInterrupt: 0x1e,
  ovfInterrupt: 0x20,
  TIFR: 0x35,
  OCRA: 0x47,
  OCRB: 0x48,
  ICR: 0,
  TCNT: 0x46,
  TCCRA: 0x44,
  TCCRB: 0x45,
  TCCRC: 0,
  TIMSK: 0x6e,
  dividers: timer01Dividers,
  compPortA: _gpio.portDConfig.PORT,
  compPinA: 6,
  compPortB: _gpio.portDConfig.PORT,
  compPinB: 5
}, defaultTimerBits);
exports.timer0Config = timer0Config;
var timer1Config = Object.assign({
  bits: 16,
  captureInterrupt: 0x14,
  compAInterrupt: 0x16,
  compBInterrupt: 0x18,
  ovfInterrupt: 0x1a,
  TIFR: 0x36,
  OCRA: 0x88,
  OCRB: 0x8a,
  ICR: 0x86,
  TCNT: 0x84,
  TCCRA: 0x80,
  TCCRB: 0x81,
  TCCRC: 0x82,
  TIMSK: 0x6f,
  dividers: timer01Dividers,
  compPortA: _gpio.portBConfig.PORT,
  compPinA: 1,
  compPortB: _gpio.portBConfig.PORT,
  compPinB: 2
}, defaultTimerBits);
exports.timer1Config = timer1Config;
var timer2Config = Object.assign({
  bits: 8,
  captureInterrupt: 0,
  compAInterrupt: 0x0e,
  compBInterrupt: 0x10,
  ovfInterrupt: 0x12,
  TIFR: 0x37,
  OCRA: 0xb3,
  OCRB: 0xb4,
  ICR: 0,
  TCNT: 0xb2,
  TCCRA: 0xb0,
  TCCRB: 0xb1,
  TCCRC: 0,
  TIMSK: 0x70,
  dividers: {
    0: 0,
    1: 1,
    2: 8,
    3: 32,
    4: 64,
    5: 128,
    6: 256,
    7: 1024
  },
  compPortA: _gpio.portBConfig.PORT,
  compPinA: 3,
  compPortB: _gpio.portDConfig.PORT,
  compPinB: 3
}, defaultTimerBits);
/* All the following types and constants are related to WGM (Waveform Generation Mode) bits: */

exports.timer2Config = timer2Config;
var TimerMode;

(function (TimerMode) {
  TimerMode[TimerMode["Normal"] = 0] = "Normal";
  TimerMode[TimerMode["PWMPhaseCorrect"] = 1] = "PWMPhaseCorrect";
  TimerMode[TimerMode["CTC"] = 2] = "CTC";
  TimerMode[TimerMode["FastPWM"] = 3] = "FastPWM";
  TimerMode[TimerMode["PWMPhaseFrequencyCorrect"] = 4] = "PWMPhaseFrequencyCorrect";
  TimerMode[TimerMode["Reserved"] = 5] = "Reserved";
})(TimerMode || (TimerMode = {}));

var TOVUpdateMode;

(function (TOVUpdateMode) {
  TOVUpdateMode[TOVUpdateMode["Max"] = 0] = "Max";
  TOVUpdateMode[TOVUpdateMode["Top"] = 1] = "Top";
  TOVUpdateMode[TOVUpdateMode["Bottom"] = 2] = "Bottom";
})(TOVUpdateMode || (TOVUpdateMode = {}));

var OCRUpdateMode;

(function (OCRUpdateMode) {
  OCRUpdateMode[OCRUpdateMode["Immediate"] = 0] = "Immediate";
  OCRUpdateMode[OCRUpdateMode["Top"] = 1] = "Top";
  OCRUpdateMode[OCRUpdateMode["Bottom"] = 2] = "Bottom";
})(OCRUpdateMode || (OCRUpdateMode = {}));

var TopOCRA = 1;
var TopICR = 2;
var wgmModes8Bit = [
/*0*/
[TimerMode.Normal, 0xff, OCRUpdateMode.Immediate, TOVUpdateMode.Max],
/*1*/
[TimerMode.PWMPhaseCorrect, 0xff, OCRUpdateMode.Top, TOVUpdateMode.Bottom],
/*2*/
[TimerMode.CTC, TopOCRA, OCRUpdateMode.Immediate, TOVUpdateMode.Max],
/*3*/
[TimerMode.FastPWM, 0xff, OCRUpdateMode.Bottom, TOVUpdateMode.Max],
/*4*/
[TimerMode.Reserved, 0xff, OCRUpdateMode.Immediate, TOVUpdateMode.Max],
/*5*/
[TimerMode.PWMPhaseCorrect, TopOCRA, OCRUpdateMode.Top, TOVUpdateMode.Bottom],
/*6*/
[TimerMode.Reserved, 0xff, OCRUpdateMode.Immediate, TOVUpdateMode.Max],
/*7*/
[TimerMode.FastPWM, TopOCRA, OCRUpdateMode.Bottom, TOVUpdateMode.Top]]; // Table 16-4 in the datasheet

var wgmModes16Bit = [
/*0 */
[TimerMode.Normal, 0xffff, OCRUpdateMode.Immediate, TOVUpdateMode.Max],
/*1 */
[TimerMode.PWMPhaseCorrect, 0x00ff, OCRUpdateMode.Top, TOVUpdateMode.Bottom],
/*2 */
[TimerMode.PWMPhaseCorrect, 0x01ff, OCRUpdateMode.Top, TOVUpdateMode.Bottom],
/*3 */
[TimerMode.PWMPhaseCorrect, 0x03ff, OCRUpdateMode.Top, TOVUpdateMode.Bottom],
/*4 */
[TimerMode.CTC, TopOCRA, OCRUpdateMode.Immediate, TOVUpdateMode.Max],
/*5 */
[TimerMode.FastPWM, 0x00ff, OCRUpdateMode.Bottom, TOVUpdateMode.Top],
/*6 */
[TimerMode.FastPWM, 0x01ff, OCRUpdateMode.Bottom, TOVUpdateMode.Top],
/*7 */
[TimerMode.FastPWM, 0x03ff, OCRUpdateMode.Bottom, TOVUpdateMode.Top],
/*8 */
[TimerMode.PWMPhaseFrequencyCorrect, TopICR, OCRUpdateMode.Bottom, TOVUpdateMode.Bottom],
/*9 */
[TimerMode.PWMPhaseFrequencyCorrect, TopOCRA, OCRUpdateMode.Bottom, TOVUpdateMode.Bottom],
/*10*/
[TimerMode.PWMPhaseCorrect, TopICR, OCRUpdateMode.Top, TOVUpdateMode.Bottom],
/*11*/
[TimerMode.PWMPhaseCorrect, TopOCRA, OCRUpdateMode.Top, TOVUpdateMode.Bottom],
/*12*/
[TimerMode.CTC, TopICR, OCRUpdateMode.Immediate, TOVUpdateMode.Max],
/*13*/
[TimerMode.Reserved, 0xffff, OCRUpdateMode.Immediate, TOVUpdateMode.Max],
/*14*/
[TimerMode.FastPWM, TopICR, OCRUpdateMode.Bottom, TOVUpdateMode.Top],
/*15*/
[TimerMode.FastPWM, TopOCRA, OCRUpdateMode.Bottom, TOVUpdateMode.Top]];

function compToOverride(comp) {
  switch (comp) {
    case 1:
      return _gpio.PinOverrideMode.Toggle;

    case 2:
      return _gpio.PinOverrideMode.Clear;

    case 3:
      return _gpio.PinOverrideMode.Set;

    default:
      return _gpio.PinOverrideMode.Enable;
  }
}

var AVRTimer = /*#__PURE__*/function () {
  function AVRTimer(cpu, config) {
    var _this = this;

    _classCallCheck(this, AVRTimer);

    this.cpu = cpu;
    this.config = config;
    this.lastCycle = 0;
    this.ocrA = 0;
    this.ocrB = 0;
    this.icr = 0; // only for 16-bit timers

    this.tcnt = 0;
    this.tcntUpdated = false;
    this.countingUp = true;
    this.divider = 0;
    this.pendingInterrupt = false; // This is the temporary register used to access 16-bit registers (section 16.3 of the datasheet)

    this.highByteTemp = 0;
    this.updateWGMConfig();

    this.cpu.readHooks[config.TCNT] = function (addr) {
      _this.tick();

      if (_this.config.bits === 16) {
        _this.cpu.data[addr + 1] = _this.tcnt >> 8;
      }

      return _this.cpu.data[addr] = _this.tcnt & 0xff;
    };

    this.cpu.writeHooks[config.TCNT] = function (value) {
      _this.tcnt = _this.highByteTemp << 8 | value;
      _this.countingUp = true;
      _this.tcntUpdated = true;

      _this.timerUpdated();
    };

    this.cpu.writeHooks[config.OCRA] = function (value) {
      // TODO implement buffering when timer running in PWM mode
      _this.ocrA = _this.highByteTemp << 8 | value;
    };

    this.cpu.writeHooks[config.OCRB] = function (value) {
      // TODO implement buffering when timer running in PWM mode
      _this.ocrB = _this.highByteTemp << 8 | value;
    };

    this.cpu.writeHooks[config.ICR] = function (value) {
      _this.icr = _this.highByteTemp << 8 | value;
    };

    if (this.config.bits === 16) {
      var updateTempRegister = function updateTempRegister(value) {
        _this.highByteTemp = value;
      };

      this.cpu.writeHooks[config.TCNT + 1] = updateTempRegister;
      this.cpu.writeHooks[config.OCRA + 1] = updateTempRegister;
      this.cpu.writeHooks[config.OCRB + 1] = updateTempRegister;
      this.cpu.writeHooks[config.ICR + 1] = updateTempRegister;
    }

    cpu.writeHooks[config.TCCRA] = function (value) {
      _this.cpu.data[config.TCCRA] = value;
      _this.compA = value >> 6 & 0x3;

      _this.updateCompA(_this.compA ? _gpio.PinOverrideMode.Enable : _gpio.PinOverrideMode.None);

      _this.compB = value >> 4 & 0x3;

      _this.updateCompB(_this.compB ? _gpio.PinOverrideMode.Enable : _gpio.PinOverrideMode.None);

      _this.updateWGMConfig();

      return true;
    };

    cpu.writeHooks[config.TCCRB] = function (value) {
      _this.cpu.data[config.TCCRB] = value;
      _this.tcntUpdated = true;
      _this.divider = _this.config.dividers[_this.CS];

      _this.updateWGMConfig();

      return true;
    };
  }

  _createClass(AVRTimer, [{
    key: "reset",
    value: function reset() {
      this.divider = 0;
      this.lastCycle = 0;
      this.ocrA = 0;
      this.ocrB = 0;
    }
  }, {
    key: "updateWGMConfig",
    value: function updateWGMConfig() {
      var wgmModes = this.config.bits === 16 ? wgmModes16Bit : wgmModes8Bit;

      var _wgmModes$this$WGM = _slicedToArray(wgmModes[this.WGM], 2),
          timerMode = _wgmModes$this$WGM[0],
          topValue = _wgmModes$this$WGM[1];

      this.timerMode = timerMode;
      this.topValue = topValue;
    }
  }, {
    key: "tick",
    value: function tick() {
      var divider = this.divider,
          lastCycle = this.lastCycle;
      var delta = this.cpu.cycles - lastCycle;

      if (divider && delta >= divider) {
        var counterDelta = Math.floor(delta / divider);
        this.lastCycle += counterDelta * divider;
        var val = this.tcnt;
        var timerMode = this.timerMode;
        var phasePwm = timerMode === TimerMode.PWMPhaseCorrect || timerMode === TimerMode.PWMPhaseFrequencyCorrect;
        var newVal = phasePwm ? this.phasePwmCount(val, counterDelta) : (val + counterDelta) % (this.TOP + 1); // A CPU write overrides (has priority over) all counter clear or count operations.

        if (!this.tcntUpdated) {
          this.tcnt = newVal;
          this.timerUpdated();
        }

        if ((timerMode === TimerMode.Normal || timerMode === TimerMode.FastPWM) && val > newVal) {
          this.TIFR |= this.config.TOV;
        }
      }

      this.tcntUpdated = false;

      if (this.cpu.interruptsEnabled && this.pendingInterrupt) {
        var TIFR = this.TIFR,
            TIMSK = this.TIMSK;
        var _this$config = this.config,
            TOV = _this$config.TOV,
            OCFA = _this$config.OCFA,
            OCFB = _this$config.OCFB,
            TOIE = _this$config.TOIE,
            OCIEA = _this$config.OCIEA,
            OCIEB = _this$config.OCIEB;

        if (TIFR & TOV && TIMSK & TOIE) {
          (0, _interrupt.avrInterrupt)(this.cpu, this.config.ovfInterrupt);
          this.TIFR &= ~TOV;
        }

        if (TIFR & OCFA && TIMSK & OCIEA) {
          (0, _interrupt.avrInterrupt)(this.cpu, this.config.compAInterrupt);
          this.TIFR &= ~OCFA;
        }

        if (TIFR & OCFB && TIMSK & OCIEB) {
          (0, _interrupt.avrInterrupt)(this.cpu, this.config.compBInterrupt);
          this.TIFR &= ~OCFB;
        }

        this.pendingInterrupt = false;
      }
    }
  }, {
    key: "phasePwmCount",
    value: function phasePwmCount(value, delta) {
      while (delta > 0) {
        if (this.countingUp) {
          value++;

          if (value === this.TOP && !this.tcntUpdated) {
            this.countingUp = false;
          }
        } else {
          value--;

          if (!value && !this.tcntUpdated) {
            this.countingUp = true;
            this.TIFR |= this.config.TOV;
          }
        }

        delta--;
      }

      return value;
    }
  }, {
    key: "timerUpdated",
    value: function timerUpdated() {
      var value = this.tcnt;

      if (this.ocrA && value === this.ocrA) {
        var _this$config2 = this.config,
            TOV = _this$config2.TOV,
            OCFA = _this$config2.OCFA;
        this.TIFR |= OCFA;

        if (this.timerMode === TimerMode.CTC) {
          // Clear Timer on Compare Match (CTC) Mode
          this.tcnt = 0;
          this.TIFR |= TOV;
        }

        if (this.compA) {
          this.updateCompPin(this.compA, 'A');
        }
      }

      if (this.ocrB && value === this.ocrB) {
        this.TIFR |= this.config.OCFB;

        if (this.compB) {
          this.updateCompPin(this.compB, 'B');
        }
      }
    }
  }, {
    key: "updateCompPin",
    value: function updateCompPin(compValue, pinName) {
      var newValue = _gpio.PinOverrideMode.None;
      var inverted = compValue === 3;
      var isSet = this.countingUp === inverted;

      switch (this.timerMode) {
        case TimerMode.Normal:
        case TimerMode.CTC:
        case TimerMode.FastPWM:
          newValue = compToOverride(compValue);
          break;

        case TimerMode.PWMPhaseCorrect:
        case TimerMode.PWMPhaseFrequencyCorrect:
          newValue = isSet ? _gpio.PinOverrideMode.Set : _gpio.PinOverrideMode.Clear;
          break;
      }

      if (newValue !== _gpio.PinOverrideMode.None) {
        if (pinName === 'A') {
          this.updateCompA(newValue);
        } else {
          this.updateCompB(newValue);
        }
      }
    }
  }, {
    key: "updateCompA",
    value: function updateCompA(value) {
      var _this$config3 = this.config,
          compPortA = _this$config3.compPortA,
          compPinA = _this$config3.compPinA;
      var hook = this.cpu.gpioTimerHooks[compPortA];

      if (hook) {
        hook(compPinA, value, compPortA);
      }
    }
  }, {
    key: "updateCompB",
    value: function updateCompB(value) {
      var _this$config4 = this.config,
          compPortB = _this$config4.compPortB,
          compPinB = _this$config4.compPinB;
      var hook = this.cpu.gpioTimerHooks[compPortB];

      if (hook) {
        hook(compPinB, value, compPortB);
      }
    }
  }, {
    key: "TIFR",
    get: function get() {
      return this.cpu.data[this.config.TIFR];
    },
    set: function set(value) {
      this.pendingInterrupt = value > 0;
      this.cpu.data[this.config.TIFR] = value;
    }
  }, {
    key: "TCCRA",
    get: function get() {
      return this.cpu.data[this.config.TCCRA];
    }
  }, {
    key: "TCCRB",
    get: function get() {
      return this.cpu.data[this.config.TCCRB];
    }
  }, {
    key: "TIMSK",
    get: function get() {
      return this.cpu.data[this.config.TIMSK];
    }
  }, {
    key: "CS",
    get: function get() {
      return this.TCCRB & 0x7;
    }
  }, {
    key: "WGM",
    get: function get() {
      var mask = this.config.bits === 16 ? 0x18 : 0x8;
      return (this.TCCRB & mask) >> 1 | this.TCCRA & 0x3;
    }
  }, {
    key: "TOP",
    get: function get() {
      switch (this.topValue) {
        case TopOCRA:
          return this.ocrA;

        case TopICR:
          return this.icr;

        default:
          return this.topValue;
      }
    }
  }]);

  return AVRTimer;
}();

exports.AVRTimer = AVRTimer;
},{"../cpu/interrupt":"../../node_modules/avr8js/dist/esm/cpu/interrupt.js","./gpio":"../../node_modules/avr8js/dist/esm/peripherals/gpio.js"}],"../../node_modules/avr8js/dist/esm/peripherals/usart.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AVRUSART = exports.usart0Config = void 0;

var _interrupt = require("../cpu/interrupt");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var usart0Config = {
  rxCompleteInterrupt: 0x24,
  dataRegisterEmptyInterrupt: 0x26,
  txCompleteInterrupt: 0x28,
  UCSRA: 0xc0,
  UCSRB: 0xc1,
  UCSRC: 0xc2,
  UBRRL: 0xc4,
  UBRRH: 0xc5,
  UDR: 0xc6
};
/* eslint-disable @typescript-eslint/no-unused-vars */
// Register bits:

exports.usart0Config = usart0Config;
var UCSRA_RXC = 0x80; // USART Receive Complete

var UCSRA_TXC = 0x40; // USART Transmit Complete

var UCSRA_UDRE = 0x20; // USART Data Register Empty

var UCSRA_FE = 0x10; // Frame Error

var UCSRA_DOR = 0x8; // Data OverRun

var UCSRA_UPE = 0x4; // USART Parity Error

var UCSRA_U2X = 0x2; // Double the USART Transmission Speed

var UCSRA_MPCM = 0x1; // Multi-processor Communication Mode

var UCSRB_RXCIE = 0x80; // RX Complete Interrupt Enable

var UCSRB_TXCIE = 0x40; // TX Complete Interrupt Enable

var UCSRB_UDRIE = 0x20; // USART Data Register Empty Interrupt Enable

var UCSRB_RXEN = 0x10; // Receiver Enable

var UCSRB_TXEN = 0x8; // Transmitter Enable

var UCSRB_UCSZ2 = 0x4; // Character Size 2

var UCSRB_RXB8 = 0x2; // Receive Data Bit 8

var UCSRB_TXB8 = 0x1; // Transmit Data Bit 8

var UCSRC_UMSEL1 = 0x80; // USART Mode Select 1

var UCSRC_UMSEL0 = 0x40; // USART Mode Select 0

var UCSRC_UPM1 = 0x20; // Parity Mode 1

var UCSRC_UPM0 = 0x10; // Parity Mode 0

var UCSRC_USBS = 0x8; // Stop Bit Select

var UCSRC_UCSZ1 = 0x4; // Character Size 1

var UCSRC_UCSZ0 = 0x2; // Character Size 0

var UCSRC_UCPOL = 0x1; // Clock Polarity

/* eslint-enable @typescript-eslint/no-unused-vars */

var AVRUSART = /*#__PURE__*/function () {
  function AVRUSART(cpu, config, freqMHz) {
    var _this = this;

    _classCallCheck(this, AVRUSART);

    this.cpu = cpu;
    this.config = config;
    this.freqMHz = freqMHz;
    this.onByteTransmit = null;
    this.onLineTransmit = null;
    this.lineBuffer = '';

    this.cpu.writeHooks[config.UCSRA] = function (value) {
      _this.cpu.data[config.UCSRA] = value | UCSRA_UDRE | UCSRA_TXC;
      return true;
    };

    this.cpu.writeHooks[config.UCSRB] = function (value, oldValue) {
      if (value & UCSRB_TXEN && !(oldValue & UCSRB_TXEN)) {
        // Enabling the transmission - mark UDR as empty
        _this.cpu.data[config.UCSRA] |= UCSRA_UDRE;
      }
    };

    this.cpu.writeHooks[config.UDR] = function (value) {
      if (_this.onByteTransmit) {
        _this.onByteTransmit(value);
      }

      if (_this.onLineTransmit) {
        var ch = String.fromCharCode(value);

        if (ch === '\n') {
          _this.onLineTransmit(_this.lineBuffer);

          _this.lineBuffer = '';
        } else {
          _this.lineBuffer += ch;
        }
      }

      _this.cpu.data[config.UCSRA] |= UCSRA_UDRE | UCSRA_TXC;
    };
  }

  _createClass(AVRUSART, [{
    key: "tick",
    value: function tick() {
      if (this.cpu.interruptsEnabled) {
        var ucsra = this.cpu.data[this.config.UCSRA];
        var ucsrb = this.cpu.data[this.config.UCSRB];

        if (ucsra & UCSRA_UDRE && ucsrb & UCSRB_UDRIE) {
          (0, _interrupt.avrInterrupt)(this.cpu, this.config.dataRegisterEmptyInterrupt);
          this.cpu.data[this.config.UCSRA] &= ~UCSRA_UDRE;
        }

        if (ucsra & UCSRA_TXC && ucsrb & UCSRB_TXCIE) {
          (0, _interrupt.avrInterrupt)(this.cpu, this.config.txCompleteInterrupt);
          this.cpu.data[this.config.UCSRA] &= ~UCSRA_TXC;
        }
      }
    }
  }, {
    key: "baudRate",
    get: function get() {
      var UBRR = this.cpu.data[this.config.UBRRH] << 8 | this.cpu.data[this.config.UBRRL];
      var multiplier = this.cpu.data[this.config.UCSRA] & UCSRA_U2X ? 8 : 16;
      return Math.floor(this.freqMHz / (multiplier * (1 + UBRR)));
    }
  }, {
    key: "bitsPerChar",
    get: function get() {
      var ucsz = (this.cpu.data[this.config.UCSRC] & (UCSRC_UCSZ1 | UCSRC_UCSZ0)) >> 1 | this.cpu.data[this.config.UCSRB] & UCSRB_UCSZ2;

      switch (ucsz) {
        case 0:
          return 5;

        case 1:
          return 6;

        case 2:
          return 7;

        case 3:
          return 8;

        default: // 4..6 are reserved

        case 7:
          return 9;
      }
    }
  }]);

  return AVRUSART;
}();

exports.AVRUSART = AVRUSART;
},{"../cpu/interrupt":"../../node_modules/avr8js/dist/esm/cpu/interrupt.js"}],"../../node_modules/avr8js/dist/esm/peripherals/eeprom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AVREEPROM = exports.eepromConfig = exports.EEPROMMemoryBackend = void 0;

var _interrupt = require("../cpu/interrupt");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var EEPROMMemoryBackend = /*#__PURE__*/function () {
  function EEPROMMemoryBackend(size) {
    _classCallCheck(this, EEPROMMemoryBackend);

    this.memory = new Uint8Array(size);
    this.memory.fill(0xff);
  }

  _createClass(EEPROMMemoryBackend, [{
    key: "readMemory",
    value: function readMemory(addr) {
      return this.memory[addr];
    }
  }, {
    key: "writeMemory",
    value: function writeMemory(addr, value) {
      this.memory[addr] &= value;
    }
  }, {
    key: "eraseMemory",
    value: function eraseMemory(addr) {
      this.memory[addr] = 0xff;
    }
  }]);

  return EEPROMMemoryBackend;
}();

exports.EEPROMMemoryBackend = EEPROMMemoryBackend;
var eepromConfig = {
  eepromReadyInterrupt: 0x2c,
  EECR: 0x3f,
  EEDR: 0x40,
  EEARL: 0x41,
  EEARH: 0x42,
  eraseCycles: 28800,
  writeCycles: 28800
};
exports.eepromConfig = eepromConfig;
var EERE = 1 << 0;
var EEPE = 1 << 1;
var EEMPE = 1 << 2;
var EERIE = 1 << 3;
var EEPM0 = 1 << 4;
var EEPM1 = 1 << 5;

var AVREEPROM = /*#__PURE__*/function () {
  function AVREEPROM(cpu, backend) {
    var _this = this;

    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : eepromConfig;

    _classCallCheck(this, AVREEPROM);

    this.cpu = cpu;
    this.backend = backend;
    this.config = config;
    /**
     * Used to keep track on the last write to EEMPE. From the datasheet:
     * The EEMPE bit determines whether setting EEPE to one causes the EEPROM to be written.
     * When EEMPE is set, setting EEPE within four clock cycles will write data to the EEPROM
     * at the selected address If EEMPE is zero, setting EEPE will have no effect.
     */

    this.writeEnabledCycles = 0;
    this.writeCompleteCycles = 0;

    this.cpu.writeHooks[this.config.EECR] = function (eecr) {
      var _this$config = _this.config,
          EEARH = _this$config.EEARH,
          EEARL = _this$config.EEARL,
          EECR = _this$config.EECR,
          EEDR = _this$config.EEDR;
      var addr = _this.cpu.data[EEARH] << 8 | _this.cpu.data[EEARL];

      if (eecr & EEMPE) {
        _this.writeEnabledCycles = _this.cpu.cycles + 4;
      } // Read


      if (eecr & EERE) {
        _this.cpu.data[EEDR] = _this.backend.readMemory(addr); // When the EEPROM is read, the CPU is halted for four cycles before the
        // next instruction is executed.

        _this.cpu.cycles += 4;
        return true;
      } // Write


      if (eecr & EEPE) {
        //  If EEMPE is zero, setting EEPE will have no effect.
        if (_this.cpu.cycles >= _this.writeEnabledCycles) {
          return true;
        } // Check for write-in-progress


        if (_this.cpu.cycles < _this.writeCompleteCycles) {
          return true;
        }

        var eedr = _this.cpu.data[EEDR];
        _this.writeCompleteCycles = _this.cpu.cycles; // Erase

        if (!(eecr & EEPM1)) {
          _this.backend.eraseMemory(addr);

          _this.writeCompleteCycles += _this.config.eraseCycles;
        } // Write


        if (!(eecr & EEPM0)) {
          _this.backend.writeMemory(addr, eedr);

          _this.writeCompleteCycles += _this.config.writeCycles;
        }

        _this.cpu.data[EECR] |= EEPE; // When EEPE has been set, the CPU is halted for two cycles before the
        // next instruction is executed.

        _this.cpu.cycles += 2;
        return true;
      }

      return false;
    };
  }

  _createClass(AVREEPROM, [{
    key: "tick",
    value: function tick() {
      var _this$config2 = this.config,
          EECR = _this$config2.EECR,
          eepromReadyInterrupt = _this$config2.eepromReadyInterrupt;

      if (this.writeEnabledCycles && this.cpu.cycles > this.writeEnabledCycles) {
        this.cpu.data[EECR] &= ~EEMPE;
      }

      if (this.writeCompleteCycles && this.cpu.cycles > this.writeCompleteCycles) {
        this.cpu.data[EECR] &= ~EEPE;

        if (this.cpu.interruptsEnabled && this.cpu.data[EECR] & EERIE) {
          (0, _interrupt.avrInterrupt)(this.cpu, eepromReadyInterrupt);
        }
      }
    }
  }]);

  return AVREEPROM;
}();

exports.AVREEPROM = AVREEPROM;
},{"../cpu/interrupt":"../../node_modules/avr8js/dist/esm/cpu/interrupt.js"}],"../../node_modules/avr8js/dist/esm/peripherals/twi.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AVRTWI = exports.NoopTWIEventHandler = exports.twiConfig = void 0;

var _interrupt = require("../cpu/interrupt");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint-disable @typescript-eslint/no-unused-vars */
// Register bits:
var TWCR_TWINT = 0x80; // TWI Interrupt Flag

var TWCR_TWEA = 0x40; // TWI Enable Acknowledge Bit

var TWCR_TWSTA = 0x20; // TWI START Condition Bit

var TWCR_TWSTO = 0x10; // TWI STOP Condition Bit

var TWCR_TWWC = 0x8; //TWI Write Collision Flag

var TWCR_TWEN = 0x4; //  TWI Enable Bit

var TWCR_TWIE = 0x1; // TWI Interrupt Enable

var TWSR_TWS_MASK = 0xf8; // TWI Status

var TWSR_TWPS1 = 0x2; // TWI Prescaler Bits

var TWSR_TWPS0 = 0x1; // TWI Prescaler Bits

var TWSR_TWPS_MASK = TWSR_TWPS1 | TWSR_TWPS0; // TWI Prescaler mask

var TWAR_TWA_MASK = 0xfe; //  TWI (Slave) Address Register

var TWAR_TWGCE = 0x1; // TWI General Call Recognition Enable Bit

var STATUS_BUS_ERROR = 0x0;
var STATUS_TWI_IDLE = 0xf8; // Master states

var STATUS_START = 0x08;
var STATUS_REPEATED_START = 0x10;
var STATUS_SLAW_ACK = 0x18;
var STATUS_SLAW_NACK = 0x20;
var STATUS_DATA_SENT_ACK = 0x28;
var STATUS_DATA_SENT_NACK = 0x30;
var STATUS_DATA_LOST_ARBITRATION = 0x38;
var STATUS_SLAR_ACK = 0x40;
var STATUS_SLAR_NACK = 0x48;
var STATUS_DATA_RECEIVED_ACK = 0x50;
var STATUS_DATA_RECEIVED_NACK = 0x58; // TODO: add slave states

/* eslint-enable @typescript-eslint/no-unused-vars */

var twiConfig = {
  twiInterrupt: 0x30,
  TWBR: 0xb8,
  TWSR: 0xb9,
  TWAR: 0xba,
  TWDR: 0xbb,
  TWCR: 0xbc,
  TWAMR: 0xbd
}; // A simple TWI Event Handler that sends a NACK for all events

exports.twiConfig = twiConfig;

var NoopTWIEventHandler = /*#__PURE__*/function () {
  function NoopTWIEventHandler(twi) {
    _classCallCheck(this, NoopTWIEventHandler);

    this.twi = twi;
  }

  _createClass(NoopTWIEventHandler, [{
    key: "start",
    value: function start() {
      this.twi.completeStart();
    }
  }, {
    key: "stop",
    value: function stop() {
      this.twi.completeStop();
    }
  }, {
    key: "connectToSlave",
    value: function connectToSlave() {
      this.twi.completeConnect(false);
    }
  }, {
    key: "writeByte",
    value: function writeByte() {
      this.twi.completeWrite(false);
    }
  }, {
    key: "readByte",
    value: function readByte() {
      this.twi.completeRead(0xff);
    }
  }]);

  return NoopTWIEventHandler;
}();

exports.NoopTWIEventHandler = NoopTWIEventHandler;

var AVRTWI = /*#__PURE__*/function () {
  function AVRTWI(cpu, config, freqMHz) {
    var _this = this;

    _classCallCheck(this, AVRTWI);

    this.cpu = cpu;
    this.config = config;
    this.freqMHz = freqMHz;
    this.eventHandler = new NoopTWIEventHandler(this);
    this.nextTick = null;
    this.updateStatus(STATUS_TWI_IDLE);

    this.cpu.writeHooks[config.TWCR] = function (value) {
      var clearInt = value & TWCR_TWINT;

      if (clearInt) {
        value &= ~TWCR_TWINT;
      }

      var status = _this.status;

      if (clearInt && value & TWCR_TWEN) {
        var twdrValue = _this.cpu.data[_this.config.TWDR];

        _this.nextTick = function () {
          if (value & TWCR_TWSTA) {
            _this.eventHandler.start(status !== STATUS_TWI_IDLE);
          } else if (value & TWCR_TWSTO) {
            _this.eventHandler.stop();
          } else if (status === STATUS_START) {
            _this.eventHandler.connectToSlave(twdrValue >> 1, twdrValue & 0x1 ? false : true);
          } else if (status === STATUS_SLAW_ACK || status === STATUS_DATA_SENT_ACK) {
            _this.eventHandler.writeByte(twdrValue);
          } else if (status === STATUS_SLAR_ACK || status === STATUS_DATA_RECEIVED_ACK) {
            var ack = !!(value & TWCR_TWEA);

            _this.eventHandler.readByte(ack);
          }
        };

        _this.cpu.data[config.TWCR] = value;
        return true;
      }
    };
  }

  _createClass(AVRTWI, [{
    key: "tick",
    value: function tick() {
      if (this.nextTick) {
        this.nextTick();
        this.nextTick = null;
      }

      if (this.cpu.interruptsEnabled) {
        var _this$config = this.config,
            TWCR = _this$config.TWCR,
            twiInterrupt = _this$config.twiInterrupt;

        if (this.cpu.data[TWCR] & TWCR_TWIE && this.cpu.data[TWCR] & TWCR_TWINT) {
          (0, _interrupt.avrInterrupt)(this.cpu, twiInterrupt);
          this.cpu.data[TWCR] &= ~TWCR_TWINT;
        }
      }
    }
  }, {
    key: "completeStart",
    value: function completeStart() {
      this.updateStatus(this.status === STATUS_TWI_IDLE ? STATUS_START : STATUS_REPEATED_START);
    }
  }, {
    key: "completeStop",
    value: function completeStop() {
      this.cpu.data[this.config.TWCR] &= ~TWCR_TWSTO;
      this.updateStatus(STATUS_TWI_IDLE);
    }
  }, {
    key: "completeConnect",
    value: function completeConnect(ack) {
      if (this.cpu.data[this.config.TWDR] & 0x1) {
        this.updateStatus(ack ? STATUS_SLAR_ACK : STATUS_SLAR_NACK);
      } else {
        this.updateStatus(ack ? STATUS_SLAW_ACK : STATUS_SLAW_NACK);
      }
    }
  }, {
    key: "completeWrite",
    value: function completeWrite(ack) {
      this.updateStatus(ack ? STATUS_DATA_SENT_ACK : STATUS_DATA_SENT_NACK);
    }
  }, {
    key: "completeRead",
    value: function completeRead(value) {
      var ack = !!(this.cpu.data[this.config.TWCR] & TWCR_TWEA);
      this.cpu.data[this.config.TWDR] = value;
      this.updateStatus(ack ? STATUS_DATA_RECEIVED_ACK : STATUS_DATA_RECEIVED_NACK);
    }
  }, {
    key: "updateStatus",
    value: function updateStatus(value) {
      var _this$config2 = this.config,
          TWCR = _this$config2.TWCR,
          TWSR = _this$config2.TWSR;
      this.cpu.data[TWSR] = this.cpu.data[TWSR] & ~TWSR_TWS_MASK | value;
      this.cpu.data[TWCR] |= TWCR_TWINT;
    }
  }, {
    key: "prescaler",
    get: function get() {
      switch (this.cpu.data[this.config.TWSR] & TWSR_TWPS_MASK) {
        case 0:
          return 1;

        case 1:
          return 4;

        case 2:
          return 16;

        case 3:
          return 64;
      } // We should never get here:


      throw new Error('Invalid prescaler value!');
    }
  }, {
    key: "sclFrequency",
    get: function get() {
      return this.freqMHz / (16 + 2 * this.cpu.data[this.config.TWBR] * this.prescaler);
    }
  }, {
    key: "status",
    get: function get() {
      return this.cpu.data[this.config.TWSR] & TWSR_TWS_MASK;
    }
  }]);

  return AVRTWI;
}();

exports.AVRTWI = AVRTWI;
},{"../cpu/interrupt":"../../node_modules/avr8js/dist/esm/cpu/interrupt.js"}],"../../node_modules/avr8js/dist/esm/peripherals/spi.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AVRSPI = exports.spiConfig = void 0;

var _interrupt = require("../cpu/interrupt");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Register bits:
var SPCR_SPIE = 0x80; //  SPI Interrupt Enable

var SPCR_SPE = 0x40; // SPI Enable

var SPCR_DORD = 0x20; // Data Order

var SPCR_MSTR = 0x10; //  Master/Slave Select

var SPCR_CPOL = 0x8; // Clock Polarity

var SPCR_CPHA = 0x4; // Clock Phase

var SPCR_SPR1 = 0x2; // SPI Clock Rate Select 1

var SPCR_SPR0 = 0x1; // SPI Clock Rate Select 0

var SPSR_SPR_MASK = SPCR_SPR1 | SPCR_SPR0;
var SPSR_SPIF = 0x80; // SPI Interrupt Flag

var SPSR_WCOL = 0x40; // Write COLlision Flag

var SPSR_SPI2X = 0x1; // Double SPI Speed Bit

var spiConfig = {
  spiInterrupt: 0x22,
  SPCR: 0x4c,
  SPSR: 0x4d,
  SPDR: 0x4e
};
exports.spiConfig = spiConfig;
var bitsPerByte = 8;

var AVRSPI = /*#__PURE__*/function () {
  function AVRSPI(cpu, config, freqMHz) {
    var _this = this;

    _classCallCheck(this, AVRSPI);

    this.cpu = cpu;
    this.config = config;
    this.freqMHz = freqMHz;
    this.onTransfer = null;
    this.transmissionCompleteCycles = 0;
    this.receivedByte = 0;
    var SPCR = config.SPCR,
        SPSR = config.SPSR,
        SPDR = config.SPDR;

    cpu.writeHooks[SPDR] = function (value) {
      var _a, _b;

      if (!(cpu.data[SPCR] & SPCR_SPE)) {
        // SPI not enabled, ignore write
        return;
      } // Write collision


      if (_this.transmissionCompleteCycles > _this.cpu.cycles) {
        cpu.data[SPSR] |= SPSR_WCOL;
        return true;
      } // Clear write collision / interrupt flags


      cpu.data[SPSR] &= ~SPSR_WCOL & ~SPSR_SPIF;
      _this.receivedByte = (_b = (_a = _this.onTransfer) === null || _a === void 0 ? void 0 : _a.call(_this, value)) !== null && _b !== void 0 ? _b : 0;
      _this.transmissionCompleteCycles = _this.cpu.cycles + _this.clockDivider * bitsPerByte;
      return true;
    };
  }

  _createClass(AVRSPI, [{
    key: "tick",
    value: function tick() {
      if (this.transmissionCompleteCycles && this.cpu.cycles >= this.transmissionCompleteCycles) {
        var _this$config = this.config,
            SPSR = _this$config.SPSR,
            SPDR = _this$config.SPDR;
        this.cpu.data[SPSR] |= SPSR_SPIF;
        this.cpu.data[SPDR] = this.receivedByte;
        this.transmissionCompleteCycles = 0;
      }

      if (this.cpu.interruptsEnabled) {
        var _this$config2 = this.config,
            _SPSR = _this$config2.SPSR,
            SPCR = _this$config2.SPCR,
            spiInterrupt = _this$config2.spiInterrupt;

        if (this.cpu.data[SPCR] & SPCR_SPIE && this.cpu.data[_SPSR] & SPSR_SPIF) {
          (0, _interrupt.avrInterrupt)(this.cpu, spiInterrupt);
          this.cpu.data[_SPSR] &= ~SPSR_SPIF;
        }
      }
    }
  }, {
    key: "isMaster",
    get: function get() {
      return this.cpu.data[this.config.SPCR] & SPCR_MSTR ? true : false;
    }
  }, {
    key: "dataOrder",
    get: function get() {
      return this.cpu.data[this.config.SPCR] & SPCR_DORD ? 'lsbFirst' : 'msbFirst';
    }
  }, {
    key: "spiMode",
    get: function get() {
      var CPHA = this.cpu.data[this.config.SPCR] & SPCR_CPHA;
      var CPOL = this.cpu.data[this.config.SPCR] & SPCR_CPOL;
      return (CPHA ? 2 : 0) | (CPOL ? 1 : 0);
    }
    /**
     * The clock divider is only relevant for Master mode
     */

  }, {
    key: "clockDivider",
    get: function get() {
      var base = this.cpu.data[this.config.SPSR] & SPSR_SPI2X ? 2 : 4;

      switch (this.cpu.data[this.config.SPCR] & SPSR_SPR_MASK) {
        case 0:
          return base;

        case 1:
          return base * 4;

        case 2:
          return base * 16;

        case 3:
          return base * 32;
      } // We should never get here:


      throw new Error('Invalid divider value!');
    }
    /**
     * The SPI freqeuncy is only relevant to Master mode.
     * In slave mode, the frequency can be as high as F(osc) / 4.
     */

  }, {
    key: "spiFrequency",
    get: function get() {
      return this.freqMHz / this.clockDivider;
    }
  }]);

  return AVRSPI;
}();

exports.AVRSPI = AVRSPI;
},{"../cpu/interrupt":"../../node_modules/avr8js/dist/esm/cpu/interrupt.js"}],"../../node_modules/avr8js/dist/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  CPU: true,
  avrInstruction: true,
  avrInterrupt: true,
  AVRTimer: true,
  timer0Config: true,
  timer1Config: true,
  timer2Config: true,
  AVRIOPort: true,
  portAConfig: true,
  portBConfig: true,
  portCConfig: true,
  portDConfig: true,
  portEConfig: true,
  portFConfig: true,
  portGConfig: true,
  portHConfig: true,
  portJConfig: true,
  portKConfig: true,
  portLConfig: true,
  PinState: true,
  AVRUSART: true,
  usart0Config: true,
  AVREEPROM: true,
  EEPROMMemoryBackend: true,
  eepromConfig: true,
  spiConfig: true,
  AVRSPI: true
};
Object.defineProperty(exports, "CPU", {
  enumerable: true,
  get: function () {
    return _cpu.CPU;
  }
});
Object.defineProperty(exports, "avrInstruction", {
  enumerable: true,
  get: function () {
    return _instruction.avrInstruction;
  }
});
Object.defineProperty(exports, "avrInterrupt", {
  enumerable: true,
  get: function () {
    return _interrupt.avrInterrupt;
  }
});
Object.defineProperty(exports, "AVRTimer", {
  enumerable: true,
  get: function () {
    return _timer.AVRTimer;
  }
});
Object.defineProperty(exports, "timer0Config", {
  enumerable: true,
  get: function () {
    return _timer.timer0Config;
  }
});
Object.defineProperty(exports, "timer1Config", {
  enumerable: true,
  get: function () {
    return _timer.timer1Config;
  }
});
Object.defineProperty(exports, "timer2Config", {
  enumerable: true,
  get: function () {
    return _timer.timer2Config;
  }
});
Object.defineProperty(exports, "AVRIOPort", {
  enumerable: true,
  get: function () {
    return _gpio.AVRIOPort;
  }
});
Object.defineProperty(exports, "portAConfig", {
  enumerable: true,
  get: function () {
    return _gpio.portAConfig;
  }
});
Object.defineProperty(exports, "portBConfig", {
  enumerable: true,
  get: function () {
    return _gpio.portBConfig;
  }
});
Object.defineProperty(exports, "portCConfig", {
  enumerable: true,
  get: function () {
    return _gpio.portCConfig;
  }
});
Object.defineProperty(exports, "portDConfig", {
  enumerable: true,
  get: function () {
    return _gpio.portDConfig;
  }
});
Object.defineProperty(exports, "portEConfig", {
  enumerable: true,
  get: function () {
    return _gpio.portEConfig;
  }
});
Object.defineProperty(exports, "portFConfig", {
  enumerable: true,
  get: function () {
    return _gpio.portFConfig;
  }
});
Object.defineProperty(exports, "portGConfig", {
  enumerable: true,
  get: function () {
    return _gpio.portGConfig;
  }
});
Object.defineProperty(exports, "portHConfig", {
  enumerable: true,
  get: function () {
    return _gpio.portHConfig;
  }
});
Object.defineProperty(exports, "portJConfig", {
  enumerable: true,
  get: function () {
    return _gpio.portJConfig;
  }
});
Object.defineProperty(exports, "portKConfig", {
  enumerable: true,
  get: function () {
    return _gpio.portKConfig;
  }
});
Object.defineProperty(exports, "portLConfig", {
  enumerable: true,
  get: function () {
    return _gpio.portLConfig;
  }
});
Object.defineProperty(exports, "PinState", {
  enumerable: true,
  get: function () {
    return _gpio.PinState;
  }
});
Object.defineProperty(exports, "AVRUSART", {
  enumerable: true,
  get: function () {
    return _usart.AVRUSART;
  }
});
Object.defineProperty(exports, "usart0Config", {
  enumerable: true,
  get: function () {
    return _usart.usart0Config;
  }
});
Object.defineProperty(exports, "AVREEPROM", {
  enumerable: true,
  get: function () {
    return _eeprom.AVREEPROM;
  }
});
Object.defineProperty(exports, "EEPROMMemoryBackend", {
  enumerable: true,
  get: function () {
    return _eeprom.EEPROMMemoryBackend;
  }
});
Object.defineProperty(exports, "eepromConfig", {
  enumerable: true,
  get: function () {
    return _eeprom.eepromConfig;
  }
});
Object.defineProperty(exports, "spiConfig", {
  enumerable: true,
  get: function () {
    return _spi.spiConfig;
  }
});
Object.defineProperty(exports, "AVRSPI", {
  enumerable: true,
  get: function () {
    return _spi.AVRSPI;
  }
});

var _cpu = require("./cpu/cpu");

var _instruction = require("./cpu/instruction");

var _interrupt = require("./cpu/interrupt");

var _timer = require("./peripherals/timer");

var _gpio = require("./peripherals/gpio");

var _usart = require("./peripherals/usart");

var _eeprom = require("./peripherals/eeprom");

var _twi = require("./peripherals/twi");

Object.keys(_twi).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _twi[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _twi[key];
    }
  });
});

var _spi = require("./peripherals/spi");
},{"./cpu/cpu":"../../node_modules/avr8js/dist/esm/cpu/cpu.js","./cpu/instruction":"../../node_modules/avr8js/dist/esm/cpu/instruction.js","./cpu/interrupt":"../../node_modules/avr8js/dist/esm/cpu/interrupt.js","./peripherals/timer":"../../node_modules/avr8js/dist/esm/peripherals/timer.js","./peripherals/gpio":"../../node_modules/avr8js/dist/esm/peripherals/gpio.js","./peripherals/usart":"../../node_modules/avr8js/dist/esm/peripherals/usart.js","./peripherals/eeprom":"../../node_modules/avr8js/dist/esm/peripherals/eeprom.js","./peripherals/twi":"../../node_modules/avr8js/dist/esm/peripherals/twi.js","./peripherals/spi":"../../node_modules/avr8js/dist/esm/peripherals/spi.js"}],"../../src/intelhex.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadHex = loadHex;

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * Minimal Intel HEX loader
 * Part of AVR8js
 *
 * Copyright (C) 2019, Uri Shaked
 */
function loadHex(source, target) {
  var _iterator = _createForOfIteratorHelper(source.split('\n')),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var line = _step.value;

      if (line[0] === ':' && line.substr(7, 2) === '00') {
        var bytes = parseInt(line.substr(1, 2), 16);
        var addr = parseInt(line.substr(3, 4), 16);

        for (var i = 0; i < bytes; i++) {
          target[addr + i] = parseInt(line.substr(9 + i * 2, 2), 16);
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
},{}],"../../src/execute.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AVRRunner = void 0;

var _avr8js = require("avr8js");

var _intelhex = require("./intelhex");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

// ATmega328p params
var FLASH = 0x40000;

var AVRRunner = /*#__PURE__*/function () {
  function AVRRunner(hex) {
    _classCallCheck(this, AVRRunner);

    this.program = new Uint16Array(FLASH);
    this.speed = 16e6; // 16 MHZ

    this.stopped = false;
    (0, _intelhex.loadHex)(hex, new Uint8Array(this.program.buffer));
    this.cpu = new _avr8js.CPU(this.program, 0x2200);
    this.timer = new _avr8js.AVRTimer(this.cpu, Object.assign(Object.assign({}, _avr8js.timer0Config), {
      compAInterrupt: 0x02a,
      compBInterrupt: 0x02c,
      ovfInterrupt: 0x02e
    }));
    this.portB = new _avr8js.AVRIOPort(this.cpu, _avr8js.portBConfig);
    this.usart = new _avr8js.AVRUSART(this.cpu, _avr8js.usart0Config, this.speed);
  }

  _createClass(AVRRunner, [{
    key: "execute",
    value: function execute(callback) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.stopped = false;

              case 1:
                (0, _avr8js.avrInstruction)(this.cpu);
                this.timer.tick();

                if (!(this.cpu.cycles % 500000 === 0)) {
                  _context.next = 9;
                  break;
                }

                callback(this.cpu);
                _context.next = 7;
                return new Promise(function (resolve) {
                  return setTimeout(resolve, 0);
                });

              case 7:
                if (!this.stopped) {
                  _context.next = 9;
                  break;
                }

                return _context.abrupt("break", 11);

              case 9:
                _context.next = 1;
                break;

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
    }
  }, {
    key: "stop",
    value: function stop() {
      this.stopped = true;
    }
  }]);

  return AVRRunner;
}();

exports.AVRRunner = AVRRunner;
},{"avr8js":"../../node_modules/avr8js/dist/esm/index.js","./intelhex":"../../src/intelhex.ts"}],"../../src/drawPixels.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawPixels = void 0;

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var drawPixels = function drawPixels(pixels, canvas, rows, cols, serpentine) {
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var pixelWidth = canvas.width / cols;
  var pixelHeight = canvas.height / rows;

  var _iterator = _createForOfIteratorHelper(pixels),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var pixel = _step.value;
      var x = void 0;
      var y = void 0;

      if (!serpentine) {
        if (pixel.y % 2 == 1) {
          x = pixel.x * pixelWidth;
        } else {
          x = (cols - 1) * pixelWidth - pixel.x * pixelWidth;
        }

        y = (rows - 1) * pixelHeight - pixel.y * pixelHeight;
      } else {
        x = (cols - 1) * pixelWidth - pixel.x * pixelWidth;
        y = (rows - 1) * pixelHeight - pixel.y * pixelHeight;
      }

      ctx.beginPath();
      ctx.rect(x, y, pixelWidth, pixelHeight);
      ctx.fillStyle = "rgb(".concat(pixel.r, ", ").concat(pixel.g, ", ").concat(pixel.b, ")");
      ctx.shadowColor = "rgb(".concat(pixel.r, ", ").concat(pixel.g, ", ").concat(pixel.b, ")");
      ctx.fill();
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
};

exports.drawPixels = drawPixels;
},{}],"../../src/ws2812.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WS2812Controller = void 0;

var _avr8js = require("avr8js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ZERO_HIGH = 400; // ±150ns

var ONE_HIGH = 800; // ±150ns

var ZERO_LOW = 850; // ±150ns

var ONE_LOW = 450; // ±150ns

var MARGIN = 160; // 160 gives extra margin for FastLED

var RESET_TIME = 50000;

var WS2812Controller = /*#__PURE__*/function () {
  function WS2812Controller() {
    var numPixels = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    _classCallCheck(this, WS2812Controller);

    this.numPixels = numPixels;
    this.pixels = new Uint32Array(this.numPixels);
    this.pixelIndex = 0;
    this.currentValue = 0;
    this.bitIndex = 0;
    this.lastState = _avr8js.PinState.Input;
    this.lastTimestamp = 0;
    this.detectZero = false;
    this.detectOne = false;
    this.overflow = false;
    this.updated = true;
  }

  _createClass(WS2812Controller, [{
    key: "feedValue",
    value: function feedValue(pinState, cpuNanos) {
      if (pinState !== this.lastState) {
        var delta = cpuNanos - this.lastTimestamp;

        if (!this.overflow && (this.lastState === _avr8js.PinState.High || this.lastState === _avr8js.PinState.InputPullUp)) {
          if (delta >= ZERO_HIGH - MARGIN && delta <= ZERO_HIGH + MARGIN) {
            this.detectZero = true;
          }

          if (delta >= ONE_HIGH - MARGIN && delta <= ONE_HIGH + MARGIN) {
            this.detectOne = true;
          }

          if (pinState === _avr8js.PinState.Low) {
            this.checkLastBit();
          }
        }

        if (this.lastState === _avr8js.PinState.Low) {
          if (this.detectZero && delta >= ZERO_LOW - MARGIN) {
            this.feedBit(0);
          } else if (this.detectOne && delta >= ONE_LOW - MARGIN) {
            this.feedBit(1);
          }

          if (delta >= RESET_TIME) {
            this.resetState();
          }

          this.detectZero = false;
          this.detectOne = false;
        }

        this.lastState = pinState;
        this.lastTimestamp = cpuNanos;
      }
    }
  }, {
    key: "checkLastBit",
    value: function checkLastBit() {
      // For the last bit in transmission, we might not detect the LOW period, as the signal
      // may not go back HIGH for a long time. Thus, we update the LED based on the predicted
      // value of the last bit
      if (this.bitIndex === 23) {
        this.pixels[this.pixelIndex] = this.currentValue | (this.detectOne ? 1 : 0);
        this.updated = true;
      }
    }
  }, {
    key: "feedBit",
    value: function feedBit(value) {
      if (value) {
        this.currentValue |= 1 << 23 - this.bitIndex;
      }

      this.bitIndex++;

      if (this.bitIndex === 24) {
        this.pixels[this.pixelIndex++] = this.currentValue;
        this.updated = true;
        this.bitIndex = 0;
        this.currentValue = 0;
      }

      if (this.pixelIndex >= this.numPixels) {
        this.overflow = true;
      }
    }
  }, {
    key: "resetState",
    value: function resetState() {
      this.detectZero = false;
      this.detectOne = false;
      this.overflow = false;
      this.bitIndex = 0;
      this.currentValue = 0;
      this.pixelIndex = 0;
    }
  }, {
    key: "update",
    value: function update(cpuNanos) {
      var result = null;

      if (this.updated) {
        var delta = cpuNanos - this.lastTimestamp;

        if (!this.overflow && this.bitIndex === 23 && this.detectZero && this.lastState === _avr8js.PinState.Low && delta >= ZERO_LOW - MARGIN) {
          this.pixels[this.pixelIndex] = this.currentValue;
        }

        result = this.pixels;
        this.updated = false;
      }

      return result;
    }
  }]);

  return WS2812Controller;
}();

exports.WS2812Controller = WS2812Controller;
},{"avr8js":"../../node_modules/avr8js/dist/esm/index.js"}],"../../src/arduino.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _execute = require("./execute");

var _drawPixels = require("./drawPixels");

var _ws = require("./ws2812");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MHZ = 16000000;

var LEDuino = /*#__PURE__*/function () {
  function LEDuino(_ref) {
    var _this = this;

    var _ref$rows = _ref.rows,
        rows = _ref$rows === void 0 ? 14 : _ref$rows,
        _ref$cols = _ref.cols,
        cols = _ref$cols === void 0 ? 14 : _ref$cols,
        canvas = _ref.canvas,
        _ref$serpentine = _ref.serpentine,
        serpentine = _ref$serpentine === void 0 ? true : _ref$serpentine,
        hex = _ref.hex,
        onPixels = _ref.onPixels,
        onSerial = _ref.onSerial;

    _classCallCheck(this, LEDuino);

    _defineProperty(this, "onPixels", function () {
      return console.log('Pixels callback was not defined');
    });

    _defineProperty(this, "onSerial", function () {
      return console.log('Serial callback was not defined');
    });

    _defineProperty(this, "cpuNanos", function () {
      return Math.round(_this.runner.cpu.cycles / MHZ * 1000000000);
    });

    _defineProperty(this, "listener", function () {
      _this.matrixController.feedValue(_this.runner.portB.pinState(6), _this.cpuNanos());
    });

    _defineProperty(this, "stop", function () {
      var _this$runner;

      (_this$runner = _this.runner) === null || _this$runner === void 0 ? void 0 : _this$runner.stop();
    });

    _defineProperty(this, "start", function () {
      var _this$runner2;

      (_this$runner2 = _this.runner) === null || _this$runner2 === void 0 ? void 0 : _this$runner2.execute(function (_cpu) {
        var pixels = _this.matrixController.update(_this.cpuNanos());

        if (!pixels) return;
        var pixelsToDraw = [];

        for (var row = 0; row < _this.rows; row++) {
          for (var col = 0; col < _this.cols; col++) {
            var value = pixels[row * _this.cols + col];
            var x = col;
            if (_this.serpentine) x = row % 2 ? _this.cols - col - 1 : col;
            pixelsToDraw.push({
              x: x,
              y: row,
              b: value & 0xff,
              r: value >> 8 & 0xff,
              g: value >> 16 & 0xff
            });
          }
        }

        if (_this.canvas) {
          (0, _drawPixels.drawPixels)(pixelsToDraw, _this.canvas, _this.rows, _this.cols, _this.serpentine);
        } else {
          _this.onPixels(pixelsToDraw);
        }
      });
    });

    this.rows = rows;
    this.cols = cols;
    this.canvas = canvas;
    this.onPixels = onPixels;
    this.onSerial = onSerial;
    this.serpentine = serpentine;
    this.hex = hex; // Used for the precompiled code

    this.dataPin = 12;
  }

  _createClass(LEDuino, [{
    key: "hex",
    set: function set(newHex) {
      var _this$runner3,
          _this$runner4,
          _this2 = this;

      if (newHex === this._hex) return;
      (_this$runner3 = this.runner) === null || _this$runner3 === void 0 ? void 0 : _this$runner3.portB.removeListener(this.listener);
      (_this$runner4 = this.runner) === null || _this$runner4 === void 0 ? void 0 : _this$runner4.stop();
      this._hex = newHex;
      this.runner = new _execute.AVRRunner(this._hex);
      this.matrixController = new _ws.WS2812Controller(this.cols * this.rows);
      this.runner.portB.addListener(this.listener);

      this.runner.usart.onByteTransmit = function (value) {
        return _this2.onSerial(String.fromCharCode(value));
      };

      this.start();
    }
  }]);

  return LEDuino;
}();

exports.default = LEDuino;
module.exports = {
  LEDuino: LEDuino
};
},{"./execute":"../../src/execute.ts","./drawPixels":"../../src/drawPixels.js","./ws2812":"../../src/ws2812.ts"}],"../../src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "LEDuino", {
  enumerable: true,
  get: function () {
    return _arduino.LEDuino;
  }
});
Object.defineProperty(exports, "drawPixels", {
  enumerable: true,
  get: function () {
    return _drawPixels.drawPixels;
  }
});

var _arduino = require("./arduino");

var _drawPixels = require("./drawPixels");
},{"./arduino":"../../src/arduino.js","./drawPixels":"../../src/drawPixels.js"}],"build.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  stdout: 'Sketch uses 6654 bytes (2%) of program storage space. Maximum is 253952 bytes.\nGlobal variables use 925 bytes (11%) of dynamic memory, leaving 7267 bytes for local variables. Maximum is 8192 bytes.\n',
  stderr: '',
  hex: ':100000000C9495000C94C6000C94C6000C94C60089\r\n:100010000C94C6000C94C6000C94C6000C94C60048\r\n:100020000C94C6000C94C6000C94C6000C94C60038\r\n:100030000C94C6000C94C6000C94C6000C94C60028\r\n:100040000C94C6000C94C6000C94C6000C94C60018\r\n:100050000C94C6000C94C6000C94C6000C941907AE\r\n:100060000C94C6000C94E3060C94B9060C94C600DC\r\n:100070000C94C6000C94C6000C94C6000C94C600E8\r\n:100080000C94C6000C94C6000C94C6000C94C600D8\r\n:100090000C94C6000C94C6000C94C6000C94C600C8\r\n:1000A0000C94C6000C94C6000C94C6000C94C600B8\r\n:1000B0000C94C6000C94C6000C94C6000C94C600A8\r\n:1000C0000C94C6000C94C6000C94C6000C94C60098\r\n:1000D0000C94C6000C94C6000C94C6000C94C60088\r\n:1000E0000C94C6000C9491030C94E6050C942A061B\r\n:1000F0000C946D060C94B6010C9463070C94700676\r\n:100100000C947A010C9474060C94E4050C945D0232\r\n:100110000C9477010C9410020C94CA010C94B7064D\r\n:100120000C94A7010C94D801630711241FBECFEFD4\r\n:10013000D1E2DEBFCDBF00E00CBF12E0A0E0B2E034\r\n:10014000E2EAF9E100E00BBF02C007900D92AC3586\r\n:10015000B107D9F725E0ACE5B2E001C01D92AD3999\r\n:10016000B207E1F710E0C5E9D0E000E006C0219752\r\n:100170000109802FFE010E94B30CC439D10780E031\r\n:100180000807A9F70E949F070C94CF0C0C9400005D\r\n:10019000FB01DC016C9112967C91862F880F880FF1\r\n:1001A000880F35E5282F239F020E20E0211D112402\r\n:1001B000922F562F5074462F407267FD2EC051115A\r\n:1001C0000FC0822F80954423B9F09B5A30E08BEA10\r\n:1001D00028EC482F429F040E40E0411D842F18C098\r\n:1001E000411113C0382F2AEA329F030E30E0311D2F\r\n:1001F00011248BEA831B965530E08111E9CF30E062\r\n:1002000091112EC040E0892F3CC080E0322F9095A4\r\n:10021000911126C0482F80E02BC0511116C041110A\r\n:100220000CC0382F2AEA329F030E30E0311D112412\r\n:100230009BEA931B3B5A80E0EBCF322F3095822F05\r\n:1002400040E08823A9F090E0C3CF411105C085E5C7\r\n:10025000820F3BEA321BF4CF8AEA820F90E0FACF9A\r\n:10026000292F48EC249F020E20E0211D482F822FC9\r\n:1002700090E0332331F028EC329F030E30E0311D43\r\n:10028000932F112427E3229F020E20E0211D112429\r\n:10029000322F340F820F920F7F3F09F420C020E0ED\r\n:1002A000772321F0779F212D09F02F5F2223D9F0AA\r\n:1002B000332321F0329F030E30E0311D882331F0CB\r\n:1002C000482F429F040E40E0411D842F992331F0B6\r\n:1002D000492F429F040E40E0411D942F112430838A\r\n:1002E00081839283089590E080E030E0F8CF80E948\r\n:1002F00091E00895AF92BF92CF92DF92EF92FF927A\r\n:100300000F931F93CF93DF936C017B018B01040F3D\r\n:10031000151FEB015E01AE18BF08C017D10759F0D9\r\n:100320006991D601ED91FC910190F081E02DC6011B\r\n:100330001995892B79F7C501DF91CF911F910F9105\r\n:10034000FF90EF90DF90CF90BF90AF900895FC01A9\r\n:10035000538D448D252F30E0842F90E0821B930B2A\r\n:10036000541710F0CF96089501970895FC01918DD0\r\n:10037000828D981761F0A28DAE0FBF2FB11D5D96D3\r\n:100380008C91928D9F5F9F73928F90E008958FEF75\r\n:100390009FEF0895FC01918D828D981731F0828D29\r\n:1003A000E80FF11D858D90E008958FEF9FEF089580\r\n:1003B000FC01918D228D892F90E0805C9F4F821BE4\r\n:1003C00091098F739927089583EF94E00E94D801D3\r\n:1003D00021E0892B09F420E0822F0895FC01A48DEF\r\n:1003E000A80FB92FB11DA35ABF4F2C91848D90E057\r\n:1003F00001968F739927848FA689B7892C93A0893A\r\n:10040000B1898C91837080648C93938D848D9813C3\r\n:1004100006C00288F389E02D80818F7D8083089556\r\n:10042000EF92FF920F931F93CF93DF93EC0181E044\r\n:10043000888F9B8D8C8D98131AC0E889F9898081EB\r\n:1004400085FF15C09FB7F894EE89FF896083E8891E\r\n:10045000F98980818370806480839FBF81E090E010\r\n:10046000DF91CF911F910F91FF90EF900895F62E9D\r\n:100470000B8D10E00F5F1F4F0F731127E02E8C8D37\r\n:100480008E110CC00FB607FCFACFE889F98980817C\r\n:1004900085FFF5CFCE010E94EE01F1CFEB8DEC0F81\r\n:1004A000FD2FF11DE35AFF4FF0829FB7F8940B8F99\r\n:1004B000EA89FB8980818062CFCFCF93DF93EC0103\r\n:1004C000888D8823B9F0AA89BB89E889F9898C913C\r\n:1004D00085FD03C0808186FD0DC00FB607FCF7CFF8\r\n:1004E0008C9185FFF2CF808185FFEDCFCE010E94F8\r\n:1004F000EE01E9CFDF91CF91089580E090E0892B64\r\n:1005000029F00E94E40181110E94000080E090E047\r\n:10051000892B49F080E090E0892B29F00E940000AF\r\n:1005200081110E94000080E090E0892B49F080E07A\r\n:1005300090E0892B29F00E94000081110E940000A8\r\n:1005400080E090E0892B49F080E090E0892B29F051\r\n:100550000E94000081110C94000008953FB7F894A8\r\n:100560008091630290916402A0916502B09166024D\r\n:1005700026B5A89B05C02F3F19F00196A11DB11DFE\r\n:100580003FBFBA2FA92F982F8827BC01CD01620F3A\r\n:10059000711D811D911D42E0660F771F881F991FF5\r\n:1005A0004A95D1F708952FB7F89460915F02709142\r\n:1005B000600280916102909162022FBF08958F9234\r\n:1005C0009F92AF92BF92CF92DF92EF92FF920F93E2\r\n:1005D0001F93CF93DF936C01EB017A01480159011E\r\n:1005E0008FEFC816D10409F010F4DC2CCC240E9443\r\n:1005F000D3029B01AC01281939094A095B09D601CC\r\n:100600000E94940C9B01AC01A8E1B1E00E94940C03\r\n:10061000AC0166277727CA0133E0969587953A950E\r\n:10062000E1F797709A0122273074232B31F02FEFD6\r\n:1006300037E0F901E81BF90BCF01E92FEE0FEE0FC0\r\n:10064000F0E0E65DFD4F2081318186959281899FA2\r\n:10065000200D311D112457FF03C03195219531091B\r\n:100660003058EC1AFD0A2E9DB0013F9DC001E0E01C\r\n:100670003E9D700D811D9E1F2F9D700D811D9E1F23\r\n:100680001124620F731F8E1F9E1F8C0F9D1FDF9101\r\n:10069000CF911F910F91FF90EF90DF90CF90BF907F\r\n:1006A000AF909F908F9008950F931F93CF93DF93F8\r\n:1006B00020915D022F5F322F377030935D0220FF53\r\n:1006C0002BC020E831FD2064347009F02062205FE7\r\n:1006D000FC01EC01239600E011E06485662329F01B\r\n:1006E00070E0C8010E94570C6F5F6187322F369F00\r\n:1006F000030E30E0311D1124311110C01682662323\r\n:1007000011F0615061873196EC17FD0731F7DF91E9\r\n:10071000CF911F910F91089520E0D4CF31503683AF\r\n:10072000EECF4F925F926F927F928F92AF92BF9275\r\n:10073000CF92DF92EF920F931F93CF93DF933C0101\r\n:10074000EB010E94AE02F30127853089621B730B17\r\n:100750006A307105B0F3F894E881F98175B170647D\r\n:1007600065B16F7B65B9CA848F812C2D281B822FC0\r\n:100770002F83BF844A805B801D850C85DE841F5FCC\r\n:100780000F5FD3949E813885A984EB844181D20187\r\n:1007900020E0C32F522F322F31814427889431110A\r\n:1007A000380F08F43FEF8195889410FD430F47956B\r\n:1007B000889411FD430F4795889412FD430F479588\r\n:1007C000889413FD430F4795889414FD430F479574\r\n:1007D000889415FD430F4795889416FD430F479560\r\n:1007E000889417FD430F47958894232F1111242FC8\r\n:1007F0008C0D422F002C75B900C047FF65B93081C0\r\n:100800002227889400C000C0002C65B93111390F2F\r\n:1008100000C0002C75B900C046FF65B908F43FEF71\r\n:100820009195889400C000C0002C65B900FD230F8D\r\n:1008300000C0002C75B900C045FF65B927958894A4\r\n:1008400001FD230F00C000C0002C65B927958894D6\r\n:1008500000C0002C75B900C044FF65B902FD230F2C\r\n:100860002795889400C000C0002C65B903FD230FB4\r\n:1008700000C0002C75B900C043FF65B92795889466\r\n:1008800004FD230F00C000C0002C65B92795889493\r\n:1008900000C0002C75B900C042FF65B905FD230FEB\r\n:1008A0002795889400C000C0002C65B906FD230F71\r\n:1008B00000C0002C75B900C041FF65B92795889428\r\n:1008C00007FD230F00C000C0002C65B92795889450\r\n:1008D00000C0002C75B900C040FF65B9432F01115D\r\n:1008E000422F9A0D00C000C0002C65B900C000C0A6\r\n:1008F000002C75B900C047FF65B932812227889462\r\n:1009000000C000C0002C65B931113C0F00C0002CA4\r\n:1009100075B900C046FF65B908F43FEFEB0DF11D56\r\n:1009200000C000C0002C65B9D0FC230F00C0002C13\r\n:1009300075B900C045FF65B927958894D1FC230F90\r\n:1009400000C000C0002C65B92795889400C0002C19\r\n:1009500075B900C044FF65B9D2FC230F2795889470\r\n:1009600000C000C0002C65B9D3FC230F00C0002CD0\r\n:1009700075B900C043FF65B927958894D4FC230F4F\r\n:1009800000C000C0002C65B92795889400C0002CD9\r\n:1009900075B900C042FF65B9D5FC230F279588942F\r\n:1009A00000C000C0002C65B9D6FC230F00C0002C8D\r\n:1009B00075B900C041FF65B927958894D7FC230F0E\r\n:1009C00000C000C0002C65B92795889400C0002C99\r\n:1009D00075B900C040FF65B9432FD110422FC195B2\r\n:1009E00000C000C0002C65B9CE0D00C000C075B9B4\r\n:1009F00000C047FF65B931812227889400C000C03C\r\n:100A0000002C65B93111380F00C0002C75B900C039\r\n:100A100046FF65B908F43FEF8195889400C000C097\r\n:100A2000002C65B910FD230F00C0002C75B900C063\r\n:100A300045FF65B92795889411FD230F00C000C0BC\r\n:100A4000002C65B92795889400C0002C75B900C0AA\r\n:100A500044FF65B912FD230F2795889400C000C09C\r\n:100A6000002C65B913FD230F00C0002C75B900C020\r\n:100A700043FF65B92795889414FD230F00C000C07B\r\n:100A8000002C65B92795889400C0002C75B900C06A\r\n:100A900042FF65B915FD230F2795889400C000C05B\r\n:100AA000002C65B916FD230F00C0002C75B900C0DD\r\n:100AB00041FF65B92795889417FD230F00C000C03A\r\n:100AC000002C65B92795889400C0002C75B900C02A\r\n:100AD00040FF65B9432F1111422F8C0D00C000C09B\r\n:100AE000002C65B9119709F086CE20EE31E0D201D5\r\n:100AF0000E948D0CDC01CB01F4E0B695A79597958B\r\n:100B00008795FA95D1F730E020E0B901EAE94E9EE9\r\n:100B1000040C611D5E9E600D711D1124650D711D1B\r\n:100B2000860F971FA11DB11D893E43E09407A105C3\r\n:100B3000B10508F434C0885E9340A109B10942E0D0\r\n:100B4000B695A795979587954A95D1F747E0849FE5\r\n:100B5000080E211D949F200D311D1124290F311DD8\r\n:100B600060915C0270E0860F971F820F931F409187\r\n:100B70005F02509160026091610270916202292FC0\r\n:100B80003327420F531F611D711D40935F02509325\r\n:100B90006002609361027093620280935C027894B9\r\n:100BA0000E94AE02F301708B6787DF91CF911F9196\r\n:100BB0000F91EF90DF90CF90BF90AF908F907F908C\r\n:100BC0006F905F904F900895269A08950F931F930A\r\n:100BD000CF93DF93CDB7DEB762970FB6F894DEBF41\r\n:100BE0000FBECDBF8C01F901DC011C968C917A837C\r\n:100BF00069835C834B835E834D8390819D87918164\r\n:100C00009E8792819F878130F1F4CE0101960E94E8\r\n:100C1000540383E0888B1A8A198AD801ED91FC91DC\r\n:100C20000484F585E02DBE016F5F7F4FC8011995E3\r\n:100C300062960FB6F894DEBF0FBECDBFDF91CF91A5\r\n:100C40001F910F9108951C861B861A861986188697\r\n:100C50001F82DFCF0F931F93CF93DF93CDB7DEB704\r\n:100C600062970FB6F894DEBF0FBECDBF8C01F901BD\r\n:100C7000DC011C968C917A8369835C834B835E8351\r\n:100C80004D8390819D8791819E8792819F8781303E\r\n:100C9000E9F4CE0101960E945403188A1A8A198A2F\r\n:100CA000D801ED91FC910484F585E02DBE016F5FC4\r\n:100CB0007F4FC801199562960FB6F894DEBF0FBE3C\r\n:100CC000CDBFDF91CF911F910F9108951C861B8698\r\n:100CD0001A86198618861F82E0CF90E080E008957A\r\n:100CE000FC01858596850895CF93DF9300D000D0D1\r\n:100CF000CDB7DEB7AB011C821D821E82DC01ED91F7\r\n:100D0000FC910190F081E02D19821A821B829E01D4\r\n:100D10002F5F3F4FBE016C5F7F4F199526960FB630\r\n:100D2000F894DEBF0FBECDBFDF91CF910895282F7D\r\n:100D300086FD2095E22FEF732F7086FD2F5FE695DD\r\n:100D4000E695E695E670F0E0E050FE4F9181929FC7\r\n:100D5000902D212D112492959F702295207F922B0A\r\n:100D60002081920F87FD919580E8890F08950E9458\r\n:100D7000CA0C1F920F920FB60F9211240BB60F924E\r\n:100D80002F933F934F935F936F937F938F939F9393\r\n:100D9000AF93BF93EF93FF9383EF94E00E94EE0134\r\n:100DA000FF91EF91BF91AF919F918F917F916F9143\r\n:100DB0005F914F913F912F910F900BBE0F900FBEFF\r\n:100DC0000F901F9018951F920F920FB60F9211243B\r\n:100DD0000BB60F922F938F939F93EF93FF93E09116\r\n:100DE0000305F09104058081E0910905F0910A0561\r\n:100DF00082FD1DC0908180910C058F5F8F732091C3\r\n:100E00000D05821741F0E0910C05F0E0ED50FB4F2D\r\n:100E1000958F80930C05FF91EF919F918F912F916A\r\n:100E20000F900BBE0F900FBE0F901F9018958081F2\r\n:100E3000F2CF1F920F920FB60F9211242F933F9370\r\n:100E40008F939F93AF93BF9380915F0290916002C5\r\n:100E5000A0916102B091620230915E0223E0230F03\r\n:100E60002D3758F50196A11DB11D20935E02809388\r\n:100E70005F0290936002A0936102B093620280913E\r\n:100E8000630290916402A0916502B091660201969E\r\n:100E9000A11DB11D8093630290936402A09365022B\r\n:100EA000B0936602BF91AF919F918F913F912F9127\r\n:100EB0000F900FBE0F901F90189526E8230F0296F3\r\n:100EC000A11DB11DD2CFE3EFF4E01382128288EEB0\r\n:100ED00093E0A0E0B0E084839583A683B7838DE49C\r\n:100EE00092E09183808385EC90E09587848784EC01\r\n:100EF00090E09787868780EC90E0918B808B81ECE7\r\n:100F000090E0938B828B82EC90E0958B848B86ECC7\r\n:100F100090E0978B868B118E128E138E148EE0E9E3\r\n:100F2000F5E08FEF808312821182148613868FEF93\r\n:100F30009FEFDC0187839087A187B2870895CF93C5\r\n:100F4000DF93CDB7DEB76A970FB6F894DEBF0FBE5A\r\n:100F5000CDBF789484B5826084BD84B5816084BD42\r\n:100F600085B5826085BD85B5816085BD80916E0047\r\n:100F7000816080936E001092810080918100826078\r\n:100F800080938100809181008160809381008091B5\r\n:100F900080008160809380008091B10084608093A4\r\n:100FA000B1008091B00081608093B0008091910089\r\n:100FB0008260809391008091910081608093910084\r\n:100FC000809190008160809390008091A100826068\r\n:100FD0008093A1008091A10081608093A100809105\r\n:100FE000A00081608093A0008091210182608093A5\r\n:100FF0002101809121018160809321018091200154\r\n:1010000081608093200180917A00846080937A00CF\r\n:1010100080917A00826080937A0080917A0081606A\r\n:1010200080937A0080917A00806880937A00109291\r\n:10103000C10080917A02811145C010926C02109219\r\n:101040006B028FEF80936F02809370028093710226\r\n:1010500080937202809373028093740281E0809384\r\n:101060007502109277021092760210926E02109220\r\n:101070006D028091ED049091EE04892B31F489E6A4\r\n:1010800092E09093EE048093ED04E0916702F0917A\r\n:101090006802309721F089E692E09583848389E69F\r\n:1010A00092E0909368028093670210927902109206\r\n:1010B00078028CE192E090936A028093690281E069\r\n:1010C00080937A02269A82E892E090936C02809351\r\n:1010D0006B0284EC90E0909377028093760280918B\r\n:1010E000930590919405A0919505B0919605843C47\r\n:1010F00029E09207A105B10520F484EC99E0A0E075\r\n:10110000B0E08093930590939405A0939505B093D8\r\n:1011100096058FEF80939005E0910305F09104050B\r\n:1011200082E08083E091FF04F09100051082E0915D\r\n:101130000105F09102058FEC808310920B05E09180\r\n:101140000705F091080586E08083E0910505F091A0\r\n:101150000605808180618083E0910505F091060598\r\n:10116000808188608083E0910505F091060580818B\r\n:1011700080688083E0910505F091060580818F7D70\r\n:10118000808300E010E0980148E651E068E97EEFD6\r\n:101190008CE594E00E94DF02BC0190E080E00E94B8\r\n:1011A000B90B6B017C01C092E304D092E404E0929D\r\n:1011B000E504F092E60400EE1EE220E030E048E6AE\r\n:1011C00051E068E97EEF86E090E00E94DF02BC011A\r\n:1011D00090E080E00E94B90B2B013C014092DF04BB\r\n:1011E0005092E0046092E1047092E2048091D7048E\r\n:1011F000811119C00E94D3026093CF047093D00470\r\n:101200008093D1049093D20481E090E0A0E0B0E01C\r\n:101210008093D3049093D404A093D504B093D604C0\r\n:1012200091E09093D7040E94D3020091CF041091D3\r\n:10123000D0042091D1043091D204601B710B820B39\r\n:10124000930B0091D3041091D4042091D5043091D4\r\n:10125000D604601771078207930778F00E94D302C3\r\n:101260006093CF047093D0048093D1049093D20400\r\n:101270008091CE048F5F8093CE041A8619861C86D7\r\n:101280001B86B12CA12C9DE0892E912C8A189B08DD\r\n:10129000188A1F861E861D86312C212CA985BA85A9\r\n:1012A0001D97BA8FA98F8B859C85092E000CAA0BE0\r\n:1012B000BB0B8D8B9E8BAF8BB88FC1018170992733\r\n:1012C000AFEF2A1A3A0A892B09F46EC1E98DFA8D1B\r\n:1012D000E80DF91DF887EF8300E010E098014AE07F\r\n:1012E00050E061E070E08AE090E00E94DF029C0143\r\n:1012F000A29EC001A39E900DB29E900D1124BC0130\r\n:1013000090E080E00E94B90BA30192010E941E0BA5\r\n:10131000698B7A8B8B8B9C8B6D897E898F89988D5D\r\n:101320000E94BB0BA70196010E941E0B0E948A0B14\r\n:10133000862F0E949706182F69897A898B899C8944\r\n:101340000E948A0B698338EC3A831B830F811885CE\r\n:10135000000F111F8F819885080F191F0E571D4F01\r\n:10136000B801CE0101960E94C800AD85BE85BD01C1\r\n:10137000BB0F880B990B0E94BB0BA70196010E9423\r\n:101380001E0B698B7A8B8B8B9C8BEF85F889BF0149\r\n:10139000FF0F880B990B0E94BB0BA30192010E94C7\r\n:1013A0001E0B0E948A0B862F0E9497068F836989E5\r\n:1013B0007A898B899C890E948A0B6C83F8ECFD8367\r\n:1013C0002F812E83BE016F5F7F4FCE0104960E9456\r\n:1013D000C8003981D8012C91230F08F42FEFF801B0\r\n:1013E00020833A812181230F08F42FEF11962C934B\r\n:1013F00011973B8112962C91230F08F42FEF228333\r\n:10140000FEE08F0E911C2D853E852D5F3F4F3E8760\r\n:101410002D878F8598894E96988B8F879EE0291609\r\n:10142000310409F04ACFAFEFAA1ABA0AEB85FC855E\r\n:101430007E96FC87EB8729853A852E5F3F4F3A875A\r\n:1014400029873EE0A316B10409F01DCFF090900566\r\n:101450008091930590919405A0919505B091960582\r\n:10146000892B8A2B8B2BD9F00E94AE020091EF04BE\r\n:101470001091F0042091F1043091F204601B710B83\r\n:10148000820B930B00919305109194052091950583\r\n:10149000309196056017710782079307C8F20E9482\r\n:1014A000AE026093EF047093F0048093F104909384\r\n:1014B000F204E0919B05F0919C05309759F0409122\r\n:1014C0009705509198056091990570919A058F2D17\r\n:1014D0001995F82E0091ED041091EE044F2C512C2B\r\n:1014E000712C612C0115110509F461C0D8011C96FD\r\n:1014F000EC901C978091910590919205843691050E\r\n:1015000010F41C961C92D801ED91FC91A280B3803E\r\n:1015100019821A821B82FF2089F1F8013696D12C9C\r\n:10152000C12C2191222319F19280992001F130E000\r\n:1015300050E040E02F5F3F4F4F4F5F4FC301B2017C\r\n:101540000E94470C9B01AC01892D90E0B0E0A0E027\r\n:10155000BC01CD016F5F7F4F8F4F9F4F0E94470CA3\r\n:10156000A1E0B0E0AC0FBD1FAC0DBD1D8C93BFEF73\r\n:10157000CB1ADB0A23E0C216D10499F6D8011D96D6\r\n:101580004D915C911E9712966D917C919E012F5FFB\r\n:101590003F4FC801F5011995D8011C96EC921C9794\r\n:1015A00014960D911C919ECF98868F8295CE809136\r\n:1015B000EB049091EC048C010F5F1F4F1093EC042F\r\n:1015C0000093EB044997B4F10E94D302C090E70462\r\n:1015D000D090E804E090E904F090EA049B01AC01AB\r\n:1015E0002C193D094E095F0921F421E030E040E06B\r\n:1015F00050E0E8EEF3E00E9FB0010F9F700D1E9FCC\r\n:10160000700D1124072E000C880B990B0E946B0C97\r\n:1016100030939205209391051092EC041092EB0404\r\n:101620000E94D3026093E7047093E8048093E90476\r\n:101630009093EA040E947D02A4CD5058BB27AA27AC\r\n:101640000E94350B0C940D0C0E94FF0B38F00E9489\r\n:10165000060C20F039F49F3F19F426F40C94FC0B8F\r\n:101660000EF4E095E7FB0C94F60BE92F0E941E0C9C\r\n:1016700058F3BA17620773078407950720F079F4C7\r\n:10168000A6F50C94400C0EF4E0950B2EBA2FA02D6D\r\n:101690000B01B90190010C01CA01A0011124FF271F\r\n:1016A000591B99F0593F50F4503E68F11A16F0401A\r\n:1016B000A22F232F342F4427585FF3CF4695379519\r\n:1016C0002795A795F0405395C9F77EF41F16BA0BDE\r\n:1016D000620B730B840BBAF09150A1F0FF0FBB1F8C\r\n:1016E000661F771F881FC2F70EC0BA0F621F731FD5\r\n:1016F000841F48F4879577956795B795F7959E3F32\r\n:1017000008F0B0CF9395880F08F09927EE0F9795C2\r\n:10171000879508950E94260C88F09F5798F0B92F5E\r\n:101720009927B751B0F0E1F0660F771F881F991F16\r\n:101730001AF0BA95C9F714C0B13091F00E94400C6C\r\n:10174000B1E008950C94400C672F782F8827B85F7C\r\n:1017500039F0B93FCCF3869577956795B395D9F76E\r\n:101760003EF490958095709561957F4F8F4F9F4F78\r\n:101770000895E89409C097FB3EF490958095709584\r\n:1017800061957F4F8F4F9F4F9923A9F0F92F96E9CD\r\n:10179000BB279395F695879577956795B795F11142\r\n:1017A000F8CFFAF4BB0F11F460FF1BC06F5F7F4FDF\r\n:1017B0008F4F9F4F16C0882311F096E911C07723F1\r\n:1017C00021F09EE8872F762F05C0662371F096E8FA\r\n:1017D000862F70E060E02AF09A95660F771F881FC9\r\n:1017E000DAF7880F9695879597F9089597F99F6787\r\n:1017F00080E870E060E008959FEF80EC0895002499\r\n:101800000A941616170618060906089500240A9465\r\n:1018100012161306140605060895092E0394000CEB\r\n:1018200011F4882352F0BB0F40F4BF2B11F460FF7A\r\n:1018300004C06F5F7F4F8F4F9F4F089557FD9058A3\r\n:10184000440F551F59F05F3F71F04795880F97FB84\r\n:10185000991F61F09F3F79F087950895121613063E\r\n:101860001406551FF2CF4695F1DF08C0161617066D\r\n:101870001806991FF1CF86957105610508940895A2\r\n:10188000E894BB2766277727CB0197F90895DB01FA\r\n:101890008F939F930E94940CBF91AF91A29F800D54\r\n:1018A000911DA39F900DB29F900D1124089597FB59\r\n:1018B000072E16F4009407D077FD09D00E949F0CE4\r\n:1018C00007FC05D03EF4909581959F4F0895709543\r\n:1018D00061957F4F0895A1E21A2EAA1BBB1BFD0143\r\n:1018E0000DC0AA1FBB1FEE1FFF1FA217B307E407FF\r\n:1018F000F50720F0A21BB30BE40BF50B661F771F57\r\n:10190000881F991F1A9469F7609570958095909536\r\n:101910009B01AC01BD01CF0108950E94BB0CB7FF34\r\n:101920000895821B930B08950E94BB0CA59F900DF8\r\n:10193000B49F900DA49F800D911D11240895AA1BA2\r\n:10194000BB1B51E107C0AA1FBB1FA617B70710F0AA\r\n:10195000A61BB70B881F991F5A95A9F780959095DC\r\n:10196000BC01CD010895EE0FFF1F881F8BBF0790AC\r\n:10197000F691E02D1994A29FB001B39FC001A39FDF\r\n:10198000700D811D1124911DB29F700D811D1124B8\r\n:10199000911D089581E090E0F8940C94CF0CF89498\r\n:0219A000FFCF77\r\n:1019A200003131295A1B750A00000000B706B7063C\r\n:1019B200B706740670066D06000000002A06E605EA\r\n:1019C200E405740670067701910300003100F918EE\r\n:1019D2003000FB302C001C472600825A1F006D6A23\r\n:1019E200170041760E00897D040000000010027A83\r\n:0C19F20001A7015D02D801B601CA010086\r\n:00000001FF\r\n',
  lineInfo: {}
};
exports.default = _default;
},{}],"index.js":[function(require,module,exports) {
"use strict";

require("regenerator-runtime/runtime");

var _leduino = require("@elliottkember/leduino");

var _build = _interopRequireDefault(require("./build"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _leduino.LEDuino({
  rows: 14,
  cols: 14,
  serpentine: true,
  hex: _build.default.hex,
  canvas: document.getElementById('canvas') // onPixels: (pixels) => console.log(pixels.length),
  // onSerial: (text) => console.log(text),

});
},{"regenerator-runtime/runtime":"../../node_modules/regenerator-runtime/runtime.js","@elliottkember/leduino":"../../src/index.js","./build":"build.js"}],"../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54223" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map