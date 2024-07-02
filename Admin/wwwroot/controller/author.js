$(function () {
    window.author = {
        init: function () {
            author.action();
            author.tblAuthor();
            $('#btnCreate').on('click', function () {
                $('#txtIdModal').val(0);
                $('#txtName').val('');
                $('#txtPseudonym').val('');
                $('#labelAction').text('Thêm mới tác giả');

                $('#modalCreateOrEdit').modal('show');
            });
        },

        action: function () {
            $('#btnSearch').on('click', function () {
                author.tblAuthor();
            });
            $('#btnSubmit').click(function () {
                var datas = new FormData();
                datas.append('Id', $('#txtIdModal').val());
                datas.append('Name', $('#txtName').val());
                datas.append('Pseudonym', $('#txtPseudonym').val());
                debugger
                $.ajax({
                    url: '/Author/CreateOrUpdate',
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
                            $("#tblAuthor").bootstrapTable('refresh');
                            $('#modalCreateOrEdit').modal('hide');

                            $('#txtName').val('');
                            $('#txtPseudonym').val('');
                        } else {
                            base.notification('error', res.message);
                        }
                    }
                })
            });
        },
        tblAuthor: function () {
            var objTable = $("#tblAuthor");
            objTable.bootstrapTable('destroy');
            objTable.bootstrapTable({
                method: 'get',
                url: '/Author/GetAuthor',
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
                        field: "pseudonym",
                        title: "Bút danh",
                        align: 'left',
                        valign: 'left',
                    },
                    {
                        field: "name",
                        title: "Tên",
                        align: 'center',
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
                                    content: 'Bạn chắc chắn muốn xóa tác giả?',
                                    buttons: {
                                        formSubmit: {
                                            text: 'Xác nhận',
                                            btnClass: 'btn btn-primary',
                                            action: function () {
                                                $.ajax({
                                                    url: '/Author/Delete',
                                                    type: 'post',
                                                    data: {
                                                        id: row.id,
                                                    },
                                                    success: function (res) {
                                                        if (res.status) {
                                                            base.notification('success', res.message);
                                                            $("#tblAuthor").bootstrapTable('refresh', { silent: true });
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
                                $('#txtPseudonym').val(row.pseudonym);
                                $('#labelAction').text('Sửa tác giả');

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
    author.init();
});