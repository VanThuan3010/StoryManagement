using BaseRepo.Repositories;
using Dapper;
using MFTech.Model.Entity;
using Microsoft.Extensions.Configuration;
using StoryManagement.Model.Entity;
using StoryManagement.Model.Interface;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Implement
{
    public class IplSeries : Repository<Series>, ISeries
    {
        public IConfiguration _configuration { get; }
        internal string _cnnString;
        public StoryContext _context;
        public IplSeries(StoryContext context, IConfiguration configuration) : base(context)
        {
            _context = context;
            _configuration = configuration;
            _cnnString = _configuration.GetConnectionString("DefaultConnection");
        }
        public List<Series> GetAll(int pageIndex, int pageSize, string search, ref int Total)
        {
            List<Series> List = new List<Series>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();

                    p.Add("@pageIndex", pageIndex);
                    p.Add("@pageSize", pageSize);
                    p.Add("@search", search);
                    p.Add("@totalRow", Total, DbType.Int32, ParameterDirection.Output);
                    List = u.GetIEnumerable<Series>("Get_Series", p).ToList();
                    Total = p.Get<int>("@totalRow");
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public List<Story> SearchStory(string search, string idSelected)
        {
            List<Story> List = new List<Story>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();

                    p.Add("@search", search);
                    p.Add("@idSelected", idSelected);
                    List = u.GetIEnumerable<Story>("Get_SearchStoryForSeries", p).ToList();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public List<Story> GetStory(int Id)
        {
            List<Story> List = new List<Story>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();

                    p.Add("@idSeries", Id);
                    List = u.GetIEnumerable<Story>("Get_StoryForSeries", p).ToList();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public int SaveSeries(Series series, string lstStory)
        {
            int list = 0;
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();

                    p.Add("@id", series.Id);
                    p.Add("@name", series.SeriesName);
                    p.Add("@lstStory", lstStory);
                    list = u.ProcedureExecute("CreateOrUpdate_Series", p);
                }
            }
            catch (Exception ex)
            {
                return list;
            }
            return list;
        }
    }
}
