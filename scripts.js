function currency_selected() {
  var from = document.getElementById("from").value;
  var to = document.getElementById("to").value;
  
  fetch('https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency='+from+'&to_currency='+to+'&apikey=ONAGD7CBCX84JFMZ')
  .then(response => {
    return response.json()
  })
  .then(data => {
    var rate_value = data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
    document.getElementById('rate').innerHTML = 'Real time exchange rate: <div class="black_text">' + rate_value + '</div>';
    draw_chart(from, to);
  })
  .catch(err => {
    console.log("currency_selected() failed {probably API limit for 5 requests per minute was reached}");
  })
}

function draw_chart(from, to) {
  Plotly.d3.csv("https://www.alphavantage.co/query?function=FX_DAILY&from_symbol="+from+"&to_symbol="+to+"&apikey=ONAGD7CBCX84JFMZ&datatype=csv", function(err, rows){
  
    function unpack(rows, key) {
      return rows.map(function(row) { return row[key]; });
    }

    var trace = {
      type: "scatter",
      mode: "lines",
      x: unpack(rows, 'timestamp'),
      y: unpack(rows, 'close'),
      line: {color: '#17BECF'}
    }

    var data = [trace];
        
    var layout = {
      title: 'Historical exchange chart',
      xaxis: {
        autorange: true, 
        rangeselector: {buttons: [
            {
              count: 7, 
              label: '1W', 
              step: 'day', 
              stepmode: 'backward'
            },
            {
              count: 1,
              label: '1M',
              step: 'month',
              stepmode: 'backward'
            },
            {step: 'all'}
          ]},
        type: 'date'
      }, 
      yaxis: {
        autorange: true,
        type: 'linear'
      }
    };

    Plotly.newPlot('chart', data, layout, {showSendToCloud: true});
  })
}

// Initial action
fetch('https://openexchangerates.org/api/currencies.json')
  .then(response => {
    return response.json()
  })
  .then(data => {
    var options = "";
    for (var key in data) {
      options += '<option value="' + key + '">' + key + '</option>';
    }
    document.getElementById('from').innerHTML = options;
    document.getElementById('to').innerHTML = options;

    // Select default values
    document.getElementById("from").selectedIndex = "0";
    document.getElementById("to").selectedIndex = "0";
    currency_selected();
  })
  .catch(err => {
    console.log("Reading currencies list from json failed.");
  })
