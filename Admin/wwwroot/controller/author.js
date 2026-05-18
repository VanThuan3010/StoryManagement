$(function () {
    window.author = {
        init: function () {
            author.action();
            author.tblAuthor();
            $('#btnCreate').on('click', function () {
                $('#saveAuthorId').val(0);
                $('#txtPseudonym').val('');
                $('#txtStyle').val('');
                //$("#tblStories tbody").empty();
                $('#labelAction').text('Thêm mới tác giả');
                $('#modalCreateOrEdit').modal('show');
            });
        },
        action: function () {
            $("#btnAddStoryRow").click(function () {
                let row = `
                <tr>
                    <td style="width: 100%">
                        <div class="story-search-wrapper">
                            <div class="search-input-container">
                                <input type="text" class="form-control story-search-input" placeholder="Nhập tên truyện..." autocomplete="off" />
                            </div>
                            <div class="search-result-list border rounded bg-white mt-1" style="display:none; position:absolute; z-index:1000; overflow:auto;"></div>
                        </div>
                    </td>
                </tr>`;
                $("#tblStories tbody").append(row);
            });
            $(document).on("keyup", ".story-search-input", function () {
                let query = $(this).val().trim();
                let resultDiv = $(this).closest(".story-search-wrapper").find(".search-result-list");
                if (query.length < 2) {
                    resultDiv.hide();
                    return;
                }
                const idSelected = $("#tblStories .selected-story .story-name")
                    .map(function () {
                        return $(this).data("id");
                    })
                    .get();

                $.get("/Author/SearchStory", { search: query, idSelected: idSelected.join(",") }, function (res) {
                    resultDiv.empty();

                    if (res && res.length > 0) {
                        res.forEach(story => {
                            let sName = "";
                            let titleText = "";
                            try {
                                let parsed = JSON.parse(story.name);

                                if (Array.isArray(parsed) && parsed.length > 0) {
                                    sName = parsed[0];
                                    fname = parsed.join('\n');
                                }
                            } catch (e) {
                                sName = story.name;
                                fname = sName;
                            }
                            resultDiv.append(`
                            <div class="p-2 search-item" 
                                 data-id="${story.id}" 
                                 data-name="${sName}" 
                                 title="${fname}"
                                 style="cursor:pointer;">
                                ${sName}
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
                let name = "";
                let titleText = "";
                try {
                    let parsed = JSON.parse($(this).data("name"));

                    if (Array.isArray(parsed) && parsed.length > 0) {
                        name = parsed[0];
                        titleText = parsed.join('\n');
                    }
                } catch (e) {
                    name = $(this).data("name");
                    titleText = name;
                }
                let wrapper = $(this).closest(".story-search-wrapper");
                let resultDiv = wrapper.find(".search-result-list");
                let inputContainer = wrapper.find(".search-input-container");

                resultDiv.hide();

                inputContainer.html(`
                    <div class="selected-story d-inline-flex align-items-center gap-2 border rounded px-2 py-1 bg-light">
                        <span data-id="${id}" class="story-name line-clamp-1" title="${name}">${name}</span>
                        <button type="button" class="btn btn-sm btn-outline-danger btn-clear-story">×</button>
                    </div>
                `);
            });
            $('#btnSearch').on('click', function () {
                author.tblAuthor();
            });
            $('#btnSaveAuthor').click(function () {
                if ($('#txtPseudonym').val().trim() === '') {
                    base.notification('error', "Hãy nhập bút danh");
                    return;
                }
                var datas = new FormData();
                datas.append('Id', $('#saveAuthorId').val());
                datas.append('Pseudonym', JSON.stringify($('#txtPseudonym').val().split(/\r?\n/).filter(line => line.trim() !== '')));
                datas.append('Style', base.convertToHTML(CKEDITOR.instances.txtStyle.getData()));
                datas.append('actionFor', "CreateOrUpdate");
                $.ajax({
                    url: '/Author/CreateOrUpdate',
                    type: 'post',
                    processData: false,
                    contentType: false,
                    data: datas,
                    beforeSend: function () {
                        $('#btnSaveAuthor').prop('disabled', true);
                        $('#btnSaveAuthor').html(base.loadButton("Lưu"));
                    },
                    success: function (res) {
                        $('#btnSaveAuthor').prop('disabled', false);
                        $('#btnSaveAuthor').html("Lưu");
                        if (res.status) {
                            base.notification('success', res.message);
                            $("#tblAuthor").bootstrapTable('refresh');
                            $('#modalCreateOrEdit').modal('hide');
                        } else {
                            base.notification('error', res.message);
                        }
                    }
                })
            });
            $('#btnSaveLiterary').click(function () {
                let storiesData = [];
                $("#tblStories tbody tr").each(function () {
                    const storyId = $(this).find(".selected-story .story-name").data("id");
                    if (storyId) {
                        storiesData.push({
                            storyId: storyId
                        });
                    }
                });
                var datas = new FormData();
                datas.append('Id', $('#saveAuthorId').val());
                datas.append('lstStory', JSON.stringify(storiesData));
                datas.append('actionFor', "SaveLiterary");
                $.ajax({
                    url: '/Author/CreateOrUpdate',
                    type: 'post',
                    processData: false,
                    contentType: false,
                    data: datas,
                    beforeSend: function () {
                        $('#btnSaveLiterary').prop('disabled', true);
                        $('#btnSaveLiterary').html(base.loadButton("Lưu"));
                    },
                    success: function (res) {
                        $('#btnSaveLiterary').prop('disabled', false);
                        $('#btnSaveLiterary').html("Lưu");
                        if (res.status) {
                            base.notification('success', res.message);
                            $("#tblAuthor").bootstrapTable('refresh');
                            $('#modalLiterary').modal('hide');
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
                pageSize: 100,
                pageList: [100],
                columns: [
                    {
                        field: "pseudonym",
                        title: "Bút danh",
                        align: 'center',
                        valign: 'left',
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
                        title: "Chức năng",
                        valign: 'middle',
                        align: 'center',
                        class: 'CssAction',
                        formatter: function (value, row, index) {
                            var action = "<div style='width: 100px;'>";
                            action += '<a href="javascript:void(0)" class="btn btn-success btn-sm btnEdit"><i class="fas fa-pen"></i></a>';
                            action += '<a href="javascript:void(0)" class="btn btn-primary btn-sm btnLiterary ms-1"><i class="fa fa-book"></i></a>';
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
                                $('#saveAuthorId').val(row.id);
                                try {
                                    let pseudonyms = JSON.parse(row.pseudonym);
                                    if (Array.isArray(pseudonyms))
                                        $('#txtPseudonym').val(pseudonyms.join("\n"));
                                    else
                                        $('#txtPseudonym').val(row.pseudonym);
                                } catch {
                                    $('#txtPseudonym').val(row.pseudonym);
                                }
                                $.ajax({
                                    url: "/Author/GetAuthorDetail",
                                    data: {
                                        id: row.id
                                    },
                                    success: function (res) {
                                        CKEDITOR.instances.txtStyle.setData(res.style);
                                    },
                                    error: function () {
                                        alert("Lỗi kết nối!");
                                    }
                                });
                                $('#labelAction').text('Sửa thông tin tác giả');
                                $('#modalCreateOrEdit').modal('show');
                            },
                            'click .btnLiterary': function (e, value, row, index) {
                                $('#saveAuthorId').val(row.id);
                                $("#tblStories tbody").empty();
                                $.ajax({
                                    url: "/Author/GetStoryForAuthor",
                                    data: {
                                        id: row.id
                                    },
                                    success: function (res) {
                                        $("#tblStories tbody").empty();
                                        if (res && res.length > 0) {
                                            res.forEach(function (story) {
                                                let sName = story.name;
                                                try {
                                                    sName = JSON.parse(story.name)[0];
                                                } catch (e) { }

                                                let rowHtml = `
                                                <tr>
                                                    <td style="width: 100%">
                                                        <div class="story-search-wrapper">
                                                            <div class="search-input-container">
                                                                <div class="selected-story d-inline-flex align-items-center gap-2 border rounded px-2 py-1 bg-light">
                                                                    <span data-id="${story.id}" class="story-name line-clamp-1">${sName}</span>
                                                                    <button type="button" class="btn btn-sm btn-outline-danger btn-clear-story">×</button>
                                                                </div>
                                                            </div>
                                                            <div class="search-result-list border rounded bg-white mt-1"
                                                                 style="display:none; position:absolute; z-index:1000; max-height:200px; overflow:auto;"></div>
                                                        </div>
                                                    </td>
                                                </tr>`;
                                                $("#tblStories tbody").append(rowHtml);
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
                                            $("#tblStories tbody").append(emptyRow);
                                        }
                                    },
                                    error: function () {
                                        alert("Lỗi kết nối!");
                                    }
                                });
                                $('#modalLiterary').modal('show');
                            }
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