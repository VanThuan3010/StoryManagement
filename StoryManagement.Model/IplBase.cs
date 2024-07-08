
using MFTech.Model.Entity;
using Microsoft.Extensions.Configuration;
using StoryManagement.Model.Implement;
using StoryManagement.Model.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model
{
    public class IplBase : IBase
    {
        private StoryContext _dbContext;

        private IStory _storyRespository;
        private IAuthors _authorRespository;
        private IChapters _chapterRespository;
        private IReviews _reviewRespository ;
        private ISeries _seriesRespository ;
        private ITag _tagRespository ;

        public IConfiguration _Configuration ;

        public IplBase(StoryContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _Configuration = configuration;
        }

        public IStory storyRespository
        {
            get
            {
                return _storyRespository ?? (_storyRespository = new IplStory(_dbContext, _Configuration));
            }
        }

        public IAuthors authorRespository
        {
            get
            {
                return _authorRespository ?? (_authorRespository = new IplAuthor(_dbContext, _Configuration));
            }
        }
        public IChapters chapterRespository
        {
            get
            {
                return _chapterRespository ?? (_chapterRespository = new IplChapter(_dbContext, _Configuration));
            }
        }
        public IReviews reviewRespository
        {
            get
            {
                return _reviewRespository ?? (_reviewRespository = new IplReview(_dbContext, _Configuration));
            }
        }
        public ISeries seriesRespository
        {
            get
            {
                return _seriesRespository ?? (_seriesRespository = new IplSeries(_dbContext, _Configuration));
            }
        }
        public ITag tagRespository
        {
            get
            {
                return _tagRespository ?? (_tagRespository = new IplTag(_dbContext, _Configuration));
            }
        }
        public void Commit()
        {
            _dbContext.SaveChanges();
        }
    }
}
