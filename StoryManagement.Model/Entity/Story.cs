using StoryManagement.Model.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Entity
{
    public class Story
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? NumberChapter { get; set; }
        public bool? IsRead { get; set; }
        public string? AuthorId { get; set; }
        public string? Source {  get; set; }
        public string? TagId { get; set; }
        [NotMapped]
        public string? Review {  get; set; }
        [NotMapped]
        public int StoryId { get; set; }
    }
}
