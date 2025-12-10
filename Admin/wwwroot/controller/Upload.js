/* ===================================
       UPLOAD + PREVIEW + BASE64
    ====================================*/
const fileInput = document.getElementById("fileInput");
const previewArea = document.getElementById("previewArea");
const clearBtn = document.getElementById("clearBtn");
const dropZone = document.getElementById("dropZone");

let uploadedFiles = []; // Array để lưu {file, dataUrl, numberValue}

function updatePreview() {
    previewArea.innerHTML = "";

    uploadedFiles.forEach((item, index) => {
        const div = document.createElement("div");
        const numImg = $('#saveNumberImg').val();
        div.className = "preview-card";
        div.innerHTML = `
        <div class="divUpload">
          <button class="delete-preview-btn" data-index="${index}">×</button>
          <img src="${item.dataUrl}">
          <div class="meta">${item.file.name} — ${Math.round(item.file.size / 1024)} KB</div>
          <input type="number"
                  class="number-input inputOrder"
                  data-index="${index}"
                  value="${Number(numImg) + 1}"
                  min="1">
          <div style="display: flex; margin-top: 5px; gap: 10px;">
            <button style="width: 80px;" class="insertImg">Chèn</button>
            <button style="width: 80px;" class="pressImg">Đè</button>
          </div>
        </div>
        `;
        previewArea.appendChild(div);
    });
}

function handleFiles(files) {
    const fileArray = Array.from(files).filter(f => f.type.startsWith("image/"));

    let processed = 0;
    fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            uploadedFiles.push({
                file: file,
                dataUrl: dataUrl,
                numberValue: 1
            });

            processed++;
            if (processed === fileArray.length) {
                updatePreview();
            }
        };
        reader.readAsDataURL(file);
    });
}

fileInput.onchange = (e) => handleFiles(e.target.files);

// Xử lý sự kiện xóa
previewArea.onclick = (e) => {
    if (e.target.classList.contains("delete-preview-btn")) {
        const index = Number(e.target.dataset.index);
        uploadedFiles.splice(index, 1);
        updatePreview();
    }
};

// Xử lý thay đổi input number
previewArea.addEventListener('input', (e) => {
    if (e.target.classList.contains("number-input")) {
        const index = Number(e.target.dataset.index);
        uploadedFiles[index].numberValue = Number(e.target.value);
    }
});

// drag-drop
["dragenter", "dragover"].forEach(evt => {
    dropZone.addEventListener(evt, e => {
        e.preventDefault();
        dropZone.style.borderColor = "#5fa8f0";
    });
});
["dragleave", "drop"].forEach(evt => {
    dropZone.addEventListener(evt, e => {
        e.preventDefault();
        dropZone.style.borderColor = "#ccc";
    });
});
dropZone.addEventListener("drop", e => {
    fileInput.files = e.dataTransfer.files;
    handleFiles(e.dataTransfer.files);
});

clearBtn.onclick = () => {
    uploadedFiles = [];
    previewArea.innerHTML = "";
    fileInput.value = "";
};

/* ===================================
  GALLERY + MODAL
====================================*/
let galleryImages = [];
const galleryList = document.getElementById("galleryList");

function renderGallery() {
    galleryList.innerHTML = "";

    galleryImages.forEach((item, index) => {
        const imgUrl = "/Comic/GetImage?path=" + encodeURIComponent(item.physicPath);
        galleryList.innerHTML += `
            <div class="gallery-item">
                <img src="${imgUrl}"
                     data-index="${index}" 
                     data-id="${item.id}" alt="${item.name}" title="${item.order}">
                <button class="delete-btn" data-index="${index}" data-id="${item.id}" data-srcImg="${item.physicPath}" >X</button>
            </div>
        `;
    });
}

function addImageToGallery(base64) {
    galleryImages.push(base64);
    renderGallery();
}

// Modal viewer
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
let currentIndex = 0;

function openModal(i) {
    currentIndex = i;
    const imgUrl = "/Comic/GetImage?path=" + encodeURIComponent(galleryImages[i].physicPath);
    modalImg.src = imgUrl;
    modal.style.display = "flex";
    updateNavButtons();
}
//function openModal(i) {
//    currentIndex = i;
//    modalImg.src = galleryImages[i];
//    modal.style.display = "flex";
//}
function closeModal() { modal.style.display = "none"; }

document.getElementById("closeModal").onclick = closeModal;

document.getElementById("nextBtn").onclick = () => {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    const imgUrl = "/Comic/GetImage?path=" + encodeURIComponent(galleryImages[currentIndex].physicPath);
    modalImg.src = imgUrl;
    updateNavButtons();
};

document.getElementById("prevBtn").onclick = () => {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    const imgUrl = "/Comic/GetImage?path=" + encodeURIComponent(galleryImages[currentIndex].physicPath);
    modalImg.src = imgUrl;
    updateNavButtons();
};

modal.onclick = (e) => { if (e.target === modal) closeModal(); };

// Click gallery
galleryList.onclick = (e) => {
    if (e.target.tagName === "IMG") {
        openModal(Number(e.target.dataset.index));
    }
    if (e.target.classList.contains("delete-btn")) {
        galleryImages.splice(Number(e.target.dataset.index), 1);
        renderGallery();
        closeModal();
    }
};

previewArea.addEventListener("click", function (e) {
    // Click nút INSERT
    if (e.target.classList.contains("insertImg")) {
        const index = getItemIndex(e.target);
        if (index !== null) {
            const fileData = uploadedFiles[index];
            const numberValue = getInputValue(index);

            var datas = new FormData();
            datas.append('Id', 0);
            datas.append('IdChapter', $('#saveIdChapter').val());
            datas.append('Img', fileData.dataUrl);
            datas.append('order', numberValue);
            datas.append('IdStory', $('#saveIdStory').val());
            datas.append('Type', "Insert");
            $.ajax({
                url: '/Comic/CRUDComic',
                type: 'post',
                processData: false,
                contentType: false,
                data: datas,
                success: function (res) {
                    reloadGallery();
                    $('#clearBtn').click();
                }
            });
        }
    }

    // Click nút PRESS
    if (e.target.classList.contains("pressImg")) {
        const index = getItemIndex(e.target);
        if (index !== null) {
            const fileData = uploadedFiles[index];
            const numberValue = getInputValue(index);

            var datas = new FormData();
            datas.append('Id', 0);
            datas.append('IdChapter', $('#saveIdChapter').val());
            datas.append('Img', fileData.dataUrl);
            datas.append('order', numberValue);
            datas.append('IdStory', $('#saveIdStory').val());
            datas.append('Type', "Press");
            $.ajax({
                url: '/Comic/CRUDComic',
                type: 'post',
                processData: false,
                contentType: false,
                data: datas,
                success: function (res) {
                    reloadGallery();
                    $('#clearBtn').click();
                }
            });
        }
    }
});

function getItemIndex(btn) {
    const card = btn.closest(".preview-card");
    if (!card) return null;
    const input = card.querySelector(".number-input");
    return input ? Number(input.dataset.index) : null;
}

function getInputValue(index) {
    const input = previewArea.querySelector(`.number-input[data-index="${index}"]`);
    return input ? Number(input.value) : 1;
}

function reloadGallery() {

    let chapterId = $("#saveIdChapter").val();

    galleryImages = [];
    galleryList.innerHTML = "";

    $.ajax({
        url: '/Comic/GetComicImages',
        type: 'GET',
        data: { IdChapter: chapterId },
        success: function (res) {

            if (!res || !res.list) return;
            $('#saveNumberImg').val(res.total);
            galleryImages = res.list;

            renderGallery();
        }
    });
}

reloadGallery();

galleryList.addEventListener("click", (e) => {
    if (!e.target.classList.contains("delete-btn")) return;

    const id = e.target.dataset.id;
    const index = e.target.dataset.index;

    $.confirm({
        title: 'Cảnh báo!',
        content: 'Bạn chắc chắn muốn xóa ảnh?',
        buttons: {
            formSubmit: {
                text: 'Xác nhận',
                btnClass: 'btn btn-primary',
                action: function () {
                    $.ajax({
                        url: '/Comic/DeleteComicImage',
                        type: 'post',
                        data: {
                            id: id
                        },
                        success: function (res) {
                            if (res.status) {
                                // Xóa khỏi giao diện
                                galleryImages.splice(index, 1);
                                renderGallery();
                                closeModal();

                                base.notification('success', res.message);
                            } else {
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
});

function updateNavButtons() {
    if (galleryImages.length === 0) return;

    // Disable Prev nếu đang ở ảnh đầu
    if (currentIndex <= 0) {
        document.getElementById("prevBtn").style.opacity = "0.3";
        document.getElementById("prevBtn").style.pointerEvents = "none";
    } else {
        document.getElementById("prevBtn").style.opacity = "1";
        document.getElementById("prevBtn").style.pointerEvents = "auto";
    }

    // Disable Next nếu đang ở ảnh cuối
    if (currentIndex >= galleryImages.length - 1) {
        document.getElementById("nextBtn").style.opacity = "0.3";
        document.getElementById("nextBtn").style.pointerEvents = "none";
    } else {
        document.getElementById("nextBtn").style.opacity = "1";
        document.getElementById("nextBtn").style.pointerEvents = "auto";
    }
}
