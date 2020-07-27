(function() {


"use strict";
var Flocks64 = {

//gerado aleatoriamente a partir de ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
_keyStr : "qB8puMDmbIjPRhrFfxJ4k9etUnsYXZvST5VC3czW1yo0EG2iNdLaHQ6KgwA7lO+/=",

encode : function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i      = 0;

	var strArray = input.split(" ");
	input        = strArray[strArray.length - 1];

	var strArray = input.split("/");
	input        = strArray[strArray.length - 2];


    input = Flocks64._utf8_encode(input);

    while (i < input.length) {

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

    }
    output = output.slice(10, 18);
    return output;
},

_utf8_encode : function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }

    return utftext;
}

}



function rasparDados(){
		if(document.getSelection().focusNode == null)return;
		let clickedEl = document.getSelection().focusNode.parentElement;
		let table = clickedEl.closest("table");		
		if(table === null){
			alert("No HTML table was found");
			return;
		}
		table = table.cloneNode(true);
		let csv = [];
		let rows = table.rows;				
		for (let i = 1; i < rows.length; i++) {
			let row = [], cols = rows[i].querySelectorAll("td, th");	
			for (let j = 0; j < cols.length; j++) {
				let columnItem = cols[j].innerText.replace(/"/g, "\"\""); //as per rfc4180

				columnItem = columnItem.replace(/(\r\n\t|\n|\r\t)/gm," ").trim(); //New lines are nothing but trouble										
				cols[j].querySelectorAll("a").forEach(function(ele){ columnItem = columnItem + (columnItem.length > 0 ? " " : "") + ele.href; });
				



				if(j == 0) {
					columnItem = Flocks64.encode(columnItem);
				}
				if(j == 1) {
					if(columnItem == '—')
					{
						columnItem = '0';
					}
				}

				row.push("\"" + columnItem + "\"");



				for(let a = 1; a < cols[j].colSpan; a++){
					row.push("\"\""); //keep alignment by adding empty cells for colSpan
				}
				for(let a = 1; a < cols[j].rowSpan; a++){
					rows[i+a].insertBefore(document.createElement("td"), rows[i+a].children[j]); //keep alignment by adding empty cells for rowSpan
				}
			}
			csv.push(row.join(","));  				
		}  
		let downloadLink = document.createElement("a");
		let fileName = prompt("Nome do arquivo: ", (table.id || table.id.length > 0) ? table.id : "tabela");
		if(fileName == null) return;			
		downloadLink.download = fileName != "" ? fileName + ".csv" : "tabela.csv"
		downloadLink.href = window.URL.createObjectURL(new Blob([csv.join("\r\n")], {type: "text/csv"}));
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
		downloadLink.click();	
	}
	
	if(window.hasOwnProperty("btnDireitoRaspar") && btnDireitoRaspar){
		btnDireitoRaspar = false;
		rasparDados();
	}else{
		let originalCursor = document.body.style.cursor;
		document.addEventListener("click", function(event){ 
			document.body.style.cursor = originalCursor; 
			rasparDados(); }, {once:true}, true);
		document.body.style.cursor = "crosshair";		
	}
})();
