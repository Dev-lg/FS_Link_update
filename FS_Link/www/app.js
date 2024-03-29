window.onload = (event) => {
	const button_root = document.getElementById('button_root');
	const button_create_dir = document.getElementById('button_create_dir');
	const button_open = document.getElementById('button_open');
	
	var a = document.getElementsByClassName('copybutton');
	for (var i = 0; i < a.length; i++) {
		a[i].addEventListener('click', function() {
			
			var row = this.parentNode.parentNode.cells[0].innerHTML;
			row = window.location.host + "/" + row.split('"')[1];
			console.log(row);
			Copy(row);
		});
	}
	
	// disable button_root if we in root path
	var fullPath = document.getElementById('link_abs').getElementsByTagName('a')[0].innerHTML;
	var pathArr = GetPathArr(fullPath);
	if(pathArr.length == 1) {
		button_root.disabled = true;
	}
	
	// disable create and open folder when error occur
	var err = document.getElementById('error');
	if(err.innerHTML != "") {
		button_create_dir.disabled = true;
		button_open.disabled = true;
	}
	
	// load git version
	fetch("/git_version.html")
		.then(res => res.text())
		.then(res => version.innerHTML = "GIT v.: " + res)
		
	
	
	button_root.addEventListener('click', async _ => {
		var fullPath = document.getElementById('link_abs').getElementsByTagName('a')[0].innerHTML;
		var pathArr = GetPathArr(fullPath);
		var upPath = "";
		for (i = 0; i < pathArr.length - 1; i++) {			
			upPath += pathArr[i];
			upPath += "\\";
		}
		if(pathArr.length > 2) {
			upPath = upPath.slice(0, -1);
		}
		console.log(upPath);
		//console.log(window.location.host);
		window.location.href = '/' + encodeURI(upPath);
		//window.location.replace(newPathname);
	});
	button_create_dir.addEventListener('click', async _ => {
	try {     
		let folderName = prompt("Please enter new folder name", "");
		if((folderName != null) && (folderName != "")) {
			let xhr = new XMLHttpRequest();
			xhr.open("POST", "/NewFolder");
			xhr.setRequestHeader("Accept", "text/html");
			xhr.setRequestHeader("Content-Type", "test/html");

			xhr.onreadystatechange = function () {
			  if (xhr.readyState === 4) {
				console.log(xhr.status);
				console.log(xhr.responseText);
				if(xhr.status == 200) {
					alert(xhr.responseText);
					location.reload(); 
				}	
			  }
			};  
			
			xhr.send(window.location.pathname + "%5c" + encodeURI(folderName));
		}
	} catch(err) {
		console.error("Error: " + err);
	}
	});
	button_open.addEventListener('click', async _ => {
	try {     
		const response = await fetch('OpenFolder', {
			method: 'post',
			body: window.location.pathname
		});
	} catch(err) {
		console.error('Error: ${err}');
	}
	});
};

function Copy(link) {
	navigator.clipboard.writeText(link);
}

function GetPathArr(path) {
	path = decodeURI(path).split('\\');
	// delete empty element from array
	path = path.reduce((acc, i) => i ? [...acc, i] : acc, []);
	return path;
}