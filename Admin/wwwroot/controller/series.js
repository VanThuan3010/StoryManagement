document.addEventListener('DOMContentLoaded', function () {
    var allStories = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];
    var seriesStories = ['B', 'C', 'D'];

    // Tạo danh sách truyện còn lại
    var remainingStories = allStories.filter(function (story) {
        return !seriesStories.includes(story);
    });

    // Hàm hiển thị truyện còn lại
    function displayStories(stories) {
        var storiesList = document.getElementById('storiesList');
        storiesList.innerHTML = ''; // Xóa các mục hiện có

        stories.forEach(function (story) {
            var li = document.createElement('li');
            li.className = 'list-group-item';
            li.dataset.id = story;
            li.textContent = 'Truyện ' + story;
            storiesList.appendChild(li);
        });
    }

    // Hiển thị truyện còn lại
    displayStories(remainingStories);

    // Hiển thị truyện trong series
    var seriesList = document.getElementById('seriesList');
    seriesStories.forEach(function (story) {
        var li = document.createElement('li');
        li.className = 'list-group-item';
        li.dataset.id = story;
        li.textContent = 'Truyện ' + story;
        seriesList.appendChild(li);
    });

    // Kích hoạt SortableJS
    Sortable.create(document.getElementById('storiesList'), {
        group: 'shared',
        animation: 150
    });

    Sortable.create(document.getElementById('seriesList'), {
        group: 'shared',
        animation: 150,
        onAdd: function (evt) {
            // Xử lý khi truyện được thêm vào series
            updateOrder();
        },
        onUpdate: function (evt) {
            // Xử lý khi thứ tự của truyện thay đổi
            updateOrder();
        }
    });

    function updateOrder() {
        var items = seriesList.getElementsByClassName('list-group-item');
        var order = [];

        for (var i = 0; i < items.length; i++) {
            order.push(items[i].dataset.id);
        }

        console.log('Thứ tự mới:', order.join(''));
    }

    // Tìm kiếm truyện
    document.getElementById('searchInput').addEventListener('input', function () {
        var query = this.value.toLowerCase();
        var filteredStories = remainingStories.filter(function (story) {
            return story.toLowerCase().includes(query);
        });

        displayStories(filteredStories);
    });
});