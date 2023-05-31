import CreateAVCard from "@/components/CreateAVCard";
import CreateAudioCard from "@/components/CreateAudioCard";
import CreateImageCard from "@/components/CreateImageCard";
import CreateTicketCard from "@/components/CreateTicketCard";

export default function Accordion({spaces, hasSpace}: { spaces: string[], hasSpace: boolean }) {
    return (
        <div className="accordion-group accordion-group-hover rounded-lg" style={{maxWidth: "50rem", width: "50rem"}}>
            <div className="accordion my-3">
                <input type="checkbox" id="toggle-0" className="accordion-toggle" />
                <label htmlFor="toggle-0" className="accordion-title text-slate-200 bg-fuchsia-100 rounded-xl border-0" style={{backgroundColor: "rgb(255 247 252)"}}>Dynamic Audio NFT</label>
                <div className="accordion-content text-content2" style={{borderBottomWidth: 0}}>
                    <div className="min-h-0">
                        <CreateAVCard spaces={spaces} hasSpace={hasSpace} />
                    </div>
                </div>
            </div>
            <div className="accordion my-3">
                <input type="checkbox" id="toggle-1" className="accordion-toggle" />
                <label htmlFor="toggle-1" className="accordion-title text-slate-200 bg-fuchsia-100 rounded-xl border-0" style={{backgroundColor: "rgb(255 247 252)"}}>Audio NFT</label>
                <div className="accordion-content text-content2" style={{borderBottomWidth: 0}}>
                    <div className="min-h-0">
                        <CreateAudioCard spaces={spaces} hasSpace={hasSpace} />
                    </div>
                </div>
            </div>
            <div className="accordion my-3">
                <input type="checkbox" id="toggle-2" className="accordion-toggle" />
                <label htmlFor="toggle-2" className="accordion-title text-slate-200 bg-fuchsia-100 rounded-xl border-0" style={{backgroundColor: "rgb(255 247 252)"}}>Image NFT</label>
                <div className="accordion-content text-content2" style={{borderBottomWidth: 0}}>
                    <div className="min-h-0">
                        <CreateImageCard spaces={spaces} hasSpace={hasSpace} />
                    </div>
                </div>
            </div>
            <div className="accordion my-3">
                <input type="checkbox" id="toggle-3" className="accordion-toggle" />
                <label htmlFor="toggle-3" className="accordion-title text-slate-200 bg-fuchsia-100 rounded-xl border-0" style={{backgroundColor: "rgb(255 247 252)"}}>Ticket NFT</label>
                <div className="accordion-content text-content2" style={{borderBottomWidth: 0}}>
                    <div className="min-h-0">
                        <CreateTicketCard spaces={spaces} hasSpace={hasSpace} />
                    </div>
                </div>
            </div>
        </div>
    )
}