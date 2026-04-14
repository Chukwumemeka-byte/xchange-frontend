"use client";

import { useState } from "react";
import {
    ArrowLeft,
    Box,
    Search,
    ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Getting Started", "API Integration", "Security"];

const DOC_GROUPS = {
    "Getting Started": [
        { id: "1", title: "Getting started", description: "Lobortis morbi aliquet mollis mollis arcu. Sed sed placerat nascetur diam non. Malesuada.", isHighlighted: true },
        { id: "2", title: "Viverra dignissim pellentesque", description: "Adipiscing fusce suspendisse nibh erat diam elit arcu. Ac quam posuere sed massa." },
        { id: "3", title: "Ultrices enim facilisi aenean", description: "At et a etiam ultrices enim eu. Et praesent urna id cursus habitasse pretium. Cras orci ut." },
    ],
    "API Integration": [
        { id: "4", title: "Amet est adipiscing massa", description: "Odio fermentum arcu euismod turpis. Eu augue lacus dictum sem viverra neque." },
        { id: "5", title: "Molestie fringilla ornare velit", description: "Lorem blandit morbi vel elementum blandit rhoncus. Elit elit urna id gravida urna." },
        { id: "6", title: "Eget a augue habitasse a in.", description: "Tempus faucibus cras suspendisse nisl proin ante id. Tortor malesuada elit arcu mattis in." },
    ],
    "Security": [
        { id: "7", title: "Porttitor facilisi tincidunt urna", description: "Ac amet aenean facilisi at. Dictum lectus sem erat orci adipiscing integer sed semper non." },
        { id: "8", title: "Ac eget aenean mattis in purus", description: "Velit scelerisque et auctor id suspendisse egestas. Nec vulputate erat vulputate eget." },
        { id: "9", title: "Viverra turpis ipsum risus sit", description: "Senectus nulla porttitor facilisi ullamcorper et eget elit rhoncus. Tempus orci nisl laoreet et." },
    ]
};

export default function DocumentationPage() {
    const [activeTab, setActiveTab] = useState("Getting Started");
    const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

    const handleDocClick = (id: string) => {
        setSelectedDoc(id);
    };

    if (selectedDoc) {
        return <DocDetailView onBack={() => setSelectedDoc(null)} activeTab={activeTab} setActiveTab={setActiveTab} />;
    }

    return null;
    if (false) {
    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-[28px] font-bold text-[#060B1E] font-interTight">Documentation</h2>
                <div className="relative w-[320px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#060B1E]/20" size={18} />
                    <Input
                        placeholder="Search..."
                        className="pl-12 h-12 rounded-xl border-[#DFE1E6] bg-white font-semibold text-[#060B1E]/40 shadow-sm"
                    />
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1 border-b border-[#DFE1E6] pb-1">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={cn(
                            "px-6 py-3 text-[14px] font-bold transition-all border-b-2 -mb-[1px]",
                            activeTab === cat
                                ? "text-[#060B1E] border-[#129426] bg-[#F9FAFB]/50 rounded-t-xl"
                                : "text-[#060B1E]/40 border-transparent hover:text-[#060B1E]/60"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Content Groups */}
            <div className="space-y-16 mt-4">
                {Object.entries(DOC_GROUPS).map(([groupName, docs]) => (
                    <div key={groupName} id={groupName.replace(/\s+/g, '-')} className="space-y-8">
                        <h3 className="text-[24px] font-bold text-[#060B1E] font-interTight">{groupName}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {docs.map((doc) => (
                                <DocCard
                                    key={doc.id}
                                    {...doc}
                                    onClick={() => handleDocClick(doc.id)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
    }
}

interface DocCardProps {
    title: string;
    description: string;
    isHighlighted?: boolean;
    onClick: () => void;
}

function DocCard({ title, description, isHighlighted, onClick }: DocCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "p-[3px] rounded-[28px] border transition-all cursor-pointer group hover:shadow-lg active:scale-[0.98]",
                isHighlighted ? "bg-[#129426] border-[#129426]" : "bg-white border-[#DFE1E6]"
            )}
        >
            <div className={cn(
                "rounded-[24px] p-8 h-full flex flex-col items-start min-h-[220px]",
                isHighlighted ? "bg-[#129426]" : "bg-[#F9FAFB]/50 border border-[#DFE1E6]/30 shadow-sm"
            )}>
                <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center mb-6",
                    isHighlighted ? "bg-white text-[#129426]" : "bg-[#129426] text-white"
                )}>
                    <Box size={20} />
                </div>

                <h4 className={cn(
                    "text-[18px] font-bold mb-3 font-interTight leading-tight",
                    isHighlighted ? "text-white" : "text-[#060B1E]"
                )}>
                    {title}
                </h4>

                <p className={cn(
                    "text-[13px] leading-[160%] font-semibold font-interTight mb-6 line-clamp-3",
                    isHighlighted ? "text-white/70" : "text-[#060B1E]/40"
                )}>
                    {description}
                </p>

                <div className={cn(
                    "mt-auto flex items-center gap-2 text-[13px] font-bold group-hover:gap-3 transition-all",
                    isHighlighted ? "text-white" : "text-[#129426]"
                )}>
                    View <ArrowRight size={14} />
                </div>
            </div>
        </div>
    );
}

interface DocDetailViewProps {
    onBack: () => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

function DocDetailView({ onBack, activeTab, setActiveTab }: DocDetailViewProps) {
    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-[28px] font-bold text-[#060B1E] font-interTight">Documentation</h2>
                <div className="relative w-[320px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#060B1E]/20" size={18} />
                    <Input
                        placeholder="Search..."
                        className="pl-12 h-12 rounded-xl border-[#DFE1E6] bg-white font-semibold text-[#060B1E]/40 shadow-sm"
                    />
                </div>
            </div>

            {/* Back Button & Title */}
            <div className="flex items-center gap-4 py-2 border-b border-[#DFE1E6]/50">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-xl bg-white border border-[#DFE1E6] flex items-center justify-center text-[#060B1E]/60 hover:bg-gray-50 transition-all shadow-sm"
                >
                    <ArrowLeft size={18} />
                </button>
                <h3 className="text-[20px] font-bold text-[#060B1E] font-interTight">Add New Vendor</h3>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1 border-b border-[#DFE1E6] pb-1">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={cn(
                            "px-6 py-3 text-[14px] font-bold transition-all border-b-2 -mb-[1px]",
                            activeTab === cat
                                ? "text-[#060B1E] border-[#129426] bg-[#F9FAFB]/50 rounded-t-xl"
                                : "text-[#060B1E]/40 border-transparent hover:text-[#060B1E]/60"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Detail Layout */}
            <div className="grid grid-cols-[280px_1fr] gap-12 mt-8 items-start">
                {/* Sticky Sidebar */}
                <div className="sticky top-10 border border-[#DFE1E6] rounded-[24px] bg-white overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-gray-50 bg-[#F9FAFB]/50">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#060B1E]/40">Introductions</p>
                    </div>
                    <div className="py-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <button
                                key={i}
                                className={cn(
                                    "w-full text-left px-6 py-3.5 text-[14px] font-bold transition-all border-l-4",
                                    i === 1
                                        ? "text-[#129426] border-[#129426] bg-[#129426]/5"
                                        : "text-[#060B1E]/40 border-transparent hover:bg-gray-50 hover:text-[#060B1E]/60"
                                )}
                            >
                                Lorem
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-12 max-w-4xl">
                    <div className="space-y-6">
                        <h1 className="text-[32px] font-bold text-[#060B1E] font-interTight leading-tight">
                            Pretium arcu id vel arcu orci semper eu senectus.
                        </h1>
                        <p className="text-[15px] leading-[180%] font-semibold text-[#060B1E]/60 font-interTight">
                            Feugiat enim tortor et et massa. Sem sed mollis ipsum mi consectetur tempor lorem. Massa lorem maecenas.
                        </p>
                        <p className="text-[15px] leading-[180%] font-semibold text-[#060B1E]/60 font-interTight">
                            Et mauris sed nisl semper id massa. Ut cum scelerisque neque eget amet. Aenean mattis convallis at urna dui tincidunt. Penatbus condimentum quisque interdum ultrices sit donec lectus neque. Velit ut diam egestas malesuada cras odio enim. Luctus cras nisi enim eu dolor. Purus pellentesque at platea mollis urna ipsum.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-[26px] font-bold text-[#060B1E] font-interTight leading-tight">
                            Viverra sed ac at eu. Mollis mi tortor augue ac eget.
                        </h2>
                        <p className="text-[15px] leading-[180%] font-semibold text-[#060B1E]/60 font-interTight">
                            Omare non integer porttitor nam aenean arcu et. Nunc senectus cursus suspendisse in. Enim nisl condimentum tincidunt tempor etiam amet dictum massa. Sed dolor magna platea vestibulum in amet sed. Ullamcorper congue risus consequat luctus mattis ac mollis. Id posuere habitant suspendisse amet egestas.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-[26px] font-bold text-[#060B1E] font-interTight leading-tight">
                            Morbi sit condimentum massa tempor mi integer dis. Sed enim pellentesque.
                        </h2>
                        <p className="text-[15px] leading-[180%] font-semibold text-[#060B1E]/60 font-interTight">
                            Pellentesque nisl pellentesque sagittis non. Tempus dolor ac integer risus dui ac at. A suscipit feugiat erat tincidunt metus viverra. Volutpat feugiat ac dictumst cras in fames viverra. Pellentesque nisi fringilla commodo ultrices proin sed pretium justo euismod.
                        </p>
                        <p className="text-[15px] leading-[180%] font-semibold text-[#060B1E]/60 font-interTight">
                            Mattis mollis consequat viverra tempus suspendisse interdum diam. Est libero diam urna convallis. Mi gravida morbi enim ac sit adipiscing donec vitae. Netus a habitasse ipsum tortor. Non sed a turpis cras rhoncus enim.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-[26px] font-bold text-[#060B1E] font-interTight leading-tight">
                            Pharetra varius ipsum mauris mauris sit facilisis. Sed laoreet velit eu at nisl augue. Proin.
                        </h2>
                        <p className="text-[15px] leading-[180%] font-semibold text-[#060B1E]/60 font-interTight">
                            Tempus amet ipsum rutrum sed tristique leo. Sed aenean nisl orator integer molestie. Sed facilisis nec elit erat augue urna urna congue. Habitasse et ac porttitor quam tristique nullam enim pretium tincidunt. Placerat tempus posuere quis et ipsum sed. In amet tempus dictum enim convallis. Vitae sed consequat ultrices eget.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-[26px] font-bold text-[#060B1E] font-interTight leading-tight">
                            In nec nulla elementum urna arcu libero congue. Proin facilisis nam tellus purus sed mi.
                        </h2>
                        <p className="text-[15px] leading-[180%] font-semibold text-[#060B1E]/60 font-interTight">
                            Leo urna pretium ultrices blandit a. Amet viverra libero habitasse sit ut massa sodales era at. Ultrices nec elit erat augue urna urna congue. Habitasse et ac porttitor quam gravida. Turpis odio vitae amet quisque. Aliquam nibh commodo urna tristique ac ultricies mattis venenatis aenean. Dui id mattis egestas elit morbi. Amet felis luctus adipiscing quam in.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-[26px] font-bold text-[#060B1E] font-interTight leading-tight">
                            Scelerisque diam nullam eget felis commodo faucibus.
                        </h2>
                        <p className="text-[15px] leading-[180%] font-semibold text-[#060B1E]/60 font-interTight">
                            Sed dictumst justo nunc urna accumsan. Senectus augue tristique at id nunc nisi in. Morbi scelerisque morbi iaculis nisi cras turpis nibh. Sed fusce dui risus eu. Nec placerat lectus sem neque nulla eget interdum faucibus.
                        </p>
                        <p className="text-[15px] leading-[180%] font-semibold text-[#060B1E]/60 font-interTight">
                            Ultrices et ipsum pharetra tincidunt sapien tincidunt ac. Justo in velit laoreet ut neque tincidunt ornare proin.
                        </p>
                        <p className="text-[15px] leading-[180%] font-semibold text-[#060B1E]/60 font-interTight">
                            Ac quisque facilisis tortor eu duis scelerisque mi non. Id leo id diam nunc feugiat ante viverra. Molestie lorem pretium nisl cursus tellus. Amet dictumst sed ridiculus sed. Ut sit gravida orci lorem hendrerit metus dui fermentum elementum. Eu eu a vitae accumsan. Faucibus consectetur morbi netus dictum interdum sapien condimentum mattis feugiat. Scelerisque sollicitudin proin elementum sapien lobortis mattis vulputate. Et netus scelerisque pretium imperdiet feugiat.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
