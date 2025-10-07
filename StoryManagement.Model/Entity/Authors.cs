using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Entity
{
    public class Authors
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Style { get; set; }
        [NotMapped]
        public string? Pseudonym { get; set; }
    }
}
