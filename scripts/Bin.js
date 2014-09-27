function Bin(id, start, end, tweets, tm) {
	this.id = id;
	this.start = start;
	this.end = end;
	this.tweets = tweets;
	this.tm = tm;
}

Bin.prototype.wrap = function(bin) {
	this.id = bin.bin_id;
	this.start = bin.start_time;
	this.end = bin.end_time;
	this.tweets = bin.tweet_Ids;
	tm = new TopicModel();
	tm.wrap(bin.topic_model);
	this.tm = tm;
	
	return this.tm.topics;
}

Bin.prototype.getTopic = function(id) {
	return this.tm.getTopic(id);
}

Bin.prototype.hasTweet = function(id) {
	for (var i=0; i<this.tweets.length; i++) {
		var t_id = this.tweets[i];
		if (id===t_id.toString()) {
			return true;
		}
	}
	return false;
}

Bin.prototype.getTopicsForTweet = function(id) {
	return this.tm.getTopicsForDocument(id);
}