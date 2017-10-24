﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models.HomeViewModels
{
    public class MainContentViewModel : PageListItemTemplate
    {
        public List<SimpleSongViewModel> ListNewSong { get; set; }
        public List<SimpleSongViewModel> ListPupularSong { get; set; }
        public List<SimpleStyleViewModel> ListStyle { get; set; }
        public List<BestSimpleSongViewModel> ListTopSong { get; set; }
        public List<SimpleAlbumViewModel> ListTopAlbum { get; set; }
    }

    public class SimpleStyleViewModel
    {
        public string Name { get; set; }
        public string Slug { get; set; }
    }
    public class BestSimpleSongViewModel
    {
        public string Name { get; set; }
        public string Slug { get; set; }
        public int Views { get; set; }
        public string Version { get; set; }
    }

    public class SimpleAlbumViewModel
    {
        public string Name { get; set; }
        public string Slug { get; set; }
    }

    public class SimpleSongViewModel
    {
        public string Name { get; set; }
        public string OrtherName { get; set; }
        public AuthorSong AuthorSong { get; set; }
        public Album Album { get; set; }
        public int View { get; set; }
        public string Lyric { get; set; }
        public string Slug { get; set; }
        public string VersionSlug { get; set; }
    }
}
