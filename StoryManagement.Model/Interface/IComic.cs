using BaseRepo.Interfaces;
using StoryManagement.Model.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Interface
{
    public interface IComic : IRepository<Comic>
    {
        List<Story_Comic> GetEpisode(int pageIndex, int pageSize, string search, int Id, ref int Total);
        int CreateOrUpdate(Story_Comic story_Comic);
        int DeleteEpisode(int id, ref int idStory);
        public int CRUDComicImage(long id, string name, byte[] img, string physicPath, int order, string operation, ref string ImgOld);
        public List<Comic> GetListImages(int Id, ref int Total);
    }
}
