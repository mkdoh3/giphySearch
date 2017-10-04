//would like to populate the 4 default insta-gif buttons randomly using an API (google trends??)
//add "Recent" text next to recent buttons
//add local storage options to remember recent searches
// format gif display







let searchQuery;
let recentSearches = [];
let resultsArray = [];
let stillImgURL;
let gifURL;



//api call to giphy base on searchQuery, limited to 10 results
function giphyCall() {
    return $.ajax({
        url: "https://api.giphy.com/v1/gifs/search?api_key=CDrewNwfN9TWDnXhucfwDmCGcZIfoVuy&q=" + searchQuery + "&limit=10&rating=PG-13",
        method: "GET"
    }).done(function (response) {
        //reset results array between calls. Needs to be empty in the case of a search with no results
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


//creat new img divs based on results from api call, set attributes for the different "still" img and gif img urls for the pause play function
function renderResults() {
    $(".results-field").empty();
    $.each(resultsArray, function (index, element) {
        let newIMG = $("<img>")
            .addClass("gif m-2")
            .attr("data-animate", element.images.fixed_height.url)
            .attr("data-still", element.images.fixed_height_still.url)
            .attr("src", element.images.fixed_height_still.url)
            .attr("data-state", "still")
        $(".results-field").append(newIMG);
    })
};

//handle no results
function ifNoResults() {
    $(".results-field").empty()
    $(".results-field").html("<h1>NO RESULTS</h1>")


}



// store only the last 6 recents searches in an array to be using to render recent buttons
function pushRecentSearches() {
    if (recentSearches.indexOf(searchQuery) === -1 && searchQuery.length > 0 && resultsArray.length > 0) {
        recentSearches.unshift(searchQuery);
    }
    if (recentSearches.length === 7) {
        recentSearches.splice(6, 1)
    }
}


//render buttons to be used as from quick search based on recent searches
function renderRecentButton() {

    $(".recent").empty();
    $.each(recentSearches, function (index, element) {
        let newButton = $("<button>")
            .addClass("btn btn-primary mb-2 ml-2")
            .text(element)
        $(".recent").append(newButton)
    })
};

//change data state and src attribute of images to switch between animated and still
function playPauseGif(imgElement) {
    let state = $(imgElement).attr("data-state");
    if (state === "still") {
        $(imgElement).attr("src", $(imgElement).attr("data-animate"));
        $(imgElement).attr("data-state", "animate");
    } else {
        $(imgElement).attr("src", $(imgElement).attr("data-still"));
        $(imgElement).attr("data-state", "still");
    }
};


$(document).on("click", ".btn-primary", function () {
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
