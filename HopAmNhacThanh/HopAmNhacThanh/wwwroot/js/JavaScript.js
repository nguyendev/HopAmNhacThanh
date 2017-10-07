﻿function initNotificationBox() {
    initTipsy(), initNotificationHandler($(".notification-box"))
}

function songListLikeBtn(a) {
    var b = $(a),
        c = b.find("i"),
        d = b.hasClass("starred") ? "remove" : "add";
    Song.toggleFavorite(b.data("song-id"), void 0, d).done(function () {
        "add" == d ? (b.addClass("starred"), c.addClass("fa-star"), c.removeClass("fa-star-o")) : "remove" == d && (b.removeClass("starred"), c.removeClass("fa-star"), c.addClass("fa-star-o"))
    })
}

function songListPlaylistBtn(a) {
    var b = $(a),
        c = b.data("songId");
    b.hasClass("playlist-popup-attached") || (b.addClass("playlist-popup-attached"), ContextPopup.setPopup(b, "$playlistPop", "partial/song_partial/add_to_playlist/" + c, function () {
        initPlaylistPopup()
    }, function () {
        return b.offset().left + 200 > $("body").width() ? {
            top: b.offset().top - b.outerHeight() + 60,
            right: $("body").width() - b[0].getBoundingClientRect().right,
            left: "auto"
        } : {
                top: b.offset().top - b.outerHeight() + 60,
                left: b.offset().left,
                right: "auto"
            }
    }, !0))
}

function _asyncToGenerator(a) {
    return function () {
        var b = a.apply(this, arguments);
        return new Promise(function (a, c) {
            function d(e, f) {
                try {
                    var g = b[e](f),
                        h = g.value
                } catch (i) {
                    return void c(i)
                }
                return g.done ? void a(h) : Promise.resolve(h).then(function (a) {
                    d("next", a)
                }, function (a) {
                    d("throw", a)
                })
            }
            return d("next")
        })
    }
}

function openOnboarding() {
    $("#floating-onboard").addClass("nup"), Popup.openPartial("partial/onboarding_partial/intro")
}

function initPlaylistPopup() {
    var a, b = $("#playlist-notify"),
        c = $(".playlist-item"),
        d = $("#playlist-error"),
        e = $("#playlist-add-block"),
        f = $("#playlist-add-loading"),
        g = $("#playlist-add-error");
    $("#playlist-add-label").click(function () {
        $(this).hide(), $("#playlist-add").show(), $("#playlist-add-name").focus()
    }), $("#playlist-list").find(".checkbox").change(function () {
        var c = function (c) {
            b.find("span").text(c), b.addClass("show"), clearTimeout(a), a = setTimeout(function () {
                b.removeClass("show")
            }, 1e3)
        },
            d = $(this).data("songId");
        $(this).is(":checked") ? AjaxFactory.post("/ajax/ajax_playlist/song_playlist/add", {
            playlist_id: $(this).data("playlist-id"),
            song_id: d
        }).done(function () {
            c(lang("playlist.notify.added"))
        }).fail(function (a) {
            c(a.error)
        }) : AjaxFactory.post("/ajax/ajax_playlist/song_playlist/remove", {
            playlist_id: $(this).data("playlist-id"),
            song_id: d
        }).done(function () {
            c(lang("playlist.notify.removed"))
        }).fail(function (a) {
            c(a.error)
        })
    }), $("#playlist-search").keyup(function () {
        var a = $(this).val().toLowerCase();
        if (c.removeClass("hide"), d.hide(), a.length > 0) {
            var b = c.not('[data-search*="' + a + '"]');
            b.addClass("hide"), b.length == c.length && d.show()
        }
    }), $("#playlist-add-btn").click(function () {
        var a = function () {
            e.hide(), f.show()
        },
            b = function () {
                e.show(), f.hide()
            };
        a(), g.text("");
        var c = $("#playlist-add-name").val();
        return "" == c ? (g.html(lang("playlist.title.must.not.empty")), void b()) : void AjaxFactory.post("/ajax/ajax_playlist/create_playlist", {
            title: c,
            "private": $("#add-playlist-public").is(":checked") ? 0 : 1
        }).done(function () {
            $("#song-action-add").click().click()
        }).fail(function (a) {
            g.html(a.error)
        }).always(function () {
            b()
        })
    }), $("#playlist-add-name").keydown(function (a) {
        13 == a.keyCode && $("#playlist-add-btn").click()
    })
}

function initTipsy() {
    window.__IS_MOBILE || $(".tipsy-item:not([original-title])").tipsy({
        gravity: "s",
        offset: 3
    })
}

function initTagCanvas() {
    function a() {
        var a = $("#tag-canvas");
        a.tagcanvas({
            textColour: "#000",
            outlineColour: "#759cc0",
            reverse: !0,
            depth: .8,
            maxSpeed: .1,
            initial: [.1, -.1],
            weight: !0,
            wheelZoom: !1
        }, "tag-canvas-tags") || a.hide()
    }
    var b = parseInt($("#tag-canvas").attr("width")),
        c = b / 12,
        d = c / 4;
    AjaxFactory.post("/node/recent_keywords", {
        something: !0
    }).done(function (b) {
        for (var e = b.data, f = e[0][1], g = e[e.length - 1][1], h = (f - g) / (c - d), i = "", j = 0; j < e.length; j++) {
            var k = e[j][1],
                l = e[j][0],
                m = (k - g) / h + d;
            i += '<li><a href="search?q=' + l + '" style="font-size: ' + m + 'pt">' + l + "</a></li>"
        }
        $("#tag-canvas-tags").find("ul").append(i), a()
    })
}

function initNotificationHandler(a) {
    a.find(".notif-control-item.mark-as-read").click(function () {
        var a = $(this),
            b = a.parents(".notif-item").data("notif-id");
        AjaxFactory.post("ajax/ajax_notification/mark_as_read", {
            notif_id: b
        }).done(function (b) {
            a.parents(".notif-item").removeClass("unread");
            var c = +$("#profile-inbox-count").text() - 1;
            $("#profile-inbox-count").text(c), 0 === c && ($("#profile-inbox").removeClass("unread"), $("#profile-inbox-count").hide())
        })
    }), a.find(".notif-control-item.unfollow").click(function () {
        var a = $(this),
            b = a.parents(".notif-item").data("participant-id");
        AjaxFactory.post("ajax/ajax_notification/unfollow", {
            participant_id: b
        }).done(function (a) {
            $.growl.notice({
                title: "",
                message: lang("unfollow.done")
            })
        })
    }), a.find("#mark-all-as-read").click(function () {
        AjaxFactory.post("ajax/ajax_notification/mark_all_as_read", {
            something: "something"
        }).done(function (a) {
            $(".notif-item").removeClass("unread"), $("#profile-inbox").removeClass("unread"), $("#profile-inbox-count").text("0"), $("#profile-inbox-count").hide()
        })
    })
}

function resizeIframe() {
    if ($iframe = $iframe || $(".discussion-section").find("iframe")[0]) {
        var a = $iframe.contentWindow.$("#comment-section").height(),
            b = $iframe.contentWindow.$(".popup-window"),
            c = 0;
        if (b.length) {
            var d = b.map(function (a, b) {
                return $(b).offset().top + $(b).height()
            });
            c = Math.max.apply(Math, d)
        }
        var e = a > c ? a : c + 50;
        $iframe && e !== oldHeight && (oldHeight = e, $iframe.style.height = e + "px")
    }
}

function getKaraokeTitle(a) {
    return ucwords(toLowerCaseAscii(a)).replace(/[^A-Z0-9]/g, "")
}

function ucwords(a) {
    return a.toLowerCase().replace(/\b[a-z]/g, function (a) {
        return a.toUpperCase()
    })
}

function getSearchable(a) {
    return toLowerCaseAscii(a).toLowerCase().replace(/[^a-z0-9]/g, "")
}

function toUrlFriendly(a) {
    return toLowerCaseAscii(a).toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/ /g, "-")
}

function toLowerCaseAscii(a) {
    return a = a.toLowerCase(), a = a.replace(/Ã |Ã¡|áº¡|áº£|Ã£|Ã¢|áº§|áº¥|áº­|áº©|áº«|Äƒ|áº±|áº¯|áº·|áº³|áºµ/g, "a"), a = a.replace(/Ã¨|Ã©|áº¹|áº»|áº½|Ãª|á»|áº¿|á»‡|á»ƒ|á»…/g, "e"), a = a.replace(/Ã¬|Ã­|á»‹|á»‰|Ä©/g, "i"), a = a.replace(/Ã²|Ã³|á»|á»|Ãµ|Ã´|á»“|á»‘|á»™|á»•|á»—|Æ¡|á»|á»›|á»£|á»Ÿ|á»¡/g, "o"), a = a.replace(/Ã¹|Ãº|á»¥|á»§|Å©|Æ°|á»«|á»©|á»±|á»­|á»¯/g, "u"), a = a.replace(/á»³|Ã½|á»µ|á»·|á»¹/g, "y"), a = a.replace(/Ä‘/g, "d")
}

function getQueryVariable(a) {
    for (var b = window.location.search.substring(1), c = b.split("&"), d = 0; d < c.length; d++) {
        var e = c[d].split("=");
        if (e[0] == a) return e[1]
    }
    return !1
}

function getRedirectUrl() {
    var a = $("base").attr("href");
    return Login.isLoggedByPopup ? location.href.replace(a, "") : getQueryVariable("redirect") || ""
}

function toHHMMSS(a) {
    var b = parseInt(a, 10),
        c = Math.floor(b / 3600),
        d = 60 * c + Math.floor((b - 3600 * c) / 60),
        e = b - 3600 * c - 60 * d;
    return 10 > d && (d = "0" + d), 10 > e && (e = "0" + e), d + ":" + e
}

function isNumber(a) {
    return !isNaN(parseFloat(a)) && isFinite(a)
}

function simplifyChord(a) {
    return a ? (a = a.replace(/\db\d$/g, ""), a = a.replace(/\d#\d$/g, ""), a = a.replace(/maj/g, ""), a = a.replace(/sus/g, ""), a = a.replace(/dim/g, ""), a = a.replace(/aug/g, ""), a = a.replace(/add/g, ""), a = a.replace(/\d/g, ""), a = a.replace(/\/.*$/g, ""), a = a.replace(/^./, function (a) {
        return a.toUpperCase()
    }), a.trim()) : void 0
}

function transposeChord(a, b) {
    if ("undefined" != typeof a && "" != a) {
        a = a.toLowerCase(), a = a.replace(/\/./, function (a) {
            return a.toUpperCase()
        }), a = a.replace(/^./, function (a) {
            return a.toUpperCase()
        });
        var c = ["Db", "C#", "Eb", "D#", "Gb", "F#", "Ab", "G#", "Bb", "A#"],
            d = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        a = a.replace(/[DEGAB]b/, function (a) {
            return c[c.indexOf(a) + 1]
        });
        var e = a.replace(/[CDEFGAB]#?/g, function (a) {
            var c = (d.indexOf(a) + b) % d.length;
            return d[0 > c ? c + d.length : c]
        });
        return e = e.replace(/^A#/, "Bb").replace(/^D#/, "Eb")
    }
}

function getScrollTop() {
    var a = $(window).scrollTop();
    return 0 === a && (a = -1 * $("#top-nav-bar")[0].getClientRects()[0].top), a
}

function isIframe() {
    return window.top !== window
}

function initReportPopup() {
    if (!window._reportPopupInit) {
        var a = "",
            b = "",
            c = $("#report-problems").find(".checkbox"),
            d = "song";
        $("#send-report-song").click(function () {
            if (b = $("#report-comment").val(), d = $(this).data("type"), "" == b && "" == a) $("#report-error").text(lang("song.report.error.empty.msg"));
            else {
                $("#report-popup-form").hide(), $("#report-popup-loading").show();
                var c = {
                    content: b,
                    errors: a
                };
                "song" == d && (c.song_id = $("#song-info").data("song-id"), c.contribute_id = $("#song-info").data("contribute-id")), "artist" == d && (c.artist_id = $("#artist-info").data("id")), AjaxFactory.post("ajax/ajax_report/report_add/" + d, c).done(function (a) {
                    $("#report-popup-loading").html(lang("song.report.success.msg"))
                }).fail(function (a) {
                    $.growl.error({
                        title: "",
                        message: a.error
                    })
                })
            }
        }), c.click(function () {
            a = c.filter(":checked").next("label").map(function () {
                return $(this).text()
            }).get().join("|")
        })
    }
}

function initRhythmPopup(a) {
    $("#rhythm-vote").find(".rhythm-item").click(function () {
        var b = $("#display-rhythm"),
            c = $(this).data("rhythm"),
            d = $(this).data("id"),
            e = $(this).text(),
            f = $("#song-info").data("song-id");
        AjaxFactory.post("ajax/ajax_song/rhythm_vote", {
            song_id: f,
            rhythm_id: d
        }).done(function () {
            b.attr("data-rhythm", c), b.html(e), a.hide(), $.growl.notice({
                title: "",
                message: lang("song.rhythm.voted")
            })
        }).fail(function (b) {
            a.hide(), $.growl.error({
                title: "",
                message: b.error
            }), (b.code == AjaxFactory.code.UNAUTHORIZED || b.code == AjaxFactory.code.UNAUTHENTICATED) && Login.doLogin()
        })
    })
}

function initSharePopup() {
    $("#share-link").val(location.href).select().focus(), $("#embedded-code").val("TODO: support embedded here"), $("#share-facebook").click(function () {
        FB.ui({
            method: "share",
            href: location.href
        }, function (a) { })
    }), $("#share-google-plus").click(function () {
        window.open("https://plus.google.com/share?url=" + location.href, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=200, left=200, width=600, height=300")
    }), $("#share-twitter").click(function () {
        window.open("https://twitter.com/share?url=" + location.href, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=200, left=200, width=600, height=300")
    })
}

function loadFavoriteNote() {
    window.__LOGGED_IN && $("#song-favorite-btn").hasClass("starred") && AjaxFactory.post("/ajax/ajax_song/get_favorite_note", {
        song_id: $("#song-info").data("song-id"),
        contribute_id: $("#song-info").data("contribute-id")
    }).done(function (a) {
        $favoriteNote = $("#song-favorite-note"), a.data ? $favoriteNote.html(a.data).show() : $favoriteNote.hide(), $favoriteNotePopup.hide()
    })
}

function initFavoriteNote() {
    $("#favorite-note-save").click(function () {
        AjaxFactory.post("/ajax/ajax_song/favorite_note", {
            song_id: $("#song-info").data("song-id"),
            contribute_id: $("#song-info").data("contribute-id"),
            note: $("#favorite-note-content").val()
        }).done(function (a) {
            loadFavoriteNote()
        })
    }), $("#favorite-note-content").keypress(function (a) {
        13 === a.keyCode && $("#favorite-note-save").click()
    }), $("#favorite-note-save").focus()
}
var $$lang = {
    "common.language.code": "vi",
    "common.language.region": "vi_VN",
    "common.appname": "Há»£p Ã‚m Chuáº©n",
    "common.site.description": "Website tra cá»©u há»£p Ã¢m chuáº©n dÃ nh cho ngÆ°á»i chÆ¡i guitar, cung cáº¥p cÃ¡c cÃ´ng cá»¥ há»¯u Ã­ch khi tra cá»©u há»£p Ã¢m, kho dá»¯ liá»‡u vá»›i hÆ¡n 10,000 bÃ i hÃ¡t phá»• biáº¿n á»Ÿ Viá»‡t Nam.",
    "common.site.keyword": "há»£p Ã¢m, há»£p Ã¢m chuáº©n, há»£p Ã¢m guitar, há»£p Ã¢m chuáº©n guitar, thÆ° viá»‡n há»£p Ã¢m, bÃ i hÃ¡t cÃ³ há»£p Ã¢m, hop am, hop am chuan, hop am guitar, hop am chuan guitar, thu vien hop am, bai hat co hop am",
    "common.app.slogan": "ThÆ° viá»‡n há»£p Ã¢m lá»›n nháº¥t Viá»‡t Nam",
    "common.site.post.title": "Há»£p Ã‚m Chuáº©n - ThÆ° viá»‡n há»£p Ã¢m lá»›n nháº¥t Viá»‡t Nam",
    "common.homepage": "Trang chá»§",
    "common.search": "TÃ¬m kiáº¿m",
    "common.create.song": "ÄÄƒng bÃ i hÃ¡t",
    "common.create.song.title": "ÄÄƒng bÃ i hÃ¡t má»›i",
    "search.placeholder.1": 'Nháº­p "trinh cong son" Ä‘á»ƒ tÃ¬m bÃ i hÃ¡t cá»§a Trá»‹nh CÃ´ng SÆ¡n',
    "search.placeholder.2": 'Nháº­p "am, g, c, f" Ä‘á»ƒ tÃ¬m bÃ i hÃ¡t cÃ³ 4 há»£p Ã¢m nÃ y',
    "search.placeholder.3": 'Search kiá»ƒu Karaoke: "NNAD" Ä‘á»ƒ tÃ¬m bÃ i Náº¿u NhÆ° Anh Äáº¿n',
    "search.placeholder.4": "Nháº­p tÃªn bÃ i hÃ¡t hoáº·c ca sÄ© Ä‘á»ƒ tÃ¬m kiáº¿m",
    "search.placeholder.5": "Search gÃ¬ cÅ©ng Ä‘Æ°á»£c!",
    "common.enter.see": "Nháº¥n <b>Enter</b> Ä‘á»ƒ xem",
    "common.all": "táº¥t cáº£",
    "common.top.menu.songs": "BÃ i hÃ¡t",
    "common.top.menu.artists": "Ca sÄ© / Nháº¡c sÄ©",
    "common.top.menu.playlists": "Playlist",
    "common.top.menu.chords": "Há»£p Ã¢m",
    "common.top.menu.rhythms": "Äiá»‡u bÃ i hÃ¡t",
    "common.top.menu.find.by.chords": "TÃ¬m theo há»£p Ã¢m",
    "common.top.menu.apps": "Táº£i á»©ng dá»¥ng",
    "common.top.menu.request.songs": "YÃªu cáº§u há»£p Ã¢m",
    "common.top.menu.manage": "Quáº£n lÃ½",
    "common.notif.notifications": "ThÃ´ng bÃ¡o",
    "common.notif.mark.as.read": "ÄÃ¡nh dáº¥u Ä‘Ã£ Ä‘á»c",
    "common.setting": "CÃ i Ä‘áº·t",
    "common.see.all": "Xem táº¥t cáº£",
    "common.see.more": "Xem thÃªm",
    "common.view.count": "LÆ°á»£t xem",
    "common.comment.count": "LÆ°á»£t bÃ¬nh luáº­n",
    "common.find.all.songs.by": "TÃ¬m táº¥t cáº£ bÃ i hÃ¡t cá»§a %s",
    "common.error.cannot.load.content": "KhÃ´ng thá»ƒ táº£i Ä‘Æ°á»£c ná»™i dung, vui lÃ²ng thá»­ láº¡i!",
    "common.create.new": "Táº¡o má»›i",
    "common.expand": "Má»Ÿ rá»™ng",
    "common.collapse": "Thu nhá»",
    "common.not.found": "KhÃ´ng tÃ¬m tháº¥y",
    "common.help": "HÆ°á»›ng dáº«n",
    "common.policy": "Äiá»u khoáº£n",
    "common.report.suggest": "BÃ¡o lá»—i / GÃ³p Ã½",
    "common.report.contribute.info": "ÄÃ³ng gÃ³p thÃ´ng tin",
    "common.register": "ÄÄƒng kÃ½",
    "common.captcha": "MÃ£ xÃ¡c nháº­n",
    "common.this.page.will.redirect.after.x.seconds": "Trang nÃ y tá»± chuyá»ƒn sau %s giÃ¢y...",
    "common.click.here.to.redirect": "Nháº¥n vÃ o Ä‘Ã¢y Ä‘á»ƒ quay vá» trang trÆ°á»›c",
    "common.not.required": "KhÃ´ng báº¯t buá»™c",
    "common.use.to.reset.password": "DÃ¹ng Ä‘á»ƒ khÃ´i phá»¥c máº­t kháº©u",
    "common.forgot.password": "QuÃªn máº­t kháº©u",
    "common.please.login.to.report": "Vui lÃ²ng <a class='blue-link' href='javascript:window.top.Login.doLogin()'>ÄÄƒng nháº­p</a> hoáº·c <a class='blue-link' target='_blank' href='auth/register'>ÄÄƒng kÃ½</a> Ä‘á»ƒ bÃ¡o lá»—i / gÃ³p Ã½.",
    "common.failed": "KhÃ´ng thÃ nh cÃ´ng",
    "common.no.permission": "Báº¡n khÃ´ng cÃ³ quyá»n truy cáº­p trang nÃ y",
    "common.error": "Lá»—i",
    "common.error.connection": "Lá»—i káº¿t ná»‘i, vui lÃ²ng thá»­ láº¡i",
    "common.javascript.disabled": 'Vui lÃ²ng kÃ­ch hoáº¡t Javascript Ä‘á»ƒ sá»­ dá»¥ng Ä‘áº§y Ä‘á»§ chá»©c nÄƒng cá»§a Há»£p Ã‚m Chuáº©n.\n    Xem <b><a href="http://www.enable-javascript.com/"\n                    target="_blank">\n            hÆ°á»›ng dáº«n kÃ­ch hoáº¡t Javascript trÃªn trÃ¬nh duyá»‡t cá»§a báº¡n</a></b>.',
    "common.song.tools": "CÃ´ng cá»¥",
    "common.song.chords": "Há»£p Ã¢m",
    "common.song.related.videos": "Video bÃ i nÃ y",
    "common.song.good.songs": "BÃ i hÃ¡t hay",
    "common.song.related.songs": "BÃ i liÃªn quan",
    "common.song.recent.songs": "BÃ i hÃ¡t má»›i Ä‘Äƒng",
    "common.vote.count": "LÆ°á»£t vote",
    "common.not.allowed": "Nothing here. Please come back.",
    "common.no.content": "(ChÆ°a cÃ³)",
    "common.keyword": "Tá»« khÃ³a",
    "common.date.start": "Tá»« ngÃ y",
    "common.date.end": "Äáº¿n ngÃ y",
    "common.approve": "Duyá»‡t",
    "common.reject": "KhÃ´ng duyá»‡t",
    "notif.msg.song.approved": "BÃ i hÃ¡t <b>%s</b> cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c duyá»‡t bá»Ÿi <b>%s</b>",
    "notif.mark.as.read": "ÄÃ¡nh dáº¥u Ä‘Ã£ Ä‘á»c",
    "notif.unfollow": "Ngá»«ng theo dÃµi",
    "homepage.tab.charts": "Báº£ng xáº¿p háº¡ng",
    "homepage.tab.activities": "Hoáº¡t Ä‘á»™ng",
    "homepage.panel.hot.video": "Video hot",
    "homepage.panel.latest.songs": "Há»£p Ã¢m má»›i",
    "homepage.panel.latest.comments": "BÃ¬nh luáº­n má»›i",
    "homepage.panel.weekly.songs.week": "HOT trong tuáº§n",
    "homepage.panel.weekly.songs.month": "HOT trong thÃ¡ng",
    "homepage.panel.latest.requests": "YÃªu cáº§u má»›i",
    "homepage.panel.approving": "Äang chá» duyá»‡t",
    "homepage.panel.hot.keywords": "Tá»« khoÃ¡",
    "homepage.panel.song.rhythms": "Äiá»‡u bÃ i hÃ¡t",
    "homepage.panel.song.genres": "Thá»ƒ loáº¡i",
    "homepage.panel.song.playlists": "Playlist",
    "homepage.tab.playlist": "Tá»•ng há»£p Playlist",
    "homepage.panel.playlist.newestplaylist": "Playlist má»›i nháº¥t",
    "homepage.panel.playlist.randomplaylist": "Playlist ngáº«u nhiÃªn",
    "homepage.panel.playlist.hotmonthplaylist": "Playlist HOT trong thÃ¡ng",
    "homepage.panel.playlist.favoritesong": "BÃ i hÃ¡t yÃªu thÃ­ch cá»§a tÃ´i",
    "homepage.panel.playlist.favoriteplaylist": "Playlist cá»§a tÃ´i",
    "homepage.panel.playlist.suggestmonthplaylist": "Playlist Ä‘á» cá»­ cá»§a thÃ¡ng",
    "song.action.bar.add.to": "ThÃªm vÃ o",
    "song.action.bar.share": "Chia sáº»",
    "song.action.bar.report": "BÃ¡o lá»—i",
    "song.action.bar.contribute": "Chá»‰nh sá»­a há»£p Ã¢m",
    "song.action.bar.contribute.edit": "PhiÃªn báº£n cá»§a tÃ´i",
    "song.action.bar.print": "In ra giáº¥y",
    "song.detail.date.post": "ÄÄƒng ngÃ y %s",
    "song.detail.date.updated": "ngÃ y %s",
    "song.detail.rhythm": "Äiá»‡u",
    "song.detail.approver": "Ä‘Ã£ duyá»‡t",
    "song.detail.genre": "Thá»ƒ loáº¡i",
    "song.detail.key": "TÃ´ng",
    "song.detail.favorite": "YÃªu thÃ­ch",
    "song.detail.cert": "Chá»©ng nháº­n",
    "song.tools.description.view.fullscreen": "Xem toÃ n mÃ n hÃ¬nh",
    "song.tools.edit.this.song": "chá»‰nh sá»­a bÃ i hÃ¡t nÃ y",
    "song.tools.view.edit.history": "Lá»‹ch sá»­ chá»‰nh sá»­a",
    "song.certificated": "Há»£p Ã¢m cháº¥t lÆ°á»£ng cao",
    "song.click.to.vote.rhythm": "Click Ä‘á»ƒ bÃ¬nh chá»n Ä‘iá»‡u bÃ i hÃ¡t",
    "song.rhythm.voted": "ÄÃ£ bÃ¬nh chá»n Ä‘iá»‡u cho bÃ i hÃ¡t nÃ y",
    "song.view.all.song.with.genre": "Xem táº¥t cáº£ cÃ¡c bÃ i %s",
    "song.remove.complex.chords": "ÄÆ¡n giáº£n hoÃ¡ cÃ¡c há»£p Ã¢m phá»©c táº¡p",
    "song.add.to.favorite": "ThÃªm vÃ o bÃ i hÃ¡t yÃªu thÃ­ch",
    "song.tool.trans": "Äá»•i tÃ´ng",
    "song.tool.easy": "Gá»™p dÃ²ng",
    "song.tool.size": "Cá»¡ chá»¯",
    "song.tool.scroll": "Cuá»™n trang",
    "song.tool.column": "Chia cá»™t",
    "song.tool.play": "Nghe nháº¡c",
    "song.tool.trans.up": "TÄƒng tÃ´ng",
    "song.tool.trans.down": "Giáº£m tÃ´ng",
    "song.tool.easy.on": "Báº­t gá»™p dÃ²ng",
    "song.tool.easy.off": "Táº¯t gá»™p dÃ²ng",
    "song.tool.size.up": "TÄƒng cá»¡ chá»¯",
    "song.tool.size.down": "Giáº£m cá»¡ chá»¯",
    "song.tool.scroll.repeat": "láº·p láº¡i",
    "song.tool.fullscreen": "ToÃ n mÃ n hÃ¬nh",
    "song.tool.fullscreen.minimize": "Thu nhá»",
    "song.tool.fullscreen.maximize": "Hiá»ƒn thá»‹ cÃ´ng cá»¥",
    "song.tool.fullscreen.close": "ThoÃ¡t toÃ n mÃ n hÃ¬nh",
    "song.share.embedded": "MÃ£ nhÃºng",
    "song.share.this.song": "Chia sáº» bÃ i hÃ¡t nÃ y",
    "common.error.html5.not.supported": "KhÃ´ng há»— trá»£",
    "song.report.title": "ThÃ´ng bÃ¡o bÃ i hÃ¡t lá»—i",
    "song.report.comment": "Äá» xuáº¥t",
    "song.report.send": "Gá»­i Ä‘i",
    "song.report.hint": "VÃ­ dá»¥: Ä‘á»•i há»£p Ã¢m Am thÃ nh A á»Ÿ cÃ¢u...",
    "song.report.problem.chord.wrong": "Há»£p Ã¢m sai",
    "song.report.problem.chord.missing": "Há»£p Ã¢m thiáº¿u",
    "song.report.problem.lyric.wrong": "Lá»i bÃ i hÃ¡t sai",
    "song.report.problem.lyric.missing": "Lá»i bÃ i hÃ¡t thiáº¿u",
    "song.report.problem.rhythm.wrong": "Äiá»‡u bÃ i hÃ¡t sai",
    "song.report.problem.artist.wrong": "ThÃ´ng tin ca sÄ© / tÃ¡c giáº£ sai",
    "song.report.problem.link.wrong": "Link mp3 bá»‹ lá»—i",
    "song.report.problem.inappropriate": "Ná»™i dung nháº¡y cáº£m, khÃ´ng phÃ¹ há»£p",
    "song.report.this.song.has.problem": "BÃ i hÃ¡t <b>%s</b> cÃ³ váº¥n Ä‘á»:",
    "song.report.success.msg": "GÃ³p Ã½ cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c gá»­i Ä‘áº¿n BQT thÃ nh cÃ´ng, báº¡n sáº½ nháº­n Ä‘Æ°á»£c thÃ´ng bÃ¡o khi cÃ³ káº¿t quáº£.<br/>Cáº£m Æ¡n báº¡n Ä‘Ã£ gÃ³p Ã½ cho Há»£p Ã‚m Chuáº©n.",
    "song.report.error.empty.msg": "Báº¡n chÆ°a nháº­p thÃ´ng tin. Vui lÃ²ng cung cáº¥p thÃªm thÃ´ng tin báº±ng cÃ¡ch nháº¥n vÃ o cÃ¡c tuá»³ chá»n hoáº·c viáº¿t Äá» xuáº¥t.",
    "artist.suggest.error.empty.msg": "Báº¡n chÆ°a nháº­p thÃ´ng tin. Vui lÃ²ng cung cáº¥p thÃªm thÃ´ng tin báº±ng cÃ¡ch nháº­p tÃªn vÃ  hÃ¬nh nghá»‡ sÄ©.",
    "song.favorite.added": "ÄÃ£ thÃªm vÃ o danh sÃ¡ch yÃªu thÃ­ch",
    "song.favorite.removed": "ÄÃ£ xoÃ¡ khá»i danh sÃ¡ch yÃªu thÃ­ch",
    "song.favorite.please.login": "Vui lÃ²ng <b><a href='javascript:Login.doLogin()'>ÄÄƒng nháº­p</a></b> hoáº·c <b><a href='auth/register'>ÄÄƒng kÃ½</a></b> Ä‘á»ƒ táº¡o thÃªm vÃ o danh sÃ¡ch yÃªu thÃ­ch.",
    "song.not.certificated.yet": "ChÆ°a chá»©ng nháº­n",
    "song.not.approved.yet": "ChÆ°a duyá»‡t",
    "song.contributes": "PhiÃªn báº£n",
    "song.contribute.community": "PhiÃªn báº£n cá»™ng Ä‘á»“ng",
    "song.contributed.by": "Ä‘Ã³ng gÃ³p bá»Ÿi",
    "song.videos.view.more": "Xem táº¥t cáº£ %s video",
    "song.videos.post": "ÄÄƒng video cho bÃ i hÃ¡t nÃ y",
    comment: "BÃ¬nh luáº­n",
    "comment.title": "BÃ¬nh luáº­n HAC",
    "comment.facebook.title": "BÃ¬nh luáº­n Facebook",
    "comment.input.place.holder": "Ã kiáº¿n cá»§a báº¡n vá» bÃ i hÃ¡t nÃ y...",
    "comment.reply.place.holder": "Ã kiáº¿n cá»§a báº¡n...",
    "comment.button.submit": "ÄÄƒng bÃ¬nh luáº­n",
    "comment.post": "ÄÄƒng",
    "comment.reply": "Tráº£ lá»i",
    "comment.report.abuse": "BÃ¡o bÃ¬nh luáº­n xáº¥u",
    "comment.hide": "áº¨n bÃ¬nh luáº­n nÃ y",
    "comment.unhide": "Bá» áº©n",
    "comment.delete": "XÃ³a bÃ¬nh luáº­n",
    "comment.delete.confirm": "Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a bÃ¬nh luáº­n nÃ y?",
    "comment.this.comment.is.hidden": "BÃ¬nh luáº­n nÃ y Ä‘Ã£ bá»‹ áº©n Ä‘i",
    "comment.report.hint": "MÃ´ táº£ cá»¥ thá»ƒ hÆ¡n vá» vi pháº¡m...",
    "comment.report.problem.spam": "Quáº£ng cÃ¡o, spam",
    "comment.report.problem.sexual": "Ná»™i dung nháº¡y cáº£m, 18+",
    "comment.report.problem.abuse": "Lá»i láº½ thÃ´ tá»¥c, gÃ¢y háº¥n, xÃºc pháº¡m ngÆ°á»i khÃ¡c",
    "comment.report.problem.illegal": "LiÃªn quan Ä‘áº¿n chÃ­nh trá»‹, tÃ´n giÃ¡o, sáº¯c tá»™c",
    "comment.view.all.n.replies": "Xem thÃªm %s tráº£ lá»i",
    "comment.hide.all.n.replies": "áº¨n %s tráº£ lá»i",
    "comment.top.comments": "BÃ¬nh luáº­n hay nháº¥t",
    "comment.latest.comments": "BÃ¬nh luáº­n má»›i nháº¥t",
    "playlist.search": "TÃ¬m kiáº¿m playlist...",
    "playlist.add.new": "Táº¡o playlist má»›i",
    "playlist.title": "TÃªn playlist",
    "playlist.notify.added": "ÄÃ£ thÃªm vÃ o playlist",
    "playlist.notify.removed": "ÄÃ£ xoÃ¡ khá»i playlist",
    "playlist.search.not.found": "KhÃ´ng tÃ¬m tháº¥y playlist nÃ o",
    "playlist.manage": "Quáº£n lÃ½ playlist",
    "playlist.no.playlist": "ChÆ°a cÃ³ playlist nÃ o!",
    "playlist.public": "CÃ´ng khai",
    "playlist.title.must.not.empty": "TÃªn playlist khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng",
    "playlist.add.to.playlist": "ThÃªm vÃ o playlist",
    "playlist.could.not.create.playlist": "KhÃ´ng thá»ƒ táº¡o playlist.",
    "playlist.could.not.update.playlist": "KhÃ´ng thá»ƒ cáº­p nháº­t playlist.",
    "playlist.could.not.delete.playlist": "KhÃ´ng thá»ƒ xÃ³a playlist.",
    "playlist.could.not.remove.song.playlist": "KhÃ´ng thá»ƒ xÃ³a bÃ i hÃ¡t ra khá»i playlist.",
    "playlist.please.login.to.create.playlist": "Vui lÃ²ng <b><a href='javascript:Login.doLogin()'>ÄÄƒng nháº­p</a></b> hoáº·c <b><a href='auth/register'>ÄÄƒng kÃ½</a></b> Ä‘á»ƒ táº¡o playlist.",
    "playlist.please.login.to.update.playlist": "Vui lÃ²ng <b><a href='javascript:Login.doLogin()'>ÄÄƒng nháº­p</a></b> hoáº·c <b><a href='auth/register'>ÄÄƒng kÃ½</a></b> Ä‘á»ƒ cáº­p nháº­t playlist.",
    "playlist.please.login.to.delete.playlist": "Vui lÃ²ng <b><a href='javascript:Login.doLogin()'>ÄÄƒng nháº­p</a></b> hoáº·c <b><a href='auth/register'>ÄÄƒng kÃ½</a></b> Ä‘á»ƒ xÃ³a playlist.",
    "profile.posted.songs": "Sá»‘ bÃ i hÃ¡t Ä‘Ã£ Ä‘Äƒng",
    "profile.contributed.songs": "Sá»‘ bÃ i hÃ¡t Ä‘Ã£ Ä‘Ã³ng gÃ³p",
    "profile.manage": "ThÃ´ng tin tÃ i khoáº£n",
    "profile.logout": "ÄÄƒng xuáº¥t",
    "profile.your.requests": "YÃªu cáº§u cá»§a báº¡n",
    "profile.your.posted.songs": "BÃ i hÃ¡t Ä‘Ã£ Ä‘Äƒng",
    "profile.create.song": "ÄÄƒng bÃ i hÃ¡t",
    "profile.updated.and.waiting.approved": "Xin chÃºc má»«ng.<br/>ThÃ´ng tin cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c cáº­p nháº­t thÃ nh cÃ´ng.",
    "profile.point.gold": "Äiá»ƒm thÃ nh tÃ­ch",
    "profile.point.blue": "Äiá»ƒm Ä‘Ã³ng gÃ³p",
    "profile.point.red": "Äiá»ƒm uy tÃ­n",
    "god.manage.permisstion": "Quáº£n lÃ½ phÃ¢n quyá»n",
    "god.manage.member": "Quáº£n lÃ½ thÃ nh viÃªn",
    "god.permisstion.updated": "Xin chÃºc má»«ng.<br/>PhÃ¢n quyá»n Ä‘Ã£ Ä‘Æ°á»£c cáº­p nháº­t thÃ nh cÃ´ng.",
    "no.users": "KhÃ´ng cÃ³ thÃ nh viÃªn",
    "rhythm.vote": "chá»n Ä‘iá»‡u",
    "rhythm.already.voted": "Báº¡n Ä‘Ã£ bÃ¬nh chá»n Ä‘iá»‡u cho bÃ i hÃ¡t nÃ y rá»“i!",
    "login.with.social": "ÄÄƒng nháº­p báº±ng tÃ i khoáº£n cÃ³ sáºµn",
    "login.already.logged.in": "Báº¡n Ä‘ang Ä‘Äƒng nháº­p, vui lÃ²ng <a href='/auth/logout?redirect=%s' class='blue-link'>ÄÄƒng xuáº¥t</a> Ä‘á»ƒ Ä‘Äƒng kÃ½ / Ä‘Äƒng nháº­p tÃ i khoáº£n khÃ¡c.",
    "login.one.more.step": "Chá»‰ má»™t bÆ°á»›c ná»¯a thÃ´i!",
    "login.social.error": "<b>Lá»—i khi káº¿t ná»‘i Ä‘áº¿n tÃ i khoáº£n %s</b>",
    "register.please.check.below": "Vui lÃ²ng Ä‘Ã¡nh dáº¥u vÃ o Ã´ xÃ¡c nháº­n bÃªn dÆ°á»›i",
    "register.done": "ChÃºc má»«ng báº¡n Ä‘Ã£ Ä‘Äƒng kÃ½ thÃ nh cÃ´ng. Vui lÃ²ng Ä‘Äƒng nháº­p Ä‘á»ƒ báº¯t Ä‘áº§u sá»­ dá»¥ng nhá»¯ng chá»©c nÄƒng nÃ¢ng cao cá»§a Há»£p Ã‚m Chuáº©n",
    "register.social.done": "ChÃºc má»«ng báº¡n Ä‘Ã£ Ä‘Äƒng kÃ½ thÃ nh cÃ´ng. Tá»« láº§n truy cáº­p sau báº¡n cÃ³ thá»ƒ Ä‘Äƒng nhÃ¢p báº±ng %s hoáº·c tÃ i khoáº£n HAC.",
    "register.create.by.social": "LiÃªn káº¿t tÃ i khoáº£n %s",
    "register.link.social.instruction": "Vui lÃ²ng nháº­p cÃ¡c thÃ´ng tin cÃ²n thiáº¿u bÃªn dÆ°á»›i Ä‘á»ƒ táº¡o tÃ i khoáº£n HAC.",
    "register.link.with.hac.acc": "LiÃªn káº¿t tÃ i khoáº£n HAC vÃ  %s",
    "register.link.with.hac.acc.guide": "ÄÃ£ cÃ³ má»™t tÃ i khoáº£n HAC Ä‘Æ°á»£c Ä‘Äƒng kÃ½ vá»›i email %s cá»§a báº¡n. Vui lÃ²ng nháº­p <b>máº­t kháº©u HAC</b> Ä‘á»ƒ liÃªn káº¿t tÃ i khoáº£n.",
    "register.account.hac": "TÃ i khoáº£n HAC",
    "register.account.social": "TÃ i khoáº£n %s",
    "register.link.enter.hac.password": "Nháº­p máº­t kháº©u HAC",
    "register.link.account": "LiÃªn káº¿t tÃ i khoáº£n",
    "register.link.wrong.password": "Máº­t kháº©u khÃ´ng Ä‘Ãºng",
    "auth.reset.password.done": "Máº­t kháº©u cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c thay Ä‘á»•i. Vui lÃ²ng Ä‘Äƒng nháº­p láº¡i.",
    "search.cant.find.song.?": "KhÃ´ng tÃ¬m tháº¥y bÃ i hÃ¡t báº¡n mong muá»‘n?",
    "search.create.song": "Viáº¿t há»£p Ã¢m bÃ i nÃ y",
    "search.send.request": "Gá»­i yÃªu cáº§u há»£p Ã¢m",
    "search.artist.have.x.song": "%s bÃ i hÃ¡t",
    "search.no.result.message": "<h2>KhÃ´ng tÃ¬m tháº¥y káº¿t quáº£ nÃ o</strong></h2>\n\n                            <p>Gá»£i Ã½:</p>\n                            <ul>\n                                <li>Chá»n Ä‘Ãºng chá»©c nÄƒng tÃ¬m kiáº¿m theo BÃ i hÃ¡t, ca sÄ© hoáº·c há»£p Ã¢m.</li>\n                                <li>Loáº¡i bá» cÃ¡c kÃ½ tá»± Ä‘áº·c biá»‡t trong tá»« khÃ³a (VD: !@#$%^&*?).</li>\n                                <li>Loáº¡i bá» tÃªn tÃ¡c giáº£ / ca sÄ© ra khá»i tá»« khÃ³a.</li>\n                            </ul>",
    "search.no.result.message.autocomplete": "Nháº¥n <b>Enter</b> Ä‘á»ƒ tÃ¬m kiáº¿m Ä‘áº§y Ä‘á»§.",
    "search.cant.find.what.you.want.?": "KhÃ´ng tÃ¬m tháº¥y káº¿t quáº£ báº¡n mong muá»‘n?",
    "search.send.report": "Gá»­i gÃ³p Ã½",
    "page.create.name.label": "TÃªn bÃ i hÃ¡t",
    "page.create.name.placeholder": "VÃ­ dá»¥: CÃ¡t Bá»¥i",
    "page.create.lyric.label": "Lá»i bÃ i hÃ¡t vÃ  há»£p Ã¢m",
    "page.create.note.label": "Ná»™i dung chá»‰nh sá»­a",
    "page.create.note.placeholder": "VD: Há»£p Ã¢m cÆ¡ báº£n",
    "page.create.singer.label": "Ca sÄ©",
    "page.create.author.label": "TÃ¡c giáº£",
    "page.create.singer.placeholder": "VÃ­ dá»¥: Cáº©m Ly, Äan TrÆ°á»ng...",
    "page.create.author.placeholder": "VÃ­ dá»¥: Trá»‹nh CÃ´ng SÆ¡n...",
    "page.create.key.label": "TÃ´ng",
    "page.create.genre.label": "Thá»ƒ loáº¡i",
    "page.create.key.placeholder": "VÃ­ dá»¥: Am",
    "page.create.genre.placeholder": "VÃ­ dá»¥: Nháº¡c tráº»",
    "page.create.link.label": "Link nháº¡c",
    "page.create.link.placeholder": "VÃ­ dá»¥: http://mp3.zing.vn/...",
    "page.create.preview": "XEM TRÆ¯á»šC",
    "page.create.toolbox.preview": "Xem trÆ°á»›c",
    "page.create.toolbox.format": "Äá»‹nh dáº¡ng",
    "page.create.toolbox.mergelines": "Nháº­p dÃ²ng",
    "page.create.toolbox.transpose.up": "NÃ¢ng tÃ´ng",
    "page.create.toolbox.transpose.down": "Háº¡ tÃ´ng",
    "please.login.to.create.song": "Vui lÃ²ng <b><a href='javascript:Login.doLogin()'>ÄÄƒng nháº­p</a></b> hoáº·c <b><a href='auth/register'>ÄÄƒng kÃ½</a></b> Ä‘á»ƒ Ä‘Äƒng bÃ i hÃ¡t.",
    "please.login.to.create.request": "Vui lÃ²ng <b><a href='javascript:Login.doLogin()'>ÄÄƒng nháº­p</a></b> hoáº·c <b><a href='auth/register'>ÄÄƒng kÃ½</a></b> Ä‘á»ƒ gá»­i yÃªu cáº§u bÃ i hÃ¡t.",
    "permission.denied": 'Báº¡n khÃ´ng cÃ³ quyá»n truy cáº­p khu vá»±c nÃ y<br/><a class="blue-link" href="/">Quay láº¡i trang chá»§</a>',
    "instruction.song.name": "<h3>Cáº£m Æ¡n báº¡n ráº¥t nhiá»u ^_^</h3>\n<p>...vÃ¬ Ä‘Ã£ Ä‘Äƒng há»£p Ã¢m cá»§a báº¡n lÃªn Há»£p Ã‚m Chuáº©n!</p>\n<p>Cá»™ng Ä‘á»“ng Guitar Viá»‡t Nam cáº§n nhá»¯ng ngÆ°á»i nhÆ° báº¡n.</p>\n",
    "instruction.song.lyric": '<h3> Äá»ƒ cÃ³ cháº¥t lÆ°á»£ng há»£p Ã¢m tá»‘t hÆ¡n, báº¡n vui lÃ²ng...</h3>\n<ul>\n    <li>Viáº¿t <b>Ä‘á»§ há»£p Ã¢m</b>, Ä‘á»«ng dÃ¹ng "tÆ°Æ¡ng tá»±", "nhÆ° trÃªn"... vÃ¬ nhiá»u ngÆ°á»i má»›i táº­p chÆ¡i há» khÃ´ng rÃ nh.</li>\n    <li>Äá»ƒ cho <b>dá»… nhÃ¬n</b> thÃ¬ báº¡n Ä‘áº·t há»£p Ã¢m trong <b>cáº·p ngoáº·c vuÃ´ng</b> ngay <b>trÆ°á»›c</b> chá»¯ cáº§n nháº¥n máº¡nh. VÃ­ dá»¥:\n        <div class="padding-both text-small">\n            Háº¡t bá»¥i <b class="blue-link">[Am]</b>nÃ o hÃ³a kiáº¿p thÃ¢n tÃ´i<br/>\n            Äá»ƒ má»™t <b class="blue-link">[Dm]</b>mai vÆ°Æ¡n hÃ¬nh hÃ i lá»›n dáº­y\n        </div>\n    </li>\n    <li>Náº¿u báº¡n viáº¿t kÃ¨m theo hÆ°á»›ng dáº«n chÆ¡i thÃ¬ ngÄƒn cÃ¡ch vá»›i pháº§n lá»i báº±ng má»™t dÃ²ng dáº¥u === nhÃ©. VÃ­ dá»¥:\n\n        <div class="padding-both text-small">\n            TÃ´ng gá»‘c <b class="blue-link">[Em]</b>, Capo 5<br/>\n            ===<br/>\n            Háº¡t bá»¥i <b class="blue-link">[Am]</b>nÃ o hÃ³a kiáº¿p thÃ¢n tÃ´i<br/>\n            Äá»ƒ má»™t <b class="blue-link">[Dm]</b>mai vÆ°Æ¡n hÃ¬nh hÃ i lá»›n dáº­y\n        </div>\n</li>\n    <li><b>KhÃ´ng</b> Ä‘Äƒng cÃ¡c bÃ i hÃ¡t cÃ³ ná»™i dung pháº£n Ä‘á»™ng, nháº¡y cáº£m, vi pháº¡m thuáº§n phong má»¹ tá»¥c ngÆ°á»i Viá»‡t Nam.</li>\n    <li><b>Kiá»ƒm tra láº¡i bÃ i hÃ¡t</b> báº±ng nÃºt <b>XEM TRÆ¯á»šC</b> trÆ°á»›c khi Ä‘Äƒng.</li>\n</ul>',
    "instruction.song.contribute": '<p class="text-quote">Xin cáº£m Æ¡n báº¡n Ä‘Ã£ Ä‘Ã³ng gÃ³p há»£p Ã¢m bÃ i hÃ¡t cho cá»™ng Ä‘á»“ng! Äá»ƒ cháº¥t lÆ°á»£ng há»£p Ã¢m Ä‘Æ°á»£c tá»‘t hÆ¡n, báº¡n vui lÃ²ng Ä‘á»c ká»¹ cÃ¡ch Ä‘Äƒng há»£p Ã¢m bÃªn dÆ°á»›i:\n                    <ul>\n                        <li>Nháº­p <b>Ä‘áº§y Ä‘á»§ lá»i bÃ i hÃ¡t vÃ  há»£p Ã¢m</b>. Háº¡n cháº¿ dÃ¹ng "tÆ°Æ¡ng tá»±", "nhÆ° trÃªn"...</li>\n                        <li>Äáº·t há»£p Ã¢m trong <b>cáº·p ngoáº·c vuÃ´ng</b> ngay <b>trÆ°á»›c</b> chá»¯ cáº§n nháº¥n máº¡nh. VÃ­ dá»¥:\n                            <div class="padding-both text-small">\n                                Háº¡t bá»¥i <b class="blue-link">[Am]</b>nÃ o hÃ³a kiáº¿p thÃ¢n tÃ´i<br/>\n                                Äá»ƒ má»™t <b class="blue-link">[Dm]</b>mai vÆ°Æ¡n hÃ¬nh hÃ i lá»›n dáº­y\n                            </div>\n                        </li>\n\n                        <li>NgÄƒn cÃ¡ch vá»›i pháº§n hÆ°á»›ng dáº«n chÆ¡i vÃ  lá»i báº±ng má»™t dÃ²ng dáº¥u ===\n</li>\n                        <li>Vui lÃ²ng <b>kiá»ƒm tra láº¡i bÃ i hÃ¡t</b> báº±ng nÃºt <b>XEM TRÆ¯á»šC</b> trÆ°á»›c khi Ä‘Äƒng</li>\n                    </ul>',
    "instruction.song.note": "<h3>Ghi chÃº bÃ i hÃ¡t:</h3>\n                    <ul>\n                        <li>HÆ°á»›ng dáº«n cÃ¡ch chÆ¡i bÃ i hÃ¡t: cÃ¡ch káº¹p capo, cÃ¡ch quáº¡t cháº£...</li>\n                        <li>Dáº«n nguá»“n bÃ i hÃ¡t (náº¿u cÃ³)</li>\n                        <li>Ghi chÃº cÃ¡c há»£p Ã¢m khÃ³</li>\n                    </ul>",
    "song.created.and.waiting.approved": "Xin chÃºc má»«ng.<br/>BÃ i hÃ¡t cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c táº¡o thÃ nh cÃ´ng vÃ  Ä‘ang chá» duyá»‡t.",
    login: "ÄÄƒng nháº­p",
    register: "ÄÄƒng kÃ½",
    "manage.page": "Quáº£n lÃ½",
    "manage.song.moderate": "Quáº£n lÃ½ bÃ i hÃ¡t",
    "manage.dashboard": "ThÃ´ng tin chung",
    "manage.approve.song.page": "BÃ i hÃ¡t chá» duyá»‡t",
    "manage.report": "BÃ¡o lá»—i & gÃ³p Ã½",
    "manage.song.requests": "YÃªu cáº§u há»£p Ã¢m",
    "manage.artist.approve": "Nghá»‡ sÄ© chá» duyá»‡t",
    "manage.artist.approve.confirm": "Báº¡n muá»‘n duyá»‡t nghá»‡ sÄ© nÃ y?",
    "manage.artist.reject.confirm": "Báº¡n khÃ´ng muá»‘n duyá»‡t nghá»‡ sÄ© nÃ y?",
    "filter.songs": "Lá»c bÃ i Ä‘Äƒng",
    "this.song.is.approved": 'BÃ i hÃ¡t nÃ y Ä‘Ã£ Ä‘Æ°á»£c duyá»‡t vÃ  hiá»ƒn thá»‹ á»Ÿ trang chá»§. <a href="%s" class="blue-link">Äi Ä‘áº¿n bÃ i hÃ¡t</a>',
    "this.song.approved": "BÃ i hÃ¡t nÃ y vá»«a má»›i Ä‘Æ°á»£c duyá»‡t bá»Ÿi má»™t ngÆ°á»i khÃ¡c",
    "edit.this.song": "Sá»­a bÃ i nÃ y",
    "approve.song": "Duyá»‡t bÃ i",
    "merge.song": "Gá»™p bÃ i",
    "song.info": "ThÃ´ng tin bÃ i hÃ¡t",
    "waiting.for.approve": "Äang chá» duyá»‡t",
    "song.approved": "ÄÃ£ duyá»‡t",
    "no.approve.permission": "Báº¡n khÃ´ng cÃ³ quyá»n duyá»‡t bÃ i hÃ¡t.",
    "song.approved.success": 'BÃ i hÃ¡t Ä‘Ã£ Ä‘Æ°á»£c duyá»‡t thÃ nh cÃ´ng.<br/><a class="blue-link" href="%s">Quay láº¡i trang duyá»‡t bÃ i hÃ¡t</a><br/><a class="blue-link" href="%s">Äi Ä‘áº¿n bÃ i hÃ¡t vá»«a duyá»‡t</a>',
    "song.approved.failed": 'KhÃ´ng thá»ƒ duyá»‡t bÃ i hÃ¡t vÃ o lÃºc nÃ y!<br/><p>%s</p><a class="blue-link" href="%s">Quay láº¡i trang duyá»‡t bÃ i hÃ¡t</a>',
    "unsave.changes": "Thay Ä‘á»•i cá»§a báº¡n chÆ°a Ä‘Æ°á»£c lÆ°u láº¡i!",
    "login.success.create.song": "ÄÄƒng nháº­p thÃ nh cÃ´ng. Nháº¥n Ä‘Äƒng bÃ i hÃ¡t Ä‘á»ƒ tiáº¿p tá»¥c Ä‘Äƒng bÃ i.",
    "no.permission.edit.approve": "Báº¡n khÃ´ng cÃ³ quyá»n chá»‰nh sá»­a bÃ i hÃ¡t Ä‘ang chá» duyá»‡t",
    save: "LÆ°u láº¡i",
    cancel: "Há»§y",
    "edit.default.song": "Sá»­a báº£n máº·c Ä‘á»‹nh",
    "edit.version.song": "Sá»­a phiÃªn báº£n nÃ y",
    "edit.song": "Chá»‰nh sá»­a bÃ i hÃ¡t",
    discussion: "THáº¢O LUáº¬N",
    "artist.information": "ThÃ´ng tin nghá»‡ sÄ©",
    "artist.name": "TÃªn nghá»‡ sÄ©",
    "artist.bio": "Giá»›i thiá»‡u nghá»‡ sÄ©",
    "artist.image": "HÃ¬nh nghá»‡ sÄ©",
    "artist.bio.hint": "MÃ´ táº£ ngáº¯n vá» nghá»‡ sÄ©...",
    "artist.suggestion": "ÄÃ³ng gÃ³p thÃ´ng tin nghá»‡ sÄ©",
    "edit.artist.information": "Chá»‰nh sá»­a thÃ´ng tin",
    "songs.not.found.by.artist.id": "KhÃ´ng tÃ¬m tháº¥y bÃ i hÃ¡t nÃ y cá»§a nghá»‡ sÄ© nÃ y.",
    "song.s": "bÃ i",
    songs: "CÃ¡c bÃ i hÃ¡t",
    "no.songs": "KhÃ´ng cÃ³ bÃ i hÃ¡t nÃ o",
    "approve.status": "Tráº¡ng thÃ¡i duyá»‡t",
    "approve.status.wait.for.approve": "Chá» duyá»‡t",
    "approve.status.wait.for.edit": "Chá» chá»‰nh sá»­a",
    "approve.status.duplicate": "Bá»‹ trÃ¹ng",
    "approve.status.rejected": "KhÃ´ng duyá»‡t",
    "approve.status.approved": "ÄÃ£ duyá»‡t",
    "approve.status.merged": "ÄÃ£ gá»™p",
    "song.request.title": "YÃªu cáº§u há»£p Ã¢m",
    "song.request.lyric.label": "Lá»i bÃ i hÃ¡t",
    "song.request.created.and.waiting.approved": "Xin chÃºc má»«ng.<br/>YÃªu cáº§u cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c táº¡o thÃ nh cÃ´ng vÃ  Ä‘ang chá» duyá»‡t.",
    "song.request.vote.count": "ngÆ°á»i Ä‘ang yÃªu cáº§u bÃ i nÃ y",
    "song.request.vote.count.0": "%d ngÆ°á»i Ä‘ang yÃªu cáº§u bÃ i nÃ y",
    "song.request.vote.count.1": "báº¡n Ä‘ang yÃªu cáº§u bÃ i nÃ y",
    "song.request.vote.count.2": "báº¡n vÃ  %d ngÆ°á»i Ä‘ang yÃªu cáº§u bÃ i nÃ y",
    "song.request.vote.label": "tÃ´i cÅ©ng muá»‘n",
    "song.request.all.label": "Táº¥t cáº£",
    "song.request.hasposted.label": "ÄÃ£ Ä‘Äƒng",
    "song.request.notposted.label": "ChÆ°a Ä‘Äƒng",
    "song.request.rejected.label": "Bá»‹ tá»« chá»‘i",
    "song.request.post.label": "ÄÄƒng há»£p Ã¢m",
    "song.request.cancel.label": "Há»§y yÃªu cáº§u",
    "song.request.cancel.confirm": "Báº¡n cÃ³ muá»‘n há»§y yÃªu cáº§u bÃ i [%s] khÃ´ng?",
    "common.request.create": "Gá»­i yÃªu cáº§u",
    "song.request.edit.label": "Thay Ä‘á»•i yÃªu cáº§u",
    "instruction.request.song.name": '<h3>TÃªn bÃ i hÃ¡t:</h3>\n                    <ul>\n                        <li><b>KhÃ´ng</b> Ä‘Äƒng bÃ i hÃ¡t <b>Ä‘Ã£ bá»‹ trÃ¹ng</b>.</li>\n                        <li>Báº¡n chá»‰ cÃ³ thá»ƒ <b>chá»‰nh sá»­a</b> yÃªu cáº§u sau khi Ä‘Äƒng hoáº·c Ä‘Äƒng bÃ i khi Ä‘Ã£ Ä‘Äƒng nháº­p vÃ  yÃªu cáº§u chÆ°a cÃ³ tháº£o luáº­n</li>\n                        <li>GÃµ tiáº¿ng Viá»‡t cÃ³ dáº¥u</li>\n                        <li>Viáº¿t tÃªn <b>Ä‘áº§y Ä‘á»§</b> cá»§a bÃ i hÃ¡t</li>\n                        <li><b>KhÃ´ng</b> Ä‘áº·t tÃªn tÃ¡c giáº£, ca sÄ© vÃ o tÃªn bÃ i hÃ¡t</li>\n                        <li>Náº¿u báº¡n muá»‘n <b>xem nhá»¯ng yÃªu cáº§u há»£p Ã¢m Ä‘Ã£ cÃ³</b>, vui lÃ²ng vÃ o <b><a href="/manage/song-request" target="_blank" class="blue-link">trang quáº£n lÃ½ yÃªu cáº§u há»£p Ã¢m</a></b></li>\n                    </ul>',
    "instruction.request.song.lyric": '<h3>Há»£p Ã¢m bÃ i hÃ¡t:</h3>\n<ul>\n    <li>Nháº­p <b>Ä‘áº§y Ä‘á»§ lá»i bÃ i hÃ¡t vÃ  há»£p Ã¢m</b>. Háº¡n cháº¿ dÃ¹ng "tÆ°Æ¡ng tá»±", "nhÆ° trÃªn"...</li>\n    <li><b>KhÃ´ng</b> viáº¿t hÆ°á»›ng dáº«n chÆ¡i á»Ÿ Ä‘Ã¢y (viáº¿t á»Ÿ má»¥c <b>ghi chÃº</b> bÃªn dÆ°á»›i)</li>\n    <li><b>KhÃ´ng</b> Ä‘Äƒng cÃ¡c bÃ i hÃ¡t cÃ³ ná»™i dung pháº£n Ä‘á»™ng, nháº¡y cáº£m, vi pháº¡m thuáº§n phong má»¹ tá»¥c ngÆ°á»i Viá»‡t Nam.</li>\n    <li>Vui lÃ²ng <b>kiá»ƒm tra láº¡i bÃ i hÃ¡t</b> trÆ°á»›c khi Ä‘Äƒng</li>\n</ul>',
    "song.request.notfound": "KhÃ´ng tÃ¬m tháº¥y yÃªu cáº§u há»£p Ã¢m nÃ y",
    "song.request.cancel": "YÃªu cáº§u Ä‘Ã£ Ä‘Æ°á»£c há»§y",
    "no.cancel.permission": "Báº¡n khÃ´ng cÃ³ quyá»n há»§y bÃ i nÃ y",
    "no.edit.permission": "Báº¡n khÃ´ng cÃ³ quyá»n chá»‰nh sá»­a bÃ i hÃ¡t.",
    "vote.for.contribute": "BÃ¬nh chá»n cho phiÃªn báº£n há»£p Ã¢m nÃ y",
    "vote.contribute.success": "BÃ¬nh chá»n thÃ nh cÃ´ng!",
    "contribute.rate.please.login": "Vui lÃ²ng <a class='blue-link' href='javascript:window.top.Login.doLogin()'>ÄÄƒng nháº­p</a> hoáº·c <a class='blue-link' target='_blank' href='auth/register'>ÄÄƒng kÃ½</a> Ä‘á»ƒ gá»­i bÃ¬nh chá»n.",
    "contribute.song.please.login": "<div class='text-center'>Vui lÃ²ng <a class='blue-link' href='javascript:Login.doLogin()'>ÄÄƒng nháº­p</a> hoáº·c <a class='blue-link' target='_blank' href='auth/register'>ÄÄƒng kÃ½</a> Ä‘á»ƒ gá»­i chá»‰nh sá»­a bÃ i hÃ¡t nÃ y.</div>",
    "add.favorite.note": "ThÃªm ghi chÃº cho bÃ i nÃ y",
    "add.favorite.note.placeholder": "VD: Capo 3, Am",
    "x.person.rated": "%s ngÆ°á»i bÃ¬nh chá»n",
    "common.edit": "Chá»‰nh sá»­a",
    "contributes.from.community": "Tá»•ng há»£p Ä‘Ã³ng gÃ³p tá»« cá»™ng Ä‘á»“ng",
    "song.poster": "NgÆ°á»i Ä‘Äƒng",
    "this.user.has.no.permission": "TÃ i khoáº£n cá»§a báº¡n khÃ´ng thá»ƒ sá»­ dá»¥ng chá»©c nÄƒng nÃ y",
    "no.request.found": "KhÃ´ng cÃ³ yÃªu cáº§u nÃ o.",
    "artist.report.title": "ThÃ´ng bÃ¡o lá»—i vá» nghá»‡ sÄ©",
    "artist.report.problem.name.wrong": "TÃªn nghá»‡ sÄ© bá»‹ sai",
    "artist.report.problem.thumb.missing": "Thiáº¿u hÃ¬nh Ä‘áº¡i diá»‡n",
    "artist.report.problem.thumb.wrong": "HÃ¬nh Ä‘áº¡i diá»‡n bá»‹ sai",
    "artist.report.hint": "VÃ­ dá»¥: TÃªn nghá»‡ sÄ© bá»‹ lá»—i",
    "artist.report.send": "Gá»­i Ä‘i",
    "manage.report.page": "BÃ¡o lá»—i vÃ  gÃ³p Ã½",
    "manage.reports": "BÃ¡o lá»—i vÃ  gÃ³p Ã½",
    "manage.report.type.song": "BÃ i hÃ¡t",
    "manage.report.type.artist": "Nghá»‡ sÄ©",
    "manage.report.type.comment": "BÃ¬nh luáº­n",
    "manage.report.title.song": 'GÃ³p Ã½ cho bÃ i hÃ¡t <b><a href="%s" target="_blank">%s</a></b>',
    "manage.report.title.comment": 'GÃ³p Ã½ cho bÃ¬nh luáº­n (<b>#%s</b>) cá»§a <b><a href="%s" target="_blank">%s</a></b> thuá»™c bÃ i hÃ¡t <b><a href="%s" target="_blank">%s</a></b>',
    "manage.report.title.comment.only": 'GÃ³p Ã½ cho bÃ¬nh luáº­n (<b>#%s</b>) cá»§a <b><a href="%s" target="_blank">%s</a></b>',
    "manage.report.title.user.only": 'GÃ³p Ã½ cho ngÆ°á»i dÃ¹ng <b><a href="%s" target="_blank">%s</a></b>',
    "manage.report.title.artist": 'GÃ³p Ã½ cho nghá»‡ sÄ© <b><a href="%s" target="_blank">%s</a></b>',
    "manage.report.for.song": "BÃ i hÃ¡t: <b>%s</b>",
    "manage.report.for.user": "NgÆ°á»i dÃ¹ng: <b>%s</b>",
    "manage.report.for.artist": "Nghá»‡ sÄ©: <b>%s</b>",
    "manage.report.for.comment": "BÃ¬nh luáº­n (<b>#%s</b>) cá»§a <b>%s</b> cho bÃ i hÃ¡t: <b>%s</b>",
    "manage.report.for.comment.only": "BÃ¬nh luáº­n (<b>#%s</b>) cá»§a <b>%s</b>",
    "manage.report.get": "Nháº­n Ä‘Æ°á»£c gÃ³p Ã½: ",
    "user.anonymous": "áº¨n danh",
    "no.permission.resolve_report": "Báº¡n khÃ´ng cÃ³ quyá»n duyá»‡t gÃ³p Ã½ nÃ y",
    "no.report.found": "KhÃ´ng cÃ³ gÃ³p Ã½ nÃ o.",
    "select.report.all": "-- Táº¥t cáº£ --",
    "select.report.resolved": "ÄÃ£ giáº£i quyáº¿t",
    "select.report.not.resolved": "ChÆ°a giáº£i quyáº¿t",
    "select.report.empty": "-- Má»¥c lá»—i --",
    "select.report.song": "GÃ³p Ã½ bÃ i hÃ¡t",
    "select.report.comment": "GÃ³p Ã½ bÃ¬nh luáº­n",
    "select.report.artist": "GÃ³p Ã½ nghá»‡ sÄ©",
    "select.report.user": "GÃ³p Ã½ ngÆ°á»i dÃ¹ng",
    "select.report.of.all": "-- Táº¥t cáº£ --",
    "select.report.of.me": "GÃ³p Ã½ cá»§a tÃ´i",
    "select.report.for.me": "GÃ³p Ã½ cho tÃ´i",
    "report.could.not.create": "Táº¡o gÃ³p Ã½ khÃ´ng thÃ nh cÃ´ng",
    "report.error.song.description": "Ná»™i dung bÃ i hÃ¡t Ä‘Æ°á»£c gÃ³p Ã½:",
    "report.error.contribute.description": "Ná»™i dung phiÃªn báº£n <b>%s</b> cá»§a bÃ i hÃ¡t Ä‘Æ°á»£c gÃ³p Ã½:",
    "report.error.artist.description": "Ná»™i dung nghá»‡ sÄ© Ä‘Æ°á»£c gÃ³p Ã½:",
    "report.error.comment.description": "Ná»™i dung bÃ¬nh luáº­n Ä‘Æ°á»£c gÃ³p Ã½:",
    "report.error.label": "Lá»—i gÃ³p Ã½:",
    "report.suggest.label": "Äá» xuáº¥t:",
    "report.remove.comment": " XÃ³a bÃ¬nh luáº­n nÃ y",
    "report.remove.comment.confirm": "Báº¡n cÃ³ muá»‘n xÃ³a bÃ¬nh luáº­n nÃ y khÃ´ng?",
    "report.comment.label": "BÃ¬nh luáº­n cÃ³ ná»™i dung xáº¥u:",
    "report.comment.more.info": "MÃ´ táº£ thÃªm",
    "user.report.btn.label": "BÃ¡o vi pháº¡m",
    "user.report.title": "BÃ¡o ngÆ°á»i dÃ¹ng vi pháº¡m",
    "user.report.hint": "MÃ´ táº£ cá»¥ thá»ƒ hÆ¡n vá» vi pháº¡m...",
    "user.report.problem.spam": "Quáº£ng cÃ¡o, spam",
    "user.report.problem.sexual": "Ná»™i dung nháº¡y cáº£m, 18+",
    "user.report.problem.abuse": "Lá»i láº½ thÃ´ tá»¥c, gÃ¢y háº¥n, xÃºc pháº¡m ngÆ°á»i khÃ¡c",
    "user.report.problem.illegal": "LiÃªn quan Ä‘áº¿n chÃ­nh trá»‹, tÃ´n giÃ¡o, sáº¯c tá»™c",
    "user.report.send": "BÃ¡o vi pháº¡m",
    "no.permission.comment": "TÃ i khoáº£n cá»§a báº¡n khÃ´ng thá»ƒ gá»­i bÃ¬nh luáº­n!",
    "no.permission.please.login": "Vui lÃ²ng Ä‘Äƒng nháº­p Ä‘á»ƒ sá»­ dá»¥ng chá»©c nÄƒng nÃ y",
    "no.comment": "ChÆ°a cÃ³ bÃ¬nh luáº­n nÃ o.",
    "comment.must.not.be.empty": "BÃ¬nh luáº­n pháº£i cÃ³ Ã­t nháº¥t má»™t kÃ½ tá»±",
    "comment.must.not.exceed.maximum": "BÃ¬nh luáº­n khÃ´ng Ä‘Æ°á»£c vÆ°á»£t quÃ¡ %s kÃ½ tá»±",
    "common.please.login.to.comment": "Vui lÃ²ng <a class='blue-link' href='javascript:window.top.Login.doLogin()'>ÄÄƒng nháº­p</a> hoáº·c <a class='blue-link' target='_blank' href='auth/register'>ÄÄƒng kÃ½</a> Ä‘á»ƒ gá»­i bÃ¬nh luáº­n.",
    profile: "ThÃ´ng tin cÃ¡ nhÃ¢n",
    "profile.join.date": "Tham gia ngÃ y",
    "profile.bio": "Tá»± giá»›i thiá»‡u",
    "profile.bio.placeholder": "VÃ­ dá»¥: TÃ´i ráº¥t yÃªu thÃ­ch Ä‘Ã n",
    "profile.playlist": "Playlist cá»§a",
    "profile.song.favorite": "BÃ i hÃ¡t yÃªu thÃ­ch cá»§a",
    "profile.song.posted": "BÃ i hÃ¡t Ä‘Ã£ Ä‘Äƒng cá»§a",
    "profile.playlists": "Playlists cá»§a",
    "profile.update": "Chá»‰nh sá»­a thÃ´ng tin cÃ¡ nhÃ¢n",
    "profile.user.name": "TÃªn Ä‘Äƒng nháº­p",
    "profile.user.name.placeholder": "VÃ­ dá»¥: nguyenvanngoc",
    "profile.full.name": "TÃªn Ä‘áº§y Ä‘á»§",
    "profile.full.name.placeholder": "VÃ­ dá»¥: Nguyá»…n VÄƒn Ngá»c",
    "profile.avatar": "Avatar",
    "profile.facebook": "Facebook",
    "profile.facebook.placeholder": "VÃ­ dá»¥: http://facebook.com/nguyenvanngoc",
    "profile.youtube": "Youtube",
    "profile.youtube.placeholder": "VÃ­ dá»¥: http://youtube.com/c/nguyenvanngoc",
    "profile.email": "Email",
    "profile.email.placeholder": "VÃ­ dá»¥: nguyenvanngoc@gmail.com",
    "profile.change.password": "Äá»•i máº­t kháº©u",
    "profile.old.password": "Máº­t kháº©u cÅ©",
    "profile.new.password": "Máº­t kháº©u má»›i",
    "profile.confirm.password": "Nháº­p láº¡i máº­t kháº©u",
    "profile.group": "NhÃ³m quyá»n",
    "notification.empty": "Báº¡n chÆ°a cÃ³ thÃ´ng bÃ¡o má»›i nÃ o",
    "notification.report.status.done": "Má»™t bÃ¡o lá»—i/gÃ³p Ã½ cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c xá»­ lÃ½ xong!",
    "notification.song.approved": "BÃ i hÃ¡t <b>%s</b> cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c duyá»‡t bá»Ÿi <b>%s</b>",
    "notification.song.merged": "BÃ i hÃ¡t <b>%s</b> cá»§a báº¡n bá»‹ trÃ¹ng vÃ  Ä‘Ã£ Ä‘Æ°á»£c gá»™p bá»Ÿi <b>%s</b>.",
    "notification.comment": "<b>%s</b> vá»«a gá»­i má»™t bÃ¬nh luáº­n á»Ÿ trang <b>%s</b>",
    "notification.reply": "<b>%s</b> vá»«a tráº£ lá»i má»™t bÃ¬nh luáº­n cá»§a báº¡n á»Ÿ trang <b>%s</b>",
    "notification.song.request.posted": "<b>%s</b> vá»«a Ä‘Äƒng bÃ i hÃ¡t báº¡n yÃªu cáº§u: <b>%s</b>",
    "notification.song.request.cancelled": "YÃªu cáº§u bÃ i hÃ¡t <b>%s</b> cá»§a báº¡n Ä‘Ã£ bá»‹ tá»« chá»‘i",
    "notification.song.reported": "BÃ i hÃ¡t <b>%s</b> cá»§a báº¡n nháº­n Ä‘Æ°á»£c má»™t gÃ³p Ã½ tá»« <b>%s</b>",
    "notification.unapproved.song.edit": "BÃ i hÃ¡t <b>%s</b> vá»«a Ä‘Æ°á»£c chá»‰nh sá»­a bá»Ÿi <b>%s</b>",
    "notification.content": "Ná»™i dung thÃ´ng bÃ¡o",
    "notification.link": "ÄÆ°á»ng dáº«n thÃ´ng bÃ¡o",
    "notification.send": "Gá»­i",
    "notification.created.and.waiting.approved": "Xin chÃºc má»«ng.<br/>ThÃ´ng bÃ¡o cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c gá»­i Ä‘i thÃ nh cÃ´ng.",
    "notification.default.version.edited": "PhiÃªn báº£n máº·c Ä‘á»‹nh <b>%s</b> vá»«a Ä‘Æ°á»£c chá»‰nh sá»­a bá»Ÿi <b>%s</b>.",
    "notification.suggestion": "<b>%s</b> Ä‘á» xuáº¥t chá»‰nh sá»­a bÃ i hÃ¡t <b>%s</b>: %s",
    "discussion.suggestion": "Äá» xuáº¥t chá»‰nh sá»­a bÃ i hÃ¡t <b>%s</b>: %s",
    "contribute.discussion.title": "BÃ i hÃ¡t %s (%s)",
    "report.discussion.title": "BÃ¡o lá»—i / GÃ³p Ã½",
    "song.discussion.title": "BÃ i hÃ¡t %s",
    "song.request.discussion.title": "YÃªu cáº§u bÃ i hÃ¡t %s",
    "unapproved.song.discussion.title": "BÃ i hÃ¡t Ä‘ang chá» duyá»‡t %s",
    subscription: "Nháº­n thÃ´ng bÃ¡o",
    "discussion.subscription.tip": "Nháº­n thÃ´ng bÃ¡o khi cÃ³ bÃ¬nh luáº­n má»›i",
    "unfollow.done": "ÄÃ£ táº¯t thÃ´ng bÃ¡o tá»« bÃ¬nh luáº­n nÃ y thÃ nh cÃ´ng.",
    notification: "ThÃ´ng bÃ¡o cá»§a báº¡n",
    "notification.comment.grouped": "<b>%s</b> vÃ  nhá»¯ng ngÆ°á»i khÃ¡c vá»«a gá»­i %s bÃ¬nh luáº­n á»Ÿ trang <b>%s</b>",
    "common.please.login.to.view.favorite.songs": '<a class="blue-link" href="javascript:window.top.Login.doLogin()">ÄÄƒng nháº­p</a> hoáº·c <a class="blue-link" target="_blank" href="auth/register">Ä‘Äƒng kÃ­</a> Ä‘á»ƒ xem bÃ i hÃ¡t yÃªu thÃ­ch cá»§a báº¡n.',
    "common.please.login.to.view.user.playlists": '<a class="blue-link" href="javascript:window.top.Login.doLogin()">ÄÄƒng nháº­p</a> hoáº·c <a class="blue-link" target="_blank" href="auth/register">Ä‘Äƒng kÃ­</a> Ä‘á»ƒ xem playlist cá»§a báº¡n.',
    "common.empty.favorite.songs": "ChÆ°a cÃ³ bÃ i hÃ¡t yÃªu thÃ­ch nÃ o!",
    "common.empty.user.playlists": 'ChÆ°a cÃ³ playlist nÃ o cá»§a báº¡n! <span style="color: blue;">Táº¡o playlist má»›i?</span>',
    "playlist.detail.panel.info": "ThÃ´ng tin Playlist",
    "playlist.detail.permission.update.playlist": "Báº¡n khÃ´ng cÃ³ quyá»n cáº­p nháº­t playlist nÃ y.",
    "playlist.detail.permission.delete.playlist": "Báº¡n khÃ´ng cÃ³ quyá»n xÃ³a playlist nÃ y.",
    "playlist.detail.update.success": "Cáº­p nháº­t playlist thÃ nh cÃ´ng.",
    "playlist.detail.delete.success": "XÃ³a playlist thÃ nh cÃ´ng.",
    "playlist.detail.remove.song.playlist.success": "XÃ³a bÃ i hÃ¡t ra khá»i playlist thÃ nh cÃ´ng.",
    "playlist.detail.delete.confirm": "Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a playlist nÃ y?",
    "playlist.detail.button.edit": "Chá»‰nh sá»­a",
    "playlist.detail.button.save": "LÆ°u",
    "playlist.detail.button.cancel": "Há»§y",
    "playlist.detail.button.delete": "XÃ³a",
    "playlist.detail.detele.song.confirm": "Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a bÃ i hÃ¡t nÃ y ra khá»i playlist?",
    "common.no.favorite.songs": "ChÆ°a cÃ³ bÃ i hÃ¡t yÃªu thÃ­ch nÃ o!",
    "common.no.user.playlists": 'ChÆ°a cÃ³ playlist nÃ o cá»§a báº¡n! <a class="blue-link" href="playlist/create">Táº¡o playlist má»›i?</a>',
    "common.no.song.playlists": "ChÆ°a cÃ³ bÃ i hÃ¡t nÃ o trong playlist nÃ y.",
    anonymous: "má»™t ngÆ°á»i nÃ o Ä‘Ã³",
    "common.chords": "CÃ¡c há»£p Ã¢m thÃ´ng dá»¥ng",
    "chord.page.instruction": "<p>RÃª chuá»™t vÃ o há»£p Ã¢m Ä‘á»ƒ xem cÃ¡ch báº¥m</p>\n    <p>Nháº¥n vÃ o há»£p Ã¢m Ä‘á»ƒ xem chi tiáº¿t</p>",
    "circle.of.fifths": "Circle of Fifths",
    "all.chords": "Há»£p Ã¢m khÃ¡c",
    "chord.finger.instruction.title": "CÃ¡ch Ä‘á»c há»£p Ã¢m",
    "chord.finger.instruction": '<ul class="text-left">\n                          <li>\n                            <p>Vá»‹ trÃ­ ngÃ³n tay<p>\n                            <ul>\n                              <li>\n                                <img src="assets/images/finger_1.png" width="15px"/>: NgÃ³n trá»\n                              </li>\n                              <li>\n                                <img src="assets/images/finger_2.png" width="15px"/>: NgÃ³n giá»¯a\n                              </li>\n                              <li>\n                                <img src="assets/images/finger_3.png" width="15px"/>: NgÃ³n Ã¡p Ãºt\n                              </li>\n                              <li>\n                                <img src="assets/images/finger_4.png" width="15px"/>: NgÃ³n Ãºt\n                              </li>\n\n                            </ul>\n                            <br/>\n                          </li>\n                          <li><strong>o</strong>: DÃ¢y gáº«y ngÄƒn Ä‘áº§u tiÃªn (dÃ¢y buÃ´ng)</li>\n                          <li><strong>x</strong>: DÃ¢y khÃ´ng gáº«y</li>\n                          <li><strong>3fr</strong>: NgÄƒn thá»© 3 cá»§a Ä‘Ã n</li>\n                        </ul>',
    "find.by.chord.instruction.1": "CÃ¡c há»£p Ã¢m mÃ  báº¡n muá»‘n tÃ¬m:",
    "find.by.chord.instruction.2": "Am, F, C, G... (ngÄƒn cÃ¡ch báº±ng dáº¥u pháº©y)",
    "find.by.chord.instruction.3": ">> TÃ¬m táº¥t cáº£ nhá»¯ng bÃ i hÃ¡t cÃ³ há»£p Ã¢m nÃ y",
    "find.by.chord.instruction.4": 'Nháº­p vÃ o "Am, F, C, G" sau Ä‘Ã³ nháº¥n nÃºt TÃ¬m kiáº¿m, website sáº½ liá»‡t kÃª cho báº¡n táº¥t cáº£ nhá»¯ng bÃ i hÃ¡t mÃ  cÃ³ 4 há»£p Ã¢m "Am, F, C, G" - káº¿t quáº£ sáº½ cá»‘ gáº¯ng loáº¡i bá» nhá»¯ng bÃ i hÃ¡t cÃ³ há»£p Ã¢m khÃ´ng náº±m trong danh sÃ¡ch trÃªn cÃ ng nhiá»u cÃ ng tá»‘t.',
    "find.by.chord.instruction.5": "CÃ¡c vÃ²ng há»£p Ã¢m thÃ´ng dá»¥ng",
    "find.by.chord.instruction.6": "Click vÃ o cÃ¡c vÃ²ng há»£p Ã¢m Ä‘á»ƒ tÃ¬m kiáº¿m",
    "apps.page.title": "á»¨ng dá»¥ng Há»£p Ã‚m Chuáº©n trÃªn mobile",
    "apps.page.subtitle": "Xem há»£p Ã¢m bÃ i hÃ¡t offline, cáº­p nháº­t bÃ i hÃ¡t má»›i hÃ ng ngÃ y",
    "posted.by": "ÄÄƒng bá»Ÿi",
    "set.as.default.contribute": "Chá»n lÃ m bÃ i máº·c Ä‘á»‹nh",
    "are.you.sure.set.contribute.default": "Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n Ä‘áº·t phiÃªn báº£n nÃ y lÃªn lÃ m máº·c Ä‘á»‹nh?",
    "random.playlist": "Playlist ngáº«u nhiÃªn",
    "login.to.favorite.playlist.create.song": "<b><a href='javascript:Login.doLogin()'>ÄÄƒng nháº­p</a></b> hoáº·c <b><a href='auth/register'>ÄÄƒng kÃ½</a></b> Ä‘á»ƒ Ä‘Ã¡nh dáº¥u bÃ i hÃ¡t yÃªu thÃ­ch vÃ  táº¡o playlist.",
    "no.more.feed": ":-( KhÃ´ng cÃ²n bÃ i hÃ¡t nÃ o Ä‘á»ƒ hiá»ƒn thá»‹!",
    "may.duplicate.songs": "CÃ¡c bÃ i hÃ¡t cÃ³ thá»ƒ bá»‹ trÃ¹ng",
    "good.no.duplicate.song": "QuÃ¡ tá»‘t, khÃ´ng cÃ³ bÃ i nÃ o trÃ¹ng vá»›i bÃ i nÃ y :-)",
    merge: "Gá»™p",
    "search.merge.song": "TÃ¬m kiáº¿m bÃ i hÃ¡t Ä‘á»ƒ gá»™p vÃ o",
    "are.you.sure.merge.into.this.song": "Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n gá»™p vÃ o bÃ i hÃ¡t nÃ y?",
    "no.unapprove.songs": "ChÆ°a cÃ³ bÃ i hÃ¡t má»›i nÃ o!",
    "confirm.add.artist": 'Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n thÃªm nghá»‡ sÄ© "%s"?',
    "confirm.add.chord": 'Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n thÃªm há»£p Ã¢m "%s"?',
    "confirm.add.genre": 'Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n thÃªm thá»ƒ loáº¡i "%s"?',
    "confirm.artist.success": "ÄÃ£ thÃªm nghá»‡ sÄ© thÃ nh cÃ´ng!",
    "confirm.chord.success": "ÄÃ£ thÃªm há»£p Ã¢m thÃ nh cÃ´ng!",
    "confirm.genre.success": "ÄÃ£ thÃªm thá»ƒ loáº¡i thÃ nh cÃ´ng!",
    menu: "Menu",
    "load.comment.section": "Hiá»ƒn thá»‹ bÃ¬nh luáº­n",
    "upload.image.imgur.failed": "KhÃ´ng thá»ƒ táº£i hÃ¬nh lÃªn há»‡ thá»‘ng. Vui lÃ²ng thá»­ láº¡i sau.",
    "upload.image.wrong.name": "Vui lÃ²ng nháº­p Ä‘Ãºng táº­p tin hÃ¬nh!",
    "general.report.title": "BÃ¡o lá»—i - GÃ³p Ã½",
    "general.report.description": "GiÃºp chÃºng tÃ´i hoÃ n thiá»‡n hÆ¡n sáº£n pháº©m nÃ y báº±ng cÃ¡ch gá»­i Ã½ kiáº¿n - Ä‘Ã³ng gÃ³p - thÃ´ng bÃ¡o lá»—i.",
    "general.report.email.label": "LiÃªn láº¡c (Ä‘á»ƒ chÃºng tÃ´i cÃ³ thá»ƒ tráº£ lá»i cho báº¡n)",
    "general.report.email.label.short": "LiÃªn láº¡c",
    "general.report.email.placeholder": "Email, tÃªn tÃ i khoáº£n ,Facebook...",
    "general.report.content.label": "Ná»™i dung",
    "general.report.button.label": "Gá»­i",
    "general.report.footer.label": 'Theo dÃµi trang <a class="blue-link" href="%s">Facebook cá»§a Há»£p Ã‚m Chuáº©n</a> Ä‘á»ƒ Ä‘Æ°á»£c thÃ´ng bÃ¡o vá» nhá»¯ng thay Ä‘á»•i má»›i nháº¥t.',
    "general.report.thanks": "Cáº£m Æ¡n báº¡n Ä‘Ã£ gÃ³p Ã½ cho chÃºng tÃ´i.</br>ChÃºng tÃ´i sáº½ liÃªn há»‡ báº¡n trong thá»i gian sá»›m nháº¥t.",
    "general.report.mail.send.error": "Xin lá»—i báº¡n há»‡ thá»‘ng khÃ´ng thá»ƒ nháº­n gÃ³p Ã½ trong thá»i gian nÃ y.",
    "general.report.mail.subject": "[HAC2] GÃ³p Ã½ vá» website",
    "general.report.mail.body": "GÃ³p Ã½ tá»« <b>%s</b> vá»›i ná»™i dung: </br>%s",
    "god.notification.confirm": "Xem láº¡i thÃ´ng bÃ¡o\n\nNá»™i dung:\n%s\n\nLink:\n%s\n\nBáº¡n cÃ³ cháº¯c cháº¯n muá»‘n gá»­i khÃ´ng?\n",
    about: "Giá»›i thiá»‡u",
    "cannot.edit.because.contribute": "(khÃ´ng thá»ƒ sá»­a)",
    "go.to.comment": "Äi Ä‘áº¿n bÃ¬nh luáº­n",
    "manage.dashboard.instruction": '\n    <p class="text-center">ÄÃ¢y lÃ  giao diá»‡n quáº£n lÃ½ cá»§a Há»£p Ã‚m Chuáº©n.</p>\n    <p>Táº¡i Ä‘Ã¢y báº¡n cÃ³ thá»ƒ:</p>\n    <ul>\n    <li>Xem cÃ¡c bÃ i hÃ¡t Ä‘ang chá» Ä‘Æ°á»£c duyá»‡t, yÃªu cáº§u há»£p Ã¢m vÃ  bÃ¡o cÃ¡o trÃªn <b>Há»£p Ã‚m Chuáº©n.</b></li>\n    <li>Tham gia bÃ¬nh luáº­n, gÃ³p Ã½, tháº£o luáº­n cho trong má»—i trang.</li>\n    <li>Chá»‰nh sá»­a cÃ¡c bÃ i hÃ¡t Ä‘ang chá» duyá»‡t cá»§a báº¡n.</li>\n</ul>',
    "search.mode.google": "TÃ¬m trÃªn Google",
    "song.title.template": "Há»£p Ã¢m %s - %s (%s) - Há»£p Ã‚m Chuáº©n - Tra cá»©u há»£p Ã¢m Guitar",
    "song.keyword.template": "%1$s há»£p Ã¢m, %1$s tab, %1$s guitar, %1$s hop am chuan, %1$s hop am guitar, bÃ i hÃ¡t %1$s, há»£p Ã¢m chuáº©n, há»£p Ã¢m guitar, há»£p Ã¢m chuáº©n guitar",
    "chord.list": "Danh sÃ¡ch há»£p Ã¢m",
    "hot.today": "HOT NHáº¤T HÃ”M NAY",
    "onboarding.search": "TÃ¬m kiáº¿m tiá»‡n lá»£i hÆ¡n",
    "onboarding.rate": "BÃ¬nh chá»n cho phiÃªn báº£n há»£p Ã¢m",
    "onboarding.contribute": "ÄÃ³ng gÃ³p phiÃªn báº£n há»£p Ã¢m cá»§a báº¡n",
    "onboarding.instruction": 'Nháº¥n phÃ­m <span class="keycap">?</span> Ä‘á»ƒ xem hÆ°á»›ng dáº«n Ä‘áº§y Ä‘á»§.',
    "onboarding.title": "Há»£p Ã‚m Chuáº©n phiÃªn báº£n má»›i",
    "onboarding.title.more": "...vÃ  nhiá»u tÃ­nh nÄƒng thÃº vá»‹ khÃ¡c!",
    "send.report.new.version": "GÃ³p Ã½ phiÃªn báº£n má»›i",
    "general.report.facebook.description": "Gá»­i gÃ³p Ã½ qua Facebook",
    "general.report.or.submit.description": "Hoáº·c viáº¿t ná»™i dung vÃ o form bÃªn dÆ°á»›i",
    "hac2.welcome": "ChÃ o má»«ng báº¡n Ä‘áº¿n vá»›i Há»£p Ã‚m Chuáº©n phiÃªn báº£n má»›i!",
    "see.new.features": "Xem giá»›i thiá»‡u cÃ¡c chá»©c nÄƒng má»›i",
    "click.to.small": "(Click Ä‘á»ƒ táº¯t)",
    "page.create.toolbox.auto.brackets": "Tá»± Ä‘á»™ng thÃªm ngoáº·c vuÃ´ng [ ]",
    "page.create.toolbox.auto.brackets.title": "Tá»± Ä‘á»™ng Ä‘Ã³ng má»Ÿ ngoáº·c vuÃ´ng khi báº¡n gÃµ cÃ¡c chá»¯ cÃ¡i: C, D, E, F, G, A, B",
    page: "Trang",
    "print.message": "Trang nÃ y Ä‘Æ°á»£c in tá»« <b>HopAmChuan.COM</b><br/> Cáº£m Æ¡n báº¡n Ä‘Ã£ ghÃ© thÄƒm :-)",
    "select.version": "Chá»n phiÃªn báº£n",
    "question.voting.1": "Bao nhiÃªu Ä‘iá»ƒm cho bÃ i nÃ y?",
    "question.voting.2": "Há»£p Ã¢m nÃ y xá»©ng Ä‘Ã¡ng máº¥y sao?",
    "question.voting.3": "BÃ¬nh chá»n cho há»£p Ã¢m bÃ i nÃ y:",
    "question.voting.4": "1.. 2.. 3.. 5.. báº¡n cho bÃ i nÃ y máº¥y sao?",
    "question.voting.5": "Báº¡n nghÄ© tháº¿ nÃ o vá» há»£p Ã¢m bÃ i nÃ y?",
    "question.voting.6": "Cháº¥m Ä‘iá»ƒm:",
    "question.voting.7": "BÃ i nÃ y hay chá»©?",
    "question.voting.8": "BÃ i nÃ y Ä‘Æ°á»£c máº¥y Ä‘iá»ƒm?",
    "question.voting.9": "ÄÃ¡nh giÃ¡ bÃ i nÃ y:",
    "question.voting.10": "GiÃºp HAC báº±ng cÃ¡ch gá»­i Ä‘Ã¡nh giÃ¡ ^_^",
    "thanks.for.voting.3.1": '<h3><i class="fa fa-fw fa-check" style="color: #4CAF50; font-size: 50px"></i> Cáº£m Æ¡n báº¡n Ä‘Ã£ bÃ¬nh chá»n, tÃ´i thÃ­ch báº¡n :)</h3>',
    "thanks.for.voting.3.2": '<h3>Tuyá»‡t vá»i ^_^ <i class="fa fa-fw fa-check" style="color: #4CAF50; font-size: 50px"></i></h3>',
    "thanks.for.voting.3.3": '<h3>Cáº£m Æ¡n báº¡n ráº¥t nhiá»u! <span style="font-size: 30px">ðŸ‘</span></h3>',
    "thanks.for.voting.3.4": '<h3>Thank you Vinamilk! :-*<span style="font-size: 30px">ðŸ˜˜</span></h3>',
    "thanks.for.voting.3.5": '<h3>Chuáº©n! ;-)<span style="font-size: 30px">ðŸ˜˜</span></h3>',
    "thanks.for.voting.3.6": '<h3>Cáº£m Æ¡n báº¡n Ä‘Ã£ bÃ¬nh chá»n :)<i class="fa fa-fw fa-check" style="color: #4CAF50; font-size: 50px"></i></h3>',
    "thanks.for.voting.3.7": '<h3>BÃ¬nh chá»n cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c lÆ°u láº¡i <i class="fa fa-fw fa-check" style="color: #4CAF50; font-size: 50px"></i></h3>',
    "thanks.for.voting.3.8": '<h3><i class="fa fa-fw fa-check" style="color: #4CAF50; font-size: 50px"></i> Done! :-)</h3>',
    "thanks.for.voting.3.9": '<h3><i class="fa fa-fw fa-check" style="color: #4CAF50; font-size: 50px"></i> Cáº£m Æ¡n báº¡n Ä‘Ã£ á»§ng há»™ HAC :) </h3>',
    "thanks.for.voting.3.10": '<h3><i class="fa fa-fw fa-check" style="color: #4CAF50; font-size: 50px"></i> Ráº¥t cáº£m Æ¡n báº¡n :) </h3>',
    "auto.scroll.after.x.sec": 'Tá»± Ä‘á»™ng cuá»™n xuá»‘ng sau <b id="auto-scroll-countdown">10</b> giÃ¢y... [<b class="blue-link" id="off-auto-scroll">Táº®T Tá»° Äá»˜NG</b>]',
    "discussion.owner": "ngÆ°á»i Ä‘Äƒng",
    "discussion.moderator": "HAC Team",
    "x.has.editted.song.at.x": "%s - <b>%s</b> Ä‘Ã£ chá»‰nh sá»­a bÃ i hÃ¡t nÃ y",
    "changed.title": "tiÃªu Ä‘á»",
    "changed.note": "mÃ´ táº£",
    "changed.link": "link",
    "changed.lyric": "lá»i",
    "changed.key": "tÃ´ng",
    "changed._genres": "thá»ƒ loáº¡i",
    "changed._authors": "tÃ¡c giáº£",
    "changed._singers": "ca sÄ©",
    close: "ÄÃ³ng",
    "easy.chord": "Há»£p Ã¢m dá»…",
    "x.people.approve.song": "ngÆ°á»i Ä‘ang duyá»‡t bÃ i nÃ y",
    "profile.favorite": "BÃ i hÃ¡t yÃªu thÃ­ch",
    "proflile.overview": "ThÃ´ng tin chung",
    scores: "Äiá»ƒm uy tÃ­n",
    "transaction.description.0": "ÄÄƒng bÃ i hÃ¡t má»›i",
    "transaction.description.1": "ÄÃ³ng gÃ³p phiÃªn báº£n má»›i cho bÃ i hÃ¡t",
    "transaction.description.2": "BÃ¬nh chá»n Ä‘iá»‡u cho bÃ i hÃ¡t",
    "transaction.description.3": "Duyá»‡t bÃ i hÃ¡t",
    "transaction.description.4": "BÃ i hÃ¡t Ä‘Æ°á»£c Ä‘Ã¡nh giÃ¡ 3 sao",
    "transaction.description.5": "BÃ i hÃ¡t Ä‘Æ°á»£c Ä‘Ã¡nh giÃ¡ 4 sao",
    "transaction.description.6": "BÃ i hÃ¡t Ä‘Æ°á»£c Ä‘Ã¡nh giÃ¡ 5 sao",
    "transaction.description.7": "BÃ¬nh luáº­n Ä‘Æ°á»£c yÃªu thÃ­ch",
    "transaction.description.8": "BÃ i hÃ¡t Ä‘Æ°á»£c yÃªu thÃ­ch",
    "transaction.description.9": "Táº¡o playlist má»›i",
    "transaction.description.10": "BÃ i hÃ¡t Ä‘Æ°á»£c thÃªm vÃ o playlist",
    "transaction.description.11": "YÃªu cáº§u bÃ i hÃ¡t Ä‘Æ°á»£c yÃªu thÃ­ch",
    "transaction.description.12": "Gá»­i yÃªu cáº§u bÃ i hÃ¡t má»›i",
    "transaction.description.13": "Gá»­i report má»›i",
    "transaction.description.14": "BÃ i hÃ¡t Ä‘Æ°á»£c 20 ngÆ°á»i bÃ¬nh chá»n â‰¥ 4 sao",
    "transaction.description.15": "BÃ i hÃ¡t Ä‘Æ°á»£c 100 ngÆ°á»i bÃ¬nh chá»n â‰¥ 4 sao",
    "transaction.description.16": "BÃ i hÃ¡t Ä‘Æ°á»£c 300 ngÆ°á»i bÃ¬nh chá»n â‰¥ 4 sao",
    "transaction.description.17": "BÃ i hÃ¡t Ä‘Æ°á»£c 50 lÆ°á»£t yÃªu thÃ­ch",
    "transaction.description.18": "BÃ i hÃ¡t Ä‘Æ°á»£c 200 lÆ°á»£t yÃªu thÃ­ch",
    "transaction.description.19": "BÃ i hÃ¡t Ä‘Æ°á»£c 500 lÆ°á»£t yÃªu thÃ­ch",
    "transaction.description.20": "BÃ i hÃ¡t Ä‘Æ°á»£c 1000 lÆ°á»£t yÃªu thÃ­ch",
    "transaction.description.21": "Gá»­i bÃ¬nh chá»n bÃ i hÃ¡t",
    "transaction.description.22": "Chá»‰nh sá»­a bÃ i hÃ¡t",
    users: "ThÃ nh ViÃªn",
    activities: "Hoáº¡t Ä‘á»™ng",
    moment: "Thá»i Ä‘iá»ƒm",
    "last.seen": "Truy cáº­p gáº§n Ä‘Ã¢y",
    "active.users": "Top 50 thÃ nh viÃªn tÃ­ch cá»±c",
    "active.users.week": "Trong tuáº§n",
    "active.users.month": "Trong thÃ¡ng",
    "scores.usage": "Äiá»ƒm nÃ y dÃ¹ng Ä‘á»ƒ lÃ m gÃ¬?",
    "song.copyrighted": "Lá»i bÃ i hÃ¡t nÃ y Ä‘Ã£ bá»‹ xÃ³a vÃ¬ lÃ½ do báº£n quyá»n.",
    version: "PhiÃªn báº£n",
    "approved.versions": "Há»£p Ã¢m Ä‘Ã£ duyá»‡t",
    "user.versions": "Há»£p Ã¢m cÃ¡ nhÃ¢n",
    "my.version": "Há»£p Ã¢m cá»§a tÃ´i",
    "version.of": "Há»£p Ã¢m cá»§a",
    "submit.version": "ÄÄƒng phiÃªn báº£n nÃ y",
    "submit.your.version": "ÄÄƒng phiÃªn báº£n cá»§a báº¡n",
    "merge.to.existing.version": "Gá»™p cÃ¡c chá»‰nh sá»­a vÃ o má»™t phiÃªn báº£n cÃ³ sáºµn",
    "create.new.version": "Táº¡o phiÃªn báº£n má»›i",
    or: "hoáº·c",
    "please.say.explicit.what.changed": "Há»£p Ã¢m cá»§a báº¡n khÃ¡c báº£n gá»‘c nhÆ° tháº¿ nÃ o?",
    "version.compare": "So sÃ¡nh",
    "compare.with": "So sÃ¡nh vá»›i",
    annotation: "ChÃº thÃ­ch",
    "diff.added": "ThÃªm má»›i",
    "diff.removed": "XÃ³a bá»",
    "submit.version.button": "Gá»­i Ä‘i",
    "submit.version.description": "PhiÃªn báº£n cá»§a báº¡n sáº½ Ä‘Æ°á»£c duyá»‡t trÆ°á»›c khi hiá»ƒn thá»‹ lÃªn trang chá»§.",
    "choose.parent.version": "Chá»n báº£n gá»‘c",
    "this.will.override.your.existing.version": "LÆ°u Ã½: náº¿u báº¡n thay Ä‘á»•i báº£n gá»‘c, cÃ¡c chá»‰nh sá»­a trÃªn phiÃªn báº£n hiá»‡n táº¡i cá»§a báº¡n sáº½ bá»‹ máº¥t. Báº¡n cÃ³ muá»‘n tiáº¿p tá»¥c?",
    "version.edit.and.submit": "Chá»‰nh sá»­a",
    "send.suggestion": "Gá»­i gá»£i Ã½ chá»‰nh sá»­a",
    "also.create.my.version": "Táº¡o phiÃªn báº£n cÃ¡ nhÃ¢n sau khi gá»­i",
    "your.edit.will.be.approved": "Chá»‰nh sá»­a cá»§a báº¡n sáº½ Ä‘Æ°á»£c duyá»‡t vÃ  gá»™p vÃ o phiÃªn báº£n Ä‘ang cÃ³.",
    "also.create.my.version.descrpition": "Báº¡n cÃ³ thá»ƒ lÆ°u láº¡i má»™t phiÃªn báº£n cÃ¡ nhÃ¢n cá»§a riÃªng báº¡n.",
    "submit.new.version": "Táº¡o phiÃªn báº£n má»›i",
    "submit.new.version.description": "Náº¿u há»£p Ã¢m cá»§a báº¡n <b>quÃ¡ khÃ¡c biá»‡t</b> hoáº·c cÃ³ <b>cÃ¡ch chÆ¡i khÃ¡c vá»›i báº£n gá»‘c</b>, nháº¥n nÃºt bÃªn dÆ°á»›i Ä‘á»ƒ táº¡o thÃªm má»™t phiÃªn báº£n há»£p Ã¢m khÃ¡c cho bÃ i nÃ y.",
    "moderate.song": "Quáº£n lÃ½ bÃ i hÃ¡t",
    "back.to.song": "Quay láº¡i trang bÃ i hÃ¡t",
    analytics: "Thá»‘ng kÃª",
    "moderate.suggestions": "Gá»£i Ã½ chá»‰nh sá»­a",
    "moderate.version.request": "PhiÃªn báº£n má»›i",
    "moderate.song.reports": "BÃ¡o lá»—i",
    "moderate.song.general": "ThÃ´ng tin liÃªn quan",
    rating: "BÃ¬nh chá»n",
    "editted.on": "chá»‰nh sá»­a trÃªn",
    edit: "Chá»‰nh sá»­a",
    "version.suggestion.merge": "Gá»™p vÃ o phiÃªn báº£n",
    "version.suggestion.merge.confirm": "Báº¡n cÃ³ cháº¯n cháº¯n muá»‘n gá»™p chá»‰nh sá»­a nÃ y?",
    "version.suggestion.reject": "Tá»« chá»‘i gá»™p",
    "version.suggestion.only.owner.can.merge": "Chá»‰ cÃ³ ngÆ°á»i quáº£n lÃ½ phiÃªn báº£n hoáº·c BQT má»›i cÃ³ thá»ƒ gá»™p chá»‰nh sá»­a nÃ y.",
    "suggestions.empty": "ChÆ°a cÃ³ chá»‰nh sá»­a nÃ o.",
    "suggestion.waiting": "Äang chá» gá»™p",
    "suggestion.approve.success": "ÄÃ£ gá»™p thÃ nh cÃ´ng!",
    "suggestion.reject.success": "Báº¡n Ä‘Ã£ tá»« chá»‘i gá»™p chá»‰nh sá»­a nÃ y.",
    "notification.suggestion.approved": "<b>%s Ä‘Ã£ gá»™p</b> chá»‰nh sá»­a cá»§a báº¡n trong bÃ i hÃ¡t <b>%s (PhiÃªn báº£n %s)</b>",
    "notification.suggestion.rejected": "<b>%s Ä‘Ã£ tá»« chá»‘i</b> chá»‰nh sá»­a cá»§a báº¡n trong bÃ i hÃ¡t <b>%s (PhiÃªn báº£n %s)</b>",
    "notification.version.approved": "PhiÃªn báº£n <b>%s</b> cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c duyá»‡t",
    "notification.version.rejected": "PhiÃªn báº£n <b>%s</b> cá»§a báº¡n Ä‘Ã£ bá»‹ tá»« chá»‘i",
    "suggestion.status.merged": "Ä‘Ã£ gá»™p",
    "suggestion.status.rejected": "Ä‘Ã£ tá»« chá»‘i",
    "no.new.suggestions": "ChÆ°a cÃ³ chá»‰nh sá»­a má»›i nÃ o",
    reject: "Tá»« chá»‘i",
    "you.can.approve.this.suggestion": "Báº¡n Ä‘Æ°á»£c quyá»n duyá»‡t hoáº·c tá»« chá»‘i chá»‰nh sá»­a nÃ y",
    "reject.reason.input": "LÃ½ do tá»« chá»‘i",
    "reject.reason.input.placeholder": "VD: há»£p Ã¢m khÃ´ng Ä‘Ãºng",
    "not.provided": "(khÃ´ng cÃ³)",
    "version.owner": "Quáº£n lÃ½ phiÃªn báº£n",
    "create.suggestion.based.on.my.version": "Gá»™p phiÃªn báº£n nÃ y vÃ o",
    "create.and.wait.approve": "Táº¡o vÃ  chá» duyá»‡t",
    "no.new.version.requests": "ChÆ°a cÃ³ phiÃªn báº£n má»›i nÃ o",
    "version.approve": "Táº¡o phiÃªn báº£n nÃ y",
    "version.approve.confirm": "Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n táº¡o phiÃªn báº£n nÃ y?",
    create: "Táº¡o",
    "version.approve.success": "ÄÃ£ táº¡o phiÃªn báº£n má»›i thÃ nh cÃ´ng!",
    "version.reject.success": "ÄÃ£ tá»« chá»‘i phiÃªn báº£n!",
    "new.version": "PhiÃªn báº£n Ä‘á» xuáº¥t",
    "version.approved": "PhiÃªn báº£n nÃ y Ä‘Ã£ Ä‘Æ°á»£c duyá»‡t",
    "request.will.be.expired.after.14.days": "CÃ¡c yÃªu cáº§u bÃ i hÃ¡t khÃ´ng Ä‘Æ°á»£c Ä‘Äƒng sau 2 tuáº§n sáº½ tá»± Ä‘á»™ng Ä‘Ã³ng.",
    "manage.song.approved.before.14.days": "CÃ¡c bÃ i hÃ¡t Ä‘Ã£ Ä‘Æ°á»£c duyá»‡t trong 2 tuáº§n gáº§n Ä‘Ã¢y.",
    "manage.artist.approved.before.14.days": "CÃ¡c nghá»‡ sÄ© Ä‘Ã£ Ä‘Æ°á»£c duyá»‡t trong 2 tuáº§n gáº§n Ä‘Ã¢y.",
    "useraction.title": "Hoáº¡t Ä‘á»™ng ngÆ°á»i dÃ¹ng",
    "manage.user.actions": "Hoáº¡t Ä‘á»™ng ngÆ°á»i dÃ¹ng",
    "no.action.found": "KhÃ´ng cÃ³ hoáº¡t Ä‘á»™ng nÃ o.",
    "select.user.action.create.song": "Táº¡o bÃ i hÃ¡t",
    "select.user.action.edit.song": "Sá»­a bÃ i hÃ¡t",
    "select.user.action.add.song.like": "ThÃ­ch phiÃªn báº£n há»£p Ã¢m",
    "select.user.action.remove.song.like": "Há»§y thÃ­ch phiÃªn báº£n há»£p Ã¢m",
    "select.user.action.rate.contribute": "ÄÃ¡nh giÃ¡ phiÃªn báº£n há»£p Ã¢m",
    "select.user.action.create.song.contribute": "Táº¡o phiÃªn báº£n há»£p Ã¢m",
    "select.user.action.edit.song.contribute": "Sá»­a phiÃªn báº£n há»£p Ã¢m",
    "select.user.action.create.song.request": "Táº¡o yÃªu cáº§u há»£p Ã¢m",
    "select.user.action.edit.song.request": "Sá»­a yÃªu cáº§u há»£p Ã¢m",
    "select.user.action.cancel.song.request": "Há»§y yÃªu cáº§u há»£p Ã¢m",
    "select.user.action.merge.song": "Gá»™p bÃ i hÃ¡t",
    "select.user.action.approve.song": "Duyá»‡t bÃ i hÃ¡t",
    "select.user.action.create.comment": "Táº¡o bÃ¬nh luáº­n",
    "select.user.action.edit.comment": "Sá»­a bÃ¬nh luáº­n",
    "select.user.action.delete.comment": "XÃ³a bÃ¬nh luáº­n",
    "select.user.action.create.report": "Táº¡o bÃ¡o lá»—i",
    "select.user.action.edit.report": "Sá»­a bÃ¡o lá»—i",
    "select.user.action.create.playlist": "Táº¡o playlist",
    "select.user.action.edit.playlist": "Sá»­a playlist",
    "select.user.action.delete.playlist": "XÃ³a playlist",
    "select.user.action.add.song.playlist": "ThÃªm bÃ i hÃ¡t vÃ o playlist",
    "select.user.action.remove.song.playlist": "XÃ³a bÃ i hÃ¡t khá»i playlist",
    "select.user.action.add.suggestion": "Táº¡o Ä‘á» xuáº¥t chá»‰nh sá»­a bÃ i hÃ¡t",
    "select.user.action.update.suggestion": "Cáº­p nháº­t Ä‘á» xuáº¥t chá»‰nh sá»­a bÃ i hÃ¡t",
    "select.user.action.approve.suggestion": "Gá»™p Ä‘á» xuáº¥t chá»‰nh sá»­a bÃ i hÃ¡t",
    "select.user.action.reject.suggestion": "Tá»« chá»‘i gá»™p chá»‰nh sá»­a bÃ i hÃ¡t",
    "select.user.action.approve.contribute": "Duyá»‡t phiÃªn báº£n há»£p Ã¢m",
    "select.user.action.reject.contribute": "Tá»« chá»‘i phiÃªn báº£n há»£p Ã¢m",
    "select.user.action.add.artist": "Táº¡o ca sÄ© / nháº¡c sÄ©",
    "select.user.action.add.genre": "Táº¡o thá»ƒ loáº¡i",
    "select.user.action.add.chord": "Táº¡o há»£p Ã¢m",
    "select.user.action.default.version.edited": "Chá»‰nh sá»­a phiÃªn báº£n máº·c Ä‘á»‹nh",
    "input.user.action.username": "TÃªn tÃ i khoáº£n",
    "select.user.action.role.all": "-- Táº¥t cáº£ --",
    "select.user.action.role.admin": "Quáº£n trá»‹ viÃªn",
    "select.user.action.role.moderator": "Moderator",
    "select.user.action.role.expert": "ChuyÃªn gia",
    "select.user.action.role.supporter": "Há»— trá»£ viÃªn",
    "select.user.action.role.member": "ThÃ nh viÃªn",
    "select.user.action.type.all": "-- Hoáº¡t Ä‘á»™ng --",
    "content.user.action.add.song.like": "ThÃ­ch phiÃªn báº£n há»£p Ã¢m <b>%s</b> cá»§a <b>%s</b>",
    "content.user.action.remove.song.like": "Há»§y thÃ­ch phiÃªn báº£n há»£p Ã¢m <b>%s</b> cá»§a <b>%s</b>",
    "content.user.action.rate.contribute": "ÄÃ¡nh giÃ¡ phiÃªn báº£n há»£p Ã¢m <b>%s sao</b> cho <b>%s</b> cá»§a <b>%s</b>",
    "content.user.action.merge.song": "Gá»™p bÃ i hÃ¡t <b>%s</b> vÃ o bÃ i hÃ¡t <b>%s</b>",
    "content.user.action.add.song.playlist": "ThÃªm bÃ i hÃ¡t <b>%s</b> vÃ o playlist <b>%s</b>",
    "content.user.action.remove.song.playlist": "XÃ³a bÃ i hÃ¡t <b>%s</b> khá»i playlist <b>%s</b>",
    deals: "KhÃ³a há»c",
    sponsors: "NhÃ  tÃ i trá»£",
    "singers.info": "THÃ”NG TIN CA SÄ¨",
    "add.singer": "ThÃªm ca sÄ©",
    "delete": "XÃ³a",
    "click.to.transpose.to.this.key": "Click Ä‘á»ƒ Ä‘á»•i tÃ´ng",
    "click.to.play": "Click Ä‘á»ƒ nghe nháº¡c",
    "contribute.singer.key": "thÃªm tÃ´ng",
    "contribute.singer.link": "thÃªm link nháº¡c",
    "no.link": "ChÆ°a cÃ³ link",
    "no.key": "ChÆ°a cÃ³ tÃ´ng",
    "no.permission.confirm.artist": "Báº¡n khÃ´ng cÃ³ quyá»n xÃ¡c nháº­n nghá»‡ sÄ©",
    "no.permission.confirm.chord": "Báº¡n khÃ´ng cÃ³ quyá»n xÃ¡c nháº­n há»£p Ã¢m",
    "no.permission.confirm.genre": "Báº¡n khÃ´ng cÃ³ quyá»n xÃ¡c nháº­n thá»ƒ loáº¡i",
    "view.all.performs": "Xem táº¥t cáº£ (+%s)",
    "singers.list": "Danh sÃ¡ch ca sÄ©",
    updated: "Cáº­p nháº­t",
    "please.enable.microphone": "KhÃ´ng thá»ƒ truy cáº­p microphone. Báº¡n cáº§n pháº£i cho phÃ©p truy cáº­p microphone Ä‘á»ƒ sá»­ dá»¥ng chá»©c nÄƒng nÃ y.",
    listening: "Äang láº¯ng nghe...",
    "this.feature.require.microphone": "Báº¡n cáº§n kÃ­ch hoáº¡t microphone Ä‘á»ƒ nháº­n dáº¡ng giá»ng nÃ³i. Báº¡n cÃ³ muá»‘n tiáº¿p tá»¥c?",
    "song.version.note": "MÃ´ táº£ phiÃªn báº£n",
    "artist.created.success": "Nghá»‡ sÄ© Ä‘Ã£ Ä‘Æ°á»£c duyá»‡t thÃ nh cÃ´ng.",
    error_csrf: "PhÃ¡t hiá»‡n truy váº¥n láº¡. Vui lÃ²ng thá»±c hiá»‡n láº¡i thao tÃ¡c.",
    login_heading: "ÄÄƒng nháº­p",
    login_subheading: "ÄÄƒng nháº­p báº±ng tÃ i khoáº£n Há»£p Ã‚m Chuáº©n",
    login_identity_label: "TÃªn tÃ i khoáº£n hoáº·c Email",
    login_password_label: "Máº­t kháº©u",
    login_remember_label: "Nhá»› máº­t kháº©u",
    login_submit_btn: "ÄÄƒng nháº­p",
    login_forgot_password: "QuÃªn máº­t kháº©u?",
    index_heading: "TÃ i khoáº£n",
    index_subheading: "Danh sÃ¡ch tÃ i khoáº£n.",
    index_fname_th: "TÃªn",
    index_lname_th: "Há»",
    index_email_th: "Email",
    index_groups_th: "NhÃ³m",
    index_status_th: "Tráº¡ng thÃ¡i",
    index_action_th: "TÃ¡c vá»¥",
    index_active_link: "ÄÃ£ kÃ­ch hoáº¡t",
    index_inactive_link: "ÄÃ£ khoÃ¡",
    index_create_user_link: "Táº¡o tÃ i khoáº£n má»›i",
    index_create_group_link: "Táº¡o nhÃ³m má»›i",
    deactivate_heading: "KhoÃ¡ tÃ i khoáº£n",
    deactivate_subheading: "Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n khoÃ¡ tÃ i khoáº£n '%s'",
    deactivate_confirm_y_label: "CÃ³:",
    deactivate_confirm_n_label: "KhÃ´ng:",
    deactivate_submit_btn: "Cháº¥p nháº­n",
    deactivate_validation_confirm_label: "XÃ¡c nháº­n",
    deactivate_validation_user_id_label: "ID TÃ i khoáº£n",
    create_user_heading: "Táº¡o tÃ i khoáº£n",
    create_user_subheading: "Vui lÃ²ng nháº­p cÃ¡c thÃ´ng tin cáº§n thiáº¿t sau.",
    create_user_username_label: "TÃªn tÃ i khoáº£n:",
    create_user_full_name_label: "TÃªn Ä‘áº§y Ä‘á»§:",
    create_user_lname_label: "Há»:",
    create_user_company_label: "CÃ´ng ty:",
    create_user_email_label: "Email:",
    create_user_phone_label: "Äiá»‡n thoáº¡i:",
    create_user_password_label: "Máº­t kháº©u:",
    create_user_password_confirm_label: "XÃ¡c nháº­n máº­t kháº©u:",
    create_user_submit_btn: "Táº¡o tÃ i khoáº£n",
    create_user_validation_username_label: "TÃªn tÃ i khoáº£n",
    create_user_validation_full_name_label: "TÃªn Ä‘áº§y Ä‘á»§",
    create_user_validation_email_label: "Email",
    create_user_validation_phone1_label: "Sá»‘ Ä‘iá»‡n thoáº¡i (mÃ£ vÃ¹ng)",
    create_user_validation_phone2_label: "Sá»‘ Ä‘iá»‡n thoáº¡i (3 sá»‘ Ä‘áº§u)",
    create_user_validation_phone3_label: "Sá»‘ Ä‘iá»‡n thoáº¡i (cÃ¡c sá»‘ cÃ²n láº¡i)",
    create_user_validation_company_label: "TÃªn cÃ´ng ty",
    create_user_validation_password_label: "Máº­t kháº©u",
    create_user_validation_password_confirm_label: "XÃ¡c nháº­n máº­t kháº©u",
    edit_user_heading: "Sá»­a thÃ´ng tin tÃ i khoáº£n",
    edit_user_subheading: "Vui lÃ²ng nháº­p cÃ¡c thÃ´ng tin sau.",
    edit_user_fname_label: "TÃªn:",
    edit_user_lname_label: "Há»:",
    edit_user_company_label: "TÃªn cÃ´ng ty:",
    edit_user_email_label: "Email:",
    edit_user_phone_label: "Sá»‘ Ä‘iá»‡n thoáº¡i:",
    edit_user_password_label: "Máº­t kháº©u: (náº¿u cÃ³ thay Ä‘á»•i)",
    edit_user_password_confirm_label: "XÃ¡c nháº­n máº­t kháº©u: (náº¿u cÃ³ thay Ä‘á»•i)",
    edit_user_groups_heading: "CÃ¡c nhÃ³m tham gia",
    edit_user_submit_btn: "LÆ°u láº¡i",
    edit_user_validation_fname_label: "TÃªn",
    edit_user_validation_lname_label: "Há»",
    edit_user_validation_email_label: "Email",
    edit_user_validation_phone1_label: "Sá»‘ Ä‘iá»‡n thoáº¡i (mÃ£ vÃ¹ng)",
    edit_user_validation_phone2_label: "Sá»‘ Ä‘iá»‡n thoáº¡i (3 sá»‘ Ä‘áº§u)",
    edit_user_validation_phone3_label: "Sá»‘ Ä‘iá»‡n thoáº¡i (cÃ¡c sá»‘ cÃ²n láº¡i)",
    edit_user_validation_company_label: "TÃªn cÃ´ng ty",
    edit_user_validation_groups_label: "NhÃ³m",
    edit_user_validation_password_label: "Máº­t kháº©u",
    edit_user_validation_password_confirm_label: "XÃ¡c nháº­n máº­t kháº©u",
    create_group_title: "Táº¡o nhÃ³m má»›i",
    create_group_heading: "Táº¡o nhÃ³m má»›i",
    create_group_subheading: "Vui lÃ²ng nháº­p cÃ¡c thÃ´ng tin bÃªn dÆ°á»›i.",
    create_group_name_label: "TÃªn nhÃ³m:",
    create_group_desc_label: "MÃ´ táº£:",
    create_group_submit_btn: "Táº¡o nhÃ³m",
    create_group_validation_name_label: "TÃªn nhÃ³m",
    create_group_validation_desc_label: "MÃ´ táº£",
    edit_group_title: "Sá»­a thÃ´ng tin nhÃ³m",
    edit_group_saved: "ÄÃ£ lÆ°u",
    edit_group_heading: "Sá»­a thÃ´ng tin nhÃ³m",
    edit_group_subheading: "Vui lÃ²ng nháº­p cÃ¡c thÃ´ng tin bÃªn dÆ°á»›i.",
    edit_group_name_label: "TÃªn nhÃ³m:",
    edit_group_desc_label: "MÃ´ táº£:",
    edit_group_submit_btn: "LÆ°u láº¡i",
    edit_group_validation_name_label: "TÃªn nhÃ³m",
    edit_group_validation_desc_label: "MÃ´ táº£",
    change_password_heading: "Äá»•i máº­t kháº©u",
    change_password_old_password_label: "Máº­t kháº©u cÅ©:",
    change_password_new_password_label: "Máº­t kháº©u má»›i (Ã­t nháº¥t %s kÃ½ tá»±):",
    change_password_new_password_confirm_label: "XÃ¡c nháº­n máº­t kháº©u má»›i:",
    change_password_submit_btn: "LÆ°u láº¡i",
    change_password_validation_old_password_label: "Máº­t kháº©u cÅ©",
    change_password_validation_new_password_label: "Máº­t kháº©u má»›i",
    change_password_validation_new_password_confirm_label: "XÃ¡c nháº­n máº­t kháº©u má»›i",
    forgot_password_heading: "QuÃªn máº­t kháº©u",
    forgot_password_subheading: "Vui lÃ²ng nháº­p %s Ä‘á»ƒ nháº­n Ä‘Æ°á»£c email khÃ´i phá»¥c máº­t kháº©u.",
    forgot_password_email_label: "%s:",
    forgot_password_submit_btn: "XÃ¡c nháº­n",
    forgot_password_validation_username_label: "TÃªn tÃ i khoáº£n",
    forgot_password_validation_email_label: "Email",
    forgot_password_username_identity_label: "TÃ i khoáº£n",
    forgot_password_email_identity_label: "Email",
    forgot_password_username_not_found: "TÃªn tÃ i khoáº£n khÃ´ng tá»“n táº¡i.",
    forgot_password_email_not_found: "Äá»‹a chá»‰ email khÃ´ng tá»“n táº¡i.",
    reset_password_heading: "Äá»•i máº­t kháº©u",
    reset_password_new_password_label: "Máº­t kháº©u má»›i (Ã­t nháº¥t %s kÃ½ tá»±):",
    reset_password_new_password_confirm_label: "XÃ¡c nháº­n máº­t kháº©u má»›i:",
    reset_password_submit_btn: "LÆ°u láº¡i",
    reset_password_validation_new_password_label: "Máº­t kháº©u má»›i",
    reset_password_validation_new_password_confirm_label: "XÃ¡c nháº­n máº­t kháº©u má»›i",
    "date.today": "hÃ´m nay",
    "date.tomorrow": "ngÃ y mai",
    "date.yesterday": "hÃ´m qua",
    "date.at": "lÃºc",
    "date.just.now": "vá»«a má»›i",
    "date.in.about.x.hours": "khoáº£ng %s tiáº¿ng ná»¯a",
    "date.in.about.x.minutes": "khoáº£ng %s phÃºt ná»¯a",
    "date.x.minutes.ago": "khoáº£ng %s phÃºt trÆ°á»›c",
    "date.x.hours.ago": "khoáº£ng %s tiáº¿ng trÆ°á»›c",
    "date.month": "thÃ¡ng",
    "humanize.ago": "trÆ°á»›c",
    "humanize.year": "nÄƒm",
    "humanize.month": "thÃ¡ng",
    "humanize.week": "tuáº§n",
    "humanize.day": "ngÃ y",
    "humanize.hour": "giá»",
    "humanize.minute": "phÃºt",
    "humanize.second": "giÃ¢y",
    "date.format.friendly.1": "%e thÃ¡ng %m, %Y",
    "date.format.friendly.1.javascript": "%%e thÃ¡ng %%m, %%Y"
};
! function (a, b) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function (a) {
        if (!a.document) throw new Error("jQuery requires a window with a document");
        return b(a)
    } : b(a)
}("undefined" != typeof window ? window : this, function (a, b) {
    function c(a) {
        var b = "length" in a && a.length,
            c = ea.type(a);
        return "function" === c || ea.isWindow(a) ? !1 : 1 === a.nodeType && b ? !0 : "array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a
    }

    function d(a, b, c) {
        if (ea.isFunction(b)) return ea.grep(a, function (a, d) {
            return !!b.call(a, d, a) !== c
        });
        if (b.nodeType) return ea.grep(a, function (a) {
            return a === b !== c
        });
        if ("string" == typeof b) {
            if (ma.test(b)) return ea.filter(b, a, c);
            b = ea.filter(b, a)
        }
        return ea.grep(a, function (a) {
            return ea.inArray(a, b) >= 0 !== c
        })
    }

    function e(a, b) {
        do a = a[b]; while (a && 1 !== a.nodeType);
        return a
    }

    function f(a) {
        var b = ua[a] = {};
        return ea.each(a.match(ta) || [], function (a, c) {
            b[c] = !0
        }), b
    }

    function g() {
        oa.addEventListener ? (oa.removeEventListener("DOMContentLoaded", h, !1), a.removeEventListener("load", h, !1)) : (oa.detachEvent("onreadystatechange", h), a.detachEvent("onload", h))
    }

    function h() {
        (oa.addEventListener || "load" === event.type || "complete" === oa.readyState) && (g(), ea.ready())
    }

    function i(a, b, c) {
        if (void 0 === c && 1 === a.nodeType) {
            var d = "data-" + b.replace(za, "-$1").toLowerCase();
            if (c = a.getAttribute(d), "string" == typeof c) {
                try {
                    c = "true" === c ? !0 : "false" === c ? !1 : "null" === c ? null : +c + "" === c ? +c : ya.test(c) ? ea.parseJSON(c) : c
                } catch (e) { }
                ea.data(a, b, c)
            } else c = void 0
        }
        return c
    }

    function j(a) {
        var b;
        for (b in a)
            if (("data" !== b || !ea.isEmptyObject(a[b])) && "toJSON" !== b) return !1;
        return !0
    }

    function k(a, b, c, d) {
        if (ea.acceptData(a)) {
            var e, f, g = ea.expando,
                h = a.nodeType,
                i = h ? ea.cache : a,
                j = h ? a[g] : a[g] && g;
            if (j && i[j] && (d || i[j].data) || void 0 !== c || "string" != typeof b) return j || (j = h ? a[g] = W.pop() || ea.guid++ : g), i[j] || (i[j] = h ? {} : {
                toJSON: ea.noop
            }), ("object" == typeof b || "function" == typeof b) && (d ? i[j] = ea.extend(i[j], b) : i[j].data = ea.extend(i[j].data, b)), f = i[j], d || (f.data || (f.data = {}), f = f.data), void 0 !== c && (f[ea.camelCase(b)] = c), "string" == typeof b ? (e = f[b], null == e && (e = f[ea.camelCase(b)])) : e = f, e
        }
    }

    function l(a, b, c) {
        if (ea.acceptData(a)) {
            var d, e, f = a.nodeType,
                g = f ? ea.cache : a,
                h = f ? a[ea.expando] : ea.expando;
            if (g[h]) {
                if (b && (d = c ? g[h] : g[h].data)) {
                    ea.isArray(b) ? b = b.concat(ea.map(b, ea.camelCase)) : b in d ? b = [b] : (b = ea.camelCase(b), b = b in d ? [b] : b.split(" ")), e = b.length;
                    for (; e--;) delete d[b[e]];
                    if (c ? !j(d) : !ea.isEmptyObject(d)) return
                } (c || (delete g[h].data, j(g[h]))) && (f ? ea.cleanData([a], !0) : ca.deleteExpando || g != g.window ? delete g[h] : g[h] = null)
            }
        }
    }

    function m() {
        return !0
    }

    function n() {
        return !1
    }

    function o() {
        try {
            return oa.activeElement
        } catch (a) { }
    }

    function p(a) {
        var b = Ka.split("|"),
            c = a.createDocumentFragment();
        if (c.createElement)
            for (; b.length;) c.createElement(b.pop());
        return c
    }

    function q(a, b) {
        var c, d, e = 0,
            f = typeof a.getElementsByTagName !== xa ? a.getElementsByTagName(b || "*") : typeof a.querySelectorAll !== xa ? a.querySelectorAll(b || "*") : void 0;
        if (!f)
            for (f = [], c = a.childNodes || a; null != (d = c[e]); e++) !b || ea.nodeName(d, b) ? f.push(d) : ea.merge(f, q(d, b));
        return void 0 === b || b && ea.nodeName(a, b) ? ea.merge([a], f) : f
    }

    function r(a) {
        Ea.test(a.type) && (a.defaultChecked = a.checked)
    }

    function s(a, b) {
        return ea.nodeName(a, "table") && ea.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
    }

    function t(a) {
        return a.type = (null !== ea.find.attr(a, "type")) + "/" + a.type, a
    }

    function u(a) {
        var b = Va.exec(a.type);
        return b ? a.type = b[1] : a.removeAttribute("type"), a
    }

    function v(a, b) {
        for (var c, d = 0; null != (c = a[d]); d++) ea._data(c, "globalEval", !b || ea._data(b[d], "globalEval"))
    }

    function w(a, b) {
        if (1 === b.nodeType && ea.hasData(a)) {
            var c, d, e, f = ea._data(a),
                g = ea._data(b, f),
                h = f.events;
            if (h) {
                delete g.handle, g.events = {};
                for (c in h)
                    for (d = 0, e = h[c].length; e > d; d++) ea.event.add(b, c, h[c][d])
            }
            g.data && (g.data = ea.extend({}, g.data))
        }
    }

    function x(a, b) {
        var c, d, e;
        if (1 === b.nodeType) {
            if (c = b.nodeName.toLowerCase(), !ca.noCloneEvent && b[ea.expando]) {
                e = ea._data(b);
                for (d in e.events) ea.removeEvent(b, d, e.handle);
                b.removeAttribute(ea.expando)
            }
            "script" === c && b.text !== a.text ? (t(b).text = a.text, u(b)) : "object" === c ? (b.parentNode && (b.outerHTML = a.outerHTML), ca.html5Clone && a.innerHTML && !ea.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : "input" === c && Ea.test(a.type) ? (b.defaultChecked = b.checked = a.checked, b.value !== a.value && (b.value = a.value)) : "option" === c ? b.defaultSelected = b.selected = a.defaultSelected : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue)
        }
    }

    function y(b, c) {
        var d, e = ea(c.createElement(b)).appendTo(c.body),
            f = a.getDefaultComputedStyle && (d = a.getDefaultComputedStyle(e[0])) ? d.display : ea.css(e[0], "display");
        return e.detach(), f
    }

    function z(a) {
        var b = oa,
            c = _a[a];
        return c || (c = y(a, b), "none" !== c && c || ($a = ($a || ea("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement), b = ($a[0].contentWindow || $a[0].contentDocument).document, b.write(), b.close(), c = y(a, b), $a.detach()), _a[a] = c), c
    }

    function A(a, b) {
        return {
            get: function () {
                var c = a();
                if (null != c) return c ? void delete this.get : (this.get = b).apply(this, arguments)
            }
        }
    }

    function B(a, b) {
        if (b in a) return b;
        for (var c = b.charAt(0).toUpperCase() + b.slice(1), d = b, e = mb.length; e--;)
            if (b = mb[e] + c, b in a) return b;
        return d
    }

    function C(a, b) {
        for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++) d = a[g], d.style && (f[g] = ea._data(d, "olddisplay"), c = d.style.display, b ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && Ca(d) && (f[g] = ea._data(d, "olddisplay", z(d.nodeName)))) : (e = Ca(d), (c && "none" !== c || !e) && ea._data(d, "olddisplay", e ? c : ea.css(d, "display"))));
        for (g = 0; h > g; g++) d = a[g], d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
        return a
    }

    function D(a, b, c) {
        var d = ib.exec(b);
        return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
    }

    function E(a, b, c, d, e) {
        for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2) "margin" === c && (g += ea.css(a, c + Ba[f], !0, e)), d ? ("content" === c && (g -= ea.css(a, "padding" + Ba[f], !0, e)), "margin" !== c && (g -= ea.css(a, "border" + Ba[f] + "Width", !0, e))) : (g += ea.css(a, "padding" + Ba[f], !0, e), "padding" !== c && (g += ea.css(a, "border" + Ba[f] + "Width", !0, e)));
        return g
    }

    function F(a, b, c) {
        var d = !0,
            e = "width" === b ? a.offsetWidth : a.offsetHeight,
            f = ab(a),
            g = ca.boxSizing && "border-box" === ea.css(a, "boxSizing", !1, f);
        if (0 >= e || null == e) {
            if (e = bb(a, b, f), (0 > e || null == e) && (e = a.style[b]), db.test(e)) return e;
            d = g && (ca.boxSizingReliable() || e === a.style[b]), e = parseFloat(e) || 0
        }
        return e + E(a, b, c || (g ? "border" : "content"), d, f) + "px"
    }

    function G(a, b, c, d, e) {
        return new G.prototype.init(a, b, c, d, e)
    }

    function H() {
        return setTimeout(function () {
            nb = void 0
        }), nb = ea.now()
    }

    function I(a, b) {
        var c, d = {
            height: a
        },
            e = 0;
        for (b = b ? 1 : 0; 4 > e; e += 2 - b) c = Ba[e], d["margin" + c] = d["padding" + c] = a;
        return b && (d.opacity = d.width = a), d
    }

    function J(a, b, c) {
        for (var d, e = (tb[b] || []).concat(tb["*"]), f = 0, g = e.length; g > f; f++)
            if (d = e[f].call(c, b, a)) return d
    }

    function K(a, b, c) {
        var d, e, f, g, h, i, j, k, l = this,
            m = {},
            n = a.style,
            o = a.nodeType && Ca(a),
            p = ea._data(a, "fxshow");
        c.queue || (h = ea._queueHooks(a, "fx"), null == h.unqueued && (h.unqueued = 0, i = h.empty.fire, h.empty.fire = function () {
            h.unqueued || i()
        }), h.unqueued++ , l.always(function () {
            l.always(function () {
                h.unqueued-- , ea.queue(a, "fx").length || h.empty.fire()
            })
        })), 1 === a.nodeType && ("height" in b || "width" in b) && (c.overflow = [n.overflow, n.overflowX, n.overflowY], j = ea.css(a, "display"), k = "none" === j ? ea._data(a, "olddisplay") || z(a.nodeName) : j, "inline" === k && "none" === ea.css(a, "float") && (ca.inlineBlockNeedsLayout && "inline" !== z(a.nodeName) ? n.zoom = 1 : n.display = "inline-block")), c.overflow && (n.overflow = "hidden", ca.shrinkWrapBlocks() || l.always(function () {
            n.overflow = c.overflow[0], n.overflowX = c.overflow[1], n.overflowY = c.overflow[2]
        }));
        for (d in b)
            if (e = b[d], pb.exec(e)) {
                if (delete b[d], f = f || "toggle" === e, e === (o ? "hide" : "show")) {
                    if ("show" !== e || !p || void 0 === p[d]) continue;
                    o = !0
                }
                m[d] = p && p[d] || ea.style(a, d)
            } else j = void 0;
        if (ea.isEmptyObject(m)) "inline" === ("none" === j ? z(a.nodeName) : j) && (n.display = j);
        else {
            p ? "hidden" in p && (o = p.hidden) : p = ea._data(a, "fxshow", {}), f && (p.hidden = !o), o ? ea(a).show() : l.done(function () {
                ea(a).hide()
            }), l.done(function () {
                var b;
                ea._removeData(a, "fxshow");
                for (b in m) ea.style(a, b, m[b])
            });
            for (d in m) g = J(o ? p[d] : 0, d, l), d in p || (p[d] = g.start, o && (g.end = g.start, g.start = "width" === d || "height" === d ? 1 : 0))
        }
    }

    function L(a, b) {
        var c, d, e, f, g;
        for (c in a)
            if (d = ea.camelCase(c), e = b[d], f = a[c], ea.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = ea.cssHooks[d], g && "expand" in g) {
                f = g.expand(f), delete a[d];
                for (c in f) c in a || (a[c] = f[c], b[c] = e)
            } else b[d] = e
    }

    function M(a, b, c) {
        var d, e, f = 0,
            g = sb.length,
            h = ea.Deferred().always(function () {
                delete i.elem
            }),
            i = function () {
                if (e) return !1;
                for (var b = nb || H(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++) j.tweens[g].run(f);
                return h.notifyWith(a, [j, f, c]), 1 > f && i ? c : (h.resolveWith(a, [j]), !1)
            },
            j = h.promise({
                elem: a,
                props: ea.extend({}, b),
                opts: ea.extend(!0, {
                    specialEasing: {}
                }, c),
                originalProperties: b,
                originalOptions: c,
                startTime: nb || H(),
                duration: c.duration,
                tweens: [],
                createTween: function (b, c) {
                    var d = ea.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                    return j.tweens.push(d), d
                },
                stop: function (b) {
                    var c = 0,
                        d = b ? j.tweens.length : 0;
                    if (e) return this;
                    for (e = !0; d > c; c++) j.tweens[c].run(1);
                    return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this
                }
            }),
            k = j.props;
        for (L(k, j.opts.specialEasing); g > f; f++)
            if (d = sb[f].call(j, a, k, j.opts)) return d;
        return ea.map(k, J, j), ea.isFunction(j.opts.start) && j.opts.start.call(a, j), ea.fx.timer(ea.extend(i, {
            elem: a,
            anim: j,
            queue: j.opts.queue
        })), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
    }

    function N(a) {
        return function (b, c) {
            "string" != typeof b && (c = b, b = "*");
            var d, e = 0,
                f = b.toLowerCase().match(ta) || [];
            if (ea.isFunction(c))
                for (; d = f[e++];) "+" === d.charAt(0) ? (d = d.slice(1) || "*", (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
        }
    }

    function O(a, b, c, d) {
        function e(h) {
            var i;
            return f[h] = !0, ea.each(a[h] || [], function (a, h) {
                var j = h(b, c, d);
                return "string" != typeof j || g || f[j] ? g ? !(i = j) : void 0 : (b.dataTypes.unshift(j), e(j), !1)
            }), i
        }
        var f = {},
            g = a === Rb;
        return e(b.dataTypes[0]) || !f["*"] && e("*")
    }

    function P(a, b) {
        var c, d, e = ea.ajaxSettings.flatOptions || {};
        for (d in b) void 0 !== b[d] && ((e[d] ? a : c || (c = {}))[d] = b[d]);
        return c && ea.extend(!0, a, c), a
    }

    function Q(a, b, c) {
        for (var d, e, f, g, h = a.contents, i = a.dataTypes;
            "*" === i[0];) i.shift(), void 0 === e && (e = a.mimeType || b.getResponseHeader("Content-Type"));
        if (e)
            for (g in h)
                if (h[g] && h[g].test(e)) {
                    i.unshift(g);
                    break
                }
        if (i[0] in c) f = i[0];
        else {
            for (g in c) {
                if (!i[0] || a.converters[g + " " + i[0]]) {
                    f = g;
                    break
                }
                d || (d = g)
            }
            f = f || d
        }
        return f ? (f !== i[0] && i.unshift(f), c[f]) : void 0
    }

    function R(a, b, c, d) {
        var e, f, g, h, i, j = {},
            k = a.dataTypes.slice();
        if (k[1])
            for (g in a.converters) j[g.toLowerCase()] = a.converters[g];
        for (f = k.shift(); f;)
            if (a.responseFields[f] && (c[a.responseFields[f]] = b), !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift())
                if ("*" === f) f = i;
                else if ("*" !== i && i !== f) {
                    if (g = j[i + " " + f] || j["* " + f], !g)
                        for (e in j)
                            if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                                g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1]));
                                break
                            }
                    if (g !== !0)
                        if (g && a["throws"]) b = g(b);
                        else try {
                            b = g(b)
                        } catch (l) {
                            return {
                                state: "parsererror",
                                error: g ? l : "No conversion from " + i + " to " + f
                            }
                        }
                }
        return {
            state: "success",
            data: b
        }
    }

    function S(a, b, c, d) {
        var e;
        if (ea.isArray(b)) ea.each(b, function (b, e) {
            c || Vb.test(a) ? d(a, e) : S(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d)
        });
        else if (c || "object" !== ea.type(b)) d(a, b);
        else
            for (e in b) S(a + "[" + e + "]", b[e], c, d)
    }

    function T() {
        try {
            return new a.XMLHttpRequest
        } catch (b) { }
    }

    function U() {
        try {
            return new a.ActiveXObject("Microsoft.XMLHTTP")
        } catch (b) { }
    }

    function V(a) {
        return ea.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1
    }
    var W = [],
        X = W.slice,
        Y = W.concat,
        Z = W.push,
        $ = W.indexOf,
        _ = {},
        aa = _.toString,
        ba = _.hasOwnProperty,
        ca = {},
        da = "1.11.3",
        ea = function (a, b) {
            return new ea.fn.init(a, b)
        },
        fa = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        ga = /^-ms-/,
        ha = /-([\da-z])/gi,
        ia = function (a, b) {
            return b.toUpperCase()
        };
    ea.fn = ea.prototype = {
        jquery: da,
        constructor: ea,
        selector: "",
        length: 0,
        toArray: function () {
            return X.call(this)
        },
        get: function (a) {
            return null != a ? 0 > a ? this[a + this.length] : this[a] : X.call(this)
        },
        pushStack: function (a) {
            var b = ea.merge(this.constructor(), a);
            return b.prevObject = this, b.context = this.context, b
        },
        each: function (a, b) {
            return ea.each(this, a, b)
        },
        map: function (a) {
            return this.pushStack(ea.map(this, function (b, c) {
                return a.call(b, c, b)
            }))
        },
        slice: function () {
            return this.pushStack(X.apply(this, arguments))
        },
        first: function () {
            return this.eq(0)
        },
        last: function () {
            return this.eq(-1)
        },
        eq: function (a) {
            var b = this.length,
                c = +a + (0 > a ? b : 0);
            return this.pushStack(c >= 0 && b > c ? [this[c]] : [])
        },
        end: function () {
            return this.prevObject || this.constructor(null)
        },
        push: Z,
        sort: W.sort,
        splice: W.splice
    }, ea.extend = ea.fn.extend = function () {
        var a, b, c, d, e, f, g = arguments[0] || {},
            h = 1,
            i = arguments.length,
            j = !1;
        for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == typeof g || ea.isFunction(g) || (g = {}), h === i && (g = this, h--); i > h; h++)
            if (null != (e = arguments[h]))
                for (d in e) a = g[d], c = e[d], g !== c && (j && c && (ea.isPlainObject(c) || (b = ea.isArray(c))) ? (b ? (b = !1, f = a && ea.isArray(a) ? a : []) : f = a && ea.isPlainObject(a) ? a : {}, g[d] = ea.extend(j, f, c)) : void 0 !== c && (g[d] = c));
        return g
    }, ea.extend({
        expando: "jQuery" + (da + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function (a) {
            throw new Error(a)
        },
        noop: function () { },
        isFunction: function (a) {
            return "function" === ea.type(a)
        },
        isArray: Array.isArray || function (a) {
            return "array" === ea.type(a)
        },
        isWindow: function (a) {
            return null != a && a == a.window
        },
        isNumeric: function (a) {
            return !ea.isArray(a) && a - parseFloat(a) + 1 >= 0
        },
        isEmptyObject: function (a) {
            var b;
            for (b in a) return !1;
            return !0
        },
        isPlainObject: function (a) {
            var b;
            if (!a || "object" !== ea.type(a) || a.nodeType || ea.isWindow(a)) return !1;
            try {
                if (a.constructor && !ba.call(a, "constructor") && !ba.call(a.constructor.prototype, "isPrototypeOf")) return !1
            } catch (c) {
                return !1
            }
            if (ca.ownLast)
                for (b in a) return ba.call(a, b);
            for (b in a);
            return void 0 === b || ba.call(a, b)
        },
        type: function (a) {
            return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? _[aa.call(a)] || "object" : typeof a
        },
        globalEval: function (b) {
            b && ea.trim(b) && (a.execScript || function (b) {
                a.eval.call(a, b)
            })(b)
        },
        camelCase: function (a) {
            return a.replace(ga, "ms-").replace(ha, ia)
        },
        nodeName: function (a, b) {
            return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
        },
        each: function (a, b, d) {
            var e, f = 0,
                g = a.length,
                h = c(a);
            if (d) {
                if (h)
                    for (; g > f && (e = b.apply(a[f], d), e !== !1); f++);
                else
                    for (f in a)
                        if (e = b.apply(a[f], d), e === !1) break
            } else if (h)
                for (; g > f && (e = b.call(a[f], f, a[f]), e !== !1); f++);
            else
                for (f in a)
                    if (e = b.call(a[f], f, a[f]), e === !1) break;
            return a
        },
        trim: function (a) {
            return null == a ? "" : (a + "").replace(fa, "")
        },
        makeArray: function (a, b) {
            var d = b || [];
            return null != a && (c(Object(a)) ? ea.merge(d, "string" == typeof a ? [a] : a) : Z.call(d, a)), d
        },
        inArray: function (a, b, c) {
            var d;
            if (b) {
                if ($) return $.call(b, a, c);
                for (d = b.length, c = c ? 0 > c ? Math.max(0, d + c) : c : 0; d > c; c++)
                    if (c in b && b[c] === a) return c
            }
            return -1
        },
        merge: function (a, b) {
            for (var c = +b.length, d = 0, e = a.length; c > d;) a[e++] = b[d++];
            if (c !== c)
                for (; void 0 !== b[d];) a[e++] = b[d++];
            return a.length = e, a
        },
        grep: function (a, b, c) {
            for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++) d = !b(a[f], f), d !== h && e.push(a[f]);
            return e
        },
        map: function (a, b, d) {
            var e, f = 0,
                g = a.length,
                h = c(a),
                i = [];
            if (h)
                for (; g > f; f++) e = b(a[f], f, d), null != e && i.push(e);
            else
                for (f in a) e = b(a[f], f, d), null != e && i.push(e);
            return Y.apply([], i)
        },
        guid: 1,
        proxy: function (a, b) {
            var c, d, e;
            return "string" == typeof b && (e = a[b], b = a, a = e), ea.isFunction(a) ? (c = X.call(arguments, 2), d = function () {
                return a.apply(b || this, c.concat(X.call(arguments)))
            }, d.guid = a.guid = a.guid || ea.guid++ , d) : void 0
        },
        now: function () {
            return +new Date
        },
        support: ca
    }), ea.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (a, b) {
        _["[object " + b + "]"] = b.toLowerCase()
    });
    var ja = function (a) {
        function b(a, b, c, d) {
            var e, f, g, h, i, j, l, n, o, p;
            if ((b ? b.ownerDocument || b : O) !== G && F(b), b = b || G, c = c || [], h = b.nodeType, "string" != typeof a || !a || 1 !== h && 9 !== h && 11 !== h) return c;
            if (!d && I) {
                if (11 !== h && (e = sa.exec(a)))
                    if (g = e[1]) {
                        if (9 === h) {
                            if (f = b.getElementById(g), !f || !f.parentNode) return c;
                            if (f.id === g) return c.push(f), c
                        } else if (b.ownerDocument && (f = b.ownerDocument.getElementById(g)) && M(b, f) && f.id === g) return c.push(f), c
                    } else {
                        if (e[2]) return $.apply(c, b.getElementsByTagName(a)), c;
                        if ((g = e[3]) && v.getElementsByClassName) return $.apply(c, b.getElementsByClassName(g)), c
                    }
                if (v.qsa && (!J || !J.test(a))) {
                    if (n = l = N, o = b, p = 1 !== h && a, 1 === h && "object" !== b.nodeName.toLowerCase()) {
                        for (j = z(a), (l = b.getAttribute("id")) ? n = l.replace(ua, "\\$&") : b.setAttribute("id", n), n = "[id='" + n + "'] ", i = j.length; i--;) j[i] = n + m(j[i]);
                        o = ta.test(a) && k(b.parentNode) || b, p = j.join(",")
                    }
                    if (p) try {
                        return $.apply(c, o.querySelectorAll(p)), c
                    } catch (q) { } finally {
                            l || b.removeAttribute("id")
                        }
                }
            }
            return B(a.replace(ia, "$1"), b, c, d)
        }

        function c() {
            function a(c, d) {
                return b.push(c + " ") > w.cacheLength && delete a[b.shift()], a[c + " "] = d
            }
            var b = [];
            return a
        }

        function d(a) {
            return a[N] = !0, a
        }

        function e(a) {
            var b = G.createElement("div");
            try {
                return !!a(b)
            } catch (c) {
                return !1
            } finally {
                b.parentNode && b.parentNode.removeChild(b), b = null
            }
        }

        function f(a, b) {
            for (var c = a.split("|"), d = a.length; d--;) w.attrHandle[c[d]] = b
        }

        function g(a, b) {
            var c = b && a,
                d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || V) - (~a.sourceIndex || V);
            if (d) return d;
            if (c)
                for (; c = c.nextSibling;)
                    if (c === b) return -1;
            return a ? 1 : -1
        }

        function h(a) {
            return function (b) {
                var c = b.nodeName.toLowerCase();
                return "input" === c && b.type === a
            }
        }

        function i(a) {
            return function (b) {
                var c = b.nodeName.toLowerCase();
                return ("input" === c || "button" === c) && b.type === a
            }
        }

        function j(a) {
            return d(function (b) {
                return b = +b, d(function (c, d) {
                    for (var e, f = a([], c.length, b), g = f.length; g--;) c[e = f[g]] && (c[e] = !(d[e] = c[e]))
                })
            })
        }

        function k(a) {
            return a && "undefined" != typeof a.getElementsByTagName && a
        }

        function l() { }

        function m(a) {
            for (var b = 0, c = a.length, d = ""; c > b; b++) d += a[b].value;
            return d
        }

        function n(a, b, c) {
            var d = b.dir,
                e = c && "parentNode" === d,
                f = Q++;
            return b.first ? function (b, c, f) {
                for (; b = b[d];)
                    if (1 === b.nodeType || e) return a(b, c, f)
            } : function (b, c, g) {
                var h, i, j = [P, f];
                if (g) {
                    for (; b = b[d];)
                        if ((1 === b.nodeType || e) && a(b, c, g)) return !0
                } else
                    for (; b = b[d];)
                        if (1 === b.nodeType || e) {
                            if (i = b[N] || (b[N] = {}), (h = i[d]) && h[0] === P && h[1] === f) return j[2] = h[2];
                            if (i[d] = j, j[2] = a(b, c, g)) return !0
                        }
            }
        }

        function o(a) {
            return a.length > 1 ? function (b, c, d) {
                for (var e = a.length; e--;)
                    if (!a[e](b, c, d)) return !1;
                return !0
            } : a[0]
        }

        function p(a, c, d) {
            for (var e = 0, f = c.length; f > e; e++) b(a, c[e], d);
            return d
        }

        function q(a, b, c, d, e) {
            for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++)(f = a[h]) && (!c || c(f, d, e)) && (g.push(f), j && b.push(h));
            return g
        }

        function r(a, b, c, e, f, g) {
            return e && !e[N] && (e = r(e)), f && !f[N] && (f = r(f, g)), d(function (d, g, h, i) {
                var j, k, l, m = [],
                    n = [],
                    o = g.length,
                    r = d || p(b || "*", h.nodeType ? [h] : h, []),
                    s = !a || !d && b ? r : q(r, m, a, h, i),
                    t = c ? f || (d ? a : o || e) ? [] : g : s;
                if (c && c(s, t, h, i), e)
                    for (j = q(t, n), e(j, [], h, i), k = j.length; k--;)(l = j[k]) && (t[n[k]] = !(s[n[k]] = l));
                if (d) {
                    if (f || a) {
                        if (f) {
                            for (j = [], k = t.length; k--;)(l = t[k]) && j.push(s[k] = l);
                            f(null, t = [], j, i)
                        }
                        for (k = t.length; k--;)(l = t[k]) && (j = f ? aa(d, l) : m[k]) > -1 && (d[j] = !(g[j] = l))
                    }
                } else t = q(t === g ? t.splice(o, t.length) : t), f ? f(null, g, t, i) : $.apply(g, t)
            })
        }

        function s(a) {
            for (var b, c, d, e = a.length, f = w.relative[a[0].type], g = f || w.relative[" "], h = f ? 1 : 0, i = n(function (a) {
                return a === b
            }, g, !0), j = n(function (a) {
                return aa(b, a) > -1
            }, g, !0), k = [function (a, c, d) {
                var e = !f && (d || c !== C) || ((b = c).nodeType ? i(a, c, d) : j(a, c, d));
                return b = null, e
            }]; e > h; h++)
                if (c = w.relative[a[h].type]) k = [n(o(k), c)];
                else {
                    if (c = w.filter[a[h].type].apply(null, a[h].matches), c[N]) {
                        for (d = ++h; e > d && !w.relative[a[d].type]; d++);
                        return r(h > 1 && o(k), h > 1 && m(a.slice(0, h - 1).concat({
                            value: " " === a[h - 2].type ? "*" : ""
                        })).replace(ia, "$1"), c, d > h && s(a.slice(h, d)), e > d && s(a = a.slice(d)), e > d && m(a))
                    }
                    k.push(c)
                }
            return o(k)
        }

        function t(a, c) {
            var e = c.length > 0,
                f = a.length > 0,
                g = function (d, g, h, i, j) {
                    var k, l, m, n = 0,
                        o = "0",
                        p = d && [],
                        r = [],
                        s = C,
                        t = d || f && w.find.TAG("*", j),
                        u = P += null == s ? 1 : Math.random() || .1,
                        v = t.length;
                    for (j && (C = g !== G && g); o !== v && null != (k = t[o]); o++) {
                        if (f && k) {
                            for (l = 0; m = a[l++];)
                                if (m(k, g, h)) {
                                    i.push(k);
                                    break
                                }
                            j && (P = u)
                        }
                        e && ((k = !m && k) && n-- , d && p.push(k))
                    }
                    if (n += o, e && o !== n) {
                        for (l = 0; m = c[l++];) m(p, r, g, h);
                        if (d) {
                            if (n > 0)
                                for (; o--;) p[o] || r[o] || (r[o] = Y.call(i));
                            r = q(r)
                        }
                        $.apply(i, r), j && !d && r.length > 0 && n + c.length > 1 && b.uniqueSort(i)
                    }
                    return j && (P = u, C = s), p
                };
            return e ? d(g) : g
        }
        var u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N = "sizzle" + 1 * new Date,
            O = a.document,
            P = 0,
            Q = 0,
            R = c(),
            S = c(),
            T = c(),
            U = function (a, b) {
                return a === b && (E = !0), 0
            },
            V = 1 << 31,
            W = {}.hasOwnProperty,
            X = [],
            Y = X.pop,
            Z = X.push,
            $ = X.push,
            _ = X.slice,
            aa = function (a, b) {
                for (var c = 0, d = a.length; d > c; c++)
                    if (a[c] === b) return c;
                return -1
            },
            ba = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            ca = "[\\x20\\t\\r\\n\\f]",
            da = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
            ea = da.replace("w", "w#"),
            fa = "\\[" + ca + "*(" + da + ")(?:" + ca + "*([*^$|!~]?=)" + ca + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + ea + "))|)" + ca + "*\\]",
            ga = ":(" + da + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + fa + ")*)|.*)\\)|)",
            ha = new RegExp(ca + "+", "g"),
            ia = new RegExp("^" + ca + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ca + "+$", "g"),
            ja = new RegExp("^" + ca + "*," + ca + "*"),
            ka = new RegExp("^" + ca + "*([>+~]|" + ca + ")" + ca + "*"),
            la = new RegExp("=" + ca + "*([^\\]'\"]*?)" + ca + "*\\]", "g"),
            ma = new RegExp(ga),
            na = new RegExp("^" + ea + "$"),
            oa = {
                ID: new RegExp("^#(" + da + ")"),
                CLASS: new RegExp("^\\.(" + da + ")"),
                TAG: new RegExp("^(" + da.replace("w", "w*") + ")"),
                ATTR: new RegExp("^" + fa),
                PSEUDO: new RegExp("^" + ga),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ca + "*(even|odd|(([+-]|)(\\d*)n|)" + ca + "*(?:([+-]|)" + ca + "*(\\d+)|))" + ca + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + ba + ")$", "i"),
                needsContext: new RegExp("^" + ca + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ca + "*((?:-\\d)?\\d*)" + ca + "*\\)|)(?=[^-]|$)", "i")
            },
            pa = /^(?:input|select|textarea|button)$/i,
            qa = /^h\d$/i,
            ra = /^[^{]+\{\s*\[native \w/,
            sa = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            ta = /[+~]/,
            ua = /'|\\/g,
            va = new RegExp("\\\\([\\da-f]{1,6}" + ca + "?|(" + ca + ")|.)", "ig"),
            wa = function (a, b, c) {
                var d = "0x" + b - 65536;
                return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320)
            },
            xa = function () {
                F()
            };
        try {
            $.apply(X = _.call(O.childNodes), O.childNodes), X[O.childNodes.length].nodeType
        } catch (ya) {
            $ = {
                apply: X.length ? function (a, b) {
                    Z.apply(a, _.call(b))
                } : function (a, b) {
                    for (var c = a.length, d = 0; a[c++] = b[d++];);
                    a.length = c - 1
                }
            }
        }
        v = b.support = {}, y = b.isXML = function (a) {
            var b = a && (a.ownerDocument || a).documentElement;
            return b ? "HTML" !== b.nodeName : !1
        }, F = b.setDocument = function (a) {
            var b, c, d = a ? a.ownerDocument || a : O;
            return d !== G && 9 === d.nodeType && d.documentElement ? (G = d, H = d.documentElement, c = d.defaultView, c && c !== c.top && (c.addEventListener ? c.addEventListener("unload", xa, !1) : c.attachEvent && c.attachEvent("onunload", xa)), I = !y(d), v.attributes = e(function (a) {
                return a.className = "i", !a.getAttribute("className")
            }), v.getElementsByTagName = e(function (a) {
                return a.appendChild(d.createComment("")), !a.getElementsByTagName("*").length
            }), v.getElementsByClassName = ra.test(d.getElementsByClassName), v.getById = e(function (a) {
                return H.appendChild(a).id = N, !d.getElementsByName || !d.getElementsByName(N).length
            }), v.getById ? (w.find.ID = function (a, b) {
                if ("undefined" != typeof b.getElementById && I) {
                    var c = b.getElementById(a);
                    return c && c.parentNode ? [c] : []
                }
            }, w.filter.ID = function (a) {
                var b = a.replace(va, wa);
                return function (a) {
                    return a.getAttribute("id") === b
                }
            }) : (delete w.find.ID, w.filter.ID = function (a) {
                var b = a.replace(va, wa);
                return function (a) {
                    var c = "undefined" != typeof a.getAttributeNode && a.getAttributeNode("id");
                    return c && c.value === b
                }
            }), w.find.TAG = v.getElementsByTagName ? function (a, b) {
                return "undefined" != typeof b.getElementsByTagName ? b.getElementsByTagName(a) : v.qsa ? b.querySelectorAll(a) : void 0
            } : function (a, b) {
                var c, d = [],
                    e = 0,
                    f = b.getElementsByTagName(a);
                if ("*" === a) {
                    for (; c = f[e++];) 1 === c.nodeType && d.push(c);
                    return d
                }
                return f
            }, w.find.CLASS = v.getElementsByClassName && function (a, b) {
                return I ? b.getElementsByClassName(a) : void 0
            }, K = [], J = [], (v.qsa = ra.test(d.querySelectorAll)) && (e(function (a) {
                H.appendChild(a).innerHTML = "<a id='" + N + "'></a><select id='" + N + "-\f]' msallowcapture=''><option selected=''></option></select>", a.querySelectorAll("[msallowcapture^='']").length && J.push("[*^$]=" + ca + "*(?:''|\"\")"), a.querySelectorAll("[selected]").length || J.push("\\[" + ca + "*(?:value|" + ba + ")"), a.querySelectorAll("[id~=" + N + "-]").length || J.push("~="), a.querySelectorAll(":checked").length || J.push(":checked"), a.querySelectorAll("a#" + N + "+*").length || J.push(".#.+[+~]")
            }), e(function (a) {
                var b = d.createElement("input");
                b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("name", "D"), a.querySelectorAll("[name=d]").length && J.push("name" + ca + "*[*^$|!~]?="), a.querySelectorAll(":enabled").length || J.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), J.push(",.*:")
            })), (v.matchesSelector = ra.test(L = H.matches || H.webkitMatchesSelector || H.mozMatchesSelector || H.oMatchesSelector || H.msMatchesSelector)) && e(function (a) {
                v.disconnectedMatch = L.call(a, "div"), L.call(a, "[s!='']:x"), K.push("!=", ga)
            }), J = J.length && new RegExp(J.join("|")), K = K.length && new RegExp(K.join("|")), b = ra.test(H.compareDocumentPosition), M = b || ra.test(H.contains) ? function (a, b) {
                var c = 9 === a.nodeType ? a.documentElement : a,
                    d = b && b.parentNode;
                return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
            } : function (a, b) {
                if (b)
                    for (; b = b.parentNode;)
                        if (b === a) return !0;
                return !1
            }, U = b ? function (a, b) {
                if (a === b) return E = !0, 0;
                var c = !a.compareDocumentPosition - !b.compareDocumentPosition;
                return c ? c : (c = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & c || !v.sortDetached && b.compareDocumentPosition(a) === c ? a === d || a.ownerDocument === O && M(O, a) ? -1 : b === d || b.ownerDocument === O && M(O, b) ? 1 : D ? aa(D, a) - aa(D, b) : 0 : 4 & c ? -1 : 1)
            } : function (a, b) {
                if (a === b) return E = !0, 0;
                var c, e = 0,
                    f = a.parentNode,
                    h = b.parentNode,
                    i = [a],
                    j = [b];
                if (!f || !h) return a === d ? -1 : b === d ? 1 : f ? -1 : h ? 1 : D ? aa(D, a) - aa(D, b) : 0;
                if (f === h) return g(a, b);
                for (c = a; c = c.parentNode;) i.unshift(c);
                for (c = b; c = c.parentNode;) j.unshift(c);
                for (; i[e] === j[e];) e++;
                return e ? g(i[e], j[e]) : i[e] === O ? -1 : j[e] === O ? 1 : 0
            }, d) : G
        }, b.matches = function (a, c) {
            return b(a, null, null, c)
        }, b.matchesSelector = function (a, c) {
            if ((a.ownerDocument || a) !== G && F(a), c = c.replace(la, "='$1']"), v.matchesSelector && I && (!K || !K.test(c)) && (!J || !J.test(c))) try {
                var d = L.call(a, c);
                if (d || v.disconnectedMatch || a.document && 11 !== a.document.nodeType) return d
            } catch (e) { }
            return b(c, G, null, [a]).length > 0
        }, b.contains = function (a, b) {
            return (a.ownerDocument || a) !== G && F(a), M(a, b)
        }, b.attr = function (a, b) {
            (a.ownerDocument || a) !== G && F(a);
            var c = w.attrHandle[b.toLowerCase()],
                d = c && W.call(w.attrHandle, b.toLowerCase()) ? c(a, b, !I) : void 0;
            return void 0 !== d ? d : v.attributes || !I ? a.getAttribute(b) : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
        }, b.error = function (a) {
            throw new Error("Syntax error, unrecognized expression: " + a)
        }, b.uniqueSort = function (a) {
            var b, c = [],
                d = 0,
                e = 0;
            if (E = !v.detectDuplicates, D = !v.sortStable && a.slice(0), a.sort(U), E) {
                for (; b = a[e++];) b === a[e] && (d = c.push(e));
                for (; d--;) a.splice(c[d], 1)
            }
            return D = null, a
        }, x = b.getText = function (a) {
            var b, c = "",
                d = 0,
                e = a.nodeType;
            if (e) {
                if (1 === e || 9 === e || 11 === e) {
                    if ("string" == typeof a.textContent) return a.textContent;
                    for (a = a.firstChild; a; a = a.nextSibling) c += x(a)
                } else if (3 === e || 4 === e) return a.nodeValue
            } else
                for (; b = a[d++];) c += x(b);
            return c
        }, w = b.selectors = {
            cacheLength: 50,
            createPseudo: d,
            match: oa,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function (a) {
                    return a[1] = a[1].replace(va, wa), a[3] = (a[3] || a[4] || a[5] || "").replace(va, wa), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4)
                },
                CHILD: function (a) {
                    return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || b.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && b.error(a[0]), a
                },
                PSEUDO: function (a) {
                    var b, c = !a[6] && a[2];
                    return oa.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && ma.test(c) && (b = z(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), a[2] = c.slice(0, b)), a.slice(0, 3))
                }
            },
            filter: {
                TAG: function (a) {
                    var b = a.replace(va, wa).toLowerCase();
                    return "*" === a ? function () {
                        return !0
                    } : function (a) {
                        return a.nodeName && a.nodeName.toLowerCase() === b
                    }
                },
                CLASS: function (a) {
                    var b = R[a + " "];
                    return b || (b = new RegExp("(^|" + ca + ")" + a + "(" + ca + "|$)")) && R(a, function (a) {
                        return b.test("string" == typeof a.className && a.className || "undefined" != typeof a.getAttribute && a.getAttribute("class") || "")
                    })
                },
                ATTR: function (a, c, d) {
                    return function (e) {
                        var f = b.attr(e, a);
                        return null == f ? "!=" === c : c ? (f += "", "=" === c ? f === d : "!=" === c ? f !== d : "^=" === c ? d && 0 === f.indexOf(d) : "*=" === c ? d && f.indexOf(d) > -1 : "$=" === c ? d && f.slice(-d.length) === d : "~=" === c ? (" " + f.replace(ha, " ") + " ").indexOf(d) > -1 : "|=" === c ? f === d || f.slice(0, d.length + 1) === d + "-" : !1) : !0
                    }
                },
                CHILD: function (a, b, c, d, e) {
                    var f = "nth" !== a.slice(0, 3),
                        g = "last" !== a.slice(-4),
                        h = "of-type" === b;
                    return 1 === d && 0 === e ? function (a) {
                        return !!a.parentNode
                    } : function (b, c, i) {
                        var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling",
                            q = b.parentNode,
                            r = h && b.nodeName.toLowerCase(),
                            s = !i && !h;
                        if (q) {
                            if (f) {
                                for (; p;) {
                                    for (l = b; l = l[p];)
                                        if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) return !1;
                                    o = p = "only" === a && !o && "nextSibling"
                                }
                                return !0
                            }
                            if (o = [g ? q.firstChild : q.lastChild], g && s) {
                                for (k = q[N] || (q[N] = {}), j = k[a] || [], n = j[0] === P && j[1], m = j[0] === P && j[2], l = n && q.childNodes[n]; l = ++n && l && l[p] || (m = n = 0) || o.pop();)
                                    if (1 === l.nodeType && ++m && l === b) {
                                        k[a] = [P, n, m];
                                        break
                                    }
                            } else if (s && (j = (b[N] || (b[N] = {}))[a]) && j[0] === P) m = j[1];
                            else
                                for (;
                                    (l = ++n && l && l[p] || (m = n = 0) || o.pop()) && ((h ? l.nodeName.toLowerCase() !== r : 1 !== l.nodeType) || !++m || (s && ((l[N] || (l[N] = {}))[a] = [P, m]), l !== b)););
                            return m -= e, m === d || m % d === 0 && m / d >= 0
                        }
                    }
                },
                PSEUDO: function (a, c) {
                    var e, f = w.pseudos[a] || w.setFilters[a.toLowerCase()] || b.error("unsupported pseudo: " + a);
                    return f[N] ? f(c) : f.length > 1 ? (e = [a, a, "", c], w.setFilters.hasOwnProperty(a.toLowerCase()) ? d(function (a, b) {
                        for (var d, e = f(a, c), g = e.length; g--;) d = aa(a, e[g]), a[d] = !(b[d] = e[g])
                    }) : function (a) {
                        return f(a, 0, e)
                    }) : f
                }
            },
            pseudos: {
                not: d(function (a) {
                    var b = [],
                        c = [],
                        e = A(a.replace(ia, "$1"));
                    return e[N] ? d(function (a, b, c, d) {
                        for (var f, g = e(a, null, d, []), h = a.length; h--;)(f = g[h]) && (a[h] = !(b[h] = f))
                    }) : function (a, d, f) {
                        return b[0] = a, e(b, null, f, c), b[0] = null, !c.pop()
                    }
                }),
                has: d(function (a) {
                    return function (c) {
                        return b(a, c).length > 0
                    }
                }),
                contains: d(function (a) {
                    return a = a.replace(va, wa),
                        function (b) {
                            return (b.textContent || b.innerText || x(b)).indexOf(a) > -1
                        }
                }),
                lang: d(function (a) {
                    return na.test(a || "") || b.error("unsupported lang: " + a), a = a.replace(va, wa).toLowerCase(),
                        function (b) {
                            var c;
                            do
                                if (c = I ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-"); while ((b = b.parentNode) && 1 === b.nodeType);
                            return !1
                        }
                }),
                target: function (b) {
                    var c = a.location && a.location.hash;
                    return c && c.slice(1) === b.id
                },
                root: function (a) {
                    return a === H
                },
                focus: function (a) {
                    return a === G.activeElement && (!G.hasFocus || G.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
                },
                enabled: function (a) {
                    return a.disabled === !1
                },
                disabled: function (a) {
                    return a.disabled === !0
                },
                checked: function (a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && !!a.checked || "option" === b && !!a.selected;
                },
                selected: function (a) {
                    return a.parentNode && a.parentNode.selectedIndex, a.selected === !0
                },
                empty: function (a) {
                    for (a = a.firstChild; a; a = a.nextSibling)
                        if (a.nodeType < 6) return !1;
                    return !0
                },
                parent: function (a) {
                    return !w.pseudos.empty(a)
                },
                header: function (a) {
                    return qa.test(a.nodeName)
                },
                input: function (a) {
                    return pa.test(a.nodeName)
                },
                button: function (a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && "button" === a.type || "button" === b
                },
                text: function (a) {
                    var b;
                    return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
                },
                first: j(function () {
                    return [0]
                }),
                last: j(function (a, b) {
                    return [b - 1]
                }),
                eq: j(function (a, b, c) {
                    return [0 > c ? c + b : c]
                }),
                even: j(function (a, b) {
                    for (var c = 0; b > c; c += 2) a.push(c);
                    return a
                }),
                odd: j(function (a, b) {
                    for (var c = 1; b > c; c += 2) a.push(c);
                    return a
                }),
                lt: j(function (a, b, c) {
                    for (var d = 0 > c ? c + b : c; --d >= 0;) a.push(d);
                    return a
                }),
                gt: j(function (a, b, c) {
                    for (var d = 0 > c ? c + b : c; ++d < b;) a.push(d);
                    return a
                })
            }
        }, w.pseudos.nth = w.pseudos.eq;
        for (u in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        }) w.pseudos[u] = h(u);
        for (u in {
            submit: !0,
            reset: !0
        }) w.pseudos[u] = i(u);
        return l.prototype = w.filters = w.pseudos, w.setFilters = new l, z = b.tokenize = function (a, c) {
            var d, e, f, g, h, i, j, k = S[a + " "];
            if (k) return c ? 0 : k.slice(0);
            for (h = a, i = [], j = w.preFilter; h;) {
                (!d || (e = ja.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])), d = !1, (e = ka.exec(h)) && (d = e.shift(), f.push({
                    value: d,
                    type: e[0].replace(ia, " ")
                }), h = h.slice(d.length));
                for (g in w.filter) !(e = oa[g].exec(h)) || j[g] && !(e = j[g](e)) || (d = e.shift(), f.push({
                    value: d,
                    type: g,
                    matches: e
                }), h = h.slice(d.length));
                if (!d) break
            }
            return c ? h.length : h ? b.error(a) : S(a, i).slice(0)
        }, A = b.compile = function (a, b) {
            var c, d = [],
                e = [],
                f = T[a + " "];
            if (!f) {
                for (b || (b = z(a)), c = b.length; c--;) f = s(b[c]), f[N] ? d.push(f) : e.push(f);
                f = T(a, t(e, d)), f.selector = a
            }
            return f
        }, B = b.select = function (a, b, c, d) {
            var e, f, g, h, i, j = "function" == typeof a && a,
                l = !d && z(a = j.selector || a);
            if (c = c || [], 1 === l.length) {
                if (f = l[0] = l[0].slice(0), f.length > 2 && "ID" === (g = f[0]).type && v.getById && 9 === b.nodeType && I && w.relative[f[1].type]) {
                    if (b = (w.find.ID(g.matches[0].replace(va, wa), b) || [])[0], !b) return c;
                    j && (b = b.parentNode), a = a.slice(f.shift().value.length)
                }
                for (e = oa.needsContext.test(a) ? 0 : f.length; e-- && (g = f[e], !w.relative[h = g.type]);)
                    if ((i = w.find[h]) && (d = i(g.matches[0].replace(va, wa), ta.test(f[0].type) && k(b.parentNode) || b))) {
                        if (f.splice(e, 1), a = d.length && m(f), !a) return $.apply(c, d), c;
                        break
                    }
            }
            return (j || A(a, l))(d, b, !I, c, ta.test(a) && k(b.parentNode) || b), c
        }, v.sortStable = N.split("").sort(U).join("") === N, v.detectDuplicates = !!E, F(), v.sortDetached = e(function (a) {
            return 1 & a.compareDocumentPosition(G.createElement("div"))
        }), e(function (a) {
            return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href")
        }) || f("type|href|height|width", function (a, b, c) {
            return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
        }), v.attributes && e(function (a) {
            return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value")
        }) || f("value", function (a, b, c) {
            return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue
        }), e(function (a) {
            return null == a.getAttribute("disabled")
        }) || f(ba, function (a, b, c) {
            var d;
            return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
        }), b
    }(a);
    ea.find = ja, ea.expr = ja.selectors, ea.expr[":"] = ea.expr.pseudos, ea.unique = ja.uniqueSort, ea.text = ja.getText, ea.isXMLDoc = ja.isXML, ea.contains = ja.contains;
    var ka = ea.expr.match.needsContext,
        la = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        ma = /^.[^:#\[\.,]*$/;
    ea.filter = function (a, b, c) {
        var d = b[0];
        return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? ea.find.matchesSelector(d, a) ? [d] : [] : ea.find.matches(a, ea.grep(b, function (a) {
            return 1 === a.nodeType
        }))
    }, ea.fn.extend({
        find: function (a) {
            var b, c = [],
                d = this,
                e = d.length;
            if ("string" != typeof a) return this.pushStack(ea(a).filter(function () {
                for (b = 0; e > b; b++)
                    if (ea.contains(d[b], this)) return !0
            }));
            for (b = 0; e > b; b++) ea.find(a, d[b], c);
            return c = this.pushStack(e > 1 ? ea.unique(c) : c), c.selector = this.selector ? this.selector + " " + a : a, c
        },
        filter: function (a) {
            return this.pushStack(d(this, a || [], !1))
        },
        not: function (a) {
            return this.pushStack(d(this, a || [], !0))
        },
        is: function (a) {
            return !!d(this, "string" == typeof a && ka.test(a) ? ea(a) : a || [], !1).length
        }
    });
    var na, oa = a.document,
        pa = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
        qa = ea.fn.init = function (a, b) {
            var c, d;
            if (!a) return this;
            if ("string" == typeof a) {
                if (c = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [null, a, null] : pa.exec(a), !c || !c[1] && b) return !b || b.jquery ? (b || na).find(a) : this.constructor(b).find(a);
                if (c[1]) {
                    if (b = b instanceof ea ? b[0] : b, ea.merge(this, ea.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : oa, !0)), la.test(c[1]) && ea.isPlainObject(b))
                        for (c in b) ea.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c]);
                    return this
                }
                if (d = oa.getElementById(c[2]), d && d.parentNode) {
                    if (d.id !== c[2]) return na.find(a);
                    this.length = 1, this[0] = d
                }
                return this.context = oa, this.selector = a, this
            }
            return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : ea.isFunction(a) ? "undefined" != typeof na.ready ? na.ready(a) : a(ea) : (void 0 !== a.selector && (this.selector = a.selector, this.context = a.context), ea.makeArray(a, this))
        };
    qa.prototype = ea.fn, na = ea(oa);
    var ra = /^(?:parents|prev(?:Until|All))/,
        sa = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    ea.extend({
        dir: function (a, b, c) {
            for (var d = [], e = a[b]; e && 9 !== e.nodeType && (void 0 === c || 1 !== e.nodeType || !ea(e).is(c));) 1 === e.nodeType && d.push(e), e = e[b];
            return d
        },
        sibling: function (a, b) {
            for (var c = []; a; a = a.nextSibling) 1 === a.nodeType && a !== b && c.push(a);
            return c
        }
    }), ea.fn.extend({
        has: function (a) {
            var b, c = ea(a, this),
                d = c.length;
            return this.filter(function () {
                for (b = 0; d > b; b++)
                    if (ea.contains(this, c[b])) return !0
            })
        },
        closest: function (a, b) {
            for (var c, d = 0, e = this.length, f = [], g = ka.test(a) || "string" != typeof a ? ea(a, b || this.context) : 0; e > d; d++)
                for (c = this[d]; c && c !== b; c = c.parentNode)
                    if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && ea.find.matchesSelector(c, a))) {
                        f.push(c);
                        break
                    }
            return this.pushStack(f.length > 1 ? ea.unique(f) : f)
        },
        index: function (a) {
            return a ? "string" == typeof a ? ea.inArray(this[0], ea(a)) : ea.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function (a, b) {
            return this.pushStack(ea.unique(ea.merge(this.get(), ea(a, b))))
        },
        addBack: function (a) {
            return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
        }
    }), ea.each({
        parent: function (a) {
            var b = a.parentNode;
            return b && 11 !== b.nodeType ? b : null
        },
        parents: function (a) {
            return ea.dir(a, "parentNode")
        },
        parentsUntil: function (a, b, c) {
            return ea.dir(a, "parentNode", c)
        },
        next: function (a) {
            return e(a, "nextSibling")
        },
        prev: function (a) {
            return e(a, "previousSibling")
        },
        nextAll: function (a) {
            return ea.dir(a, "nextSibling")
        },
        prevAll: function (a) {
            return ea.dir(a, "previousSibling")
        },
        nextUntil: function (a, b, c) {
            return ea.dir(a, "nextSibling", c)
        },
        prevUntil: function (a, b, c) {
            return ea.dir(a, "previousSibling", c)
        },
        siblings: function (a) {
            return ea.sibling((a.parentNode || {}).firstChild, a)
        },
        children: function (a) {
            return ea.sibling(a.firstChild)
        },
        contents: function (a) {
            return ea.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : ea.merge([], a.childNodes)
        }
    }, function (a, b) {
        ea.fn[a] = function (c, d) {
            var e = ea.map(this, b, c);
            return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = ea.filter(d, e)), this.length > 1 && (sa[a] || (e = ea.unique(e)), ra.test(a) && (e = e.reverse())), this.pushStack(e)
        }
    });
    var ta = /\S+/g,
        ua = {};
    ea.Callbacks = function (a) {
        a = "string" == typeof a ? ua[a] || f(a) : ea.extend({}, a);
        var b, c, d, e, g, h, i = [],
            j = !a.once && [],
            k = function (f) {
                for (c = a.memory && f, d = !0, g = h || 0, h = 0, e = i.length, b = !0; i && e > g; g++)
                    if (i[g].apply(f[0], f[1]) === !1 && a.stopOnFalse) {
                        c = !1;
                        break
                    }
                b = !1, i && (j ? j.length && k(j.shift()) : c ? i = [] : l.disable())
            },
            l = {
                add: function () {
                    if (i) {
                        var d = i.length;
                        ! function f(b) {
                            ea.each(b, function (b, c) {
                                var d = ea.type(c);
                                "function" === d ? a.unique && l.has(c) || i.push(c) : c && c.length && "string" !== d && f(c)
                            })
                        }(arguments), b ? e = i.length : c && (h = d, k(c))
                    }
                    return this
                },
                remove: function () {
                    return i && ea.each(arguments, function (a, c) {
                        for (var d;
                            (d = ea.inArray(c, i, d)) > -1;) i.splice(d, 1), b && (e >= d && e-- , g >= d && g--)
                    }), this
                },
                has: function (a) {
                    return a ? ea.inArray(a, i) > -1 : !(!i || !i.length)
                },
                empty: function () {
                    return i = [], e = 0, this
                },
                disable: function () {
                    return i = j = c = void 0, this
                },
                disabled: function () {
                    return !i
                },
                lock: function () {
                    return j = void 0, c || l.disable(), this
                },
                locked: function () {
                    return !j
                },
                fireWith: function (a, c) {
                    return !i || d && !j || (c = c || [], c = [a, c.slice ? c.slice() : c], b ? j.push(c) : k(c)), this
                },
                fire: function () {
                    return l.fireWith(this, arguments), this
                },
                fired: function () {
                    return !!d
                }
            };
        return l
    }, ea.extend({
        Deferred: function (a) {
            var b = [
                ["resolve", "done", ea.Callbacks("once memory"), "resolved"],
                ["reject", "fail", ea.Callbacks("once memory"), "rejected"],
                ["notify", "progress", ea.Callbacks("memory")]
            ],
                c = "pending",
                d = {
                    state: function () {
                        return c
                    },
                    always: function () {
                        return e.done(arguments).fail(arguments), this
                    },
                    then: function () {
                        var a = arguments;
                        return ea.Deferred(function (c) {
                            ea.each(b, function (b, f) {
                                var g = ea.isFunction(a[b]) && a[b];
                                e[f[1]](function () {
                                    var a = g && g.apply(this, arguments);
                                    a && ea.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments)
                                })
                            }), a = null
                        }).promise()
                    },
                    promise: function (a) {
                        return null != a ? ea.extend(a, d) : d
                    }
                },
                e = {};
            return d.pipe = d.then, ea.each(b, function (a, f) {
                var g = f[2],
                    h = f[3];
                d[f[1]] = g.add, h && g.add(function () {
                    c = h
                }, b[1 ^ a][2].disable, b[2][2].lock), e[f[0]] = function () {
                    return e[f[0] + "With"](this === e ? d : this, arguments), this
                }, e[f[0] + "With"] = g.fireWith
            }), d.promise(e), a && a.call(e, e), e
        },
        when: function (a) {
            var b, c, d, e = 0,
                f = X.call(arguments),
                g = f.length,
                h = 1 !== g || a && ea.isFunction(a.promise) ? g : 0,
                i = 1 === h ? a : ea.Deferred(),
                j = function (a, c, d) {
                    return function (e) {
                        c[a] = this, d[a] = arguments.length > 1 ? X.call(arguments) : e, d === b ? i.notifyWith(c, d) : --h || i.resolveWith(c, d)
                    }
                };
            if (g > 1)
                for (b = new Array(g), c = new Array(g), d = new Array(g); g > e; e++) f[e] && ea.isFunction(f[e].promise) ? f[e].promise().done(j(e, d, f)).fail(i.reject).progress(j(e, c, b)) : --h;
            return h || i.resolveWith(d, f), i.promise()
        }
    });
    var va;
    ea.fn.ready = function (a) {
        return ea.ready.promise().done(a), this
    }, ea.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function (a) {
            a ? ea.readyWait++ : ea.ready(!0)
        },
        ready: function (a) {
            if (a === !0 ? !--ea.readyWait : !ea.isReady) {
                if (!oa.body) return setTimeout(ea.ready);
                ea.isReady = !0, a !== !0 && --ea.readyWait > 0 || (va.resolveWith(oa, [ea]), ea.fn.triggerHandler && (ea(oa).triggerHandler("ready"), ea(oa).off("ready")))
            }
        }
    }), ea.ready.promise = function (b) {
        if (!va)
            if (va = ea.Deferred(), "complete" === oa.readyState) setTimeout(ea.ready);
            else if (oa.addEventListener) oa.addEventListener("DOMContentLoaded", h, !1), a.addEventListener("load", h, !1);
            else {
                oa.attachEvent("onreadystatechange", h), a.attachEvent("onload", h);
                var c = !1;
                try {
                    c = null == a.frameElement && oa.documentElement
                } catch (d) { }
                c && c.doScroll && ! function e() {
                    if (!ea.isReady) {
                        try {
                            c.doScroll("left")
                        } catch (a) {
                            return setTimeout(e, 50)
                        }
                        g(), ea.ready()
                    }
                }()
            }
        return va.promise(b)
    };
    var wa, xa = "undefined";
    for (wa in ea(ca)) break;
    ca.ownLast = "0" !== wa, ca.inlineBlockNeedsLayout = !1, ea(function () {
        var a, b, c, d;
        c = oa.getElementsByTagName("body")[0], c && c.style && (b = oa.createElement("div"), d = oa.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", c.appendChild(d).appendChild(b), typeof b.style.zoom !== xa && (b.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", ca.inlineBlockNeedsLayout = a = 3 === b.offsetWidth, a && (c.style.zoom = 1)), c.removeChild(d))
    }),
        function () {
            var a = oa.createElement("div");
            if (null == ca.deleteExpando) {
                ca.deleteExpando = !0;
                try {
                    delete a.test
                } catch (b) {
                    ca.deleteExpando = !1
                }
            }
            a = null
        }(), ea.acceptData = function (a) {
            var b = ea.noData[(a.nodeName + " ").toLowerCase()],
                c = +a.nodeType || 1;
            return 1 !== c && 9 !== c ? !1 : !b || b !== !0 && a.getAttribute("classid") === b
        };
    var ya = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        za = /([A-Z])/g;
    ea.extend({
        cache: {},
        noData: {
            "applet ": !0,
            "embed ": !0,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function (a) {
            return a = a.nodeType ? ea.cache[a[ea.expando]] : a[ea.expando], !!a && !j(a)
        },
        data: function (a, b, c) {
            return k(a, b, c)
        },
        removeData: function (a, b) {
            return l(a, b)
        },
        _data: function (a, b, c) {
            return k(a, b, c, !0)
        },
        _removeData: function (a, b) {
            return l(a, b, !0)
        }
    }), ea.fn.extend({
        data: function (a, b) {
            var c, d, e, f = this[0],
                g = f && f.attributes;
            if (void 0 === a) {
                if (this.length && (e = ea.data(f), 1 === f.nodeType && !ea._data(f, "parsedAttrs"))) {
                    for (c = g.length; c--;) g[c] && (d = g[c].name, 0 === d.indexOf("data-") && (d = ea.camelCase(d.slice(5)), i(f, d, e[d])));
                    ea._data(f, "parsedAttrs", !0)
                }
                return e
            }
            return "object" == typeof a ? this.each(function () {
                ea.data(this, a)
            }) : arguments.length > 1 ? this.each(function () {
                ea.data(this, a, b)
            }) : f ? i(f, a, ea.data(f, a)) : void 0
        },
        removeData: function (a) {
            return this.each(function () {
                ea.removeData(this, a)
            })
        }
    }), ea.extend({
        queue: function (a, b, c) {
            var d;
            return a ? (b = (b || "fx") + "queue", d = ea._data(a, b), c && (!d || ea.isArray(c) ? d = ea._data(a, b, ea.makeArray(c)) : d.push(c)), d || []) : void 0
        },
        dequeue: function (a, b) {
            b = b || "fx";
            var c = ea.queue(a, b),
                d = c.length,
                e = c.shift(),
                f = ea._queueHooks(a, b),
                g = function () {
                    ea.dequeue(a, b)
                };
            "inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire()
        },
        _queueHooks: function (a, b) {
            var c = b + "queueHooks";
            return ea._data(a, c) || ea._data(a, c, {
                empty: ea.Callbacks("once memory").add(function () {
                    ea._removeData(a, b + "queue"), ea._removeData(a, c)
                })
            })
        }
    }), ea.fn.extend({
        queue: function (a, b) {
            var c = 2;
            return "string" != typeof a && (b = a, a = "fx", c--), arguments.length < c ? ea.queue(this[0], a) : void 0 === b ? this : this.each(function () {
                var c = ea.queue(this, a, b);
                ea._queueHooks(this, a), "fx" === a && "inprogress" !== c[0] && ea.dequeue(this, a)
            })
        },
        dequeue: function (a) {
            return this.each(function () {
                ea.dequeue(this, a)
            })
        },
        clearQueue: function (a) {
            return this.queue(a || "fx", [])
        },
        promise: function (a, b) {
            var c, d = 1,
                e = ea.Deferred(),
                f = this,
                g = this.length,
                h = function () {
                    --d || e.resolveWith(f, [f])
                };
            for ("string" != typeof a && (b = a, a = void 0), a = a || "fx"; g--;) c = ea._data(f[g], a + "queueHooks"), c && c.empty && (d++ , c.empty.add(h));
            return h(), e.promise(b)
        }
    });
    var Aa = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        Ba = ["Top", "Right", "Bottom", "Left"],
        Ca = function (a, b) {
            return a = b || a, "none" === ea.css(a, "display") || !ea.contains(a.ownerDocument, a)
        },
        Da = ea.access = function (a, b, c, d, e, f, g) {
            var h = 0,
                i = a.length,
                j = null == c;
            if ("object" === ea.type(c)) {
                e = !0;
                for (h in c) ea.access(a, b, h, c[h], !0, f, g)
            } else if (void 0 !== d && (e = !0, ea.isFunction(d) || (g = !0), j && (g ? (b.call(a, d), b = null) : (j = b, b = function (a, b, c) {
                return j.call(ea(a), c)
            })), b))
                for (; i > h; h++) b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
            return e ? a : j ? b.call(a) : i ? b(a[0], c) : f
        },
        Ea = /^(?:checkbox|radio)$/i;
    ! function () {
        var a = oa.createElement("input"),
            b = oa.createElement("div"),
            c = oa.createDocumentFragment();
        if (b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", ca.leadingWhitespace = 3 === b.firstChild.nodeType, ca.tbody = !b.getElementsByTagName("tbody").length, ca.htmlSerialize = !!b.getElementsByTagName("link").length, ca.html5Clone = "<:nav></:nav>" !== oa.createElement("nav").cloneNode(!0).outerHTML, a.type = "checkbox", a.checked = !0, c.appendChild(a), ca.appendChecked = a.checked, b.innerHTML = "<textarea>x</textarea>", ca.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue, c.appendChild(b), b.innerHTML = "<input type='radio' checked='checked' name='t'/>", ca.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked, ca.noCloneEvent = !0, b.attachEvent && (b.attachEvent("onclick", function () {
            ca.noCloneEvent = !1
        }), b.cloneNode(!0).click()), null == ca.deleteExpando) {
            ca.deleteExpando = !0;
            try {
                delete b.test
            } catch (d) {
                ca.deleteExpando = !1
            }
        }
    }(),
        function () {
            var b, c, d = oa.createElement("div");
            for (b in {
                submit: !0,
                change: !0,
                focusin: !0
            }) c = "on" + b, (ca[b + "Bubbles"] = c in a) || (d.setAttribute(c, "t"), ca[b + "Bubbles"] = d.attributes[c].expando === !1);
            d = null
        }();
    var Fa = /^(?:input|select|textarea)$/i,
        Ga = /^key/,
        Ha = /^(?:mouse|pointer|contextmenu)|click/,
        Ia = /^(?:focusinfocus|focusoutblur)$/,
        Ja = /^([^.]*)(?:\.(.+)|)$/;
    ea.event = {
        global: {},
        add: function (a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, n, o, p, q = ea._data(a);
            if (q) {
                for (c.handler && (i = c, c = i.handler, e = i.selector), c.guid || (c.guid = ea.guid++), (g = q.events) || (g = q.events = {}), (k = q.handle) || (k = q.handle = function (a) {
                    return typeof ea === xa || a && ea.event.triggered === a.type ? void 0 : ea.event.dispatch.apply(k.elem, arguments)
                }, k.elem = a), b = (b || "").match(ta) || [""], h = b.length; h--;) f = Ja.exec(b[h]) || [], n = p = f[1], o = (f[2] || "").split(".").sort(), n && (j = ea.event.special[n] || {}, n = (e ? j.delegateType : j.bindType) || n, j = ea.event.special[n] || {}, l = ea.extend({
                    type: n,
                    origType: p,
                    data: d,
                    handler: c,
                    guid: c.guid,
                    selector: e,
                    needsContext: e && ea.expr.match.needsContext.test(e),
                    namespace: o.join(".")
                }, i), (m = g[n]) || (m = g[n] = [], m.delegateCount = 0, j.setup && j.setup.call(a, d, o, k) !== !1 || (a.addEventListener ? a.addEventListener(n, k, !1) : a.attachEvent && a.attachEvent("on" + n, k))), j.add && (j.add.call(a, l), l.handler.guid || (l.handler.guid = c.guid)), e ? m.splice(m.delegateCount++, 0, l) : m.push(l), ea.event.global[n] = !0);
                a = null
            }
        },
        remove: function (a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, n, o, p, q = ea.hasData(a) && ea._data(a);
            if (q && (k = q.events)) {
                for (b = (b || "").match(ta) || [""], j = b.length; j--;)
                    if (h = Ja.exec(b[j]) || [], n = p = h[1], o = (h[2] || "").split(".").sort(), n) {
                        for (l = ea.event.special[n] || {}, n = (d ? l.delegateType : l.bindType) || n, m = k[n] || [], h = h[2] && new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)"), i = f = m.length; f--;) g = m[f], !e && p !== g.origType || c && c.guid !== g.guid || h && !h.test(g.namespace) || d && d !== g.selector && ("**" !== d || !g.selector) || (m.splice(f, 1), g.selector && m.delegateCount-- , l.remove && l.remove.call(a, g));
                        i && !m.length && (l.teardown && l.teardown.call(a, o, q.handle) !== !1 || ea.removeEvent(a, n, q.handle), delete k[n])
                    } else
                        for (n in k) ea.event.remove(a, n + b[j], c, d, !0);
                ea.isEmptyObject(k) && (delete q.handle, ea._removeData(a, "events"))
            }
        },
        trigger: function (b, c, d, e) {
            var f, g, h, i, j, k, l, m = [d || oa],
                n = ba.call(b, "type") ? b.type : b,
                o = ba.call(b, "namespace") ? b.namespace.split(".") : [];
            if (h = k = d = d || oa, 3 !== d.nodeType && 8 !== d.nodeType && !Ia.test(n + ea.event.triggered) && (n.indexOf(".") >= 0 && (o = n.split("."), n = o.shift(), o.sort()), g = n.indexOf(":") < 0 && "on" + n, b = b[ea.expando] ? b : new ea.Event(n, "object" == typeof b && b), b.isTrigger = e ? 2 : 3, b.namespace = o.join("."), b.namespace_re = b.namespace ? new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, b.result = void 0, b.target || (b.target = d), c = null == c ? [b] : ea.makeArray(c, [b]), j = ea.event.special[n] || {}, e || !j.trigger || j.trigger.apply(d, c) !== !1)) {
                if (!e && !j.noBubble && !ea.isWindow(d)) {
                    for (i = j.delegateType || n, Ia.test(i + n) || (h = h.parentNode); h; h = h.parentNode) m.push(h), k = h;
                    k === (d.ownerDocument || oa) && m.push(k.defaultView || k.parentWindow || a)
                }
                for (l = 0;
                    (h = m[l++]) && !b.isPropagationStopped();) b.type = l > 1 ? i : j.bindType || n, f = (ea._data(h, "events") || {})[b.type] && ea._data(h, "handle"), f && f.apply(h, c), f = g && h[g], f && f.apply && ea.acceptData(h) && (b.result = f.apply(h, c), b.result === !1 && b.preventDefault());
                if (b.type = n, !e && !b.isDefaultPrevented() && (!j._default || j._default.apply(m.pop(), c) === !1) && ea.acceptData(d) && g && d[n] && !ea.isWindow(d)) {
                    k = d[g], k && (d[g] = null), ea.event.triggered = n;
                    try {
                        d[n]()
                    } catch (p) { }
                    ea.event.triggered = void 0, k && (d[g] = k)
                }
                return b.result
            }
        },
        dispatch: function (a) {
            a = ea.event.fix(a);
            var b, c, d, e, f, g = [],
                h = X.call(arguments),
                i = (ea._data(this, "events") || {})[a.type] || [],
                j = ea.event.special[a.type] || {};
            if (h[0] = a, a.delegateTarget = this, !j.preDispatch || j.preDispatch.call(this, a) !== !1) {
                for (g = ea.event.handlers.call(this, a, i), b = 0;
                    (e = g[b++]) && !a.isPropagationStopped();)
                    for (a.currentTarget = e.elem, f = 0;
                        (d = e.handlers[f++]) && !a.isImmediatePropagationStopped();)(!a.namespace_re || a.namespace_re.test(d.namespace)) && (a.handleObj = d, a.data = d.data, c = ((ea.event.special[d.origType] || {}).handle || d.handler).apply(e.elem, h), void 0 !== c && (a.result = c) === !1 && (a.preventDefault(), a.stopPropagation()));
                return j.postDispatch && j.postDispatch.call(this, a), a.result
            }
        },
        handlers: function (a, b) {
            var c, d, e, f, g = [],
                h = b.delegateCount,
                i = a.target;
            if (h && i.nodeType && (!a.button || "click" !== a.type))
                for (; i != this; i = i.parentNode || this)
                    if (1 === i.nodeType && (i.disabled !== !0 || "click" !== a.type)) {
                        for (e = [], f = 0; h > f; f++) d = b[f], c = d.selector + " ", void 0 === e[c] && (e[c] = d.needsContext ? ea(c, this).index(i) >= 0 : ea.find(c, this, null, [i]).length), e[c] && e.push(d);
                        e.length && g.push({
                            elem: i,
                            handlers: e
                        })
                    }
            return h < b.length && g.push({
                elem: this,
                handlers: b.slice(h)
            }), g
        },
        fix: function (a) {
            if (a[ea.expando]) return a;
            var b, c, d, e = a.type,
                f = a,
                g = this.fixHooks[e];
            for (g || (this.fixHooks[e] = g = Ha.test(e) ? this.mouseHooks : Ga.test(e) ? this.keyHooks : {}), d = g.props ? this.props.concat(g.props) : this.props, a = new ea.Event(f), b = d.length; b--;) c = d[b], a[c] = f[c];
            return a.target || (a.target = f.srcElement || oa), 3 === a.target.nodeType && (a.target = a.target.parentNode), a.metaKey = !!a.metaKey, g.filter ? g.filter(a, f) : a
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function (a, b) {
                return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function (a, b) {
                var c, d, e, f = b.button,
                    g = b.fromElement;
                return null == a.pageX && null != b.clientX && (d = a.target.ownerDocument || oa, e = d.documentElement, c = d.body, a.pageX = b.clientX + (e && e.scrollLeft || c && c.scrollLeft || 0) - (e && e.clientLeft || c && c.clientLeft || 0), a.pageY = b.clientY + (e && e.scrollTop || c && c.scrollTop || 0) - (e && e.clientTop || c && c.clientTop || 0)), !a.relatedTarget && g && (a.relatedTarget = g === a.target ? b.toElement : g), a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0), a
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function () {
                    if (this !== o() && this.focus) try {
                        return this.focus(), !1
                    } catch (a) { }
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function () {
                    return this === o() && this.blur ? (this.blur(), !1) : void 0
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function () {
                    return ea.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
                },
                _default: function (a) {
                    return ea.nodeName(a.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function (a) {
                    void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result)
                }
            }
        },
        simulate: function (a, b, c, d) {
            var e = ea.extend(new ea.Event, c, {
                type: a,
                isSimulated: !0,
                originalEvent: {}
            });
            d ? ea.event.trigger(e, null, b) : ea.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
        }
    }, ea.removeEvent = oa.removeEventListener ? function (a, b, c) {
        a.removeEventListener && a.removeEventListener(b, c, !1)
    } : function (a, b, c) {
        var d = "on" + b;
        a.detachEvent && (typeof a[d] === xa && (a[d] = null), a.detachEvent(d, c))
    }, ea.Event = function (a, b) {
        return this instanceof ea.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? m : n) : this.type = a, b && ea.extend(this, b), this.timeStamp = a && a.timeStamp || ea.now(), void (this[ea.expando] = !0)) : new ea.Event(a, b)
    }, ea.Event.prototype = {
        isDefaultPrevented: n,
        isPropagationStopped: n,
        isImmediatePropagationStopped: n,
        preventDefault: function () {
            var a = this.originalEvent;
            this.isDefaultPrevented = m, a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
        },
        stopPropagation: function () {
            var a = this.originalEvent;
            this.isPropagationStopped = m, a && (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
        },
        stopImmediatePropagation: function () {
            var a = this.originalEvent;
            this.isImmediatePropagationStopped = m, a && a.stopImmediatePropagation && a.stopImmediatePropagation(), this.stopPropagation()
        }
    }, ea.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function (a, b) {
        ea.event.special[a] = {
            delegateType: b,
            bindType: b,
            handle: function (a) {
                var c, d = this,
                    e = a.relatedTarget,
                    f = a.handleObj;
                return (!e || e !== d && !ea.contains(d, e)) && (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b), c
            }
        }
    }), ca.submitBubbles || (ea.event.special.submit = {
        setup: function () {
            return ea.nodeName(this, "form") ? !1 : void ea.event.add(this, "click._submit keypress._submit", function (a) {
                var b = a.target,
                    c = ea.nodeName(b, "input") || ea.nodeName(b, "button") ? b.form : void 0;
                c && !ea._data(c, "submitBubbles") && (ea.event.add(c, "submit._submit", function (a) {
                    a._submit_bubble = !0
                }), ea._data(c, "submitBubbles", !0))
            })
        },
        postDispatch: function (a) {
            a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && ea.event.simulate("submit", this.parentNode, a, !0))
        },
        teardown: function () {
            return ea.nodeName(this, "form") ? !1 : void ea.event.remove(this, "._submit")
        }
    }), ca.changeBubbles || (ea.event.special.change = {
        setup: function () {
            return Fa.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (ea.event.add(this, "propertychange._change", function (a) {
                "checked" === a.originalEvent.propertyName && (this._just_changed = !0)
            }), ea.event.add(this, "click._change", function (a) {
                this._just_changed && !a.isTrigger && (this._just_changed = !1), ea.event.simulate("change", this, a, !0)
            })), !1) : void ea.event.add(this, "beforeactivate._change", function (a) {
                var b = a.target;
                Fa.test(b.nodeName) && !ea._data(b, "changeBubbles") && (ea.event.add(b, "change._change", function (a) {
                    !this.parentNode || a.isSimulated || a.isTrigger || ea.event.simulate("change", this.parentNode, a, !0)
                }), ea._data(b, "changeBubbles", !0))
            })
        },
        handle: function (a) {
            var b = a.target;
            return this !== b || a.isSimulated || a.isTrigger || "radio" !== b.type && "checkbox" !== b.type ? a.handleObj.handler.apply(this, arguments) : void 0
        },
        teardown: function () {
            return ea.event.remove(this, "._change"), !Fa.test(this.nodeName)
        }
    }), ca.focusinBubbles || ea.each({
        focus: "focusin",
        blur: "focusout"
    }, function (a, b) {
        var c = function (a) {
            ea.event.simulate(b, a.target, ea.event.fix(a), !0)
        };
        ea.event.special[b] = {
            setup: function () {
                var d = this.ownerDocument || this,
                    e = ea._data(d, b);
                e || d.addEventListener(a, c, !0), ea._data(d, b, (e || 0) + 1)
            },
            teardown: function () {
                var d = this.ownerDocument || this,
                    e = ea._data(d, b) - 1;
                e ? ea._data(d, b, e) : (d.removeEventListener(a, c, !0), ea._removeData(d, b))
            }
        }
    }), ea.fn.extend({
        on: function (a, b, c, d, e) {
            var f, g;
            if ("object" == typeof a) {
                "string" != typeof b && (c = c || b, b = void 0);
                for (f in a) this.on(f, b, c, a[f], e);
                return this
            }
            if (null == c && null == d ? (d = b, c = b = void 0) : null == d && ("string" == typeof b ? (d = c, c = void 0) : (d = c, c = b, b = void 0)), d === !1) d = n;
            else if (!d) return this;
            return 1 === e && (g = d, d = function (a) {
                return ea().off(a), g.apply(this, arguments)
            }, d.guid = g.guid || (g.guid = ea.guid++)), this.each(function () {
                ea.event.add(this, a, d, c, b)
            })
        },
        one: function (a, b, c, d) {
            return this.on(a, b, c, d, 1)
        },
        off: function (a, b, c) {
            var d, e;
            if (a && a.preventDefault && a.handleObj) return d = a.handleObj, ea(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), this;
            if ("object" == typeof a) {
                for (e in a) this.off(e, b, a[e]);
                return this
            }
            return (b === !1 || "function" == typeof b) && (c = b, b = void 0), c === !1 && (c = n), this.each(function () {
                ea.event.remove(this, a, c, b)
            })
        },
        trigger: function (a, b) {
            return this.each(function () {
                ea.event.trigger(a, b, this)
            })
        },
        triggerHandler: function (a, b) {
            var c = this[0];
            return c ? ea.event.trigger(a, b, c, !0) : void 0
        }
    });
    var Ka = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        La = / jQuery\d+="(?:null|\d+)"/g,
        Ma = new RegExp("<(?:" + Ka + ")[\\s/>]", "i"),
        Na = /^\s+/,
        Oa = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        Pa = /<([\w:]+)/,
        Qa = /<tbody/i,
        Ra = /<|&#?\w+;/,
        Sa = /<(?:script|style|link)/i,
        Ta = /checked\s*(?:[^=]|=\s*.checked.)/i,
        Ua = /^$|\/(?:java|ecma)script/i,
        Va = /^true\/(.*)/,
        Wa = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        Xa = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>", "</object>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: ca.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
        },
        Ya = p(oa),
        Za = Ya.appendChild(oa.createElement("div"));
    Xa.optgroup = Xa.option, Xa.tbody = Xa.tfoot = Xa.colgroup = Xa.caption = Xa.thead, Xa.th = Xa.td, ea.extend({
        clone: function (a, b, c) {
            var d, e, f, g, h, i = ea.contains(a.ownerDocument, a);
            if (ca.html5Clone || ea.isXMLDoc(a) || !Ma.test("<" + a.nodeName + ">") ? f = a.cloneNode(!0) : (Za.innerHTML = a.outerHTML, Za.removeChild(f = Za.firstChild)), !(ca.noCloneEvent && ca.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || ea.isXMLDoc(a)))
                for (d = q(f), h = q(a), g = 0; null != (e = h[g]); ++g) d[g] && x(e, d[g]);
            if (b)
                if (c)
                    for (h = h || q(a), d = d || q(f), g = 0; null != (e = h[g]); g++) w(e, d[g]);
                else w(a, f);
            return d = q(f, "script"), d.length > 0 && v(d, !i && q(a, "script")), d = h = e = null, f
        },
        buildFragment: function (a, b, c, d) {
            for (var e, f, g, h, i, j, k, l = a.length, m = p(b), n = [], o = 0; l > o; o++)
                if (f = a[o], f || 0 === f)
                    if ("object" === ea.type(f)) ea.merge(n, f.nodeType ? [f] : f);
                    else if (Ra.test(f)) {
                        for (h = h || m.appendChild(b.createElement("div")), i = (Pa.exec(f) || ["", ""])[1].toLowerCase(), k = Xa[i] || Xa._default, h.innerHTML = k[1] + f.replace(Oa, "<$1></$2>") + k[2], e = k[0]; e--;) h = h.lastChild;
                        if (!ca.leadingWhitespace && Na.test(f) && n.push(b.createTextNode(Na.exec(f)[0])), !ca.tbody)
                            for (f = "table" !== i || Qa.test(f) ? "<table>" !== k[1] || Qa.test(f) ? 0 : h : h.firstChild, e = f && f.childNodes.length; e--;) ea.nodeName(j = f.childNodes[e], "tbody") && !j.childNodes.length && f.removeChild(j);
                        for (ea.merge(n, h.childNodes), h.textContent = ""; h.firstChild;) h.removeChild(h.firstChild);
                        h = m.lastChild
                    } else n.push(b.createTextNode(f));
            for (h && m.removeChild(h), ca.appendChecked || ea.grep(q(n, "input"), r), o = 0; f = n[o++];)
                if ((!d || -1 === ea.inArray(f, d)) && (g = ea.contains(f.ownerDocument, f), h = q(m.appendChild(f), "script"), g && v(h), c))
                    for (e = 0; f = h[e++];) Ua.test(f.type || "") && c.push(f);
            return h = null, m
        },
        cleanData: function (a, b) {
            for (var c, d, e, f, g = 0, h = ea.expando, i = ea.cache, j = ca.deleteExpando, k = ea.event.special; null != (c = a[g]); g++)
                if ((b || ea.acceptData(c)) && (e = c[h], f = e && i[e])) {
                    if (f.events)
                        for (d in f.events) k[d] ? ea.event.remove(c, d) : ea.removeEvent(c, d, f.handle);
                    i[e] && (delete i[e], j ? delete c[h] : typeof c.removeAttribute !== xa ? c.removeAttribute(h) : c[h] = null, W.push(e))
                }
        }
    }), ea.fn.extend({
        text: function (a) {
            return Da(this, function (a) {
                return void 0 === a ? ea.text(this) : this.empty().append((this[0] && this[0].ownerDocument || oa).createTextNode(a))
            }, null, a, arguments.length)
        },
        append: function () {
            return this.domManip(arguments, function (a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = s(this, a);
                    b.appendChild(a)
                }
            })
        },
        prepend: function () {
            return this.domManip(arguments, function (a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = s(this, a);
                    b.insertBefore(a, b.firstChild)
                }
            })
        },
        before: function () {
            return this.domManip(arguments, function (a) {
                this.parentNode && this.parentNode.insertBefore(a, this)
            })
        },
        after: function () {
            return this.domManip(arguments, function (a) {
                this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
            })
        },
        remove: function (a, b) {
            for (var c, d = a ? ea.filter(a, this) : this, e = 0; null != (c = d[e]); e++) b || 1 !== c.nodeType || ea.cleanData(q(c)), c.parentNode && (b && ea.contains(c.ownerDocument, c) && v(q(c, "script")), c.parentNode.removeChild(c));
            return this
        },
        empty: function () {
            for (var a, b = 0; null != (a = this[b]); b++) {
                for (1 === a.nodeType && ea.cleanData(q(a, !1)); a.firstChild;) a.removeChild(a.firstChild);
                a.options && ea.nodeName(a, "select") && (a.options.length = 0)
            }
            return this
        },
        clone: function (a, b) {
            return a = null == a ? !1 : a, b = null == b ? a : b, this.map(function () {
                return ea.clone(this, a, b)
            })
        },
        html: function (a) {
            return Da(this, function (a) {
                var b = this[0] || {},
                    c = 0,
                    d = this.length;
                if (void 0 === a) return 1 === b.nodeType ? b.innerHTML.replace(La, "") : void 0;
                if ("string" == typeof a && !Sa.test(a) && (ca.htmlSerialize || !Ma.test(a)) && (ca.leadingWhitespace || !Na.test(a)) && !Xa[(Pa.exec(a) || ["", ""])[1].toLowerCase()]) {
                    a = a.replace(Oa, "<$1></$2>");
                    try {
                        for (; d > c; c++) b = this[c] || {}, 1 === b.nodeType && (ea.cleanData(q(b, !1)), b.innerHTML = a);
                        b = 0
                    } catch (e) { }
                }
                b && this.empty().append(a)
            }, null, a, arguments.length)
        },
        replaceWith: function () {
            var a = arguments[0];
            return this.domManip(arguments, function (b) {
                a = this.parentNode, ea.cleanData(q(this)), a && a.replaceChild(b, this)
            }), a && (a.length || a.nodeType) ? this : this.remove()
        },
        detach: function (a) {
            return this.remove(a, !0)
        },
        domManip: function (a, b) {
            a = Y.apply([], a);
            var c, d, e, f, g, h, i = 0,
                j = this.length,
                k = this,
                l = j - 1,
                m = a[0],
                n = ea.isFunction(m);
            if (n || j > 1 && "string" == typeof m && !ca.checkClone && Ta.test(m)) return this.each(function (c) {
                var d = k.eq(c);
                n && (a[0] = m.call(this, c, d.html())), d.domManip(a, b)
            });
            if (j && (h = ea.buildFragment(a, this[0].ownerDocument, !1, this), c = h.firstChild, 1 === h.childNodes.length && (h = c), c)) {
                for (f = ea.map(q(h, "script"), t), e = f.length; j > i; i++) d = h, i !== l && (d = ea.clone(d, !0, !0), e && ea.merge(f, q(d, "script"))), b.call(this[i], d, i);
                if (e)
                    for (g = f[f.length - 1].ownerDocument, ea.map(f, u), i = 0; e > i; i++) d = f[i], Ua.test(d.type || "") && !ea._data(d, "globalEval") && ea.contains(g, d) && (d.src ? ea._evalUrl && ea._evalUrl(d.src) : ea.globalEval((d.text || d.textContent || d.innerHTML || "").replace(Wa, "")));
                h = c = null
            }
            return this
        }
    }), ea.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (a, b) {
        ea.fn[a] = function (a) {
            for (var c, d = 0, e = [], f = ea(a), g = f.length - 1; g >= d; d++) c = d === g ? this : this.clone(!0), ea(f[d])[b](c), Z.apply(e, c.get());
            return this.pushStack(e)
        }
    });
    var $a, _a = {};
    ! function () {
        var a;
        ca.shrinkWrapBlocks = function () {
            if (null != a) return a;
            a = !1;
            var b, c, d;
            return c = oa.getElementsByTagName("body")[0], c && c.style ? (b = oa.createElement("div"), d = oa.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", c.appendChild(d).appendChild(b), typeof b.style.zoom !== xa && (b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", b.appendChild(oa.createElement("div")).style.width = "5px", a = 3 !== b.offsetWidth), c.removeChild(d), a) : void 0
        }
    }();
    var ab, bb, cb = /^margin/,
        db = new RegExp("^(" + Aa + ")(?!px)[a-z%]+$", "i"),
        eb = /^(top|right|bottom|left)$/;
    a.getComputedStyle ? (ab = function (b) {
        return b.ownerDocument.defaultView.opener ? b.ownerDocument.defaultView.getComputedStyle(b, null) : a.getComputedStyle(b, null)
    }, bb = function (a, b, c) {
        var d, e, f, g, h = a.style;
        return c = c || ab(a), g = c ? c.getPropertyValue(b) || c[b] : void 0, c && ("" !== g || ea.contains(a.ownerDocument, a) || (g = ea.style(a, b)), db.test(g) && cb.test(b) && (d = h.width, e = h.minWidth, f = h.maxWidth, h.minWidth = h.maxWidth = h.width = g, g = c.width, h.width = d, h.minWidth = e, h.maxWidth = f)), void 0 === g ? g : g + ""
    }) : oa.documentElement.currentStyle && (ab = function (a) {
        return a.currentStyle
    }, bb = function (a, b, c) {
        var d, e, f, g, h = a.style;
        return c = c || ab(a), g = c ? c[b] : void 0, null == g && h && h[b] && (g = h[b]), db.test(g) && !eb.test(b) && (d = h.left, e = a.runtimeStyle, f = e && e.left, f && (e.left = a.currentStyle.left), h.left = "fontSize" === b ? "1em" : g, g = h.pixelLeft + "px", h.left = d, f && (e.left = f)), void 0 === g ? g : g + "" || "auto"
    }),
        function () {
            function b() {
                var b, c, d, e;
                c = oa.getElementsByTagName("body")[0], c && c.style && (b = oa.createElement("div"), d = oa.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", c.appendChild(d).appendChild(b), b.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", f = g = !1, i = !0, a.getComputedStyle && (f = "1%" !== (a.getComputedStyle(b, null) || {}).top, g = "4px" === (a.getComputedStyle(b, null) || {
                    width: "4px"
                }).width, e = b.appendChild(oa.createElement("div")), e.style.cssText = b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", e.style.marginRight = e.style.width = "0", b.style.width = "1px", i = !parseFloat((a.getComputedStyle(e, null) || {}).marginRight), b.removeChild(e)), b.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", e = b.getElementsByTagName("td"), e[0].style.cssText = "margin:0;border:0;padding:0;display:none", h = 0 === e[0].offsetHeight, h && (e[0].style.display = "", e[1].style.display = "none", h = 0 === e[0].offsetHeight), c.removeChild(d))
            }
            var c, d, e, f, g, h, i;
            c = oa.createElement("div"), c.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", e = c.getElementsByTagName("a")[0], d = e && e.style, d && (d.cssText = "float:left;opacity:.5", ca.opacity = "0.5" === d.opacity, ca.cssFloat = !!d.cssFloat, c.style.backgroundClip = "content-box", c.cloneNode(!0).style.backgroundClip = "", ca.clearCloneStyle = "content-box" === c.style.backgroundClip, ca.boxSizing = "" === d.boxSizing || "" === d.MozBoxSizing || "" === d.WebkitBoxSizing, ea.extend(ca, {
                reliableHiddenOffsets: function () {
                    return null == h && b(), h
                },
                boxSizingReliable: function () {
                    return null == g && b(), g
                },
                pixelPosition: function () {
                    return null == f && b(), f
                },
                reliableMarginRight: function () {
                    return null == i && b(), i
                }
            }))
        }(), ea.swap = function (a, b, c, d) {
            var e, f, g = {};
            for (f in b) g[f] = a.style[f], a.style[f] = b[f];
            e = c.apply(a, d || []);
            for (f in b) a.style[f] = g[f];
            return e
        };
    var fb = /alpha\([^)]*\)/i,
        gb = /opacity\s*=\s*([^)]*)/,
        hb = /^(none|table(?!-c[ea]).+)/,
        ib = new RegExp("^(" + Aa + ")(.*)$", "i"),
        jb = new RegExp("^([+-])=(" + Aa + ")", "i"),
        kb = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        lb = {
            letterSpacing: "0",
            fontWeight: "400"
        },
        mb = ["Webkit", "O", "Moz", "ms"];
    ea.extend({
        cssHooks: {
            opacity: {
                get: function (a, b) {
                    if (b) {
                        var c = bb(a, "opacity");
                        return "" === c ? "1" : c
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": ca.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function (a, b, c, d) {
            if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                var e, f, g, h = ea.camelCase(b),
                    i = a.style;
                if (b = ea.cssProps[h] || (ea.cssProps[h] = B(i, h)), g = ea.cssHooks[b] || ea.cssHooks[h], void 0 === c) return g && "get" in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b];
                if (f = typeof c, "string" === f && (e = jb.exec(c)) && (c = (e[1] + 1) * e[2] + parseFloat(ea.css(a, b)), f = "number"), null != c && c === c && ("number" !== f || ea.cssNumber[h] || (c += "px"), ca.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"), !(g && "set" in g && void 0 === (c = g.set(a, c, d))))) try {
                    i[b] = c
                } catch (j) { }
            }
        },
        css: function (a, b, c, d) {
            var e, f, g, h = ea.camelCase(b);
            return b = ea.cssProps[h] || (ea.cssProps[h] = B(a.style, h)), g = ea.cssHooks[b] || ea.cssHooks[h], g && "get" in g && (f = g.get(a, !0, c)), void 0 === f && (f = bb(a, b, d)), "normal" === f && b in lb && (f = lb[b]), "" === c || c ? (e = parseFloat(f), c === !0 || ea.isNumeric(e) ? e || 0 : f) : f
        }
    }), ea.each(["height", "width"], function (a, b) {
        ea.cssHooks[b] = {
            get: function (a, c, d) {
                return c ? hb.test(ea.css(a, "display")) && 0 === a.offsetWidth ? ea.swap(a, kb, function () {
                    return F(a, b, d)
                }) : F(a, b, d) : void 0
            },
            set: function (a, c, d) {
                var e = d && ab(a);
                return D(a, c, d ? E(a, b, d, ca.boxSizing && "border-box" === ea.css(a, "boxSizing", !1, e), e) : 0)
            }
        }
    }), ca.opacity || (ea.cssHooks.opacity = {
        get: function (a, b) {
            return gb.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : b ? "1" : ""
        },
        set: function (a, b) {
            var c = a.style,
                d = a.currentStyle,
                e = ea.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : "",
                f = d && d.filter || c.filter || "";
            c.zoom = 1, (b >= 1 || "" === b) && "" === ea.trim(f.replace(fb, "")) && c.removeAttribute && (c.removeAttribute("filter"), "" === b || d && !d.filter) || (c.filter = fb.test(f) ? f.replace(fb, e) : f + " " + e)
        }
    }), ea.cssHooks.marginRight = A(ca.reliableMarginRight, function (a, b) {
        return b ? ea.swap(a, {
            display: "inline-block"
        }, bb, [a, "marginRight"]) : void 0
    }), ea.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function (a, b) {
        ea.cssHooks[a + b] = {
            expand: function (c) {
                for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++) e[a + Ba[d] + b] = f[d] || f[d - 2] || f[0];
                return e
            }
        }, cb.test(a) || (ea.cssHooks[a + b].set = D)
    }), ea.fn.extend({
        css: function (a, b) {
            return Da(this, function (a, b, c) {
                var d, e, f = {},
                    g = 0;
                if (ea.isArray(b)) {
                    for (d = ab(a), e = b.length; e > g; g++) f[b[g]] = ea.css(a, b[g], !1, d);
                    return f
                }
                return void 0 !== c ? ea.style(a, b, c) : ea.css(a, b)
            }, a, b, arguments.length > 1)
        },
        show: function () {
            return C(this, !0)
        },
        hide: function () {
            return C(this)
        },
        toggle: function (a) {
            return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function () {
                Ca(this) ? ea(this).show() : ea(this).hide()
            })
        }
    }), ea.Tween = G, G.prototype = {
        constructor: G,
        init: function (a, b, c, d, e, f) {
            this.elem = a, this.prop = c, this.easing = e || "swing", this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || (ea.cssNumber[c] ? "" : "px")
        },
        cur: function () {
            var a = G.propHooks[this.prop];
            return a && a.get ? a.get(this) : G.propHooks._default.get(this)
        },
        run: function (a) {
            var b, c = G.propHooks[this.prop];
            return this.options.duration ? this.pos = b = ea.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : this.pos = b = a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : G.propHooks._default.set(this), this
        }
    }, G.prototype.init.prototype = G.prototype, G.propHooks = {
        _default: {
            get: function (a) {
                var b;
                return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = ea.css(a.elem, a.prop, ""), b && "auto" !== b ? b : 0) : a.elem[a.prop]
            },
            set: function (a) {
                ea.fx.step[a.prop] ? ea.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[ea.cssProps[a.prop]] || ea.cssHooks[a.prop]) ? ea.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
            }
        }
    }, G.propHooks.scrollTop = G.propHooks.scrollLeft = {
        set: function (a) {
            a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
        }
    }, ea.easing = {
        linear: function (a) {
            return a
        },
        swing: function (a) {
            return .5 - Math.cos(a * Math.PI) / 2
        }
    }, ea.fx = G.prototype.init, ea.fx.step = {};
    var nb, ob, pb = /^(?:toggle|show|hide)$/,
        qb = new RegExp("^(?:([+-])=|)(" + Aa + ")([a-z%]*)$", "i"),
        rb = /queueHooks$/,
        sb = [K],
        tb = {
            "*": [function (a, b) {
                var c = this.createTween(a, b),
                    d = c.cur(),
                    e = qb.exec(b),
                    f = e && e[3] || (ea.cssNumber[a] ? "" : "px"),
                    g = (ea.cssNumber[a] || "px" !== f && +d) && qb.exec(ea.css(c.elem, a)),
                    h = 1,
                    i = 20;
                if (g && g[3] !== f) {
                    f = f || g[3], e = e || [], g = +d || 1;
                    do h = h || ".5", g /= h, ea.style(c.elem, a, g + f); while (h !== (h = c.cur() / d) && 1 !== h && --i)
                }
                return e && (g = c.start = +g || +d || 0, c.unit = f, c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]), c
            }]
        };
    ea.Animation = ea.extend(M, {
        tweener: function (a, b) {
            ea.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" ");
            for (var c, d = 0, e = a.length; e > d; d++) c = a[d], tb[c] = tb[c] || [], tb[c].unshift(b)
        },
        prefilter: function (a, b) {
            b ? sb.unshift(a) : sb.push(a)
        }
    }), ea.speed = function (a, b, c) {
        var d = a && "object" == typeof a ? ea.extend({}, a) : {
            complete: c || !c && b || ea.isFunction(a) && a,
            duration: a,
            easing: c && b || b && !ea.isFunction(b) && b
        };
        return d.duration = ea.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in ea.fx.speeds ? ea.fx.speeds[d.duration] : ea.fx.speeds._default, (null == d.queue || d.queue === !0) && (d.queue = "fx"), d.old = d.complete, d.complete = function () {
            ea.isFunction(d.old) && d.old.call(this), d.queue && ea.dequeue(this, d.queue)
        }, d
    }, ea.fn.extend({
        fadeTo: function (a, b, c, d) {
            return this.filter(Ca).css("opacity", 0).show().end().animate({
                opacity: b
            }, a, c, d)
        },
        animate: function (a, b, c, d) {
            var e = ea.isEmptyObject(a),
                f = ea.speed(b, c, d),
                g = function () {
                    var b = M(this, ea.extend({}, a), f);
                    (e || ea._data(this, "finish")) && b.stop(!0)
                };
            return g.finish = g, e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
        },
        stop: function (a, b, c) {
            var d = function (a) {
                var b = a.stop;
                delete a.stop, b(c)
            };
            return "string" != typeof a && (c = b, b = a, a = void 0), b && a !== !1 && this.queue(a || "fx", []), this.each(function () {
                var b = !0,
                    e = null != a && a + "queueHooks",
                    f = ea.timers,
                    g = ea._data(this);
                if (e) g[e] && g[e].stop && d(g[e]);
                else
                    for (e in g) g[e] && g[e].stop && rb.test(e) && d(g[e]);
                for (e = f.length; e--;) f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c), b = !1, f.splice(e, 1));
                (b || !c) && ea.dequeue(this, a)
            })
        },
        finish: function (a) {
            return a !== !1 && (a = a || "fx"), this.each(function () {
                var b, c = ea._data(this),
                    d = c[a + "queue"],
                    e = c[a + "queueHooks"],
                    f = ea.timers,
                    g = d ? d.length : 0;
                for (c.finish = !0, ea.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--;) f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1));
                for (b = 0; g > b; b++) d[b] && d[b].finish && d[b].finish.call(this);
                delete c.finish
            })
        }
    }), ea.each(["toggle", "show", "hide"], function (a, b) {
        var c = ea.fn[b];
        ea.fn[b] = function (a, d, e) {
            return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(I(b, !0), a, d, e)
        }
    }), ea.each({
        slideDown: I("show"),
        slideUp: I("hide"),
        slideToggle: I("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function (a, b) {
        ea.fn[a] = function (a, c, d) {
            return this.animate(b, a, c, d)
        }
    }), ea.timers = [], ea.fx.tick = function () {
        var a, b = ea.timers,
            c = 0;
        for (nb = ea.now(); c < b.length; c++) a = b[c], a() || b[c] !== a || b.splice(c--, 1);
        b.length || ea.fx.stop(), nb = void 0
    }, ea.fx.timer = function (a) {
        ea.timers.push(a), a() ? ea.fx.start() : ea.timers.pop()
    }, ea.fx.interval = 13, ea.fx.start = function () {
        ob || (ob = setInterval(ea.fx.tick, ea.fx.interval))
    }, ea.fx.stop = function () {
        clearInterval(ob), ob = null
    }, ea.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, ea.fn.delay = function (a, b) {
        return a = ea.fx ? ea.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function (b, c) {
            var d = setTimeout(b, a);
            c.stop = function () {
                clearTimeout(d)
            }
        })
    },
        function () {
            var a, b, c, d, e;
            b = oa.createElement("div"), b.setAttribute("className", "t"), b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", d = b.getElementsByTagName("a")[0], c = oa.createElement("select"), e = c.appendChild(oa.createElement("option")), a = b.getElementsByTagName("input")[0], d.style.cssText = "top:1px", ca.getSetAttribute = "t" !== b.className, ca.style = /top/.test(d.getAttribute("style")), ca.hrefNormalized = "/a" === d.getAttribute("href"), ca.checkOn = !!a.value, ca.optSelected = e.selected, ca.enctype = !!oa.createElement("form").enctype, c.disabled = !0, ca.optDisabled = !e.disabled, a = oa.createElement("input"), a.setAttribute("value", ""), ca.input = "" === a.getAttribute("value"), a.value = "t", a.setAttribute("type", "radio"), ca.radioValue = "t" === a.value
        }();
    var ub = /\r/g;
    ea.fn.extend({
        val: function (a) {
            var b, c, d, e = this[0]; {
                if (arguments.length) return d = ea.isFunction(a), this.each(function (c) {
                    var e;
                    1 === this.nodeType && (e = d ? a.call(this, c, ea(this).val()) : a, null == e ? e = "" : "number" == typeof e ? e += "" : ea.isArray(e) && (e = ea.map(e, function (a) {
                        return null == a ? "" : a + ""
                    })), b = ea.valHooks[this.type] || ea.valHooks[this.nodeName.toLowerCase()], b && "set" in b && void 0 !== b.set(this, e, "value") || (this.value = e))
                });
                if (e) return b = ea.valHooks[e.type] || ea.valHooks[e.nodeName.toLowerCase()], b && "get" in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value, "string" == typeof c ? c.replace(ub, "") : null == c ? "" : c)
            }
        }
    }), ea.extend({
        valHooks: {
            option: {
                get: function (a) {
                    var b = ea.find.attr(a, "value");
                    return null != b ? b : ea.trim(ea.text(a))
                }
            },
            select: {
                get: function (a) {
                    for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++)
                        if (c = d[i], (c.selected || i === e) && (ca.optDisabled ? !c.disabled : null === c.getAttribute("disabled")) && (!c.parentNode.disabled || !ea.nodeName(c.parentNode, "optgroup"))) {
                            if (b = ea(c).val(), f) return b;
                            g.push(b)
                        }
                    return g
                },
                set: function (a, b) {
                    for (var c, d, e = a.options, f = ea.makeArray(b), g = e.length; g--;)
                        if (d = e[g], ea.inArray(ea.valHooks.option.get(d), f) >= 0) try {
                            d.selected = c = !0
                        } catch (h) {
                            d.scrollHeight
                        } else d.selected = !1;
                    return c || (a.selectedIndex = -1), e
                }
            }
        }
    }), ea.each(["radio", "checkbox"], function () {
        ea.valHooks[this] = {
            set: function (a, b) {
                return ea.isArray(b) ? a.checked = ea.inArray(ea(a).val(), b) >= 0 : void 0
            }
        }, ca.checkOn || (ea.valHooks[this].get = function (a) {
            return null === a.getAttribute("value") ? "on" : a.value
        })
    });
    var vb, wb, xb = ea.expr.attrHandle,
        yb = /^(?:checked|selected)$/i,
        zb = ca.getSetAttribute,
        Ab = ca.input;
    ea.fn.extend({
        attr: function (a, b) {
            return Da(this, ea.attr, a, b, arguments.length > 1)
        },
        removeAttr: function (a) {
            return this.each(function () {
                ea.removeAttr(this, a)
            })
        }
    }), ea.extend({
        attr: function (a, b, c) {
            var d, e, f = a.nodeType;
            if (a && 3 !== f && 8 !== f && 2 !== f) return typeof a.getAttribute === xa ? ea.prop(a, b, c) : (1 === f && ea.isXMLDoc(a) || (b = b.toLowerCase(), d = ea.attrHooks[b] || (ea.expr.match.bool.test(b) ? wb : vb)), void 0 === c ? d && "get" in d && null !== (e = d.get(a, b)) ? e : (e = ea.find.attr(a, b), null == e ? void 0 : e) : null !== c ? d && "set" in d && void 0 !== (e = d.set(a, c, b)) ? e : (a.setAttribute(b, c + ""), c) : void ea.removeAttr(a, b))
        },
        removeAttr: function (a, b) {
            var c, d, e = 0,
                f = b && b.match(ta);
            if (f && 1 === a.nodeType)
                for (; c = f[e++];) d = ea.propFix[c] || c, ea.expr.match.bool.test(c) ? Ab && zb || !yb.test(c) ? a[d] = !1 : a[ea.camelCase("default-" + c)] = a[d] = !1 : ea.attr(a, c, ""), a.removeAttribute(zb ? c : d)
        },
        attrHooks: {
            type: {
                set: function (a, b) {
                    if (!ca.radioValue && "radio" === b && ea.nodeName(a, "input")) {
                        var c = a.value;
                        return a.setAttribute("type", b), c && (a.value = c), b
                    }
                }
            }
        }
    }), wb = {
        set: function (a, b, c) {
            return b === !1 ? ea.removeAttr(a, c) : Ab && zb || !yb.test(c) ? a.setAttribute(!zb && ea.propFix[c] || c, c) : a[ea.camelCase("default-" + c)] = a[c] = !0, c
        }
    }, ea.each(ea.expr.match.bool.source.match(/\w+/g), function (a, b) {
        var c = xb[b] || ea.find.attr;
        xb[b] = Ab && zb || !yb.test(b) ? function (a, b, d) {
            var e, f;
            return d || (f = xb[b], xb[b] = e, e = null != c(a, b, d) ? b.toLowerCase() : null, xb[b] = f), e
        } : function (a, b, c) {
            return c ? void 0 : a[ea.camelCase("default-" + b)] ? b.toLowerCase() : null
        }
    }), Ab && zb || (ea.attrHooks.value = {
        set: function (a, b, c) {
            return ea.nodeName(a, "input") ? void (a.defaultValue = b) : vb && vb.set(a, b, c)
        }
    }), zb || (vb = {
        set: function (a, b, c) {
            var d = a.getAttributeNode(c);
            return d || a.setAttributeNode(d = a.ownerDocument.createAttribute(c)), d.value = b += "", "value" === c || b === a.getAttribute(c) ? b : void 0
        }
    }, xb.id = xb.name = xb.coords = function (a, b, c) {
        var d;
        return c ? void 0 : (d = a.getAttributeNode(b)) && "" !== d.value ? d.value : null
    }, ea.valHooks.button = {
        get: function (a, b) {
            var c = a.getAttributeNode(b);
            return c && c.specified ? c.value : void 0
        },
        set: vb.set
    }, ea.attrHooks.contenteditable = {
        set: function (a, b, c) {
            vb.set(a, "" === b ? !1 : b, c)
        }
    }, ea.each(["width", "height"], function (a, b) {
        ea.attrHooks[b] = {
            set: function (a, c) {
                return "" === c ? (a.setAttribute(b, "auto"), c) : void 0
            }
        }
    })), ca.style || (ea.attrHooks.style = {
        get: function (a) {
            return a.style.cssText || void 0
        },
        set: function (a, b) {
            return a.style.cssText = b + ""
        }
    });
    var Bb = /^(?:input|select|textarea|button|object)$/i,
        Cb = /^(?:a|area)$/i;
    ea.fn.extend({
        prop: function (a, b) {
            return Da(this, ea.prop, a, b, arguments.length > 1)
        },
        removeProp: function (a) {
            return a = ea.propFix[a] || a, this.each(function () {
                try {
                    this[a] = void 0, delete this[a]
                } catch (b) { }
            })
        }
    }), ea.extend({
        propFix: {
            "for": "htmlFor",
            "class": "className"
        },
        prop: function (a, b, c) {
            var d, e, f, g = a.nodeType;
            if (a && 3 !== g && 8 !== g && 2 !== g) return f = 1 !== g || !ea.isXMLDoc(a), f && (b = ea.propFix[b] || b, e = ea.propHooks[b]), void 0 !== c ? e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get" in e && null !== (d = e.get(a, b)) ? d : a[b]
        },
        propHooks: {
            tabIndex: {
                get: function (a) {
                    var b = ea.find.attr(a, "tabindex");
                    return b ? parseInt(b, 10) : Bb.test(a.nodeName) || Cb.test(a.nodeName) && a.href ? 0 : -1
                }
            }
        }
    }), ca.hrefNormalized || ea.each(["href", "src"], function (a, b) {
        ea.propHooks[b] = {
            get: function (a) {
                return a.getAttribute(b, 4)
            }
        }
    }), ca.optSelected || (ea.propHooks.selected = {
        get: function (a) {
            var b = a.parentNode;
            return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null
        }
    }), ea.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
        ea.propFix[this.toLowerCase()] = this
    }), ca.enctype || (ea.propFix.enctype = "encoding");
    var Db = /[\t\r\n\f]/g;
    ea.fn.extend({
        addClass: function (a) {
            var b, c, d, e, f, g, h = 0,
                i = this.length,
                j = "string" == typeof a && a;
            if (ea.isFunction(a)) return this.each(function (b) {
                ea(this).addClass(a.call(this, b, this.className))
            });
            if (j)
                for (b = (a || "").match(ta) || []; i > h; h++)
                    if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(Db, " ") : " ")) {
                        for (f = 0; e = b[f++];) d.indexOf(" " + e + " ") < 0 && (d += e + " ");
                        g = ea.trim(d), c.className !== g && (c.className = g)
                    }
            return this
        },
        removeClass: function (a) {
            var b, c, d, e, f, g, h = 0,
                i = this.length,
                j = 0 === arguments.length || "string" == typeof a && a;
            if (ea.isFunction(a)) return this.each(function (b) {
                ea(this).removeClass(a.call(this, b, this.className))
            });
            if (j)
                for (b = (a || "").match(ta) || []; i > h; h++)
                    if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(Db, " ") : "")) {
                        for (f = 0; e = b[f++];)
                            for (; d.indexOf(" " + e + " ") >= 0;) d = d.replace(" " + e + " ", " ");
                        g = a ? ea.trim(d) : "", c.className !== g && (c.className = g)
                    }
            return this
        },
        toggleClass: function (a, b) {
            var c = typeof a;
            return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : ea.isFunction(a) ? this.each(function (c) {
                ea(this).toggleClass(a.call(this, c, this.className, b), b)
            }) : this.each(function () {
                if ("string" === c)
                    for (var b, d = 0, e = ea(this), f = a.match(ta) || []; b = f[d++];) e.hasClass(b) ? e.removeClass(b) : e.addClass(b);
                else (c === xa || "boolean" === c) && (this.className && ea._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : ea._data(this, "__className__") || "")
            })
        },
        hasClass: function (a) {
            for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++)
                if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(Db, " ").indexOf(b) >= 0) return !0;
            return !1
        }
    }), ea.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (a, b) {
        ea.fn[b] = function (a, c) {
            return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
        }
    }), ea.fn.extend({
        hover: function (a, b) {
            return this.mouseenter(a).mouseleave(b || a)
        },
        bind: function (a, b, c) {
            return this.on(a, null, b, c)
        },
        unbind: function (a, b) {
            return this.off(a, null, b)
        },
        delegate: function (a, b, c, d) {
            return this.on(b, a, c, d)
        },
        undelegate: function (a, b, c) {
            return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
        }
    });
    var Eb = ea.now(),
        Fb = /\?/,
        Gb = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    ea.parseJSON = function (b) {
        if (a.JSON && a.JSON.parse) return a.JSON.parse(b + "");
        var c, d = null,
            e = ea.trim(b + "");
        return e && !ea.trim(e.replace(Gb, function (a, b, e, f) {
            return c && b && (d = 0), 0 === d ? a : (c = e || b, d += !f - !e, "")
        })) ? Function("return " + e)() : ea.error("Invalid JSON: " + b)
    }, ea.parseXML = function (b) {
        var c, d;
        if (!b || "string" != typeof b) return null;
        try {
            a.DOMParser ? (d = new DOMParser, c = d.parseFromString(b, "text/xml")) : (c = new ActiveXObject("Microsoft.XMLDOM"), c.async = "false", c.loadXML(b))
        } catch (e) {
            c = void 0
        }
        return c && c.documentElement && !c.getElementsByTagName("parsererror").length || ea.error("Invalid XML: " + b), c
    };
    var Hb, Ib, Jb = /#.*$/,
        Kb = /([?&])_=[^&]*/,
        Lb = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
        Mb = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        Nb = /^(?:GET|HEAD)$/,
        Ob = /^\/\//,
        Pb = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
        Qb = {},
        Rb = {},
        Sb = "*/".concat("*");
    try {
        Ib = location.href
    } catch (Tb) {
        Ib = oa.createElement("a"), Ib.href = "", Ib = Ib.href
    }
    Hb = Pb.exec(Ib.toLowerCase()) || [], ea.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: Ib,
            type: "GET",
            isLocal: Mb.test(Hb[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Sb,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": ea.parseJSON,
                "text xml": ea.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function (a, b) {
            return b ? P(P(a, ea.ajaxSettings), b) : P(ea.ajaxSettings, a)
        },
        ajaxPrefilter: N(Qb),
        ajaxTransport: N(Rb),
        ajax: function (a, b) {
            function c(a, b, c, d) {
                var e, k, r, s, u, w = b;
                2 !== t && (t = 2, h && clearTimeout(h), j = void 0, g = d || "", v.readyState = a > 0 ? 4 : 0, e = a >= 200 && 300 > a || 304 === a, c && (s = Q(l, v, c)), s = R(l, s, v, e), e ? (l.ifModified && (u = v.getResponseHeader("Last-Modified"), u && (ea.lastModified[f] = u), u = v.getResponseHeader("etag"), u && (ea.etag[f] = u)), 204 === a || "HEAD" === l.type ? w = "nocontent" : 304 === a ? w = "notmodified" : (w = s.state, k = s.data, r = s.error, e = !r)) : (r = w, (a || !w) && (w = "error", 0 > a && (a = 0))), v.status = a, v.statusText = (b || w) + "", e ? o.resolveWith(m, [k, w, v]) : o.rejectWith(m, [v, w, r]), v.statusCode(q), q = void 0, i && n.trigger(e ? "ajaxSuccess" : "ajaxError", [v, l, e ? k : r]), p.fireWith(m, [v, w]), i && (n.trigger("ajaxComplete", [v, l]), --ea.active || ea.event.trigger("ajaxStop")))
            }
            "object" == typeof a && (b = a, a = void 0), b = b || {};
            var d, e, f, g, h, i, j, k, l = ea.ajaxSetup({}, b),
                m = l.context || l,
                n = l.context && (m.nodeType || m.jquery) ? ea(m) : ea.event,
                o = ea.Deferred(),
                p = ea.Callbacks("once memory"),
                q = l.statusCode || {},
                r = {},
                s = {},
                t = 0,
                u = "canceled",
                v = {
                    readyState: 0,
                    getResponseHeader: function (a) {
                        var b;
                        if (2 === t) {
                            if (!k)
                                for (k = {}; b = Lb.exec(g);) k[b[1].toLowerCase()] = b[2];
                            b = k[a.toLowerCase()]
                        }
                        return null == b ? null : b
                    },
                    getAllResponseHeaders: function () {
                        return 2 === t ? g : null
                    },
                    setRequestHeader: function (a, b) {
                        var c = a.toLowerCase();
                        return t || (a = s[c] = s[c] || a, r[a] = b), this
                    },
                    overrideMimeType: function (a) {
                        return t || (l.mimeType = a), this
                    },
                    statusCode: function (a) {
                        var b;
                        if (a)
                            if (2 > t)
                                for (b in a) q[b] = [q[b], a[b]];
                            else v.always(a[v.status]);
                        return this
                    },
                    abort: function (a) {
                        var b = a || u;
                        return j && j.abort(b), c(0, b), this
                    }
                };
            if (o.promise(v).complete = p.add, v.success = v.done, v.error = v.fail, l.url = ((a || l.url || Ib) + "").replace(Jb, "").replace(Ob, Hb[1] + "//"), l.type = b.method || b.type || l.method || l.type, l.dataTypes = ea.trim(l.dataType || "*").toLowerCase().match(ta) || [""], null == l.crossDomain && (d = Pb.exec(l.url.toLowerCase()), l.crossDomain = !(!d || d[1] === Hb[1] && d[2] === Hb[2] && (d[3] || ("http:" === d[1] ? "80" : "443")) === (Hb[3] || ("http:" === Hb[1] ? "80" : "443")))), l.data && l.processData && "string" != typeof l.data && (l.data = ea.param(l.data, l.traditional)), O(Qb, l, b, v), 2 === t) return v;
            i = ea.event && l.global, i && 0 === ea.active++ && ea.event.trigger("ajaxStart"), l.type = l.type.toUpperCase(), l.hasContent = !Nb.test(l.type), f = l.url, l.hasContent || (l.data && (f = l.url += (Fb.test(f) ? "&" : "?") + l.data, delete l.data), l.cache === !1 && (l.url = Kb.test(f) ? f.replace(Kb, "$1_=" + Eb++) : f + (Fb.test(f) ? "&" : "?") + "_=" + Eb++)), l.ifModified && (ea.lastModified[f] && v.setRequestHeader("If-Modified-Since", ea.lastModified[f]), ea.etag[f] && v.setRequestHeader("If-None-Match", ea.etag[f])), (l.data && l.hasContent && l.contentType !== !1 || b.contentType) && v.setRequestHeader("Content-Type", l.contentType), v.setRequestHeader("Accept", l.dataTypes[0] && l.accepts[l.dataTypes[0]] ? l.accepts[l.dataTypes[0]] + ("*" !== l.dataTypes[0] ? ", " + Sb + "; q=0.01" : "") : l.accepts["*"]);
            for (e in l.headers) v.setRequestHeader(e, l.headers[e]);
            if (l.beforeSend && (l.beforeSend.call(m, v, l) === !1 || 2 === t)) return v.abort();
            u = "abort";
            for (e in {
                success: 1,
                error: 1,
                complete: 1
            }) v[e](l[e]);
            if (j = O(Rb, l, b, v)) {
                v.readyState = 1, i && n.trigger("ajaxSend", [v, l]), l.async && l.timeout > 0 && (h = setTimeout(function () {
                    v.abort("timeout")
                }, l.timeout));
                try {
                    t = 1, j.send(r, c)
                } catch (w) {
                    if (!(2 > t)) throw w;
                    c(-1, w)
                }
            } else c(-1, "No Transport");
            return v
        },
        getJSON: function (a, b, c) {
            return ea.get(a, b, c, "json")
        },
        getScript: function (a, b) {
            return ea.get(a, void 0, b, "script")
        }
    }), ea.each(["get", "post"], function (a, b) {
        ea[b] = function (a, c, d, e) {
            return ea.isFunction(c) && (e = e || d, d = c, c = void 0), ea.ajax({
                url: a,
                type: b,
                dataType: e,
                data: c,
                success: d
            })
        }
    }), ea._evalUrl = function (a) {
        return ea.ajax({
            url: a,
            type: "GET",
            dataType: "script",
            async: !1,
            global: !1,
            "throws": !0
        })
    }, ea.fn.extend({
        wrapAll: function (a) {
            if (ea.isFunction(a)) return this.each(function (b) {
                ea(this).wrapAll(a.call(this, b))
            });
            if (this[0]) {
                var b = ea(a, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && b.insertBefore(this[0]), b.map(function () {
                    for (var a = this; a.firstChild && 1 === a.firstChild.nodeType;) a = a.firstChild;
                    return a
                }).append(this)
            }
            return this
        },
        wrapInner: function (a) {
            return ea.isFunction(a) ? this.each(function (b) {
                ea(this).wrapInner(a.call(this, b))
            }) : this.each(function () {
                var b = ea(this),
                    c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a)
            })
        },
        wrap: function (a) {
            var b = ea.isFunction(a);
            return this.each(function (c) {
                ea(this).wrapAll(b ? a.call(this, c) : a)
            })
        },
        unwrap: function () {
            return this.parent().each(function () {
                ea.nodeName(this, "body") || ea(this).replaceWith(this.childNodes)
            }).end()
        }
    }), ea.expr.filters.hidden = function (a) {
        return a.offsetWidth <= 0 && a.offsetHeight <= 0 || !ca.reliableHiddenOffsets() && "none" === (a.style && a.style.display || ea.css(a, "display"))
    }, ea.expr.filters.visible = function (a) {
        return !ea.expr.filters.hidden(a)
    };
    var Ub = /%20/g,
        Vb = /\[\]$/,
        Wb = /\r?\n/g,
        Xb = /^(?:submit|button|image|reset|file)$/i,
        Yb = /^(?:input|select|textarea|keygen)/i;
    ea.param = function (a, b) {
        var c, d = [],
            e = function (a, b) {
                b = ea.isFunction(b) ? b() : null == b ? "" : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
            };
        if (void 0 === b && (b = ea.ajaxSettings && ea.ajaxSettings.traditional), ea.isArray(a) || a.jquery && !ea.isPlainObject(a)) ea.each(a, function () {
            e(this.name, this.value)
        });
        else
            for (c in a) S(c, a[c], b, e);
        return d.join("&").replace(Ub, "+")
    }, ea.fn.extend({
        serialize: function () {
            return ea.param(this.serializeArray())
        },
        serializeArray: function () {
            return this.map(function () {
                var a = ea.prop(this, "elements");
                return a ? ea.makeArray(a) : this
            }).filter(function () {
                var a = this.type;
                return this.name && !ea(this).is(":disabled") && Yb.test(this.nodeName) && !Xb.test(a) && (this.checked || !Ea.test(a))
            }).map(function (a, b) {
                var c = ea(this).val();
                return null == c ? null : ea.isArray(c) ? ea.map(c, function (a) {
                    return {
                        name: b.name,
                        value: a.replace(Wb, "\r\n")
                    }
                }) : {
                        name: b.name,
                        value: c.replace(Wb, "\r\n")
                    }
            }).get()
        }
    }), ea.ajaxSettings.xhr = void 0 !== a.ActiveXObject ? function () {
        return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && T() || U()
    } : T;
    var Zb = 0,
        $b = {},
        _b = ea.ajaxSettings.xhr();
    a.attachEvent && a.attachEvent("onunload", function () {
        for (var a in $b) $b[a](void 0, !0)
    }), ca.cors = !!_b && "withCredentials" in _b, _b = ca.ajax = !!_b, _b && ea.ajaxTransport(function (a) {
        if (!a.crossDomain || ca.cors) {
            var b;
            return {
                send: function (c, d) {
                    var e, f = a.xhr(),
                        g = ++Zb;
                    if (f.open(a.type, a.url, a.async, a.username, a.password), a.xhrFields)
                        for (e in a.xhrFields) f[e] = a.xhrFields[e];
                    a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType), a.crossDomain || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest");
                    for (e in c) void 0 !== c[e] && f.setRequestHeader(e, c[e] + "");
                    f.send(a.hasContent && a.data || null), b = function (c, e) {
                        var h, i, j;
                        if (b && (e || 4 === f.readyState))
                            if (delete $b[g], b = void 0, f.onreadystatechange = ea.noop, e) 4 !== f.readyState && f.abort();
                            else {
                                j = {}, h = f.status, "string" == typeof f.responseText && (j.text = f.responseText);
                                try {
                                    i = f.statusText
                                } catch (k) {
                                    i = ""
                                }
                                h || !a.isLocal || a.crossDomain ? 1223 === h && (h = 204) : h = j.text ? 200 : 404
                            }
                        j && d(h, i, j, f.getAllResponseHeaders())
                    }, a.async ? 4 === f.readyState ? setTimeout(b) : f.onreadystatechange = $b[g] = b : b()
                },
                abort: function () {
                    b && b(void 0, !0)
                }
            }
        }
    }), ea.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function (a) {
                return ea.globalEval(a), a
            }
        }
    }), ea.ajaxPrefilter("script", function (a) {
        void 0 === a.cache && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1)
    }), ea.ajaxTransport("script", function (a) {
        if (a.crossDomain) {
            var b, c = oa.head || ea("head")[0] || oa.documentElement;
            return {
                send: function (d, e) {
                    b = oa.createElement("script"), b.async = !0, a.scriptCharset && (b.charset = a.scriptCharset), b.src = a.url, b.onload = b.onreadystatechange = function (a, c) {
                        (c || !b.readyState || /loaded|complete/.test(b.readyState)) && (b.onload = b.onreadystatechange = null, b.parentNode && b.parentNode.removeChild(b), b = null, c || e(200, "success"))
                    }, c.insertBefore(b, c.firstChild)
                },
                abort: function () {
                    b && b.onload(void 0, !0)
                }
            }
        }
    });
    var ac = [],
        bc = /(=)\?(?=&|$)|\?\?/;
    ea.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function () {
            var a = ac.pop() || ea.expando + "_" + Eb++;
            return this[a] = !0, a
        }
    }), ea.ajaxPrefilter("json jsonp", function (b, c, d) {
        var e, f, g, h = b.jsonp !== !1 && (bc.test(b.url) ? "url" : "string" == typeof b.data && !(b.contentType || "").indexOf("application/x-www-form-urlencoded") && bc.test(b.data) && "data");
        return h || "jsonp" === b.dataTypes[0] ? (e = b.jsonpCallback = ea.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, h ? b[h] = b[h].replace(bc, "$1" + e) : b.jsonp !== !1 && (b.url += (Fb.test(b.url) ? "&" : "?") + b.jsonp + "=" + e), b.converters["script json"] = function () {
            return g || ea.error(e + " was not called"), g[0]
        }, b.dataTypes[0] = "json", f = a[e], a[e] = function () {
            g = arguments
        }, d.always(function () {
            a[e] = f, b[e] && (b.jsonpCallback = c.jsonpCallback, ac.push(e)), g && ea.isFunction(f) && f(g[0]), g = f = void 0
        }), "script") : void 0
    }), ea.parseHTML = function (a, b, c) {
        if (!a || "string" != typeof a) return null;
        "boolean" == typeof b && (c = b, b = !1), b = b || oa;
        var d = la.exec(a),
            e = !c && [];
        return d ? [b.createElement(d[1])] : (d = ea.buildFragment([a], b, e), e && e.length && ea(e).remove(), ea.merge([], d.childNodes))
    };
    var cc = ea.fn.load;
    ea.fn.load = function (a, b, c) {
        if ("string" != typeof a && cc) return cc.apply(this, arguments);
        var d, e, f, g = this,
            h = a.indexOf(" ");
        return h >= 0 && (d = ea.trim(a.slice(h, a.length)), a = a.slice(0, h)), ea.isFunction(b) ? (c = b, b = void 0) : b && "object" == typeof b && (f = "POST"), g.length > 0 && ea.ajax({
            url: a,
            type: f,
            dataType: "html",
            data: b
        }).done(function (a) {
            e = arguments, g.html(d ? ea("<div>").append(ea.parseHTML(a)).find(d) : a)
        }).complete(c && function (a, b) {
            g.each(c, e || [a.responseText, b, a])
        }), this
    }, ea.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (a, b) {
        ea.fn[b] = function (a) {
            return this.on(b, a)
        }
    }), ea.expr.filters.animated = function (a) {
        return ea.grep(ea.timers, function (b) {
            return a === b.elem
        }).length
    };
    var dc = a.document.documentElement;
    ea.offset = {
        setOffset: function (a, b, c) {
            var d, e, f, g, h, i, j, k = ea.css(a, "position"),
                l = ea(a),
                m = {};
            "static" === k && (a.style.position = "relative"), h = l.offset(), f = ea.css(a, "top"), i = ea.css(a, "left"), j = ("absolute" === k || "fixed" === k) && ea.inArray("auto", [f, i]) > -1, j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0), ea.isFunction(b) && (b = b.call(a, c, h)), null != b.top && (m.top = b.top - h.top + g), null != b.left && (m.left = b.left - h.left + e), "using" in b ? b.using.call(a, m) : l.css(m)
        }
    }, ea.fn.extend({
        offset: function (a) {
            if (arguments.length) return void 0 === a ? this : this.each(function (b) {
                ea.offset.setOffset(this, a, b)
            });
            var b, c, d = {
                top: 0,
                left: 0
            },
                e = this[0],
                f = e && e.ownerDocument;
            if (f) return b = f.documentElement, ea.contains(b, e) ? (typeof e.getBoundingClientRect !== xa && (d = e.getBoundingClientRect()), c = V(f), {
                top: d.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0),
                left: d.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)
            }) : d
        },
        position: function () {
            if (this[0]) {
                var a, b, c = {
                    top: 0,
                    left: 0
                },
                    d = this[0];
                return "fixed" === ea.css(d, "position") ? b = d.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), ea.nodeName(a[0], "html") || (c = a.offset()), c.top += ea.css(a[0], "borderTopWidth", !0), c.left += ea.css(a[0], "borderLeftWidth", !0)), {
                    top: b.top - c.top - ea.css(d, "marginTop", !0),
                    left: b.left - c.left - ea.css(d, "marginLeft", !0)
                }
            }
        },
        offsetParent: function () {
            return this.map(function () {
                for (var a = this.offsetParent || dc; a && !ea.nodeName(a, "html") && "static" === ea.css(a, "position");) a = a.offsetParent;
                return a || dc
            })
        }
    }), ea.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function (a, b) {
        var c = /Y/.test(b);
        ea.fn[a] = function (d) {
            return Da(this, function (a, d, e) {
                var f = V(a);
                return void 0 === e ? f ? b in f ? f[b] : f.document.documentElement[d] : a[d] : void (f ? f.scrollTo(c ? ea(f).scrollLeft() : e, c ? e : ea(f).scrollTop()) : a[d] = e)
            }, a, d, arguments.length, null)
        }
    }), ea.each(["top", "left"], function (a, b) {
        ea.cssHooks[b] = A(ca.pixelPosition, function (a, c) {
            return c ? (c = bb(a, b), db.test(c) ? ea(a).position()[b] + "px" : c) : void 0
        })
    }), ea.each({
        Height: "height",
        Width: "width"
    }, function (a, b) {
        ea.each({
            padding: "inner" + a,
            content: b,
            "": "outer" + a
        }, function (c, d) {
            ea.fn[d] = function (d, e) {
                var f = arguments.length && (c || "boolean" != typeof d),
                    g = c || (d === !0 || e === !0 ? "margin" : "border");
                return Da(this, function (b, c, d) {
                    var e;
                    return ea.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement, Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? ea.css(b, c, g) : ea.style(b, c, d, g)
                }, b, f ? d : void 0, f, null)
            }
        })
    }), ea.fn.size = function () {
        return this.length
    }, ea.fn.andSelf = ea.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function () {
        return ea
    });
    var ec = a.jQuery,
        fc = a.$;
    return ea.noConflict = function (b) {
        return a.$ === ea && (a.$ = fc), b && a.jQuery === ea && (a.jQuery = ec), ea
    }, typeof b === xa && (a.jQuery = a.$ = ea), ea
}),
    function a(b, c, d) {
        function e(g, h) {
            if (!c[g]) {
                if (!b[g]) {
                    var i = "function" == typeof require && require;
                    if (!h && i) return i(g, !0);
                    if (f) return f(g, !0);
                    var j = new Error("Cannot find module '" + g + "'");
                    throw j.code = "MODULE_NOT_FOUND", j
                }
                var k = c[g] = {
                    exports: {}
                };
                b[g][0].call(k.exports, function (a) {
                    var c = b[g][1][a];
                    return e(c ? c : a)
                }, k, k.exports, a, b, c, d)
            }
            return c[g].exports
        }
        for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
        return e
    }({
        1: [function (a, b, c) {
            (function (b) {
                "use strict";
                if (b._babelPolyfill) throw new Error("only one instance of babel/polyfill is allowed");
                b._babelPolyfill = !0, a("core-js/shim"), a("regenerator/runtime")
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {
            "core-js/shim": 72,
            "regenerator/runtime": 73
        }],
        2: [function (a, b, c) {
            "use strict";
            var d = a("./$");
            b.exports = function (a) {
                return function (b) {
                    var c, e = d.toObject(this),
                        f = d.toLength(e.length),
                        g = d.toIndex(arguments[1], f);
                    if (a && b != b) {
                        for (; f > g;)
                            if (c = e[g++], c != c) return !0
                    } else
                        for (; f > g; g++)
                            if ((a || g in e) && e[g] === b) return a || g;
                    return !a && -1
                }
            }
        }, {
            "./$": 16
        }],
        3: [function (a, b, c) {
            "use strict";
            var d = a("./$"),
                e = a("./$.ctx");
            b.exports = function (a) {
                var b = 1 == a,
                    c = 2 == a,
                    f = 3 == a,
                    g = 4 == a,
                    h = 6 == a,
                    i = 5 == a || h;
                return function (j) {
                    for (var k, l, m = Object(d.assertDefined(this)), n = d.ES5Object(m), o = e(j, arguments[1], 3), p = d.toLength(n.length), q = 0, r = b ? Array(p) : c ? [] : void 0; p > q; q++)
                        if ((i || q in n) && (k = n[q], l = o(k, q, m), a))
                            if (b) r[q] = l;
                            else if (l) switch (a) {
                                case 3:
                                    return !0;
                                case 5:
                                    return k;
                                case 6:
                                    return q;
                                case 2:
                                    r.push(k)
                            } else if (g) return !1;
                    return h ? -1 : f || g ? g : r
                }
            }
        }, {
            "./$": 16,
            "./$.ctx": 10
        }],
        4: [function (a, b, c) {
            function d(a, b, c) {
                if (!a) throw TypeError(c ? b + c : b)
            }
            var e = a("./$");
            d.def = e.assertDefined, d.fn = function (a) {
                if (!e.isFunction(a)) throw TypeError(a + " is not a function!");
                return a
            }, d.obj = function (a) {
                if (!e.isObject(a)) throw TypeError(a + " is not an object!");
                return a
            }, d.inst = function (a, b, c) {
                if (!(a instanceof b)) throw TypeError(c + ": use the 'new' operator!");
                return a
            }, b.exports = d
        }, {
            "./$": 16
        }],
        5: [function (a, b, c) {
            var d = a("./$");
            b.exports = Object.assign || function (a, b) {
                for (var c = Object(d.assertDefined(a)), e = arguments.length, f = 1; e > f;)
                    for (var g, h = d.ES5Object(arguments[f++]), i = d.getKeys(h), j = i.length, k = 0; j > k;) c[g = i[k++]] = h[g];
                return c
            }
        }, {
            "./$": 16
        }],
        6: [function (a, b, c) {
            function d(a) {
                return g.call(a).slice(8, -1)
            }
            var e = a("./$"),
                f = a("./$.wks")("toStringTag"),
                g = {}.toString;
            d.classof = function (a) {
                var b, c;
                return void 0 == a ? void 0 === a ? "Undefined" : "Null" : "string" == typeof (c = (b = Object(a))[f]) ? c : d(b)
            }, d.set = function (a, b, c) {
                a && !e.has(a = c ? a : a.prototype, f) && e.hide(a, f, b)
            }, b.exports = d
        }, {
            "./$": 16,
            "./$.wks": 27
        }],
        7: [function (a, b, c) {
            "use strict";

            function d(a, b) {
                if (!m(a)) return ("string" == typeof a ? "S" : "P") + a;
                if (p(a)) return "F";
                if (!k(a, q)) {
                    if (!b) return "E";
                    n(a, q, ++w)
                }
                return "O" + a[q]
            }

            function e(a, b) {
                var c, e = d(b);
                if ("F" != e) return a[r][e];
                for (c = a[t]; c; c = c.n)
                    if (c.k == b) return c
            }
            var f = a("./$"),
                g = a("./$.ctx"),
                h = a("./$.uid").safe,
                i = a("./$.assert"),
                j = a("./$.iter"),
                k = f.has,
                l = f.set,
                m = f.isObject,
                n = f.hide,
                o = j.step,
                p = Object.isFrozen || f.core.Object.isFrozen,
                q = h("id"),
                r = h("O1"),
                s = h("last"),
                t = h("first"),
                u = h("iter"),
                v = f.DESC ? h("size") : "size",
                w = 0;
            b.exports = {
                getConstructor: function (a, b, c) {
                    function d(e) {
                        var g = i.inst(this, d, a);
                        l(g, r, f.create(null)), l(g, v, 0), l(g, s, void 0), l(g, t, void 0), void 0 != e && j.forOf(e, b, g[c], g)
                    }
                    return f.mix(d.prototype, {
                        clear: function () {
                            for (var a = this, b = a[r], c = a[t]; c; c = c.n) c.r = !0, c.p && (c.p = c.p.n = void 0), delete b[c.i];
                            a[t] = a[s] = void 0, a[v] = 0
                        },
                        "delete": function (a) {
                            var b = this,
                                c = e(b, a);
                            if (c) {
                                var d = c.n,
                                    f = c.p;
                                delete b[r][c.i], c.r = !0, f && (f.n = d), d && (d.p = f), b[t] == c && (b[t] = d), b[s] == c && (b[s] = f), b[v]--
                            }
                            return !!c
                        },
                        forEach: function (a) {
                            for (var b, c = g(a, arguments[1], 3); b = b ? b.n : this[t];)
                                for (c(b.v, b.k, this); b && b.r;) b = b.p
                        },
                        has: function (a) {
                            return !!e(this, a)
                        }
                    }), f.DESC && f.setDesc(d.prototype, "size", {
                        get: function () {
                            return i.def(this[v])
                        }
                    }), d
                },
                def: function (a, b, c) {
                    var f, g, h = e(a, b);
                    return h ? h.v = c : (a[s] = h = {
                        i: g = d(b, !0),
                        k: b,
                        v: c,
                        p: f = a[s],
                        n: void 0,
                        r: !1
                    }, a[t] || (a[t] = h), f && (f.n = h), a[v]++ , "F" != g && (a[r][g] = h)), a
                },
                getEntry: e,
                getIterConstructor: function () {
                    return function (a, b) {
                        l(this, u, {
                            o: a,
                            k: b
                        })
                    }
                },
                next: function () {
                    for (var a = this[u], b = a.k, c = a.l; c && c.r;) c = c.p;
                    return a.o && (a.l = c = c ? c.n : a.o[t]) ? "key" == b ? o(0, c.k) : "value" == b ? o(0, c.v) : o(0, [c.k, c.v]) : (a.o = void 0, o(1))
                }
            }
        }, {
            "./$": 16,
            "./$.assert": 4,
            "./$.ctx": 10,
            "./$.iter": 15,
            "./$.uid": 25
        }],
        8: [function (a, b, c) {
            "use strict";

            function d(a, b) {
                return s.call(a.array, function (a) {
                    return a[0] === b
                })
            }

            function e(a) {
                return a[q] || l(a, q, {
                    array: [],
                    get: function (a) {
                        var b = d(this, a);
                        return b ? b[1] : void 0
                    },
                    has: function (a) {
                        return !!d(this, a)
                    },
                    set: function (a, b) {
                        var c = d(this, a);
                        c ? c[1] = b : this.array.push([a, b])
                    },
                    "delete": function (a) {
                        var b = t.call(this.array, function (b) {
                            return b[0] === a
                        });
                        return ~b && this.array.splice(b, 1), !!~b
                    }
                })[q]
            }
            var f = a("./$"),
                g = a("./$.uid").safe,
                h = a("./$.assert"),
                i = a("./$.iter").forOf,
                j = f.has,
                k = f.isObject,
                l = f.hide,
                m = Object.isFrozen || f.core.Object.isFrozen,
                n = 0,
                o = g("id"),
                p = g("weak"),
                q = g("leak"),
                r = a("./$.array-methods"),
                s = r(5),
                t = r(6);
            b.exports = {
                getConstructor: function (a, b, c) {
                    function d(e) {
                        f.set(h.inst(this, d, a), o, n++), void 0 != e && i(e, b, this[c], this)
                    }
                    return f.mix(d.prototype, {
                        "delete": function (a) {
                            return k(a) ? m(a) ? e(this)["delete"](a) : j(a, p) && j(a[p], this[o]) && delete a[p][this[o]] : !1
                        },
                        has: function (a) {
                            return k(a) ? m(a) ? e(this).has(a) : j(a, p) && j(a[p], this[o]) : !1
                        }
                    }), d
                },
                def: function (a, b, c) {
                    return m(h.obj(b)) ? e(a).set(b, c) : (j(b, p) || l(b, p, {}), b[p][a[o]] = c), a
                },
                leakStore: e,
                WEAK: p,
                ID: o
            }
        }, {
            "./$": 16,
            "./$.array-methods": 3,
            "./$.assert": 4,
            "./$.iter": 15,
            "./$.uid": 25
        }],
        9: [function (a, b, c) {
            "use strict";
            var d = a("./$"),
                e = a("./$.def"),
                f = a("./$.iter"),
                g = a("./$.assert").inst;
            b.exports = function (b, c, h, i, j) {
                function k(a, b) {
                    var c = o[a];
                    d.FW && (o[a] = function (a, d) {
                        var e = c.call(this, 0 === a ? 0 : a, d);
                        return b ? this : e
                    })
                }
                var l = d.g[b],
                    m = l,
                    n = i ? "set" : "add",
                    o = m && m.prototype,
                    p = {};
                if (d.isFunction(m) && (j || !f.BUGGY && o.forEach && o.entries)) {
                    var q, r = new m,
                        s = r[n](j ? {} : -0, 1);
                    a("./$.iter-detect")(function (a) {
                        new m(a)
                    }) || (m = function (a) {
                        g(this, m, b);
                        var c = new l;
                        return void 0 != a && f.forOf(a, i, c[n], c), c
                    }, m.prototype = o, d.FW && (o.constructor = m)), j || r.forEach(function (a, b) {
                        q = 1 / b === -(1 / 0)
                    }), q && (k("delete"), k("has"), i && k("get")), (q || s !== r) && k(n, !0)
                } else m = h.getConstructor(b, i, n), d.mix(m.prototype, c);
                return a("./$.cof").set(m, b), a("./$.species")(m), p[b] = m, e(e.G + e.W + e.F * (m != l), p), j || f.std(m, b, h.getIterConstructor(), h.next, i ? "key+value" : "value", !i, !0), m
            }
        }, {
            "./$": 16,
            "./$.assert": 4,
            "./$.cof": 6,
            "./$.def": 11,
            "./$.iter": 15,
            "./$.iter-detect": 14,
            "./$.species": 22
        }],
        10: [function (a, b, c) {
            var d = a("./$.assert").fn;
            b.exports = function (a, b, c) {
                if (d(a), ~c && void 0 === b) return a;
                switch (c) {
                    case 1:
                        return function (c) {
                            return a.call(b, c)
                        };
                    case 2:
                        return function (c, d) {
                            return a.call(b, c, d)
                        };
                    case 3:
                        return function (c, d, e) {
                            return a.call(b, c, d, e)
                        }
                }
                return function () {
                    return a.apply(b, arguments)
                }
            }
        }, {
            "./$.assert": 4
        }],
        11: [function (a, b, c) {
            function d(a, b) {
                return function () {
                    return a.apply(b, arguments)
                }
            }

            function e(a, b, c) {
                var j, k, l, m, n = a & e.G,
                    o = n ? g : a & e.S ? g[b] : (g[b] || {}).prototype,
                    p = n ? h : h[b] || (h[b] = {});
                n && (c = b);
                for (j in c) k = !(a & e.F) && o && j in o, l = (k ? o : c)[j], m = a & e.B && k ? d(l, g) : a & e.P && i(l) ? d(Function.call, l) : l, o && !k && (n ? o[j] = l : delete o[j] && f.hide(o, j, l)), p[j] != l && f.hide(p, j, m)
            }
            var f = a("./$"),
                g = f.g,
                h = f.core,
                i = f.isFunction;
            g.core = h, e.F = 1, e.G = 2, e.S = 4, e.P = 8, e.B = 16, e.W = 32, b.exports = e
        }, {
            "./$": 16
        }],
        12: [function (a, b, c) {
            b.exports = function (a) {
                return a.FW = !0, a.path = a.g, a
            }
        }, {}],
        13: [function (a, b, c) {
            b.exports = function (a, b, c) {
                var d = void 0 === c;
                switch (b.length) {
                    case 0:
                        return d ? a() : a.call(c);
                    case 1:
                        return d ? a(b[0]) : a.call(c, b[0]);
                    case 2:
                        return d ? a(b[0], b[1]) : a.call(c, b[0], b[1]);
                    case 3:
                        return d ? a(b[0], b[1], b[2]) : a.call(c, b[0], b[1], b[2]);
                    case 4:
                        return d ? a(b[0], b[1], b[2], b[3]) : a.call(c, b[0], b[1], b[2], b[3]);
                    case 5:
                        return d ? a(b[0], b[1], b[2], b[3], b[4]) : a.call(c, b[0], b[1], b[2], b[3], b[4])
                }
                return a.apply(c, b)
            }
        }, {}],
        14: [function (a, b, c) {
            var d = a("./$.wks")("iterator"),
                e = !1;
            try {
                var f = [7][d]();
                f["return"] = function () {
                    e = !0
                }, Array.from(f, function () {
                    throw 2
                })
            } catch (g) { }
            b.exports = function (a) {
                if (!e) return !1;
                var b = !1;
                try {
                    var c = [7],
                        f = c[d]();
                    f.next = function () {
                        b = !0
                    }, c[d] = function () {
                        return f
                    }, a(c)
                } catch (g) { }
                return b
            }
        }, {
            "./$.wks": 27
        }],
        15: [function (a, b, c) {
            "use strict";

            function d(a, b) {
                i.hide(a, n, b), o in [] && i.hide(a, o, b)
            }

            function e(a, b, c, e) {
                var f = a.prototype,
                    g = f[n] || f[o] || e && f[e] || c;
                if (i.FW && d(f, g), g !== c) {
                    var h = i.getProto(g.call(new a));
                    k.set(h, b + " Iterator", !0), i.FW && i.has(f, o) && d(h, i.that)
                }
                return p[b] = g, p[b + " Iterator"] = i.that, g
            }

            function f(a) {
                var b = i.g.Symbol,
                    c = a[b && b.iterator || o],
                    d = c || a[n] || p[k.classof(a)];
                return m(d.call(a))
            }

            function g(a) {
                var b = a["return"];
                void 0 !== b && m(b.call(a))
            }

            function h(a, b, c, d) {
                try {
                    return d ? b(m(c)[0], c[1]) : b(c)
                } catch (e) {
                    throw g(a), e
                }
            }
            var i = a("./$"),
                j = a("./$.ctx"),
                k = a("./$.cof"),
                l = a("./$.def"),
                m = a("./$.assert").obj,
                n = a("./$.wks")("iterator"),
                o = "@@iterator",
                p = {},
                q = {},
                r = "keys" in [] && !("next" in [].keys());
            d(q, i.that);
            var s = b.exports = {
                BUGGY: r,
                Iterators: p,
                prototype: q,
                step: function (a, b) {
                    return {
                        value: b,
                        done: !!a
                    }
                },
                stepCall: h,
                close: g,
                is: function (a) {
                    var b = Object(a),
                        c = i.g.Symbol,
                        d = c && c.iterator || o;
                    return d in b || n in b || i.has(p, k.classof(b))
                },
                get: f,
                set: d,
                create: function (a, b, c, d) {
                    a.prototype = i.create(d || s.prototype, {
                        next: i.desc(1, c)
                    }), k.set(a, b + " Iterator")
                },
                define: e,
                std: function (a, b, c, d, f, g, h) {
                    function j(a) {
                        return function () {
                            return new c(this, a)
                        }
                    }
                    s.create(c, b, d);
                    var k, m, n = j("key+value"),
                        o = j("value"),
                        p = a.prototype;
                    if ("value" == f ? o = e(a, b, o, "values") : n = e(a, b, n, "entries"), f && (k = {
                        entries: n,
                        keys: g ? o : j("key"),
                        values: o
                    }, l(l.P + l.F * r, b, k), h))
                        for (m in k) m in p || i.hide(p, m, k[m])
                },
                forOf: function (a, b, c, d) {
                    for (var e, i = f(a), k = j(c, d, b ? 2 : 1); !(e = i.next()).done;)
                        if (h(i, k, e.value, b) === !1) return g(i)
                }
            }
        }, {
            "./$": 16,
            "./$.assert": 4,
            "./$.cof": 6,
            "./$.ctx": 10,
            "./$.def": 11,
            "./$.wks": 27
        }],
        16: [function (a, b, c) {
            "use strict";

            function d(a) {
                return isNaN(a = +a) ? 0 : (a > 0 ? p : o)(a)
            }

            function e(a, b) {
                return {
                    enumerable: !(1 & a),
                    configurable: !(2 & a),
                    writable: !(4 & a),
                    value: b
                }
            }

            function f(a, b, c) {
                return a[b] = c, a
            }

            function g(a) {
                return s ? function (b, c, d) {
                    return u.setDesc(b, c, e(a, d))
                } : f
            }

            function h(a) {
                return null !== a && ("object" == typeof a || "function" == typeof a)
            }

            function i(a) {
                return "function" == typeof a
            }

            function j(a) {
                if (void 0 == a) throw TypeError("Can't call method on  " + a);
                return a
            }
            var k = "undefined" != typeof self ? self : Function("return this")(),
                l = {},
                m = Object.defineProperty,
                n = {}.hasOwnProperty,
                o = Math.ceil,
                p = Math.floor,
                q = Math.max,
                r = Math.min,
                s = !! function () {
                    try {
                        return 2 == m({}, "a", {
                            get: function () {
                                return 2
                            }
                        }).a
                    } catch (a) { }
                }(),
                t = g(1),
                u = b.exports = a("./$.fw")({
                    g: k,
                    core: l,
                    html: k.document && document.documentElement,
                    isObject: h,
                    isFunction: i,
                    it: function (a) {
                        return a
                    },
                    that: function () {
                        return this
                    },
                    toInteger: d,
                    toLength: function (a) {
                        return a > 0 ? r(d(a), 9007199254740991) : 0
                    },
                    toIndex: function (a, b) {
                        return a = d(a), 0 > a ? q(a + b, 0) : r(a, b)
                    },
                    has: function (a, b) {
                        return n.call(a, b)
                    },
                    create: Object.create,
                    getProto: Object.getPrototypeOf,
                    DESC: s,
                    desc: e,
                    getDesc: Object.getOwnPropertyDescriptor,
                    setDesc: m,
                    getKeys: Object.keys,
                    getNames: Object.getOwnPropertyNames,
                    getSymbols: Object.getOwnPropertySymbols,
                    assertDefined: j,
                    ES5Object: Object,
                    toObject: function (a) {
                        return u.ES5Object(j(a))
                    },
                    hide: t,
                    def: g(0),
                    set: k.Symbol ? f : t,
                    mix: function (a, b) {
                        for (var c in b) t(a, c, b[c]);
                        return a
                    },
                    each: [].forEach
                });
            "undefined" != typeof __e && (__e = l), "undefined" != typeof __g && (__g = k)
        }, {
            "./$.fw": 12
        }],
        17: [function (a, b, c) {
            var d = a("./$");
            b.exports = function (a, b) {
                for (var c, e = d.toObject(a), f = d.getKeys(e), g = f.length, h = 0; g > h;)
                    if (e[c = f[h++]] === b) return c
            }
        }, {
            "./$": 16
        }],
        18: [function (a, b, c) {
            var d = a("./$"),
                e = a("./$.assert").obj;
            b.exports = function (a) {
                return e(a), d.getSymbols ? d.getNames(a).concat(d.getSymbols(a)) : d.getNames(a)
            }
        }, {
            "./$": 16,
            "./$.assert": 4
        }],
        19: [function (a, b, c) {
            "use strict";
            var d = a("./$"),
                e = a("./$.invoke"),
                f = a("./$.assert").fn;
            b.exports = function () {
                for (var a = f(this), b = arguments.length, c = Array(b), g = 0, h = d.path._, i = !1; b > g;)(c[g] = arguments[g++]) === h && (i = !0);
                return function () {
                    var d, f = this,
                        g = arguments.length,
                        j = 0,
                        k = 0;
                    if (!i && !g) return e(a, c, f);
                    if (d = c.slice(), i)
                        for (; b > j; j++) d[j] === h && (d[j] = arguments[k++]);
                    for (; g > k;) d.push(arguments[k++]);
                    return e(a, d, f)
                }
            }
        }, {
            "./$": 16,
            "./$.assert": 4,
            "./$.invoke": 13
        }],
        20: [function (a, b, c) {
            "use strict";
            b.exports = function (a, b, c) {
                var d = b === Object(b) ? function (a) {
                    return b[a]
                } : b;
                return function (b) {
                    return String(c ? b : this).replace(a, d)
                }
            }
        }, {}],
        21: [function (a, b, c) {
            function d(a, b) {
                f.obj(a), f(null === b || e.isObject(b), b, ": can't set as prototype!")
            }
            var e = a("./$"),
                f = a("./$.assert");
            b.exports = {
                set: Object.setPrototypeOf || ("__proto__" in {} ? function (b, c) {
                    try {
                        c = a("./$.ctx")(Function.call, e.getDesc(Object.prototype, "__proto__").set, 2), c({}, [])
                    } catch (f) {
                        b = !0
                    }
                    return function (a, e) {
                        return d(a, e), b ? a.__proto__ = e : c(a, e), a
                    }
                }() : void 0),
                check: d
            }
        }, {
            "./$": 16,
            "./$.assert": 4,
            "./$.ctx": 10
        }],
        22: [function (a, b, c) {
            var d = a("./$");
            b.exports = function (b) {
                d.DESC && d.FW && d.setDesc(b, a("./$.wks")("species"), {
                    configurable: !0,
                    get: d.that
                })
            }
        }, {
            "./$": 16,
            "./$.wks": 27
        }],
        23: [function (a, b, c) {
            "use strict";
            var d = a("./$");
            b.exports = function (a) {
                return function (b) {
                    var c, e, f = String(d.assertDefined(this)),
                        g = d.toInteger(b),
                        h = f.length;
                    return 0 > g || g >= h ? a ? "" : void 0 : (c = f.charCodeAt(g), 55296 > c || c > 56319 || g + 1 === h || (e = f.charCodeAt(g + 1)) < 56320 || e > 57343 ? a ? f.charAt(g) : c : a ? f.slice(g, g + 2) : (c - 55296 << 10) + (e - 56320) + 65536)
                }
            }
        }, {
            "./$": 16
        }],
        24: [function (a, b, c) {
            "use strict";

            function d() {
                var a = +this;
                if (i.has(x, a)) {
                    var b = x[a];
                    delete x[a], b()
                }
            }

            function e(a) {
                d.call(a.data)
            }
            var f, g, h, i = a("./$"),
                j = a("./$.ctx"),
                k = a("./$.cof"),
                l = a("./$.invoke"),
                m = i.g,
                n = i.isFunction,
                o = i.html,
                p = m.document,
                q = m.process,
                r = m.setImmediate,
                s = m.clearImmediate,
                t = m.postMessage,
                u = m.addEventListener,
                v = m.MessageChannel,
                w = 0,
                x = {},
                y = "onreadystatechange";
            n(r) && n(s) || (r = function (a) {
                for (var b = [], c = 1; arguments.length > c;) b.push(arguments[c++]);
                return x[++w] = function () {
                    l(n(a) ? a : Function(a), b)
                }, f(w), w
            }, s = function (a) {
                delete x[a]
            }, "process" == k(q) ? f = function (a) {
                q.nextTick(j(d, a, 1))
            } : u && n(t) && !m.importScripts ? (f = function (a) {
                t(a, "*")
            }, u("message", e, !1)) : n(v) ? (g = new v, h = g.port2, g.port1.onmessage = e, f = j(h.postMessage, h, 1)) : f = p && y in p.createElement("script") ? function (a) {
                o.appendChild(p.createElement("script"))[y] = function () {
                    o.removeChild(this), d.call(a)
                }
            } : function (a) {
                setTimeout(j(d, a, 1), 0)
            }), b.exports = {
                set: r,
                clear: s
            }
        }, {
            "./$": 16,
            "./$.cof": 6,
            "./$.ctx": 10,
            "./$.invoke": 13
        }],
        25: [function (a, b, c) {
            function d(a) {
                return "Symbol(" + a + ")_" + (++e + Math.random()).toString(36)
            }
            var e = 0;
            d.safe = a("./$").g.Symbol || d, b.exports = d
        }, {
            "./$": 16
        }],
        26: [function (a, b, c) {
            var d = a("./$"),
                e = a("./$.wks")("unscopables");
            !d.FW || e in [] || d.hide(Array.prototype, e, {}), b.exports = function (a) {
                d.FW && ([][e][a] = !0)
            }
        }, {
            "./$": 16,
            "./$.wks": 27
        }],
        27: [function (a, b, c) {
            var d = a("./$").g,
                e = {};
            b.exports = function (b) {
                return e[b] || (e[b] = d.Symbol && d.Symbol[b] || a("./$.uid").safe("Symbol." + b))
            }
        }, {
            "./$": 16,
            "./$.uid": 25
        }],
        28: [function (a, b, c) {
            function d(a, b) {
                return function (c) {
                    var d, e = B(c),
                        f = 0,
                        g = [];
                    for (d in e) d != o && x(e, d) && g.push(d);
                    for (; b > f;) x(e, d = a[f++]) && (~u.call(g, d) || g.push(d));
                    return g
                }
            }

            function e(a) {
                return !j.isObject(a)
            }

            function f() { }

            function g(a) {
                return function () {
                    return a.apply(j.ES5Object(this), arguments)
                }
            }

            function h(a) {
                return function (b, c) {
                    p.fn(b);
                    var d = B(this),
                        e = C(d.length),
                        f = a ? e - 1 : 0,
                        g = a ? -1 : 1;
                    if (arguments.length < 2)
                        for (; ;) {
                            if (f in d) {
                                c = d[f], f += g;
                                break
                            }
                            f += g, p(a ? f >= 0 : e > f, "Reduce of empty array with no initial value")
                        }
                    for (; a ? f >= 0 : e > f; f += g) f in d && (c = b(c, d[f], f, this));
                    return c
                }
            }

            function i(a) {
                return a > 9 ? a : "0" + a
            }
            var j = a("./$"),
                k = a("./$.cof"),
                l = a("./$.def"),
                m = a("./$.invoke"),
                n = a("./$.array-methods"),
                o = a("./$.uid").safe("__proto__"),
                p = a("./$.assert"),
                q = p.obj,
                r = Object.prototype,
                s = [],
                t = s.slice,
                u = s.indexOf,
                v = k.classof,
                w = Object.defineProperties,
                x = j.has,
                y = j.setDesc,
                z = j.getDesc,
                A = j.isFunction,
                B = j.toObject,
                C = j.toLength,
                D = !1;
            if (!j.DESC) {
                try {
                    D = 8 == y(document.createElement("div"), "x", {
                        get: function () {
                            return 8
                        }
                    }).x
                } catch (E) { }
                j.setDesc = function (a, b, c) {
                    if (D) try {
                        return y(a, b, c)
                    } catch (d) { }
                    if ("get" in c || "set" in c) throw TypeError("Accessors not supported!");
                    return "value" in c && (q(a)[b] = c.value), a
                }, j.getDesc = function (a, b) {
                    if (D) try {
                        return z(a, b)
                    } catch (c) { }
                    return x(a, b) ? j.desc(!r.propertyIsEnumerable.call(a, b), a[b]) : void 0
                }, w = function (a, b) {
                    q(a);
                    for (var c, d = j.getKeys(b), e = d.length, f = 0; e > f;) j.setDesc(a, c = d[f++], b[c]);
                    return a
                }
            }
            l(l.S + l.F * !j.DESC, "Object", {
                getOwnPropertyDescriptor: j.getDesc,
                defineProperty: j.setDesc,
                defineProperties: w
            });
            var F = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(","),
                G = F.concat("length", "prototype"),
                H = F.length,
                I = function () {
                    var a, b = document.createElement("iframe"),
                        c = H,
                        d = ">";
                    for (b.style.display = "none", j.html.appendChild(b), b.src = "javascript:", a = b.contentWindow.document, a.open(), a.write("<script>document.F=Object</script" + d), a.close(), I = a.F; c--;) delete I.prototype[F[c]];
                    return I()
                };
            l(l.S, "Object", {
                getPrototypeOf: j.getProto = j.getProto || function (a) {
                    return a = Object(p.def(a)), x(a, o) ? a[o] : A(a.constructor) && a instanceof a.constructor ? a.constructor.prototype : a instanceof Object ? r : null
                },
                getOwnPropertyNames: j.getNames = j.getNames || d(G, G.length, !0),
                create: j.create = j.create || function (a, b) {
                    var c;
                    return null !== a ? (f.prototype = q(a), c = new f, f.prototype = null, c[o] = a) : c = I(), void 0 === b ? c : w(c, b)
                },
                keys: j.getKeys = j.getKeys || d(F, H, !1),
                seal: j.it,
                freeze: j.it,
                preventExtensions: j.it,
                isSealed: e,
                isFrozen: e,
                isExtensible: j.isObject
            }), l(l.P, "Function", {
                bind: function (a) {
                    function b() {
                        var e = d.concat(t.call(arguments));
                        return m(c, e, this instanceof b ? j.create(c.prototype) : a)
                    }
                    var c = p.fn(this),
                        d = t.call(arguments, 1);
                    return c.prototype && (b.prototype = c.prototype), b
                }
            }), 0 in Object("z") && "z" == "z"[0] || (j.ES5Object = function (a) {
                return "String" == k(a) ? a.split("") : Object(a)
            }), l(l.P + l.F * (j.ES5Object != Object), "Array", {
                slice: g(t),
                join: g(s.join)
            }), l(l.S, "Array", {
                isArray: function (a) {
                    return "Array" == k(a)
                }
            }), l(l.P, "Array", {
                forEach: j.each = j.each || n(0),
                map: n(1),
                filter: n(2),
                some: n(3),
                every: n(4),
                reduce: h(!1),
                reduceRight: h(!0),
                indexOf: u = u || a("./$.array-includes")(!1),
                lastIndexOf: function (a, b) {
                    var c = B(this),
                        d = C(c.length),
                        e = d - 1;
                    for (arguments.length > 1 && (e = Math.min(e, j.toInteger(b))), 0 > e && (e = C(d + e)); e >= 0; e--)
                        if (e in c && c[e] === a) return e;
                    return -1
                }
            }), l(l.P, "String", {
                trim: a("./$.replacer")(/^\s*([\s\S]*\S)?\s*$/, "$1")
            }), l(l.S, "Date", {
                now: function () {
                    return +new Date
                }
            }), l(l.P, "Date", {
                toISOString: function () {
                    if (!isFinite(this)) throw RangeError("Invalid time value");
                    var a = this,
                        b = a.getUTCFullYear(),
                        c = a.getUTCMilliseconds(),
                        d = 0 > b ? "-" : b > 9999 ? "+" : "";
                    return d + ("00000" + Math.abs(b)).slice(d ? -6 : -4) + "-" + i(a.getUTCMonth() + 1) + "-" + i(a.getUTCDate()) + "T" + i(a.getUTCHours()) + ":" + i(a.getUTCMinutes()) + ":" + i(a.getUTCSeconds()) + "." + (c > 99 ? c : "0" + i(c)) + "Z"
                }
            }), "Object" == v(function () {
                return arguments
            }()) && (k.classof = function (a) {
                var b = v(a);
                return "Object" == b && A(a.callee) ? "Arguments" : b
            })
        }, {
            "./$": 16,
            "./$.array-includes": 2,
            "./$.array-methods": 3,
            "./$.assert": 4,
            "./$.cof": 6,
            "./$.def": 11,
            "./$.invoke": 13,
            "./$.replacer": 20,
            "./$.uid": 25
        }],
        29: [function (a, b, c) {
            "use strict";
            var d = a("./$"),
                e = a("./$.def"),
                f = d.toIndex;
            e(e.P, "Array", {
                copyWithin: function (a, b) {
                    var c = Object(d.assertDefined(this)),
                        e = d.toLength(c.length),
                        g = f(a, e),
                        h = f(b, e),
                        i = arguments[2],
                        j = void 0 === i ? e : f(i, e),
                        k = Math.min(j - h, e - g),
                        l = 1;
                    for (g > h && h + k > g && (l = -1, h = h + k - 1, g = g + k - 1); k-- > 0;) h in c ? c[g] = c[h] : delete c[g], g += l, h += l;
                    return c
                }
            }), a("./$.unscope")("copyWithin")
        }, {
            "./$": 16,
            "./$.def": 11,
            "./$.unscope": 26
        }],
        30: [function (a, b, c) {
            "use strict";
            var d = a("./$"),
                e = a("./$.def"),
                f = d.toIndex;
            e(e.P, "Array", {
                fill: function (a) {
                    for (var b = Object(d.assertDefined(this)), c = d.toLength(b.length), e = f(arguments[1], c), g = arguments[2], h = void 0 === g ? c : f(g, c); h > e;) b[e++] = a;
                    return b
                }
            }), a("./$.unscope")("fill")
        }, {
            "./$": 16,
            "./$.def": 11,
            "./$.unscope": 26
        }],
        31: [function (a, b, c) {
            var d = a("./$.def");
            d(d.P, "Array", {
                findIndex: a("./$.array-methods")(6)
            }), a("./$.unscope")("findIndex")
        }, {
            "./$.array-methods": 3,
            "./$.def": 11,
            "./$.unscope": 26
        }],
        32: [function (a, b, c) {
            var d = a("./$.def");
            d(d.P, "Array", {
                find: a("./$.array-methods")(5)
            }), a("./$.unscope")("find")
        }, {
            "./$.array-methods": 3,
            "./$.def": 11,
            "./$.unscope": 26
        }],
        33: [function (a, b, c) {
            var d = a("./$"),
                e = a("./$.ctx"),
                f = a("./$.def"),
                g = a("./$.iter"),
                h = g.stepCall;
            f(f.S + f.F * !a("./$.iter-detect")(function (a) {
                Array.from(a)
            }), "Array", {
                    from: function (a) {
                        var b, c, f, i, j = Object(d.assertDefined(a)),
                            k = arguments[1],
                            l = void 0 !== k,
                            m = l ? e(k, arguments[2], 2) : void 0,
                            n = 0;
                        if (g.is(j))
                            for (i = g.get(j), c = new ("function" == typeof this ? this : Array); !(f = i.next()).done; n++) c[n] = l ? h(i, m, [f.value, n], !0) : f.value;
                        else
                            for (c = new ("function" == typeof this ? this : Array)(b = d.toLength(j.length)); b > n; n++) c[n] = l ? m(j[n], n) : j[n];
                        return c.length = n, c
                    }
                })
        }, {
            "./$": 16,
            "./$.ctx": 10,
            "./$.def": 11,
            "./$.iter": 15,
            "./$.iter-detect": 14
        }],
        34: [function (a, b, c) {
            var d = a("./$"),
                e = a("./$.unscope"),
                f = a("./$.uid").safe("iter"),
                g = a("./$.iter"),
                h = g.step,
                i = g.Iterators;
            g.std(Array, "Array", function (a, b) {
                d.set(this, f, {
                    o: d.toObject(a),
                    i: 0,
                    k: b
                })
            }, function () {
                var a = this[f],
                    b = a.o,
                    c = a.k,
                    d = a.i++;
                return !b || d >= b.length ? (a.o = void 0, h(1)) : "key" == c ? h(0, d) : "value" == c ? h(0, b[d]) : h(0, [d, b[d]])
            }, "value"), i.Arguments = i.Array, e("keys"), e("values"), e("entries")
        }, {
            "./$": 16,
            "./$.iter": 15,
            "./$.uid": 25,
            "./$.unscope": 26
        }],
        35: [function (a, b, c) {
            var d = a("./$.def");
            d(d.S, "Array", {
                of: function () {
                    for (var a = 0, b = arguments.length, c = new ("function" == typeof this ? this : Array)(b); b > a;) c[a] = arguments[a++];
                    return c.length = b, c
                }
            })
        }, {
            "./$.def": 11
        }],
        36: [function (a, b, c) {
            a("./$.species")(Array)
        }, {
            "./$.species": 22
        }],
        37: [function (a, b, c) {
            "use strict";
            var d = a("./$"),
                e = "name",
                f = d.setDesc,
                g = Function.prototype;
            e in g || d.FW && d.DESC && f(g, e, {
                configurable: !0,
                get: function () {
                    var a = String(this).match(/^\s*function ([^ (]*)/),
                        b = a ? a[1] : "";
                    return d.has(this, e) || f(this, e, d.desc(5, b)), b
                },
                set: function (a) {
                    d.has(this, e) || f(this, e, d.desc(0, a))
                }
            })
        }, {
            "./$": 16
        }],
        38: [function (a, b, c) {
            "use strict";
            var d = a("./$.collection-strong");
            a("./$.collection")("Map", {
                get: function (a) {
                    var b = d.getEntry(this, a);
                    return b && b.v
                },
                set: function (a, b) {
                    return d.def(this, 0 === a ? 0 : a, b)
                }
            }, d, !0)
        }, {
            "./$.collection": 9,
            "./$.collection-strong": 7
        }],
        39: [function (a, b, c) {
            function d(a) {
                return a + 1 / r - 1 / r
            }

            function e(a) {
                return 0 == (a = +a) || a != a ? a : 0 > a ? -1 : 1
            }

            function f(a) {
                return isFinite(a = +a) && 0 != a ? 0 > a ? -f(-a) : n(a + o(a * a + 1)) : a
            }

            function g(a) {
                return 0 == (a = +a) ? a : a > -1e-6 && 1e-6 > a ? a + a * a / 2 : m(a) - 1
            }
            var h = 1 / 0,
                i = a("./$.def"),
                j = Math.E,
                k = Math.pow,
                l = Math.abs,
                m = Math.exp,
                n = Math.log,
                o = Math.sqrt,
                p = Math.ceil,
                q = Math.floor,
                r = k(2, -52),
                s = k(2, -23),
                t = k(2, 127) * (2 - s),
                u = k(2, -126);
            i(i.S, "Math", {
                acosh: function (a) {
                    return (a = +a) < 1 ? NaN : isFinite(a) ? n(a / j + o(a + 1) * o(a - 1) / j) + 1 : a
                },
                asinh: f,
                atanh: function (a) {
                    return 0 == (a = +a) ? a : n((1 + a) / (1 - a)) / 2
                },
                cbrt: function (a) {
                    return e(a = +a) * k(l(a), 1 / 3)
                },
                clz32: function (a) {
                    return (a >>>= 0) ? 31 - q(n(a + .5) * Math.LOG2E) : 32
                },
                cosh: function (a) {
                    return (m(a = +a) + m(-a)) / 2
                },
                expm1: g,
                fround: function (a) {
                    var b, c, f = l(a),
                        g = e(a);
                    return u > f ? g * d(f / u / s) * u * s : (b = (1 + s / r) * f, c = b - (b - f), c > t || c != c ? g * h : g * c)
                },
                hypot: function (a, b) {
                    for (var c, d = 0, e = arguments.length, f = e, g = Array(e), i = -h; e--;) {
                        if (c = g[e] = +arguments[e], c == h || c == -h) return h;
                        c > i && (i = c)
                    }
                    for (i = c || 1; f--;) d += k(g[f] / i, 2);
                    return i * o(d)
                },
                imul: function (a, b) {
                    var c = 65535,
                        d = +a,
                        e = +b,
                        f = c & d,
                        g = c & e;
                    return 0 | f * g + ((c & d >>> 16) * g + f * (c & e >>> 16) << 16 >>> 0)
                },
                log1p: function (a) {
                    return (a = +a) > -1e-8 && 1e-8 > a ? a - a * a / 2 : n(1 + a)
                },
                log10: function (a) {
                    return n(a) / Math.LN10
                },
                log2: function (a) {
                    return n(a) / Math.LN2
                },
                sign: e,
                sinh: function (a) {
                    return l(a = +a) < 1 ? (g(a) - g(-a)) / 2 : (m(a - 1) - m(-a - 1)) * (j / 2)
                },
                tanh: function (a) {
                    var b = g(a = +a),
                        c = g(-a);
                    return b == h ? 1 : c == h ? -1 : (b - c) / (m(a) + m(-a))
                },
                trunc: function (a) {
                    return (a > 0 ? q : p)(a)
                }
            })
        }, {
            "./$.def": 11
        }],
        40: [function (a, b, c) {
            "use strict";

            function d(a) {
                var b, c;
                if (h(b = a.valueOf) && !g(c = b.call(a))) return c;
                if (h(b = a.toString) && !g(c = b.call(a))) return c;
                throw TypeError("Can't convert object to number")
            }

            function e(a) {
                if (g(a) && (a = d(a)), "string" == typeof a && a.length > 2 && 48 == a.charCodeAt(0)) {
                    var b = !1;
                    switch (a.charCodeAt(1)) {
                        case 66:
                        case 98:
                            b = !0;
                        case 79:
                        case 111:
                            return parseInt(a.slice(2), b ? 2 : 8)
                    }
                }
                return +a
            }
            var f = a("./$"),
                g = f.isObject,
                h = f.isFunction,
                i = "Number",
                j = f.g[i],
                k = j,
                l = j.prototype;
            !f.FW || j("0o1") && j("0b1") || (j = function m(a) {
                return this instanceof m ? new k(e(a)) : e(a)
            }, f.each.call(f.DESC ? f.getNames(k) : "MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","), function (a) {
                f.has(k, a) && !f.has(j, a) && f.setDesc(j, a, f.getDesc(k, a))
            }), j.prototype = l, l.constructor = j, f.hide(f.g, i, j))
        }, {
            "./$": 16
        }],
        41: [function (a, b, c) {
            function d(a) {
                return !e.isObject(a) && i(a) && h(a) === a
            }
            var e = a("./$"),
                f = a("./$.def"),
                g = Math.abs,
                h = Math.floor,
                i = e.g.isFinite,
                j = 9007199254740991;
            f(f.S, "Number", {
                EPSILON: Math.pow(2, -52),
                isFinite: function (a) {
                    return "number" == typeof a && i(a)
                },
                isInteger: d,
                isNaN: function (a) {
                    return a != a
                },
                isSafeInteger: function (a) {
                    return d(a) && g(a) <= j
                },
                MAX_SAFE_INTEGER: j,
                MIN_SAFE_INTEGER: -j,
                parseFloat: parseFloat,
                parseInt: parseInt
            })
        }, {
            "./$": 16,
            "./$.def": 11
        }],
        42: [function (a, b, c) {
            var d = a("./$.def");
            d(d.S, "Object", {
                assign: a("./$.assign")
            })
        }, {
            "./$.assign": 5,
            "./$.def": 11
        }],
        43: [function (a, b, c) {
            var d = a("./$.def");
            d(d.S, "Object", {
                is: function (a, b) {
                    return a === b ? 0 !== a || 1 / a === 1 / b : a != a && b != b
                }
            })
        }, {
            "./$.def": 11
        }],
        44: [function (a, b, c) {
            var d = a("./$.def");
            d(d.S, "Object", {
                setPrototypeOf: a("./$.set-proto").set
            })
        }, {
            "./$.def": 11,
            "./$.set-proto": 21
        }],
        45: [function (a, b, c) {
            function d(a, b) {
                var c = (e.core.Object || {})[a] || Object[a],
                    d = 0,
                    i = {};
                i[a] = 1 == b ? function (a) {
                    return g(a) ? c(a) : a
                } : 2 == b ? function (a) {
                    return g(a) ? c(a) : !0
                } : 3 == b ? function (a) {
                    return g(a) ? c(a) : !1
                } : 4 == b ? function (a, b) {
                    return c(h(a), b)
                } : 5 == b ? function (a) {
                    return c(Object(e.assertDefined(a)))
                } : function (a) {
                    return c(h(a))
                };
                try {
                    c("z")
                } catch (j) {
                    d = 1
                }
                f(f.S + f.F * d, "Object", i)
            }
            var e = a("./$"),
                f = a("./$.def"),
                g = e.isObject,
                h = e.toObject;
            d("freeze", 1), d("seal", 1), d("preventExtensions", 1), d("isFrozen", 2), d("isSealed", 2), d("isExtensible", 3), d("getOwnPropertyDescriptor", 4), d("getPrototypeOf", 5), d("keys"), d("getOwnPropertyNames")
        }, {
            "./$": 16,
            "./$.def": 11
        }],
        46: [function (a, b, c) {
            "use strict";
            var d = a("./$"),
                e = a("./$.cof"),
                f = {};
            f[a("./$.wks")("toStringTag")] = "z", d.FW && "z" != e(f) && d.hide(Object.prototype, "toString", function () {
                return "[object " + e.classof(this) + "]"
            })
        }, {
            "./$": 16,
            "./$.cof": 6,
            "./$.wks": 27
        }],
        47: [function (a, b, c) {
            "use strict";

            function d(a) {
                var b = C(a)[q];
                return void 0 != b ? b : a
            }

            function e(a) {
                var b;
                return A(a) && (b = a.then), z(b) ? b : !1
            }

            function f(a) {
                var b, c = a[r],
                    d = c.c,
                    e = 0;
                if (c.h) return !1;
                for (; d.length > e;)
                    if (b = d[e++], b.fail || !f(b.P)) return !1;
                return !0
            }

            function g(a, b) {
                var c = a.c;
                (b || c.length) && w(function () {
                    var d = a.p,
                        g = a.v,
                        h = 1 == a.s,
                        i = 0;
                    if (b && f(d)) setTimeout(function () {
                        f(d) && ("process" == m(v) ? v.emit("unhandledRejection", g, d) : u.console && z(console.error) && console.error("Unhandled promise rejection", g))
                    }, 1e3);
                    else
                        for (; c.length > i;) ! function (b) {
                            var c, d, f = h ? b.ok : b.fail;
                            try {
                                f ? (h || (a.h = !0), c = f === !0 ? g : f(g), c === b.P ? b.rej(TypeError(t + "-chain cycle")) : (d = e(c)) ? d.call(c, b.res, b.rej) : b.res(c)) : b.rej(g)
                            } catch (i) {
                                b.rej(i)
                            }
                        }(c[i++]);
                    c.length = 0
                })
            }

            function h(a) {
                var b = this;
                b.d || (b.d = !0, b = b.r || b, b.v = a, b.s = 2, g(b, !0))
            }

            function i(a) {
                var b, c, d = this;
                if (!d.d) {
                    d.d = !0, d = d.r || d;
                    try {
                        (b = e(a)) ? (c = {
                            r: d,
                            d: !1
                        }, b.call(a, l(i, c, 1), l(h, c, 1))) : (d.v = a, d.s = 1, g(d))
                    } catch (f) {
                        h.call(c || {
                            r: d,
                            d: !1
                        }, f)
                    }
                }
            }
            var j, k = a("./$"),
                l = a("./$.ctx"),
                m = a("./$.cof"),
                n = a("./$.def"),
                o = a("./$.assert"),
                p = a("./$.iter"),
                q = a("./$.wks")("species"),
                r = a("./$.uid").safe("record"),
                s = p.forOf,
                t = "Promise",
                u = k.g,
                v = u.process,
                w = v && v.nextTick || a("./$.task").set,
                x = u[t],
                y = x,
                z = k.isFunction,
                A = k.isObject,
                B = o.fn,
                C = o.obj;
            z(x) && z(x.resolve) && x.resolve(j = new x(function () { })) == j || (x = function (a) {
                B(a);
                var b = {
                    p: o.inst(this, x, t),
                    c: [],
                    s: 0,
                    d: !1,
                    v: void 0,
                    h: !1
                };
                k.hide(this, r, b);
                try {
                    a(l(i, b, 1), l(h, b, 1))
                } catch (c) {
                    h.call(b, c)
                }
            }, k.mix(x.prototype, {
                then: function (a, b) {
                    var c = C(C(this).constructor)[q],
                        d = {
                            ok: z(a) ? a : !0,
                            fail: z(b) ? b : !1
                        },
                        e = d.P = new (void 0 != c ? c : x)(function (a, b) {
                            d.res = B(a), d.rej = B(b)
                        }),
                        f = this[r];
                    return f.c.push(d), f.s && g(f), e
                },
                "catch": function (a) {
                    return this.then(void 0, a)
                }
            })), n(n.G + n.W + n.F * (x != y), {
                Promise: x
            }), m.set(x, t), a("./$.species")(x), n(n.S, t, {
                reject: function (a) {
                    return new (d(this))(function (b, c) {
                        c(a)
                    })
                },
                resolve: function (a) {
                    return A(a) && r in a && k.getProto(a) === this.prototype ? a : new (d(this))(function (b) {
                        b(a)
                    })
                }
            }), n(n.S + n.F * !a("./$.iter-detect")(function (a) {
                x.all(a)["catch"](function () { })
            }), t, {
                    all: function (a) {
                        var b = d(this),
                            c = [];
                        return new b(function (d, e) {
                            s(a, !1, c.push, c);
                            var f = c.length,
                                g = Array(f);
                            f ? k.each.call(c, function (a, c) {
                                b.resolve(a).then(function (a) {
                                    g[c] = a, --f || d(g)
                                }, e)
                            }) : d(g)
                        })
                    },
                    race: function (a) {
                        var b = d(this);
                        return new b(function (c, d) {
                            s(a, !1, function (a) {
                                b.resolve(a).then(c, d)
                            })
                        })
                    }
                })
        }, {
            "./$": 16,
            "./$.assert": 4,
            "./$.cof": 6,
            "./$.ctx": 10,
            "./$.def": 11,
            "./$.iter": 15,
            "./$.iter-detect": 14,
            "./$.species": 22,
            "./$.task": 24,
            "./$.uid": 25,
            "./$.wks": 27
        }],
        48: [function (a, b, c) {
            function d(a) {
                var b, c = [];
                for (b in a) c.push(b);
                h.set(this, l, {
                    o: a,
                    a: c,
                    i: 0
                })
            }

            function e(a) {
                return function (b) {
                    t(b);
                    try {
                        return a.apply(void 0, arguments), !0
                    } catch (c) {
                        return !1
                    }
                }
            }

            function f(a, b) {
                var c, d = arguments.length < 3 ? a : arguments[2],
                    e = p(t(a), b);
                return e ? h.has(e, "value") ? e.value : void 0 === e.get ? void 0 : e.get.call(d) : o(c = r(a)) ? f(c, b, d) : void 0
            }

            function g(a, b, c) {
                var d, e, f = arguments.length < 4 ? a : arguments[3],
                    i = p(t(a), b);
                if (!i) {
                    if (o(e = r(a))) return g(e, b, c, f);
                    i = h.desc(0)
                }
                return h.has(i, "value") ? i.writable !== !1 && o(f) ? (d = p(f, b) || h.desc(0), d.value = c, q(f, b, d), !0) : !1 : void 0 === i.set ? !1 : (i.set.call(f, c), !0)
            }
            var h = a("./$"),
                i = a("./$.def"),
                j = a("./$.set-proto"),
                k = a("./$.iter"),
                l = a("./$.uid").safe("iter"),
                m = k.step,
                n = a("./$.assert"),
                o = h.isObject,
                p = h.getDesc,
                q = h.setDesc,
                r = h.getProto,
                s = Function.apply,
                t = n.obj,
                u = Object.isExtensible || h.it;
            k.create(d, "Object", function () {
                var a, b = this[l],
                    c = b.a;
                do
                    if (b.i >= c.length) return m(1); while (!((a = c[b.i++]) in b.o));
                return m(0, a)
            });
            var v = {
                apply: a("./$.ctx")(Function.call, s, 3),
                construct: function (a, b) {
                    var c = n.fn(arguments.length < 3 ? a : arguments[2]).prototype,
                        d = h.create(o(c) ? c : Object.prototype),
                        e = s.call(a, d, b);
                    return o(e) ? e : d
                },
                defineProperty: e(q),
                deleteProperty: function (a, b) {
                    var c = p(t(a), b);
                    return c && !c.configurable ? !1 : delete a[b]
                },
                enumerate: function (a) {
                    return new d(t(a))
                },
                get: f,
                getOwnPropertyDescriptor: function (a, b) {
                    return p(t(a), b)
                },
                getPrototypeOf: function (a) {
                    return r(t(a))
                },
                has: function (a, b) {
                    return b in a
                },
                isExtensible: function (a) {
                    return !!u(t(a))
                },
                ownKeys: a("./$.own-keys"),
                preventExtensions: e(Object.preventExtensions || h.it),
                set: g
            };
            j && (v.setPrototypeOf = function (a, b) {
                j.check(a, b);
                try {
                    return j.set(a, b), !0
                } catch (c) {
                    return !1
                }
            }), i(i.G, {
                Reflect: {}
            }), i(i.S, "Reflect", v)
        }, {
            "./$": 16,
            "./$.assert": 4,
            "./$.ctx": 10,
            "./$.def": 11,
            "./$.iter": 15,
            "./$.own-keys": 18,
            "./$.set-proto": 21,
            "./$.uid": 25
        }],
        49: [function (a, b, c) {
            var d = a("./$"),
                e = a("./$.cof"),
                f = d.g.RegExp,
                g = f,
                h = f.prototype;
            d.FW && d.DESC && (function () {
                try {
                    return "/a/i" == f(/a/g, "i")
                } catch (a) { }
            }() || (f = function (a, b) {
                return new g("RegExp" == e(a) && void 0 !== b ? a.source : a, b)
            }, d.each.call(d.getNames(g), function (a) {
                a in f || d.setDesc(f, a, {
                    configurable: !0,
                    get: function () {
                        return g[a]
                    },
                    set: function (b) {
                        g[a] = b
                    }
                })
            }), h.constructor = f, f.prototype = h, d.hide(d.g, "RegExp", f)), "g" != /./g.flags && d.setDesc(h, "flags", {
                configurable: !0,
                get: a("./$.replacer")(/^.*\/(\w*)$/, "$1")
            })), a("./$.species")(f)
        }, {
            "./$": 16,
            "./$.cof": 6,
            "./$.replacer": 20,
            "./$.species": 22
        }],
        50: [function (a, b, c) {
            "use strict";
            var d = a("./$.collection-strong");
            a("./$.collection")("Set", {
                add: function (a) {
                    return d.def(this, a = 0 === a ? 0 : a, a)
                }
            }, d)
        }, {
            "./$.collection": 9,
            "./$.collection-strong": 7
        }],
        51: [function (a, b, c) {
            var d = a("./$.def");
            d(d.P, "String", {
                codePointAt: a("./$.string-at")(!1)
            })
        }, {
            "./$.def": 11,
            "./$.string-at": 23
        }],
        52: [function (a, b, c) {
            "use strict";
            var d = a("./$"),
                e = a("./$.cof"),
                f = a("./$.def"),
                g = d.toLength;
            f(f.P, "String", {
                endsWith: function (a) {
                    if ("RegExp" == e(a)) throw TypeError();
                    var b = String(d.assertDefined(this)),
                        c = arguments[1],
                        f = g(b.length),
                        h = void 0 === c ? f : Math.min(g(c), f);
                    return a += "", b.slice(h - a.length, h) === a
                }
            })
        }, {
            "./$": 16,
            "./$.cof": 6,
            "./$.def": 11
        }],
        53: [function (a, b, c) {
            var d = a("./$.def"),
                e = a("./$").toIndex,
                f = String.fromCharCode;
            d(d.S, "String", {
                fromCodePoint: function (a) {
                    for (var b, c = [], d = arguments.length, g = 0; d > g;) {
                        if (b = +arguments[g++], e(b, 1114111) !== b) throw RangeError(b + " is not a valid code point");
                        c.push(65536 > b ? f(b) : f(((b -= 65536) >> 10) + 55296, b % 1024 + 56320))
                    }
                    return c.join("")
                }
            })
        }, {
            "./$": 16,
            "./$.def": 11
        }],
        54: [function (a, b, c) {
            "use strict";
            var d = a("./$"),
                e = a("./$.cof"),
                f = a("./$.def");
            f(f.P, "String", {
                includes: function (a) {
                    if ("RegExp" == e(a)) throw TypeError();
                    return !!~String(d.assertDefined(this)).indexOf(a, arguments[1])
                }
            })
        }, {
            "./$": 16,
            "./$.cof": 6,
            "./$.def": 11
        }],
        55: [function (a, b, c) {
            var d = a("./$").set,
                e = a("./$.string-at")(!0),
                f = a("./$.uid").safe("iter"),
                g = a("./$.iter"),
                h = g.step;
            g.std(String, "String", function (a) {
                d(this, f, {
                    o: String(a),
                    i: 0
                })
            }, function () {
                var a, b = this[f],
                    c = b.o,
                    d = b.i;
                return d >= c.length ? h(1) : (a = e.call(c, d), b.i += a.length, h(0, a))
            })
        }, {
            "./$": 16,
            "./$.iter": 15,
            "./$.string-at": 23,
            "./$.uid": 25
        }],
        56: [function (a, b, c) {
            var d = a("./$"),
                e = a("./$.def");
            e(e.S, "String", {
                raw: function (a) {
                    for (var b = d.toObject(a.raw), c = d.toLength(b.length), e = arguments.length, f = [], g = 0; c > g;) f.push(String(b[g++])), e > g && f.push(String(arguments[g]));
                    return f.join("")
                }
            })
        }, {
            "./$": 16,
            "./$.def": 11
        }],
        57: [function (a, b, c) {
            "use strict";
            var d = a("./$"),
                e = a("./$.def");
            e(e.P, "String", {
                repeat: function (a) {
                    var b = String(d.assertDefined(this)),
                        c = "",
                        e = d.toInteger(a);
                    if (0 > e || e == 1 / 0) throw RangeError("Count can't be negative");
                    for (; e > 0;
                        (e >>>= 1) && (b += b)) 1 & e && (c += b);
                    return c
                }
            })
        }, {
            "./$": 16,
            "./$.def": 11
        }],
        58: [function (a, b, c) {
            "use strict";
            var d = a("./$"),
                e = a("./$.cof"),
                f = a("./$.def");
            f(f.P, "String", {
                startsWith: function (a) {
                    if ("RegExp" == e(a)) throw TypeError();
                    var b = String(d.assertDefined(this)),
                        c = d.toLength(Math.min(arguments[1], b.length));
                    return a += "", b.slice(c, c + a.length) === a
                }
            })
        }, {
            "./$": 16,
            "./$.cof": 6,
            "./$.def": 11
        }],
        59: [function (a, b, c) {
            "use strict";

            function d(a) {
                var b = s[a] = e.set(e.create(n.prototype), q, a);
                return e.DESC && p && e.setDesc(Object.prototype, a, {
                    configurable: !0,
                    set: function (b) {
                        k(this, a, b)
                    }
                }), b
            }
            var e = a("./$"),
                f = a("./$.cof").set,
                g = a("./$.uid"),
                h = a("./$.def"),
                i = a("./$.keyof"),
                j = e.has,
                k = e.hide,
                l = e.getNames,
                m = e.toObject,
                n = e.g.Symbol,
                o = n,
                p = !1,
                q = g.safe("tag"),
                r = {},
                s = {};
            e.isFunction(n) || (n = function u(a) {
                if (this instanceof u) throw TypeError("Symbol is not a constructor");
                return d(g(a))
            }, k(n.prototype, "toString", function () {
                return this[q]
            })), h(h.G + h.W, {
                Symbol: n
            });
            var t = {
                "for": function (a) {
                    return j(r, a += "") ? r[a] : r[a] = n(a)
                },
                keyFor: function (a) {
                    return i(r, a)
                },
                pure: g.safe,
                set: e.set,
                useSetter: function () {
                    p = !0
                },
                useSimple: function () {
                    p = !1
                }
            };
            e.each.call("hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","), function (b) {
                var c = a("./$.wks")(b);
                t[b] = n === o ? c : d(c)
            }), p = !0, h(h.S, "Symbol", t), h(h.S + h.F * (n != o), "Object", {
                getOwnPropertyNames: function (a) {
                    for (var b, c = l(m(a)), d = [], e = 0; c.length > e;) j(s, b = c[e++]) || d.push(b);
                    return d
                },
                getOwnPropertySymbols: function (a) {
                    for (var b, c = l(m(a)), d = [], e = 0; c.length > e;) j(s, b = c[e++]) && d.push(s[b]);
                    return d
                }
            }), f(n, "Symbol"), f(Math, "Math", !0), f(e.g.JSON, "JSON", !0)
        }, {
            "./$": 16,
            "./$.cof": 6,
            "./$.def": 11,
            "./$.keyof": 17,
            "./$.uid": 25,
            "./$.wks": 27
        }],
        60: [function (a, b, c) {
            "use strict";
            var d = a("./$"),
                e = a("./$.collection-weak"),
                f = e.leakStore,
                g = e.ID,
                h = e.WEAK,
                i = d.has,
                j = d.isObject,
                k = Object.isFrozen || d.core.Object.isFrozen,
                l = {},
                m = a("./$.collection")("WeakMap", {
                    get: function (a) {
                        if (j(a)) {
                            if (k(a)) return f(this).get(a);
                            if (i(a, h)) return a[h][this[g]]
                        }
                    },
                    set: function (a, b) {
                        return e.def(this, a, b)
                    }
                }, e, !0, !0);
            d.FW && 7 != (new m).set((Object.freeze || Object)(l), 7).get(l) && d.each.call(["delete", "has", "get", "set"], function (a) {
                var b = m.prototype[a];
                m.prototype[a] = function (c, d) {
                    if (j(c) && k(c)) {
                        var e = f(this)[a](c, d);
                        return "set" == a ? this : e
                    }
                    return b.call(this, c, d)
                }
            })
        }, {
            "./$": 16,
            "./$.collection": 9,
            "./$.collection-weak": 8
        }],
        61: [function (a, b, c) {
            "use strict";
            var d = a("./$.collection-weak");
            a("./$.collection")("WeakSet", {
                add: function (a) {
                    return d.def(this, a, !0)
                }
            }, d, !1, !0)
        }, {
            "./$.collection": 9,
            "./$.collection-weak": 8
        }],
        62: [function (a, b, c) {
            var d = a("./$.def");
            d(d.P, "Array", {
                includes: a("./$.array-includes")(!0)
            }), a("./$.unscope")("includes")
        }, {
            "./$.array-includes": 2,
            "./$.def": 11,
            "./$.unscope": 26
        }],
        63: [function (a, b, c) {
            var d = a("./$"),
                e = a("./$.def"),
                f = a("./$.own-keys");
            e(e.S, "Object", {
                getOwnPropertyDescriptors: function (a) {
                    var b = d.toObject(a),
                        c = {};
                    return d.each.call(f(b), function (a) {
                        d.setDesc(c, a, d.desc(0, d.getDesc(b, a)))
                    }), c
                }
            })
        }, {
            "./$": 16,
            "./$.def": 11,
            "./$.own-keys": 18
        }],
        64: [function (a, b, c) {
            function d(a) {
                return function (b) {
                    var c, d = e.toObject(b),
                        f = e.getKeys(b),
                        g = f.length,
                        h = 0,
                        i = Array(g);
                    if (a)
                        for (; g > h;) i[h] = [c = f[h++], d[c]];
                    else
                        for (; g > h;) i[h] = d[f[h++]];
                    return i
                }
            }
            var e = a("./$"),
                f = a("./$.def");
            f(f.S, "Object", {
                values: d(!1),
                entries: d(!0)
            })
        }, {
            "./$": 16,
            "./$.def": 11
        }],
        65: [function (a, b, c) {
            var d = a("./$.def");
            d(d.S, "RegExp", {
                escape: a("./$.replacer")(/([\\\-[\]{}()*+?.,^$|])/g, "\\$1", !0)
            })
        }, {
            "./$.def": 11,
            "./$.replacer": 20
        }],
        66: [function (a, b, c) {
            var d = a("./$.def"),
                e = a("./$.iter").forOf;
            d(d.P, "Set", {
                toJSON: function () {
                    var a = [];
                    return e(this, !1, a.push, a), a
                }
            })
        }, {
            "./$.def": 11,
            "./$.iter": 15
        }],
        67: [function (a, b, c) {
            var d = a("./$.def");
            d(d.P, "String", {
                at: a("./$.string-at")(!0)
            })
        }, {
            "./$.def": 11,
            "./$.string-at": 23
        }],
        68: [function (a, b, c) {
            function d(b, c) {
                e.each.call(b.split(","), function (b) {
                    void 0 == c && b in g ? h[b] = g[b] : b in [] && (h[b] = a("./$.ctx")(Function.call, [][b], c))
                })
            }
            var e = a("./$"),
                f = a("./$.def"),
                g = e.core.Array || Array,
                h = {};
            d("pop,reverse,shift,keys,values,entries", 1), d("indexOf,every,some,forEach,map,filter,find,findIndex,includes", 3), d("join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill,turn"), f(f.S, "Array", h)
        }, {
            "./$": 16,
            "./$.ctx": 10,
            "./$.def": 11
        }],
        69: [function (a, b, c) {
            a("./es6.array.iterator");
            var d = a("./$"),
                e = a("./$.iter").Iterators,
                f = a("./$.wks")("iterator"),
                g = d.g.NodeList;
            !d.FW || !g || f in g.prototype || d.hide(g.prototype, f, e.Array), e.NodeList = e.Array
        }, {
            "./$": 16,
            "./$.iter": 15,
            "./$.wks": 27,
            "./es6.array.iterator": 34
        }],
        70: [function (a, b, c) {
            var d = a("./$.def"),
                e = a("./$.task");
            d(d.G + d.B, {
                setImmediate: e.set,
                clearImmediate: e.clear
            })
        }, {
            "./$.def": 11,
            "./$.task": 24
        }],
        71: [function (a, b, c) {
            function d(a) {
                return i ? function (b, c) {
                    return a(g(h, [].slice.call(arguments, 2), e.isFunction(b) ? b : Function(b)), c)
                } : a
            }
            var e = a("./$"),
                f = a("./$.def"),
                g = a("./$.invoke"),
                h = a("./$.partial"),
                i = !!e.g.navigator && /MSIE .\./.test(navigator.userAgent);
            f(f.G + f.B + f.F * i, {
                setTimeout: d(e.g.setTimeout),
                setInterval: d(e.g.setInterval)
            })
        }, {
            "./$": 16,
            "./$.def": 11,
            "./$.invoke": 13,
            "./$.partial": 19
        }],
        72: [function (a, b, c) {
            a("./modules/es5"), a("./modules/es6.symbol"), a("./modules/es6.object.assign"), a("./modules/es6.object.is"), a("./modules/es6.object.set-prototype-of"), a("./modules/es6.object.to-string"), a("./modules/es6.object.statics-accept-primitives"), a("./modules/es6.function.name"), a("./modules/es6.number.constructor"), a("./modules/es6.number.statics"), a("./modules/es6.math"), a("./modules/es6.string.from-code-point"), a("./modules/es6.string.raw"), a("./modules/es6.string.iterator"), a("./modules/es6.string.code-point-at"), a("./modules/es6.string.ends-with"), a("./modules/es6.string.includes"), a("./modules/es6.string.repeat"), a("./modules/es6.string.starts-with"), a("./modules/es6.array.from"), a("./modules/es6.array.of"), a("./modules/es6.array.iterator"), a("./modules/es6.array.species"), a("./modules/es6.array.copy-within"), a("./modules/es6.array.fill"), a("./modules/es6.array.find"), a("./modules/es6.array.find-index"), a("./modules/es6.regexp"), a("./modules/es6.promise"), a("./modules/es6.map"), a("./modules/es6.set"), a("./modules/es6.weak-map"), a("./modules/es6.weak-set"), a("./modules/es6.reflect"), a("./modules/es7.array.includes"), a("./modules/es7.string.at"), a("./modules/es7.regexp.escape"), a("./modules/es7.object.get-own-property-descriptors"), a("./modules/es7.object.to-array"), a("./modules/es7.set.to-json"), a("./modules/js.array.statics"), a("./modules/web.timers"), a("./modules/web.immediate"), a("./modules/web.dom.iterable"), b.exports = a("./modules/$").core
        }, {
            "./modules/$": 16,
            "./modules/es5": 28,
            "./modules/es6.array.copy-within": 29,
            "./modules/es6.array.fill": 30,
            "./modules/es6.array.find": 32,
            "./modules/es6.array.find-index": 31,
            "./modules/es6.array.from": 33,
            "./modules/es6.array.iterator": 34,
            "./modules/es6.array.of": 35,
            "./modules/es6.array.species": 36,
            "./modules/es6.function.name": 37,
            "./modules/es6.map": 38,
            "./modules/es6.math": 39,
            "./modules/es6.number.constructor": 40,
            "./modules/es6.number.statics": 41,
            "./modules/es6.object.assign": 42,
            "./modules/es6.object.is": 43,
            "./modules/es6.object.set-prototype-of": 44,
            "./modules/es6.object.statics-accept-primitives": 45,
            "./modules/es6.object.to-string": 46,
            "./modules/es6.promise": 47,
            "./modules/es6.reflect": 48,
            "./modules/es6.regexp": 49,
            "./modules/es6.set": 50,
            "./modules/es6.string.code-point-at": 51,
            "./modules/es6.string.ends-with": 52,
            "./modules/es6.string.from-code-point": 53,
            "./modules/es6.string.includes": 54,
            "./modules/es6.string.iterator": 55,
            "./modules/es6.string.raw": 56,
            "./modules/es6.string.repeat": 57,
            "./modules/es6.string.starts-with": 58,
            "./modules/es6.symbol": 59,
            "./modules/es6.weak-map": 60,
            "./modules/es6.weak-set": 61,
            "./modules/es7.array.includes": 62,
            "./modules/es7.object.get-own-property-descriptors": 63,
            "./modules/es7.object.to-array": 64,
            "./modules/es7.regexp.escape": 65,
            "./modules/es7.set.to-json": 66,
            "./modules/es7.string.at": 67,
            "./modules/js.array.statics": 68,
            "./modules/web.dom.iterable": 69,
            "./modules/web.immediate": 70,
            "./modules/web.timers": 71
        }],
        73: [function (a, b, c) {
            (function (a) {
                ! function (a) {
                    "use strict";

                    function c(a, b, c, d) {
                        var f = Object.create((b || e).prototype);
                        return f._invoke = h(a, c || null, new l(d || [])), f
                    }

                    function d(a, b, c) {
                        try {
                            return {
                                type: "normal",
                                arg: a.call(b, c)
                            }
                        } catch (d) {
                            return {
                                type: "throw",
                                arg: d
                            }
                        }
                    }

                    function e() { }

                    function f() { }

                    function g() { }

                    function h(a, b, c) {
                        var e = t;
                        return function (f, g) {
                            if (e === v) throw new Error("Generator is already running");
                            if (e === w) return n();
                            for (; ;) {
                                var h = c.delegate;
                                if (h) {
                                    if ("return" === f || "throw" === f && h.iterator["throw"] === o) {
                                        c.delegate = null;
                                        var i = h.iterator["return"];
                                        if (i) {
                                            var j = d(i, h.iterator, g);
                                            if ("throw" === j.type) {
                                                f = "throw", g = j.arg;
                                                continue
                                            }
                                        }
                                        if ("return" === f) continue
                                    }
                                    var j = d(h.iterator[f], h.iterator, g);
                                    if ("throw" === j.type) {
                                        c.delegate = null, f = "throw", g = j.arg;
                                        continue
                                    }
                                    f = "next", g = o;
                                    var k = j.arg;
                                    if (!k.done) return e = u, k;
                                    c[h.resultName] = k.value, c.next = h.nextLoc, c.delegate = null
                                }
                                if ("next" === f) e === u ? c.sent = g : delete c.sent;
                                else if ("throw" === f) {
                                    if (e === t) throw e = w, g;
                                    c.dispatchException(g) && (f = "next", g = o)
                                } else "return" === f && c.abrupt("return", g);
                                e = v;
                                var j = d(a, b, c);
                                if ("normal" === j.type) {
                                    e = c.done ? w : u;
                                    var k = {
                                        value: j.arg,
                                        done: c.done
                                    };
                                    if (j.arg !== x) return k;
                                    c.delegate && "next" === f && (g = o)
                                } else "throw" === j.type && (e = w, f = "throw", g = j.arg)
                            }
                        }
                    }

                    function i(a) {
                        y[a] = function (b) {
                            return this._invoke(a, b)
                        }
                    }

                    function j(a) {
                        var b = {
                            tryLoc: a[0]
                        };
                        1 in a && (b.catchLoc = a[1]), 2 in a && (b.finallyLoc = a[2], b.afterLoc = a[3]), this.tryEntries.push(b)
                    }

                    function k(a) {
                        var b = a.completion || {};
                        b.type = "normal", delete b.arg, a.completion = b
                    }

                    function l(a) {
                        this.tryEntries = [{
                            tryLoc: "root"
                        }], a.forEach(j, this), this.reset()
                    }

                    function m(a) {
                        if (a) {
                            var b = a[q];
                            if (b) return b.call(a);
                            if ("function" == typeof a.next) return a;
                            if (!isNaN(a.length)) {
                                var c = -1,
                                    d = function e() {
                                        for (; ++c < a.length;)
                                            if (p.call(a, c)) return e.value = a[c], e.done = !1, e;
                                        return e.value = o, e.done = !0, e
                                    };
                                return d.next = d
                            }
                        }
                        return {
                            next: n
                        }
                    }

                    function n() {
                        return {
                            value: o,
                            done: !0
                        }
                    }
                    var o, p = Object.prototype.hasOwnProperty,
                        q = "function" == typeof Symbol && Symbol.iterator || "@@iterator",
                        r = "object" == typeof b,
                        s = a.regeneratorRuntime;
                    if (s) return void (r && (b.exports = s));
                    s = a.regeneratorRuntime = r ? b.exports : {}, s.wrap = c;
                    var t = "suspendedStart",
                        u = "suspendedYield",
                        v = "executing",
                        w = "completed",
                        x = {},
                        y = g.prototype = e.prototype;
                    f.prototype = y.constructor = g, g.constructor = f, f.displayName = "GeneratorFunction", s.isGeneratorFunction = function (a) {
                        var b = "function" == typeof a && a.constructor;
                        return b ? b === f || "GeneratorFunction" === (b.displayName || b.name) : !1
                    }, s.mark = function (a) {
                        return a.__proto__ = g, a.prototype = Object.create(y), a
                    }, s.async = function (a, b, e, f) {
                        return new Promise(function (g, h) {
                            function i(a, b) {
                                var c = d(j[a], j, b);
                                if ("throw" === c.type) return void h(c.arg);
                                var e = c.arg;
                                e.done ? g(e.value) : Promise.resolve(e.value).then(k, l)
                            }
                            var j = c(a, b, e, f),
                                k = i.bind(j, "next"),
                                l = i.bind(j, "throw");
                            k()
                        })
                    }, i("next"), i("throw"), i("return"), y[q] = function () {
                        return this
                    }, y.toString = function () {
                        return "[object Generator]"
                    }, s.keys = function (a) {
                        var b = [];
                        for (var c in a) b.push(c);
                        return b.reverse(),
                            function d() {
                                for (; b.length;) {
                                    var c = b.pop();
                                    if (c in a) return d.value = c, d.done = !1, d
                                }
                                return d.done = !0, d
                            }
                    }, s.values = m, l.prototype = {
                        constructor: l,
                        reset: function () {
                            this.prev = 0, this.next = 0, this.sent = o, this.done = !1, this.delegate = null, this.tryEntries.forEach(k);
                            for (var a, b = 0; p.call(this, a = "t" + b) || 20 > b; ++b) this[a] = null
                        },
                        stop: function () {
                            this.done = !0;
                            var a = this.tryEntries[0],
                                b = a.completion;
                            if ("throw" === b.type) throw b.arg;
                            return this.rval
                        },
                        dispatchException: function (a) {
                            function b(b, d) {
                                return f.type = "throw", f.arg = a, c.next = b, !!d
                            }
                            if (this.done) throw a;
                            for (var c = this, d = this.tryEntries.length - 1; d >= 0; --d) {
                                var e = this.tryEntries[d],
                                    f = e.completion;
                                if ("root" === e.tryLoc) return b("end");
                                if (e.tryLoc <= this.prev) {
                                    var g = p.call(e, "catchLoc"),
                                        h = p.call(e, "finallyLoc");
                                    if (g && h) {
                                        if (this.prev < e.catchLoc) return b(e.catchLoc, !0);
                                        if (this.prev < e.finallyLoc) return b(e.finallyLoc)
                                    } else if (g) {
                                        if (this.prev < e.catchLoc) return b(e.catchLoc, !0)
                                    } else {
                                        if (!h) throw new Error("try statement without catch or finally");
                                        if (this.prev < e.finallyLoc) return b(e.finallyLoc)
                                    }
                                }
                            }
                        },
                        abrupt: function (a, b) {
                            for (var c = this.tryEntries.length - 1; c >= 0; --c) {
                                var d = this.tryEntries[c];
                                if (d.tryLoc <= this.prev && p.call(d, "finallyLoc") && this.prev < d.finallyLoc) {
                                    var e = d;
                                    break
                                }
                            }
                            e && ("break" === a || "continue" === a) && e.tryLoc <= b && b < e.finallyLoc && (e = null);
                            var f = e ? e.completion : {};
                            return f.type = a, f.arg = b, e ? this.next = e.finallyLoc : this.complete(f), x
                        },
                        complete: function (a, b) {
                            if ("throw" === a.type) throw a.arg;
                            return "break" === a.type || "continue" === a.type ? this.next = a.arg : "return" === a.type ? (this.rval = a.arg, this.next = "end") : "normal" === a.type && b && (this.next = b), x
                        },
                        finish: function (a) {
                            for (var b = this.tryEntries.length - 1; b >= 0; --b) {
                                var c = this.tryEntries[b];
                                if (c.finallyLoc === a) return this.complete(c.completion, c.afterLoc)
                            }
                        },
                        "catch": function (a) {
                            for (var b = this.tryEntries.length - 1; b >= 0; --b) {
                                var c = this.tryEntries[b];
                                if (c.tryLoc === a) {
                                    var d = c.completion;
                                    if ("throw" === d.type) {
                                        var e = d.arg;
                                        k(c)
                                    }
                                    return e
                                }
                            }
                            throw new Error("illegal catch attempt")
                        },
                        delegateYield: function (a, b, c) {
                            return this.delegate = {
                                iterator: m(a),
                                resultName: b,
                                nextLoc: c
                            }, x
                        }
                    }
                }("object" == typeof a ? a : "object" == typeof window ? window : "object" == typeof self ? self : this)
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {}]
    }, {}, [1]),
    function (a) {
        if ("object" == typeof exports && "undefined" != typeof module) module.exports = a();
        else if ("function" == typeof define && define.amd) define([], a);
        else {
            var b;
            b = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, b.localforage = a()
        }
    }(function () {
        return function a(b, c, d) {
            function e(g, h) {
                if (!c[g]) {
                    if (!b[g]) {
                        var i = "function" == typeof require && require;
                        if (!h && i) return i(g, !0);
                        if (f) return f(g, !0);
                        var j = new Error("Cannot find module '" + g + "'");
                        throw j.code = "MODULE_NOT_FOUND", j
                    }
                    var k = c[g] = {
                        exports: {}
                    };
                    b[g][0].call(k.exports, function (a) {
                        var c = b[g][1][a];
                        return e(c ? c : a)
                    }, k, k.exports, a, b, c, d)
                }
                return c[g].exports
            }
            for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
            return e
        }({
            1: [function (a, b, c) {
                (function (a) {
                    "use strict";

                    function c() {
                        k = !0;
                        for (var a, b, c = l.length; c;) {
                            for (b = l, l = [], a = -1; ++a < c;) b[a]();
                            c = l.length
                        }
                        k = !1
                    }

                    function d(a) {
                        1 !== l.push(a) || k || e()
                    }
                    var e, f = a.MutationObserver || a.WebKitMutationObserver;
                    if (f) {
                        var g = 0,
                            h = new f(c),
                            i = a.document.createTextNode("");
                        h.observe(i, {
                            characterData: !0
                        }), e = function () {
                            i.data = g = ++g % 2
                        }
                    } else if (a.setImmediate || "undefined" == typeof a.MessageChannel) e = "document" in a && "onreadystatechange" in a.document.createElement("script") ? function () {
                        var b = a.document.createElement("script");
                        b.onreadystatechange = function () {
                            c(), b.onreadystatechange = null, b.parentNode.removeChild(b), b = null
                        }, a.document.documentElement.appendChild(b)
                    } : function () {
                        setTimeout(c, 0)
                    };
                    else {
                        var j = new a.MessageChannel;
                        j.port1.onmessage = c, e = function () {
                            j.port2.postMessage(0)
                        }
                    }
                    var k, l = [];
                    b.exports = d
                }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
            }, {}],
            2: [function (a, b, c) {
                "use strict";

                function d() { }

                function e(a) {
                    if ("function" != typeof a) throw new TypeError("resolver must be a function");
                    this.state = s, this.queue = [], this.outcome = void 0, a !== d && i(this, a)
                }

                function f(a, b, c) {
                    this.promise = a, "function" == typeof b && (this.onFulfilled = b, this.callFulfilled = this.otherCallFulfilled), "function" == typeof c && (this.onRejected = c, this.callRejected = this.otherCallRejected)
                }

                function g(a, b, c) {
                    o(function () {
                        var d;
                        try {
                            d = b(c)
                        } catch (e) {
                            return p.reject(a, e)
                        }
                        d === a ? p.reject(a, new TypeError("Cannot resolve promise with itself")) : p.resolve(a, d)
                    })
                }

                function h(a) {
                    var b = a && a.then;
                    return a && "object" == typeof a && "function" == typeof b ? function () {
                        b.apply(a, arguments)
                    } : void 0
                }

                function i(a, b) {
                    function c(b) {
                        f || (f = !0, p.reject(a, b))
                    }

                    function d(b) {
                        f || (f = !0, p.resolve(a, b))
                    }

                    function e() {
                        b(d, c)
                    }
                    var f = !1,
                        g = j(e);
                    "error" === g.status && c(g.value)
                }

                function j(a, b) {
                    var c = {};
                    try {
                        c.value = a(b), c.status = "success"
                    } catch (d) {
                        c.status = "error", c.value = d
                    }
                    return c
                }

                function k(a) {
                    return a instanceof this ? a : p.resolve(new this(d), a)
                }

                function l(a) {
                    var b = new this(d);
                    return p.reject(b, a)
                }

                function m(a) {
                    function b(a, b) {
                        function d(a) {
                            g[b] = a, ++h !== e || f || (f = !0, p.resolve(j, g))
                        }
                        c.resolve(a).then(d, function (a) {
                            f || (f = !0, p.reject(j, a))
                        })
                    }
                    var c = this;
                    if ("[object Array]" !== Object.prototype.toString.call(a)) return this.reject(new TypeError("must be an array"));
                    var e = a.length,
                        f = !1;
                    if (!e) return this.resolve([]);
                    for (var g = new Array(e), h = 0, i = -1, j = new this(d); ++i < e;) b(a[i], i);
                    return j
                }

                function n(a) {
                    function b(a) {
                        c.resolve(a).then(function (a) {
                            f || (f = !0, p.resolve(h, a))
                        }, function (a) {
                            f || (f = !0, p.reject(h, a))
                        })
                    }
                    var c = this;
                    if ("[object Array]" !== Object.prototype.toString.call(a)) return this.reject(new TypeError("must be an array"));
                    var e = a.length,
                        f = !1;
                    if (!e) return this.resolve([]);
                    for (var g = -1, h = new this(d); ++g < e;) b(a[g]);
                    return h
                }
                var o = a(1),
                    p = {},
                    q = ["REJECTED"],
                    r = ["FULFILLED"],
                    s = ["PENDING"];
                b.exports = c = e, e.prototype["catch"] = function (a) {
                    return this.then(null, a)
                }, e.prototype.then = function (a, b) {
                    if ("function" != typeof a && this.state === r || "function" != typeof b && this.state === q) return this;
                    var c = new this.constructor(d);
                    if (this.state !== s) {
                        var e = this.state === r ? a : b;
                        g(c, e, this.outcome)
                    } else this.queue.push(new f(c, a, b));
                    return c
                }, f.prototype.callFulfilled = function (a) {
                    p.resolve(this.promise, a)
                }, f.prototype.otherCallFulfilled = function (a) {
                    g(this.promise, this.onFulfilled, a)
                }, f.prototype.callRejected = function (a) {
                    p.reject(this.promise, a)
                }, f.prototype.otherCallRejected = function (a) {
                    g(this.promise, this.onRejected, a)
                }, p.resolve = function (a, b) {
                    var c = j(h, b);
                    if ("error" === c.status) return p.reject(a, c.value);
                    var d = c.value;
                    if (d) i(a, d);
                    else {
                        a.state = r, a.outcome = b;
                        for (var e = -1, f = a.queue.length; ++e < f;) a.queue[e].callFulfilled(b)
                    }
                    return a
                }, p.reject = function (a, b) {
                    a.state = q, a.outcome = b;
                    for (var c = -1, d = a.queue.length; ++c < d;) a.queue[c].callRejected(b);
                    return a
                }, c.resolve = k, c.reject = l, c.all = m, c.race = n
            }, {
                1: 1
            }],
            3: [function (a, b, c) {
                (function (b) {
                    "use strict";
                    "function" != typeof b.Promise && (b.Promise = a(2))
                }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
            }, {
                2: 2
            }],
            4: [function (a, b, c) {
                "use strict";

                function d(a, b) {
                    if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
                }

                function e() {
                    try {
                        if ("undefined" != typeof indexedDB) return indexedDB;
                        if ("undefined" != typeof webkitIndexedDB) return webkitIndexedDB;
                        if ("undefined" != typeof mozIndexedDB) return mozIndexedDB;
                        if ("undefined" != typeof OIndexedDB) return OIndexedDB;
                        if ("undefined" != typeof msIndexedDB) return msIndexedDB
                    } catch (a) { }
                }

                function f() {
                    try {
                        if (!ga) return !1;
                        var a = "undefined" != typeof openDatabase && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform),
                            b = "function" == typeof fetch && -1 !== fetch.toString().indexOf("[native code");
                        return (!a || b) && "undefined" != typeof indexedDB && "undefined" != typeof IDBKeyRange
                    } catch (c) {
                        return !1
                    }
                }

                function g() {
                    return "function" == typeof openDatabase
                }

                function h() {
                    try {
                        return "undefined" != typeof localStorage && "setItem" in localStorage && localStorage.setItem
                    } catch (a) {
                        return !1
                    }
                }

                function i(a, b) {
                    a = a || [], b = b || {};
                    try {
                        return new Blob(a, b)
                    } catch (c) {
                        if ("TypeError" !== c.name) throw c;
                        for (var d = "undefined" != typeof BlobBuilder ? BlobBuilder : "undefined" != typeof MSBlobBuilder ? MSBlobBuilder : "undefined" != typeof MozBlobBuilder ? MozBlobBuilder : WebKitBlobBuilder, e = new d, f = 0; f < a.length; f += 1) e.append(a[f]);
                        return e.getBlob(b.type)
                    }
                }

                function j(a, b) {
                    b && a.then(function (a) {
                        b(null, a)
                    }, function (a) {
                        b(a)
                    })
                }

                function k(a, b, c) {
                    "function" == typeof b && a.then(b), "function" == typeof c && a["catch"](c)
                }

                function l(a) {
                    for (var b = a.length, c = new ArrayBuffer(b), d = new Uint8Array(c), e = 0; b > e; e++) d[e] = a.charCodeAt(e);
                    return c
                }

                function m(a) {
                    return new ja(function (b) {
                        var c = a.transaction(ka, "readwrite"),
                            d = i([""]);
                        c.objectStore(ka).put(d, "key"), c.onabort = function (a) {
                            a.preventDefault(), a.stopPropagation(), b(!1)
                        }, c.oncomplete = function () {
                            var a = navigator.userAgent.match(/Chrome\/(\d+)/),
                                c = navigator.userAgent.match(/Edge\//);
                            b(c || !a || parseInt(a[1], 10) >= 43)
                        }
                    })["catch"](function () {
                        return !1
                    })
                }

                function n(a) {
                    return "boolean" == typeof ha ? ja.resolve(ha) : m(a).then(function (a) {
                        return ha = a
                    })
                }

                function o(a) {
                    var b = ia[a.name],
                        c = {};
                    c.promise = new ja(function (a) {
                        c.resolve = a
                    }), b.deferredOperations.push(c), b.dbReady ? b.dbReady = b.dbReady.then(function () {
                        return c.promise
                    }) : b.dbReady = c.promise
                }

                function p(a) {
                    var b = ia[a.name],
                        c = b.deferredOperations.pop();
                    c && c.resolve()
                }

                function q(a, b) {
                    return new ja(function (c, d) {
                        if (a.db) {
                            if (!b) return c(a.db);
                            o(a), a.db.close()
                        }
                        var e = [a.name];
                        b && e.push(a.version);
                        var f = ga.open.apply(ga, e);
                        b && (f.onupgradeneeded = function (b) {
                            var c = f.result;
                            try {
                                c.createObjectStore(a.storeName), b.oldVersion <= 1 && c.createObjectStore(ka)
                            } catch (d) {
                                if ("ConstraintError" !== d.name) throw d;
                                console.warn('The database "' + a.name + '" has been upgraded from version ' + b.oldVersion + " to version " + b.newVersion + ', but the storage "' + a.storeName + '" already exists.')
                            }
                        }), f.onerror = function (a) {
                            a.preventDefault(), d(f.error)
                        }, f.onsuccess = function () {
                            c(f.result), p(a)
                        }
                    })
                }

                function r(a) {
                    return q(a, !1)
                }

                function s(a) {
                    return q(a, !0)
                }

                function t(a, b) {
                    if (!a.db) return !0;
                    var c = !a.db.objectStoreNames.contains(a.storeName),
                        d = a.version < a.db.version,
                        e = a.version > a.db.version;
                    if (d && (a.version !== b && console.warn('The database "' + a.name + "\" can't be downgraded from version " + a.db.version + " to version " + a.version + "."), a.version = a.db.version), e || c) {
                        if (c) {
                            var f = a.db.version + 1;
                            f > a.version && (a.version = f)
                        }
                        return !0
                    }
                    return !1
                }

                function u(a) {
                    return new ja(function (b, c) {
                        var d = new FileReader;
                        d.onerror = c, d.onloadend = function (c) {
                            var d = btoa(c.target.result || "");
                            b({
                                __local_forage_encoded_blob: !0,
                                data: d,
                                type: a.type
                            })
                        }, d.readAsBinaryString(a)
                    })
                }

                function v(a) {
                    var b = l(atob(a.data));
                    return i([b], {
                        type: a.type
                    })
                }

                function w(a) {
                    return a && a.__local_forage_encoded_blob
                }

                function x(a) {
                    var b = this,
                        c = b._initReady().then(function () {
                            var a = ia[b._dbInfo.name];
                            return a && a.dbReady ? a.dbReady : void 0
                        });
                    return k(c, a, a), c
                }

                function y(a) {
                    function b() {
                        return ja.resolve()
                    }
                    var c = this,
                        d = {
                            db: null
                        };
                    if (a)
                        for (var e in a) d[e] = a[e];
                    ia || (ia = {});
                    var f = ia[d.name];
                    f || (f = {
                        forages: [],
                        db: null,
                        dbReady: null,
                        deferredOperations: []
                    }, ia[d.name] = f), f.forages.push(c), c._initReady || (c._initReady = c.ready, c.ready = x);
                    for (var g = [], h = 0; h < f.forages.length; h++) {
                        var i = f.forages[h];
                        i !== c && g.push(i._initReady()["catch"](b))
                    }
                    var j = f.forages.slice(0);
                    return ja.all(g).then(function () {
                        return d.db = f.db, r(d)
                    }).then(function (a) {
                        return d.db = a, t(d, c._defaultConfig.version) ? s(d) : a
                    }).then(function (a) {
                        d.db = f.db = a, c._dbInfo = d;
                        for (var b = 0; b < j.length; b++) {
                            var e = j[b];
                            e !== c && (e._dbInfo.db = d.db, e._dbInfo.version = d.version)
                        }
                    })
                }

                function z(a, b) {
                    var c = this;
                    "string" != typeof a && (console.warn(a + " used as a key, but it is not a string."), a = String(a));
                    var d = new ja(function (b, d) {
                        c.ready().then(function () {
                            var e = c._dbInfo,
                                f = e.db.transaction(e.storeName, "readonly").objectStore(e.storeName),
                                g = f.get(a);
                            g.onsuccess = function () {
                                var a = g.result;
                                void 0 === a && (a = null), w(a) && (a = v(a)), b(a)
                            }, g.onerror = function () {
                                d(g.error)
                            }
                        })["catch"](d)
                    });
                    return j(d, b), d
                }

                function A(a, b) {
                    var c = this,
                        d = new ja(function (b, d) {
                            c.ready().then(function () {
                                var e = c._dbInfo,
                                    f = e.db.transaction(e.storeName, "readonly").objectStore(e.storeName),
                                    g = f.openCursor(),
                                    h = 1;
                                g.onsuccess = function () {
                                    var c = g.result;
                                    if (c) {
                                        var d = c.value;
                                        w(d) && (d = v(d));
                                        var e = a(d, c.key, h++);
                                        void 0 !== e ? b(e) : c["continue"]()
                                    } else b()
                                }, g.onerror = function () {
                                    d(g.error)
                                }
                            })["catch"](d)
                        });
                    return j(d, b), d
                }

                function B(a, b, c) {
                    var d = this;
                    "string" != typeof a && (console.warn(a + " used as a key, but it is not a string."), a = String(a));
                    var e = new ja(function (c, e) {
                        var f;
                        d.ready().then(function () {
                            return f = d._dbInfo, "[object Blob]" === la.call(b) ? n(f.db).then(function (a) {
                                return a ? b : u(b)
                            }) : b
                        }).then(function (b) {
                            var d = f.db.transaction(f.storeName, "readwrite"),
                                g = d.objectStore(f.storeName),
                                h = g.put(b, a);
                            null === b && (b = void 0), d.oncomplete = function () {
                                void 0 === b && (b = null), c(b)
                            }, d.onabort = d.onerror = function () {
                                var a = h.error ? h.error : h.transaction.error;
                                e(a)
                            }
                        })["catch"](e)
                    });
                    return j(e, c), e
                }

                function C(a, b) {
                    var c = this;
                    "string" != typeof a && (console.warn(a + " used as a key, but it is not a string."), a = String(a));
                    var d = new ja(function (b, d) {
                        c.ready().then(function () {
                            var e = c._dbInfo,
                                f = e.db.transaction(e.storeName, "readwrite"),
                                g = f.objectStore(e.storeName),
                                h = g["delete"](a);
                            f.oncomplete = function () {
                                b()
                            }, f.onerror = function () {
                                d(h.error)
                            }, f.onabort = function () {
                                var a = h.error ? h.error : h.transaction.error;
                                d(a)
                            }
                        })["catch"](d)
                    });
                    return j(d, b), d
                }

                function D(a) {
                    var b = this,
                        c = new ja(function (a, c) {
                            b.ready().then(function () {
                                var d = b._dbInfo,
                                    e = d.db.transaction(d.storeName, "readwrite"),
                                    f = e.objectStore(d.storeName),
                                    g = f.clear();
                                e.oncomplete = function () {
                                    a()
                                }, e.onabort = e.onerror = function () {
                                    var a = g.error ? g.error : g.transaction.error;
                                    c(a)
                                }
                            })["catch"](c)
                        });
                    return j(c, a), c
                }

                function E(a) {
                    var b = this,
                        c = new ja(function (a, c) {
                            b.ready().then(function () {
                                var d = b._dbInfo,
                                    e = d.db.transaction(d.storeName, "readonly").objectStore(d.storeName),
                                    f = e.count();
                                f.onsuccess = function () {
                                    a(f.result)
                                }, f.onerror = function () {
                                    c(f.error)
                                }
                            })["catch"](c)
                        });
                    return j(c, a), c
                }

                function F(a, b) {
                    var c = this,
                        d = new ja(function (b, d) {
                            return 0 > a ? void b(null) : void c.ready().then(function () {
                                var e = c._dbInfo,
                                    f = e.db.transaction(e.storeName, "readonly").objectStore(e.storeName),
                                    g = !1,
                                    h = f.openCursor();
                                h.onsuccess = function () {
                                    var c = h.result;
                                    return c ? void (0 === a ? b(c.key) : g ? b(c.key) : (g = !0, c.advance(a))) : void b(null)
                                }, h.onerror = function () {
                                    d(h.error)
                                }
                            })["catch"](d)
                        });
                    return j(d, b), d
                }

                function G(a) {
                    var b = this,
                        c = new ja(function (a, c) {
                            b.ready().then(function () {
                                var d = b._dbInfo,
                                    e = d.db.transaction(d.storeName, "readonly").objectStore(d.storeName),
                                    f = e.openCursor(),
                                    g = [];
                                f.onsuccess = function () {
                                    var b = f.result;
                                    return b ? (g.push(b.key), void b["continue"]()) : void a(g)
                                }, f.onerror = function () {
                                    c(f.error)
                                }
                            })["catch"](c)
                        });
                    return j(c, a), c
                }

                function H(a) {
                    var b, c, d, e, f, g = .75 * a.length,
                        h = a.length,
                        i = 0;
                    "=" === a[a.length - 1] && (g-- , "=" === a[a.length - 2] && g--);
                    var j = new ArrayBuffer(g),
                        k = new Uint8Array(j);
                    for (b = 0; h > b; b += 4) c = na.indexOf(a[b]), d = na.indexOf(a[b + 1]), e = na.indexOf(a[b + 2]), f = na.indexOf(a[b + 3]), k[i++] = c << 2 | d >> 4, k[i++] = (15 & d) << 4 | e >> 2, k[i++] = (3 & e) << 6 | 63 & f;
                    return j
                }

                function I(a) {
                    var b, c = new Uint8Array(a),
                        d = "";
                    for (b = 0; b < c.length; b += 3) d += na[c[b] >> 2], d += na[(3 & c[b]) << 4 | c[b + 1] >> 4], d += na[(15 & c[b + 1]) << 2 | c[b + 2] >> 6], d += na[63 & c[b + 2]];
                    return c.length % 3 === 2 ? d = d.substring(0, d.length - 1) + "=" : c.length % 3 === 1 && (d = d.substring(0, d.length - 2) + "=="), d
                }

                function J(a, b) {
                    var c = "";
                    if (a && (c = Ea.call(a)), a && ("[object ArrayBuffer]" === c || a.buffer && "[object ArrayBuffer]" === Ea.call(a.buffer))) {
                        var d, e = qa;
                        a instanceof ArrayBuffer ? (d = a, e += sa) : (d = a.buffer, "[object Int8Array]" === c ? e += ua : "[object Uint8Array]" === c ? e += va : "[object Uint8ClampedArray]" === c ? e += wa : "[object Int16Array]" === c ? e += xa : "[object Uint16Array]" === c ? e += za : "[object Int32Array]" === c ? e += ya : "[object Uint32Array]" === c ? e += Aa : "[object Float32Array]" === c ? e += Ba : "[object Float64Array]" === c ? e += Ca : b(new Error("Failed to get type for BinaryArray"))), b(e + I(d))
                    } else if ("[object Blob]" === c) {
                        var f = new FileReader;
                        f.onload = function () {
                            var c = oa + a.type + "~" + I(this.result);
                            b(qa + ta + c)
                        }, f.readAsArrayBuffer(a)
                    } else try {
                        b(JSON.stringify(a))
                    } catch (g) {
                        console.error("Couldn't convert value into a JSON string: ", a), b(null, g)
                    }
                }

                function K(a) {
                    if (a.substring(0, ra) !== qa) return JSON.parse(a);
                    var b, c = a.substring(Da),
                        d = a.substring(ra, Da);
                    if (d === ta && pa.test(c)) {
                        var e = c.match(pa);
                        b = e[1], c = c.substring(e[0].length)
                    }
                    var f = H(c);
                    switch (d) {
                        case sa:
                            return f;
                        case ta:
                            return i([f], {
                                type: b
                            });
                        case ua:
                            return new Int8Array(f);
                        case va:
                            return new Uint8Array(f);
                        case wa:
                            return new Uint8ClampedArray(f);
                        case xa:
                            return new Int16Array(f);
                        case za:
                            return new Uint16Array(f);
                        case ya:
                            return new Int32Array(f);
                        case Aa:
                            return new Uint32Array(f);
                        case Ba:
                            return new Float32Array(f);
                        case Ca:
                            return new Float64Array(f);
                        default:
                            throw new Error("Unkown type: " + d)
                    }
                }

                function L(a) {
                    var b = this,
                        c = {
                            db: null
                        };
                    if (a)
                        for (var d in a) c[d] = "string" != typeof a[d] ? a[d].toString() : a[d];
                    var e = new ja(function (a, d) {
                        try {
                            c.db = openDatabase(c.name, String(c.version), c.description, c.size)
                        } catch (e) {
                            return d(e)
                        }
                        c.db.transaction(function (e) {
                            e.executeSql("CREATE TABLE IF NOT EXISTS " + c.storeName + " (id INTEGER PRIMARY KEY, key unique, value)", [], function () {
                                b._dbInfo = c, a()
                            }, function (a, b) {
                                d(b)
                            })
                        })
                    });
                    return c.serializer = Fa, e
                }

                function M(a, b) {
                    var c = this;
                    "string" != typeof a && (console.warn(a + " used as a key, but it is not a string."), a = String(a));
                    var d = new ja(function (b, d) {
                        c.ready().then(function () {
                            var e = c._dbInfo;
                            e.db.transaction(function (c) {
                                c.executeSql("SELECT * FROM " + e.storeName + " WHERE key = ? LIMIT 1", [a], function (a, c) {
                                    var d = c.rows.length ? c.rows.item(0).value : null;
                                    d && (d = e.serializer.deserialize(d)), b(d)
                                }, function (a, b) {
                                    d(b)
                                })
                            })
                        })["catch"](d)
                    });
                    return j(d, b), d
                }

                function N(a, b) {
                    var c = this,
                        d = new ja(function (b, d) {
                            c.ready().then(function () {
                                var e = c._dbInfo;
                                e.db.transaction(function (c) {
                                    c.executeSql("SELECT * FROM " + e.storeName, [], function (c, d) {
                                        for (var f = d.rows, g = f.length, h = 0; g > h; h++) {
                                            var i = f.item(h),
                                                j = i.value;
                                            if (j && (j = e.serializer.deserialize(j)), j = a(j, i.key, h + 1), void 0 !== j) return void b(j)
                                        }
                                        b()
                                    }, function (a, b) {
                                        d(b)
                                    })
                                })
                            })["catch"](d)
                        });
                    return j(d, b), d
                }

                function O(a, b, c, d) {
                    var e = this;
                    "string" != typeof a && (console.warn(a + " used as a key, but it is not a string."), a = String(a));
                    var f = new ja(function (f, g) {
                        e.ready().then(function () {
                            void 0 === b && (b = null);
                            var h = b,
                                i = e._dbInfo;
                            i.serializer.serialize(b, function (b, j) {
                                j ? g(j) : i.db.transaction(function (c) {
                                    c.executeSql("INSERT OR REPLACE INTO " + i.storeName + " (key, value) VALUES (?, ?)", [a, b], function () {
                                        f(h)
                                    }, function (a, b) {
                                        g(b)
                                    })
                                }, function (b) {
                                    if (b.code === b.QUOTA_ERR) {
                                        if (d > 0) return void f(O.apply(e, [a, h, c, d - 1]));
                                        g(b)
                                    }
                                })
                            })
                        })["catch"](g)
                    });
                    return j(f, c), f
                }

                function P(a, b, c) {
                    return O.apply(this, [a, b, c, 1])
                }

                function Q(a, b) {
                    var c = this;
                    "string" != typeof a && (console.warn(a + " used as a key, but it is not a string."),
                        a = String(a));
                    var d = new ja(function (b, d) {
                        c.ready().then(function () {
                            var e = c._dbInfo;
                            e.db.transaction(function (c) {
                                c.executeSql("DELETE FROM " + e.storeName + " WHERE key = ?", [a], function () {
                                    b()
                                }, function (a, b) {
                                    d(b)
                                })
                            })
                        })["catch"](d)
                    });
                    return j(d, b), d
                }

                function R(a) {
                    var b = this,
                        c = new ja(function (a, c) {
                            b.ready().then(function () {
                                var d = b._dbInfo;
                                d.db.transaction(function (b) {
                                    b.executeSql("DELETE FROM " + d.storeName, [], function () {
                                        a()
                                    }, function (a, b) {
                                        c(b)
                                    })
                                })
                            })["catch"](c)
                        });
                    return j(c, a), c
                }

                function S(a) {
                    var b = this,
                        c = new ja(function (a, c) {
                            b.ready().then(function () {
                                var d = b._dbInfo;
                                d.db.transaction(function (b) {
                                    b.executeSql("SELECT COUNT(key) as c FROM " + d.storeName, [], function (b, c) {
                                        var d = c.rows.item(0).c;
                                        a(d)
                                    }, function (a, b) {
                                        c(b)
                                    })
                                })
                            })["catch"](c)
                        });
                    return j(c, a), c
                }

                function T(a, b) {
                    var c = this,
                        d = new ja(function (b, d) {
                            c.ready().then(function () {
                                var e = c._dbInfo;
                                e.db.transaction(function (c) {
                                    c.executeSql("SELECT key FROM " + e.storeName + " WHERE id = ? LIMIT 1", [a + 1], function (a, c) {
                                        var d = c.rows.length ? c.rows.item(0).key : null;
                                        b(d)
                                    }, function (a, b) {
                                        d(b)
                                    })
                                })
                            })["catch"](d)
                        });
                    return j(d, b), d
                }

                function U(a) {
                    var b = this,
                        c = new ja(function (a, c) {
                            b.ready().then(function () {
                                var d = b._dbInfo;
                                d.db.transaction(function (b) {
                                    b.executeSql("SELECT key FROM " + d.storeName, [], function (b, c) {
                                        for (var d = [], e = 0; e < c.rows.length; e++) d.push(c.rows.item(e).key);
                                        a(d)
                                    }, function (a, b) {
                                        c(b)
                                    })
                                })
                            })["catch"](c)
                        });
                    return j(c, a), c
                }

                function V(a) {
                    var b = this,
                        c = {};
                    if (a)
                        for (var d in a) c[d] = a[d];
                    return c.keyPrefix = c.name + "/", c.storeName !== b._defaultConfig.storeName && (c.keyPrefix += c.storeName + "/"), b._dbInfo = c, c.serializer = Fa, ja.resolve()
                }

                function W(a) {
                    var b = this,
                        c = b.ready().then(function () {
                            for (var a = b._dbInfo.keyPrefix, c = localStorage.length - 1; c >= 0; c--) {
                                var d = localStorage.key(c);
                                0 === d.indexOf(a) && localStorage.removeItem(d)
                            }
                        });
                    return j(c, a), c
                }

                function X(a, b) {
                    var c = this;
                    "string" != typeof a && (console.warn(a + " used as a key, but it is not a string."), a = String(a));
                    var d = c.ready().then(function () {
                        var b = c._dbInfo,
                            d = localStorage.getItem(b.keyPrefix + a);
                        return d && (d = b.serializer.deserialize(d)), d
                    });
                    return j(d, b), d
                }

                function Y(a, b) {
                    var c = this,
                        d = c.ready().then(function () {
                            for (var b = c._dbInfo, d = b.keyPrefix, e = d.length, f = localStorage.length, g = 1, h = 0; f > h; h++) {
                                var i = localStorage.key(h);
                                if (0 === i.indexOf(d)) {
                                    var j = localStorage.getItem(i);
                                    if (j && (j = b.serializer.deserialize(j)), j = a(j, i.substring(e), g++), void 0 !== j) return j
                                }
                            }
                        });
                    return j(d, b), d
                }

                function Z(a, b) {
                    var c = this,
                        d = c.ready().then(function () {
                            var b, d = c._dbInfo;
                            try {
                                b = localStorage.key(a)
                            } catch (e) {
                                b = null
                            }
                            return b && (b = b.substring(d.keyPrefix.length)), b
                        });
                    return j(d, b), d
                }

                function $(a) {
                    var b = this,
                        c = b.ready().then(function () {
                            for (var a = b._dbInfo, c = localStorage.length, d = [], e = 0; c > e; e++) 0 === localStorage.key(e).indexOf(a.keyPrefix) && d.push(localStorage.key(e).substring(a.keyPrefix.length));
                            return d
                        });
                    return j(c, a), c
                }

                function _(a) {
                    var b = this,
                        c = b.keys().then(function (a) {
                            return a.length
                        });
                    return j(c, a), c
                }

                function aa(a, b) {
                    var c = this;
                    "string" != typeof a && (console.warn(a + " used as a key, but it is not a string."), a = String(a));
                    var d = c.ready().then(function () {
                        var b = c._dbInfo;
                        localStorage.removeItem(b.keyPrefix + a)
                    });
                    return j(d, b), d
                }

                function ba(a, b, c) {
                    var d = this;
                    "string" != typeof a && (console.warn(a + " used as a key, but it is not a string."), a = String(a));
                    var e = d.ready().then(function () {
                        void 0 === b && (b = null);
                        var c = b;
                        return new ja(function (e, f) {
                            var g = d._dbInfo;
                            g.serializer.serialize(b, function (b, d) {
                                if (d) f(d);
                                else try {
                                    localStorage.setItem(g.keyPrefix + a, b), e(c)
                                } catch (h) {
                                    ("QuotaExceededError" === h.name || "NS_ERROR_DOM_QUOTA_REACHED" === h.name) && f(h), f(h)
                                }
                            })
                        })
                    });
                    return j(e, c), e
                }

                function ca(a, b) {
                    a[b] = function () {
                        var c = arguments;
                        return a.ready().then(function () {
                            return a[b].apply(a, c)
                        })
                    }
                }

                function da() {
                    for (var a = 1; a < arguments.length; a++) {
                        var b = arguments[a];
                        if (b)
                            for (var c in b) b.hasOwnProperty(c) && (Oa(b[c]) ? arguments[0][c] = b[c].slice() : arguments[0][c] = b[c])
                    }
                    return arguments[0]
                }

                function ea(a) {
                    for (var b in Ja)
                        if (Ja.hasOwnProperty(b) && Ja[b] === a) return !0;
                    return !1
                }
                var fa = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (a) {
                    return typeof a
                } : function (a) {
                    return a && "function" == typeof Symbol && a.constructor === Symbol ? "symbol" : typeof a
                },
                    ga = e();
                "undefined" == typeof Promise && a(3);
                var ha, ia, ja = Promise,
                    ka = "local-forage-detect-blob-support",
                    la = Object.prototype.toString,
                    ma = {
                        _driver: "asyncStorage",
                        _initStorage: y,
                        iterate: A,
                        getItem: z,
                        setItem: B,
                        removeItem: C,
                        clear: D,
                        length: E,
                        key: F,
                        keys: G
                    },
                    na = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
                    oa = "~~local_forage_type~",
                    pa = /^~~local_forage_type~([^~]+)~/,
                    qa = "__lfsc__:",
                    ra = qa.length,
                    sa = "arbf",
                    ta = "blob",
                    ua = "si08",
                    va = "ui08",
                    wa = "uic8",
                    xa = "si16",
                    ya = "si32",
                    za = "ur16",
                    Aa = "ui32",
                    Ba = "fl32",
                    Ca = "fl64",
                    Da = ra + sa.length,
                    Ea = Object.prototype.toString,
                    Fa = {
                        serialize: J,
                        deserialize: K,
                        stringToBuffer: H,
                        bufferToString: I
                    },
                    Ga = {
                        _driver: "webSQLStorage",
                        _initStorage: L,
                        iterate: N,
                        getItem: M,
                        setItem: P,
                        removeItem: Q,
                        clear: R,
                        length: S,
                        key: T,
                        keys: U
                    },
                    Ha = {
                        _driver: "localStorageWrapper",
                        _initStorage: V,
                        iterate: Y,
                        getItem: X,
                        setItem: ba,
                        removeItem: aa,
                        clear: W,
                        length: _,
                        key: Z,
                        keys: $
                    },
                    Ia = {},
                    Ja = {
                        INDEXEDDB: "asyncStorage",
                        LOCALSTORAGE: "localStorageWrapper",
                        WEBSQL: "webSQLStorage"
                    },
                    Ka = [Ja.INDEXEDDB, Ja.WEBSQL, Ja.LOCALSTORAGE],
                    La = ["clear", "getItem", "iterate", "key", "keys", "length", "removeItem", "setItem"],
                    Ma = {
                        description: "",
                        driver: Ka.slice(),
                        name: "localforage",
                        size: 4980736,
                        storeName: "keyvaluepairs",
                        version: 1
                    },
                    Na = {};
                Na[Ja.INDEXEDDB] = f(), Na[Ja.WEBSQL] = g(), Na[Ja.LOCALSTORAGE] = h();
                var Oa = Array.isArray || function (a) {
                    return "[object Array]" === Object.prototype.toString.call(a)
                },
                    Pa = function () {
                        function a(b) {
                            d(this, a), this.INDEXEDDB = Ja.INDEXEDDB, this.LOCALSTORAGE = Ja.LOCALSTORAGE, this.WEBSQL = Ja.WEBSQL, this._defaultConfig = da({}, Ma), this._config = da({}, this._defaultConfig, b), this._driverSet = null, this._initDriver = null, this._ready = !1, this._dbInfo = null, this._wrapLibraryMethodsWithReady(), this.setDriver(this._config.driver)["catch"](function () { })
                        }
                        return a.prototype.config = function (a) {
                            if ("object" === ("undefined" == typeof a ? "undefined" : fa(a))) {
                                if (this._ready) return new Error("Can't call config() after localforage has been used.");
                                for (var b in a) {
                                    if ("storeName" === b && (a[b] = a[b].replace(/\W/g, "_")), "version" === b && "number" != typeof a[b]) return new Error("Database version must be a number.");
                                    this._config[b] = a[b]
                                }
                                return "driver" in a && a.driver ? this.setDriver(this._config.driver) : !0
                            }
                            return "string" == typeof a ? this._config[a] : this._config
                        }, a.prototype.defineDriver = function (a, b, c) {
                            var d = new ja(function (b, c) {
                                try {
                                    var d = a._driver,
                                        e = new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver"),
                                        f = new Error("Custom driver name already in use: " + a._driver);
                                    if (!a._driver) return void c(e);
                                    if (ea(a._driver)) return void c(f);
                                    for (var g = La.concat("_initStorage"), h = 0; h < g.length; h++) {
                                        var i = g[h];
                                        if (!i || !a[i] || "function" != typeof a[i]) return void c(e)
                                    }
                                    var j = ja.resolve(!0);
                                    "_support" in a && (j = a._support && "function" == typeof a._support ? a._support() : ja.resolve(!!a._support)), j.then(function (c) {
                                        Na[d] = c, Ia[d] = a, b()
                                    }, c)
                                } catch (k) {
                                    c(k)
                                }
                            });
                            return k(d, b, c), d
                        }, a.prototype.driver = function () {
                            return this._driver || null
                        }, a.prototype.getDriver = function (a, b, c) {
                            var d = this,
                                e = ja.resolve().then(function () {
                                    if (!ea(a)) {
                                        if (Ia[a]) return Ia[a];
                                        throw new Error("Driver not found.")
                                    }
                                    switch (a) {
                                        case d.INDEXEDDB:
                                            return ma;
                                        case d.LOCALSTORAGE:
                                            return Ha;
                                        case d.WEBSQL:
                                            return Ga
                                    }
                                });
                            return k(e, b, c), e
                        }, a.prototype.getSerializer = function (a) {
                            var b = ja.resolve(Fa);
                            return k(b, a), b
                        }, a.prototype.ready = function (a) {
                            var b = this,
                                c = b._driverSet.then(function () {
                                    return null === b._ready && (b._ready = b._initDriver()), b._ready
                                });
                            return k(c, a, a), c
                        }, a.prototype.setDriver = function (a, b, c) {
                            function d() {
                                g._config.driver = g.driver()
                            }

                            function e(a) {
                                return g._extend(a), d(), g._ready = g._initStorage(g._config), g._ready
                            }

                            function f(a) {
                                return function () {
                                    function b() {
                                        for (; c < a.length;) {
                                            var f = a[c];
                                            return c++ , g._dbInfo = null, g._ready = null, g.getDriver(f).then(e)["catch"](b)
                                        }
                                        d();
                                        var h = new Error("No available storage method found.");
                                        return g._driverSet = ja.reject(h), g._driverSet
                                    }
                                    var c = 0;
                                    return b()
                                }
                            }
                            var g = this;
                            Oa(a) || (a = [a]);
                            var h = this._getSupportedDrivers(a),
                                i = null !== this._driverSet ? this._driverSet["catch"](function () {
                                    return ja.resolve()
                                }) : ja.resolve();
                            return this._driverSet = i.then(function () {
                                var a = h[0];
                                return g._dbInfo = null, g._ready = null, g.getDriver(a).then(function (a) {
                                    g._driver = a._driver, d(), g._wrapLibraryMethodsWithReady(), g._initDriver = f(h)
                                })
                            })["catch"](function () {
                                d();
                                var a = new Error("No available storage method found.");
                                return g._driverSet = ja.reject(a), g._driverSet
                            }), k(this._driverSet, b, c), this._driverSet
                        }, a.prototype.supports = function (a) {
                            return !!Na[a]
                        }, a.prototype._extend = function (a) {
                            da(this, a)
                        }, a.prototype._getSupportedDrivers = function (a) {
                            for (var b = [], c = 0, d = a.length; d > c; c++) {
                                var e = a[c];
                                this.supports(e) && b.push(e)
                            }
                            return b
                        }, a.prototype._wrapLibraryMethodsWithReady = function () {
                            for (var a = 0; a < La.length; a++) ca(this, La[a])
                        }, a.prototype.createInstance = function (b) {
                            return new a(b)
                        }, a
                    }(),
                    Qa = new Pa;
                b.exports = Qa
            }, {
                3: 3
            }]
        }, {}, [4])(4)
    }),
    function () {
        var a = this,
            b = {};
        "undefined" != typeof exports ? module.exports = b : a.fuzzy = b, b.simpleFilter = function (a, c) {
            return c.filter(function (c) {
                return b.test(a, c)
            })
        }, b.test = function (a, c) {
            return null !== b.match(a, c)
        }, b.match = function (a, b, c) {
            c = c || {};
            var d, e = 0,
                f = [],
                g = b.length,
                h = 0,
                i = 0,
                j = c.pre || "",
                k = c.post || "",
                l = c.caseSensitive && b || b.toLowerCase();
            a = c.caseSensitive && a || a.toLowerCase();
            for (var m = 0; g > m; m++) d = b[m], l[m] === a[e] ? (d = j + d + k, e += 1, i += 1 + i) : i = 0, h += i, f[f.length] = d;
            return e === a.length ? (h = l === a ? 1 / 0 : h, {
                rendered: f.join(""),
                score: h
            }) : null
        }, b.filter = function (a, c, d) {
            return c && 0 !== c.length ? "string" != typeof a ? c : (d = d || {}, c.reduce(function (c, e, f, g) {
                var h = e;
                d.extract && (h = d.extract(e));
                var i = b.match(a, h, d);
                return null != i && (c[c.length] = {
                    string: i.rendered,
                    score: i.score,
                    index: f,
                    original: e
                }), c
            }, []).sort(function (a, b) {
                var c = b.score - a.score;
                return c ? c : a.index - b.index
            })) : []
        }
    }(),
    function (a) {
        function b(a, b) {
            return "function" == typeof a ? a.call(b) : a
        }

        function c(a) {
            for (; a = a.parentNode;)
                if (a == document) return !0;
            return !1
        }

        function d(b, c) {
            this.$element = a(b), this.options = c, this.enabled = !0, this.fixTitle()
        }
        d.prototype = {
            show: function () {
                var c = this.getTitle();
                if (c && this.enabled) {
                    var d = this.tip();
                    d.find(".tipsy-inner")[this.options.html ? "html" : "text"](c), d[0].className = "tipsy", d.remove().css({
                        top: 0,
                        left: 0,
                        visibility: "hidden",
                        display: "block"
                    }).prependTo(document.body);
                    var e, f = a.extend({}, this.$element.offset(), {
                        width: this.$element[0].offsetWidth,
                        height: this.$element[0].offsetHeight
                    }),
                        g = d[0].offsetWidth,
                        h = d[0].offsetHeight,
                        i = b(this.options.gravity, this.$element[0]);
                    switch (i.charAt(0)) {
                        case "n":
                            e = {
                                top: f.top + f.height + this.options.offset,
                                left: f.left + f.width / 2 - g / 2
                            };
                            break;
                        case "s":
                            e = {
                                top: f.top - h - this.options.offset,
                                left: f.left + f.width / 2 - g / 2
                            };
                            break;
                        case "e":
                            e = {
                                top: f.top + f.height / 2 - h / 2,
                                left: f.left - g - this.options.offset
                            };
                            break;
                        case "w":
                            e = {
                                top: f.top + f.height / 2 - h / 2,
                                left: f.left + f.width + this.options.offset
                            }
                    }
                    2 == i.length && ("w" == i.charAt(1) ? e.left = f.left + f.width / 2 - 15 : e.left = f.left + f.width / 2 - g + 15), d.css(e).addClass("tipsy-" + i), d.find(".tipsy-arrow")[0].className = "tipsy-arrow tipsy-arrow-" + i.charAt(0), this.options.className && d.addClass(b(this.options.className, this.$element[0])), this.options.fade ? d.stop().css({
                        opacity: 0,
                        display: "block",
                        visibility: "visible"
                    }).animate({
                        opacity: this.options.opacity
                    }) : d.css({
                        visibility: "visible",
                        opacity: this.options.opacity
                    })
                }
            },
            hide: function () {
                this.options.fade ? this.tip().stop().fadeOut(function () {
                    a(this).remove()
                }) : this.tip().remove()
            },
            fixTitle: function () {
                var a = this.$element;
                (a.attr("title") || "string" != typeof a.attr("original-title")) && a.attr("original-title", a.attr("title") || "").removeAttr("title")
            },
            getTitle: function () {
                var a, b = this.$element,
                    c = this.options;
                this.fixTitle();
                var a, c = this.options;
                return "string" == typeof c.title ? a = b.attr("title" == c.title ? "original-title" : c.title) : "function" == typeof c.title && (a = c.title.call(b[0])), a = ("" + a).replace(/(^\s*|\s*$)/, ""), a || c.fallback
            },
            tip: function () {
                return this.$tip || (this.$tip = a('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>'), this.$tip.data("tipsy-pointee", this.$element[0])), this.$tip
            },
            validate: function () {
                this.$element[0].parentNode || (this.hide(), this.$element = null, this.options = null)
            },
            enable: function () {
                this.enabled = !0
            },
            disable: function () {
                this.enabled = !1
            },
            toggleEnabled: function () {
                this.enabled = !this.enabled
            }
        }, a.fn.tipsy = function (b) {
            function c(c) {
                var e = a.data(c, "tipsy");
                return e || (e = new d(c, a.fn.tipsy.elementOptions(c, b)), a.data(c, "tipsy", e)), e
            }

            function e() {
                var a = c(this);
                a.hoverState = "in", 0 == b.delayIn ? a.show() : (a.fixTitle(), setTimeout(function () {
                    "in" == a.hoverState && a.show()
                }, b.delayIn))
            }

            function f() {
                var a = c(this);
                a.hoverState = "out", 0 == b.delayOut ? a.hide() : setTimeout(function () {
                    "out" == a.hoverState && a.hide()
                }, b.delayOut)
            }
            if (b === !0) return this.data("tipsy");
            if ("string" == typeof b) {
                var g = this.data("tipsy");
                return g && g[b](), this
            }
            if (b = a.extend({}, a.fn.tipsy.defaults, b), b.live || this.each(function () {
                c(this)
            }), "manual" != b.trigger) {
                var h = b.live ? "live" : "bind",
                    i = "hover" == b.trigger ? "mouseenter" : "focus",
                    j = "hover" == b.trigger ? "mouseleave" : "blur";
                this[h](i, e)[h](j, f)
            }
            return this
        }, a.fn.tipsy.defaults = {
            className: null,
            delayIn: 0,
            delayOut: 0,
            fade: !1,
            fallback: "",
            gravity: "n",
            html: !1,
            live: !1,
            offset: 0,
            opacity: .8,
            title: "title",
            trigger: "hover"
        }, a.fn.tipsy.revalidate = function () {
            a(".tipsy").each(function () {
                var b = a.data(this, "tipsy-pointee");
                b && c(b) || a(this).remove()
            })
        }, a.fn.tipsy.elementOptions = function (b, c) {
            return a.metadata ? a.extend({}, c, a(b).metadata()) : c
        }, a.fn.tipsy.autoNS = function () {
            return a(this).offset().top > a(document).scrollTop() + a(window).height() / 2 ? "s" : "n"
        }, a.fn.tipsy.autoWE = function () {
            return a(this).offset().left > a(document).scrollLeft() + a(window).width() / 2 ? "e" : "w"
        }, a.fn.tipsy.autoBounds = function (b, c) {
            return function () {
                var d = {
                    ns: c[0],
                    ew: c.length > 1 ? c[1] : !1
                },
                    e = a(document).scrollTop() + b,
                    f = a(document).scrollLeft() + b,
                    g = a(this);
                return g.offset().top < e && (d.ns = "n"), g.offset().left < f && (d.ew = "w"), a(window).width() + a(document).scrollLeft() - g.offset().left < b && (d.ew = "e"), a(window).height() + a(document).scrollTop() - g.offset().top < b && (d.ns = "s"), d.ns + (d.ew ? d.ew : "")
            }
        }
    }(jQuery),
    function (a) {
        "function" == typeof define && define.amd ? define(["jquery"], a) : a("object" == typeof exports ? require("jquery") : window.jQuery || window.Zepto)
    }(function (a) {
        var b, c, d, e, f, g, h = "Close",
            i = "BeforeClose",
            j = "AfterClose",
            k = "BeforeAppend",
            l = "MarkupParse",
            m = "Open",
            n = "Change",
            o = "mfp",
            p = "." + o,
            q = "mfp-ready",
            r = "mfp-removing",
            s = "mfp-prevent-close",
            t = function () { },
            u = !!window.jQuery,
            v = a(window),
            w = function (a, c) {
                b.ev.on(o + a + p, c)
            },
            x = function (b, c, d, e) {
                var f = document.createElement("div");
                return f.className = "mfp-" + b, d && (f.innerHTML = d), e ? c && c.appendChild(f) : (f = a(f), c && f.appendTo(c)), f
            },
            y = function (c, d) {
                b.ev.triggerHandler(o + c, d), b.st.callbacks && (c = c.charAt(0).toLowerCase() + c.slice(1), b.st.callbacks[c] && b.st.callbacks[c].apply(b, a.isArray(d) ? d : [d]))
            },
            z = function (c) {
                return c === g && b.currTemplate.closeBtn || (b.currTemplate.closeBtn = a(b.st.closeMarkup.replace("%title%", b.st.tClose)), g = c), b.currTemplate.closeBtn
            },
            A = function () {
                a.magnificPopup.instance || (b = new t, b.init(), a.magnificPopup.instance = b)
            },
            B = function () {
                var a = document.createElement("p").style,
                    b = ["ms", "O", "Moz", "Webkit"];
                if (void 0 !== a.transition) return !0;
                for (; b.length;)
                    if (b.pop() + "Transition" in a) return !0;
                return !1
            };
        t.prototype = {
            constructor: t,
            init: function () {
                var c = navigator.appVersion;
                b.isIE7 = -1 !== c.indexOf("MSIE 7."), b.isIE8 = -1 !== c.indexOf("MSIE 8."), b.isLowIE = b.isIE7 || b.isIE8, b.isAndroid = /android/gi.test(c), b.isIOS = /iphone|ipad|ipod/gi.test(c), b.supportsTransition = B(), b.probablyMobile = b.isAndroid || b.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent), d = a(document), b.popupsCache = {}
            },
            open: function (c) {
                var e;
                if (c.isObj === !1) {
                    b.items = c.items.toArray(), b.index = 0;
                    var g, h = c.items;
                    for (e = 0; e < h.length; e++)
                        if (g = h[e], g.parsed && (g = g.el[0]), g === c.el[0]) {
                            b.index = e;
                            break
                        }
                } else b.items = a.isArray(c.items) ? c.items : [c.items], b.index = c.index || 0;
                if (b.types = [], f = "", c.mainEl && c.mainEl.length ? b.ev = c.mainEl.eq(0) : b.ev = d, c.key ? (b.popupsCache[c.key] || (b.popupsCache[c.key] = {}), b.currTemplate = b.popupsCache[c.key]) : b.currTemplate = {}, b.st = a.extend(!0, {}, a.magnificPopup.defaults, c), b.fixedContentPos = "auto" === b.st.fixedContentPos ? !b.probablyMobile : b.st.fixedContentPos, b.st.modal && (b.st.closeOnContentClick = !1, b.st.closeOnBgClick = !1, b.st.showCloseBtn = !1, b.st.enableEscapeKey = !1), b.isOpen) return void b.updateItemHTML();
                b.bgOverlay || (b.bgOverlay = x("bg").on("click" + p, function () {
                    b.close()
                }), b.wrap = x("wrap").attr("tabindex", -1).on("click" + p, function (a) {
                    b._checkIfClose(a.target) && b.close()
                }), b.container = x("container", b.wrap)), b.contentContainer = x("content"), b.st.preloader && (b.preloader = x("preloader", b.container, b.st.tLoading));
                var i = a.magnificPopup.modules;
                for (e = 0; e < i.length; e++) {
                    var j = i[e];
                    j = j.charAt(0).toUpperCase() + j.slice(1), b["init" + j].call(b)
                }
                y("BeforeOpen"), b.st.showCloseBtn && (b.st.closeBtnInside ? (w(l, function (a, b, c, d) {
                    c.close_replaceWith = z(d.type)
                }), f += " mfp-close-btn-in") : b.wrap.append(z())), b.st.alignTop && (f += " mfp-align-top"), b.fixedContentPos ? b.wrap.css({
                    overflow: b.st.overflowY,
                    overflowX: "hidden",
                    overflowY: b.st.overflowY
                }) : b.wrap.css({
                    top: v.scrollTop(),
                    position: "absolute"
                }), (b.st.fixedBgPos === !1 || "auto" === b.st.fixedBgPos && !b.fixedContentPos) && b.bgOverlay.css({
                    height: d.height(),
                    position: "absolute"
                }), b.st.enableEscapeKey && d.on("keyup" + p, function (a) {
                    27 === a.keyCode && b.close()
                }), v.on("resize" + p, function () {
                    b.updateSize()
                }), b.st.closeOnContentClick || (f += " mfp-auto-cursor"), f && b.wrap.addClass(f);
                var k = b.wH = v.height(),
                    n = {};
                if (b.fixedContentPos && b._hasScrollBar(k)) {
                    var o = b._getScrollbarSize();
                    o && (n.marginRight = o)
                }
                b.fixedContentPos && (b.isIE7 ? a("body, html").css("overflow", "hidden") : n.overflow = "hidden");
                var r = b.st.mainClass;
                return b.isIE7 && (r += " mfp-ie7"), r && b._addClassToMFP(r), b.updateItemHTML(), y("BuildControls"), a("html").css(n), b.bgOverlay.add(b.wrap).prependTo(b.st.prependTo || a(document.body)), b._lastFocusedEl = document.activeElement, setTimeout(function () {
                    b.content ? (b._addClassToMFP(q), b._setFocus()) : b.bgOverlay.addClass(q), d.on("focusin" + p, b._onFocusIn)
                }, 16), b.isOpen = !0, b.updateSize(k), y(m), c
            },
            close: function () {
                b.isOpen && (y(i), b.isOpen = !1, b.st.removalDelay && !b.isLowIE && b.supportsTransition ? (b._addClassToMFP(r), setTimeout(function () {
                    b._close()
                }, b.st.removalDelay)) : b._close())
            },
            _close: function () {
                y(h);
                var c = r + " " + q + " ";
                if (b.bgOverlay.detach(), b.wrap.detach(), b.container.empty(), b.st.mainClass && (c += b.st.mainClass + " "), b._removeClassFromMFP(c), b.fixedContentPos) {
                    var e = {
                        marginRight: ""
                    };
                    b.isIE7 ? a("body, html").css("overflow", "") : e.overflow = "", a("html").css(e)
                }
                d.off("keyup" + p + " focusin" + p), b.ev.off(p), b.wrap.attr("class", "mfp-wrap").removeAttr("style"), b.bgOverlay.attr("class", "mfp-bg"), b.container.attr("class", "mfp-container"), !b.st.showCloseBtn || b.st.closeBtnInside && b.currTemplate[b.currItem.type] !== !0 || b.currTemplate.closeBtn && b.currTemplate.closeBtn.detach(), b._lastFocusedEl && a(b._lastFocusedEl).focus(), b.currItem = null, b.content = null, b.currTemplate = null, b.prevHeight = 0, y(j)
            },
            updateSize: function (a) {
                if (b.isIOS) {
                    var c = document.documentElement.clientWidth / window.innerWidth,
                        d = window.innerHeight * c;
                    b.wrap.css("height", d), b.wH = d
                } else b.wH = a || v.height();
                b.fixedContentPos || b.wrap.css("height", b.wH), y("Resize")
            },
            updateItemHTML: function () {
                var c = b.items[b.index];
                b.contentContainer.detach(), b.content && b.content.detach(), c.parsed || (c = b.parseEl(b.index));
                var d = c.type;
                if (y("BeforeChange", [b.currItem ? b.currItem.type : "", d]), b.currItem = c, !b.currTemplate[d]) {
                    var f = b.st[d] ? b.st[d].markup : !1;
                    y("FirstMarkupParse", f), f ? b.currTemplate[d] = a(f) : b.currTemplate[d] = !0
                }
                e && e !== c.type && b.container.removeClass("mfp-" + e + "-holder");
                var g = b["get" + d.charAt(0).toUpperCase() + d.slice(1)](c, b.currTemplate[d]);
                b.appendContent(g, d), c.preloaded = !0, y(n, c), e = c.type, b.container.prepend(b.contentContainer), y("AfterChange")
            },
            appendContent: function (a, c) {
                b.content = a, a ? b.st.showCloseBtn && b.st.closeBtnInside && b.currTemplate[c] === !0 ? b.content.find(".mfp-close").length || b.content.append(z()) : b.content = a : b.content = "", y(k), b.container.addClass("mfp-" + c + "-holder"), b.contentContainer.append(b.content)
            },
            parseEl: function (c) {
                var d, e = b.items[c];
                if (e.tagName ? e = {
                    el: a(e)
                } : (d = e.type, e = {
                    data: e,
                    src: e.src
                }), e.el) {
                    for (var f = b.types, g = 0; g < f.length; g++)
                        if (e.el.hasClass("mfp-" + f[g])) {
                            d = f[g];
                            break
                        }
                    e.src = e.el.attr("data-mfp-src"), e.src || (e.src = e.el.attr("href"))
                }
                return e.type = d || b.st.type || "inline", e.index = c, e.parsed = !0, b.items[c] = e, y("ElementParse", e), b.items[c]
            },
            addGroup: function (a, c) {
                var d = function (d) {
                    d.mfpEl = this, b._openClick(d, a, c)
                };
                c || (c = {});
                var e = "click.magnificPopup";
                c.mainEl = a, c.items ? (c.isObj = !0, a.off(e).on(e, d)) : (c.isObj = !1, c.delegate ? a.off(e).on(e, c.delegate, d) : (c.items = a, a.off(e).on(e, d)))
            },
            _openClick: function (c, d, e) {
                var f = void 0 !== e.midClick ? e.midClick : a.magnificPopup.defaults.midClick;
                if (f || !(2 === c.which || c.ctrlKey || c.metaKey || c.altKey || c.shiftKey)) {
                    var g = void 0 !== e.disableOn ? e.disableOn : a.magnificPopup.defaults.disableOn;
                    if (g)
                        if (a.isFunction(g)) {
                            if (!g.call(b)) return !0
                        } else if (v.width() < g) return !0;
                    c.type && (c.preventDefault(), b.isOpen && c.stopPropagation()), e.el = a(c.mfpEl), e.delegate && (e.items = d.find(e.delegate)), b.open(e)
                }
            },
            updateStatus: function (a, d) {
                if (b.preloader) {
                    c !== a && b.container.removeClass("mfp-s-" + c), d || "loading" !== a || (d = b.st.tLoading);
                    var e = {
                        status: a,
                        text: d
                    };
                    y("UpdateStatus", e), a = e.status, d = e.text, b.preloader.html(d), b.preloader.find("a").on("click", function (a) {
                        a.stopImmediatePropagation()
                    }), b.container.addClass("mfp-s-" + a), c = a
                }
            },
            _checkIfClose: function (c) {
                if (!a(c).hasClass(s)) {
                    var d = b.st.closeOnContentClick,
                        e = b.st.closeOnBgClick;
                    if (d && e) return !0;
                    if (!b.content || a(c).hasClass("mfp-close") || b.preloader && c === b.preloader[0]) return !0;
                    if (c === b.content[0] || a.contains(b.content[0], c)) {
                        if (d) return !0
                    } else if (e && a.contains(document, c)) return !0;
                    return !1
                }
            },
            _addClassToMFP: function (a) {
                b.bgOverlay.addClass(a), b.wrap.addClass(a)
            },
            _removeClassFromMFP: function (a) {
                this.bgOverlay.removeClass(a), b.wrap.removeClass(a)
            },
            _hasScrollBar: function (a) {
                return (b.isIE7 ? d.height() : document.body.scrollHeight) > (a || v.height())
            },
            _setFocus: function () {
                (b.st.focus ? b.content.find(b.st.focus).eq(0) : b.wrap).focus()
            },
            _onFocusIn: function (c) {
                return c.target === b.wrap[0] || a.contains(b.wrap[0], c.target) ? void 0 : (b._setFocus(), !1)
            },
            _parseMarkup: function (b, c, d) {
                var e;
                d.data && (c = a.extend(d.data, c)), y(l, [b, c, d]), a.each(c, function (a, c) {
                    if (void 0 === c || c === !1) return !0;
                    if (e = a.split("_"), e.length > 1) {
                        var d = b.find(p + "-" + e[0]);
                        if (d.length > 0) {
                            var f = e[1];
                            "replaceWith" === f ? d[0] !== c[0] && d.replaceWith(c) : "img" === f ? d.is("img") ? d.attr("src", c) : d.replaceWith('<img src="' + c + '" class="' + d.attr("class") + '" />') : d.attr(e[1], c)
                        }
                    } else b.find(p + "-" + a).html(c)
                })
            },
            _getScrollbarSize: function () {
                if (void 0 === b.scrollbarSize) {
                    var a = document.createElement("div");
                    a.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;", document.body.appendChild(a), b.scrollbarSize = a.offsetWidth - a.clientWidth, document.body.removeChild(a)
                }
                return b.scrollbarSize
            }
        }, a.magnificPopup = {
            instance: null,
            proto: t.prototype,
            modules: [],
            open: function (b, c) {
                return A(), b = b ? a.extend(!0, {}, b) : {}, b.isObj = !0, b.index = c || 0, this.instance.open(b)
            },
            close: function () {
                return a.magnificPopup.instance && a.magnificPopup.instance.close()
            },
            registerModule: function (b, c) {
                c.options && (a.magnificPopup.defaults[b] = c.options), a.extend(this.proto, c.proto), this.modules.push(b)
            },
            defaults: {
                disableOn: 0,
                key: null,
                midClick: !1,
                mainClass: "",
                preloader: !0,
                focus: "",
                closeOnContentClick: !1,
                closeOnBgClick: !0,
                closeBtnInside: !0,
                showCloseBtn: !0,
                enableEscapeKey: !0,
                modal: !1,
                alignTop: !1,
                removalDelay: 0,
                prependTo: null,
                fixedContentPos: "auto",
                fixedBgPos: "auto",
                overflowY: "auto",
                closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>',
                tClose: "Close (Esc)",
                tLoading: "Loading..."
            }
        }, a.fn.magnificPopup = function (c) {
            A();
            var d = a(this);
            if ("string" == typeof c)
                if ("open" === c) {
                    var e, f = u ? d.data("magnificPopup") : d[0].magnificPopup,
                        g = parseInt(arguments[1], 10) || 0;
                    f.items ? e = f.items[g] : (e = d, f.delegate && (e = e.find(f.delegate)), e = e.eq(g)), b._openClick({
                        mfpEl: e
                    }, d, f)
                } else b.isOpen && b[c].apply(b, Array.prototype.slice.call(arguments, 1));
            else c = a.extend(!0, {}, c), u ? d.data("magnificPopup", c) : d[0].magnificPopup = c, b.addGroup(d, c);
            return d
        };
        var C, D, E, F = "inline",
            G = function () {
                E && (D.after(E.addClass(C)).detach(), E = null)
            };
        a.magnificPopup.registerModule(F, {
            options: {
                hiddenClass: "hide",
                markup: "",
                tNotFound: "Content not found"
            },
            proto: {
                initInline: function () {
                    b.types.push(F), w(h + "." + F, function () {
                        G()
                    })
                },
                getInline: function (c, d) {
                    if (G(), c.src) {
                        var e = b.st.inline,
                            f = a(c.src);
                        if (f.length) {
                            var g = f[0].parentNode;
                            g && g.tagName && (D || (C = e.hiddenClass, D = x(C), C = "mfp-" + C), E = f.after(D).detach().removeClass(C)), b.updateStatus("ready")
                        } else b.updateStatus("error", e.tNotFound), f = a("<div>");
                        return c.inlineElement = f, f
                    }
                    return b.updateStatus("ready"), b._parseMarkup(d, {}, c), d
                }
            }
        });
        var H, I = "ajax",
            J = function () {
                H && a(document.body).removeClass(H)
            },
            K = function () {
                J(), b.req && b.req.abort()
            };
        a.magnificPopup.registerModule(I, {
            options: {
                settings: null,
                cursor: "mfp-ajax-cur",
                tError: '<a href="%url%">The content</a> could not be loaded.'
            },
            proto: {
                initAjax: function () {
                    b.types.push(I), H = b.st.ajax.cursor, w(h + "." + I, K), w("BeforeChange." + I, K)
                },
                getAjax: function (c) {
                    H && a(document.body).addClass(H), b.updateStatus("loading");
                    var d = a.extend({
                        url: c.src,
                        success: function (d, e, f) {
                            var g = {
                                data: d,
                                xhr: f
                            };
                            y("ParseAjax", g), b.appendContent(a(g.data), I), c.finished = !0, J(), b._setFocus(), setTimeout(function () {
                                b.wrap.addClass(q)
                            }, 16), b.updateStatus("ready"), y("AjaxContentAdded")
                        },
                        error: function () {
                            J(), c.finished = c.loadError = !0, b.updateStatus("error", b.st.ajax.tError.replace("%url%", c.src))
                        }
                    }, b.st.ajax.settings);
                    return b.req = a.ajax(d), ""
                }
            }
        });
        var L, M = function (c) {
            if (c.data && void 0 !== c.data.title) return c.data.title;
            var d = b.st.image.titleSrc;
            if (d) {
                if (a.isFunction(d)) return d.call(b, c);
                if (c.el) return c.el.attr(d) || ""
            }
            return ""
        };
        a.magnificPopup.registerModule("image", {
            options: {
                markup: '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',
                cursor: "mfp-zoom-out-cur",
                titleSrc: "title",
                verticalFit: !0,
                tError: '<a href="%url%">The image</a> could not be loaded.'
            },
            proto: {
                initImage: function () {
                    var c = b.st.image,
                        d = ".image";
                    b.types.push("image"), w(m + d, function () {
                        "image" === b.currItem.type && c.cursor && a(document.body).addClass(c.cursor)
                    }), w(h + d, function () {
                        c.cursor && a(document.body).removeClass(c.cursor), v.off("resize" + p)
                    }), w("Resize" + d, b.resizeImage), b.isLowIE && w("AfterChange", b.resizeImage)
                },
                resizeImage: function () {
                    var a = b.currItem;
                    if (a && a.img && b.st.image.verticalFit) {
                        var c = 0;
                        b.isLowIE && (c = parseInt(a.img.css("padding-top"), 10) + parseInt(a.img.css("padding-bottom"), 10)), a.img.css("max-height", b.wH - c)
                    }
                },
                _onImageHasSize: function (a) {
                    a.img && (a.hasSize = !0, L && clearInterval(L), a.isCheckingImgSize = !1, y("ImageHasSize", a), a.imgHidden && (b.content && b.content.removeClass("mfp-loading"), a.imgHidden = !1))
                },
                findImageSize: function (a) {
                    var c = 0,
                        d = a.img[0],
                        e = function (f) {
                            L && clearInterval(L), L = setInterval(function () {
                                return d.naturalWidth > 0 ? void b._onImageHasSize(a) : (c > 200 && clearInterval(L), c++ , void (3 === c ? e(10) : 40 === c ? e(50) : 100 === c && e(500)))
                            }, f)
                        };
                    e(1)
                },
                getImage: function (c, d) {
                    var e = 0,
                        f = function () {
                            c && (c.img[0].complete ? (c.img.off(".mfploader"), c === b.currItem && (b._onImageHasSize(c), b.updateStatus("ready")), c.hasSize = !0, c.loaded = !0, y("ImageLoadComplete")) : (e++ , 200 > e ? setTimeout(f, 100) : g()))
                        },
                        g = function () {
                            c && (c.img.off(".mfploader"), c === b.currItem && (b._onImageHasSize(c), b.updateStatus("error", h.tError.replace("%url%", c.src))), c.hasSize = !0, c.loaded = !0, c.loadError = !0)
                        },
                        h = b.st.image,
                        i = d.find(".mfp-img");
                    if (i.length) {
                        var j = document.createElement("img");
                        j.className = "mfp-img", c.el && c.el.find("img").length && (j.alt = c.el.find("img").attr("alt")), c.img = a(j).on("load.mfploader", f).on("error.mfploader", g), j.src = c.src, i.is("img") && (c.img = c.img.clone()), j = c.img[0], j.naturalWidth > 0 ? c.hasSize = !0 : j.width || (c.hasSize = !1)
                    }
                    return b._parseMarkup(d, {
                        title: M(c),
                        img_replaceWith: c.img
                    }, c), b.resizeImage(), c.hasSize ? (L && clearInterval(L), c.loadError ? (d.addClass("mfp-loading"), b.updateStatus("error", h.tError.replace("%url%", c.src))) : (d.removeClass("mfp-loading"), b.updateStatus("ready")), d) : (b.updateStatus("loading"), c.loading = !0, c.hasSize || (c.imgHidden = !0, d.addClass("mfp-loading"), b.findImageSize(c)), d)
                }
            }
        });
        var N, O = function () {
            return void 0 === N && (N = void 0 !== document.createElement("p").style.MozTransform), N
        };
        a.magnificPopup.registerModule("zoom", {
            options: {
                enabled: !1,
                easing: "ease-in-out",
                duration: 300,
                opener: function (a) {
                    return a.is("img") ? a : a.find("img")
                }
            },
            proto: {
                initZoom: function () {
                    var a, c = b.st.zoom,
                        d = ".zoom";
                    if (c.enabled && b.supportsTransition) {
                        var e, f, g = c.duration,
                            j = function (a) {
                                var b = a.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),
                                    d = "all " + c.duration / 1e3 + "s " + c.easing,
                                    e = {
                                        position: "fixed",
                                        zIndex: 9999,
                                        left: 0,
                                        top: 0,
                                        "-webkit-backface-visibility": "hidden"
                                    },
                                    f = "transition";
                                return e["-webkit-" + f] = e["-moz-" + f] = e["-o-" + f] = e[f] = d, b.css(e), b
                            },
                            k = function () {
                                b.content.css("visibility", "visible")
                            };
                        w("BuildControls" + d, function () {
                            if (b._allowZoom()) {
                                if (clearTimeout(e), b.content.css("visibility", "hidden"), a = b._getItemToZoom(), !a) return void k();
                                f = j(a), f.css(b._getOffset()), b.wrap.append(f), e = setTimeout(function () {
                                    f.css(b._getOffset(!0)), e = setTimeout(function () {
                                        k(), setTimeout(function () {
                                            f.remove(), a = f = null, y("ZoomAnimationEnded")
                                        }, 16)
                                    }, g)
                                }, 16)
                            }
                        }), w(i + d, function () {
                            if (b._allowZoom()) {
                                if (clearTimeout(e), b.st.removalDelay = g, !a) {
                                    if (a = b._getItemToZoom(), !a) return;
                                    f = j(a)
                                }
                                f.css(b._getOffset(!0)), b.wrap.append(f), b.content.css("visibility", "hidden"), setTimeout(function () {
                                    f.css(b._getOffset())
                                }, 16)
                            }
                        }), w(h + d, function () {
                            b._allowZoom() && (k(), f && f.remove(), a = null)
                        })
                    }
                },
                _allowZoom: function () {
                    return "image" === b.currItem.type
                },
                _getItemToZoom: function () {
                    return b.currItem.hasSize ? b.currItem.img : !1
                },
                _getOffset: function (c) {
                    var d;
                    d = c ? b.currItem.img : b.st.zoom.opener(b.currItem.el || b.currItem);
                    var e = d.offset(),
                        f = parseInt(d.css("padding-top"), 10),
                        g = parseInt(d.css("padding-bottom"), 10);
                    e.top -= a(window).scrollTop() - f;
                    var h = {
                        width: d.width(),
                        height: (u ? d.innerHeight() : d[0].offsetHeight) - g - f
                    };
                    return O() ? h["-moz-transform"] = h.transform = "translate(" + e.left + "px," + e.top + "px)" : (h.left = e.left, h.top = e.top), h
                }
            }
        });
        var P = "iframe",
            Q = "//about:blank",
            R = function (a) {
                if (b.currTemplate[P]) {
                    var c = b.currTemplate[P].find("iframe");
                    c.length && (a || (c[0].src = Q), b.isIE8 && c.css("display", a ? "block" : "none"))
                }
            };
        a.magnificPopup.registerModule(P, {
            options: {
                markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',
                srcAction: "iframe_src",
                patterns: {
                    youtube: {
                        index: "youtube.com",
                        id: "v=",
                        src: "//www.youtube.com/embed/%id%?autoplay=1"
                    },
                    vimeo: {
                        index: "vimeo.com/",
                        id: "/",
                        src: "//player.vimeo.com/video/%id%?autoplay=1"
                    },
                    gmaps: {
                        index: "//maps.google.",
                        src: "%id%&output=embed"
                    }
                }
            },
            proto: {
                initIframe: function () {
                    b.types.push(P), w("BeforeChange", function (a, b, c) {
                        b !== c && (b === P ? R() : c === P && R(!0))
                    }), w(h + "." + P, function () {
                        R()
                    })
                },
                getIframe: function (c, d) {
                    var e = c.src,
                        f = b.st.iframe;
                    a.each(f.patterns, function () {
                        return e.indexOf(this.index) > -1 ? (this.id && (e = "string" == typeof this.id ? e.substr(e.lastIndexOf(this.id) + this.id.length, e.length) : this.id.call(this, e)), e = this.src.replace("%id%", e), !1) : void 0
                    });
                    var g = {};
                    return f.srcAction && (g[f.srcAction] = e), b._parseMarkup(d, g, c), b.updateStatus("ready"), d
                }
            }
        });
        var S = function (a) {
            var c = b.items.length;
            return a > c - 1 ? a - c : 0 > a ? c + a : a
        },
            T = function (a, b, c) {
                return a.replace(/%curr%/gi, b + 1).replace(/%total%/gi, c)
            };
        a.magnificPopup.registerModule("gallery", {
            options: {
                enabled: !1,
                arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
                preload: [0, 2],
                navigateByImgClick: !0,
                arrows: !0,
                tPrev: "Previous (Left arrow key)",
                tNext: "Next (Right arrow key)",
                tCounter: "%curr% of %total%"
            },
            proto: {
                initGallery: function () {
                    var c = b.st.gallery,
                        e = ".mfp-gallery",
                        g = Boolean(a.fn.mfpFastClick);
                    return b.direction = !0, c && c.enabled ? (f += " mfp-gallery", w(m + e, function () {
                        c.navigateByImgClick && b.wrap.on("click" + e, ".mfp-img", function () {
                            return b.items.length > 1 ? (b.next(), !1) : void 0
                        }), d.on("keydown" + e, function (a) {
                            37 === a.keyCode ? b.prev() : 39 === a.keyCode && b.next()
                        })
                    }), w("UpdateStatus" + e, function (a, c) {
                        c.text && (c.text = T(c.text, b.currItem.index, b.items.length))
                    }), w(l + e, function (a, d, e, f) {
                        var g = b.items.length;
                        e.counter = g > 1 ? T(c.tCounter, f.index, g) : ""
                    }), w("BuildControls" + e, function () {
                        if (b.items.length > 1 && c.arrows && !b.arrowLeft) {
                            var d = c.arrowMarkup,
                                e = b.arrowLeft = a(d.replace(/%title%/gi, c.tPrev).replace(/%dir%/gi, "left")).addClass(s),
                                f = b.arrowRight = a(d.replace(/%title%/gi, c.tNext).replace(/%dir%/gi, "right")).addClass(s),
                                h = g ? "mfpFastClick" : "click";
                            e[h](function () {
                                b.prev()
                            }), f[h](function () {
                                b.next()
                            }), b.isIE7 && (x("b", e[0], !1, !0), x("a", e[0], !1, !0), x("b", f[0], !1, !0), x("a", f[0], !1, !0)), b.container.append(e.add(f))
                        }
                    }), w(n + e, function () {
                        b._preloadTimeout && clearTimeout(b._preloadTimeout), b._preloadTimeout = setTimeout(function () {
                            b.preloadNearbyImages(), b._preloadTimeout = null
                        }, 16)
                    }), void w(h + e, function () {
                        d.off(e), b.wrap.off("click" + e), b.arrowLeft && g && b.arrowLeft.add(b.arrowRight).destroyMfpFastClick(), b.arrowRight = b.arrowLeft = null
                    })) : !1
                },
                next: function () {
                    b.direction = !0, b.index = S(b.index + 1), b.updateItemHTML()
                },
                prev: function () {
                    b.direction = !1, b.index = S(b.index - 1), b.updateItemHTML()
                },
                goTo: function (a) {
                    b.direction = a >= b.index, b.index = a, b.updateItemHTML()
                },
                preloadNearbyImages: function () {
                    var a, c = b.st.gallery.preload,
                        d = Math.min(c[0], b.items.length),
                        e = Math.min(c[1], b.items.length);
                    for (a = 1; a <= (b.direction ? e : d); a++) b._preloadItem(b.index + a);
                    for (a = 1; a <= (b.direction ? d : e); a++) b._preloadItem(b.index - a)
                },
                _preloadItem: function (c) {
                    if (c = S(c), !b.items[c].preloaded) {
                        var d = b.items[c];
                        d.parsed || (d = b.parseEl(c)), y("LazyLoad", d), "image" === d.type && (d.img = a('<img class="mfp-img" />').on("load.mfploader", function () {
                            d.hasSize = !0
                        }).on("error.mfploader", function () {
                            d.hasSize = !0, d.loadError = !0, y("LazyLoadError", d)
                        }).attr("src", d.src)), d.preloaded = !0
                    }
                }
            }
        });
        var U = "retina";
        a.magnificPopup.registerModule(U, {
            options: {
                replaceSrc: function (a) {
                    return a.src.replace(/\.\w+$/, function (a) {
                        return "@2x" + a
                    })
                },
                ratio: 1
            },
            proto: {
                initRetina: function () {
                    if (window.devicePixelRatio > 1) {
                        var a = b.st.retina,
                            c = a.ratio;
                        c = isNaN(c) ? c() : c, c > 1 && (w("ImageHasSize." + U, function (a, b) {
                            b.img.css({
                                "max-width": b.img[0].naturalWidth / c,
                                width: "100%"
                            })
                        }), w("ElementParse." + U, function (b, d) {
                            d.src = a.replaceSrc(d, c)
                        }))
                    }
                }
            }
        }),
            function () {
                var b = 1e3,
                    c = "ontouchstart" in window,
                    d = function () {
                        v.off("touchmove" + f + " touchend" + f)
                    },
                    e = "mfpFastClick",
                    f = "." + e;
                a.fn.mfpFastClick = function (e) {
                    return a(this).each(function () {
                        var g, h = a(this);
                        if (c) {
                            var i, j, k, l, m, n;
                            h.on("touchstart" + f, function (a) {
                                l = !1, n = 1, m = a.originalEvent ? a.originalEvent.touches[0] : a.touches[0], j = m.clientX, k = m.clientY, v.on("touchmove" + f, function (a) {
                                    m = a.originalEvent ? a.originalEvent.touches : a.touches, n = m.length, m = m[0], (Math.abs(m.clientX - j) > 10 || Math.abs(m.clientY - k) > 10) && (l = !0, d())
                                }).on("touchend" + f, function (a) {
                                    d(), l || n > 1 || (g = !0, a.preventDefault(), clearTimeout(i), i = setTimeout(function () {
                                        g = !1
                                    }, b), e())
                                })
                            })
                        }
                        h.on("click" + f, function () {
                            g || e()
                        })
                    })
                }, a.fn.destroyMfpFastClick = function () {
                    a(this).off("touchstart" + f + " click" + f), c && v.off("touchmove" + f + " touchend" + f)
                }
            }(), A()
    }),
    function (a) {
        function b() {
            var a = arguments[0],
                c = b.cache;
            return c[a] && c.hasOwnProperty(a) || (c[a] = b.parse(a)), b.format.call(null, c[a], arguments)
        }

        function c(a) {
            return Object.prototype.toString.call(a).slice(8, -1).toLowerCase()
        }

        function d(a, b) {
            return Array(b + 1).join(a)
        }
        var e = {
            not_string: /[^s]/,
            number: /[diefg]/,
            json: /[j]/,
            not_json: /[^j]/,
            text: /^[^\x25]+/,
            modulo: /^\x25{2}/,
            placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijosuxX])/,
            key: /^([a-z_][a-z_\d]*)/i,
            key_access: /^\.([a-z_][a-z_\d]*)/i,
            index_access: /^\[(\d+)\]/,
            sign: /^[\+\-]/
        };
        b.format = function (a, f) {
            var g, h, i, j, k, l, m, n = 1,
                o = a.length,
                p = "",
                q = [],
                r = !0,
                s = "";
            for (h = 0; o > h; h++)
                if (p = c(a[h]), "string" === p) q[q.length] = a[h];
                else if ("array" === p) {
                    if (j = a[h], j[2])
                        for (g = f[n], i = 0; i < j[2].length; i++) {
                            if (!g.hasOwnProperty(j[2][i])) throw new Error(b("[sprintf] property '%s' does not exist", j[2][i]));
                            g = g[j[2][i]]
                        } else g = j[1] ? f[j[1]] : f[n++];
                    if ("function" == c(g) && (g = g()), e.not_string.test(j[8]) && e.not_json.test(j[8]) && "number" != c(g) && isNaN(g)) throw new TypeError(b("[sprintf] expecting number but found %s", c(g)));
                    switch (e.number.test(j[8]) && (r = g >= 0), j[8]) {
                        case "b":
                            g = g.toString(2);
                            break;
                        case "c":
                            g = String.fromCharCode(g);
                            break;
                        case "d":
                        case "i":
                            g = parseInt(g, 10);
                            break;
                        case "j":
                            g = JSON.stringify(g, null, j[6] ? parseInt(j[6]) : 0);
                            break;
                        case "e":
                            g = j[7] ? g.toExponential(j[7]) : g.toExponential();
                            break;
                        case "f":
                            g = j[7] ? parseFloat(g).toFixed(j[7]) : parseFloat(g);
                            break;
                        case "g":
                            g = j[7] ? parseFloat(g).toPrecision(j[7]) : parseFloat(g);
                            break;
                        case "o":
                            g = g.toString(8);
                            break;
                        case "s":
                            g = (g = String(g)) && j[7] ? g.substring(0, j[7]) : g;
                            break;
                        case "u":
                            g >>>= 0;
                            break;
                        case "x":
                            g = g.toString(16);
                            break;
                        case "X":
                            g = g.toString(16).toUpperCase()
                    }
                    e.json.test(j[8]) ? q[q.length] = g : (!e.number.test(j[8]) || r && !j[3] ? s = "" : (s = r ? "+" : "-", g = g.toString().replace(e.sign, "")), l = j[4] ? "0" === j[4] ? "0" : j[4].charAt(1) : " ", m = j[6] - (s + g).length, k = j[6] && m > 0 ? d(l, m) : "", q[q.length] = j[5] ? s + g + k : "0" === l ? s + k + g : k + s + g)
                }
            return q.join("")
        }, b.cache = {}, b.parse = function (a) {
            for (var b = a, c = [], d = [], f = 0; b;) {
                if (null !== (c = e.text.exec(b))) d[d.length] = c[0];
                else if (null !== (c = e.modulo.exec(b))) d[d.length] = "%";
                else {
                    if (null === (c = e.placeholder.exec(b))) throw new SyntaxError("[sprintf] unexpected placeholder");
                    if (c[2]) {
                        f |= 1;
                        var g = [],
                            h = c[2],
                            i = [];
                        if (null === (i = e.key.exec(h))) throw new SyntaxError("[sprintf] failed to parse named argument key");
                        for (g[g.length] = i[1];
                            "" !== (h = h.substring(i[0].length));)
                            if (null !== (i = e.key_access.exec(h))) g[g.length] = i[1];
                            else {
                                if (null === (i = e.index_access.exec(h))) throw new SyntaxError("[sprintf] failed to parse named argument key");
                                g[g.length] = i[1]
                            }
                        c[2] = g
                    } else f |= 2;
                    if (3 === f) throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported");
                    d[d.length] = c
                }
                b = b.substring(c[0].length)
            }
            return d
        };
        var f = function (a, c, d) {
            return d = (c || []).slice(0), d.splice(0, 0, a), b.apply(null, d)
        };
        "undefined" != typeof exports ? (exports.sprintf = b, exports.vsprintf = f) : (a.sprintf = b, a.vsprintf = f, "function" == typeof define && define.amd && define(function () {
            return {
                sprintf: b,
                vsprintf: f
            }
        }))
    }("undefined" == typeof window ? this : window),
    function () {
        "use strict";
        var a, b, c, d = function (a, b) {
            return function () {
                return a.apply(b, arguments)
            }
        };
        a = jQuery, b = function () {
            function a() { }
            return a.transitions = {
                webkitTransition: "webkitTransitionEnd",
                mozTransition: "mozTransitionEnd",
                oTransition: "oTransitionEnd",
                transition: "transitionend"
            }, a.transition = function (a) {
                var b, c, d, e;
                b = a[0], c = this.transitions;
                for (e in c)
                    if (d = c[e], null != b.style[e]) return d
            }, a
        }(), c = function () {
            function c(b) {
                null == b && (b = {}), this.container = d(this.container, this), this.content = d(this.content, this), this.html = d(this.html, this), this.$growl = d(this.$growl, this), this.$growls = d(this.$growls, this), this.animate = d(this.animate, this), this.remove = d(this.remove, this), this.dismiss = d(this.dismiss, this), this.present = d(this.present, this), this.waitAndDismiss = d(this.waitAndDismiss, this), this.cycle = d(this.cycle, this), this.close = d(this.close, this), this.click = d(this.click, this), this.mouseLeave = d(this.mouseLeave, this), this.mouseEnter = d(this.mouseEnter, this), this.unbind = d(this.unbind, this), this.bind = d(this.bind, this), this.render = d(this.render, this), this.settings = a.extend({}, c.settings, b), this.$growls().attr("class", this.settings.location), this.render()
            }
            return c.settings = {
                namespace: "growl",
                duration: 3200,
                close: "&#215;",
                location: "default",
                style: "default",
                size: "medium",
                delayOnHover: !0
            }, c.growl = function (a) {
                return null == a && (a = {}), this.initialize(), new c(a)
            }, c.initialize = function () {
                return a("body:not(:has(#growls))").append('<div id="growls" />')
            }, c.prototype.render = function () {
                var a;
                a = this.$growl(), this.$growls().append(a), this.settings.fixed ? this.present() : this.cycle()
            }, c.prototype.bind = function (a) {
                return null == a && (a = this.$growl()), a.on("click", this.click), this.settings.delayOnHover && (a.on("mouseenter", this.mouseEnter), a.on("mouseleave", this.mouseLeave)), a.on("contextmenu", this.close).find("." + this.settings.namespace + "-close").on("click", this.close)
            }, c.prototype.unbind = function (a) {
                return null == a && (a = this.$growl()), a.off("click", this.click), this.settings.delayOnHover && (a.off("mouseenter", this.mouseEnter), a.off("mouseleave", this.mouseLeave)), a.off("contextmenu", this.close).find("." + this.settings.namespace + "-close").off("click", this.close)
            }, c.prototype.mouseEnter = function (a) {
                var b;
                return b = this.$growl(), b.stop(!0, !0)
            }, c.prototype.mouseLeave = function (a) {
                return this.waitAndDismiss()
            }, c.prototype.click = function (a) {
                return null != this.settings.url ? (a.preventDefault(), a.stopPropagation(), window.open(this.settings.url)) : void 0
            }, c.prototype.close = function (a) {
                var b;
                return a.preventDefault(), a.stopPropagation(), b = this.$growl(), b.stop().queue(this.dismiss).queue(this.remove)
            }, c.prototype.cycle = function () {
                var a;
                return a = this.$growl(), a.queue(this.present).queue(this.waitAndDismiss())
            }, c.prototype.waitAndDismiss = function () {
                var a;
                return a = this.$growl(), a.delay(this.settings.duration).queue(this.dismiss).queue(this.remove)
            }, c.prototype.present = function (a) {
                var b;
                return b = this.$growl(), this.bind(b), this.animate(b, this.settings.namespace + "-incoming", "out", a)
            }, c.prototype.dismiss = function (a) {
                var b;
                return b = this.$growl(), this.unbind(b), this.animate(b, this.settings.namespace + "-outgoing", "in", a)
            }, c.prototype.remove = function (a) {
                return this.$growl().remove(), "function" == typeof a ? a() : void 0
            }, c.prototype.animate = function (a, c, d, e) {
                var f;
                null == d && (d = "in"), f = b.transition(a), a["in" === d ? "removeClass" : "addClass"](c), a.offset().position, a["in" === d ? "addClass" : "removeClass"](c), null != e && (null != f ? a.one(f, e) : e())
            }, c.prototype.$growls = function () {
                return null != this.$_growls ? this.$_growls : this.$_growls = a("#growls")
            }, c.prototype.$growl = function () {
                return null != this.$_growl ? this.$_growl : this.$_growl = a(this.html())
            }, c.prototype.html = function () {
                return this.container(this.content())
            }, c.prototype.content = function () {
                return "<div class='" + this.settings.namespace + "-close'>" + this.settings.close + "</div>\n<div class='" + this.settings.namespace + "-title'>" + this.settings.title + "</div>\n<div class='" + this.settings.namespace + "-message'>" + this.settings.message + "</div>"
            }, c.prototype.container = function (a) {
                return "<div class='" + this.settings.namespace + " " + this.settings.namespace + "-" + this.settings.style + " " + this.settings.namespace + "-" + this.settings.size + "'>\n  " + a + "\n</div>"
            }, c
        }(), this.Growl = c, a.growl = function (a) {
            return null == a && (a = {}), c.growl(a)
        }, a.growl.error = function (b) {
            var c;
            return null == b && (b = {}), c = {
                title: "Error!",
                style: "error"
            }, a.growl(a.extend(c, b))
        }, a.growl.notice = function (b) {
            var c;
            return null == b && (b = {}), c = {
                title: "Notice!",
                style: "notice"
            }, a.growl(a.extend(c, b))
        }, a.growl.warning = function (b) {
            var c;
            return null == b && (b = {}), c = {
                title: "Warning!",
                style: "warning"
            }, a.growl(a.extend(c, b))
        }
    }.call(this);
var Popup = {};
Popup.markAsPopup = function (a) {
    function b() {
        var b = a.getPosition(a.targetBtn, a.popupWindow);
        a.popupWindow.css(b), a.popupWindow.show(), a.onClick()
    }
    return a.getPosition || (a.getPosition = function (a) {
        var b = a.offset();
        return {
            top: b.top + a.outerHeight(),
            left: b.left
        }
    }), $(document).mouseup(function (b) {
        a.popupWindow.is(b.target) || 0 !== a.popupWindow.has(b.target).length || a.targetBtn.is(b.target) || 0 !== a.targetBtn.has(b.target).length || a.popupWindow.hide()
    }), $(a.targetBtn).click(function () {
        a.popupWindow.is(":visible") ? a.popupWindow.hide() : b()
    }), a.openPopupNow && b(), a.popupWindow
}, Popup.openPartial = function (a, b, c, d) {
    $.magnificPopup.open({
        items: {
            src: a
        },
        type: "ajax",
        ajax: {
            settings: {
                type: "post",
                data: d || {
                    something: "something"
                }
            }
        },
        closeOnBgClick: !1,
        callbacks: {
            open: function () {
                b && setTimeout(function () {
                    b()
                }, 800)
            },
            close: function () {
                c && c()
            }
        },
        midClick: !0
    })
};
var ContextPopup = {
    _pops: {
        $favoriteNote: !1,
        $playlistPop: !1,
        $sharePop: !1,
        $rhythmPop: !1
    },
    setPopup: function (a, b, c, d, e, f) {
        var g = this._pops[b] = this._pops[b] || $('<div class="popup-window"><div class="loading-block"></div></div>');
        return $("body").append(g), Popup.markAsPopup({
            targetBtn: a,
            popupWindow: g,
            openPopupNow: f,
            getPosition: e,
            onClick: function () {
                PartialFactory.load(g, c, {
                    something: "something"
                }).done(function () {
                    g.is(":visible") && d && d()
                })
            }
        })
    }
},
    Hash = {
        _onHashChangeEvent: !1,
        _toQueryString: function (a) {
            for (var b = Object.keys(a), c = "", d = 0; d < b.length; d++) c += "&" + b[d] + "=" + a[b[d]];
            return c.substring(1)
        },
        getParams: function () {
            for (var a = {}, b = window.location.hash.substring(1), c = b.split("&"), d = 0; d < c.length; d++) {
                var e = c[d].split("=");
                e[0] && (a[e[0]] = e[1])
            }
            return a
        },
        setParam: function (a, b) {
            var c = this.getParams();
            c[a] = b, location.hash = this._toQueryString(c)
        },
        removeParam: function (a) {
            var b = this.getParams();
            delete b[a], location.hash = this._toQueryString(b)
        },
        onParamChange: function (a, b) {
            var c = this;
            this._onHashChangeEvent || (c._hashParams = this.getParams(), this._onHashChangeEvent = function () {
                var d = c.getParams(),
                    e = Object.keys(d);
                e.indexOf(a) > -1 && c._hashParams[a] != d[a] && b && b(a, d[a]), c._hashParams = d
            }, $(window).bind("hashchange", this._onHashChangeEvent))
        }
    },
    indexOf;
indexOf = "function" == typeof Array.prototype.indexOf ? function (a, b) {
    return a.indexOf(b)
} : function (a, b) {
    for (var c = 0, d = a.length, e = -1, f = !1; d > c && !f;) a[c] === b && (e = c, f = !0), c++;
    return e
};
var EventEmitter = function () {
    this.events = {}
};
EventEmitter.prototype.on = function (a, b) {
    "object" != typeof this.events[a] && (this.events[a] = []), this.events[a].push(b)
}, EventEmitter.prototype.removeListener = function (a, b) {
    var c;
    "object" == typeof this.events[a] && (c = indexOf(this.events[a], b), c > -1 && this.events[a].splice(c, 1))
}, EventEmitter.prototype.emit = function (a) {
    var b, c, d, e = [].slice.call(arguments, 1);
    if ("object" == typeof this.events[a])
        for (c = this.events[a].slice(), d = c.length, b = 0; d > b; b++) c[b].apply(this, e)
}, EventEmitter.prototype.once = function (a, b) {
    this.on(a, function c() {
        this.removeListener(a, c), b.apply(this, arguments)
    })
}, $.when($.ready).then(function () {
    function a() {
        var a = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
        return clearTimeout(window.debounceTimer), new Promise(function (b) {
            window.debounceTimer = setTimeout(b, a)
        })
    }

    function b(b) {
        var d = function () {
            return a(200).then(function () {
                return window.LocalSearch.search(b)
            })
        },
            e = function () {
                return a(500).then(function () {
                    return AjaxFactory.post("/ajax/ajax_song/search_autocomplete", {
                        keyword: b
                    })
                }).then(function (a) {
                    return a.data
                })
            };
        if (c && window.LocalSearch && !window.__IS_MOBILE) try {
            return window.LocalSearch.isReady().then(function (a) {
                return a ? d() : e()
            })
        } catch (f) {
            return console.error(f), e()
        }
        return e()
    }
    var c = !1,
        d = $("#ac-selected-item").html(),
        e = -1,
        f = "";
    $(".auto-complete-box").keyup(function (a) {
        function c() {
            h.slideUp(), h.find("#see-all").fadeOut(), e = -1
        }
        var g = $(this),
            h = $("#global-auto-complete-box");
        h.attr("target", g[0].id);
        var i = function () {
            h.css({
                left: g.offset().left,
                top: g.offset().top + g.outerHeight() - 7,
                width: g.outerWidth()
            })
        };
        if ($._data(window, "events") && $._data(window, "events").resize) {
            var j = $._data(window, "events").resize;
            $(j).each(function (a) {
                j[a].handler.name == i.name && $(window).off("resize", j[a].handler)
            })
        }
        $(window).on("resize", i), i();
        var k = $(this).val();
        if (38 == a.keyCode || 40 == a.keyCode || 27 == a.keyCode) {
            if (h.is(":visible")) {
                if (-1 == e && 27 == a.keyCode) return void c();
                a.preventDefault();
                var l = h.find(".autocomplete-result");
                38 == a.keyCode && e-- , 40 == a.keyCode && e++ , -2 == e && (e = l.length - 1), (e == l.length || -1 == e) && (e = -1), 27 == a.keyCode && (e = -1), l.removeClass("selected"), e > -1 ? ($(l[e]).addClass("selected"), $("#ac-selected-item").html("<b>" + $(l[e]).find(".ac-title-text").text() + "</b>")) : $("#ac-selected-item").html(d)
            }
        } else if (13 == a.keyCode) {
            var m = h.find(".autocomplete-result.selected");
            m[0] ? location.href = $(m[0]).find("a").attr("href") : k.length > 0 && (c(), location.href = "search?q=" + k.replace("#", "%23"))
        } else {
            var n = $(this);
            if ("" == k) c();
            else {
                if (k === f) return;
                f = k, b(k).then(function (a) {
                    var b = a;
                    if ("" != n.val()) {
                        var c = $("#auto-complete-result-template").html(),
                            d = "";
                        if (b.length > 0)
                            for (var e = 0; e < b.length; e++) d += TemplateEngine.render(b[e], c);
                        else d = "<div class='no-result'>" + lang("search.no.result.message.autocomplete") + "</div>";
                        h.find("#ac-results").html(d), h.slideDown(), h.find("#see-all").fadeIn()
                    }
                })
            }
        }
    })
}), $.when($.ready).then(function () {
    var a = $("#btn-more"),
        b = $("#btn-more-content");
    if (0 !== a.length && 0 !== b) {
        Popup.markAsPopup({
            targetBtn: a,
            popupWindow: b,
            onClick: function () { },
            getPosition: function (a, b) {
                return {
                    left: a.offset().left - b.outerWidth() + 15,
                    top: a.offset().top + a.outerHeight() + 10
                }
            }
        });
        var c = [lang("search.placeholder.1"), lang("search.placeholder.2"), lang("search.placeholder.3"), lang("search.placeholder.4"), lang("search.placeholder.5")],
            d = c[Math.floor(Math.random() * c.length)];
        if ($("#nav-search-bar").attr("placeholder", d), "webkitSpeechRecognition" in window) {
            var e = !0,
                f = new webkitSpeechRecognition;
            f.lang = "vi-VN", f.continuous = !1, f.interimResults = !0, f.onstart = function () {
                e = !0
            }, f.onresult = function (a) {
                for (var b = "", c = $("#nav-search-bar").val(), d = a.resultIndex; d < a.results.length; ++d) a.results[d].isFinal ? c += a.results[d][0].transcript : b += a.results[d][0].transcript;
                $(".voice-input-candidate").text(b), $("#nav-search-bar").val(c)
            }, f.onerror = function (a) {
                e = !1, "not-allowed" === a.error && (localStorage.setItem("confirmed_microphone", !1), alert(lang("please.enable.microphone")))
            }, f.onend = function () {
                $(".voice-input").removeClass("active");
                var a = $("#nav-search-bar").val().replace("#", "%23");
                $(".voice-input-candidate").text(""), a && (location.href = "search?confident=1&q=" + a)
            }, $("#top-search-bar").addClass("with-voice-input"), $("#mobile-search-input").addClass("with-voice-input"), $(".voice-input").mouseup(function () {
                $(this).hasClass("active") ? (f.stop(), $(this).removeClass("active")) : ("true" === localStorage.getItem("confirmed_microphone") || confirm(lang("this.feature.require.microphone"))) && (localStorage.setItem("confirmed_microphone", !0), f.start(), $(".voice-input-candidate").text(lang("listening")), $("#nav-search-bar").val(""), $(this).addClass("active"))
            })
        }
        if ($(".global-notification").length) {
            $notification = $(".global-notification");
            var g = $notification.attr("data-id"),
                h = new Date($notification.attr("data-expiry-date")),
                i = localStorage.getItem("dismissed_" + g);
            !i && h.getTime() > (new Date).getTime() && $notification.show(), $notification.find(".notification-close").click(function () {
                localStorage.setItem("dismissed_" + g, !0), $notification.fadeOut()
            })
        }
    }
}), $.when($.ready).then(function () {
    var a = $("#profile-inbox");
    if (0 !== a.length) var b = ContextPopup.setPopup(a, "$notifPop", "partial/notification_partial/user_notifications", function () {
        b.addClass("notification-box");
        var c = a.offset().left - b.outerWidth() + 40;
        b.css({
            top: a.offset().top - a.outerHeight() + 60,
            left: 0 > c ? 0 : c,
            display: "block"
        }), initNotificationBox()
    }, function () {
        var c = a.offset().left - b.outerWidth() + 40;
        return {
            top: a.offset().top - a.outerHeight() + 60,
            left: 0 > c ? 0 : c
        }
    })
}), $.when($.ready).then(function () {
    function a() {
        AjaxFactory.post("ajax/ajax_notification/mark_scores_all_as_read", {
            something: "here"
        }), $("#scores-mark-all-as-read").click(function () {
            $("#user-unread-scores .scores-items").fadeOut(), $(".transaction-item.un-seen").removeClass("un-seen")
        })
    }
    var b = $("#user-unread-scores");
    if (0 !== b.length) var c = ContextPopup.setPopup(b, "$scorePop", "partial/notification_partial/user_scores", function () {
        c.addClass("notification-box");
        var d = b.offset().left - c.outerWidth() + 40;
        c.css({
            top: b.offset().top - b.outerHeight() + 60,
            left: 0 > d ? 0 : d,
            display: "block"
        }), a()
    }, function () {
        var a = b.offset().left - c.outerWidth() + 40;
        return {
            top: b.offset().top - b.outerHeight() + 60,
            left: 0 > a ? 0 : a
        }
    })
});
var currentAmount = 0,
    timeoutSaveSetting, settings = {},
    instrument = "guitar";
window.saveSongSetting = function () {
    var a = $("#song-info").data("song-id");
    settings = {
        song_id: a,
        transpose: $("#tool-box-trans-adj").val(),
        simplify_chords: $("#tool-box-easy-toggle").hasClass("on")
    }, window.__LOGGED_IN ? (clearTimeout(timeoutSaveSetting), timeoutSaveSetting = setTimeout(function () {
        AjaxFactory.post("/ajax/ajax_song/save_setting", settings).done(function (a) { })
    }, 1e3)) : localStorage.setItem("song" + a, JSON.stringify(settings))
}, window.changeAllChord = function (a) {
    var b = $("#tool-box-trans-adj");
    $("span.hopamchuan_chord").each(function () {
        var b = $(this);
        b.html(transposeChord(b.html(), a))
    }), currentAmount += a, 12 == currentAmount && (currentAmount = 0), -1 == currentAmount && (currentAmount = 11), b.val(currentAmount), $(".draw-chord").each(function () {
        $(this).attr("data-value", transposeChord($(this).attr("data-value"), a))
    }), refreshDisplayingChords(), saveSongSetting && saveSongSetting()
}, window.simplifyAllChords = function (a) {
    a ? $("#song-lyric .pre").addClass("inline") : $("#song-lyric .pre").removeClass("inline"), refreshDisplayingChords()
};
var _refreshDisplayingChordsTimer;
window.refreshDisplayingChords = function () {
    clearTimeout(_refreshDisplayingChordsTimer), _refreshDisplayingChordsTimer = setTimeout(function () {
        return refreshDisplayingChordsExecute()
    }, 100)
}, window.refreshDisplayingChordsExecute = function () {
    $(".draw-chord").each(function () {
        ChordJS.render(this, $(this).attr("data-value"), void 0, window.instrument)
    })
};
var _fixChordPositionsTimer;
window.fixChordPositions = function () {
    $("#song-lyric .pre").hasClass("inline") || (clearTimeout(_fixChordPositionsTimer), _fixChordPositionsTimer = setTimeout(function () {
        return fixChordPositionsExecute()
    }, 200))
}, window.fixChordPositionsExecute = function () {
    $("#song-lyric .pre").hasClass("inline") ? $(".chord_lyric_line .hopamchuan_lyric").width("auto") : $(".pre > .chord_lyric_line .hopamchuan_chord_inline").each(function (a, b) {
        var c = $(b),
            d = $(b).next();
        c.width() > d.width() && d.width(c.width())
    })
}, $.when($.ready).then(function () {
    $("body").hasClass("mobile-layout") && ($("#mobile-menu-toggle-btn").click(function () {
        $("#mobile-menu-toggle").addClass("box-open"), $("#mobile-menu-toggle-btn").hide()
    }), $("#mobile-menu-toggle-btn-close").click(function () {
        $("#mobile-menu-toggle").removeClass("box-open"), $("#mobile-menu-toggle-btn").show()
    }))
}),
    function () {
        function a(a) {
            return localforage.getItem(a)
        }

        function b(a, b) {
            return localforage.setItem(a, b)
        }
        var c = this,
            d = "LOCAL_SEARCH_";
        window.LocalSearch = {
            isReady: function () {
                function b() {
                    return e.apply(this, arguments)
                }
                var e = _asyncToGenerator(regeneratorRuntime.mark(function f() {
                    var b;
                    return regeneratorRuntime.wrap(function (c) {
                        for (; ;) switch (c.prev = c.next) {
                            case 0:
                                return c.next = 2, a(d + "data");
                            case 2:
                                if (c.t0 = c.sent, c.t0) {
                                    c.next = 5;
                                    break
                                }
                                c.t0 = [];
                            case 5:
                                return b = c.t0, c.abrupt("return", b.length > 0);
                            case 7:
                            case "end":
                                return c.stop()
                        }
                    }, f, c)
                }));
                return b
            }(),
            getLastUpdate: function () {
                function b() {
                    return e.apply(this, arguments)
                }
                var e = _asyncToGenerator(regeneratorRuntime.mark(function f() {
                    return regeneratorRuntime.wrap(function (b) {
                        for (; ;) switch (b.prev = b.next) {
                            case 0:
                                return b.next = 2, a(d + "lastUpdate");
                            case 2:
                                if (b.t0 = b.sent, b.t0) {
                                    b.next = 5;
                                    break
                                }
                                b.t0 = -1;
                            case 5:
                                return b.abrupt("return", b.t0);
                            case 6:
                            case "end":
                                return b.stop()
                        }
                    }, f, c)
                }));
                return b
            }(),
            setLastUpdate: function (a) {
                return b(d + "lastUpdate", a)
            },
            getLastSync: function () {
                function b() {
                    return e.apply(this, arguments)
                }
                var e = _asyncToGenerator(regeneratorRuntime.mark(function f() {
                    return regeneratorRuntime.wrap(function (b) {
                        for (; ;) switch (b.prev = b.next) {
                            case 0:
                                return b.next = 2, a(d + "lastSync");
                            case 2:
                                if (b.t0 = b.sent, b.t0) {
                                    b.next = 5;
                                    break
                                }
                                b.t0 = -1;
                            case 5:
                                return b.abrupt("return", b.t0);
                            case 6:
                            case "end":
                                return b.stop()
                        }
                    }, f, c)
                }));
                return b
            }(),
            setLastSync: function (a) {
                return b(d + "lastSync", a)
            },
            addData: function () {
                function e(a) {
                    return f.apply(this, arguments)
                }
                var f = _asyncToGenerator(regeneratorRuntime.mark(function g(e) {
                    var f;
                    return regeneratorRuntime.wrap(function (c) {
                        for (; ;) switch (c.prev = c.next) {
                            case 0:
                                return c.next = 2, a(d + "data");
                            case 2:
                                if (c.t0 = c.sent, c.t0) {
                                    c.next = 5;
                                    break
                                }
                                c.t0 = [];
                            case 5:
                                return f = c.t0, e.forEach(function (a) {
                                    var b = f.findIndex(function (b) {
                                        return b.id === a.id
                                    }); - 1 === b ? f.push(a) : f[b] = a
                                }), c.abrupt("return", b(d + "data", f));
                            case 8:
                            case "end":
                                return c.stop()
                        }
                    }, g, c)
                }));
                return e
            }(),
            setData: function (a) {
                return b(d + "data", a)
            },
            getData: function () {
                function b() {
                    return e.apply(this, arguments)
                }
                var e = _asyncToGenerator(regeneratorRuntime.mark(function f() {
                    return regeneratorRuntime.wrap(function (b) {
                        for (; ;) switch (b.prev = b.next) {
                            case 0:
                                return b.next = 2, a(d + "data");
                            case 2:
                                return b.abrupt("return", b.sent);
                            case 3:
                            case "end":
                                return b.stop()
                        }
                    }, f, c)
                }));
                return b
            }(),
            search: function () {
                function b(a) {
                    return e.apply(this, arguments)
                }
                var e = _asyncToGenerator(regeneratorRuntime.mark(function f(b) {
                    var e, g, h, i, j, k, l;
                    return regeneratorRuntime.wrap(function (c) {
                        for (; ;) switch (c.prev = c.next) {
                            case 0:
                                return c.next = 2, a(d + "data");
                            case 2:
                                if (c.t0 = c.sent, c.t0) {
                                    c.next = 5;
                                    break
                                }
                                c.t0 = [];
                            case 5:
                                return e = c.t0, g = 0, h = e.map(function (a) {
                                    return g = +a._view > g ? +a._view : g, {
                                        _lyric: a._lyric,
                                        _karaoke: getKaraokeTitle(a._title),
                                        _score: 0,
                                        _view: +a._view,
                                        _searchable: getSearchable(a._title + JSON.parse(a._singers).map(function (a) {
                                            return a.name
                                        })),
                                        _singers: JSON.parse(a._singers).map(function (a) {
                                            return a.name
                                        }).join(", "),
                                        _title: a._title,
                                        _title_ascii: toLowerCaseAscii(a._title),
                                        _url: "/song/" + a.id + "/" + toUrlFriendly(a._title),
                                        id: a.id
                                    }
                                }), i = 0, j = fuzzy.filter(getSearchable(b), h, {
                                    extract: function (a) {
                                        return a._searchable
                                    }
                                }), j.forEach(function (a) {
                                    return i = a.score > i ? a.score : i
                                }), k = j.map(function (a) {
                                    var c = 0 === getSearchable(h[a.index]._title).indexOf(getSearchable(b)) ? 1 : 0,
                                        d = b.length / h[a.index]._title.length,
                                        e = a.score / i,
                                        f = h[a.index]._view / g,
                                        j = 0 === h[a.index]._karaoke.indexOf(b.toUpperCase()) ? b.length / h[a.index]._karaoke.length : 0;
                                    return Object.assign({}, h[a.index], {
                                        _score: 6 * d + 5 * e + 10 * f + 100 * j + 50 * c
                                    })
                                }), k.sort(function (a, b) {
                                    return b._score - a._score
                                }), l = k.splice(0, 10), c.abrupt("return", l);
                            case 15:
                            case "end":
                                return c.stop()
                        }
                    }, f, c)
                }));
                return b
            }()
        };
        b(d + "data", [])
    }(),
    function () {
        var a = "NEW_FEATURE_";
        window.NewFeatureBadge = {
            markAsSeen: function (b) {
                return localforage.setItem("" + a + b, !0)
            },
            check: function (b) {
                return localforage.getItem("" + a + b)
            }
        }, $.when($.ready).then(function () {
            setTimeout(function () {
                $("[data-new-feature]").each(function () {
                    var a = this,
                        b = $(this).attr("data-new-feature");
                    window.NewFeatureBadge.check(b).then(function (b) {
                        b || $(a).fadeIn()
                    })
                })
            }, 1e3)
        })
    }(), $.when($.ready).then(function () {
        fixChordPositions()
    }), $.when($.ready).then(function () {
        function a() {
            c.fadeOut(function () {
                d.removeClass("onboarding")
            })
        }

        function b() {
            $.magnificPopup.close(), c = $("#onboarding"), 0 === c.length && (d.append('<div style="display: none" id="onboarding"></div>'), c = $("#onboarding")), c.fadeIn(), d.addClass("onboarding")
        }
        var c = void 0,
            d = $("body");
        $(document).keypress(function (a) {
            "?" === a.key && "INPUT" !== document.activeElement.tagName && "TEXTAREA" !== document.activeElement.tagName && b()
        }), $(document).click(function () {
            $("body").hasClass("onboarding") && a()
        }), $(document).keyup(function (b) {
            27 == b.keyCode && $("#onboarding").length > 0 && a()
        })
    });
var lang = function (a) {
    var b = [].splice.call(arguments, 1);
    return $$lang[a] ? vsprintf($$lang[a], b) : a
},
    AjaxFactory = {
        code: {
            SUCCESS: 0,
            UNKNOWN: -1,
            UNAUTHENTICATED: 5,
            UNAUTHORIZED: 1,
            NO_ACTION: 2,
            OPERATION_FAILED: 3,
            HTTP_ERROR: 4
        },
        post: function (a, b) {
            var c = this;
            return $.ajax({
                url: a,
                type: "post",
                dataType: "json",
                data: b
            }).then(function (a, b, c) {
                return "undefined" != typeof a.error ? $.Deferred().reject(a) : a
            }, function (a, b, d) {
                return console.error(arguments), $.Deferred().reject({
                    error: d,
                    code: c.code.HTTP_ERROR
                })
            })
        }
    },
    PartialFactory = {
        configs: {
            appendElement: "",
            loading: '<div class="content-loader text-center padding-both"><div class="loading-block spin"></div></div>',
            isAppend: !1,
            isPrepend: !1
        },
        beforeSend: function (a) {
            return function () {
                void 0 != a.appendElement && a.loading && (a.isAppend ? a.appendElement.append(a.loading) : a.isPrepend ? a.appendElement.prepend(a.loading) : a.noClearBeforeSend || a.appendElement.html(a.loading))
            }
        },
        done: function (a) {
            return function (b, c, d) {
                a.loading && $(a.loading).remove(), void 0 != a.appendElement && (a.isAppend ? a.appendElement.append(b) : a.isPrepend ? a.appendElement.prepend(b) : a.appendElement.html(b))
            }
        },
        fail: function (a) {
            return function (b, c, d) {
                void 0 != a.appendElement
            }
        },
        always: function (a) {
            return function (a, b, c) { }
        },
        load: function (a, b, c, d) {
            var e, f = this;
            return e = "string" == typeof a ? $(a) : a, d = $.extend({}, f.configs, d || {}, {
                appendElement: e
            }), $.ajax({
                url: b,
                type: "post",
                data: c,
                beforeSend: f.beforeSend(d)()
            }).done(function (a, b, c) {
                f.done(d)(a, b, c)
            }).fail(function (a, b, c) {
                f.fail(d)(a, b, c)
            }).always(function (a, b, c) {
                f.always(d)(a, b, c)
            })
        }
    },
    FAKE_AJAX_SEARCH_RESULT = [{
        title: "Náº¿u NhÆ° Anh Äáº¿n",
        lyric: "LÃ n tÃ³c rá»‘i bá» mÃ´i khÃ´ hÃ ng mi buÃ´ng...",
        singers: "VÄƒn Mai HÆ°Æ¡ng",
        link: "song"
    }, {
        title: "Náº¿u NhÆ° Anh Äáº¿n",
        lyric: "LÃ n tÃ³c rá»‘i bá» mÃ´i khÃ´ hÃ ng mi buÃ´ng...",
        singers: "VÄƒn Mai HÆ°Æ¡ng",
        link: "song"
    }, {
        title: "Náº¿u NhÆ° Anh Äáº¿n",
        lyric: "LÃ n tÃ³c rá»‘i bá» mÃ´i khÃ´ hÃ ng mi buÃ´ng...",
        singers: "VÄƒn Mai HÆ°Æ¡ng",
        link: "song"
    }, {
        title: "Náº¿u NhÆ° Anh Äáº¿n",
        lyric: "LÃ n tÃ³c rá»‘i bá» mÃ´i khÃ´ hÃ ng mi buÃ´ng...",
        singers: "VÄƒn Mai HÆ°Æ¡ng",
        link: "song"
    }],
    rand = function () {
        return Math.floor(1e4 * Math.random())
    },
    FAKE_AJAX_NOTIF_RESULT = [{
        title: "BÃ i hÃ¡t <b>Náº¿u NhÆ° Anh Äáº¿n</b> cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c duyá»‡t bá»Ÿi <b>HoÃ ng VÄƒn Máº¡nh</b>",
        human_time: "7 phÃºt trÆ°á»›c",
        geek_time: rand(),
        read: rand() % 2 == 0,
        unfollowable: rand() % 2 == 0,
        thumb: "/assets/images/default-ava.png"
    }, {
        title: "BÃ i hÃ¡t <b>Náº¿u NhÆ° Anh Äáº¿n</b> cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c duyá»‡t bá»Ÿi <b>HoÃ ng VÄƒn Máº¡nh</b>",
        human_time: "7 phÃºt trÆ°á»›c",
        geek_time: rand(),
        read: rand() % 2 == 0,
        unfollowable: rand() % 2 == 0,
        thumb: "/assets/images/default-ava.png"
    }, {
        title: "BÃ i hÃ¡t <b>Náº¿u NhÆ° Anh Äáº¿n</b> cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c duyá»‡t bá»Ÿi <b>HoÃ ng VÄƒn Máº¡nh</b>",
        human_time: "7 phÃºt trÆ°á»›c",
        geek_time: rand(),
        read: rand() % 2 == 0,
        unfollowable: rand() % 2 == 0,
        thumb: "/assets/images/default-ava.png"
    }, {
        title: "BÃ i hÃ¡t <b>Náº¿u NhÆ° Anh Äáº¿n</b> cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c duyá»‡t bá»Ÿi <b>HoÃ ng VÄƒn Máº¡nh</b>",
        human_time: "7 phÃºt trÆ°á»›c",
        geek_time: rand(),
        read: rand() % 2 == 0,
        unfollowable: rand() % 2 == 0,
        thumb: "/assets/images/default-ava.png"
    }, {
        title: "BÃ i hÃ¡t <b>Náº¿u NhÆ° Anh Äáº¿n</b> cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c duyá»‡t bá»Ÿi <b>HoÃ ng VÄƒn Máº¡nh</b>",
        human_time: "7 phÃºt trÆ°á»›c",
        geek_time: rand(),
        read: rand() % 2 == 0,
        unfollowable: rand() % 2 == 0,
        thumb: "/assets/images/default-ava.png"
    }, {
        title: "BÃ i hÃ¡t <b>Náº¿u NhÆ° Anh Äáº¿n</b> cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c duyá»‡t bá»Ÿi <b>HoÃ ng VÄƒn Máº¡nh</b>",
        human_time: "7 phÃºt trÆ°á»›c",
        geek_time: rand(),
        read: rand() % 2 == 0,
        unfollowable: rand() % 2 == 0,
        thumb: "/assets/images/default-ava.png"
    }, {
        title: "BÃ i hÃ¡t <b>Náº¿u NhÆ° Anh Äáº¿n</b> cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c duyá»‡t bá»Ÿi <b>HoÃ ng VÄƒn Máº¡nh</b>",
        human_time: "7 phÃºt trÆ°á»›c",
        geek_time: rand(),
        read: rand() % 2 == 0,
        unfollowable: rand() % 2 == 0,
        thumb: "/assets/images/default-ava.png"
    }];
$(function () {
    var a, b = $('link[rel="stylesheet"]').map(function () {
        return $(this).attr("href")
    }),
        c = $("script").map(function () {
            return $(this).attr("src")
        }),
        d = [],
        e = [],
        f = !1;
    for (a = 0; a < b.length; a++) - 1 == d.indexOf(b[a]) ? d.push(b[a]) : (f = !0, console.error("Duplicate CSS asset(s): ", b[a]));
    for (a = 0; a < c.length; a++) - 1 == e.indexOf(c[a]) ? e.push(c[a]) : (f = !0, console.error("Duplicate JS asset(s): ", c[a]));
    f && console.error("Assets files are duplicated. Please check console for more information."), $("body").html().indexOf("data-this-is-php-error-please-fix-this-7851230714") > -1 && console.error("This page contains a PHP Error, please check page source for more detail.")
});
var $iframe = null,
    oldHeight = 0;
$(function () {
    initTipsy()
}), window._deferredFb = $.Deferred(), window.dFbLoaded = _deferredFb.promise(), window._deferredFbDone && window._deferredFb.resolve(), window._deferredGoogle = $.Deferred(), window.dGoogleLoaded = _deferredGoogle.promise();
var loggedInUser = JSON.parse($("meta[name=user]").attr("content") || "null"),
    Login = {
        isLoggedByPopup: !1,
        doLogin: function (a, b) {
            var c = this;
            if (c.isLoggedByPopup) return void c.$identity.focus();
            c.callback = b;
            var d = a ? {
                message: a
            } : null;
            $.magnificPopup.close(), Popup.openPartial("partial/account_partial/login", function () {
                c.initEvent(), c.isLoggedByPopup = !0
            }, function () {
                c.isLoggedByPopup = !1
            }, d)
        },
        initEvent: function () {
            this.$loginPopup = $("#login-popup"), this.$identity = this.$loginPopup.find("#identity"), this.$password = this.$loginPopup.find("#password"), this.$submitBtn = this.$loginPopup.find("#submit-btn"), this.$error = this.$loginPopup.find(".error-message"), this.$loading = this.$loginPopup.find(".loading-block")
        },
        _disable_inputs: function () {
            this.$submitBtn.attr("disabled", "disabled"), this.$identity.attr("disabled", "disabled"), this.$password.attr("disabled", "disabled"), this.$loading.show()
        },
        _enable_inputs: function () {
            this.$submitBtn.removeAttr("disabled"), this.$identity.removeAttr("disabled"), this.$password.removeAttr("disabled"), this.$loading.hide()
        },
        _show_errors: function (a) {
            this.$error.html(a)
        },
        submit: function () {
            var a = this;
            return a._disable_inputs(), a._show_errors(""), AjaxFactory.post("ajax/ajax_auth/login", {
                identity: a.$identity.val(),
                password: a.$password.val()
            }).done(function (b) {
                a.callback ? (a.callback(b), $.magnificPopup.close(), a.callback = void 0) : location.reload()
            }).fail(function (b) {
                a._show_errors(b.error), a._enable_inputs()
            }), !1
        }
    },
    Song = {
        toggleFavorite: function (a, b, c) {
            return AjaxFactory.post("/ajax/ajax_song/favorite/" + c, {
                song_id: a,
                contribute_id: b
            }).done(function () {
                "add" == c ? $.growl.notice({
                    title: "",
                    message: lang("song.favorite.added")
                }) : $.growl.notice({
                    title: "",
                    message: lang("song.favorite.removed")
                })
            }).fail(function (a) {
                var b;
                b = a.code == AjaxFactory.code.HTTP_ERROR ? lang("common.error.connection") : a.error, $.growl.error({
                    title: lang("common.error"),
                    message: b
                }), (a.code == AjaxFactory.code.UNAUTHORIZED || a.code == AjaxFactory.code.UNAUTHENTICATED) && Login.doLogin()
            })
        }
    },
    TemplateEngine = {
        render: function (a, b) {
            var c = b;
            return c = this._renderRawText(a, c), c = this._renderIfClause(a, c), c = this._renderIfNotClause(a, c)
        },
        _renderIfNotClause: function (a, b) {
            for (var c = /{#ifnot (.+?)}([\s\S]+?){\/ifnot}/, d = c.exec(b), e = b; d;) {
                var f = d[0],
                    g = d[1],
                    h = d[2];
                e = e.replace(f, a[g] ? h : ""), d = c.exec(e)
            }
            return e
        },
        _renderIfClause: function (a, b) {
            for (var c = /{#if (.+?)}([\s\S]+?){\/if}/, d = c.exec(b), e = b; d;) {
                var f = d[0],
                    g = d[1],
                    h = d[2];
                e = e.replace(f, a[g] ? h : ""), d = c.exec(e)
            }
            return e
        },
        _renderRawText: function (a, b) {
            var c = Object.keys(a).map(function (a) {
                return "{" + a + "}"
            }),
                d = Object.keys(a).map(function (b) {
                    return a[b]
                });
            return this._replaceArray(b, c, d)
        },
        _replaceArray: function (a, b, c) {
            for (var d, e = a, f = 0; f < b.length; f++) d = new RegExp(b[f], "g"), e = e.replace(d, c[f]);
            return e
        }
    },
    lang = lang || function (a) {
        return a
    };
String.prototype.replaceAt = function (a, b) {
    return this.substr(0, a) + b + this.substr(a + b.length)
}, String.prototype.insertAt = function (a, b) {
    return this.substr(0, a) + b + this.substr(a)
}, String.prototype.deleteAt = function (a, b) {
    return this.substr(0, a) + this.substr(a + b)
}, String.prototype.splice = function (a, b, c) {
    return this.slice(0, a) + c + this.slice(a + Math.abs(b))
}, $.fn.caret = function (a, b) {
    if (0 != this.length) {
        if ("number" == typeof a) return b = "number" == typeof b ? b : a, this.each(function () {
            if (this.setSelectionRange) this.setSelectionRange(a, b);
            else if (this.createTextRange) {
                var c = this.createTextRange();
                c.collapse(!0), c.moveEnd("character", b), c.moveStart("character", a);
                try {
                    c.select()
                } catch (d) { }
            }
        });
        if (this[0].setSelectionRange) a = this[0].selectionStart, b = this[0].selectionEnd;
        else if (document.selection && document.selection.createRange) {
            var c = document.selection.createRange();
            a = 0 - c.duplicate().moveStart("character", -1e5), b = a + c.text.length
        }
        return {
            begin: a,
            end: b
        }
    }
}, $.fn.scrollGuard = function () {
    return this.on("wheel", function (a) {
        var b = a.originalEvent,
            c = b.wheelDelta || -b.detail;
        this.scrollTop += 30 * (0 > c ? 1 : -1), a.preventDefault()
    })
}, "serviceWorker" in navigator && "hopamchuan.local" !== location.host && navigator.serviceWorker.register("/sw.js").then(function (a) {
    a.onupdatefound = function () {
        var b = a.installing;
        b.onstatechange = function () {
            switch (b.state) {
                case "installed":
                    navigator.serviceWorker.controller ? console.log("New or updated content is available.") : console.log("Content is now available offline!");
                    break;
                case "redundant":
                    console.error("The installing service worker became redundant.")
            }
        }
    }
})["catch"](function (a) {
    console.error("Error during service worker registration:", a)
}), window.ioPromise = new Promise(function (a) {
    $.when($.ready).then(function () {
        function b() {
            if (!io) return void setTimeout(function () {
                b()
            }, 3e3);
            var c = io();
            a(c)
        }
        isIframe() || window.__LOGGED_IN && (setTimeout(function () {
            $("head").append("<script src='/socket_io_client_js'></script>")
        }, 0), setTimeout(function () {
            b()
        }, 3e3))
    })
}), $.when($.ready).then(function () {
    $("a.banner-click-track").each(function (a) {
        var b = $(this).attr("data-name") || $(this).attr("href"),
            c = $(this).attr("data-value") || $(this).attr("href");
        ga("send", "event", "HAC Ads", "View " + b, c, 1, {
            dimension1: c,
            dimension2: b
        })
    }), $("a.banner-click-track").click(function (a) {
        var b = this;
        a.preventDefault();
        var c = $(this).attr("data-name") || $(this).attr("href"),
            d = $(this).attr("data-value") || $(this).attr("href");
        ga("send", "event", "HAC Ads", "Click " + c, d, 1, {
            hitCallback: function () {
                return location.href = $(b).attr("href")
            },
            dimension1: d,
            dimension2: c
        })
    })
}), ioPromise.then(function (a) {
    a.on("connect", function (b) {
        var c = {
            user: __USER
        };
        c.socketId = a.id, a.emit("listen_notification", c), a.on("show_notification", function (a) {
            var b = parseInt($("#profile-inbox-count").text()) + 1;
            1 == b && ($("#profile-inbox-count").css({
                display: "inline-block"
            }), $("#profile-inbox").addClass("unread")), $("#profile-inbox-count").text(b);
            var c = a.notification.link;
            a.notification.id && (c = "/notification/view/" + a.notification.id), Notifier.initNotification(a.notification.content, c)
        })
    })
}), $.when($.ready).then(function () {
    0 === $("#notifier").length && $("body").append('<div id="notifier"></div>')
});
var Notifier = {};
Notifier.initNotification = function (a, b) {
    function c() {
        d.removeClass("move-right"), setTimeout(function () {
            d.remove()
        }, 500)
    }
    var d = $('<div class="notify-item"><a href="' + b + '"><div class="content">' + a + '</div></a><i class="fa fa-times close" aria-hidden="true"></i></div>');
    $("#notifier").append(d), setTimeout(function () {
        d.addClass("move-right")
    }, 20), setTimeout(function () {
        c()
    }, 15e3), d.on("click", function () {
        c()
    })
},
    function b(a, c, d) {
        function e(g, h) {
            if (!c[g]) {
                if (!a[g]) {
                    var i = "function" == typeof require && require;
                    if (!h && i) return i(g, !0);
                    if (f) return f(g, !0);
                    var j = new Error("Cannot find module '" + g + "'");
                    throw j.code = "MODULE_NOT_FOUND", j
                }
                var k = c[g] = {
                    exports: {}
                };
                a[g][0].call(k.exports, function (b) {
                    var c = a[g][1][b];
                    return e(c ? c : b)
                }, k, k.exports, b, a, c, d)
            }
            return c[g].exports
        }
        for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
        return e
    }({
        1: [function (a, b, c) {
            "use strict";

            function d(a, b) {
                if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
            }
            var e = function () {
                function a(a, b) {
                    for (var c = 0; c < b.length; c++) {
                        var d = b[c];
                        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d)
                    }
                }
                return function (b, c, d) {
                    return c && a(b.prototype, c), d && a(b, d), b
                }
            }(),
                f = a("./data/guitar.json"),
                g = a("./data/ukulele.json"),
                h = ["C#/Db", "D#/Eb", "F#/Gb", "G#/Ab", "A#/Bb"].reduce(function (a, b) {
                    var c = b.split("/");
                    return a[c[0]] = c[1], a[c[1]] = c[0], a
                }, {}),
                i = function (a) {
                    var b = Object.keys(h).find(function (b) {
                        return 0 === a.indexOf(b)
                    });
                    return b ? a.replace(new RegExp("^" + b), h[b]) : a
                },
                j = function (a) {
                    var b = [];
                    if (!a) return !1;
                    var c = a.split(":");
                    if (c.length < 2) return !1;
                    var d = c[0],
                        e = c[1].split(",");
                    return e.map(function (a, c) {
                        var e = a.split("(")[0].split(""),
                            f = /\(([\dxX]+?)\)/.exec(a),
                            g = f ? f[1].split("") : [];
                        b.push({
                            fingers: g,
                            scheme: e,
                            name: d,
                            priority: c + 1
                        })
                    }), b
                },
                k = {
                    get: function (a) {
                        var b = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "guitar",
                            c = function (a) {
                                switch (b) {
                                    case "guitar":
                                        return j(f[a]);
                                    case "ukulele":
                                        return j(g[a]);
                                    default:
                                        throw new Error("Instrument " + b + " is not supported")
                                }
                            };
                        return c(a) || c(i(a))
                    }
                },
                l = 600,
                m = 400,
                n = 70,
                o = 320,
                p = 300,
                q = 3,
                r = 35,
                s = (l - o) / 2 - r,
                t = 6,
                u = function (a, b) {
                    return {
                        STRING_WIDTH: o / (b - 1),
                        FRET_HEIGHT: p / a,
                        CHORD_BOTTOM_OVERFLOW: p / a / 2,
                        FINGER_RADIUS: 1.1 * Math.min(o / b / (t / b), p / a) / 2
                    }
                },
                v = function () {
                    var a = 4,
                        b = 6;
                    return Object.assign({
                        MAX_FRETS: a,
                        STRINGS_NUM: b
                    }, u(a, b))
                },
                w = function () {
                    var a = 4,
                        b = 4;
                    return Object.assign({
                        MAX_FRETS: a,
                        STRINGS_NUM: b
                    }, u(a, b))
                },
                x = function (a) {
                    if ("guitar" === a) return v();
                    if ("ukulele" === a) return w();
                    throw new Error("Instrument " + a + " is not supported")
                },
                y = function () {
                    function a() {
                        d(this, a), this.LANGUAGE = {
                            finger: "Tháº¿ tay",
                            transpose: "Äá»•i tÃ´ng",
                            selectInstrument: "Chá»n nháº¡c cá»¥",
                            chordNotSupported: "Há»£p Ã¢m chÆ°a há»— trá»£"
                        }
                    }
                    return e(a, [{
                        key: "transposeChord",
                        value: function (a, b) {
                            if ("undefined" != typeof a && "" != a) {
                                a = a.toLowerCase(), a = a.replace(/\/./, function (a) {
                                    return a.toUpperCase()
                                }), a = a.replace(/^./, function (a) {
                                    return a.toUpperCase()
                                });
                                var c = ["Db", "C#", "Eb", "D#", "Gb", "F#", "Ab", "G#", "Bb", "A#"],
                                    d = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
                                a = a.replace(/[DEGAB]b/, function (a) {
                                    return c[c.indexOf(a) + 1]
                                });
                                var e = a.replace(/[CDEFGAB]#?/g, function (a) {
                                    var c = (d.indexOf(a) + b) % d.length;
                                    return d[0 > c ? c + d.length : c]
                                });
                                return e = e.replace(/^A#/, "Bb").replace(/^D#/, "Eb")
                            }
                        }
                    }, {
                        key: "render",
                        value: function (a, b, c) {
                            var d = this,
                                e = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "guitar";
                            if (b && (a.dataset.chord !== b || a.dataset.pos != c || a.dataset.instrument !== e)) {
                                c || (c = 0);
                                var f = k.get(b, e);
                                if (a.innerHTML = '\n    <div style="\n    background: #fff; width: 150px; height: 170px;\n    text-align: center; position: relative"\n    >\n    <a\n    class="change-instrument"\n    href="javascript:;" style="\n    position: absolute;\n    top: 5px; right: 5px;\n    font-size: 11px;\n    text-decoration: underline;\n    color: #555;\n    ">' + e + '</a>\n    <div\n    class="change-instrument-popup"\n    style="\n    background: white;\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.38);\n    border: 1px solid #ccc;\n    padding: 10px;\n    display: none;\n    ">\n      <div style="margin-bottom: 10px">\n        ' + this.LANGUAGE.selectInstrument + '\n      </div>\n      <div style="margin-bottom: 10px">\n      <a\n      class="change-instrument-guitar"\n      style="\n      font-size: 12px;\n      ' + ("guitar" === e ? "font-weight: bold; text-decoration: underline; color: black;" : " color: #969696;") + '\n      " href="javascript:;">Guitar</a>\n      </div>\n      <div style="margin-bottom: 10px">\n      <a\n      class="change-instrument-ukulele"\n      style="\n      font-size: 12px; color: #969696;\n      ' + ("ukulele" === e ? "font-weight: bold; text-decoration: underline; color: black;" : " color: #969696;") + '\n      " href="javascript:;">Ukulele</a>\n      </div>\n    </div>\n    <div style="padding-top: 5px; font-size: 20px; font-weight: bold">' + b + "</div>\n    " + (f ? '<canvas style="height: 90; width: 140px;" width="' + l + '" height="' + m + '"></canvas>' : '<div style="height: 90; width: 140px; padding: 25px; box-sizing: border-box;">\n      <i><small>' + this.LANGUAGE.chordNotSupported + "</small></i>\n      </div>") + "\n    " + (f && f.length > 1 ? '\n      <div style="font-size: 13px">\n        <b class="finger-prev" style="cursor: pointer">â—</b>\n        ' + this.LANGUAGE.finger + '\n        <b class="finger-next"\n        style="cursor: pointer;\n        transform: rotateZ(-180deg);\n        display: inline-block;">â—</b>\n      </div>\n    ' : '<div style="height: 1em"></div>') + '\n    <div style="font-size: 13px">\n      <b class="chord-prev" style="cursor: pointer">â—€</b>\n      ' + this.LANGUAGE.transpose + '\n      <b class="chord-next" style="cursor: pointer;\n      transform: rotateZ(-180deg);\n      display: inline-block;">â—€</b>\n    </div>\n    </div>\n    ', f) {
                                    var g = a.getElementsByTagName("canvas")[0],
                                        h = g.getContext("2d");
                                    this.onRender && this.onRender.bind(this)(a, b, c), c || (c = 0), this.draw(h, f, c, e)
                                } else this.onRender && this.onRender.bind(this)(a, b, c);
                                a.setAttribute("data-chord", b), a.setAttribute("data-pos", c), a.setAttribute("data-instrument", e);
                                var i = function () {
                                    return a.getElementsByClassName.apply(a, arguments)[0] || {
                                        addEventListener: function () { }
                                    }
                                };
                                i("finger-prev").addEventListener("click", function (b) {
                                    var c = a.getAttribute("data-chord"),
                                        e = +a.getAttribute("data-pos"),
                                        g = a.getAttribute("data-instrument"),
                                        h = e - 1;
                                    0 > h && (h = f.length - 1), d.render(a, c, h, g)
                                }), i("finger-next").addEventListener("click", function (b) {
                                    var c = a.getAttribute("data-chord"),
                                        e = +a.getAttribute("data-pos"),
                                        g = a.getAttribute("data-instrument"),
                                        h = e + 1;
                                    h > f.length - 1 && (h = 0), d.render(a, c, h, g)
                                }), i("chord-prev").addEventListener("click", function (b) {
                                    var c = a.getAttribute("data-chord"),
                                        e = a.getAttribute("data-instrument"),
                                        f = d.transposeChord(c, -1);
                                    d.render(a, f, 0, e), d.onTranspose && d.onTranspose.bind(d)(a, -1)
                                }), i("chord-next").addEventListener("click", function (b) {
                                    var c = a.getAttribute("data-chord"),
                                        e = a.getAttribute("data-instrument"),
                                        f = d.transposeChord(c, 1);
                                    d.render(a, f, 0, e), d.onTranspose && d.onTranspose.bind(d)(a, 1)
                                }), i("change-instrument").addEventListener("click", function (a) {
                                    i("change-instrument-popup").style.display = "block"
                                }), i("change-instrument-guitar").addEventListener("click", function (b) {
                                    i("change-instrument-popup").style.display = "none";
                                    var c = a.getAttribute("data-chord");
                                    d.render(a, c, 0, "guitar"), d.onInstrumentChange && d.onInstrumentChange.bind(d)(a, "guitar")
                                }), i("change-instrument-ukulele").addEventListener("click", function (b) {
                                    i("change-instrument-popup").style.display = "none";
                                    var c = a.getAttribute("data-chord");
                                    d.render(a, c, 0, "ukulele"), d.onInstrumentChange && d.onInstrumentChange.bind(d)(a, "ukulele")
                                })
                            }
                        }
                    }, {
                        key: "drawChordFrame",
                        value: function (a, b) {
                            var c = x(b),
                                d = c.MAX_FRETS,
                                e = c.STRINGS_NUM,
                                f = c.STRING_WIDTH,
                                g = (c.FRET_HEIGHT, c.CHORD_BOTTOM_OVERFLOW);
                            c.FINGER_RADIUS;
                            a.beginPath(), a.lineWidth = q;
                            for (var h = 0; d + 1 > h; h++) a.moveTo(s, n + p * h / d), a.lineTo(s + o, n + p * h / 4);
                            for (var i = 0; e > i; i++) a.moveTo(s + i * f, n), a.lineTo(s + i * f, n + p + g);
                            a.stroke()
                        }
                    }, {
                        key: "drawFingers",
                        value: function (a, b, c, d) {
                            if (!b) return 0;
                            var e = x(d),
                                f = e.MAX_FRETS,
                                g = e.STRINGS_NUM,
                                h = e.STRING_WIDTH,
                                i = e.FRET_HEIGHT,
                                j = (e.CHORD_BOTTOM_OVERFLOW, e.FINGER_RADIUS),
                                k = b[c].scheme,
                                l = b[c].fingers,
                                m = void 0,
                                p = k.filter(function (a) {
                                    return "x" !== a.toLowerCase()
                                }).map(function (a) {
                                    return Number(a)
                                }).map(function (a) {
                                    return 0 === a ? 1 : a
                                }),
                                t = Math.min.apply(Math, p),
                                u = Math.max.apply(Math, p);
                            m = "ukulele" === d ? 1 : t, u > f && (m = u - f + 1), 1 === m && (a.beginPath(), a.moveTo(s, n), a.lineWidth = 3 * q, a.lineTo(s + o, n), a.stroke());
                            for (var v = 0; g > v; v++) {
                                var w = k[v];
                                if ("x" === w.toLowerCase()) a.beginPath(), a.font = r + "pt Arial", a.fillStyle = "black", a.fillText("X", s + v * h - r / 2, n - j);
                                else if (0 === +w) a.beginPath(), a.font = r + "pt Arial", a.fillStyle = "black", a.fillText("o", s + v * h - r / 2, n - j);
                                else {
                                    var y = +w - m + 1;
                                    a.beginPath(), a.fillStyle = "black", a.lineWidth = 1, a.arc(s + v * h, n + y * i - i / 2, j, 0, 2 * Math.PI), a.fill(), a.stroke(), a.fillStyle = "white", a.font = r + "pt Arial", a.fillText(l[v] || "", s + v * h - r / 3, n + y * i - i / 2 + r / 2)
                                }
                            }
                            for (var z = 1; f >= z; z++) a.beginPath(), a.fillStyle = "black", a.font = r + "pt Arial", a.fillText(m + z - 1 + "fr", s + o + 1.3 * r, n + z * i - i / 2 + r / 2)
                        }
                    }, {
                        key: "draw",
                        value: function (a, b, c, d) {
                            this.drawChordFrame(a, d), this.drawFingers(a, b, c, d)
                        }
                    }]), a
                }();
            window.ChordJS = new y
        }, {
            "./data/guitar.json": 2,
            "./data/ukulele.json": 3
        }],
        2: [function (a, b, c) {
            b.exports = {
                "A#": "A#:x13331(x12341),688766(134211),x1333x(x1444x),x1x331(x1x341),653336(321114),xx8101110(xx1343),x1312101110(x43121)",
                "A#/D": "A#/D:xx0331(xx0341),x5333x(x3111x),x5876x(x1432x),x5xx66(x1xx44)",
                "A#/F": "A#/F:1xx331(1xx341),xx3331(xx2341),1xx33x(1xx34x),xx3336(xx1114),113331",
                "A#/G": "A#/G:353333",
                "A#5": "A#5:x133xx(x134xx),688xxx(134xxx),xx81011x(xx134x),688xx6",
                "A#5/F": "A#5/F:11xxxx(11xxxx),xx33xx(xx11xx),x88xxx(x11xxx)",
                "A#6": "A#6:x13333(x13333),xx810810(xx1314)",
                "A#6/F": "A#6/F:xx3333",
                "A#6add9": "A#6add9:x10011(x10023),655566(211134)",
                "A#6add9/C": "A#6add9/C:x33333(x11111)",
                "A#7#5": "A#7#5:x14132(x14132),6x6776(1x1231)",
                "A#7#5/G#": "A#7#5/G#:xx6776(xx1231),x11121111x(x1211x)",
                "A#7#9": "A#7#9:x10121(x10243),65666x(21333x),686769(131214)",
                "A#7": "A#7:x13131(x13141),686766(131211),x13334(x13334),xx810910(xx1324),653334(431112),686796(131241)",
                "A#7/F": "A#7/F:xx3334(xx1112)",
                "A#7b11/E": "A#7b11/E:013131",
                "A#7b5": "A#7b5:x12130(x12130),xx89910(xx1234)",
                "A#7b9": "A#7b9:x10101(x10203),6x6767(1x1213)",
                "A#7sus2/G#": "A#7sus2/G#:xx6566(xx2134)",
                "A#7sus4": "A#7sus4:x13141(x13141),686866(131411),xx810911(xx1324)",
                "A#9": "A#9:65656x(21314x),686768(131214)",
                "A#add9": "A#add9:633336(311114),xx8768(xx3214),x1310101110(x41121),x1312101310(x32141),x1310101310(x31141)",
                "A#add9/C": "A#add9/C:8x8766(3x4211),xx10101110(xx1121)",
                "A#aug": "A#aug:x10332(x10342),65433x(43211x),xx8776(xx4231),x13121111x(x3211x),x1312111114(x32114)",
                "A#b5": "A#b5:x12330(x12340),xx8756(xx4312),6787x6(1342x1),xx891110(xx1243)",
                "A#b5/D": "A#b5/D:xx091110(xx4132),xx1291110(xx4132),xx03x0",
                "A#dim": "A#dim:x12320(x12430),6786xx(1342xx),xx89119(xx1243)",
                "A#dim/C": "A#dim/C:x3x320",
                "A#dim/D": "A#dim/D:xx0320",
                "A#dim/F#": "A#dim/F#:xx4320,242322",
                "A#dim7": "A#dim7:x12020(x12030),6756xx(2413xx),xx8989(xx1324),x1311121112(x41213)",
                "A#m": "A#m:x13321(x13421),688666(134111),x1332x(x1342x),xx8666(xx3111),xx810119(xx1342),x13111011x(x4312x)",
                "A#m/C#": "A#m/C#:x4332x(x4231x),x43366(x21144),xx1110119(xx3241),x4x666(x1x444)",
                "A#m/D": "A#m/D:xx0666",
                "A#m/F": "A#m/F:113321(113421),xx3321(xx3421),x88666(x34111),x8x10119(x1x342)",
                "A#m6": "A#m6:x13023(x13024),688686(123141),xx81089(xx1312)",
                "A#m7": "A#m7:x13121(x13121),686666(131111),x1x121(x1x243),6x666x(1x111x),x13124(x13124),686696(131141),xx81099(xx1322),x1311131113(x21314)",
                "A#m7b5": "A#m7b5:x12120(x13240),676696(121141),xx8999(xx1333),x1311131112(x31412)",
                "A#m9": "A#m9:686668(131114)",
                "A#maj7": "A#maj7:x13231(x13241),x1312101010(x43111),x10231(x10342),6x776x(1x342x),xx8101010(xx1444),xx8765(xx4321),687766(142311),x13121010x(x4311x)",
                "A#maj7/9": "A#maj7/9:x10211(x10423),657565(214131)",
                "A#maj7/9/C": "A#maj7/9/C:x33335",
                "A#maj7/A": "A#maj7/A:x03335(x01113)",
                "A#maj7/F": "A#maj7/F:113231",
                "A#sus2": "A#sus2:x13311(x13411),6333xx(4111xx),xx8568(xx3124),xx810118(xx1341),x1310101313(x21134),x1310101113(x31124)",
                "A#sus4": "A#sus4:x13341(x13341),688866(133311),xx8101111(xx1344),x13131011x(x3412x)",
                "A#sus4/F": "A#sus4/F:xx3346(xx1124),x88866(x23411)",
                A: "A:x02220(x01230),577655(134211),x02225(x01114),x0x220(x0x120),542225(321114),xx79109(xx1343),x12119109(x43121),x1214141412(x13331)",
                "A/C#": "A/C#:x4222x(x3111x),x42225(x31114),x4765x(x1432x),x4xx55(x1xx44)",
                "A/D": "A/D:xx0655,xx09109",
                "A/E": "A/E:002220(001230),xx2225(xx1114),x77655(x34211),04x250",
                "A/F#": "A/F#:202220(001230)",
                "A/F": "A/F:102220(102340)",
                "A/G#": "A/G#:40222x(30111x)",
                "A/G": "A/G:30222x(20111x),3x2220",
                A11: "A11:x00020",
                "A13/E": "A13/E:002022",
                A3: "A3:xxx22x(xxx11x),54xxxx(21xxxx),xx76xx(xx21xx),x1211xxx(x21xxx)",
                A5: "A5:x022xx(x012xx),577xxx(134xxx),xx7910x(xx134x),x022x0,577xx5,577xx0",
                "A5/E": "A5/E:00xxxx(00xxxx),xx22xx(xx11xx),x77xxx(x11xxx)",
                A5aug: "A5aug:x03xxx(x03xxx),58xxxx(14xxxx),xx710xx(xx14xx)",
                A5dim: "A5dim:x01xxx(x01xxx),56xxxx(12xxxx),xx78xx(xx12xx)",
                A6: "A6:x02222(x01111),542222(431111),x1211111412(x21143),x04220",
                "A6/7sus": "A6/7sus:x02032,554030",
                "A6/7sus4": "A6/7sus4:x02032,554030",
                "A6/E": "A6/E:0x4220,002222",
                A6add9: "A6add9:x04420(x03410),544455(211134)",
                "A6add9/B": "A6add9/B:x22222(x11111)",
                "A7#5": "A7#5:x03021(x03021),5x5665(1x1231)",
                "A7#5/F": "A7#5/F:103021",
                "A7#5/G": "A7#5/G:xx5665(xx1231),x10111010x(x1211x)",
                "A7#9": "A7#9:x02523(x01412),575658(131214)",
                A7: "A7:x1214141415(x13334),x02223(x01113),575655(131211),x02020(x01030),x07989(x01324),542223(431112),575685(131241),xx7989(xx1324),x121112100(x32410)",
                "A7/G": "A7/G:3x2220",
                A7b5: "A7b5:x0102x(x0102x),x01223(x01234),x05645(x02413),xx7889(xx1234)",
                "A7b5/C#": "A7b5/C#:xx11121011(xx2413)",
                A7b9: "A7b9:x02323(x01213),5x5656(1x1213),x01112110(x01320)",
                A7sus2: "A7sus2:x02000,x05450",
                "A7sus2/G": "A7sus2/G:xx5455(xx2134),3x2200",
                A7sus4: "A7sus4:x0203x(x0103x),575755(131411),x02030,x02033,x02233,500030",
                A9: "A9:x02423(x01312),54545x(21314x),575657(131214)",
                "A9-5": "A9-5:x01423(x01423),545445(213114),x1211121211(x21341)",
                Aadd9: "Aadd9:x02420(x01420),xx7657(xx3214),x12119129(x32141),x1299109(x41121),x1299129(x31141),x07600",
                "Aadd9/B": "Aadd9/B:7x7655(3x4211),xx99109(xx1121)",
                "Aadd9/E": "Aadd9/E:002420",
                Aaug: "Aaug:x03221(x04231),54322x(43211x),xx7665(xx4231),x12111010x(x3211x),x1211101013(x32114)",
                "Aaug/D": "Aaug/D:xx0221",
                Ab: "Ab:466544(134211),xx6544(xx3211),xx6898(xx1243),431114(321114),x1110898(x43121),x11131313x(x1234x),x1113131311(x13331)",
                Ab3: "Ab3:xxx11x(xxx11x),43xxxx(21xxxx),xx65xx(xx21xx),x1110xxx(x21xxx)",
                Ab5: "Ab5:x0122x(x0123x),xx7645(xx4312),5676x5(1342x1),xx78109(xx1243),x12131414x(x1233x)",
                "Ab5/C#": "Ab5/C#:xx118109(xx4132)",
                Ab5aug: "Ab5aug:47xxxx(14xxxx),xx69xx(xx14xx),x1114xxx(x14xxx)",
                Ab5dim: "Ab5dim:45xxxx(12xxxx),xx67xx(xx12xx),x1112xxx(x12xxx)",
                Ab7: "Ab7:464544(131211),xx6878(xx1324),4x454x(1x243x),431112(431112),x1113111311(x13141),464574(131241),x1113131314(x13334)",
                Ab9: "Ab9:43434x(21314x),464546(131214)",
                "Ab9-5": "Ab9-5:434334(213114),101110111110(121341)",
                Abdom7: "Abdom7:x1110119x(x3241x)",
                Abm: "Abm:466444(134111),xx6897(xx1342),xx6444(xx3111),421xxx(421xxx),x11989x(x4312x),x1113131211(x13421)",
                Abm3: "Abm3:xxx10x(xxx10x),42xxxx(31xxxx),xx64xx(xx31xx),x119xxx(x31xxx)",
                Abm6: "Abm6:466464(123141),x11910911(x31214)",
                Abm7: "Abm7:464444(131111),xx6877(xx1423),4x444x(1x111x),464474(131141),46447x(13114x),x11911911(x21314),x11131112x(x1312x),x1113111214(x13124)",
                Abmaj7: "Abmaj7:465544(142311),xx6888(xx1444),4x554x(1x342x),xx6543(xx4321),x1110888(x43111)",
                Adim: "Adim:x0121x(x0132x),5675xx(1342xx),xx78108(xx1243),x12131413x(x1243x)",
                "Adim/E": "Adim/E:03x240",
                "Adim/F": "Adim/F:xx3545",
                Adim7: "Adim7:x01212(x01324),5645xx(2413xx),xx7878(xx1324),x1210111011(x41213),x12131113x(x2314x),x1213111311(x23141)",
                Adom7: "Adom7:x12111210x(x3241x)",
                Am: "Am:x02210(x02310),x07555,577555(134111),x0x555(x0x111),x0109108(x03241),x02555(x01444),x079108(x01342),x1210910x(x4312x),x1214141312(x13421)",
                "Am/B": "Am/B:x22210(x23410)",
                "Am/C": "Am/C:x32255(x21144),x32210(x42310),xx109108(xx3241),x3x555(x1x444)",
                "Am/D": "Am/D:xx0210,xx0555",
                "Am/E": "Am/E:002210(002310),007555(003111),032210(042310)",
                "Am/F": "Am/F:1x2210,133210",
                Am3: "Am3:xxx21x(xxx21x),53xxxx(31xxxx),xx75xx(xx31xx),x1210xxx(x31xxx)",
                Am6: "Am6:x02212(x02314),577575(123141),xx7978(xx1312),x1210111012(x31214)",
                "Am6/E": "Am6/E:xx2212",
                Am7: "Am7:x02010(x02010),x05558,x02213(x02314),x05555(x01111),575555(131111),575585(131141),x07988(x01423),x1210121012(x21314),x1214121315(x13124)",
                Am7b5: "Am7b5:x0101x(x0102x),x01213(x01214),565585(121141),xx7888(xx1333),x1210121011(x31412)",
                Am9: "Am9:x02413(x02413),532000(421000),575557(131114)",
                "Amadd9/C": "Amadd9/C:x32200",
                "Amadd9/E": "Amadd9/E:007500",
                Amaj7: "Amaj7:x02224(x01114),5x665x(1x342x),x02120(x02130),xx7999(xx1444),x07654(x04321),576655(142311),x1211999(x43111)",
                "Amaj7/9": "Amaj7/9:x02424(x01314),54645x(21413x),x129999(x41111)",
                "Amin/maj9": "Amin/maj9:x06557",
                Asus2: "Asus2:x02200(x02300),5222xx(4111xx),xx7457(xx3124),xx79107(xx1341),x12991212(x21134),x12991012(x31124),x1214141212(x13411)",
                "Asus2/C": "Asus2/C:x32200",
                "Asus2/G": "Asus2/G:3x2200",
                Asus4: "Asus4:x02230(x01240),x02235(x01124),577755(133311),x0791010(x01234),x1212910x(x3412x),x1214141512(x13341),x00230,5577x0",
                "Asus4/E": "Asus4/E:002230",
                "Asus4/F#": "Asus4/F#:2x0230,x977x0",
                "Asus4/G#": "Asus4/G#:4x0230",
                B: "B:799877(134211),x21x02(x21x03),x2444x(x1444x),76444x(43111x),x24442(x13331),764447(321114),xx9111211(xx1343),x1413111211(x43121)",
                "B/A": "B/A:x01202",
                "B/D#": "B/D#:x6444x(x3111x),xx1x02(xx1x03),x64447(x31114)",
                "B/F#": "B/F#:xx4442(xx2341),2xx44x(1xx34x),xx4447(xx1114)",
                "B11/E": "B11/E:004440,021202",
                B3: "B3:xxx44x(xxx11x),x21xxx(x21xxx),76xxxx(21xxxx),xx98xx(xx21xx)",
                B5: "B5:x244xx(x134xx),799xxx(134xxx),xx91112x(xx134x),x244x2",
                "B5/F#": "B5/F#:xx44xx(xx11xx),22xxxx(11xxxx),x99xxx(x11xxx)",
                B5aug: "B5aug:x25xxx(x14xxx),710xxxx(14xxxx),xx912xx(xx14xx)",
                B5dim: "B5dim:x23xxx(x12xxx),78xxxx(12xxxx),xx910xx(xx12xx)",
                B6: "B6:x21102(x31204),x24444(x13333),764444(431111),xx911911(xx1314)",
                "B6/D#": "B6/D#:xx1102(xx1204)",
                "B6/F#": "B6/F#:xx4444",
                B6add9: "B6add9:x21122(x21134),766677(211134)",
                "B6add9/C#": "B6add9/C#:x44444(x11111)",
                "B7#5": "B7#5:x21203(x21304),x25243(x14132),71078xx(1412xx),7x7887(1x1231),xx9121011(xx1423)",
                "B7#5/A": "B7#5/A:xx7887(xx1231)",
                "B7#9": "B7#9:7978710(131214)",
                B7: "B7:x21202(x21304),7978107(131241),xx9111011(xx1324),x24242(x13141),797877(131211),7x787x(1x243x),x24445(x13334),764445(431112),7978x7(1312x1)",
                "B7/A": "B7/A:x01202",
                "B7/F#": "B7/F#:xx4445(xx1112),2x1202",
                B7b5: "B7b5:x2324x(x1213x),x21201(x32401),7878xx(1324xx),xx9101011(xx1223)",
                B7b9: "B7b9:x21212(x21314),7x7878(1x1213)",
                "B7sus2/A": "B7sus2/A:xx7677(xx2134)",
                B7sus4: "B7sus4:x22202(x12304),x24252(x13141),797977(131411),xx9111012(xx1324)",
                "B7sus4/A": "B7sus4/A:x04400",
                B9: "B9:76767x(21314x),797879(131214)",
                "B9-5": "B9-5:x21221(x21341),767667(213114)",
                Badd9: "Badd9:xx9879(xx3214),x1411111211(x41121),x1411111411(x31141),x1413111411(x32141)",
                "Badd9/C#": "Badd9/C#:9x9877(3x4211),xx11111211(xx1121)",
                Baug: "Baug:x21003(x21004),x2544x(x1423x),76544x(43211x),xx9887(xx4231),x1413121215(x32114)",
                Bb: "Bb:x13331(x12341),688766(134211),x1333x(x1444x),x1x331(x1x341),653336(321114),xx8101110(xx1343),x1312101110(x43121)",
                Bb3: "Bb3:xxx33x(xxx11x),x10xxx(x21xxx),65xxxx(21xxxx),xx87xx(xx21xx)",
                Bb5: "Bb5:x2344x(x1233x),xx9867(xx4312),7898x7(1342x1),xx9101211(xx1243)",
                "Bb5/D#": "Bb5/D#:xx13101211(xx4132)",
                Bb5aug: "Bb5aug:x14xxx(x14xxx),69xxxx(14xxxx),xx811xx(xx14xx)",
                Bb5dim: "Bb5dim:x12xxx(x12xxx),67xxxx(12xxxx),xx89xx(xx12xx)",
                Bb7: "Bb7:x13131(x13141),686766(131211),x13334(x13334),xx810910(xx1324),653334(431112),686796(131241)",
                Bb9: "Bb9:65656x(21314x),686768(131214)",
                "Bb9-5": "Bb9-5:x10110(x10230),656556(213114),x1312131312(x21341)",
                "Bbadd#11": "Bbadd#11:x13330",
                Bbadd9: "Bbadd9:633336(311114),xx8768(xx3214),x1310101110(x41121),x1312101310(x32141),x1310101310(x31141)",
                Bbdim: "Bbdim:x12320(x12430),6786xx(1342xx),xx89119(xx1243)",
                Bbdim7: "Bbdim7:x12020(x12030),x12020(x12030),6756xx(2413xx),6756xx(2413xx),xx8989(xx1324),xx8989(xx1324),x1311121112(x41213),x1311121112(x41213)",
                Bbdom7: "Bbdom7:x13121311x(x3242x)",
                Bbm: "Bbm:x13321(x13421),688666(134111),x1332x(x1342x),xx8666(xx3111),xx810119(xx1342),x13111011x(x4312x)",
                Bbm3: "Bbm3:xxx32x(xxx21x),64xxxx(31xxxx),xx86xx(xx31xx),x1311xxx(x31xxx)",
                Bbm7: "Bbm7:x13121(x13121),686666(131111),x1x121(x1x243),6x666x(1x111x),x13124(x13124),686696(131141),xx81099(xx1322),x1311131113(x21314)",
                Bbmaj7: "Bbmaj7:x13231(x13241),x1312101010(x43111),x10231(x10342),6x776x(1x342x),xx8101010(xx1444),xx8765(xx4321),687766(142311),x13121010x(x4311x)",
                Bbsus2: "Bbsus2:x13311(x13411),6333xx(4111xx),xx8568(xx3124),xx810118(xx1341),x1310101313(x21134),x1310101113(x31124)",
                Bbsus4: "Bbsus4:x13341(x13341),688866(133311),xx8101111(xx1344),x13131011x(x3412x)",
                Bdim: "Bdim:x2343x(x1243x),x20431(x20431),7897xx(1342xx),xx9101210(xx1243)",
                "Bdim/D": "Bdim/D:x5x767(x1x324)",
                "Bdim/G": "Bdim/G:320001",
                Bdim7: "Bdim7:x23131(x23141),x20101(x30102),7867xx(2413xx),xx910910(xx1324)",
                Bdom7: "Bdom7:x14131412x(x3241x)",
                Bm: "Bm:x24432(x13421),799777(134111),x2443x(x1342x),xx9777(xx3111),xx9111210(xx1342),x14121112x(x4312x)",
                "Bm/A": "Bm/A:x04432",
                "Bm/D": "Bm/D:xx0432(xx0321),x5443x(x4231x),x5x777(1x1444),xx0777(xx0111),xx12111210(xx3241)",
                "Bm/F#": "Bm/F#:224432(113421),xx4432(xx3421),x99777(x34111),22043x(12043x)",
                "Bm/G": "Bm/G:320002",
                Bm3: "Bm3:xxx43x(xxx21x),x20xxx(x10xxx),75xxxx(31xxxx),xx97xx(xx31xx)",
                Bm6: "Bm6:x20132(x20143),x20102(x20103),799797(123141),xx911910(xx1312)",
                Bm7: "Bm7:x24232(x13121),x20232,797777(131111),x2x232(x1x243),7x777x(1x111x),x20202(x10203),x24235(x13124),7977107(131141),xx9111010(xx1322),x1412141214(x21314)",
                Bm7b5: "Bm7b5:x2323x(x1324x),x20201(x20301),7877107(121141),xx9101010(xx1333)",
                Bm9: "Bm9:x20222(x10234),797779(131114)",
                Bmaj7: "Bmaj7:x24342(x13241),x14131111x(x4311x),x2x342(x1x342),7x887x(1x342x),x21302(x21403),xx9111111(xx1444),xx9876(xx4321),798877(142311)",
                "Bmaj7/9": "Bmaj7/9:768676(214131)",
                "Bmaj7/F#": "Bmaj7/F#:xx4446(xx1113)",
                "Bmaj7add#11": "Bmaj7add#11:x23342",
                Bsus2: "Bsus2:x24422(x13411),7444xx(4111xx),xx9679(xx3124),xx911129(xx1341),x1411111414(x21134),x1411111214(x31124)",
                "Bsus2/C#": "Bsus2/C#:x44422(x23411)",
                Bsus4: "Bsus4:x24400(x13400),x24452(x13341),799977(133311),xx9111212(xx1344),x14141112x(x3412x),799xx0",
                "Bsus4/A": "Bsus4/A:x04400",
                "Bsus4/C#": "Bsus4/C#:x444x0",
                "Bsus4/F#": "Bsus4/F#:xx4457(xx1124),x9997x(x2341x)",
                "C#": "C#:x46664(x12341),x43121(x43121),x4666x(x1444x),98666x(43111x),986669(321114),911111099(134211),xx11131413(xx1343)",
                "C#/A#": "C#/A#:x13121",
                "C#/C": "C#/C:x33121",
                "C#/F": "C#/F:xx3121(xx3121),1xx121(1xx243),x8666x(x3111x),x86669(x31114)",
                "C#/G#": "C#/G#:4xx664(1xx341),xx6669(xx1114),4x666x(1x444x),446664",
                "C#3": "C#3:x43xxx(x21xxx),xxx66x(xxx11x),98xxxx(21xxxx),xx1110xx(xx21xx)",
                "C#5": "C#5:x466xx(x134xx),91111xxx(134xxx),xx111314x(xx134x),x466x4",
                "C#5/G#": "C#5/G#:44xxxx(11xxxx),xx66xx(xx11xx),x1111xxx(x11xxx)",
                "C#5aug": "C#5aug:x47xxx(x14xxx),912xxxx(14xxxx),xx1114xx(xx14xx)",
                "C#5dim": "C#5dim:x45xxx(x12xxx),910xxxx(12xxxx),xx1112xx(xx12xx)",
                "C#6": "C#6:x46666(x13333),986666(431111),xx11131113(xx1314)",
                "C#6add9": "C#6add9:x43344(x21134),988899(211134)",
                "C#6add9/D#": "C#6add9/D#:x66666(x11111)",
                "C#7#5": "C#7#5:x43201(x43201),x47465(x14132),912910xx(1412xx),9x910109(1x1231),xx11141213(xx1423)",
                "C#7#5/B": "C#7#5/B:x2322x(x1211x),xx910109(xx1231)",
                "C#7#5/F": "C#7#5/F:xx3425(xx2314)",
                "C#7#9": "C#7#9:x43100(x43100),98999x(21344x),911910912(131214)",
                "C#7": "C#7:x46464(x13141),911910129(131241),xx11131213(xx1324),x43404,91191099(131211),x4x464(x1x141),x46667(x13334),986667(431112),911910x9(1312x1)",
                "C#7/G#": "C#7/G#:xx6667(xx1112)",
                "C#7b5": "C#7b5:x4546x(x1213x),910910xx(1324xx),xx11121213(xx1223)",
                "C#7b9": "C#7b9:9x910910(1x1213)",
                "C#7sus2/B": "C#7sus2/B:xx9899(xx2134)",
                "C#7sus4": "C#7sus4:x46474(x13141),91191199(131411),xx11131214(xx1324)",
                "C#7sus4/F#": "C#7sus4/F#:xx4424(xx2314)",
                "C#7sus4/G#": "C#7sus4/G#:xx6677(xx1122)",
                "C#9": "C#9:98989x(21314x),911910911(131214)",
                "C#9-5": "C#9-5:x43443(x21341),989889(213114)",
                "C#add9": "C#add9:x41121(x41121),x41141(x31141),x43141(x32141),xx1110911(xx3214)",
                "C#add9/D#": "C#add9/D#:xx1121(xx1121),11x111099(4x3211)",
                "C#aug": "C#aug:x43225(x32114),x4766x(x1423x),98766x(43211x),xx1110109(xx4231)",
                "C#aug/D": "C#aug/D:xx0221",
                "C#b5": "C#b5:x4566x(x1233x),xx111089(xx4312),9101110x9(1342x1),xx11121413(xx1243)",
                "C#b5/F": "C#b5/F:xx3021(xx3021),xx15121413(xx4132)",
                "C#b5/G": "C#b5/G:xx5663(xx2341)",
                "C#dim": "C#dim:x42020(x41020),xxx653(xxx431),x4565x(x1243x),xx11989(xx4213),910119xx(1342xx),xx11121412(xx1243)",
                "C#dim/A#": "C#dim/A#:x12020",
                "C#dim/A": "C#dim/A:x02020,x02223",
                "C#dim/E": "C#dim/E:x7x989(x1x324)",
                "C#dim7": "C#dim7:x42323(x41213),x45353(x23141),91089xx(2413xx),xx11121112(xx1324)",
                "C#m": "C#m:x46654(x13421),91111999(134111),x421xx(x421xx),x4212x(x4312x),x4xx54(x1xx21),xx11131412(xx1342),x466x0",
                "C#m/A": "C#m/A:x02120",
                "C#m/E": "C#m/E:xx2120(xx2130),076650(042310),046654(013421),046650(013420),x7665x(x4231x)",
                "C#m/G#": "C#m/G#:446654(113421),xx6654(xx3421),x1111999(x34111),4xx120(4xx120)",
                "C#m3": "C#m3:x42xxx(x31xxx),xxx65x(xxx21x),97xxxx(31xxxx),xx119xx(xx31xx)",
                "C#m6": "C#m6:x42324(x31214),x46x56(x13x24),911119119(123141),xx11131112(xx1312)",
                "C#m6/G#": "C#m6/G#:xx6656(xx2314)",
                "C#m7": "C#m7:x46454(x13121),9119999(131111),x4x454(x1x243),x42424(x21314),x46457(x13124),x42100(x42100),91199129(131141),xx11131212(xx1322)",
                "C#m7b5": "C#m7b5:x42000(x31000),x4545x(x1324x),91099129(121141),xx11121212(xx1222)",
                "C#m9": "C#m9:91199911(131114)",
                "C#maj7": "C#maj7:x4x564(x1x342),x43111(x43111),x4656x(x1324x),x46564(x13241),xx111098(xx4321),911101099(142311),xx11131313(xx1333)",
                "C#maj7/9": "C#maj7/9:x41111(x41111),9810898(214131)",
                "C#maj7/C": "C#maj7/C:x33121",
                "C#maj7/G#": "C#maj7/G#:xx6668(xx1113)",
                "C#sus2": "C#sus2:x41124(x31124),x41144(x21134),x46644(x13411),9666xx(4111xx),xx118911(xx3124),xx11131411(xx1341)",
                "C#sus4": "C#sus4:x4412x(x3412x),x46674(x13341),x44674(x11341),911111199(133311),99111199(113411),xx11131414(xx1344)",
                "C#sus4/G#": "C#sus4/G#:xx6679(xx1124)",
                C: "C:x32010(x32010),x35550,x35553(x12341),81010988(134211),x3x553(x1x341),875558(321114),xx10121312(xx1343),x1514121312(x43121)",
                "C/A#": "C/A#:x12010(x13020),6x555x(2x111x)",
                "C/A": "C/A:x02010(x02010),x02213,x05558",
                "C/B": "C/B:x22010(x23010),x2555x(x1234x)",
                "C/C#": "C/C#:x42010(x42010),x4555x(x1222x)",
                "C/D#": "C/D#:xx1010(xx2010),x6555x(x2111x)",
                "C/D": "C/D:xx0010(xx0010),x5555x(x1111x),xx0553,x555x0",
                "C/E": "C/E:032010(032010),xx2010(xx2010),x7555x(x3111x),x75558(x31114),035553",
                "C/F#": "C/F#:232010(032010)",
                "C/F": "C/F:132010(032010),x8555x(x4111x)",
                "C/G#": "C/G#:432010(432010)",
                "C/G": "C/G:332010(342010),335553(112341),xx5558(xx1114),3xx55x(1xx34x)",
                C3: "C3:x32xxx(x21xxx),xxxx10(xxxx10),xxx55x(xxx11x),87xxxx(21xxxx),xx109xx(xx21xx)",
                C5: "C5:x355xx(x134xx),81010xxx(134xxx),xx101213x(xx134x),x355x3",
                "C5/G": "C5/G:33xxxx(11xxxx),xx55xx(xx11xx),x1010xxx(x11xxx)",
                C5aug: "C5aug:x36xxx(x14xxx),811xxxx(14xxxx),xx1013xx(xx14xx)",
                C5dim: "C5dim:x34xxx(x12xxx),89xxxx(12xxxx),xx1011xx(xx12xx)",
                C6: "C6:x35555(x13333),875555(431111),xx10121012(xx1314)",
                "C6/E": "C6/E:xx2213(xx2314),002013",
                C6add9: "C6add9:x32233(x21134),877788(211134)",
                "C6add9/D": "C6add9/D:x55555(x11111),x57580",
                "C7#5": "C7#5:x36354(x14132),81189xx(1412xx),8x8998(1x1231),xx10131112(xx1423)",
                "C7#5/A#": "C7#5/A#:x1211x(x1211x),xx8998(xx1231)",
                "C7#5/E": "C7#5/E:xx2314(xx2314)",
                "C7#9": "C7#9:81089811(131214)",
                C7: "C7:81089118(131241),xx10121112(xx1324),x35353(x13141),8108988(131211),x3x353(x1x141),x35556(x13334),875556(431112),81089x8(1312x1)",
                "C7/G": "C7/G:xx5556(xx1112)",
                C7b5: "C7b5:x3435x(x1213x),8989xx(1324xx),xx10111112(xx1223)",
                "C7b5/A#": "C7b5/A#:xx8978(xx2413)",
                C7b9: "C7b9:x32323(x21314),8x8989(1x1213)",
                "C7sus2/A#": "C7sus2/A#:xx8788(xx2134)",
                C7sus4: "C7sus4:x35363(x13141),81081088(131411),xx10121113(xx1324)",
                "C7sus4/F": "C7sus4/F:xx3313(xx2314)",
                "C7sus4/G": "C7sus4/G:xx5566(xx1122)",
                C9: "C9:87878x(21314x),81089810(131214)",
                "C9-5": "C9-5:x32332(x21341),878778(213114)",
                C9b5: "C9b5:03x332",
                Cadd9: "Cadd9:x3203x(x2103x),x30010(x30010),x30030(x20030),xx109810(xx3214),x32030,x32033",
                "Cadd9/D": "Cadd9/D:xx0010(xx0010),10x10988(4x3211),xx0553,x555x0",
                "Cadd9/G": "Cadd9/G:3x0010,x101212130",
                Caug: "Caug:x32110(x43120),x32114(x32114),x3655x(x1423x),87655x(43211x),xx10998(xx4231)",
                Cb5: "Cb5:x34550(x12340),xx10978(xx4312),89109x8(1342x1),xx10111312(xx1243)",
                "Cb5/E": "Cb5/E:xx14111312(xx4132)",
                "Cb5/F#": "Cb5/F#:xx4552(xx2341),xx45x0",
                Cdim: "Cdim:xxx542(xxx431),x3454x(x1243x),xx10878(xx4213),89108xx(1342xx),xx10111311(xx1243)",
                "Cdim/D#": "Cdim/D#:x6x878(x1x324)",
                "Cdim/D": "Cdim/D:x54542",
                Cdim7: "Cdim7:x34242(x23141),x31212(x41213),8978xx(2413xx),xx10111011(xx1324)",
                Cdom7: "Cdom7:x32310(x32410),x15141513x(x3241x)",
                Cm: "Cm:x35543(x13421),81010888(134111),x310xx(x310xx),x3101x(x3201x),xx10888(xx3111),xx10121311(xx1342),x15131213x(x4312x)",
                "Cm/D#": "Cm/D#:x6554x(x4231x),x6x888(x1x444),xx1013(xx1024),xx101x(xx102x),xx13121311(xx3241)",
                "Cm/G": "Cm/G:335543(113421),xx5543(xx3421),x1010888(x34111),3310xx(3410xx)",
                Cm3: "Cm3:x31xxx(x31xxx),xxx54x(xxx21x),86xxxx(31xxxx),xx108xx(xx31xx)",
                Cm6: "Cm6:x31213(x31214),x35x45(x13x24),810108108(123141),xx10121011(xx1312)",
                "Cm6/D#": "Cm6/D#:xx1213",
                "Cm6/G": "Cm6/G:xx5545(xx2314)",
                Cm7: "Cm7:x35343(x13121),8108888(131111),x3x343(x1x243),x31313(x21314),x35346(x13124),81088118(131141),xx10121111(xx1322)",
                Cm7b5: "Cm7b5:x3434x(x1324x),x31312(x31412),8988118(121141),xx10111111(xx1222)",
                Cm9: "Cm9:81088810(131114)",
                Cmaj7: "Cmaj7:x32000(x32000),x15141212x(x4311x),x35453(x13241),x3x453(x1x342),8x998x(1x342x),xx10987(xx4321),8109988(142311),xx10121212(xx1333)",
                "Cmaj7/9": "Cmaj7/9:x30000(x30000),879787(214131)",
                "Cmaj7/B": "Cmaj7/B:x22010",
                "Cmaj7/E": "Cmaj7/E:032000",
                "Cmaj7/G": "Cmaj7/G:xx5557(xx1113)",
                Cmaj7sus4: "Cmaj7sus4:x33003",
                Csus2: "Csus2:x30033(x20034),x30013(x30014),x35533(x13411),8555xx(4111xx),xx107810(xx3124),xx10121310(xx1341)",
                Csus4: "Csus4:x33011(x34011),x35563(x13341),x33563(x11341),810101088(133311),88101088(113411),xx10121313(xx1344)",
                "Csus4/G": "Csus4/G:xx5568(xx1124),x10101088(x23411)",
                "D#": "D#:x65343(x43121),x68886(x12341),xx1343(xx1243),x6534x(x4312x),1110888x(43111x),111088811(321114),111313121111(134211)",
                "D#/A#": "D#/A#:6x888x(1x444x),xxx343(xxx121),665xxx(321xxx),xx88811(xx1114),x11343",
                "D#/C": "D#/C:x35343",
                "D#/G": "D#/G:3xx343(1xx243),xx5343(xx3121),x1088811(x31114),365343(143121)",
                "D#5": "D#5:xx134x(xx134x),x688xx(x134xx),111313xxx(134xxx),x688x6",
                "D#5/A#": "D#5/A#:x11xxx(x11xxx),66xxxx(11xxxx),xx88xx(xx11xx)",
                "D#6": "D#6:xx1313(xx1314),x65586(x21143),x68888(x13333),11108888(431111)",
                "D#6/A#": "D#6/A#:x1101x(x1203x)",
                "D#6add9": "D#6add9:x65566(x21134),111010101111(211134)",
                "D#6add9/F": "D#6add9/F:x88888(x11111)",
                "D#7#5": "D#7#5:xx1423(xx1423),x69687(x14132),11141112xx(1412xx),11x11121211(1x1231)",
                "D#7#5/B": "D#7#5/B:x21023(x21034)",
                "D#7#5/C#": "D#7#5/C#:x4544x(x1211x),xx11121211(xx1231)",
                "D#7#5/G": "D#7#5/G:xx5647(xx2314)",
                "D#7#9": "D#7#9:111311121114(131214)",
                "D#7": "D#7:xx1323(xx1324),11131112x11(1312x1),111311121411(131241),x68686(x13141),x6x686(x1x131),11x111211x(1x243x),x68889(x13334),11108889(431112)",
                "D#7/A#": "D#7/A#:x11023(x12034),xx8889(xx1112),x11323",
                "D#7b5": "D#7b5:xx1223(xx1234),x6768x(x1213x),11121112xx(1324xx)",
                "D#7b9": "D#7b9:11x11121112(1x1213)",
                "D#7sus2/C#": "D#7sus2/C#:xx11101111(xx2134)",
                "D#7sus4": "D#7sus4:xx1324(xx1324),x68696(x13141),11131113x11(1213x1)",
                "D#7sus4/A#": "D#7sus4/A#:xx8899(xx1122)",
                "D#7sus4/G#": "D#7sus4/G#:xx6646(xx2314)",
                "D#9": "D#9:1110111011x(21314x),111311121113(131214)",
                "D#add9": "D#add9:x65363(x32141),x63343(x41121),x63363(x31141),xx13121113(xx3214)",
                "D#add9/F": "D#add9/F:xx3343(xx1121),13x13121111(3x4211)",
                "D#aug": "D#aug:xx1003(xx1003),x65447(x32114),x6988x(x1423x),1110988x(43211x),xx13121211(xx4231)",
                "D#b5": "D#b5:xx1243(xx1243),x6788x(x1233x),xx13121011(xx4312),11121312xx(1243xx),11121312x11(1342x1)",
                "D#b5/A": "D#b5/A:x01043(x01043),xx7885(xx2341)",
                "D#b5/G": "D#b5/G:xx5243(xx4132)",
                "D#dim": "D#dim:xxx875(xxx431),x6787x(x1243x),xx131110x(xx421x),xx13111011(xx4213),11121311xx(1342xx)",
                "D#dim/B": "D#dim/B:x21202,x24242",
                "D#dim/F#": "D#dim/F#:xx4242(xx3141),x9787x(x3121x),x9x111011(x1x324)",
                "D#dim7": "D#dim7:xx1212(xx1324),x64545(x41213),x67575(x23141),11121011xx(2413xx)",
                "D#m": "D#m:x68876(x13421),xx1342(xx1342),x643xx(x421xx),x6xx76(x1xx21),x6434x(x4312x),111313111111(134111)",
                "D#m/A#": "D#m/A#:668876(113421),x1x342(x1x342),664xxx(341xxx)",
                "D#m/F#": "D#m/F#:xx4342(xx3241),x9887x(x4231x),2x4342(1x3241),xx4346(xx2134)",
                "D#m6": "D#m6:xx1312(xx1312),x64546(x31214),111313111311(123141)",
                "D#m6/A#": "D#m6/A#:xx8878(xx2314)",
                "D#m7": "D#m7:x68676(x13121),xx1322(xx1423),x68679(x13124),11x111111x(1x111x),x64646(x21314),1113x111411(13x141),111311111411(131141),111311111111(131111)",
                "D#m7b5": "D#m7b5:xx1222(xx1333),x64645(x31412),x6767x(x1324x),111211111411(121141)",
                "D#m9": "D#m9:111311111113(131114)",
                "D#maj7": "D#maj7:xx1333(xx1444),x68786(x13241),x6x786(x1x342),x65333(x43111),xx13121110(xx4321),111312121111(142311)",
                "D#maj7/9": "D#maj7/9:x63333(x41111),111012101110(214131)",
                "D#maj7/A#": "D#maj7/A#:xx88810(xx1113)",
                "D#maj7/D": "D#maj7/D:xx0343(xx0132)",
                "D#sus2": "D#sus2:xx1341(xx1341),x63346(x31124),x63366(x21134),x68866(x13411),11888xx(4111xx),xx13101113(xx3124)",
                "D#sus4": "D#sus4:xx1344(xx1344),x6634x(x3412x),x68896(x13341),x66896(x11341),111313131111(133311),111113131111(113411)",
                "D#sus4/A#": "D#sus4/A#:xx88911(xx1124)",
                D: "D:xx0232(xx0132),xx12141514(xx1343),xx0775,x54232(x43121),x57775(x12341),x5777x(x1444x),109777x(43111x),10977710(321114),101212111010(134211)",
                "D/A#": "D/A#:x10232(x10243)",
                "D/A": "D/A:x00232(x00132),x07775(x02341),x04232(x03121),557775(112341),xx77710(xx1114)",
                "D/B": "D/B:x20232(x10243),x20202,x24232",
                "D/C#": "D/C#:x40232(x30121)",
                "D/C": "D/C:x30232(x30142)",
                "D/D#": "D/D#:xx1232(xx1243)",
                "D/E": "D/E:000232(000132),xx2232,004230",
                "D/F#": "D/F#:200232(100243),xx4232(xx3121),x977710(x31114),254232(143121)",
                "D/F": "D/F:100232(100243)",
                "D/G#": "D/G#:400232(400132)",
                "D/G": "D/G:300232(200131)",
                D3: "D3:x54xxx(x21xxx),xxx77x(xxx11x),109xxxx(21xxxx),xx1211xx(xx21xx)",
                D5: "D5:xx023x(xx012x),x577xx(x134xx),101212xxx(134xxx)",
                "D5/A": "D5/A:x00xxx(x00xxx),55xxxx(11xxxx),xx77xx(xx11xx),x00235,5577x5",
                D5aug: "D5aug:xx03xx(xx03xx),x58xxx(x14xxx),1013xxxx(14xxxx)",
                D5dim: "D5dim:xx01xx(xx01xx),x56xxx(x12xxx),1011xxxx(12xxxx)",
                D6: "D6:xx0202(xx0102),x54475(x21143),x57777(x13333),1097777(431111)",
                "D6/A": "D6/A:x04432",
                D6add9: "D6add9:x54200(x43100),x54455(x21134),109991010(211134)",
                "D6add9/E": "D6add9/E:022232(011121),x77777(x11111),002432,020202",
                "D7#5": "D7#5:xx0312(xx0312),x58576(x14132),10131011xx(1412xx),10x10111110(1x1231)",
                "D7#5/C": "D7#5/C:x3433x(x1211x),xx10111110(xx1231)",
                "D7#5/F#": "D7#5/F#:xx4536(xx2314)",
                "D7#9": "D7#9:101210111013(131214)",
                D7: "D7:xx0212(xx0213),10121011x10(1312x1),101210111310(131241),xx12141314(xx1324),x57575(x13141),xx0575(xx0131),101210111010(131211),x57778(x13334),1097778(431112)",
                "D7/A": "D7/A:xx7778(xx1112),x00212",
                "D7/C": "D7/C:x3x232",
                D7b5: "D7b5:xx0112(xx0113),x5657x(x1213x),10111011xx(1324xx)",
                "D7b5/C": "D7b5/C:xx1011910(xx2413)",
                D7b9: "D7b9:10x10111011(1x1213)",
                D7sus2: "D7sus2:xx0210,xx0555",
                "D7sus2/C": "D7sus2/C:xx1091010(xx2134)",
                D7sus4: "D7sus4:xx0213(xx0213),x57585(x13141),10121012x10(1213x1)",
                "D7sus4/A": "D7sus4/A:xx7788(xx1122)",
                "D7sus4/G": "D7sus4/G:xx5535(xx2314)",
                "D9#5": "D9#5:03x332",
                D9: "D9:10910910x(21314x),101210111012(131214),x57570",
                "D9-5": "D9-5:2x0110(3x0120),x54554(x21341),109109910(213114)",
                "D9/E": "D9/E:000212",
                "D9/F#": "D9/F#:200210(200310)",
                Dadd9: "Dadd9:x54230(x43120),x52232(x41121),x54252(x32141),x52252(x31141),xx12111012(xx3214)",
                "Dadd9/A": "Dadd9/A:x02232",
                "Dadd9/E": "Dadd9/E:12x12111010(4x3211),xx2232,000232,004230",
                "Dadd9/F#": "Dadd9/F#:2x0230,x977x0",
                Daug: "Daug:xx0332(xx0231),x54336(x32114),x5877x(x1423x),109877x(43211x),xx12111110(xx4231)",
                Db: "Db:x46664(x12341),x43121(x43121),x4666x(x1444x),98666x(43111x),986669(321114),911111099(134211),xx11131413(xx1343)",
                Db5: "Db5:xx0132(xx0132),x5677x(x1233x),xx1211910(xx4312),10111211xx(1243xx),10111211x10(1342x1),xx12131514(xx1243)",
                "Db5/F#": "Db5/F#:xx4132(xx4132)",
                "Db5/G#": "Db5/G#:xx6774(xx2341)",
                Db7: "Db7:x46464(x13141),911910129(131241),xx11131213(xx1324),x43404,91191099(131211),x4x464(x1x141),x46667(x13334),986667(431112),911910x9(1312x1)",
                "Db9-5": "Db9-5:x43443(x21341),989889(213114)",
                Dbdom7: "Dbdom7:x4342x(x3241x)",
                Dbm: "Dbm:x46654(x13421),91111999(134111),x421xx(x421xx),x4212x(x4312x),x4xx54(x1xx21),xx11131412(xx1342),x466x0",
                Dbmaj7: "Dbmaj7:x4x564(x1x342),x43111(x43111),x4656x(x1324x),x46564(x13241),xx111098(xx4321),911101099(142311),xx11131313(xx1333)",
                Ddim: "Ddim:xx0131(xx0131),xxx764(xxx431),x5676x(x1243x),xx12109x(xx421x),xx1210910(xx4213),10111210xx(1342xx)",
                "Ddim/A#": "Ddim/A#:x13131",
                "Ddim/B": "Ddim/B:x20101",
                "Ddim/F": "Ddim/F:x8x10910(x1x324)",
                Ddim7: "Ddim7:xx0101(xx0102),x53434(x41213),x56464(x23141),1011910xx(2413xx)",
                Ddom7: "Ddom7:x5453x(x3241x)",
                Dm: "Dm:xx0231(xx0231),x57765(x13421),xx0101010(xx0111),xx0765(xx0321),x5323x(x4312x),101212101010(134111),xx12141513(xx1342)",
                "Dm/A": "Dm/A:x00231(x00231),557765(113421),x03231(x03241),x07765(x03421)",
                "Dm/B": "Dm/B:x20201",
                "Dm/F": "Dm/F:xx3231(xx3241),100231(100342),x8776x(x4231x),1x3231(1x3241)",
                Dm3: "Dm3:x53xxx(x31xxx),xxx76x(xxx21x),108xxxx(31xxxx),xx1210xx(xx31xx)",
                Dm6: "Dm6:xx0201(xx0201),x53435(x31214),101212101210(123141)",
                "Dm6/A": "Dm6/A:xx7767(xx2314)",
                "Dm6/F": "Dm6/F:123231",
                Dm7: "Dm7:xx0211(xx0211),xx12141313(xx1322),xx0565,x57565(x13121),x5x565(x1x243),x57568(x13124),x53535(x21314),1012x101310(13x141),101210101310(131141),101210101010(131111)",
                Dm7b5: "Dm7b5:xx0111(xx0111),x53534(x31412),x5656x(x1324x),101110101310(121141)",
                Dm9: "Dm9:101210101012(131114)",
                "Dm9/F": "Dm9/F:100210(100320)",
                "Dmadd9/A": "Dmadd9/A:xx7760",
                Dmaj7: "Dmaj7:xx0222(xx0111),xx12141414(xx1333),xx0141414,x57675(x13241),xx0675(xx0241),x5767x(x1324x),x54222(x43111),xx1211109(xx4321),101211111010(142311)",
                "Dmaj7/9": "Dmaj7/9:x52222(x41111),109119109(214131)",
                "Dmaj7/A": "Dmaj7/A:xx7779(xx1113)",
                Dmmaj7: "Dmmaj7:xx0221",
                Dsus2: "Dsus2:xx0230(xx0340),x52235(x31124),x52255(x21134),x57755(x13411),10777xx(4111xx),xx1291012(xx3124)",
                "Dsus2/B": "Dsus2/B:x20230",
                "Dsus2/F#": "Dsus2/F#:2x0230,x977x0",
                "Dsus2/G#": "Dsus2/G#:4x0230",
                Dsus4: "Dsus4:xx0233(xx0134),x5523x(x3412x),x57785(x13341),x55785(x11341),101212121010(133311),101012121010(113411),xx12141515(xx1344)",
                "Dsus4/A": "Dsus4/A:x077810(x01124),x00033,5x0035",
                E: "E:022100(023100),121414131212(134211),x76450,x76454(x43121),x7999x(x1444x),xx2454(xx1243),076454(043121),x79997(x13331),1211999x(43111x),121199912(321114)",
                "E/A": "E/A:x02100",
                "E/B": "E/B:x22100(x23100),7x999x(1x444x),7xx454(4xx121),xx99912(xx1114),776454(443121),779997(112341)",
                "E/C#": "E/C#:x42100(x42100),x46454",
                "E/C": "E/C:x32100(x32100)",
                "E/D#": "E/D#:xx1100(xx1200)",
                "E/D": "E/D:xx0100(xx0100)",
                "E/F#": "E/F#:222100(234100)",
                "E/F": "E/F:xx3100(xx3100),122100(023100)",
                "E/G#": "E/G#:476454(143121),422100(423100),4xx454(1xx243),xx6454(xx3121)",
                "E/G": "E/G:322100(423100)",
                "E11/A": "E11/A:x00100",
                "E11/b9": "E11/b9:003434",
                E3: "E3:xx21xx(xx21xx),x76xxx(x21xxx),xxx99x(xxx11x),1211xxxx(21xxxx)",
                E5: "E5:022xxx(011xxx),xx245x(xx134x),x799xx(x134xx),02xxx0,x799x0",
                "E5/B": "E5/B:x22xxx(x11xxx),77xxxx(11xxxx),xx99xx(xx11xx)",
                E5aug: "E5aug:03xxxx(03xxxx),xx25xx(xx14xx),x710xxx(x14xxx)",
                E5dim: "E5dim:01xxxx(01xxxx),xx23xx(xx12xx),x78xxx(x12xxx)",
                E6: "E6:022120(023140),x76697(x21143),x79999(x13333),12119999(431111)",
                "E6/B": "E6/B:x22120(x23130)",
                E6add9: "E6add9:x76677(x21134),121111111212(211134)",
                "E6add9/F#": "E6add9/F#:242424(121314),x99999(x11111)",
                "E7#5": "E7#5:030110(030120),05655x(01211x),x710798(x14132)",
                "E7#9": "E7#9:020103(020104)",
                E7: "E7:022130(023140),121199910(431112),121412131512(131241),020100(020100),xx2434(xx1324),x79797(x13141),020130(020140),x799910(x13334)",
                "E7/B": "E7/B:xx99910(xx1112),x20130",
                "E7/D": "E7/D:xx0100",
                E7b5: "E7b5:xx2334(xx1234),01213x(01214x),010130(010240),x7879x(x1213x)",
                "E7b5/D": "E7b5/D:xx12131112(xx2413)",
                "E7b5/G#": "E7b5/G#:xx6756(xx2413)",
                E7b9: "E7b9:0x0101(0x0102)",
                "E7sus2/D": "E7sus2/D:xx12111212(xx2134)",
                E7sus4: "E7sus4:020200(020300),0x2435(0x1324),x797107(x13141)",
                "E7sus4/B": "E7sus4/B:x20230",
                E9: "E9:0201x2(0201x3),1211121112x(21314x),020102",
                "E9-5": "E9-5:012132(012143),x76776(x21341),121112111112(213114)",
                "E9/F#": "E9/F#:220100",
                Eadd9: "Eadd9:024100(024100),022102(023104),x76474(x32141),x74474(x31141),x74454(x41121),129999x(41111x)",
                "Eadd9/F#": "Eadd9/F#:2x2100(2x3100),xx4454(xx1121),222100",
                Eaug: "Eaug:032110(043120),0x6554(0x4231),x76558(x32114),07655x(03211x),0x10998(0x4231),12111099x(43211x),0111099x(03211x),xx14131312(xx4231)",
                Eb: "Eb:x65343(x43121),x68886(x12341),xx1343(xx1243),x6534x(x4312x),1110888x(43111x),111088811(321114),111313121111(134211)",
                Eb3: "Eb3:xx10xx(xx10xx),x65xxx(x21xxx),xxx88x(xxx11x),1110xxxx(21xxxx)",
                Eb5: "Eb5:0121x0(0132x0),xx2354(xx1243),x7899x(x1233x),xx14131112(xx4312),12131413x12(1342x1)",
                "Eb5/A#": "Eb5/A#:x121x0(x132x0)",
                "Eb5/G#": "Eb5/G#:xx6354(xx4132)",
                Eb5aug: "Eb5aug:xx14xx(xx14xx),x69xxx(x14xxx),1114xxxx(14xxxx)",
                Eb5dim: "Eb5dim:xx12xx(xx12xx),x67xxx(x12xxx),1112xxxx(12xxxx)",
                Eb7: "Eb7:xx1323(xx1324),11131112x11(1312x1),111311121411(131241),x68686(x13141),x6x686(x1x131),11x111211x(1x243x),x68889(x13334),11108889(431112)",
                "Eb9-5": "Eb9-5:x01021(x01032),x65665(x21341),111011101011(213114)",
                Ebdim: "Ebdim:xxx875(xxx431),x6787x(x1243x),xx131110x(xx421x),xx13111011(xx4213),11121311xx(1342xx)",
                Ebdim7: "Ebdim7:xx1212(xx1324),x64545(x41213),x67575(x23141),11121011xx(2413xx)",
                Ebdom7: "Ebdom7:x6564x(x3241x)",
                Ebm: "Ebm:x68876(x13421),xx1342(xx1342),x643xx(x421xx),x6xx76(x1xx21),x6434x(x4312x),111313111111(134111)",
                Ebm3: "Ebm3:x64xxx(x31xxx),xxx87x(xxx21x),119xxxx(31xxxx)",
                Ebm7: "Ebm7:x68676(x13121),xx1322(xx1423),x68679(x13124),11x111111x(1x111x),x64646(x21314),1113x111411(13x141),111311111411(131141),111311111111(131111)",
                Ebmaj7: "Ebmaj7:xx1333(xx1444),x68786(x13241),x4x564(x1x342),x6x786(x1x342),x43111(x43111),x4656x(x1324x),x65333(x43111),x46564(x13241),xx111098(xx4321),911101099(142311),xx11131313(xx1333),xx13121110(xx4321),111312121111(142311)",
                Ebsus4: "Ebsus4:x4412x(x3412x),x46674(x13341),x44674(x11341),911111199(133311),99111199(113411),xx11131414(xx1344)",
                Edim: "Edim:0120xx(0120xx),xx2353(xx1243),x7898x(x1243x),xx14121112(xx4213)",
                "Edim/C": "Edim/C:x35353",
                "Edim/G": "Edim/G:x10x121112(x1x324)",
                Edim7: "Edim7:xx2323(xx1324),012020(012030),04535x(02314x),x75656(x41213),x78686(x23141),12131112xx(2413xx)",
                Edom7: "Edom7:x7675x(x3241x)",
                Em: "Em:022000(023010),0xx453(0xx241),x79987(x13421),xx2453(xx1342),0x5453(0x3241),x7545x(x4312x),121414121212(134111)",
                "Em/A": "Em/A:x02000,x05450",
                "Em/B": "Em/B:x22000(x23000),779987(113421),x2x453(x1x342),x22003(x12004),x25xx0",
                "Em/C#": "Em/C#:x42000(x31000)",
                "Em/C": "Em/C:x32000(x21000),x35453",
                "Em/D#": "Em/D#:xx1000(xx1000)",
                "Em/D": "Em/D:xx0000(xx0000),xx0987,xx0121212",
                "Em/F#": "Em/F#:222000(123000)",
                "Em/G": "Em/G:322000(312000),xx5453(xx3241),3x5453(1x3241),3xx000(2xx000),x10998x(x4231x)",
                Em3: "Em3:xx20xx(xx10xx),x75xxx(x31xxx),xxx98x(xxx21x),1210xxxx(31xxxx)",
                Em6: "Em6:xx2423(xx1312),022020(023040),x75657(x31214)",
                "Em6/B": "Em6/B:xx9989(xx2314)",
                Em7: "Em7:020000(020000),x797810(x13124),121412121512(131141),x79787(x13121),xx2433(xx1322),022033(012044),022030(023040),020030(020040),0x5430(0x3210),x75757(x21314),x7978x(x1312x)",
                Em7b5: "Em7b5:xx2333(xx1333),010030(010040),x75756(x31412),x7878x(x1324x),12x121211x(2x341x)",
                Em9: "Em9:020002(020003),022032(012043),020032",
                "Em9/F#": "Em9/F#:220000",
                Emadd9: "Emadd9:022002,024000",
                "Emadd9/F#": "Emadd9/F#:222000",
                Emaj7: "Emaj7:xx2444(xx1444),xx14131211(xx4321),121413131212(142311),0x6440,022444(011444),x79897(x13241),021100(031200),022140(023140),x76444(x43111)",
                "Emaj7/9": "Emaj7/9:021102(031204),x74444(x41111),121113111211(214131)",
                "Emaj7/9/G#": "Emaj7/9/G#:4x4440",
                "Emaj7/B": "Emaj7/B:xx99911(xx1113)",
                "Emaj7/D#": "Emaj7/D#:xx1100",
                "Emaj7sus4/B": "Emaj7sus4/B:x21200",
                "Emin/maj9": "Emin/maj9:064000",
                "Emmaj7/D#": "Emmaj7/D#:xx1000",
                "Emmaj7/G": "Emmaj7/G:3x1000",
                Esus2: "Esus2:xx2452(xx1341),x74457(x31124),x74477(x21134),x79977(x13411),12999xx(4111xx),xx14111214(xx3124)",
                "Esus2/A": "Esus2/A:x04400",
                "Esus2/C#": "Esus2/C#:x444x0",
                Esus4: "Esus4:022200(023410),002455(001234),077450(034120),x799107(x13341),x779107(x11341),121414141212(133311),002200,002400",
                "Esus4/B": "Esus4/B:x22200(x12300),xx991012(xx1124)",
                "Esus4/C": "Esus4/C:x32200",
                "Esus4/G": "Esus4/G:3x2200",
                "F#": "F#:244322(134211),xx4322(xx3211),x98676(x43121),xx4676(xx1243),x91111119(x13331),1413111111x(43111x),141311111114(321114)",
                "F#/A#": "F#/A#:698676(143121),6xx676(1xx243),x1xx22(x1xx34),x1432x(x1432x)",
                "F#/C#": "F#/C#:x44322(x34211),9x111111x(1x444x),9xx676(4xx121),xx11111114(xx1114),x4432x(x3421x)",
                "F#/D#": "F#/D#:xx1322",
                "F#/F": "F#/F:xx3322",
                "F#3": "F#3:xx43xx(xx21xx),21xxxx(21xxxx),x98xxx(x21xxx),xxx1111x(xxx11x)",
                "F#5": "F#5:244xxx(134xxx),xx467x(xx134x),x91111xx(x134xx)",
                "F#5/C#": "F#5/C#:x44xxx(x11xxx),99xxxx(11xxxx),xx1111xx(xx11xx)",
                "F#5aug": "F#5aug:25xxxx(14xxxx),xx47xx(xx14xx),x912xxx(x14xxx)",
                "F#5dim": "F#5dim:23xxxx(12xxxx),xx45xx(xx12xx),x910xxx(x12xxx)",
                "F#6": "F#6:x911111111(x13333)",
                "F#6add9": "F#6add9:211122(211134),x98899(x21134)",
                "F#6add9/G#": "F#6add9/G#:x1111111111(x11111)",
                "F#7#5": "F#7#5:xx4330(xx3120),2x2332(1x1231),x91291110(x14132),2x4330",
                "F#7#5/E": "F#7#5/E:x7877x(x1211x)",
                "F#7#9": "F#7#9:21222x(21333x),242325(131214)",
                "F#7#9/A": "F#7#9/A:x04320",
                "F#7": "F#7:242322(131211),141311111112(431112),xx4320(xx3210),x9119119(x13141),2x232x(1x243x),242352(131241),xx4656(xx1324),x911111112(x13334)",
                "F#7/C#": "F#7/C#:xx11111112(xx1112)",
                "F#7b5": "F#7b5:xx4310(xx4310),2323xx(1324xx),xx4556(xx1234),x910911x(x1213x)",
                "F#7b9": "F#7b9:242323(141213)",
                "F#7sus2/E": "F#7sus2/E:0x2122(0x2134)",
                "F#7sus4": "F#7sus4:xx4420(xx3410),242422(131411),x9119129(x13141)",
                "F#7sus4/C#": "F#7sus4/C#:x444x0",
                "F#9": "F#9:21212x(21314x),242324(131214)",
                "F#9-5": "F#9-5:212112(213114),898998(121341)",
                "F#add9": "F#add9:xx4324(xx3214),x96696(x31141),x98696(x32141),x96676(x41121),1411111111x(41111x)",
                "F#add9/G#": "F#add9/G#:4x4322(3x4211),xx6676(xx1121)",
                "F#aug": "F#aug:xx4332(xx4231),x9877x(x3211x),x987710(x32114),14131211xx(4321xx),1413121111x(43211x)",
                "F#b5": "F#b5:2343x2(1342x1),xx4576(xx1243),x9101111x(x1233x)",
                "F#b5/A#": "F#b5/A#:xx8576(xx4132)",
                "F#dim": "F#dim:2342xx(1342xx),xx4575(xx1243),x9101110x(x1243x)",
                "F#dim/D#": "F#dim/D#:xx1212",
                "F#dim/D": "F#dim/D:x57575",
                "F#dim/E": "F#dim/E:xx2212",
                "F#dim7": "F#dim7:2312xx(2413xx),xx4545(xx1324),x97878(x41213),x9108108(x23141)",
                "F#dom7": "F#dom7:x9897x(x3241x)",
                "F#m": "F#m:244222(134111),xx4675(xx1342),xx4222(xx3111),x91111109(x13421),x9767x(x4312x)",
                "F#m/A": "F#m/A:x04222(x03111),5x7675(1x3241),5xx222(4xx111),x07675(x03241),xx7675(xx3241),x12111110x(x4231x)",
                "F#m/C#": "F#m/C#:x44222(x34111),991111109(113421),x4x675(x1x342),997xxx(341xxx)",
                "F#m/D": "F#m/D:xx0222,xx0141414",
                "F#m/E": "F#m/E:0x4220,002222",
                "F#m3": "F#m3:xx42xx(xx31xx),x97xxx(x31xxx),xxx1110x(xxx21x)",
                "F#m6": "F#m6:244242(123141)",
                "F#m6/C#": "F#m6/C#:xx11111011(xx2314)",
                "F#m7": "F#m7:242222(131111),2x2220,x9119109(x13121),xx4220(xx4120),242252(131141),xx4655(xx1322),x97979(x21314),x911910x(x1312x),x91191012(x13124)",
                "F#m7b5": "F#m7b5:20221x(20341x),232252(121141),xx4555(xx1333),x97978(x31412),x910910x(x1324x)",
                "F#m9": "F#m9:242224(131114)",
                "F#maj7": "F#maj7:xx4666(xx1444),2x332x(1x342x),xx4321(xx4321),x98666(x43111),243322(142311),x91110119(x13241)",
                "F#maj7/9": "F#maj7/9:213121(214131),x96666(x41111)",
                "F#maj7/F": "F#maj7/F:xx3322",
                "F#maj7sus4/C#": "F#maj7sus4/C#:x44x01(x34x01)",
                "F#sus2": "F#sus2:xx4124(xx3124),xx4674(xx1341),x96699(x21134),x96679(x31124),x9111199(x13411),14111111xx(4111xx)",
                "F#sus4": "F#sus4:244422(133311),xx4677(xx1344),x9967x(x3412x),x91111129(x13341)",
                F: "F:133211(134211),x87565(x43121),xx3565(xx1243),xx3211(xx3211),x81010108(x13331),1312101010x(43111x),131210101013(321114)",
                "F/A": "F/A:x03211(x03211),587565(143121),xx7565(xx3121),5xx565(1xx243)",
                "F/C": "F/C:x33211(x34211),8x101010x(1x444x),8xx565(4xx121),xx10101013(xx1114)",
                "F/D#": "F/D#:xx1211",
                "F/D": "F/D:xx0211,xx0565,x57565",
                "F/E": "F/E:033211(034211),xx2211,003210",
                "F/G": "F/G:303211(304211)",
                F3: "F3:10xxxx(10xxxx),xx32xx(xx21xx),x87xxx(x21xxx),xxx1010x(xxx11x)",
                F5: "F5:133xxx(134xxx),xx356x(xx134x),x81010xx(x134xx),133xx1",
                "F5/C": "F5/C:x33xxx(x11xxx),88xxxx(11xxxx),xx1010xx(xx11xx)",
                F5aug: "F5aug:14xxxx(14xxxx),xx36xx(xx14xx),x811xxx(x14xxx)",
                F5dim: "F5dim:12xxxx(12xxxx),xx34xx(xx12xx),x89xxx(x12xxx)",
                F6: "F6:1302xx(1302xx),xx3535(xx1314),x877108(x21143),x810101010(x13333),131210101010(431111)",
                F6add9: "F6add9:100011(100023),x87788(x21134)",
                "F6add9/G": "F6add9/G:x1010101010(x11111),3x0211",
                "F7#5": "F7#5:1x1221(1x1231),xx3645(xx1423),x8118109(x14132)",
                "F7#5/D#": "F7#5/D#:x6766x(x1211x)",
                "F7#9": "F7#9:131214(131214)",
                F7: "F7:131211(131211),xx3545(xx1324),x8108108(x13141),131241(131241),1x121x(1x243x),x810101011(x13334),131210101011(431112)",
                "F7/A": "F7/A:x01211(x01211)",
                "F7/C": "F7/C:xx10101011(xx1112)",
                "F7/D#": "F7/D#:xx1211",
                F7b5: "F7b5:12120x(13240x),xx3445(xx1234),x89810x(x1213x)",
                "F7b5/A": "F7b5/A:xx7867(xx2413)",
                F7b9: "F7b9:1x1212(1x1213)",
                "F7sus2/D#": "F7sus2/D#:xx1011(xx1023)",
                F7sus4: "F7sus4:131311(131411),xx3546(xx1324),x8108118(x13141)",
                "F7sus4/A#": "F7sus4/A#:xx8868(xx2314)",
                F9: "F9:101011(102034),131213(131214)",
                "F9-5": "F9-5:101001(102003),787887(121341)",
                Fadd9: "Fadd9:xx3213(xx3214),x87585(x32141),x85585(x31141),x85565(x41121),1310101010x(41111x)",
                "Fadd9/G": "Fadd9/G:3x3211(3x4211),xx5565(xx1121)",
                Faug: "Faug:xx3221(xx4231),x87669(x32114),13121110xx(4321xx),1312111010x(43211x)",
                "Faug/D": "Faug/D:xx0221",
                Fb5: "Fb5:xx3201(xx3201),1232x1(1342x1),12320x(12430x),10320x(12320x),xx3465(xx1243),x891010x(x1233x)",
                "Fb5/A": "Fb5/A:xx7465(xx4132)",
                Fdim: "Fdim:1231xx(1342xx),xx3101(xx4102),xx3464(xx1243),x89109x(x1243x)",
                "Fdim/C#": "Fdim/C#:x43404",
                "Fdim/D": "Fdim/D:xx0101",
                Fdim7: "Fdim7:xx3434(xx1324),1201xx(2403xx),x86767(x41213),x89797(x23141)",
                Fdom7: "Fdom7:x8786x(x3241x)",
                Fm: "Fm:133111(134111),xx3111(xx3111),xx3564(xx1342),x8101098(x13421),x8656x(x4312x)",
                "Fm/C#": "Fm/C#:x46564",
                "Fm/C": "Fm/C:x33111(x34111),88101098(113421),x3x111(x3x111),886xxx(341xxx)",
                "Fm/D#": "Fm/D#:xx1111",
                "Fm/D": "Fm/D:xx0111",
                "Fm/G#": "Fm/G#:xx6564(xx3241),4x6564(1x3241),x1110109x(x4231x),433111(423111),4xx111(4xx111)",
                Fm3: "Fm3:xx31xx(xx31xx),x86xxx(x31xxx),xxx109x(xxx21x),1311xxxx(31xxxx)",
                Fm6: "Fm6:133131(123141),xx3534(xx1312),x86768(x31214)",
                "Fm6/C": "Fm6/C:xx1010910(xx2314)",
                Fm7: "Fm7:131111(131111),xx3544(xx1423),x8x898(x1x243),131141(131141),x810898(x13121),x86868(x21314),x81089x(x1312x),x8108911(x13124)",
                Fm7b5: "Fm7b5:xx3444(xx1333),121141(121141),x86867(x31412),x8989x(x1324x)",
                Fm9: "Fm9:131113(131114)",
                "Fm9/G#": "Fm9/G#:4x3543(2x1431)",
                Fmaj7: "Fmaj7:xx3210(xx3210),1x2210,133210,xx3555(xx1444),1x221x(1x342x),132211(142311),x8109108(x13241),103210(104320),x87555(x43111)",
                "Fmaj7/9": "Fmaj7/9:102010(103020),103010(104020),x85555(x41111)",
                "Fmaj7/9/E": "Fmaj7/9/E:003013",
                "Fmaj7/C": "Fmaj7/C:xx10101012(xx1113)",
                "Fmaj7/E": "Fmaj7/E:xx2211,003210",
                "Fmaj7add#11": "Fmaj7add#11:133200",
                "Fmaj7add#11/E": "Fmaj7add#11/E:023210",
                Fsus2: "Fsus2:xx3011(xx3011),xx3013(xx3014),xx3563(xx1341),x85568(x31124),x85588(x21134),x8101088(x13411),13101010xx(4111xx),xx15121315(xx3124)",
                Fsus4: "Fsus4:133311(133311),xx3566(xx1344),x8856x(x3412x),x81010118(x13341),x8810118(x11341)",
                "Fsus4/C": "Fsus4/C:x33311(x23411)",
                "G#": "G#:466544(134211),xx6544(xx3211),xx6898(xx1243),431114(321114),x1110898(x43121),x11131313x(x1234x),x1113131311(x13331)",
                "G#/C": "G#/C:x31114(x31114),8xx898(1xx243),x3xx44(x1xx34),x3654x(x1432x)",
                "G#/D#": "G#/D#:x66544(x34211),xx1114(xx1114),x6654x(x3421x),xxx898(xxx121)",
                "G#/F#": "G#/F#:xx4544",
                "G#/F": "G#/F:x810898",
                "G#5": "G#5:466xxx(134xxx),xx689x(xx134x),x111313xx(x134xx),466xx4",
                "G#5/D#": "G#5/D#:xx11xx(xx11xx),x66xxx(x11xxx),1111xxxx(11xxxx)",
                "G#6": "G#6:431111(431111)",
                "G#6/D#": "G#6/D#:xx1111",
                "G#6add9": "G#6add9:411311(411311),433344(211134),x1110101111(x21134)",
                "G#6add9/A#": "G#6add9/A#:x11111(x11111)",
                "G#7#5": "G#7#5:4x4554(1x1231),x1114111312(x14132)",
                "G#7#5/E": "G#7#5/E:032112(042113)",
                "G#7#5/F#": "G#7#5/F#:xx4554(xx1231),x91099x(x1211x)",
                "G#7#9": "G#7#9:464547(131214)",
                "G#7#9/B": "G#7#9/B:x21112(x21113)",
                "G#7": "G#7:464544(131211),xx6878(xx1324),4x454x(1x243x),431112(431112),x1113111311(x13141),464574(131241),x1113131314(x13334)",
                "G#7/D#": "G#7/D#:xx1112(xx1112)",
                "G#7/F#": "G#7/F#:xx4544",
                "G#7b5": "G#7b5:430112(430112),4545xx(1324xx),xx6778(xx1234)",
                "G#7b9": "G#7b9:4x4545(1x1213)",
                "G#7sus2/F#": "G#7sus2/F#:xx4344(xx2134)",
                "G#7sus4": "G#7sus4:464644(131411),xx6879(xx1324)",
                "G#7sus4/D#": "G#7sus4/D#:xx1122(xx1123)",
                "G#9": "G#9:43434x(21314x),464546(131214)",
                "G#add9": "G#add9:43131x(42131x),xx6546(xx3214),x11108118(x32141),x1188118(x31141),x118898(x41121)",
                "G#add9/A#": "G#add9/A#:6x6544(3x4211),xx8898(xx1121)",
                "G#aug": "G#aug:43211x(43211x),xx6554(xx4231),x11109912(x32114),x1110990(x32114),xxx131312(xxx231)",
                "G#b5": "G#b5:xx6534(xx4312),4565x4(1342x1),xx6798(xx1243),x11121313x(x1233x)",
                "G#b5/C": "G#b5/C:x3011x(x3012x),xx10798(xx4132)",
                "G#dim": "G#dim:4564xx(1342xx),xx6797(xx1243),x11121312x(x1243x)",
                "G#dim/B": "G#dim/B:x2x434(x1x324),x20134(x20134)",
                "G#dim/E": "G#dim/E:020100,022130",
                "G#dim/F": "G#dim/F:xx3434",
                "G#dim7": "G#dim7:4534xx(2413xx),xx6767(xx1324),x11910910(x41213),x1112101210(x23141)",
                "G#m": "G#m:466444(134111),xx6897(xx1342),xx6444(xx3111),421xxx(421xxx),x11989x(x4312x),x1113131211(x13421)",
                "G#m/B": "G#m/B:7x9897(1x3241),x2110x(x3120x),xx9897(xx3241),7xx444(4xx111)",
                "G#m/D#": "G#m/D#:xx1444(xx1444),xx110x(xx120x),x66444(x34111),x6x897(x1x342)",
                "G#m/D": "G#m/D:xx0444",
                "G#m/E": "G#m/E:021100,0x6440",
                "G#m/F#": "G#m/F#:xx4444",
                "G#m6": "G#m6:466464(123141),x11910911(x31214)",
                "G#m6/D#": "G#m6/D#:xx1101(xx1203)",
                "G#m7": "G#m7:464444(131111),xx6877(xx1423),4x444x(1x111x),464474(131141),46447x(13114x),x11911911(x21314),x11131112x(x1312x),x1113111214(x13124)",
                "G#m7b5": "G#m7b5:4x443x(2x341x),454474(121141),xx6777(xx1333),x11911910(x31412),x11121112x(x1324x)",
                "G#m9": "G#m9:464446(131114)",
                "G#maj7": "G#maj7:465544(142311),xx6888(xx1444),4x554x(1x342x),xx6543(xx4321),x1110888(x43111)",
                "G#maj7/9": "G#maj7/9:411313(411213),43534x(21413x)",
                "G#sus2": "G#sus2:4111xx(4111xx),xx6346(xx3124),xx6896(xx1341),x11881111(x21134),x1188911(x31124),x1113131111(x13411)",
                "G#sus4": "G#sus4:466644(133311),xx6899(xx1344),x111189x(x3412x),x1113131411(x13341)",
                "G#sus4/D#": "G#sus4/D#:xx1124(xx1124),x66644(x23411)",
                G: "G:320003(320004),151412121215(321114),355433(134211),320033(210034),xx5433(xx3211),xx5787(xx1343),x109787(x43121),x10121212x(x1234x),x1012121210(x13331)",
                "G/B": "G/B:x20003(x20004),7109787(143121),x2xx33(x1xx34),x20033(x10034),x2543x(x1432x)",
                "G/C#": "G/C#:x40003(x20003),910x787(34x121)",
                "G/C": "G/C:x30003(x20003),81097xx(2431xx)",
                "G/D": "G/D:xx0003(xx0003),x55433(x34211),xx0433(xx0211),x5543x(x3421x),10x9787(4x3121),xx0787",
                "G/E": "G/E:020003(010003),xx2433,020000,020030,022030,022033",
                "G/F#": "G/F#:220003(120003),xx4433,220033",
                "G/F": "G/F:120003(120003)",
                "G11/C": "G11/C:x30001",
                G3: "G3:32xxxx(21xxxx),xxx00x(xxx00x),xx54xx(xx21xx),x109xxx(x21xxx)",
                G5: "G5:355xxx(134xxx),xx578x(xx134x),x101212xx(x134xx),3x0033,355xx3",
                "G5/D": "G5/D:xx00xx(xx00xx),x55xxx(x11xxx),1010xxxx(11xxxx)",
                G5aug: "G5aug:36xxxx(14xxxx),xx58xx(xx14xx),x1013xxx(x14xxx)",
                G5dim: "G5dim:34xxxx(12xxxx),xx56xx(xx12xx),x1011xxx(x12xxx)",
                G6: "G6:320000(320000),xx5757(xx1314),x101212120",
                "G6/D": "G6/D:xx0000,xx0987,xx0121212",
                G6add9: "G6add9:320200(310200),322233(211134),x10991010(x21134)",
                "G6add9/A": "G6add9/A:x00000(x00000)",
                "G6add9/E": "G6add9/E:000000,000003",
                "G7#5": "G7#5:3x3443(1x1231),3634xx(1412xx),x1013101211(x14132)",
                "G7#5/F": "G7#5/F:xx3443(xx1231),x8988x(x1211x)",
                "G7#9": "G7#9:32333x(21333x),320301(320401),353436(131214)",
                G7: "G7:320001(320001),151412121213(431112),353433(131211),xx5767(xx1324),3x343x(1x243x),353463(131241),x1012121213(x13334),x1012101210(x13141)",
                "G7/D": "G7/D:xx0001",
                "G7/F": "G7/F:1x0003",
                G7b5: "G7b5:34340x(13240x),343001(243001),xx5667(xx1234),x10111012x(x1213x)",
                "G7b5/B": "G7b5/B:xx91089(xx2413)",
                G7b9: "G7b9:3x3434(1x1213),320131(320141)",
                "G7sus2/F": "G7sus2/F:xx3233(xx2134)",
                G7sus4: "G7sus4:330011(340011),353533(131411)",
                G9: "G9:32323x(21314x),300201(300201),353435(131214)",
                "G9-5": "G9-5:323223(213114),910910109(121341)",
                "G9/A": "G9/A:x00001",
                "G9/B": "G9/B:x23233",
                Gadd9: "Gadd9:300203(200103),300003(200003),xx5435(xx3214),x1097107(x32141),x1077107(x31141),x107787(x41121),320203",
                "Gadd9/A": "Gadd9/A:x05433(x03211),xx7787(xx1121)",
                Gaug: "Gaug:321003(321004),xx5443(xx4231),x10988x(x3211x),x1098811(x32114),1514131212x(43211x)",
                Gb: "Gb:244322(134211),xx4322(xx3211),x98676(x43121),xx4676(xx1243),x91111119(x13331),1413111111x(43111x),141311111114(321114)",
                Gb5: "Gb5:xx5423(xx4312),3454x3(1342x1),xx5687(xx1243),x10111212x(x1233x)",
                "Gb5/B": "Gb5/B:xx9687(xx4132)",
                "Gb5/C#": "Gb5/C#:x45003(x23001)",
                "Gb9-5": "Gb9-5:212112(213114),898998(121341)",
                Gbdim7: "Gbdim7:2312xx(2413xx),xx4545(xx1324),x97878(x41213),x9108108(x23141)",
                Gbm: "Gbm:244222(134111),xx4675(xx1342),xx4222(xx3111),x91111109(x13421),x9767x(x4312x)",
                Gbm7: "Gbm7:242222(131111),2x2220,x9119109(x13121),xx4220(xx4120),242252(131141),xx4655(xx1322),x97979(x21314),x911910x(x1312x),x91191012(x13124)",
                Gdim: "Gdim:3453xx(1342xx),xx5686(xx1243),x10111211x(x1243x)",
                "Gdim/D#": "Gdim/D#:xx1323,x68686",
                "Gdim/E": "Gdim/E:xx2323",
                Gdim7: "Gdim7:3423xx(2413xx),xx5656(xx1324),x108989(x41213),x10119119(x23141)",
                Gdom7: "Gdom7:x109108x(x3241x)",
                Gm: "Gm:355333(134111),xx5786(xx1342),xx5333(xx3111),3x0333(1x2234),310xxx(310xxx),310033(210034),x10878x(x4312x),x1012121110(x13421)",
                "Gm/A#": "Gm/A#:x10333(x10444),6x8786(1x3241),xx8786(xx3241),655333(423111),x1003x(x1004x)",
                "Gm/D#": "Gm/D#:x68786",
                "Gm/D": "Gm/D:xx0333(xx0111),x55333(x34111),x553xx(x341xx),10108xxx(341xxx)",
                "Gm/F": "Gm/F:xx3333",
                Gm13: "Gm13:003333",
                Gm3: "Gm3:31xxxx(31xxxx),xx53xx(xx31xx),x108xxx(x31xxx),xxx1211x(xxx21x)",
                Gm6: "Gm6:310330(210340),355353(123141),x1089810(x31214)",
                Gm7: "Gm7:353333(131111),xx5766(xx1423),x10x101110(x1x243),353363(131141),x1012101110(x13121),x10810810(x21314),x10121011x(x1312x),x1012101113(x13124)",
                Gm7b5: "Gm7b5:31302x(31402x),343363(121141),xx5666(xx1333),x1081089(x31412),x10111011x(x1324x)",
                Gm9: "Gm9:353335(131114)",
                Gmaj7: "Gmaj7:354433(142311),xx5777(xx1444),3x0432(2x0431),3x443x(1x342x),320002(320001),xx5432(xx4321),x109777(x43111)",
                "Gmaj7/9": "Gmaj7/9:32423x(21413x),300202(300201)",
                "Gmaj7/F#": "Gmaj7/F#:xx4433,220003,220033",
                Gsus2: "Gsus2:3000xx(4000xx),300233(200134),xx5235(xx3124),xx5785(xx1341),x1077810(x31124),x10771010(x21134),x1012121010(x13411),15121212xx(4111xx),300033",
                Gsus4: "Gsus4:330013(230014),355533(133311),xx5788(xx1344),x101078x(x3412x),x1012121310(x13341)",
                "Gsus4/D": "Gsus4/D:x55533(x23411)"
            }
        }, {}],
        3: [function (a, b, c) {
            b.exports = {
                C: "C:0003",
                Cm: "Cm:0333",
                C7: "C7:0001",
                Cm7: "Cm7:3333",
                Cmaj7: "Cmaj7:0002",
                C5: "C5:0033",
                C6: "C6:0000",
                Cm6: "Cm6:2333",
                C9: "C9:0201",
                Cm9: "Cm9:3113",
                C69: "C69:0200",
                C7b5: "C7b5:3423",
                "C7#5": "C7#5:1001",
                Cm7b5: "Cm7b5:3323",
                C7b9: "C7b9:0101",
                "C7#9": "C7#9:1214",
                Cdim: "Cdim:0323",
                Cdim7: "Cdim7:2323",
                Caug: "Caug:1003",
                C7sus: "C7sus:0011",
                Csus2: "Csus2:0233",
                Csus4: "Csus4:0013",
                Cadd9: "Cadd9:0103",
                Cmadd9: "Cmadd9:3113",
                C11: "C11:3213",
                Cm11: "Cm11:3313",
                D: "D:2220",
                Dm: "Dm:2210",
                D7: "D7:2223",
                Dm7: "Dm7:2213",
                Dmaj7: "Dmaj7:2224",
                D5: "D5:0144",
                D6: "D6:2222",
                Dm6: "Dm6:2212",
                D9: "D9:2423",
                Dm9: "Dm9:3143",
                D69: "D69:2422",
                D7b5: "D7b5:1223",
                "D7#5": "D7#5:3223",
                Dm7b5: "Dm7b5:1213",
                D7b9: "D7b9:2323",
                "D7#9": "D7#9:1214",
                Ddim7: "Ddim7:1212",
                Ddim: "Ddim:121",
                Daug: "Daug:3221",
                D7sus: "D7sus:2233",
                Dsus2: "Dsus2:2200",
                Dsus4: "Dsus4:2230",
                Dadd9: "Dadd9:1314",
                Dmadd9: "Dmadd9:3113",
                D11: "D11:2233",
                Dm11: "Dm11:0213",
                E: "E:1402",
                Em: "Em:0432",
                E7: "E7:1202",
                Em7: "Em7:0202",
                Emaj7: "Emaj7:1302",
                E5: "E5:4402",
                E6: "E6:4444",
                Em6: "Em6:0102",
                E9: "E9:1222",
                Em9: "Em9:0422",
                E69: "E69:1122",
                E7b5: "E7b5:1201",
                "E7#5": "E7#5:1203",
                Em7b5: "Em7b5:0201",
                E7b9: "E7b9:1212",
                "E7#9": "E7#9:1232",
                Edim7: "Edim7:0101",
                Edim: "Edim:0101",
                Eaug: "Eaug:1003",
                E7sus: "E7sus:2202",
                Esus2: "Esus2:4422",
                Esus4: "Esus4:1341",
                Eadd9: "Eadd9:1422",
                Emadd9: "Emadd9:0422",
                E11: "E11:2202",
                Em11: "Em11:0200",
                F: "F:2010",
                Fm: "Fm:1013",
                F7: "F7:2313",
                Fm7: "Fm7:1313",
                Fmaj7: "Fmaj7:1100",
                F5: "F5:0013",
                F6: "F6:2213",
                Fm6: "Fm6:1213",
                F9: "F9:2333",
                Fm9: "Fm9:0213",
                F69: "F69:2233",
                F7b5: "F7b5:2312",
                "F7#5": "F7#5:2314",
                Fm7b5: "Fm7b5:1312",
                F7b9: "F7b9:2323",
                "F7#9": "F7#9:2343",
                Fdim7: "1212,Fdim7:1212",
                Faug: "Faug:2110",
                F7sus: "F7sus:3313",
                Fsus2: "Fsus2:0013",
                Fsus4: "Fsus4:3011",
                Fadd9: "Fadd9:0010",
                Fmadd9: "Fmadd9:0321",
                F11: "F11:3313",
                Fm11: "Fm11:1311",
                G: "G:0232",
                Gm: "Gm:0231",
                G7: "G7:0212",
                Gm7: "Gm7:0211",
                Gmaj7: "Gmaj7:0222",
                G5: "G5:0230",
                G6: "G6:0202",
                Gm6: "Gm6:0201",
                G9: "G9:2212",
                Gm9: "Gm9:2231",
                G69: "G69:2202",
                G7b5: "G7b5:0112",
                "G7#5": "G7#5:0312",
                Gm7b5: "Gm7b5:0111",
                G7b9: "G7b9:1212",
                "G7#9": "G7#9:1232",
                Gdim7: "Gdim7:0101",
                Gdim: "Gdim:0131",
                Gaug: "Gaug:4332",
                G7sus: "G7sus:0213",
                Gsus2: "Gsus2:2230",
                Gsus4: "Gsus4:0233",
                Gadd9: "Gadd9:0141",
                Gmadd9: "Gmadd9:3230",
                G11: "G11:0010",
                Gm11: "Gm11:0011",
                A: "A:2100",
                Am: "Am:2000",
                A7: "A7:0100",
                Am7: "Am7:0000",
                Amaj7: "Amaj7:1100",
                A5: "A5:2400",
                A6: "A6:2120",
                Am6: "Am6:2020",
                A9: "A9:0102",
                Am9: "Am9:2002",
                A69: "A69:4424",
                A7b5: "A7b5:2334",
                "A7#5": "A7#5:0110",
                Am7b5: "Am7b5:2333",
                A7b9: "A7b9:0101",
                "A7#9": "A7#9:0103",
                Adim7: "Adim7:2323",
                Aaug: "Aaug:2114",
                Adim: "Adim:2323",
                A7sus4: "A7sus4:0200",
                Asus2: "Asus2:2452",
                Asus4: "Asus4:2200",
                Aadd9: "Aadd9:2102",
                Amadd9: "Amadd9:2002",
                A11: "A11:2232",
                Am11: "Am11:2233",
                B: "B:4322",
                Bm: "Bm:4222",
                B7: "B7:2322",
                Bm7: "Bm7:2222",
                Bmaj7: "Bmaj7:4321",
                B5: "B5:4022",
                B6: "B6:1322",
                Bm6: "Bm6:1222",
                B9: "B9:2324",
                Bm9: "Bm9:3143",
                B69: "B69:1324",
                B7b5: "B7b5:2312",
                "B7#5": "B7#5:2332",
                Bm7b5: "Bm7b5:2212",
                B7b9: "B7b9:2323",
                "B7#9": "B7#9:1214",
                Bdim: "Bdim:4212",
                Bdim7: "Bdim7:1212",
                Baug: "Baug:4332",
                B7sus: "B7sus:2422",
                Bsus2: "Bsus2:4122",
                Bsus4: "Bsus4:4422",
                Badd9: "Badd9:4324",
                Bmadd9: "Bmadd9:4224",
                B11: "B11:4300",
                Bm11: "Bm11:1122",
                "C#": "C#:1114",
                "C#m": "C#m:3111",
                "C#7": "C#7:1112",
                "C#m7": "C#m7:1102",
                "C#maj7": "C#maj7:1113",
                "C#5": "C#5:0144",
                "C#6": "C#6:1111",
                "C#m6": "C#m6:1101",
                "C#9": "C#9:1312",
                "C#m9": "C#m9:4304",
                "C#69": "C#69:1311",
                "C#7b5": "C#7b5:0112",
                "C#7#5": "C#7#5:2112",
                "C#m7b5": "C#m7b5:0102",
                "C#7b9": "C#7b9:1212",
                "C#7#9": "C#7#9:1214",
                "C#dim7": "C#dim7:0101",
                "C#dim": "C#dim:0104",
                "C#aug": "C#aug:2110",
                "C#7sus": "C#7sus:1122",
                "C#sus2": "C#sus2:1344",
                "C#sus4": "C#sus4:1124",
                "C#add9": "C#add9:1314",
                "C#madd9": "C#madd9:1304",
                "C#11": "C#11:4324",
                "C#m11": "C#m11:4424",
                Eb: "Eb:3331",
                Ebm: "Ebm:3321",
                Eb7: "Eb7:3334",
                Ebm7: "Ebm7:3324",
                Ebmaj7: "Ebmaj7:3335",
                Eb5: "Eb5:3301",
                Eb6: "Eb6:3333",
                Ebm6: "Ebm6:3323",
                Eb9: "Eb9:0111",
                Ebm9: "Ebm9:2413",
                Eb69: "Eb69:0011",
                Eb7b5: "Eb7b5:2334",
                "Eb7#5": "Eb7#5:4334",
                Ebm7b5: "Ebm7b5:2324",
                Eb7b9: "Eb7b9:0101",
                "Eb7#9": "Eb7#9:0121",
                Ebdim7: "Ebdim7:2323",
                Ebdim: "Ebdim:2320",
                Ebaug: "Ebaug:4332",
                Eb7sus: "Eb7sus:3344",
                Ebsus2: "Ebsus2:3311",
                Ebsus4: "Ebsus4:1341",
                Ebadd9: "Ebadd9:0311",
                Ebmadd9: "Ebmadd9:3113",
                Eb11: "Eb11:3344",
                Ebm11: "Ebm11:1324",
                "F#": "F#:3121",
                "F#m": "F#m:2120",
                "F#7": "F#7:3424",
                "F#m7": "F#m7:2424",
                "F#maj7": "F#maj7:2413",
                "F#5": "F#5:0124",
                "F#6": "F#6:3324",
                "F#m6": "F#m6:2324",
                "F#9": "F#9:1101",
                "F#m9": "F#m9:0420",
                "F#69": "F#69:3344",
                "F#7b5": "F#7b5:3423",
                "F#7#5": "F#7#5:2314",
                "F#m7b5": "F#m7b5:2423",
                "F#7b9": "F#7b9:0101",
                "F#7#9": "F#7#9:1232",
                "F#dim7": "F#dim7:2323",
                "F#dim": "F#dim:2323",
                "F#aug": "F#aug:3221",
                "F#7sus": "F#7sus:4424",
                "F#sus2": "F#sus2:1124",
                "F#sus4": "F#sus4:4122",
                "F#add9": "F#add9:1121",
                "F#madd9": "F#madd9:1120",
                "F#11": "F#11:4424",
                "F#m11": "F#m11:2422",
                Ab: "Ab:5343",
                Abm: "Abm:4342",
                Ab7: "Ab7:1323",
                Abm7: "Abm7:1322",
                Abmaj7: "Abmaj7:1333",
                Ab5: "Ab5:1340",
                Ab6: "Ab6:1313",
                Abm6: "Abm6:1312",
                Ab9: "Ab9:1021",
                Abm9: "Abm9:1321",
                Ab69: "Ab69:3313",
                Ab7b5: "Ab7b5:1223",
                "Ab7#5": "Ab7#5:1423",
                Abm7b5: "Abm7b5:1222",
                Ab7b9: "Ab7b9:2323",
                "Ab7#9": "Ab7#9:1022",
                Abdim7: "Abdim7:1212",
                Abdim: "Abdim:1212",
                Abaug: "Abaug:1003",
                Ab7sus: "Ab7sus:1324",
                Absus2: "Absus2:1341",
                Absus4: "Absus4:1344",
                Abadd9: "Abadd9:3343",
                Abmadd9: "Abmadd9:3342",
                Ab11: "Ab11:1121",
                Abm11: "Abm11:1122",
                Bb: "Bb:3211",
                Bbm: "Bbm:3111",
                Bb7: "Bb7:1211",
                Bbm7: "Bbm7:1111",
                Bbmaj7: "Bbmaj7:3210",
                Bbdim: "Bbdim:3101",
                Bb5: "Bb5:3011",
                Bb6: "Bb6:0211",
                Bbm6: "Bbm6:0111",
                Bb9: "Bb9:1213",
                Bbm9: "Bbm9:3143",
                Bb69: "Bb69:0213",
                Bb7b5: "Bb7b5:1201",
                "Bb7#5": "Bb7#5:1221",
                Bbm7b5: "Bbm7b5:1101",
                Bb7b9: "Bb7b9:1212",
                "Bb7#9": "Bb7#9:1214",
                Bbdim7: "Bbdim7:0101",
                Bbaug: "Bbaug:3221",
                Bb7sus: "Bb7sus:1311",
                Bbsus2: "Bbsus2:3011",
                Bbsus4: "Bbsus4:3311",
                Bbadd9: "Bbadd9:3213",
                Bbmadd9: "Bbmadd9:3113",
                Bb11: "Bb11:3343",
                Bbm11: "Bbm11:3344"
            }
        }, {}]
    }, {}, [1]), ChordJS.onRender = function (a) {
        a.classList.add("chordcontainer")
    }, ChordJS.onTranspose = function (a, b) {
        changeAllChord(b)
    }, ChordJS.onInstrumentChange = function (a, b) {
        window.instrument = b, refreshDisplayingChords()
    },
    function (a) {
        a.fn.textWidth = function (b, c, d) {
            a.fn.textWidth.fakeEl || (a.fn.textWidth.fakeEl = a("<span>").hide().appendTo(document.body));
            var e = this.clone();
            e.find("div").remove();
            var f = b || e.val() || e.text();
            return f = f.replace(/\n/g, "<br/>"), void 0 !== d && (f = f.split("<br/>").slice(0, d).join("<br/>")), a.fn.textWidth.fakeEl.html(f).css("font", c || this.css("font")), a.fn.textWidth.fakeEl.width() + 10
        }
    }(jQuery),
    function (a) {
        "function" == typeof define && define.amd ? define(["jquery"], a) : a(jQuery)
    }(function (a) {
        function b(b, d) {
            var e, f, g, h = b.nodeName.toLowerCase();
            return "area" === h ? (e = b.parentNode, f = e.name, b.href && f && "map" === e.nodeName.toLowerCase() ? (g = a("img[usemap='#" + f + "']")[0], !!g && c(g)) : !1) : (/^(input|select|textarea|button|object)$/.test(h) ? !b.disabled : "a" === h ? b.href || d : d) && c(b)
        }

        function c(b) {
            return a.expr.filters.visible(b) && !a(b).parents().addBack().filter(function () {
                return "hidden" === a.css(this, "visibility")
            }).length
        }
        a.ui = a.ui || {}, a.extend(a.ui, {
            version: "1.11.4",
            keyCode: {
                BACKSPACE: 8,
                COMMA: 188,
                DELETE: 46,
                DOWN: 40,
                END: 35,
                ENTER: 13,
                ESCAPE: 27,
                HOME: 36,
                LEFT: 37,
                PAGE_DOWN: 34,
                PAGE_UP: 33,
                PERIOD: 190,
                RIGHT: 39,
                SPACE: 32,
                TAB: 9,
                UP: 38
            }
        }), a.fn.extend({
            scrollParent: function (b) {
                var c = this.css("position"),
                    d = "absolute" === c,
                    e = b ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
                    f = this.parents().filter(function () {
                        var b = a(this);
                        return d && "static" === b.css("position") ? !1 : e.test(b.css("overflow") + b.css("overflow-y") + b.css("overflow-x"))
                    }).eq(0);
                return "fixed" !== c && f.length ? f : a(this[0].ownerDocument || document)
            },
            uniqueId: function () {
                var a = 0;
                return function () {
                    return this.each(function () {
                        this.id || (this.id = "ui-id-" + ++a)
                    })
                }
            }(),
            removeUniqueId: function () {
                return this.each(function () {
                    /^ui-id-\d+$/.test(this.id) && a(this).removeAttr("id")
                })
            }
        }), a.extend(a.expr[":"], {
            data: a.expr.createPseudo ? a.expr.createPseudo(function (b) {
                return function (c) {
                    return !!a.data(c, b)
                }
            }) : function (b, c, d) {
                return !!a.data(b, d[3])
            },
            focusable: function (c) {
                return b(c, !isNaN(a.attr(c, "tabindex")))
            },
            tabbable: function (c) {
                var d = a.attr(c, "tabindex"),
                    e = isNaN(d);
                return (e || d >= 0) && b(c, !e)
            }
        }), a("<a>").outerWidth(1).jquery || a.each(["Width", "Height"], function (b, c) {
            function d(b, c, d, f) {
                return a.each(e, function () {
                    c -= parseFloat(a.css(b, "padding" + this)) || 0, d && (c -= parseFloat(a.css(b, "border" + this + "Width")) || 0), f && (c -= parseFloat(a.css(b, "margin" + this)) || 0)
                }), c
            }
            var e = "Width" === c ? ["Left", "Right"] : ["Top", "Bottom"],
                f = c.toLowerCase(),
                g = {
                    innerWidth: a.fn.innerWidth,
                    innerHeight: a.fn.innerHeight,
                    outerWidth: a.fn.outerWidth,
                    outerHeight: a.fn.outerHeight
                };
            a.fn["inner" + c] = function (b) {
                return void 0 === b ? g["inner" + c].call(this) : this.each(function () {
                    a(this).css(f, d(this, b) + "px")
                })
            }, a.fn["outer" + c] = function (b, e) {
                return "number" != typeof b ? g["outer" + c].call(this, b) : this.each(function () {
                    a(this).css(f, d(this, b, !0, e) + "px")
                })
            }
        }), a.fn.addBack || (a.fn.addBack = function (a) {
            return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
        }), a("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (a.fn.removeData = function (b) {
            return function (c) {
                return arguments.length ? b.call(this, a.camelCase(c)) : b.call(this)
            }
        }(a.fn.removeData)), a.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()), a.fn.extend({
            focus: function (b) {
                return function (c, d) {
                    return "number" == typeof c ? this.each(function () {
                        var b = this;
                        setTimeout(function () {
                            a(b).focus(), d && d.call(b)
                        }, c)
                    }) : b.apply(this, arguments)
                }
            }(a.fn.focus),
            disableSelection: function () {
                var a = "onselectstart" in document.createElement("div") ? "selectstart" : "mousedown";
                return function () {
                    return this.bind(a + ".ui-disableSelection", function (a) {
                        a.preventDefault()
                    })
                }
            }(),
            enableSelection: function () {
                return this.unbind(".ui-disableSelection")
            },
            zIndex: function (b) {
                if (void 0 !== b) return this.css("zIndex", b);
                if (this.length)
                    for (var c, d, e = a(this[0]); e.length && e[0] !== document;) {
                        if (c = e.css("position"), ("absolute" === c || "relative" === c || "fixed" === c) && (d = parseInt(e.css("zIndex"), 10), !isNaN(d) && 0 !== d)) return d;
                        e = e.parent()
                    }
                return 0
            }
        }), a.ui.plugin = {
            add: function (b, c, d) {
                var e, f = a.ui[b].prototype;
                for (e in d) f.plugins[e] = f.plugins[e] || [], f.plugins[e].push([c, d[e]])
            },
            call: function (a, b, c, d) {
                var e, f = a.plugins[b];
                if (f && (d || a.element[0].parentNode && 11 !== a.element[0].parentNode.nodeType))
                    for (e = 0; e < f.length; e++) a.options[f[e][0]] && f[e][1].apply(a.element, c)
            }
        }
    }),
    function (a) {
        "function" == typeof define && define.amd ? define(["jquery"], a) : a(jQuery)
    }(function (a) {
        var b = 0,
            c = Array.prototype.slice;
        return a.cleanData = function (b) {
            return function (c) {
                var d, e, f;
                for (f = 0; null != (e = c[f]); f++) try {
                    d = a._data(e, "events"), d && d.remove && a(e).triggerHandler("remove")
                } catch (g) { }
                b(c)
            }
        }(a.cleanData), a.widget = function (b, c, d) {
            var e, f, g, h, i = {},
                j = b.split(".")[0];
            return b = b.split(".")[1], e = j + "-" + b, d || (d = c, c = a.Widget), a.expr[":"][e.toLowerCase()] = function (b) {
                return !!a.data(b, e)
            }, a[j] = a[j] || {}, f = a[j][b], g = a[j][b] = function (a, b) {
                return this._createWidget ? void (arguments.length && this._createWidget(a, b)) : new g(a, b)
            }, a.extend(g, f, {
                version: d.version,
                _proto: a.extend({}, d),
                _childConstructors: []
            }), h = new c, h.options = a.widget.extend({}, h.options), a.each(d, function (b, d) {
                return a.isFunction(d) ? void (i[b] = function () {
                    var a = function () {
                        return c.prototype[b].apply(this, arguments)
                    },
                        e = function (a) {
                            return c.prototype[b].apply(this, a)
                        };
                    return function () {
                        var b, c = this._super,
                            f = this._superApply;
                        return this._super = a, this._superApply = e, b = d.apply(this, arguments), this._super = c, this._superApply = f, b
                    }
                }()) : void (i[b] = d)
            }), g.prototype = a.widget.extend(h, {
                widgetEventPrefix: f ? h.widgetEventPrefix || b : b
            }, i, {
                    constructor: g,
                    namespace: j,
                    widgetName: b,
                    widgetFullName: e
                }), f ? (a.each(f._childConstructors, function (b, c) {
                    var d = c.prototype;
                    a.widget(d.namespace + "." + d.widgetName, g, c._proto)
                }), delete f._childConstructors) : c._childConstructors.push(g), a.widget.bridge(b, g), g
        }, a.widget.extend = function (b) {
            for (var d, e, f = c.call(arguments, 1), g = 0, h = f.length; h > g; g++)
                for (d in f[g]) e = f[g][d], f[g].hasOwnProperty(d) && void 0 !== e && (a.isPlainObject(e) ? b[d] = a.isPlainObject(b[d]) ? a.widget.extend({}, b[d], e) : a.widget.extend({}, e) : b[d] = e);
            return b
        }, a.widget.bridge = function (b, d) {
            var e = d.prototype.widgetFullName || b;
            a.fn[b] = function (f) {
                var g = "string" == typeof f,
                    h = c.call(arguments, 1),
                    i = this;
                return g ? this.each(function () {
                    var c, d = a.data(this, e);
                    return "instance" === f ? (i = d, !1) : d ? a.isFunction(d[f]) && "_" !== f.charAt(0) ? (c = d[f].apply(d, h), c !== d && void 0 !== c ? (i = c && c.jquery ? i.pushStack(c.get()) : c, !1) : void 0) : a.error("no such method '" + f + "' for " + b + " widget instance") : a.error("cannot call methods on " + b + " prior to initialization; attempted to call method '" + f + "'")
                }) : (h.length && (f = a.widget.extend.apply(null, [f].concat(h))), this.each(function () {
                    var b = a.data(this, e);
                    b ? (b.option(f || {}), b._init && b._init()) : a.data(this, e, new d(f, this))
                })), i
            }
        }, a.Widget = function () { }, a.Widget._childConstructors = [], a.Widget.prototype = {
            widgetName: "widget",
            widgetEventPrefix: "",
            defaultElement: "<div>",
            options: {
                disabled: !1,
                create: null
            },
            _createWidget: function (c, d) {
                d = a(d || this.defaultElement || this)[0], this.element = a(d), this.uuid = b++ , this.eventNamespace = "." + this.widgetName + this.uuid, this.bindings = a(), this.hoverable = a(), this.focusable = a(), d !== this && (a.data(d, this.widgetFullName, this), this._on(!0, this.element, {
                    remove: function (a) {
                        a.target === d && this.destroy()
                    }
                }), this.document = a(d.style ? d.ownerDocument : d.document || d), this.window = a(this.document[0].defaultView || this.document[0].parentWindow)), this.options = a.widget.extend({}, this.options, this._getCreateOptions(), c), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init()
            },
            _getCreateOptions: a.noop,
            _getCreateEventData: a.noop,
            _create: a.noop,
            _init: a.noop,
            destroy: function () {
                this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData(a.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")
            },
            _destroy: a.noop,
            widget: function () {
                return this.element
            },
            option: function (b, c) {
                var d, e, f, g = b;
                if (0 === arguments.length) return a.widget.extend({}, this.options);
                if ("string" == typeof b)
                    if (g = {}, d = b.split("."), b = d.shift(), d.length) {
                        for (e = g[b] = a.widget.extend({}, this.options[b]), f = 0; f < d.length - 1; f++) e[d[f]] = e[d[f]] || {}, e = e[d[f]];
                        if (b = d.pop(), 1 === arguments.length) return void 0 === e[b] ? null : e[b];
                        e[b] = c
                    } else {
                        if (1 === arguments.length) return void 0 === this.options[b] ? null : this.options[b];
                        g[b] = c
                    }
                return this._setOptions(g), this
            },
            _setOptions: function (a) {
                var b;
                for (b in a) this._setOption(b, a[b]);
                return this
            },
            _setOption: function (a, b) {
                return this.options[a] = b, "disabled" === a && (this.widget().toggleClass(this.widgetFullName + "-disabled", !!b), b && (this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus"))), this
            },
            enable: function () {
                return this._setOptions({
                    disabled: !1
                })
            },
            disable: function () {
                return this._setOptions({
                    disabled: !0
                })
            },
            _on: function (b, c, d) {
                var e, f = this;
                "boolean" != typeof b && (d = c, c = b, b = !1), d ? (c = e = a(c), this.bindings = this.bindings.add(c)) : (d = c, c = this.element, e = this.widget()), a.each(d, function (d, g) {
                    function h() {
                        return b || f.options.disabled !== !0 && !a(this).hasClass("ui-state-disabled") ? ("string" == typeof g ? f[g] : g).apply(f, arguments) : void 0
                    }
                    "string" != typeof g && (h.guid = g.guid = g.guid || h.guid || a.guid++);
                    var i = d.match(/^([\w:-]*)\s*(.*)$/),
                        j = i[1] + f.eventNamespace,
                        k = i[2];
                    k ? e.delegate(k, j, h) : c.bind(j, h)
                })
            },
            _off: function (b, c) {
                c = (c || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, b.unbind(c).undelegate(c), this.bindings = a(this.bindings.not(b).get()), this.focusable = a(this.focusable.not(b).get()), this.hoverable = a(this.hoverable.not(b).get())
            },
            _delay: function (a, b) {
                function c() {
                    return ("string" == typeof a ? d[a] : a).apply(d, arguments)
                }
                var d = this;
                return setTimeout(c, b || 0)
            },
            _hoverable: function (b) {
                this.hoverable = this.hoverable.add(b), this._on(b, {
                    mouseenter: function (b) {
                        a(b.currentTarget).addClass("ui-state-hover")
                    },
                    mouseleave: function (b) {
                        a(b.currentTarget).removeClass("ui-state-hover")
                    }
                })
            },
            _focusable: function (b) {
                this.focusable = this.focusable.add(b), this._on(b, {
                    focusin: function (b) {
                        a(b.currentTarget).addClass("ui-state-focus")
                    },
                    focusout: function (b) {
                        a(b.currentTarget).removeClass("ui-state-focus")
                    }
                })
            },
            _trigger: function (b, c, d) {
                var e, f, g = this.options[b];
                if (d = d || {}, c = a.Event(c), c.type = (b === this.widgetEventPrefix ? b : this.widgetEventPrefix + b).toLowerCase(), c.target = this.element[0], f = c.originalEvent)
                    for (e in f) e in c || (c[e] = f[e]);
                return this.element.trigger(c, d), !(a.isFunction(g) && g.apply(this.element[0], [c].concat(d)) === !1 || c.isDefaultPrevented())
            }
        }, a.each({
            show: "fadeIn",
            hide: "fadeOut"
        }, function (b, c) {
            a.Widget.prototype["_" + b] = function (d, e, f) {
                "string" == typeof e && (e = {
                    effect: e
                });
                var g, h = e ? e === !0 || "number" == typeof e ? c : e.effect || c : b;
                e = e || {}, "number" == typeof e && (e = {
                    duration: e
                }), g = !a.isEmptyObject(e), e.complete = f, e.delay && d.delay(e.delay), g && a.effects && a.effects.effect[h] ? d[b](e) : h !== b && d[h] ? d[h](e.duration, e.easing, f) : d.queue(function (c) {
                    a(this)[b](), f && f.call(d[0]), c()
                })
            }
        }), a.widget
    }),
    function (a) {
        "function" == typeof define && define.amd ? define(["jquery", "./widget"], a) : a(jQuery)
    }(function (a) {
        var b = !1;
        return a(document).mouseup(function () {
            b = !1
        }), a.widget("ui.mouse", {
            version: "1.11.4",
            options: {
                cancel: "input,textarea,button,select,option",
                distance: 1,
                delay: 0
            },
            _mouseInit: function () {
                var b = this;
                this.element.bind("mousedown." + this.widgetName, function (a) {
                    return b._mouseDown(a)
                }).bind("click." + this.widgetName, function (c) {
                    return !0 === a.data(c.target, b.widgetName + ".preventClickEvent") ? (a.removeData(c.target, b.widgetName + ".preventClickEvent"), c.stopImmediatePropagation(), !1) : void 0
                }), this.started = !1
            },
            _mouseDestroy: function () {
                this.element.unbind("." + this.widgetName), this._mouseMoveDelegate && this.document.unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate)
            },
            _mouseDown: function (c) {
                if (!b) {
                    this._mouseMoved = !1, this._mouseStarted && this._mouseUp(c), this._mouseDownEvent = c;
                    var d = this,
                        e = 1 === c.which,
                        f = "string" == typeof this.options.cancel && c.target.nodeName ? a(c.target).closest(this.options.cancel).length : !1;
                    return e && !f && this._mouseCapture(c) ? (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function () {
                        d.mouseDelayMet = !0
                    }, this.options.delay)), this._mouseDistanceMet(c) && this._mouseDelayMet(c) && (this._mouseStarted = this._mouseStart(c) !== !1, !this._mouseStarted) ? (c.preventDefault(), !0) : (!0 === a.data(c.target, this.widgetName + ".preventClickEvent") && a.removeData(c.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function (a) {
                        return d._mouseMove(a)
                    }, this._mouseUpDelegate = function (a) {
                        return d._mouseUp(a)
                    }, this.document.bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), c.preventDefault(), b = !0, !0)) : !0
                }
            },
            _mouseMove: function (b) {
                if (this._mouseMoved) {
                    if (a.ui.ie && (!document.documentMode || document.documentMode < 9) && !b.button) return this._mouseUp(b);
                    if (!b.which) return this._mouseUp(b)
                }
                return (b.which || b.button) && (this._mouseMoved = !0), this._mouseStarted ? (this._mouseDrag(b), b.preventDefault()) : (this._mouseDistanceMet(b) && this._mouseDelayMet(b) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, b) !== !1, this._mouseStarted ? this._mouseDrag(b) : this._mouseUp(b)), !this._mouseStarted)
            },
            _mouseUp: function (c) {
                return this.document.unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, c.target === this._mouseDownEvent.target && a.data(c.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(c)), b = !1, !1
            },
            _mouseDistanceMet: function (a) {
                return Math.max(Math.abs(this._mouseDownEvent.pageX - a.pageX), Math.abs(this._mouseDownEvent.pageY - a.pageY)) >= this.options.distance
            },
            _mouseDelayMet: function () {
                return this.mouseDelayMet
            },
            _mouseStart: function () { },
            _mouseDrag: function () { },
            _mouseStop: function () { },
            _mouseCapture: function () {
                return !0
            }
        })
    }),
    function (a) {
        "function" == typeof define && define.amd ? define(["jquery"], a) : a(jQuery)
    }(function (a) {
        return function () {
            function b(a, b, c) {
                return [parseFloat(a[0]) * (n.test(a[0]) ? b / 100 : 1), parseFloat(a[1]) * (n.test(a[1]) ? c / 100 : 1)]
            }

            function c(b, c) {
                return parseInt(a.css(b, c), 10) || 0
            }

            function d(b) {
                var c = b[0];
                return 9 === c.nodeType ? {
                    width: b.width(),
                    height: b.height(),
                    offset: {
                        top: 0,
                        left: 0
                    }
                } : a.isWindow(c) ? {
                    width: b.width(),
                    height: b.height(),
                    offset: {
                        top: b.scrollTop(),
                        left: b.scrollLeft()
                    }
                } : c.preventDefault ? {
                    width: 0,
                    height: 0,
                    offset: {
                        top: c.pageY,
                        left: c.pageX
                    }
                } : {
                                width: b.outerWidth(),
                                height: b.outerHeight(),
                                offset: b.offset()
                            }
            }
            a.ui = a.ui || {};
            var e, f, g = Math.max,
                h = Math.abs,
                i = Math.round,
                j = /left|center|right/,
                k = /top|center|bottom/,
                l = /[\+\-]\d+(\.[\d]+)?%?/,
                m = /^\w+/,
                n = /%$/,
                o = a.fn.position;
            a.position = {
                scrollbarWidth: function () {
                    if (void 0 !== e) return e;
                    var b, c, d = a("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),
                        f = d.children()[0];
                    return a("body").append(d), b = f.offsetWidth, d.css("overflow", "scroll"), c = f.offsetWidth, b === c && (c = d[0].clientWidth), d.remove(), e = b - c
                },
                getScrollInfo: function (b) {
                    var c = b.isWindow || b.isDocument ? "" : b.element.css("overflow-x"),
                        d = b.isWindow || b.isDocument ? "" : b.element.css("overflow-y"),
                        e = "scroll" === c || "auto" === c && b.width < b.element[0].scrollWidth,
                        f = "scroll" === d || "auto" === d && b.height < b.element[0].scrollHeight;
                    return {
                        width: f ? a.position.scrollbarWidth() : 0,
                        height: e ? a.position.scrollbarWidth() : 0
                    }
                },
                getWithinInfo: function (b) {
                    var c = a(b || window),
                        d = a.isWindow(c[0]),
                        e = !!c[0] && 9 === c[0].nodeType;
                    return {
                        element: c,
                        isWindow: d,
                        isDocument: e,
                        offset: c.offset() || {
                            left: 0,
                            top: 0
                        },
                        scrollLeft: c.scrollLeft(),
                        scrollTop: c.scrollTop(),
                        width: d || e ? c.width() : c.outerWidth(),
                        height: d || e ? c.height() : c.outerHeight()
                    }
                }
            }, a.fn.position = function (e) {
                if (!e || !e.of) return o.apply(this, arguments);
                e = a.extend({}, e);
                var n, p, q, r, s, t, u = a(e.of),
                    v = a.position.getWithinInfo(e.within),
                    w = a.position.getScrollInfo(v),
                    x = (e.collision || "flip").split(" "),
                    y = {};
                return t = d(u), u[0].preventDefault && (e.at = "left top"), p = t.width, q = t.height, r = t.offset, s = a.extend({}, r), a.each(["my", "at"], function () {
                    var a, b, c = (e[this] || "").split(" ");
                    1 === c.length && (c = j.test(c[0]) ? c.concat(["center"]) : k.test(c[0]) ? ["center"].concat(c) : ["center", "center"]), c[0] = j.test(c[0]) ? c[0] : "center", c[1] = k.test(c[1]) ? c[1] : "center", a = l.exec(c[0]), b = l.exec(c[1]), y[this] = [a ? a[0] : 0, b ? b[0] : 0], e[this] = [m.exec(c[0])[0], m.exec(c[1])[0]]
                }), 1 === x.length && (x[1] = x[0]), "right" === e.at[0] ? s.left += p : "center" === e.at[0] && (s.left += p / 2), "bottom" === e.at[1] ? s.top += q : "center" === e.at[1] && (s.top += q / 2), n = b(y.at, p, q), s.left += n[0], s.top += n[1], this.each(function () {
                    var d, j, k = a(this),
                        l = k.outerWidth(),
                        m = k.outerHeight(),
                        o = c(this, "marginLeft"),
                        t = c(this, "marginTop"),
                        z = l + o + c(this, "marginRight") + w.width,
                        A = m + t + c(this, "marginBottom") + w.height,
                        B = a.extend({}, s),
                        C = b(y.my, k.outerWidth(), k.outerHeight());
                    "right" === e.my[0] ? B.left -= l : "center" === e.my[0] && (B.left -= l / 2), "bottom" === e.my[1] ? B.top -= m : "center" === e.my[1] && (B.top -= m / 2), B.left += C[0], B.top += C[1], f || (B.left = i(B.left), B.top = i(B.top)), d = {
                        marginLeft: o,
                        marginTop: t
                    }, a.each(["left", "top"], function (b, c) {
                        a.ui.position[x[b]] && a.ui.position[x[b]][c](B, {
                            targetWidth: p,
                            targetHeight: q,
                            elemWidth: l,
                            elemHeight: m,
                            collisionPosition: d,
                            collisionWidth: z,
                            collisionHeight: A,
                            offset: [n[0] + C[0], n[1] + C[1]],
                            my: e.my,
                            at: e.at,
                            within: v,
                            elem: k
                        })
                    }), e.using && (j = function (a) {
                        var b = r.left - B.left,
                            c = b + p - l,
                            d = r.top - B.top,
                            f = d + q - m,
                            i = {
                                target: {
                                    element: u,
                                    left: r.left,
                                    top: r.top,
                                    width: p,
                                    height: q
                                },
                                element: {
                                    element: k,
                                    left: B.left,
                                    top: B.top,
                                    width: l,
                                    height: m
                                },
                                horizontal: 0 > c ? "left" : b > 0 ? "right" : "center",
                                vertical: 0 > f ? "top" : d > 0 ? "bottom" : "middle"
                            };
                        l > p && h(b + c) < p && (i.horizontal = "center"), m > q && h(d + f) < q && (i.vertical = "middle"), g(h(b), h(c)) > g(h(d), h(f)) ? i.important = "horizontal" : i.important = "vertical", e.using.call(this, a, i)
                    }), k.offset(a.extend(B, {
                        using: j
                    }))
                })
            }, a.ui.position = {
                fit: {
                    left: function (a, b) {
                        var c, d = b.within,
                            e = d.isWindow ? d.scrollLeft : d.offset.left,
                            f = d.width,
                            h = a.left - b.collisionPosition.marginLeft,
                            i = e - h,
                            j = h + b.collisionWidth - f - e;
                        b.collisionWidth > f ? i > 0 && 0 >= j ? (c = a.left + i + b.collisionWidth - f - e, a.left += i - c) : j > 0 && 0 >= i ? a.left = e : i > j ? a.left = e + f - b.collisionWidth : a.left = e : i > 0 ? a.left += i : j > 0 ? a.left -= j : a.left = g(a.left - h, a.left)
                    },
                    top: function (a, b) {
                        var c, d = b.within,
                            e = d.isWindow ? d.scrollTop : d.offset.top,
                            f = b.within.height,
                            h = a.top - b.collisionPosition.marginTop,
                            i = e - h,
                            j = h + b.collisionHeight - f - e;
                        b.collisionHeight > f ? i > 0 && 0 >= j ? (c = a.top + i + b.collisionHeight - f - e, a.top += i - c) : j > 0 && 0 >= i ? a.top = e : i > j ? a.top = e + f - b.collisionHeight : a.top = e : i > 0 ? a.top += i : j > 0 ? a.top -= j : a.top = g(a.top - h, a.top)
                    }
                },
                flip: {
                    left: function (a, b) {
                        var c, d, e = b.within,
                            f = e.offset.left + e.scrollLeft,
                            g = e.width,
                            i = e.isWindow ? e.scrollLeft : e.offset.left,
                            j = a.left - b.collisionPosition.marginLeft,
                            k = j - i,
                            l = j + b.collisionWidth - g - i,
                            m = "left" === b.my[0] ? -b.elemWidth : "right" === b.my[0] ? b.elemWidth : 0,
                            n = "left" === b.at[0] ? b.targetWidth : "right" === b.at[0] ? -b.targetWidth : 0,
                            o = -2 * b.offset[0];
                        0 > k ? (c = a.left + m + n + o + b.collisionWidth - g - f, (0 > c || c < h(k)) && (a.left += m + n + o)) : l > 0 && (d = a.left - b.collisionPosition.marginLeft + m + n + o - i, (d > 0 || h(d) < l) && (a.left += m + n + o))
                    },
                    top: function (a, b) {
                        var c, d, e = b.within,
                            f = e.offset.top + e.scrollTop,
                            g = e.height,
                            i = e.isWindow ? e.scrollTop : e.offset.top,
                            j = a.top - b.collisionPosition.marginTop,
                            k = j - i,
                            l = j + b.collisionHeight - g - i,
                            m = "top" === b.my[1],
                            n = m ? -b.elemHeight : "bottom" === b.my[1] ? b.elemHeight : 0,
                            o = "top" === b.at[1] ? b.targetHeight : "bottom" === b.at[1] ? -b.targetHeight : 0,
                            p = -2 * b.offset[1];
                        0 > k ? (d = a.top + n + o + p + b.collisionHeight - g - f, (0 > d || d < h(k)) && (a.top += n + o + p)) : l > 0 && (c = a.top - b.collisionPosition.marginTop + n + o + p - i, (c > 0 || h(c) < l) && (a.top += n + o + p))
                    }
                },
                flipfit: {
                    left: function () {
                        a.ui.position.flip.left.apply(this, arguments), a.ui.position.fit.left.apply(this, arguments)
                    },
                    top: function () {
                        a.ui.position.flip.top.apply(this, arguments), a.ui.position.fit.top.apply(this, arguments)
                    }
                }
            },
                function () {
                    var b, c, d, e, g, h = document.getElementsByTagName("body")[0],
                        i = document.createElement("div");
                    b = document.createElement(h ? "div" : "body"), d = {
                        visibility: "hidden",
                        width: 0,
                        height: 0,
                        border: 0,
                        margin: 0,
                        background: "none"
                    }, h && a.extend(d, {
                        position: "absolute",
                        left: "-1000px",
                        top: "-1000px"
                    });
                    for (g in d) b.style[g] = d[g];
                    b.appendChild(i), c = h || document.documentElement, c.insertBefore(b, c.firstChild), i.style.cssText = "position: absolute; left: 10.7432222px;", e = a(i).offset().left, f = e > 10 && 11 > e, b.innerHTML = "", c.removeChild(b)
                }()
        }(), a.ui.position
    }),
    function (a) {
        "function" == typeof define && define.amd ? define(["jquery", "./core", "./widget", "./position", "./menu"], a) : a(jQuery)
    }(function (a) {
        return a.widget("ui.autocomplete", {
            version: "1.11.4",
            defaultElement: "<input>",
            options: {
                appendTo: null,
                autoFocus: !1,
                delay: 300,
                minLength: 1,
                position: {
                    my: "left top",
                    at: "left bottom",
                    collision: "none"
                },
                source: null,
                change: null,
                close: null,
                focus: null,
                open: null,
                response: null,
                search: null,
                select: null
            },
            requestIndex: 0,
            pending: 0,
            _create: function () {
                var b, c, d, e = this.element[0].nodeName.toLowerCase(),
                    f = "textarea" === e,
                    g = "input" === e;
                this.isMultiLine = f ? !0 : g ? !1 : this.element.prop("isContentEditable"), this.valueMethod = this.element[f || g ? "val" : "text"], this.isNewMenu = !0, this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off"), this._on(this.element, {
                    keydown: function (e) {
                        if (this.element.prop("readOnly")) return b = !0, d = !0, void (c = !0);
                        b = !1, d = !1, c = !1;
                        var f = a.ui.keyCode;
                        switch (e.keyCode) {
                            case f.PAGE_UP:
                                b = !0, this._move("previousPage", e);
                                break;
                            case f.PAGE_DOWN:
                                b = !0, this._move("nextPage", e);
                                break;
                            case f.UP:
                                b = !0, this._keyEvent("previous", e);
                                break;
                            case f.DOWN:
                                b = !0, this._keyEvent("next", e);
                                break;
                            case f.ENTER:
                                this.menu.active && (b = !0, e.preventDefault(), this.menu.select(e));
                                break;
                            case f.TAB:
                                this.menu.active && this.menu.select(e);
                                break;
                            case f.ESCAPE:
                                this.menu.element.is(":visible") && (this.isMultiLine || this._value(this.term), this.close(e), e.preventDefault());
                                break;
                            default:
                                c = !0, this._searchTimeout(e)
                        }
                    },
                    keypress: function (d) {
                        if (b) return b = !1, void ((!this.isMultiLine || this.menu.element.is(":visible")) && d.preventDefault());
                        if (!c) {
                            var e = a.ui.keyCode;
                            switch (d.keyCode) {
                                case e.PAGE_UP:
                                    this._move("previousPage", d);
                                    break;
                                case e.PAGE_DOWN:
                                    this._move("nextPage", d);
                                    break;
                                case e.UP:
                                    this._keyEvent("previous", d);
                                    break;
                                case e.DOWN:
                                    this._keyEvent("next", d)
                            }
                        }
                    },
                    input: function (a) {
                        return d ? (d = !1, void a.preventDefault()) : void this._searchTimeout(a)
                    },
                    focus: function () {
                        this.selectedItem = null, this.previous = this._value()
                    },
                    blur: function (a) {
                        return this.cancelBlur ? void delete this.cancelBlur : (clearTimeout(this.searching), this.close(a), void this._change(a))
                    }
                }), this._initSource(), this.menu = a("<ul>").addClass("ui-autocomplete ui-front").appendTo(this._appendTo()).menu({
                    role: null
                }).hide().menu("instance"), this._on(this.menu.element, {
                    mousedown: function (b) {
                        b.preventDefault(), this.cancelBlur = !0, this._delay(function () {
                            delete this.cancelBlur
                        });
                        var c = this.menu.element[0];
                        a(b.target).closest(".ui-menu-item").length || this._delay(function () {
                            var b = this;
                            this.document.one("mousedown", function (d) {
                                d.target === b.element[0] || d.target === c || a.contains(c, d.target) || b.close()
                            })
                        })
                    },
                    menufocus: function (b, c) {
                        var d, e;
                        return this.isNewMenu && (this.isNewMenu = !1, b.originalEvent && /^mouse/.test(b.originalEvent.type)) ? (this.menu.blur(), void this.document.one("mousemove", function () {
                            a(b.target).trigger(b.originalEvent)
                        })) : (e = c.item.data("ui-autocomplete-item"), !1 !== this._trigger("focus", b, {
                            item: e
                        }) && b.originalEvent && /^key/.test(b.originalEvent.type) && this._value(e.value), d = c.item.attr("aria-label") || e.value, void (d && a.trim(d).length && (this.liveRegion.children().hide(), a("<div>").text(d).appendTo(this.liveRegion))))
                    },
                    menuselect: function (a, b) {
                        var c = b.item.data("ui-autocomplete-item"),
                            d = this.previous;
                        this.element[0] !== this.document[0].activeElement && (this.element.focus(), this.previous = d, this._delay(function () {
                            this.previous = d, this.selectedItem = c
                        })), !1 !== this._trigger("select", a, {
                            item: c
                        }) && this._value(c.value), this.term = this._value(), this.close(a), this.selectedItem = c
                    }
                }), this.liveRegion = a("<span>", {
                    role: "status",
                    "aria-live": "assertive",
                    "aria-relevant": "additions"
                }).addClass("ui-helper-hidden-accessible").appendTo(this.document[0].body), this._on(this.window, {
                    beforeunload: function () {
                        this.element.removeAttr("autocomplete")
                    }
                })
            },
            _destroy: function () {
                clearTimeout(this.searching), this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete"), this.menu.element.remove(), this.liveRegion.remove()
            },
            _setOption: function (a, b) {
                this._super(a, b), "source" === a && this._initSource(), "appendTo" === a && this.menu.element.appendTo(this._appendTo()), "disabled" === a && b && this.xhr && this.xhr.abort()
            },
            _appendTo: function () {
                var b = this.options.appendTo;
                return b && (b = b.jquery || b.nodeType ? a(b) : this.document.find(b).eq(0)), b && b[0] || (b = this.element.closest(".ui-front")), b.length || (b = this.document[0].body), b
            },
            _initSource: function () {
                var b, c, d = this;
                a.isArray(this.options.source) ? (b = this.options.source, this.source = function (c, d) {
                    d(a.ui.autocomplete.filter(b, c.term))
                }) : "string" == typeof this.options.source ? (c = this.options.source, this.source = function (b, e) {
                    d.xhr && d.xhr.abort(), d.xhr = a.ajax({
                        url: c,
                        data: b,
                        dataType: "json",
                        success: function (a) {
                            e(a)
                        },
                        error: function () {
                            e([])
                        }
                    })
                }) : this.source = this.options.source
            },
            _searchTimeout: function (a) {
                clearTimeout(this.searching), this.searching = this._delay(function () {
                    var b = this.term === this._value(),
                        c = this.menu.element.is(":visible"),
                        d = a.altKey || a.ctrlKey || a.metaKey || a.shiftKey;
                    (!b || b && !c && !d) && (this.selectedItem = null, this.search(null, a))
                }, this.options.delay)
            },
            search: function (a, b) {
                return a = null != a ? a : this._value(), this.term = this._value(), a.length < this.options.minLength ? this.close(b) : this._trigger("search", b) !== !1 ? this._search(a) : void 0
            },
            _search: function (a) {
                this.pending++ , this.element.addClass("ui-autocomplete-loading"), this.cancelSearch = !1, this.source({
                    term: a
                }, this._response())
            },
            _response: function () {
                var b = ++this.requestIndex;
                return a.proxy(function (a) {
                    b === this.requestIndex && this.__response(a), this.pending-- , this.pending || this.element.removeClass("ui-autocomplete-loading")
                }, this)
            },
            __response: function (a) {
                a && (a = this._normalize(a)), this._trigger("response", null, {
                    content: a
                }), !this.options.disabled && a && a.length && !this.cancelSearch ? (this._suggest(a), this._trigger("open")) : this._close()
            },
            close: function (a) {
                this.cancelSearch = !0, this._close(a)
            },
            _close: function (a) {
                this.menu.element.is(":visible") && (this.menu.element.hide(), this.menu.blur(), this.isNewMenu = !0, this._trigger("close", a))
            },
            _change: function (a) {
                this.previous !== this._value() && this._trigger("change", a, {
                    item: this.selectedItem
                })
            },
            _normalize: function (b) {
                return b.length && b[0].label && b[0].value ? b : a.map(b, function (b) {
                    return "string" == typeof b ? {
                        label: b,
                        value: b
                    } : a.extend({}, b, {
                        label: b.label || b.value,
                        value: b.value || b.label
                    })
                })
            },
            _suggest: function (b) {
                var c = this.menu.element.empty();
                this._renderMenu(c, b), this.isNewMenu = !0, this.menu.refresh(), c.show(), this._resizeMenu(), c.position(a.extend({
                    of: this.element
                }, this.options.position)), this.options.autoFocus && this.menu.next()
            },
            _resizeMenu: function () {
                var a = this.menu.element;
                a.outerWidth(Math.max(a.width("").outerWidth() + 1, this.element.outerWidth()))
            },
            _renderMenu: function (b, c) {
                var d = this;
                a.each(c, function (a, c) {
                    d._renderItemData(b, c)
                })
            },
            _renderItemData: function (a, b) {
                return this._renderItem(a, b).data("ui-autocomplete-item", b)
            },
            _renderItem: function (b, c) {
                return a("<li>").text(c.label).appendTo(b)
            },
            _move: function (a, b) {
                return this.menu.element.is(":visible") ? this.menu.isFirstItem() && /^previous/.test(a) || this.menu.isLastItem() && /^next/.test(a) ? (this.isMultiLine || this._value(this.term), void this.menu.blur()) : void this.menu[a](b) : void this.search(null, b)
            },
            widget: function () {
                return this.menu.element
            },
            _value: function () {
                return this.valueMethod.apply(this.element, arguments)
            },
            _keyEvent: function (a, b) {
                (!this.isMultiLine || this.menu.element.is(":visible")) && (this._move(a, b), b.preventDefault())
            }
        }), a.extend(a.ui.autocomplete, {
            escapeRegex: function (a) {
                return a.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
            },
            filter: function (b, c) {
                var d = new RegExp(a.ui.autocomplete.escapeRegex(c), "i");
                return a.grep(b, function (a) {
                    return d.test(a.label || a.value || a)
                })
            }
        }), a.widget("ui.autocomplete", a.ui.autocomplete, {
            options: {
                messages: {
                    noResults: "No search results.",
                    results: function (a) {
                        return a + (a > 1 ? " results are" : " result is") + " available, use up and down arrow keys to navigate.";
                    }
                }
            },
            __response: function (b) {
                var c;
                this._superApply(arguments), this.options.disabled || this.cancelSearch || (c = b && b.length ? this.options.messages.results(b.length) : this.options.messages.noResults, this.liveRegion.children().hide(), a("<div>").text(c).appendTo(this.liveRegion))
            }
        }), a.ui.autocomplete
    }),
    function (a) {
        "function" == typeof define && define.amd ? define(["jquery", "./core", "./widget", "./position"], a) : a(jQuery)
    }(function (a) {
        return a.widget("ui.menu", {
            version: "1.11.4",
            defaultElement: "<ul>",
            delay: 300,
            options: {
                icons: {
                    submenu: "ui-icon-carat-1-e"
                },
                items: "> *",
                menus: "ul",
                position: {
                    my: "left-1 top",
                    at: "right top"
                },
                role: "menu",
                blur: null,
                focus: null,
                select: null
            },
            _create: function () {
                this.activeMenu = this.element, this.mouseHandled = !1, this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content").toggleClass("ui-menu-icons", !!this.element.find(".ui-icon").length).attr({
                    role: this.options.role,
                    tabIndex: 0
                }), this.options.disabled && this.element.addClass("ui-state-disabled").attr("aria-disabled", "true"), this._on({
                    "mousedown .ui-menu-item": function (a) {
                        a.preventDefault()
                    },
                    "click .ui-menu-item": function (b) {
                        var c = a(b.target);
                        !this.mouseHandled && c.not(".ui-state-disabled").length && (this.select(b), b.isPropagationStopped() || (this.mouseHandled = !0), c.has(".ui-menu").length ? this.expand(b) : !this.element.is(":focus") && a(this.document[0].activeElement).closest(".ui-menu").length && (this.element.trigger("focus", [!0]), this.active && 1 === this.active.parents(".ui-menu").length && clearTimeout(this.timer)))
                    },
                    "mouseenter .ui-menu-item": function (b) {
                        if (!this.previousFilter) {
                            var c = a(b.currentTarget);
                            c.siblings(".ui-state-active").removeClass("ui-state-active"), this.focus(b, c)
                        }
                    },
                    mouseleave: "collapseAll",
                    "mouseleave .ui-menu": "collapseAll",
                    focus: function (a, b) {
                        var c = this.active || this.element.find(this.options.items).eq(0);
                        b || this.focus(a, c)
                    },
                    blur: function (b) {
                        this._delay(function () {
                            a.contains(this.element[0], this.document[0].activeElement) || this.collapseAll(b)
                        })
                    },
                    keydown: "_keydown"
                }), this.refresh(), this._on(this.document, {
                    click: function (a) {
                        this._closeOnDocumentClick(a) && this.collapseAll(a), this.mouseHandled = !1
                    }
                })
            },
            _destroy: function () {
                this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-menu-icons ui-front").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show(), this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").removeUniqueId().removeClass("ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function () {
                    var b = a(this);
                    b.data("ui-menu-submenu-carat") && b.remove()
                }), this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content")
            },
            _keydown: function (b) {
                var c, d, e, f, g = !0;
                switch (b.keyCode) {
                    case a.ui.keyCode.PAGE_UP:
                        this.previousPage(b);
                        break;
                    case a.ui.keyCode.PAGE_DOWN:
                        this.nextPage(b);
                        break;
                    case a.ui.keyCode.HOME:
                        this._move("first", "first", b);
                        break;
                    case a.ui.keyCode.END:
                        this._move("last", "last", b);
                        break;
                    case a.ui.keyCode.UP:
                        this.previous(b);
                        break;
                    case a.ui.keyCode.DOWN:
                        this.next(b);
                        break;
                    case a.ui.keyCode.LEFT:
                        this.collapse(b);
                        break;
                    case a.ui.keyCode.RIGHT:
                        this.active && !this.active.is(".ui-state-disabled") && this.expand(b);
                        break;
                    case a.ui.keyCode.ENTER:
                    case a.ui.keyCode.SPACE:
                        this._activate(b);
                        break;
                    case a.ui.keyCode.ESCAPE:
                        this.collapse(b);
                        break;
                    default:
                        g = !1, d = this.previousFilter || "", e = String.fromCharCode(b.keyCode), f = !1, clearTimeout(this.filterTimer), e === d ? f = !0 : e = d + e, c = this._filterMenuItems(e), c = f && -1 !== c.index(this.active.next()) ? this.active.nextAll(".ui-menu-item") : c, c.length || (e = String.fromCharCode(b.keyCode), c = this._filterMenuItems(e)), c.length ? (this.focus(b, c), this.previousFilter = e, this.filterTimer = this._delay(function () {
                            delete this.previousFilter
                        }, 1e3)) : delete this.previousFilter
                }
                g && b.preventDefault()
            },
            _activate: function (a) {
                this.active.is(".ui-state-disabled") || (this.active.is("[aria-haspopup='true']") ? this.expand(a) : this.select(a))
            },
            refresh: function () {
                var b, c, d = this,
                    e = this.options.icons.submenu,
                    f = this.element.find(this.options.menus);
                this.element.toggleClass("ui-menu-icons", !!this.element.find(".ui-icon").length), f.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-front").hide().attr({
                    role: this.options.role,
                    "aria-hidden": "true",
                    "aria-expanded": "false"
                }).each(function () {
                    var b = a(this),
                        c = b.parent(),
                        d = a("<span>").addClass("ui-menu-icon ui-icon " + e).data("ui-menu-submenu-carat", !0);
                    c.attr("aria-haspopup", "true").prepend(d), b.attr("aria-labelledby", c.attr("id"))
                }), b = f.add(this.element), c = b.find(this.options.items), c.not(".ui-menu-item").each(function () {
                    var b = a(this);
                    d._isDivider(b) && b.addClass("ui-widget-content ui-menu-divider")
                }), c.not(".ui-menu-item, .ui-menu-divider").addClass("ui-menu-item").uniqueId().attr({
                    tabIndex: -1,
                    role: this._itemRole()
                }), c.filter(".ui-state-disabled").attr("aria-disabled", "true"), this.active && !a.contains(this.element[0], this.active[0]) && this.blur()
            },
            _itemRole: function () {
                return {
                    menu: "menuitem",
                    listbox: "option"
                }[this.options.role]
            },
            _setOption: function (a, b) {
                "icons" === a && this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(b.submenu), "disabled" === a && this.element.toggleClass("ui-state-disabled", !!b).attr("aria-disabled", b), this._super(a, b)
            },
            focus: function (a, b) {
                var c, d;
                this.blur(a, a && "focus" === a.type), this._scrollIntoView(b), this.active = b.first(), d = this.active.addClass("ui-state-focus").removeClass("ui-state-active"), this.options.role && this.element.attr("aria-activedescendant", d.attr("id")), this.active.parent().closest(".ui-menu-item").addClass("ui-state-active"), a && "keydown" === a.type ? this._close() : this.timer = this._delay(function () {
                    this._close()
                }, this.delay), c = b.children(".ui-menu"), c.length && a && /^mouse/.test(a.type) && this._startOpening(c), this.activeMenu = b.parent(), this._trigger("focus", a, {
                    item: b
                })
            },
            _scrollIntoView: function (b) {
                var c, d, e, f, g, h;
                this._hasScroll() && (c = parseFloat(a.css(this.activeMenu[0], "borderTopWidth")) || 0, d = parseFloat(a.css(this.activeMenu[0], "paddingTop")) || 0, e = b.offset().top - this.activeMenu.offset().top - c - d, f = this.activeMenu.scrollTop(), g = this.activeMenu.height(), h = b.outerHeight(), 0 > e ? this.activeMenu.scrollTop(f + e) : e + h > g && this.activeMenu.scrollTop(f + e - g + h))
            },
            blur: function (a, b) {
                b || clearTimeout(this.timer), this.active && (this.active.removeClass("ui-state-focus"), this.active = null, this._trigger("blur", a, {
                    item: this.active
                }))
            },
            _startOpening: function (a) {
                clearTimeout(this.timer), "true" === a.attr("aria-hidden") && (this.timer = this._delay(function () {
                    this._close(), this._open(a)
                }, this.delay))
            },
            _open: function (b) {
                var c = a.extend({
                    of: this.active
                }, this.options.position);
                clearTimeout(this.timer), this.element.find(".ui-menu").not(b.parents(".ui-menu")).hide().attr("aria-hidden", "true"), b.show().removeAttr("aria-hidden").attr("aria-expanded", "true").position(c)
            },
            collapseAll: function (b, c) {
                clearTimeout(this.timer), this.timer = this._delay(function () {
                    var d = c ? this.element : a(b && b.target).closest(this.element.find(".ui-menu"));
                    d.length || (d = this.element), this._close(d), this.blur(b), this.activeMenu = d
                }, this.delay)
            },
            _close: function (a) {
                a || (a = this.active ? this.active.parent() : this.element), a.find(".ui-menu").hide().attr("aria-hidden", "true").attr("aria-expanded", "false").end().find(".ui-state-active").not(".ui-state-focus").removeClass("ui-state-active")
            },
            _closeOnDocumentClick: function (b) {
                return !a(b.target).closest(".ui-menu").length
            },
            _isDivider: function (a) {
                return !/[^\-\u2014\u2013\s]/.test(a.text())
            },
            collapse: function (a) {
                var b = this.active && this.active.parent().closest(".ui-menu-item", this.element);
                b && b.length && (this._close(), this.focus(a, b))
            },
            expand: function (a) {
                var b = this.active && this.active.children(".ui-menu ").find(this.options.items).first();
                b && b.length && (this._open(b.parent()), this._delay(function () {
                    this.focus(a, b)
                }))
            },
            next: function (a) {
                this._move("next", "first", a)
            },
            previous: function (a) {
                this._move("prev", "last", a)
            },
            isFirstItem: function () {
                return this.active && !this.active.prevAll(".ui-menu-item").length
            },
            isLastItem: function () {
                return this.active && !this.active.nextAll(".ui-menu-item").length
            },
            _move: function (a, b, c) {
                var d;
                this.active && (d = "first" === a || "last" === a ? this.active["first" === a ? "prevAll" : "nextAll"](".ui-menu-item").eq(-1) : this.active[a + "All"](".ui-menu-item").eq(0)), d && d.length && this.active || (d = this.activeMenu.find(this.options.items)[b]()), this.focus(c, d)
            },
            nextPage: function (b) {
                var c, d, e;
                return this.active ? void (this.isLastItem() || (this._hasScroll() ? (d = this.active.offset().top, e = this.element.height(), this.active.nextAll(".ui-menu-item").each(function () {
                    return c = a(this), c.offset().top - d - e < 0
                }), this.focus(b, c)) : this.focus(b, this.activeMenu.find(this.options.items)[this.active ? "last" : "first"]()))) : void this.next(b)
            },
            previousPage: function (b) {
                var c, d, e;
                return this.active ? void (this.isFirstItem() || (this._hasScroll() ? (d = this.active.offset().top, e = this.element.height(), this.active.prevAll(".ui-menu-item").each(function () {
                    return c = a(this), c.offset().top - d + e > 0
                }), this.focus(b, c)) : this.focus(b, this.activeMenu.find(this.options.items).first()))) : void this.next(b)
            },
            _hasScroll: function () {
                return this.element.outerHeight() < this.element.prop("scrollHeight")
            },
            select: function (b) {
                this.active = this.active || a(b.target).closest(".ui-menu-item");
                var c = {
                    item: this.active
                };
                this.active.has(".ui-menu").length || this.collapseAll(b, !0), this._trigger("select", b, c)
            },
            _filterMenuItems: function (b) {
                var c = b.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"),
                    d = new RegExp("^" + c, "i");
                return this.activeMenu.find(this.options.items).filter(".ui-menu-item").filter(function () {
                    return d.test(a.trim(a(this).text()))
                })
            }
        })
    }),
    function (a) {
        "function" == typeof define && define.amd ? define(["jquery", "./core", "./mouse", "./widget"], a) : a(jQuery)
    }(function (a) {
        return a.widget("ui.draggable", a.ui.mouse, {
            version: "1.11.4",
            widgetEventPrefix: "drag",
            options: {
                addClasses: !0,
                appendTo: "parent",
                axis: !1,
                connectToSortable: !1,
                containment: !1,
                cursor: "auto",
                cursorAt: !1,
                grid: !1,
                handle: !1,
                helper: "original",
                iframeFix: !1,
                opacity: !1,
                refreshPositions: !1,
                revert: !1,
                revertDuration: 500,
                scope: "default",
                scroll: !0,
                scrollSensitivity: 20,
                scrollSpeed: 20,
                snap: !1,
                snapMode: "both",
                snapTolerance: 20,
                stack: !1,
                zIndex: !1,
                drag: null,
                start: null,
                stop: null
            },
            _create: function () {
                "original" === this.options.helper && this._setPositionRelative(), this.options.addClasses && this.element.addClass("ui-draggable"), this.options.disabled && this.element.addClass("ui-draggable-disabled"), this._setHandleClassName(), this._mouseInit()
            },
            _setOption: function (a, b) {
                this._super(a, b), "handle" === a && (this._removeHandleClassName(), this._setHandleClassName())
            },
            _destroy: function () {
                return (this.helper || this.element).is(".ui-draggable-dragging") ? void (this.destroyOnClear = !0) : (this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"), this._removeHandleClassName(), void this._mouseDestroy())
            },
            _mouseCapture: function (b) {
                var c = this.options;
                return this._blurActiveElement(b), this.helper || c.disabled || a(b.target).closest(".ui-resizable-handle").length > 0 ? !1 : (this.handle = this._getHandle(b), this.handle ? (this._blockFrames(c.iframeFix === !0 ? "iframe" : c.iframeFix), !0) : !1)
            },
            _blockFrames: function (b) {
                this.iframeBlocks = this.document.find(b).map(function () {
                    var b = a(this);
                    return a("<div>").css("position", "absolute").appendTo(b.parent()).outerWidth(b.outerWidth()).outerHeight(b.outerHeight()).offset(b.offset())[0]
                })
            },
            _unblockFrames: function () {
                this.iframeBlocks && (this.iframeBlocks.remove(), delete this.iframeBlocks)
            },
            _blurActiveElement: function (b) {
                var c = this.document[0];
                if (this.handleElement.is(b.target)) try {
                    c.activeElement && "body" !== c.activeElement.nodeName.toLowerCase() && a(c.activeElement).blur()
                } catch (d) { }
            },
            _mouseStart: function (b) {
                var c = this.options;
                return this.helper = this._createHelper(b), this.helper.addClass("ui-draggable-dragging"), this._cacheHelperProportions(), a.ui.ddmanager && (a.ui.ddmanager.current = this), this._cacheMargins(), this.cssPosition = this.helper.css("position"), this.scrollParent = this.helper.scrollParent(!0), this.offsetParent = this.helper.offsetParent(), this.hasFixedAncestor = this.helper.parents().filter(function () {
                    return "fixed" === a(this).css("position")
                }).length > 0, this.positionAbs = this.element.offset(), this._refreshOffsets(b), this.originalPosition = this.position = this._generatePosition(b, !1), this.originalPageX = b.pageX, this.originalPageY = b.pageY, c.cursorAt && this._adjustOffsetFromHelper(c.cursorAt), this._setContainment(), this._trigger("start", b) === !1 ? (this._clear(), !1) : (this._cacheHelperProportions(), a.ui.ddmanager && !c.dropBehaviour && a.ui.ddmanager.prepareOffsets(this, b), this._normalizeRightBottom(), this._mouseDrag(b, !0), a.ui.ddmanager && a.ui.ddmanager.dragStart(this, b), !0)
            },
            _refreshOffsets: function (a) {
                this.offset = {
                    top: this.positionAbs.top - this.margins.top,
                    left: this.positionAbs.left - this.margins.left,
                    scroll: !1,
                    parent: this._getParentOffset(),
                    relative: this._getRelativeOffset()
                }, this.offset.click = {
                    left: a.pageX - this.offset.left,
                    top: a.pageY - this.offset.top
                }
            },
            _mouseDrag: function (b, c) {
                if (this.hasFixedAncestor && (this.offset.parent = this._getParentOffset()), this.position = this._generatePosition(b, !0), this.positionAbs = this._convertPositionTo("absolute"), !c) {
                    var d = this._uiHash();
                    if (this._trigger("drag", b, d) === !1) return this._mouseUp({}), !1;
                    this.position = d.position
                }
                return this.helper[0].style.left = this.position.left + "px", this.helper[0].style.top = this.position.top + "px", a.ui.ddmanager && a.ui.ddmanager.drag(this, b), !1
            },
            _mouseStop: function (b) {
                var c = this,
                    d = !1;
                return a.ui.ddmanager && !this.options.dropBehaviour && (d = a.ui.ddmanager.drop(this, b)), this.dropped && (d = this.dropped, this.dropped = !1), "invalid" === this.options.revert && !d || "valid" === this.options.revert && d || this.options.revert === !0 || a.isFunction(this.options.revert) && this.options.revert.call(this.element, d) ? a(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function () {
                    c._trigger("stop", b) !== !1 && c._clear()
                }) : this._trigger("stop", b) !== !1 && this._clear(), !1
            },
            _mouseUp: function (b) {
                return this._unblockFrames(), a.ui.ddmanager && a.ui.ddmanager.dragStop(this, b), this.handleElement.is(b.target) && this.element.focus(), a.ui.mouse.prototype._mouseUp.call(this, b)
            },
            cancel: function () {
                return this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear(), this
            },
            _getHandle: function (b) {
                return this.options.handle ? !!a(b.target).closest(this.element.find(this.options.handle)).length : !0
            },
            _setHandleClassName: function () {
                this.handleElement = this.options.handle ? this.element.find(this.options.handle) : this.element, this.handleElement.addClass("ui-draggable-handle")
            },
            _removeHandleClassName: function () {
                this.handleElement.removeClass("ui-draggable-handle")
            },
            _createHelper: function (b) {
                var c = this.options,
                    d = a.isFunction(c.helper),
                    e = d ? a(c.helper.apply(this.element[0], [b])) : "clone" === c.helper ? this.element.clone().removeAttr("id") : this.element;
                return e.parents("body").length || e.appendTo("parent" === c.appendTo ? this.element[0].parentNode : c.appendTo), d && e[0] === this.element[0] && this._setPositionRelative(), e[0] === this.element[0] || /(fixed|absolute)/.test(e.css("position")) || e.css("position", "absolute"), e
            },
            _setPositionRelative: function () {
                /^(?:r|a|f)/.test(this.element.css("position")) || (this.element[0].style.position = "relative")
            },
            _adjustOffsetFromHelper: function (b) {
                "string" == typeof b && (b = b.split(" ")), a.isArray(b) && (b = {
                    left: +b[0],
                    top: +b[1] || 0
                }), "left" in b && (this.offset.click.left = b.left + this.margins.left), "right" in b && (this.offset.click.left = this.helperProportions.width - b.right + this.margins.left), "top" in b && (this.offset.click.top = b.top + this.margins.top), "bottom" in b && (this.offset.click.top = this.helperProportions.height - b.bottom + this.margins.top)
            },
            _isRootNode: function (a) {
                return /(html|body)/i.test(a.tagName) || a === this.document[0]
            },
            _getParentOffset: function () {
                var b = this.offsetParent.offset(),
                    c = this.document[0];
                return "absolute" === this.cssPosition && this.scrollParent[0] !== c && a.contains(this.scrollParent[0], this.offsetParent[0]) && (b.left += this.scrollParent.scrollLeft(), b.top += this.scrollParent.scrollTop()), this._isRootNode(this.offsetParent[0]) && (b = {
                    top: 0,
                    left: 0
                }), {
                        top: b.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                        left: b.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
                    }
            },
            _getRelativeOffset: function () {
                if ("relative" !== this.cssPosition) return {
                    top: 0,
                    left: 0
                };
                var a = this.element.position(),
                    b = this._isRootNode(this.scrollParent[0]);
                return {
                    top: a.top - (parseInt(this.helper.css("top"), 10) || 0) + (b ? 0 : this.scrollParent.scrollTop()),
                    left: a.left - (parseInt(this.helper.css("left"), 10) || 0) + (b ? 0 : this.scrollParent.scrollLeft())
                }
            },
            _cacheMargins: function () {
                this.margins = {
                    left: parseInt(this.element.css("marginLeft"), 10) || 0,
                    top: parseInt(this.element.css("marginTop"), 10) || 0,
                    right: parseInt(this.element.css("marginRight"), 10) || 0,
                    bottom: parseInt(this.element.css("marginBottom"), 10) || 0
                }
            },
            _cacheHelperProportions: function () {
                this.helperProportions = {
                    width: this.helper.outerWidth(),
                    height: this.helper.outerHeight()
                }
            },
            _setContainment: function () {
                var b, c, d, e = this.options,
                    f = this.document[0];
                return this.relativeContainer = null, e.containment ? "window" === e.containment ? void (this.containment = [a(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, a(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, a(window).scrollLeft() + a(window).width() - this.helperProportions.width - this.margins.left, a(window).scrollTop() + (a(window).height() || f.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]) : "document" === e.containment ? void (this.containment = [0, 0, a(f).width() - this.helperProportions.width - this.margins.left, (a(f).height() || f.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]) : e.containment.constructor === Array ? void (this.containment = e.containment) : ("parent" === e.containment && (e.containment = this.helper[0].parentNode), c = a(e.containment), d = c[0], void (d && (b = /(scroll|auto)/.test(c.css("overflow")), this.containment = [(parseInt(c.css("borderLeftWidth"), 10) || 0) + (parseInt(c.css("paddingLeft"), 10) || 0), (parseInt(c.css("borderTopWidth"), 10) || 0) + (parseInt(c.css("paddingTop"), 10) || 0), (b ? Math.max(d.scrollWidth, d.offsetWidth) : d.offsetWidth) - (parseInt(c.css("borderRightWidth"), 10) || 0) - (parseInt(c.css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (b ? Math.max(d.scrollHeight, d.offsetHeight) : d.offsetHeight) - (parseInt(c.css("borderBottomWidth"), 10) || 0) - (parseInt(c.css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom], this.relativeContainer = c))) : void (this.containment = null)
            },
            _convertPositionTo: function (a, b) {
                b || (b = this.position);
                var c = "absolute" === a ? 1 : -1,
                    d = this._isRootNode(this.scrollParent[0]);
                return {
                    top: b.top + this.offset.relative.top * c + this.offset.parent.top * c - ("fixed" === this.cssPosition ? -this.offset.scroll.top : d ? 0 : this.offset.scroll.top) * c,
                    left: b.left + this.offset.relative.left * c + this.offset.parent.left * c - ("fixed" === this.cssPosition ? -this.offset.scroll.left : d ? 0 : this.offset.scroll.left) * c
                }
            },
            _generatePosition: function (a, b) {
                var c, d, e, f, g = this.options,
                    h = this._isRootNode(this.scrollParent[0]),
                    i = a.pageX,
                    j = a.pageY;
                return h && this.offset.scroll || (this.offset.scroll = {
                    top: this.scrollParent.scrollTop(),
                    left: this.scrollParent.scrollLeft()
                }), b && (this.containment && (this.relativeContainer ? (d = this.relativeContainer.offset(), c = [this.containment[0] + d.left, this.containment[1] + d.top, this.containment[2] + d.left, this.containment[3] + d.top]) : c = this.containment, a.pageX - this.offset.click.left < c[0] && (i = c[0] + this.offset.click.left), a.pageY - this.offset.click.top < c[1] && (j = c[1] + this.offset.click.top), a.pageX - this.offset.click.left > c[2] && (i = c[2] + this.offset.click.left), a.pageY - this.offset.click.top > c[3] && (j = c[3] + this.offset.click.top)), g.grid && (e = g.grid[1] ? this.originalPageY + Math.round((j - this.originalPageY) / g.grid[1]) * g.grid[1] : this.originalPageY, j = c ? e - this.offset.click.top >= c[1] || e - this.offset.click.top > c[3] ? e : e - this.offset.click.top >= c[1] ? e - g.grid[1] : e + g.grid[1] : e, f = g.grid[0] ? this.originalPageX + Math.round((i - this.originalPageX) / g.grid[0]) * g.grid[0] : this.originalPageX, i = c ? f - this.offset.click.left >= c[0] || f - this.offset.click.left > c[2] ? f : f - this.offset.click.left >= c[0] ? f - g.grid[0] : f + g.grid[0] : f), "y" === g.axis && (i = this.originalPageX), "x" === g.axis && (j = this.originalPageY)), {
                        top: j - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.offset.scroll.top : h ? 0 : this.offset.scroll.top),
                        left: i - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.offset.scroll.left : h ? 0 : this.offset.scroll.left)
                    }
            },
            _clear: function () {
                this.helper.removeClass("ui-draggable-dragging"), this.helper[0] === this.element[0] || this.cancelHelperRemoval || this.helper.remove(), this.helper = null, this.cancelHelperRemoval = !1, this.destroyOnClear && this.destroy()
            },
            _normalizeRightBottom: function () {
                "y" !== this.options.axis && "auto" !== this.helper.css("right") && (this.helper.width(this.helper.width()), this.helper.css("right", "auto")), "x" !== this.options.axis && "auto" !== this.helper.css("bottom") && (this.helper.height(this.helper.height()), this.helper.css("bottom", "auto"))
            },
            _trigger: function (b, c, d) {
                return d = d || this._uiHash(), a.ui.plugin.call(this, b, [c, d, this], !0), /^(drag|start|stop)/.test(b) && (this.positionAbs = this._convertPositionTo("absolute"), d.offset = this.positionAbs), a.Widget.prototype._trigger.call(this, b, c, d)
            },
            plugins: {},
            _uiHash: function () {
                return {
                    helper: this.helper,
                    position: this.position,
                    originalPosition: this.originalPosition,
                    offset: this.positionAbs
                }
            }
        }), a.ui.plugin.add("draggable", "connectToSortable", {
            start: function (b, c, d) {
                var e = a.extend({}, c, {
                    item: d.element
                });
                d.sortables = [], a(d.options.connectToSortable).each(function () {
                    var c = a(this).sortable("instance");
                    c && !c.options.disabled && (d.sortables.push(c), c.refreshPositions(), c._trigger("activate", b, e))
                })
            },
            stop: function (b, c, d) {
                var e = a.extend({}, c, {
                    item: d.element
                });
                d.cancelHelperRemoval = !1, a.each(d.sortables, function () {
                    var a = this;
                    a.isOver ? (a.isOver = 0, d.cancelHelperRemoval = !0, a.cancelHelperRemoval = !1, a._storedCSS = {
                        position: a.placeholder.css("position"),
                        top: a.placeholder.css("top"),
                        left: a.placeholder.css("left")
                    }, a._mouseStop(b), a.options.helper = a.options._helper) : (a.cancelHelperRemoval = !0, a._trigger("deactivate", b, e))
                })
            },
            drag: function (b, c, d) {
                a.each(d.sortables, function () {
                    var e = !1,
                        f = this;
                    f.positionAbs = d.positionAbs, f.helperProportions = d.helperProportions, f.offset.click = d.offset.click, f._intersectsWith(f.containerCache) && (e = !0, a.each(d.sortables, function () {
                        return this.positionAbs = d.positionAbs, this.helperProportions = d.helperProportions, this.offset.click = d.offset.click, this !== f && this._intersectsWith(this.containerCache) && a.contains(f.element[0], this.element[0]) && (e = !1), e
                    })), e ? (f.isOver || (f.isOver = 1, d._parent = c.helper.parent(), f.currentItem = c.helper.appendTo(f.element).data("ui-sortable-item", !0), f.options._helper = f.options.helper, f.options.helper = function () {
                        return c.helper[0]
                    }, b.target = f.currentItem[0], f._mouseCapture(b, !0), f._mouseStart(b, !0, !0), f.offset.click.top = d.offset.click.top, f.offset.click.left = d.offset.click.left, f.offset.parent.left -= d.offset.parent.left - f.offset.parent.left, f.offset.parent.top -= d.offset.parent.top - f.offset.parent.top, d._trigger("toSortable", b), d.dropped = f.element, a.each(d.sortables, function () {
                        this.refreshPositions()
                    }), d.currentItem = d.element, f.fromOutside = d), f.currentItem && (f._mouseDrag(b), c.position = f.position)) : f.isOver && (f.isOver = 0, f.cancelHelperRemoval = !0, f.options._revert = f.options.revert, f.options.revert = !1, f._trigger("out", b, f._uiHash(f)), f._mouseStop(b, !0), f.options.revert = f.options._revert, f.options.helper = f.options._helper, f.placeholder && f.placeholder.remove(), c.helper.appendTo(d._parent), d._refreshOffsets(b), c.position = d._generatePosition(b, !0), d._trigger("fromSortable", b), d.dropped = !1, a.each(d.sortables, function () {
                        this.refreshPositions()
                    }))
                })
            }
        }), a.ui.plugin.add("draggable", "cursor", {
            start: function (b, c, d) {
                var e = a("body"),
                    f = d.options;
                e.css("cursor") && (f._cursor = e.css("cursor")), e.css("cursor", f.cursor)
            },
            stop: function (b, c, d) {
                var e = d.options;
                e._cursor && a("body").css("cursor", e._cursor)
            }
        }), a.ui.plugin.add("draggable", "opacity", {
            start: function (b, c, d) {
                var e = a(c.helper),
                    f = d.options;
                e.css("opacity") && (f._opacity = e.css("opacity")), e.css("opacity", f.opacity)
            },
            stop: function (b, c, d) {
                var e = d.options;
                e._opacity && a(c.helper).css("opacity", e._opacity)
            }
        }), a.ui.plugin.add("draggable", "scroll", {
            start: function (a, b, c) {
                c.scrollParentNotHidden || (c.scrollParentNotHidden = c.helper.scrollParent(!1)), c.scrollParentNotHidden[0] !== c.document[0] && "HTML" !== c.scrollParentNotHidden[0].tagName && (c.overflowOffset = c.scrollParentNotHidden.offset())
            },
            drag: function (b, c, d) {
                var e = d.options,
                    f = !1,
                    g = d.scrollParentNotHidden[0],
                    h = d.document[0];
                g !== h && "HTML" !== g.tagName ? (e.axis && "x" === e.axis || (d.overflowOffset.top + g.offsetHeight - b.pageY < e.scrollSensitivity ? g.scrollTop = f = g.scrollTop + e.scrollSpeed : b.pageY - d.overflowOffset.top < e.scrollSensitivity && (g.scrollTop = f = g.scrollTop - e.scrollSpeed)), e.axis && "y" === e.axis || (d.overflowOffset.left + g.offsetWidth - b.pageX < e.scrollSensitivity ? g.scrollLeft = f = g.scrollLeft + e.scrollSpeed : b.pageX - d.overflowOffset.left < e.scrollSensitivity && (g.scrollLeft = f = g.scrollLeft - e.scrollSpeed))) : (e.axis && "x" === e.axis || (b.pageY - a(h).scrollTop() < e.scrollSensitivity ? f = a(h).scrollTop(a(h).scrollTop() - e.scrollSpeed) : a(window).height() - (b.pageY - a(h).scrollTop()) < e.scrollSensitivity && (f = a(h).scrollTop(a(h).scrollTop() + e.scrollSpeed))), e.axis && "y" === e.axis || (b.pageX - a(h).scrollLeft() < e.scrollSensitivity ? f = a(h).scrollLeft(a(h).scrollLeft() - e.scrollSpeed) : a(window).width() - (b.pageX - a(h).scrollLeft()) < e.scrollSensitivity && (f = a(h).scrollLeft(a(h).scrollLeft() + e.scrollSpeed)))), f !== !1 && a.ui.ddmanager && !e.dropBehaviour && a.ui.ddmanager.prepareOffsets(d, b)
            }
        }), a.ui.plugin.add("draggable", "snap", {
            start: function (b, c, d) {
                var e = d.options;
                d.snapElements = [], a(e.snap.constructor !== String ? e.snap.items || ":data(ui-draggable)" : e.snap).each(function () {
                    var b = a(this),
                        c = b.offset();
                    this !== d.element[0] && d.snapElements.push({
                        item: this,
                        width: b.outerWidth(),
                        height: b.outerHeight(),
                        top: c.top,
                        left: c.left
                    })
                })
            },
            drag: function (b, c, d) {
                var e, f, g, h, i, j, k, l, m, n, o = d.options,
                    p = o.snapTolerance,
                    q = c.offset.left,
                    r = q + d.helperProportions.width,
                    s = c.offset.top,
                    t = s + d.helperProportions.height;
                for (m = d.snapElements.length - 1; m >= 0; m--) i = d.snapElements[m].left - d.margins.left, j = i + d.snapElements[m].width, k = d.snapElements[m].top - d.margins.top, l = k + d.snapElements[m].height, i - p > r || q > j + p || k - p > t || s > l + p || !a.contains(d.snapElements[m].item.ownerDocument, d.snapElements[m].item) ? (d.snapElements[m].snapping && d.options.snap.release && d.options.snap.release.call(d.element, b, a.extend(d._uiHash(), {
                    snapItem: d.snapElements[m].item
                })), d.snapElements[m].snapping = !1) : ("inner" !== o.snapMode && (e = Math.abs(k - t) <= p, f = Math.abs(l - s) <= p, g = Math.abs(i - r) <= p, h = Math.abs(j - q) <= p, e && (c.position.top = d._convertPositionTo("relative", {
                    top: k - d.helperProportions.height,
                    left: 0
                }).top), f && (c.position.top = d._convertPositionTo("relative", {
                    top: l,
                    left: 0
                }).top), g && (c.position.left = d._convertPositionTo("relative", {
                    top: 0,
                    left: i - d.helperProportions.width
                }).left), h && (c.position.left = d._convertPositionTo("relative", {
                    top: 0,
                    left: j
                }).left)), n = e || f || g || h, "outer" !== o.snapMode && (e = Math.abs(k - s) <= p, f = Math.abs(l - t) <= p, g = Math.abs(i - q) <= p, h = Math.abs(j - r) <= p, e && (c.position.top = d._convertPositionTo("relative", {
                    top: k,
                    left: 0
                }).top), f && (c.position.top = d._convertPositionTo("relative", {
                    top: l - d.helperProportions.height,
                    left: 0
                }).top), g && (c.position.left = d._convertPositionTo("relative", {
                    top: 0,
                    left: i
                }).left), h && (c.position.left = d._convertPositionTo("relative", {
                    top: 0,
                    left: j - d.helperProportions.width
                }).left)), !d.snapElements[m].snapping && (e || f || g || h || n) && d.options.snap.snap && d.options.snap.snap.call(d.element, b, a.extend(d._uiHash(), {
                    snapItem: d.snapElements[m].item
                })), d.snapElements[m].snapping = e || f || g || h || n)
            }
        }), a.ui.plugin.add("draggable", "stack", {
            start: function (b, c, d) {
                var e, f = d.options,
                    g = a.makeArray(a(f.stack)).sort(function (b, c) {
                        return (parseInt(a(b).css("zIndex"), 10) || 0) - (parseInt(a(c).css("zIndex"), 10) || 0)
                    });
                g.length && (e = parseInt(a(g[0]).css("zIndex"), 10) || 0, a(g).each(function (b) {
                    a(this).css("zIndex", e + b)
                }), this.css("zIndex", e + g.length))
            }
        }), a.ui.plugin.add("draggable", "zIndex", {
            start: function (b, c, d) {
                var e = a(c.helper),
                    f = d.options;
                e.css("zIndex") && (f._zIndex = e.css("zIndex")), e.css("zIndex", f.zIndex)
            },
            stop: function (b, c, d) {
                var e = d.options;
                e._zIndex && a(c.helper).css("zIndex", e._zIndex)
            }
        }), a.ui.draggable
    }),
    function (a, b) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = b() : "function" == typeof define && define.amd ? define(b) : a.moment = b()
    }(this, function () {
        "use strict";

        function a() {
            return Hc.apply(null, arguments)
        }

        function b(a) {
            Hc = a
        }

        function c(a) {
            return "[object Array]" === Object.prototype.toString.call(a)
        }

        function d(a) {
            return a instanceof Date || "[object Date]" === Object.prototype.toString.call(a)
        }

        function e(a, b) {
            var c, d = [];
            for (c = 0; c < a.length; ++c) d.push(b(a[c], c));
            return d
        }

        function f(a, b) {
            return Object.prototype.hasOwnProperty.call(a, b)
        }

        function g(a, b) {
            for (var c in b) f(b, c) && (a[c] = b[c]);
            return f(b, "toString") && (a.toString = b.toString), f(b, "valueOf") && (a.valueOf = b.valueOf), a
        }

        function h(a, b, c, d) {
            return Ca(a, b, c, d, !0).utc()
        }

        function i() {
            return {
                empty: !1,
                unusedTokens: [],
                unusedInput: [],
                overflow: -2,
                charsLeftOver: 0,
                nullInput: !1,
                invalidMonth: null,
                invalidFormat: !1,
                userInvalidated: !1,
                iso: !1
            }
        }

        function j(a) {
            return null == a._pf && (a._pf = i()), a._pf
        }

        function k(a) {
            if (null == a._isValid) {
                var b = j(a);
                a._isValid = !(isNaN(a._d.getTime()) || !(b.overflow < 0) || b.empty || b.invalidMonth || b.invalidWeekday || b.nullInput || b.invalidFormat || b.userInvalidated), a._strict && (a._isValid = a._isValid && 0 === b.charsLeftOver && 0 === b.unusedTokens.length && void 0 === b.bigHour)
            }
            return a._isValid
        }

        function l(a) {
            var b = h(NaN);
            return null != a ? g(j(b), a) : j(b).userInvalidated = !0, b
        }

        function m(a, b) {
            var c, d, e;
            if ("undefined" != typeof b._isAMomentObject && (a._isAMomentObject = b._isAMomentObject), "undefined" != typeof b._i && (a._i = b._i), "undefined" != typeof b._f && (a._f = b._f), "undefined" != typeof b._l && (a._l = b._l), "undefined" != typeof b._strict && (a._strict = b._strict), "undefined" != typeof b._tzm && (a._tzm = b._tzm), "undefined" != typeof b._isUTC && (a._isUTC = b._isUTC), "undefined" != typeof b._offset && (a._offset = b._offset), "undefined" != typeof b._pf && (a._pf = j(b)), "undefined" != typeof b._locale && (a._locale = b._locale), Jc.length > 0)
                for (c in Jc) d = Jc[c], e = b[d], "undefined" != typeof e && (a[d] = e);
            return a
        }

        function n(b) {
            m(this, b), this._d = new Date(null != b._d ? b._d.getTime() : NaN), Kc === !1 && (Kc = !0, a.updateOffset(this), Kc = !1)
        }

        function o(a) {
            return a instanceof n || null != a && null != a._isAMomentObject
        }

        function p(a) {
            return 0 > a ? Math.ceil(a) : Math.floor(a)
        }

        function q(a) {
            var b = +a,
                c = 0;
            return 0 !== b && isFinite(b) && (c = p(b)), c
        }

        function r(a, b, c) {
            var d, e = Math.min(a.length, b.length),
                f = Math.abs(a.length - b.length),
                g = 0;
            for (d = 0; e > d; d++)(c && a[d] !== b[d] || !c && q(a[d]) !== q(b[d])) && g++;
            return g + f
        }

        function s() { }

        function t(a) {
            return a ? a.toLowerCase().replace("_", "-") : a
        }

        function u(a) {
            for (var b, c, d, e, f = 0; f < a.length;) {
                for (e = t(a[f]).split("-"), b = e.length, c = t(a[f + 1]), c = c ? c.split("-") : null; b > 0;) {
                    if (d = v(e.slice(0, b).join("-"))) return d;
                    if (c && c.length >= b && r(e, c, !0) >= b - 1) break;
                    b--
                }
                f++
            }
            return null
        }

        function v(a) {
            var b = null;
            if (!Lc[a] && "undefined" != typeof module && module && module.exports) try {
                b = Ic._abbr, require("./locale/" + a), w(b)
            } catch (c) { }
            return Lc[a]
        }

        function w(a, b) {
            var c;
            return a && (c = "undefined" == typeof b ? y(a) : x(a, b), c && (Ic = c)), Ic._abbr
        }

        function x(a, b) {
            return null !== b ? (b.abbr = a, Lc[a] = Lc[a] || new s, Lc[a].set(b), w(a), Lc[a]) : (delete Lc[a], null)
        }

        function y(a) {
            var b;
            if (a && a._locale && a._locale._abbr && (a = a._locale._abbr), !a) return Ic;
            if (!c(a)) {
                if (b = v(a)) return b;
                a = [a]
            }
            return u(a)
        }

        function z(a, b) {
            var c = a.toLowerCase();
            Mc[c] = Mc[c + "s"] = Mc[b] = a
        }

        function A(a) {
            return "string" == typeof a ? Mc[a] || Mc[a.toLowerCase()] : void 0
        }

        function B(a) {
            var b, c, d = {};
            for (c in a) f(a, c) && (b = A(c), b && (d[b] = a[c]));
            return d
        }

        function C(b, c) {
            return function (d) {
                return null != d ? (E(this, b, d), a.updateOffset(this, c), this) : D(this, b)
            }
        }

        function D(a, b) {
            return a._d["get" + (a._isUTC ? "UTC" : "") + b]()
        }

        function E(a, b, c) {
            return a._d["set" + (a._isUTC ? "UTC" : "") + b](c)
        }

        function F(a, b) {
            var c;
            if ("object" == typeof a)
                for (c in a) this.set(c, a[c]);
            else if (a = A(a),
                "function" == typeof this[a]) return this[a](b);
            return this
        }

        function G(a, b, c) {
            var d = "" + Math.abs(a),
                e = b - d.length,
                f = a >= 0;
            return (f ? c ? "+" : "" : "-") + Math.pow(10, Math.max(0, e)).toString().substr(1) + d
        }

        function H(a, b, c, d) {
            var e = d;
            "string" == typeof d && (e = function () {
                return this[d]()
            }), a && (Qc[a] = e), b && (Qc[b[0]] = function () {
                return G(e.apply(this, arguments), b[1], b[2])
            }), c && (Qc[c] = function () {
                return this.localeData().ordinal(e.apply(this, arguments), a)
            })
        }

        function I(a) {
            return a.match(/\[[\s\S]/) ? a.replace(/^\[|\]$/g, "") : a.replace(/\\/g, "")
        }

        function J(a) {
            var b, c, d = a.match(Nc);
            for (b = 0, c = d.length; c > b; b++) Qc[d[b]] ? d[b] = Qc[d[b]] : d[b] = I(d[b]);
            return function (e) {
                var f = "";
                for (b = 0; c > b; b++) f += d[b] instanceof Function ? d[b].call(e, a) : d[b];
                return f
            }
        }

        function K(a, b) {
            return a.isValid() ? (b = L(b, a.localeData()), Pc[b] = Pc[b] || J(b), Pc[b](a)) : a.localeData().invalidDate()
        }

        function L(a, b) {
            function c(a) {
                return b.longDateFormat(a) || a
            }
            var d = 5;
            for (Oc.lastIndex = 0; d >= 0 && Oc.test(a);) a = a.replace(Oc, c), Oc.lastIndex = 0, d -= 1;
            return a
        }

        function M(a) {
            return "function" == typeof a && "[object Function]" === Object.prototype.toString.call(a)
        }

        function N(a, b, c) {
            dd[a] = M(b) ? b : function (a) {
                return a && c ? c : b
            }
        }

        function O(a, b) {
            return f(dd, a) ? dd[a](b._strict, b._locale) : new RegExp(P(a))
        }

        function P(a) {
            return a.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (a, b, c, d, e) {
                return b || c || d || e
            }).replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
        }

        function Q(a, b) {
            var c, d = b;
            for ("string" == typeof a && (a = [a]), "number" == typeof b && (d = function (a, c) {
                c[b] = q(a)
            }), c = 0; c < a.length; c++) ed[a[c]] = d
        }

        function R(a, b) {
            Q(a, function (a, c, d, e) {
                d._w = d._w || {}, b(a, d._w, d, e)
            })
        }

        function S(a, b, c) {
            null != b && f(ed, a) && ed[a](b, c._a, c, a)
        }

        function T(a, b) {
            return new Date(Date.UTC(a, b + 1, 0)).getUTCDate()
        }

        function U(a) {
            return this._months[a.month()]
        }

        function V(a) {
            return this._monthsShort[a.month()]
        }

        function W(a, b, c) {
            var d, e, f;
            for (this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []), d = 0; 12 > d; d++) {
                if (e = h([2e3, d]), c && !this._longMonthsParse[d] && (this._longMonthsParse[d] = new RegExp("^" + this.months(e, "").replace(".", "") + "$", "i"), this._shortMonthsParse[d] = new RegExp("^" + this.monthsShort(e, "").replace(".", "") + "$", "i")), c || this._monthsParse[d] || (f = "^" + this.months(e, "") + "|^" + this.monthsShort(e, ""), this._monthsParse[d] = new RegExp(f.replace(".", ""), "i")), c && "MMMM" === b && this._longMonthsParse[d].test(a)) return d;
                if (c && "MMM" === b && this._shortMonthsParse[d].test(a)) return d;
                if (!c && this._monthsParse[d].test(a)) return d
            }
        }

        function X(a, b) {
            var c;
            return "string" == typeof b && (b = a.localeData().monthsParse(b), "number" != typeof b) ? a : (c = Math.min(a.date(), T(a.year(), b)), a._d["set" + (a._isUTC ? "UTC" : "") + "Month"](b, c), a)
        }

        function Y(b) {
            return null != b ? (X(this, b), a.updateOffset(this, !0), this) : D(this, "Month")
        }

        function Z() {
            return T(this.year(), this.month())
        }

        function $(a) {
            var b, c = a._a;
            return c && -2 === j(a).overflow && (b = c[gd] < 0 || c[gd] > 11 ? gd : c[hd] < 1 || c[hd] > T(c[fd], c[gd]) ? hd : c[id] < 0 || c[id] > 24 || 24 === c[id] && (0 !== c[jd] || 0 !== c[kd] || 0 !== c[ld]) ? id : c[jd] < 0 || c[jd] > 59 ? jd : c[kd] < 0 || c[kd] > 59 ? kd : c[ld] < 0 || c[ld] > 999 ? ld : -1, j(a)._overflowDayOfYear && (fd > b || b > hd) && (b = hd), j(a).overflow = b), a
        }

        function _(b) {
            a.suppressDeprecationWarnings === !1 && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + b)
        }

        function aa(a, b) {
            var c = !0;
            return g(function () {
                return c && (_(a + "\n" + (new Error).stack), c = !1), b.apply(this, arguments)
            }, b)
        }

        function ba(a, b) {
            od[a] || (_(b), od[a] = !0)
        }

        function ca(a) {
            var b, c, d = a._i,
                e = pd.exec(d);
            if (e) {
                for (j(a).iso = !0, b = 0, c = qd.length; c > b; b++)
                    if (qd[b][1].exec(d)) {
                        a._f = qd[b][0];
                        break
                    }
                for (b = 0, c = rd.length; c > b; b++)
                    if (rd[b][1].exec(d)) {
                        a._f += (e[6] || " ") + rd[b][0];
                        break
                    }
                d.match(ad) && (a._f += "Z"), va(a)
            } else a._isValid = !1
        }

        function da(b) {
            var c = sd.exec(b._i);
            return null !== c ? void (b._d = new Date(+c[1])) : (ca(b), void (b._isValid === !1 && (delete b._isValid, a.createFromInputFallback(b))))
        }

        function ea(a, b, c, d, e, f, g) {
            var h = new Date(a, b, c, d, e, f, g);
            return 1970 > a && h.setFullYear(a), h
        }

        function fa(a) {
            var b = new Date(Date.UTC.apply(null, arguments));
            return 1970 > a && b.setUTCFullYear(a), b
        }

        function ga(a) {
            return ha(a) ? 366 : 365
        }

        function ha(a) {
            return a % 4 === 0 && a % 100 !== 0 || a % 400 === 0
        }

        function ia() {
            return ha(this.year())
        }

        function ja(a, b, c) {
            var d, e = c - b,
                f = c - a.day();
            return f > e && (f -= 7), e - 7 > f && (f += 7), d = Da(a).add(f, "d"), {
                week: Math.ceil(d.dayOfYear() / 7),
                year: d.year()
            }
        }

        function ka(a) {
            return ja(a, this._week.dow, this._week.doy).week
        }

        function la() {
            return this._week.dow
        }

        function ma() {
            return this._week.doy
        }

        function na(a) {
            var b = this.localeData().week(this);
            return null == a ? b : this.add(7 * (a - b), "d")
        }

        function oa(a) {
            var b = ja(this, 1, 4).week;
            return null == a ? b : this.add(7 * (a - b), "d")
        }

        function pa(a, b, c, d, e) {
            var f, g = 6 + e - d,
                h = fa(a, 0, 1 + g),
                i = h.getUTCDay();
            return e > i && (i += 7), c = null != c ? 1 * c : e, f = 1 + g + 7 * (b - 1) - i + c, {
                year: f > 0 ? a : a - 1,
                dayOfYear: f > 0 ? f : ga(a - 1) + f
            }
        }

        function qa(a) {
            var b = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
            return null == a ? b : this.add(a - b, "d")
        }

        function ra(a, b, c) {
            return null != a ? a : null != b ? b : c
        }

        function sa(a) {
            var b = new Date;
            return a._useUTC ? [b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate()] : [b.getFullYear(), b.getMonth(), b.getDate()]
        }

        function ta(a) {
            var b, c, d, e, f = [];
            if (!a._d) {
                for (d = sa(a), a._w && null == a._a[hd] && null == a._a[gd] && ua(a), a._dayOfYear && (e = ra(a._a[fd], d[fd]), a._dayOfYear > ga(e) && (j(a)._overflowDayOfYear = !0), c = fa(e, 0, a._dayOfYear), a._a[gd] = c.getUTCMonth(), a._a[hd] = c.getUTCDate()), b = 0; 3 > b && null == a._a[b]; ++b) a._a[b] = f[b] = d[b];
                for (; 7 > b; b++) a._a[b] = f[b] = null == a._a[b] ? 2 === b ? 1 : 0 : a._a[b];
                24 === a._a[id] && 0 === a._a[jd] && 0 === a._a[kd] && 0 === a._a[ld] && (a._nextDay = !0, a._a[id] = 0), a._d = (a._useUTC ? fa : ea).apply(null, f), null != a._tzm && a._d.setUTCMinutes(a._d.getUTCMinutes() - a._tzm), a._nextDay && (a._a[id] = 24)
            }
        }

        function ua(a) {
            var b, c, d, e, f, g, h;
            b = a._w, null != b.GG || null != b.W || null != b.E ? (f = 1, g = 4, c = ra(b.GG, a._a[fd], ja(Da(), 1, 4).year), d = ra(b.W, 1), e = ra(b.E, 1)) : (f = a._locale._week.dow, g = a._locale._week.doy, c = ra(b.gg, a._a[fd], ja(Da(), f, g).year), d = ra(b.w, 1), null != b.d ? (e = b.d, f > e && ++d) : e = null != b.e ? b.e + f : f), h = pa(c, d, e, g, f), a._a[fd] = h.year, a._dayOfYear = h.dayOfYear
        }

        function va(b) {
            if (b._f === a.ISO_8601) return void ca(b);
            b._a = [], j(b).empty = !0;
            var c, d, e, f, g, h = "" + b._i,
                i = h.length,
                k = 0;
            for (e = L(b._f, b._locale).match(Nc) || [], c = 0; c < e.length; c++) f = e[c], d = (h.match(O(f, b)) || [])[0], d && (g = h.substr(0, h.indexOf(d)), g.length > 0 && j(b).unusedInput.push(g), h = h.slice(h.indexOf(d) + d.length), k += d.length), Qc[f] ? (d ? j(b).empty = !1 : j(b).unusedTokens.push(f), S(f, d, b)) : b._strict && !d && j(b).unusedTokens.push(f);
            j(b).charsLeftOver = i - k, h.length > 0 && j(b).unusedInput.push(h), j(b).bigHour === !0 && b._a[id] <= 12 && b._a[id] > 0 && (j(b).bigHour = void 0), b._a[id] = wa(b._locale, b._a[id], b._meridiem), ta(b), $(b)
        }

        function wa(a, b, c) {
            var d;
            return null == c ? b : null != a.meridiemHour ? a.meridiemHour(b, c) : null != a.isPM ? (d = a.isPM(c), d && 12 > b && (b += 12), d || 12 !== b || (b = 0), b) : b
        }

        function xa(a) {
            var b, c, d, e, f;
            if (0 === a._f.length) return j(a).invalidFormat = !0, void (a._d = new Date(NaN));
            for (e = 0; e < a._f.length; e++) f = 0, b = m({}, a), null != a._useUTC && (b._useUTC = a._useUTC), b._f = a._f[e], va(b), k(b) && (f += j(b).charsLeftOver, f += 10 * j(b).unusedTokens.length, j(b).score = f, (null == d || d > f) && (d = f, c = b));
            g(a, c || b)
        }

        function ya(a) {
            if (!a._d) {
                var b = B(a._i);
                a._a = [b.year, b.month, b.day || b.date, b.hour, b.minute, b.second, b.millisecond], ta(a)
            }
        }

        function za(a) {
            var b = new n($(Aa(a)));
            return b._nextDay && (b.add(1, "d"), b._nextDay = void 0), b
        }

        function Aa(a) {
            var b = a._i,
                e = a._f;
            return a._locale = a._locale || y(a._l), null === b || void 0 === e && "" === b ? l({
                nullInput: !0
            }) : ("string" == typeof b && (a._i = b = a._locale.preparse(b)), o(b) ? new n($(b)) : (c(e) ? xa(a) : e ? va(a) : d(b) ? a._d = b : Ba(a), a))
        }

        function Ba(b) {
            var f = b._i;
            void 0 === f ? b._d = new Date : d(f) ? b._d = new Date(+f) : "string" == typeof f ? da(b) : c(f) ? (b._a = e(f.slice(0), function (a) {
                return parseInt(a, 10)
            }), ta(b)) : "object" == typeof f ? ya(b) : "number" == typeof f ? b._d = new Date(f) : a.createFromInputFallback(b)
        }

        function Ca(a, b, c, d, e) {
            var f = {};
            return "boolean" == typeof c && (d = c, c = void 0), f._isAMomentObject = !0, f._useUTC = f._isUTC = e, f._l = c, f._i = a, f._f = b, f._strict = d, za(f)
        }

        function Da(a, b, c, d) {
            return Ca(a, b, c, d, !1)
        }

        function Ea(a, b) {
            var d, e;
            if (1 === b.length && c(b[0]) && (b = b[0]), !b.length) return Da();
            for (d = b[0], e = 1; e < b.length; ++e)(!b[e].isValid() || b[e][a](d)) && (d = b[e]);
            return d
        }

        function Fa() {
            var a = [].slice.call(arguments, 0);
            return Ea("isBefore", a)
        }

        function Ga() {
            var a = [].slice.call(arguments, 0);
            return Ea("isAfter", a)
        }

        function Ha(a) {
            var b = B(a),
                c = b.year || 0,
                d = b.quarter || 0,
                e = b.month || 0,
                f = b.week || 0,
                g = b.day || 0,
                h = b.hour || 0,
                i = b.minute || 0,
                j = b.second || 0,
                k = b.millisecond || 0;
            this._milliseconds = +k + 1e3 * j + 6e4 * i + 36e5 * h, this._days = +g + 7 * f, this._months = +e + 3 * d + 12 * c, this._data = {}, this._locale = y(), this._bubble()
        }

        function Ia(a) {
            return a instanceof Ha
        }

        function Ja(a, b) {
            H(a, 0, 0, function () {
                var a = this.utcOffset(),
                    c = "+";
                return 0 > a && (a = -a, c = "-"), c + G(~~(a / 60), 2) + b + G(~~a % 60, 2)
            })
        }

        function Ka(a) {
            var b = (a || "").match(ad) || [],
                c = b[b.length - 1] || [],
                d = (c + "").match(xd) || ["-", 0, 0],
                e = +(60 * d[1]) + q(d[2]);
            return "+" === d[0] ? e : -e
        }

        function La(b, c) {
            var e, f;
            return c._isUTC ? (e = c.clone(), f = (o(b) || d(b) ? +b : +Da(b)) - +e, e._d.setTime(+e._d + f), a.updateOffset(e, !1), e) : Da(b).local()
        }

        function Ma(a) {
            return 15 * -Math.round(a._d.getTimezoneOffset() / 15)
        }

        function Na(b, c) {
            var d, e = this._offset || 0;
            return null != b ? ("string" == typeof b && (b = Ka(b)), Math.abs(b) < 16 && (b = 60 * b), !this._isUTC && c && (d = Ma(this)), this._offset = b, this._isUTC = !0, null != d && this.add(d, "m"), e !== b && (!c || this._changeInProgress ? bb(this, Ya(b - e, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, a.updateOffset(this, !0), this._changeInProgress = null)), this) : this._isUTC ? e : Ma(this)
        }

        function Oa(a, b) {
            return null != a ? ("string" != typeof a && (a = -a), this.utcOffset(a, b), this) : -this.utcOffset()
        }

        function Pa(a) {
            return this.utcOffset(0, a)
        }

        function Qa(a) {
            return this._isUTC && (this.utcOffset(0, a), this._isUTC = !1, a && this.subtract(Ma(this), "m")), this
        }

        function Ra() {
            return this._tzm ? this.utcOffset(this._tzm) : "string" == typeof this._i && this.utcOffset(Ka(this._i)), this
        }

        function Sa(a) {
            return a = a ? Da(a).utcOffset() : 0, (this.utcOffset() - a) % 60 === 0
        }

        function Ta() {
            return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset()
        }

        function Ua() {
            if ("undefined" != typeof this._isDSTShifted) return this._isDSTShifted;
            var a = {};
            if (m(a, this), a = Aa(a), a._a) {
                var b = a._isUTC ? h(a._a) : Da(a._a);
                this._isDSTShifted = this.isValid() && r(a._a, b.toArray()) > 0
            } else this._isDSTShifted = !1;
            return this._isDSTShifted
        }

        function Va() {
            return !this._isUTC
        }

        function Wa() {
            return this._isUTC
        }

        function Xa() {
            return this._isUTC && 0 === this._offset
        }

        function Ya(a, b) {
            var c, d, e, g = a,
                h = null;
            return Ia(a) ? g = {
                ms: a._milliseconds,
                d: a._days,
                M: a._months
            } : "number" == typeof a ? (g = {}, b ? g[b] = a : g.milliseconds = a) : (h = yd.exec(a)) ? (c = "-" === h[1] ? -1 : 1, g = {
                y: 0,
                d: q(h[hd]) * c,
                h: q(h[id]) * c,
                m: q(h[jd]) * c,
                s: q(h[kd]) * c,
                ms: q(h[ld]) * c
            }) : (h = zd.exec(a)) ? (c = "-" === h[1] ? -1 : 1, g = {
                y: Za(h[2], c),
                M: Za(h[3], c),
                d: Za(h[4], c),
                h: Za(h[5], c),
                m: Za(h[6], c),
                s: Za(h[7], c),
                w: Za(h[8], c)
            }) : null == g ? g = {} : "object" == typeof g && ("from" in g || "to" in g) && (e = _a(Da(g.from), Da(g.to)), g = {}, g.ms = e.milliseconds, g.M = e.months), d = new Ha(g), Ia(a) && f(a, "_locale") && (d._locale = a._locale), d
        }

        function Za(a, b) {
            var c = a && parseFloat(a.replace(",", "."));
            return (isNaN(c) ? 0 : c) * b
        }

        function $a(a, b) {
            var c = {
                milliseconds: 0,
                months: 0
            };
            return c.months = b.month() - a.month() + 12 * (b.year() - a.year()), a.clone().add(c.months, "M").isAfter(b) && --c.months, c.milliseconds = +b - +a.clone().add(c.months, "M"), c
        }

        function _a(a, b) {
            var c;
            return b = La(b, a), a.isBefore(b) ? c = $a(a, b) : (c = $a(b, a), c.milliseconds = -c.milliseconds, c.months = -c.months), c
        }

        function ab(a, b) {
            return function (c, d) {
                var e, f;
                return null === d || isNaN(+d) || (ba(b, "moment()." + b + "(period, number) is deprecated. Please use moment()." + b + "(number, period)."), f = c, c = d, d = f), c = "string" == typeof c ? +c : c, e = Ya(c, d), bb(this, e, a), this
            }
        }

        function bb(b, c, d, e) {
            var f = c._milliseconds,
                g = c._days,
                h = c._months;
            e = null == e ? !0 : e, f && b._d.setTime(+b._d + f * d), g && E(b, "Date", D(b, "Date") + g * d), h && X(b, D(b, "Month") + h * d), e && a.updateOffset(b, g || h)
        }

        function cb(a, b) {
            var c = a || Da(),
                d = La(c, this).startOf("day"),
                e = this.diff(d, "days", !0),
                f = -6 > e ? "sameElse" : -1 > e ? "lastWeek" : 0 > e ? "lastDay" : 1 > e ? "sameDay" : 2 > e ? "nextDay" : 7 > e ? "nextWeek" : "sameElse";
            return this.format(b && b[f] || this.localeData().calendar(f, this, Da(c)))
        }

        function db() {
            return new n(this)
        }

        function eb(a, b) {
            var c;
            return b = A("undefined" != typeof b ? b : "millisecond"), "millisecond" === b ? (a = o(a) ? a : Da(a), +this > +a) : (c = o(a) ? +a : +Da(a), c < +this.clone().startOf(b))
        }

        function fb(a, b) {
            var c;
            return b = A("undefined" != typeof b ? b : "millisecond"), "millisecond" === b ? (a = o(a) ? a : Da(a), +a > +this) : (c = o(a) ? +a : +Da(a), +this.clone().endOf(b) < c)
        }

        function gb(a, b, c) {
            return this.isAfter(a, c) && this.isBefore(b, c)
        }

        function hb(a, b) {
            var c;
            return b = A(b || "millisecond"), "millisecond" === b ? (a = o(a) ? a : Da(a), +this === +a) : (c = +Da(a), +this.clone().startOf(b) <= c && c <= +this.clone().endOf(b))
        }

        function ib(a, b, c) {
            var d, e, f = La(a, this),
                g = 6e4 * (f.utcOffset() - this.utcOffset());
            return b = A(b), "year" === b || "month" === b || "quarter" === b ? (e = jb(this, f), "quarter" === b ? e /= 3 : "year" === b && (e /= 12)) : (d = this - f, e = "second" === b ? d / 1e3 : "minute" === b ? d / 6e4 : "hour" === b ? d / 36e5 : "day" === b ? (d - g) / 864e5 : "week" === b ? (d - g) / 6048e5 : d), c ? e : p(e)
        }

        function jb(a, b) {
            var c, d, e = 12 * (b.year() - a.year()) + (b.month() - a.month()),
                f = a.clone().add(e, "months");
            return 0 > b - f ? (c = a.clone().add(e - 1, "months"), d = (b - f) / (f - c)) : (c = a.clone().add(e + 1, "months"), d = (b - f) / (c - f)), -(e + d)
        }

        function kb() {
            return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
        }

        function lb() {
            var a = this.clone().utc();
            return 0 < a.year() && a.year() <= 9999 ? "function" == typeof Date.prototype.toISOString ? this.toDate().toISOString() : K(a, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]") : K(a, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
        }

        function mb(b) {
            var c = K(this, b || a.defaultFormat);
            return this.localeData().postformat(c)
        }

        function nb(a, b) {
            return this.isValid() ? Ya({
                to: this,
                from: a
            }).locale(this.locale()).humanize(!b) : this.localeData().invalidDate()
        }

        function ob(a) {
            return this.from(Da(), a)
        }

        function pb(a, b) {
            return this.isValid() ? Ya({
                from: this,
                to: a
            }).locale(this.locale()).humanize(!b) : this.localeData().invalidDate()
        }

        function qb(a) {
            return this.to(Da(), a)
        }

        function rb(a) {
            var b;
            return void 0 === a ? this._locale._abbr : (b = y(a), null != b && (this._locale = b), this)
        }

        function sb() {
            return this._locale
        }

        function tb(a) {
            switch (a = A(a)) {
                case "year":
                    this.month(0);
                case "quarter":
                case "month":
                    this.date(1);
                case "week":
                case "isoWeek":
                case "day":
                    this.hours(0);
                case "hour":
                    this.minutes(0);
                case "minute":
                    this.seconds(0);
                case "second":
                    this.milliseconds(0)
            }
            return "week" === a && this.weekday(0), "isoWeek" === a && this.isoWeekday(1), "quarter" === a && this.month(3 * Math.floor(this.month() / 3)), this
        }

        function ub(a) {
            return a = A(a), void 0 === a || "millisecond" === a ? this : this.startOf(a).add(1, "isoWeek" === a ? "week" : a).subtract(1, "ms")
        }

        function vb() {
            return +this._d - 6e4 * (this._offset || 0)
        }

        function wb() {
            return Math.floor(+this / 1e3)
        }

        function xb() {
            return this._offset ? new Date(+this) : this._d
        }

        function yb() {
            var a = this;
            return [a.year(), a.month(), a.date(), a.hour(), a.minute(), a.second(), a.millisecond()]
        }

        function zb() {
            var a = this;
            return {
                years: a.year(),
                months: a.month(),
                date: a.date(),
                hours: a.hours(),
                minutes: a.minutes(),
                seconds: a.seconds(),
                milliseconds: a.milliseconds()
            }
        }

        function Ab() {
            return k(this)
        }

        function Bb() {
            return g({}, j(this))
        }

        function Cb() {
            return j(this).overflow
        }

        function Db(a, b) {
            H(0, [a, a.length], 0, b)
        }

        function Eb(a, b, c) {
            return ja(Da([a, 11, 31 + b - c]), b, c).week
        }

        function Fb(a) {
            var b = ja(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
            return null == a ? b : this.add(a - b, "y")
        }

        function Gb(a) {
            var b = ja(this, 1, 4).year;
            return null == a ? b : this.add(a - b, "y")
        }

        function Hb() {
            return Eb(this.year(), 1, 4)
        }

        function Ib() {
            var a = this.localeData()._week;
            return Eb(this.year(), a.dow, a.doy)
        }

        function Jb(a) {
            return null == a ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (a - 1) + this.month() % 3)
        }

        function Kb(a, b) {
            return "string" != typeof a ? a : isNaN(a) ? (a = b.weekdaysParse(a), "number" == typeof a ? a : null) : parseInt(a, 10)
        }

        function Lb(a) {
            return this._weekdays[a.day()]
        }

        function Mb(a) {
            return this._weekdaysShort[a.day()]
        }

        function Nb(a) {
            return this._weekdaysMin[a.day()]
        }

        function Ob(a) {
            var b, c, d;
            for (this._weekdaysParse = this._weekdaysParse || [], b = 0; 7 > b; b++)
                if (this._weekdaysParse[b] || (c = Da([2e3, 1]).day(b), d = "^" + this.weekdays(c, "") + "|^" + this.weekdaysShort(c, "") + "|^" + this.weekdaysMin(c, ""), this._weekdaysParse[b] = new RegExp(d.replace(".", ""), "i")), this._weekdaysParse[b].test(a)) return b
        }

        function Pb(a) {
            var b = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            return null != a ? (a = Kb(a, this.localeData()), this.add(a - b, "d")) : b
        }

        function Qb(a) {
            var b = (this.day() + 7 - this.localeData()._week.dow) % 7;
            return null == a ? b : this.add(a - b, "d")
        }

        function Rb(a) {
            return null == a ? this.day() || 7 : this.day(this.day() % 7 ? a : a - 7)
        }

        function Sb(a, b) {
            H(a, 0, 0, function () {
                return this.localeData().meridiem(this.hours(), this.minutes(), b)
            })
        }

        function Tb(a, b) {
            return b._meridiemParse
        }

        function Ub(a) {
            return "p" === (a + "").toLowerCase().charAt(0)
        }

        function Vb(a, b, c) {
            return a > 11 ? c ? "pm" : "PM" : c ? "am" : "AM"
        }

        function Wb(a, b) {
            b[ld] = q(1e3 * ("0." + a))
        }

        function Xb() {
            return this._isUTC ? "UTC" : ""
        }

        function Yb() {
            return this._isUTC ? "Coordinated Universal Time" : ""
        }

        function Zb(a) {
            return Da(1e3 * a)
        }

        function $b() {
            return Da.apply(null, arguments).parseZone()
        }

        function _b(a, b, c) {
            var d = this._calendar[a];
            return "function" == typeof d ? d.call(b, c) : d
        }

        function ac(a) {
            var b = this._longDateFormat[a],
                c = this._longDateFormat[a.toUpperCase()];
            return b || !c ? b : (this._longDateFormat[a] = c.replace(/MMMM|MM|DD|dddd/g, function (a) {
                return a.slice(1)
            }), this._longDateFormat[a])
        }

        function bc() {
            return this._invalidDate
        }

        function cc(a) {
            return this._ordinal.replace("%d", a)
        }

        function dc(a) {
            return a
        }

        function ec(a, b, c, d) {
            var e = this._relativeTime[c];
            return "function" == typeof e ? e(a, b, c, d) : e.replace(/%d/i, a)
        }

        function fc(a, b) {
            var c = this._relativeTime[a > 0 ? "future" : "past"];
            return "function" == typeof c ? c(b) : c.replace(/%s/i, b)
        }

        function gc(a) {
            var b, c;
            for (c in a) b = a[c], "function" == typeof b ? this[c] = b : this["_" + c] = b;
            this._ordinalParseLenient = new RegExp(this._ordinalParse.source + "|" + /\d{1,2}/.source)
        }

        function hc(a, b, c, d) {
            var e = y(),
                f = h().set(d, b);
            return e[c](f, a)
        }

        function ic(a, b, c, d, e) {
            if ("number" == typeof a && (b = a, a = void 0), a = a || "", null != b) return hc(a, b, c, e);
            var f, g = [];
            for (f = 0; d > f; f++) g[f] = hc(a, f, c, e);
            return g
        }

        function jc(a, b) {
            return ic(a, b, "months", 12, "month")
        }

        function kc(a, b) {
            return ic(a, b, "monthsShort", 12, "month")
        }

        function lc(a, b) {
            return ic(a, b, "weekdays", 7, "day")
        }

        function mc(a, b) {
            return ic(a, b, "weekdaysShort", 7, "day")
        }

        function nc(a, b) {
            return ic(a, b, "weekdaysMin", 7, "day")
        }

        function oc() {
            var a = this._data;
            return this._milliseconds = Wd(this._milliseconds), this._days = Wd(this._days), this._months = Wd(this._months), a.milliseconds = Wd(a.milliseconds), a.seconds = Wd(a.seconds), a.minutes = Wd(a.minutes), a.hours = Wd(a.hours), a.months = Wd(a.months), a.years = Wd(a.years), this
        }

        function pc(a, b, c, d) {
            var e = Ya(b, c);
            return a._milliseconds += d * e._milliseconds, a._days += d * e._days, a._months += d * e._months, a._bubble()
        }

        function qc(a, b) {
            return pc(this, a, b, 1)
        }

        function rc(a, b) {
            return pc(this, a, b, -1)
        }

        function sc(a) {
            return 0 > a ? Math.floor(a) : Math.ceil(a)
        }

        function tc() {
            var a, b, c, d, e, f = this._milliseconds,
                g = this._days,
                h = this._months,
                i = this._data;
            return f >= 0 && g >= 0 && h >= 0 || 0 >= f && 0 >= g && 0 >= h || (f += 864e5 * sc(vc(h) + g), g = 0, h = 0), i.milliseconds = f % 1e3, a = p(f / 1e3), i.seconds = a % 60, b = p(a / 60), i.minutes = b % 60, c = p(b / 60), i.hours = c % 24, g += p(c / 24), e = p(uc(g)), h += e, g -= sc(vc(e)), d = p(h / 12), h %= 12, i.days = g, i.months = h, i.years = d, this
        }

        function uc(a) {
            return 4800 * a / 146097
        }

        function vc(a) {
            return 146097 * a / 4800
        }

        function wc(a) {
            var b, c, d = this._milliseconds;
            if (a = A(a), "month" === a || "year" === a) return b = this._days + d / 864e5, c = this._months + uc(b), "month" === a ? c : c / 12;
            switch (b = this._days + Math.round(vc(this._months)), a) {
                case "week":
                    return b / 7 + d / 6048e5;
                case "day":
                    return b + d / 864e5;
                case "hour":
                    return 24 * b + d / 36e5;
                case "minute":
                    return 1440 * b + d / 6e4;
                case "second":
                    return 86400 * b + d / 1e3;
                case "millisecond":
                    return Math.floor(864e5 * b) + d;
                default:
                    throw new Error("Unknown unit " + a)
            }
        }

        function xc() {
            return this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * q(this._months / 12)
        }

        function yc(a) {
            return function () {
                return this.as(a)
            }
        }

        function zc(a) {
            return a = A(a), this[a + "s"]()
        }

        function Ac(a) {
            return function () {
                return this._data[a]
            }
        }

        function Bc() {
            return p(this.days() / 7)
        }

        function Cc(a, b, c, d, e) {
            return e.relativeTime(b || 1, !!c, a, d)
        }

        function Dc(a, b, c) {
            var d = Ya(a).abs(),
                e = ke(d.as("s")),
                f = ke(d.as("m")),
                g = ke(d.as("h")),
                h = ke(d.as("d")),
                i = ke(d.as("M")),
                j = ke(d.as("y")),
                k = e < le.s && ["s", e] || 1 === f && ["m"] || f < le.m && ["mm", f] || 1 === g && ["h"] || g < le.h && ["hh", g] || 1 === h && ["d"] || h < le.d && ["dd", h] || 1 === i && ["M"] || i < le.M && ["MM", i] || 1 === j && ["y"] || ["yy", j];
            return k[2] = b, k[3] = +a > 0, k[4] = c, Cc.apply(null, k)
        }

        function Ec(a, b) {
            return void 0 === le[a] ? !1 : void 0 === b ? le[a] : (le[a] = b, !0)
        }

        function Fc(a) {
            var b = this.localeData(),
                c = Dc(this, !a, b);
            return a && (c = b.pastFuture(+this, c)), b.postformat(c)
        }

        function Gc() {
            var a, b, c, d = me(this._milliseconds) / 1e3,
                e = me(this._days),
                f = me(this._months);
            a = p(d / 60), b = p(a / 60), d %= 60, a %= 60, c = p(f / 12), f %= 12;
            var g = c,
                h = f,
                i = e,
                j = b,
                k = a,
                l = d,
                m = this.asSeconds();
            return m ? (0 > m ? "-" : "") + "P" + (g ? g + "Y" : "") + (h ? h + "M" : "") + (i ? i + "D" : "") + (j || k || l ? "T" : "") + (j ? j + "H" : "") + (k ? k + "M" : "") + (l ? l + "S" : "") : "P0D"
        }
        var Hc, Ic, Jc = a.momentProperties = [],
            Kc = !1,
            Lc = {},
            Mc = {},
            Nc = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
            Oc = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
            Pc = {},
            Qc = {},
            Rc = /\d/,
            Sc = /\d\d/,
            Tc = /\d{3}/,
            Uc = /\d{4}/,
            Vc = /[+-]?\d{6}/,
            Wc = /\d\d?/,
            Xc = /\d{1,3}/,
            Yc = /\d{1,4}/,
            Zc = /[+-]?\d{1,6}/,
            $c = /\d+/,
            _c = /[+-]?\d+/,
            ad = /Z|[+-]\d\d:?\d\d/gi,
            bd = /[+-]?\d+(\.\d{1,3})?/,
            cd = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,
            dd = {},
            ed = {},
            fd = 0,
            gd = 1,
            hd = 2,
            id = 3,
            jd = 4,
            kd = 5,
            ld = 6;
        H("M", ["MM", 2], "Mo", function () {
            return this.month() + 1
        }), H("MMM", 0, 0, function (a) {
            return this.localeData().monthsShort(this, a)
        }), H("MMMM", 0, 0, function (a) {
            return this.localeData().months(this, a)
        }), z("month", "M"), N("M", Wc), N("MM", Wc, Sc), N("MMM", cd), N("MMMM", cd), Q(["M", "MM"], function (a, b) {
            b[gd] = q(a) - 1
        }), Q(["MMM", "MMMM"], function (a, b, c, d) {
            var e = c._locale.monthsParse(a, d, c._strict);
            null != e ? b[gd] = e : j(c).invalidMonth = a
        });
        var md = "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
            nd = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
            od = {};
        a.suppressDeprecationWarnings = !1;
        var pd = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
            qd = [
                ["YYYYYY-MM-DD", /[+-]\d{6}-\d{2}-\d{2}/],
                ["YYYY-MM-DD", /\d{4}-\d{2}-\d{2}/],
                ["GGGG-[W]WW-E", /\d{4}-W\d{2}-\d/],
                ["GGGG-[W]WW", /\d{4}-W\d{2}/],
                ["YYYY-DDD", /\d{4}-\d{3}/]
            ],
            rd = [
                ["HH:mm:ss.SSSS", /(T| )\d\d:\d\d:\d\d\.\d+/],
                ["HH:mm:ss", /(T| )\d\d:\d\d:\d\d/],
                ["HH:mm", /(T| )\d\d:\d\d/],
                ["HH", /(T| )\d\d/]
            ],
            sd = /^\/?Date\((\-?\d+)/i;
        a.createFromInputFallback = aa("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.", function (a) {
            a._d = new Date(a._i + (a._useUTC ? " UTC" : ""))
        }), H(0, ["YY", 2], 0, function () {
            return this.year() % 100
        }), H(0, ["YYYY", 4], 0, "year"), H(0, ["YYYYY", 5], 0, "year"), H(0, ["YYYYYY", 6, !0], 0, "year"), z("year", "y"), N("Y", _c), N("YY", Wc, Sc), N("YYYY", Yc, Uc), N("YYYYY", Zc, Vc), N("YYYYYY", Zc, Vc), Q(["YYYYY", "YYYYYY"], fd), Q("YYYY", function (b, c) {
            c[fd] = 2 === b.length ? a.parseTwoDigitYear(b) : q(b)
        }), Q("YY", function (b, c) {
            c[fd] = a.parseTwoDigitYear(b)
        }), a.parseTwoDigitYear = function (a) {
            return q(a) + (q(a) > 68 ? 1900 : 2e3)
        };
        var td = C("FullYear", !1);
        H("w", ["ww", 2], "wo", "week"), H("W", ["WW", 2], "Wo", "isoWeek"), z("week", "w"), z("isoWeek", "W"), N("w", Wc), N("ww", Wc, Sc), N("W", Wc), N("WW", Wc, Sc), R(["w", "ww", "W", "WW"], function (a, b, c, d) {
            b[d.substr(0, 1)] = q(a)
        });
        var ud = {
            dow: 0,
            doy: 6
        };
        H("DDD", ["DDDD", 3], "DDDo", "dayOfYear"), z("dayOfYear", "DDD"), N("DDD", Xc), N("DDDD", Tc), Q(["DDD", "DDDD"], function (a, b, c) {
            c._dayOfYear = q(a)
        }), a.ISO_8601 = function () { };
        var vd = aa("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548", function () {
            var a = Da.apply(null, arguments);
            return this > a ? this : a
        }),
            wd = aa("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548", function () {
                var a = Da.apply(null, arguments);
                return a > this ? this : a
            });
        Ja("Z", ":"), Ja("ZZ", ""), N("Z", ad), N("ZZ", ad), Q(["Z", "ZZ"], function (a, b, c) {
            c._useUTC = !0, c._tzm = Ka(a)
        });
        var xd = /([\+\-]|\d\d)/gi;
        a.updateOffset = function () { };
        var yd = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,
            zd = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;
        Ya.fn = Ha.prototype;
        var Ad = ab(1, "add"),
            Bd = ab(-1, "subtract");
        a.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
        var Cd = aa("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function (a) {
            return void 0 === a ? this.localeData() : this.locale(a)
        });
        H(0, ["gg", 2], 0, function () {
            return this.weekYear() % 100
        }), H(0, ["GG", 2], 0, function () {
            return this.isoWeekYear() % 100
        }), Db("gggg", "weekYear"), Db("ggggg", "weekYear"), Db("GGGG", "isoWeekYear"), Db("GGGGG", "isoWeekYear"), z("weekYear", "gg"), z("isoWeekYear", "GG"), N("G", _c), N("g", _c), N("GG", Wc, Sc), N("gg", Wc, Sc), N("GGGG", Yc, Uc), N("gggg", Yc, Uc), N("GGGGG", Zc, Vc), N("ggggg", Zc, Vc), R(["gggg", "ggggg", "GGGG", "GGGGG"], function (a, b, c, d) {
            b[d.substr(0, 2)] = q(a)
        }), R(["gg", "GG"], function (b, c, d, e) {
            c[e] = a.parseTwoDigitYear(b)
        }), H("Q", 0, 0, "quarter"), z("quarter", "Q"), N("Q", Rc), Q("Q", function (a, b) {
            b[gd] = 3 * (q(a) - 1)
        }), H("D", ["DD", 2], "Do", "date"), z("date", "D"), N("D", Wc), N("DD", Wc, Sc), N("Do", function (a, b) {
            return a ? b._ordinalParse : b._ordinalParseLenient
        }), Q(["D", "DD"], hd), Q("Do", function (a, b) {
            b[hd] = q(a.match(Wc)[0], 10)
        });
        var Dd = C("Date", !0);
        H("d", 0, "do", "day"), H("dd", 0, 0, function (a) {
            return this.localeData().weekdaysMin(this, a)
        }), H("ddd", 0, 0, function (a) {
            return this.localeData().weekdaysShort(this, a)
        }), H("dddd", 0, 0, function (a) {
            return this.localeData().weekdays(this, a)
        }), H("e", 0, 0, "weekday"), H("E", 0, 0, "isoWeekday"), z("day", "d"), z("weekday", "e"), z("isoWeekday", "E"), N("d", Wc), N("e", Wc), N("E", Wc), N("dd", cd), N("ddd", cd), N("dddd", cd), R(["dd", "ddd", "dddd"], function (a, b, c) {
            var d = c._locale.weekdaysParse(a);
            null != d ? b.d = d : j(c).invalidWeekday = a
        }), R(["d", "e", "E"], function (a, b, c, d) {
            b[d] = q(a)
        });
        var Ed = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
            Fd = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
            Gd = "Su_Mo_Tu_We_Th_Fr_Sa".split("_");
        H("H", ["HH", 2], 0, "hour"), H("h", ["hh", 2], 0, function () {
            return this.hours() % 12 || 12
        }), Sb("a", !0), Sb("A", !1), z("hour", "h"), N("a", Tb), N("A", Tb), N("H", Wc), N("h", Wc), N("HH", Wc, Sc), N("hh", Wc, Sc), Q(["H", "HH"], id), Q(["a", "A"], function (a, b, c) {
            c._isPm = c._locale.isPM(a), c._meridiem = a
        }), Q(["h", "hh"], function (a, b, c) {
            b[id] = q(a), j(c).bigHour = !0
        });
        var Hd = /[ap]\.?m?\.?/i,
            Id = C("Hours", !0);
        H("m", ["mm", 2], 0, "minute"), z("minute", "m"), N("m", Wc), N("mm", Wc, Sc), Q(["m", "mm"], jd);
        var Jd = C("Minutes", !1);
        H("s", ["ss", 2], 0, "second"), z("second", "s"), N("s", Wc), N("ss", Wc, Sc), Q(["s", "ss"], kd);
        var Kd = C("Seconds", !1);
        H("S", 0, 0, function () {
            return ~~(this.millisecond() / 100)
        }), H(0, ["SS", 2], 0, function () {
            return ~~(this.millisecond() / 10)
        }), H(0, ["SSS", 3], 0, "millisecond"), H(0, ["SSSS", 4], 0, function () {
            return 10 * this.millisecond()
        }), H(0, ["SSSSS", 5], 0, function () {
            return 100 * this.millisecond()
        }), H(0, ["SSSSSS", 6], 0, function () {
            return 1e3 * this.millisecond()
        }), H(0, ["SSSSSSS", 7], 0, function () {
            return 1e4 * this.millisecond()
        }), H(0, ["SSSSSSSS", 8], 0, function () {
            return 1e5 * this.millisecond()
        }), H(0, ["SSSSSSSSS", 9], 0, function () {
            return 1e6 * this.millisecond()
        }), z("millisecond", "ms"), N("S", Xc, Rc), N("SS", Xc, Sc), N("SSS", Xc, Tc);
        var Ld;
        for (Ld = "SSSS"; Ld.length <= 9; Ld += "S") N(Ld, $c);
        for (Ld = "S"; Ld.length <= 9; Ld += "S") Q(Ld, Wb);
        var Md = C("Milliseconds", !1);
        H("z", 0, 0, "zoneAbbr"), H("zz", 0, 0, "zoneName");
        var Nd = n.prototype;
        Nd.add = Ad, Nd.calendar = cb, Nd.clone = db, Nd.diff = ib, Nd.endOf = ub, Nd.format = mb, Nd.from = nb, Nd.fromNow = ob, Nd.to = pb, Nd.toNow = qb, Nd.get = F, Nd.invalidAt = Cb, Nd.isAfter = eb, Nd.isBefore = fb, Nd.isBetween = gb, Nd.isSame = hb, Nd.isValid = Ab, Nd.lang = Cd, Nd.locale = rb, Nd.localeData = sb, Nd.max = wd, Nd.min = vd, Nd.parsingFlags = Bb, Nd.set = F, Nd.startOf = tb, Nd.subtract = Bd, Nd.toArray = yb, Nd.toObject = zb, Nd.toDate = xb, Nd.toISOString = lb, Nd.toJSON = lb, Nd.toString = kb, Nd.unix = wb, Nd.valueOf = vb, Nd.year = td, Nd.isLeapYear = ia, Nd.weekYear = Fb, Nd.isoWeekYear = Gb, Nd.quarter = Nd.quarters = Jb, Nd.month = Y, Nd.daysInMonth = Z, Nd.week = Nd.weeks = na, Nd.isoWeek = Nd.isoWeeks = oa, Nd.weeksInYear = Ib, Nd.isoWeeksInYear = Hb, Nd.date = Dd, Nd.day = Nd.days = Pb, Nd.weekday = Qb, Nd.isoWeekday = Rb, Nd.dayOfYear = qa, Nd.hour = Nd.hours = Id, Nd.minute = Nd.minutes = Jd, Nd.second = Nd.seconds = Kd, Nd.millisecond = Nd.milliseconds = Md, Nd.utcOffset = Na, Nd.utc = Pa, Nd.local = Qa, Nd.parseZone = Ra, Nd.hasAlignedHourOffset = Sa, Nd.isDST = Ta, Nd.isDSTShifted = Ua, Nd.isLocal = Va, Nd.isUtcOffset = Wa, Nd.isUtc = Xa, Nd.isUTC = Xa, Nd.zoneAbbr = Xb, Nd.zoneName = Yb, Nd.dates = aa("dates accessor is deprecated. Use date instead.", Dd), Nd.months = aa("months accessor is deprecated. Use month instead", Y), Nd.years = aa("years accessor is deprecated. Use year instead", td), Nd.zone = aa("moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779", Oa);
        var Od = Nd,
            Pd = {
                sameDay: "[Today at] LT",
                nextDay: "[Tomorrow at] LT",
                nextWeek: "dddd [at] LT",
                lastDay: "[Yesterday at] LT",
                lastWeek: "[Last] dddd [at] LT",
                sameElse: "L"
            },
            Qd = {
                LTS: "h:mm:ss A",
                LT: "h:mm A",
                L: "MM/DD/YYYY",
                LL: "MMMM D, YYYY",
                LLL: "MMMM D, YYYY h:mm A",
                LLLL: "dddd, MMMM D, YYYY h:mm A"
            },
            Rd = "Invalid date",
            Sd = "%d",
            Td = /\d{1,2}/,
            Ud = {
                future: "in %s",
                past: "%s ago",
                s: "a few seconds",
                m: "a minute",
                mm: "%d minutes",
                h: "an hour",
                hh: "%d hours",
                d: "a day",
                dd: "%d days",
                M: "a month",
                MM: "%d months",
                y: "a year",
                yy: "%d years"
            },
            Vd = s.prototype;
        Vd._calendar = Pd, Vd.calendar = _b, Vd._longDateFormat = Qd, Vd.longDateFormat = ac, Vd._invalidDate = Rd, Vd.invalidDate = bc, Vd._ordinal = Sd, Vd.ordinal = cc, Vd._ordinalParse = Td, Vd.preparse = dc, Vd.postformat = dc, Vd._relativeTime = Ud, Vd.relativeTime = ec, Vd.pastFuture = fc, Vd.set = gc, Vd.months = U, Vd._months = md, Vd.monthsShort = V, Vd._monthsShort = nd, Vd.monthsParse = W, Vd.week = ka, Vd._week = ud, Vd.firstDayOfYear = ma, Vd.firstDayOfWeek = la, Vd.weekdays = Lb, Vd._weekdays = Ed, Vd.weekdaysMin = Nb, Vd._weekdaysMin = Gd, Vd.weekdaysShort = Mb, Vd._weekdaysShort = Fd, Vd.weekdaysParse = Ob, Vd.isPM = Ub, Vd._meridiemParse = Hd, Vd.meridiem = Vb, w("en", {
            ordinalParse: /\d{1,2}(th|st|nd|rd)/,
            ordinal: function (a) {
                var b = a % 10,
                    c = 1 === q(a % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
                return a + c
            }
        }), a.lang = aa("moment.lang is deprecated. Use moment.locale instead.", w), a.langData = aa("moment.langData is deprecated. Use moment.localeData instead.", y);
        var Wd = Math.abs,
            Xd = yc("ms"),
            Yd = yc("s"),
            Zd = yc("m"),
            $d = yc("h"),
            _d = yc("d"),
            ae = yc("w"),
            be = yc("M"),
            ce = yc("y"),
            de = Ac("milliseconds"),
            ee = Ac("seconds"),
            fe = Ac("minutes"),
            ge = Ac("hours"),
            he = Ac("days"),
            ie = Ac("months"),
            je = Ac("years"),
            ke = Math.round,
            le = {
                s: 45,
                m: 45,
                h: 22,
                d: 26,
                M: 11
            },
            me = Math.abs,
            ne = Ha.prototype;
        ne.abs = oc, ne.add = qc, ne.subtract = rc, ne.as = wc, ne.asMilliseconds = Xd, ne.asSeconds = Yd, ne.asMinutes = Zd, ne.asHours = $d, ne.asDays = _d, ne.asWeeks = ae, ne.asMonths = be, ne.asYears = ce, ne.valueOf = xc, ne._bubble = tc, ne.get = zc, ne.milliseconds = de, ne.seconds = ee, ne.minutes = fe, ne.hours = ge, ne.days = he, ne.weeks = Bc, ne.months = ie, ne.years = je, ne.humanize = Fc, ne.toISOString = Gc, ne.toString = Gc, ne.toJSON = Gc, ne.locale = rb, ne.localeData = sb, ne.toIsoString = aa("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", Gc), ne.lang = Cd, H("X", 0, 0, "unix"), H("x", 0, 0, "valueOf"), N("x", _c), N("X", bd), Q("X", function (a, b, c) {
            c._d = new Date(1e3 * parseFloat(a, 10))
        }), Q("x", function (a, b, c) {
            c._d = new Date(q(a))
        }), a.version = "2.10.6", b(Da), a.fn = Od, a.min = Fa, a.max = Ga, a.utc = h, a.unix = Zb, a.months = jc, a.isDate = d, a.locale = w, a.invalid = l, a.duration = Ya, a.isMoment = o, a.weekdays = lc, a.parseZone = $b, a.localeData = y, a.isDuration = Ia, a.monthsShort = kc, a.weekdaysMin = nc, a.defineLocale = x, a.weekdaysShort = mc, a.normalizeUnits = A, a.relativeTimeThreshold = Ec;
        var oe = a;
        return oe
    }),
    function (a, b) {
        "object" == typeof exports && "undefined" != typeof module ? b(require("../moment")) : "function" == typeof define && define.amd ? define(["moment"], b) : b(a.moment)
    }(this, function (a) {
        "use strict";
        var b = a.defineLocale("vi", {
            months: "thÃ¡ng 1_thÃ¡ng 2_thÃ¡ng 3_thÃ¡ng 4_thÃ¡ng 5_thÃ¡ng 6_thÃ¡ng 7_thÃ¡ng 8_thÃ¡ng 9_thÃ¡ng 10_thÃ¡ng 11_thÃ¡ng 12".split("_"),
            monthsShort: "Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12".split("_"),
            weekdays: "chá»§ nháº­t_thá»© hai_thá»© ba_thá»© tÆ°_thá»© nÄƒm_thá»© sÃ¡u_thá»© báº£y".split("_"),
            weekdaysShort: "CN_T2_T3_T4_T5_T6_T7".split("_"),
            weekdaysMin: "CN_T2_T3_T4_T5_T6_T7".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM [nÄƒm] YYYY",
                LLL: "D MMMM [nÄƒm] YYYY HH:mm",
                LLLL: "dddd, D MMMM [nÄƒm] YYYY HH:mm",
                l: "DD/M/YYYY",
                ll: "D MMM YYYY",
                lll: "D MMM YYYY HH:mm",
                llll: "ddd, D MMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[HÃ´m nay lÃºc] LT",
                nextDay: "[NgÃ y mai lÃºc] LT",
                nextWeek: "dddd [tuáº§n tá»›i lÃºc] LT",
                lastDay: "[HÃ´m qua lÃºc] LT",
                lastWeek: "dddd [tuáº§n rá»“i lÃºc] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s tá»›i",
                past: "%s trÆ°á»›c",
                s: "vÃ i giÃ¢y",
                m: "má»™t phÃºt",
                mm: "%d phÃºt",
                h: "má»™t giá»",
                hh: "%d giá»",
                d: "má»™t ngÃ y",
                dd: "%d ngÃ y",
                M: "má»™t thÃ¡ng",
                MM: "%d thÃ¡ng",
                y: "má»™t nÄƒm",
                yy: "%d nÄƒm"
            },
            ordinalParse: /\d{1,2}/,
            ordinal: function (a) {
                return a
            },
            week: {
                dow: 1,
                doy: 4
            }
        });
        return b
    }), ! function () {
        "use strict";

        function a(a, b, c, d) {
            function e(a, b) {
                for (var c = 0; c < a.length; c++) {
                    var d = a[c];
                    b(d, c)
                }
            }

            function f(a) {
                g(a), h(a), i(a)
            }

            function g(a) {
                a.addEventListener("mouseover", function (b) {
                    e(l, function (b, c) {
                        c <= parseInt(a.getAttribute("data-index")) ? b.classList.add("is-active") : b.classList.remove("is-active")
                    })
                })
            }

            function h(a) {
                a.addEventListener("mouseout", function (a) {
                    -1 === l.indexOf(a.relatedTarget) && j(null, !1)
                })
            }

            function i(a) {
                a.addEventListener("click", function (b) {
                    b.preventDefault(), j(parseInt(a.getAttribute("data-index")) + 1, !0)
                })
            }

            function j(a, f) {
                a && 0 > a || a > c || (void 0 === f && (f = !0), b = "number" == typeof a ? a : b, e(l, function (a, c) {
                    b > c ? a.classList.add("is-active") : a.classList.remove("is-active")
                }), d && f && d(k()))
            }

            function k() {
                return b
            }
            var l = [];
            return function () {
                if (!a) throw Error("No element supplied.");
                if (!c) throw Error("No max rating supplied.");
                if (b || (b = 0), 0 > b || b > c) throw Error("Current rating is out of bounds.");
                for (var d = 0; c > d; d++) {
                    var e = document.createElement("li");
                    e.classList.add("c-rating__item"), e.setAttribute("data-index", d), b > d && e.classList.add("is-active"), a.appendChild(e), l.push(e), f(e)
                }
            }(), {
                    setRating: j,
                    getRating: k
                }
        }
        window.rating = a
    }(),
    function () {
        function a(a, b) {
            o[a] || ("undefined" != typeof console && "function" == typeof console.warn && console.warn("[WARNING] " + a + " is deprecated and will be removed in version 1.0. Instead, use `" + b + "`."), o[a] = !0)
        }

        function b(a) {
            a.localize = l.localize.bind(l), a.timezone = l.timezone.bind(l), a.utc = l.utc.bind(l)
        }

        function c(b, c, d) {
            return c && c.days && (d = c, c = void 0), d && a("`" + n + "(format, [date], [locale])`", "var s = " + n + ".localize(locale); s(format, [date])"), (d ? l.localize(d) : l)(b, c)
        }

        function d(b, c, d) {
            return d ? a("`" + n + ".strftime(format, [date], [locale])`", "var s = " + n + ".localize(locale); s(format, [date])") : a("`" + n + ".strftime(format, [date])`", n + "(format, [date])"), (d ? l.localize(d) : l)(b, c)
        }

        function e(a, b, c) {
            function d(a, b, c, e) {
                for (var j = "", k = null, l = !1, o = a.length, p = !1, q = 0; o > q; q++) {
                    var r = a.charCodeAt(q);
                    if (l === !0)
                        if (45 === r) k = "";
                        else if (95 === r) k = " ";
                        else if (48 === r) k = "0";
                        else if (58 === r) p && "undefined" != typeof console && "function" == typeof console.warn && console.warn("[WARNING] detected use of unsupported %:: or %::: modifiers to strftime"), p = !0;
                        else {
                            switch (r) {
                                case 65:
                                    j += c.days[b.getDay()];
                                    break;
                                case 66:
                                    j += c.months[b.getMonth()];
                                    break;
                                case 67:
                                    j += f(Math.floor(b.getFullYear() / 100), k);
                                    break;
                                case 68:
                                    j += d(c.formats.D, b, c, e);
                                    break;
                                case 70:
                                    j += d(c.formats.F, b, c, e);
                                    break;
                                case 72:
                                    j += f(b.getHours(), k);
                                    break;
                                case 73:
                                    j += f(g(b.getHours()), k);
                                    break;
                                case 76:
                                    j += Math.floor(e % 1e3) > 99 ? Math.floor(e % 1e3) : Math.floor(e % 1e3) > 9 ? "0" + Math.floor(e % 1e3) : "00" + Math.floor(e % 1e3);
                                    break;
                                case 77:
                                    j += f(b.getMinutes(), k);
                                    break;
                                case 80:
                                    j += b.getHours() < 12 ? c.am : c.pm;
                                    break;
                                case 82:
                                    j += d(c.formats.R, b, c, e);
                                    break;
                                case 83:
                                    j += f(b.getSeconds(), k);
                                    break;
                                case 84:
                                    j += d(c.formats.T, b, c, e);
                                    break;
                                case 85:
                                    j += f(h(b, "sunday"), k);
                                    break;
                                case 87:
                                    j += f(h(b, "monday"), k);
                                    break;
                                case 88:
                                    j += d(c.formats.X, b, c, e);
                                    break;
                                case 89:
                                    j += b.getFullYear();
                                    break;
                                case 90:
                                    n && 0 === m ? j += "GMT" : (k = b.toString().match(/\(([\w\s]+)\)/), j += k && k[1] || "");
                                    break;
                                case 97:
                                    j += c.shortDays[b.getDay()];
                                    break;
                                case 98:
                                    j += c.shortMonths[b.getMonth()];
                                    break;
                                case 99:
                                    j += d(c.formats.c, b, c, e);
                                    break;
                                case 100:
                                    j += f(b.getDate(), k);
                                    break;
                                case 101:
                                    j += f(b.getDate(), null == k ? " " : k);
                                    break;
                                case 104:
                                    j += c.shortMonths[b.getMonth()];
                                    break;
                                case 106:
                                    k = new Date(b.getFullYear(), 0, 1), k = Math.ceil((b.getTime() - k.getTime()) / 864e5), j += k > 99 ? k : k > 9 ? "0" + k : "00" + k;
                                    break;
                                case 107:
                                    j += f(b.getHours(), null == k ? " " : k);
                                    break;
                                case 108:
                                    j += f(g(b.getHours()), null == k ? " " : k);
                                    break;
                                case 109:
                                    j += f(b.getMonth() + 1, k);
                                    break;
                                case 110:
                                    j += "\n";
                                    break;
                                case 111:
                                    j += String(b.getDate()) + i(b.getDate());
                                    break;
                                case 112:
                                    j += b.getHours() < 12 ? c.AM : c.PM;
                                    break;
                                case 114:
                                    j += d(c.formats.r, b, c, e);
                                    break;
                                case 115:
                                    j += Math.floor(e / 1e3);
                                    break;
                                case 116:
                                    j += "	";
                                    break;
                                case 117:
                                    k = b.getDay(), j += 0 === k ? 7 : k;
                                    break;
                                case 118:
                                    j += d(c.formats.v, b, c, e);
                                    break;
                                case 119:
                                    j += b.getDay();
                                    break;
                                case 120:
                                    j += d(c.formats.x, b, c, e);
                                    break;
                                case 121:
                                    j += ("" + b.getFullYear()).slice(2);
                                    break;
                                case 122:
                                    n && 0 === m ? j += p ? "+00:00" : "+0000" : (k = 0 !== m ? m / 6e4 : -b.getTimezoneOffset(), l = p ? ":" : "", r = Math.abs(k % 60), j += (0 > k ? "-" : "+") + f(Math.floor(Math.abs(k / 60))) + l + f(r));
                                    break;
                                default:
                                    j += a[q]
                            }
                            k = null, l = !1
                        } else 37 === r ? l = !0 : j += a[q]
                }
                return j
            }
            var j, l = a || k,
                m = b || 0,
                n = c || !1,
                o = 0,
                a = function (a, b) {
                    var c;
                    return b ? (c = b.getTime(), n && (b = new Date(b.getTime() + 6e4 * (b.getTimezoneOffset() || 0) + m))) : (c = Date.now(), c > o ? (o = c, j = new Date(o), c = o, n && (j = new Date(o + 6e4 * (j.getTimezoneOffset() || 0) + m))) : c = o, b = j), d(a, b, l, c)
                };
            return a.localize = function (a) {
                return new e(a || l, m, n)
            }, a.timezone = function (a) {
                var b = m,
                    c = n,
                    d = typeof a;
                return ("number" === d || "string" === d) && (c = !0, "string" === d ? (b = "-" === a[0] ? -1 : 1, d = parseInt(a.slice(1, 3), 10), a = parseInt(a.slice(3, 5), 10), b = b * (60 * d + a) * 6e4) : "number" === d && (b = 6e4 * a)), new e(l, b, c)
            }, a.utc = function () {
                return new e(l, m, !0)
            }, a
        }

        function f(a, b) {
            return "" === b || a > 9 ? a : (null == b && (b = "0"), b + a)
        }

        function g(a) {
            return 0 === a ? 12 : a > 12 ? a - 12 : a
        }

        function h(a, b) {
            var b = b || "sunday",
                c = a.getDay();
            "monday" === b && (0 === c ? c = 6 : c--);
            var d = Date.UTC(a.getFullYear(), 0, 1),
                e = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
            return Math.floor((Math.floor((e - d) / 864e5) + 7 - c) / 7)
        }

        function i(a) {
            var b = a % 10;
            if (a %= 100, a >= 11 && 13 >= a || 0 === b || b >= 4) return "th";
            switch (b) {
                case 1:
                    return "st";
                case 2:
                    return "nd";
                case 3:
                    return "rd"
            }
        }
        var j, k = {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            AM: "AM",
            PM: "PM",
            am: "am",
            pm: "pm",
            formats: {
                D: "%m/%d/%y",
                F: "%Y-%m-%d",
                R: "%H:%M",
                T: "%H:%M:%S",
                X: "%T",
                c: "%a %b %d %X %Y",
                r: "%I:%M:%S %p",
                v: "%e-%b-%Y",
                x: "%D"
            }
        },
            l = new e(k, 0, !1),
            m = "undefined" != typeof module;
        m ? (j = module.exports = c, j.strftime = d) : (j = function () {
            return this || (0, eval)("this")
        }(), j.strftime = c);
        var n = m ? "require('strftime')" : "strftime",
            o = {};
        j.strftimeTZ = function (b, c, d, e) {
            return "number" != typeof d && "string" != typeof d || null != e || (e = d, d = void 0), d ? a("`" + n + ".strftimeTZ(format, date, locale, tz)`", "var s = " + n + ".localize(locale).timezone(tz); s(format, [date])` or `var s = " + n + ".localize(locale); s.timezone(tz)(format, [date])") : a("`" + n + ".strftimeTZ(format, date, tz)`", "var s = " + n + ".timezone(tz); s(format, [date])` or `" + n + ".timezone(tz)(format, [date])"), (d ? l.localize(d) : l).timezone(e)(b, c)
        }, j.strftimeUTC = function (b, c, d) {
            return d ? a("`" + n + ".strftimeUTC(format, date, locale)`", "var s = " + n + ".localize(locale).utc(); s(format, [date])") : a("`" + n + ".strftimeUTC(format, [date])`", "var s = " + n + ".utc(); s(format, [date])"), (d ? p.localize(d) : p)(b, c)
        }, j.localizedStrftime = function (b) {
            return a("`" + n + ".localizedStrftime(locale)`", n + ".localize(locale)"), l.localize(b)
        }, b(c), b(d);
        var p = l.utc();
        "function" != typeof Date.now && (Date.now = function () {
            return +new Date
        })
    }(), $.when($.ready).then(function () {
        function a() {
            c.fadeOut(function () {
                d.addClass("full-screen"), c.fadeIn().css("overflow", "hidden"), e.addClass("full-screen")
            })
        }

        function b() {
            c.fadeOut(function () {
                d.removeClass("full-screen"), c.fadeIn().css("overflow", "visible"), e.removeClass("full-screen")
            })
        }
        var c = $("body"),
            d = $("#song-lyric"),
            e = $("#tool-box");
        e.click(function (a) {
            ($(this).is(a.target) || "tool-maximize" == a.target.id) && $(this).hasClass("minimize") && $(this).removeClass("minimize")
        }), $("#full-screen-btn").click(function () {
            a()
        }), $("#tool-box-fullscreen-close").click(function () {
            b()
        }), $("#tool-box-fullscreen-minimize").click(function () {
            e.addClass("minimize")
        })
    }), $.when($.ready).then(function () {
        var a = $("#other-videos").find(".video-thumb-small"),
            b = $("#display-video");
        a.click(function () {
            var c = $(this).data();
            b.fadeOut(function () {
                b.find(".video-item").attr("title", c.title), b.find(".video-item").attr("href", c.link), b.find(".video-title").text(c.title), b.find(".video-thumb").css("background-image", "url(" + c.img + ")"), b.find(".video-length").text(toHHMMSS(c.length)), b.fadeIn()
            }), a.addClass("blur"), $(this).removeClass("blur")
        }), $(a[0]).click()
    }), $.when($.ready).then(function () {
        var a = $("#song-info").data("song-id"),
            b = $("#version-list").data("value"),
            c = $("#version-list").data("contribute-id");
        ContextPopup.setPopup($("#song-action-add"), "$playlistPop", "partial/song_partial/add_to_playlist/" + $("#song-info").data("song-id"), function () {
            initPlaylistPopup()
        }), $("#song-action-share").click(function () {
            Popup.openPartial("partial/song_partial/share_link", initSharePopup, null)
        }), ContextPopup.setPopup($("#display-rhythm"), "$rhythmPop", "partial/song_partial/rhythm_vote/" + a, function () {
            initRhythmPopup(ContextPopup._pops.$rhythmPop)
        }), $("#song-action-report").click(function () {
            Popup.openPartial("partial/report_partial/report_song/" + a)
        }), $(".song-action-contribute").click(function () {
            Popup.openPartial("partial/song_partial/contribute_song/" + a + "/" + b)
        }), $(".song-action-my-version").click(function () {
            Popup.openPartial("partial/song_partial/contribute_song/" + a + "/" + window.__USER.username)
        }), $(".song-action-submit-version").click(function () {
            Popup.openPartial("partial/song_partial/submit_version/" + c)
        })
    }), $.when($.ready).then(function () {
        setTimeout(function () {
            var a, b = $("#chord-view");
            b.draggable(), b.find("#closebutton").click(function () {
                b.fadeOut()
            }), $("#song-lyric").click(function () {
                b.fadeOut()
            }), $("body").on("mouseover touchstart", "span.hopamchuan_chord", function () {
                var c = $(this);
                clearTimeout(a), a = setTimeout(function () {
                    var a = c.offset(),
                        d = b.find(".draw-chord");
                    d.html("<p>...</p>"), b.css({
                        position: "absolute",
                        top: a.top - 180 + "px",
                        left: a.left - 70 + "px"
                    }).show(), d.attr("data-value", c.html()), ChordJS.render(d[0], c.html(), void 0, window.instrument)
                }, 300)
            }).on("mouseleave", "span.hopamchuan_chord", function () {
                clearTimeout(a)
            })
        }, 1e3)
    });
var $favoriteNote;
$.when($.ready).then(function () {
    $favoriteNote = $("#song-favorite-note"), $favoriteNote.length && loadFavoriteNote()
});
var $favoriteNotePopup;
$.when($.ready).then(function () {
    var a = $("#song-favorite-btn");
    a.click(function (a) {
        var b = "",
            c = $(this);
        b = c.hasClass("starred") ? "remove" : "add", Song.toggleFavorite($("#song-info").data("song-id"), $("#song-info").data("contribute-id"), b).done(function () {
            var a = $("#song-favorite-count"); + a.html();
            "add" == b ? (c.addClass("starred"), $favoriteNotePopup.show()) : (c.removeClass("starred"), $favoriteNotePopup.hide(), $("#song-favorite-note").hide())
        })
    }), $favoriteNotePopup = ContextPopup.setPopup(a, "$favoriteNote", "partial/song_partial/favorite_note/" + $("#song-info").data("song-id") + "/" + $("#song-info").data("contribute-id"), function () {
        initFavoriteNote()
    })
}), $.when($.ready).then(function () {
    function a() {
        var a = $("#song-lyric .pre").clone().addClass("inline");
        $("body").append(a);
        var b = Math.max.apply(Math, a.find(".chord_lyric_line").map(function (a, b) {
            return $(b).css("float", "left").width()
        }));
        return a.remove(), b
    }

    function b() {
        $("body").hasClass("mobile-layout") || (clearTimeout(o), o = setTimeout(function () {
            return c()
        }, 100))
    }

    function c() {
        if ($("#all-chord-list").css("visibility", "visible"), !x.hasClass("manually-clicked")) {
            var b = $("#song-lyric .pre"),
                c = 20,
                d = $(".chord_lyric_line").last()[0].getBoundingClientRect(),
                e = $("#song-lyric")[0].getBoundingClientRect(),
                f = void 0,
                g = void 0;
            b.hasClass("short-lyric") ? (g = (e.width - d.width) / 2, f = e.height - 2 * c) : e.top + e.height - d.top - d.height > 200 ? (f = e.top + e.height - (d.top + d.height) - 2 * c, g = d.width - c) : e.left + e.width - d.width < 100 && (g = d.width - a() - 4 * c, f = e.height - 2 * c);
            var h = x,
                i = function () {
                    var a = b[0],
                        c = g * f > 9e4 && g > 100 && f > 100,
                        d = a.scrollWidth > a.clientWidth,
                        e = b.length > 1;
                    return c && !d && !e
                };
            i() ? (h.removeClass("chord-list-hide"), h.css({
                top: "auto",
                width: g,
                height: f,
                position: "absolute",
                bottom: c,
                right: 0
            })) : (h.addClass("chord-list-hide"), h.removeAttr("style")), refreshDisplayingChords();
            var j = $("#chord-list-content"),
                k = 1;
            for (j.find(".chordcontainer").css({
                zoom: k
            }), refreshDisplayingChordsExecute(); h.height() > 50 && h.height() - j.height() < 3 * c && k > r;) k -= .05, j.find(".chordcontainer").css({
                zoom: k
            })
        }
    }

    function d() {
        if ($("body").hasClass("mobile-layout")) return void $("#tool-box-size-adj").val(q);
        var b = $("#song-lyric .pre"),
            c = $(window).height(),
            d = b.height();
        if (c - 200 >= d) {
            var g = a() + 100;
            return $("#song-lyric").css({
                display: "flex",
                alignItems: "center",
                paddingRight: ($("#song-lyric")[0].getBoundingClientRect().width - g) / 2
            }), b.css({
                margin: "0 auto"
            }).addClass("short-lyric"), c / 2 > d && (f(p), $("#tool-box-size-adj").val(p)), void $("#all-chord-list").addClass("short-lyric")
        }
        $("#song-lyric .pre").height($(window).height() - 100), e($("#tool-box-column-toggle"), !0), j(!1);
        var h = $("#song-lyric .pre")[0];
        h.scrollWidth > h.clientWidth && j(!0)
    }

    function e(a, b) {
        b ? a.addClass("on") : a.removeClass("on"), a.find("i").removeClass("fa-square-o").removeClass("fa-check-square-o"), a.hasClass("on") ? a.find("i").addClass("fa-check-square-o") : a.find("i").addClass("fa-square-o")
    }

    function f(a) {
        w.find(".pre").css({
            "font-size": a + "px",
            "line-height": 3.3 * a + "px"
        }), b()
    }

    function g() {
        var a = w.scrollTop();
        w.scrollTop(a + 1), a > w.find(".pre").height() + 2 * A && w.scrollTop(0)
    }

    function h(a) {
        C = !1, !a && $("#tool-box-column-toggle").hasClass("on") && $("#tool-box-column-toggle").click(), w.height("auto"), w.find(".pre").removeClass("repeat-mode"), w.find(".repeated-lyric").remove(), w.scrollTop(0), clearTimeout(z)
    }

    function i() {
        w.find(".lyric-page-divider").remove();
        var a = w.find(".pre");
        if (a.length > 1)
            for (var b = 1; b < a.length; b++) w.find(".pre:first-child").append(a[b].innerHTML), $(a[b]).remove();
        w.addClass("no-column"), $("#song-lyric .pre").height("auto")
    }

    function j(a) {
        f(v), w.removeClass("no-column"), $("#song-lyric .pre").height($(window).height() - 100);
        var b = $("#song-lyric .pre")[0];
        if (b.scrollWidth > b.clientWidth && (e($("#tool-box-easy-toggle"), !0), simplifyAllChords(!0)), b.scrollWidth > b.clientWidth) {
            var c = v;
            for (f(c); c > t && b.scrollWidth > b.clientWidth;) f(c - 1), c -= 1
        }
        if (a && b.scrollWidth > b.clientWidth) {
            var d = w[0].getBoundingClientRect(),
                g = $(window).width() / 2,
                h = void 0,
                i = $(".chord_lyric_line"),
                j = 1;
            do {
                h = w.find(".pre:first-child").clone().html("");
                for (var k = !1, l = 0; l < i.length; l++) {
                    var m = i.get(l).getBoundingClientRect();
                    m.left > g && m.left + m.width > d.left + d.width && (k = !0), k === !0 && h.append(i.get(l))
                }
                h.find(".chord_lyric_line").length > 0 && (j++ , w.append('<div class="lyric-page-divider">' + lang("page") + " " + j + '<span class="total-page"></span></div>'), w.append(h), i = h.find(".chord_lyric_line"))
            } while (h.find(".chord_lyric_line").length > 0);
            i[0].getBoundingClientRect().width === d.width && w.find(".pre:last-child").height("auto"), w.prepend('<div class="lyric-page-divider">' + lang("page") + ' 1<span class="total-page"> / ' + j + "</span></div>"), $(".total-page").text(" / " + j)
        }
    }

    function k() {
        window.__LOGGED_IN ? "undefined" != typeof songSetting && (settings = songSetting) : settings = JSON.parse(localStorage.getItem("song" + $("#song-info").data("song-id"))), settings && l()
    }

    function l() {
        settings.transpose && (changeAllChord(-currentAmount + +settings.transpose), y.val(settings.transpose))
    }

    function m() {
        $("body").hasClass("mobile-layout") && $("#song-mobile-right-menu, #song-mobile-left-menu").click(function (a) {
            a.target.id === $(this)[0].id && $(this).toggleClass("box-open")
        })
    }

    function n() {
        if (!window.__IS_MOBILE) {
            var a, b = function (a) {
                var b = $("#auto-scroll-countdown");
                b.length && b.text(d - a + 1)
            },
                c = function () {
                    $("#scroll-notice").removeClass("show")
                },
                d = 30,
                e = 10,
                f = 10,
                g = -10,
                h = 0,
                i = !1,
                j = !0,
                k = $('<div id="scroll-notice">' + lang("auto.scroll.after.x.sec") + "</div>");
            $("body").append(k);
            var l = function (a) {
                k.hasClass("show") || (h = 0)
            },
                m = function () {
                    h = 0, c(), i && ($("html, body").stop(), i = !1, c())
                },
                n = $("#view-song").offset().top;
            window.addEventListener("focus", function () {
                return j = !0
            }, !1), window.addEventListener("blur", function () {
                return j = !1
            }, !1), document.addEventListener("mousemove", l, !1), document.addEventListener("mousewheel", m, !1), document.addEventListener("keydown", l, !1), document.addEventListener("visibilitychange", m, !1), $("#off-auto-scroll").click(function () {
                document.removeEventListener("mousemove", l, !1), document.removeEventListener("mousewheel", m, !1), document.removeEventListener("visibilitychange", m, !1), document.removeEventListener("keydown", l, !1), clearTimeout(a), c()
            }), a = setInterval(function () {
                b(h), j && h > d - e && $(window).scrollTop() - n < g && !k.hasClass("show") && (b(h), setTimeout(function () {
                    return k.addClass("show")
                }, 100)), h > d && (j && $(window).scrollTop() - n < g && (i = !0, $("html, body").animate({
                    scrollTop: $("#view-song").offset().top
                }, 1e3 * f, "swing", function () {
                    i = !1
                })), h = 0, c()), h++
            }, 1e3)
        }
    }
    var o, p = 18,
        q = 13,
        r = 1,
        s = 10,
        t = 12,
        u = 60,
        v = 15,
        w = $("#song-lyric"),
        x = $("#all-chord-list");
    w.html();
    $(".tool-box-toggle-item").click(function () {
        e($(this), !$(this).hasClass("on"))
    });
    var y = $("#tool-box-trans-adj");
    y.change(function () {
        changeAllChord(-currentAmount + +y.val()), saveSongSetting()
    }), $("#tool-box-trans-up").click(function () {
        changeAllChord(1), y.val(currentAmount), saveSongSetting()
    }), $("#tool-box-trans-down").click(function () {
        changeAllChord(-1), y.val(currentAmount), saveSongSetting()
    }), $("#tool-box-easy-toggle").click(function () {
        simplifyAllChords($(this).hasClass("on")), saveSongSetting(), fixChordPositions(), b()
    }), $("#tool-box-size-up").click(function () {
        var a = +w.find(".pre").css("font-size").replace("px", "");
        u > a && (a++ , $("#tool-box-size-adj").val(a), f(a))
    }), $("#tool-box-size-down").click(function () {
        var a = +w.find(".pre").css("font-size").replace("px", "");
        a > s && (a-- , $("#tool-box-size-adj").val(a), f(a))
    }), $("#tool-box-size-adj").change(function () {
        var a = $(this).val();
        f(a)
    }).val(v);
    var z, A = 200,
        B = 0,
        C = !1,
        D = function () {
            return 20 * (11 - Math.sqrt(10 * B))
        };
    $("#tool-box-scroll-adj").change(function () {
        if (B = +$(this).val(), C && (clearTimeout(z), z = setInterval(g, D())), B > 0) {
            if (C) return;
            C = !0, $("#song-lyric").height($(window).height() - 100);
            var a = w.find(".pre"),
                c = a.clone().addClass("repeated-lyric");
            w.height(w.height()), w.append(c), w.find(".pre").addClass("repeat-mode").attr("data-content", lang("song.tool.scroll.repeat")), z = setInterval(g, D()), window.scroller = z, $("#tool-box-column-toggle").hasClass("on") ? $("#tool-box-column-toggle").click() : b()
        } else {
            if (!C) return;
            $("#song-lyric .pre").height("auto"), h(), b()
        }
    }).change(), $("#tool-box-column-toggle").click(function () {
        $(this).hasClass("on") ? (j(!0), C && ($("#tool-box-scroll-adj").val(0), h(!0))) : i(), b()
    }), $("#set-as-default").click(function () {
        confirm(lang("are.you.sure.set.contribute.default")) && AjaxFactory.post("ajax/ajax_song/set_as_default", {
            song_id: $("#song-info").data("song-id"),
            contribute_id: $("#song-info").data("contribute-id")
        }).done(function (a) {
            location.href = a.data.new_link
        }).fail(function (a) {
            $.growl.error({
                title: "",
                message: a.error
            })
        })
    }), $("#edit-song-info").click(function () {
        Popup.openPartial("partial/song_partial/edit_song/" + $("#song-info").data("songId"))
    }), $("#edit-version-info").click(function () {
        Popup.openPartial("partial/song_partial/contribute_song/" + $("#song-info").data("songId") + "/" + $("#version-list").data("value") + "/" + window.__USER.username)
    }), $("#chord-list-title").click(function () {
        x.toggleClass("chord-list-hide"), x.hasClass("manually-clicked") || x.addClass("manually-clicked"), x.hasClass("chord-list-hide") ? x.removeAttr("style") : (b(), x.css({
            width: "auto",
            height: "auto"
        })), refreshDisplayingChords()
    }), $(".select-instrument-ukulele").click(function () {
        window.instrument = "ukulele", refreshDisplayingChords()
    }), $(".select-instrument-guitar").click(function () {
        window.instrument = "guitar", refreshDisplayingChords()
    }), $("#tool-box-item-easy-chord").change(function () {
        var a = $(this).is(":checked");
        a ? $(".hopamchuan_chord").each(function (a, b) {
            $(this).data("original-chord", b.innerText.trim()), $(this).html(simplifyChord($(this).text())), refreshDisplayingChords()
        }) : $(".hopamchuan_chord").each(function (a, b) {
            $(this).html($(this).data("original-chord") || $(this).html()), refreshDisplayingChords()
        }), a ? $(".draw-chord").each(function (a, b) {
            var c = $(this).attr("data-value");
            $(this).attr("data-original-chord", c), $(this).attr("data-value", simplifyChord(c)), ChordJS.render($(this)[0], simplifyChord(c), void 0, window.instrument)
        }) : $(".draw-chord").each(function (a, b) {
            var c = $(this).attr("data-original-chord");
            $(this).attr("data-value", c), ChordJS.render($(this)[0], c, void 0, window.intrument)
        })
    }), window.resetToolbox = function () {
        initTranspose(), e($("#tool-box-easy-toggle"), !1), $("#tool-box-size-adj").val(v), f(v), B = 0, $("#tool-box-scroll-adj").val(B), h(), i(), e($("#tool-box-column-toggle"), !1)
    }, k(), d(), fixChordPositions(), b(), m(), n()
});
var ratingControl, timer, contributeRatingCallback = function (a, b) {
    AjaxFactory.post("ajax/ajax_song/rate_version", {
        contributeId: $("#song-info").data("contribute-id"),
        score: b
    }).done(function (a) {
        var b = JSON.parse(a.data._votes);
        $.growl.notice({
            title: "",
            message: lang("vote.contribute.success")
        }), $(".contribute-rate-desc").html(lang("x.person.rated", [b ? b.total : 0]))
    }).fail(function (b) {
        $.growl.error({
            title: "",
            message: b.error
        }), ratingControl.setRating(a, !1), b.code == AjaxFactory.code.UNAUTHENTICATED && Login.doLogin()
    })
};
$.when($.ready).then(function () {
    $("#contribute-rating-control").tipsy({
        gravity: "s"
    }), $("#contribute-rating-control").html("");
    var a = $("#contribute-rating-control").data("stars");
    ratingControl = rating($("#contribute-rating-control")[0], a, 5, contributeRatingCallback.bind(contributeRatingCallback, a));
    var b = $("#footer-rating");
    b.length && ($("#footer-rating-control").html(""), rating($("#footer-rating-control")[0], 0, 5, function (a) {
        AjaxFactory.post("ajax/ajax_song/rate_version", {
            contributeId: $("#song-info").data("contribute-id"),
            score: a
        }).done(function (a) {
            var c = (JSON.parse(a.data._votes), a.data.thank_you);
            b.find(".vote-success").html(c), b.addClass("done")
        }).fail(function (a) {
            $.growl.error({
                title: "",
                message: a.error
            })
        })
    })), window.__IS_MOBILE ? ($(".other-versions-close-btn").click(function () {
        $("#other-versions").removeClass("show"), $("#page-content").css("position", "relative"), $("body").css("overflow", "inherit")
    }), $(".version-hover").click(function () {
        $("#page-content").css("position", "static"), $("#other-versions").addClass("show"), $("body").css("overflow", "hidden")
    })) : ($("#other-versions").scrollGuard(), $(".version-hover").mouseenter(function () {
        clearTimeout(timer), timer = setTimeout(function () {
            $("#version-list").addClass("open")
        }, 300)
    }), $("#version-list").mouseleave(function () {
        clearTimeout(timer), timer = setTimeout(function () {
            $("#version-list").removeClass("open")
        }, 300)
    }))
}), $.when($.ready).then(function () {
    _deferredFb.then(function () {
        FB.Event.subscribe("comment.create", function (a) {
            FB.api("/" + a.commentID, {
                access_token: "340262766106755|THGUhrPIwvWzY4-_JqsJbPGjGtY"
            }, function (a) {
                var b = window.location.href,
                    c = a.message,
                    d = a.from.name;
                AjaxFactory.post("/ajax/ajax_comment/facebook_comment", {
                    link: b,
                    parent_id: 0,
                    comment_content: c,
                    fb_name: d,
                    title: document.title,
                    song_id: $("#song-info").data("song-id")
                })
            })
        })
    })
});
var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
iOS && $.when($.ready).then(function () {
    $("#tool-box select").on("focus", function () {
        var a = $(window).scrollTop();
        setTimeout(function () {
            return $(window).scrollTop(a)
        }, 50)
    })
}), $.when($.ready).then(function () {
    setTimeout(function () {
        AjaxFactory.post("/ajax/ajax_bi/view_song", {
            song_id: $("#song-info").data("song-id"),
            query: location.search.replace(/^\?/, "")
        })
    }, 1e3)
});
var globalDiscussionId = 0,
    commentSectionLoaded = !1,
    loadCommentSection = function () {
        commentSectionLoaded || (commentSectionLoaded = !0, setTimeout(function () {
            $("#hac-comment").html("<iframe id='song-comment-frame' onload='resizeIframe(this);' src='/discussion/view/" + globalDiscussionId + "'></iframe>")
        }, 100), $("#song-comment-frame").on("load", function () {
            window.__LOGGED_IN || 0 !== window.__HAC_COMMENT_COUNT || $(".comment-title[data-cs=fb]").click()
        }))
    };
$.when($.ready).then(function () {
    var a = $(".comment-title"),
        b = $("#fb-comment-box");
    a.click(function () {
        a.removeClass("selected"), $(this).addClass("selected");
        var c = $(this).data("cs");
        $(".comment-system").hide(), $("#" + c + "-comment").show(), "fb" == c && (b.hasClass("initiated") || (_deferredFb.then(function () {
            FB.Event.subscribe("xfbml.render", function (a) {
                $("#fb-comment-content").removeClass("loading-background"), b.addClass("initiated")
            })
        }), $("#fb-comment-content").html(b.html()), _deferredFb.then(function () {
            FB.XFBML.parse()
        })))
    });
    var c = $("#hac-comment");
    if (c.length) {
        var d = c.offset().top,
            e = $(window).height(),
            f = function () {
                var a = getScrollTop() - (d - e);
                a > 0 && ($("body").off("scroll", f), loadCommentSection())
            };
        globalDiscussionId = c.data("discussion-id") || "", c.data("without-scroll") && !window.__IS_MOBILE ? loadCommentSection() : ($(window).on("scroll", f), f())
    }
}), window.RealtimeComment = {}, RealtimeComment.commmentEmitter = new EventEmitter, ioPromise.then(function (a) {
    a.on("show_comment", function (a) {
        RealtimeComment.commmentEmitter.emit("get_comment", a)
    })
}), RealtimeComment.register = function (a) {
    return ioPromise.then(function (b) {
        b.on("connect", function () {
            a.socketId = b.id, b.emit("listen_comment", a)
        })
    }), RealtimeComment.commmentEmitter
};