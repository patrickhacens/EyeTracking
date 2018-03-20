using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CsvHelper;
using CsvHelper.Configuration;
using EyeTrackerCompiler.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace EyeTrackerCompiler.Controllers
{
    [Route("api/[controller]")]
    public class VideoController : Controller
    {
        public int FixationThreshold { get; set; }

        public VideoController(IConfiguration configuration)
        {
            FixationThreshold = configuration.GetValue<int>("FixationThreshold");
        }

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
        public IActionResult GetWatches(string video)
        {
            DirectoryInfo f = new DirectoryInfo(Video.Folder + video);
            if (!f.Exists) return null; //notfound

            Video vid = new Video()
            {
                Name = video
            };

            var result = f.EnumerateFiles().Select(d => new Watch(d.FullName)
            {
                Video = vid
            }).Select(d => new
            {
                d.Video,
                d.Name
            });

            return Ok(result);
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

        [Route("{video}/{watch}")]
        [HttpGet]
        public IActionResult GetWatchInfo(string video, string watch)
        {
            FileInfo f = new FileInfo(Video.Folder + video + "/" + watch);
            Watch watchObject = new Watch(f.FullName)
            {
                Video = new Video()
                {
                    Name = video
                }
            };

            var records = watchObject.LoadInfo();
            if (!records.Any()) return NotFound();

            List<WatchInfoSpeed> list = WatchInfoSpeed.Compile(watchObject, records);

            return Ok(list);
        }

        [Route("{video}/{watch}/csv")]
        [HttpGet]
        public IActionResult GetWatchInfoCsv(string video, string watch)
        {
            FileInfo f = new FileInfo(Video.Folder + video + "/" + watch);
            Watch watchObject = new Watch(f.FullName)
            {
                Video = new Video()
                {
                    Name = video
                }
            };

            var records = watchObject.LoadInfo();
            if (!records.Any()) return NotFound();

            List<WatchInfoSpeed> list = WatchInfoSpeed.Compile(watchObject, records);

            using (MemoryStream ms = new MemoryStream())
            using (StreamWriter sw = new StreamWriter(ms))
            using (CsvWriter writer = new CsvWriter(sw))
            {
                writer.WriteHeader<WatchInfoSpeed>();
                sw.WriteLine();
                writer.WriteRecords(list);
                return Ok(Encoding.UTF8.GetString(ms.ToArray()));
            }
        }

        [Route("{video}/{watch}/fixation")]
        [HttpGet]
        public IActionResult GetFixations(string video, string watch)
        {
            FileInfo f = new FileInfo(Video.Folder + video + "/" + watch);
            Watch watchObject = new Watch(f.FullName)
            {
                Video = new Video()
                {
                    Name = video
                }
            };

            var records = watchObject.LoadInfo();
            if (!records.Any()) return NotFound();

            List<WatchInfoSpeed> list = WatchInfoSpeed.Compile(watchObject, records);
            var results = Fixation.Compile(watchObject, list.ToArray(), this.FixationThreshold);

            var filteredResults = results
                                    .Where(d => d.Duration > 100)
                                    .Where(d => d.Duration < 800)
                                    .Where(d => d.AverageEyeSpeed <= this.FixationThreshold)
                                    .Select(d => new
                                    {
                                        StartTime = (int)d.StartTime,
                                        EndTime = (int)d.EndTime,
                                        Duration = (int)d.Duration,
                                        AverageEyeSpeed = Math.Round(d.AverageEyeSpeed, 2, MidpointRounding.ToEven),
                                        X = (int)d.X,
                                        Y = (int)d.Y,
                                    })
                                    .ToArray();

            return Ok(filteredResults);
        }


        [Route("{video}/{watch}/fixation/csv")]
        [HttpGet]
        public IActionResult GetFixationsCsv(string video, string watch)
        {
            FileInfo f = new FileInfo(Video.Folder + video + "/" + watch);
            Watch watchObject = new Watch(f.FullName)
            {
                Video = new Video()
                {
                    Name = video
                }
            };

            var records = watchObject.LoadInfo();
            if (!records.Any()) return NotFound();

            List<WatchInfoSpeed> list = WatchInfoSpeed.Compile(watchObject, records);
            var results = Fixation.Compile(watchObject, list.ToArray(), this.FixationThreshold);

            var filteredResults = results
                                    .Where(d => d.Duration > 100)
                                    .Where(d => d.Duration < 800)
                                    .Where(d => d.AverageEyeSpeed <= 6)
                                    .Select(d => new
                                    {
                                        StartTime = (int)d.StartTime,
                                        EndTime = (int)d.EndTime,
                                        Duration = (int)d.Duration,
                                        d.AverageEyeSpeed,
                                        X = (int)d.X,
                                        Y = (int)d.Y,
                                    })
                                    .ToArray();


            using (MemoryStream ms = new MemoryStream())
            using (StreamWriter sw = new StreamWriter(ms))
            using (CsvWriter writer = new CsvWriter(sw))
            {
                writer.WriteRecords(filteredResults);
                return Ok(Encoding.UTF8.GetString(ms.ToArray()));
            }
        }
    }
}
