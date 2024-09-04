
$(function () {
    window.story = {
        init: function () {
            story.tblListChapter();
            const tabs = document.querySelectorAll('.navtab');
            const contents = document.querySelectorAll('.content');
            const underline = document.querySelector('.underline');

            function updateUnderline() {
                const activeTab = document.querySelector('.navtab.active');
                underline.style.width = `${activeTab.offsetWidth}px`;
                underline.style.left = `${activeTab.offsetLeft}px`;
            }

            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    const target = tab.getAttribute('data-target');
                    contents.forEach(content => {
                        if (content.id === target) {
                            content.classList.add('active');
                        } else {
                            content.classList.remove('active');
                        }
                    });
                    updateUnderline();
                });
            });

            window.addEventListener('resize', updateUnderline);
            updateUnderline();
        },

        action: function () {
        },
        tblListChapter: function () {
            var objTable = $("#tblStoryListChapter");
            objTable.bootstrapTable('destroy');
            objTable.bootstrapTable({
                method: 'get',
                url: '/Story/GetChapterStory',
                queryParams: function (p) {
                    var param = $.extend(true, {
                        limit: p.limit,
                        offset: p.offset,
                        idStory: $('#txtIdStory').val()
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
                pageInfo: false,
                pageSize: 100,
                pageList: [100],

                columns: [
                    {
                        field: "TitleLeft",
                        align: 'left',
                        valign: 'left',
                        formatter: function (value, row, index) {
                            var html = '';
                            html += '<a href="/Story/Chapter?idStory=">' + row.TitleLeft +'</a>';
                            return html;
                        },
                    },
                    {
                        field: "TitleRight",
                        align: 'left',
                        valign: 'left',
                        formatter: function (value, row, index) {
                            var html = '';
                            html += '<a href="/Story/Chapter?idStory=">' + row.TitleRight + '</a>';
                            return html;
                        },
                    },
                ],
                onLoadSuccess: function (data) {
                    datas = data.rows;
                    var options = objTable.bootstrapTable('getOptions');
                    var limit = options.pageSize;
                    var halfLimit = limit / 2;
                    var displayData = [];
                    var dataLeft;
                    var dataRight;
                    var halfLength;

                    if (data.length <= halfLimit) {
                        datas.forEach(function (item, index) {
                            displayData.push({
                                TitleLeft: item ? item.title : '',
                                TitleRight: ''
                            });
                        });
                    } else {
                        halfLength = halfLimit;
                        dataLeft = datas.slice(0, halfLength);
                        dataRight = datas.slice(halfLength);

                        for (var i = 0; i < halfLength; i++) {
                            displayData.push({
                                TitleLeft: dataLeft[i] ? dataLeft[i].title : '',
                                TitleRight: dataRight[i] ? dataRight[i].title : ''
                            });
                        }
                    }
                    var displayDatas = {};
                    displayDatas.total = data.total;
                    displayDatas.rows = displayData;
                    $('#tblStoryListChapter').bootstrapTable('load', displayDatas);
                },
            })
        },
    }
});
$(document).ready(function () {
    story.init();
});
