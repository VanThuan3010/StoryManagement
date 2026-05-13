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
        List<Story> GetAll(int pageIndex, int pageSize, string search, string status, ref int Total);
        int CreateOrUpdate(Story storyModel, string tagId, string subTagId, string authorId);
        int DeleteStory(int id);
        Story GetDetail(int id);
        List<Story> GetStoryCanRead();
        List<Story> GetStoryNewest();
        List<Story> GetStoryLastUpdate();
        List<Authors> SearhAuthor(string searchStr, string selectedId);
        int ReadChangeStory(int id, long idChapter);
        List<Story> GetStoryByAuthor(int id);
        List<Story> GetStorySearchInAuthor(string search, string idSelected);
    }
}
