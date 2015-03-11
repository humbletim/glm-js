/*
* Mocha-BlanketJS adapter
* Adds a BlanketJS coverage report at the bottom of the HTML Mocha report
* Only needed for in-browser report; not required for the grunt/phantomjs task
* 
* Distributed as part of the grunt-blanket-mocha plugin
* https://github.com/ModelN/grunt-blanket-mocha
* (C)2013 Model N, Inc.
* Distributed under the MIT license
* 
* Code originally taken from the BlanketJS project:
* https://github.com/alex-seville/blanket/blob/master/src/adapters/mocha-blanket.js
* Distributed under the MIT license 
*
* Adapted by humbletim for glm-js use
*
*/
addMochaBlanket = function() {

    if(!mocha) {
        throw new Exception("mocha library does not exist in global namespace!");
    }

    var originalReporter = mocha._reporter;

    blanketReporter = function(runner) {
       function wire(a,b) { console.info("blanketReporter.wire("+[a,b]+")"); runner.on(a, b.call ? b : function() { return blanket[b](); }); }
       wire('start', 'setupCoverage');
       wire('end',   'onTestsDone');
       wire('suite', 'onModuleStart');
       wire('test',  'onTestStart');
       wire('test end', function(test) {
               blanket.onTestDone(test.state, 'passed'); //test.parent.tests.length, 
               if (test.state !== 'passed') {
                  console.error('blanket-mode fail: ',test);
               }
            });
       
       //I dont know why these became global leaks
       runner.globals(['stats', 'failures', 'runner', '_$blanket']);

       originalReporter.apply(this, [runner]);
    };

    // From mocha.js HTML reporter
    blanketReporter.prototype.suiteURL = function(suite){
      return '?grep=' + encodeURIComponent(suite.fullTitle());
    };

    blanketReporter.prototype.testURL = function(test){
      return '?grep=' + encodeURIComponent(test.fullTitle());
    };

    mocha.reporter(blanketReporter);

    var oldRun = mocha.run,
        oldCallback = null;

    mocha.run = function (finishCallback) {
      oldCallback = finishCallback;
      console.log("waiting for blanket...");
    };
    blanket.beforeStartTestRunner({
        bindEvent:  function(x) { x()  },
        callback: function(){
            if (!blanket.options("existingRequireJS")){
                oldRun(oldCallback);
            }
            mocha.run = oldRun;
        }
    });
};

tim_run_blanket = function(failed) {
   if (failed&&failed.length) return;
   mocha._reporter = function() { console.warn("eating second mocha reporting run; (blanket-mocha kludge)");}
   mocha.noHighlighting();
   blanket.defaultReporter = (
      function(old) {
         return function(coverage) {
            old.apply(this, arguments);
            try {
               // augment top-right stats with grand-total blanket coverage results
               with([].slice.call(document.querySelectorAll(".bl-success.grand-total"))) {
                  while(length)with(shift()) {
                     var li = LI = document.createElement("li");
                     li.innerHTML = "<a href='#blanket-main'>code coverage: </a><em>...</em>";
                     li.lastChild.innerHTML = ([].slice.call(querySelectorAll(".bl-cl"),1,2).map(function(x) { return x.innerHTML; }));
                     with(document.getElementById('mocha-stats'))
                        insertBefore(li, firstChild);
                  };
               }

               // rig line numbers to jump to "next" miss (for easier code review)
               var sources = [].slice.call(document.querySelectorAll(".bl-source"));
               sources.forEach(
                  function(n) {
                     n.onclick = function(evt) { 
                        var l = evt.target, p = l.parentNode;
                        if (!/span/i.test(evt.target))return; 
                        var spans = [].filter.call(p.parentNode.childNodes, function(x){return x.nodeType===1});
                        var downspans=(spans.slice(spans.indexOf(p)).filter(function(x) { return x.className==='miss'})); 
                        console.warn(l,(downspans.shift()||downspans.pop()||spans[0]).scrollIntoView());
                     }; 
                  });
               
            } catch(e) { console.error(e); }
            
         };
      })(blanket.defaultReporter);
   addMochaBlanket();
};
