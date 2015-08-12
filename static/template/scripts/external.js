/** ADD & REMOVE CLASS FOR SVG ELEMENTS FROM https://github.com/JeremiePat/SVG-DOM-helpers/blob/master/style%20helpers/removeClass.js **/
/**
 * This method allow to easily remove a CSS class to any SVG element
 * 
 * The classList parameter is a string of white space separated CSS class name.
 * 
 * Conveniently, this method return the object itself in order to easily chain
 * method call.
 *
 * @param classList string
 */
  
// Testing the existence of the global SVGElement object to safely extend it.
if (SVGElement && SVGElement.prototype) {
    SVGElement.prototype.removeClass = function removeClass(classList) {
        "use strict";

        // Because the className property can be animated through SVG, we have to reach
        // the baseVal property of the className SVGAnimatedString object.
        var currentClass = this.className.baseVal;

        // Note that all browsers which currently support SVG also support Array.forEach()
        classList.split(' ').forEach(function (newClass) {
            var tester = new RegExp(' *\\b' + newClass + '\\b *', 'g');

            currentClass = currentClass.replace(tester, ' ');
        });

        // The SVG className property is a readonly property so 
        // we must use the regular DOM API to write our new classes.
        // Note that all browsers which currently support SVG also support String.trim()
        this.setAttribute('class', currentClass.trim());

        return this;
    };
	
	SVGElement.prototype.addClass = function addClass(classList) {
	        "use strict";

	        // Because the className property can be animated through SVG, we have to reach
	        // the baseVal property of the className SVGAnimatedString object.
	        var currentClass = this.className.baseVal;

	        // Note that all browsers which currently support SVG also support Array.forEach()
	        classList.split(' ').forEach(function (newClass) {
	            var tester = new RegExp('\\b' + newClass + '\\b', 'g');

	            if (-1 === currentClass.search(tester)) {
	                currentClass += ' ' + newClass;
	            }
	        });

	        // The SVG className property is a readonly property so 
	        // we must use the regular DOM API to write our new classes.
	        this.setAttribute('class', currentClass);

	        return this;
	    };
		
		// Below is not from the website
	SVGElement.prototype.hasClass = function hasClass(className) {
	        "use strict";

	        // Because the className property can be animated through SVG, we have to reach
	        // the baseVal property of the className SVGAnimatedString object.
	        var currentClass = this.className.baseVal;

	        // Test if class is in current class
	        var tester = new RegExp('\\b' + className + '\\b', 'g');

	        if (-1 === currentClass.search(tester)) {
	           return false;
		   }
		   
	        return true;
	};
	
	SVGElement.prototype.getClass = function getClass(i) {
        "use strict";

        // Because the className property can be animated through SVG, we have to reach
        // the baseVal property of the className SVGAnimatedString object.
        var currentClass = this.className.baseVal;

        // Split class & return ith
        return currentClass.split(' ')[i];
	};
}


/** TOOLTIP CODE FROM http://sixrevisions.com/tutorials/javascript_tutorial/create_lightweight_javascript_tooltip/ **/
var tooltip=function(){
 var id = 'tt';
 var top = 3;
 var left = 3;
 var maxw = 300;
 var speed = 10;
 var timer = 20;
 var endalpha = 95;
 var alpha = 0;
 var tt,t,c,b,h;
 var ie = document.all ? true : false;
 return{
  show:function(v,w){
   if(tt == null){
    tt = document.createElement('div');
    tt.setAttribute('id',id);
    t = document.createElement('div');
    t.setAttribute('id',id + 'top');
    c = document.createElement('div');
    c.setAttribute('id',id + 'cont');
    b = document.createElement('div');
    b.setAttribute('id',id + 'bot');
//    tt.appendChild(t);
    tt.appendChild(c);
//    tt.appendChild(b);
    document.body.appendChild(tt);
    tt.style.opacity = 0;
    tt.style.filter = 'alpha(opacity=0)';
    document.onmousemove = this.pos;
   }
   tt.style.display = 'block';
   c.innerHTML = v;
   tt.style.width = w ? w + 'px' : 'auto';
   if(!w && ie){
//    t.style.display = 'none';
//    b.style.display = 'none';
      tt.style.width = tt.offsetWidth;
//    t.style.display = 'block';
//    b.style.display = 'block';
   }
  if(tt.offsetWidth > maxw){tt.style.width = maxw + 'px'}
  h = parseInt(tt.offsetHeight) + top;
  clearInterval(tt.timer);
  tt.timer = setInterval(function(){tooltip.fade(1)},timer);
  },
  pos:function(e){
   var u = ie ? event.clientY + document.documentElement.scrollTop : e.pageY;
   var l = ie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
   tt.style.top = (u - h) + 'px';
   tt.style.left = (l + left) + 'px';
  },
  fade:function(d){
   var a = alpha;
   if((a != endalpha && d == 1) || (a != 0 && d == -1)){
    var i = speed;
   if(endalpha - a < speed && d == 1){
    i = endalpha - a;
   }else if(alpha < speed && d == -1){
     i = a;
   }
   alpha = a + (i * d);
   tt.style.opacity = alpha * .01;
   tt.style.filter = 'alpha(opacity=' + alpha + ')';
  }else{
    clearInterval(tt.timer);
     if(d == -1){tt.style.display = 'none'}
  }
 },
 hide:function(){
  clearInterval(tt.timer);
   tt.timer = setInterval(function(){tooltip.fade(-1)},timer);
  }
 };
}();


/*** Live search box for topics. I WROTE IT MAHSELF ***/
var liveSearch = function() {
	// TODO: should we clear the selected topic data immediately?
	console.log("In liveSeatch");
	var term = $('input#topic_searchbox').val();
	
	var terms = term.split(' '); // if we decide multiple search terms are allowed.
	
	// Scroll to top of box
	$('html, #topic_list').animate({
	    scrollTop:0
	}, 50);
	
	$("#topic_list").empty();
	// undo all greying
	$(".greyed").each(function(key, item) {
		item.removeClass("greyed");
	});

	// Clear the selected topic
	clearTopicData();
	clearArticleData();
	
	if (term=="") {
		populateTopics();
		
		// hide "x" button
		$(".search_clear").css("display","none");
	
	}
	else {
		// show "x" button
		$(".search_clear").show();
		
		var filtered = [];
		$.each(topics,function(key, topic) {
			var add = true;
			console.log(topic.getWordlist());
			var topWords = Object.keys(topic.getWordlist()).join(',').toLowerCase();
			terms.forEach(function(term) {
				if (topWords.indexOf(term) == -1) {
					add = false;
				}
			});
			
			// only add if node is visible
			/*if ($("g #" + topic.id)[0].style.display == "none") 
				add = false;
			*/
			if (add) {
				filtered.push(topic);
				$("g #" + topic.id + "> rect").attr("class","");
			}
			else {
				$("g #" + topic.id + "> rect").attr("class","greyed"); // grey out node
				$("path.t"+topic.id+":not(.greyed)").each(function(key, path) {
					path.addClass("greyed");
				});
			}
		});
		
		filtered.sort(function(a,b) {
			var aScore = 0;
			$.each(a.wordlist,function(word, value) {
				if (word.indexOf(term) != -1) {
					aScore += value;
				}
			});
			var bScore = 0;
			$.each(b.wordlist,function(word, value) {
				if (word.indexOf(term) != -1) {
					bScore += value;
				}
			});
			
			return bScore - aScore;
		});
		
		var count = 0;
		filtered.forEach(function(topic) {
			addTopic(topic);
			count = count + 1;
		});
		
		$("#topics_title").text("Topics (" + count + ")");
	}
};