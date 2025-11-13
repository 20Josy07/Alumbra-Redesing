import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Phone } from "lucide-react";
import { Separator } from "./ui/separator";

const resources = [
  {
    name: "The National Domestic Violence Hotline (EE.UU.)",
    description: "Soporte confidencial 24/7 para cualquiera que experimente violencia doméstica o busque recursos e información.",
    phone: "1-800-799-7233",
    website: "https://www.thehotline.org/",
    icon: Phone,
  },
  {
    name: "National Coalition Against Domestic Violence (NCADV - EE.UU.)",
    description: "Proporciona recursos y aboga por las víctimas y sobrevivientes de la violencia doméstica.",
    website: "https://ncadv.org/",
    icon: Globe,
  },
  {
    name: "Love Is Respect (EE.UU.)",
    description: "Un recurso para que los jóvenes prevengan y pongan fin a las relaciones abusivas.",
    phone: "1-866-331-9474",
    website: "https://www.loveisrespect.org/",
    icon: Phone,
  },
];

export default function Resources() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Encuentra Apoyo y Recursos</CardTitle>
        <CardDescription>No estás solo/a. Aquí hay algunas organizaciones que pueden ayudarte.</CardDescription>
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
                            <a href={`tel:${resource.phone}`} className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline">
                            <Phone className="w-3.5 h-3.5" />
                            {resource.phone}
                            </a>
                        )}
                        {resource.website && (
                            <a href={resource.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline">
                            <Globe className="w-3.5 h-3.5" />
                            Visitar sitio web
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
