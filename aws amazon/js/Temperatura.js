AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.Credentials('AKIAIH2YM5VYNBNC3BSQ', '582ZNAyNGJQi+b6Mk9Tc9kBOc55z6yYdU0hixCTy');
var dynamodb = new AWS.DynamoDB();
var params = {
    TableName: 'BaseDeDatos',
    KeyConditionExpression: '#id = :iottopic',
    ExpressionAttributeNames: {
        "#id": "deviceid",
    },
    ExpressionAttributeValues: {
        ":iottopic": { "S": "HomeIO" },
    }
};
$(function() {
    getData();
    $.ajaxSetup({ cache: false });
    setInterval(getData, 300000);
});
/*Realiza un análisis de la tabla DynamoDB para establecer un objeto de datos para el gráfico. */

var DataValues = [];
var labelValues = [];

function getData() {
    dynamodb.query(params, function(err, data) {
        if (err) {
            console.log(err);
            return null;
        } else {
            // marcadores de posición para las matrices de datos

            // placeholders for the data read
            var DataRead = 0.0;
            var n; //ruta donde se encuentran los datos a consultar
            var timestampRead = 0.0;
            var timeRead = "";
            var t = "";
            // marcadores de posición para los marcadores alto / bajo
            var DataHigh = -999.0;
            var DataLow = 999.0;
            var DataHighTime = "";
            var DataLowTime = "";

            for (var j in data['Items']) {
                if (typeof(data['Items'][j]['data']['M']['state']) != 'undefined') {
                    timestampRead = parseFloat(data['Items'][j]['data']['M']['metadata']['M']['reported']['M']['temperature']['M']['timestamp']['N']);
                }
            }
            var max = Math.max(timestampRead);
            var limit = max - 86400;

            for (var i in data['Items']) {
                // lea los valores del paquete dynamodb JSON
                if (typeof(data['Items'][i]['data']['M']['state']) != 'undefined') {
                    var timestampRead2 = parseFloat(data['Items'][i]['data']['M']['metadata']['M']['reported']['M']['temperature']['M']['timestamp']['N']);
                    if (timestampRead2 > limit) {
                        var timestamp1 = timestampRead2;
                        n = (data['Items'][i]['data']['M']['state']['M']['reported']['M']);
                        DataRead = parseFloat(n['temperature']['N']);
                        timestampRead = parseFloat(data['Items'][i]['data']['M']['metadata']['M']['reported']['M']['temperature']['M']['timestamp']['N']);


                        t = new Date((timestampRead - 18000) * 1000);
                        timeRead = t.toISOString();

                        DataValues.push(DataRead);
                        labelValues.push(timeRead);
                    }
                }

            }

            //establecer los datos del objeto gráfico y las matrices de etiquetas
            //  Datagraph.data.labels = labelValues;
            // Datagraph.data.datasets[0].data = DataValues;
            // volver a dibujar el gráfico canvas
            //Datagraph.update();
            // actualizar los valores  alto/bajo para watermarks
        }
    });
}

function myFunction() {
    for (var k = 0; k < DataValues.length; k++) {
        var table = document.getElementById("dataTable");

        var row = table.insertRow(k + 1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.innerHTML = "Temperatura";
        cell2.innerHTML = "HomeIO";
        cell3.innerHTML = DataValues[k];
        cell4.innerHTML = labelValues[k];

    }
}