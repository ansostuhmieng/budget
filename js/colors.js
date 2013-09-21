function colorSelect()
{
	this.colors = new Array();
	this.colors.push('#FFFF4F');
	this.colors.push('#98c4ff');
	this.colors.push('#ed7070');
	this.colors.push('#82DD7E');
	this.colors.push('#F577CD');

	this.activeBorder= '1px solid #FFF';
	this.normalBorder= '1px solid #333';
	
	this.activeColor = 0;
}

colorSelect.prototype.select = function(index)
{
	document.getElementById('color_' + this.activeColor).style.border = this.normalBorder;
	this.activeColor = index;
	//highlight that color
	document.getElementById('color_' + index).style.border = this.activeBorder;
}

colorSelect.prototype.click = function(element)
{
	var id = element.id.split('_')[1];
	this.select(id);
}

colorSelect.prototype.addColor = function(color)
{
	this.colors.push(color);
}

this.colorSelect.color = function()
{
	return this.colors[activeColor];
}

colorSelect.prototype.print = function()
{
	for(var i=0; i<this.colors.length; i++)
	{
		var span = document.createElement('span');
		span.style.backgroundColor = this.colors[i];
		span.style.width = '1em';
		span.style.height = '1em';
		span.style.border= this.normalBorder;
		span.style.borderRadius = '0.25em';
		span.style.display = 'block';
		span.style.float = 'left';
		span.id = 'color_' + i;
		span.style.margin = '0.25em';
		
		span.owner = this;
		
		if(i ==0)
		{
			span.style.border = this.activeBorder;
		}

		$(span).click(function() { this.owner.click(this); });
		
		
		document.getElementById('formColors').appendChild(span);
	}
}



