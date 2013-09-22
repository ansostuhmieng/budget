function toggleSwitch(id){
	this.state = 0;
	this.id = id;
	this.switches = new Array;
}

function toggleValue(image, value, owner) {
	this.image = image;
	this.value = value;
	this.owner = owner;
}

toggleValue.prototype.print(div) {
	var img = document.createElement('img');
	img.src = 'images/' + this.image;
	img.id = owner.id + '_' + 1;
	
	div.appendChild(img);
	
	
	
}

toggleSwitch.prototype.add = function(image, value) {
	var toggle = new toggleValue(image, value, this);
	this.switches.push(toggle);
}

toggleSwitch.prototype.select = function(index) {
	this.state = index;
}