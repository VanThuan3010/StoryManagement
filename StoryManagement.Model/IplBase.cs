
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

        private IAuthors _authorRespository;
        private IChapters _chapterRespository;
        private IComic _comicRespository;
        private IGroupTag _groupTagRespository;
        private IPart_Chapter _partRespository ;
        private IPseu _pseuRespository;
        private IReviews _reviewRespository;
        private IScene _sceneRespository;
        private ISeri_Story _seriStoryRespository;
        private ISeries _seriesRespository;
        private IStory _storyRespository;
        private IStory_Comic _storyComicRespository;
        private ISub_Tag _subTagRespository;
        private ITag _tagRespository;
        private ITbl_Relationship _relationshipRespository;

        public IConfiguration _Configuration ;

        public IplBase(StoryContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _Configuration = configuration;
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
        public IComic comicRespository
        {
            get
            {
                return _comicRespository ?? (_comicRespository = new IplComic(_dbContext, _Configuration));
            }
        }
        public IGroupTag groupTagRespository
        {
            get
            {
                return _groupTagRespository ?? (_groupTagRespository = new IplGroupTag(_dbContext, _Configuration));
            }
        }
        public IPart_Chapter part_ChapterRespository
        {
            get
            {
                return _partRespository ?? (_partRespository = new IplPart_Chapter(_dbContext, _Configuration));
            }
        }
        public IPseu pseuRespository
        {
            get
            {
                return _pseuRespository ?? (_pseuRespository = new IplPseu(_dbContext, _Configuration));
            }
        }
        public IReviews reviewRespository
        {
            get
            {
                return _reviewRespository ?? (_reviewRespository = new IplReview(_dbContext, _Configuration));
            }
        }
        public IScene sceneRespository
        {
            get
            {
                return _sceneRespository ?? (_sceneRespository = new IplScene(_dbContext, _Configuration));
            }
        }
        public ISeri_Story seri_StoryRespository
        {
            get
            {
                return _seriStoryRespository ?? (_seriStoryRespository = new IplSeri_Story(_dbContext, _Configuration));
            }
        }
        public ISeries seriesRespository
        {
            get
            {
                return _seriesRespository ?? (_seriesRespository = new IplSeries(_dbContext, _Configuration));
            }
        }
        public IStory storyRespository
        {
            get
            {
                return _storyRespository ?? (_storyRespository = new IplStory(_dbContext, _Configuration));
            }
        }
        public IStory_Comic storyComicRepository
        {
            get
            {
                return _storyComicRespository ?? (_storyComicRespository = new IplStory_Comic(_dbContext, _Configuration));
            }
        }
        public ISub_Tag sub_TagRespository
        {
            get
            {
                return _subTagRespository ?? (_subTagRespository = new IplSub_Tag(_dbContext, _Configuration));
            }
        }
        public ITag tagRespository
        {
            get
            {
                return _tagRespository ?? (_tagRespository = new IplTag(_dbContext, _Configuration));
            }
        }
        public ITbl_Relationship relationshipRespository
        {
            get
            {
                return _relationshipRespository ?? (_relationshipRespository = new IplTbl_Relationship(_dbContext, _Configuration));
            }
        }
        public void Commit()
        {
            _dbContext.SaveChanges();
        }
    }
}
