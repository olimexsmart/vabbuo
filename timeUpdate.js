function timeUpdate(object) {
	var date = new Date()
	object.innerHTML = date.toTimeString().substr(0, 8) + "   " + formatDate(date)
}

function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + '/' + monthNames[monthIndex] + '/' + year;
}
