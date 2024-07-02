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