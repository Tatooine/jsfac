using System;
using System.Web;
using Cassette;
using Cassette.BundleProcessing;
using Cassette.Scripts;
namespace Jsfac.Cassette
{
    public class ParseJsfacReferences : ParseReferences<ScriptBundle>
    {
        readonly Jsfac _jsfac;
        JsfacRegistry _registry;
        public ParseJsfacReferences(Jsfac jsfac)
        {
            _jsfac = jsfac;
        }

        protected override bool ShouldParseAsset(IAsset asset)
        {
            if (asset.Path.EndsWith(".js", StringComparison.OrdinalIgnoreCase))
            {
                return (_registry = _jsfac.FindByPath(HttpContext.Current.Server.MapPath(asset.Path))) != null;
            }

            return false;
        }

        protected override ICommentParser CreateCommentParser()
        {
            return new JsfacCommentParser(_registry, s => s.Replace(HttpContext.Current.Server.MapPath("~/js"), "~/js/"));
        }
    }
}
