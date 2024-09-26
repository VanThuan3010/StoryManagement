$(function () {
    window.Chapter = {
        init: function () {
            Chapter.action();
            Chapter.tblChapter();
            $('#btnCreate').on('click', function () {
                window.location.href = '/Chapter/CreateOrUpdate?idStory=' + $('#saveStoryId').val() + '&idChapter=0';
            });
        },

        action: function () {
            $('#savePosition').click(function () {
                let chapterIdsString = $('#tblChapter').bootstrapTable('getData').map(function (row) {
                    return row.chapterId;
                }).join(',');
                alert(chapterIdsString);
                $.ajax({
                    url: '/Chapter/UpdatePosition',
                    type: 'post',
                    data: { ids: chapterIdsString },
                    beforeSend: function () {
                        $('#savePosition').prop('disabled', true);
                        $('#savePosition').html(base.loadButton("Lưu"));
                    },
                    success: function (res) {
                        $('#savePosition').prop('disabled', false);
                        $('#savePosition').html("Lưu vị trí");
                        $("#tblChapter").bootstrapTable('refresh');
                        if (res.status) {
                            base.notification('success', res.message);
                        } else {
                            base.notification('error', res.message);
                        }
                    }
                })
            })
            $('#savePart').click(function () {
                if ($('#partChapterName').val() == '') {
                    base.notification('error', 'Chưa nhập tên');
                    $('#partChapterName').focus();
                    return;
                }
                $.ajax({
                    url: '/Chapter/AddPartChapter',
                    type: 'post',
                    data: {
                        idStory: $('#idStoryAddPartChapt').val(),
                        name: $('#partChapterName').val()
                    },
                    beforeSend: function () {
                        $('#savePart').prop('disabled', true);
                        $('#savePart').html(base.loadButton("Lưu"));
                    },
                    success: function (res) {
                        $('#savePart').prop('disabled', false);
                        $('#savePart').html("Lưu");
                        $("#exampleModal").modal('hide');
                        if (res.status) {
                            $("#Belong").append(new Option(res.newName, res.newId));
                            base.notification('success', res.message);
                        } else {
                            base.notification('error', res.message);
                        }
                    }
                })
            })
        },
        tblChapter: function () {
            var objTable = $("#tblChapter");
            objTable.bootstrapTable('destroy');
            objTable.bootstrapTable({
                method: 'get',
                url: '/Chapter/GetChapter',
                queryParams: function (p) {
                    var param = $.extend(true, {
                        limit: p.limit,
                        offset: p.offset,
                        idStory: $('#saveStoryId').val()
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
                paginationVAlign: 'both',
                search: false,
                pageSize: 50,
                pageList: [50, 100],
                reorderableRows: true,
                useRowAttrFunc: true,

                columns: [
                    {
                        field: "title",
                        title: "Tên",
                        align: 'left',
                        valign: 'left',
                    },
                    {
                        field: "part_Name",
                        title: "Phần",
                        align: 'left',
                        valign: 'left',
                    },
                    {
                        title: "Chức năng",
                        valign: 'middle',
                        align: 'center',
                        class: 'CssAction',
                        formatter: function (value, row, index) {
                            var action = "<div style='width: 200px;'>";
                            action += '<a href="/Chapter/CreateOrUpdate?idStory=' + row.storyId + '&idChapter=' + row.chapterId + '" class="btn btn-primary btn-sm btnEdit"><i class="fas fa-pen"></i></a>';
                            action += '<a href="/Chapter/Delete?Id=' + row.id + '" class="btn btn-danger btn-sm btnDelete ms-1"><i class="fas fa-times"></i></a>';
                            action += '</div>';
                            return action;
                        },
                        events: {
                            'click .btnDelete': function (e, value, row, index) {
                                $.confirm({
                                    title: 'Cảnh báo!',
                                    content: 'Bạn chắc chắn muốn xóa?',
                                    buttons: {
                                        formSubmit: {
                                            text: 'Xác nhận',
                                            btnClass: 'btn btn-primary',
                                            action: function () {
                                                $.ajax({
                                                    url: '/Chapter/Delete',
                                                    type: 'post',
                                                    data: {
                                                        id: row.id,
                                                    },
                                                    success: function (res) {
                                                        if (res.status) {
                                                            base.notification('success', res.message);
                                                            $("#tblChapter").bootstrapTable('refresh', { silent: true });
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
    Chapter.init();
});