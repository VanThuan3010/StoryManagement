$(function () {
    window.story = {
        init: function () {
            story.action();
            story.tblStory();
            $("#slChapterNow").select2();
            $('#btnCreate').on('click', function () {
                $('#saveIdStory').val(0);
                $('#txtName').val('');
                $('#txtNumberChapter').val('');
                $('#txtTagName').val('');
                $("#tblAuthors tbody").empty();
                $('#txtReadOrder').val("");
                $('#sources').val('SacHiepVien');
                $('#labelAction').text('Thêm mới truyện');

                $('#modalCreateOrEdit').modal('show');
            });
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
            $("#btnAddAuthorRow").click(function () {
                let row = `
                <tr>
                    <td style="width: 100%">
                        <div class="story-search-wrapper">
                            <div class="search-input-container">
                                <input type="text" class="form-control story-search-input" placeholder="Nhập tên tác giả..." autocomplete="off" />
                            </div>
                            <div class="search-result-list border rounded bg-white mt-1" style="display:none; position:absolute; z-index:1000; overflow:auto;"></div>
                        </div>
                    </td>
                </tr>`;
                $("#tblAuthors tbody").append(row);
            });
            $(document).on("keyup", ".story-search-input", function () {
                let query = $(this).val().trim();
                let resultDiv = $(this).closest(".story-search-wrapper").find(".search-result-list");
                if (query.length < 2) {
                    resultDiv.hide();
                    return;
                }
                const idSelected = $("#tblAuthors .selected-story .story-name")
                    .map(function () {
                        return $(this).data("id");
                    })
                    .get();

                $.get("/Story/SearchAuthor", { search: query, idSelected: idSelected.join(",") }, function (res) {
                    resultDiv.empty();

                    if (res && res.length > 0) {
                        res.forEach(author => {
                            let pseu = "";
                            let titleText = "";
                            try {
                                let parsed = JSON.parse(author.pseudonym);

                                if (Array.isArray(parsed) && parsed.length > 0) {
                                    pseu = parsed[0];
                                    titleText = parsed.join('\n');
                                }
                            } catch (e) {
                                pseu = story.name;
                                titleText = pseu;
                            }
                            resultDiv.append(`
                            <div class="p-2 search-item" 
                                 data-id="${author.id}" 
                                 data-name="${pseu}" 
                                 title="${titleText}"
                                 style="cursor:pointer;">
                                ${pseu}
                            </div>`);
                        });
                        resultDiv.show();
                    } else {
                        resultDiv.append(`<div class="p-2 text-muted fst-italic">Không tìm thấy truyện</div>`);
                        resultDiv.show();
                    }
                });
            });
            $(document).on("click", ".search-item", function () {
                let id = $(this).data("id");
                let pseu = "";
                let titleText = "";
                try {
                    let parsed = JSON.parse($(this).data("name"));

                    if (Array.isArray(parsed) && parsed.length > 0) {
                        pseu = parsed[0];
                        titleText = parsed.join('\n');
                    }
                } catch (e) {
                    pseu = $(this).data("name");
                    titleText = pseu;
                }
                let wrapper = $(this).closest(".story-search-wrapper");
                let resultDiv = wrapper.find(".search-result-list");
                let inputContainer = wrapper.find(".search-input-container");

                resultDiv.hide();

                inputContainer.html(`
                    <div class="selected-story d-inline-flex align-items-center gap-2 border rounded px-2 py-1 bg-light">
                        <span data-id="${id}" class="story-name line-clamp-1" title="${titleText}">${pseu}</span>
                        <button type="button" class="btn btn-sm btn-outline-danger btn-clear-story">×</button>
                    </div>
                `);
            });
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
                if ($('#txtName').val().trim() === '') {
                    base.notification('error', 'Tên truyện không được để trống');
                    return;
                }
                if (!/^\d+$/.test($('#txtReadOrder').val())) {
                    base.notification('error', 'Nhập số thứ tự hợp lệ cho thứ tự đọc');
                    return;
                }
                let authorsData = [];
                $("#tblAuthors tbody tr").each(function () {
                    const authorId = $(this).find(".selected-story .story-name").data("id");
                    if (authorId) {
                        authorsData.push({
                            authorId: authorId
                        });
                    }
                });
                var datas = new FormData();
                datas.append('Id', $('#saveIdStory').val());
                datas.append('Name', JSON.stringify($('#txtName').val().split(/\r?\n/).filter(line => line.trim() !== '')));
                datas.append('NumberChapter', JSON.stringify($('#txtNumberChapter').val().split(/\r?\n/).filter(line => line.trim() !== '')));
                datas.append('Source', $('#sources').val());
                datas.append('IsRead', 0);
                datas.append('TagsName', $('#txtTagName').val());
                datas.append('ReadOrder', $('#txtReadOrder').val());
                datas.append('AuthorId', JSON.stringify(authorsData));
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
            $('#btnSaveRead').on('click', function () {
                $.ajax({
                    url: '/Story/CheckRead',
                    type: 'post',
                    data: {
                        id: $('#saveIdStory').val(),
                        idChapter: $('#slChapterNow').val()
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
            })
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
                        search: $('#txtSearch').val().trim(),
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
                        width: 150,
                        formatter: function (value, row, index) {
                            var html = '';
                            if (row.isRead == true) {
                                html = '<input class="form-check-input btnRead" type="checkbox" checked title="Đánh dấu là chưa đọc" /><br/>';
                                html += '<div class="chapRead" style="display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;overflow: hidden;font-size: 11px; color: #888; max-width:100%;" title="' + (row.readChapter ? row.readChapter : "") + '">' + (row.readChapter ? row.readChapter : "") + '</div>';
                            } else {
                                html = '<input class="form-check-input btnRead" type="checkbox" title="Đánh dấu là đã đọc" /><br/>';
                            }
                            return html;

                        },
                        events: {
                            'click .btnRead': function (e, value, row, index) {
                                if (row.isRead == true) {
                                    $.confirm({
                                        title: 'Cảnh báo!',
                                        content: 'Đánh dấu là chưa đọc?',
                                        buttons: {
                                            formSubmit: {
                                                text: 'Xác nhận',
                                                btnClass: 'btn btn-primary',
                                                action: function () {
                                                    $.ajax({
                                                        url: '/Story/CheckRead',
                                                        type: 'post',
                                                        data: {
                                                            id: row.id,
                                                            idChapter: 0
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
                                } else {
                                    $("#slChapterNow").select2('destroy');
                                    $("#slChapterNow").select2({
                                        dropdownParent: $('#modalChapterRead'),
                                        placeholder: "Tìm kiếm rồi chọn chương...",
                                        minimumInputLength: 2,
                                        ajax: {
                                            url: "/Chapter/GetChapter",
                                            dataType: "json",
                                            delay: 250,
                                            data: function (params) {
                                                return {
                                                    search: params.term,
                                                    offset: 0,
                                                    limit: 10,
                                                    idStory: row.id
                                                };
                                            },
                                            processResults: function (data, params) {
                                                return {
                                                    results: $.map(data.rows, function (item) {
                                                        return {
                                                            id: item.chapterId,
                                                            text: item.title
                                                        };
                                                    })
                                                };
                                            },
                                            cache: true
                                        }
                                    });
                                    $('#saveIdStory').val(row.id);
                                    $('#modalChapterRead').modal('show');
                                }
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
                            action += '<a href="/Review/Index?idStory=' + row.id + '" title="Cập nhật" class="btn btn-success btn-sm ms-1"><i class="fa fa-user-check"></i></a>';
                            action += '<a href="/Chapter/index?idStory=' + row.id + '" title="Chương" class="btn btn-secondary btn-sm ms-1"><i class="fa fa-book-open"></i></a>';
                            action += '<a href="javascript:void(0)" title="Chương lưu trong hệ thống" class="btn btn-secondary btn-sm btnReview ms-1"><i class="fa fa-book"></i></a>';
                            //action += '<a href="/Comic/index?idStory=' + row.id + '" title="Truyện tranh" class="btn btn-secondary btn-sm ms-1"><i class="fa fa-image"></i></a>';
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
                                $('#saveIdStory').val(row.id);
                                $('#txtTagName').val(row.tagsName);
                                $('#txtReadOrder').val(row.readOrder);
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
                                $.ajax({
                                    url: "/Story/GetAuthorForStory",
                                    data: {
                                        id: row.id
                                    },
                                    success: function (res) {
                                        $("#tblAuthors tbody").empty();
                                        if (res && res.length > 0) {
                                            res.forEach(function (author) {
                                                let pseu = "";
                                                let titleText = "";
                                                try {
                                                    let parsed = JSON.parse(author.pseudonym);

                                                    if (Array.isArray(parsed) && parsed.length > 0) {
                                                        pseu = parsed[0];
                                                        titleText = parsed.join('\n');
                                                    }
                                                } catch (e) {
                                                    pseu = author.pseudonym;
                                                    titleText = pseu;
                                                }

                                                let rowHtml = `
                                                <tr>
                                                    <td style="width: 100%">
                                                        <div class="story-search-wrapper">
                                                            <div class="search-input-container">
                                                                <div class="selected-story d-inline-flex align-items-center gap-2 border rounded px-2 py-1 bg-light">
                                                                    <span data-id="${story.id}" class="story-name line-clamp-1" title="${titleText}">${pseu}</span>
                                                                    <button type="button" class="btn btn-sm btn-outline-danger btn-clear-story">×</button>
                                                                </div>
                                                            </div>
                                                            <div class="search-result-list border rounded bg-white mt-1"
                                                                 style="display:none; position:absolute; z-index:1000; max-height:200px; overflow:auto;"></div>
                                                        </div>
                                                    </td>
                                                </tr>`;
                                                $("#tblAuthors tbody").append(rowHtml);
                                            });
                                        } else {
                                            let emptyRow = `
                                            <tr>
                                                <td style="width: 100%">
                                                    <div class="story-search-wrapper">
                                                        <div class="search-input-container">
                                                            <input type="text" class="form-control story-search-input" placeholder="Nhập tên truyện..." autocomplete="off" />
                                                        </div>
                                                        <div class="search-result-list border rounded bg-white mt-1" 
                                                             style="display:none; position:absolute; z-index:1000; max-height:200px; overflow:auto;"></div>
                                                    </div>
                                                </td>
                                            </tr>`;
                                            $("#tblAuthors tbody").append(emptyRow);
                                        }
                                    },
                                    error: function () {
                                        alert("Lỗi kết nối!");
                                    }
                                });
                                $('#labelAction').text('Sửa truyện');

                                $('#modalCreateOrEdit').modal('show');
                            },
                            'click .btnReview': function (e, value, row, index) {
                                if (!row.chapterUploaded) {
                                    $('#savedChapters').html('Không có dữ liệu');
                                } else {
                                    var text = row.chapterUploaded.replace(/\n/g, '<br>');
                                    $('#savedChapters').html(text);
                                }
                                $('#modalChapterUploaded').modal('show');
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
