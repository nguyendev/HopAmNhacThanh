using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.APIManager
{
    public static class GlobalAPI
    {
        public const string CATEGORY_ROOT = "api/Category";
        public const string ALBUM_ROOT = "api/Album";
        public const string SONG_ROOT = "api/Song";
        public const string AUDIO_ROOT = "api/Audio";
        public const string SHEET_ROOT = "api/Sheet";
        public const string HOME_ROOT = "api/Home";
        public const string SEARCH_ROOT = "api/Search";
        public const string AUTHOR_SONG_ROOT = "api/AuthorSong";
        public const string SEARCH_ADVANCED_ROOT = "api/SearchAdvanced";
        public const string SEARCH_ADVANCED_GET_SINGLE = "getSingle&apiKey={api_key}&url={url}";
        public const string GET_SINGLE_WITH_SLUG_VERSION = "getSingle&apiKey={api_key}&slug={slug}&slugVersion={slugVersion}";

        public const string GET_LIST = "getList&apiKey={api_key}";
        public const string S_GET_LIST_NEWS = "getListNews&apiKey={api_key}";
        public const string S_GET_LIST_POPULARS = "getListPopulars&apiKey={api_key}";
        public const string S_GET_SINGLE = "getSingle&apiKey={api_key}&slug={slug}&slugVersion={slugVersion}";
        public const string GET_LIST_WITH_SLUG = "getList&apiKey={api_key}&slug={slug}";
        public const string GET_SINGLE = "getSingle&apiKey={api_key}&slug={slug}";
        public const string GET_SEARCH_WITH_SLUG = "getSearch&apiKey={api_key}&searchString={searchString}&slug={slug}";
        public const string GET_SEARCH = "getSearch&apiKey={api_key}&searchString={searchString}";
    }
}
