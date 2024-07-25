using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Entity
{
    public class Chapters
    {
        public long Id { get; set; }
        public int StoryId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int Belong {  get; set; }
        [NotMapped]
        public string Part_Name { get; set; }
        [NotMapped]
        public long ChapterId { get; set; }
    }
}
