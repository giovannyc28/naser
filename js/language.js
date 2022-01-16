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

$('#flagLanguage').change(function() {
    localStorage.setItem("language", $(this).val());
    changeLanguage();
});

function changeLanguage() {
    seccion = window.location.pathname.replace('.html', '').replace('/', '');
    fetch(urlBase + "idioma/" + localStorage.language + "/" + seccion, requestOptions)
        .then(resp => {
            return resp.json();
        })
        .then(data => {
            console.log(data);
            $.each(data, function(key, value) {
                console.log(value);
                if (value.attr == 'html')
                    $('#' + value.element).html(value.label);
                else if (value.attr == 'for')
                    $("[for='" + value.element + "'").html(value.label);
                else
                    $('#' + value.element).attr(value.attr, value.label);
            });
        })
        .catch(error => console.log('error', error));
}
changeLanguage();