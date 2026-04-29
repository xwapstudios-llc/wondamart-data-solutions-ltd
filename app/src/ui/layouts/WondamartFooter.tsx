import React from 'react';
import { Zap, Clock, MessageSquare, Mail, MapPin } from 'lucide-react';
import {R} from "@/app/routes.ts";

interface ContactNode {
    icon: React.ElementType;
    label: string;
    value: string;
    href: string;
    accent: string; // Dynamic coloring for high-engagement elements
}

const WondamartFooter: React.FC = () => {
    const contactNodes: ContactNode[] = [
        { icon: MessageSquare, label: 'WhatsApp', value: 'Join Community', href: R.utils.support, accent: 'text-emerald-500' },
        { icon: Mail, label: 'Email', value: 'wondamartgh@gmail.com', href: R.utils.mail, accent: 'text-indigo-500' },
        { icon: MapPin, label: 'Location', value: 'Accra, Ghana', href: '#', accent: 'text-slate-500' },
    ];

    return (
        <footer className="w-full bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 pt-16 pb-4 px-6 font-sans transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">

                    {/* Brand Identity: Anchor of the Layout */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="flex items-center gap-3">
                            <img alt={"logo"} className={"size-10"} src={"/logo/logo.png"}/>

                            <h2 className="text-2xl font-black tracking-tighter text-[#002855] dark:text-slate-50">
                                WONDAMART <span className="font-light text-slate-400 dark:text-slate-500">GH</span>
                            </h2>
                        </div>
                        <p className="leading-relaxed text-slate-600 dark:text-slate-400 max-w-md">
                            The benchmark for secure data acquisition in Ghana.
                            Engineering speed and reliability into every transaction.
                        </p>
                    </div>

                    {/* Operational Metrics: Proof of Concept */}
                    <div className="lg:col-span-3 grid grid-cols-1 gap-8 lg:border-l border-slate-200 dark:border-slate-800 lg:pl-12">
                        <div className="flex items-center gap-4 group">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-600 transition-all duration-300">
                                <Clock className="w-5 h-5 text-blue-700 dark:text-blue-400 group-hover:text-white" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Live Uptime</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">24 / 7  Available</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg group-hover:bg-emerald-600 transition-all duration-300">
                                <Zap className="w-5 h-5 text-emerald-700 dark:text-emerald-400 group-hover:text-white" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Network Speed</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">Swift Provisioning</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Hub: High-Conversion Nodes */}
                    <div className="lg:col-span-4 space-y-6">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">Direct Pipelines</h3>
                        <div className="space-y-3">
                            {contactNodes.map((node, index) => (
                                <a
                                    key={index}
                                    href={node.href}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300"
                                >
                                    <node.icon className={`w-5 h-5 ${node.accent}`} />
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{node.label}</p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{node.value}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Global Compliance & Legal Footnote */}
                <div className="border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600">
                    <p className="text-center md:text-left">&copy; {new Date().getFullYear()} WONDAMART DATA SOLUTIONS. BUILT FOR SCALE.</p>
                </div>
            </div>
        </footer>
    );
};

export default WondamartFooter;
