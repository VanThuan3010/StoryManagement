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
        List<My_Compose> GetAll();
        My_Compose GetDetail(int id);
        int Delete(int id);
        int CreateOrUpdate(My_Compose my_Compose);
    }
}
