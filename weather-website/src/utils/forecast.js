const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/a5e00f851ca3a6d2f60bc55a0d1a30b3/' + latitude + ',' + longitude

    request({ url, json: true }, (error, { body }) => {
        if(error){
            callback('unable to connect to weather service!', undefined)
        }else if(body.error){
            callback('Unable to find location', undefined)
        } else {
            const data = body.currently
            callback(undefined, body.daily.data[0].summary + ' It is currently ' + data.temperature + ' degrees out. ' + 'The high for today is ' + body.daily.data[0].temperatureHigh + ' degrees, and the low for today is ' + body.daily.data[0].temperatureLow + ' degrees. There is a ' + data.precipProbability + '% chance of rain.')
        }
    })
}


module.exports = forecast
