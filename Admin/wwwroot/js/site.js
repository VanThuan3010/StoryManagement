var base = {
init: function () {
    $('#btnEditProfile').click(function () {
        $('#modalEditProfile').modal('show');
    });
    $('#btnSubmitEditProfile').click(function () {
        base.editProfile();
    });
},
//tooltip: function () {
//    const tooltipTriggerList = document.querySelectorAll(
//        '[data-bs-toggle="tooltip"]'
//    );
//    const tooltipList = [...tooltipTriggerList].map(
//        (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
//    );
//},
notification: function (type, message) {
    if (type == 'success') {
        Lobibox.notify('success', {
            pauseDelayOnHover: true,
            size: 'mini',
            rounded: true,
            icon: 'bx bx-info-circle',
            delayIndicator: false,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            msg: message
        });
    }
    else if (type == 'error') {
        Lobibox.notify('error', {
            pauseDelayOnHover: true,
            size: 'mini',
            rounded: true,
            icon: 'bx bx-x-circle',
            delayIndicator: false,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            msg: message
        });
    }
    else if (type == 'warning') {
        Lobibox.notify('warning', {
            pauseDelayOnHover: true,
            size: 'mini',
            rounded: true,
            icon: 'bx bx-error',
            delayIndicator: false,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            msg: message
        });
    }
    else {
        Lobibox.notify('default', {
            pauseDelayOnHover: true,
            size: 'mini',
            rounded: true,
            delayIndicator: false,
            continueDelayOnInactiveTab: false,
            position: 'top right',
            msg: message
        });
    }
},
convertToHTML: function (content) {
    const specialChars = {
        'à': '&agrave;',
        'á': '&aacute;',
        'ã': '&atilde;',
        'â': '&acirc;',
        'è': '&egrave;',
        'é': '&eacute;',
        'ê': '&ecirc;',
        'ì': '&igrave;',
        'í': '&iacute;',
        'ò': '&ograve;',
        'ó': '&oacute;',
        'õ': '&otilde;',
        'ô': '&ocirc;',
        'ù': '&ugrave;',
        'ú': '&uacute;',
        'À': '&Agrave;',
        'Á': '&Aacute;',
        'Ã': '&Atilde;',
        'Â': '&Acirc;',   
        'È': '&Egrave;',
        'É': '&Eacute;',
        'Ê': '&Ecirc;',
        'Ì': '&Igrave;',
        'Í': '&Iacute;',
        'Ò': '&Ograve;',
        'Ó': '&Oacute;',
        'Õ': '&Otilde;',
        'Ô': '&Ocirc;',
        'Ù': '&Ugrave;',
        'Ú': '&Uacute;',
        'ý': '&yacute;',
        'Ý': '&yacute;',
    };
    // Đảo ngược đối tượng để thay thế từ mã HTML về ký tự
    const invertedChars = Object.fromEntries(
        Object.entries(specialChars).map(([key, value]) => [value, key])
    );
    return content.replace(/&agrave;|&aacute;|&atilde;|&acirc;|&egrave;|&eacute;|&ecirc;|&igrave;|&iacute;|&ograve;|&oacute;|&otilde;|&ocirc;|&ugrave;|&uacute;|&Agrave;|&Aacute;|&Atilde;|&Acirc;|&Egrave;|&Eacute;|&Ecirc;|&Igrave;|&Iacute;|&Ograve;|&Oacute;|&Otilde;|&Ocirc;|&Ugrave;|&Uacute;|&yacute;|&Yacute;/g, (match) => {
        return invertedChars[match] || match;
    });
},
loadButton: function (name) {
    var loading = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="ms-2">' + name + '...</span>';
    return loading;
},
};
$(document).ready(function () {
    base.init();
});
function RemoveUnicode(event) {
    event.value = $(event).val().replace(/[^\x00-\x7F]/g, "");;
}
