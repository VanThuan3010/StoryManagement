$(function () {
    window.story = {
        init: function () {
            story.action();
            story.tblStory();
            $('#btnCreate').on('click', function () {
                $('#txtIdModal').val(0);
                $('#txtName').val('');
                $('#txtNumberChapter').val('');
                story.init_Tag(0);
                story.init_SubTag(0);
                story.init_Author(0);
                $('#txtTagName').val('');
                $('#sources').val('SacHiepVien');
                $('#labelAction').text('Thêm mới truyện');

                $('#modalCreateOrEdit').modal('show');
            });
            story.init_searchTag();
            story.init_searchSubTag();
            story.init_searchAuthor();
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
                datas.append('Name', JSON.stringify($('#txtName').val().split(/\r?\n/).filter(line => line.trim() !== '')));
                datas.append('NumberChapter', JSON.stringify($('#txtNumberChapter').val().split(/\r?\n/).filter(line => line.trim() !== '')));
                datas.append('Source', $('#sources').val());
                datas.append('IsRead', 0);
                datas.append('TagsName', $('#txtTagName').val());
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
            let timer;
            $("#searchTag").on("keyup", function () {
                const keyword = $(this).val().trim();
                clearTimeout(timer);

                if (keyword.length < 2) {
                    $("#sTagRes").empty();
                    return;
                }

                timer = setTimeout(function () {
                    const idSelected = $("#tagSelected .lst-tag li a.li-tag")
                        .map(function () {
                            return $(this).data("id");
                        })
                        .get();
                    $.ajax({
                        url: "/Story/GetTagSearch",
                        type: "GET",
                        data: {
                            searchStr: keyword,
                            idSelected: idSelected.join(','),
                            type: "Tag"
                        },
                        success: function (res) {
                            $("#sTagRes").empty();
                            if (res && res.length > 0) {
                                let html = `<div class="tag-result-list" 
                            style="border:1px solid #ccc; border-radius:6px; padding:4px;">`;
                                res.forEach(tag => {
                                    html += `
                                    <div class="tag-item" data-id="${tag.id}" 
                                        style="padding:4px; cursor:pointer; border-bottom:1px solid #eee;">
                                        ${tag.name}
                                    </div>`;
                                });
                                html += `</div>`;
                                $("#sTagRes").html(html);
                            } else {
                                $("#sTagRes").html(`<div style="color:red;">Không tìm thấy kết quả</div>`);
                            }
                        },
                        error: function () {
                            $("#sTagRes").html(`<div style="color:red;">Lỗi tải dữ liệu</div>`);
                        }
                    });
                }, 1000);
            });

            $(document).on("click", ".tag-item", function () {
                const selectedId = $(this).data("id");
                const selectedText = $(this).text();
                const exists = $("#tagSelected .tags li[data-id='" + selectedId + "']").length > 0;
                if (!exists) {
                    $("#tagSelected .lst-tag").append(`
                        <li><a href="#" data-id="${selectedId}" data-value="${selectedText}" class="li-tag">${selectedText}<span class="remove-searchTag">&times;</span></a></li>
                    `);
                }
                $("#searchTag").val('');
                $("#sTagRes").empty();
            });

            $(document).on("click", ".remove-searchTag", function () {
                $(this).closest("li").remove();
            });
        },
        init_searchSubTag: function () {
            let timer;
            $("#searchSubTag").on("keyup", function () {
                const keyword = $(this).val().trim();
                clearTimeout(timer);

                if (keyword.length < 2) {
                    $("#sTagRes").empty();
                    return;
                }

                timer = setTimeout(function () {
                    const idSelected = $("#subTagSelected .lst-subTag li a.li-subTag")
                        .map(function () {
                            return $(this).data("id");
                        })
                        .get();
                    $.ajax({
                        url: "/Story/GetTagSearch",
                        type: "GET",
                        data: {
                            searchStr: keyword,
                            idSelected: idSelected.join(','),
                            type: "SubTag"
                        },
                        success: function (res) {
                            $("#sSubTagRes").empty();
                            if (res && res.length > 0) {
                                let html = `<div class="subTag-result-list" 
                            style="border:1px solid #ccc; border-radius:6px; padding:4px;">`;
                                res.forEach(tag => {
                                    html += `
                                    <div class="subTag-item" data-id="${tag.id}" 
                                        style="padding:4px; cursor:pointer; border-bottom:1px solid #eee;">
                                        ${tag.name}
                                    </div>`;
                                });
                                html += `</div>`;
                                $("#sSubTagRes").html(html);
                            } else {
                                $("#sSubTagRes").html(`<div style="color:red;">Không tìm thấy kết quả</div>`);
                            }
                        },
                        error: function () {
                            $("#sSubTagRes").html(`<div style="color:red;">Lỗi tải dữ liệu</div>`);
                        }
                    });
                }, 1000);
            });

            $(document).on("click", ".subTag-item", function () {
                const selectedId = $(this).data("id");
                const selectedText = $(this).text();
                const exists = $("#subTagSelected .tags li[data-id='" + selectedId + "']").length > 0;
                if (!exists) {
                    $("#subTagSelected .lst-subTag").append(`
                        <li><a href="#" data-id="${selectedId}" data-value="${selectedText}" class="li-subTag">${selectedText}<span class="remove-searchSubTag">&times;</span></a></li>
                    `);
                }
                $("#searchSubTag").val('');
                $("#sSubTagRes").empty();
            });

            $(document).on("click", ".remove-searchSubTag", function () {
                $(this).closest("li").remove();
            });
        },
        init_searchAuthor: function () {
            let timer;
            $("#searchAuthor").on("keyup", function () {
                const keyword = $(this).val().trim();
                clearTimeout(timer);

                if (keyword.length < 2) {
                    $("#sAuthorRes").empty();
                    return;
                }

                timer = setTimeout(function () {
                    const idSelected = $("#authorSelected .lst-author li a.li-author")
                        .map(function () {
                            return $(this).data("id");
                        })
                        .get();
                    $.ajax({
                        url: "/Story/GetTagSearch",
                        type: "GET",
                        data: {
                            searchStr: keyword,
                            idSelected: idSelected.join(','),
                            type: "Author"
                        },
                        success: function (res) {
                            $("#sAuthorRes").empty();
                            if (res && res.length > 0) {
                                let html = `<div class="author-result-list" 
                            style="border:1px solid #ccc; border-radius:6px; padding:4px;">`;
                                res.forEach(tag => {
                                    html += `
                                    <div class="author-item" data-id="${tag.id}"
                                        style="padding:4px; cursor:pointer; border-bottom:1px solid #eee;">
                                        ${tag.name}
                                    </div>`;
                                });
                                html += `</div>`;
                                $("#sAuthorRes").html(html);
                            } else {
                                $("#sAuthorRes").html(`<div style="color:red;">Không tìm thấy kết quả</div>`);
                            }
                        },
                        error: function () {
                            $("#sAuthorRes").html(`<div style="color:red;">Lỗi tải dữ liệu</div>`);
                        }
                    });
                }, 1000);
            });

            $(document).on("click", ".author-item", function () {
                const selectedId = $(this).data("id");
                const selectedText = $(this).text();
                const exists = $("#authorSelected .tags li[data-id='" + selectedId + "']").length > 0;
                if (!exists) {
                    $("#authorSelected .lst-author").append(`
                        <li><a href="#" data-id="${selectedId}" data-value="${selectedText}" class="li-author">${selectedText}<span class="remove-searchAuthor">&times;</span></a></li>
                    `);
                }
                $("#searchAuthor").val('');
                $("#sAuthorRes").empty();
            });

            $(document).on("click", ".remove-searchAuthor", function () {
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
                    id: Id
                },
                success: function (data) {
                    $("#sltFormAuthor").empty().trigger("change");
                    (data.rows || []).forEach(function (item) {
                        var option = new Option(item.pseudonym, item.id, true, true);
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
                        tags: $("#tagSelected .lst-tag li a.li-tag").map(function () {
                                    return $(this).data("id");
                        }).get().join(','),
                        subTags: $("#subTagSelected .lst-subTag li a.li-subTag").map(function () {
                                    return $(this).data("id");
                        }).get().join(','),
                        authors: $("#authorSelected .lst-author li a.li-author").map(function () {
                            return $(this).data("id");
                        }).get().join(','),
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
                        width: 700,
                        formatter: function (value) {
                            try {
                                let arr = JSON.parse(value);
                                if (Array.isArray(arr) && arr.length > 0) return arr[0]; // chỉ dòng đầu
                                return value;
                            } catch (e) {
                                return value;
                            }
                        }
                    },
                    {
                        field: "numberChapter",
                        title: "Số chương",
                        align: 'left',
                        valign: 'left',
                        width: 400,
                        formatter: function (value) {
                            try {
                                let arr = JSON.parse(value);
                                if (Array.isArray(arr)) {
                                    // Ghép từng dòng, mỗi dòng xuống dòng HTML
                                    return arr.join("<br>");
                                }
                                return value;
                            } catch {
                                return value;
                            }
                        }
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
                            //action += '<a href="/Comic/index?idStory=' + row.id + '" title="Truyện tranh" class="btn btn-secondary btn-sm btnReview ms-1"><i class="fa fa-image"></i></a>';
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
                                $('#txtTagName').val(row.tagsName);
                                //$('#txtNumberChapter').val(row.numberChapter);
                                try {
                                    let names = JSON.parse(row.name);
                                    if (Array.isArray(names))
                                        $('#txtName').val(names.join("\n"));
                                    else
                                        $('#txtName').val(row.name);
                                } catch {
                                    $('#txtName').val(row.name);
                                }

                                // --- Xử lý số chương ---
                                try {
                                    let chapters = JSON.parse(row.numberChapter);
                                    if (Array.isArray(chapters))
                                        $('#txtNumberChapter').val(chapters.join("\n"));
                                    else
                                        $('#txtNumberChapter').val(row.numberChapter);
                                } catch {
                                    $('#txtNumberChapter').val(row.numberChapter);
                                }
                                $('#sources').val(row.source.trim());
                                story.init_Tag(row.id);
                                story.init_SubTag(row.id);
                                story.init_Author(row.id);
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
