$(function () {
    window.Comic = {
        init: function () {
            Comic.action();
            Comic.tblComic();
            $('#btnCreate').on('click', function () {
                $('#txtIdModal').val(0);
                $('#txtName').val('');
                $('#txtDescription').val('');
                $('#txtOrder').val($('#svNumberOrder').val() + 1);
                $('#labelAction').text('Thêm mới tập');

                $('#modalCreateOrEdit').modal('show');
            });
        },
        action: function () {
            $('#modalCreateOrEdit').on('hidden.bs.modal', function () {
                $('#sources').val(null).trigger('change');
            });
            $('#sources').select2({
                dropdownParent: $('#modalCreateOrEdit'),
                placeholder: "Nhập tên truyện...",
                minimumInputLength: 2,
                ajax: {
                    url: '/Comic/SearchStory',
                    dataType: 'json',
                    delay: 300,
                    data: function (params) {
                        return {
                            keyword: params.term
                        };
                    },
                    processResults: function (data) {
                        return {
                            results: data
                        };
                    }
                }
            });
            $('#btnSubmit').click(function () {
                var datas = new FormData();
                datas.append('Id', $('#txtIdModal').val());
                datas.append('Name', $('#txtName').val());
                datas.append('Description', $('#txtDescription').val());
                datas.append('Order', $('#txtOrder').val());
                $.ajax({
                    url: '/Comic/CreateOrUpdateEpisode',
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
                            $("#tblStory").bootstrapTable('refresh');
                            $('#modalCreateOrEdit').modal('hide');
                        } else {
                            base.notification('error', res.message);
                        }
                    }
                })
            });
        },
        toggleDeleteButton: function () {
            var rows = $('#tblComic').bootstrapTable('getSelections');
            $('#btnDelete').prop('disabled', rows.length === 0);
        },
        tblComic: function () {
            var objTable = $("#tblComic");
            objTable.bootstrapTable('destroy');
            objTable.bootstrapTable({
                method: 'get',
                url: '/Comic/GetComic',
                queryParams: function (p) {
                    var param = $.extend(true, {
                        search: "",
                        limit: p.limit,
                        offset: p.offset
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
                paginationVAlign: 'both',
                search: false,
                pageSize: 50,
                pageList: [50, 100],
                reorderableRows: true,
                useRowAttrFunc: true,
                columns: [
                    {
                        field: "chapterName",
                        title: "Tên",
                        align: 'left',
                        valign: 'left',
                    },
                    {
                        title: "Chức năng",
                        valign: 'middle',
                        align: 'center',
                        class: 'CssAction',
                        formatter: function (value, row, index) {
                            var action = "<div style='width: 200px;'>";
                            action += '<a href="javascript:void(0)" class="btn btn-primary btn-sm btnEdit"><i class="fas fa-pen"></i></a>';
                            action += '<a href="javascript:void(0)" class="btn btn-danger btn-sm btnDelete ms-1"><i class="fas fa-times"></i></a>';
                            action += '</div>';
                            return action;
                        },
                        events: {
                            'click .btnDelete': function (e, value, row, index) {
                                $.confirm({
                                    title: 'Cảnh báo!',
                                    content: 'Bạn chắc chắn muốn xóa?',
                                    buttons: {
                                        formSubmit: {
                                            text: 'Xác nhận',
                                            btnClass: 'btn btn-primary',
                                            action: function () {
                                                $.ajax({
                                                    url: '/Comic/DeleteEpisode',
                                                    type: 'post',
                                                    data: {
                                                        id: row.chapterId,
                                                    },
                                                    success: function (res) {
                                                        if (res.status) {
                                                            base.notification('success', res.message);
                                                            $("#tblEpisode").bootstrapTable('refresh', { silent: true });
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
    Comic.init();
});