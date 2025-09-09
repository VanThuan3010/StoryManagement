using BaseRepo.Interfaces;
using StoryManagement.Model.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Interface
{
    public interface IPart_Chapter : IRepository<Part_Chapter>
    {
        List<Part_Chapter> GetAll(int idStory, ref int ChapterCount);
        int CreateOrUpdatePart(int idStory,int idPart, string name, ref int  NewId, ref string  NewPartName);
    }
}
