function Period(date, wordlist, weight) {
	this.date = date;
	this.wordlist = wordlist;
	this.weight = weight;
}

Period.prototype.wrap = function(period) {
	//console.log("In Period wrap");
	//console.log(period);
	//console.log(period['date']);
	//console.log(period.wordlist);
	//console.log(period.weight);
	
	this.date = period.date;
	this.wordlist = period.wordlist;
	this.weight = period.weight;
};

/*
Period.prototype.getHTMLSummary = function() {
	var sum = 0;
	var count = 0;
	$.each(this.top_words, function(word, value) {
		count = count + 1;
		sum = sum + value;
	});
	var mean = sum/count;
	
	var sortable = []
	for (var word in this.top_words) {
		sortable.push([word, this.top_words[word]])
	}
	sortable.sort(function(a,b) {return b[1]-a[1]});
	
	var s = "";
	var highest = sortable[0][1];
	for (var pair in sortable) {
		w = "<span style=\"font-size: " + (sortable[pair][1]/mean)*100 + "%\">" + sortable[pair][0] + "</span>"
		s = s + w + ", ";
	}
	return s.slice(0,-2);
}


Period.prototype.getName = function() {
	return this.id;
}


Period.prototype.getTopWords = function() {
	return this.top_words;
}


Period.prototype.getTopDocs = function() {
	return this.top_docs;
}

*/