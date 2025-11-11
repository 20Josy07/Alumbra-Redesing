import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Phone } from "lucide-react";
import { Separator } from "./ui/separator";

const resources = [
  {
    name: "The National Domestic Violence Hotline",
    description: "24/7 confidential support for anyone experiencing domestic violence or seeking resources and information.",
    phone: "1-800-799-7233",
    website: "https://www.thehotline.org/",
    icon: Phone,
  },
  {
    name: "National Coalition Against Domestic Violence (NCADV)",
    description: "Provides resources, and advocates for victims and survivors of domestic violence.",
    website: "https://ncadv.org/",
    icon: Globe,
  },
  {
    name: "Love Is Respect",
    description: "A resource for young people to prevent and end abusive relationships.",
    phone: "1-866-331-9474",
    website: "https://www.loveisrespect.org/",
    icon: Phone,
  },
];

export default function Resources() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Find Support & Resources</CardTitle>
        <CardDescription>You are not alone. Here are some organizations that can help.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {resources.map((resource, index) => (
            <li key={resource.name}>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                        <resource.icon className="w-5 h-5 text-accent-foreground" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold">{resource.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1 mb-2">{resource.description}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        {resource.phone && (
                            <a href={`tel:${resource.phone}`} className="inline-flex items-center gap-1.5 text-primary-foreground/80 hover:underline">
                            <Phone className="w-3.5 h-3.5" />
                            {resource.phone}
                            </a>
                        )}
                        {resource.website && (
                            <a href={resource.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary-foreground/80 hover:underline">
                            <Globe className="w-3.5 h-3.5" />
                            Visit Website
                            </a>
                        )}
                        </div>
                    </div>
                </div>
              {index < resources.length - 1 && <Separator className="mt-4" />}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
