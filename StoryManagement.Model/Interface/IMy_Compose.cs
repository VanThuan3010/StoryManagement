using BaseRepo.Interfaces;
using StoryManagement.Model.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Interface
{
    public interface IMy_Compose : IRepository<My_Compose>
    {
        List<My_Compose> GetAll(int Id, string act, string name, string cnt, int parentId);
    }
}
