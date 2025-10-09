$(function () {
    window.series = {
        init: function () {
            author.action();
            series.tblSeries();
            $('#btnCreate').on('click', function () {
                $('#txtIdModal').val(0);
                $('#txtName').val('');
                $('#txtPseudonym').val('');
                $('#txtStyle').val('');
                $('#pseudonymList ul.tags').empty();
                $('#labelAction').text('Thêm mới tác giả');

                $('#modalCreateOrEdit').modal('show');
            });
        },
        action: function () {
            
        },
        tblSeries: function () {
            var objTable = $("#tblAuthor");
            objTable.bootstrapTable('destroy');
            objTable.bootstrapTable({
                method: 'get',
                url: '/Series/GetSeries',
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
                pageSize: 100,
                pageList: [100],

                columns: [
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
                                $('#txtPseudonym').val("");
                                $('#pseudonymList ul.tags').empty();
                                $.ajax({
                                    url: '/Pseu/GetPseu',
                                    data: {
                                        id: row.id,
                                        type: 'Author'
                                    },
                                    success: function (res) {
                                        if (res && res.length > 0) {
                                            $.each(res, function (i, item) {
                                                var li = '<li><a href="#" class="tag" data-id="' + item.id + '" data-pseudonym="' + item.pseudonym + '">'
                                                    + item.pseudonym
                                                    + '<span class="remove-tag">&times;</span></a></li>';
                                                $('#pseudonymList ul.tags').append(li);
                                            });
                                        }
                                    }
                                });
                                $('#labelAction').text('Sửa thông tin tác giả');

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
    series.init();
});