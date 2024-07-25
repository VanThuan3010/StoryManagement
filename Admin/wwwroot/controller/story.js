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
                $('#sltFormAuthor').select2();
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
                datas.append('AuthorId', $('#sltFormAuthor').val().join(','));
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
                pageSize: 10,
                pageList: [10, 50, 100],

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
                        align: 'left',
                        valign: 'left',
                        formatter: function (value, row, index) {
                            var html = '';
                            if (row.isRead == true) {
                                html += '<input type="checkbox" disabled checked/>';
                            } else {
                                html += '<input type="checkbox" disabled/>';
                            }
                            return html;

                        },
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
                            action += '<a href="/Review/Index?idStory=' + row.id + '" class="btn btn-success btn-sm btnReview ms-1"><i class="fa fa-user-check"></i></a>';
                            action += '<a href="/Chapter/index?idStory=' + row.id + '" class="btn btn-secondary btn-sm btnReview ms-1"><i class="fa fa-book"></i></a>';
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
                                $('#sltFormTag').select2().val(row.tagId == null ? null : row.tagId.split(",")).trigger('change');
                                $('#sltFormAuthor').select2().val(row.authorId == null ? null : row.authorId.split(",")).trigger('change');
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