using BaseRepo.Interfaces;
using Microsoft.EntityFrameworkCore.Migrations;
using StoryManagement.Model.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Interface
{
    public interface IStory : IRepository<Story>
    {
        List<Story> GetAll(int pageIndex, int pageSize, string search, string tags, string authors, ref int Total);
        int CreateOrUpdate(Story storyModel);
        int DeleteStory(int id);
        Story GetDetail(int id);
    }
}
