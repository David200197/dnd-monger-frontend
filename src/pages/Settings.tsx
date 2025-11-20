import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, User, Bell, Shield, Palette } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const Settings = () => {
  const { t } = useTranslation(["settings", "common", "ui"]); // Agregué 'ui' para las traducciones de auth
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 md:px-6 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("common:back")}
        </Button>
        <h1 className="text-4xl font-bold mb-8">{t("settings:title")}</h1>{" "}
        {/* Cambiado a settings: */}
        <div className="space-y-6">
          {/* Profile Settings */}
          <Card className="shadow-elegant border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("settings:profile")} {/* Cambiado a settings: */}
              </CardTitle>
              <CardDescription>{t("settings:profileDesc")}</CardDescription>{" "}
              {/* Cambiado a settings: */}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl">U</AvatarFallback>
                </Avatar>
                <Button variant="outline">{t("settings:changeAvatar")}</Button>{" "}
                {/* Cambiado a settings: */}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="username">{t("ui:auth.username")}</Label>
                <Input id="username" type="text" placeholder="Username" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("ui:auth.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                />
              </div>

              <Button className="bg-gradient-primary hover:shadow-glow">
                {t("settings:saveChanges")} {/* Cambiado a settings: */}
              </Button>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card className="shadow-elegant border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                {t("settings:appearance")} {/* Cambiado a settings: */}
              </CardTitle>
              <CardDescription>{t("settings:appearanceDesc")}</CardDescription>{" "}
              {/* Cambiado a settings: */}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t("common:language")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("settings:languageDesc")}
                  </p>{" "}
                  {/* Cambiado a settings: */}
                </div>
                <LanguageSwitcher />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="shadow-elegant border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t("settings:notifications")} {/* Cambiado a settings: */}
              </CardTitle>
              <CardDescription>
                {t("settings:notificationsDesc")}
              </CardDescription>{" "}
              {/* Cambiado a settings: */}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("settings:comingSoon")}
              </p>{" "}
              {/* Cambiado a settings: */}
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="shadow-elegant border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t("settings:security")} {/* Cambiado a settings: */}
              </CardTitle>
              <CardDescription>{t("settings:securityDesc")}</CardDescription>{" "}
              {/* Cambiado a settings: */}
            </CardHeader>
            <CardContent>
              <Button variant="outline">{t("settings:changePassword")}</Button>{" "}
              {/* Cambiado a settings: */}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
