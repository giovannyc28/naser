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
    $("div.spanner").addClass("show");
    $("div.overlay").addClass("show");
    localStorage.setItem("language", $(this).val());
    changeLanguage();

});

function changeLanguageDrop(language) {
    localStorage.setItem("language", language);
    changeLanguage();
}



function changeLanguage() {
    $("div.spanner").addClass("show");
    $("div.overlay").addClass("show");
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
            $('select').selectpicker('refresh');
            if (seccion == 'index' || seccion == 'login') {
                selectorPais = ['#paisResidencia', '#paisOrigen', '#benPaisResidencia', '#benPaisOrigen', '#ctePais', '#infoPais'];
                getMaritalStatus(['#estadoCivil']);
                getRelationShips(['#benParentesco', "#cteParentesco"]);
                getPaisesMulti(selectorPais);
                getPlanPeriodo(['#planPeriodo']);
                $('#estadoCivil, #genero, #paisResidencia, #paisOrigen, #benPaisResidencia, #benPaisOrigen, #ctePais, #cteParentesco, #infoPais').trigger('change');
            } else {
                initTable();
            }

        })
        .catch(error => console.log('error', error));

}
changeLanguage();

function getPaisesMulti(elemento) {
    var parameters = new Array();
    parameters['metodo'] = "getPlaceOfBirthOrCountryOfResidence";
    parameters['attrIngles'] = "nln_countryofresidence";
    parameters['attr2ndLanguage'] = "nln_spanish";
    parameters['finaliza'] = true;
    if (localStorage.language == 'pt')
        parameters['attr2ndLanguage'] = "nln_portuguese";
    parameters['idSelect'] = elemento
    indicesSelected = new Array();
    $.each(elemento, function(key, value) {
        indicesSelected[value] = $(value + " option:selected").val();
    })
    parameters['indexSelected'] = indicesSelected;
    console.log(parameters);
    getOptionsCMR(parameters)
}

function getMaritalStatus(elemento) {
    var parameters = new Array();
    parameters['metodo'] = "getMaritalStatus";
    parameters['attrIngles'] = "nln_maritalstatus";
    parameters['attr2ndLanguage'] = "nln_spanish";
    parameters['finaliza'] = false;
    if (localStorage.language == 'pt')
        $parameters['attr2ndLanguage'] = "nln_portuguese";
    parameters['idSelect'] = elemento
    indicesSelected = new Array();
    $.each(elemento, function(key, value) {
        indicesSelected[value] = $(value + " option:selected").val();
    })
    parameters['indexSelected'] = indicesSelected;
    console.log(parameters);
    getOptionsCMR(parameters)
}

function getRelationShips(elemento) {
    var parameters = new Array();
    parameters['metodo'] = "getRelationShips";
    parameters['attrIngles'] = "nln_relationship";
    parameters['attr2ndLanguage'] = "nln_spanish";
    parameters['finaliza'] = false;
    if (localStorage.language == 'pt')
        $parameters['attr2ndLanguage'] = "nln_portuguese";
    parameters['idSelect'] = elemento
    indicesSelected = new Array();
    $.each(elemento, function(key, value) {
        indicesSelected[value] = $(value + " option:selected").val();
    })
    parameters['indexSelected'] = indicesSelected;
    console.log(parameters);
    getOptionsCMR(parameters)
}

function getPlanPeriodo(elemento) {
    var parameters = new Array();
    parameters['metodo'] = "getPaymentTerms";
    parameters['attrIngles'] = "nln_name";
    parameters['attr2ndLanguage'] = "nln_spanish";
    parameters['finaliza'] = false;
    if (localStorage.language == 'pt')
        $parameters['attr2ndLanguage'] = "nln_portuguese";
    parameters['idSelect'] = elemento
    indicesSelected = new Array();
    $.each(elemento, function(key, value) {
        indicesSelected[value] = $(value + " option:selected").val();
    })
    parameters['indexSelected'] = indicesSelected;
    console.log(parameters);
    getOptionsCMR(parameters)
}

function getOptionsCMR(parameters) {
    var raw = JSON.stringify({
        "metodo": parameters['metodo'],
        "attrIngles": parameters['attrIngles'],
        "attr2ndLanguage": parameters['attr2ndLanguage']
    });

    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + localStorage.token);


    $.each($(parameters['idSelect']), function(key, value) {
        $(value + " option[value!='']").remove();
    })

    if (eval('localStorage.' + parameters['metodo'])) {
        $("div.spanner").addClass("show");
        $("div.overlay").addClass("show");
        $.each($(parameters['idSelect']), function(llave, idElemento) {
            $.each(JSON.parse(eval('localStorage.' + parameters['metodo'])), function(key, value) {
                if (localStorage.language == 'en')
                    $(idElemento).append('<option value= "' + key + '">' + key + '</option>')
                else
                    $(idElemento).append('<option value= "' + key + '">' + value + '</option>')
            })

            $(idElemento).val(parameters['indexSelected'][idElemento]);
            $(idElemento).selectpicker('refresh')
            $(idElemento).selectpicker('refresh')
        })

        $("div.spanner").removeClass("show");
        $("div.overlay").removeClass("show");

    } else {

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
                if (localStorage.codeRespondegetRelationShips == 200) {
                    localStorage.setItem(parameters['metodo'], JSON.stringify(data));
                    $.each($(parameters['idSelect']), function(llave, idElemento) {
                        $.each(data, function(key, value) {
                            if (localStorage.language == 'en')
                                $(idElemento).append('<option value= "' + key + '">' + key + '</option>')
                            else
                                $(idElemento).append('<option value= "' + key + '">' + value + '</option>')
                        })
                        $(idElemento).val(parameters['indexSelected'][idElemento]);
                        $(idElemento).selectpicker('refresh')
                        $(idElemento).selectpicker('refresh')
                    })
                    if (parameters['finaliza']) {
                        $("div.spanner").removeClass("show");
                        $("div.overlay").removeClass("show");
                    }
                }

            })
            .catch(error => console.log('error', error));
    }
}