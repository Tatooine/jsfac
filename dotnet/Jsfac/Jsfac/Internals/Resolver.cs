using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using Noesis.Javascript;

namespace Jsfac.Internals
{
    class Resolver
    {
        static Regex HasJsfacModule = new Regex(@"jsfac\s*\.\s*module\s*\(", RegexOptions.IgnorePatternWhitespace | RegexOptions.Multiline | RegexOptions.Compiled);

        StringBuilder _sbuf;

        public IEnumerable<Item> Resolve(string jsfac, string path)
        {
            _sbuf = new StringBuilder();

            AddReference(jsfac);
            var files = Directory.GetFiles(path, "*.js", SearchOption.AllDirectories);
            foreach (var file in files)
            {
                var content = File.ReadAllText(file);
                if (HasJsfacModule.IsMatch(content))
                {
                    Add(@"jsfac.file='" + file.Replace(@"\", @"\\") + "'");
                    Add(content);
                }
            }

            Add(@"__result__ = JSON.stringify(jsfac.debug.graph());");
            var str = Eval();

            var map = JsonConvert.DeserializeObject<Item[]>(str);

            return map;
        }

        void AddReference(string path)
        {
            var content = System.IO.File.ReadAllText(path);
            _sbuf.AppendLine(content);
        }

        void Add(string content)
        {
            _sbuf.AppendLine(content);
        }

        string Eval()
        {
            string code = _sbuf.ToString();
            using (var context = new JavascriptContext())
            {
                context.Run(code);

                var str = context.GetParameter("__result__").ToString();

                return str;
            }
        }
    }
}