import { ArrowRight } from "lucide-react";
import Link from "next/link";

const organizationIds = [
    "52north",
    "aboutcode",
    "accord",
    "aswf",
    "aerospace",
    "openmesh",
];

export default function ProjectPreview() {
    return <div>
        <div className="section-heading">
            <div>
                <span className="eyebrow">
                    <span />
                    ORGANIZATION
                </span>
                <h2>
                    GSoC projects
                </h2>
            </div>
            <Link
                href="/projects"
                className="primary-button compact"
            >
                View all projects
                <ArrowRight size={16} />
            </Link>
        </div>
        <div className="mini-projects">
            {organizationIds.slice(0, 3).map((id, index) => <article key={id}><span>20{24 - index}</span><h3>{["Open geospatial API gateway", "Sensor data quality studio", "Spatial research workflow"][index]}</h3><p>Build useful open-source technology with the 52°North community.</p><div className="chips"><span>Python</span><span>Web</span><span>Data</span></div></article>)}
        </div>
    </div>;
}
