jsfac.debug.d3 = function(path) {
	window.open(path + '?g=' + encodeURI(JSON.stringify(jsfac.debug.graph())), '_blank', 'width=640, height=480');
};