import { PublicFooter } from "@/components/public-footer";
import { PublicNav } from "@/components/public-nav";
import { LeaderboardTable } from "@/components/leaderboard-table";

const categories = [
  { label: "全部", active: true },
  { label: "Chat (对话)" },
  { label: "Completion (补全)" },
  { label: "Embedding (向量)" },
  { label: "Image (图像)" },
  { label: "Audio (音频)" },
  { label: "Video (视频)" },
];

export default function LeaderboardPage() {
  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col">
      <PublicNav activeId="models" />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <section className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">模型排行榜</h1>
            <p className="text-slate-500 mt-2">按调用量和评分查看最受欢迎的 AI 模型。数据每小时更新一次。</p>
          </section>

          <section className="mb-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center p-1 bg-slate-100 rounded-lg w-fit">
                <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-white shadow-sm text-slate-900">实时 (24h)</button>
                <button className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700">周榜</button>
                <button className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700">月榜</button>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                  </span>
                  <input className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500 w-64 bg-slate-50" placeholder="搜索模型名称..." type="text" />
                </div>
                <select className="border border-slate-200 rounded-lg text-sm bg-slate-50 py-2 pl-3 pr-8 focus:ring-brand-500 focus:border-brand-500">
                  <option>按调用量排序</option>
                  <option>按评分排序</option>
                  <option>按可用性排序</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                    cat.active
                      ? "bg-primary-container text-white"
                      : "text-slate-600 bg-slate-100 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </section>

          <LeaderboardTable />
        </div>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-2 text-lg font-bold">
                  <span className="material-symbols-outlined text-primary-container">terminal</span>
                  <span>OpenTruck</span>
                </div>
              </div>
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed">为去中心化的 AI 未来而建。为高性能模型编排提供底层基础设施。</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">产品</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a className="hover:text-primary-container transition-colors" href="#">技术文档</a></li>
                <li><a className="hover:text-primary-container transition-colors" href="#">API 参考</a></li>
                <li><a className="hover:text-primary-container transition-colors" href="#">价格体系</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">支持</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a className="hover:text-primary-container transition-colors" href="#">帮助中心</a></li>
                <li><a className="hover:text-primary-container transition-colors" href="#">服务状态</a></li>
                <li><a className="hover:text-primary-container transition-colors" href="#">联系我们</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">法律</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a className="hover:text-primary-container transition-colors" href="#">隐私协议</a></li>
                <li><a className="hover:text-primary-container transition-colors" href="#">服务条款</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-400">&copy; 2024 OpenTruck. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
