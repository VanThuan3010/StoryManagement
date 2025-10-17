using BaseRepo.Interfaces;
using StoryManagement.Model.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Interface
{
    public interface ISeries : IRepository<Series>
    {
        List<Series> GetAll(int pageIndex, int pageSize, string search, ref int Total);
        List<Story> SearchStory(string search, string idSelected);
        List<Story> GetStory(int Id);
        int SaveSeries(Series series, string lstStory);
    }
}
