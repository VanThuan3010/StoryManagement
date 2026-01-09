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
        IGroupTag groupTagRespository { get; }
        IMy_Compose my_ComposeRepository { get; }
        IPart_Chapter part_ChapterRespository { get; }
        IPseu pseuRespository { get; }
        IReviews reviewRespository { get; }
        IScene sceneRespository { get; }
        ISeri_Story seri_StoryRespository { get; }
        ISeries seriesRespository { get; }
        IStory storyRespository { get; }
        IStory_Comic storyComicRepository { get; }
        ISub_Tag sub_TagRespository { get; }
        ITag tagRespository { get; }
        ITbl_Relationship relationshipRespository { get; }
        void Commit();
    }
}
