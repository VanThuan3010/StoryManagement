$(function () {
    window.myCompose = {
        init: function () {
            var parentTimeout = null;
            myCompose.action();
            myCompose.initTree();
        },
        action: function () {
            $("#videoFile").change(function () {
                let file = this.files[0];
                if (!file) return;
                let formData = new FormData();
                formData.append("video", file);
                formData.append("oldVideo", $("#video_Upload").val());
                $.ajax({
                    url: "/MyCompose/UploadVideo",
                    type: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (res) {
                        if (res.success) {
                            // cập nhật video preview
                            $("#videoPreview").attr("src", res.path);
                            // lưu video hiện tại để lần sau xóa
                            $("#video_Upload").val(res.path);
                        }
                    }
                });
            });
            $('#btnCreate').on('click', function () {
                $('#tile').text("Thêm mới");
                $("#IdNode").val(0);
                $("#Name").val("");
                $('#chkOldVid').prop('checked', false);
                $("#videoPreview").attr("src", "");
                $("#Content").val("");
            })
            $('#ParentSearch').keyup(function () {
                let keyword = $(this).val();
                if (keyword.length < 2) {
                    $("#parentDropdown").hide();
                    return;
                }
                if (parentTimeout) clearTimeout(parentTimeout);
                parentTimeout = setTimeout(function () {
                    $.get("/MyCompose/SearchParent", { keyword: keyword }, function (res) {
                        renderParentList(res);
                    });
                }, 300)
            })
            $(document).on("click", ".parent-item", function (e) {
                e.preventDefault();
                let id = $(this).data("id");
                let text = $(this).text();
                $("#ParentId").val(id);
                $("#ParentSearch").val(text);
                $("#parentDropdown").hide();
            });
            $('#btnSave').on('click', function () {
                let data = {
                    Id: $("#IdNode").val(),
                    Name: $("#Name").val(),
                    VideoRefer: $("#").val(),
                    Content: base.convertToHTML(CKEDITOR.instances.txtContent.getData()),
                    ParentId: $("#ParentId").val()
                };
                $.post('/MyCompose/CreaeOrUpdate', data, function (res) {
                    if (res.success) {
                        alert("Lưu thành công!");
                        $('#tree').jstree(true).refresh();
                    } else {
                        alert("Lỗi: " + res.message);
                    }
                });
            });
        },
        renderParentList: function (list) {
            let html = "";
            list.forEach(function (item) {
                html += `
                <a href="#" 
                   class="list-group-item list-group-item-action parent-item"
                   data-id="${item.id}">
                   ${item.text}
                </a>`;
            });
            $("#parentDropdown").html(html).show();
        },
        initTree: function () {
            $('#tree').jstree({
                core: {
                    data: {
                        url: '/MyCompose/GetTree',
                        dataType: 'json'
                    }
                },
                plugins: ["search"]

            });
            $('#tree').on("select_node.jstree", function (e, data) {
                $('#tile').text("Chỉnh sửa");
                loadDetail(data.node.id);
            });
        },
        loadDetail: function (id) {
            $.get('/MyCompose/GetDetail', { id: id }, function (res) {
                $("#IdNode").val(res.id);
                $("#Name").val(res.name);
                $("#VideoRefer").val(res.video_Refer);
                $("#videoPreview").attr("src", res.video_Refer);
                CKEDITOR.instances.txtContent.setData(res.content);
            });
        },
        initSearch: function (Id) {
            var to = false;
            $('#searchNode').keyup(function () {
                if (to) {
                    clearTimeout(to);
                }
                to = setTimeout(function () {
                    var keyword = $('#searchNode').val();
                    if (keyword.length === 0) {
                        $('#tree').jstree(true).clear_search();
                        return;
                    }
                    $.get('/MyCompose/SearchNode', { keyword: keyword }, function (ids) {
                        var tree = $('#tree').jstree(true);
                        tree.clear_search();
                        ids.forEach(function (id) {
                            tree.search(id);
                        });
                    });
                }, 300);
            });
        },
    }
});
$(document).ready(function () {
    myCompose.init();
});