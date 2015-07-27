function TopicModel(tw, td, dt) {
	this.topic_words = tw;
	this.topic_docs = td;
	this.doc_topics = dt;
	this.populateTopics();
}

TopicModel.prototype.populateTopics = function() {
	this.topics = new Object();
	for (var t in this.topic_words) {
		this.topics[t] = new Topic(t, this.topic_words[t], this.topic_docs[t]);
	}
}

TopicModel.prototype.getTopic = function(id) {
	return this.topics[id];
}

TopicModel.prototype.wrap = function(tm) {
	this.topic_words = tm.topic_word;
	this.topic_docs = tm.topic_doc;
	this.doc_topics = tm.doc_topic;
	this.populateTopics();
}

TopicModel.prototype.getTopicsForDocument = function(doc) {
	return this.doc_topics[doc];
}


function Topic(id, top_words, top_docs) {
	this.id = id;
	this.top_words = top_words;
	this.top_docs = top_docs;
}


Topic.prototype.getHTMLSummary = function() {
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

Topic.prototype.getName = function() {
	return this.id;
}

Topic.prototype.getTopWords = function() {
	return this.top_words;
}

Topic.prototype.getTopDocs = function() {
	return this.top_docs;
}