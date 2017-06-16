export function GetDate() {
	var date = new Date();
	var m = date.getMonth() + 1;
	var d = date.getDate();
	return [date.getFullYear(), (m > 9 ? '' : '0') + m, (d > 9 ? '' : '0') + d].join('');
}
