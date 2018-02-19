spreaders.maths = {
    
    roundAndFormatForCurrency: function (number) {
        number = Number(number)
        var negative = false;
        var digits = 2
        if(number < 0) {
        negative = true
        number = number * -1
        }
        var multiplicator = Math.pow(10, digits)
        number = parseFloat((number * multiplicator).toFixed(11))
        number = (Math.round(number) / multiplicator).toFixed(2)
        if( negative ) {    
            number = (number * -1).toFixed(2)
        }
        return number.replace(/\.(\d+)/, '<span>.$1</span>')
    }
}