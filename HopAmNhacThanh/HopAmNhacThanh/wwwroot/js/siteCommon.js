function bodyLoad() {


    chord = "(([A-G][b#]?)((7sus4|7sus2|sus4|sus2|dim|aug|add9|m7M|maj7|m9|m7|m6|m|7M|9|7|6|4|11|m11)?(\\s*[-/]?\\s*)))";
    openBracket = "[\\[\\(]";
    closeBracket = "[\\]\\)]";
    reOneChord = new RegExp(chord, "g");
    reChords = new RegExp(openBracket + "(" + chord + "+)" + closeBracket, "g");
    document.body.innerHTML = document.body.innerHTML.replace(reChords, "<span class=chord>$&</span>");
    $('.lyric br').replaceWith(' ');
}
$(function () {
    bodyLoad();
    //render_tab_chords();
});