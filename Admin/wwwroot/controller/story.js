$(function () {
    window.story = {
        init: function () {
            story.action();
            story.tblStory();
            $('#sltTag').select2();
            $('#sltAuthor').select2();
            $('#btnCreate').on('click', function () {
                $("#sltFormTag").select2().val(null).trigger("change");
                $("#sltFormAuthor").select2().val(null).trigger("change");

                $('#txtIdModal').val(0);
                $('#txtName').val('');
                $('#txtNumberChapter').val('');
                $('#sltFormTag').select2();
                story.initSelect2_Authors();
                /*$('#sltFormAuthor').select2();*/
                $('#labelAction').text('Thêm mới truyện');

                $('#modalCreateOrEdit').modal('show');
            });
        },

        action: function () {
            $('#btnSearch').on('click', function () {
                story.tblStory();
            });
            $('#btnSubmit').click(function () {
                var datas = new FormData();
                datas.append('Id', $('#txtIdModal').val());
                datas.append('Name', $('#txtName').val());
                datas.append('NumberChapter', $('#txtNumberChapter').val());
                datas.append('Status', $('#idStatus').val());
                datas.append('IsRead', $('#ckRead').is(':checked'));
                /*datas.append('AuthorId', $('#sltFormAuthor').val().join(','));*/
                datas.append('AuthorId', "");
                datas.append('TagId', $('#sltFormTag').val().join(','));
                $.ajax({
                    url: '/Story/CreateOrUpdate',
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

                            $("#sltFormTag").select2().val(null).trigger("change");
                            $("#sltFormAuthor").select2().val(null).trigger("change");
                            $('#txtIdModal').val(0);
                            $('#txtName').val('');
                            $('#txtNumberChapter').val('');
                            $('#idStatus').val(1).change();
                        } else {
                            base.notification('error', res.message);
                        }
                    }
                })
            });
        },
        initSelect2_Authors: function (existingAuthors = []) {
            existingAuthors = existingAuthors || [];

            $('#sltFormAuthor').select2({
                placeholder: 'Tìm kiếm tác giả...',
                minimumInputLength: 2, // Chỉ tìm kiếm khi người dùng nhập ít nhất 2 ký tự
                allowClear: true, // Cho phép xóa tác giả đã chọn
                ajax: {
                    url: '/Author/GetAuthor', // URL tới API tìm kiếm tác giả
                    dataType: 'json',
                    delay: 250, // Thời gian chờ giữa các lần tìm kiếm
                    data: function (params) {
                        return {
                            search: params.term, // Từ khóa tìm kiếm
                            offset: 0, // Phân trang nếu cần
                            limit: 10
                        };
                    },
                    processResults: function (data) {
                        return {
                            results: $.map(data.items, function (item) {
                                return {
                                    id: item.id,
                                    text: item.pseudonym
                                };
                            })
                        };
                    },
                    cache: true
                }
            });

            if (existingAuthors.length > 0) {
                existingAuthors.forEach(function (author) {
                    let existingData = $('#sltFormAuthor').select2('data');
                    existingAuthors.forEach(function (author) {
                        if (!existingData.some(e => e.id == author.id)) {
                            var option = new Option(author.pseudonym, author.id, true, true);
                            $('#sltFormAuthor').append(option);
                        }
                    });
                    $('#sltFormAuthor').trigger('change');
                });
            }
        },
        tblStory: function () {
            var objTable = $("#tblStory");
            objTable.bootstrapTable('destroy');
            objTable.bootstrapTable({
                method: 'get',
                url: '/Story/GetStory',
                queryParams: function (p) {
                    var param = $.extend(true, {
                        limit: p.limit,
                        offset: p.offset,
                        search: $('#txtSearch').val(),
                        tags: $('#sltTag').val(),
                        authors: $('#sltAuthor').val(),
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
                pageList: [100, 150],

                columns: [
                    {
                        field: "name",
                        title: "Tên",
                        align: 'center',
                        valign: 'left',
                    },
                    {
                        field: "numberChapter",
                        title: "Số chương",
                        align: 'left',
                        valign: 'left',
                    },
                    {
                        field: "isRead",
                        title: "Đọc",
                        align: 'center',
                        valign: 'center',
                        formatter: function (value, row, index) {
                            var html = '';
                            if (row.isRead == true) {
                                html = '<input class="form-check-input btnRead" type="checkbox" checked title="Đánh dấu là chưa đọc" />';
                            } else {
                                html = '<input class="form-check-input btnRead" type="checkbox" title="Đánh dấu là đã đọc" />';
                            }
                            return html;

                        },
                        events: {
                            'click .btnRead': function (e, value, row, index) {
                                $.ajax({
                                    url: '/Story/CheckRead',
                                    type: 'post',
                                    data: {
                                        id: row.id
                                    },
                                    success: function (res) {
                                        if (res.status) {
                                            base.notification('success', res.message);
                                            $("#tblStory").bootstrapTable('refresh', { silent: true });
                                        }
                                        else {
                                            base.notification('error', res.message);
                                        }
                                    }
                                });
                            },
                        }
                    },
                    {
                        title: "Chức năng",
                        valign: 'middle',
                        align: 'center',
                        class: 'CssAction',
                        formatter: function (value, row, index) {
                            var action = "<div style='width: 200px;'>";
                            action += '<a href="javascript:void(0)" title="Sửa" class="btn btn-primary btn-sm btnEdit"><i class="fas fa-pen"></i></a>';
                            action += '<a href="javascript:void(0)" title="Xóa" class="btn btn-danger btn-sm btnDelete ms-1"><i class="fas fa-times"></i></a>';
                            action += '<a href="/Review/Index?idStory=' + row.id + '" title="Cập nhật" class="btn btn-success btn-sm btnReview ms-1"><i class="fa fa-user-check"></i></a>';
                            action += '<a href="/Chapter/index?idStory=' + row.id + '" title="Chương" class="btn btn-secondary btn-sm btnReview ms-1"><i class="fa fa-book"></i></a>';
                            action += '</div>';
                            return action;
                        },
                        events: {
                            'click .btnDelete': function (e, value, row, index) {
                                $.confirm({
                                    title: 'Cảnh báo!',
                                    content: 'Bạn chắc chắn muốn xóa truyện?',
                                    buttons: {
                                        formSubmit: {
                                            text: 'Xác nhận',
                                            btnClass: 'btn btn-primary',
                                            action: function () {
                                                $.ajax({
                                                    url: '/Story/Delete',
                                                    type: 'post',
                                                    data: {
                                                        id: row.id,
                                                    },
                                                    success: function (res) {
                                                        if (res.status) {
                                                            base.notification('success', res.message);
                                                            $("#tblStory").bootstrapTable('refresh', { silent: true });
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
                                $('#txtNumberChapter').val(row.numberChapter);
                                $('#sltFormTag').select2().val(row.tagId ? row.tagId.split(",") : null).trigger('change');
                                if (row.authorId == null) {
                                    story.initSelect2_Authors();
                                } else {
                                    $.ajax({
                                        url: '/Story/GetAuthorByStory',
                                        type: 'get',
                                        processData: false,
                                        contentType: false,
                                        data: {
                                            id: row.id
                                        },
                                        success: function (res) {
                                            story.initSelect2_Authors(res.data);
                                        }
                                    })
                                }
                                /*$('#sltFormAuthor').select2().val(row.authorId == null ? null : row.authorId.split(",")).trigger('change');*/
                                $('#labelAction').text('Sửa truyện');

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
    story.init();
});