using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EyeTrackerCompiler.Domain
{
    public class Fixation
    {
        public Watch Watch { get; set; }

        public double X { get; set; }

        public double Y { get; set; }

        public double StartTime { get; set; }

        public double EndTime { get; set; }

        public double AverageEyeSpeed { get; set; }

        public double Duration => EndTime - StartTime;

        public List<WatchInfoSpeed> Infos { get; set; } = new List<WatchInfoSpeed>();

        private void CompileData()
        {
            this.X = Infos.Average(d => d.X);
            this.Y = Infos.Average(d => d.Y);
            this.StartTime = Infos.Min(d => d.Time);
            this.EndTime = Infos.Max(d => d.Time);
            this.AverageEyeSpeed = Infos.Average(d => d.Speed);
        }


        public static List<Fixation> Compile(Watch watch, WatchInfoSpeed[] speedInfos, int SpeedThreshold)
        {
            List<Fixation> result = new List<Fixation>();

            Fixation currentFixation = new Fixation();

            result.Add(currentFixation);

            foreach (var info in speedInfos)
            {
                if (currentFixation.Infos.Count == 0) currentFixation.Infos.Add(info);
                if (info.Speed <= SpeedThreshold) currentFixation.Infos.Add(info);
                else
                {
                    currentFixation = new Fixation();
                    result.Add(currentFixation);
                    currentFixation.Infos.Add(info);
                }
            }

            foreach (var item in result) item.CompileData();

            return result;
        }
    }
}
