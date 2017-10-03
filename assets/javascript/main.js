//would like to populate the 4 default insta-gif buttons randomly using an API (google trends??)
//add "Recent" text next to recent buttons
//add local storage options to remember recent searches
// format gif display







let searchQuery;
let recentSearches = [];
let resultsArray = [];
let stillImgURL;
let gifURL;



function giphyCall() {
    return $.ajax({
        url: "https://api.giphy.com/v1/gifs/search?api_key=CDrewNwfN9TWDnXhucfwDmCGcZIfoVuy&q=" + searchQuery + "&limit=10&rating=PG-13",
        method: "GET"
    }).done(function (response) {
        resultsArray = [];
        if (response.data.length > 0) {
            resultsArray = response.data;
            renderResults();
        } else {
            ifNoResults();
        }
    }).fail(function (err) {
        throw err;
    });
}



function renderResults() {
    $(".results-field").empty();
    $.each(resultsArray, function (index, element) {
        let newIMG = $("<img>")
            .addClass("gif")
            .attr("data-animate", element.images.fixed_height.url)
            .attr("data-still", element.images.fixed_height_still.url)
            .attr("src", element.images.fixed_height_still.url)
            .attr("data-state", "still")
        $(".results-field").append(newIMG);
    })
};

function ifNoResults() {
    console.log("hi")
    $(".results-field").empty()
    $(".results-field").html("<h1>NO RESULTS</h1>")


}



function pushRecentSearches() {
    console.log("results array inside pushrecent", resultsArray)
    if (recentSearches.indexOf(searchQuery) === -1 && searchQuery.length > 0 && resultsArray.length > 0) {
        recentSearches.unshift(searchQuery);
    }
    if (recentSearches.length === 7) {
        recentSearches.splice(6, 1)
    }
    console.log(recentSearches)
}



function renderRecentButton() {

    $(".recent").empty();
    $.each(recentSearches, function (index, element) {
        let newButton = $("<button>")
            .addClass("btn btn-primary mb-2 ml-2")
            .text(element)
        $(".recent").append(newButton)
    })
};


function playPauseGif(imgElement) {
    console.log(imgElement)
    let state = $(imgElement).attr("data-state");
    console.log(state)
    if (state === "still") {
        $(imgElement).attr("src", $(imgElement).attr("data-animate"));
        $(imgElement).attr("data-state", "animate");
    } else {
        $(imgElement).attr("src", $(imgElement).attr("data-still"));
        $(imgElement).attr("data-state", "still");
    }
};


$(document).on("click", ".btn-primary", function () {
    console.log($(this).text())
    searchQuery = $(this).text();
    giphyCall();
});



$("#go-button").on("click", function () {
    searchQuery = $(".form-control").val().trim();
    giphyCall();

    //gotta be a better why to do this right?? had to set a timeout so that pushRecent and renderRecent happen after the ajax call is done, but I couldnt write it into the ajax done function without screwing up more of the code. namely, btn-primary clicks and go-button clicks would need different ajax functions
    setTimeout(function () {
        pushRecentSearches();
        renderRecentButton();

    }, 500)
    $(".form-control").val("")
});



$(document).on("click", ".gif", function () {
    playPauseGif(this);
});
