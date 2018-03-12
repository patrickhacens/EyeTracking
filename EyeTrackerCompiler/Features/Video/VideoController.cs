using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using EyeTrackerCompiler.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EyeTrackerCompiler.Controllers
{
    [Route("api/[controller]")]
    public class VideoController : Controller
    {
        [HttpGet]
        public IEnumerable<Video> Get()
        {
            DirectoryInfo f = new DirectoryInfo(Video.Folder);
            return f.EnumerateDirectories().Select(d => new Video()
            {
                Name = d.Name
            }).ToArray();
        }

        [HttpPost]
        public IActionResult Post([FromBody]Video post)
        {
            var name = post.Name;
            if (name.Contains("/")) return Forbid();
            DirectoryInfo f = new DirectoryInfo(Video.Folder + name);
            if (!f.Exists) f.Create();
            return Ok();
        }

        [Route("{video}")]
        [HttpGet]
        public IEnumerable<Watch> GetWatches(string video)
        {
            DirectoryInfo f = new DirectoryInfo(Video.Folder + video);
            if (!f.Exists) return null; //notfound

            Video vid = new Video()
            {
                Name = video
            };

            return f.EnumerateFiles().Select(d => new Watch(d.FullName)
            {
                Video = vid
            });
        }
        [Route("{video}")]
        [HttpPost]
        public async Task<IActionResult> PostWatch(string video, IFormFile file)
        {
            DirectoryInfo f = new DirectoryInfo(Video.Folder + video);
            if (!f.Exists) f.Create();
            using (FileStream fs = new FileStream(f.FullName + "/" + file.FileName, FileMode.Create))
            {
                await file.CopyToAsync(fs);
            }
            return Ok();
        }
    }
}
