using BaseRepo.Repositories;
using Dapper;
using MFTech.Model.Entity;
using Microsoft.Extensions.Configuration;
using StoryManagement.Model.Entity;
using StoryManagement.Model.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Implement
{
    public class IplReview : Repository<Reviews>, IReviews
    {
        public IConfiguration _configuration { get; }
        internal string _cnnString;
        public StoryContext _context;
        public IplReview(StoryContext context, IConfiguration configuration) : base(context)
        {
            _context = context;
            _configuration = configuration;
            _cnnString = _configuration.GetConnectionString("DefaultConnection");
        }
        public int CreateOrUpdate(Reviews reviews)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            int list = 0;
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();
                    p.Add("@idStory", reviews.IdStory);
                    p.Add("@review", reviews.Review);

                    list = u.ProcedureExecute("CreateOrUpdate_Review", p);
                }
                return list;
            }
            catch (Exception ex)
            {
                return list;
            }

        }
        public Reviews GetStoryReview(int id)
        {
            Reviews List = new Reviews();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();

                    p.Add("@idStory", id);
                    List = u.GetIEnumerable<Reviews>("Get_Review", p).SingleOrDefault();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
    }
}
