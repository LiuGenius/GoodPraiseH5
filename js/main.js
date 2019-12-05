function Title(ID, name, logo, logo_2, status, sort) {
	var title = new Object();
	title.ID = ID;
	title.name = name;
	title.logo = logo;
	title.logo_2 = logo_2;
	title.status = status;
	title.sort = sort;
	return title;
}

function dataItem(ID, add_time, img, count, link,name,task_name,money) {
	var data = new Object();
	data.ID = ID;
	data.add_time = add_time;
	data.img = img;
	data.count = count;
	data.link = link;
	data.name = name;
	data.task_name = task_name;
	data.money = money;
	return data;
}

function banner(img, url) {
	var banner = new Object();
	banner.img = img;
	banner.url = url;
	return banner;
}
