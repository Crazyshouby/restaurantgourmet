import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Clock, MapPin, Phone, Utensils } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-medium">Restaurant Gourmet</h1>
          <nav className="flex items-center gap-4">
            <Link to="/menu">
              <Button variant="ghost" size="sm">
                Menu
              </Button>
            </Link>
            <Link to="/reservations">
              <Button variant="ghost" size="sm">
                Réservations
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                Administration
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="animate-fade-in">
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-r from-primary/10 to-secondary">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  Une expérience inoubliable
                </span>
                <h2 className="text-4xl md:text-5xl font-medium leading-tight">
                  Découvrez une cuisine d'exception
                </h2>
                <p className="text-muted-foreground text-lg">
                  Notre chef vous propose une carte élaborée avec des produits frais et de saison,
                  pour une expérience culinaire unique.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/reservations">
                    <Button size="lg" className="gap-2">
                      Réserver une table <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/menu">
                    <Button variant="outline" size="lg">
                      Voir le menu
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Plat gastronomique" 
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card rounded-xl p-6 shadow-card flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Utensils className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Cuisine raffinée</h3>
                <p className="text-muted-foreground">
                  Des plats préparés avec soin par notre chef étoilé, utilisant les meilleurs produits du terroir.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-card flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Cadre exceptionnel</h3>
                <p className="text-muted-foreground">
                  Un restaurant élégant au cœur de la ville, avec une terrasse donnant sur les jardins.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-card flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Service attentionné</h3>
                <p className="text-muted-foreground">
                  Notre équipe vous accueille tous les jours de 12h à 14h30 et de 19h à 22h30.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 px-4 bg-secondary/50">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Notre chef" 
                  className="w-full h-[400px] object-cover"
                />
              </div>
              
              <div className="space-y-6">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  Notre histoire
                </span>
                <h2 className="text-3xl font-medium">Une passion pour la gastronomie</h2>
                <p className="text-muted-foreground">
                  Depuis 15 ans, notre chef étoilé met son savoir-faire au service d'une cuisine créative
                  et respectueuse des traditions. Chaque plat raconte une histoire, celle de producteurs
                  passionnés et d'une équipe dévouée à l'excellence culinaire.
                </p>
                <p className="text-muted-foreground">
                  Venez découvrir notre carte qui évolue au fil des saisons et laissez-vous tenter par
                  notre menu dégustation pour une expérience complète.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-medium mb-4">Nous contacter</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Pour toute information ou réservation, n'hésitez pas à nous contacter par téléphone
                ou à utiliser notre système de réservation en ligne.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card rounded-xl p-8 shadow-card">
                <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                  <Phone className="h-5 w-5" /> Réservations
                </h3>
                <p className="text-muted-foreground mb-6">
                  Pour réserver une table, appelez-nous ou utilisez notre système de réservation en ligne.
                </p>
                <Link to="/reservations">
                  <Button className="w-full">
                    Réserver maintenant
                  </Button>
                </Link>
              </div>
              
              <div className="bg-card rounded-xl p-8 shadow-card">
                <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" /> Adresse
                </h3>
                <p className="text-muted-foreground mb-2">
                  15 Rue de la Gastronomie<br />
                  75008 Paris
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Ouvert :</strong> Tous les jours de 12h à 14h30 et de 19h à 22h30
                </p>
                <p className="text-muted-foreground">
                  <strong>Téléphone :</strong> 01 23 45 67 89
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Restaurant Gourmet</h3>
              <p className="text-muted-foreground">
                Une expérience culinaire unique au cœur de Paris.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Horaires</h3>
              <p className="text-muted-foreground">
                Ouvert tous les jours<br />
                Déjeuner : 12h - 14h30<br />
                Dîner : 19h - 22h30
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Contact</h3>
              <p className="text-muted-foreground">
                15 Rue de la Gastronomie<br />
                75008 Paris<br />
                01 23 45 67 89
              </p>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Restaurant Gourmet. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
