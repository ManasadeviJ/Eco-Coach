// import 
export default function ChatPage() {
return (
<div className="min-h-screen bg-[#EAF8EE] px-5 py-6 flex flex-col gap-5">
<h1 className="text-2xl font-semibold text-[#2B6B3A]">Ask Eco Coach</h1>


{/* Chat Area (static example) */}
<div className="flex flex-col gap-3 flex-1 overflow-y-auto">
<div className="bg-white w-fit max-w-[80%] rounded-xl px-4 py-3 shadow text-sm">Here are some eco ideas you can try.</div>
</div>


{/* Input */}
<div className="flex gap-2">
<input className="flex-1 bg-white rounded-xl px-4 py-3 shadow text-sm outline-none" placeholder="Ask something..." />
<button className="bg-[#4CAF50] text-white px-5 rounded-xl text-sm hover:opacity-90">Send</button>
</div>
</div>
);
}