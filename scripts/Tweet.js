function Tweet(id, text, author, date) {
	this.text = text;
	this.author = author;
	this.id = id;
	this.date = date;
}

/**
 * Method to wrap a tweet json object. 
 * @param tweet
 * @returns
 */
Tweet.prototype.wrap = function(tweet) {
	this.text = tweet.text;
	this.author = tweet.author;
	this.id = tweet.tweet_id;
	this.date = tweet.tweet_date;
}

