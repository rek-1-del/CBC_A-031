import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

// Medical resource links data
const resourceLinks = {
  international: [
    { name: "National Library of Medicine", url: "https://www.nlm.nih.gov/" },
    { name: "JAMA Network", url: "https://jamanetwork.com/" },
    { name: "AMBOSS", url: "https://www.amboss.com/" },
    { name: "New England Journal of Medicine", url: "https://www.nejm.org/" },
    { name: "DynaMed", url: "https://www.dynamed.com/" },
    { name: "American Medical Association", url: "https://www.ama-assn.org/" },
    { name: "World Health Organization", url: "https://www.who.int/" },
    { name: "Continuing Medical Education", url: "https://www.cmelist.org/" },
    { name: "MedicineNet", url: "https://www.medicinenet.com/" },
    { name: "University of Oxford", url: "https://www.ox.ac.uk/research/medical-sciences" },
    { name: "Harvard Medical College", url: "https://hms.harvard.edu/" },
    { name: "SciHub", url: "https://sci-hub.se/" }
  ],
  indian: [
    { name: "Ministry of Health and Family Welfare", url: "https://www.mohfw.gov.in/" },
    { name: "Indian Medical Association", url: "https://www.ima-india.org/" },
    { name: "Indian Council of Medical Research", url: "https://icmr.gov.in/" },
    { name: "National Medical Commission", url: "https://www.nmc.org.in/" },
    { name: "All India Institute of Medical Sciences", url: "https://www.aiims.edu/" }
  ]
};

export default function ResourceLinks() {
  const [internationalOpen, setInternationalOpen] = useState(false);
  const [indianOpen, setIndianOpen] = useState(false);
  
  return (
    <div>
      <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
        Medical Resources
      </h2>
      <div className="space-y-2">
        {/* International Resources */}
        <div className="border border-neutral-200 rounded-md overflow-hidden">
          <Button
            variant="ghost"
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium bg-neutral-100"
            onClick={() => setInternationalOpen(!internationalOpen)}
          >
            <span>International Resources</span>
            {internationalOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          
          <div className={`p-2 space-y-1 ${internationalOpen ? "block" : "hidden"}`}>
            {resourceLinks.international.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-1.5 text-xs rounded-md hover:bg-neutral-100 text-neutral-700"
              >
                <ExternalLink className="h-3 w-3 mr-2" /> {link.name}
              </a>
            ))}
          </div>
        </div>
        
        {/* Indian Resources */}
        <div className="border border-neutral-200 rounded-md overflow-hidden">
          <Button
            variant="ghost"
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium bg-neutral-100"
            onClick={() => setIndianOpen(!indianOpen)}
          >
            <span>Indian Resources</span>
            {indianOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          
          <div className={`p-2 space-y-1 ${indianOpen ? "block" : "hidden"}`}>
            {resourceLinks.indian.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-1.5 text-xs rounded-md hover:bg-neutral-100 text-neutral-700"
              >
                <ExternalLink className="h-3 w-3 mr-2" /> {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
