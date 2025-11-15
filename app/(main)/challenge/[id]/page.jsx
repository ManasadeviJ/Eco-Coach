import challengeDetail from './challengeDetail.module.css';

export default function ChallengeDetailPage() {
return (
<div className="min-h-screen bg-[#EAF8EE] px-5 py-6 flex flex-col gap-5">
<h1 className="text-xl font-semibold text-[#2B6B3A]">Avoid Disposable Plastic</h1>


<div className="bg-white p-5 rounded-2xl shadow flex flex-col gap-4">
<p className="text-sm leading-relaxed text-gray-700">Carry your own container instead of taking disposable plastic items.</p>
<div className="bg-[#FFF9F0] px-4 py-3 rounded-xl text-sm">A sapling will be planted in your world.</div>
<button className="w-full bg-[#4CAF50] text-white py-3 rounded-xl font-medium hover:opacity-90">Mark as Done</button>
</div>
</div>
);
}