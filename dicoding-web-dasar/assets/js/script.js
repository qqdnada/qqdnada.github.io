let menu = document.getElementById("side-button-menu");
menu.addEventListener("click", function() {

    let frame = document.getElementById("frame");

    if (screen.width < 1280) {
        frame.classList.toggle("show");
    }
    else {
        frame.classList.toggle("active");
    }

});

let overlay = document.getElementById("overlay");
overlay.addEventListener("click", function() {

    let frame = document.getElementById("frame");
    frame.classList.toggle("show");

});

let accordion = document.getElementById("accordion");
accordion.addEventListener("click", function() {

    let list = document.getElementById("hidden-list");

    let bold = document.getElementsByClassName("nav-icon")[0];
    bold.getElementsByTagName("a")[0];
    
    if (list.style.display == "block") {
        bold.style.fontWeight = "normal";
        list.style.display = "none";
    }
    else {
        bold.style.fontWeight = "bold";
        list.style.display = "block";
    }
});