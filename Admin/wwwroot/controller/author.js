$(function () {
    window.author = {
        init: function () {
            author.action();
            author.tblAuthor();
            $("#slStoryForAuthor").select2({
                placeholder: "Chọn tác phẩm...",
                minimumInputLength: 2,
                ajax: {
                    url: "/Story/GetStorySearchForAuthor",
                    dataType: "json",
                    delay: 500,
                    data: function (params) {
                        return {
                            searchString: params.term,
                            selected: author.getStory()
                        };
                    },
                    processResults: function (data, params) {
                        const term = (params.term || '').toLowerCase();
                        return {
                            results: $.map(data, function (item) {
                                let text = item.name;

                                try {
                                    let arr = JSON.parse(item.pseudonym);

                                    if (Array.isArray(arr) && arr.length > 0) {
                                        // 👉 tìm phần tử match keyword
                                        let match = arr.find(x =>
                                            x && x.toLowerCase().includes(term)
                                        );
                                        // 👉 nếu có thì dùng, không thì fallback phần tử đầu
                                        text = match || arr[0];
                                    }
                                } catch (e) {
                                    // giữ nguyên nếu không phải JSON
                                }
                                return {
                                    id: item.id,
                                    text: text
                                }
                            })
                        };
                    },
                    cache: true
                }
            });
            $(document).on("click", ".btnDeleteStory", function () {
                // tìm card cha gần nhất
                const $card = $(this).closest(".card");

                // xóa luôn khỏi UI
                $card.remove();
            });
            $(document).on("click", ".btnReviewStory", function () {
                // lấy id từ button
                const storyId = $(this).data("id");
                // gọi ajax
                $.ajax({
                    url: '/Author/GetStoryReview', // bạn sửa lại đúng action sau
                    type: 'GET',
                    data: {
                        idStory: storyId
                    },
                    success: function (res) {
                        /* ===== 1. Render StoryName ===== */
                        let htmlNames = "";
                        try {
                            let names = JSON.parse(res.storyName || res.StoryName || "[]");

                            if (Array.isArray(names)) {
                                names.forEach(n => {
                                    htmlNames += `<li>${n}</li>`;
                                });
                            }
                        } catch {
                            // nếu không phải JSON → coi như string
                            if (res.StoryName) {
                                htmlNames = `<li>${res.storyName}</li>`;
                            }
                        }
                        $("#listStoryNames").html(htmlNames);
                        /* ===== 2. Render Review ===== */
                        let reviewContent = res.review || res.Review || "Chưa có Review";

                        $("#divReview").html(reviewContent);
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });

            });
            $('#btnCreate').on('click', function () {
                $('#txtIdModal').val(0);
                $('#txtPseudonym').val('');
                $('#txtStyle').val('');
                $('#labelAction').text('Thêm mới tác giả');

                $('#modalCreateOrEdit').modal('show');
            });
        },
        getStory: function () {
            let selectedIds = [];

            // lấy tất cả data-id từ nút Review (hoặc card cũng được)
            $("#divLstStory .btnReviewStory").each(function () {
                let id = $(this).data("id");
                if (id) selectedIds.push(id);
            });

            return selectedIds.join(',');
        },
        action: function () {
            $('#btnSaveStory').on('click', function () {
                $.ajax({
                    url: '/Author/SaveLiterary',
                    type: 'post',
                    data: {
                        Id: $('#authorId').val(),
                        StoryList: author.getStory()
                    },
                    success: function (res) {
                        window.location.href = '/Author';
                    }
                });
            })
            $('#btnSearch').on('click', function () {
                author.tblAuthor();
            });
            $('#btnSubmit').click(function () {
                var datas = new FormData();
                datas.append('Id', $('#txtIdModal').val());
                datas.append('Pseudonym', JSON.stringify($('#txtPseudonym').val().split(/\r?\n/).filter(line => line.trim() !== '')));
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
                        } else {
                            base.notification('error', res.message);
                        }
                    }
                })
            });
            $("#slStoryForAuthor").on("select2:select", function (e) {
                const item = e.params.data;

                const id = item.id;
                const name = item.text;

                // ❌ tránh thêm trùng
                if ($("#divLstStory .btnReviewStory[data-id='" + id + "']").length > 0) {
                    return;
                }

                // ✅ HTML card
                const html = `
                    <div class="card col-3">
                        <div class="bg-image hover-overlay">
                            <img src="https://bookcover.yuewen.com/qdbimg/349573/1040874138/300"
                                 class="img-fluid"
                                 title="${name}" />
                            <a href="#!">
                                <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
                            </a>
                        </div>
                        <div class="card-body" style="padding: 0.25rem;">
                            <h6 class="card-title">${name}</h6><br />
                            <div class="d-flex gap-2 ps-1">
                                <button class="btn btn-xs btn-primary btnReviewStory" data-id="${id}">Review</button>
                                <button class="btn btn-xs btn-danger btnDeleteStory">Xóa</button>
                            </div>
                        </div>
                    </div>
                `;

                // 👉 append vào list
                $("#divLstStory").append(html);

                // 👉 clear select2
                $("#slStoryForAuthor").val(null).trigger("change");
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
                            action += '<a href="/Author/Literary?idAuthor=' + row.id + '" title="Sáng tác" class="btn btn-secondary btn-sm ms-1 btnShowBook"><i class="fas fa-book"></i></a>';
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
                                try {
                                    let pseudonyms = JSON.parse(row.pseudonym);
                                    if (Array.isArray(pseudonyms))
                                        $('#txtPseudonym').val(pseudonyms.join("\n"));
                                    else
                                        $('#txtPseudonym').val(row.pseudonym);
                                } catch {
                                    $('#txtPseudonym').val(row.pseudonym);
                                }
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