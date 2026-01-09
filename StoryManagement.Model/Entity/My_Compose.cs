using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Entity
{
    public class My_Compose
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Contents { get; set; }
        public int ParentId { get; set; }
        public int Level { get; set; }
        [NotMapped]
        public string? Status { get; set; }
        [NotMapped]
        public string? Message { get; set; }
    }
}
