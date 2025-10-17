$(function () {
    window.series = {
        init: function () {
            series.action();
            series.tblSeries();
            $('#btnCreate').on('click', function () {
                /*window.location.href = '/Series/CreateOrUpdate?Id=0';*/
                $("#seriesForm")[0].reset();
                $("#tblStories tbody").empty();
                $("#SeriesId").val(0);
                $('#SeriName').val('');
                $("#seriesModal").modal("show");
            });
        },
        action: function () {
            $("#btnAddStoryRow").click(function () {
                let row = `
                <tr>
                    <td style="width: 90%">
                        <div class="story-search-wrapper">
                            <div class="search-input-container">
                                <input type="text" class="form-control story-search-input" placeholder="Nhập tên truyện..." autocomplete="off" />
                            </div>
                            <div class="search-result-list border rounded bg-white mt-1" style="display:none; position:absolute; z-index:1000; overflow:auto;"></div>
                        </div>
                    </td>
                    <td style="width: 10%"><input type="number" name='Positions[]' class="form-control" min="1" value="1" /></td>
                </tr>`;
                $("#tblStories tbody").append(row);
            });
            $(document).on("keyup", ".story-search-input", function () {
                let query = $(this).val().trim();
                let resultDiv = $(this).closest(".story-search-wrapper").find(".search-result-list");

                const idSelected = $("#tblStories .selected-story .story-name")
                    .map(function () {
                        return $(this).data("id");
                    })
                    .get();

                if (query.length < 2) {
                    resultDiv.hide();
                    return;
                }

                $.get("/Series/SearchStory", { search: query, idSelected: idSelected.join(",") }, function (res) {
                    resultDiv.empty();

                    if (res && res.length > 0) {
                        res.forEach(story => {
                            let sName = JSON.parse(story.name)[0];
                            resultDiv.append(`
                            <div class="p-2 search-item" 
                                 data-id="${story.id}" 
                                 data-name="${sName}" 
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
                let name = $(this).data("name");
                let wrapper = $(this).closest(".story-search-wrapper");
                let resultDiv = wrapper.find(".search-result-list");
                let inputContainer = wrapper.find(".search-input-container");

                resultDiv.hide();

                inputContainer.html(`
                    <div class="selected-story d-inline-flex align-items-center gap-2 border rounded px-2 py-1 bg-light">
                        <span data-id="${id}" class="story-name">${name}</span>
                        <button type="button" class="btn btn-sm btn-outline-danger btn-clear-story">×</button>
                    </div>
                `);
            });
            $(document).on("click", ".btn-clear-story", function () {
                let $tr = $(this).closest("tr");
                let $wrapper = $(this).closest(".story-search-wrapper");
                let $inputContainer = $wrapper.find(".search-input-container");
                let $resultDiv = $wrapper.find(".search-result-list");

                let hasOtherInputRow = $("#tblStories tbody tr").filter(function () {
                    return $(this).find("input.story-search-input").length > 0 && this !== $tr[0];
                }).length > 0;

                if (hasOtherInputRow) {
                    $tr.remove();
                } else {
                    $inputContainer.html(`
                        <input type="text" class="form-control story-search-input" placeholder="Nhập tên truyện..." autocomplete="off" />
                    `);
                    $resultDiv.hide();
                }
            });
            $("#btnSubmit").click(function (e) {
                e.preventDefault();

                let storiesData = [];

                $("#tblStories tbody tr").each(function () {
                    const storyId = $(this).find(".selected-story .story-name").data("id");
                    const position = $(this).find("input[name='Positions[]']").val();

                    if (storyId) {
                        storiesData.push({
                            storyId: storyId,
                            position: parseInt(position) || 0
                        });
                    }
                });

                $.ajax({
                    url: "/Series/SaveSeries",
                    type: "POST",
                    data: {
                        Id: $("#SeriesId").val(),
                        SeriesName: $("#SeriName").val(),
                        lstStory: JSON.stringify(storiesData)
                    },
                    success: function (res) {
                        if (res.status) {
                            notification('success', res.message);
                        } else {
                            notification('error', res.message);
                        }
                    },
                    error: function () {
                        notification('error', 'Lỗi kết nối!');
                    }
                });
            });
        },
        tblSeries: function () {
            var objTable = $("#tblSeries");
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
                        field: "seriesName",
                        title: "Tên",
                        align: 'center',
                        valign: 'left',
                        with: '60%',
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
                                    content: 'Chắc chắn muốn xóa?',
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
                                                            $("#tblSeries").bootstrapTable('refresh', { silent: true });
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
                                $('#SeriesId').val(row.id);
                                $('#SeriName').val(row.seriName);
                                $.ajax({
                                    url: "/Series/GetStory",
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
                                                    <td style="width: 90%">
                                                        <div class="story-search-wrapper">
                                                            <div class="search-input-container">
                                                                <div class="selected-story d-inline-flex align-items-center gap-2 border rounded px-2 py-1 bg-light">
                                                                    <span data-id="${story.id}" class="story-name">${sName}</span>
                                                                    <button type="button" class="btn btn-sm btn-outline-danger btn-clear-story">×</button>
                                                                </div>
                                                            </div>
                                                            <div class="search-result-list border rounded bg-white mt-1"
                                                                 style="display:none; position:absolute; z-index:1000; max-height:200px; overflow:auto;"></div>
                                                        </div>
                                                    </td>
                                                    <td style="width: 10%">
                                                        <input type="number" class="form-control" name="Positions[]" min="1" value="${story.position}" />
                                                    </td>
                                                </tr>`;
                                                $("#tblStories tbody").append(rowHtml);
                                            });
                                            $("#seriesModal").modal("show");
                                        } else {
                                            let emptyRow = `
                                            <tr>
                                                <td style="width: 90%">
                                                    <div class="story-search-wrapper">
                                                        <div class="search-input-container">
                                                            <input type="text" class="form-control story-search-input" placeholder="Nhập tên truyện..." autocomplete="off" />
                                                        </div>
                                                        <div class="search-result-list border rounded bg-white mt-1" 
                                                             style="display:none; position:absolute; z-index:1000; max-height:200px; overflow:auto;"></div>
                                                    </div>
                                                </td>
                                                <td style="width: 10%">
                                                    <input type="number" class="form-control" name="Positions[]" min="1" value="1" />
                                                </td>
                                            </tr>`;
                                            $("#tblStories tbody").append(emptyRow);
                                            $("#seriesModal").modal("show");
                                        }
                                    },
                                    error: function () {
                                        alert("Lỗi kết nối!");
                                    }
                                });
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