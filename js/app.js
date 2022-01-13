console.log('local::::::' + localStorage.token);
var urlBase = window.location.origin.replace('naser', 'apinaser').replace('8080', '8000') + "/public/api/";
var myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
myHeaders.append("Authorization", "Bearer " + localStorage.token);
console.log("--------HEADERS INIT----------------");
console.log(myHeaders);
var seccionInicial = 1;
var updateBen = false;

var planesRequest = null;

var raw = JSON.stringify({ "": "" });

var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
};

fetch(urlBase + "isvalid", requestOptions)
    .then(resp => {
        if (resp.status != 200) {
            location.href = 'login.html';
        } else {
            $('body').show()
        }
    })
    .catch(error => console.log('error', error));

function getTarifas() {
    console.log(myHeaders);
    requestOptionsTar = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(urlBase + "tarifas", requestOptionsTar)
        .then(resp => {
            console.log(resp.status);
            localStorage.setItem("codeResponde", resp.status);
            return resp.json();
        })
        .then(data => {
            //console.log(data);
            if (localStorage.codeResponde == 200) {
                planesRequest = data;
                $.each(planesRequest, function(key, value) {
                    console.log(value)
                    $('<option>').val(value.id).text(value.plan_type).appendTo('#plan');
                });
                $('#plan').selectpicker('refresh');
            } else
                $('#mensaje').text('Tu nombre de usuario o contraseña no coinciden')

        })
        .catch(error => console.log('error', error));
}

getTarifas();

/*$(".choice").removeClass("expand unset ");
$(".choice").addClass("small");
$("#seccion"+seccionInicial).removeClass("small");
$("#seccion"+seccionInicial).addClass("expand");
$("#previous").prop('disabled', true);

$(".choice").on("click", function(){
console.log("test");
$(".choice").removeClass("expand unset ");
$(".choice").addClass("small");
$(this).removeClass("small");
$(this).addClass("expand");
})*/
$('form').hide()
$(".choice").removeClass("expand unset ");
$(".choice").addClass("small");
$("#seccion1").removeClass("small");
$("#seccion1").addClass("expand");
$('form').show()
$('#updateBeneficiario').hide();
$('#cancelarUpdateBeneficiario').hide();

$(document).ready(function() {
    $(":input").inputmask();
    $('select').selectpicker();
    $("#previous").prop('disabled', true);

    $("#nombres").change(function() {
        $('#signature').text($("#nombres").val() + ' ' + $("#apellidos").val());
    })
    $("#apellidos").change(function() {
        $('#signature').text($("#nombres").val() + ' ' + $("#apellidos").val());
    });

    $('#form7 .btn-group input').on('change', function() {
        $('#numeroTc').val('');
        $('#vvcTc').val('');
        $('#expiraTC').val('');
        if ($(this).val() == "AM") {
            $('#numeroTc').inputmask({ mask: ["9999 999999 99999"] });
            $('#vvcTc').inputmask({ mask: ["9999"] });
        } else {
            $('#numeroTc').inputmask({ mask: ["9999 9999 9999 9999"] });
            $('#vvcTc').inputmask({ mask: ["999"] });
        }
    });
});

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    $('.selectpicker').selectpicker('mobile');
}

$('#cteNombresApellidos').selectpicker({
    noneResultsText: "Haz Click para adicionar: <button id='btnSelect' onclick='addOptionCte(this)'>{0}</button>"
});

function addOptionCte(that) {
    console.log($(that).text().replaceAll('"', ''))
    $("#cteNombresApellidos option[value='-1']").remove();
    $('#cteNombresApellidos').append('<option value= "-1">' + $(that).text().replaceAll('"', '') + '</option>');
    $('#cteNombresApellidos').selectpicker('refresh');

    $("#cteNombresApellidos option[value='-1']").remove();
    $('#cteNombresApellidos').append('<option value= "-1">' + $(that).text().replaceAll('"', '') + '</option>');
    $('#cteNombresApellidos').val(-1);
    $('#cteNombresApellidos').selectpicker('refresh');
    $('#cteNombresApellidos').selectpicker('refresh');
    $('#cteNombresApellidos').trigger('change');
}

$('#cteNombresApellidos').change(function() {
    opcionSel = $('#cteNombresApellidos').val();
    if (opcionSel >= 0) {
        arrayLinea = arrayBeneficiarios["'" + opcionSel + "'"];
        if (arrayLinea[0] == 'titular') {
            $('#cteParentesco').val(arrayLinea[0]);
            $('#cteParentesco').selectpicker('refresh');
            $('#cteDireccion').val($('#form1 #direccion').val());
            $('#cteCiudad').val($('#form1 #ciudad').val());
            $('#cteProvincia').val($('#form1 #provincia').val());
            $('#cteCodigoPostal').val($('#form1 #codigoPostal').val());
            $('#ctePais').val($('#form1 #paisResidencia').val());
            $('#ctePais').selectpicker('refresh');
            $('#cteTelefono').val($('#form1 #telefono').val());
            $('#cteCelular').val($('#form1 #celular').val());
            $('#cteEmail').val($('#form1 #email').val());
        } else {
            $('#cteParentesco').val(arrayLinea[0]);
            $('#cteParentesco').selectpicker('refresh');
            $('#cteDireccion').val('');
            $('#cteCiudad').val('');
            $('#cteProvincia').val('');
            $('#cteCodigoPostal').val('');
            $('#ctePais').val('');
            $('#ctePais').selectpicker('refresh');
            $('#cteTelefono').val('');
            $('#cteCelular').val('');
            $('#cteEmail').val('');
        }
    } else {
        $('#cteParentesco').val('');
        $('#cteParentesco').selectpicker('refresh');
        $('#cteDireccion').val('');
        $('#cteCiudad').val('');
        $('#cteProvincia').val('');
        $('#cteCodigoPostal').val('');
        $('#ctePais').val('');
        $('#ctePais').selectpicker('refresh');
        $('#cteTelefono').val('');
        $('#cteCelular').val('');
        $('#cteEmail').val('');

    }
    console.log('Opcion:' + opcionSel);
});
/*$('#cteNombresApellidos').selectpicker({
    liveSearch: true,
    liveSearchNormalize: true,
    liveSearchPlaceholder: 'Otros...',
});*/

$("#next").on("click", function() {

    $('#form' + seccionInicial).addClass('was-validated');
    //if ($('#form' + seccionInicial)[0].checkValidity() === true && seccionInicial != 2) {
    console.log(seccionInicial);
    $('#pb' + seccionInicial).removeClass("bg-transparent");
    $('#pb' + seccionInicial).addClass("bgProgress" + seccionInicial);
    //$("#pb"+seccionInicial).attr('aria-valuenow', 10).css('width', 10+'%');
    if (seccionInicial >= 1 && seccionInicial < $(".choice").length) {
        seccionInicial++;
        $("#previous").prop('disabled', false);
    } else
        $("#next").prop('disabled', true);
    //seccionInicial = 1;


    $(".choice").removeClass("expand unset ");
    $(".choice").addClass("small");
    $("#seccion" + seccionInicial).removeClass("small");
    $("#seccion" + seccionInicial).addClass("expand");
    //$("#pb"+seccionInicial).attr('aria-valuenow', 10).css('width', 10+'%');
    //}

})

$("#previous").on("click", function() {
    console.log("test");
    console.log(seccionInicial);
    $('#pb' + seccionInicial).removeClass("bgProgress" + seccionInicial);
    $('#pb' + seccionInicial).addClass("bg-transparent");
    if (seccionInicial > 1 && seccionInicial < $(".choice").length + 1) {
        seccionInicial--;
        $("#next").prop('disabled', false);
    } else
        $("#previous").prop('disabled', true);
    //seccionInicial = 1;
    // $("#pb"+seccionInicial).attr('aria-valuenow', 0).css('width', 0+'%');
    $(".choice").removeClass("expand unset ");
    $(".choice").addClass("small");
    $("#seccion" + seccionInicial).removeClass("small");
    $("#seccion" + seccionInicial).addClass("expand");

})
$('#fechaNacimiento').datepicker({
    autoclose: true,
    todayHighlight: true,
    language: "es",
    orientation: "bottom auto",
    enableOnReadonly: false,
    disableTouchKeyboard: true,
    format: "mm/dd/yyyy",
});
$('#fechaDebito').datepicker({
    autoclose: true,
    todayHighlight: true,
    language: "es",
    orientation: "bottom auto",
    enableOnReadonly: false,
    disableTouchKeyboard: true,
    format: "mm/dd/yyyy",
});


$("#expiraTC").datepicker({
    format: "mm-yyyy",
    startView: "months",
    minViewMode: "months",
    language: "es",
});

$('#fechaNacimiento').datepicker("setDate", new Date());

$('#benFechaNacimiento').datepicker({
    autoclose: true,
    todayHighlight: true,
    language: "es",
    orientation: "bottom auto",
    enableOnReadonly: false,
    disableTouchKeyboard: true,
    format: "mm/dd/yyyy",
});
$('#benFechaNacimiento').datepicker("setDate", new Date());


$("#benFechaNacimiento").change(function() {
    var today = new Date();
    var birthDate = new Date($(this).datepicker('getDate'));
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    console.log(age)
    return $('#benEdad').val(age);
});

function GetAge(birthDate) {
    var today = new Date();
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

$('#benParentesco').change(function() {
    opcionParentesco = $('#form2 #benParentesco').val();
    if (opcionParentesco == 'titular') {
        if (updateBen === true) {
            $('#form2 #benParentesco').prop('disabled', true);
        }
        $('#form2 #benNombresApellidos').prop('readonly', true);
        $('#form2 #benNombresApellidos').val($('#form1 #nombres').val().trim() + ' ' + $('#form1 #apellidos').val().trim());
        $('#form2 #benFechaNacimiento').datepicker("setDate", $('#form1 #fechaNacimiento').val());
        $('#form2 #benFechaNacimiento').prop('readonly', true);
        $('#form2 #benPaisResidencia').val($('#form1 #paisResidencia').val());
        $('#form2 #benPaisOrigen').val($('#form1 #paisOrigen').val());
        $('#form2 #benPaisResidencia').prop('disabled', true);
        $('#form2 #benPaisOrigen').prop('disabled', true);
        $('#form2 select').selectpicker('refresh');
        $('#benFechaNacimiento').trigger('change');

    } else if (updateBen === true) {
        $('#form2 #benNombresApellidos').prop('readonly', false);
        $('#form2 #benFechaNacimiento').prop('readonly', false);
        $('#form2 #benPaisResidencia').prop('disabled', false);
        $('#form2 #benPaisOrigen').prop('disabled', false);
        $('#form2 select').selectpicker('refresh');
    } else {
        resetForm('form2');
        $('#benParentesco').val(opcionParentesco);
        $('#form2 select').selectpicker('refresh');
        $('#form2 #benNombresApellidos').prop('readonly', false);
        $('#form2 #benFechaNacimiento').prop('readonly', false);
        $('#form2 #benPaisResidencia').prop('disabled', false);
        $('#form2 #benPaisOrigen').prop('disabled', false);
        $('#form2 select').selectpicker('refresh');
    }
})


var cantBeneficiarios = 0;
var idTablaGlobal;
var arrayBeneficiarios = [];
$("#addBeneficiario").on("click", function() {
    $('#form2').addClass('was-validated');
    if ($('#form2')[0].checkValidity() === true) {
        $('#form2 #benPaisResidencia').prop('disabled', false);
        $('#form2 #benPaisOrigen').prop('disabled', false);
        $('#form2 select').selectpicker('refresh');
        var serialForm = ($('#form2').serializeArray());
        console.log("---------SERIALIZE------------");
        console.log(serialForm);
        strHtmlTable = '';
        arrayLinea = []
        serialForm.forEach(function(element) {
            console.log(element);
            strHtmlTable = strHtmlTable + '<td>' + element['value'] + '</td>';
            arrayLinea.push(element['value']);
            console.log(arrayLinea);
        });
        arrayBeneficiarios["'" + cantBeneficiarios + "'"] = [];
        arrayBeneficiarios["'" + cantBeneficiarios + "'"] = arrayLinea;
        strHtmlTable = '<tr id="trBen_' + cantBeneficiarios + '">' + strHtmlTable + '<td><button type="button" onClick="editarBen(' + cantBeneficiarios + ')" class="btn btn-info"><i class="bi bi-pen-fill"></i></button></td><td><button type="button" class="btn btn-danger" onClick="quitarBen(' + cantBeneficiarios + ')"><i class="bi bi-trash-fill"></i></button></td></tr>';
        $('[id^=benPregunta]').append('<option value=' + cantBeneficiarios + '>' + arrayLinea[1] + '</option>');
        $('[id^=benPregunta]').selectpicker('refresh');
        $('#cteNombresApellidos').append('<option value=' + cantBeneficiarios + '>' + arrayLinea[1] + '</option>');
        $('#cteNombresApellidos').selectpicker('refresh');
        $("#listaBeneficiarios > tbody").append(strHtmlTable);
        console.log(strHtmlTable);
        $('#form2')[0].reset();
        $('#form2 select').selectpicker('refresh');
        $('#form2').removeClass('was-validated');
        cantBeneficiarios++;

    }
});

$("#updateBeneficiario").on("click", function() {
    $('#form2').addClass('was-validated');
    if ($('#form2')[0].checkValidity() === true) {
        updateBen = false;
        $('#form2 #benPaisResidencia').prop('disabled', false);
        $('#form2 #benPaisOrigen').prop('disabled', false);
        $('#form2 #benParentesco').prop('disabled', false);
        $('#form2 select').selectpicker('refresh');
        var serialForm = ($('#form2').serializeArray());
        strHtmlTable = '';
        arrayLinea = []
        serialForm.forEach(function(element) {
            console.log(element);
            strHtmlTable = strHtmlTable + '<td>' + element['value'] + '</td>';
            arrayLinea.push(element['value']);
            console.log(arrayLinea);
        });
        arrayBeneficiarios["'" + idTablaGlobal + "'"] = [];
        arrayBeneficiarios["'" + idTablaGlobal + "'"] = arrayLinea;
        $('#listaBeneficiarios > tbody #trBen_' + idTablaGlobal).html('');
        $('#listaBeneficiarios > tbody #trBen_' + idTablaGlobal).html(strHtmlTable + '<td><button type="button" onClick="editarBen(' + idTablaGlobal + ')" class="btn btn-info"><i class="bi bi-pen-fill"></i></button></td><td><button type="button" class="btn btn-danger" onClick="quitarBen(' + idTablaGlobal + ')"><i class="bi bi-trash-fill"></i></button></td>');
        $("option[value=optionvalue]").html('New text');
        $('[id^=benPregunta] option[value=' + idTablaGlobal + ']').html(arrayLinea[1]);
        $('[id^=benPregunta]').selectpicker('refresh');
        $('#cteNombresApellidos option[value=' + idTablaGlobal + ']').html(arrayLinea[1]);
        $('#cteNombresApellidos').selectpicker('refresh');
        console.log(strHtmlTable);
        $('#addBeneficiario').show();
        $('#updateBeneficiario').hide();
        $('#form2')[0].reset();
        $('#form2').removeClass('was-validated');
        $('#cancelarUpdateBeneficiario').hide();
        $('#form2 select').selectpicker('refresh');
    }
});

function editarBen(idTabla) {
    updateBen = true;
    console.log(idTabla)
    idTablaGlobal = idTabla;
    arrayLinea = arrayBeneficiarios["'" + idTabla + "'"];
    $('#benNombresApellidos').val(arrayLinea[1]);
    $('#benParentesco').val(arrayLinea[0]);
    $('#benFechaNacimiento').datepicker("setDate", arrayLinea[2]);
    $('#benPaisResidencia').val(arrayLinea[4]);
    $('#benPaisOrigen').val(arrayLinea[5]);
    $('#benCiudad').val(arrayLinea[6]);
    $('#benProvincia').val(arrayLinea[7]);
    $('#addBeneficiario').hide();
    $('#updateBeneficiario').show();
    $('#cancelarUpdateBeneficiario').show();
    $('#form2 select').selectpicker('refresh');
    $('#benParentesco').trigger('change');
}

function quitarBen(idTabla) {
    //$('#listaBeneficiarios #trBen_'+idTabla).remove();
    idTablaGlobal = idTabla;
    $('#confirmacionOpcion').modal('show')
    console.log(idTabla)

}

function resetForm(idForm) {
    if (idForm == 'form2') {
        $('#form2')[0].reset();
        $('#updateBeneficiario').hide();
        $('#cancelarUpdateBeneficiario').hide();
        $('#addBeneficiario').show();
        $('#form2 select').selectpicker('refresh');
        updateBen = false;
    }
}

$("#cancelarUpdateBeneficiario").on("click", function() {
    resetForm('form2');
});

function respuestaCheck(idPregunta, elemento) {
    if (elemento.checked) {
        $('#benPregunta' + idPregunta).prop('disabled', false);
        $('#benPregunta' + idPregunta).selectpicker('refresh');
    } else {
        $('#benPregunta' + idPregunta).prop('disabled', true);
        $('#benPregunta' + idPregunta).val('');
        $('#benPregunta' + idPregunta).selectpicker('refresh');
    }
}

function respuestaInfoCheck(elemento) {
    if (elemento.checked) {
        $('#infoDireccion').val($('#form1 #direccion').val());
        $('#infoCiudad').val($('#form1 #ciudad').val());
        $('#infoProvincia').val($('#form1 #provincia').val());
        $('#infoCodigoPostal').val($('#form1 #codigoPostal').val());
        $('#infoPais').val($('#form1 #paisResidencia').val());
        $('#infoPais').selectpicker('refresh');
        $('#infoTelefono').val($('#form1 #telefono').val());
        $('#infoCelular').val($('#form1 #celular').val());
        $('#infoEmail').val($('#form1 #email').val());
    } else {
        $('#infoDireccion').val('');
        $('#infoCiudad').val('');
        $('#infoProvincia').val('');
        $('#infoCodigoPostal').val('');
        $('#infoPais').val('');
        $('#infoPais').selectpicker('refresh');
        $('#infoTelefono').val('');
        $('#infoCelular').val('');
        $('#infoEmail').val('');
    }
}

var modalConfirm = function(callback) {

    $("#btn-confirm").on("click", function() {
        $("#confirmacionOpcion").modal('show');
    });

    $("#modal-btn-si").on("click", function() {
        callback(true);
        $("#confirmacionOpcion").modal('hide');
    });

    $("#modal-btn-no").on("click", function() {
        callback(false);
        $("#confirmacionOpcion").modal('hide');
    });
};

$('#cerrarSesion').on("click", function() {
    accionLogout('logout');
});

modalConfirm(function(confirm) {
    if (confirm) {
        //Acciones si el usuario confirma
        $('#listaBeneficiarios #trBen_' + idTablaGlobal).remove();
        delete arrayBeneficiarios["'" + idTablaGlobal + "'"];
        $('[id^=benPregunta] option[value=' + idTablaGlobal + ']').remove();
        $('[id^=benPregunta]').selectpicker('refresh');
        $('#cteNombresApellidos option[value=' + idTablaGlobal + ']').remove();
        $('#cteNombresApellidos').selectpicker('refresh');
    }
});



// Example starter JavaScript for disabling form submissions if there are invalid fields
(function() {
    'use strict';
    window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        console.log('Validando Form');
        var validation = Array.prototype.filter.call(forms, function(form) {
            form.addEventListener('submit', function(event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();

function accionLogout(accion) {

    fetch(urlBase + accion, requestOptions)
        .then(resp => {
            if (resp.status == 200)
                location.href = 'login.html';
        })
        .catch(error => console.log('error', error));
}