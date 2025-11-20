import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Pagination from "@/components/Pagination";

const GAMES_PER_PAGE = 6;

const Games = () => {
  const { t } = useTranslation(["games", "common"]);
  const [currentPage, setCurrentPage] = useState(1);

  // Juegos de prueba
  const allGames = [
    {
      id: "1",
      name: "La Maldición de Strahd",
      description:
        "Una campaña gótica de horror en la tierra de Barovia. Los jugadores se enfrentarán a vampiros, fantasmas y criaturas de la noche.",
      status: "waiting",
      currentPlayers: 3,
      maxPlayers: 5,
      createdAt: "Hace 2 días",
      dm: "Aragorn",
    },
    {
      id: "2",
      name: "La Mina Perdida de Phandelver",
      description:
        "Una aventura clásica para nuevos jugadores. Explora cuevas, derrota goblins y encuentra tesoros legendarios.",
      status: "inProgress",
      currentPlayers: 4,
      maxPlayers: 4,
      createdAt: "Hace 1 semana",
      dm: "Gandalf",
    },
    {
      id: "3",
      name: "Tumba de la Aniquilación",
      description:
        "Aventura en la jungla de Chult donde los jugadores deben detener un mal que convierte a todos en no-muertos.",
      status: "waiting",
      currentPlayers: 2,
      maxPlayers: 6,
      createdAt: "Hace 1 día",
      dm: "Legolas",
    },
    {
      id: "4",
      name: "Horda de la Reina Dragón",
      description:
        "Los jugadores se unen a la resistencia contra el culto de la Reina Dragón que amenaza con destruir el mundo.",
      status: "lobby",
      currentPlayers: 1,
      maxPlayers: 4,
      createdAt: "Hace 3 horas",
      dm: "Gimli",
    },
    {
      id: "5",
      name: "Hijos de la Sal",
      description:
        "Aventura marítima donde los jugadores navegan por mares traicioneros y descubren islas misteriosas.",
      status: "waiting",
      currentPlayers: 5,
      maxPlayers: 6,
      createdAt: "Hace 5 días",
      dm: "Frodo",
    },
    {
      id: "6",
      name: "El Ojo de la Tormenta",
      description:
        "Campaña épica en el Desolado del Viento donde los jugadores deben prevenir un cataclismo mágico.",
      status: "inProgress",
      currentPlayers: 3,
      maxPlayers: 5,
      createdAt: "Hace 2 semanas",
      dm: "Boromir",
    },
    {
      id: "7",
      name: "La Ciudad de los Templos",
      description:
        "Intriga política en una metrópolis donde dioses antiguos compiten por el poder.",
      status: "waiting",
      currentPlayers: 2,
      maxPlayers: 4,
      createdAt: "Hace 1 día",
      dm: "Elrond",
    },
    {
      id: "8",
      name: "Montaña de la Perdición",
      description:
        "Expedición a las montañas prohibidas en busca de un artefacto legendario.",
      status: "lobby",
      currentPlayers: 1,
      maxPlayers: 3,
      createdAt: "Hace 6 horas",
      dm: "Samwise",
    },
    {
      id: "9",
      name: "El Laberinto del Minotauro",
      description:
        "Aventura en un laberinto infinito lleno de trampas y criaturas mitológicas.",
      status: "inProgress",
      currentPlayers: 4,
      maxPlayers: 4,
      createdAt: "Hace 3 días",
      dm: "Merry",
    },
    {
      id: "10",
      name: "Reinos de Hielo",
      description:
        "Supervivencia en tierras congeladas mientras buscan el Palacio de Hielo.",
      status: "waiting",
      currentPlayers: 3,
      maxPlayers: 5,
      createdAt: "Hace 4 días",
      dm: "Pippin",
    },
    {
      id: "11",
      name: "El Despertar del Dragón",
      description:
        "Un dragón ancestral ha despertado y amenaza los reinos del norte.",
      status: "lobby",
      currentPlayers: 2,
      maxPlayers: 6,
      createdAt: "Hace 12 horas",
      dm: "Arwen",
    },
    {
      id: "12",
      name: "Crónicas del Vacío",
      description:
        "Viaje interdimensional a través de portales mágicos y realidades alternas.",
      status: "waiting",
      currentPlayers: 4,
      maxPlayers: 6,
      createdAt: "Hace 2 días",
      dm: "Galadriel",
    },
  ];

  // Calcular juegos paginados
  const { paginatedGames, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * GAMES_PER_PAGE;
    const endIndex = startIndex + GAMES_PER_PAGE;
    const paginatedGames = allGames.slice(startIndex, endIndex);
    const totalPages = Math.ceil(allGames.length / GAMES_PER_PAGE);

    return { paginatedGames, totalPages };
  }, [currentPage, allGames]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top cuando cambia de página
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Función para traducir el estado
  const getStatusText = (status: string) => {
    switch (status) {
      case "waiting":
        return t("games:waiting");
      case "inProgress":
        return t("games:inProgress");
      case "lobby":
        return t("games:lobby");
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {t("games:availableGames")}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t("games:joinGameDesc")} ({allGames.length} {t("games:games")})
            </p>
          </div>
          <Link to="/games/create">
            <Button className="bg-gradient-primary hover:shadow-glow mt-4 md:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              {t("games:createGame")}
            </Button>
          </Link>
        </div>

        {paginatedGames.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground mb-4">
                  {t("games:noGamesAvailable")}
                </p>
                <Link to="/games/create">
                  <Button className="bg-gradient-primary hover:shadow-glow">
                    <Plus className="h-4 w-4 mr-2" />
                    {t("games:createFirstGame")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedGames.map((game: any, index: number) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-glow hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur-sm h-full flex flex-col">
                    <CardHeader className="flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="group-hover:text-primary transition-colors line-clamp-1">
                          {game.name}
                        </CardTitle>
                        <Badge
                          variant={
                            game.status === "waiting"
                              ? "secondary"
                              : game.status === "inProgress"
                              ? "destructive"
                              : "default"
                          }
                          className="whitespace-nowrap"
                        >
                          {getStatusText(game.status)}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-3 mb-4">
                        {game.description}
                      </CardDescription>
                      <div className="text-sm text-muted-foreground">
                        <p>
                          <strong>{t("games:dm")}:</strong> {game.dm}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>
                            {game.currentPlayers}/{game.maxPlayers}{" "}
                            {t("games:players")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{game.createdAt}</span>
                        </div>
                      </div>
                      <Link to={`/game/${game.id}/lobby`}>
                        <Button className="w-full" variant="outline">
                          {t("games:joinGame")}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Paginación */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="mt-8"
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Games;
