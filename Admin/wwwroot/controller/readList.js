let storyList = [];
let activeId = 0;

$(function () {
    loadReadList();
    $("#searchInput").on("keyup", function () {
        let q = $(this).val().toLowerCase();
        $(".rank-item").each(function () {
            let text = $(this).text().toLowerCase();
            $(this).toggle(text.indexOf(q) >= 0);
        });
    });
});

function loadReadList() {
    $.get("/Story/GetReadList", function (res) {
        storyList = res;
        renderList();
        if (storyList.length > 0)
            loadDetail(storyList[0].id);
    });
}

function renderList() {
    let html = "";
    storyList.forEach(function (s, index) {
        let pseuList = JSON.parse(s.pseudonym);
        let pseu = "";
        if (pseuList.length > 0) {
            pseu = pseuList.join("<br/>");
        }
        html += `<li class="rank-item ${index == 0 ? 'active' : ''}" data-id="${s.id}">
                    <div class="seal">${index + 1}</div>
                    <div class="rank-info">
                        <div class="title">${s.name}</div>
                        <div class="meta">${pseu}</div>
                    </div>
                </li>`;
    });
    $("#rankList").html(html);
    $(".rank-item").click(function () {
        $(".rank-item").removeClass("active");
        $(this).addClass("active");
        loadDetail($(this).data("id"));
    });
}

function loadDetail(id) {
    $.get("/Story/GetStoryDetail",
        { id: id },
        function (s) {
            activeId = id;
            renderDetail(s);
        });
}

function renderDetail(s) {
    let tags = [];
    if (s.tagList) {
        tags = JSON.parse(s.tagList);
    }

    let tagHtml = "";
    tags.forEach(function (t) {
        tagHtml += `<span class="tag-chip">${t}</span>`;
    });
    let chapterHtml = "";
    try {
        let chapters = JSON.parse(s.numberChapter);
        chapters.forEach(function (c) {
            chapterHtml += `<div class="chapter-item">${c}</div>`;
        });
    } catch (e) {
        chapterHtml = `<div class="chapter-item">Không có thông tin</div>`;
    }
    let html = `<div class="detail-watermark">榜</div>
                <h2 class="detail-title">${s.name}</h2>
                <div class="detail-author">Tác giả:<span>${s.pseudonym == '[]' ? 'Không có thông tin' : s.pseudonym}</span></div>
                <div class="stat-row">
                    <div class="stat-card">
                        <div class="label">Số chương</div>
                        <div class="value">${chapterHtml}</div>
                    </div>
                </div>
                <div class="tag-section">
                    <div class="section-label">Tag</div>
                    <div class="tags">${tagHtml}</div>
                </div>
                <div>
                    <div class="section-label">Review</div>
                    <div class="review-block">
                        <div class="review-glyph">评</div>
                        <div class="review-text">${s.review == null ? '' : s.review}</div>
                    </div>
                </div>`;
    $("#detailPanel").html(html);
}