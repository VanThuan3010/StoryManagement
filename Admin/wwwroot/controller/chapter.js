$(function () {
    window.Chapter = {
        savedImages : [],
        init: function () {
            if ($('#Id').val() > 0) {
                Chapter.savedImages = Chapter.getEditorImages();
            }
            Chapter.action();
            Chapter.tblChapter();
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
                $('#partChapterName').val($(this).text().trim());
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
                        $("#exampleModal").modal('hide');
                        if (res.status) {
                            var opt = $("#Belong option[value='" + res.newId + "']");
                            if (opt.length > 0) {
                                opt.text(res.newName);
                                $("#partList option[value='" + res.newId + "']").text(res.newName);
                            } else {
                                $("#Belong").append(new Option(res.newName +" (0)", res.newId));
                                $("#partList").append(new Option(res.newName, res.newId));
                            }
                            base.notification('success', res.message);
                        } else {
                            base.notification('error', res.message);
                        }
                    }
                })
            })
            $('#SaveChap').on('click', function(e){
                e.preventDefault();
                var ImagesInEditor = Chapter.getEditorImages();

                // Ảnh cũ bị xóa
                var OldImagesDelete = Chapter.savedImages
                    .filter(x => !ImagesInEditor.includes(x));

                // Ảnh upload mới nhưng đã bị xóa khỏi editor
                var NewImagesDelete = base.uploadImages
                    .filter(x => !ImagesInEditor.includes(x));

                // Gộp lại
                var ImagesDeletes = [
                    ...OldImagesDelete,
                    ...NewImagesDelete
                ];
                ImagesDeletes = ImagesDeletes.map(img => img.split('/').pop());

                var formData = new FormData();
                formData.append("Id", $('#Id').val());
                formData.append("StoryId", $('#StoryId').val());
                formData.append("Title", $('#txtTitle').val());
                formData.append("Belong", $('#Belong').val());
                formData.append("Content", base.convertToHTML(CKEDITOR.instances.txtContent.getData()));
                formData.append("RawContent", base.convertToHTML(CKEDITOR.instances.txtRawContent.getData()));
                formData.append("OrderTo", $('#searchOrder').val() == '' ? 1 : $('#searchOrder').val());
                formData.append("deleteImage", JSON.stringify(ImagesDeletes));
                $.ajax({
                    url: '/Chapter/CreateOrUpdate',
                    type: 'POST',
                    data: formData,
                    success: function (res) {
                        if (res.status) {
                            base.uploadImages.length = 0;
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
        getEditorImages: function () {
            const html = CKEDITOR.instances.txtContent.getData();
            const div = document.createElement("div");
            div.innerHTML = html;
            return Array.from(div.querySelectorAll("img"))
                .map(img => img.getAttribute("src"))
                .filter(src => src && src.includes("/chapter-images/"));
        }
    }
    window.ImportTxt = {
        indexChapter: 0,
        upload: function () {
            if ($('#txtFile')[0].files.length === 0) {
                base.notification("error", "Vui lòng Upload file text");
                return;
            }
            let file = $('#txtFile')[0].files[0];
            let fd = new FormData();
            fd.append('file', file);

            $.ajax({
                url: '/Chapter/UploadTxt',
                type: 'POST',
                data: fd,
                processData: false,
                contentType: false,
                success: function (res) {
                    if (res.status) {
                        $('#saveIndexChapter').val(0);
                        ImportTxt.load();
                    }
                }
            });
        },
        load: function () {
            let index = Number($('#saveIndexChapter').val());
            $.get('/Chapter/GetImportChapter', { index: index }, function (res) {
                if (!res.status) return;

                $('#txtTitleChapter').text(res.data.chapterTitle);
                CKEDITOR.instances.importEditor.setData(res.data.content);
                $('#btnNext').prop('disabled', res.data.isLastChapter == 1);
                $('#isLastChapter').val(res.data.isLastChapter);
                $('#importModal').modal('show');
            });
        },
        Save: function () {
            $.post('/Chapter/CreateOrUpdate', {
                Id: 0,
                StoryId: $('#saveStoryId').val(),
                Title: $('#txtTitleChapter').text(),
                Belong: $('#BelongPart').val(),
                Content: base.convertToHTML(CKEDITOR.instances.importEditor.getData()),
                RawContent: null,
                OrderTo: $('#orderChapter').val() || 1,
                Images: JSON.stringify([]),
                deleteImage: JSON.stringify([])
            }, function (res) {
                if (res.status) {
                    base.notification('success', res.message);
                    if ($('#isLastChapter').val() == 0) {
                        $('#orderChapter').val(res.numberChapter + 1);
                        $('#BelongPart').val(res.belong);
                        ImportTxt.nextIndex();
                    } else {
                        $('#importModal').modal('hide');
                        window.location.reload();
                    }
                } else {
                    base.notification('error', res.message);
                }
            }).fail(function (xhr, status, error) {
                console.error('Error:', status, error);
                base.notification('error', "Có lỗi xảy ra, vui lòng thử lại.");
            });
        },
        Next: function () {
            ImportTxt.nextIndex();
        },
        nextIndex: function () {
            let index = Number($('#saveIndexChapter').val());
            $('#saveIndexChapter').val(index + 1);
            ImportTxt.load();
        },
        extractChapterImagePaths: function (html) {
            const div = document.createElement('div');
            div.innerHTML = html || '';

            const imgs = div.querySelectorAll('img');

            return Array.from(imgs)
                .map(img => img.getAttribute('src'))
                .filter(src =>
                    src &&
                    src.startsWith('/uploads/chapter/')
                );
        }
    };
});
$(document).ready(function () {
    Chapter.init();
});