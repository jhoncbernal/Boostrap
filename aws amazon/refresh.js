//valores de configuracion
Region = 'us-east-1';
Usuario = 'AKIAIH2YM5VYNBNC3BSQ';
Contraseña = '582ZNAyNGJQi+b6Mk9Tc9kBOc55z6yYdU0hixCTy';
Tabla = 'BaseDeDatos'
DeviceName = "HomeIO"
Partitionkey = "deviceid"

delete Topic;
Topic = crearTopic();
var PubliDB;

AWS.config.region = Region; // Region
AWS.config.credentials = new AWS.Credentials(Usuario, Contraseña); //Acceso con Aws 

$(function() {

    getData();
    $.ajaxSetup({ cache: false });
    setInterval(getData, 500000);
});

/* las opciones para nuestro grafico */


var dynamodb = new AWS.DynamoDB(); /*Realiza un análisis de la tabla DynamoDB para establecer un objeto de datos para el gráfico. */
var timestampRead = 0.0,
    luzapagada = 0,
    luzencendida = 0;

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
        delete Topic[T].Values, delete Topic[T].Labels;
        Topic[T].Values = [], Topic[T].Labels = [];
        if (Topic[T].Grafica != undefined) {
            Topic[T].Grafica.destroy();
        }

        Topic[T].Grafica = Graf(Topic[T].NomGraf, Topic[T].TypeGraf, Topic[T].TiniGraf, Topic[T].TctxGraf, Topic[T].nombre, Topic[T].ColorGraf, Topic[T].datalabel);
        for (var i in data) { // lee los valores del paquete dynamodb JSON
            var timestampRead = parseFloat(data[i]['data']['M']['timestamp']['N']);
            if (timestampRead > limit) {
                var n = (data[i]['data']['M']['state']['M']['reported']['M']);
                Topic[T] = Object.assign({}, Topic[T], (Consulta(n[Topic[T].nombre], timestampRead)));

                AgregarDato(Topic[T], Topic[T].Grafica);
                delete Topic[T].value, delete Topic[T].time;
            }
        }
        if (i == (data.length) - 1) {
            Topic[T] = Object.assign({}, Topic[T], (getMaxMinOfArray(Topic[T].Values, Topic[T].Labels)));
        }
        if (Topic[T].Labels == 0) {
            document.getElementById("cont" + Topic[T].nombre).style.display = "none";
        } else {
            document.getElementById("cont" + Topic[T].nombre).style.display = "block";
        }
        ValuesMaxMin(Topic[T]);
    }
}

function fecha() {

    return rango = document.getElementById("Selecfecha").value;

}