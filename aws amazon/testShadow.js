var iotdata = new AWS.IotData({
    endpoint: 'a2imeekghuew2f.iot.us-east-1.amazonaws.com',
    accessKeyId: 'AKIAI7AS2GBI7VMI2Y5A',
    secretAccessKey: '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',
    region: 'us-east-1',
    apiVersion: '2015-05-28'
});

function topic0() {

    try {
        Accion = document.getElementById("ACCION").value;
        topic = document.getElementById("topic0").value;
        value = document.getElementById("value0").value;
        document.getElementById("sliderVal0").innerHTML = value;



        traer(Accion);

    } catch (err) {
        alert("topic0() test" + err)
    }
}

function topic1() {

    try {
        Accion = document.getElementById("ACCION").value;
        topic = document.getElementById("topic1").value;
        value = document.getElementById("value1").value;
        document.getElementById("sliderVal1").innerHTML = value;


        traer(Accion);

    } catch (err) {
        alert("topic1() test" + err)
    }
}


function topic2() {

    try {
        Accion = document.getElementById("ACCION").value;
        topic = document.getElementById("topic2").value;
        value = +(document.getElementById("value2").checked);

        traer(Accion);

    } catch (err) {
        alert("topic2() test" + err)
    }
}

function traer(accion) {
    switch (accion) {
        case "obtener":
            var params = {
                thingName: 'HomeIO' /* required */
            };
            return iotdata.getThingShadow(params, function(err, data) {
                if (err) {
                    console.log(err, err.stack); // an error occurred
                } else {
                    console.log(data);
                    alert(data.payload); // successful response
                }
            });
            break;
        case "actualizar":
            var nuevo = '';

            nuevo = nuevo.concat('{"state": {"reported": {"', topic, '":', value, '}}}');


            var params = {
                payload: nuevo,
                thingName: 'HomeIO',
            };

            return iotdata.updateThingShadow(params, function(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    // alert("success!");
                }
            })

            break;
        default:
            //alert("Por favor seleccione una opcion en el cuadro superior : " + "\n" + "Actualizar: Envia los datos al dispositivo. \nObtener : Obtiene el ultimo valor publicado en los dispositivos");
    }
}