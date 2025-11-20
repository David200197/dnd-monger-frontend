import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const createGameSchema = z.object({
  name: z
    .string()
    .min(3, "validation:gameNameMin")
    .max(50, "validation:gameNameMax"),
  description: z.string().max(500, "validation:descriptionMax").optional(),
  maxPlayers: z.number().min(1).max(10),
});

type CreateGameInput = z.infer<typeof createGameSchema>;

const CreateGame = () => {
  const { t } = useTranslation(["games", "common", "validation"]);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateGameInput>({
    resolver: zodResolver(createGameSchema),
    defaultValues: {
      maxPlayers: 4,
    },
  });

  const onSubmit = async (data: CreateGameInput) => {
    // TODO: Implement actual game creation logic with backend
    console.log("Create game data:", data);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 md:px-6 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("common:back")}
        </Button>

        <Card className="shadow-elegant border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">{t("games:createGame")}</CardTitle>{" "}
            {/* Cambiado */}
            <CardDescription>{t("games:createGameDesc")}</CardDescription>{" "}
            {/* Cambiado */}
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t("games:gameName")}</Label>{" "}
                {/* Cambiado */}
                <Input
                  id="name"
                  type="text"
                  placeholder={t("games:gameNamePlaceholder")}
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {t(errors.name.message as string)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t("games:description")}</Label>
                <Textarea
                  id="description"
                  placeholder={t("games:descriptionPlaceholder")}
                  rows={4}
                  {...register("description")}
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {t(errors.description.message as string)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxPlayers">{t("games:maxPlayers")}</Label>
                <Input
                  id="maxPlayers"
                  type="number"
                  min="1"
                  max="10"
                  {...register("maxPlayers", { valueAsNumber: true })}
                  className={errors.maxPlayers ? "border-destructive" : ""}
                />
                {errors.maxPlayers && (
                  <p className="text-sm text-destructive">
                    {t(errors.maxPlayers.message as string)}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:shadow-glow"
                disabled={isSubmitting}
              >
                {isSubmitting ? "..." : t("games:createGame")}
              </Button>
            </CardContent>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default CreateGame;
