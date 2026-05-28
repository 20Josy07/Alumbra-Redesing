import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Phone, Heart } from "lucide-react";

const resources = [
  {
    name: "The National Domestic Violence Hotline (EE.UU.)",
    description: "Soporte confidencial 24/7 para cualquiera que experimente violencia doméstica o busque recursos e información.",
    phone: "1-800-799-7233",
    website: "https://www.thehotline.org/",
    color: "from-rose-500 to-pink-500",
  },
  {
    name: "National Coalition Against Domestic Violence (NCADV)",
    description: "Proporciona recursos y aboga por las víctimas y sobrevivientes de la violencia doméstica.",
    website: "https://ncadv.org/",
    color: "from-primary to-violet-500",
  },
  {
    name: "Love Is Respect (EE.UU.)",
    description: "Un recurso para que los jóvenes prevengan y pongan fin a las relaciones abusivas.",
    phone: "1-866-331-9474",
    website: "https://www.loveisrespect.org/",
    color: "from-violet-500 to-fuchsia-500",
  },
];

export default function Resources() {
  return (
    <Card className="rounded-3xl border border-purple-100/60 shadow-sm overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-rose-400 via-primary to-violet-400" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5 text-base font-black">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-sm">
            <Heart className="w-4 h-4 text-white" />
          </div>
          Encuentra Apoyo y Recursos
        </CardTitle>
        <CardDescription className="text-sm">
          No estás solo/a. Aquí hay organizaciones que pueden ayudarte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <div
              key={resource.name}
              className="group relative p-5 rounded-2xl bg-purple-50/60 border border-purple-100/60 hover:border-purple-200 hover:shadow-md transition-all duration-200"
            >
              {/* Gradient top bar */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${resource.color} rounded-t-2xl`} />

              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${resource.color} flex items-center justify-center shadow-sm mb-3`}>
                {resource.phone
                  ? <Phone className="w-4 h-4 text-white" />
                  : <Globe className="w-4 h-4 text-white" />
                }
              </div>

              <h3 className="font-bold text-sm text-gray-800 leading-snug mb-2">{resource.name}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">{resource.description}</p>

              <div className="flex flex-col gap-2">
                {resource.phone && (
                  <a
                    href={`tel:${resource.phone}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {resource.phone}
                  </a>
                )}
                {resource.website && (
                  <a
                    href={resource.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Visitar sitio web
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
