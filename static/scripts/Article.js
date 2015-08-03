function Article(id, title, authors, abstract, categories, keywords, date) {
	this.id = id;
	this.title = title;
	this.author = authors;
	this.abstract = abstract;
	this.categories = categories;
	this.keywords = keywords;
	this.date = date;
}

/**
 * Method to wrap a article json object. 
 * @param article
 * @returns
 */
Article.prototype.wrap = function(article) {
	this.id = article.id;
	this.title = article.title;
	this.author = article.authors;
	this.abstract = article.abstract;
	this.categories = article.categories;
	this.keywords = article.keywords;
	this.date = article.date;
};