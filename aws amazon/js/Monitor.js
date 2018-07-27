//valores de configuracion
Region = 'us-east-1';
Usuario = 'AKIAIH2YM5VYNBNC3BSQ';
Contraseña = '582ZNAyNGJQi+b6Mk9Tc9kBOc55z6yYdU0hixCTy';
Tabla = 'BaseDeDatos'
DeviceName = "HomeIO"
Partitionkey = "deviceid"
var rango = 86400;

var topic0 = new Object();
var topic1 = new Object();
var topic2 = new Object();

topic0.nombre = "temperature";
topic1.nombre = "humidity";
topic2.nombre = "light";

//Acceso con Aws 
AWS.config.region = Region; // Region
AWS.config.credentials = new AWS.Credentials(Usuario, Contraseña);


/* las opciones para nuestro grafico */
verde = ['rgba(0,204,204,0.4)', "rgba(0,255,255,0.3)"], ['rgba(0,204,204,0.4)', 'rgba(0, 167, 245,0.4)'];
amarillo = 'rgba(245,241,2,0.5)', 'rgba(245,241,1,1)';
azul = 'rgba(0, 167, 245,0.3)', 'rgba(0, 167, 245,1)';
verdoso = 'rgba(0,204,204,0.5)', 'rgba(255,255,255,1)';
lila = 'rgba(229,204,255,0.5)', 'rgba(204,153,255,1)';
label = [];
temperaturegraph = Graf(monitoring, 'line', 'tinit', 'tctx', topic0.nombre, azul, []);
myDoughnutChart = Graf(pielight, 'pie', 'pinit', 'pctx', topic2.nombre, verde, label);


$(function() {
    getData();
    $.ajaxSetup({ cache: false });
    setInterval(getData, 300000);
});

/*Realiza un análisis de la tabla DynamoDB para establecer un objeto de datos para el gráfico. */


var dynamodb = new AWS.DynamoDB();

// placeholders for the data read
var timestampRead = 0.0,
    luzapagada = 0,
    luzencendida = 0;


function getData() {
    try {

        var topic0 = new Object();
        var topic1 = new Object();
        var topic2 = new Object();
        topic0.Values = [];
        topic1.Values = [];
        topic2.Values = [];
        topic0.Labels = [];
        topic1.Labels = [];
        topic2.Labels = [];
        topic0.nombre = "temperature";
        topic1.nombre = "humidity";
        topic2.nombre = "light";
        var params = {
            TableName: Tabla,
            KeyConditionExpression: '#id = :iottopic',
            ExpressionAttributeNames: {
                "#id": Partitionkey,
            },
            ExpressionAttributeValues: {
                ":iottopic": { "S": DeviceName },
            }
        };
        dynamodb.query(params, function(err, data) {

            if (err) {
                console.log(err);
                return null;
            } else {
                // marcadores de posición para las matrices de datos
                leerDB(data['Items'], topic0, topic1, topic2);
            }
        });
    } catch (err) {
        alert("Error en :" + err.message);
    }
}

function leerDB(data, topic0, topic1, topic2) {

    limit = (fechaMaxima(data));

    for (var i in data) { // lea los valores del paquete dynamodb JSON
        var timestampRead = parseFloat(data[i]['data']['M']['timestamp']['N']);
        if (timestampRead > limit) {
            var n = (data[i]['data']['M']['state']['M']['reported']['M']);
            m_respuesta0 = Consulta(n[topic0.nombre], timestampRead);
            topic0.value = m_respuesta0.value;
            topic0.time = m_respuesta0.time;
            m_respuesta1 = Consulta(n[topic1.nombre], timestampRead);
            topic1.value = m_respuesta1.value;
            topic1.time = m_respuesta1.time;
            m_respuesta2 = Consulta(n[topic2.nombre], timestampRead);
            topic2.value = m_respuesta2.value;
            topic1.time = m_respuesta2.time;

            if (topic2.value == 1) {
                luzencendida++;
            }
            if (topic2.value == 0) {
                luzapagada++;
            }
            // anexar los datos leídos a las matrices de datos

            AgregarDato(topic0, m_respuesta0, monitoring, 0);
            AgregarDato(topic1, m_respuesta1, monitoring, 1);
            AgregarDato(topic2, m_respuesta2, monitoring, 2);
        }
    }
    if (i == (data.length) - 1) {
        Topic0MaxMin = getMaxMinOfArray(topic0.Values, topic0.Labels);
        Topic1MaxMin = getMaxMinOfArray(topic1.Values, topic1.Labels);
    }
    ValuesMaxMin(Topic0MaxMin, Topic1MaxMin);
    pielight.data.datasets[0].data = [luzencendida, luzapagada];
    monitoring.update();

    pielight.update();

}

function Graf(Graf, tipo, init, ctx, nombre, color, label) {
    /* contexto para aplicar el gráfico al lienzo HTML. */
    var ctx = $(Graf).get(0).getContext("2d");
    var init = params(nombre, color);
    var hinit = params(nombre, color);
    var linit = params(nombre, color);
    var options = {
        responsive: true,
        showLines: true,
        scales: {
            xAxes: [{
                display: false
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };;
    return new Chart(ctx, { type: tipo, data: { datasets: [linit, init, hinit], labels: label }, options: options });


}

function fecha() {

    return rango = 86400;

}

function Consulta(topic, timeRead) {
    try {
        var m_respuesta = new Object();
        if (typeof(topic) != 'undefined') {
            m_respuesta.value = parseFloat(topic['N']);
            m_respuesta.time = (new Date((((timeRead) - 18000) * 1000))).toISOString();;
        }
        return m_respuesta;
    } catch (err) {
        alert("Error en Consulta():" + err.message);
    }

}

function getMaxMinOfArray(array, Rtime) {
    var m_respuesta = new Object();
    m_respuesta.max = Math.max.apply(null, array);
    m_respuesta.min = Math.min.apply(null, array);
    m_respuesta.Tmax = Rtime[array.indexOf(m_respuesta.max)];
    m_respuesta.Tmin = Rtime[array.indexOf(m_respuesta.min)];
    return m_respuesta;
}

function params(titulo, fondo, colorborde) {
    var name = {
        label: titulo,
        lineTension: 0.3,
        pointRadius: 5,
        pointBorderColor: "rgba(255,255,255,1)",
        pointHoverRadius: 5,
        pointHitRadius: 20,
        pointBorderWidth: 2,
        backgroundColor: fondo,
        borderColor: [fondo, "rgba(0,0,0,0.3)"],
        data: []
    };
    return name;
}

function ValuesMaxMin() {
    // actualizar los valores  alto/bajo para watermarks
    $('#t-high').text(Number(Topic0MaxMin.max).toFixed().toString() + '°C   ');
    $('#te-high').text((Topic0MaxMin.Tmax));
    $('#t-low').text(Number(Topic0MaxMin.min).toFixed().toString() + '°C   ');
    $('#te-low').text((Topic0MaxMin.Tmin));
    $('#h-high').text('Humedad mas alta: ' + Number(Topic1MaxMin.max).toFixed().toString() + '% ');
    $('#he-high').text((Topic1MaxMin.Tmax));
    $('#h-low').text('Humedad mas baja: ' + Number(Topic1MaxMin.min).toFixed().toString() + '% ');
    $('#he-low').text((Topic1MaxMin.Tmin));
}

function fechaMaxima(data) {
    rango = fecha();
    for (var j in data) {
        if (typeof(data[j]['data']['M']['state']) != 'undefined') {
            tiemp = parseFloat(data[j]['data']['M']['timestamp']['N']);
        }
    }
    return tiemp - rango;
}

function AgregarDato(topic, m_respuesta, grafica, i) {

    if (Object.keys(m_respuesta).length != 0) {
        topic.Values.push(topic.value);
        topic.Labels.push(topic.time);
        grafica.data.datasets[i].data = topic.Values;
        grafica.data.labels = topic.Labels;


        monitoring.data.labels = labelValues;
        monitoring.data.datasets[0].data = lightValues;
        monitoring.data.datasets[1].data = temperatureValues;
        monitoring.data.datasets[2].data = humidityValues;
        // volver a dibujar el gráfico canvas

    }
}