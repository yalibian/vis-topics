function Topic(id, topic2doc, wordlist, weight, periods) {
	this.id = id;
	this.topic2doc = topic2doc;
	this.wordlist = wordlist;
	this.weight = weight;
	this.periods = new Array();
	this.populatePeriods(periods);
}


// populate data into periods
Topic.prototype.populatePeriods = function(periods) {	
	//console.log("In Topic.populatePeriods")
	for (var i in periods) {
		var tmp = new Period();
		tmp.wrap(periods[i]);
		//console.log('period');
		//console.log(tmp)
		this.periods.push(tmp);
	}
	/*
	$.each(periods, function(i, period) {
		tmp = new Period();
		tmp.wrap(period);
		
	});
	*/
};


Topic.prototype.wrap = function(topic) {
	//console.log("In topic.wrap()")
	this.id = topic.id;
	this.topic2doc = topic.topic2doc;
	this.wordlist = topic.wordlist;
	this.weight = topic.weight;
	//console.log("this.topic2doc: ");
	//console.log(this.topic2doc);
	this.populatePeriods(topic.periods);
};

Topic.prototype.getHTMLSummary = function() {
	var sum = 0;
	var count = 0;
	$.each(this.wordlist, function(word, value) {
		count = count + 1;
		sum = sum + value;
	});
	var mean = sum/count;
	
	var sortable = []
	for (var word in this.wordlist) {
		sortable.push([word, this.wordlist[word]])
	}
	sortable.sort(function(a,b) {return b[1]-a[1]});
	
	var s = "";
	var highest = sortable[0][1];
	for (var pair in sortable) {
		w = "<span style=\"font-size: " + (sortable[pair][1]/mean)*100 + "%\">" + sortable[pair][0] + "</span>"
		s = s + w + ", ";
	}
	return s.slice(0,-2);
};

Topic.prototype.getWordlist = function() {
	return this.wordlist;
};


/*
Topic.prototype.getPeriod = function(id) {
	return this.topics[id];
}


Topic.prototype.getPeriodForDocument = function(doc) {
	return this.doc_topics[doc];
}

*/

