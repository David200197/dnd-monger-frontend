import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, List, Users } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { t } = useTranslation(["dashboard", "common"]);

  const quickActions = [
    {
      title: t("dashboard:createGame"), // Usa 'dashboard:' en lugar de 'ui:'
      description: t("dashboard:createGameDesc"),
      icon: Plus,
      link: "/games/create",
      variant: "primary" as const,
    },
    {
      title: t("dashboard:joinGame"),
      description: t("dashboard:joinGameDesc"),
      icon: List,
      link: "/games",
      variant: "secondary" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              {t("dashboard:welcome")}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t("dashboard:subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={action.link}>
                    <Card className="group hover:shadow-glow hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur-sm cursor-pointer h-full">
                      <CardHeader>
                        <div className="mb-4 inline-flex p-3 rounded-lg bg-gradient-primary">
                          <Icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {action.title}
                        </CardTitle>
                        <CardDescription>{action.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t("dashboard:recentGames")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  {t("dashboard:noGames")}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
