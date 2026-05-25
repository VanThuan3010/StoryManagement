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
        IAuthors authorRespository { get; }
        IChapters chapterRespository { get; }
        IComic comicRespository { get; }
        IComic_Episode comicEpisodeRespository { get; }
        IComic_Images comicImagesRespository { get; }
        IMy_Compose my_ComposeRepository { get; }
        IPart_Chapter part_ChapterRespository { get; }
        IReviews reviewRespository { get; }
        IScene sceneRespository { get; }
        ISeri_Story seri_StoryRespository { get; }
        ISeries seriesRespository { get; }
        IStory storyRespository { get; }
        IStory_Comic storyComicRepository { get; }
        IStorySearch storySearchRepository { get; }
        ITag tagRespository { get; }
        void Commit();
    }
}
