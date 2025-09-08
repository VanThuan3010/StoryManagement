using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Entity
{
    public class Seri_Story
    {
        public int Id { get; set; }
        public int SeriId { get; set; }
        public int StoryId { get; set; }
        public int Position { get; set; }
    }
}
