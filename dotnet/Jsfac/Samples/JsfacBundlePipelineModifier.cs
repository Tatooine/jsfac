using System.Web;
using Cassette.BundleProcessing;
using Cassette.Scripts;
using Jsfac.Cassette;

namespace Samples
{
    public class JsfacBundlePipelineModifier : IBundlePipelineModifier<ScriptBundle>
    {
        public IBundlePipeline<ScriptBundle> Modify(IBundlePipeline<ScriptBundle> pipeline)
        {
            var jsfac = new Jsfac.Jsfac(HttpContext.Current.Server.MapPath("~/js/jsfac.js"), HttpContext.Current.Server.MapPath("~/js"));
            var index = pipeline.IndexOf<ParseJavaScriptReferences>();
            pipeline.Insert(index + 1, new ParseJsfacReferences(jsfac));
            return pipeline;
        }
    }
}