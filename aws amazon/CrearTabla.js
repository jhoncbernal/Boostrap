//valores de configuracion
Region = 'us-east-1';
Usuario = 'AKIAIH2YM5VYNBNC3BSQ';
Contraseña = '582ZNAyNGJQi+b6Mk9Tc9kBOc55z6yYdU0hixCTy';
Tabla = 'BaseDeDatos';
DeviceName = "HomeIO";
Partitionkey = "deviceid";

AWS.config.region = Region; // Region
AWS.config.credentials = new AWS.Credentials(Usuario, Contraseña); //Acceso con Aws 



delete Topic;
Topic = crearTopic();

var PubliDB;


$(function() {
    getData();
    $.ajaxSetup({ cache: false });
    setInterval(getData, 500000);
});

/* las opciones para nuestro grafico */


var dynamodb = new AWS.DynamoDB(); /*Realiza un análisis de la tabla DynamoDB para establecer un objeto de datos para el gráfico. */
var timestampRead = 0.0;

function Refresh() {
    fecha();
    getData();
}

function getData() {
    try {
        var params = {
            TableName: Tabla,
            KeyConditionExpression: '#id = :iotTopic',
            ExpressionAttributeNames: {
                "#id": Partitionkey,
            },
            ExpressionAttributeValues: {
                ":iotTopic": { "S": DeviceName },
            }
        };
        datosBD = dynamodb.query(params, function(err, data) {
            if (err) {
                console.log(err);
                return null;
            } else {
                // marcadores de posición para las matrices de datos
                PubliDB = data['Items'];
                leerDB();

            }
        });
    } catch (err) {
        alert("Error en :" + err.message);
    }
}


function leerDB() {
    data = PubliDB;

    limit = (fechaMaxima(data));
    for (var T in Topic) {
        if (Topic[T].Grafica != undefined) {
            Topic[T].Grafica.destroy();
        }
        for (var i in data) { // lee los valores del paquete dynamodb JSON
            var timestampRead = parseFloat(data[i]['data']['M']['timestamp']['N']);
            if (timestampRead > limit) {
                var n = (data[i]['data']['M']['state']['M']['reported']['M']);
                Topic[T] = Object.assign({}, Topic[T], (Consulta(n[Topic[T].nombre], timestampRead)));
                CTabla(Topic[T]);

                delete Topic[T].value, delete Topic[T].time;

            }
        }

    }


}

function Tema(nombre, value, time, Values, Labels) {
    this.nombre = nombre;
    this.value = value;
    this.time = time;
    this.Values = [];
    this.Labels = [];
}

function crearTopic() {

    var Topic = [
        new Tema("temperature"),
        new Tema("humidity"),
        new Tema("light"),
        new Tema("test")
        //   new Tema("light", myDoughnutgraph, 'pie', 'pinit', 'pctx', verde, labelON)
    ];

    return Topic;
}

function fecha() {

    return rango = 21600;

}
var k = 0;

function CTabla(Topic) {
    if ((typeof(Topic.value)) != 'undefined') {
        k = +1;
        var table = document.getElementById("dataTable");
        var row = table.insertRow(k);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.innerHTML = Topic.nombre;
        cell2.innerHTML = DeviceName;
        cell3.innerHTML = Topic.value;
        cell4.innerHTML = "Fecha: " + (Topic.time.substring(0, 19)).replace('T', " Hora: ");
    }
}