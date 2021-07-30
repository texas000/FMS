export default function usdFormat(x) {
	var num = parseFloat(x).toFixed(2);
	if (typeof x == "number") {
		return "$" + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	} else {
		return "$" + 0;
	}
}
