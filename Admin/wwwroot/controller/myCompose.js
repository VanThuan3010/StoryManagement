$(function () {
    window.myCompose = {
        init: function () {
            var originalImagePaths = [];
            myCompose.action();
            $('#ideal-tree').jstree({
                core: {
                    data: {
                        url: '/MyCompose/GetInfor',
                        dataType: 'json'
                    },
                    check_callback: true,
                    themes: { icons: true }
                },
                types: {
                    root: { icon: 'jstree-folder' },
                    child: { icon: 'jstree-file' }
                },
                plugins: ['wholerow', 'types']
            });
            $('#ideal-tree').on('select_node.jstree', function (e, data) {

                const tree = $('#ideal-tree').jstree(true);
                const node = data.node;

                // kiểm tra node có child hay không
                const hasChild = node.children && node.children.length > 0;

                if (hasChild) {
                    // ❌ có con → KHÔNG gọi ajax
                    return;
                }

                // ✅ node không có con (leaf) → GỌI AJAX
                const id = node.id;
                
                $.ajax({
                    url: '/MyCompose/GetDetail',
                    type: 'GET',
                    data: { Id: id },
                    success: function (res) {

                        if (!res || res.length === 0) return;

                        const data = res[0];

                        $('#idUpdate').val(data.id);
                        $('#txName').val(data.name);

                        if (CKEDITOR.instances.txtContent) {
                            CKEDITOR.instances.txtContent.setData(data.contents);
                            originalImagePaths = myCompose.extractImagePaths(data.contents);
                        }

                        $.ajax({
                            url: '/MyCompose/GetInfor',
                            type: 'GET',
                            success: function (res2) {
                                const $select = $('#belongTo');
                                $select.find('option').not('[value="0"]').remove();

                                res2
                                    .filter(x => x.level === 1)
                                    .forEach(x => {
                                        $select.append(
                                            `<option value="${x.id}" ${data.parentId == x.id ? 'selected' : ''}>
                            ${x.level} - ${x.text}
                         </option>`
                                        );
                                    });
                            }
                        });
                    }
                });
            });
        },
        action: function () {
            $('#btnCreate').on('click', function () {
                $('#txtIdModal').val(0);
                $('#txtName').val('');

                $.ajax({
                    url: '/MyCompose/GetInfor',
                    type: 'GET',
                    success: function (res) {

                        const $select = $('#sources');

                        // giữ option value = 0
                        $select.find('option').not('[value="0"]').remove();

                        // 🔴 res là ARRAY
                        res
                            .filter(x => x.level === 1)
                            .forEach(x => {
                                $select.append(
                                    `<option value="${x.id}">${x.level} - ${x.text}</option>`
                                );
                            });
                    }
                });

                $('#labelAction').text('Thêm mới');
                $('#modalCreateOrEdit').modal('show');
            });

            $('#btnSubmit').click(function () {
                var datas = new FormData();
                datas.append('Id', $('#txtIdModal').val());
                datas.append('Act', "Create");
                datas.append('Name', $('#txtName').val());
                datas.append('Content', "");
                datas.append('ParentId', $('#sources').val());
                datas.append('deletedImages', []);
                $.ajax({
                    url: '/MyCompose/CreateOrUpdate',
                    type: 'post',
                    processData: false,
                    contentType: false,
                    data: datas,
                    beforeSend: function () {
                        $('#btnSubmit').prop('disabled', true);
                        $('#btnSubmit').html(base.loadButton("Lưu"));
                    },
                    success: function (res) {
                        var retur = res.rows[0];
                        $('#btnSubmit').prop('disabled', false);
                        $('#btnSubmit').html("Lưu");
                        $('#modalCreateOrEdit').modal('hide');
                        if (retur.status == 'Success') {
                            base.notification('success', retur.message);
                            window.location.reload();
                        } else {
                            base.notification('error', retur.message);
                        }
                    }
                })
            });

            $('#btnSave').click(function () {
                const currentHtml = CKEDITOR.instances.txtContent.getData();
                var datas = new FormData();
                datas.append('Id', $('#idUpdate').val());
                datas.append('Act', "Update");
                datas.append('Name', $('#txName').val());
                datas.append('Content', currentHtml);
                datas.append('ParentId', $('#idPar').val());
                const currentImagePaths = extractImagePaths(currentHtml);
                const deletedImages = originalImagePaths.filter(
                    x => !currentImagePaths.includes(x)
                );
                datas.append('deletedImages', deletedImages);
                $.ajax({
                    url: '/MyCompose/CreateOrUpdate',
                    type: 'post',
                    processData: false,
                    contentType: false,
                    data: datas,
                    beforeSend: function () {
                        $('#btnSubmit').prop('disabled', true);
                        $('#btnSubmit').html(base.loadButton("Lưu"));
                    },
                    success: function (res) {
                        if (retur.status == 'Success') {
                            base.notification('success', retur.message);
                            window.location.reload();
                        } else {
                            base.notification('error', retur.message);
                        }
                    }
                })
            });
        },
        extractImagePaths: function () {
            const div = document.createElement('div');
            div.innerHTML = html;

            const imgs = div.querySelectorAll('img');
            return Array.from(imgs)
                .map(img => img.getAttribute('src'))
                .filter(src => src && src.startsWith('/uploads/compose/'));
        }
    }
});
$(document).ready(function () {
    myCompose.init();
});