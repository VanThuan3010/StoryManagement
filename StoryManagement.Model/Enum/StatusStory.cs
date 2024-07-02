using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Enum
{
    public enum StatusStory : byte
    {
        [Display(Name = "Đang ra")]
        Continue = 1,
        [Display(Name = "Kết thúc")]
        Full = 2,
        [Display(Name = "Tạm ngưng")]
        Drop = 3
    }
}
