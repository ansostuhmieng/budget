///line item details
function lineItem(title, amount)
{
	this.title = title;
	this.amount = amount;
	this.envelope = false;
	this.savings = false;
}

lineItem.prototype.toJSON = function()
{
	return this;
}

lineItem.prototype.print = function()
{
	var li = document.createElement('li');
	var moneySpan = document.createElement('input');
	moneySpan.type= 'text';
	
	var titleText = document.createTextNode(this.title);
	li.appendChild(titleText);

	moneySpan.value = '$' + this.amount;
	moneySpan.className = 'money';
	
	if(this.envelope)
		li.className = 'envelope';
	
	if(this.savings)
		li.className = 'savings';
		
	li.appendChild(moneySpan);
	
	return li;
}

///category group
function category(title, color)
{
	this.title = title;
	this.color = color;
	this.items = new Array();
}

category.prototype.total = function()
{
	var total = 0;
	for(var i=0; i<this.items.length; i++)
	{
		total += parseInt(this.items[i].amount);
	}
	return total;
}

category.prototype.envelopeTotal = function()
{
	var total = 0;
	for(var i=0; i<this.items.length; i++)
	{
		if(this.items[i].envelope)
			total += this.items[i].amount;
	}
	return total;	
}

category.prototype.savingsTotal = function()
{
	var total = 0;
	for(var i=0; i<this.items.length; i++)
	{
		if(this.items[i].savings)
			total += this.items[i].amount;
	}
	return total;	
}

category.prototype.addLine = function(line)
{
	this.items.push(line);
}

category.prototype.removeLine = function(title)
{
	for (var i=0; i<this.items.length; i++)
	{
		if(this.items[i].title == title)
		{
			this.items.slice(i,i+1);
			return;
		}
	}
}

category.prototype.toJSON = function()
{
	var json = {};
	json.title = this.title;
	json.color = this.color;
	json.lineItems = new Array();
	
	for(var i=0; i<this.items.length; i++)
	{
		json.lineItems.push(this.items[i].toJSON());
	}
	
	return json;
}

category.prototype.printTitle = function()
{
	var li = document.createElement('li');
	var moneySpan = document.createElement('span');
	moneySpan.type= 'text';
	
	var titleText = document.createTextNode(this.title);
	li.appendChild(titleText);

	var moneyText = document.createTextNode('$'  + this.total());
	moneySpan.appendChild(moneyText);
	moneySpan.className = 'money';

	li.appendChild(moneySpan);
		return li;
}

///budget 
function budget()
{
	this.activeCategories = 0;
	this.categories = new Array();
	this.income = new Array();
	this.debt = new Array();
}

budget.prototype.addCat = function(cat)
{
	//var cat = new category(title);
	this.categories.push(cat);
}

budget.prototype.load = function(json)
{
	//loop through categories
	for(var i=0;i<json.category.length; i++)
	{
		var cat = new category(json.category[i].title, json.category[i].color);
		console.log('loading: ' + cat.title);
		//loop through line items for this category
		for(var j=0; j<json.category[i].lineItems.length; j++)
		{
			var line = new lineItem(json.category[i].lineItems[j].title,
								json.category[i].lineItems[j].amount);
			
			if(json.category[i].lineItems[j].savings)
				line.savings = true;
				
			if(json.category[i].lineItems[j].envelope)
				line.envelope = true;
								
			console.log('loading: ' + line.title);
			cat.addLine(line);
		}
		
		this.addCat(cat);
	}
	
	//loop through income
	for(var i=0; i<json.income.length; i++)
	{
		this.income.push(json.income[i]);
	}
	
	//loop through debt
	for(var i=0; i<json.debt.length; i++)
	{
		this.debt.push(json.debt[i]);
	}
}

budget.prototype.print = function()
{
	document.getElementById('budget').innerHTML = '';
	document.getElementById('overview').innerHTML = '';

	//loop through categories
	for(var i=0; i<this.categories.length; i++)
	{
		var catUl = document.createElement('ul');
		catUl.style.backgroundColor = this.categories[i].color;
		
		//add the category heading entry
		var headLi = this.categories[i].printTitle();
		headLi.id = 'cat_' + i;
		
		catUl.appendChild(headLi);
	
		//loop through line items and add them to the UL as well
		for(var j=0; j<this.categories[i].items.length; j++)
		{
			var item = this.categories[i].items[j].print();
			item.id = 'cat_'+i+'_' + j;
			item.owner = this;
			
			$(item).change(function() {
				var cat = parseInt(this.id.split('_')[1]);
				var line = parseInt(this.id.split('_')[2]);
				
				var amount = this.children[0].value;
				amount = parseInt(amount.replace('$',''));
				
				this.owner.update(cat,line,amount);
			});
			
			catUl.appendChild(item);
		}
		
		document.getElementById('budget').appendChild(catUl);
	}
	
	//generate the overview
	var overviewUl = document.createElement('ul');
	this.printIncome(overviewUl);
	for(var i=0; i<this.categories.length; i++)
	{
		var title = this.categories[i].printTitle();
		title.style.backgroundColor = this.categories[i].color;
		overviewUl.appendChild(title);
	}
	document.getElementById('overview').appendChild(overviewUl);
}

budget.prototype.toJSON = function()
{
	var json = { category: [] };
	//loop through object and output as JSON
	for(var i=0; i<this.categories.length; i++)
	{
		json.category.push(this.categories[i].toJSON());
	}
	
	return json;
}

budget.prototype.update= function(cat, line, amount)
{
	this.categories[cat].items[line].amount = amount;
	this.print();
}

budget.prototype.incomeTotal = function()
{
	var total = 0;
	for(var i=0; i< this.income.length; i++)
	{
		total += this.income[i].amount;
	}
	
	return total;
}

budget.prototype.printIncome = function(ul)
{
	for(var i =0; i<this.income.length; i++)
	{
		var li = document.createElement('li');
		var moneySpan = document.createElement('span');
		moneySpan.type= 'text';
		
		var titleText = document.createTextNode(this.income[i].title);
		li.appendChild(titleText);

		var moneyText = document.createTextNode('$' + this.income[i].amount);
		
		moneySpan.appendChild(moneyText);
		moneySpan.className = 'money';
				
		li.appendChild(moneySpan);
		li.style.backgroundColor = '#DDD';
		
		ul.appendChild(li);
	}
}



budget.prototype.categoryTotal = function()
{
	var total = 0;
	for(var i=0; i< this.categories.length; i++)
	{
		total += this.categories[i].total();
	}
	return total;
}

budget.prototype.remainder = function()
{
	return this.incomeTotal()-this.categoryTotal();
}

budget.prototype.envelope = function()
{
	total = 0;
	for(var i=0; i<categories.length; i++)
	{
		total += categories[i].envelopeTotal();
	}
	
	return total;
}

budget.prototype.savings = function()
{
	total = 0;
	for(var i=0; i<categories.length; i++)
	{
		total += categories[i].savingsTotal();
	}
	
	return total;
}


budget.prototype.printLeftovers = function(ul)
{
	
}

