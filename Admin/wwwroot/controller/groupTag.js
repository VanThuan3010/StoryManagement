$(function () {
    window.GroupTag = {
        init: function () {
            GroupTag.action();
            GroupTag.tblTag();
            $('#btnCreate').on('click', function () {
                $('#txtIdModal').val(0);
                $('#txtName').val('');
                $('#txtDefinition').val('');
                $('#ckMulti').prop('checked', false);
                GroupTag.init_Tag(0);
                GroupTag.init_SubTag(0);
                $('#labelAction').text('Thêm mới nhóm thẻ');
                $('#modalCreateOrEdit').modal('show');
            });
        },

        action: function () {
            $('#btnSearch').on('click', function () {
                GroupTag.tblTag();
            });
            $('#btnSubmit').click(function () {
                var datas = new FormData();
                datas.append('Id', $('#txtIdModal').val());
                datas.append('Name', $('#txtName').val());
                datas.append('Definition', $('#txtDefinition').val());
                datas.append('MultiSelect', $('#ckMulti').is(':checked'));
                datas.append('lstTag', $('#slTag').val().join(','));
                datas.append('lstSubTag', $('#slSubTag').val().join(','));
                $.ajax({
                    url: '/GroupTag/CreateOrUpdate',
                    type: 'post',
                    processData: false,
                    contentType: false,
                    data: datas,
                    beforeSend: function () {
                        $('#btnSubmit').prop('disabled', true);
                        $('#btnSubmit').html(base.loadButton("Lưu"));
                    },
                    success: function (res) {
                        $('#btnSubmit').prop('disabled', false);
                        $('#btnSubmit').html("Lưu");
                        if (res.status) {
                            base.notification('success', res.message);
                            $("#tblTag").bootstrapTable('refresh');
                            $('#modalCreateOrEdit').modal('hide');

                            $('#txtName').val('');
                            $('#txtDefinition').val('');
                        } else {
                            base.notification('error', res.message);
                        }
                    }
                })
            });
        },
        init_Tag: function (Id) {
            $("#slTag").select2({
                placeholder: "Chọn thẻ...",
                minimumInputLength: 2,
                ajax: {
                    url: "/GroupTag/SearchTag",
                    dataType: "json",
                    delay: 250,
                    data: function (params) {
                        return {
                            searchString: params.term,
                            selected: $("#slTag").val().join(',')
                        };
                    },
                    processResults: function (data) {
                        return {
                            results: $.map(data, function (item) {
                                return {
                                    id: item.id,
                                    text: item.name
                                }
                            })
                        };
                    },
                    cache: true
                }
            });

            $.ajax({
                url: "/Tag/GetTagToCRUD",
                data: {
                    id: Id,
                    forType: 'Group'
                },
                success: function (data) {
                    $("#slTag").empty().trigger("change");
                    (data.rows || []).forEach(function (item) {
                        var option = new Option(item.name, item.id, true, true);
                        $("#slTag").append(option);
                    });
                    $("#slTag").trigger("change");
                }
            });
        },
        init_SubTag: function (Id) {
            $("#slSubTag").select2({
                placeholder: "Chọn thẻ phụ...",
                minimumInputLength: 2,
                ajax: {
                    url: "/GroupTag/SearchSubTag",
                    dataType: "json",
                    delay: 250,
                    data: function (params) {
                        return {
                            searchString: params.term,
                            selected: $("#slSubTag").val().join(',')
                        };
                    },
                    processResults: function (data) {
                        return {
                            results: $.map(data, function (item) {
                                return {
                                    id: item.id,
                                    text: item.name
                                }
                            })
                        };
                    },
                    cache: true
                }
            });

            $.ajax({
                url: "/SubTag/GetSubTagToCRUD",
                data: {
                    id: Id,
                    forType: 'Group'
                },
                success: function (data) {
                    $("#slSubTag").empty().trigger("change");
                    (data.rows || []).forEach(function (item) {
                        var option = new Option(item.name, item.id, true, true);
                        $("#slSubTag").append(option);
                    });
                    $("#slSubTag").trigger("change");
                }
            });
        },
        tblTag: function () {
            var objTable = $("#tblTag");
            objTable.bootstrapTable('destroy');
            objTable.bootstrapTable({
                method: 'get',
                url: '/GroupTag/GetGroupTag',
                queryParams: function (p) {
                    var param = $.extend(true, {
                        limit: p.limit,
                        offset: p.offset,
                        search: $('#txtSearch').val(),
                    }, p);
                    return param;
                },
                formatLoadingMessage: function () {
                    return 'Đang tải dữ liệu...';
                },
                formatNoMatches: function () {
                    return 'Không có dữ liệu';
                },
                striped: true,
                sidePagination: 'server',
                pagination: true,
                paginationVAlign: 'bottom',
                search: false,
                pageSize: 10,
                pageList: [10, 50, 100],

                columns: [
                    {
                        field: "name",
                        title: "Tên",
                        align: 'left',
                        valign: 'left',
                    },
                    {
                        field: "definition",
                        title: "Định nghĩa",
                        align: 'left',
                        valign: 'left',
                    },
                    {
                        title: "Chức năng",
                        valign: 'middle',
                        align: 'center',
                        class: 'CssAction',
                        formatter: function (value, row, index) {
                            var action = "<div style='width: 100px;'>";
                            action += '<a href="javascript:void(0)" class="btn btn-primary btn-sm btnEdit"><i class="fas fa-pen"></i></a>';
                            action += '<a href="javascript:void(0)" class="btn btn-danger btn-sm btnDelete ms-1"><i class="fas fa-times"></i></a>';
                            return action;
                        },
                        events: {
                            'click .btnDelete': function (e, value, row, index) {
                                $.confirm({
                                    title: 'Cảnh báo!',
                                    content: 'Bạn chắc chắn muốn xóa thẻ?',
                                    buttons: {
                                        formSubmit: {
                                            text: 'Xác nhận',
                                            btnClass: 'btn btn-primary',
                                            action: function () {
                                                $.ajax({
                                                    url: '/GroupTag/Delete',
                                                    type: 'post',
                                                    data: {
                                                        id: row.id
                                                    },
                                                    success: function (res) {
                                                        if (res.status) {
                                                            base.notification('success', res.message);
                                                            $("#tblTag").bootstrapTable('refresh', { silent: true });
                                                        }
                                                        else {
                                                            base.notification('error', res.message);
                                                        }
                                                    }
                                                });
                                            }
                                        },
                                        cancel: {
                                            text: 'Đóng',
                                            btnClass: 'btn btn-danger'
                                        },
                                    }
                                });
                            },
                            'click .btnEdit': function (e, value, row, index) {
                                $('#txtIdModal').val(row.id);
                                $('#txtName').val(row.name);
                                $('#txtDefinition').val(row.definition);
                                if (row.multiSelect) {
                                    $('#ckMulti').prop('checked', true);
                                } else {
                                    $('#ckMulti').prop('checked', false);
                                }
                                GroupTag.init_Tag(row.id);
                                GroupTag.init_SubTag(row.id);
                                $('#labelAction').text('Sửa thẻ');

                                $('#modalCreateOrEdit').modal('show');
                            },
                        }
                    }
                ],
                onLoadSuccess: function (data) {

                },
            })
        },
    }
});
$(document).ready(function () {
    GroupTag.init();
});