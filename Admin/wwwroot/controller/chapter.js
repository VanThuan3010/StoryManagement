$(function () {
    window.Chapter = {
        init: function () {
            Chapter.action();
            Chapter.tblChapter();
            Chapter.renderPartChapter();
            $('#btnCreate').on('click', function () {
                window.location.href = '/Chapter/CreateOrUpdate?idStory=' + $('#saveStoryId').val() + '&idChapter=0';
            });
            $('#btnBack').on('click', function (e) {
                e.preventDefault();
                base.deleteNotSavedImages();
                window.location.href = '/Chapter/index?idStory=' + $('#StoryId').val();
            });
            window.addEventListener("beforeunload", function () {
                base.deleteNotSavedImages();
                window.location.href = '/Chapter/index?idStory=' + $('#StoryId').val();
            });
            if ($('#slPatch').length <= 0 || ($('#slPatch').length > 0 && $('#slPatch option').length <= 0)) {
                if ($('#btnGetPatch').length > 0) {
                    $('#btnGetPatch').prop('disabled', true);
                }
                if ($('#btnDelPatch').length > 0) {
                    $('#btnDelPatch').prop('disabled', true);
                }
            }
            if ($("#flexSwitchCheckDefault").length > 0) {
                $("#flexSwitchCheckDefault").on("change", function () {
                    const label = $('label[for="flexSwitchCheckDefault"]');
                    if ($(this).prop("checked")) {
                        label.text("Hoán vị");
                    } else {
                        label.text("Chèn");
                    }
                });
            }
        },

        action: function () {
            $('#addByText').click(function () {
                $.ajax({
                    url: '/Chapter/AddByText',
                    type: 'post',
                    data: { id: $('#saveStoryId').val() },
                    success: function (res) {
                        if (res.status) {
                            base.notification('success', res.message);
                        } else {
                            base.notification('error', res.message);
                        }
                    }
                })
            })
            $('#partList').change(function () {
                $('#idPartChaptCU').val($(this).val());
                if ($(this).val() == 0) {
                    $('#partChapterName').val("");
                    $('#example1ModalLabel').text('Thêm phần mới');
                } else {
                    let name = $(this).find(':selected').data('name');
                    $('#partChapterName').val(name);
                    $('#example1ModalLabel').text('Sửa tên phần');
                }
            })
            $('#btnSearchChapter').click(function () {
                $.ajax({
                    url: '/Chapter/SearchByOrder',
                    type: 'post',
                    data: { id: $('#saveStoryId').val(), Order: $('#searchOrder').val() },
                    success: function (res) {
                        if (res.status) {
                            $('#titleFound').text(res.title);
                            $('#searchBelong').val(res.belong);
                        } else {
                            base.notification('success', res.message);
                        }
                    }
                })
            })
            $('#resetPosition').click(function () {
                $.ajax({
                    url: '/Chapter/ResetPosition',
                    type: 'post',
                    data: { idStory: $('#StoryId').val() },
                    beforeSend: function () {
                        $('#resetPosition').prop('disabled', true);
                    },
                    success: function (res) {
                        $('#resetPosition').prop('disabled', false);
                        $("#tblChapter").bootstrapTable('refresh');
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
                    url: '/Chapter/CreateOrUpdatePartChapter',
                    type: 'post',
                    data: {
                        idStory: $('#idStoryAddPartChapt').val(),
                        idPart: $('#idPartChaptCU').val(),
                        name: $('#partChapterName').val().trim()
                    },
                    beforeSend: function () {
                        $('#savePart').prop('disabled', true);
                        $('#savePart').html(base.loadButton("Lưu"));
                    },
                    success: function (res) {
                        $('#savePart').prop('disabled', false);
                        $('#savePart').html("Lưu");
                        if (res.status) {
                            //var opt = $("#Belong option[value='" + res.newId + "']");
                            //if (opt.length > 0) {
                            //    opt.text(res.newName);
                            //    $("#partList option[value='" + res.newId + "']").text(res.newName);
                            //} else {
                            //    $("#Belong").append(new Option(res.newName +" (0)", res.newId));
                            //    $("#partList").append(new Option(res.newName, res.newId));
                            //}
                            Chapter.renderPartChapter();
                            $("#exampleModal").modal('hide');
                            base.notification('success', res.message);
                        } else {
                            base.notification('error', res.message);
                        }
                    }
                })
            })
            $('#SaveChap').on('click', function(e){
                e.preventDefault();

                var formData = new FormData();
                formData.append("Id", $('#Id').val());
                formData.append("StoryId", $('#StoryId').val());
                formData.append("Title", $('#txtTitle').val());
                formData.append("Belong", $('#Belong').val());
                formData.append("Content", $('#txtContent').val());
                formData.append("RawContent", $('#txtRawContent').val());
                formData.append("OrderTo", $('#searchOrder').val() == '' ? 1 : $('#searchOrder').val());
                $.ajax({
                    url: '/Chapter/CreateOrUpdate2',
                    type: 'POST',
                    data: formData,
                    success: function (res) {
                        if (res.status) {
                            location.href = '/Chapter/index?idStory=' + $('#StoryId').val();
                        } else{
                            base.notification('error', res.message)
                        }
                    },
                    error:function(xhr, status, error){
                        console.error('Error:', status, error);
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                });
            })
            $('#uploadTxt').on('click', function (e) {
                window.location.href = '/Chapter/UploadByTxt?idStory=' + $('#saveStoryId').val();
            })
            $('#btnBegin').on('click', function (e) {
                $('#ModalImportTxt').modal('show');
            })
            $('#btnRead').on('click', function (e) {
                if ($('#inputUpTxt')[0].files.length === 0 && $('#inputTxtRaw')[0].files.length === 0) {
                    base.notification("error", "Vui lòng Upload file text");
                    return;
                }
                let fd = new FormData();
                fd.append('file', $('#inputUpTxt')[0].files[0]);
                fd.append('fileRaw', $('#inputTxtRaw')[0].files[0]);

                $.ajax({
                    url: '/Chapter/UploadTxt',
                    type: 'POST',
                    data: fd,
                    processData: false,
                    contentType: false,
                    success: function (res) {
                        if (res.status) {
                            $('#numberChaps').text(res.total);
                            $('#saveNumChap').val(res.total);
                            $('#inpReadF').attr('max', res.total);
                            $('#inpReadF').val(1);
                            $('#btnRead').prop('disabled', 1);
                            $('#btnSave').prop('disabled', 0);
                        } else {
                            base.notification("error", res.message);
                            return;
                        }
                    }
                });
            })
            $('#btnSave').on('click', function (e) {
                Chapter.getChapter(true);
                $('#inputUpTxt').val('');
                $('#btnSave').prop('disabled', 1);
                $('#SaveNCon').prop('disabled', 0);
                $('#ModalImportTxt').modal('hide');
            })
            $('#SaveNCon').on('click', function () {
                if (!$('#txtContent').val() && !$('#txtTitle').val() && !$('#txtRawContent').val() && !$('#txtTitleRaw').val()) {
                    base.notification('error', 'Vui lòng nhập title chương hoặc nội dung chương');
                    return;
                }

                Chapter.saveChapter()
                    .done(function (res) {

                        if (!res.status) {
                            base.notification('error', res.message);
                            return;
                        }
                        base.notification('success', 'Đã lưu chương');

                        let index = Number($('#saveChapNow').val());

                        if (index + 1 <= Number($('#saveNumChap').val())) {
                            $('#saveChapNow').val(index + 1);
                            Chapter.renderPartChapter();
                            Chapter.getChapter(false);
                        }
                        else {
                            Chapter.renderPartChapter();
                            base.notification('success', 'Đã lưu tới chương cuối cùng');

                            $('#txtTitle').val("");
                            $('#txtContent').val("");
                            $('#txtTitleRaw').val("");
                            $('#txtRawContent').val("");

                            $('#inpReadF').prop('disabled', true);
                        }
                    })
                    .fail(function (xhr, status, error) {
                        console.error(error);
                        base.notification('error', 'Lỗi khi lưu chương');
                    });
            });
            $('#btnCompare').on('click', function () {
                const oldText = $('#editor1').val();
                const newText = $('#editor2').val();
                if (newText.trim() === '') {
                    base.notification('error', 'Vui lòng nhập nội dung chương mới để so sánh');
                    $('#editor2').focus();
                    return;
                }

                const originalModel =
                    monaco.editor.createModel(
                        oldText,
                        'plaintext'
                    );

                const modifiedModel =
                    monaco.editor.createModel(
                        newText,
                        'plaintext'
                    );

                diffEditor.setModel({
                    original: originalModel,
                    modified: modifiedModel
                });

                const patch = Diff.createPatch(
                    '',
                    oldText,
                    newText
                );
                // const content = Diff.applyPatch(originalContent, patch);
                // const parsed = Diff.parsePatch(patch);

                // const reversed = Diff.reversePatch(parsed);

                // const undo = Diff.applyPatch(
                //     B,
                //     Diff.formatPatch(reversed)
                // );

                //console.log(patch);
            });
            $('#btnSavePatch').on('click', function () {
                const oldText = $('#editor1').val();
                const newText = $('#editor2').val();
                if (newText.trim() === '') {
                    base.notification('error', 'Vui lòng nhập nội dung chương mới để so sánh');
                    $('#editor2').focus();
                    return;
                }
                if (oldText === newText) {
                    base.notification('info', 'Hai nội dung không có thay đổi');
                    return;
                }
                const originalModel =
                    monaco.editor.createModel(
                        oldText,
                        'plaintext'
                    );

                const modifiedModel =
                    monaco.editor.createModel(
                        newText,
                        'plaintext'
                    );

                diffEditor.setModel({
                    original: originalModel,
                    modified: modifiedModel
                });

                const patch = Diff.createPatch(
                    '',
                    oldText,
                    newText
                );
                //if ($('#txtPseudonym').val().trim() === '') {
                //    base.notification('error', "Hãy nhập bút danh");
                //    return;
                //}
                var datas = new FormData();
                datas.append('Id', $('#savePatchId').val());
                datas.append('ChapterId', $('#saveChapterId').val());
                datas.append('VerName', "");
                datas.append('Title', "");
                datas.append('Patch', patch);
                $.ajax({
                    url: '/ChapterPatch/CreateOrUpdate',
                    type: 'post',
                    processData: false,
                    contentType: false,
                    data: datas,
                    beforeSend: function () {
                        $('#btnSavePatch').prop('disabled', true);
                    },
                    success: function (res) {
                        $('#btnSavePatch').prop('disabled', false);
                        if (res.status) {
                            base.notification('success', res.message);
                            window.location.reload();
                        } else {
                            base.notification('error', res.message);
                        }
                    }
                })
            });
            $('#btnCreatePatch').on('click', function () {
                $('#editor2').val("");
                $('#savePatchId').val(0);
            });
            $('#btnGetPatch').on('click', function () {
                $.ajax({
                    url: "/ChapterPatch/GetDetail",
                    data: {
                        id: $('#slPatch').val()
                    },
                    success: function (res) {
                        $('#editor2').val(Diff.applyPatch($('#editor1').val(), res.patch));
                        $('#savePatchId').val($('#slPatch').val());
                    },
                    error: function () {
                        base.notification('error', 'Lỗi khi lấy bản vá');
                    }
                });
            });
            $('#btnDelPatch').on('click', function () {
                $.ajax({
                    url: "/ChapterPatch/Delete",
                    method: 'DELETE',
                    data: {
                        id: $('#slPatch').val()
                    },
                    success: function (res) {
                        base.notification('success', 'Xóa thành công');
                        location.reload();
                    },
                    error: function () {
                        base.notification('error', 'Lỗi khi lấy bản vá');
                    }
                });
            });
        },
        getChapter: function (isFirst = false) {
            let index = 0;
            if (isFirst) {
                index = Number($('#inpReadF').val());
                $('#saveChapNow').val(index);
            } else {
                index = Number($('#saveChapNow').val());
            }
            if (index > $('#saveNumChap').val()) {
                base.notification('error', 'Vượt quá số chương trong cả 2 file');
                return;
            }
            $.get('/Chapter/GetImportChapter', { index: index - 1 }, function (res) {
                if (!res.status) {
                    base.notification('error', res.message);
                    return;
                }
                const data = res.data;
                const dataRaw = res.dataRaw;

                $('#txtTitle').text(data?.chapterTitle ?? '');
                $('#txtContent').val(data?.content ?? '');

                $('#txtTitleRaw').text(dataRaw?.chapterTitle ?? '');
                $('#txtRawContent').val(dataRaw?.content ?? '');
            });
        },
        saveChapter: function () {
            var formData = new FormData();
            formData.append("Id", $('#Id').val());
            formData.append("StoryId", $('#StoryId').val());
            formData.append("Title", $('#txtTitle').val());
            formData.append("TitleRaw", $('#txtTitleRaw').val());
            formData.append("Belong", $('#Belong').val());
            formData.append("Content", $('#txtContent').val());
            formData.append("RawContent", $('#txtRawContent').val());
            formData.append("InsertOrExchange", $('#flexSwitchCheckDefault').is(':checked'));
            formData.append("OrderTo",
                $('#searchOrder').val() == '' ? 1 : $('#searchOrder').val());

            return $.ajax({
                url: '/Chapter/CreateOrUpdate2',
                type: 'POST',
                data: formData,
                cache: false,
                contentType: false,
                processData: false
            });
        },
        renderPartChapter: function () {

            const hasBelong = $('#Belong').length > 0;
            const hasPartList = $('#partList').length > 0;

            if (!hasBelong && !hasPartList) {
                return;
            }

            var formData = new FormData();
            formData.append("idStory", $('#StoryId').val());

            $.ajax({
                url: '/Chapter/GetPartChapter',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (res) {
                    if (res.status) {
                        $('#searchOrder').val(Number(res.chapterCount) + 1);
                        let html = '';

                        $.each(res.data, function (i, item) {
                            html += `<option value="${item.id}" data-name=" ${item.name}">
                                ${item.name} (${item.chapterCount} chương)
                             </option>`;
                        });

                        if (hasBelong) {
                            $('#Belong').html(html);
                        }

                        if (hasPartList) {
                            $('#partList').find('option:not([value="0"])').remove();
                            $('#partList').append(html);
                        }

                    } else {
                        base.notification("error", res.message);
                    }
                }
            });
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
                        width: 600,
                        formatter: function (value, row, index) {
                            try {
                                if (row.title && row.titleRaw) {
                                    return row.title + "<br>" + row.titleRaw;
                                } else {
                                    let valueToParse = "";
                                    if (row.title) {
                                        valueToParse = row.title;
                                    }
                                    if (row.titleRaw) {
                                        valueToParse = row.titleRaw;
                                    }
                                    return valueToParse;
                                }
                                return value;
                            } catch {
                                return value;
                            }
                        }
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
                            action += '<a href="/Chapter/VersionPatch?idChapter=' + row.chapterId + '" class="btn btn-primary btn-sm ms-1"><i class="fas fa-code-branch"></i></a>';
                            action += '<a href="javascript:void(0)" class="btn btn-danger btn-sm btnDelete ms-1"><i class="fas fa-times"></i></a>';
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
                                                let ImagesDelet = [];
                                                $.ajax({
                                                    url: '/Chapter/GetDetailChapter',
                                                    type: 'post',
                                                    data: {
                                                        idChapter: row.chapterId,
                                                    },
                                                    success: function (res) {
                                                        const div = document.createElement("div");
                                                        div.innerHTML = res.rows.content;
                                                        ImagesDelet = Array.from(div.querySelectorAll("img"))
                                                            .map(img => img.getAttribute("src"))
                                                            .filter(src => src && src.includes("/chapter-images/")).map(img => img.split('/').pop());
                                                        ImagesDelet = ImagesDelet.map(img => img.split('/').pop());
                                                        $.ajax({
                                                            url: '/Chapter/Delete',
                                                            type: 'post',
                                                            data: {
                                                                id: row.chapterId,
                                                                images: JSON.stringify(ImagesDelet)
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