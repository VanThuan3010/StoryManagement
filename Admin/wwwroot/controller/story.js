$(function () {
    window.story = {
        init: function () {
            story.action();
            story.tblStory();
            $('#sltTag').select2();
            $('#sltAuthor').select2();
            $('#btnCreate').on('click', function () {
                $('#txtIdModal').val(0);
                $('#txtName').val('');
                $('#txtNumberChapter').val('');
                story.init_Tag(0);
                story.init_SubTag(0);
                story.init_Author(0);
                $('#sources').val('SacHiepVien');
                $('#labelAction').text('Thêm mới truyện');

                $('#modalCreateOrEdit').modal('show');
            });
            story.init_searchTag();
            //$("#txtImage").on("change", function () {
            //    const file = this.files[0];
            //    if (file) {
            //        const reader = new FileReader();
            //        reader.onload = function (e) {
            //            $("#previewImage").attr("src", e.target.result).show();
            //        }
            //        reader.readAsDataURL(file);
            //    } else {
            //        $("#previewImage").hide().attr("src", "#");
            //    }
            //});
        },
        action: function () {
            $('#chk').data('checked', 2).click(function (e) {
                el = $(this);
                switch (el.data('checked')) {
                    case 0:
                        el.val('Read');
                        el.data('checked', 1);
                        el.prop('indeterminate', true);
                        $('#lblStt').text("Đã đọc");
                        break;
                    case 1:
                        el.val('Pending');
                        el.data('checked', 2);
                        el.prop('indeterminate', false);
                        el.prop('checked', true);
                        $('#lblStt').text("Chưa đọc");
                        break;
                    default:
                        el.val('All');
                        el.data('checked', 0);
                        el.prop('indeterminate', false);
                        el.prop('checked', false);
                        $('#lblStt').text("Tất cả");
                }
            });
            $('#btnSearch').on('click', function () {
                story.tblStory();
            });
            $('#btnSubmit').click(function () {
                var datas = new FormData();
                datas.append('Id', $('#txtIdModal').val());
                datas.append('Name', $('#txtName').val());
                datas.append('NumberChapter', $('#txtNumberChapter').val());
                datas.append('Source', $('#sources').val());
                datas.append('IsRead', 0);
                datas.append('AuthorId', $('#sltFormAuthor').val().join(','));
                datas.append('TagId', $('#sltFormTag').val().join(','));
                datas.append('SubTagId', $('#sltFormAuthor').val().join(','));
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
                        } else {
                            base.notification('error', res.message);
                        }
                    }
                })
            });
        },
        init_searchTag: function () {
            $("#sltTag").on("keyup", function () {
                let keyword = $(this).val().trim();
                if (keyword.length < 2) return;

                $.ajax({
                    url: "/Tag/Search",
                    type: "GET",
                    data: { q: keyword },
                    success: function (res) {
                        $("#sltTag").empty();
                        res.forEach(tag => {
                            $("#sltTag").append(`<option value="${tag.id}">${tag.name}</option>`);
                        });
                    }
                });
            });

            $("#sltTag").on("change", function () {
                let selectedId = $(this).val();
                let selectedText = $("#sltTag option:selected").text();

                if (selectedId) {
                    $("#tagSelected .tags").append(`
                <li class="badge bg-info p-2 d-flex align-items-center gap-1" data-id="${selectedId}">
                    ${selectedText}
                    <span class="remove-tag" style="cursor:pointer;">&times;</span>
                </li>
            `);
                }
                $("#sltTag").empty();
            });

            $(document).on("click", ".remove-tag", function () {
                $(this).closest("li").remove();
            });
        },
        init_Tag: function (Id) {
            $("#sltFormTag").select2({
                placeholder: "Chọn thẻ...",
                minimumInputLength: 2,
                ajax: {
                    url: "/Story/SearchTag",
                    dataType: "json",
                    delay: 250,
                    data: function (params) {
                        return {
                            searchString: params.term,
                            selected: $("#sltFormTag").val().join(',')
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
                    forType: 'Story'
                },
                success: function (data) {
                    $("#sltFormTag").empty().trigger("change");
                    (data.rows || []).forEach(function (item) {
                        var option = new Option(item.name, item.id, true, true);
                        $("#sltFormTag").append(option);
                    });
                    $("#sltFormTag").trigger("change");
                }
            });
        },
        init_SubTag: function (Id) {
            $("#sltFormSubTag").select2({
                placeholder: "Chọn thẻ phụ...",
                minimumInputLength: 2,
                ajax: {
                    url: "/Story/SearchSubTag",
                    dataType: "json",
                    delay: 250,
                    data: function (params) {
                        return {
                            searchString: params.term,
                            selected: $("#sltFormSubTag").val().join(',')
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
                    forType: 'Story'
                },
                success: function (data) {
                    $("#sltFormSubTag").empty().trigger("change");
                    (data.rows || []).forEach(function (item) {
                        var option = new Option(item.name, item.id, true, true);
                        $("#sltFormSubTag").append(option);
                    });
                    $("#sltFormSubTag").trigger("change");
                }
            });
        },
        init_Author: function (Id) {
            $("#sltFormAuthor").select2({
                placeholder: "Chọn tác giả...",
                minimumInputLength: 2,
                ajax: {
                    url: "/Author/SearchAuthorForStory",
                    dataType: "json",
                    delay: 250,
                    data: function (params) {
                        return {
                            searchString: params.term,
                            selected: $("#sltFormAuthor").val().join(',')
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
                url: "/Author/GetAuthorForStory",
                data: {
                    id: Id,
                    forType: 'Story'
                },
                success: function (data) {
                    $("#sltFormAuthor").empty().trigger("change");
                    (data.rows || []).forEach(function (item) {
                        var option = new Option(item.name, item.id, true, true);
                        $("#sltFormAuthor").append(option);
                    });
                    $("#sltFormAuthor").trigger("change");
                }
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
                        search: $.trim($('#txtSearch').val()),
                        tags: $('#sltTag').val(),
                        authors: $('#sltAuthor').val(),
                        status: $('#chk').val()
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
                                //$('#txtTagName').val(row.tags_Name);
                                $('#sources').val(row.source.trim());
                                story.init_Tag(row.id);
                                story.init_SubTag(row.id);
                                story.init_Author(row.id);
                                //$('#sltFormTag').select2().val(row.tagId ? row.tagId.split(",") : null).trigger('change');
                                //if (row.authorId == null) {
                                //    story.initSelect2_Authors();
                                //} else {
                                //    $("#sltFormAuthor").select2().val(null).trigger("change");
                                //    $.ajax({
                                //        url: '/Story/GetAuthorByStory',
                                //        data: {
                                //            id: row.id
                                //        },
                                //        success: function (res) {
                                //            story.initSelect2_Authors(res.rows);
                                //        }
                                //    })
                                //}
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
