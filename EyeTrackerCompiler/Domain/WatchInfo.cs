using CsvHelper;
using CsvHelper.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EyeTrackerCompiler.Domain
{
    public class WatchInfo
    {
        public Watch Watch { get; set; }

        public double Time { get; set; }

        public double Timegap { get; set; }

        public double X { get; set; }

        public double Y { get; set; }

        public double Xm => X * 0.264;

        public double Ym => Y * 0.264;

        public double GetDistance(WatchInfo info) => Math.Sqrt(Math.Pow(Math.Abs(this.Xm - info.Xm), 2) + Math.Pow(Math.Abs(this.Ym - info.Ym), 2));

        public double GetSpeed(WatchInfo info) => (Math.Atan(GetDistance(info) / 10.0d / 570.0d) * 180 / Math.PI) / ((this.Time - info.Time) / 1000);

        public static List<WatchInfo> Load(string path)
        {
            Configuration conf = new Configuration()
            {
                Delimiter = ";",
                BadDataFound = (context) => { },
            };

            if (!File.Exists(path)) throw new FileNotFoundException();

            using (FileStream fs = File.OpenRead(path))
            using (TextReader txReader = new StreamReader(fs))
            using (CsvReader reader = new CsvReader(txReader, conf))
            {
                return reader.GetRecords<WatchInfo>()
                    .OrderBy(d => d.Time)
                    .ToList();
            }
        }
    }
}
