function addCategory()
{
	var title = document.getElementById('txtCategory').value;
	var color = c.colors[c.activeColor];
	
	var cat = new category(title, color);
	b.addCat(cat);
	b.print();
}

function addLineItem()
{
	var title = document.getElementById('txtTitle').value;
	var amount = document.getElementById('txtAmount').value;
	
	var line = new lineItem(title, amount);
	b.categories[b.activeCategories].addLine(line);
	b.print();
}