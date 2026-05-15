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
      <PublicNav activeId="leaderboard" />

      <main className="flex-grow pt-16">
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
                  <input className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-primary-container focus:border-primary-container w-64 bg-slate-50" placeholder="搜索模型名称..." type="text" />
                </div>
                <select className="border border-slate-200 rounded-lg text-sm bg-slate-50 py-2 pl-3 pr-8 focus:ring-primary-container focus:border-primary-container">
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
                <div className="w-6 h-6 bg-primary-container rounded flex items-center justify-center">
                  <div className="w-3 h-3 border-2 border-white rounded-sm transform rotate-45" />
                </div>
                <span className="text-lg font-bold">OpenTruck</span>
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
            <div className="flex items-center gap-6">
              <a className="text-slate-400 hover:text-slate-600" href="#"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg></a>
              <a className="text-slate-400 hover:text-slate-600" href="#"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
