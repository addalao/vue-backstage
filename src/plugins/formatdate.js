function formatDate(pattern, date) {
    function formatNumber(data, format) {
        format = format.length;
        data = data || 0;
        return format == 1 ? data : (data = String(Math.pow(10, format) + data)).substr(data.length - format);
    }
    return pattern.replace(/([yMdhsm])\1*/g, function (format) {
        switch (format.charAt()) {
            case 'y':
                return formatNumber(date.getFullYear(), format);
            case 'M':
                return formatNumber(date.getMonth() + 1, format);
            case 'd':
                return formatNumber(date.getDate(), format);
            case 'w':
                return date.getDay() + 1;
            case 'h':
                return formatNumber(date.getHours(), format);
            case 'm':
                return formatNumber(date.getMinutes(), format);
            case 's':
                return formatNumber(date.getSeconds(), format);
        }
    });
}

function formatStrToDate(pattern, value) {
	if(!value)
		return '';
    var dt = new Date(value);
	let val = '';
    if (isNaN(dt)) {
        val = value.substring(0, 19);
        val = val.replace(/-/g, "/");
        dt = new Date(val);
    }
    val = formatDate(pattern, dt);
    return val;
}

function dateValid(value){
	var val=""
	if(!value)
		val = new Date()
    else
		val = value.toString().replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g,'$1-$2-$3 $4:$5:$6');
	return new Date(val)
}


export{
	formatDate,
	formatStrToDate,
	dateValid
}