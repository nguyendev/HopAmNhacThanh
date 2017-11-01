function LoadCategory() {
    debugger;
    $.ajax({
        type: "GET",
        url: "Sidebar/GetListCategory",
        //data: {userId: Id },
        contentType: "application/text;charset=utf-8",
        dataType: "text",
        success: function (data) {
            var result = "";
            var booksDiv = $('#list-category-widget').html('');
            //$.each(data.data, function (index, SimpleCategoryViewModel) {

            //    result += '<a asp-controller="category" asp-action="single" asp-route-slug="' + SimpleCategoryViewModel.Slug + '" ' +
            //        'class="list-group-item"><span class="badge">' + SimpleCategoryViewModel.Count +
            //        '</span><i class="fa fa-book"></i> ' + SimpleCategoryViewModel.Name + '</a>';
            //});
            booksDiv.html(data);
            $('#list-category-widget').css('display', 'block');
        },

        error: function () {
            alert('Error Category.');
        }
    });
};
function LoadAlbum() {
    debugger;
    $.ajax({
        type: "GET",
        url: "Sidebar/GetListAlbum",
        //data: {userId: Id },
        contentType: "application/text;charset=utf-8",
        dataType: "text",
        success: function (data) {
            var result = "";
            var booksDiv = $('#list-album-widget').html('');
            //$.each(data.data, function (index, SimpleAlbumViewModel) {

            //    result += '<li><a asp-controller="Album" asp-action="Single" asp-route-slug="' + SimpleAlbumViewModel.Slug + 
            //    '">'+SimpleAlbumViewModel.Name+'</a></li>';
            //});
            booksDiv.html(data);
            $('#list-album-widget').css('display', 'block');
        },

        error: function () {
            alert('Error Album');
        }
    });
};
function LoadStyle() {
    debugger;
    $.ajax({
        type: "GET",
        url: "Sidebar/GetListStyle",
        //data: {userId: Id },
        contentType: "application/text;charset=utf-8",
        dataType: "text",
        success: function (data) {
            var result = "";
            var booksDiv = $('#list-rhythm-widget').html('');
            //$.each(data.data, function (index, SimpleAlbumViewModel) {

            //    result += '<li><a asp-controller="Album" asp-action="Single" asp-route-slug="' + SimpleAlbumViewModel.Slug + 
            //    '">'+SimpleAlbumViewModel.Name+'</a></li>';
            //});
            booksDiv.html(data);
            $('#list-rhythm-widget').css('display', 'block');
        },

        error: function () {
            alert('error Style');
        }
    });
};

function LoadTopSong() {
    debugger;
    $.ajax({
        type: "GET",
        url: "Sidebar/GetListTopSong",
        //data: {userId: Id },
        contentType: "application/text;charset=utf-8",
        dataType: "text",
        success: function (data) {
            var result = "";
            var booksDiv = $('#list-top-song-widget').html('');
            //$.each(data.data, function (index, SimpleAlbumViewModel) {

            //    result += '<li><a asp-controller="Album" asp-action="Single" asp-route-slug="' + SimpleAlbumViewModel.Slug + 
            //    '">'+SimpleAlbumViewModel.Name+'</a></li>';
            //});
            booksDiv.html(data);
            $('#list-top-song-widget').css('display', 'block');
        },

        error: function () {
            alert('Error TopSong');
        }
    });
};
function LoadFanpageFacebook() {
    debugger;
    $.ajax({
        type: "GET",
        url: "Sidebar/GetFanpageFacebook",
        //data: {userId: Id },
        contentType: "application/text;charset=utf-8",
        dataType: "text",
        success: function (data) {
            var result = "";
            var booksDiv = $('#list-fanpage-facebook-widget').html('');
            //$.each(data.data, function (index, SimpleAlbumViewModel) {

            //    result += '<li><a asp-controller="Album" asp-action="Single" asp-route-slug="' + SimpleAlbumViewModel.Slug + 
            //    '">'+SimpleAlbumViewModel.Name+'</a></li>';
            //});
            booksDiv.html(data);
            $('#list-fanpage-facebook-widget').css('display', 'block');
        },

        error: function () {
            alert('Error FanpageFaceBook');
        }
    });
};




$(function () {
    LoadAlbum();
    LoadCategory();
    LoadStyle();
    LoadTopSong();
    //LoadFanpageFacebook();
});    
