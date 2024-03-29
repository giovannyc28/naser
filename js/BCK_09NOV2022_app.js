console.log('local::::::' + localStorage.token);
var urlBase = window.location.origin.replace('portal.', 'api.').replace('8080', '8000') + "/public/api/";
if (window.location.origin == "http://naser.local:8080")
    var urlBase = "http://apinaser.local:8000/public/api/"
if (window.location.origin == "https://www.naser.ibitsoluciones.com")
    var urlBase = "https://www.apinaser.ibitsoluciones.com/public/api/"
var myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
myHeaders.append("Authorization", "Bearer " + localStorage.token);
console.log("--------HEADERS INIT----------------");
var seccionInicial = 1;
var edadLimite = 18;
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
    requestOptionsTar = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(urlBase + "tarifas", requestOptionsTar)
        .then(resp => {
            localStorage.setItem("codeResponde", resp.status);
            return resp.json();
        })
        .then(data => {
            if (localStorage.codeResponde == 200) {
                planesRequest = data;
                /*$.each(planesRequest, function(key, value) {
                    $('<option>').val(value.id).text(value.plan_type).appendTo('#plan');
                });
                $('#plan').selectpicker('refresh');*/
            } else
                $('#mensaje').text('Tu nombre de usuario o contraseña no coinciden')

        })
        .catch(error => console.log('error', error));
}

getTarifas();

var namePlanes = new Array();
namePlanes['Annual'] = "yearly_fee";
namePlanes['Annual 3 payments'] = "yearly_fee";
namePlanes['Monthly'] = "monthly_fee";
namePlanes['Quartely'] = "quarterly_fee";
namePlanes['Semester'] = "halfyear_fee";

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
$('#adminUserLink').hide()

$(document).ready(function() {
    $('#finish').hide()
    $(":input").inputmask();
    $('select').selectpicker();
    $("#previous").prop('disabled', true);
    $('#numeroTc').prop('disabled', true);

    roleKind = getRole().then(data => {
        if (data.role == 'admin') {
            $('#adminUserLink').show()
            $('#adminLanguageLink').show()
        } else {
            $('#adminUserLink').hide()
            $('#adminLanguageLink').hide()
        }
    });

    $("#nombres").change(function() {
        $('#signature').text($("#nombres").val() + ' ' + $("#apellidos").val());
    })

    $("#apellidos").change(function() {
        $('#signature').text($("#nombres").val() + ' ' + $("#apellidos").val());
    });

    $("#estadoCivil").change(function() {
        $('#estadoCivilValue').val($("#estadoCivil option:selected").text());
    });

    $("#genero").change(function() {
        $('#strGenderValue').val($("#genero option:selected").text());
    });

    $("#paisResidencia").change(function() {
        $('#strCountryofResidenceValue').val($("#paisResidencia option:selected").text());
    });

    $("#paisOrigen").change(function() {
        $('#strAHAddress1CountrOrRegionValue').val($("#paisOrigen option:selected").text());
    });


    $("#benPaisResidencia").change(function() {
        $('#benPaisResidenciaValue').val($("#benPaisResidencia option:selected").text());
    });

    $("#benPaisOrigen").change(function() {
        $('#benPaisOrigenValue').val($("#benPaisOrigen option:selected").text());
    });

    $("#ctePais").change(function() {
        $('#strECAddress1CountrOrRegionValue').val($("#ctePais option:selected").text());
    });

    $("#cteParentesco").change(function() {
        $('#cteParentescoValue').val($("#cteParentesco option:selected").text());
    });

    $("#infoPais").change(function() {
        $('#infoPaisValue').val($("#infoPais option:selected").text());
    });



    $('#form7 #franquiciaCT').on('change', function() {
        $('#numeroTc').val('');
        $('#vvcTc').val('');
        $('#numeroTc').prop('disabled', false);
        $('#expiraTc').val('');
        $('#numeroTc').removeClass("is-valid");
        $('#numeroTc').removeClass("is-invalid");
        $('#vvcTc').removeClass("is-valid");
        $('#vvcTc').removeClass("is-invalid");

        calculaValor = (parseFloat($('#planValorHide').val()) + parseFloat($('#planValorCargoHide').val())).toFixed(2);
        $('#valorTc').val(calculaValor);
        if ($(this).val() == "American Express") {
            $("#numeroTc").attr('maxlength', 17);
            $("#numeroTc").attr('minlength', 17);
            $('#numeroTc').inputmask({ mask: ["9999 999999 99999"], greedy: false });
            $("#vvcTc").attr('maxlength', 4);
            $("#vvcTc").attr('minlength', 4);
            $('#vvcTc').inputmask({ mask: ["9999"], greedy: false });
        } else {
            $("#numeroTc").attr('maxlength', 19);
            $("#numeroTc").attr('minlength', 19);
            $('#numeroTc').inputmask({ mask: ["9999 9999 9999 9999"], greedy: false });
            $("#vvcTc").attr('maxlength', 3);
            $("#vvcTc").attr('minlength', 3);
            $('#vvcTc').inputmask({ mask: ["999"], greedy: false });
        }
    });

    $('#planCheck').bootstrapToggle('disable');
    $("[name^='planPeridoOpt_']").addClass('disabled')


    $('#plan').change(function() {
        opcion = $(this).val();
        if (opcion > 0) {
            planSeleccionado = planesRequest.find(function(element) {
                return element.id == opcion;
            });
            $("[name='planPeridoOpt_1']").removeClass('disabled')
            $("[name='planPeridoOpt_2']").removeClass('disabled')
            $("[name='planPeridoOpt_3']").removeClass('disabled')
            $("[name='planPeridoOpt_4']").removeClass('disabled')

            if (planSeleccionado.yearly_fee == '0.00')
                $("[name='planPeridoOpt_1']").addClass('disabled')
            if (planSeleccionado.halfyear_fee == '0.00')
                $("[name='planPeridoOpt_2']").addClass('disabled')
            if (planSeleccionado.quarterly_fee == '0.00')
                $("[name='planPeridoOpt_3']").addClass('disabled')
            if (planSeleccionado.monthly_fee == '0.00')
                $("[name='planPeridoOpt_4']").addClass('disabled')

            if (Object.keys(arrayBeneficiarios).length > planSeleccionado.cant_person && planSeleccionado.cant_person > 0) {
                resetForm('form5');
                $("[name^='planPeridoOpt']").addClass('disabled')
                $('#planCheck').bootstrapToggle('off')
                $('#planCheck').bootstrapToggle('disable');
                $('#checAnualDiv').hide('slow');
                $("#alertaPLan").modal('show');
            } else {
                if (planSeleccionado.anualmultiple_pays > 0 && planSeleccionado.cant_person > 0) {
                    $('#planCheck').bootstrapToggle('off')
                    $('#planCheck').bootstrapToggle('enable');
                    $('#checAnualDiv').show('slow');
                } else {
                    $('#planCheck').bootstrapToggle('off')
                    $('#planCheck').bootstrapToggle('disable');
                    $('#checAnualDiv').hide('slow');
                }
                calcValorPlan();
            }

            $('#form5 #planPeriodo').change(function() {
                calcValorPlan()
            })
        }
    })

    $("#numeroTc").keyup(function() {
        valTarjeta('#numeroTc')
    });

    $("#vvcTc").keyup(function() {
        valTarjeta('#vvcTc')
    });

    $("#celular").keyup(function() {
        maskCel('#celular');
    });

    $("#cteCelular").keyup(function() {
        maskCel('#cteCelular');
    });



    $('#telefono').inputmask('999 999 9999');
    $('#cteTelefono').inputmask('999 999 9999');
    $('#fechaNacimiento').inputmask({ alias: "mm/dd/yyyy" });
    $('#fechaDebitoTc').inputmask({ alias: "mm/dd/yyyy" });
    $('#fechaDebitoTB').inputmask({ alias: "mm/dd/yyyy" });
    $('#fechaDebitoBC').inputmask({ alias: "mm/dd/yyyy" });
    $('#benFechaNacimiento').inputmask({ alias: "mm/dd/yyyy" });

    maskCel();
    $('#tarjeta').hide();
    $('#cheque').hide();
    $('#transferencia').hide();

    $(".filter-option").on("click", function() {
        idSelect = $(this).closest("button").attr('data-id');
        $('#' + idSelect).selectpicker('toggle');
        //alert(idSelect);
    });



    $("#region").change(function() {
        $("#plan option[value!='']").remove();
        $('#plan').selectpicker('refresh');
        $.each(planesRequest, function(key, value) {
            if (value.language == $('#region').val()) {
                console.log(value.language);
                $('<option>').val(value.id).text(value.plan_type).appendTo('#plan');
            }
        });
        $('#plan').val("");
        $('#planPeriodo').val("");
        $('#plan').selectpicker('refresh');
        $('#planPeriodo').selectpicker('refresh');
        $('#plan').trigger('change');
        $('#planValor').val(0);
        $('#planValorCargo').val(0);
        $('#planValorHide').val(0);
        $('#planValorCargoHide').val(0)
    });

    $('#estadoCivil, #genero, #paisResidencia, #paisOrigen, #benPaisResidencia, #benPaisOrigen, #ctePais, #cteParentesco, #infoPais, #region').trigger('change');

});

function maskCel(selectorMask) {
    var phones = [{ "mask": "### ### ####" }, { "mask": "+# ### ### ####" }, { "mask": "+## ### ### ####" }, { "mask": "+### ### ### ####" }];
    $(selectorMask).inputmask({
        mask: phones,
        greedy: false,
        definitions: { '#': { validator: "[0-9]", cardinality: 1 } }
    });
}

function valTarjeta(idSelector) {
    $(idSelector).removeClass("is-invalid");
    $(idSelector).removeClass("is-valid");
    if ($(idSelector).inputmask("isComplete")) {
        $(idSelector).addClass("is-valid");
    } else {
        $(idSelector).addClass("is-invalid");
    }
}

function calcValorPlan(idPlan) {
    userPlan = namePlanes[$('#form5 #planPeriodo').val()]
    if (userPlan !== undefined) {
        discountStr = userPlan.replace("fee", "subscription_discount");
        if (planSeleccionado.cant_person == -1) {
            valorTotal = 0;
            cantMenores = 0;
            cantMayores = 0;
            noCuotas = 0;
            $('#planCheck').bootstrapToggle('off');
            $('#planCheck').bootstrapToggle('disable');
            $('#checAnualDiv').hide('slow');
            for (let key in arrayBeneficiarios) {
                edad = arrayBeneficiarios[key]['4']
                if (edad < edadLimite) {
                    cantMenores++;
                } else {
                    cantMayores++;
                }
            }

            if (userPlan == 'yearly_fee')
                noCuotas = 12;
            if (userPlan == 'halfyear_fee')
                noCuotas = 6;
            if (userPlan == 'quarterly_fee')
                noCuotas = 3;
            if (userPlan == 'monthly_fee')
                noCuotas = 1;

            valorTotal = ((cantMenores * planSeleccionado.value_kid) + (cantMayores * planSeleccionado.value_adult)) * noCuotas


            $('#planValor').val(valorTotal);
            $('#planValorCargo').val(planSeleccionado.subscription_fee - (planSeleccionado[discountStr] * planSeleccionado.subscription_fee));
            $('#planValorHide').val(valorTotal);
            $('#planValorCargoHide').val(planSeleccionado.subscription_fee - (planSeleccionado[discountStr] * planSeleccionado.subscription_fee));
        } else {

            $('#planValor').val(eval('planSeleccionado.' + userPlan));
            $('#planValorCargo').val(planSeleccionado.subscription_fee - (planSeleccionado[discountStr] * planSeleccionado.subscription_fee));
            $('#planValorHide').val(eval('planSeleccionado.' + userPlan));
            $('#planValorCargoHide').val(planSeleccionado.subscription_fee - (planSeleccionado[discountStr] * planSeleccionado.subscription_fee));
        }
    }
}


$('.selectpicker').selectpicker({
    container: 'body'
});

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    //$('.selectpicker').selectpicker('mobile');
    /*var elements = document.querySelectorAll('.mobile-device'); 
                    for(var i = 0; i < elements.length; i++)
                    {
                        elements[i].classList.remove('mobile-device');
                    }*/
}

$('#cteNombres').selectpicker({
    noneResultsText: "Haz Click para adicionar: <button id='btnSelect' onclick='addOptionCte(this)'>{0}</button>"
});

function addOptionCte(that) {
    $("#cteNombres option[value='-1']").remove();
    $('#cteNombres').append('<option value= "-1">' + $(that).text().replaceAll('"', '') + '</option>');
    $('#cteNombres').selectpicker('refresh');

    $("#cteNombres option[value='-1']").remove();
    $('#cteNombres').append('<option value= "-1">' + $(that).text().replaceAll('"', '') + '</option>');
    $('#cteNombres').val(-1);
    $('#cteNombres').selectpicker('refresh');
    $('#cteNombres').selectpicker('refresh');
    $('#cteNombres').trigger('change');
}

$('#cteNombres').change(function() {
    opcionSel = $('#cteNombres').val();
    if (opcionSel >= 0) {
        arrayLinea = arrayBeneficiarios["'" + opcionSel + "'"];
        if (arrayLinea[0].toLowerCase() == 'titular' || arrayLinea[0].toLowerCase() == 'holder') {
            $('#cteParentesco').val(arrayLinea[0]);
            $('#cteParentesco').selectpicker('refresh');
            $('#cteApellidos').val($('#form1 #apellidos').val());
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
            $('#cteApellidos').val(arrayLinea[2]);
            $('#cteDireccion').val('');
            $('#cteCiudad').val(arrayLinea[7]);
            $('#cteProvincia').val(arrayLinea[8]);
            $('#cteCodigoPostal').val('');
            $('#ctePais').val(arrayLinea[7]);
            $('#ctePais').selectpicker('refresh');
            $('#cteTelefono').val('');
            $('#cteCelular').val('');
            $('#cteEmail').val('');
        }
    } else if (opcionSel == '-2') {
        $('#cteParentesco').val('Holder');
        $('#cteParentesco').selectpicker('refresh');
        $('#cteApellidos').val($('#form1 #apellidos').val());
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
        $('#cteParentesco').val('');
        $('#cteParentesco').selectpicker('refresh');
        $('#cteApellidos').val('');
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
    $('#ctePais, #cteParentesco').trigger('change');
});
/*$('#cteNombresApellidos').selectpicker({
    liveSearch: true,
    liveSearchNormalize: true,
    liveSearchPlaceholder: 'Otros...',
});*/

$("#next").on("click", function() {

    $('#form' + seccionInicial).addClass('was-validated');
    if (($('#form' + seccionInicial)[0].checkValidity() === true && seccionInicial != 2) || (seccionInicial == 2 && Object.keys(arrayBeneficiarios).length > 0)) {
        if (seccionInicial == 2)
            $('#form' + seccionInicial).removeClass('was-validated');
        else
            $('#form' + seccionInicial).addClass('was-validated');

        if (seccionInicial == 2 && !optHolder) {
            $("#cteNombres option[value='-2']").remove();
            $('#cteNombres').append('<option value= "-2">' + $('#form1 #nombres').val() + '</option>');
            $('#cteNombres').selectpicker('refresh');
            $('#cteNombres').selectpicker('refresh');
        }

        if (seccionInicial == 2 && optHolder) {
            $("#cteNombres option[value='-2']").remove();
            $('#cteNombres').selectpicker('refresh');
            $('#cteNombres').selectpicker('refresh');
        }
        if (seccionInicial == 3) {
            stopAudioRecording();
            stopAudioPlaying()
        }


        $('#pb' + seccionInicial).removeClass("bg-transparent");
        $('#pb' + seccionInicial).addClass("bgProgress" + seccionInicial);
        //$("#pb"+seccionInicial).attr('aria-valuenow', 10).css('width', 10+'%');
        if (seccionInicial >= 1 && seccionInicial < $(".choice").length) {
            seccionInicial++;
            $("#previous").prop('disabled', false);
        } else {
            $("#next").prop('disabled', true);
        }

        if (seccionInicial == $(".choice").length) {
            $('#finish').show()
        }
        //seccionInicial = 1;


        $(".choice").removeClass("expand unset ");
        $(".choice").addClass("small");
        $("#seccion" + seccionInicial).removeClass("small");
        $("#seccion" + seccionInicial).addClass("expand");
        //$("#pb"+seccionInicial).attr('aria-valuenow', 10).css('width', 10+'%');
    }

})

$("#previous").on("click", function() {
    $('#pb' + seccionInicial).removeClass("bgProgress" + seccionInicial);
    $('#pb' + seccionInicial).addClass("bg-transparent");
    if (seccionInicial == 3) {
        stopAudioRecording();
        stopAudioPlaying()
    }
    if (seccionInicial > 1 && seccionInicial < $(".choice").length + 1) {
        seccionInicial--;
        $("#next").prop('disabled', false);
    } else
        $("#previous").prop('disabled', true);

    $('#finish').hide();


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
    language: localStorage.language,
    orientation: "bottom righ",
    enableOnReadonly: false,
    disableTouchKeyboard: true,
    format: "mm/dd/yyyy",
});
$('#fechaDebitoTc').datepicker({
    autoclose: true,
    todayHighlight: true,
    language: localStorage.language,
    orientation: "bottom auto",
    enableOnReadonly: false,
    disableTouchKeyboard: true,
    format: "mm/dd/yyyy",
});

$('#fechaDebitoTB').datepicker({
    autoclose: true,
    todayHighlight: true,
    language: localStorage.language,
    orientation: "bottom auto",
    enableOnReadonly: false,
    disableTouchKeyboard: true,
    format: "mm/dd/yyyy",
});

$('#fechaDebitoBC').datepicker({
    autoclose: true,
    todayHighlight: true,
    language: localStorage.language,
    orientation: "bottom auto",
    enableOnReadonly: false,
    disableTouchKeyboard: true,
    format: "mm/dd/yyyy",
});


$("#expiraTc").datepicker({
    autoclose: true,
    orientation: "bottom auto",
    disableTouchKeyboard: true,
    enableOnReadonly: false,
    format: "mm-yy",
    startView: "months",
    minViewMode: "months",
    language: localStorage.language,
});

$('#fechaNacimiento').datepicker("setDate", new Date());

$('#benFechaNacimiento').datepicker({
    autoclose: true,
    todayHighlight: true,
    language: localStorage.language,
    orientation: "bottom auto",
    enableOnReadonly: false,
    disableTouchKeyboard: true,
    format: "mm/dd/yyyy",
});
$('#benFechaNacimiento').datepicker("setDate", new Date());


$("#benFechaNacimiento").change(function() {
    calcularEdad()
});

$("#benFechaNacimiento").blur(function() {
    calcularEdad()
});

function calcularEdad() {
    if ($('#benFechaNacimiento').val() != '') {
        var today = new Date();
        var birthDate = new Date($('#benFechaNacimiento').datepicker('getDate'));
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        $('#benEdad').val(age);
    } else {
        $('#benEdad').val('');
    }
}

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
    if (opcionParentesco.toLowerCase() == 'titular' || opcionParentesco.toLowerCase() == 'holder') {
        if (updateBen === true) {
            $('#form2 #benParentesco').prop('disabled', true);
        }
        $('#form2 #benNombres').prop('readonly', true);
        $('#form2 #benNombres').val($('#form1 #nombres').val().trim());
        $('#form2 #benApellidos').prop('readonly', true);
        $('#form2 #benApellidos').val($('#form1 #apellidos').val().trim());
        $('#form2 #benFechaNacimiento').datepicker("setDate", $('#form1 #fechaNacimiento').val());
        $('#form2 #benFechaNacimiento').prop('readonly', true);
        $('#form2 #benPaisResidencia').val($('#form1 #paisResidencia').val());
        $('#form2 #benPaisResidenciaValue').val($('#form1 #paisResidencia option:selected').text())
        $('#form2 #benPaisOrigen').val($('#form1 #paisOrigen').val());
        $('#form2 #benPaisOrigenValue').val($('#form1 #paisOrigen option:selected').text());
        $('#form2 #benPaisResidencia').prop('disabled', true);
        $('#form2 #benPaisOrigen').prop('disabled', true);
        $('#form2 #benCiudad').prop('readonly', true);
        $('#form2 #benCiudad').val($('#form1 #ciudad').val());
        $('#form2 #benProvincia').prop('readonly', true);
        $('#form2 #benProvincia').val($('#form1 #provincia').val());
        $('#form2 #benEmail').prop('readonly', true);
        $('#form2 #benEmail').val($('#form1 #email').val());
        $('#form2 select').selectpicker('refresh');
        $('#benFechaNacimiento').trigger('change');

    } else if (updateBen === true) {
        $('#form2 #benNombres').prop('readonly', false);
        $('#form2 #benApellidos').prop('readonly', false);
        $('#form2 #benFechaNacimiento').prop('readonly', false);
        $('#form2 #benPaisResidencia').prop('disabled', false);
        $('#form2 #benPaisOrigen').prop('disabled', false);
        $('#form2 #benCiudad').prop('readonly', false);
        $('#form2 #benProvincia').prop('readonly', false);
        $('#form2 #benEmail').prop('readonly', false);
        $('#form2 select').selectpicker('refresh');
    } else {
        resetForm('form2');
        $('#benParentesco').val(opcionParentesco);
        $('#form2 select').selectpicker('refresh');
        $('#form2 #benNombres').prop('readonly', false);
        $('#form2 #benApellidos').prop('readonly', false);
        $('#form2 #benFechaNacimiento').prop('readonly', false);
        $('#form2 #benPaisResidencia').prop('disabled', false);
        $('#form2 #benPaisOrigen').prop('disabled', false);
        $('#form2 #benCiudad').prop('readonly', false);
        $('#form2 #benProvincia').prop('readonly', false);
        $('#form2 #benEmail').prop('readonly', false);
        $('#form2 select').selectpicker('refresh');
    }
    $('#benParentescoValue').val($("#benParentesco option:selected").text())
})




var cantBeneficiarios = 0;
var idTablaGlobal;
var arrayBeneficiarios = [];
var optHolder = false;
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
            // strHtmlTable = strHtmlTable + '<td>' + element['value'] + '</td>';
            arrayLinea.push(element['value']);
        });
        strHtmlTable += '<td>' + serialForm[10]['value'] + '</td>';
        strHtmlTable += '<td>' + serialForm[1]['value'] + '</td>';
        strHtmlTable += '<td>' + serialForm[2]['value'] + '</td>';
        strHtmlTable += '<td>' + serialForm[3]['value'] + '</td>';
        strHtmlTable += '<td>' + serialForm[4]['value'] + '</td>';
        strHtmlTable += '<td>' + serialForm[5]['value'] + '</td>';
        strHtmlTable += '<td>' + serialForm[6]['value'] + '</td>';
        strHtmlTable += '<td>' + serialForm[7]['value'] + '</td>';
        strHtmlTable += '<td>' + serialForm[8]['value'] + '</td>';
        strHtmlTable += '<td>' + serialForm[9]['value'] + '</td>';

        if (serialForm[0]['value'] == 'Holder')
            optHolder = true;

        arrayBeneficiarios["'" + cantBeneficiarios + "'"] = [];
        arrayBeneficiarios["'" + cantBeneficiarios + "'"] = arrayLinea;
        strHtmlTable = '<tr id="trBen_' + cantBeneficiarios + '">' + strHtmlTable + '<td><button type="button" onClick="editarBen(' + cantBeneficiarios + ')" class="btn btn-info"><i class="bi bi-pen-fill"></i></button></td><td><button type="button" class="btn btn-danger" onClick="quitarBen(' + cantBeneficiarios + ')"><i class="bi bi-trash-fill"></i></button></td></tr>';
        $('[id^=benPregunta]').append('<option value=' + cantBeneficiarios + '>' + arrayLinea[1] + " " + arrayLinea[2] + '</option>');
        $('[id^=benPregunta]').selectpicker('refresh');
        $('#cteNombres').append('<option value=' + cantBeneficiarios + '>' + arrayLinea[1] + '</option>');
        $('#cteNombres').selectpicker('refresh');
        $("#listaBeneficiarios > tbody").append(strHtmlTable);
        $('#form2')[0].reset();
        $('#form2 select').selectpicker('refresh');
        $('#form2').removeClass('was-validated');
        cantBeneficiarios++;

    }
    $('#plan').trigger('change');
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
            //strHtmlTable = strHtmlTable + '<td>' + element['value'] + '</td>';
            arrayLinea.push(element['value']);
        });
        strHtmlTable += '<td>' + serialForm[10]['value'] + '</td>';
        strHtmlTable += '<td>' + serialForm[1]['value'] + '</td>';
        strHtmlTable += '<td>' + serialForm[2]['value'] + '</td>';
        strHtmlTable += '<td>' + serialForm[3]['value'] + '</td>';
        strHtmlTable += '<td>' + serialForm[4]['value'] + '</td>';
        strHtmlTable += '<td>' + serialForm[5]['value'] + '</td>';
        strHtmlTable += '<td>' + serialForm[6]['value'] + '</td>';
        strHtmlTable += '<td>' + serialForm[7]['value'] + '</td>';
        strHtmlTable += '<td>' + serialForm[8]['value'] + '</td>';
        strHtmlTable += '<td>' + serialForm[9]['value'] + '</td>';
        arrayBeneficiarios["'" + idTablaGlobal + "'"] = [];
        arrayBeneficiarios["'" + idTablaGlobal + "'"] = arrayLinea;
        $('#listaBeneficiarios > tbody #trBen_' + idTablaGlobal).html('');
        $('#listaBeneficiarios > tbody #trBen_' + idTablaGlobal).html(strHtmlTable + '<td><button type="button" onClick="editarBen(' + idTablaGlobal + ')" class="btn btn-info"><i class="bi bi-pen-fill"></i></button></td><td><button type="button" class="btn btn-danger" onClick="quitarBen(' + idTablaGlobal + ')"><i class="bi bi-trash-fill"></i></button></td>');
        $("option[value=optionvalue]").html('New text');
        $('[id^=benPregunta] option[value=' + idTablaGlobal + ']').html(arrayLinea[1] + " " + arrayLinea[2]);
        $('[id^=benPregunta]').selectpicker('refresh');
        $('#cteNombres option[value=' + idTablaGlobal + ']').html(arrayLinea[1]);
        $('#cteNombres').selectpicker('refresh');
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
    idTablaGlobal = idTabla;
    arrayLinea = arrayBeneficiarios["'" + idTabla + "'"];
    $('#benNombres').val(arrayLinea[1]);
    $('#benApellidos').val(arrayLinea[2]);
    $('#benParentesco').val(arrayLinea[0]);
    $('#benFechaNacimiento').datepicker("setDate", arrayLinea[3]);
    $('#benPaisResidencia').val(arrayLinea[5]);
    $('#benPaisOrigen').val(arrayLinea[6]);
    $('#benCiudad').val(arrayLinea[7]);
    $('#benProvincia').val(arrayLinea[8]);
    $('#benEmail').val(arrayLinea[9]);
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
}

function resetForm(idForm) {
    if (idForm == 'form2') {
        $('#form2')[0].reset();
        $('#updateBeneficiario').hide();
        $('#cancelarUpdateBeneficiario').hide();
        $('#addBeneficiario').show();
        $('#form2 #benParentesco').prop('disabled', false);
        $('#form2 select').selectpicker('refresh');
        updateBen = false;
    } else {
        $('#' + idForm)[0].reset();
        $('#' + idForm + ' select').selectpicker('refresh');
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
        $('#infoNombres').val($('#form1 #nombres').val());
        $('#infoApellidos').val($('#form1 #apellidos').val());
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
        $('#infoNombres').val('');
        $('#infoApellidos').val('');
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
    $('#infoPais').trigger('change');

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

        if (arrayBeneficiarios["'" + idTablaGlobal + "'"][0] == 'Holder')
            optHolder = false;

        delete arrayBeneficiarios["'" + idTablaGlobal + "'"];
        $('[id^=benPregunta] option[value=' + idTablaGlobal + ']').remove();
        $('[id^=benPregunta]').selectpicker('refresh');
        $('#cteNombres option[value=' + idTablaGlobal + ']').remove();
        $('#plan').trigger('change');
        $('#cteNombres').selectpicker('refresh');

    }
});



// Example starter JavaScript for disabling form submissions if there are invalid fields
(function() {
    'use strict';
    window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
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

function getFormData($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i) {
        if ((n['name'] == 'dtDateofbirth' || n['name'] == 'fechaDebitoTc' || n['name'] == 'fechaDebitoBC' || n['name'] == 'fechaDebitoTB') && $("[name='" + n['name'] + "']").val() != '') {
            indexed_array[n['name']] = $("[name='" + n['name'] + "']").datepicker('getDate').toISOString().slice(0, 10);
        } else if (n['name'] == 'strECFirstName') {
            indexed_array[n['name']] = $("[name='" + n['name'] + "'] option:selected").text();
        } else if (n['name'].indexOf("[]") > -1) {
            indexed_array[n['name']] = $("[name='" + n['name'] + "']").val();
        } else {
            indexed_array[n['name']] = n['value'];
        }
    });

    return indexed_array;
}


$("#finish").on("click", function() {
    $("div.spanner").addClass("show");
    $("div.overlay").addClass("show");
    objSend = {};
    //$("#finish").prop('disabled', true);
    arrayBeneficiariosData = arrayBeneficiarios;
    for (let key in arrayBeneficiariosData) {
        dateOpt = new Date(arrayBeneficiariosData[key]['3']);
        arrayBeneficiarios[key]['3'] = dateOpt.toISOString().slice(0, 10)
    }
    $('#valorTc').prop('disabled', false);
    objSend.form1 = getFormData($('#form1'))
    objSend.form2 = Object.assign({}, arrayBeneficiariosData);
    objSend.form3 = getFormData($('#form3'));
    objSend.form4 = getFormData($('#form4'));
    objSend.form5 = getFormData($('#form5'));
    objSend.form6 = getFormData($('#form6'));
    objSend.form7 = getFormData($('#form7'));
    objSend.form8 = getFormData($('#form8'));
    if (audioElementSource == undefined)
        objSend.form9 = ""
    else
        objSend.form9 = audioElementSource.src;
    objSend.language = $('#flagLanguage').val();
    $('#valorTc').prop('disabled', true);

    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + localStorage.token);

    var raw = JSON.stringify(objSend);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(urlBase + "registrarContrato", requestOptions)
        .then(response => {
            $("div.spanner").removeClass("show");
            $("div.overlay").removeClass("show");
            return response.json();
        })
        .then(result => {
            //alert(result.createAgreementDetail.createAgreementDetailResult.AgreementNumber);
            $('#alertaMsg').html(localStorage.alertTextExitoso);
            $('#idContract').html(result.createAgreementDetail.createAgreementDetailResult.AgreementNumber);
            console.log(result);
            console.log(result.createAgreementDetail.createAgreementDetailResult.AgreementNumber);
            $("#aceptarAlerta").on("click", function() {
                location.href = 'contratos.html';
            })
            $("#alertaBox").modal('show');
        })
        .catch(error => {
            $('#alertaMsg').html(localStorage.alertTextNoExitoso);
            $('#idContract').html('');
            $("div.spanner").removeClass("show");
            $("div.overlay").removeClass("show");
            $("#aceptarAlerta").on("click", function() {
                $("#alertaBox").modal('hide');
            })
            $("#alertaBox").modal('show');
            $("#finish").prop('disabled', false);
            console.log('error', error)
        });
});

function chgMedioPago(that) {
    console.log($(that).val())

    $('#franquiciaCT').val('');
    $('#franquiciaCT').selectpicker('refresh');
    $('#nombretc').val('');
    $('#numeroTc').val('');
    $('#expiraTc').val('');
    $('#valorTc').val('');
    $('#vvcTc').val('');
    $('#fechaDebitoTc').val('');
    $('#fechaDebitoBC').val('');
    $('#fechaDebitoTB').val('');
    $('#tipoCta').val('');
    $('#tipoCta').selectpicker('refresh');
    $('#bancoCheque').val('');
    $('#numeroRutaCheque').val('');
    $('#numeroCtaCheque').val('');
    $('#tipoTransferencia').val('');
    $('#tipoTransferencia').selectpicker('refresh');
    $('#nombreTransferencia').val('');
    $('#numeroReferencia').val('');
    $('#numeroConfirmacion').val('');

    if ($(that).val() == 'BC') {
        $('#tarjeta').hide();
        $('#cheque').show();
        $('#transferencia').hide();

        $("#franquiciaCT").attr('required', false);
        $("#nombretc").attr('required', false);
        $("#numeroTc").attr('required', false);
        $("#expiraTc").attr('required', false);
        $("#valorTc").attr('required', false);
        $("#vvcTc").attr('required', false);
        $("#fechaDebitoTc").attr('required', false);
        $("#fechaDebitoTB").attr('required', false);

        $("#tipoCta").attr('required', true);
        $("#bancoCheque").attr('required', true);
        $("#numeroRutaCheque").attr('required', true);
        $("#numeroCtaCheque").attr('required', true);
        $("#tipoTransferencia").attr('required', false);
        $("#nombreTransferencia").attr('required', false);
        $("#numeroReferencia").attr('required', false);
        $("#fechaDebitoBC").attr('required', true);

    } else if ($(that).val() == 'TC') {
        $('#tarjeta').show();
        $('#cheque').hide();
        $('#transferencia').hide();
        calculaValor = (parseFloat($('#planValorHide').val()) + parseFloat($('#planValorCargoHide').val())).toFixed(2);
        $('#valorTc').val(calculaValor);

        $("#franquiciaCT").attr('required', true);
        $("#nombretc").attr('required', true);
        $("#numeroTc").attr('required', true);
        $("#expiraTc").attr('required', true);
        $("#valorTc").attr('required', true);
        $("#vvcTc").attr('required', true);
        $("#fechaDebitoTc").attr('required', true);

        $("#tipoCta").attr('required', false);
        $("#bancoCheque").attr('required', false);
        $("#numeroRutaCheque").attr('required', false);
        $("#numeroCtaCheque").attr('required', false);
        $("#fechaDebitoBC").attr('required', false);

        $("#tipoTransferencia").attr('required', false);
        $("#nombreTransferencia").attr('required', false);
        $("#numeroReferencia").attr('required', false);
        $("#fechaDebitoTB").attr('required', false);
    } else {
        $('#tarjeta').hide();
        $('#cheque').hide();
        $('#transferencia').show();
        $("#franquiciaCT").attr('required', false);
        $("#nombretc").attr('required', false);
        $("#numeroTc").attr('required', false);
        $("#expiraTc").attr('required', false);
        $("#valorTc").attr('required', false);
        $("#vvcTc").attr('required', false);
        $("#fechaDebitoTc").attr('required', false);

        $("#tipoCta").attr('required', false);
        $("#bancoCheque").attr('required', false);
        $("#numeroRutaCheque").attr('required', false);
        $("#numeroCtaCheque").attr('required', false);
        $("#fechaDebitoBC").attr('required', false);

        $("#tipoTransferencia").attr('required', true);
        $("#nombreTransferencia").attr('required', true);
        $("#numeroReferencia").attr('required', true);
        $("#fechaDebitoTB").attr('required', true);
    }

}

async function getRole() {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + localStorage.token);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };
    const response = await fetch(urlBase + "scope", requestOptions)
    var data = await response.json();
    return data;
}