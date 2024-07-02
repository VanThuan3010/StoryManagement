using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using StoryManagement.Model.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model
{
    public interface IBase
    {
        IStory storyRespository { get; }
        IAuthors authorRespository { get; }
        IChapters chapterRespository { get; }
        IReviews reviewRespository { get; }
        ISeries seriesRespository { get; }
        IStory_Author storyAuthorRespository { get; }
        IStory_Tag storyTagRespository { get; }
        ITag tagRespository { get; }


        void Commit();
    }
}
