var myHeaders = new Headers();
var urlBase = window.location.origin.replace('naser', 'apinaser').replace('8080', '8000') + "/public/api/";

myHeaders.append("Accept", "application/json");
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
var urlencoded = new URLSearchParams();

var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
};

if (!localStorage.language) {
    localStorage.setItem("language", "es");
}

$("#flagLanguage").val(localStorage.language);

$('#flagLanguage').change(function() {
    localStorage.setItem("language", $(this).val());
    changeLanguage();
});

function changeLanguageDrop(language) {
    localStorage.setItem("language", language);
    changeLanguage();
}



function changeLanguage() {
    seccion = window.location.pathname.replace('.html', '').replace('/', '');
    fetch(urlBase + "idioma/" + localStorage.language + "/" + seccion, requestOptions)
        .then(resp => {
            return resp.json();
        })
        .then(data => {
            $.each(data, function(key, value) {
                if (value.attr == 'html') {
                    $('#' + value.element).html(value.label);
                } else if (value.attr == 'text') {
                    $('#' + value.element).text(value.label);
                } else if (value.attr == 'class') {
                    $(value.element).html(value.label);
                } else if (value.attr == 'for') {
                    $("[for='" + value.element + "'").html(value.label);
                } else if (value.attr == 'optionClass') {
                    $('option[class=' + value.element + ']').text(value.label);
                    $('select').selectpicker('refresh');
                } else if (value.attr == 'titleSelectPicker') {
                    $(value.element).selectpicker({ title: value.label });
                    $('select').selectpicker('refresh');
                } else if (value.attr == 'variable') {
                    eval("localStorage.setItem('" + value.element + "', '" + value.label + "')");
                    console.log("Definiendo Var : " + value.element);
                } else {
                    $('#' + value.element).attr(value.attr, value.label);
                }
            });
        })
        .catch(error => console.log('error', error));
    getMaritalStatus();
    getRelationShips();
    getRelationShipsCte();
    getPaises('#paisResidencia');
    getPaises('#paisOrigen');
    getPaises('#benPaisResidencia');
    getPaises('#benPaisOrigen');
    getPaises('#ctePais');
    getPaises('#infoPais');
    getPaises('#infoPais');

}
changeLanguage();

function getPaises($elemento) {
    var $parameters = new Array();
    $parameters['metodo'] = "getPlaceOfBirthOrCountryOfResidence";
    $parameters['attrIngles'] = "nln_countryofresidence";
    $parameters['attr2ndLanguage'] = "nln_spanish";
    if (localStorage.language == 'pt')
        $parameters['attr2ndLanguage'] = "nln_portuguese";
    $parameters['idSelect'] = $elemento;
    $parameters['indexSelected'] = $($parameters['idSelect'] + " option:selected").index()
    getOptionsCMR($parameters)
}

function getMaritalStatus() {
    var $parameters = new Array();
    $parameters['metodo'] = "getMaritalStatus";
    $parameters['attrIngles'] = "nln_maritalstatus";
    $parameters['attr2ndLanguage'] = "nln_spanish";
    if (localStorage.language == 'pt')
        $parameters['attr2ndLanguage'] = "nln_portuguese";
    $parameters['idSelect'] = "#estadoCivil";
    $parameters['indexSelected'] = $($parameters['idSelect'] + " option:selected").index()
    getOptionsCMR($parameters)
}

function getRelationShips() {
    var $parameters = new Array();
    $parameters['metodo'] = "getRelationShips";
    $parameters['attrIngles'] = "nln_relationship";
    $parameters['attr2ndLanguage'] = "nln_spanish";
    if (localStorage.language == 'pt')
        $parameters['attr2ndLanguage'] = "nln_portuguese";
    $parameters['idSelect'] = "#benParentesco";
    $parameters['indexSelected'] = $($parameters['idSelect'] + " option:selected").index()
    getOptionsCMR($parameters)
}


function getRelationShipsCte() {
    var $parameters = new Array();
    $parameters['metodo'] = "getRelationShips";
    $parameters['attrIngles'] = "nln_relationship";
    $parameters['attr2ndLanguage'] = "nln_spanish";
    if (localStorage.language == 'pt')
        $parameters['attr2ndLanguage'] = "nln_portuguese";
    $parameters['idSelect'] = "#cteParentesco";
    $parameters['indexSelected'] = $($parameters['idSelect'] + " option:selected").index()
    getOptionsCMR($parameters)
}


async function getOptionsCMR($parameters) {
    var raw = JSON.stringify({
        "metodo": $parameters['metodo'],
        "attrIngles": $parameters['attrIngles'],
        "attr2ndLanguage": $parameters['attr2ndLanguage']
    });

    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + localStorage.token);
    $($parameters['idSelect'] + " option[value!='']").remove();

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(urlBase + "options", requestOptions)
        .then(resp => {
            localStorage.setItem("codeRespondegetRelationShips", resp.status);
            return resp.json();
        })
        .then(data => {
            if (localStorage.codeResponde == 200) {

                $.each(data, function(key, value) {
                    if (localStorage.language == 'en')
                        $($parameters['idSelect']).append('<option value= "' + key + '">' + key + '</option>')
                    else
                        $($parameters['idSelect']).append('<option value= "' + value + '">' + value + '</option>')
                })
                $($parameters['idSelect'] + ' option').eq($parameters['indexSelected']).prop('selected', true);
                $($parameters['idSelect']).selectpicker('refresh')
                $($parameters['idSelect']).selectpicker('refresh')
            }

        })
        .catch(error => console.log('error', error));
}