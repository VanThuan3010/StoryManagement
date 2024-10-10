
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
        listChapter: function (){
            $.ajax({
                url: '/Chapter/GetChapter',
                type: 'get',
                data: {
                    limit: 10000,
                    offset: 0,
                    idStory: $('#txtIdStory').val()
                },
                success: function (res) {
                    if(res.total == 0){                        
                        $('#storyListChapter').html('<h3 style="color: red;">Không tìm thấy chương</h3>')
                    } else{
                        let groupedChapters = {};
                        res.data.forEach(chapter => {
                            let belongValue = chapter.belong;
                            if (!groupedChapters[belongValue]) {
                                groupedChapters[belongValue] = [];
                            }
                            groupedChapters[belongValue].push(chapter);
                            story.renderTable(res.data);
                        });
                    }
                },
                error:function(xhr, status, error){
                    console.error('Error:', status, error);
                },
                cache: false,
                contentType: false,
                processData: false
            });
        },
        renderTable: function(chapters) {
            const $container = $('<div></div>').addClass('container');
            let currentBelong = null;
            let $row = null;
        
            chapters.forEach((item, index) => {
                if (currentBelong !== item.belong && item.position == 1) {
                    currentBelong = item.belong;
                    if (item.belong != 1) {
                        const $belongRow = $('<div></div>').addClass('row mb-3');
                        const $belongCol = $('<div></div>').addClass('col-12 belong-cell').text(item.part_Name);
                        $belongRow.append($belongCol);
                        $container.append($belongRow);
                    }
                }

                if (index % 3 === 0) {
                    $row = $('<div></div>').addClass('row mb-3');
                    $container.append($row);
                }

                const $col = $('<div></div>').attr('title', item.title).addClass('col-md-4').css({'display': '-webkit-box','-webkit-line-clamp': 1,'-webkit-box-orient': 'vertical','overflow': 'hidden'});
                const $link = $('<a></a>').attr('href', '/Story/Chapter?idStory=' + item.idStory + '&idChapter=' + item.id).css({'text-decoration': 'none', 'color': 'black'}).text(item.title);
                $col.append($link);
                $row.append($col);
            });
        
            $('#storyListChapter').html($container);
        },
        renderPagination: function(total) {
            const totalPages = Math.ceil(total / 102);
            const $pagination = $('.pagination');
            $pagination.empty();
            
            const maxVisiblePages = 7;
            const currentPage = parseInt(currentPage) || 1;
        
            const createButton = (page, isActive = false) => {
                const $button = $('<button></button>')
                    .text(page)
                    .attr('data-page', page)
                    .on('click', function() {
                        currentPage = $(this).data('page');
                        story.listChapter((page - 1) * 102, 102);
                    });
        
                if (isActive) {
                    $button.css('font-weight', 'bold');
                }
        
                return $button;
            };
        
            const appendEllipsis = () => {
                $pagination.append($('<span>...</span>'));
            };
        
            // Add "Previous" button
            if (currentPage > 1) {
                $pagination.append(createButton(currentPage - 1).text('Pre'));
            }
        
            if (totalPages <= maxVisiblePages) {
                // Hiển thị tất cả các trang nếu tổng số trang ít hơn giới hạn hiển thị
                for (let i = 1; i <= totalPages; i++) {
                    $pagination.append(createButton(i, i === currentPage));
                }
            } else {
                // Hiển thị các trang dựa trên trang hiện tại
                const startPage = Math.max(1, currentPage - 2);
                const endPage = Math.min(totalPages, currentPage + 2);
        
                // Hiển thị trang đầu tiên
                $pagination.append(createButton(1, currentPage === 1));
        
                if (startPage > 2) {
                    appendEllipsis();
                }
        
                for (let i = startPage; i <= endPage; i++) {
                    $pagination.append(createButton(i, i === currentPage));
                }
        
                if (endPage < totalPages - 1) {
                    appendEllipsis();
                }
        
                // Hiển thị trang cuối cùng
                $pagination.append(createButton(totalPages, currentPage === totalPages));
            }
        
            // Add "Next" button
            if (currentPage < totalPages) {
                $pagination.append(createButton(currentPage + 1).text('Next'));
            }
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
