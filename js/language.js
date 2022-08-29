var myHeaders = new Headers();
if (window.location.origin == "http://naser.local:8080")
    var urlBase = "http://apinaser.local:8000/public/api/"
else
    var urlBase = window.location.origin.replace('portal.', 'api.').replace('8080', '8000') + "/public/api/";
//var urlBase = 'https://api.naserglobal.com'+"/public/api/";
myHeaders.append("Accept", "application/json");
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
//myHeaders.append('Origin','https://api.naserglobal.com');
//myHeaders.append('Access-Control-Allow-Origin', 'https://api.naserglobal.com');
//myHeaders.append('Access-Control-Allow-Credentials', 'true');

var urlencoded = new URLSearchParams();

var requestOptions = {
    //mode: 'cors',
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow',
};

if (!localStorage.language) {
    localStorage.setItem("language", "es");
}

$(function() {


});

function updateCalendar(idElemet) {
    $('#' + idElemet).data().datepicker.o.language = localStorage.language;
    $('#' + idElemet).datepicker('update');
    $('#' + idElemet).data().datepicker.picker.find('tr:nth(2)').remove(); // Remove DOW row
    $('#' + idElemet).datepicker('fillDow'); // Regenerate DOW row 
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
            if ($("#table").length && (seccion != 'index' || seccion != 'login')) {
                initTable();
            }
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
                } else if (value.attr == 'titleSelectPicker') {
                    $(value.element).selectpicker({ title: value.label });
                } else if (value.attr == 'variable') {
                    eval("localStorage.setItem('" + value.element + "', '" + value.label + "')");
                } else {
                    $('#' + value.element).attr(value.attr, value.label);
                }
            });

            $('select').selectpicker('refresh');
            if (seccion == 'index' || seccion == 'login') {
                selectorPais = ['#paisResidencia', '#paisOrigen', '#benPaisResidencia', '#benPaisOrigen', '#ctePais', '#infoPais'];
                getPaisesMulti(selectorPais);
                getMaritalStatus(['#estadoCivil']);
                getRelationShips(['#benParentesco', "#cteParentesco"]);
                getPlanPeriodo(['#planPeriodo']);
                $('#estadoCivil, #genero, #paisResidencia, #paisOrigen, #benPaisResidencia, #benPaisOrigen, #ctePais, #cteParentesco, #infoPais').trigger('change');
                if (seccion == 'index') {
                    for (let key in arrayBeneficiarios) {
                        relation = arrayBeneficiarios[key]['0'];
                        relationShips = JSON.parse(eval('localStorage.' + 'getRelationShips'));
                        if (localStorage.language == 'en')
                            arrayBeneficiarios[key]['10'] = relation
                        else
                            arrayBeneficiarios[key]['10'] = eval('relationShips.' + relation)
                        index = key.replace(/\'/g, "");
                        $("#trBen_" + index + " td:first").html(arrayBeneficiarios[key]['10']);
                    }
                }
                if (seccion != 'login' || seccion != 'contratos') {
                    updateCalendar('fechaNacimiento');
                    updateCalendar('fechaDebitoTc');
                    updateCalendar('fechaDebitoTB');
                    updateCalendar('fechaDebitoBC');
                    updateCalendar('expiraTc');
                    updateCalendar('benFechaNacimiento');
                }

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
            data = JSON.parse(eval('localStorage.' + parameters['metodo']));

            if (localStorage.language == 'en') {
                data = Object.keys(data).sort().reduce((a, c) => (a[c] = data[c], a), {});
                console.log(data)
            }

            if (localStorage.language == 'es') {
                dataSortValue = sortByValue(data);
                dataSort = [];
                for (let key in dataSortValue) { dataSort.push([dataSortValue[key][1], dataSortValue[key][0]]) }
                data = Object.fromEntries(dataSort);

            }

            localStorage.setItem(parameters['metodo'], JSON.stringify(data));

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
                localStorage.setItem('codeResponde' + parameters['metodo'], resp.status);
                return resp.json();
            })
            .then(data => {
                if (JSON.parse(eval('localStorage.' + 'codeResponde' + parameters['metodo'])) == 200) {
                    data = Object.keys(data).sort().reduce((a, c) => (a[c] = data[c], a), {});
                    localStorage.setItem(parameters['metodo'], JSON.stringify(data));

                    $.each($(parameters['idSelect']), function(llave, idElemento) {
                        //if (localStorage.language == 'en')
                        //Object.keys(data).sort().reduce((a, c) => (a[c] = data[c], a), {});
                        if (localStorage.language == 'es') {
                            dataSortValue = sortByValue(data);
                            dataSort = [];
                            for (let key in dataSortValue) { dataSort.push([dataSortValue[key][1], dataSortValue[key][0]]) }
                            data = Object.fromEntries(dataSort);
                            localStorage.setItem(parameters['metodo'], JSON.stringify(data));
                        }

                        $.each(data, function(key, value) {
                            console.log(key)
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

function sortByValue(jsObj) {
    var sortedArray = [];
    for (var i in jsObj) {
        // Push each JSON Object entry in array by [value, key]
        sortedArray.push([jsObj[i], i]);
    }
    return sortedArray.sort();
}   