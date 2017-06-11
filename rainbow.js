 function rainbow(o, sat, light) {
	S(o).backgroundColor = "hsl(" + color + "," + sat + "%," + light + "%)";
	color++;
	color %= 360;
}
