// this duckpunches GLM.$outer.console.* outputs into the corresponding mocha code report
// (so it can be reviewed more easily and without having to open a debug console)

$GLM_log = function(x,y) {
   var t = document.createElement("div");
   t.innerHTML = [].slice.call(arguments).join(" ");
   (function(node) {
       // some logging happens early during load (ie: before a test node exists to populate)
       if (!node) return console.warn("early $GLM_log: ",x,y);
       node.appendChild(t);
       clearTimeout(node.scroll_timeout); node.scroll_timeout = setTimeout(function() { node.scrollTop = Math.pow(2,16); },100);
    })(document.getElementById($GLM_log.nodeId));
   //console.warn("$GLM_log", x,y);
};
$GLM_log.nodeId = 'glmlog';
$GLM_console_log = function(prefix, _args) {
   var args = [].slice.call(arguments,1);
   //console[prefix].apply(console, args);
   if (window.glm)
      glm.$log('<span class=console_'+prefix+'>['+prefix+']</span> '+args.join(" "));
   else
   (console[prefix]||console.warn.bind(console,'??'+prefix)).apply(console, args);
};

tim_inline_mocha_console_patch = function(old, onend) {
   mocha.run = function() {
      console.warn('mocha.run!');
      console.warn('mocha.running with args:'+[].slice.call(arguments));
      mocha.run = old;
      var failed = [];
      return mocha.run.apply(this, arguments)
         .on('test', function(test){
                var id = 'glmlog_'+(test.fullTitle()+'').replace(/[^a-z0-9A-Z]/g,'_');
                if (document.getElementById(id)) {
                   // this should never happen
                   console.warn(document.getElementById(id));
                   alert('existing!');
                   throw new Error('existing');
                }
                var pnode = document.querySelector(
                   "a[href*='grep={test.parent.title}']"
                   .replace("{test.parent.title}",
                            encodeURIComponent(test.parent.fullTitle())));
                try {
                   var lis = pnode.parentNode.parentNode.getElementsByTagName("ul");
                   if (lis.length)
                      pnode = lis[lis.length-1];
                   else
                   pnode = pnode.parentNode.parentNode;
                   if (!pnode)return;
                   pnode.appendChild(document.createElement("li"));
                   glm.$log._old = glm.$log.nodeId;
                   glm.$log.nodeId = pnode.lastChild.id=id;
                   with(pnode.lastChild.style)fontSize='8px',backgroundColor='black',color='white';
                }catch(e) { console.error(e); }
             })
         .on('test end', function(test){
                if (glm.$log._old) {
                   var n = document.getElementById(glm.$log.nodeId);
                   if (test.state === 'failed') {
                      failed.push(test);
                      n.nextSibling.lastChild.previousSibling.appendChild(n);
                   }
                   else {
                      n.nextSibling.lastChild.appendChild(n);
                   }
                   if (n.childNodes.length) // earmark tests having console output
                      n.parentNode.parentNode.style.outline='dotted 1px gray';
                   glm.$log.nodeId = glm.$log._old;
                   delete glm.$log._old;
                }
             })
         .on('end', function() {
                glm.$reset_logging(true);
                glm.$log('okee');
                onend&&onend(failed);
             })
   };
};
