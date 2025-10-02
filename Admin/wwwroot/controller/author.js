$(function () {
    window.author = {
        init: function () {
            author.action();
            author.tblAuthor();
            $('#btnCreate').on('click', function () {
                $('#txtIdModal').val(0);
                $('#txtName').val('');
                $('#txtPseudonym').val('');
                $('#txtStyle').val('');
                $('#pseudonymList ul.tags').empty();
                $('#labelAction').text('Thêm mới tác giả');

                $('#modalCreateOrEdit').modal('show');
            });
            $('#btnAddPseudonym').on('click', function () {
                if ($.trim($('#txtPseudonym').val()) === '') {
                    base.notification('error', 'Vui lòng nhập bút danh!');
                    return;
                }
                author.addPseudonym();
                $('#txtPseudonym').val("");
                $('#txtPseudonym').focus();
            });
            $('#txtPseudonym').on('keypress', function (e) {
                if (e.which === 13) {
                    e.preventDefault();
                    if ($.trim($('#txtPseudonym').val()) === '') {
                        base.notification('error', 'Vui lòng nhập bút danh!');
                        return;
                    }
                    author.addPseudonym();
                    $('#txtPseudonym').val("");
                    $('#txtPseudonym').focus();
                }
            });
            $('#pseudonymList').on('click', '.remove-tag', function (e) {
                e.preventDefault();
                $(this).closest('li').remove();
            });
        },
        action: function () {
            $('#btnSearch').on('click', function () {
                author.tblAuthor();
            });
            $('#btnSubmit').click(function () {
                var pseus = [];

                $('#pseudonymList .tag').each(function () {
                    var id = $(this).data('id');
                    var pseudonym = $(this).data('pseudonym');
                    pseus.push({
                        id: id,
                        pseudonym: pseudonym
                    });
                });
                if (pseus.length <= 0) {
                    base.notification('error', 'Vui lòng nhập ít nhất một bút danh của tác giả!');
                    $('#txtPseudonym').focus();
                    return;
                }
                var datas = new FormData();
                datas.append('Id', $('#txtIdModal').val());
                datas.append('Name', $('#txtName').val());
                datas.append('Pseudonym', JSON.stringify(pseus));
                datas.append('Style', $('#txtStyle').val());
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
        addPseudonym: function() {
            var value = $.trim($('#txtPseudonym').val());
            if (value !== '') {
                var li = '<li><a href="#" data-id="0" data-pseudonym="' + value + '" class="tag">' + value + '<span class="remove-tag">&times;</span></a></li>';
                $('#pseudonymList ul.tags').append(li);
                $('#txtPseudonym').val('');
            }
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
                        field: "style",
                        title: "Phong cách viết",
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
    author.init();
});