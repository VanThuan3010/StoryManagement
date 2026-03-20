$(function () {
    window.storySearch = {
        init: function () {
            storySearch.tblStorySearch();
            storySearch.action();
        },
        action: function () {
            $('#btnCreate').on('click', function () {
                // reset checkbox trước
                $('#ilChkTag').prop('checked', false);
                $('#ilChkContent').prop('checked', false);

                // fill textarea
                $('#txtIdModal').val(0);
                $('#txtSearchStory').val("");
                $('#txtResult').val("");
                $('#labelAction').text('Thêm mới');
                $('#modalCreateOrEdit').modal('show');
            });
            $('#btnSubmit').on('click', function () {
                $.ajax({
                    url: '/StorySearch/CreateOrUpdate',
                    method: 'POST',
                    data: {
                        Id: $('#txtIdModal').val(),
                        Request: $('#txtSearchStory').val(),
                        Result: JSON.stringify($('#txtResult').val().split(/\r?\n/).filter(line => line.trim() !== '')),
                        SearchBy: storySearch.getSearchBy()
                    },
                    success: function (res) {
                        if (res.status === "Success") {
                            $('#modalCreateOrEdit').modal('hide');
                            $('#tblSearch').bootstrapTable('refresh');
                        }
                    }
                });
            });
            $('#btnDelete').click(function () {
                var rows = $('#tblSearch').bootstrapTable('getSelections');
                if (rows.length === 0) {
                    alert("Chọn dữ liệu cần xóa");
                    return;
                }
                var ids = rows.map(x => ({ Id: x.id }));
                $.ajax({
                    url: '/StorySearch/Delete',
                    method: 'POST',
                    data: {
                        ids: JSON.stringify(ids)
                    },
                    success: function (res) {
                        if (res.status === "Success") {
                            $('#tblSearch').bootstrapTable('refresh');
                            $('#tblSearch').bootstrapTable('uncheckAll');
                            $('#btnDelete').prop('disabled', true);
                        }
                    }
                });
            });
        },
        toggleDeleteButton: function () {
            var rows = $('#tblSearch').bootstrapTable('getSelections');
            $('#btnDelete').prop('disabled', rows.length === 0);
        },
        getSearchBy: function () {
            var arr = [];
            if ($('#ilChkTag').is(':checked'))
                arr.push('Tag');
            if ($('#ilChkContent').is(':checked'))
                arr.push('Content');
            return arr.join(',');
        },
        tblStorySearch: function () {
            var objTable = $("#tblSearch");
            objTable.bootstrapTable('destroy');
            objTable.bootstrapTable({
                method: 'get',
                url: '/StorySearch/GetSearch',
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
                        checkbox: true,
                        align: 'center',
                        valign: 'middle',
                        onCheck: storySearch.toggleDeleteButton(),
                        onUncheck: storySearch.toggleDeleteButton(),
                        onCheckAll: storySearch.toggleDeleteButton(),
                        onUncheckAll: storySearch.toggleDeleteButton()
                    },
                    {
                        field: "request",
                        title: "Yêu cầu",
                        align: 'center',
                        valign: 'left',
                        width: 1000
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
                            'click .btnEdit': function (e, value, row, index) {
                                $('#txtIdModal').val(row.id);
                                $.ajax({
                                    url: '/StorySearch/GetDetail',
                                    data: {
                                        id: row.id
                                    },
                                    success: function (res) {
                                        if (!res || !res.rows || res.rows.length === 0) return;

                                        var data = res.rows;
                                        // reset checkbox trước
                                        $('#ilChkTag').prop('checked', false);
                                        $('#ilChkContent').prop('checked', false);
                                        // fill textarea
                                        $('#txtSearchStory').val(data.request);
                                        try {
                                            let resu = JSON.parse(data.result);
                                            if (Array.isArray(resu))
                                                $('#txtResult').val(resu.join("\n"));
                                            else
                                                $('#txtResult').val(data.result);
                                        } catch {
                                            $('#txtResult').val(data.result);
                                        }

                                        // xử lý SearchBy
                                        if (data.searchBy) {
                                            var arr = data.searchBy.split(',');
                                            $('#ilChkTag').prop('checked', arr.includes('Tag'));
                                            $('#ilChkContent').prop('checked', arr.includes('Content'));
                                        }
                                    }
                                });
                                $('#labelAction').text('Sửa thông tin');
                                $('#modalCreateOrEdit').modal('show');
                            },
                            'click .btnDelete': function (e, value, row, index) {
                                var ids = [{
                                    Id: row.id
                                }];
                                $.confirm({
                                    title: 'Cảnh báo!',
                                    content: 'Bạn chắc chắn muốn xóa tìm kiếm?',
                                    buttons: {
                                        formSubmit: {
                                            text: 'Xác nhận',
                                            btnClass: 'btn btn-primary',
                                            action: function () {
                                                $.ajax({
                                                    url: '/StorySearch/Delete',
                                                    method: 'POST',
                                                    data: {
                                                        ids: JSON.stringify(ids)
                                                    },
                                                    success: function (res) {
                                                        $('#tblSearch').bootstrapTable('refresh');
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
    storySearch.init();
});