function timeUpdate(object) {
	var date = new Date();
	object.innerHTML = date.toTimeString().substr(0, 8) + "   " + formatDate(date);
}

function formatDate(date) {
  var monthNames = [
    "Gennaio", "Febbraio", "Marzo",
    "Aprile", "Maggio", "Giugno", "Luglio",
    "Agosto", "Settembre", "Ottobre",
    "Novembre", "Dicembre"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
}
