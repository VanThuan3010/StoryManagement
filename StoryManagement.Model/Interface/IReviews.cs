using BaseRepo.Interfaces;
using StoryManagement.Model.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Interface
{
    public interface IReviews : IRepository<Reviews>
    {
        int CreateOrUpdate(Reviews reviews);
        Reviews GetStoryReview(int id);
    }
}
