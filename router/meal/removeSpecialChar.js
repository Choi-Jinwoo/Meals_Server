module.exports = (arr) => {
	const regExp  = /[\{\}\[\]\/?,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;

	for (let i = 0; i < arr.length; i++) {
		if(regExp .test(arr[i])){
				const result = arr[i].replace(regExp , "");
				arr[i] = result;
		}
	}
	
	return arr;
}
