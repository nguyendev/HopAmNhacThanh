using HopAmNhacThanh.Models.SidebarViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Data.SidebarRepository
{
    public interface ISidebarRepository
    {
        Task<CommonSidebarViewModel> GetSidebarCommon();
    }
}
