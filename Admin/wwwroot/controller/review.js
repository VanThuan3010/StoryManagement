$(function () {
    window.Review = {
        init: function () {
            Review.action();
        },
        action: function () {
            $('#btnSave').on('click', function (e) {
                e.preventDefault();
                var ImagesDeletes = [];
                if ($('#saveReviewId').val() > 0) {
                    $.ajax({
                        url: '/Review/GetDetailReview',
                        type: 'post',
                        async: false,
                        data: {
                            id: $('#saveReviewId').val(),
                        },
                        success: function (res) {
                            const div = document.createElement("div");
                            div.innerHTML = (res.review || '') + (res.opening || '');

                            ImagesDeletes = Array.from(div.querySelectorAll("img"))
                                .map(img => img.getAttribute("src"))
                                .filter(src => src && src.includes("/uploads/review/"));
                        }
                    });
                }
                var formData = new FormData();
                formData.append("Id", $('#Id').val());
                formData.append("IdStory", $('#IdStory').val());
                formData.append("Review", base.convertToHTML(CKEDITOR.instances.txtReview.getData()));
                formData.append("Opening", base.convertToHTML(CKEDITOR.instances.txtOpening.getData()));
                // Lấy Img ở CKEditor để chuyển từ temp sang chapter
                formData.append("Images", JSON.stringify(Review.getImagesFromEditor()));
                // Lấy Img đã lưu để xóa nếu có
                formData.append("deleteImage", JSON.stringify(ImagesDeletes));
                $.ajax({
                    url: '/Review/CreateOrUpdate',
                    type: 'POST',
                    data: formData,
                    success: function (res) {
                        if (res.status) {
                            location.href = '/Story';
                        } else {
                            base.notification('error', res.message)
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error('Error:', status, error);
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                });
            })
        },
        getImagesFromEditor: function () {
            const html = CKEDITOR.instances.txtReview.getData();
            const html2 = CKEDITOR.instances.txtOpening.getData();

            const div = document.createElement("div");

            const div1 = document.createElement("div");
            div1.innerHTML = html;

            const div2 = document.createElement("div");
            div2.innerHTML = html2;

            div.appendChild(div1);
            div.appendChild(div2);

            return Array.from(div.querySelectorAll("img"))
                .map(img => img.getAttribute("src"))
                .filter(src => src && src.includes("/uploads/temp/"));
        }
    }
});
$(document).ready(function () {
    Review.init();
});

