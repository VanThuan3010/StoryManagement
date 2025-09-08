using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Entity
{
    public class GroupTag
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Definition { get; set; }
        public bool MultiSelect { get; set; } = false;
    }
}
