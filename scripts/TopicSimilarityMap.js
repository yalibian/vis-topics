function TopicSimilarityMap() {
	//this.map = new Object();
	this.links = [];
	this.nodes = [];
}

TopicSimilarityMap.prototype.wrap = function(tsm) {
	this.links = tsm.links;
	this.nodes = tsm.nodes;
}